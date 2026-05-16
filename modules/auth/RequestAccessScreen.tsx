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
import { UNIVERSITIES } from '../../constants/Universities';

export default function RequestAccessScreen() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    studentId: '',
    university: UNIVERSITIES[0].name
  });

  const theme = useColorScheme() ?? 'light';
  const colors = Colors[theme];

  const handleSubmit = () => {
    if (!formData.fullName || !formData.email || !formData.university) {
      Alert.alert("Required Fields", "Please fill in all mandatory fields.");
      return;
    }

    setLoading(true);
    // Simulate API request
    setTimeout(() => {
      setLoading(false);
      setIsSuccess(true);
    }, 2000);
  };

  if (isSuccess) {
    return (
      <ScreenContainer>
        <View style={styles.successContainer}>
          <View style={[styles.successIconBox, { backgroundColor: colors.success + '15' }]}>
            <CheckCircle size={64} color={colors.success} />
          </View>
          <Text style={styles.successTitle}>Request Submitted!</Text>
          <Text style={[styles.successText, { color: colors.secondaryText }]}>
            Your request for SchoolI access has been received. Our team will verify your details and send your credentials to {formData.email}.
          </Text>
          <Card style={styles.refCard}>
            <Text style={[styles.refLabel, { color: colors.secondaryText }]}>Reference Number</Text>
            <Text style={styles.refValue}>REQ-{Math.floor(Math.random() * 90000) + 10000}</Text>
          </Card>
          <Button 
            title="Back to Login" 
            onPress={() => router.replace('/(auth)' as any)} 
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
          <Text style={styles.headerTitle}>Request Access</Text>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView 
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.introText, { color: colors.secondaryText }]}>
            Don't have login credentials? Apply for access by providing your university details below.
          </Text>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.primary }]}>Personal Details</Text>
            <Input 
              label="Full Name"
              placeholder="e.g. John Doe"
              value={formData.fullName}
              onChangeText={(text) => setFormData({...formData, fullName: text})}
              leftIcon={<User size={18} color={colors.secondaryText} />}
            />
            <Input 
              label="University Email"
              placeholder="e.g. john.doe@uniuyo.edu.ng"
              value={formData.email}
              onChangeText={(text) => setFormData({...formData, email: text})}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon={<Mail size={18} color={colors.secondaryText} />}
            />
            <Input 
              label="Phone Number"
              placeholder="+234 ..."
              value={formData.phone}
              onChangeText={(text) => setFormData({...formData, phone: text})}
              keyboardType="phone-pad"
              leftIcon={<Phone size={18} color={colors.secondaryText} />}
            />
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.primary }]}>Academic Information</Text>
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
            <Input 
              label="Student ID / Matric Number"
              placeholder="e.g. CSC/2026/001 (Optional)"
              value={formData.studentId}
              onChangeText={(text) => setFormData({...formData, studentId: text})}
              leftIcon={<Hash size={18} color={colors.secondaryText} />}
            />
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.primary }]}>Identity Verification</Text>
            <TouchableOpacity style={[styles.uploadBox, { borderColor: colors.border }]}>
              <Camera size={28} color={colors.secondaryText} />
              <Text style={[styles.uploadText, { color: colors.secondaryText }]}>Upload ID Card or Admission Letter</Text>
            </TouchableOpacity>
          </View>

          <Button 
            title="Submit Request" 
            onPress={handleSubmit} 
            loading={loading}
            style={styles.submitBtn}
          />

          <Text style={[styles.noteText, { color: colors.secondaryText }]}>
            Accounts are usually verified within 24-48 hours. By submitting, you agree to our data verification policy.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
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
