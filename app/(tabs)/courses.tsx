import React, { useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, View as DefaultView } from 'react-native';
import { Text, View, Card, ScreenContainer } from '../../components/Themed';
import { Button } from '../../components/Button';
import { Check, Plus, Book, Info } from 'lucide-react-native';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from 'react-native';

const AVAILABLE_COURSES = [
  { id: '1', code: 'CSC 411', title: 'Artificial Intelligence', units: 3, category: 'Core' },
  { id: '2', code: 'CSC 412', title: 'Compiler Construction', units: 3, category: 'Core' },
  { id: '3', code: 'CSC 413', title: 'Software Engineering II', units: 2, category: 'Core' },
  { id: '4', code: 'GST 411', title: 'Entrepreneurship', units: 1, category: 'General' },
  { id: '5', code: 'CSC 451', title: 'Data Mining', units: 3, category: 'Elective' },
  { id: '6', code: 'CSC 452', title: 'Cryptography', units: 3, category: 'Elective' },
];

export default function CoursesScreen() {
  const [selectedIds, setSelectedIds] = useState<string[]>(['1', '2', '4']);
  const theme = useColorScheme() ?? 'light';
  const colors = Colors[theme];

  const toggleCourse = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(item => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const totalUnits = AVAILABLE_COURSES
    .filter(c => selectedIds.includes(c.id))
    .reduce((sum, c) => sum + c.units, 0);

  return (
    <ScreenContainer>
      <View style={styles.headerSpacer} />
      <View style={styles.summarySection}>
        <Card style={[styles.summaryCard, { backgroundColor: colors.primary }]}>
          <View>
            <Text style={styles.summaryLabel}>Total Credit Units</Text>
            <View style={styles.valueRow}>
              <Text style={styles.summaryValue}>{totalUnits}</Text>
              <Text style={styles.summaryMax}>/ 24 Units</Text>
            </View>
          </View>
          <View style={styles.progressBarContainer}>
            <View 
              style={[
                styles.progressBar, 
                { width: `${(totalUnits / 24) * 100}%`, backgroundColor: colors.accent }
              ]} 
            />
          </View>
        </Card>
      </View>

      <ScrollView 
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sectionHeader}>
          <Book size={20} color={colors.secondaryText} />
          <Text style={[styles.sectionTitle, { color: colors.secondaryText }]}>Available Selection</Text>
        </View>

        {AVAILABLE_COURSES.map((course) => {
          const isSelected = selectedIds.includes(course.id);
          return (
            <TouchableOpacity 
              key={course.id} 
              onPress={() => toggleCourse(course.id)}
              activeOpacity={0.8}
            >
              <Card style={[
                styles.courseCard, 
                isSelected && { borderColor: colors.primary, borderWidth: 2, backgroundColor: colors.primary + '05' }
              ]}>
                <View style={styles.courseHeader}>
                  <View style={styles.codeContainer}>
                    <Text style={[styles.courseCode, { color: colors.primary }]}>{course.code}</Text>
                    <View style={[styles.badge, { backgroundColor: colors.border }]}>
                      <Text style={styles.badgeText}>{course.category}</Text>
                    </View>
                  </View>
                  {isSelected && (
                    <View style={[styles.checkCircle, { backgroundColor: colors.primary }]}>
                      <Check size={14} color="#FFF" />
                    </View>
                  )}
                </View>
                
                <Text style={styles.courseTitle}>{course.title}</Text>
                
                <View style={styles.courseFooter}>
                  <Text style={[styles.unitsText, { color: colors.secondaryText }]}>{course.units} Credit Units</Text>
                  {!isSelected && (
                    <View style={styles.addBtn}>
                      <Plus size={16} color={colors.primary} />
                      <Text style={[styles.addText, { color: colors.primary }]}>Add</Text>
                    </View>
                  )}
                </View>
              </Card>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={[styles.bottomActions, { backgroundColor: colors.background + 'CC' }]}>
        <Button 
          title={`Submit Registration (${selectedIds.length})`} 
          onPress={() => alert('Registration Submitted Successfully!')} 
          style={styles.regButton}
          disabled={selectedIds.length === 0}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  headerSpacer: {
    height: 10,
  },
  summarySection: {
    padding: 20,
  },
  summaryCard: {
    padding: 24,
    borderRadius: 24,
    elevation: 8,
  },
  summaryLabel: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.8,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 4,
  },
  summaryValue: {
    color: '#FFF',
    fontSize: 34,
    fontWeight: '900',
  },
  summaryMax: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 6,
    opacity: 0.7,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 20,
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  listContent: {
    padding: 20,
    paddingBottom: 110,
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
  courseCard: {
    marginBottom: 16,
    padding: 20,
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  courseCode: {
    fontSize: 15,
    fontWeight: '800',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    opacity: 0.7,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  courseTitle: {
    fontSize: 19,
    fontWeight: '800',
    marginBottom: 16,
  },
  courseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.04)',
    paddingTop: 16,
  },
  unitsText: {
    fontSize: 14,
    fontWeight: '600',
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addText: {
    fontSize: 15,
    fontWeight: '700',
  },
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  regButton: {
    elevation: 4,
  },
});
