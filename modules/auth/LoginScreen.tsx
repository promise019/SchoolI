import React, { useState } from 'react';
import { StyleSheet, Image, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { Text, View, ScreenContainer } from '../../components/Themed';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { router } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from 'react-native';

import { Eye, EyeOff } from 'lucide-react-native';
import { api } from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useApp } from '../../store/appContext';
import { Alert } from 'react-native';

import logoImg from '../../assets/images/splash-icon.png';

export default function LoginScreen() {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const theme = useColorScheme() ?? 'light';
  const colors = Colors[theme];

  const { setIsAuthenticated } = useApp();

  const handleLogin = async () => {
    if (!studentId || !password) {
      Alert.alert('Error', 'Please enter both Student ID and Password');
      return;
    }

    setLoading(true);
    try {
      const response = await api.login({ studentId, password });
      await AsyncStorage.setItem('jwt_token', response.token);
      setIsAuthenticated(true);
      router.replace('/(tabs)' as any);
    } catch (error: any) {
      console.error('Login Failed with error:', error);
      Alert.alert('Login Failed', error.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Image source={logoImg} style={styles.logoImage} resizeMode="contain" />
            </View>
            <Text style={styles.title}>SchoolI</Text>
            <Text style={[styles.subtitle, { color: colors.secondaryText }]}>
              Your University Life, Simplified.
            </Text>
          </View>

          <View style={styles.form}>
            <Input 
              label="Student ID"
              placeholder="e.g. CSC/2026/001"
              value={studentId}
              onChangeText={setStudentId}
              autoCapitalize="characters"
            />
            <Input 
              label="Password"
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              rightIcon={
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <EyeOff size={20} color={colors.secondaryText} />
                  ) : (
                    <Eye size={20} color={colors.secondaryText} />
                  )}
                </TouchableOpacity>
              }
            />
            
            <TouchableOpacity 
              onPress={() => router.push('/auth/forgot-password' as any)}
              style={styles.forgotPass}
            >
              <Text style={[styles.forgotLabel, { color: colors.primary }]}>
                Forgot Password?
              </Text>
            </TouchableOpacity>

            <Button 
              title="Sign In" 
              onPress={handleLogin} 
              loading={loading}
              style={styles.button}
            />

            <View style={styles.divider}>
              <View style={[styles.line, { backgroundColor: colors.border }]} />
              <Text style={[styles.dividerText, { color: colors.secondaryText }]}>OR</Text>
              <View style={[styles.line, { backgroundColor: colors.border }]} />
            </View>

            <Button 
               title="Request Access" 
               onPress={() => router.push('/auth/request-access' as any)} 
               variant="outline"
             />

            <TouchableOpacity 
              onPress={() => router.push('/explore')} 
              style={[styles.socialBtn, { borderColor: colors.border }]}
            >
              <Text style={[styles.socialText, { color: colors.primary }]}>Explore Schools First</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.secondaryText }]}>
              By signing in, you agree to our Terms of Service and Privacy Policy.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 30,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 50,
  },
  logoContainer: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    marginTop: 8,
    fontWeight: '500',
  },
  form: {
    width: '100%',
  },
  forgotPass: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  button: {
    elevation: 4,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  line: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    fontWeight: '700',
  },
  footer: {
    marginTop: 40,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    opacity: 0.7,
  },
  socialBtn: {
    height: 54,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  socialText: {
    fontSize: 15,
    fontWeight: '700',
  },
});
