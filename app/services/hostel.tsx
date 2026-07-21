import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View as DefaultView, TouchableOpacity, ActivityIndicator, Alert, TextInput } from 'react-native';
import { Text, View, Card, ScreenContainer } from '../../components/Themed';
import { Button } from '../../components/Button';
import { Bed, Info, Home, ShieldCheck, Plus, Minus, Edit3, Save } from 'lucide-react-native';
import { Stack } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from 'react-native';
import { api } from '../../services/api';
import { socketService } from '../../services/socketService';
import { useApp } from '../../store/appContext';

interface Hostel {
  _id: string;
  name: string;
  totalSpaces: number;
  availableSpaces: number;
  gender: string;
  price: string;
  type: string;
  amenities: string[];
}

export default function HostelScreen() {
  const { user } = useApp();
  const theme = useColorScheme() ?? 'light';
  const colors = Colors[theme];
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(user?.studentId?.startsWith('ADMIN') || false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    fetchHostels();

    // Listen for real-time updates
    socketService.onHostelUpdate((updatedHostel) => {
      setHostels(prev => prev.map(h => h._id === updatedHostel._id ? updatedHostel : h));
    });
  }, []);

  const fetchHostels = async () => {
    try {
      setIsLoading(true);
      const data = await api.getHostels();
      setHostels(data);
    } catch (error) {
      console.error('Error fetching hostels:', error);
      Alert.alert('Error', 'Failed to load hostels. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateSpaces = async (hostelId: string, newSpaces: number) => {
    try {
      await api.updateHostelSpaces(hostelId, newSpaces);
      setEditingId(null);
    } catch (error) {
      Alert.alert('Error', 'Failed to update spaces.');
    }
  };

  const startEditing = (hostel: Hostel) => {
    setEditingId(hostel._id);
    setEditValue(hostel.availableSpaces.toString());
  };

  if (isLoading) {
    return (
      <ScreenContainer>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </ScreenContainer>
    );
  }

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
          <Text style={[styles.sectionTitle, { color: colors.secondaryText }]}>
            {isAdmin ? 'Manage Hostels (Admin)' : 'Available Options'}
          </Text>
        </View>

        {hostels.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={{ color: colors.secondaryText }}>No hostels available yet.</Text>
          </View>
        ) : (
          hostels.map((hostel) => (
            <Card key={hostel._id} style={styles.hostelCard}>
              <View style={styles.hostelHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.hostelName}>{hostel.name}</Text>
                  <Text style={[styles.hostelDesc, { color: colors.secondaryText }]}>
                    {hostel.gender} • {hostel.type} • {hostel.totalSpaces} total
                  </Text>
                </View>
                <View style={[styles.priceTag, { backgroundColor: colors.primary + '15' }]}>
                  <Text style={[styles.priceText, { color: colors.primary }]}>{hostel.price}</Text>
                </View>
              </View>

              <View style={styles.availabilityRow}>
                <View style={styles.availabilityInfo}>
                   <Text style={[styles.availLabel, { color: colors.secondaryText }]}>Spaces Left:</Text>
                   {editingId === hostel._id ? (
                     <TextInput
                       style={[styles.editInput, { color: colors.text, borderColor: colors.primary }]}
                       value={editValue}
                       onChangeText={setEditValue}
                       keyboardType="numeric"
                       autoFocus
                     />
                   ) : (
                     <Text style={[styles.availValue, { color: hostel.availableSpaces > 0 ? colors.success : colors.error }]}>
                       {hostel.availableSpaces}
                     </Text>
                   )}
                </View>
                
                {isAdmin && (
                  <View style={styles.adminActions}>
                    {editingId === hostel._id ? (
                      <TouchableOpacity 
                        onPress={() => handleUpdateSpaces(hostel._id, parseInt(editValue))}
                        style={[styles.actionBtn, { backgroundColor: colors.success }]}
                      >
                        <Save size={18} color="#FFF" />
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity 
                        onPress={() => startEditing(hostel)}
                        style={[styles.actionBtn, { backgroundColor: colors.primary }]}
                      >
                        <Edit3 size={18} color="#FFF" />
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </View>

              <View style={styles.amenities}>
                {hostel.amenities.slice(0, 2).map((amenity, idx) => (
                  <Amenity key={idx} icon={ShieldCheck} label={amenity} />
                ))}
              </View>

              <Button 
                title={hostel.availableSpaces > 0 ? "Choose This Hall" : "Hall Full"} 
                onPress={() => Alert.alert('Sent', 'Application sent for ' + hostel.name)} 
                variant="outline" 
                disabled={hostel.availableSpaces <= 0}
                style={styles.selectBtn} 
              />
            </Card>
          ))
        )}

        <View style={styles.noticeBox}>
          <Info size={16} color={colors.secondaryText} />
          <Text style={[styles.noticeText, { color: colors.secondaryText }]}>
            Real-time updates enabled. Final allocation depends on school fee clearance.
          </Text>
        </View>
      </ScrollView>

      {!isAdmin && (
        <View style={[styles.footer, { backgroundColor: colors.background + 'CC' }]}>
          <Button title="Apply for Allocation" onPress={() => Alert.alert('Application Submitted')} />
        </View>
      )}
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginBottom: 12,
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
  availabilityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.02)',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  availabilityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  availLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  availValue: {
    fontSize: 18,
    fontWeight: '900',
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
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  adminActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editInput: {
    width: 60,
    height: 30,
    borderWidth: 1,
    borderRadius: 6,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '700',
    padding: 0,
  }
});
