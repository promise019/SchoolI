import React from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, View as DefaultView } from 'react-native';
import { Text, View, Card, ScreenContainer } from '../../components/Themed';
import { 
  BookOpen, 
  Calendar, 
  MapPin, 
  AlertCircle,
  ChevronRight,
  TrendingUp,
  Bell,
  Sparkles,
  Zap,
  Clock,
  CheckCircle2
} from 'lucide-react-native';
import { router } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from 'react-native';
import { useApp } from '../../store/appContext';

export default function DashboardScreen() {
  const { userProgress, university } = useApp();
  const theme = useColorScheme() ?? 'light';
  const colors = Colors[theme];

  const QuickAction = ({ icon: Icon, title, subtitle, onPress, color }: any) => (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={styles.actionItem}>
      <Card style={styles.actionCard}>
        <View style={[styles.iconContainer, { backgroundColor: color || colors.primary + '15' }]}>
          <Icon size={24} color={color || colors.primary} />
        </View>
        <View style={styles.actionText}>
          <Text style={styles.actionTitle}>{title}</Text>
          <Text style={styles.actionSubtitle}>{subtitle}</Text>
        </View>
        <ChevronRight size={18} color={colors.tabIconDefault} />
      </Card>
    </TouchableOpacity>
  );

  return (
    <ScreenContainer>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.topHeader}>
          <View>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.userName}>John Doe</Text>
            <Text style={[styles.uniBadge, { color: colors.primary }]}>
              {university?.name || 'UniUyo'} Student
            </Text>
          </View>
          <TouchableOpacity 
            onPress={() => router.push('/notifications')}
            style={[styles.notifBtn, { borderColor: colors.border }]}
          >
            <Bell size={22} color={colors.text} />
            <View style={[styles.notifDot, { backgroundColor: colors.accent }]} />
          </TouchableOpacity>
        </View>

        {/* New Progress Section */}
        <Card style={styles.progressCard}>
          <View style={styles.progressTop}>
            <View>
              <Text style={styles.progressLabel}>Overall Readiness</Text>
              <Text style={styles.progressValue}>{userProgress}% Complete</Text>
            </View>
            <View style={[styles.stepBadge, { backgroundColor: colors.success + '20' }]}>
              <Text style={[styles.stepBadgeText, { color: colors.success }]}>Step 4 of 12</Text>
            </View>
          </View>
          <View style={[styles.barBg, { backgroundColor: colors.border }]}>
            <View style={[styles.barFill, { width: `${userProgress}%`, backgroundColor: colors.primary }]} />
          </View>
          <View style={styles.progressDetails}>
            <View style={styles.detailItem}>
              <CheckCircle2 size={14} color={colors.success} />
              <Text style={styles.detailText}>Payments Done</Text>
            </View>
            <View style={styles.detailItem}>
              <Clock size={14} color={colors.warning} />
              <Text style={styles.detailText}>2 Docs Pending</Text>
            </View>
          </View>
        </Card>

        {/* AI Suggestion Card */}
        <TouchableOpacity activeOpacity={0.9}>
          <Card style={[styles.aiCard, { backgroundColor: colors.card, borderColor: colors.primary + '30' }]}>
            <View style={[styles.aiIcon, { backgroundColor: colors.primary }]}>
              <Sparkles size={20} color="#FFF" />
            </View>
            <View style={styles.aiContent}>
              <Text style={styles.aiTitle}>Smart Assistant</Text>
              <Text style={[styles.aiText, { color: colors.secondaryText }]}>
                "Best time for Central Clearance is tomorrow by 2PM. Queue is usually shortest then!"
              </Text>
            </View>
            <Zap size={24} color={colors.accent} />
          </Card>
        </TouchableOpacity>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Next Class</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/timetable')}>
              <Text style={[styles.seeAll, { color: colors.primary }]}>Full Schedule</Text>
            </TouchableOpacity>
          </View>
          <Card style={styles.classCard}>
            <View style={[styles.timeSlot, { borderRightColor: colors.border }]}>
              <Text style={styles.timeText}>09:00</Text>
              <Text style={[styles.durationText, { color: colors.secondaryText }]}>AM</Text>
              <Clock size={14} color={colors.primary} style={{ marginTop: 8 }} />
            </View>
            <View style={styles.classDetails}>
              <Text style={[styles.courseCode, { color: colors.primary }]}>CSC 411</Text>
              <Text style={styles.courseTitle}>Artificial Intelligence</Text>
              <View style={styles.locationContainer}>
                <MapPin size={14} color={colors.secondaryText} />
                <Text style={[styles.locationText, { color: colors.secondaryText }]}>Engineering Block, LT 4</Text>
              </View>
            </View>
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <QuickAction 
            icon={BookOpen} 
            title="Course Hub" 
            subtitle="Manage your current semester"
            onPress={() => router.push('/(tabs)/courses')}
            color={theme === 'dark' ? '#818CF8' : '#4F46E5'}
          />
          <QuickAction 
            icon={MapPin} 
            title="Campus & Queues" 
            subtitle="Track live wait times"
            onPress={() => router.push('/(tabs)/campus')}
            color="#10B981"
          />
          <QuickAction 
            icon={CheckCircle2} 
            title="Document Tracker" 
            subtitle="Verify your submissions"
            onPress={() => router.push('/documents')}
            color="#F59E0B"
          />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const ClockIcon = ({ size, color, style }: any) => (
  <View style={style}>
    <Calendar size={size} color={color} />
  </View>
);

const styles = StyleSheet.create({
  content: {
    padding: 20,
    paddingTop: 50,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 16,
    opacity: 0.6,
    fontWeight: '500',
  },
  userName: {
    fontSize: 26,
    fontWeight: '800',
    marginTop: 2,
  },
  uniBadge: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 4,
  },
  notifBtn: {
    width: 46,
    height: 46,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notifDot: {
    position: 'absolute',
    top: 10,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#FFF',
  },
  progressCard: {
    padding: 20,
    marginBottom: 20,
  },
  progressTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressLabel: {
    fontSize: 13,
    fontWeight: '700',
    opacity: 0.6,
  },
  progressValue: {
    fontSize: 20,
    fontWeight: '800',
    marginTop: 2,
  },
  stepBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  stepBadgeText: {
    fontSize: 12,
    fontWeight: '800',
  },
  barBg: {
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 16,
  },
  barFill: {
    height: '100%',
    borderRadius: 5,
  },
  progressDetails: {
    flexDirection: 'row',
    gap: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 13,
    fontWeight: '600',
    opacity: 0.7,
  },
  aiCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  aiIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  aiContent: {
    flex: 1,
    marginRight: 12,
  },
  aiTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 2,
  },
  aiText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '700',
  },
  classCard: {
    flexDirection: 'row',
    padding: 0,
    overflow: 'hidden',
  },
  timeSlot: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    width: 90,
  },
  timeText: {
    fontSize: 20,
    fontWeight: '800',
  },
  durationText: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  classDetails: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  courseCode: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  locationText: {
    fontSize: 13,
    fontWeight: '500',
  },
  actionItem: {
    marginBottom: 12,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionText: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  actionSubtitle: {
    fontSize: 13,
    opacity: 0.6,
    marginTop: 2,
  },
});
