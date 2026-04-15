import React, { useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, TextInput, View as DefaultView } from 'react-native';
import { Text, View, Card, ScreenContainer } from '../../components/Themed';
import { 
  Search, 
  MapPin, 
  Navigation, 
  Star, 
  Compass, 
  Clock, 
  Users, 
  TrendingDown, 
  AlertTriangle 
} from 'lucide-react-native';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from 'react-native';

const LOCATIONS = [
  { id: '1', name: 'University Library', type: 'Academic', distance: '200m', color: '#6366F1', queue: 5, waitTime: '10 min' },
  { id: '2', name: 'Senate House', type: 'Administrative', distance: '450m', color: '#F59E0B', queue: 42, waitTime: '1.5 hrs' },
  { id: '3', name: 'Bursar\'s Office', type: 'Finance', distance: '500m', color: '#10B981', queue: 18, waitTime: '45 min' },
  { id: '4', name: 'Student Union Building', type: 'Social', distance: '300m', color: '#EC4899', queue: 2, waitTime: '2 min' },
  { id: '5', name: 'ICT Center', type: 'Technical', distance: '150m', color: '#8B5CF6', queue: 25, waitTime: '55 min' },
];

export default function CampusScreen() {
  const [search, setSearch] = useState('');
  const [showQueues, setShowQueues] = useState(true);
  const theme = useColorScheme() ?? 'light';
  const colors = Colors[theme];

  return (
    <ScreenContainer>
      <View style={[styles.mapPlaceholder, { backgroundColor: theme === 'dark' ? '#0F172A' : '#F1F5F9' }]}>
        <View style={styles.mapGrid}>
          {LOCATIONS.map((loc, idx) => (
            <TouchableOpacity 
              key={loc.id} 
              style={[
                styles.mapPin, 
                { top: `${20 + idx * 15}%`, left: `${15 + (idx % 3) * 25}%` }
              ]}
            >
              <View style={[styles.pinDot, { backgroundColor: loc.color }]}>
                {showQueues ? (
                  <Text style={styles.pinText}>{loc.queue}</Text>
                ) : (
                  <MapPin size={12} color="#FFF" />
                )}
              </View>
              {loc.queue > 20 && <View style={[styles.pinPulse, { borderColor: colors.error }]} />}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.searchOverlay}>
          <Card style={[styles.searchBar, { backgroundColor: theme === 'dark' ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255,255,255,0.9)' }]}>
            <Search size={20} color={colors.secondaryText} />
            <TextInput 
              placeholder="Search offices or buildings..."
              style={[styles.searchInput, { color: colors.text }]}
              placeholderTextColor={colors.secondaryText}
              value={search}
              onChangeText={setSearch}
            />
            <TouchableOpacity 
              onPress={() => setShowQueues(!showQueues)}
              style={[styles.filterBtn, { backgroundColor: showQueues ? colors.primary : colors.border }]}
            >
              <Users size={18} color="#FFF" />
            </TouchableOpacity>
          </Card>
        </View>

        <TouchableOpacity style={[styles.gpsButton, { backgroundColor: colors.primary }]}>
          <Navigation size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.listSection}>
        <View style={styles.smartTip}>
          <TrendingDown size={18} color={colors.success} />
          <Text style={[styles.tipText, { color: colors.success }]}>
            Smart Tip: Senate House queue is decreasing. Best time to visit is in 30 mins!
          </Text>
        </View>

        <View style={styles.listHeader}>
          <Text style={styles.sectionTitle}>{showQueues ? 'Live Queue Status' : 'Nearby Locations'}</Text>
        </View>

        <ScrollView 
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          {LOCATIONS.filter(l => l.name.toLowerCase().includes(search.toLowerCase())).map((item) => (
            <TouchableOpacity key={item.id} activeOpacity={0.8}>
              <Card style={styles.locationCard}>
                <View style={[styles.iconBox, { backgroundColor: item.color + '15' }]}>
                  {showQueues ? <Users size={22} color={item.color} /> : <MapPin size={22} color={item.color} />}
                </View>
                <View style={styles.locationInfo}>
                  <Text style={styles.locationName}>{item.name}</Text>
                  <Text style={[styles.locationType, { color: colors.secondaryText }]}>
                    {item.type} • {item.distance}
                  </Text>
                </View>
                {showQueues && (
                  <View style={styles.queueStats}>
                    <Text style={[styles.queueCount, { color: item.queue > 25 ? colors.error : colors.text }]}>{item.queue} in line</Text>
                    <View style={styles.timeInfo}>
                      <Clock size={12} color={colors.secondaryText} />
                      <Text style={[styles.waitTime, { color: colors.secondaryText }]}>{item.waitTime}</Text>
                    </View>
                  </View>
                )}
                {!showQueues && (
                  <TouchableOpacity style={styles.starBtn}>
                    <Star size={20} color={colors.tabIconDefault} />
                  </TouchableOpacity>
                )}
              </Card>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  mapPlaceholder: {
    height: '45%',
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  mapGrid: {
    flex: 1,
  },
  mapPin: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    elevation: 4,
  },
  pinText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '900',
  },
  pinPulse: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    opacity: 0.3,
  },
  searchOverlay: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    paddingLeft: 16,
    borderRadius: 20,
    gap: 12,
    borderWidth: 0,
    elevation: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
  },
  filterBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gpsButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  listSection: {
    flex: 1,
    padding: 24,
    paddingTop: 16,
  },
  smartTip: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    marginBottom: 20,
    gap: 10,
  },
  tipText: {
    fontSize: 12,
    fontWeight: '700',
    flex: 1,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  listContent: {
    paddingBottom: 20,
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 16,
    borderRadius: 24,
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  locationInfo: {
    flex: 1,
  },
  locationName: {
    fontSize: 17,
    fontWeight: '800',
  },
  locationType: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 4,
  },
  queueStats: {
    alignItems: 'flex-end',
    gap: 4,
  },
  queueCount: {
    fontSize: 14,
    fontWeight: '800',
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  waitTime: {
    fontSize: 11,
    fontWeight: '700',
  },
  starBtn: {
    padding: 4,
  },
});
