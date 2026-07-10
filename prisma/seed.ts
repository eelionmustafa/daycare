import { PrismaClient } from "@prisma/client";

type AttendanceStatus = "PRESENT" | "ABSENT" | "EXCUSED";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

function utcDate(y: number, m: number, d: number) {
  return new Date(Date.UTC(y, m - 1, d));
}

async function main() {
  // --- Accounts (demo credentials, documented in README) ---
  const adminPass = await bcrypt.hash("admin123", 10);
  const parentPass = await bcrypt.hash("prind123", 10);

  const admin = await db.user.upsert({
    where: { email: "admin@mesimikreativ.com" },
    update: {},
    create: {
      email: "admin@mesimikreativ.com",
      passwordHash: adminPass,
      name: "Administratori",
      role: "ADMIN",
    },
  });

  const parent = await db.user.upsert({
    where: { email: "prind@shembull.com" },
    update: {},
    create: {
      email: "prind@shembull.com",
      passwordHash: parentPass,
      name: "Arben Krasniqi",
      phone: "+383 44 000 000",
      role: "PARENT",
    },
  });

  // --- Children ---
  const existingChild = await db.child.findFirst({ where: { parentId: parent.id } });
  let era, leon;
  if (!existingChild) {
    era = await db.child.create({
      data: {
        firstName: "Era",
        lastName: "Krasniqi",
        birthday: utcDate(2018, 4, 12),
        parentId: parent.id,
        emergencyName: "Vjollca Krasniqi",
        emergencyPhone: "+383 44 111 111",
        emergencyRelation: "Gjyshja",
        notes: "I pëlqen vizatimi. Alergjike ndaj arrave.",
      },
    });
    leon = await db.child.create({
      data: {
        firstName: "Leon",
        lastName: "Krasniqi",
        birthday: utcDate(2016, 9, 3),
        parentId: parent.id,
        notes: "Ndihmë me detyrat e matematikës.",
      },
    });
  } else {
    const kids = await db.child.findMany({ where: { parentId: parent.id } });
    [era, leon] = kids;
  }

  // --- Attendance: last ~4 weeks of weekdays ---
  const today = new Date();
  const todayUTC = utcDate(today.getFullYear(), today.getMonth() + 1, today.getDate());
  for (const child of [era, leon]) {
    if (!child) continue;
    for (let back = 1; back <= 28; back++) {
      const d = new Date(todayUTC);
      d.setUTCDate(d.getUTCDate() - back);
      const dow = d.getUTCDay();
      if (dow === 0 || dow === 6) continue;
      const roll = (back * 7 + child.firstName.length) % 11;
      const status: AttendanceStatus =
        roll === 3 ? "ABSENT" : roll === 7 ? "EXCUSED" : "PRESENT";
      await db.attendanceRecord.upsert({
        where: { childId_date: { childId: child.id, date: d } },
        update: {},
        create: {
          childId: child.id,
          date: d,
          status,
          note: status === "EXCUSED" ? "Njoftuar nga prindi" : null,
        },
      });
    }
  }

  // --- Invoices & payments ---
  if ((await db.invoice.count()) === 0 && era && leon) {
    const month = new Intl.DateTimeFormat("sq-AL", { month: "long", year: "numeric" });
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const paid = await db.invoice.create({
      data: {
        number: "MK-2026-001",
        title: `Muaji ${month.format(lastMonth)} — Era`,
        description: "Qëndrimi ditor dhe aktivitetet kreative",
        amountCents: 8000,
        parentId: parent.id,
        childId: era.id,
        status: "PAID",
        issuedAt: lastMonth,
        dueAt: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 10),
        paidAt: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 6),
      },
    });
    await db.payment.create({
      data: {
        invoiceId: paid.id,
        amountCents: 8000,
        method: "CASH",
        receiptNo: "KUP-2026-001",
        paidAt: paid.paidAt!,
        note: "Paguar në qendër",
      },
    });

    await db.invoice.create({
      data: {
        number: "MK-2026-002",
        title: `Muaji ${month.format(lastMonth)} — Leon`,
        description: "Qëndrimi ditor dhe ndihma me detyra",
        amountCents: 8000,
        parentId: parent.id,
        childId: leon.id,
        status: "PAID",
        issuedAt: lastMonth,
        dueAt: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 10),
        paidAt: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 8),
        payments: {
          create: {
            amountCents: 8000,
            method: "BANK",
            receiptNo: "KUP-2026-002",
            note: "Transfertë bankare",
          },
        },
      },
    });

    await db.invoice.create({
      data: {
        number: "MK-2026-003",
        title: `Muaji ${month.format(now)} — Era`,
        description: "Qëndrimi ditor dhe aktivitetet kreative",
        amountCents: 8000,
        parentId: parent.id,
        childId: era.id,
        status: "SENT",
        dueAt: new Date(now.getFullYear(), now.getMonth(), 15),
      },
    });
    await db.invoice.create({
      data: {
        number: "MK-2026-004",
        title: `Muaji ${month.format(now)} — Leon`,
        description: "Qëndrimi ditor dhe ndihma me detyra",
        amountCents: 8000,
        parentId: parent.id,
        childId: leon.id,
        status: "SENT",
        dueAt: new Date(now.getFullYear(), now.getMonth(), 15),
      },
    });
  }

  // --- Albums & photos (placeholders until Facebook sync brings real ones) ---
  const albumDefs = [
    { slug: "aktivitete", name: "Aktivitete", description: "Dita jonë plot lëvizje, lojëra dhe buzëqeshje." },
    { slug: "projekte-kreative", name: "Projekte kreative", description: "Vizatime, punime dore dhe ide që lindin nga duart e vogla." },
    { slug: "evente", name: "Evente", description: "Ditët e veçanta që i presim gjithë vitin." },
    { slug: "festa", name: "Festa", description: "Ditëlindje, festa sezonale dhe gëzim i përbashkët." },
    { slug: "aktivitete-jashte", name: "Aktivitete jashtë", description: "Ajër i pastër, lojëra në oborr dhe shëtitje." },
    { slug: "momente-klase", name: "Momente nga klasa", description: "Detyrat, leximi dhe mësimi bashkë." },
    { slug: "kujtime-te-vecanta", name: "Kujtime të veçanta", description: "Momentet që na mbeten në zemër." },
  ];
  const albums: Record<string, string> = {};
  for (let i = 0; i < albumDefs.length; i++) {
    const a = albumDefs[i];
    const album = await db.album.upsert({
      where: { slug: a.slug },
      update: {},
      create: { ...a, sortOrder: i },
    });
    albums[a.slug] = album.id;
  }

  if ((await db.photo.count()) === 0) {
    const sizes = [
      [1200, 900],
      [900, 1200],
      [1080, 1080],
      [1200, 750],
    ];
    const captions = [
      "Punëtoria e vizatimit të premten",
      "Ora e leximit — të gjithë bashkë",
      "Ndërtuam qytetin tonë me kuti kartoni",
      "Loja në oborr pas detyrave",
      "Festa e ditëlindjes së shtatorit",
      "Eksperimenti me ngjyra uji",
      "Detyrat e shtëpisë me ndihmën e mësueses",
      "Turneu i shahut mes grupeve",
      "Dita e pemëve — mbollëm bashkë",
      "Punime dore për Ditën e Nënës",
      "Kukullat që i bëmë vetë",
      "Gara e leximit — kush lexon më shumë",
      "Piknik i vogël në park",
      "Maskat e karnavaleve",
      "Ora e muzikës dhe këngëve",
      "Ndërtimi me lego — ura jonë e madhe",
      "Dita e parë e vitit të ri shkollor",
      "Ekspozita e vizatimeve të muajit",
      "Loja e thesarit të fshehur",
      "Bashkëpunimi — projekti i grupit",
      "Fletoret tona më të bukura",
      "Dita me borë në oborr",
      "Përshëndetja e pasdites",
      "Miqtë më të mirë të tavolinës së artit",
    ];
    const albumOrder = [
      "projekte-kreative", "momente-klase", "projekte-kreative", "aktivitete-jashte",
      "festa", "projekte-kreative", "momente-klase", "aktivitete",
      "evente", "projekte-kreative", "projekte-kreative", "momente-klase",
      "aktivitete-jashte", "festa", "aktivitete", "aktivitete",
      "evente", "kujtime-te-vecanta", "aktivitete", "kujtime-te-vecanta",
      "momente-klase", "aktivitete-jashte", "kujtime-te-vecanta", "projekte-kreative",
    ];
    for (let i = 0; i < 24; i++) {
      const [w, h] = sizes[i % sizes.length];
      await db.photo.create({
        data: {
          url: `/gallery/kujtim-${String(i + 1).padStart(2, "0")}.svg`,
          caption: captions[i],
          source: "UPLOAD",
          width: w,
          height: h,
          featured: i < 6,
          homepage: i < 4,
          visible: true,
          sortOrder: i,
          albumId: albums[albumOrder[i]],
        },
      });
    }
  }

  // --- Staff (sample profiles — replace in Admin) ---
  if ((await db.staffMember.count()) === 0) {
    await db.staffMember.createMany({
      data: [
        {
          name: "Themeluese & Edukatore",
          position: "Themeluese & Edukatore",
          years: "12+ vjet përvojë me fëmijë",
          bio: "E nisi Mësimin Kreativ me një ide të thjeshtë: fëmijët mësojnë më mirë kur ndihen në shtëpi. Njeh secilin fëmijë me emër, me hobi dhe me ëndrra.",
          sortOrder: 0,
        },
        {
          name: "Mësuese e gjuhës dhe leximit",
          position: "Mësuese e gjuhës dhe leximit",
          years: "8 vjet përvojë",
          bio: "I kthen detyrat e shtëpisë në lojë. Ora e leximit është momenti më i qetë dhe më i dashur i ditës.",
          sortOrder: 1,
        },
        {
          name: "Instruktor i aktiviteteve",
          position: "Instruktor i aktiviteteve",
          years: "6 vjet përvojë",
          bio: "Organizon lojërat në oborr, turnetë e shahut dhe eksperimentet — energjia s'i mbaron kurrë.",
          sortOrder: 2,
        },
      ],
    });
  }

  // --- Testimonials (sample — replace with real parent quotes) ---
  if ((await db.testimonial.count()) === 0) {
    await db.testimonial.createMany({
      data: [
        {
          parentName: "Nëna e një vajze 8-vjeçare",
          text: "Vajza ime nuk dëshiron të kthehet në shtëpi pasditeve — kaq mirë ndihet aty. Detyrat i kryen pa stres dhe çdo ditë sjell diçka të re që e ka punuar vetë.",
          sortOrder: 0,
        },
        {
          parentName: "Babai i dy djemve",
          text: "Si prind që punon deri vonë, qetësia që ma jep Mësimi Kreativ nuk ka çmim. E di gjithmonë ku janë djemtë, çfarë kanë ngrënë dhe si e kanë kaluar ditën.",
          sortOrder: 1,
        },
        {
          parentName: "Nëna e një djali 7-vjeçar",
          text: "Djali im ishte i turpshëm dhe nuk fliste shumë. Pas disa muajsh këtu, ka miq të ngushtë dhe del para grupit të tregojë historira. Kjo ka qenë dhurata më e madhe.",
          sortOrder: 2,
        },
      ],
    });
  }

  console.log("Seed complete.", { admin: admin.email, parent: parent.email });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
