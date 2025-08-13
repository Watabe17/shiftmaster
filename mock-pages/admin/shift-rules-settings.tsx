import React, { useState } from 'react';
import {
  Settings, Calendar, ChevronLeft, Menu, LogOut, Home, Users, Clock,
  Save, Plus, X, Edit2, Copy, AlertCircle, CheckCircle, Trash2,
  Sliders, Timer, ChevronRight, Database, ArrowLeft, FileUp,
  Download, Info, Sun, Moon, CloudSun, Check
} from 'lucide-react';

const ShiftRulesSettingsPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState('shift');
  const [selectedRuleSet, setSelectedRuleSet] = useState('normal');
  const [selectedPosition, setSelectedPosition] = useState('all');
  const [saveStatus, setSaveStatus] = useState('');
  const [activeTab, setActiveTab] = useState('requirements');
  const [showImportModal, setShowImportModal] = useState(false);
  const [editingRuleSet, setEditingRuleSet] = useState(null);
  const [showNewRuleModal, setShowNewRuleModal] = useState(false);

  const [ruleSets, setRuleSets] = useState([
    {
      id: 'normal',
      name: '通常期',
      description: '標準的な人員配置',
      color: 'blue',
      isDefault: true,
      createdAt: '2024-12-01',
      lastModified: '2025-01-15'
    },
    {
      id: 'busy',
      name: '繁忙期',
      description: '年末年始・GW・お盆の増員体制',
      color: 'orange',
      isDefault: false,
      createdAt: '2024-12-15',
      lastModified: '2024-12-20'
    },
    {
      id: 'slow',
      name: '閑散期',
      description: '2月・6月の少人数体制',
      color: 'green',
      isDefault: false,
      createdAt: '2024-11-01',
      lastModified: '2024-11-15'
    }
  ]);

  const [shiftPatterns, setShiftPatterns] = useState({
    enabled: true,
    patterns: [
      { id: 'early', name: '早番', icon: Sun, start: '07:00', end: '15:00', color: 'yellow' },
      { id: 'middle', name: '中番', icon: CloudSun, start: '11:00', end: '19:00', color: 'blue' },
      { id: 'late', name: '遅番', icon: Moon, start: '14:00', end: '22:00', color: 'purple' }
    ]
  });

  const [currentRuleData, setCurrentRuleData] = useState({
    normal: {
      all: {
        requirements: {
          weekday: [
            { time: '09:00', count: { kitchen: 1, hall: 2, cashier: 1 } },
            { time: '10:00', count: { kitchen: 1, hall: 2, cashier: 1 } },
            { time: '11:00', count: { kitchen: 2, hall: 2, cashier: 1 } },
            { time: '12:00', count: { kitchen: 3, hall: 3, cashier: 2 } },
            { time: '13:00', count: { kitchen: 3, hall: 3, cashier: 2 } },
            { time: '14:00', count: { kitchen: 2, hall: 2, cashier: 1 } },
            { time: '15:00', count: { kitchen: 2, hall: 2, cashier: 1 } },
            { time: '16:00', count: { kitchen: 2, hall: 2, cashier: 1 } },
            { time: '17:00', count: { kitchen: 2, hall: 3, cashier: 1 } },
            { time: '18:00', count: { kitchen: 3, hall: 4, cashier: 2 } },
            { time: '19:00', count: { kitchen: 3, hall: 4, cashier: 2 } },
            { time: '20:00', count: { kitchen: 2, hall: 3, cashier: 1 } },
            { time: '21:00', count: { kitchen: 1, hall: 2, cashier: 1 } }
          ],
          weekend: [
            { time: '09:00', count: { kitchen: 2, hall: 3, cashier: 1 } },
            { time: '10:00', count: { kitchen: 2, hall: 3, cashier: 1 } },
            { time: '11:00', count: { kitchen: 3, hall: 4, cashier: 2 } },
            { time: '12:00', count: { kitchen: 4, hall: 5, cashier: 2 } },
            { time: '13:00', count: { kitchen: 4, hall: 5, cashier: 2 } },
            { time: '14:00', count: { kitchen: 3, hall: 4, cashier: 2 } },
            { time: '15:00', count: { kitchen: 3, hall: 4, cashier: 2 } },
            { time: '16:00', count: { kitchen: 3, hall: 4, cashier: 2 } },
            { time: '17:00', count: { kitchen: 3, hall: 4, cashier: 2 } },
            { time: '18:00', count: { kitchen: 4, hall: 5, cashier: 2 } },
            { time: '19:00', count: { kitchen: 4, hall: 5, cashier: 2 } },
            { time: '20:00', count: { kitchen: 3, hall: 4, cashier: 2 } },
            { time: '21:00', count: { kitchen: 2, hall: 3, cashier: 1 } }
          ]
        },
        rules: [
          { id: 1, rule: '新人スタッフは必ずベテランと組む', active: true },
          { id: 2, rule: '連続勤務は5日まで', active: true },
          { id: 3, rule: '週の労働時間は40時間以内', active: true },
          { id: 4, rule: '佐藤太郎は火曜日の午前中は避ける（通院のため）', active: true },
          { id: 5, rule: '鈴木花子と田中一郎は同じシフトに入れる（研修中）', active: true }
        ]
      }
    },
    busy: {
      all: {
        requirements: {
          weekday: [
            { time: '09:00', count: { kitchen: 2, hall: 3, cashier: 2 } },
            { time: '10:00', count: { kitchen: 2, hall: 3, cashier: 2 } },
            { time: '11:00', count: { kitchen: 3, hall: 3, cashier: 2 } },
            { time: '12:00', count: { kitchen: 4, hall: 4, cashier: 3 } },
            { time: '13:00', count: { kitchen: 4, hall: 4, cashier: 3 } },
            { time: '14:00', count: { kitchen: 3, hall: 3, cashier: 2 } },
            { time: '15:00', count: { kitchen: 3, hall: 3, cashier: 2 } },
            { time: '16:00', count: { kitchen: 3, hall: 3, cashier: 2 } },
            { time: '17:00', count: { kitchen: 3, hall: 4, cashier: 2 } },
            { time: '18:00', count: { kitchen: 4, hall: 5, cashier: 3 } },
            { time: '19:00', count: { kitchen: 4, hall: 5, cashier: 3 } },
            { time: '20:00', count: { kitchen: 3, hall: 4, cashier: 2 } },
            { time: '21:00', count: { kitchen: 2, hall: 3, cashier: 2 } }
          ],
          weekend: [
            { time: '09:00', count: { kitchen: 3, hall: 4, cashier: 2 } },
            { time: '10:00', count: { kitchen: 3, hall: 4, cashier: 2 } },
            { time: '11:00', count: { kitchen: 4, hall: 5, cashier: 3 } },
            { time: '12:00', count: { kitchen: 5, hall: 6, cashier: 3 } },
            { time: '13:00', count: { kitchen: 5, hall: 6, cashier: 3 } },
            { time: '14:00', count: { kitchen: 4, hall: 5, cashier: 3 } },
            { time: '15:00', count: { kitchen: 4, hall: 5, cashier: 3 } },
            { time: '16:00', count: { kitchen: 4, hall: 5, cashier: 3 } },
            { time: '17:00', count: { kitchen: 4, hall: 5, cashier: 3 } },
            { time: '18:00', count: { kitchen: 5, hall: 6, cashier: 3 } },
            { time: '19:00', count: { kitchen: 5, hall: 6, cashier: 3 } },
            { time: '20:00', count: { kitchen: 4, hall: 5, cashier: 3 } },
            { time: '21:00', count: { kitchen: 3, hall: 4, cashier: 2 } }
          ]
        },
        rules: [
          { id: 1, rule: '全日程でベテランスタッフを最低2名配置', active: true },
          { id: 2, rule: '繁忙時間帯（12-14時、18-20時）は余裕を持った配置', active: true },
          { id: 3, rule: '連続勤務は4日まで（疲労防止）', active: true }
        ]
      }
    },
    slow: {
      all: {
        requirements: {
          weekday: [
            { time: '09:00', count: { kitchen: 1, hall: 1, cashier: 1 } },
            { time: '10:00', count: { kitchen: 1, hall: 1, cashier: 1 } },
            { time: '11:00', count: { kitchen: 1, hall: 1, cashier: 1 } },
            { time: '12:00', count: { kitchen: 2, hall: 2, cashier: 1 } },
            { time: '13:00', count: { kitchen: 2, hall: 2, cashier: 1 } },
            { time: '14:00', count: { kitchen: 1, hall: 1, cashier: 1 } },
            { time: '15:00', count: { kitchen: 1, hall: 1, cashier: 1 } },
            { time: '16:00', count: { kitchen: 1, hall: 1, cashier: 1 } },
            { time: '17:00', count: { kitchen: 1, hall: 2, cashier: 1 } },
            { time: '18:00', count: { kitchen: 2, hall: 3, cashier: 2 } },
            { time: '19:00', count: { kitchen: 2, hall: 3, cashier: 2 } },
            { time: '20:00', count: { kitchen: 1, hall: 2, cashier: 1 } },
            { time: '21:00', count: { kitchen: 1, hall: 1, cashier: 1 } }
          ],
          weekend: [
            { time: '09:00', count: { kitchen: 1, hall: 2, cashier: 1 } },
            { time: '10:00', count: { kitchen: 1, hall: 2, cashier: 1 } },
            { time: '11:00', count: { kitchen: 2, hall: 3, cashier: 1 } },
            { time: '12:00', count: { kitchen: 3, hall: 4, cashier: 2 } },
            { time: '13:00', count: { kitchen: 3, hall: 4, cashier: 2 } },
            { time: '14:00', count: { kitchen: 2, hall: 3, cashier: 1 } },
            { time: '15:00', count: { kitchen: 2, hall: 3, cashier: 1 } },
            { time: '16:00', count: { kitchen: 2, hall: 3, cashier: 1 } },
            { time: '17:00', count: { kitchen: 2, hall: 3, cashier: 1 } },
            { time: '18:00', count: { kitchen: 3, hall: 4, cashier: 2 } },
            { time: '19:00', count: { kitchen: 3, hall: 4, cashier: 2 } },
            { time: '20:00', count: { kitchen: 2, hall: 3, cashier: 1 } },
            { time: '21:00', count: { kitchen: 1, hall: 2, cashier: 1 } }
          ]
        },
        rules: [
          { id: 1, rule: '複数ポジション対応者を積極的に活用', active: true },
          { id: 2, rule: '最小限の人員で効率的に運営', active: true }
        ]
      }
    }
  });

  const positions = [
    { id: 'kitchen', name: 'キッチン', color: 'orange' },
    { id: 'hall', name: 'ホール', color: 'blue' },
    { id: 'cashier', name: 'レジ', color: 'green' }
  ];

  const menuItems = [
    { id: 'home', label: 'ホーム', icon: Home },
    { id: 'shift', label: 'シフト作成', icon: Calendar },
    { id: 'employees', label: '従業員管理', icon: Users },
    { id: 'attendance', label: '勤怠管理', icon: Clock },
    { id: 'settings', label: '設定', icon: Settings }
  ];

  const handleSave = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(''), 3000);
    }, 1000);
  };

  const handleAddRule = () => {
    const rules = currentRuleData[selectedRuleSet].all.rules;
    const newRule = {
      id: Math.max(...rules.map(r => r.id)) + 1,
      rule: '',
      active: true
    };
    setCurrentRuleData({
      ...currentRuleData,
      [selectedRuleSet]: {
        ...currentRuleData[selectedRuleSet],
        all: {
          ...currentRuleData[selectedRuleSet].all,
          rules: [...rules, newRule]
        }
      }
    });
  };

  const handleDeleteRule = (ruleId) => {
    setCurrentRuleData({
      ...currentRuleData,
      [selectedRuleSet]: {
        ...currentRuleData[selectedRuleSet],
        all: {
          ...currentRuleData[selectedRuleSet].all,
          rules: currentRuleData[selectedRuleSet].all.rules.filter(r => r.id !== ruleId)
        }
      }
    });
  };

  const handleUpdateRequirement = (dayType, timeIndex, position, value) => {
    const updatedData = { ...currentRuleData };
    updatedData[selectedRuleSet].all.requirements[dayType][timeIndex].count[position] = parseInt(value) || 0;
    setCurrentRuleData(updatedData);
  };

  const handleCreateNewRuleSet = (name, description, color) => {
    const newId = `rule_${Date.now()}`;
    const newRuleSet = {
      id: newId,
      name,
      description,
      color,
      isDefault: false,
      createdAt: new Date().toISOString().split('T')[0],
      lastModified: new Date().toISOString().split('T')[0]
    };
    
    setRuleSets([...ruleSets, newRuleSet]);
    
    // 通常期のデータをコピーして新規作成
    setCurrentRuleData({
      ...currentRuleData,
      [newId]: JSON.parse(JSON.stringify(currentRuleData.normal))
    });
    
    setSelectedRuleSet(newId);
    setShowNewRuleModal(false);
  };

  const handleUpdateRuleSet = (id, name, description) => {
    setRuleSets(ruleSets.map(r => 
      r.id === id 
        ? { ...r, name, description, lastModified: new Date().toISOString().split('T')[0] }
        : r
    ));
    setEditingRuleSet(null);
  };

  const handleDuplicateRuleSet = () => {
    const original = ruleSets.find(r => r.id === selectedRuleSet);
    setShowNewRuleModal(true);
  };

  const handleDeleteRuleSet = (id) => {
    if (ruleSets.find(r => r.id === id)?.isDefault) {
      alert('デフォルトのルールセットは削除できません');
      return;
    }
    setRuleSets(ruleSets.filter(r => r.id !== id));
    const { [id]: deleted, ...rest } = currentRuleData;
    setCurrentRuleData(rest);
    setSelectedRuleSet('normal');
  };

  const handleImportFile = (event) => {
    const file = event.target.files[0];
    if (file) {
      alert(`ファイル「${file.name}」を読み込みました`);
      setShowImportModal(false);
    }
  };

  const handleAddShiftPattern = () => {
    const newPattern = {
      id: `pattern_${Date.now()}`,
      name: '新規パターン',
      icon: Sun,
      start: '09:00',
      end: '17:00',
      color: 'gray'
    };
    setShiftPatterns({
      ...shiftPatterns,
      patterns: [...shiftPatterns.patterns, newPattern]
    });
  };

  const handleDeleteShiftPattern = (id) => {
    setShiftPatterns({
      ...shiftPatterns,
      patterns: shiftPatterns.patterns.filter(p => p.id !== id)
    });
  };

  // 新規作成モーダル
  const NewRuleModal = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [color, setColor] = useState('blue');
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-96">
          <h3 className="text-lg font-bold text-gray-900 mb-4">新規ルールセット作成</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ルールセット名
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
                placeholder="例：繁忙期、閑散期など"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                説明
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
                placeholder="例：年末年始の増員体制"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                カラー
              </label>
              <div className="flex gap-2">
                {['blue', 'orange', 'green', 'purple', 'red'].map(c => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={`w-10 h-10 rounded-lg border-2 ${
                      color === c ? 'border-gray-900' : 'border-gray-200'
                    } ${
                      c === 'blue' ? 'bg-blue-100' :
                      c === 'orange' ? 'bg-orange-100' :
                      c === 'green' ? 'bg-green-100' :
                      c === 'purple' ? 'bg-purple-100' :
                      'bg-red-100'
                    }`}
                  >
                    {color === c && <Check className="w-6 h-6 mx-auto" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => setShowNewRuleModal(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              キャンセル
            </button>
            <button
              onClick={() => handleCreateNewRuleSet(name, description, color)}
              disabled={!name || !description}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
            >
              作成
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col shadow-sm`}>
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-3 ${!sidebarOpen && 'justify-center'}`}>
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-sm">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              {sidebarOpen && (
                <div>
                  <span className="font-bold text-lg text-gray-900">ShiftMaster</span>
                  <p className="text-xs text-gray-500">シフト管理システム</p>
                </div>
              )}
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {sidebarOpen ? <ChevronLeft className="w-4 h-4 text-gray-600" /> : <Menu className="w-4 h-4 text-gray-600" />}
            </button>
          </div>
        </div>

        <nav className="flex-1 p-3">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveMenu(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm ${
                      activeMenu === item.id
                        ? 'bg-orange-50 text-orange-600 font-medium border border-orange-200'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    } ${!sidebarOpen && 'justify-center'}`}
                  >
                    <Icon className="w-5 h-5" />
                    {sidebarOpen && <span>{item.label}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-3 border-t border-gray-200">
          <button className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-all duration-200 ${!sidebarOpen && 'justify-center'}`}>
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span>ログアウト</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto bg-gray-50">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
          <div className="px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => window.location.href = '/shift-create'}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">シフトルール設定</h1>
                  <p className="text-sm text-gray-600 mt-1">複数のルールセットを管理</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleDuplicateRuleSet}
                  className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-1 text-sm"
                  title="現在選択中のルールセットを複製"
                >
                  <Copy className="w-4 h-4" />
                  このルールセットを複製
                </button>
                <button
                  onClick={handleSave}
                  disabled={saveStatus === 'saving'}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors shadow-sm font-medium text-sm flex items-center gap-2 disabled:opacity-50"
                >
                  {saveStatus === 'saving' ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      保存中...
                    </>
                  ) : saveStatus === 'saved' ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      保存しました
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      変更を保存
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="p-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">ルールセット</h2>
              <button 
                onClick={() => setShowNewRuleModal(true)}
                className="text-sm text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                新規作成
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              {ruleSets.map(ruleSet => (
                <div
                  key={ruleSet.id}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all relative ${
                    selectedRuleSet === ruleSet.id
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-orange-300'
                  }`}
                  onClick={() => setSelectedRuleSet(ruleSet.id)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className={`p-2 rounded-lg ${
                      ruleSet.color === 'blue' ? 'bg-blue-100' :
                      ruleSet.color === 'orange' ? 'bg-orange-100' :
                      ruleSet.color === 'green' ? 'bg-green-100' :
                      ruleSet.color === 'purple' ? 'bg-purple-100' :
                      'bg-red-100'
                    }`}>
                      <Sliders className={`w-4 h-4 ${
                        ruleSet.color === 'blue' ? 'text-blue-600' :
                        ruleSet.color === 'orange' ? 'text-orange-600' :
                        ruleSet.color === 'green' ? 'text-green-600' :
                        ruleSet.color === 'purple' ? 'text-purple-600' :
                        'text-red-600'
                      }`} />
                    </div>
                    <div className="flex items-center gap-1">
                      {ruleSet.isDefault && (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                          既定
                        </span>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingRuleSet(ruleSet.id);
                        }}
                        className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      {!ruleSet.isDefault && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteRuleSet(ruleSet.id);
                          }}
                          className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {editingRuleSet === ruleSet.id ? (
                    <div onClick={(e) => e.stopPropagation()}>
                      <input
                        type="text"
                        value={ruleSet.name}
                        onChange={(e) => {
                          const newName = e.target.value;
                          setRuleSets(ruleSets.map(r => 
                            r.id === ruleSet.id ? { ...r, name: newName } : r
                          ));
                        }}
                        className="w-full px-2 py-1 mb-1 border border-gray-300 rounded text-sm"
                        placeholder="ルールセット名"
                      />
                      <input
                        type="text"
                        value={ruleSet.description}
                        onChange={(e) => {
                          const newDesc = e.target.value;
                          setRuleSets(ruleSets.map(r => 
                            r.id === ruleSet.id ? { ...r, description: newDesc } : r
                          ));
                        }}
                        className="w-full px-2 py-1 mb-2 border border-gray-300 rounded text-xs"
                        placeholder="説明"
                      />
                      <button
                        onClick={() => {
                          handleUpdateRuleSet(ruleSet.id, ruleSet.name, ruleSet.description);
                        }}
                        className="px-2 py-1 bg-orange-500 text-white rounded text-xs"
                      >
                        保存
                      </button>
                    </div>
                  ) : (
                    <>
                      <h3 className="font-bold text-gray-900">{ruleSet.name}</h3>
                      <p className="text-xs text-gray-600 mt-1">{ruleSet.description}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        最終更新: {ruleSet.lastModified}
                      </p>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('patterns')}
                className={`px-6 py-3 text-sm font-medium transition-colors relative ${
                  activeTab === 'patterns' ? 'text-orange-600' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                勤務パターン
                {activeTab === 'patterns' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />
                )}
              </button>
              <button
                onClick={() => setActiveTab('requirements')}
                className={`px-6 py-3 text-sm font-medium transition-colors relative ${
                  activeTab === 'requirements' ? 'text-orange-600' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                必要人数設定
                {activeTab === 'requirements' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />
                )}
              </button>
              <button
                onClick={() => setActiveTab('rules')}
                className={`px-6 py-3 text-sm font-medium transition-colors relative ${
                  activeTab === 'rules' ? 'text-orange-600' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                カスタムルール
                {activeTab === 'rules' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />
                )}
              </button>
            </div>
          </div>

          {activeTab === 'patterns' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">勤務パターン設定</h2>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={shiftPatterns.enabled}
                    onChange={(e) => setShiftPatterns({...shiftPatterns, enabled: e.target.checked})}
                    className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <span className="text-sm text-gray-700">勤務パターンを使用する</span>
                </label>
              </div>

              {shiftPatterns.enabled && (
                <>
                  <div className="space-y-3 mb-6">
                    {shiftPatterns.patterns.map((pattern, index) => {
                      const Icon = pattern.icon;
                      return (
                        <div key={pattern.id} className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg">
                          <div className={`p-2 rounded-lg ${
                            pattern.color === 'yellow' ? 'bg-yellow-100' :
                            pattern.color === 'blue' ? 'bg-blue-100' :
                            pattern.color === 'purple' ? 'bg-purple-100' :
                            'bg-gray-100'
                          }`}>
                            <Icon className={`w-5 h-5 ${
                              pattern.color === 'yellow' ? 'text-yellow-600' :
                              pattern.color === 'blue' ? 'text-blue-600' :
                              pattern.color === 'purple' ? 'text-purple-600' :
                              'text-gray-600'
                            }`} />
                          </div>
                          <input
                            type="text"
                            value={pattern.name}
                            onChange={(e) => {
                              const updated = [...shiftPatterns.patterns];
                              updated[index].name = e.target.value;
                              setShiftPatterns({...shiftPatterns, patterns: updated});
                            }}
                            className="px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
                            placeholder="パターン名"
                          />
                          <div className="flex items-center gap-2">
                            <input
                              type="time"
                              value={pattern.start}
                              onChange={(e) => {
                                const updated = [...shiftPatterns.patterns];
                                updated[index].start = e.target.value;
                                setShiftPatterns({...shiftPatterns, patterns: updated});
                              }}
                              className="px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
                            />
                            <span className="text-gray-500">〜</span>
                            <input
                              type="time"
                              value={pattern.end}
                              onChange={(e) => {
                                const updated = [...shiftPatterns.patterns];
                                updated[index].end = e.target.value;
                                setShiftPatterns({...shiftPatterns, patterns: updated});
                              }}
                              className="px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
                            />
                          </div>
                          <button
                            onClick={() => handleDeleteShiftPattern(pattern.id)}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors ml-auto"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                  <button
                    onClick={handleAddShiftPattern}
                    className="px-4 py-2 border-2 border-dashed border-gray-300 text-gray-500 rounded-lg hover:border-orange-300 hover:text-orange-500 transition-colors flex items-center gap-2 w-full justify-center"
                  >
                    <Plus className="w-4 h-4" />
                    パターンを追加
                  </button>
                </>
              )}

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <Info className="w-4 h-4 inline mr-1" />
                  勤務パターンを設定すると、シフト作成時に早番・中番・遅番などの選択が可能になります
                </p>
              </div>
            </div>
          )}

          {activeTab === 'requirements' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">
                  {ruleSets.find(r => r.id === selectedRuleSet)?.name} - 時間帯別必要人数
                </h2>
                <button 
                  onClick={() => setShowImportModal(true)}
                  className="text-sm text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1"
                >
                  <FileUp className="w-4 h-4" />
                  過去のシフトから読み込み
                </button>
              </div>

              {showImportModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-xl p-6 w-96">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">シフトデータの読み込み</h3>
                    <div className="space-y-4">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                        <FileUp className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 mb-2">
                          ファイルをドラッグ&ドロップ
                        </p>
                        <p className="text-xs text-gray-500 mb-3">
                          対応形式: CSV, Excel, PDF, JPEG/PNG
                        </p>
                        <label className="cursor-pointer">
                          <span className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-sm inline-block">
                            ファイルを選択
                          </span>
                          <input
                            type="file"
                            className="hidden"
                            accept=".csv,.xlsx,.xls,.pdf,.jpg,.jpeg,.png"
                            onChange={handleImportFile}
                          />
                        </label>
                      </div>
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => setShowImportModal(false)}
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                        >
                          キャンセル
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="border-b border-gray-200 mb-6">
                <div className="flex gap-4">
                  <button
                    onClick={() => setSelectedPosition('all')}
                    className={`px-4 py-2 text-sm font-medium transition-colors relative ${
                      selectedPosition === 'all' ? 'text-orange-600' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    全ポジション
                    {selectedPosition === 'all' && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />
                    )}
                  </button>
                  {positions.map(position => (
                    <button
                      key={position.id}
                      onClick={() => setSelectedPosition(position.id)}
                      className={`px-4 py-2 text-sm font-medium transition-colors relative ${
                        selectedPosition === position.id ? 'text-orange-600' : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {position.name}
                      {selectedPosition === position.id && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
              
              {selectedPosition === 'all' && (
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">平日</h4>
                    <div className="space-y-2">
                      {currentRuleData[selectedRuleSet]?.all.requirements.weekday.slice(0, 5).map((req, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="text-sm text-gray-600 w-12">{req.time}</span>
                          {positions.map(pos => (
                            <div key={pos.id} className="flex items-center gap-1">
                              <span className={`text-xs px-2 py-0.5 rounded ${
                                pos.color === 'orange' ? 'bg-orange-100 text-orange-700' :
                                pos.color === 'blue' ? 'bg-blue-100 text-blue-700' :
                                'bg-green-100 text-green-700'
                              }`}>
                                {pos.name.charAt(0)}
                              </span>
                              <input
                                type="number"
                                min="0"
                                max="10"
                                value={req.count[pos.id]}
                                onChange={(e) => handleUpdateRequirement('weekday', idx, pos.id, e.target.value)}
                                className="w-12 px-1 py-0.5 border border-gray-200 rounded text-center text-sm"
                              />
                            </div>
                          ))}
                        </div>
                      ))}
                      <button className="text-xs text-orange-600 hover:text-orange-700">
                        全時間帯を表示 →
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">週末・祝日</h4>
                    <div className="space-y-2">
                      {currentRuleData[selectedRuleSet]?.all.requirements.weekend.slice(0, 5).map((req, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="text-sm text-gray-600 w-12">{req.time}</span>
                          {positions.map(pos => (
                            <div key={pos.id} className="flex items-center gap-1">
                              <span className={`text-xs px-2 py-0.5 rounded ${
                                pos.color === 'orange' ? 'bg-orange-100 text-orange-700' :
                                pos.color === 'blue' ? 'bg-blue-100 text-blue-700' :
                                'bg-green-100 text-green-700'
                              }`}>
                                {pos.name.charAt(0)}
                              </span>
                              <input
                                type="number"
                                min="0"
                                max="10"
                                value={req.count[pos.id]}
                                onChange={(e) => handleUpdateRequirement('weekend', idx, pos.id, e.target.value)}
                                className="w-12 px-1 py-0.5 border border-gray-200 rounded text-center text-sm"
                              />
                            </div>
                          ))}
                        </div>
                      ))}
                      <button className="text-xs text-orange-600 hover:text-orange-700">
                        全時間帯を表示 →
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {selectedPosition !== 'all' && (
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">平日</h4>
                    <div className="space-y-2">
                      {currentRuleData[selectedRuleSet]?.all.requirements.weekday.slice(0, 5).map((req, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="text-sm text-gray-600 w-12">{req.time}</span>
                          <input
                            type="number"
                            min="0"
                            max="10"
                            value={req.count[selectedPosition]}
                            onChange={(e) => handleUpdateRequirement('weekday', idx, selectedPosition, e.target.value)}
                            className="w-16 px-2 py-1 border border-gray-200 rounded text-center"
                          />
                          <span className="text-xs text-gray-500">名</span>
                        </div>
                      ))}
                      <button className="text-xs text-orange-600 hover:text-orange-700">
                        全時間帯を表示 →
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">週末・祝日</h4>
                    <div className="space-y-2">
                      {currentRuleData[selectedRuleSet]?.all.requirements.weekend.slice(0, 5).map((req, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="text-sm text-gray-600 w-12">{req.time}</span>
                          <input
                            type="number"
                            min="0"
                            max="10"
                            value={req.count[selectedPosition]}
                            onChange={(e) => handleUpdateRequirement('weekend', idx, selectedPosition, e.target.value)}
                            className="w-16 px-2 py-1 border border-gray-200 rounded text-center"
                          />
                          <span className="text-xs text-gray-500">名</span>
                        </div>
                      ))}
                      <button className="text-xs text-orange-600 hover:text-orange-700">
                        全時間帯を表示 →
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'rules' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">
                  {ruleSets.find(r => r.id === selectedRuleSet)?.name} - カスタムルール
                </h2>
                <button
                  onClick={handleAddRule}
                  className="px-3 py-1.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-sm flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  ルール追加
                </button>
              </div>
              
              <div className="space-y-3">
                {currentRuleData[selectedRuleSet]?.all.rules.map((rule, index) => (
                  <div key={rule.id} className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg">
                    <input
                      type="checkbox"
                      checked={rule.active}
                      onChange={(e) => {
                        const updatedData = { ...currentRuleData };
                        updatedData[selectedRuleSet].all.rules[index].active = e.target.checked;
                        setCurrentRuleData(updatedData);
                      }}
                      className="mt-1 w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <div className="flex-1">
                      <input
                        type="text"
                        value={rule.rule}
                        onChange={(e) => {
                          const updatedData = { ...currentRuleData };
                          updatedData[selectedRuleSet].all.rules[index].rule = e.target.value;
                          setCurrentRuleData(updatedData);
                        }}
                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
                        placeholder="ルールを入力... （例: 新人は必ずベテランと組む、佐藤太郎は火曜午前は避ける）"
                      />
                    </div>
                    <button
                      onClick={() => handleDeleteRule(rule.id)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <Info className="w-4 h-4 inline mr-1" />
                  個人名を含むルールも設定可能です。AI生成時に自動的に考慮されます。
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      {showNewRuleModal && <NewRuleModal />}
    </div>
  );
};

export default ShiftRulesSettingsPage;