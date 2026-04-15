import React from 'react';
import { StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, View, Card, ScreenContainer } from '../../components/Themed';
import { 
  BookOpen, 
  Calendar, 
  MapPin, 
  AlertCircle,
  ChevronRight,
  TrendingUp,
  Bell
} from 'lucide-react-native';
import { router } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from 'react-native';

export default function DashboardScreen() {
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
          </View>
          <TouchableOpacity style={[styles.notifBtn, { borderColor: colors.border }]}>
            <Bell size={22} color={colors.text} />
            <View style={[styles.notifDot, { backgroundColor: colors.accent }]} />
          </TouchableOpacity>
        </View>

        <Card style={[styles.regBanner, { backgroundColor: colors.primary }]}>
          <View style={styles.regInfo}>
            <View style={styles.regHeader}>
              <AlertCircle size={20} color={colors.accent} />
              <Text style={[styles.regTitle, { color: colors.accent }]}>Registration Deadline</Text>
            </View>
            <Text style={styles.regDesc}>You have 72 hours left to finalize your 400L course forms.</Text>
          </View>
          <TouchableOpacity 
            style={[styles.regButton, { backgroundColor: colors.accent }]}
            onPress={() => router.push('/(tabs)/courses' as any)}
          >
            <Text style={styles.regButtonText}>Complete Enrollment</Text>
          </TouchableOpacity>
        </Card>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Next Class</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/timetable' as any)}>
              <Text style={[styles.seeAll, { color: colors.primary }]}>Full Schedule</Text>
            </TouchableOpacity>
          </View>
          <Card style={styles.classCard}>
            <View style={[styles.timeSlot, { borderRightColor: colors.border }]}>
              <Text style={styles.timeText}>09:00</Text>
              <Text style={[styles.durationText, { color: colors.secondaryText }]}>AM</Text>
              <ClockIcon size={14} color={colors.primary} style={{ marginTop: 8 }} />
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
          <Text style={styles.sectionTitle}>Quick Access</Text>
          <QuickAction 
            icon={BookOpen} 
            title="Course Hub" 
            subtitle="Manage your current semester"
            onPress={() => router.push('/(tabs)/courses' as any)}
            color={theme === 'dark' ? '#818CF8' : '#4F46E5'}
          />
          <QuickAction 
            icon={MapPin} 
            title="Campus Compass" 
            subtitle="Explore university landmarks"
            onPress={() => router.push('/(tabs)/campus' as any)}
            color="#10B981"
          />
          <QuickAction 
            icon={TrendingUp} 
            title="GPA Tracker" 
            subtitle="Visualize your academic growth"
            onPress={() => {}}
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
    marginBottom: 32,
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
  regBanner: {
    padding: 24,
    borderRadius: 24,
    marginBottom: 32,
    elevation: 8,
    shadowOpacity: 0.3,
    shadowRadius: 15,
  },
  regInfo: {
    marginBottom: 20,
  },
  regHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  regTitle: {
    fontSize: 16,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  regDesc: {
    color: '#F8FAFC',
    fontSize: 15,
    lineHeight: 22,
    opacity: 0.9,
  },
  regButton: {
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  regButtonText: {
    color: '#0F172A',
    fontWeight: '800',
    fontSize: 15,
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
    backgroundColor: 'rgba(0,0,0,0.01)',
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
