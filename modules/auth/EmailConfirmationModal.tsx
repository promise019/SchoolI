import React, { useState } from 'react';
import { Modal, StyleSheet, View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from 'react-native';
import { api } from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useApp } from '../../store/appContext';
import { Mail, CheckCircle, RefreshCw, X } from 'lucide-react-native';

interface Props {
  visible: boolean;
  email: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const EmailConfirmationModal: React.FC<Props> = ({ visible, email, onClose, onSuccess }) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const { setIsAuthenticated } = useApp();
  const theme = useColorScheme() ?? 'light';
  const colors = Colors[theme];

  const handleConfirm = async () => {
    if (!code || code.trim().length < 6) {
      Alert.alert('Invalid Code', 'Please enter the full 6-digit confirmation code sent to your email.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.confirmEmail({ email, code: code.trim() });
      if (response.token) {
        await AsyncStorage.setItem('jwt_token', response.token);
      }
      Alert.alert('Email Confirmed!', 'Your account has been activated successfully.', [
        {
          text: 'Proceed',
          onPress: () => {
            setIsAuthenticated(true);
            onSuccess();
          },
        },
      ]);
    } catch (err: any) {
      Alert.alert('Confirmation Failed', err.message || 'Invalid confirmation code. Please check your email.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      const res = await api.resendConfirmationCode({ email });
      Alert.alert('Code Sent', res.message || 'A new confirmation code was sent to your email.');
    } catch (err: any) {
      Alert.alert('Resend Failed', err.message || 'Failed to resend confirmation code.');
    } finally {
      setResending(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <X size={20} color={colors.secondaryText} />
          </TouchableOpacity>

          <View style={[styles.iconBox, { backgroundColor: colors.primary + '15' }]}>
            <Mail size={36} color={colors.primary} />
          </View>

          <Text style={[styles.title, { color: colors.text }]}>Confirm Your Email</Text>
          <Text style={[styles.subtitle, { color: colors.secondaryText }]}>
            We've sent a 6-digit verification code to <Text style={{ color: colors.primary, fontWeight: 'bold' }}>{email}</Text>. Please enter it below to activate your account.
          </Text>

          <Input
            label="6-Digit Confirmation Code"
            placeholder="e.g. 123456"
            value={code}
            onChangeText={setCode}
            keyboardType="number-pad"
            maxLength={6}
            style={styles.codeInput}
          />

          <Button title="Verify & Activate Account" onPress={handleConfirm} loading={loading} style={styles.btn} />

          <TouchableOpacity onPress={handleResend} disabled={resending} style={styles.resendBtn}>
            {resending ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Text style={[styles.resendText, { color: colors.primary }]}>
                Didn't receive code? <Text style={{ fontWeight: 'bold', underline: true } as any}>Resend Code</Text>
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    alignItems: 'center',
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 8,
  },
  iconBox: {
    width: 72,
    height: 72,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  codeInput: {
    letterSpacing: 4,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    width: '100%',
  },
  btn: {
    width: '100%',
    marginTop: 12,
  },
  resendBtn: {
    marginTop: 16,
    padding: 8,
  },
  resendText: {
    fontSize: 13,
    fontWeight: '500',
  },
});
