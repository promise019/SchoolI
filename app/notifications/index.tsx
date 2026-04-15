import React, { useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, FlatList, View as DefaultView } from 'react-native';
import { Text, View, Card, ScreenContainer } from '../../components/Themed';
import { 
  Bell, 
  ChevronLeft, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  CreditCard, 
  BookOpen, 
  Trash2,
  Filter
} from 'lucide-react-native';
import { router } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from 'react-native';

const NOTIFICATIONS = [
  { id: '1', title: 'Registration Deadline', body: 'Only 48 hours left to finalize your course selection.', type: 'deadline', time: '2h ago', read: false },
  { id: '2', title: 'Queue Update', body: 'Senate House queue is currently low (5 people). Good time to go!', type: 'queue', time: '5m ago', read: false },
  { id: '3', title: 'Payment Confirmed', body: 'Your School Fees payment (₦45,000) has been verified.', type: 'payment', time: '1d ago', read: true },
  { id: '4', title: 'Exam Venue Change', body: 'CSC 411 exam moved from LT 4 to Main Auditiorium.', type: 'urgent', time: '3h ago', read: false },
  { id: '5', title: 'Document Request', body: 'Your Birth Certificate was rejected. Please re-upload.', type: 'document', time: '2d ago', read: true },
];

const ICON_MAP: any = {
  deadline: { icon: Clock, color: '#F59E0B' },
  queue: { icon: Bell, color: '#10B981' },
  payment: { icon: CreditCard, color: '#6366F1' },
  urgent: { icon: AlertTriangle, color: '#EF4444' },
  document: { icon: BookOpen, color: '#8B5CF6' },
};

export default function NotificationsScreen() {
  const [items, setItems] = useState(NOTIFICATIONS);
  const theme = useColorScheme() ?? 'light';
  const colors = Colors[theme];

  const markAsRead = (id: string) => {
    setItems(items.map(item => item.id === id ? { ...item, read: true } : item));
  };

  const deleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity style={styles.filterBtn}>
          <Filter size={20} color={colors.secondaryText} />
        </TouchableOpacity>
      </View>

      <View style={styles.tabScroll}>
         <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabs}>
            {['All', 'Unread', 'Urgent', 'Payments'].map((tab, idx) => (
              <TouchableOpacity key={idx} style={[styles.tab, idx === 0 && { backgroundColor: colors.primary }]}>
                <Text style={[styles.tabText, idx === 0 ? { color: '#FFF' } : { color: colors.secondaryText }]}>{tab}</Text>
              </TouchableOpacity>
            ))}
         </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {items.length === 0 ? (
          <View style={styles.emptyState}>
            <Bell size={60} color={colors.border} />
            <Text style={[styles.emptyTitle, { color: colors.secondaryText }]}>All caught up!</Text>
            <Text style={[styles.emptyDesc, { color: colors.secondaryText }]}>You have no new notifications.</Text>
          </View>
        ) : (
          items.map((item) => {
            const Config = ICON_MAP[item.type] || ICON_MAP.deadline;
            return (
              <TouchableOpacity key={item.id} onPress={() => markAsRead(item.id)} activeOpacity={0.8}>
                <Card style={[styles.notifCard, !item.read && { borderColor: colors.primary + '40', borderWidth: 2 }]}>
                  <View style={[styles.iconBox, { backgroundColor: Config.color + '15' }]}>
                    <Config.icon size={22} color={Config.color} />
                  </View>
                  <View style={styles.notifContent}>
                    <View style={styles.notifHeader}>
                      <Text style={styles.notifTitle}>{item.title}</Text>
                      <Text style={[styles.notifTime, { color: colors.secondaryText }]}>{item.time}</Text>
                    </View>
                    <Text style={[styles.notifBody, { color: colors.secondaryText }]} numberOfLines={2}>
                      {item.body}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => deleteItem(item.id)} style={styles.deleteBtn}>
                    <Trash2 size={18} color={colors.border} />
                  </TouchableOpacity>
                  {!item.read && <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} />}
                </Card>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      {items.length > 0 && (
        <TouchableOpacity style={styles.clearAll} onPress={() => setItems([])}>
          <Text style={[styles.clearText, { color: colors.primary }]}>Clear All Notifications</Text>
        </TouchableOpacity>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    justifyContent: 'space-between',
  },
  backBtn: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
  },
  filterBtn: {
    padding: 8,
  },
  tabScroll: {
    marginBottom: 10,
  },
  tabs: {
    paddingHorizontal: 20,
    gap: 12,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.04)',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '700',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  notifCard: {
    flexDirection: 'row',
    padding: 16,
    marginBottom: 12,
    position: 'relative',
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  notifContent: {
    flex: 1,
    paddingRight: 10,
  },
  notifHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  notifTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  notifTime: {
    fontSize: 11,
    fontWeight: '600',
  },
  notifBody: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  },
  deleteBtn: {
    justifyContent: 'center',
    paddingLeft: 8,
  },
  unreadDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginTop: 20,
  },
  emptyDesc: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
    textAlign: 'center',
  },
  clearAll: {
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 20,
  },
  clearText: {
    fontSize: 14,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});
