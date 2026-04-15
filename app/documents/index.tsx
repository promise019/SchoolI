import React, { useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Image, View as DefaultView } from 'react-native';
import { Text, View, Card, ScreenContainer } from '../../components/Themed';
import { Button } from '../../components/Button';
import { 
  FileCheck, 
  FileWarning, 
  FileText, 
  Upload, 
  ChevronRight, 
  Search,
  CheckCircle2,
  Clock,
  XCircle
} from 'lucide-react-native';
import { router } from 'expo-router';
import { UNIVERSITIES } from '../../constants/Universities';
import { useApp } from '../../store/appContext';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from 'react-native';

const STATUS_COLORS: any = {
  Verified: '#10B981',
  Pending: '#F59E0B',
  Rejected: '#EF4444',
  Missing: '#94A3B8',
};

export default function DocumentTrackerScreen() {
  const { university } = useApp();
  const theme = useColorScheme() ?? 'light';
  const colors = Colors[theme];

  const selectedUni = university || UNIVERSITIES[0];
  
  // Mock document states
  const [docStates, setDocStates] = useState(
    selectedUni.docs.map((doc, idx) => ({
      name: doc,
      status: idx === 0 ? 'Verified' : idx === 1 ? 'Pending' : idx === 2 ? 'Rejected' : 'Missing',
      id: String(idx),
    }))
  );

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronRight size={24} color={colors.text} style={{ transform: [{ rotate: '180deg' }] }} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Document Tracker</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryVal}>{docStates.filter(d => d.status === 'Verified').length}</Text>
              <Text style={styles.summaryLabel}>Verified</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryVal}>{docStates.filter(d => d.status === 'Missing').length}</Text>
              <Text style={styles.summaryLabel}>Missing</Text>
            </View>
          </View>
        </Card>

        <View style={[styles.aiAlert, { backgroundColor: colors.warning + '15', borderColor: colors.warning + '30' }]}>
          <FileWarning size={20} color={colors.warning} />
          <Text style={[styles.aiAlertText, { color: colors.warning }]}>
            AI Reminder: You still need to upload yourJAMB Admission Letter for UniUyo clearance.
          </Text>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Documents</Text>
        </View>

        {docStates.map((doc) => (
          <Card key={doc.id} style={styles.docCard}>
            <View style={[styles.iconBox, { backgroundColor: STATUS_COLORS[doc.status] + '15' }]}>
              {doc.status === 'Verified' ? <CheckCircle2 size={24} color={STATUS_COLORS[doc.status]} /> :
               doc.status === 'Rejected' ? <XCircle size={24} color={STATUS_COLORS[doc.status]} /> :
               doc.status === 'Pending' ? <Clock size={24} color={STATUS_COLORS[doc.status]} /> :
               <FileText size={24} color={STATUS_COLORS[doc.status]} />}
            </View>
            
            <View style={styles.docInfo}>
              <Text style={styles.docName}>{doc.name}</Text>
              <View style={styles.statusRow}>
                <View style={[styles.statusDot, { backgroundColor: STATUS_COLORS[doc.status] }]} />
                <Text style={[styles.statusText, { color: STATUS_COLORS[doc.status] }]}>{doc.status}</Text>
              </View>
            </View>

            <TouchableOpacity 
              style={[styles.uploadBtn, { borderColor: doc.status === 'Missing' || doc.status === 'Rejected' ? colors.primary : colors.border }]}
            >
              <Upload size={18} color={doc.status === 'Missing' || doc.status === 'Rejected' ? colors.primary : colors.secondaryText} />
            </TouchableOpacity>
          </Card>
        ))}

        <View style={styles.supportBox}>
          <Text style={[styles.supportText, { color: colors.secondaryText }]}>
            Rejected documents? Make sure scans are clear and all four corners of the page are visible.
          </Text>
          <Button title="Contact Registrar" onPress={() => {}} variant="outline" style={styles.supportAction} />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    gap: 12,
  },
  backBtn: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  summaryCard: {
    padding: 24,
    marginBottom: 20,
    alignItems: 'center',
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 40,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryVal: {
    fontSize: 28,
    fontWeight: '900',
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: '700',
    opacity: 0.6,
    marginTop: 4,
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  aiAlert: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
    marginBottom: 24,
  },
  aiAlertText: {
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
    lineHeight: 18,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  docCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  docInfo: {
    flex: 1,
  },
  docName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '800',
  },
  uploadBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  supportBox: {
    marginTop: 20,
    alignItems: 'center',
    paddingBottom: 20,
  },
  supportText: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 16,
    fontWeight: '500',
  },
  supportAction: {
    width: '100%',
  },
});
