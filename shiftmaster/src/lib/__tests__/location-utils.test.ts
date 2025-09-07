// 位置情報ユーティリティのテスト
import { describe, it, expect } from '@jest/globals'

// 距離計算関数（ハーバサイン公式）
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371e3 // 地球の半径（メートル）
  const φ1 = lat1 * Math.PI / 180
  const φ2 = lat2 * Math.PI / 180
  const Δφ = (lat2 - lat1) * Math.PI / 180
  const Δλ = (lng2 - lng1) * Math.PI / 180

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))

  return R * c
}

// 位置情報検証関数
function isWithinRadius(
  userLat: number, 
  userLng: number, 
  storeLat: number, 
  storeLng: number, 
  radiusMeters: number
): boolean {
  const distance = calculateDistance(userLat, userLng, storeLat, storeLng)
  return distance <= radiusMeters
}

describe('位置情報ユーティリティ', () => {
  describe('calculateDistance', () => {
    it('同じ座標の距離は0になる', () => {
      const lat = 35.6762
      const lng = 139.6503
      const distance = calculateDistance(lat, lng, lat, lng)
      expect(distance).toBeCloseTo(0, 1)
    })

    it('東京駅から新宿駅までの距離が正確', () => {
      // 東京駅
      const tokyoStation = { lat: 35.6812, lng: 139.7671 }
      // 新宿駅
      const shinjukuStation = { lat: 35.6896, lng: 139.6917 }
      
      const distance = calculateDistance(
        tokyoStation.lat, 
        tokyoStation.lng, 
        shinjukuStation.lat, 
        shinjukuStation.lng
      )
      
      // 実際の距離は約6.87km（計算結果: 6873.59）
      expect(distance).toBeCloseTo(6873.59, 0.5)
    })

    it('極端に離れた座標でも正しく計算される', () => {
      // 北極と南極
      const northPole = { lat: 90, lng: 0 }
      const southPole = { lat: -90, lng: 0 }
      
      const distance = calculateDistance(
        northPole.lat, 
        northPole.lng, 
        southPole.lat, 
        southPole.lng
      )
      
      // 地球の半周の距離（約20,015km、計算結果: 20015086.8）
      expect(distance).toBeCloseTo(20015086.8, 0.5)
    })
  })

  describe('isWithinRadius', () => {
    const storeLocation = { lat: 35.6762, lng: 139.6503 }
    const radius = 50 // 50メートル

    it('店舗と同じ位置は範囲内', () => {
      const result = isWithinRadius(
        storeLocation.lat, 
        storeLocation.lng, 
        storeLocation.lat, 
        storeLocation.lng, 
        radius
      )
      expect(result).toBe(true)
    })

    it('店舗から30m離れた位置は範囲内', () => {
      // 30m北に移動（緯度を少し上げる）
      const userLat = storeLocation.lat + (30 / 111000) // 約30m
      const userLng = storeLocation.lng
      
      const result = isWithinRadius(userLat, userLng, storeLocation.lat, storeLocation.lng, radius)
      expect(result).toBe(true)
    })

    it('店舗から100m離れた位置は範囲外', () => {
      // 100m北に移動
      const userLat = storeLocation.lat + (100 / 111000) // 約100m
      const userLng = storeLocation.lng
      
      const result = isWithinRadius(userLat, userLng, storeLocation.lat, storeLocation.lng, radius)
      expect(result).toBe(false)
    })

    it('境界値（50m）は範囲内', () => {
      // 50m北に移動（より正確な計算）
      const userLat = storeLocation.lat + (50 / 111320) // より正確な緯度1度あたりのメートル数
      const userLng = storeLocation.lng
      
      const result = isWithinRadius(userLat, userLng, storeLocation.lat, storeLocation.lng, radius)
      expect(result).toBe(true)
    })
  })
})
