import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, TextInput, View as DefaultView, Alert } from 'react-native';
import { Text, View, Card, ScreenContainer } from '../../components/Themed';
import * as Location from 'expo-location';
import { 
  Search, 
  MapPin, 
  Navigation, 
  Star, 
  Compass, 
  Clock, 
  Users, 
  TrendingDown, 
  AlertTriangle,
  RefreshCw
} from 'lucide-react-native';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from 'react-native';
import { useApp } from '../../store/appContext';

// Helper for real-world distance calculation (Haversine)
function getDistanceInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
  return R * c; // Distance in km
}

import MapView, { Marker, Callout } from 'react-native-maps';

export default function CampusScreen() {
  const { university } = useApp();
  const [search, setSearch] = useState('');
  const [showQueues, setShowQueues] = useState(true);
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const mapRef = useRef<MapView>(null);
  
  // Local state for "Live" queues (simulated)
  const [landmarks, setLandmarks] = useState(university?.landmarks || []);
  
  const theme = useColorScheme() ?? 'light';
  const colors = Colors[theme];

  // Request Location Permissions & Fetch Initial Position
  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }

        const enabled = await Location.hasServicesEnabledAsync();
        if (!enabled) {
          setErrorMsg('Location services are disabled');
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setUserLocation(location);
        setErrorMsg(null);
      } catch (error) {
        console.error('Location Error:', error);
        setErrorMsg('Could not fetch location. Please ensure location services are enabled.');
      }
    })();
  }, []);

  // Update landmarks when university changes
  useEffect(() => {
    if (university?.landmarks) {
      setLandmarks(university.landmarks.map(l => ({
        ...l,
        queue: Math.floor(Math.random() * 30) + 2, // Init mock queue
        waitTime: Math.floor(Math.random() * 45) + ' min'
      })));
    }
  }, [university]);

  // Simulation: Fluctuate queues every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLandmarks(prev => prev.map(l => {
        const diff = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
        const newQueue = Math.max(0, (l.queue || 0) + diff);
        return {
          ...l,
          queue: newQueue,
          waitTime: Math.floor(newQueue * 2.5) + ' min'
        };
      }));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const refreshLocation = async () => {
    setIsRefreshing(true);
    try {
      const enabled = await Location.hasServicesEnabledAsync();
      if (!enabled) {
        Alert.alert("Location Error", "Location services are disabled. Please enable them in settings.");
        setErrorMsg('Location services are disabled');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setUserLocation(location);
      setErrorMsg(null);
      
      // Focus map on user
      mapRef.current?.animateToRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
    } catch (e) {
      console.error(e);
      Alert.alert("Location Error", "Could not refresh your position.");
    } finally {
      setIsRefreshing(false);
    }
  };

  const focusBuilding = (lat: number, lng: number) => {
    mapRef.current?.animateToRegion({
      latitude: lat,
      longitude: lng,
      latitudeDelta: 0.002,
      longitudeDelta: 0.002,
    });
  };

  const getDistanceText = (lat: number, lng: number) => {
    if (!userLocation) return '--';
    const dist = getDistanceInKm(
      userLocation.coords.latitude, 
      userLocation.coords.longitude, 
      lat, 
      lng
    );
    if (dist < 1) return Math.round(dist * 1000) + 'm';
    return dist.toFixed(1) + 'km';
  };

  const initialRegion = {
    latitude: university?.coordinates.lat || 5.0416,
    longitude: university?.coordinates.lng || 7.9142,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <ScreenContainer>
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={initialRegion}
          showsUserLocation={true}
          userInterfaceStyle={theme === 'dark' ? 'dark' : 'light'}
          showsMyLocationButton={false}
          showsCompass={false}
        >
          {landmarks.map((loc) => (
            <Marker
              key={loc.id}
              coordinate={{ latitude: loc.lat, longitude: loc.lng }}
              pinColor={loc.color}
            >
              <Callout tooltip>
                <Card style={styles.calloutCard}>
                  <Text style={styles.calloutTitle}>{loc.name}</Text>
                  <View style={styles.calloutRow}>
                    <Users size={14} color={colors.primary} />
                    <Text style={[styles.calloutText, { color: colors.primary }]}>{loc.queue} in line</Text>
                  </View>
                  <View style={styles.calloutRow}>
                    <Clock size={14} color={colors.secondaryText} />
                    <Text style={styles.calloutSubtext}>{loc.waitTime} wait</Text>
                  </View>
                </Card>
              </Callout>
            </Marker>
          ))}
        </MapView>

        <View style={styles.searchOverlay}>
          <Card style={[styles.searchBar, { backgroundColor: theme === 'dark' ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255,255,255,0.95)' }]}>
            <Search size={20} color={colors.secondaryText} />
            <TextInput 
              placeholder="Search buildings..."
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

        <TouchableOpacity 
          onPress={refreshLocation}
          style={[styles.gpsButton, { backgroundColor: colors.primary }]}
        >
          {isRefreshing ? <RefreshCw size={24} color="#FFF" /> : <Navigation size={24} color="#FFF" />}
        </TouchableOpacity>
      </View>

      <View style={styles.listSection}>
        {errorMsg ? (
          <View style={[styles.smartTip, { backgroundColor: colors.error + '10' }]}>
            <AlertTriangle size={18} color={colors.error} />
            <Text style={[styles.tipText, { color: colors.error }]}>{errorMsg}</Text>
          </View>
        ) : (
          <View style={styles.smartTip}>
            <TrendingDown size={18} color={colors.success} />
            <Text style={[styles.tipText, { color: colors.success }]}>
              {userLocation ? 'GPS Live: Nearby office wait times updated.' : 'Finding your location...'}
            </Text>
          </View>
        )}

        <View style={styles.listHeader}>
          <Text style={styles.sectionTitle}>{showQueues ? 'Live Queue Status' : 'Nearby Locations'}</Text>
        </View>

        <ScrollView 
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          {landmarks.filter(l => l.name.toLowerCase().includes(search.toLowerCase())).map((item) => (
            <TouchableOpacity 
              key={item.id} 
              activeOpacity={0.8}
              onPress={() => focusBuilding(item.lat, item.lng)}
            >
              <Card style={styles.locationCard}>
                <View style={[styles.iconBox, { backgroundColor: item.color + '15' }]}>
                  {showQueues ? <Users size={22} color={item.color} /> : <MapPin size={22} color={item.color} />}
                </View>
                <View style={styles.locationInfo}>
                  <Text style={styles.locationName}>{item.name}</Text>
                  <Text style={[styles.locationType, { color: colors.secondaryText }]}>
                    {item.type} • {getDistanceText(item.lat, item.lng)}
                  </Text>
                </View>
                {showQueues && (
                  <View style={styles.queueStats}>
                    <Text style={[styles.queueCount, { color: (item.queue || 0) > 25 ? colors.error : colors.text }]}>{item.queue} in line</Text>
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
  mapContainer: {
    height: '45%',
    width: '100%',
    position: 'relative',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  calloutCard: {
    width: 200,
    padding: 12,
    borderRadius: 16,
    borderWidth: 0,
    elevation: 4,
  },
  calloutTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 8,
  },
  calloutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  calloutText: {
    fontSize: 13,
    fontWeight: '700',
  },
  calloutSubtext: {
    fontSize: 11,
    fontWeight: '600',
    opacity: 0.6,
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
