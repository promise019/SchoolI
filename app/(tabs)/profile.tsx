import React from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, View as DefaultView } from 'react-native';
import { Text, View, Card, ScreenContainer } from '../../components/Themed';
import { 
  User, 
  Settings, 
  CreditCard, 
  Bed, 
  FileText, 
  LogOut, 
  ChevronRight,
  ShieldCheck,
  Bell,
  Camera,
  Star
} from 'lucide-react-native';
import { router } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { useColorScheme, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../../store/appContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

import maleAvatar from '../../assets/images/avatar_male.png';
import femaleAvatar from '../../assets/images/avatar_female.png';
export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, themeOverride, setIsAuthenticated } = useApp();
  const systemTheme = useColorScheme() ?? 'light';
  const theme = themeOverride ?? systemTheme;
  const colors = Colors[theme];
  
  const avatarSource = user.image ? { uri: user.image } : (user.gender === 'female' ? femaleAvatar : maleAvatar);

  const MenuLink = ({ icon: Icon, title, subtitle, onPress, color }: any) => (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={styles.menuItemWrap}>
      <Card style={styles.menuItem}>
        <View style={[styles.menuIcon, { backgroundColor: (color || colors.primary) + '15' }]}>
          <Icon size={20} color={color || colors.primary} />
        </View>
        <View style={styles.menuContent}>
          <Text style={styles.menuTitle}>{title}</Text>
          {subtitle && <Text style={[styles.menuSubtitle, { color: colors.secondaryText }]}>{subtitle}</Text>}
        </View>
        <View style={[styles.chevronBox, { backgroundColor: colors.border + '50' }]}>
          <ChevronRight size={16} color={colors.secondaryText} />
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <ScreenContainer>
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.avatarWrap}>
            <View style={styles.avatar}>
              <Image source={avatarSource} style={styles.avatarImg} />
            </View>
            <TouchableOpacity style={[styles.cameraBtn, { backgroundColor: colors.accent }]}>
              <Camera size={14} color="#000" />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{user.name}</Text>
          <View style={[styles.tag, { backgroundColor: colors.primary + '10' }]}>
            <Text style={[styles.tagText, { color: colors.primary }]}>400 Level • Computer Science</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.secondaryText }]}>University Services</Text>
          <MenuLink 
            icon={Bed} 
            title="Hostel Allocation" 
            subtitle="Booking and request status"
            onPress={() => router.push('/services/hostel' as any)} 
            color="#818CF8" // Indigo
          />
          <MenuLink 
            icon={CreditCard} 
            title="Payment Portal" 
            subtitle="Fees, dues, and transaction history"
            onPress={() => router.push('/services/payments' as any)} 
            color="#10B981" // Emerald
          />
          <MenuLink 
            icon={FileText} 
            title="Academic Records" 
            subtitle="Transcripts and semester results"
            onPress={() => router.push('/services/academics' as any)} 
            color="#F59E0B" // Amber
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.secondaryText }]}>System Preferences</Text>
          <MenuLink 
            icon={Bell} 
            title="Notifications" 
            onPress={() => router.push('/notifications')} 
            color={colors.secondaryText}
          />
          <MenuLink 
            icon={ShieldCheck} 
            title="Privacy" 
            onPress={() => router.push('/settings/privacy')} 
            color={colors.secondaryText}
          />
          <MenuLink 
            icon={Settings} 
            title="Account Settings" 
            onPress={() => router.push('/settings')} 
            color={colors.secondaryText}
          />
          <MenuLink 
            icon={Star} 
            title="Rate the App" 
            subtitle="Share your feedback on the website"
            onPress={() => router.push('/settings/review' as any)} 
            color="#FBBF24"
          />
        </View>

        <TouchableOpacity 
          style={[styles.logoutButton, { backgroundColor: colors.error + '15' }]} 
          onPress={() => setIsAuthenticated(false)}
        >
          <LogOut size={20} color={colors.error} />
          <Text style={[styles.logoutText, { color: colors.error }]}>Sign Out from SchoolI</Text>
        </TouchableOpacity>
        
        <Text style={[styles.versionText, { color: colors.secondaryText }]}>
          Version 1.2.0 • Build 2404
        </Text>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingBottom: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  avatarWrap: {
    position: 'relative',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
  },
  avatarText: {
    color: '#FFF',
    fontSize: 36,
    fontWeight: '900',
  },
  cameraBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFF',
  },
  userName: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -1,
  },
  tag: {
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  tagText: {
    fontSize: 13,
    fontWeight: '700',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 16,
    marginLeft: 4,
  },
  menuItemWrap: {
    marginBottom: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 24,
  },
  menuIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  menuSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  chevronBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 12,
    padding: 18,
    borderRadius: 20,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '800',
  },
  versionText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.4,
  },
});
