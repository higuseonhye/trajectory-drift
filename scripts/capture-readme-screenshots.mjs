/**
 * Capture README / landing screenshots from the live dev dashboard.
 * Usage: node scripts/capture-readme-screenshots.mjs
 * Requires: npm run dev on :3001, playwright chromium installed.
 */
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "..", "assets", "screenshots");
const BASE = "http://localhost:3001/dashboard";

async function waitReady(page) {
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.getByText("Observing…").waitFor({ state: "hidden", timeout: 60000 }).catch(() => {});
  await page.waitForTimeout(800);
}

async function clickDemo(page, label) {
  await page.getByRole("button", { name: label, exact: true }).click();
  await page.getByText("Observing…").waitFor({ state: "hidden", timeout: 60000 }).catch(() => {});
  await page.waitForTimeout(1000);
}

async function shotLocator(page, locator, file) {
  const el = typeof locator === "string" ? page.locator(locator).first() : locator.first();
  await el.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await el.screenshot({ path: path.join(OUT, file) });
  console.log("wrote", file);
}

async function main() {
  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  await waitReady(page);
  await clickDemo(page, "Unified");
  await page.setViewportSize({ width: 1280, height: 675 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
  await page.screenshot({
    path: path.join(OUT, "dashboard-overview.png"),
    clip: { x: 0, y: 0, width: 1280, height: 675 },
  });
  console.log("wrote dashboard-overview.png (1280×675 viewport)");
  await page.screenshot({
    path: path.join(OUT, "x-post-v08-viewport.png"),
    clip: { x: 0, y: 0, width: 1280, height: 675 },
  });
  console.log("wrote x-post-v08-viewport.png");

  await clickDemo(page, "Multi-agent");
  await shotLocator(
    page,
    page.getByText("Multi-agent lanes", { exact: true }).locator("..").locator(".."),
    "multi-lane-graph.png",
  );
  await shotLocator(
    page,
    page.locator("section.panel").filter({ hasText: "Field propagation" }),
    "propagation-diff.png",
  );

  await clickDemo(page, "Unified");
  await shotLocator(
    page,
    page.locator("section.panel").filter({ hasText: "Environmental drift" }),
    "environmental-drift-panel.png",
  );

  await clickDemo(page, "Single");
  await shotLocator(
    page,
    page.locator("section.panel").filter({ hasText: "Calibration" }),
    "calibration-panel.png",
  );
  await shotLocator(
    page,
    page.locator("section.panel").filter({ hasText: "Calibration journal" }),
    "journal-panel.png",
  );

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
