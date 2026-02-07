"use client";

import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";
import {
  SCHOOL_NAME,
  SCHOOL_CITY,
  SCHOOL_MOTTO,
  SCHOOL_PHONE,
  SCHOOL_ADDRESS,
} from "@/config/cameroon-education";

Font.register({
  family: "Helvetica",
  fonts: [
    { src: "Helvetica" },
    { src: "Helvetica-Bold", fontWeight: "bold" },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 9,
    fontFamily: "Helvetica",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    borderBottom: "2px solid #1a365d",
    paddingBottom: 8,
  },
  headerLeft: {
    width: "45%",
    textAlign: "center",
  },
  headerRight: {
    width: "45%",
    textAlign: "center",
  },
  headerTitle: {
    fontSize: 8,
    marginBottom: 2,
  },
  schoolName: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#1a365d",
    marginBottom: 2,
  },
  bulletinTitle: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 8,
    color: "#1a365d",
    textTransform: "uppercase",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 3,
  },
  infoText: {
    fontSize: 9,
  },
  infoLabel: {
    fontWeight: "bold",
    fontSize: 9,
  },
  studentInfoContainer: {
    border: "1px solid #cbd5e0",
    padding: 8,
    marginBottom: 10,
    borderRadius: 3,
    backgroundColor: "#f7fafc",
  },
  table: {
    marginBottom: 10,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#1a365d",
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 7,
    padding: 4,
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "0.5px solid #e2e8f0",
    padding: 3,
    fontSize: 8,
  },
  tableRowAlt: {
    flexDirection: "row",
    borderBottom: "0.5px solid #e2e8f0",
    padding: 3,
    fontSize: 8,
    backgroundColor: "#f7fafc",
  },
  colSubject: { width: "22%" },
  colAvg: { width: "10%", textAlign: "center" },
  colCoeff: { width: "8%", textAlign: "center" },
  colTotal: { width: "10%", textAlign: "center" },
  colClassAvg: { width: "10%", textAlign: "center" },
  colMin: { width: "8%", textAlign: "center" },
  colMax: { width: "8%", textAlign: "center" },
  colAppreciation: { width: "14%", textAlign: "center" },
  colTeacher: { width: "10%", textAlign: "center" },
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    border: "1px solid #cbd5e0",
    borderRadius: 3,
  },
  summaryBox: {
    padding: 8,
    width: "25%",
    textAlign: "center",
    borderRight: "0.5px solid #cbd5e0",
  },
  summaryLabel: {
    fontSize: 7,
    color: "#718096",
    marginBottom: 2,
  },
  summaryValue: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1a365d",
  },
  observationsContainer: {
    marginBottom: 10,
  },
  observationBox: {
    border: "1px solid #cbd5e0",
    padding: 8,
    marginBottom: 6,
    borderRadius: 3,
    minHeight: 40,
  },
  observationLabel: {
    fontWeight: "bold",
    fontSize: 8,
    marginBottom: 3,
    color: "#1a365d",
  },
  observationText: {
    fontSize: 8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    paddingTop: 10,
    borderTop: "1px solid #cbd5e0",
  },
  signatureBlock: {
    width: "30%",
    textAlign: "center",
  },
  signatureLabel: {
    fontSize: 8,
    fontWeight: "bold",
    marginBottom: 25,
  },
  signatureLine: {
    borderTop: "1px solid #000",
    width: "80%",
    marginHorizontal: "auto",
  },
  redText: {
    color: "#e53e3e",
  },
  greenText: {
    color: "#38a169",
  },
});

export type BulletinPDFData = {
  student: {
    firstName: string;
    lastName: string;
    matricule: string;
    dateOfBirth?: string | null;
  };
  term: {
    name: string;
    academicYear: { name: string };
  };
  className?: string;
  generalAverage: number | null;
  rank: number | null;
  totalStudents: number | null;
  classAverage: number | null;
  teacherComment: string | null;
  principalComment: string | null;
  decision: string | null;
  subjectResults: {
    id: string;
    average: number;
    coefficient: number;
    total: number;
    classAverage: number | null;
    classMin: number | null;
    classMax: number | null;
    appreciation: string | null;
    teacherName: string | null;
    classSubject: { subject: { name: string; category: string } };
  }[];
};

export function BulletinPDF({ data }: { data: BulletinPDFData }) {
  const today = new Date().toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Republique du Cameroun</Text>
            <Text style={styles.headerTitle}>Paix - Travail - Patrie</Text>
            <Text style={styles.headerTitle}>Ministere des Enseignements Secondaires</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.schoolName}>{SCHOOL_NAME}</Text>
            <Text style={styles.headerTitle}>{SCHOOL_ADDRESS}</Text>
            <Text style={styles.headerTitle}>Tel: {SCHOOL_PHONE}</Text>
            <Text style={styles.headerTitle}>{SCHOOL_MOTTO}</Text>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.bulletinTitle}>
          Bulletin de Notes - {data.term.name}
        </Text>

        {/* Student info */}
        <View style={styles.studentInfoContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.infoText}>
              <Text style={styles.infoLabel}>Nom et Prenom: </Text>
              {data.student.lastName} {data.student.firstName}
            </Text>
            <Text style={styles.infoText}>
              <Text style={styles.infoLabel}>Matricule: </Text>
              {data.student.matricule}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoText}>
              <Text style={styles.infoLabel}>Classe: </Text>
              {data.className || "N/A"}
            </Text>
            <Text style={styles.infoText}>
              <Text style={styles.infoLabel}>Annee scolaire: </Text>
              {data.term.academicYear.name}
            </Text>
          </View>
          {data.student.dateOfBirth && (
            <View style={styles.infoRow}>
              <Text style={styles.infoText}>
                <Text style={styles.infoLabel}>Date de naissance: </Text>
                {data.student.dateOfBirth}
              </Text>
            </View>
          )}
        </View>

        {/* Grades table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.colSubject}>Matiere</Text>
            <Text style={styles.colAvg}>Moy/20</Text>
            <Text style={styles.colCoeff}>Coeff</Text>
            <Text style={styles.colTotal}>Total</Text>
            <Text style={styles.colClassAvg}>Moy Cl.</Text>
            <Text style={styles.colMin}>Min</Text>
            <Text style={styles.colMax}>Max</Text>
            <Text style={styles.colAppreciation}>Appreciation</Text>
            <Text style={styles.colTeacher}>Enseignant</Text>
          </View>
          {data.subjectResults.map((sr, i) => (
            <View key={sr.id} style={i % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
              <Text style={styles.colSubject}>{sr.classSubject.subject.name}</Text>
              <Text style={[styles.colAvg, sr.average >= 10 ? styles.greenText : styles.redText]}>
                {sr.average.toFixed(2)}
              </Text>
              <Text style={styles.colCoeff}>{sr.coefficient}</Text>
              <Text style={styles.colTotal}>{sr.total.toFixed(2)}</Text>
              <Text style={styles.colClassAvg}>{sr.classAverage?.toFixed(2) ?? "-"}</Text>
              <Text style={styles.colMin}>{sr.classMin?.toFixed(2) ?? "-"}</Text>
              <Text style={styles.colMax}>{sr.classMax?.toFixed(2) ?? "-"}</Text>
              <Text style={styles.colAppreciation}>{sr.appreciation ?? "-"}</Text>
              <Text style={styles.colTeacher}>{sr.teacherName ?? "-"}</Text>
            </View>
          ))}
        </View>

        {/* Summary */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryLabel}>Moyenne Generale</Text>
            <Text style={[styles.summaryValue, (data.generalAverage || 0) >= 10 ? styles.greenText : styles.redText]}>
              {data.generalAverage?.toFixed(2) ?? "0.00"}/20
            </Text>
          </View>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryLabel}>Rang</Text>
            <Text style={styles.summaryValue}>
              {data.rank ?? "-"}/{data.totalStudents ?? "-"}
            </Text>
          </View>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryLabel}>Effectif</Text>
            <Text style={styles.summaryValue}>{data.totalStudents ?? "-"}</Text>
          </View>
          <View style={[styles.summaryBox, { borderRight: "none" }]}>
            <Text style={styles.summaryLabel}>Moyenne de classe</Text>
            <Text style={styles.summaryValue}>
              {data.classAverage?.toFixed(2) ?? "0.00"}/20
            </Text>
          </View>
        </View>

        {/* Observations */}
        <View style={styles.observationsContainer}>
          <View style={styles.observationBox}>
            <Text style={styles.observationLabel}>Observation du professeur titulaire:</Text>
            <Text style={styles.observationText}>{data.teacherComment || ""}</Text>
          </View>
          <View style={styles.observationBox}>
            <Text style={styles.observationLabel}>Observation du Chef d&apos;Etablissement:</Text>
            <Text style={styles.observationText}>{data.principalComment || ""}</Text>
          </View>
          {data.decision && (
            <View style={styles.observationBox}>
              <Text style={styles.observationLabel}>Decision du conseil de classe:</Text>
              <Text style={styles.observationText}>{data.decision}</Text>
            </View>
          )}
        </View>

        {/* Footer with signatures */}
        <View style={styles.footer}>
          <View style={styles.signatureBlock}>
            <Text style={styles.signatureLabel}>Le Professeur Titulaire</Text>
            <View style={styles.signatureLine} />
          </View>
          <View style={styles.signatureBlock}>
            <Text style={styles.signatureLabel}>Le Parent</Text>
            <View style={styles.signatureLine} />
          </View>
          <View style={styles.signatureBlock}>
            <Text style={styles.signatureLabel}>Le Chef d&apos;Etablissement</Text>
            <View style={styles.signatureLine} />
          </View>
        </View>

        <Text style={{ textAlign: "center", fontSize: 7, marginTop: 10, color: "#a0aec0" }}>
          Fait a {SCHOOL_CITY}, le {today}
        </Text>
      </Page>
    </Document>
  );
}
