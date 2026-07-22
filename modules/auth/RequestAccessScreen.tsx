import React, { useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Text, View, ScreenContainer, Card } from '../../components/Themed';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  Globe, 
  Camera, 
  CheckCircle,
  Hash,
  School
} from 'lucide-react-native';
import { router } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useApp } from '../../store/appContext';
import { UNIVERSITIES } from '../../constants/Universities';
import { api } from '../../services/api';
import { EmailConfirmationModal } from './EmailConfirmationModal';

export default function RequestAccessScreen() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState<'student' | 'prospective'>('prospective');
  const [assignedStudentId, setAssignedStudentId] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    studentId: '',
    password: '',
    university: UNIVERSITIES[0].name
  });

  const { setIsAuthenticated } = useApp();
  const theme = useColorScheme() ?? 'light';
  const colors = Colors[theme];

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleSubmit = async () => {
    if (!formData.fullName || !formData.email || !formData.phone) {
      Alert.alert("Required Fields", "Please fill in your Full Name, Email, and Phone Number.");
      return;
    }

    if (userType === 'student' && !formData.studentId) {
      Alert.alert("Student ID Required", "Enrolled students must enter their Student ID or Matric Number.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.signup({
        ...formData,
        studentId: userType === 'prospective' ? '' : formData.studentId,
        password: formData.password || 'password123'
      });

      if (response.token) {
        await AsyncStorage.setItem('jwt_token', response.token);
      }

      setAssignedStudentId(response.user?.studentId || 'PROSPECT');

      if (response.requiresEmailConfirmation) {
        setShowConfirmModal(true);
      } else {
        setIsSuccess(true);
      }
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message || 'An error occurred submitting your request.');
    } finally {
      setLoading(false);
    }
  };

  const handleFinishAndLogin = () => {
    setIsAuthenticated(true);
    router.replace('/(tabs)' as any);
  };

  if (isSuccess) {
    return (
      <ScreenContainer>
        <View style={styles.successContainer}>
          <View style={[styles.successIconBox, { backgroundColor: colors.success + '15' }]}>
            <CheckCircle size={64} color={colors.success} />
          </View>
          <Text style={styles.successTitle}>
            {userType === 'prospective' ? 'Account Created!' : 'Request Submitted!'}
          </Text>
          <Text style={[styles.successText, { color: colors.secondaryText }]}>
            {userType === 'prospective'
              ? `Welcome to SchoolI! You can now log in using your email (${formData.email}) or phone number (${formData.phone}).`
              : `Your request has been submitted. Verification details have been sent to ${formData.email}.`}
          </Text>
          <Card style={styles.refCard}>
            <Text style={[styles.refLabel, { color: colors.secondaryText }]}>
              {userType === 'prospective' ? 'Your Applicant ID' : 'Reference Number'}
            </Text>
            <Text style={styles.refValue}>{assignedStudentId}</Text>
          </Card>
          <Button 
            title="Proceed to App" 
            onPress={handleFinishAndLogin} 
            style={styles.successBtn}
          />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Sign Up / Request Access</Text>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView 
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* User Type Toggle */}
          <View style={styles.toggleRow}>
            <TouchableOpacity 
              onPress={() => setUserType('prospective')}
              style={[
                styles.toggleTab, 
                { backgroundColor: userType === 'prospective' ? colors.primary : colors.border + '30' }
              ]}
            >
              <Text style={[styles.toggleText, { color: userType === 'prospective' ? '#FFF' : colors.text }]}>
                Prospective / Non-Student
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => setUserType('student')}
              style={[
                styles.toggleTab, 
                { backgroundColor: userType === 'student' ? colors.primary : colors.border + '30' }
              ]}
            >
              <Text style={[styles.toggleText, { color: userType === 'student' ? '#FFF' : colors.text }]}>
                Enrolled Student
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.introText, { color: colors.secondaryText }]}>
            {userType === 'prospective'
              ? 'Not a student yet? Register with your email and phone number to explore hostels, university info, and clearance guides.'
              : 'Enrolled student? Sign up with your student ID to access clearance tracking and academic queues.'}
          </Text>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.primary }]}>Contact Details</Text>
            <Input 
              label="Full Name *"
              placeholder="e.g. John Doe"
              value={formData.fullName}
              onChangeText={(text) => setFormData({...formData, fullName: text})}
              leftIcon={<User size={18} color={colors.secondaryText} />}
            />
            <Input 
              label="Email Address *"
              placeholder="e.g. john@gmail.com"
              value={formData.email}
              onChangeText={(text) => setFormData({...formData, email: text})}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon={<Mail size={18} color={colors.secondaryText} />}
            />
            <Input 
              label="Phone Number *"
              placeholder="e.g. +234 801 234 5678"
              value={formData.phone}
              onChangeText={(text) => setFormData({...formData, phone: text})}
              keyboardType="phone-pad"
              leftIcon={<Phone size={18} color={colors.secondaryText} />}
            />
            <Input 
              label="Set Password"
              placeholder="•••••••• (Default: password123)"
              value={formData.password}
              onChangeText={(text) => setFormData({...formData, password: text})}
              secureTextEntry
            />
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.primary }]}>
              {userType === 'prospective' ? 'Target University' : 'Academic Information'}
            </Text>
            <View style={styles.uniSelector}>
              <Text style={styles.inputLabel}>Select University</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.uniScroll}>
                {UNIVERSITIES.map((uni) => (
                  <TouchableOpacity 
                    key={uni.id}
                    onPress={() => setFormData({...formData, university: uni.name})}
                    style={[
                      styles.uniChip, 
                      { 
                        backgroundColor: formData.university === uni.name ? colors.primary : colors.border + '30',
                        borderColor: formData.university === uni.name ? colors.primary : colors.border
                      }
                    ]}
                  >
                    <Text style={[
                      styles.uniChipText, 
                      { color: formData.university === uni.name ? '#FFF' : colors.text }
                    ]}>
                      {uni.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {userType === 'student' && (
              <Input 
                label="Student ID / Matric Number *"
                placeholder="e.g. CSC/2026/001"
                value={formData.studentId}
                onChangeText={(text) => setFormData({...formData, studentId: text})}
                leftIcon={<Hash size={18} color={colors.secondaryText} />}
              />
            )}
          </View>

          {userType === 'student' && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.primary }]}>Identity Verification</Text>
              <TouchableOpacity style={[styles.uploadBox, { borderColor: colors.border }]}>
                <Camera size={28} color={colors.secondaryText} />
                <Text style={[styles.uploadText, { color: colors.secondaryText }]}>Upload ID Card or Admission Letter</Text>
              </TouchableOpacity>
            </View>
          )}

          <Button 
            title={userType === 'prospective' ? "Create Applicant Account" : "Submit Request"} 
            onPress={handleSubmit} 
            loading={loading}
            style={styles.submitBtn}
          />

          <Text style={[styles.noteText, { color: colors.secondaryText }]}>
            Accounts are usually verified within 24-48 hours. By submitting, you agree to our data verification policy.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>

      <EmailConfirmationModal
        visible={showConfirmModal}
        email={formData.email}
        onClose={() => setShowConfirmModal(false)}
        onSuccess={() => {
          setShowConfirmModal(false);
          setIsSuccess(true);
        }}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backBtn: {
    padding: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
  content: {
    padding: 24,
    paddingTop: 0,
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  toggleTab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleText: {
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  introText: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 22,
    marginBottom: 30,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 16,
  },
  uniSelector: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 12,
  },
  uniScroll: {
    flexDirection: 'row',
  },
  uniChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    marginRight: 10,
    borderWidth: 1,
  },
  uniChipText: {
    fontSize: 14,
    fontWeight: '700',
  },
  uploadBox: {
    height: 120,
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  uploadText: {
    fontSize: 13,
    fontWeight: '600',
  },
  submitBtn: {
    marginTop: 10,
  },
  noteText: {
    textAlign: 'center',
    marginTop: 24,
    fontSize: 12,
    fontWeight: '500',
    opacity: 0.6,
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  successIconBox: {
    width: 120,
    height: 120,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  successText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '500',
    marginBottom: 40,
  },
  refCard: {
    width: '100%',
    alignItems: 'center',
    padding: 24,
    borderRadius: 24,
    marginBottom: 40,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  refLabel: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  refValue: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 1,
  },
  successBtn: {
    width: '100%',
  },
});
