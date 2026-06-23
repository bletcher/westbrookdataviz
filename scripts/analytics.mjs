// Pulls key Google Analytics (GA4) reports for the landing site via the
// GA4 Data API and prints them to the console.
//
// Setup (one time):
//   1. In Google Cloud, create a service account and download its JSON key.
//   2. Enable the "Google Analytics Data API" for that project.
//   3. In GA Admin → Property → Property Access Management, add the service
//      account's email as a Viewer.
//   4. Point GOOGLE_APPLICATION_CREDENTIALS at the key file.
//
// Usage:
//   $env:GOOGLE_APPLICATION_CREDENTIALS = "C:\path\to\key.json"   # PowerShell
//   npm run analytics                         # last 28 days
//   npm run analytics -- 90daysAgo today      # custom range
//   npm run analytics -- 2026-01-01 2026-03-31
import { BetaAnalyticsDataClient } from "@google-analytics/data";
import { existsSync } from "node:fs";

const PROPERTY_ID = process.env.GA_PROPERTY_ID || "499756310";
const [startDate = "28daysAgo", endDate = "today"] = process.argv.slice(2);

const keyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
if (!keyPath) {
  console.error(
    "ERROR: GOOGLE_APPLICATION_CREDENTIALS is not set.\n" +
      "Point it at your service-account JSON key, e.g. (PowerShell):\n" +
      '  $env:GOOGLE_APPLICATION_CREDENTIALS = "C:\\path\\to\\key.json"'
  );
  process.exit(1);
}
if (!existsSync(keyPath)) {
  console.error(
    `ERROR: GOOGLE_APPLICATION_CREDENTIALS points to a file that does not exist:\n  ${keyPath}\n` +
      "Check the path (and that the .json key is still there)."
  );
  process.exit(1);
}

const client = new BetaAnalyticsDataClient();
const property = `properties/${PROPERTY_ID}`;

// Render a report response as a simple aligned table.
function printTable(title, response) {
  const dimHeaders = (response.dimensionHeaders || []).map((h) => h.name);
  const metHeaders = (response.metricHeaders || []).map((h) => h.name);
  const headers = [...dimHeaders, ...metHeaders];
  const rows = (response.rows || []).map((r) => [
    ...(r.dimensionValues || []).map((v) => v.value),
    ...(r.metricValues || []).map((v) => v.value)
  ]);

  console.log(`\n=== ${title} ===`);
  if (!rows.length) {
    console.log("(no data)");
    return;
  }
  const widths = headers.map((h, i) =>
    Math.max(h.length, ...rows.map((row) => String(row[i] ?? "").length))
  );
  const fmt = (cells) => cells.map((c, i) => String(c ?? "").padEnd(widths[i])).join("  ");
  console.log(fmt(headers));
  console.log(widths.map((w) => "-".repeat(w)).join("  "));
  rows.forEach((row) => console.log(fmt(row)));
}

// Run one runReport call; never throw (custom-dimension reports fail until the
// dimension is registered in GA4 Admin, so we degrade gracefully).
async function report(title, request, hintOnError) {
  try {
    const [response] = await client.runReport({
      property,
      dateRanges: [{ startDate, endDate }],
      ...request
    });
    printTable(title, response);
  } catch (err) {
    console.log(`\n=== ${title} ===`);
    console.log(`(skipped: ${err.message.split("\n")[0]})`);
    if (hintOnError) console.log(hintOnError);
  }
}

// eventName == value filter helper.
const eventFilter = (name) => ({
  filter: { fieldName: "eventName", stringFilter: { value: name } }
});

// The landing site's own pages (everything else is a separate app subdirectory).
const LANDING_PAGE_REGEX = "^/(index\\.html|about\\.html|contact\\.html|404\\.html)?$";
const landingFilter = {
  filter: {
    fieldName: "pagePath",
    stringFilter: { matchType: "FULL_REGEXP", value: LANDING_PAGE_REGEX }
  }
};

// eventName == value AND the click happened on a landing-site page.
const landingEventFilter = (name) => ({
  andGroup: { expressions: [eventFilter(name), landingFilter] }
});

// Bucket a pagePath into its owning "app" (top-level path segment). The landing
// site's root + root .html pages collapse into "(landing site)".
function appBucket(pagePath) {
  const p = (pagePath || "/").split("?")[0];
  if (p === "/" || /^\/(index|about|contact|404)\.html?$/.test(p)) return "(landing site)";
  const seg = p.replace(/^\//, "").split("/")[0];
  if (!seg || seg.includes(".")) return "(landing site)";
  return seg;
}

// Pageviews grouped by app. Pageviews are additive so we sum them; active users
// are NOT summed (the same person can hit several pages — that would double
// count), so we report pageviews and the number of distinct pages per app.
async function appBreakdown(title) {
  try {
    const [response] = await client.runReport({
      property,
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: "pagePath" }],
      metrics: [{ name: "screenPageViews" }],
      limit: 2000
    });
    const buckets = new Map();
    for (const row of response.rows || []) {
      const app = appBucket(row.dimensionValues[0].value);
      const views = Number(row.metricValues[0].value) || 0;
      const b = buckets.get(app) || { views: 0, pages: 0 };
      b.views += views;
      b.pages += 1;
      buckets.set(app, b);
    }
    const rows = [...buckets.entries()]
      .map(([app, b]) => [app, String(b.views), String(b.pages)])
      .sort((a, b) => Number(b[1]) - Number(a[1]));

    console.log(`\n=== ${title} ===`);
    if (!rows.length) return console.log("(no data)");
    const headers = ["app", "screenPageViews", "pages"];
    const widths = headers.map((h, i) =>
      Math.max(h.length, ...rows.map((r) => r[i].length))
    );
    const fmt = (cells) => cells.map((c, i) => String(c).padEnd(widths[i])).join("  ");
    console.log(fmt(headers));
    console.log(widths.map((w) => "-".repeat(w)).join("  "));
    rows.forEach((r) => console.log(fmt(r)));
  } catch (err) {
    console.log(`\n=== ${title} ===`);
    console.log(`(skipped: ${err.message.split("\n")[0]})`);
  }
}

async function main() {
  console.log(`Property ${PROPERTY_ID} · ${startDate} → ${endDate}`);

  await report("Overview", {
    metrics: [
      { name: "activeUsers" },
      { name: "sessions" },
      { name: "screenPageViews" },
      { name: "engagementRate" },
      { name: "averageSessionDuration" }
    ]
  });

  // Which app is driving traffic (this property measures all apps, not just
  // the landing site).
  await appBreakdown("Pageviews by app");

  await report("Traffic acquisition (by channel)", {
    dimensions: [{ name: "sessionDefaultChannelGroup" }],
    metrics: [{ name: "sessions" }, { name: "activeUsers" }],
    orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
    limit: 10
  });

  await report("Top pages", {
    dimensions: [{ name: "pagePath" }],
    metrics: [{ name: "screenPageViews" }, { name: "activeUsers" }],
    orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
    limit: 10
  });

  await report("Devices", {
    dimensions: [{ name: "deviceCategory" }],
    metrics: [{ name: "activeUsers" }, { name: "sessions" }],
    orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }]
  });

  await report("Top countries", {
    dimensions: [{ name: "country" }],
    metrics: [{ name: "activeUsers" }],
    orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
    limit: 10
  });

  await report("Events", {
    dimensions: [{ name: "eventName" }],
    metrics: [{ name: "eventCount" }],
    orderBys: [{ metric: { metricName: "eventCount" }, desc: true }],
    limit: 15
  });

  // --- Landing site only (filtered to the portfolio's own pages) ---

  await report("Landing site only — overview", {
    dimensionFilter: landingFilter,
    metrics: [
      { name: "activeUsers" },
      { name: "sessions" },
      { name: "screenPageViews" },
      { name: "engagementRate" },
      { name: "averageSessionDuration" }
    ]
  });

  await report("Landing site only — pages", {
    dimensionFilter: landingFilter,
    dimensions: [{ name: "pagePath" }],
    metrics: [{ name: "screenPageViews" }, { name: "activeUsers" }],
    orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
    limit: 10
  });

  // These require event-scoped custom dimensions registered in GA4 Admin
  // (Custom definitions): card_title, card_category, filter_category.
  const dimHint =
    "  -> Register this in GA4 Admin → Custom definitions to enable it.";

  await report(
    "Project clicks (by title)",
    {
      dimensions: [{ name: "customEvent:card_title" }],
      metrics: [{ name: "eventCount" }],
      dimensionFilter: eventFilter("card_click"),
      orderBys: [{ metric: { metricName: "eventCount" }, desc: true }],
      limit: 25
    },
    dimHint
  );

  await report(
    "Project clicks (by category)",
    {
      dimensions: [{ name: "customEvent:card_category" }],
      metrics: [{ name: "eventCount" }],
      dimensionFilter: eventFilter("card_click"),
      orderBys: [{ metric: { metricName: "eventCount" }, desc: true }]
    },
    dimHint
  );

  // Outbound clicks — GA4 Enhanced Measurement auto-tracks these as the "click"
  // event, and linkDomain/linkUrl are BUILT-IN dimensions (no custom-dimension
  // registration needed). This is the one unified way to compare interest in
  // every linked project — Observable notebooks, USGS apps, and your own apps —
  // even the ones you can't put your GA tag on.
  await report("Outbound clicks by domain", {
    dimensions: [{ name: "linkDomain" }],
    metrics: [{ name: "eventCount" }],
    dimensionFilter: eventFilter("click"),
    orderBys: [{ metric: { metricName: "eventCount" }, desc: true }],
    limit: 25
  });

  await report("Outbound clicks by destination URL", {
    dimensions: [{ name: "linkUrl" }],
    metrics: [{ name: "eventCount" }],
    dimensionFilter: eventFilter("click"),
    orderBys: [{ metric: { metricName: "eventCount" }, desc: true }],
    limit: 25
  });

  // Outbound clicks made FROM the landing site only — isolates your portfolio
  // project click-throughs (to Observable, USGS, your own apps) from the events
  // apps' venue/ticket links, which otherwise dominate the property-wide view.
  await report("Portfolio project clicks (outbound, from landing site)", {
    dimensions: [{ name: "linkUrl" }],
    metrics: [{ name: "eventCount" }],
    dimensionFilter: landingEventFilter("click"),
    orderBys: [{ metric: { metricName: "eventCount" }, desc: true }],
    limit: 25
  });

  await report(
    "Filter usage",
    {
      dimensions: [{ name: "customEvent:filter_category" }],
      metrics: [{ name: "eventCount" }],
      dimensionFilter: eventFilter("filter_click"),
      orderBys: [{ metric: { metricName: "eventCount" }, desc: true }]
    },
    dimHint
  );
}

main().catch((err) => {
  console.error(`\nFailed: ${err.message}`);
  process.exit(1);
});
