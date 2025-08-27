import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { token, email, password_set } = await request.json()
    
    if (!token || !email || !password_set) {
      return NextResponse.json(
        { error: 'token、email、password_set は必須です' },
        { status: 400 }
      )
    }

    // トークンの検証
    const { data: invitation, error: fetchError } = await supabase
      .from('invitations')
      .select('*')
      .eq('token', token)
      .single()

    if (fetchError || !invitation) {
      return NextResponse.json(
        { error: '無効なトークンです' },
        { status: 404 }
      )
    }

    // 有効期限チェック
    const now = new Date()
    const expiresAt = new Date(invitation.expires_at)

    if (now > expiresAt) {
      return NextResponse.json(
        { error: 'トークンの有効期限が切れています' },
        { status: 409 }
      )
    }

    // 使用済みチェック
    if (invitation.used_at) {
      return NextResponse.json(
        { error: 'このトークンは既に使用されています' },
        { status: 409 }
      )
    }

    // 従業員情報の取得
    const { data: employee, error: employeeError } = await supabase
      .from('employees')
      .select('*')
      .eq('id', invitation.employee_id)
      .single()

    if (employeeError || !employee) {
      return NextResponse.json(
        { error: '従業員情報が見つかりません' },
        { status: 404 }
      )
    }

    // Supabase Authでユーザー作成
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: email,
      password: 'temporary_password', // 一時的なパスワード
      email_confirm: true,
      user_metadata: {
        employee_id: invitation.employee_id,
        store_id: employee.store_id,
      }
    })

    if (authError) {
      console.error('Authユーザー作成エラー:', authError)
      return NextResponse.json(
        { error: 'ユーザーアカウントの作成に失敗しました' },
        { status: 500 }
      )
    }

    // 従業員情報の更新（auth_user_idの設定）
    const { error: updateError } = await supabase
      .from('employees')
      .update({
        user_id: authData.user.id,
        email: email,
        status: 'ACTIVE',
      })
      .eq('id', invitation.employee_id)

    if (updateError) {
      console.error('従業員情報更新エラー:', updateError)
      return NextResponse.json(
        { error: '従業員情報の更新に失敗しました' },
        { status: 500 }
      )
    }

    // 招待トークンを使用済みにする
    const { error: tokenError } = await supabase
      .from('invitations')
      .update({
        used_at: new Date().toISOString(),
      })
      .eq('token', token)

    if (tokenError) {
      console.error('トークン更新エラー:', tokenError)
      // 警告はするが、成功レスポンスは返す
      console.warn('招待トークンの使用済み更新に失敗しました')
    }

    return NextResponse.json({
      success: true,
      message: 'アカウントの設定が完了しました',
      user_id: authData.user.id
    })

  } catch (error) {
    console.error('招待使用エラー:', error)
    return NextResponse.json(
      { error: '内部サーバーエラー' },
      { status: 500 }
    )
  }
}

