import React, { useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Text, View, ScreenContainer, Card } from '../../components/Themed';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { 
  ArrowLeft, 
  Mail, 
  CheckCircle,
  Hash,
  Info
} from 'lucide-react-native';
import { router } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from 'react-native';

export default function ForgotPasswordScreen() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [studentId, setStudentId] = useState('');
  const [email, setEmail] = useState('');

  const theme = useColorScheme() ?? 'light';
  const colors = Colors[theme];

  const handleSubmit = () => {
    if (!studentId || !email) {
      Alert.alert("Required Fields", "Please enter both your Student ID and Registered Email.");
      return;
    }

    setLoading(true);
    // Simulate API request
    setTimeout(() => {
      setLoading(false);
      setIsSuccess(true);
    }, 1800);
  };

  if (isSuccess) {
    return (
      <ScreenContainer>
        <View style={styles.successContainer}>
          <View style={[styles.successIconBox, { backgroundColor: colors.success + '15' }]}>
            <CheckCircle size={64} color={colors.success} />
          </View>
          <Text style={styles.successTitle}>Check Your Email</Text>
          <Text style={[styles.successText, { color: colors.secondaryText }]}>
            We have sent a secure password reset link to <Text style={{ color: colors.text, fontWeight: '800' }}>{email}</Text>. Please follow the instructions in the email to recover your account.
          </Text>
          
          <View style={[styles.infoCard, { backgroundColor: colors.border + '20' }]}>
            <Info size={20} color={colors.secondaryText} />
            <Text style={[styles.infoNote, { color: colors.secondaryText }]}>
              Check your spam or junk folder if you don't see the email within 5 minutes.
            </Text>
          </View>

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
          <Text style={styles.headerTitle}>Recovery</Text>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView 
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.introHeader}>
            <View style={[styles.iconCircle, { backgroundColor: colors.primary + '15' }]}>
              <Mail size={32} color={colors.primary} />
            </View>
            <Text style={styles.title}>Forgot Password?</Text>
            <Text style={[styles.subtitle, { color: colors.secondaryText }]}>
              Enter your details below and we'll send a link to reset your account credentials safely.
            </Text>
          </View>

          <View style={styles.form}>
            <Input 
              label="Student ID / Matric No"
              placeholder="e.g. CSC/2026/001"
              value={studentId}
              onChangeText={setStudentId}
              autoCapitalize="characters"
              leftIcon={<Hash size={18} color={colors.secondaryText} />}
            />
            <Input 
              label="Registered Email"
              placeholder="e.g. student@university.edu.ng"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon={<Mail size={18} color={colors.secondaryText} />}
            />

            <Button 
              title="Send Reset Link" 
              onPress={handleSubmit} 
              loading={loading}
              style={styles.submitBtn}
            />
          </View>

          <View style={styles.helpBox}>
            <Text style={[styles.helpText, { color: colors.secondaryText }]}>
              Still having trouble? 
            </Text>
            <TouchableOpacity onPress={() => router.push('/auth/request-access' as any)}>
              <Text style={[styles.helpLink, { color: colors.primary }]}> Contact ICT Support</Text>
            </TouchableOpacity>
          </View>
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
    paddingTop: 20,
  },
  introHeader: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '500',
    marginTop: 12,
  },
  form: {
    width: '100%',
  },
  submitBtn: {
    marginTop: 12,
  },
  helpBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  helpText: {
    fontSize: 14,
    fontWeight: '500',
  },
  helpLink: {
    fontSize: 14,
    fontWeight: '800',
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
    marginBottom: 30,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderRadius: 16,
    gap: 12,
    marginBottom: 40,
    width: '100%',
  },
  infoNote: {
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  successBtn: {
    width: '100%',
  },
});
