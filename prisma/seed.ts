import { PrismaClient, UserRole, Gender, GradeType, FeeType, DayOfWeek } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // ==================== Academic Year & Terms ====================
  const year = await prisma.academicYear.create({
    data: {
      name: "2025-2026",
      startDate: new Date("2025-09-02"),
      endDate: new Date("2026-06-30"),
      isCurrent: true,
      terms: {
        create: [
          { name: "1er Trimestre", sequenceNumber: 1, startDate: new Date("2025-09-02"), endDate: new Date("2025-12-15") },
          { name: "2eme Trimestre", sequenceNumber: 2, startDate: new Date("2026-01-05"), endDate: new Date("2026-03-20") },
          { name: "3eme Trimestre", sequenceNumber: 3, startDate: new Date("2026-04-06"), endDate: new Date("2026-06-30") },
        ],
      },
    },
    include: { terms: true },
  });
  console.log("  Academic year created:", year.name);

  // ==================== Subjects ====================
  const subjectsData = [
    { name: "Mathematiques", code: "MATH", category: "Sciences" },
    { name: "Francais", code: "FRA", category: "Lettres" },
    { name: "Anglais", code: "ANG", category: "Lettres" },
    { name: "Physique-Chimie", code: "PC", category: "Sciences" },
    { name: "Sciences de la Vie et de la Terre", code: "SVT", category: "Sciences" },
    { name: "Histoire-Geographie", code: "HG", category: "Sciences Humaines" },
    { name: "Education Civique", code: "ECM", category: "Sciences Humaines" },
    { name: "Informatique", code: "INFO", category: "Sciences" },
    { name: "Education Physique et Sportive", code: "EPS", category: "Autres" },
    { name: "Philosophie", code: "PHILO", category: "Lettres" },
    { name: "Espagnol", code: "ESP", category: "Lettres" },
    { name: "Allemand", code: "ALL", category: "Lettres" },
  ];

  const subjects: Record<string, string> = {};
  for (const s of subjectsData) {
    const created = await prisma.subject.create({ data: s });
    subjects[s.code] = created.id;
  }
  console.log("  Subjects created:", Object.keys(subjects).length);

  // ==================== Classes ====================
  const classesData = [
    { name: "6eme A", level: "6eme", section: "A" },
    { name: "6eme B", level: "6eme", section: "B" },
    { name: "5eme A", level: "5eme", section: "A" },
    { name: "4eme A", level: "4eme", section: "A" },
    { name: "3eme A", level: "3eme", section: "A" },
    { name: "2nde A", level: "2nde", section: "A" },
    { name: "2nde C", level: "2nde", section: "C" },
    { name: "1ere A", level: "1ere", section: "A" },
    { name: "1ere D", level: "1ere", section: "D" },
    { name: "Tle A", level: "Terminale", section: "A" },
    { name: "Tle D", level: "Terminale", section: "D" },
  ];

  const classes: Record<string, string> = {};
  for (const c of classesData) {
    const created = await prisma.class.create({ data: c });
    classes[c.name] = created.id;
  }
  console.log("  Classes created:", Object.keys(classes).length);

  // ==================== Class Subjects (with coefficients) ====================
  const classSubjectMap: Record<string, { code: string; coeff: number }[]> = {
    "6eme A": [
      { code: "MATH", coeff: 4 }, { code: "FRA", coeff: 4 }, { code: "ANG", coeff: 3 },
      { code: "PC", coeff: 2 }, { code: "SVT", coeff: 2 }, { code: "HG", coeff: 2 },
      { code: "ECM", coeff: 2 }, { code: "INFO", coeff: 1 }, { code: "EPS", coeff: 2 },
    ],
    "6eme B": [
      { code: "MATH", coeff: 4 }, { code: "FRA", coeff: 4 }, { code: "ANG", coeff: 3 },
      { code: "PC", coeff: 2 }, { code: "SVT", coeff: 2 }, { code: "HG", coeff: 2 },
      { code: "ECM", coeff: 2 }, { code: "INFO", coeff: 1 }, { code: "EPS", coeff: 2 },
    ],
    "3eme A": [
      { code: "MATH", coeff: 4 }, { code: "FRA", coeff: 4 }, { code: "ANG", coeff: 3 },
      { code: "PC", coeff: 3 }, { code: "SVT", coeff: 3 }, { code: "HG", coeff: 3 },
      { code: "ECM", coeff: 2 }, { code: "INFO", coeff: 2 }, { code: "EPS", coeff: 2 },
      { code: "ESP", coeff: 2 },
    ],
  };

  const classSubjects: Record<string, string> = {};
  for (const [className, subs] of Object.entries(classSubjectMap)) {
    for (const s of subs) {
      const cs = await prisma.classSubject.create({
        data: { classId: classes[className], subjectId: subjects[s.code], coefficient: s.coeff },
      });
      classSubjects[`${className}-${s.code}`] = cs.id;
    }
  }
  console.log("  Class subjects assigned");

  // ==================== Users: Admin ====================
  const adminUser = await prisma.user.create({
    data: {
      email: "admin@college-negou.cm",
      role: UserRole.ADMIN,
      supabaseId: "admin-seed-supabase-id",
    },
  });
  console.log("  Admin user created:", adminUser.email);

  // ==================== Teachers ====================
  const teachersData = [
    { firstName: "Jean", lastName: "NKOUATCHOU", gender: Gender.MALE, specialty: "Mathematiques", email: "j.nkouatchou@college-negou.cm" },
    { firstName: "Marie", lastName: "FOUDA", gender: Gender.FEMALE, specialty: "Francais", email: "m.fouda@college-negou.cm" },
    { firstName: "Paul", lastName: "TAGNE", gender: Gender.MALE, specialty: "Physique-Chimie", email: "p.tagne@college-negou.cm" },
    { firstName: "Therese", lastName: "KAMGA", gender: Gender.FEMALE, specialty: "Anglais", email: "t.kamga@college-negou.cm" },
    { firstName: "Samuel", lastName: "MBARGA", gender: Gender.MALE, specialty: "Histoire-Geographie", email: "s.mbarga@college-negou.cm" },
  ];

  const teachers: Record<string, string> = {};
  for (const t of teachersData) {
    const user = await prisma.user.create({
      data: { email: t.email, role: UserRole.TEACHER, supabaseId: `teacher-seed-${t.email}` },
    });
    const teacher = await prisma.teacher.create({
      data: {
        userId: user.id, firstName: t.firstName, lastName: t.lastName,
        gender: t.gender, specialty: t.specialty, phone: "6" + Math.floor(10000000 + Math.random() * 90000000),
      },
    });
    teachers[t.specialty!] = teacher.id;
  }
  console.log("  Teachers created:", Object.keys(teachers).length);

  // ==================== Teacher Assignments ====================
  const assignmentsMap: { teacher: string; className: string; code: string }[] = [
    { teacher: "Mathematiques", className: "6eme A", code: "MATH" },
    { teacher: "Mathematiques", className: "6eme B", code: "MATH" },
    { teacher: "Mathematiques", className: "3eme A", code: "MATH" },
    { teacher: "Francais", className: "6eme A", code: "FRA" },
    { teacher: "Francais", className: "6eme B", code: "FRA" },
    { teacher: "Francais", className: "3eme A", code: "FRA" },
    { teacher: "Physique-Chimie", className: "6eme A", code: "PC" },
    { teacher: "Physique-Chimie", className: "3eme A", code: "PC" },
    { teacher: "Anglais", className: "6eme A", code: "ANG" },
    { teacher: "Anglais", className: "6eme B", code: "ANG" },
    { teacher: "Anglais", className: "3eme A", code: "ANG" },
    { teacher: "Histoire-Geographie", className: "6eme A", code: "HG" },
    { teacher: "Histoire-Geographie", className: "3eme A", code: "HG" },
  ];

  for (const a of assignmentsMap) {
    const csKey = `${a.className}-${a.code}`;
    if (classSubjects[csKey] && teachers[a.teacher]) {
      await prisma.teacherAssignment.create({
        data: {
          teacherId: teachers[a.teacher],
          classId: classes[a.className],
          classSubjectId: classSubjects[csKey],
        },
      });
    }
  }
  console.log("  Teacher assignments created");

  // ==================== Students ====================
  const studentNames = [
    { firstName: "Aline", lastName: "TCHINDA", gender: Gender.FEMALE, dob: "2012-03-15", pob: "Bafoussam" },
    { firstName: "Boris", lastName: "DJOMO", gender: Gender.MALE, dob: "2012-07-22", pob: "Douala" },
    { firstName: "Carine", lastName: "NGOUFACK", gender: Gender.FEMALE, dob: "2011-11-08", pob: "Yaounde" },
    { firstName: "David", lastName: "KUATE", gender: Gender.MALE, dob: "2012-01-30", pob: "Bafoussam" },
    { firstName: "Estelle", lastName: "FOTSO", gender: Gender.FEMALE, dob: "2012-05-18", pob: "Dschang" },
    { firstName: "Franck", lastName: "TALLA", gender: Gender.MALE, dob: "2011-09-12", pob: "Mbouda" },
    { firstName: "Grace", lastName: "MEKUI", gender: Gender.FEMALE, dob: "2012-02-28", pob: "Bafoussam" },
    { firstName: "Herve", lastName: "WAMBA", gender: Gender.MALE, dob: "2011-12-05", pob: "Bamenda" },
    { firstName: "Irene", lastName: "SIMO", gender: Gender.FEMALE, dob: "2007-04-10", pob: "Bafoussam" },
    { firstName: "Junior", lastName: "NGASSA", gender: Gender.MALE, dob: "2007-08-25", pob: "Douala" },
  ];

  const studentIds: string[] = [];
  for (let i = 0; i < studentNames.length; i++) {
    const s = studentNames[i];
    const matricule = `CPN-2025-${String(i + 1).padStart(4, "0")}`;
    const email = `${s.firstName.toLowerCase()}.${s.lastName.toLowerCase()}@eleve.college-negou.cm`;

    const user = await prisma.user.create({
      data: { email, role: UserRole.STUDENT, supabaseId: `student-seed-${email}` },
    });

    const student = await prisma.student.create({
      data: {
        userId: user.id, matricule, firstName: s.firstName, lastName: s.lastName,
        dateOfBirth: new Date(s.dob), gender: s.gender, placeOfBirth: s.pob,
      },
    });
    studentIds.push(student.id);

    // Enroll: first 8 in 6eme A, last 2 in 3eme A
    const className = i < 8 ? "6eme A" : "3eme A";
    await prisma.enrollment.create({
      data: { studentId: student.id, classId: classes[className], academicYearId: year.id },
    });
  }
  console.log("  Students created and enrolled:", studentIds.length);

  // ==================== Parents ====================
  const parentsData = [
    { firstName: "Pierre", lastName: "TCHINDA", phone: "677123456", email: "p.tchinda@gmail.com", childIdx: 0 },
    { firstName: "Pauline", lastName: "DJOMO", phone: "699876543", email: "p.djomo@gmail.com", childIdx: 1 },
    { firstName: "Jacques", lastName: "NGOUFACK", phone: "680112233", email: "j.ngoufack@gmail.com", childIdx: 2 },
  ];

  for (const pd of parentsData) {
    const user = await prisma.user.create({
      data: { email: pd.email, role: UserRole.PARENT, supabaseId: `parent-seed-${pd.email}` },
    });
    const parent = await prisma.parent.create({
      data: { userId: user.id, firstName: pd.firstName, lastName: pd.lastName, phone: pd.phone },
    });
    await prisma.parentStudent.create({
      data: { parentId: parent.id, studentId: studentIds[pd.childIdx] },
    });
  }
  console.log("  Parents created: 3");

  // ==================== Sample Grades (1er Trimestre, 6eme A) ====================
  const term1 = year.terms.find((t) => t.sequenceNumber === 1)!;
  const mathTeacherId = teachers["Mathematiques"];

  // Give grades to first 8 students (6eme A) in Math
  const mathCsId = classSubjects["6eme A-MATH"];
  if (mathCsId && mathTeacherId) {
    for (let i = 0; i < 8; i++) {
      const baseGrade = 8 + Math.random() * 10;
      await prisma.grade.createMany({
        data: [
          { studentId: studentIds[i], classSubjectId: mathCsId, termId: term1.id, teacherId: mathTeacherId, type: GradeType.DEVOIR, value: Math.round((baseGrade + Math.random() * 4) * 100) / 100 },
          { studentId: studentIds[i], classSubjectId: mathCsId, termId: term1.id, teacherId: mathTeacherId, type: GradeType.INTERROGATION, value: Math.round((baseGrade + Math.random() * 3) * 100) / 100 },
          { studentId: studentIds[i], classSubjectId: mathCsId, termId: term1.id, teacherId: mathTeacherId, type: GradeType.COMPOSITION, value: Math.round((baseGrade + Math.random() * 5) * 100) / 100 },
        ],
      });
    }
  }
  console.log("  Sample grades created for Maths 6eme A");

  // ==================== Fee Structures ====================
  const feeLevels = ["6eme", "5eme", "4eme", "3eme", "2nde", "1ere", "Terminale"];
  for (const level of feeLevels) {
    const baseAmount = level === "6eme" || level === "5eme" ? 50000 : level === "4eme" || level === "3eme" ? 65000 : 75000;
    await prisma.feeStructure.createMany({
      data: [
        { academicYearId: year.id, level, feeType: FeeType.INSCRIPTION, amount: 25000 },
        { academicYearId: year.id, level, feeType: FeeType.SCOLARITE_TRANCHE_1, amount: baseAmount },
        { academicYearId: year.id, level, feeType: FeeType.SCOLARITE_TRANCHE_2, amount: baseAmount },
        { academicYearId: year.id, level, feeType: FeeType.SCOLARITE_TRANCHE_3, amount: baseAmount },
        { academicYearId: year.id, level, feeType: FeeType.APEE, amount: 15000 },
        { academicYearId: year.id, level, feeType: FeeType.INFORMATIQUE, amount: 10000 },
      ],
    });
  }
  console.log("  Fee structures created for all levels");

  // ==================== Timetable (6eme A, sample) ====================
  const timetableData = [
    { day: DayOfWeek.MONDAY, start: "07:30", end: "08:30", subject: "Mathematiques", teacher: "M. NKOUATCHOU" },
    { day: DayOfWeek.MONDAY, start: "08:30", end: "09:30", subject: "Mathematiques", teacher: "M. NKOUATCHOU" },
    { day: DayOfWeek.MONDAY, start: "09:45", end: "10:45", subject: "Francais", teacher: "Mme FOUDA" },
    { day: DayOfWeek.MONDAY, start: "10:45", end: "11:45", subject: "Francais", teacher: "Mme FOUDA" },
    { day: DayOfWeek.MONDAY, start: "12:30", end: "13:30", subject: "Anglais", teacher: "Mme KAMGA" },
    { day: DayOfWeek.TUESDAY, start: "07:30", end: "08:30", subject: "Physique-Chimie", teacher: "M. TAGNE" },
    { day: DayOfWeek.TUESDAY, start: "08:30", end: "09:30", subject: "Physique-Chimie", teacher: "M. TAGNE" },
    { day: DayOfWeek.TUESDAY, start: "09:45", end: "10:45", subject: "Histoire-Geographie", teacher: "M. MBARGA" },
    { day: DayOfWeek.TUESDAY, start: "10:45", end: "11:45", subject: "Histoire-Geographie", teacher: "M. MBARGA" },
    { day: DayOfWeek.WEDNESDAY, start: "07:30", end: "08:30", subject: "Anglais", teacher: "Mme KAMGA" },
    { day: DayOfWeek.WEDNESDAY, start: "08:30", end: "09:30", subject: "Mathematiques", teacher: "M. NKOUATCHOU" },
    { day: DayOfWeek.WEDNESDAY, start: "09:45", end: "10:45", subject: "Francais", teacher: "Mme FOUDA" },
    { day: DayOfWeek.THURSDAY, start: "07:30", end: "09:30", subject: "EPS", teacher: "M. KOUAM" },
    { day: DayOfWeek.THURSDAY, start: "09:45", end: "10:45", subject: "Informatique", teacher: "M. TAGNE" },
    { day: DayOfWeek.THURSDAY, start: "10:45", end: "11:45", subject: "Education Civique", teacher: "M. MBARGA" },
    { day: DayOfWeek.FRIDAY, start: "07:30", end: "08:30", subject: "SVT", teacher: "M. TAGNE" },
    { day: DayOfWeek.FRIDAY, start: "08:30", end: "09:30", subject: "SVT", teacher: "M. TAGNE" },
    { day: DayOfWeek.FRIDAY, start: "09:45", end: "10:45", subject: "Mathematiques", teacher: "M. NKOUATCHOU" },
    { day: DayOfWeek.FRIDAY, start: "10:45", end: "11:45", subject: "Francais", teacher: "Mme FOUDA" },
  ];

  for (const slot of timetableData) {
    await prisma.timetableSlot.create({
      data: {
        classId: classes["6eme A"],
        subjectName: slot.subject,
        teacherName: slot.teacher,
        dayOfWeek: slot.day,
        startTime: slot.start,
        endTime: slot.end,
      },
    });
  }
  console.log("  Timetable created for 6eme A");

  // ==================== Announcements ====================
  await prisma.announcement.createMany({
    data: [
      { title: "Rentree scolaire 2025-2026", content: "La rentree scolaire est fixee au 2 septembre 2025. Tous les eleves sont attendus a 7h30 pour la ceremonie d'ouverture." },
      { title: "Conseil de classe du 1er trimestre", content: "Les conseils de classe du premier trimestre se tiendront du 16 au 20 decembre 2025. Les parents delegues sont invites a y participer.", targetRole: UserRole.PARENT },
      { title: "Competitions inter-classes", content: "Les competitions sportives inter-classes debuteront le 15 janvier 2026. Inscrivez-vous aupres de votre professeur d'EPS.", targetRole: UserRole.STUDENT },
    ],
  });
  console.log("  Announcements created");

  // ==================== Events ====================
  await prisma.event.createMany({
    data: [
      { title: "Journee portes ouvertes", description: "Venez decouvrir le College Polyvalent Negou lors de notre journee portes ouvertes. Visite des locaux, rencontre avec les enseignants et presentations des programmes.", date: new Date("2026-03-15"), location: "Campus principal" },
      { title: "Fete de la jeunesse", description: "Celebration de la Fete nationale de la jeunesse avec defile, activites culturelles et sportives.", date: new Date("2026-02-11"), location: "Stade municipal de Bafoussam" },
      { title: "Remise des prix d'excellence", description: "Ceremonie de remise des prix aux meilleurs eleves de l'annee scolaire 2025-2026.", date: new Date("2026-06-28"), location: "Salle des fetes" },
    ],
  });
  console.log("  Events created");

  // ==================== News Articles ====================
  await prisma.newsArticle.createMany({
    data: [
      {
        title: "Resultats exceptionnels au BEPC 2025",
        slug: "resultats-bepc-2025",
        content: "Le College Polyvalent Negou est fier d'annoncer un taux de reussite de 92% au BEPC session 2025. Felicitations a tous nos eleves et enseignants pour ce resultat remarquable.",
        excerpt: "92% de reussite au BEPC 2025 - un record pour notre etablissement.",
      },
      {
        title: "Nouveau laboratoire d'informatique",
        slug: "nouveau-labo-informatique",
        content: "Grace au soutien de nos partenaires, le college dispose desormais d'un laboratoire informatique equipe de 30 ordinateurs. Les cours d'informatique seront renforces des la rentree 2025.",
        excerpt: "Un nouveau laboratoire de 30 postes pour nos eleves.",
      },
      {
        title: "Partenariat avec l'Universite de Dschang",
        slug: "partenariat-universite-dschang",
        content: "Le College Polyvalent Negou a signe un accord de partenariat avec l'Universite de Dschang pour l'accompagnement de nos eleves de Terminale dans leur orientation universitaire.",
        excerpt: "Un nouveau partenariat pour mieux orienter nos eleves.",
      },
    ],
  });
  console.log("  News articles created");

  console.log("\nSeed completed successfully!");
  console.log("Accounts created:");
  console.log("  Admin: admin@college-negou.cm");
  console.log("  Teachers: j.nkouatchou@, m.fouda@, p.tagne@, t.kamga@, s.mbarga@ @college-negou.cm");
  console.log("  Students: aline.tchinda@, boris.djomo@, ... @eleve.college-negou.cm");
  console.log("  Parents: p.tchinda@, p.djomo@, j.ngoufack@ @gmail.com");
  console.log("\nNote: These seed users have placeholder supabaseIds.");
  console.log("For real auth, create users in Supabase Auth first, then update supabaseId.");
}

main()
  .then(async () => { await prisma.$disconnect(); })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
