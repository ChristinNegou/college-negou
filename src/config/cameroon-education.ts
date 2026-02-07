export const SCHOOL_NAME = "College Polyvalent Negou";
export const SCHOOL_SHORT_NAME = "CPN";
export const SCHOOL_CITY = "Bafoussam";
export const SCHOOL_REGION = "Region de l'Ouest";
export const SCHOOL_COUNTRY = "Cameroun";
export const SCHOOL_PHONE = "+237 6XX XXX XXX";
export const SCHOOL_EMAIL = "contact@college-negou.cm";
export const SCHOOL_ADDRESS = "Bafoussam, Region de l'Ouest, Cameroun";
export const SCHOOL_MOTTO = "Excellence, Discipline, Reussite";

export const LEVELS = [
  { value: "6eme", label: "6eme", cycle: "college" },
  { value: "5eme", label: "5eme", cycle: "college" },
  { value: "4eme", label: "4eme", cycle: "college" },
  { value: "3eme", label: "3eme", cycle: "college" },
  { value: "2nde", label: "2nde", cycle: "lycee" },
  { value: "1ere", label: "1ere", cycle: "lycee" },
  { value: "Tle", label: "Terminale", cycle: "lycee" },
] as const;

export const SERIES = [
  { value: "A", label: "Serie A - Lettres", levels: ["1ere", "Tle"] },
  { value: "C", label: "Serie C - Mathematiques", levels: ["1ere", "Tle"] },
  { value: "D", label: "Serie D - Sciences", levels: ["1ere", "Tle"] },
] as const;

export const SUBJECTS = [
  // Sciences
  { name: "Mathematiques", code: "MATH", category: "Sciences", defaultCoeff: 4 },
  { name: "Physique", code: "PHY", category: "Sciences", defaultCoeff: 3 },
  { name: "Chimie", code: "CHI", category: "Sciences", defaultCoeff: 2 },
  { name: "Sciences de la Vie et de la Terre", code: "SVT", category: "Sciences", defaultCoeff: 3 },
  { name: "Informatique", code: "INFO", category: "Sciences", defaultCoeff: 2 },

  // Lettres
  { name: "Francais", code: "FRA", category: "Lettres", defaultCoeff: 4 },
  { name: "Litterature", code: "LIT", category: "Lettres", defaultCoeff: 2 },
  { name: "Philosophie", code: "PHILO", category: "Lettres", defaultCoeff: 3 },

  // Langues
  { name: "Anglais", code: "ANG", category: "Langues", defaultCoeff: 3 },
  { name: "Espagnol", code: "ESP", category: "Langues", defaultCoeff: 2 },
  { name: "Allemand", code: "ALL", category: "Langues", defaultCoeff: 2 },

  // Sciences humaines
  { name: "Histoire", code: "HIST", category: "Sciences Humaines", defaultCoeff: 2 },
  { name: "Geographie", code: "GEO", category: "Sciences Humaines", defaultCoeff: 2 },
  { name: "Education Civique et Morale", code: "ECM", category: "Sciences Humaines", defaultCoeff: 2 },

  // Arts et sport
  { name: "Education Physique et Sportive", code: "EPS", category: "Arts et Sport", defaultCoeff: 2 },
  { name: "Dessin / Arts Plastiques", code: "ART", category: "Arts et Sport", defaultCoeff: 1 },
  { name: "Musique", code: "MUS", category: "Arts et Sport", defaultCoeff: 1 },

  // Technique
  { name: "Travail Manuel", code: "TM", category: "Technique", defaultCoeff: 1 },
  { name: "Economie Sociale et Familiale", code: "ESF", category: "Technique", defaultCoeff: 1 },
] as const;

export const TIMETABLE_SLOTS = [
  { start: "07:30", end: "08:30", label: "1ere heure" },
  { start: "08:30", end: "09:30", label: "2eme heure" },
  { start: "09:30", end: "10:00", label: "Pause" },
  { start: "10:00", end: "11:00", label: "3eme heure" },
  { start: "11:00", end: "12:00", label: "4eme heure" },
  { start: "12:00", end: "12:30", label: "Pause dejeuner" },
  { start: "12:30", end: "13:30", label: "5eme heure" },
  { start: "13:30", end: "14:30", label: "6eme heure" },
  { start: "14:30", end: "15:30", label: "7eme heure" },
] as const;

export const DAYS_OF_WEEK = [
  { value: "MONDAY", label: "Lundi" },
  { value: "TUESDAY", label: "Mardi" },
  { value: "WEDNESDAY", label: "Mercredi" },
  { value: "THURSDAY", label: "Jeudi" },
  { value: "FRIDAY", label: "Vendredi" },
  { value: "SATURDAY", label: "Samedi" },
] as const;

export const FEE_TYPE_LABELS: Record<string, string> = {
  INSCRIPTION: "Frais d'inscription",
  SCOLARITE_TRANCHE_1: "Scolarite - 1ere tranche",
  SCOLARITE_TRANCHE_2: "Scolarite - 2eme tranche",
  SCOLARITE_TRANCHE_3: "Scolarite - 3eme tranche",
  APEE: "APEE (Association des Parents)",
  INFORMATIQUE: "Frais d'informatique",
  AUTRE: "Autres frais",
};

export const GRADE_APPRECIATIONS = [
  { min: 16, max: 20, label: "Tres Bien" },
  { min: 14, max: 15.99, label: "Bien" },
  { min: 12, max: 13.99, label: "Assez Bien" },
  { min: 10, max: 11.99, label: "Passable" },
  { min: 8, max: 9.99, label: "Insuffisant" },
  { min: 0, max: 7.99, label: "Faible" },
] as const;

export function getAppreciation(average: number): string {
  const appreciation = GRADE_APPRECIATIONS.find(
    (a) => average >= a.min && average <= a.max
  );
  return appreciation?.label ?? "Non evalue";
}

export function generateMatricule(year: number, sequence: number): string {
  return `CPN-${year}-${String(sequence).padStart(4, "0")}`;
}
