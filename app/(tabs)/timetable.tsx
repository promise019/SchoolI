import React, { useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, View as DefaultView } from 'react-native';
import { Text, View, Card, ScreenContainer } from '../../components/Themed';
import { MapPin, Clock, Calendar as CalendarIcon } from 'lucide-react-native';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from 'react-native';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const SCHEDULE = {
  Mon: [
    { time: '08:00 - 10:00', code: 'CSC 411', title: 'Artificial Intelligence', location: 'Hall A' },
    { time: '11:00 - 13:00', code: 'CSC 412', title: 'Compiler Construction', location: 'Hall B' },
  ],
  Tue: [
    { time: '09:00 - 11:00', code: 'GST 411', title: 'Entrepreneurship', location: 'Main Aud' },
    { time: '14:00 - 16:00', code: 'CSC 451', title: 'Data Mining', location: 'Lab 2' },
  ],
  Wed: [
    { time: '08:00 - 10:00', code: 'CSC 413', title: 'Software Engineering II', location: 'Hall A' },
  ],
  Thu: [
    { time: '10:00 - 12:00', code: 'CSC 411', title: 'Artificial Intelligence', location: 'Hall C' },
  ],
  Fri: [
    { time: '09:00 - 11:00', code: 'CSC 452', title: 'Cryptography', location: 'Hall B' },
  ],
};

export default function TimetableScreen() {
  const [activeDay, setActiveDay] = useState('Mon');
  const theme = useColorScheme() ?? 'light';
  const colors = Colors[theme];

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <CalendarIcon size={24} color={colors.primary} />
          <Text style={styles.headerTitle}>Weekly Schedule</Text>
        </View>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.daysContainer}
        >
          {DAYS.map((day) => (
            <TouchableOpacity 
              key={day} 
              onPress={() => setActiveDay(day)}
              style={[
                styles.dayTab, 
                activeDay === day && { backgroundColor: colors.primary, borderColor: colors.primary }
              ]}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.dayText, 
                activeDay === day && { color: '#FFF', fontWeight: '800' }
              ]}>
                {day}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView 
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {SCHEDULE[activeDay as keyof typeof SCHEDULE].map((item, index) => (
          <Card key={index} style={styles.itemCard}>
            <View style={[styles.timeColumn, { backgroundColor: colors.primary + '10' }]}>
              <Clock size={16} color={colors.primary} />
              <Text style={[styles.startTime, { color: colors.primary }]}>{item.time.split(' - ')[0]}</Text>
              <View style={[styles.connector, { backgroundColor: colors.primary + '30' }]} />
              <Text style={styles.endTime}>{item.time.split(' - ')[1]}</Text>
            </View>
            <View style={styles.detailsColumn}>
              <View style={styles.metaRow}>
                <Text style={[styles.itemCode, { color: colors.secondaryText }]}>{item.code}</Text>
                <View style={[styles.statusBadge, { backgroundColor: colors.success + '20' }]}>
                  <Text style={[styles.statusText, { color: colors.success }]}>Active</Text>
                </View>
              </View>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <View style={styles.locationRow}>
                <MapPin size={14} color={colors.secondaryText} />
                <Text style={[styles.locationText, { color: colors.secondaryText }]}>{item.location}</Text>
              </View>
            </View>
          </Card>
        ))}

        {SCHEDULE[activeDay as keyof typeof SCHEDULE].length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No classes scheduled for today.</Text>
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  daysContainer: {
    paddingHorizontal: 20,
    gap: 10,
    paddingBottom: 10,
  },
  dayTab: {
    width: 65,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
    backgroundColor: 'rgba(0,0,0,0.04)',
  },
  dayText: {
    fontSize: 15,
    fontWeight: '700',
    opacity: 0.6,
  },
  listContent: {
    padding: 20,
    paddingBottom: 40,
  },
  itemCard: {
    marginBottom: 20,
    flexDirection: 'row',
    padding: 0,
    overflow: 'hidden',
    borderRadius: 24,
  },
  timeColumn: {
    width: 85,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startTime: {
    fontSize: 14,
    fontWeight: '800',
    marginTop: 6,
  },
  connector: {
    width: 2,
    height: 12,
    marginVertical: 4,
  },
  endTime: {
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.5,
  },
  detailsColumn: {
    flex: 1,
    padding: 20,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  itemCode: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 12,
    lineHeight: 24,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  locationText: {
    fontSize: 13,
    fontWeight: '600',
  },
  emptyContainer: {
    padding: 60,
    alignItems: 'center',
  },
  emptyText: {
    opacity: 0.4,
    fontSize: 16,
    fontWeight: '600',
  },
});
