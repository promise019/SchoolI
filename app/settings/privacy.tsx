import React, { useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Switch, View as DefaultView, Alert } from 'react-native';
import { Text, View, Card, ScreenContainer } from '../../components/Themed';
import { 
  ChevronLeft, 
  Eye, 
  MapPin, 
  ShieldCheck, 
  Trash2, 
  Download, 
  Lock,
  Database,
  UserX,
  ChevronRight,
  Info
} from 'lucide-react-native';
import { router } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from 'react-native';

export default function PrivacyScreen() {
  const theme = useColorScheme() ?? 'light';
  const colors = Colors[theme];

  // Local state for privacy toggles
  const [privacySettings, setPrivacySettings] = useState({
    publicProfile: true,
    locationSharing: false,
    aiDataAnalysis: true,
    sharePerformance: false,
    biometricLock: true,
    twoFactorAuth: false,
  });

  const toggleSetting = (key: keyof typeof privacySettings) => {
    setPrivacySettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const SettingItem = ({ icon: Icon, title, subtitle, value, onValueChange, type = 'toggle', onPress, color }: any) => (
    <View style={styles.settingItem}>
      <View style={[styles.iconBox, { backgroundColor: (color || colors.primary) + '15' }]}>
        <Icon size={20} color={color || colors.primary} />
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={[styles.settingSubtitle, { color: colors.secondaryText }]}>{subtitle}</Text>}
      </View>
      {type === 'toggle' ? (
        <Switch 
          value={value} 
          onValueChange={onValueChange} 
          trackColor={{ true: colors.primary, false: colors.border }} 
          thumbColor={value ? '#FFF' : '#F4F3F4'}
        />
      ) : (
        <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={styles.actionBtn}>
          <ChevronRight size={18} color={colors.secondaryText} />
        </TouchableOpacity>
      )}
    </View>
  );

  const handleClearHistory = () => {
    Alert.alert(
      "Clear Search History",
      "This will remove all your recent searches and AI Assistant history. This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Clear", style: "destructive", onPress: () => Alert.alert("Success", "Search history cleared.") }
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "DANGER ZONE",
      "Are you absolutely sure you want to delete your SchoolI account? All your academic data, documents, and settings will be permanently removed.",
      [
        { text: "Go Back", style: "cancel" },
        { text: "Delete Everything", style: "destructive", onPress: () => router.replace('/(auth)') }
      ]
    );
  };

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: colors.border + '30' }]}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy & Data</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.infoBox}>
          <ShieldCheck size={40} color={colors.primary} style={{ opacity: 0.2 }} />
          <Text style={[styles.infoTitle, { color: colors.secondaryText }]}>YOUR PRIVACY MATTERS</Text>
          <Text style={[styles.infoText, { color: colors.secondaryText }]}>
            We use your data only to personalize your experience. Your academic records are encrypted and never shared with third parties.
          </Text>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.secondaryText }]}>Profile Visibility</Text>
        </View>
        <Card style={styles.sectionCard}>
          <SettingItem 
            icon={Eye} 
            title="Public Profile" 
            subtitle="Allow classmates to find you in search" 
            value={privacySettings.publicProfile}
            onValueChange={() => toggleSetting('publicProfile')}
          />
          <View style={[styles.divider, { backgroundColor: colors.border + '30' }]} />
          <SettingItem 
            icon={MapPin} 
            title="Location Sharing" 
            subtitle="Show my presence on the campus map" 
            value={privacySettings.locationSharing}
            onValueChange={() => toggleSetting('locationSharing')}
          />
        </Card>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.secondaryText }]}>Data & AI Analysis</Text>
        </View>
        <Card style={styles.sectionCard}>
          <SettingItem 
            icon={Database} 
            title="AI Insights" 
            subtitle="Allow AI to analyze results for advice" 
            value={privacySettings.aiDataAnalysis}
            onValueChange={() => toggleSetting('aiDataAnalysis')}
          />
          <View style={[styles.divider, { backgroundColor: colors.border + '30' }]} />
          <SettingItem 
            icon={Info} 
            title="Performance Sharing" 
            subtitle="Share trends with academic advisors" 
            value={privacySettings.sharePerformance}
            onValueChange={() => toggleSetting('sharePerformance')}
          />
        </Card>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.secondaryText }]}>Security Features</Text>
        </View>
        <Card style={styles.sectionCard}>
          <SettingItem 
            icon={Lock} 
            title="Biometric Lock" 
            subtitle="Unlock SchoolI using Fingerprint/FaceID" 
            value={privacySettings.biometricLock}
            onValueChange={() => toggleSetting('biometricLock')}
          />
          <View style={[styles.divider, { backgroundColor: colors.border + '30' }]} />
          <SettingItem 
            icon={ShieldCheck} 
            title="Two-Factor Auth" 
            subtitle="Require a code for high-risk actions" 
            value={privacySettings.twoFactorAuth}
            onValueChange={() => toggleSetting('twoFactorAuth')}
          />
        </Card>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.secondaryText }]}>Account Actions</Text>
        </View>
        <Card style={styles.sectionCard}>
          <TouchableOpacity onPress={handleClearHistory} style={styles.actionItem}>
            <View style={[styles.iconBox, { backgroundColor: '#8B5CF6' + '15' }]}>
              <Trash2 size={20} color="#8B5CF6" />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Clear Search History</Text>
            </View>
            <ChevronRight size={18} color={colors.secondaryText} />
          </TouchableOpacity>
          <View style={[styles.divider, { backgroundColor: colors.border + '30' }]} />
          <TouchableOpacity onPress={() => Alert.alert("Export", "Data export started. Check your email soon.")} style={styles.actionItem}>
            <View style={[styles.iconBox, { backgroundColor: '#10B981' + '15' }]}>
              <Download size={20} color="#10B981" />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Download My Data</Text>
            </View>
            <ChevronRight size={18} color={colors.secondaryText} />
          </TouchableOpacity>
        </Card>

        <TouchableOpacity 
          onPress={handleDeleteAccount}
          style={[styles.dangerBtn, { backgroundColor: colors.error + '10', borderColor: colors.error + '30' }]}
        >
          <UserX size={20} color={colors.error} />
          <Text style={[styles.dangerText, { color: colors.error }]}>Delete Account & All Data</Text>
        </TouchableOpacity>

        <Text style={[styles.footerNote, { color: colors.secondaryText }]}>
          Your data is processed in compliance with university regulations and data protection standards.
        </Text>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
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
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  content: {
    padding: 20,
    paddingBottom: 60,
  },
  infoBox: {
    padding: 24,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.02)',
    alignItems: 'center',
    marginBottom: 32,
  },
  infoTitle: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 2,
    marginVertical: 10,
    opacity: 0.6,
  },
  infoText: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 20,
    textAlign: 'center',
    opacity: 0.7,
  },
  sectionHeader: {
    marginBottom: 12,
    paddingLeft: 4,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  sectionCard: {
    padding: 0,
    overflow: 'hidden',
    marginBottom: 28,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  settingSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
    lineHeight: 16,
  },
  actionBtn: {
    paddingHorizontal: 8,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
  },
  divider: {
    height: 1,
    marginLeft: 76,
  },
  dangerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 20,
    borderWidth: 1.5,
    marginTop: 10,
    gap: 12,
  },
  dangerText: {
    fontSize: 16,
    fontWeight: '800',
  },
  footerNote: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 32,
    opacity: 0.4,
    paddingHorizontal: 20,
  },
});
