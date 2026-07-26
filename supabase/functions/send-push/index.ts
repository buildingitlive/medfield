import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";
import webpush from "npm:web-push@3.6.7";

// Set VAPID details from environment variables
webpush.setVapidDetails(
  "mailto:admin@medfield.com",
  Deno.env.get("VAPID_PUBLIC_KEY")!,
  Deno.env.get("VAPID_PRIVATE_KEY")!
);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // This function will be called by a Supabase Database Webhook on the `notifications` table
    const payload = await req.json();
    const notification = payload.record;

    if (!notification) {
      return new Response(JSON.stringify({ error: "No notification record provided" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Determine target subscriptions based on recipient_type
    let query = supabaseClient.from("push_subscriptions").select("*");

    if (notification.recipient_type === "all_users") {
      query = query.eq("role", "user");
    } else if (notification.recipient_type === "all_partners") {
      query = query.eq("role", "partner");
    } else if (notification.recipient_type === "user" || notification.recipient_type === "partner") {
      query = query.eq("user_id", notification.recipient_id);
    } 
    // If 'all', we don't filter by role or user_id

    const { data: subscriptions, error } = await query;

    if (error) {
      throw error;
    }

    if (!subscriptions || subscriptions.length === 0) {
      return new Response(JSON.stringify({ message: "No subscriptions found for target" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const pushPayload = JSON.stringify({
      title: notification.title,
      body: notification.description,
      icon: "/icon-192x192.png", // Must match PWA public folder
      data: {
        url: notification.link || "/",
      },
    });

    const results = await Promise.allSettled(
      subscriptions.map(async (sub) => {
        const pushSubscription = {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.p256dh,
            auth: sub.auth,
          },
        };
        try {
          await webpush.sendNotification(pushSubscription, pushPayload);
        } catch (error: any) {
          // If subscription is invalid/expired (status 410 or 404), delete it
          if (error.statusCode === 410 || error.statusCode === 404) {
            await supabaseClient.from("push_subscriptions").delete().eq("id", sub.id);
          }
          throw error;
        }
      })
    );

    const successful = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.filter((r) => r.status === "rejected").length;

    return new Response(
      JSON.stringify({ message: "Push notifications processed", successful, failed }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error sending push:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
