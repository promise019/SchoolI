import React, { useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Image, View as DefaultView, FlatList } from 'react-native';
import { Text, View, Card, ScreenContainer } from '../../components/Themed';
import { Button } from '../../components/Button';
import { 
  Search, 
  ChevronRight, 
  MapPin, 
  GraduationCap, 
  ArrowRightLeft, 
  FileCheck, 
  HelpCircle,
  School
} from 'lucide-react-native';
import { UNIVERSITIES, University } from '../../constants/Universities';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from 'react-native';
import { router } from 'expo-router';

export default function ExploreScreen() {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'compare' | 'faq'>('overview');
  const [selectedUni, setSelectedUni] = useState<University>(UNIVERSITIES[0]);
  const theme = useColorScheme() ?? 'light';
  const colors = Colors[theme];

  const UniCard = ({ uni, active }: { uni: University; active: boolean }) => (
    <TouchableOpacity 
      onPress={() => setSelectedUni(uni)}
      style={[
        styles.uniTab, 
        { borderColor: active ? colors.primary : colors.border, backgroundColor: active ? colors.primary + '10' : 'transparent' }
      ]}
    >
      <View style={[styles.uniIcon, { backgroundColor: active ? colors.primary : colors.border }]}>
        <School size={20} color={active ? '#FFF' : colors.secondaryText} />
      </View>
      <Text style={[styles.uniName, { color: active ? colors.primary : colors.text }]}>{uni.name}</Text>
    </TouchableOpacity>
  );

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronRight size={24} color={colors.text} style={{ transform: [{ rotate: '180deg' }] }} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Explore Universities</Text>
      </View>

      <View style={styles.uniSelector}>
        <FlatList 
          data={UNIVERSITIES}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <UniCard uni={item} active={item.id === selectedUni.id} />}
          contentContainerStyle={styles.selectorContent}
        />
      </View>

      <View style={styles.tabBar}>
        {(['overview', 'compare', 'faq'] as const).map((tab) => (
          <TouchableOpacity 
            key={tab} 
            onPress={() => setSelectedTab(tab)}
            style={[styles.tab, selectedTab === tab && { borderBottomColor: colors.primary, borderBottomWidth: 3 }]}
          >
            <Text style={[styles.tabLabel, { color: selectedTab === tab ? colors.primary : colors.secondaryText }]}>
              {tab.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {selectedTab === 'overview' && (
          <View>
            <Card style={styles.heroCard}>
              <View style={[styles.heroIcon, { backgroundColor: colors.primary }]}>
                <GraduationCap size={40} color="#FFF" />
              </View>
              <Text style={styles.heroTitle}>{selectedUni.fullName}</Text>
              <View style={styles.locationRow}>
                <MapPin size={16} color={colors.secondaryText} />
                <Text style={[styles.locationText, { color: colors.secondaryText }]}>{selectedUni.location}</Text>
              </View>
            </Card>

            <View style={styles.section}>
              <Text style={styles.sectionLabel}>REQUIRED DOCUMENTS</Text>
              {selectedUni.docs.map((doc, idx) => (
                <View key={idx} style={styles.docItem}>
                  <FileCheck size={20} color={colors.success} />
                  <Text style={styles.docText}>{doc}</Text>
                </View>
              ))}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionLabel}>REGISTRATION PROCESS</Text>
              {selectedUni.processes.map((proc) => (
                <Card key={proc.id} style={styles.procCard}>
                  <View style={styles.procHeader}>
                    <Text style={styles.procTitle}>{proc.title}</Text>
                    <Text style={[styles.procTime, { color: colors.primary }]}>{proc.estimatedTime}</Text>
                  </View>
                  {proc.steps.map((step, sIdx) => (
                    <View key={sIdx} style={styles.stepRow}>
                      <View style={[styles.stepDot, { backgroundColor: colors.border }]} />
                      <Text style={[styles.stepText, { color: colors.secondaryText }]}>{step}</Text>
                    </View>
                  ))}
                </Card>
              ))}
            </View>
          </View>
        )}

        {selectedTab === 'compare' && (
          <View>
            <Text style={styles.infoText}>Quick comparison between our partner schools.</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.compareGrid}>
                <View style={styles.compareHeaders}>
                  <View style={styles.headerCell}><Text style={styles.headerCellText}>Metric</Text></View>
                  <View style={styles.propCell}><Text style={styles.propCellText}>Location</Text></View>
                  <View style={styles.propCell}><Text style={styles.propCellText}>Min. Docs</Text></View>
                  <View style={styles.propCell}><Text style={styles.propCellText}>Reg. Speed</Text></View>
                </View>
                {UNIVERSITIES.map((u) => (
                  <View key={u.id} style={styles.compareCol}>
                    <View style={[styles.headerCell, { backgroundColor: colors.primary + '15' }]}>
                      <Text style={[styles.headerCellText, { color: colors.primary }]}>{u.name}</Text>
                    </View>
                    <View style={styles.propCell}><Text style={styles.propValText}>{u.name === 'UniUyo' ? 'Main City' : 'Coastal'}</Text></View>
                    <View style={styles.propCell}><Text style={styles.propValText}>{u.docs.length}</Text></View>
                    <View style={styles.propCell}><Text style={styles.propValText}>High</Text></View>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        )}

        {selectedTab === 'faq' && (
          <View>
            {selectedUni.faqs.map((faq, idx) => (
              <Card key={idx} style={styles.faqCard}>
                <View style={styles.faqHeader}>
                  <HelpCircle size={20} color={colors.primary} />
                  <Text style={styles.faqQ}>{faq.q}</Text>
                </View>
                <Text style={[styles.faqA, { color: colors.secondaryText }]}>{faq.a}</Text>
              </Card>
            ))}
          </View>
        )}
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.background }]}>
        <Button 
          title="Sign In to Apply" 
          onPress={() => router.push('/(auth)')} 
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
  },
  backBtn: {
    padding: 8,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
  },
  uniSelector: {
    marginBottom: 20,
  },
  selectorContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  uniTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 100,
    borderWidth: 1,
    marginRight: 10,
  },
  uniIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  uniName: {
    fontSize: 14,
    fontWeight: '700',
  },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  tab: {
    paddingVertical: 12,
    marginRight: 24,
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 120,
  },
  heroCard: {
    alignItems: 'center',
    padding: 30,
    marginBottom: 24,
  },
  heroIcon: {
    width: 80,
    height: 80,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '900',
    textAlign: 'center',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 4,
  },
  locationText: {
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    marginBottom: 30,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 16,
    opacity: 0.6,
  },
  docItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  docText: {
    fontSize: 16,
    fontWeight: '600',
  },
  procCard: {
    padding: 20,
    marginBottom: 16,
  },
  procHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  procTitle: {
    fontSize: 17,
    fontWeight: '800',
  },
  procTime: {
    fontSize: 12,
    fontWeight: '800',
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 10,
  },
  stepDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  stepText: {
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  actionBtn: {
    height: 56,
  },
  infoText: {
    fontSize: 14,
    opacity: 0.6,
    marginBottom: 20,
  },
  compareGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  compareHeaders: {
    width: 100,
  },
  compareCol: {
    width: 120,
  },
  headerCell: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 8,
  },
  headerCellText: {
    fontSize: 12,
    fontWeight: '800',
  },
  propCell: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  propCellText: {
    fontSize: 12,
    fontWeight: '700',
    opacity: 0.5,
  },
  propValText: {
    fontSize: 13,
    fontWeight: '700',
  },
  faqCard: {
    padding: 20,
    marginBottom: 12,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  faqQ: {
    fontSize: 16,
    fontWeight: '800',
    flex: 1,
  },
  faqA: {
    fontSize: 14,
    lineHeight: 20,
    marginLeft: 30,
  },
});
