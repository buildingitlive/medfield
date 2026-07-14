import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export function useNotifications() {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    let intervalId: any = null;

    const checkUnread = async () => {
      try {
        let query = supabase
          .from('notifications')
          .select('id, is_read')
          .eq('is_read', false);

        if (user) {
          query = query.or(`recipient_type.in.(all_users,all),and(recipient_type.eq.user,recipient_id.eq.${user.id})`);
        } else {
          query = query.in('recipient_type', ['all_users', 'all']);
        }

        const { data, error } = await query;
        if (!isMounted) return;

        if (error) {
          // If status is 404 or table does not exist, alert cleanly once without console spam
          if (error.code === 'PGRST204' || error.message?.includes('404') || error.message?.includes('does not exist')) {
            console.warn('⚠️ [MedField Notifications] Table `notifications` not found (404). Please execute `supabase/notifications_schema.sql` inside your Supabase SQL Editor.');
            if (intervalId) clearInterval(intervalId); // Stop spamming 404 requests
          }
        } else if (data) {
          setUnreadCount(data.length);
        }
      } catch (err) {
        console.error('Error fetching unread notification count:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    checkUnread();
    intervalId = setInterval(checkUnread, 15000);

    return () => {
      isMounted = false;
      if (intervalId) clearInterval(intervalId);
    };
  }, [user]);

  return { unreadCount, loading };
}
