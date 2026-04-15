import React from 'react';
import { StyleSheet, ScrollView, View as DefaultView, TouchableOpacity } from 'react-native';
import { Text, View, Card, ScreenContainer } from '../../components/Themed';
import { Button } from '../../components/Button';
import { Bed, Info, Home, ShieldCheck } from 'lucide-react-native';
import { Stack } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from 'react-native';

export default function HostelScreen() {
  const theme = useColorScheme() ?? 'light';
  const colors = Colors[theme];

  return (
    <ScreenContainer>
      <Stack.Screen options={{ title: 'Hostel Registration' }} />
      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Card style={[styles.statusCard, { backgroundColor: '#818CF8' }]}>
          <View style={styles.statusInner}>
            <View style={styles.statusTextContent}>
              <Text style={styles.statusLabel}>ALLOCATION STATUS</Text>
              <Text style={styles.statusValue}>Currently Unassigned</Text>
            </View>
            <View style={[styles.iconBox, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
              <Bed size={32} color="#FFF" />
            </View>
          </View>
          <View style={styles.statusFooter}>
            <Text style={styles.footerText}>Application Window: <Text style={{fontWeight: '900'}}>OPEN</Text></Text>
          </View>
        </Card>

        <View style={styles.sectionHeader}>
          <Home size={18} color={colors.secondaryText} />
          <Text style={[styles.sectionTitle, { color: colors.secondaryText }]}>Available Options</Text>
        </View>

        <Card style={styles.hostelCard}>
          <View style={styles.hostelHeader}>
            <View>
              <Text style={styles.hostelName}>Hall 4 (Premium)</Text>
              <Text style={[styles.hostelDesc, { color: colors.secondaryText }]}>Male • En-suite • 4 per room</Text>
            </View>
            <View style={[styles.priceTag, { backgroundColor: colors.primary + '15' }]}>
              <Text style={[styles.priceText, { color: colors.primary }]}>₦85k/yr</Text>
            </View>
          </View>
          <View style={styles.amenities}>
            <Amenity icon={ShieldCheck} label="24/7 Security" />
            <Amenity icon={Info} label="Free WiFi" />
          </View>
          <Button title="Choose This Hall" onPress={() => {}} variant="outline" style={styles.selectBtn} />
        </Card>

        <Card style={styles.hostelCard}>
          <View style={styles.hostelHeader}>
            <View>
              <Text style={styles.hostelName}>Hall 2 (Standard)</Text>
              <Text style={[styles.hostelDesc, { color: colors.secondaryText }]}>Male • 6 per room • Shared</Text>
            </View>
            <View style={[styles.priceTag, { backgroundColor: colors.primary + '15' }]}>
              <Text style={[styles.priceText, { color: colors.primary }]}>₦45k/yr</Text>
            </View>
          </View>
          <View style={styles.amenities}>
            <Amenity icon={ShieldCheck} label="Serene Env" />
            <Amenity icon={Info} label="Regular Water" />
          </View>
          <Button title="Choose This Hall" onPress={() => {}} variant="outline" style={styles.selectBtn} />
        </Card>

        <View style={styles.noticeBox}>
          <Info size={16} color={colors.secondaryText} />
          <Text style={[styles.noticeText, { color: colors.secondaryText }]}>
            Final allocation depends on school fee clearance and departmental verification.
          </Text>
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.background + 'CC' }]}>
        <Button title="Submit Application" onPress={() => alert('Hostel Application Sent!')} />
      </View>
    </ScreenContainer>
  );
}

const Amenity = ({ icon: Icon, label }: any) => {
  const theme = useColorScheme() ?? 'light';
  const colors = Colors[theme];
  return (
    <View style={styles.amenityItem}>
      <Icon size={12} color={colors.secondaryText} />
      <Text style={[styles.amenityText, { color: colors.secondaryText }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 24,
    paddingBottom: 110,
  },
  statusCard: {
    padding: 0,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 32,
    elevation: 8,
  },
  statusInner: {
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusTextContent: {
    gap: 4,
  },
  statusLabel: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '800',
    opacity: 0.8,
    letterSpacing: 0.5,
  },
  statusValue: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '900',
  },
  iconBox: {
    width: 64,
    height: 64,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusFooter: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  footerText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '500',
    opacity: 0.9,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
    marginLeft: 4,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  hostelCard: {
    marginBottom: 20,
    padding: 20,
    borderRadius: 24,
  },
  hostelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  hostelName: {
    fontSize: 19,
    fontWeight: '800',
  },
  hostelDesc: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 4,
  },
  priceTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  priceText: {
    fontSize: 14,
    fontWeight: '800',
  },
  amenities: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  amenityText: {
    fontSize: 12,
    fontWeight: '600',
  },
  selectBtn: {
    height: 48,
    borderRadius: 14,
  },
  noticeBox: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    marginTop: 10,
  },
  noticeText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
});
