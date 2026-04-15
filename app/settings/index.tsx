import React from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Switch, View as DefaultView } from 'react-native';
import { Text, View, Card, ScreenContainer } from '../../components/Themed';
import { 
  ChevronLeft, 
  User, 
  MapPin, 
  Moon, 
  Bell, 
  Lock, 
  ShieldCheck, 
  Languages, 
  LogOut,
  ChevronRight,
  Globe
} from 'lucide-react-native';
import { router } from 'expo-router';
import { useApp } from '../../store/appContext';
import { UNIVERSITIES } from '../../constants/Universities';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from 'react-native';

export default function SettingsScreen() {
  const { university, setUniversity, setIsAuthenticated } = useApp();
  const theme = useColorScheme() ?? 'light';
  const colors = Colors[theme];

  const SettingItem = ({ icon: Icon, title, subtitle, value, onValueChange, type = 'toggle', onPress }: any) => (
    <TouchableOpacity 
      disabled={type === 'toggle'} 
      onPress={onPress}
      activeOpacity={0.7} 
      style={styles.settingItem}
    >
      <View style={[styles.iconBox, { backgroundColor: colors.border + '30' }]}>
        <Icon size={20} color={colors.primary} />
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={[styles.settingSubtitle, { color: colors.secondaryText }]}>{subtitle}</Text>}
      </View>
      {type === 'toggle' ? (
        <Switch value={value} onValueChange={onValueChange} trackColor={{ true: colors.primary }} />
      ) : (
        <View style={styles.rightSide}>
          {value && <Text style={[styles.valueText, { color: colors.primary }]}>{value}</Text>}
          <ChevronRight size={18} color={colors.border} />
        </View>
      )}
    </TouchableOpacity>
  );

  const handleLogout = () => {
    setIsAuthenticated(false);
    router.replace('/(auth)');
  };

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Account & School</Text>
        </View>
        <Card style={styles.sectionCard}>
          <SettingItem 
            icon={MapPin} 
            title="Current University" 
            value={university?.name || 'UniUyo'} 
            type="link"
            onPress={() => {
              const nextIdx = (UNIVERSITIES.findIndex(u => u.name === (university?.name || 'UniUyo')) + 1) % UNIVERSITIES.length;
              setUniversity(UNIVERSITIES[nextIdx]);
            }}
          />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <SettingItem icon={User} title="Student Profile" type="link" onPress={() => {}} />
        </Card>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>App Preferences</Text>
        </View>
        <Card style={styles.sectionCard}>
          <SettingItem icon={Moon} title="Dark Mode" value={theme === 'dark'} type="toggle" />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <SettingItem icon={Bell} title="Push Notifications" value={true} type="toggle" />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <SettingItem icon={Globe} title="Language" value="English" type="link" />
        </Card>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Privacy & Support</Text>
        </View>
        <Card style={styles.sectionCard}>
          <SettingItem icon={ShieldCheck} title="Privacy Settings" type="link" />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <SettingItem icon={Lock} title="Security & Biometrics" type="link" />
        </Card>

        <TouchableOpacity 
          onPress={handleLogout}
          style={[styles.logoutBtn, { borderColor: colors.error }]}
        >
          <LogOut size={20} color={colors.error} />
          <Text style={[styles.logoutText, { color: colors.error }]}>Sign Out</Text>
        </TouchableOpacity>

        <View style={styles.footerInfo}>
          <Text style={[styles.versionText, { color: colors.secondaryText }]}>SchoolI Version 1.2.0 (Build 44)</Text>
          <Text style={[styles.madeBy, { color: colors.secondaryText }]}>Made with ❤️ for Nigerian Students</Text>
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
  sectionHeader: {
    marginBottom: 12,
    marginTop: 10,
    paddingLeft: 4,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    opacity: 0.5,
  },
  sectionCard: {
    padding: 0,
    overflow: 'hidden',
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  settingSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  rightSide: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  valueText: {
    fontSize: 14,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    marginLeft: 68,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    marginTop: 20,
    gap: 10,
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '800',
  },
  footerInfo: {
    alignItems: 'center',
    marginTop: 40,
    gap: 6,
  },
  versionText: {
    fontSize: 12,
    fontWeight: '700',
    opacity: 0.5,
  },
  madeBy: {
    fontSize: 11,
    fontWeight: '600',
    opacity: 0.4,
  },
});
