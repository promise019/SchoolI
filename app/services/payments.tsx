import React from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, View as DefaultView } from 'react-native';
import { Text, View, Card, ScreenContainer } from '../../components/Themed';
import { Button } from '../../components/Button';
import { CreditCard, CheckCircle2, Clock, ChevronRight, Receipt, Plus } from 'lucide-react-native';
import { Stack } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from 'react-native';

const TRANSACTIONS = [
  { id: '1', title: 'School Fees - 1st Semester', amount: '₦45,000', date: 'Oct 12, 2025', status: 'Verified' },
  { id: '2', title: 'Departmental Dues', amount: '₦2,500', date: 'Oct 14, 2025', status: 'Verified' },
  { id: '3', title: 'Hostel Application Fee', amount: '₦5,000', date: 'Nov 02, 2025', status: 'Pending' },
];

export default function PaymentsScreen() {
  const theme = useColorScheme() ?? 'light';
  const colors = Colors[theme];

  return (
    <ScreenContainer>
      <Stack.Screen options={{ title: 'Payment History' }} />
      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Card style={[styles.balanceCard, { backgroundColor: colors.card }]}>
          <View style={styles.balanceHeader}>
            <Text style={[styles.balanceLabel, { color: colors.secondaryText }]}>OUTSTANDING BALANCE</Text>
            <Text style={styles.balanceAmount}>₦85,000</Text>
          </View>
          <View style={styles.actionRow}>
            <Button 
              title="Pay Now" 
              onPress={() => {}} 
              style={styles.payBtn} 
            />
            <TouchableOpacity style={[styles.addFundBtn, { borderColor: colors.border }]}>
              <Plus size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </Card>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Receipt size={18} color={colors.secondaryText} />
            <Text style={[styles.sectionTitle, { color: colors.secondaryText }]}>Transaction History</Text>
          </View>
          
          {TRANSACTIONS.map((tx) => (
            <TouchableOpacity key={tx.id} activeOpacity={0.8} style={styles.txItem}>
              <Card style={styles.txCard}>
                <View style={[styles.txIcon, { backgroundColor: tx.status === 'Verified' ? colors.success + '15' : colors.warning + '15' }]}>
                  {tx.status === 'Verified' ? (
                    <CheckCircle2 size={24} color={colors.success} />
                  ) : (
                    <Clock size={24} color={colors.warning} />
                  )}
                </View>
                <View style={styles.txInfo}>
                  <Text style={styles.txTitle}>{tx.title}</Text>
                  <Text style={[styles.txDate, { color: colors.secondaryText }]}>{tx.date}</Text>
                </View>
                <View style={styles.txRight}>
                  <Text style={styles.txAmount}>{tx.amount}</Text>
                  <Text style={[
                    styles.statusText, 
                    { color: tx.status === 'Verified' ? colors.success : colors.warning }
                  ]}>
                    {tx.status}
                  </Text>
                </View>
              </Card>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity activeOpacity={0.9}>
          <Card style={[styles.verifyCard, { backgroundColor: colors.success + '10', borderColor: colors.success + '30' }]}>
            <View style={[styles.verifyIcon, { backgroundColor: colors.success }]}>
              <CreditCard size={20} color="#FFF" />
            </View>
            <View style={styles.verifyContent}>
              <Text style={styles.verifyTitle}>Verify Hand-held Receipt</Text>
              <Text style={[styles.verifyDesc, { color: colors.secondaryText }]}>
                Scan your bank teller or departmental receipt to verify.
              </Text>
            </View>
            <ChevronRight size={20} color={colors.secondaryText} />
          </Card>
        </TouchableOpacity>

        <TouchableOpacity style={styles.helpLink}>
          <Text style={[styles.helpText, { color: colors.primary }]}>Having payment issues? Contact Support</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 24,
    paddingBottom: 40,
  },
  balanceCard: {
    padding: 24,
    borderRadius: 30,
    marginBottom: 32,
    elevation: 4,
    shadowOpacity: 0.1,
  },
  balanceHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  balanceLabel: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  balanceAmount: {
    fontSize: 42,
    fontWeight: '900',
    marginTop: 8,
    letterSpacing: -1,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  payBtn: {
    flex: 1,
    height: 54,
  },
  addFundBtn: {
    width: 54,
    height: 54,
    borderRadius: 16,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
    marginLeft: 4,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  txItem: {
    marginBottom: 16,
  },
  txCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 24,
  },
  txIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  txInfo: {
    flex: 1,
  },
  txTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  txDate: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  txRight: {
    alignItems: 'flex-end',
  },
  txAmount: {
    fontSize: 16,
    fontWeight: '800',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '800',
    marginTop: 4,
    textTransform: 'uppercase',
  },
  verifyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 24,
    marginVertical: 10,
  },
  verifyIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  verifyContent: {
    flex: 1,
  },
  verifyTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  verifyDesc: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
    lineHeight: 16,
  },
  helpLink: {
    marginTop: 32,
    alignItems: 'center',
  },
  helpText: {
    fontSize: 14,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});
