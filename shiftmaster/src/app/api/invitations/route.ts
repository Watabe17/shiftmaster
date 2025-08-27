import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { v4 as uuidv4 } from 'uuid'

// 招待トークン生成
export async function POST(request: NextRequest) {
  try {
    const { employee_id, email, expires_at } = await request.json()
    
    if (!employee_id || !expires_at) {
      return NextResponse.json(
        { error: 'employee_id と expires_at は必須です' },
        { status: 400 }
      )
    }

    const token = uuidv4()
    const expiresAt = new Date(expires_at)

    // invitationsテーブルに保存
    const { error } = await supabase
      .from('invitations')
      .insert({
        token,
        employee_id,
        email,
        expires_at: expiresAt.toISOString(),
      })

    if (error) {
      console.error('招待トークン作成エラー:', error)
      return NextResponse.json(
        { error: '招待トークンの作成に失敗しました' },
        { status: 500 }
      )
    }

    // アクションリンクとQRコード生成（簡易版）
    const actionLink = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/onboard?token=${token}`
    
    return NextResponse.json({
      token,
      action_link: actionLink,
      expires_at: expiresAt.toISOString(),
      message: '招待トークンが正常に作成されました'
    })

  } catch (error) {
    console.error('招待作成エラー:', error)
    return NextResponse.json(
      { error: '内部サーバーエラー' },
      { status: 500 }
    )
  }
}

// 招待トークン検証
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { error: 'トークンが指定されていません' },
        { status: 400 }
      )
    }

    // トークンの検証
    const { data: invitation, error } = await supabase
      .from('invitations')
      .select(`
        *,
        employees!inner(
          id,
          full_name,
          employee_code,
          stores!inner(
            id,
            name
          )
        )
      `)
      .eq('token', token)
      .single()

    if (error || !invitation) {
      return NextResponse.json(
        { error: '無効なトークンです' },
        { status: 404 }
      )
    }

    const now = new Date()
    const expiresAt = new Date(invitation.expires_at)

    if (now > expiresAt) {
      return NextResponse.json({
        status: 'expired',
        message: 'トークンの有効期限が切れています'
      })
    }

    if (invitation.used_at) {
      return NextResponse.json({
        status: 'used',
        message: 'このトークンは既に使用されています'
      })
    }

    return NextResponse.json({
      status: 'valid',
      employee_name: invitation.employees.full_name,
      employee_code: invitation.employees.employee_code,
      store_name: invitation.employees.stores.name,
      email: invitation.email
    })

  } catch (error) {
    console.error('トークン検証エラー:', error)
    return NextResponse.json(
      { error: '内部サーバーエラー' },
      { status: 500 }
    )
  }
}

