// Jest設定ファイル
import '@testing-library/jest-dom'

// グローバルモックの設定
global.fetch = jest.fn()

// NextRequestのモック
global.Request = class MockRequest {
  constructor(input, init) {
    this.url = input
    this.method = init?.method || 'GET'
    this.headers = new Map(Object.entries(init?.headers || {}))
    this.body = init?.body
  }
  
  async json() {
    return JSON.parse(this.body || '{}')
  }
}

// NextResponseのモック
global.Response = class MockResponse {
  constructor(body, init) {
    this.body = body
    this.status = init?.status || 200
    this.statusText = init?.statusText || 'OK'
    this.headers = new Map(Object.entries(init?.headers || {}))
  }
  
  async json() {
    return JSON.parse(this.body || '{}')
  }
}

// 位置情報APIのモック
Object.defineProperty(navigator, 'geolocation', {
  value: {
    getCurrentPosition: jest.fn(),
    watchPosition: jest.fn(),
    clearWatch: jest.fn(),
  },
  writable: true,
})

// 環境変数のモック
process.env.NEXT_PUBLIC_DEFAULT_LATITUDE = '35.6762'
process.env.NEXT_PUBLIC_DEFAULT_LONGITUDE = '139.6503'
process.env.NEXT_PUBLIC_DEFAULT_RADIUS = '50'

// コンソールエラーを抑制（テスト中の不要なエラーを非表示）
const originalError = console.error
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is deprecated')
    ) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})
