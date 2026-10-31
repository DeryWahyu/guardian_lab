import {
  Difficulty,
  PrismaClient,
  QuestionType,
  QuizCategory,
  ReplayStatus,
  RiskLevel,
  Role,
  ScanType,
} from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

async function main() {
  console.log("🌱 Starting Guardian Lab database seeding...");

  // 1. Seed Starter Badges
  console.log("🏅 Seeding starter badges...");
  const badgesData = [
    {
      code: "RECRUIT_GUARDIAN",
      title: "Recruit Guardian",
      description: "Memulai langkah pertama dalam menjaga ekosistem digital di Guardian Lab.",
      iconUrl: "/badges/recruit-guardian.svg",
      expReward: 50,
    },
    {
      code: "ANTI_QUISHING_MASTER",
      title: "Anti-Quishing Master",
      description: "Berhasil mendeteksi dan membongkar modus penipuan QR code (Quishing).",
      iconUrl: "/badges/anti-quishing.svg",
      expReward: 100,
    },
    {
      code: "APK_DISSECTOR",
      title: "APK Dissector",
      description: "Membongkar izin berbahaya dan bot Telegram C2 pada malware Android.",
      iconUrl: "/badges/apk-dissector.svg",
      expReward: 150,
    },
    {
      code: "PHISHING_HUNTER",
      title: "Phishing Hunter",
      description: "Mendeteksi domain typosquatting dan situs tiruan bank/e-wallet Indonesia.",
      iconUrl: "/badges/phishing-hunter.svg",
      expReward: 100,
    },
    {
      code: "CYBER_SENTINEL",
      title: "Cyber Sentinel",
      description: "Menjaga streak investigasi harian selama minimal 7 hari berturut-turut.",
      iconUrl: "/badges/cyber-sentinel.svg",
      expReward: 200,
    },
    {
      code: "COMMUNITY_DEFENDER",
      title: "Community Defender",
      description: "Membagikan temuan ancaman riil ke Community Forensic Replay.",
      iconUrl: "/badges/community-defender.svg",
      expReward: 150,
    },
  ];

  const badges = [];
  for (const b of badgesData) {
    const badge = await prisma.badge.upsert({
      where: { code: b.code },
      update: b,
      create: b,
    });
    badges.push(badge);
  }
  console.log(`✅ Seeded ${badges.length} badges.`);

  // 2. Seed Default Users
  console.log("👤 Seeding default users...");
  const commonPasswordHash = await hashPassword("password");

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@gmail.com" },
    update: {
      name: "Master Admin Guardian",
      role: Role.ADMIN,
      passwordHash: commonPasswordHash,
      exp: 1500,
      streakDays: 45,
    },
    create: {
      id: "usr_admin_001",
      email: "admin@gmail.com",
      name: "Master Admin Guardian",
      role: Role.ADMIN,
      passwordHash: commonPasswordHash,
      exp: 1500,
      streakDays: 45,
    },
  });

  const gadingUser = await prisma.user.upsert({
    where: { email: "gading@gmail.com" },
    update: {
      name: "Gading",
      role: Role.USER,
      passwordHash: commonPasswordHash,
      exp: 250,
      streakDays: 7,
    },
    create: {
      id: "usr_user_002",
      email: "gading@gmail.com",
      name: "Gading",
      role: Role.USER,
      passwordHash: commonPasswordHash,
      exp: 250,
      streakDays: 7,
    },
  });

  const deryUser = await prisma.user.upsert({
    where: { email: "dery@gmail.com" },
    update: {
      name: "Dery",
      role: Role.USER,
      passwordHash: commonPasswordHash,
      exp: 180,
      streakDays: 5,
    },
    create: {
      id: "usr_user_003",
      email: "dery@gmail.com",
      name: "Dery",
      role: Role.USER,
      passwordHash: commonPasswordHash,
      exp: 180,
      streakDays: 5,
    },
  });

  const rafliUser = await prisma.user.upsert({
    where: { email: "rafli@gmail.com" },
    update: {
      name: "Rafli",
      role: Role.USER,
      passwordHash: commonPasswordHash,
      exp: 120,
      streakDays: 2,
    },
    create: {
      id: "usr_user_004",
      email: "rafli@gmail.com",
      name: "Rafli",
      role: Role.USER,
      passwordHash: commonPasswordHash,
      exp: 120,
      streakDays: 2,
    },
  });

  console.log(`✅ Seeded Admin: ${adminUser.email} (Role: ${adminUser.role})`);
  console.log(`✅ Seeded User 1: ${gadingUser.email} (Role: ${gadingUser.role})`);
  console.log(`✅ Seeded User 2: ${deryUser.email} (Role: ${deryUser.role})`);
  console.log(`✅ Seeded User 3: ${rafliUser.email} (Role: ${rafliUser.role})`);

  // Award Starter Badges
  const recruitBadge = badges.find((b) => b.code === "RECRUIT_GUARDIAN");
  if (recruitBadge) {
    for (const u of [gadingUser, deryUser, rafliUser]) {
      await prisma.userBadge.upsert({
        where: {
          userId_badgeId: {
            userId: u.id,
            badgeId: recruitBadge.id,
          },
        },
        update: {},
        create: {
          userId: u.id,
          badgeId: recruitBadge.id,
        },
      });
    }
  }

  // 3. Seed Guardian Academy Quizzes (3 Categories)
  console.log("📚 Seeding Guardian Academy Quizzes...");

  // Quiz 1: SPOT_THE_PHISH
  const quiz1 = await prisma.quiz.upsert({
    where: { id: "quiz-spot-the-phish-1" },
    update: {},
    create: {
      id: "quiz-spot-the-phish-1",
      title: "Membongkar Trik URL Palsu & Domain Typosquatting",
      description:
        "Latih ketajaman matamu dalam membedakan domain resmi perbankan dan e-wallet dari situs tiruan penipu.",
      category: QuizCategory.SPOT_THE_PHISH,
      difficulty: Difficulty.EASY,
      expReward: 60,
      published: true,
      questions: {
        create: [
          {
            questionText:
              "Perhatikan tautan berikut: https://klik-bca.com.secure-login.xyz/auth. Bagian manakah yang merupakan domain utama yang dikontrol pemilik web?",
            questionType: QuestionType.MULTIPLE_CHOICE,
            options: [
              { id: "opt1", text: "klik-bca.com" },
              { id: "opt2", text: "secure-login.xyz" },
              { id: "opt3", text: "bca.com" },
              { id: "opt4", text: "auth" },
            ],
            correctAnswers: ["opt2"],
            explanation:
              "Domain utama selalu berada tepat sebelum garis miring pertama (/) atau port, yaitu 'secure-login.xyz'. Teks 'klik-bca.com' hanyalah subdomain tipuan buatan penipu.",
            order: 1,
          },
          {
            questionText:
              "Tautan 'https://dana-kaget-claim.id.top/dana' menggunakan TLD .top. Mengapa tautan ini wajib dicurigai?",
            questionType: QuestionType.MULTIPLE_CHOICE,
            options: [
              {
                id: "opt1",
                text: "Karena domain resmi DANA Indonesia adalah dana.id, bukan domain di TLD .top",
              },
              {
                id: "opt2",
                text: "Karena domain .top tidak dapat diakses dari browser smartphone",
              },
              {
                id: "opt3",
                text: "Karena semua TLD luar negeri otomatis dilarang di Indonesia",
              },
              {
                id: "opt4",
                text: "Karena protokol HTTPS dilarang untuk tautan hadiah",
              },
            ],
            correctAnswers: ["opt1"],
            explanation:
              "Domain resmi DANA adalah 'dana.id'. Penipu kerap memanfaatkan TLD murah/bebas registrasi seperti .top atau .xyz dengan menyisipkan kata kunci brand terkenal.",
            order: 2,
          },
        ],
      },
    },
  });

  // Quiz 2: SOCIAL_ENGINEERING
  const quiz2 = await prisma.quiz.upsert({
    where: { id: "quiz-social-engineering-1" },
    update: {},
    create: {
      id: "quiz-social-engineering-1",
      title: "Dekonstruksi Manipulasi Psikologis Kurir Paket & Undangan",
      description:
        "Pelajari bagaimana sindikat penipuan memanfaatkan kepanikan, rasa penasaran, dan desakan waktu untuk menjebak korban.",
      category: QuizCategory.SOCIAL_ENGINEERING,
      difficulty: Difficulty.MEDIUM,
      expReward: 80,
      published: true,
      questions: {
        create: [
          {
            questionText:
              "Pesan WhatsApp dari nomor tak dikenal berbunyi: 'PENTING! Paket J&T Anda no resi JP8829 tertahan di gudang, klik file LIHAT_FOTO_PAKET.apk untuk konfirmasi lokasi'. Modus manipulasi psikologis apa yang dimanfaatkan?",
            questionType: QuestionType.MULTIPLE_CHOICE,
            options: [
              {
                id: "opt1",
                text: "Urgensi & kepanikan palsu agar korban terburu-buru mengklik file tanpa cek ekstensi",
              },
              {
                id: "opt2",
                text: "Tawaran diskon belanja dan cashback marketplace",
              },
              {
                id: "opt3",
                text: "Ancaman pemblokiran rekening dari pihak kepolisian",
              },
              {
                id: "opt4",
                text: "Penawaran lowongan kerja paruh waktu",
              },
            ],
            correctAnswers: ["opt1"],
            explanation:
              "Penipu memicu rasa cemas 'paket tertahan' agar korban langsung mengeklik file tanpa menyadari bahwa file tersebut berekstensi .apk (aplikasi Android) dan bukan file foto (.jpg/.png).",
            order: 1,
          },
          {
            questionText:
              "Manakah tindakan darurat paling tepat jika kamu atau kerabat terlanjur menginstal file APK mencurigakan di HP Android?",
            questionType: QuestionType.MULTIPLE_CHOICE,
            options: [
              {
                id: "opt1",
                text: "Segera aktifkan Mode Pesawat (Airplane Mode) atau matikan semua koneksi internet",
              },
              {
                id: "opt2",
                text: "Kirim pesan teks komplain ke nomor kurir pengirim file",
              },
              {
                id: "opt3",
                text: "Restart HP berkali-kali hingga memori kosong",
              },
              {
                id: "opt4",
                text: "Buka aplikasi perbankan untuk mengecek mutasi rekening",
              },
            ],
            correctAnswers: ["opt1"],
            explanation:
              "Memutus koneksi internet seketika (Mode Pesawat) memblokir aplikasi malware dari mengirimkan SMS OTP keluar ke server bot Telegram penipu, memberi waktu aman untuk mencopot aplikasi (uninstall).",
            order: 2,
          },
        ],
      },
    },
  });

  // Quiz 3: DANGEROUS_PERMISSIONS
  const quiz3 = await prisma.quiz.upsert({
    where: { id: "quiz-dangerous-permissions-1" },
    update: {},
    create: {
      id: "quiz-dangerous-permissions-1",
      title: "Detektif Izin Android Berbahaya",
      description:
        "Analisis manifest aplikasi Android dan identifikasi kombinasi izin yang dipakai sindikat malware penyadap SMS OTP.",
      category: QuizCategory.DANGEROUS_PERMISSIONS,
      difficulty: Difficulty.HARD,
      expReward: 100,
      published: true,
      questions: {
        create: [
          {
            questionText:
              "Sebuah aplikasi bernama 'Undangan Pernikahan Digital' meminta izin android.permission.RECEIVE_SMS dan android.permission.READ_SMS. Mengapa kombinasi izin ini adalah Red Flag kritis?",
            questionType: QuestionType.MULTIPLE_CHOICE,
            options: [
              {
                id: "opt1",
                text: "Aplikasi undangan digital tidak butuh membaca SMS; izin ini murni dipakai menyadap SMS OTP m-banking korban",
              },
              {
                id: "opt2",
                text: "Izin SMS akan menguras pulsa seluler pengguna",
              },
              {
                id: "opt3",
                text: "Semua aplikasi Android dilarang menggunakan izin SMS oleh Google Play",
              },
              {
                id: "opt4",
                text: "Izin SMS akan menghapus daftar kontak pengguna secara otomatis",
              },
            ],
            correctAnswers: ["opt1"],
            explanation:
              "Undangan digital hanya butuh menampilkan web atau gambar. Akses membaca dan menerima SMS merupakan tanda paten malware penyadap pesan OTP perbankan.",
            order: 1,
          },
          {
            questionText:
              "Jika decompiled code sebuah APK memuat hardcoded string 'https://api.telegram.org/bot...', apa tujuan sindikat malware tersebut?",
            questionType: QuestionType.MULTIPLE_CHOICE,
            options: [
              {
                id: "opt1",
                text: "Memanfaatkan Bot Telegram sebagai Command & Control (C2) untuk menerima data SMS curian secara anonim",
              },
              {
                id: "opt2",
                text: "Menghubungkan pengguna langsung ke layanan pelanggan Telegram resmi",
              },
              {
                id: "opt3",
                text: "Membuat backup otomatis percakapan WhatsApp ke Telegram",
              },
              {
                id: "opt4",
                text: "Mempercepat pengiriman undangan melalui channel publik",
              },
            ],
            correctAnswers: ["opt1"],
            explanation:
              "Sindikat penipuan memanfaatkan API Bot Telegram gratis sebagai server C2 (Command & Control) untuk menampung pesan SMS dan kredensial korban tanpa perlu menyewa VPS pribadi.",
            order: 2,
          },
        ],
      },
    },
  });

  console.log(`✅ Seeded Quizzes: ${quiz1.title}, ${quiz2.title}, ${quiz3.title}`);

  // 4. Seed Sample ForensicRecord & CommunityReplay
  console.log("🔍 Seeding sample ForensicRecord & CommunityReplay...");

  const sampleForensicRecord = await prisma.forensicRecord.create({
    data: {
      userId: gadingUser.id,
      target: "https://bca-klik-auth.secure-portal.xyz/login",
      type: ScanType.URL,
      riskLevel: RiskLevel.PHISHING,
      riskScore: 94,
      scamCategory: "Web Phishing Perbankan (BCA Typosquatting)",
      summary:
        "Situs tiruan yang meniru halaman login KlikBCA untuk mencuri User ID dan PIN m-banking nasabah.",
      deceptionTricks: [
        "Domain typosquatting 'bca-klik-auth' di TLD mencurigakan .xyz",
        "Form palsu meniru tampilan otentikasi resmi",
        "Pesan darurat palsu 'Akun Anda akan diblokir dalam 24 jam'",
      ],
      technicalEvidence: {
        shannonEntropy: 4.82,
        typosquatTarget: "klikbca.com",
        detectedForms: ["userId", "pin", "keyBcaResponse"],
        c2Endpoints: ["https://api.telegram.org/bot712398412:AAH9f.../sendMessage"],
      },
      defangedTarget: "hxxps://bca-klik-auth[.]secure-portal[.]xyz/login",
    },
  });

  const sampleCommunityReplay = await prisma.communityReplay.create({
    data: {
      userId: gadingUser.id,
      title: "Investigasi APK Surat Tilang Elektronik ETLE Palsu",
      description:
        "Bedah kasus sindikat APK surat tilang ETLE berkedok foto surat pelanggaran lalu lintas di WhatsApp.",
      scamType: "APK Penyadap SMS OTP (Modus Surat Tilang ETLE)",
      status: ReplayStatus.APPROVED,
      adminNotes:
        "Disetujui. Bukti forensik lengkap, izin SMS terbukti, dan PII telah disanitasi 100%.",
      reviewedAt: new Date(),
      sanitizedData: {
        scamName: "Surat_Tilang_ETLE_Polda.apk",
        attackerProfile: "Nomor WhatsApp [REDACTED_PHONE] mengaku petugas Ditlantas",
        manifestEvidence: {
          permissions: [
            "android.permission.RECEIVE_SMS",
            "android.permission.READ_SMS",
            "android.permission.INTERNET",
          ],
          maliciousService: "com.sec.etle.SMSReceiverService",
        },
        c2Destination: "Telegram Bot ID [EXTRACTED_BOT_TOKEN_REDACTED]",
        interactivePuzzle: [
          {
            step: 1,
            prompt:
              "Penyidik menemukan file berekstensi .apk dengan nama 'Surat_Tilang_ETLE.apk'. Mengapa polisi lalu lintas tidak pernah mengirim file .apk?",
            expectedAnswer:
              "Konfirmasi tilang ETLE resmi dikirim melalui surat pos fisik atau dicek langsung di situs etle-pmj.info, bukan via file APK di WhatsApp.",
          },
        ],
      },
    },
  });

  console.log(`✅ Seeded sample ForensicRecord ID: ${sampleForensicRecord.id}`);
  console.log(`✅ Seeded sample CommunityReplay ID: ${sampleCommunityReplay.id}`);

  console.log("🎉 Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
