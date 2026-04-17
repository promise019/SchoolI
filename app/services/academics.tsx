import React, { useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, View as DefaultView, LayoutAnimation, Platform, UIManager, Alert, ActivityIndicator } from 'react-native';
import { Text, View, Card, ScreenContainer } from '../../components/Themed';
import { 
  GraduationCap, 
  ChevronDown, 
  ChevronUp, 
  TrendingUp, 
  Award,
  BookOpen,
  Calendar,
  ChevronLeft,
  Download
} from 'lucide-react-native';
import { router } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const ACADEMIC_DATA = {
  cgpa: 3.84,
  level: 400,
  totalUnits: 124,
  studentName: "John Doe",
  studentId: "CSC/2026/001",
  department: "Computer Science",
  semesters: [
    {
      id: "4-1",
      title: "Year 4 - Semester 1",
      gpa: 3.92,
      courses: [
        { code: "CSC 411", title: "Artificial Intelligence", units: 3, grade: "A", points: 15, score: 75 },
        { code: "CSC 412", title: "Compiler Construction", units: 3, grade: "B", points: 12, score: 68 },
        { code: "CSC 413", title: "Software Engineering II", units: 2, grade: "A", points: 10, score: 82 },
        { code: "GST 411", title: "Entrepreneurship", units: 1, grade: "A", points: 5, score: 90 }
      ]
    },
    {
      id: "3-2",
      title: "Year 3 - Semester 2",
      gpa: 3.78,
      courses: [
        { code: "CSC 321", title: "Operating Systems", units: 3, grade: "B", points: 12, score: 64 },
        { code: "CSC 322", title: "Database Systems", units: 3, grade: "A", points: 15, score: 78 },
        { code: "CSC 323", title: "Graphics Programming", units: 2, grade: "C", points: 6, score: 55 },
        { code: "CSC 324", title: "Computer Networks", units: 3, grade: "B", points: 12, score: 66 }
      ]
    },
    {
      id: "3-1",
      title: "Year 3 - Semester 1",
      gpa: 3.85,
      courses: [
        { code: "CSC 311", title: "Automata Theory", units: 3, grade: "A", points: 15, score: 88 },
        { code: "CSC 312", title: "Discrete Structures", units: 3, grade: "A", points: 15, score: 92 },
        { code: "CSC 313", title: "Algorithms & Complexity", units: 3, grade: "B", points: 12, score: 69 }
      ]
    }
  ]
};

export default function AcademicsScreen() {
  const theme = useColorScheme() ?? 'light';
  const colors = Colors[theme];
  const [expandedId, setExpandedId] = useState<string | null>("4-1");
  const [isGenerating, setIsGenerating] = useState(false);

  const toggleExpand = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  const handleDownloadPDF = async (semester: any) => {
    try {
      setIsGenerating(true);
      
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Helvetica', 'Arial', sans-serif; padding: 40px; color: #333; }
            .header { text-align: center; border-bottom: 2px solid #6366f1; padding-bottom: 20px; margin-bottom: 30px; }
            .school-name { font-size: 28px; font-weight: bold; color: #6366f1; text-transform: uppercase; margin: 0; }
            .doc-title { font-size: 18px; margin-top: 5px; color: #64748b; }
            .student-info { display: flex; justify-content: space-between; margin-bottom: 30px; background: #f8fafc; padding: 20px; border-radius: 10px; }
            .info-col { flex: 1; }
            .info-label { font-size: 10px; color: #94a3b8; text-transform: uppercase; font-weight: bold; }
            .info-value { font-size: 14px; font-weight: bold; margin-top: 4px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            th { text-align: left; background-color: #f1f5f9; padding: 12px; font-size: 12px; text-transform: uppercase; color: #475569; }
            td { padding: 12px; border-bottom: 1px solid #e2e8f0; font-size: 12px; }
            .footer { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #e2e8f0; padding-top: 20px; }
            .summary-box { background: #6366f1; color: white; padding: 15px 25px; border-radius: 12px; text-align: right; }
            .summary-label { font-size: 10px; opacity: 0.8; text-transform: uppercase; }
            .summary-value { font-size: 20px; font-weight: bold; }
            .timestamp { font-size: 10px; color: #94a3b8; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 class="school-name">SchoolI University</h1>
            <div class="doc-title">Official Semester Result Slip</div>
          </div>
          
          <div class="student-info">
            <div class="info-col">
              <div class="info-label">Student Name</div>
              <div class="info-value">${ACADEMIC_DATA.studentName.toUpperCase()}</div>
              <div style="margin-top: 15px;" class="info-label">Registration Number</div>
              <div class="info-value">${ACADEMIC_DATA.studentId}</div>
            </div>
            <div class="info-col">
              <div class="info-label">Department</div>
              <div class="info-value">${ACADEMIC_DATA.department}</div>
              <div style="margin-top: 15px;" class="info-label">Level / CGPA</div>
              <div class="info-value">${ACADEMIC_DATA.level}L | ${ACADEMIC_DATA.cgpa}</div>
            </div>
          </div>

          <h3>Semester: ${semester.title}</h3>
          
          <table>
            <thead>
              <tr>
                <th style="width: 15%;">Code</th>
                <th style="width: 55%;">Course Title</th>
                <th style="width: 10%; text-align: center;">Units</th>
                <th style="width: 10%; text-align: center;">Grade</th>
                <th style="width: 10%; text-align: center;">Pts</th>
              </tr>
            </thead>
            <tbody>
              ${semester.courses.map((c: any) => `
                <tr>
                  <td>${c.code}</td>
                  <td>${c.title}</td>
                  <td style="text-align: center;">${c.units}</td>
                  <td style="text-align: center;">${c.grade}</td>
                  <td style="text-align: center;">${c.points}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="footer">
            <div class="timestamp">Generated on ${new Date().toLocaleDateString()} via SchoolI Student Companion</div>
            <div class="summary-box">
              <div class="summary-label">Semester GPA</div>
              <div class="summary-value">${semester.gpa} / 5.00</div>
            </div>
          </div>
        </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
      
    } catch (error) {
      console.error('PDF Generation Error:', error);
      Alert.alert('Error', 'Failed to generate academic record PDF.');
    } finally {
      setIsGenerating(false);
    }
  };

  const SummaryStat = ({ icon: Icon, label, value, color }: any) => (
    <View style={styles.statBox}>
      <View style={[styles.statIcon, { backgroundColor: color + '15' }]}>
        <Icon size={18} color={color} />
      </View>
      <View>
        <Text style={[styles.statLabel, { color: colors.secondaryText }]}>{label}</Text>
        <Text style={styles.statValue}>{value}</Text>
      </View>
    </View>
  );

  return (
    <ScreenContainer>
      <View style={styles.topNav}>
        <TouchableOpacity 
          onPress={() => router.back()}
          style={[styles.backBtn, { backgroundColor: colors.border + '30' }]}
        >
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Academic Records</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <Card style={[styles.profileCard, { backgroundColor: colors.primary }]}>
          <View style={styles.profileHeader}>
            <View>
              <Text style={styles.studentName}>{ACADEMIC_DATA.studentName}</Text>
              <Text style={styles.studentId}>{ACADEMIC_DATA.studentId}</Text>
              <Text style={styles.studentDept}>{ACADEMIC_DATA.department}</Text>
            </View>
            <View style={[styles.gpaBadge, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
              <Text style={styles.gpaValue}>{ACADEMIC_DATA.cgpa}</Text>
              <Text style={styles.gpaLabel}>CGPA</Text>
            </View>
          </View>
          
          <View style={styles.profileDivider} />
          
          <View style={styles.statsRow}>
            <SummaryStat 
              icon={TrendingUp} 
              label="Level" 
              value={`${ACADEMIC_DATA.level}L`} 
              color="#FFF" 
            />
            <SummaryStat 
              icon={BookOpen} 
              label="Total Units" 
              value={ACADEMIC_DATA.totalUnits} 
              color="#FFF" 
            />
            <SummaryStat 
              icon={Award} 
              label="Honor" 
              value="First Class" 
              color="#FFF" 
            />
          </View>
        </Card>

        <View style={styles.sectionHeader}>
          <Calendar size={20} color={colors.secondaryText} />
          <Text style={[styles.sectionTitle, { color: colors.secondaryText }]}>Semester History</Text>
        </View>

        {ACADEMIC_DATA.semesters.map((semester) => {
          const isExpanded = expandedId === semester.id;
          return (
            <Card key={semester.id} style={styles.semesterCard}>
              <View style={styles.semesterHeaderRow}>
                <TouchableOpacity 
                  onPress={() => toggleExpand(semester.id)}
                  activeOpacity={0.7}
                  style={styles.semesterHeader}
                >
                  <View style={styles.semesterInfo}>
                    <Text style={styles.semesterTitle}>{semester.title}</Text>
                    <View style={[styles.miniGpa, { backgroundColor: colors.primary + '10' }]}>
                      <Text style={[styles.miniGpaText, { color: colors.primary }]}>GPA: {semester.gpa}</Text>
                    </View>
                  </View>
                  {isExpanded ? <ChevronUp size={20} color={colors.secondaryText} /> : <ChevronDown size={20} color={colors.secondaryText} />}
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.downloadBtn, { backgroundColor: colors.primary + '10' }]}
                  onPress={() => handleDownloadPDF(semester)}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <ActivityIndicator size="small" color={colors.primary} />
                  ) : (
                    <Download size={18} color={colors.primary} />
                  )}
                </TouchableOpacity>
              </View>

              {isExpanded && (
                <View style={styles.coursesList}>
                  <View style={[styles.tableHeader, { borderBottomColor: colors.border }]}>
                    <Text style={[styles.tableHeadText, { flex: 2 }]}>Course</Text>
                    <Text style={[styles.tableHeadText, { flex: 0.5, textAlign: 'center' }]}>Cr</Text>
                    <Text style={[styles.tableHeadText, { flex: 0.5, textAlign: 'center' }]}>Gr</Text>
                    <Text style={[styles.tableHeadText, { flex: 0.5, textAlign: 'right' }]}>Pts</Text>
                  </View>
                  {semester.courses.map((course, idx) => (
                    <View key={idx} style={[styles.courseRow, { borderBottomColor: colors.border + '30' }]}>
                      <View style={{ flex: 2 }}>
                        <Text style={styles.courseCode}>{course.code}</Text>
                        <Text style={[styles.courseTitle, { color: colors.secondaryText }]} numberOfLines={1}>{course.title}</Text>
                      </View>
                      <Text style={[styles.courseValue, { flex: 0.5, textAlign: 'center' }]}>{course.units}</Text>
                      <View style={{ flex: 0.5, alignItems: 'center' }}>
                        <View style={[styles.gradeBadge, { backgroundColor: course.grade === 'A' ? '#10B981' + '20' : '#F59E0B' + '20' }]}>
                          <Text style={[styles.gradeText, { color: course.grade === 'A' ? '#10B981' : '#F59E0B' }]}>{course.grade}</Text>
                        </View>
                      </View>
                      <Text style={[styles.courseValue, { flex: 0.5, textAlign: 'right', fontWeight: '800' }]}>{course.points}</Text>
                    </View>
                  ))}
                  
                  <View style={[styles.semesterFooter, { backgroundColor: colors.border + '20' }]}>
                    <Text style={styles.footerLabel}>Semester Performance:</Text>
                    <Text style={[styles.footerValue, { color: colors.primary }]}>{semester.gpa} / 5.00</Text>
                  </View>
                </View>
              )}
            </Card>
          );
        })}

        <View style={styles.insightBox}>
          <GraduationCap size={40} color={colors.primary} style={{ opacity: 0.2 }} />
          <Text style={[styles.insightTitle, { color: colors.secondaryText }]}>KEEP IT UP!</Text>
          <Text style={[styles.insightText, { color: colors.secondaryText }]}>
            You are currently in the top 5% of your class. Maintain this momentum to graduate with First Class honors.
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  content: {
    padding: 20,
    paddingBottom: 60,
  },
  profileCard: {
    padding: 24,
    borderRadius: 28,
    marginBottom: 32,
    elevation: 8,
    borderWidth: 0,
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  studentName: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  studentId: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
  },
  studentDept: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  gpaBadge: {
    padding: 12,
    borderRadius: 20,
    alignItems: 'center',
    minWidth: 80,
  },
  gpaValue: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: '900',
  },
  gpaLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  profileDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginVertical: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.5) !important' as any,
  },
  statValue: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '800',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
    marginLeft: 4,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  semesterCard: {
    marginBottom: 16,
    padding: 0,
    overflow: 'hidden',
  },
  semesterHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
  },
  semesterHeader: {
    flex: 1,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  semesterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  semesterTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  miniGpa: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  miniGpaText: {
    fontSize: 12,
    fontWeight: '700',
  },
  downloadBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coursesList: {
    padding: 20,
    paddingTop: 0,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingBottom: 8,
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  tableHeadText: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    opacity: 0.5,
  },
  courseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  courseCode: {
    fontSize: 14,
    fontWeight: '800',
  },
  courseTitle: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
  courseValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  gradeBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradeText: {
    fontSize: 13,
    fontWeight: '900',
  },
  semesterFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    padding: 12,
    borderRadius: 12,
  },
  footerLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  footerValue: {
    fontSize: 15,
    fontWeight: '900',
  },
  insightBox: {
    marginTop: 20,
    padding: 30,
    alignItems: 'center',
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  insightTitle: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 2,
    marginVertical: 10,
  },
  insightText: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 20,
    textAlign: 'center',
    opacity: 0.7,
  },
});
