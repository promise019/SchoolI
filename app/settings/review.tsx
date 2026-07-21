import React, { useState } from 'react';
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { Text, View, ScreenContainer } from '../../components/Themed';
import { Star, Send, ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { api } from '../../services/api';

export default function ReviewScreen() {
  const insets = useSafeAreaInsets();
  const systemTheme = useColorScheme() ?? 'dark';
  const colors = Colors[systemTheme];

  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const starAnimations = [0, 1, 2, 3, 4].map(() =>
    React.useRef(new Animated.Value(1)).current
  );

  const handleStarPress = (index: number) => {
    setRating(index + 1);
    // pop animation on the pressed star
    Animated.sequence([
      Animated.timing(starAnimations[index], {
        toValue: 1.4,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(starAnimations[index], {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert('Star Rating Required', 'Please select a star rating before submitting.');
      return;
    }
    if (text.trim().length < 5) {
      Alert.alert('Review Too Short', 'Please write at least a few words in your review.');
      return;
    }

    setSubmitting(true);
    try {
      await api.submitReview({ rating, text: text.trim() });
      setSubmitted(true);
    } catch (err: any) {
      Alert.alert(
        'Submission Failed',
        err?.message || 'Could not submit your review. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const ratingLabels = ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'];

  const STAR_COLOR = '#FBBF24';
  const STAR_INACTIVE = colors.border ?? '#334155';

  if (submitted) {
    return (
      <ScreenContainer>
        <View style={[styles.successContainer, { paddingTop: insets.top + 24 }]}>
          <Text style={styles.successEmoji}>🎉</Text>
          <Text style={styles.successTitle}>Thank you!</Text>
          <Text style={[styles.successSubtitle, { color: colors.secondaryText }]}>
            Your review helps us improve SchoolI for every student.
          </Text>
          <TouchableOpacity
            style={[styles.doneButton, { backgroundColor: colors.primary }]}
            onPress={() => router.back()}
          >
            <Text style={styles.doneButtonText}>Back to Profile</Text>
          </TouchableOpacity>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 16 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={[styles.backButton, { backgroundColor: colors.border + '40' }]}
          >
            <ArrowLeft size={20} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Rate SchoolI</Text>
          <View style={styles.headerRight} />
        </View>

        {/* Hero section */}
        <View style={styles.heroSection}>
          <Text style={styles.heroEmoji}>⭐</Text>
          <Text style={styles.heroTitle}>How's your experience?</Text>
          <Text style={[styles.heroSubtitle, { color: colors.secondaryText }]}>
            Your rating and feedback will appear on the SchoolI website to help other students.
          </Text>
        </View>

        {/* Star Picker */}
        <View style={[styles.starCard, { backgroundColor: colors.card ?? colors.background }]}>
          <View style={styles.starsRow}>
            {[0, 1, 2, 3, 4].map((i) => {
              const active = i < (hoveredRating || rating);
              return (
                <Animated.View
                  key={i}
                  style={{ transform: [{ scale: starAnimations[i] }] }}
                >
                  <TouchableOpacity
                    onPress={() => handleStarPress(i)}
                    onPressIn={() => setHoveredRating(i + 1)}
                    onPressOut={() => setHoveredRating(0)}
                    activeOpacity={0.7}
                    style={styles.starTouchable}
                  >
                    <Star
                      size={48}
                      color={active ? STAR_COLOR : STAR_INACTIVE}
                      fill={active ? STAR_COLOR : 'transparent'}
                      strokeWidth={1.5}
                    />
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>
          {rating > 0 && (
            <Text style={[styles.ratingLabel, { color: STAR_COLOR }]}>
              {ratingLabels[rating]}
            </Text>
          )}
        </View>

        {/* Text Input */}
        <View style={styles.inputSection}>
          <Text style={[styles.inputLabel, { color: colors.secondaryText }]}>
            Write your review (optional but appreciated)
          </Text>
          <TextInput
            style={[
              styles.textInput,
              {
                color: colors.text,
                backgroundColor: colors.card ?? colors.background,
                borderColor: colors.border ?? '#334155',
              },
            ]}
            placeholder="Tell us what you love or what we can improve..."
            placeholderTextColor={colors.secondaryText}
            value={text}
            onChangeText={setText}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
            maxLength={500}
          />
          <Text style={[styles.charCount, { color: colors.secondaryText }]}>
            {text.length} / 500
          </Text>
        </View>

        {/* Submit */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            {
              backgroundColor: rating > 0 ? colors.primary : colors.border ?? '#334155',
              opacity: submitting ? 0.7 : 1,
            },
          ]}
          onPress={handleSubmit}
          disabled={submitting}
          activeOpacity={0.8}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Send size={18} color="#fff" />
              <Text style={styles.submitText}>Submit Review</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  headerRight: {
    width: 40,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  heroEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -1,
    textAlign: 'center',
    marginBottom: 10,
  },
  heroSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 300,
  },
  starCard: {
    borderRadius: 24,
    paddingVertical: 28,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 24,
    elevation: 4,
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  starTouchable: {
    padding: 4,
  },
  ratingLabel: {
    marginTop: 14,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  inputSection: {
    marginBottom: 28,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
    marginLeft: 4,
  },
  textInput: {
    borderWidth: 1.5,
    borderRadius: 20,
    padding: 16,
    fontSize: 16,
    lineHeight: 24,
    minHeight: 130,
  },
  charCount: {
    textAlign: 'right',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 6,
    marginRight: 4,
    opacity: 0.6,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 18,
    borderRadius: 20,
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 16,
  },
  successEmoji: {
    fontSize: 72,
    marginBottom: 8,
  },
  successTitle: {
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: -1,
  },
  successSubtitle: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 280,
  },
  doneButton: {
    marginTop: 20,
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 20,
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
});
