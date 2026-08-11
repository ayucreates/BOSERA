// Keep-alive ping for Render free tier.
// Render sleeps free web services after ~15 min of inactivity.
// A Render Cron Job runs this script every 10 minutes to wake the app.
require('dotenv').config({ path: require('path').join(__dirname, '.env') });

const url = process.env.PING_URL || process.env.RENDER_EXTERNAL_URL;

if (!url) {
  console.error('No PING_URL set. Add PING_URL env var pointing to your app URL.');
  process.exit(1);
}

const pingUrl = url.replace(/\/+$/, '') + '/health';

fetch(pingUrl, { signal: AbortSignal.timeout(10000) })
  .then((res) => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    console.log(`Keep-alive OK ${new Date().toISOString()} -> ${pingUrl} (${res.status})`);
  })
  .catch((err) => {
    console.error(`Keep-alive FAILED ${new Date().toISOString()} -> ${pingUrl}: ${err.message}`);
    process.exit(1);
  });
