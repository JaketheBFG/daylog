export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { referralId, referrerId } = req.body || {};
  if (!referralId || !referrerId) return res.status(400).json({ error: "Missing fields" });

  const RC_SECRET = process.env.REVENUECAT_SECRET_KEY;
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

  if (!RC_SECRET || !SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    return res.status(500).json({ error: "Missing env vars" });
  }

  try {
    // Grant 30-day promotional entitlement to referrer via RevenueCat REST API
    const rcRes = await fetch(
      `https://api.revenuecat.com/v1/subscribers/${encodeURIComponent(referrerId)}/entitlements/pro/promotional`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RC_SECRET}`,
        },
        body: JSON.stringify({ duration: "monthly" }),
      }
    );

    if (!rcRes.ok) {
      const err = await rcRes.text();
      console.error("RevenueCat error:", err);
      return res.status(500).json({ error: "RevenueCat grant failed" });
    }

    // Mark referral as rewarded in Supabase
    const sbRes = await fetch(
      `${SUPABASE_URL}/rest/v1/referrals?id=eq.${referralId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_SERVICE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
          Prefer: "return=minimal",
        },
        body: JSON.stringify({ rewarded_at: new Date().toISOString() }),
      }
    );

    if (!sbRes.ok) {
      console.error("Supabase update failed");
      return res.status(500).json({ error: "DB update failed" });
    }

    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Internal error" });
  }
}
