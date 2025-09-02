// AIシフト生成機能
// Google Gemini APIを使用して従業員の希望を考慮したシフトを自動生成

export interface EmployeePreference {
  id: string
  employeeId: string
  employeeName: string
  date: string
  status: 'available' | 'unavailable' | 'preferred'
  preferredStartTime?: string
  preferredEndTime?: string
  notes?: string
}

export interface PositionRequirement {
  id: string
  positionName: string
  minEmployees: number
  maxEmployees: number
  preferredStartTime: string
  preferredEndTime: string
  breakMinutes: number
}

export interface ShiftRule {
  maxConsecutiveDays: number
  minRestHours: number
  preferredShiftPattern: 'morning' | 'afternoon' | 'evening' | 'mixed'
  avoidOvertime: boolean
  balanceWorkload: boolean
  considerPreferences: boolean
  aiModel?: 'gemini-1.5-pro' | 'gemini-1.5-flash'
  temperature?: number
}

export interface GeneratedShift {
  id: string
  date: string
  employeeId: string
  employeeName: string
  positionId: string
  positionName: string
  startTime: string
  endTime: string
  breakMinutes: number
  confidence: number
  reasoning: string
}

interface ShiftSummary {
  totalShifts: number
  averageConfidence: number
  ruleCompliance: number
  preferenceSatisfaction: number
}

export interface AIGenerationResult {
  shifts: GeneratedShift[]
  summary: ShiftSummary
  warnings: string[]
  suggestions: string[]
}

// エラーの種類を定義
export enum AIErrorType {
  QUOTA_EXCEEDED = 'QUOTA_EXCEEDED',
  RATE_LIMIT = 'RATE_LIMIT',
  API_KEY_INVALID = 'API_KEY_INVALID',
  NETWORK_ERROR = 'NETWORK_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

export interface AIError {
  type: AIErrorType
  message: string
  retryAfter?: number // 秒単位
  details?: any
}

class AIShiftGenerator {
  private apiKey: string
  private baseUrl: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
    // 正しいGemini APIエンドポイント
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro'
  }

  /**
   * AIを使用してシフトを生成
   */
  async generateShifts(
    month: string,
    employeePreferences: EmployeePreference[],
    positionRequirements: PositionRequirement[],
    shiftRules: ShiftRule,
    existingShifts?: GeneratedShift[]
  ): Promise<AIGenerationResult> {
    try {
      console.log('AIシフト生成開始:', { month, employeePreferences, positionRequirements, shiftRules })
      
      // APIキーの検証
      if (!this.apiKey || this.apiKey === 'dummy-key') {
        throw this.createError(AIErrorType.API_KEY_INVALID, 'APIキーが設定されていません')
      }

      // Gemini APIに送信するプロンプトを構築
      const prompt = this.buildPrompt(
        month,
        employeePreferences,
        positionRequirements,
        shiftRules,
        existingShifts
      )

      console.log('生成されたプロンプト:', prompt)

      // Gemini APIを呼び出し
      const response = await this.callGeminiAPI(prompt, shiftRules)

      console.log('Gemini API レスポンス:', response)

      // レスポンスをパースしてシフトデータを抽出
      const shifts = this.parseGeminiResponse(response)

      // 結果を検証・最適化
      const validatedShifts = this.validateAndOptimizeShifts(
        shifts,
        employeePreferences,
        positionRequirements,
        shiftRules
      )

      // サマリー情報を生成
      const summary = this.generateSummary(validatedShifts, employeePreferences)
      const warnings = this.generateWarnings(validatedShifts, positionRequirements)
      const suggestions = this.generateSuggestions(validatedShifts, shiftRules)

      return {
        shifts: validatedShifts,
        summary,
        warnings,
        suggestions
      }
    } catch (error: any) {
      console.error('AIシフト生成エラー:', error)
      
      // エラーの種類を判定
      if (error.type === AIErrorType.QUOTA_EXCEEDED) {
        throw error
      } else if (error.type === AIErrorType.RATE_LIMIT) {
        throw error
      } else {
        throw this.createError(AIErrorType.UNKNOWN_ERROR, 'シフト生成に失敗しました。しばらく時間をおいて再試行してください。')
      }
    }
  }

  /**
   * エラーオブジェクトを作成
   */
  private createError(type: AIErrorType, message: string, details?: any): AIError {
    return {
      type,
      message,
      details
    }
  }

  /**
   * Gemini APIに送信するプロンプトを構築
   */
  private buildPrompt(
    month: string,
    employeePreferences: EmployeePreference[],
    positionRequirements: PositionRequirement[],
    shiftRules: ShiftRule,
    existingShifts?: GeneratedShift[]
  ): string {
    let prompt = `以下の条件に基づいて、${month}のシフト表を作成してください。

## 従業員の希望
${employeePreferences.map(pref => 
  `- ${pref.employeeName}: ${pref.date} - ${this.getStatusText(pref.status)}` +
  (pref.preferredStartTime ? ` (希望時間: ${pref.preferredStartTime}-${pref.preferredEndTime})` : '') +
  (pref.notes ? ` (備考: ${pref.notes})` : '')
).join('\n')}

## ポジション要件
${positionRequirements.map(req => 
  `- ${req.positionName}: 必要人数 ${req.minEmployees}-${req.maxEmployees}名, 推奨時間 ${req.preferredStartTime}-${req.preferredEndTime}, 休憩 ${req.breakMinutes}分`
).join('\n')}

## シフトルール
- 最大連続勤務日数: ${shiftRules.maxConsecutiveDays}日
- 最小休息時間: ${shiftRules.minRestHours}時間
- 推奨パターン: ${this.getPatternText(shiftRules.preferredShiftPattern)}
- 残業回避: ${shiftRules.avoidOvertime ? 'はい' : 'いいえ'}
- ワークロードバランス: ${shiftRules.balanceWorkload ? '考慮' : '考慮しない'}
- 従業員希望: ${shiftRules.considerPreferences ? '優先' : '参考程度'}

## 出力形式
以下のJSON形式で出力してください：
{
  "shifts": [
    {
      "date": "YYYY-MM-DD",
      "employeeName": "従業員名",
      "positionName": "ポジション名",
      "startTime": "HH:MM",
      "endTime": "HH:MM",
      "breakMinutes": 60,
      "confidence": 0.9,
      "reasoning": "このシフトを割り当てた理由"
    }
  ]
}`

    if (existingShifts && existingShifts.length > 0) {
      prompt += `\n\n## 既存シフト（変更不可）
${existingShifts.map(shift => 
  `- ${shift.date}: ${shift.employeeName} (${shift.positionName}) ${shift.startTime}-${shift.endTime}`
).join('\n')}`
    }

    return prompt
  }

  /**
   * Gemini APIを呼び出し（リトライ機能付き）
   */
  private async callGeminiAPI(prompt: string, shiftRules: ShiftRule): Promise<string> {
    const temperature = shiftRules.temperature || 0.7
    const maxRetries = 3
    const baseDelay = 1000 // 1秒

    console.log('Gemini API呼び出し開始:', {
      baseUrl: this.baseUrl,
      apiKeyLength: this.apiKey.length,
      temperature
    })

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const requestBody = {
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: temperature,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        }

        const url = `${this.baseUrl}:generateContent?key=${this.apiKey}`
        console.log(`リトライ ${attempt}/${maxRetries} - リクエストURL:`, url)
        console.log('リクエストボディ:', JSON.stringify(requestBody, null, 2))

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody)
        })

        console.log(`リトライ ${attempt}/${maxRetries} - レスポンスステータス:`, response.status, response.statusText)

        if (response.ok) {
          const data = await response.json()
          console.log('Gemini API 成功レスポンス:', data)
          return data.candidates[0]?.content?.parts[0]?.text || ''
        }

        // エラーレスポンスの詳細解析
        const errorText = await response.text()
        console.error('Gemini API エラーレスポンス:', errorText)

        // 429エラー（レート制限・クォータ制限）
        if (response.status === 429) {
          // クォータ制限エラーの場合は即座にエラーを投げる
          if (errorText.includes('RESOURCE_EXHAUSTED') || errorText.includes('quota')) {
            throw this.createError(
              AIErrorType.QUOTA_EXCEEDED,
              'Gemini APIの利用制限に達しました。手動でシフトを作成するか、しばらく時間をおいて再試行してください。',
              { errorText }
            )
          }

          // レート制限エラーの場合はリトライ
          const retryAfter = this.parseRetryAfter(errorText)
          const delay = retryAfter || (baseDelay * Math.pow(2, attempt - 1))
          
          console.log(`レート制限エラー (429)。${delay}ms待機してリトライ...`)
          
          if (attempt < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, delay))
            continue
          } else {
            const retrySeconds = retryAfter ? Math.ceil(retryAfter / 1000) : 60
            throw this.createError(
              AIErrorType.RATE_LIMIT, 
              `レート制限によりAPI呼び出しができません。${retrySeconds}秒後に再試行してください。`,
              { retryAfter }
            )
          }
        }

        // 400エラー（APIキー無効など）
        if (response.status === 400) {
          if (errorText.includes('API key') || errorText.includes('invalid')) {
            throw this.createError(
              AIErrorType.API_KEY_INVALID,
              'APIキーが無効です。設定を確認してください。'
            )
          }
        }

        // その他のエラー
        throw this.createError(
          AIErrorType.UNKNOWN_ERROR,
          `Gemini API エラー: ${response.status} ${response.statusText}`,
          { responseText: errorText }
        )

      } catch (error: any) {
        console.error(`リトライ ${attempt}/${maxRetries} でエラー:`, error)
        
        // 既にAIErrorの場合はそのまま投げる
        if (error.type) {
          throw error
        }
        
        if (attempt === maxRetries) {
          // ネットワークエラーの場合
          if (error.name === 'TypeError' || error.message.includes('fetch')) {
            throw this.createError(
              AIErrorType.NETWORK_ERROR,
              'ネットワークエラーが発生しました。インターネット接続を確認してください。'
            )
          }
          throw error
        }
        
        // ネットワークエラーの場合は待機してリトライ
        const delay = baseDelay * Math.pow(2, attempt - 1)
        console.log(`${delay}ms待機してリトライ...`)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }

    throw this.createError(
      AIErrorType.UNKNOWN_ERROR,
      '最大リトライ回数に達しました'
    )
  }

  /**
   * エラーレスポンスからリトライ待機時間を抽出
   */
  private parseRetryAfter(errorText: string): number | null {
    try {
      const data = JSON.parse(errorText)
      const retryInfo = data.error?.details?.find((d: any) => d['@type'] === 'type.googleapis.com/google.rpc.RetryInfo')
      if (retryInfo?.retryDelay) {
        // "13s" のような形式を秒数に変換
        const match = retryInfo.retryDelay.match(/(\d+)s/)
        if (match) {
          return parseInt(match[1]) * 1000 // ミリ秒に変換
        }
      }
    } catch (e) {
      console.warn('リトライ時間の解析に失敗:', e)
    }
    return null
  }

  /**
   * Gemini APIのレスポンスをパース
   */
  private parseGeminiResponse(response: string): GeneratedShift[] {
    try {
      console.log('レスポンスパース開始:', response)
      
      // JSON部分を抽出
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        console.error('JSONレスポンスが見つかりません:', response)
        throw new Error('JSONレスポンスが見つかりません')
      }

      const jsonString = jsonMatch[0]
      console.log('抽出されたJSON:', jsonString)

      const data = JSON.parse(jsonString)
      console.log('パースされたデータ:', data)

      const shifts: GeneratedShift[] = []

      if (data.shifts && Array.isArray(data.shifts)) {
        data.shifts.forEach((shift: GeneratedShift, index: number) => {
          shifts.push({
            id: `generated-${Date.now()}-${index}`,
            date: shift.date,
            employeeId: '', // 後で設定
            employeeName: shift.employeeName,
            positionId: '', // 後で設定
            positionName: shift.positionName,
            startTime: shift.startTime,
            endTime: shift.endTime,
            breakMinutes: shift.breakMinutes || 60,
            confidence: shift.confidence || 0.8,
            reasoning: shift.reasoning || 'AI生成'
          })
        })
      }

      console.log('生成されたシフト:', shifts)
      return shifts
    } catch (error) {
      console.error('レスポンスパースエラー:', error)
      throw new Error('AIの応答を解析できませんでした')
    }
  }

  /**
   * シフトを検証・最適化
   */
  private validateAndOptimizeShifts(
    shifts: GeneratedShift[],
    employeePreferences: EmployeePreference[],
    positionRequirements: PositionRequirement[],
    shiftRules: ShiftRule
  ): GeneratedShift[] {
    // 基本的な検証
    const validatedShifts = shifts.filter(shift => {
      // 必須フィールドのチェック
      if (!shift.date || !shift.employeeName || !shift.positionName) {
        return false
      }

      // 時間形式のチェック
      if (!this.isValidTime(shift.startTime) || !this.isValidTime(shift.endTime)) {
        return false
      }

      // 従業員の希望との整合性チェック
      const preference = employeePreferences.find(p => 
        p.employeeName === shift.employeeName && p.date === shift.date
      )
      if (preference && preference.status === 'unavailable') {
        return false
      }

      return true
    })

    // ルールに基づく最適化
    return this.optimizeShifts(validatedShifts, shiftRules)
  }

  /**
   * シフトを最適化
   */
  private optimizeShifts(shifts: GeneratedShift[], shiftRules: ShiftRule): GeneratedShift[] {
    // 連続勤務日数のチェック
    const optimizedShifts = shifts.map(shift => {
      let confidence = shift.confidence
      let reasoning = shift.reasoning

      // 連続勤務日数の警告
      const consecutiveDays = this.calculateConsecutiveDays(shifts, shift.employeeName)
      if (consecutiveDays > shiftRules.maxConsecutiveDays) {
        confidence *= 0.8
        reasoning += ` (連続勤務日数: ${consecutiveDays}日)`
      }

      // 休息時間のチェック
      const restHours = this.calculateRestHours(shifts, shift.employeeName, shift.date)
      if (restHours < shiftRules.minRestHours) {
        confidence *= 0.7
        reasoning += ` (休息時間不足: ${restHours}時間)`
      }

      return {
        ...shift,
        confidence: Math.max(0.1, confidence),
        reasoning
      }
    })

    return optimizedShifts
  }

  /**
   * サマリー情報を生成
   */
  private generateSummary(shifts: GeneratedShift[], preferences: EmployeePreference[]): ShiftSummary {
    const totalShifts = shifts.length
    const averageConfidence = shifts.reduce((sum, shift) => sum + shift.confidence, 0) / totalShifts

    // ルール準拠率の計算
    const ruleCompliance = this.calculateRuleCompliance(shifts)

    // 希望充足率の計算
    const preferenceSatisfaction = this.calculatePreferenceSatisfaction(shifts, preferences)

    return {
      totalShifts,
      averageConfidence: Math.round(averageConfidence * 100) / 100,
      ruleCompliance: Math.round(ruleCompliance * 100),
      preferenceSatisfaction: Math.round(preferenceSatisfaction * 100)
    }
  }

  /**
   * 警告を生成
   */
  private generateWarnings(shifts: GeneratedShift[], requirements: PositionRequirement[]): string[] {
    const warnings: string[] = []

    // ポジション別の人数チェック
    requirements.forEach(req => {
      const dailyShifts = shifts.filter(s => s.positionName === req.positionName)
      const dateGroups = this.groupByDate(dailyShifts)

      dateGroups.forEach((shiftsForDate, date) => {
        if (shiftsForDate.length < req.minEmployees) {
          warnings.push(`${date}: ${req.positionName}の人数が不足しています (必要: ${req.minEmployees}名, 現在: ${shiftsForDate.length}名)`)
        }
        if (shiftsForDate.length > req.maxEmployees) {
          warnings.push(`${date}: ${req.positionName}の人数が超過しています (最大: ${req.maxEmployees}名, 現在: ${shiftsForDate.length}名)`)
        }
      })
    })

    return warnings
  }

  /**
   * 提案を生成
   */
  private generateSuggestions(shifts: GeneratedShift[], rules: ShiftRule): string[] {
    const suggestions: string[] = []

    // 連続勤務の提案
    if (rules.maxConsecutiveDays < 7) {
      suggestions.push('連続勤務日数を調整して、より柔軟なシフト作成を検討してください')
    }

    // 休息時間の提案
    if (rules.minRestHours < 11) {
      suggestions.push('労働基準法に基づく休息時間の確保を検討してください')
    }

    return suggestions
  }

  // ヘルパー関数
  private getStatusText(status: string): string {
    switch (status) {
      case 'available': return '勤務可能'
      case 'unavailable': return '勤務不可'
      case 'preferred': return '希望時間あり'
      default: return '不明'
    }
  }

  private getPatternText(pattern: string): string {
    switch (pattern) {
      case 'morning': return '朝シフト重視'
      case 'afternoon': return '昼シフト重視'
      case 'evening': return '夜シフト重視'
      case 'mixed': return 'バランス重視'
      default: return '指定なし'
    }
  }

  private isValidTime(time: string): boolean {
    return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time)
  }

  private calculateConsecutiveDays(shifts: GeneratedShift[], employeeName: string): number {
    // 実装: 連続勤務日数の計算
    return 5 // 仮の実装
  }

  private calculateRestHours(shifts: GeneratedShift[], employeeName: string, date: string): number {
    // 実装: 休息時間の計算
    return 12 // 仮の実装
  }

  private calculateRuleCompliance(shifts: GeneratedShift[]): number {
    // 実装: ルール準拠率の計算
    return 0.85 // 仮の実装
  }

  private calculatePreferenceSatisfaction(shifts: GeneratedShift[], preferences: EmployeePreference[]): number {
    // 実装: 希望充足率の計算
    return 0.78 // 仮の実装
  }

  private groupByDate(shifts: GeneratedShift[]): Map<string, GeneratedShift[]> {
    const groups = new Map<string, GeneratedShift[]>()
    shifts.forEach(shift => {
      if (!groups.has(shift.date)) {
        groups.set(shift.date, [])
      }
      groups.get(shift.date)!.push(shift)
    })
    return groups
  }
}

// シングルトンインスタンス
let generatorInstance: AIShiftGenerator | null = null

export function getAIShiftGenerator(apiKey: string): AIShiftGenerator {
  if (!generatorInstance) {
    generatorInstance = new AIShiftGenerator(apiKey)
  }
  return generatorInstance
}

export function resetAIShiftGenerator(): void {
  generatorInstance = null
}

// エラータイプは既に上で定義・エクスポートされているため、ここでの重複エクスポートは不要
