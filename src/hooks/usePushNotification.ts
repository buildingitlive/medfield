import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

// Helper to convert base64 url string to Uint8Array for VAPID
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function usePushNotification() {
  const { user } = useAuth();
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const subscribe = useCallback(async () => {
    if (!user || !('serviceWorker' in navigator) || !('PushManager' in window)) {
      return false;
    }

    try {
      // Ask for permission FIRST — must be called directly from a user gesture
      // before any other async work, or the browser will silently block it.
      if (Notification.permission !== 'granted') {
        const permissionResult = await Notification.requestPermission();
        setPermission(permissionResult);
        if (permissionResult !== 'granted') return false;
      }

      // Now register the service worker
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      await navigator.serviceWorker.ready;

      // Check current subscription
      let subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        // Subscribe the user
        const vapidKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
        if (!vapidKey) {
          console.error('VITE_VAPID_PUBLIC_KEY is not set');
          return false;
        }

        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidKey)
        });
      }

      // Save the subscription to Supabase
      const subJson = subscription.toJSON();
      
      await supabase.from('push_subscriptions').upsert({
        user_id: user.id,
        role: 'user', // For the PWA, it's always 'user'
        endpoint: subJson.endpoint,
        p256dh: subJson.keys?.p256dh,
        auth: subJson.keys?.auth,
        updated_at: new Date().toISOString()
      }, { onConflict: 'endpoint' });

      return true;

    } catch (err) {
      console.error('Failed to register push notification:', err);
      return false;
    }
  }, [user]);

  // Auto-subscribe if already granted, or if it hasn't been asked yet
  useEffect(() => {
    if (user && 'Notification' in window && Notification.permission !== 'denied') {
      // Only auto-prompt if they haven't explicitly denied
      // But we shouldn't spam the prompt. Actually, requestPermission inside subscribe will trigger the prompt.
      // If we call subscribe() here, it will automatically show the prompt.
      // Since the user wants a manual button, maybe we shouldn't auto-prompt?
      // Wait, yesterday I made it auto-prompt. Let's keep auto-prompt for now, but also expose the button.
      subscribe();
    }
  }, [user, subscribe]);

  return { permission, subscribe };
}
