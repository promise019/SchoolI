import React, { useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, View as DefaultView } from 'react-native';
import { Text, View, Card, ScreenContainer } from '../../components/Themed';
import { Button } from '../../components/Button';
import { 
  ChevronRight, 
  Clock, 
  MapPin, 
  AlertCircle, 
  CheckCircle2, 
  FileText,
  Info
} from 'lucide-react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { UNIVERSITIES } from '../../constants/Universities';
import { useApp } from '../../store/appContext';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from 'react-native';

export default function ProcessScreen() {
  const { type } = useLocalSearchParams();
  const { university } = useApp();
  const theme = useColorScheme() ?? 'light';
  const colors = Colors[theme];

  // Fallback to UniUyo if none selected
  const selectedUni = university || UNIVERSITIES[0];
  const process = selectedUni.processes.find(p => p.id === type) || selectedUni.processes[0];

  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const toggleStep = (idx: number) => {
    if (completedSteps.includes(idx)) {
      setCompletedSteps(completedSteps.filter(s => s !== idx));
    } else {
      setCompletedSteps([...completedSteps, idx]);
    }
  };

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronRight size={24} color={colors.text} style={{ transform: [{ rotate: '180deg' }] }} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>{process.title}</Text>
          <Text style={[styles.headerSubtitle, { color: colors.secondaryText }]}>{selectedUni.name} Guide</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.overviewCard}>
          <View style={styles.statRow}>
            <View style={styles.statItem}>
              <Clock size={20} color={colors.primary} />
              <View>
                <Text style={styles.statLabel}>Est. Time</Text>
                <Text style={styles.statValue}>{process.estimatedTime}</Text>
              </View>
            </View>
            <View style={styles.statItem}>
              <CheckCircle2 size={20} color={colors.success} />
              <View>
                <Text style={styles.statLabel}>Progress</Text>
                <Text style={styles.statValue}>{Math.round((completedSteps.length / process.steps.length) * 100)}%</Text>
              </View>
            </View>
          </View>
        </Card>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Required Documents</Text>
        </View>
        <View style={styles.docScrollContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.docList}>
            {selectedUni.docs.slice(0, 3).map((doc, idx) => (
              <Card key={idx} style={styles.docCard}>
                <FileText size={24} color={colors.primary} />
                <Text style={styles.docName} numberOfLines={2}>{doc}</Text>
              </Card>
            ))}
          </ScrollView>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Step-by-Step Guide</Text>
        </View>

        {process.steps.map((step, idx) => {
          const isCompleted = completedSteps.includes(idx);
          return (
            <TouchableOpacity key={idx} onPress={() => toggleStep(idx)} activeOpacity={0.8}>
              <Card style={[styles.stepCard, isCompleted && { opacity: 0.6 }]}>
                <View style={styles.stepHeader}>
                  <View style={[styles.stepNumber, { backgroundColor: isCompleted ? colors.success : colors.primary }]}>
                    {isCompleted ? <CheckCircle2 size={16} color="#FFF" /> : <Text style={styles.stepNumText}>{idx + 1}</Text>}
                  </View>
                  <Text style={[styles.stepTitle, isCompleted && { textDecorationLine: 'line-through' }]}>{step}</Text>
                </View>
                
                <View style={styles.stepMeta}>
                  <View style={styles.metaItem}>
                    <MapPin size={14} color={colors.secondaryText} />
                    <Text style={[styles.metaText, { color: colors.secondaryText }]}>Admin Block, Room 4</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Clock size={14} color={colors.secondaryText} />
                    <Text style={[styles.metaText, { color: colors.secondaryText }]}>Best time: 9AM - 11AM</Text>
                  </View>
                </View>

                {!isCompleted && (
                  <View style={[styles.warningBox, { backgroundColor: colors.warning + '10' }]}>
                    <AlertCircle size={14} color={colors.warning} />
                    <Text style={[styles.warningText, { color: colors.warning }]}>Common mistake: Missing original results.</Text>
                  </View>
                )}
              </Card>
            </TouchableOpacity>
          );
        })}

        <View style={styles.proTip}>
          <Info size={20} color={colors.primary} />
          <Text style={[styles.proTipText, { color: colors.secondaryText }]}>
            Stuck? Ask our AI Assistant for real-time help with these steps.
          </Text>
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.background }]}>
        <Button 
          title="Mark All Complete" 
          onPress={() => setCompletedSteps(process.steps.map((_, i) => i))} 
          variant="outline"
          style={styles.actionBtn}
        />
      </View>
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
    fontSize: 20,
    fontWeight: '800',
  },
  headerSubtitle: {
    fontSize: 13,
    fontWeight: '600',
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  overviewCard: {
    padding: 24,
    marginBottom: 24,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.6,
    fontWeight: '700',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  docScrollContainer: {
    marginHorizontal: -20,
    marginBottom: 24,
  },
  docList: {
    paddingHorizontal: 20,
    gap: 12,
  },
  docCard: {
    width: 140,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  docName: {
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 8,
  },
  stepCard: {
    padding: 20,
    marginBottom: 16,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '800',
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '800',
    flex: 1,
  },
  stepMeta: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
    marginLeft: 40,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 12,
    fontWeight: '600',
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    gap: 8,
    marginLeft: 40,
  },
  warningText: {
    fontSize: 11,
    fontWeight: '700',
  },
  proTip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 20,
    marginTop: 10,
  },
  proTipText: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
    flex: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 40,
  },
  actionBtn: {
    height: 54,
  },
});
