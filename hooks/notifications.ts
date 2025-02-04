import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Apenas importa expo-device em plataformas nativas (iOS/Android)
let Device: typeof import('expo-device') | undefined;
if (Platform.OS !== 'web') {
  Device = require('expo-device');
}

// Configuração das notificações (define como elas aparecem no app)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Função para solicitar permissão de notificações e obter o token
export async function registerForPushNotificationsAsync(): Promise<string | undefined> {
  let token: string | undefined;

  // Verifica se a plataforma é um dispositivo real (iOS/Android)
  if (Device && Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.warn('Permissão para receber notificações foi negada.');
      return;
    }

    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    console.warn('As notificações só funcionam em dispositivos físicos.');
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}

// Função para agendar uma notificação
export async function scheduleNotification(
  title: string,
  body: string,
  date: Date
): Promise<void> {
  // Agendando a notificação com o tipo 'date'
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: date, // Usa a data diretamente
    },
  });
}

// Função para cancelar uma notificação agendada
export const cancelNotification = async (notificationId: string): Promise<void> => {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
    console.log(`Notificação com ID ${notificationId} cancelada com sucesso.`);
  } catch (error) {
    console.error('Erro ao cancelar a notificação:', error);
  }
};
