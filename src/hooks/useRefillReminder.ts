import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export function useRefillReminder() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const checkRefills = async () => {
      try {
        // 1. Get settings
        const { data: settingsData } = await supabase
          .from('app_settings')
          .select('*')
          .in('key', ['refill_reminders_enabled', 'refill_reminder_days']);

        let enabled = true;
        let delayDays = 28;

        if (settingsData) {
          const enabledSetting = settingsData.find((s) => s.key === 'refill_reminders_enabled');
          const delaySetting = settingsData.find((s) => s.key === 'refill_reminder_days');
          
          if (enabledSetting && enabledSetting.value === 'false') enabled = false;
          if (delaySetting && !isNaN(Number(delaySetting.value))) {
            delayDays = Number(delaySetting.value);
          }
        }

        if (!enabled) return;

        // 2. Find the user's most recent delivered order
        const { data: latestOrders } = await supabase
          .from('orders')
          .select('id, created_at')
          .eq('user_id', user.id)
          .eq('status', 'Delivered')
          .order('created_at', { ascending: false })
          .limit(1);

        if (!latestOrders || latestOrders.length === 0) return;
        const lastOrder = latestOrders[0];
        
        const lastOrderDate = new Date(lastOrder.created_at);
        const now = new Date();
        const daysSinceLastOrder = (now.getTime() - lastOrderDate.getTime()) / (1000 * 3600 * 24);

        if (daysSinceLastOrder >= delayDays) {
          // 3. Check if we already sent a refill reminder since this order
          const { data: existingReminders } = await supabase
            .from('notifications')
            .select('id')
            .eq('recipient_type', 'user')
            .eq('recipient_id', user.id)
            .eq('type', 'refill_reminder')
            .gte('created_at', lastOrder.created_at)
            .limit(1);

          if (!existingReminders || existingReminders.length === 0) {
            // 4. Send the reminder!
            await supabase.from('notifications').insert([{
              recipient_type: 'user',
              recipient_id: user.id,
              title: 'Time for a Refill? 💊',
              description: `It's been almost a month! Time to refill your medicines? Tap to re-order instantly.`,
              type: 'refill_reminder',
              link: '/prescriptions',
              is_read: false
            }]);
          }
        }
      } catch (err) {
        console.error('Failed to check refill reminders:', err);
      }
    };

    // Run the check once on mount (when user object is available)
    checkRefills();
  }, [user]);
}
