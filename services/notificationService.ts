import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import { Platform } from 'react-native';

const isExpoGo =
  Constants.executionEnvironment === ExecutionEnvironment.StoreClient ||
  Constants.appOwnership === 'expo';

export const notificationService = {
  /**
   * Request permissions and get the expo push token
   */
  async registerForPushNotificationsAsync(): Promise<string | undefined> {
    // Remote push notifications were removed from Expo Go in SDK 53+
    if (isExpoGo) {
      console.log('Expo Go detected: Push notifications registration skipped (Development build required for Push Notifications).');
      return undefined;
    }

    let token;

    try {
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

        if (!projectId) {
          console.log('Skipping push token registration (no EAS projectId).');
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
    } catch (e) {
      console.warn('Push notification initialization skipped/error:', e);
    }

    return token;
  },

  /**
   * Configure how notifications are handled when the app is foregrounded
   */
  initHandler(): void {
    if (isExpoGo) return;
    try {
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
          shouldShowBanner: true,
          shouldShowList: true,
        }),
      });
    } catch (e) {
      console.warn('Failed to initialize notification handler:', e);
    }
  },

  /**
   * Schedule an AI Reminder
   */
  async scheduleAIReminder(text: string, delayInSeconds: number = 3600): Promise<string | undefined> {
    if (isExpoGo) {
      console.log('Local notifications skipped in Expo Go environment.');
      return undefined;
    }
    try {
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
    } catch (e) {
      console.warn('Failed to schedule AI reminder:', e);
      return undefined;
    }
  },

  /**
   * Send an AI Suggestion
   */
  async sendAISuggestion(title: string, body: string): Promise<string | undefined> {
    if (isExpoGo) return undefined;
    try {
      return await Notifications.scheduleNotificationAsync({
        content: {
          title: `💡 AI Suggestion: ${title}`,
          body: body,
          sound: 'default',
          data: { type: 'suggestion' },
        },
        trigger: null,
      });
    } catch (e) {
      console.warn('Failed to send AI suggestion:', e);
      return undefined;
    }
  },
};

