import React, { useEffect, useState } from 'react';
import { Package, Pill, Gift, Stethoscope, Settings, ArrowLeft, ArrowRight, CheckCheck, CheckCircle2, Bell, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface NotificationsScreenProps {
  onNavigate?: (route: string) => void;
}

interface NotificationItem {
  id: string;
  recipient_type: string;
  recipient_id: string | null;
  title: string;
  description: string;
  type: string;
  link: string | null;
  is_read: boolean;
  created_at: string;
}

export const NotificationsScreen: React.FC<NotificationsScreenProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    let intervalId: any = null;
    window.scrollTo(0, 0);

    const loadNotifications = async () => {
      try {
        let query = supabase
          .from('notifications')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(30);

        if (user) {
          query = query.or(`recipient_type.in.(all_users,all),and(recipient_type.eq.user,recipient_id.eq.${user.id})`);
        } else {
          query = query.in('recipient_type', ['all_users', 'all']);
        }

        const { data, error } = await query;
        if (!isMounted) return;

        if (error) {
          if (error.code === 'PGRST204' || error.message?.includes('404') || error.message?.includes('does not exist')) {
            if (intervalId) clearInterval(intervalId);
          }
        } else if (data) {
          setNotifications(data);
        }
      } catch (err) {
        console.error('Error fetching PWA notifications:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadNotifications();
    intervalId = setInterval(loadNotifications, 15000); // Poll every 15s

    return () => {
      isMounted = false;
      if (intervalId) clearInterval(intervalId);
    };
  }, [user]);

  const markAllAsRead = async () => {
    try {
      const unreadIds = notifications.filter(n => !n.is_read).map(n => n.id);
      if (unreadIds.length > 0) {
        await supabase.from('notifications').update({ is_read: true }).in('id', unreadIds);
        setNotifications(notifications.map(n => ({ ...n, is_read: true })));
      }
    } catch (err) {
      console.error('Error marking notifications as read:', err);
    }
  };

  const markSingleAsRead = async (id: string, link: string | null) => {
    try {
      await supabase.from('notifications').update({ is_read: true }).eq('id', id);
      setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
      if (link && onNavigate) {
        onNavigate(link);
      }
    } catch (err) {
      console.error('Error marking notification item read:', err);
      if (link && onNavigate) onNavigate(link);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'order_placed':
      case 'order_delivered':
      case 'order_assigned':
        return <Package className="w-5 h-5 text-primary" />;
      case 'refill':
        return <Pill className="w-5 h-5 text-primary" />;
      case 'reward':
        return <Gift className="w-5 h-5 text-secondary" />;
      case 'consultation':
        return <Stethoscope className="w-5 h-5 text-primary" />;
      case 'system':
        return <Settings className="w-5 h-5 text-on-surface-variant" />;
      default:
        return <Bell className="w-5 h-5 text-primary" />;
    }
  };

  const formatTimeAgo = (dateStr: string) => {
    const now = new Date();
    const date = new Date(dateStr);
    const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffSec < 60) return 'Just now';
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
    if (diffSec < 172800) return 'Yesterday';
    return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
  };

  // Group notifications into Today vs Earlier
  const todayNotifs = notifications.filter(n => {
    const diffHours = (new Date().getTime() - new Date(n.created_at).getTime()) / (1000 * 60 * 60);
    return diffHours < 24;
  });

  const earlierNotifs = notifications.filter(n => {
    const diffHours = (new Date().getTime() - new Date(n.created_at).getTime()) / (1000 * 60 * 60);
    return diffHours >= 24;
  });

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="w-full pb-24 md:pb-8 pt-4 md:pt-8 md:px-margin-desktop max-w-4xl mx-auto">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between mb-6 px-4">
        <button 
          onClick={() => onNavigate && onNavigate('/')}
          className="text-on-surface-variant dark:text-zinc-400 hover:bg-surface-container transition-colors p-2 rounded-full active:scale-95 flex items-center justify-center"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="font-heading text-xl text-primary dark:text-primary-fixed-dim font-bold">Notifications</h1>
        <div className="w-10"></div>
      </div>

      <div className="hidden md:flex md:items-center md:justify-between mb-8">
        <div className="flex items-center gap-3">
          <h1 className="font-heading text-4xl text-on-surface dark:text-zinc-100 font-extrabold tracking-tight">Notifications</h1>
          {unreadCount > 0 && (
            <span className="px-2.5 py-0.5 rounded-full bg-primary text-on-primary text-xs font-bold">
              {unreadCount} new
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-sm font-semibold text-primary hover:text-primary-container transition-colors flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" /> Mark all as read
          </button>
        )}
      </div>
      
      {unreadCount > 0 && (
        <div className="md:hidden flex justify-end mb-4 px-4">
          <button
            onClick={markAllAsRead}
            className="text-sm font-semibold text-primary hover:text-primary-container transition-colors flex items-center gap-1"
          >
            <CheckCheck className="w-4 h-4" /> Mark all as read
          </button>
        </div>
      )}

      <div className="px-4 md:px-0">
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center gap-3 text-on-surface-variant">
            <Loader2 className="w-7 h-7 animate-spin text-primary" />
            <p className="text-sm">Loading your notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center text-center bg-surface-container-lowest dark:bg-zinc-900 rounded-2xl border border-outline-variant/30 dark:border-zinc-800 p-8">
            <Bell className="w-10 h-10 text-primary/40 mb-3" />
            <h3 className="text-base font-bold text-on-surface dark:text-zinc-100">No Notifications Yet</h3>
            <p className="text-xs text-on-surface-variant dark:text-zinc-400 max-w-sm mt-1">
              When you place orders, receive refills reminders, or get broadcast alerts, they will appear right here.
            </p>
          </div>
        ) : (
          <>
            {/* Today Group */}
            {todayNotifs.length > 0 && (
              <section className="mb-8">
                <h2 className="text-sm font-semibold text-on-surface-variant dark:text-zinc-400 mb-4 px-2 uppercase tracking-wider">Today</h2>
                
                <div className="flex flex-col gap-3">
                  {todayNotifs.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => markSingleAsRead(notif.id, notif.link)}
                      className={`bg-surface-container-lowest dark:bg-zinc-900 rounded-2xl p-4 shadow-sm border border-outline-variant/30 dark:border-zinc-800 flex gap-4 items-start relative hover:bg-surface-container-low dark:hover:bg-zinc-800/80 transition-colors cursor-pointer group ${
                        !notif.is_read ? 'ring-1 ring-primary/40' : 'opacity-85'
                      }`}
                    >
                      {!notif.is_read && (
                        <div aria-label="Unread" className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></div>
                      )}
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        {getIcon(notif.type)}
                      </div>
                      <div className="flex-1 pr-6">
                        <div className="flex justify-between items-baseline mb-1">
                          <h3 className="text-sm font-bold text-on-surface dark:text-zinc-100">{notif.title}</h3>
                          <span className="text-xs font-semibold text-primary">{formatTimeAgo(notif.created_at)}</span>
                        </div>
                        <p className="text-sm text-on-surface-variant dark:text-zinc-400 leading-relaxed">{notif.description}</p>
                        {notif.link && (
                          <span className="mt-2 text-xs font-bold text-primary inline-flex items-center gap-1 group-hover:underline">
                            View details <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Earlier Group */}
            {earlierNotifs.length > 0 && (
              <section>
                <h2 className="text-sm font-semibold text-on-surface-variant dark:text-zinc-400 mb-4 px-2 uppercase tracking-wider">Earlier</h2>
                
                <div className="flex flex-col gap-3">
                  {earlierNotifs.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => markSingleAsRead(notif.id, notif.link)}
                      className={`bg-surface-container-lowest dark:bg-zinc-900 rounded-2xl p-4 shadow-sm border border-outline-variant/30 dark:border-zinc-800 flex gap-4 items-start relative hover:bg-surface-container-low dark:hover:bg-zinc-800/80 transition-colors cursor-pointer group opacity-80`}
                    >
                      {!notif.is_read && (
                        <div aria-label="Unread" className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full bg-primary"></div>
                      )}
                      <div className="w-10 h-10 rounded-full bg-surface-container dark:bg-zinc-800 flex items-center justify-center flex-shrink-0">
                        {getIcon(notif.type)}
                      </div>
                      <div className="flex-1 pr-6">
                        <div className="flex justify-between items-baseline mb-1">
                          <h3 className="text-sm font-bold text-on-surface dark:text-zinc-100">{notif.title}</h3>
                          <span className="text-xs font-semibold text-on-surface-variant dark:text-zinc-500">{formatTimeAgo(notif.created_at)}</span>
                        </div>
                        <p className="text-sm text-on-surface-variant dark:text-zinc-400 leading-relaxed">{notif.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
};
