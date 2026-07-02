import { ChatMessage } from '../types';

// Request notification permission from browser
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.warn('Browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission === 'denied') {
    console.warn('Notification permission denied by user');
    return false;
  }

  const permission = await Notification.requestPermission();
  return permission === 'granted';
};

// Show a browser notification for new message
export const showNewMessageNotification = (message: ChatMessage) => {
  if (Notification.permission !== 'granted') return;

  const notification = new Notification('New Message Received', {
    body: `${message.senderName}: "${message.text.substring(0, 80)}${message.text.length > 80 ? '...' : ''}"`,
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    tag: `chat-${message.id}`,
    requireInteraction: false,
  });

  // Close notification after 5 seconds
  setTimeout(() => notification.close(), 5000);

  // Focus window when notification is clicked
  notification.onclick = () => {
    window.focus();
    notification.close();
  };
};

// Check if notifications are supported and enabled
export const isNotificationsSupported = (): boolean => {
  return 'Notification' in window;
};

export const isNotificationsEnabled = (): boolean => {
  return isNotificationsSupported() && Notification.permission === 'granted';
};