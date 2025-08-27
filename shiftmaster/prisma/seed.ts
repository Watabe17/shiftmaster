import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';

const prisma = new PrismaClient();

// Supabaseクライアントの作成
const supabaseUrl = 'https://wxiuskoajuqhfociuaou.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4aXVza29hanVxaGZvY2l1YW91Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzYzMzE5NiwiZXhwIjoyMDY5MjA5MTk2fQ.nhP9CfaHCA_RjqQsSKIwv1M5dbLpMiV0Az12RAU9Frk';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function main() {
  console.log('🌱 Starting seed data creation...');

  try {
    // 1. テスト用店舗の作成
    console.log('📦 Creating test store...');
    const testStore = await prisma.store.create({
      data: {
        name: 'テスト店舗',
        address: '東京都渋谷区テスト1-1-1',
        phone: '03-1234-5678',
        email: 'test@shiftmaster.test',
        latitude: 35.6762,
        longitude: 139.6503,
        radiusMeters: 100,
        timezone: 'Asia/Tokyo',
        businessHours: {
          monday: { open: '09:00', close: '18:00' },
          tuesday: { open: '09:00', close: '18:00' },
          wednesday: { open: '09:00', close: '18:00' },
          thursday: { open: '09:00', close: '18:00' },
          friday: { open: '09:00', close: '18:00' },
          saturday: { open: '10:00', close: '17:00' },
          sunday: { open: '10:00', close: '17:00' }
        }
      }
    });
    console.log(`✅ Created store: ${testStore.name} (ID: ${testStore.id})`);

    // 2. 店舗設定の作成
    console.log('⚙️ Creating store settings...');
    const storeSettings = await prisma.storeSetting.create({
      data: {
        storeId: testStore.id,
        autoBreakEnabled: true,
        autoBreakStartHours: 6.0,
        autoBreakDurationMinutes: 60,
        overtimeThresholdMinutes: 480,
        earlyClockInMinutes: 30,
        lateClockOutMinutes: 30,
        locationStrictMode: true,
        notificationSettings: {
          email: true,
          push: true,
          sms: false
        }
      }
    });
    console.log(`✅ Created store settings for store: ${testStore.id}`);

    // 3. テスト用ユーザーの作成
    console.log('👥 Creating test users...');
    const testUsers = [
      {
        email: 'admin@shiftmaster.test',
        password: 'admin123',
        role: 'SYSTEM_ADMIN' as const,
        fullName: 'システム管理者',
        employeeCode: 'ADMIN001',
        description: '全権限を持つシステム管理者'
      },
      {
        email: 'store@shiftmaster.test',
        password: 'store123',
        role: 'ADMIN' as const,
        fullName: '店舗管理者',
        employeeCode: 'STORE001',
        description: '店舗レベルの管理者'
      },
      {
        email: 'manager@shiftmaster.test',
        password: 'manager123',
        role: 'MANAGER' as const,
        fullName: 'マネージャー',
        employeeCode: 'MGR001',
        description: '従業員管理権限を持つマネージャー'
      },
      {
        email: 'employee@shiftmaster.test',
        password: 'employee123',
        role: 'EMPLOYEE' as const,
        fullName: '一般従業員',
        employeeCode: 'EMP001',
        description: '基本的な権限を持つ従業員'
      }
    ];

    for (const userData of testUsers) {
      try {
        console.log(`Creating user: ${userData.email}...`);
        
        // Supabase Authでユーザー作成
        const { data: authUser, error } = await supabase.auth.admin.createUser({
          email: userData.email,
          password: userData.password,
          email_confirm: true
        });

        if (error) {
          console.error(`❌ Error creating user ${userData.email}:`, error.message);
          continue;
        }

        if (!authUser.user) {
          console.error(`❌ No user data returned for ${userData.email}`);
          continue;
        }

        // ユーザープロフィールの作成
        const userProfile = await prisma.userProfile.create({
          data: {
            id: authUser.user.id,
            email: userData.email,
            fullName: userData.fullName,
            phone: '090-1234-5678'
          }
        });

        // 従業員レコードの作成
        const employee = await prisma.employee.create({
          data: {
            userId: authUser.user.id,
            storeId: testStore.id,
            employeeCode: userData.employeeCode,
            fullName: userData.fullName,
            email: userData.email,
            role: userData.role,
            status: 'ACTIVE',
            hireDate: new Date('2024-01-01'),
            monthlyLimitHours: 160,
            socialInsuranceEnrolled: true,
            paidLeaveDays: 10,
            invitationToken: null,
            invitationExpiresAt: null,
            qrCodeUrl: null
          }
        });

        console.log(`✅ Created user: ${userData.email} (${userData.role}) - Employee ID: ${employee.id}`);
      } catch (error) {
        console.error(`❌ Error processing user ${userData.email}:`, error);
      }
    }

    // 4. サンプルシフトテンプレートの作成
    console.log('📅 Creating shift templates...');
    
    // システム管理者の従業員IDを取得
    const adminEmployee = await prisma.employee.findFirst({
      where: { email: 'admin@shiftmaster.test' }
    });
    
    if (adminEmployee) {
      const shiftTemplate = await prisma.shiftTemplate.create({
        data: {
          storeId: testStore.id,
          name: '標準シフト',
          description: '平日の標準的なシフトパターン',
          templateData: {
            startTime: '09:00',
            endTime: '18:00',
            breakMinutes: 60,
            workDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
          },
          isActive: true,
          createdBy: adminEmployee.id
        }
      });
      console.log(`✅ Created shift template: ${shiftTemplate.name}`);
    } else {
      console.log('⚠️ Skipping shift template creation - admin employee not found');
    }

    // 5. サンプルポジションの作成
    console.log('💼 Creating positions...');
    const positions = await Promise.all([
      prisma.position.create({
        data: {
          storeId: testStore.id,
          name: '店長',
          description: '店舗の責任者',
          hourlyWage: 1500,
          color: '#EF4444',
          sortOrder: 1
        }
      }),
      prisma.position.create({
        data: {
          storeId: testStore.id,
          name: '正社員',
          description: '正社員従業員',
          hourlyWage: 1200,
          color: '#3B82F6',
          sortOrder: 2
        }
      }),
      prisma.position.create({
        data: {
          storeId: testStore.id,
          name: 'アルバイト',
          description: 'アルバイト従業員',
          hourlyWage: 1000,
          color: '#10B981',
          sortOrder: 3
        }
      })
    ]);
    console.log(`✅ Created ${positions.length} positions`);

    console.log('\n🎉 Seed data created successfully!');
    console.log('\n📋 Test User Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    testUsers.forEach(user => {
      console.log(`${user.role}: ${user.email} / ${user.password}`);
    });
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n🔑 You can now use these credentials to test the system.');
    console.log(`🏪 Test store created: ${testStore.name}`);
    console.log(`📍 Store ID: ${testStore.id}`);

  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('\n🔌 Database connection closed.');
  });
