'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'
import { 
  Activity, 
  Database, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Download,
  Upload,
  RefreshCw,
  Settings,
  BarChart3,
  Server,
  HardDrive,
  Network,
  Users,
  FileText,
  Zap,
  Eye,
  EyeOff,
  Play,
  Pause,
  Square
} from 'lucide-react'

interface SystemMetrics {
  cpuUsage: number
  memoryUsage: number
  diskUsage: number
  networkLatency: number
  activeUsers: number
  databaseConnections: number
  apiResponseTime: number
  errorRate: number
}

interface SystemLog {
  id: string
  timestamp: string
  level: 'info' | 'warning' | 'error' | 'critical'
  category: 'system' | 'security' | 'performance' | 'user' | 'database'
  message: string
  details?: string
  userId?: string
  ipAddress?: string
}

interface BackupStatus {
  id: string
  name: string
  type: 'full' | 'incremental' | 'differential'
  status: 'scheduled' | 'running' | 'completed' | 'failed'
  lastRun: string
  nextRun: string
  size: string
  retention: string
}

interface SecurityAlert {
  id: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  type: 'login_attempt' | 'permission_violation' | 'data_access' | 'system_change'
  message: string
  timestamp: string
  userId?: string
  ipAddress?: string
  resolved: boolean
}

export default function SystemDashboardPage() {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    cpuUsage: 0,
    memoryUsage: 0,
    diskUsage: 0,
    networkLatency: 0,
    activeUsers: 0,
    databaseConnections: 0,
    apiResponseTime: 0,
    errorRate: 0
  })
  const [logs, setLogs] = useState<SystemLog[]>([])
  const [backups, setBackups] = useState<BackupStatus[]>([])
  const [securityAlerts, setSecurityAlerts] = useState<SecurityAlert[]>([])
  const [activeTab, setActiveTab] = useState('overview')
  const [isMonitoring, setIsMonitoring] = useState(true)

  // モックデータ
  useEffect(() => {
    // システムメトリクス
    const updateMetrics = () => {
      setMetrics({
        cpuUsage: Math.random() * 100,
        memoryUsage: 60 + Math.random() * 30,
        diskUsage: 45 + Math.random() * 20,
        networkLatency: 5 + Math.random() * 15,
        activeUsers: Math.floor(Math.random() * 50) + 10,
        databaseConnections: Math.floor(Math.random() * 20) + 5,
        apiResponseTime: 100 + Math.random() * 200,
        errorRate: Math.random() * 2
      })
    }

    updateMetrics()
    const interval = setInterval(updateMetrics, 5000)

    // システムログ
    const mockLogs: SystemLog[] = [
      {
        id: '1',
        timestamp: new Date().toISOString(),
        level: 'info',
        category: 'system',
        message: 'システム起動完了',
        details: 'すべてのサービスが正常に起動しました'
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 60000).toISOString(),
        level: 'warning',
        category: 'performance',
        message: 'メモリ使用量が80%を超過',
        details: 'メモリ使用量: 82% (8.2GB/10GB)'
      },
      {
        id: '3',
        timestamp: new Date(Date.now() - 120000).toISOString(),
        level: 'error',
        category: 'database',
        message: 'データベース接続タイムアウト',
        details: '接続プールの接続数が上限に達しました'
      },
      {
        id: '4',
        timestamp: new Date(Date.now() - 180000).toISOString(),
        level: 'info',
        category: 'user',
        message: 'ユーザーログイン',
        details: 'ユーザーID: 12345, IP: 192.168.1.100'
      }
    ]
    setLogs(mockLogs)

    // バックアップ状況
    const mockBackups: BackupStatus[] = [
      {
        id: '1',
        name: '日次フルバックアップ',
        type: 'full',
        status: 'completed',
        lastRun: new Date(Date.now() - 86400000).toISOString(),
        nextRun: new Date(Date.now() + 86400000).toISOString(),
        size: '2.5GB',
        retention: '30日'
      },
      {
        id: '2',
        name: '時間別増分バックアップ',
        type: 'incremental',
        status: 'scheduled',
        lastRun: new Date(Date.now() - 3600000).toISOString(),
        nextRun: new Date(Date.now() + 3600000).toISOString(),
        size: '150MB',
        retention: '7日'
      }
    ]
    setBackups(mockBackups)

    // セキュリティアラート
    const mockAlerts: SecurityAlert[] = [
      {
        id: '1',
        severity: 'medium',
        type: 'login_attempt',
        message: '複数回のログイン失敗',
        timestamp: new Date(Date.now() - 300000).toISOString(),
        userId: 'unknown',
        ipAddress: '203.0.113.45',
        resolved: false
      },
      {
        id: '2',
        severity: 'low',
        type: 'data_access',
        message: '大量データアクセス',
        timestamp: new Date(Date.now() - 600000).toISOString(),
        userId: 'user123',
        ipAddress: '192.168.1.100',
        resolved: true
      }
    ]
    setSecurityAlerts(mockAlerts)

    return () => clearInterval(interval)
  }, [])

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'info':
        return <Badge variant="default" className="bg-blue-100 text-blue-800">情報</Badge>
      case 'warning':
        return <Badge variant="default" className="bg-yellow-100 text-yellow-800">警告</Badge>
      case 'error':
        return <Badge variant="destructive" className="bg-red-100 text-red-800">エラー</Badge>
      case 'critical':
        return <Badge variant="destructive">重大</Badge>
      default:
        return <Badge variant="outline">未設定</Badge>
    }
  }

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'system':
        return <Badge variant="default" className="bg-blue-100 text-blue-800">システム</Badge>
      case 'security':
        return <Badge variant="default" className="bg-red-100 text-red-800">セキュリティ</Badge>
      case 'performance':
        return <Badge variant="default" className="bg-yellow-100 text-yellow-800">パフォーマンス</Badge>
      case 'user':
        return <Badge variant="default" className="bg-green-100 text-green-800">ユーザー</Badge>
      case 'database':
        return <Badge variant="default" className="bg-purple-100 text-purple-800">データベース</Badge>
      default:
        return <Badge variant="outline">その他</Badge>
    }
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'low':
        return <Badge variant="secondary">低</Badge>
      case 'medium':
        return <Badge variant="default" className="bg-yellow-100 text-yellow-800">中</Badge>
      case 'high':
        return <Badge variant="destructive" className="bg-orange-100 text-orange-800">高</Badge>
      case 'critical':
        return <Badge variant="destructive">重大</Badge>
      default:
        return <Badge variant="outline">未設定</Badge>
    }
  }

  const getBackupStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge variant="secondary">予定</Badge>
      case 'running':
        return <Badge variant="default" className="bg-blue-100 text-blue-800">実行中</Badge>
      case 'completed':
        return <Badge variant="default" className="bg-green-100 text-green-800">完了</Badge>
      case 'failed':
        return <Badge variant="destructive">失敗</Badge>
      default:
        return <Badge variant="outline">未設定</Badge>
    }
  }

  const handleBackupAction = (action: string, backupId: string) => {
    toast.success(`${action}を実行しました`)
  }

  const handleSecurityAlertResolve = (alertId: string) => {
    setSecurityAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId 
          ? { ...alert, resolved: true }
          : alert
      )
    )
    toast.success('セキュリティアラートを解決済みにしました')
  }

  const handleExportLogs = () => {
    toast.success('ログをエクスポートしました')
  }

  const handleSystemRestart = () => {
    if (confirm('システムを再起動しますか？')) {
      toast.success('システム再起動を開始しました')
    }
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('ja-JP')
  }

  const getHealthStatus = () => {
    const { cpuUsage, memoryUsage, diskUsage, errorRate } = metrics
    
    if (cpuUsage > 90 || memoryUsage > 90 || diskUsage > 90 || errorRate > 5) {
      return { status: 'critical', color: 'text-red-600', bg: 'bg-red-50' }
    } else if (cpuUsage > 70 || memoryUsage > 70 || diskUsage > 70 || errorRate > 2) {
      return { status: 'warning', color: 'text-yellow-600', bg: 'bg-yellow-50' }
    } else {
      return { status: 'healthy', color: 'text-green-600', bg: 'bg-green-50' }
    }
  }

  const healthStatus = getHealthStatus()

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">システム管理ダッシュボード</h1>
          <p className="text-muted-foreground">システムの状態監視と管理を行います</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={isMonitoring ? "default" : "outline"}
            onClick={() => setIsMonitoring(!isMonitoring)}
          >
            {isMonitoring ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
            {isMonitoring ? '監視停止' : '監視開始'}
          </Button>
          <Button variant="outline" onClick={handleSystemRestart}>
            <RefreshCw className="h-4 w-4 mr-2" />
            システム再起動
          </Button>
        </div>
      </div>

      {/* システムヘルスステータス */}
      <Card className={healthStatus.bg}>
        <CardHeader>
          <CardTitle className={`flex items-center space-x-2 ${healthStatus.color}`}>
            <Activity className="h-5 w-5" />
            <span>システムヘルスステータス</span>
            <Badge variant={healthStatus.status === 'healthy' ? 'default' : 'destructive'}>
              {healthStatus.status === 'healthy' ? '正常' : 
               healthStatus.status === 'warning' ? '注意' : '危険'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {metrics.cpuUsage.toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">CPU使用率</div>
              <Progress value={metrics.cpuUsage} className="mt-2" />
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {metrics.memoryUsage.toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">メモリ使用率</div>
              <Progress value={metrics.memoryUsage} className="mt-2" />
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {metrics.diskUsage.toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">ディスク使用率</div>
              <Progress value={metrics.diskUsage} className="mt-2" />
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {metrics.errorRate.toFixed(2)}%
              </div>
              <div className="text-sm text-muted-foreground">エラー率</div>
              <Progress value={metrics.errorRate * 10} className="mt-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* メインコンテンツ */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>概要</span>
          </TabsTrigger>
          <TabsTrigger value="monitoring" className="flex items-center space-x-2">
            <Activity className="h-4 w-4" />
            <span>監視</span>
          </TabsTrigger>
          <TabsTrigger value="backup" className="flex items-center space-x-2">
            <Database className="h-4 w-4" />
            <span>バックアップ</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>セキュリティ</span>
          </TabsTrigger>
        </TabsList>

        {/* 概要タブ */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>アクティブユーザー</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {metrics.activeUsers}
                </div>
                <div className="text-xs text-muted-foreground">
                  現在オンライン
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center space-x-2">
                  <Server className="h-4 w-4" />
                  <span>DB接続数</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {metrics.databaseConnections}
                </div>
                <div className="text-xs text-muted-foreground">
                  アクティブ接続
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center space-x-2">
                  <Zap className="h-4 w-4" />
                  <span>API応答時間</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {metrics.apiResponseTime.toFixed(0)}ms
                </div>
                <div className="text-xs text-muted-foreground">
                  平均応答時間
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center space-x-2">
                  <Network className="h-4 w-4" />
                  <span>ネットワーク遅延</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {metrics.networkLatency.toFixed(1)}ms
                </div>
                <div className="text-xs text-muted-foreground">
                  平均遅延
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 最近のログ */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>最近のシステムログ</span>
                <Button variant="outline" size="sm" onClick={handleExportLogs}>
                  <Download className="h-4 w-4 mr-2" />
                  エクスポート
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {logs.slice(0, 5).map((log) => (
                  <div key={log.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                    {getLevelBadge(log.level)}
                    {getCategoryBadge(log.category)}
                    <div className="flex-1">
                      <p className="text-sm font-medium">{log.message}</p>
                      {log.details && (
                        <p className="text-xs text-muted-foreground">{log.details}</p>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatTimestamp(log.timestamp)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 監視タブ */}
        <TabsContent value="monitoring" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>リアルタイム監視</CardTitle>
              <CardDescription>
                システムリソースの使用状況をリアルタイムで監視
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* CPU使用率 */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">CPU使用率</span>
                    <span className="text-sm text-muted-foreground">
                      {metrics.cpuUsage.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={metrics.cpuUsage} className="h-3" />
                </div>

                {/* メモリ使用率 */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">メモリ使用率</span>
                    <span className="text-sm text-muted-foreground">
                      {metrics.memoryUsage.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={metrics.memoryUsage} className="h-3" />
                </div>

                {/* ディスク使用率 */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">ディスク使用率</span>
                    <span className="text-sm text-muted-foreground">
                      {metrics.diskUsage.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={metrics.diskUsage} className="h-3" />
                </div>

                {/* エラー率 */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">エラー率</span>
                    <span className="text-sm text-muted-foreground">
                      {metrics.errorRate.toFixed(2)}%
                    </span>
                  </div>
                  <Progress value={metrics.errorRate * 10} className="h-3" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* バックアップタブ */}
        <TabsContent value="backup" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>バックアップ状況</CardTitle>
              <CardDescription>
                データベースとファイルのバックアップ状況を管理
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {backups.map((backup) => (
                  <div key={backup.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-medium">{backup.name}</h3>
                        {getBackupStatusBadge(backup.status)}
                        <Badge variant="outline">{backup.type}</Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                        <div>
                          <span>最終実行:</span>
                          <span className="ml-2">{formatTimestamp(backup.lastRun)}</span>
                        </div>
                        <div>
                          <span>次回実行:</span>
                          <span className="ml-2">{formatTimestamp(backup.nextRun)}</span>
                        </div>
                        <div>
                          <span>サイズ:</span>
                          <span className="ml-2">{backup.size}</span>
                        </div>
                        <div>
                          <span>保持期間:</span>
                          <span className="ml-2">{backup.retention}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleBackupAction('手動実行', backup.id)}
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                                                   <Button
                               variant="outline"
                               size="sm"
                               onClick={() => handleBackupAction('停止', backup.id)}
                             >
                               <Square className="h-4 w-4" />
                             </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* セキュリティタブ */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>セキュリティアラート</CardTitle>
              <CardDescription>
                セキュリティ関連の警告とアラートを管理
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {securityAlerts.map((alert) => (
                  <div key={alert.id} className={`flex items-center justify-between p-4 border rounded-lg ${alert.resolved ? 'bg-gray-50' : ''}`}>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        {getSeverityBadge(alert.severity)}
                        <Badge variant="outline">{alert.type}</Badge>
                        {alert.resolved && (
                          <Badge variant="default" className="bg-green-100 text-green-800">解決済み</Badge>
                        )}
                      </div>
                      <p className="font-medium mb-2">{alert.message}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                        <div>
                          <span>時刻:</span>
                          <span className="ml-2">{formatTimestamp(alert.timestamp)}</span>
                        </div>
                        {alert.userId && (
                          <div>
                            <span>ユーザー:</span>
                            <span className="ml-2">{alert.userId}</span>
                          </div>
                        )}
                        {alert.ipAddress && (
                          <div>
                            <span>IPアドレス:</span>
                            <span className="ml-2">{alert.ipAddress}</span>
                          </div>
                        )}
                        <div>
                          <span>ステータス:</span>
                          <span className="ml-2">{alert.resolved ? '解決済み' : '未解決'}</span>
                        </div>
                      </div>
                    </div>
                    {!alert.resolved && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSecurityAlertResolve(alert.id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        解決済み
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
