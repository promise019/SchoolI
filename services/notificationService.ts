import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

export const notificationService = {
  /**
   * Request permissions and get the expo push token
   */
  async registerForPushNotificationsAsync(): Promise<string | undefined> {
    let token;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        console.warn('Failed to get push token for push notification!');
        return;
      }
      
      const projectId = 
        Constants?.expoConfig?.extra?.eas?.projectId ?? 
        Constants?.easConfig?.projectId;

      // Remote push notifications are not supported in Expo Go (SDK 53/54+)
      // We skip registration to avoid EXPERIENCE_NOT_FOUND errors if no valid projectId exists
      if (Constants.appOwnership === 'expo' || !projectId) {
        console.log('Skipping push token registration (Local notifications only).');
        return;
      }
        
      try {
        const result = await Notifications.getExpoPushTokenAsync({ 
          projectId
        });
        token = result.data;
        console.log('Expo Push Token:', token);
      } catch (e) {
        console.error('Error getting push token:', e);
      }
    } else {
      console.warn('Must use physical device for Push Notifications');
    }

    return token;
  },

  /**
   * Configure how notifications are handled when the app is foregrounded
   */
  initHandler(): void {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
  },

  /**
   * Schedule an AI Reminder
   */
  async scheduleAIReminder(text: string, delayInSeconds: number = 3600): Promise<string> {
    return await Notifications.scheduleNotificationAsync({
      content: {
        title: '📅 SchoolI Study Reminder',
        body: text,
        sound: 'default',
        data: { type: 'reminder' },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: delayInSeconds,
      } as Notifications.TimeIntervalTriggerInput,
    });
  },

  /**
   * Send an AI Suggestion
   */
  async sendAISuggestion(title: string, body: string): Promise<string> {
    return await Notifications.scheduleNotificationAsync({
      content: {
        title: `💡 AI Suggestion: ${title}`,
        body: body,
        sound: 'default',
        data: { type: 'suggestion' },
      },
      trigger: null,
    });
  },
};
