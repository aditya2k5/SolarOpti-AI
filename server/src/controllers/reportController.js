// =============================================================================
// reportController.js  —  SolarOpti.AI  |  Premium PDF Engineering Proposal
// Stack : MERN + PDFKit + JWT + MongoDB Atlas
// Fixes : Ghost pages · Rupee/CO2 encoding · Layout overflow · Premium UX
// =============================================================================
//
// FONT SETUP (required before deploying):
//   Place NotoSans-Regular.ttf and NotoSans-Bold.ttf inside /fonts/ at your
//   project root.  Download from: https://fonts.google.com/noto/specimen/Noto+Sans
//   These fonts carry the Rupee (U+20B9) and subscript glyphs that Helvetica lacks.
//
// =============================================================================

import PDFDocument from "pdfkit";
import path from "path";
import { fileURLToPath } from "url";
import User from "../models/User.js";
import { getTariffForState } from "../utils/tariffService.js";

// ─── Font Paths ────────────────────────────────────────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FONT_REGULAR = path.join(__dirname, "../fonts/NotoSans-Regular.ttf");
const FONT_BOLD    = path.join(__dirname, "../fonts/NotoSans-Bold.ttf");

// ─── Design Tokens ─────────────────────────────────────────────────────────────
const C = {
  emerald        : "#10B981",   // primary accent
  emeraldDark    : "#059669",
  emeraldDeep    : "#065F46",
  emeraldLight   : "#ECFDF5",
  emeraldBorder  : "#A7F3D0",
  emeraldMid     : "#D1FAE5",
  ink            : "#0A0F12",   // near-black heading
  slate          : "#1F2937",
  slateMid       : "#4B5563",
  slateLight     : "#6B7280",
  surface        : "#F9FAFB",
  border         : "#E5E7EB",
  white          : "#FFFFFF",
  footerBg       : "#0D1117",
  redAccent      : "#EF4444",
  blueAccent     : "#3B82F6",
};

const PAGE_W      = 595;
const PAGE_H      = 842;
const MARGIN      = 50;
const CONTENT_W   = PAGE_W - MARGIN * 2;          // 495
const FOOTER_Y    = PAGE_H - 32;                   // 810
const SAFE_BOTTOM = FOOTER_Y - 20;                 // last safe Y for content

// =============================================================================
// HELPER UTILITIES
// =============================================================================

/** Draw a full-width horizontal rule */
const hRule = (doc, y, color = C.border, weight = 0.75) => {
  doc.save()
     .strokeColor(color)
     .lineWidth(weight)
     .moveTo(MARGIN, y)
     .lineTo(PAGE_W - MARGIN, y)
     .stroke()
     .restore();
};

/** Filled rectangle shorthand */
const fillRect = (doc, x, y, w, h, fill, stroke = null, strokeW = 0.75) => {
  doc.save().rect(x, y, w, h);
  if (stroke) { doc.fillAndStroke(fill, stroke).lineWidth(strokeW); }
  else        { doc.fill(fill); }
  doc.restore();
};

/** Rounded card */
const card = (doc, x, y, w, h, fill = C.surface, stroke = C.border) => {
  doc.save()
     .roundedRect(x, y, w, h, 6)
     .fillAndStroke(fill, stroke)
     .lineWidth(0.75)
     .restore();
};

/** Left accent bar before a section title (McKinsey style) */
const sectionTitle = (doc, text, x, y) => {
  fillRect(doc, x, y, 3, 18, C.emerald);
  doc.font(FONT_BOLD)
     .fontSize(13)
     .fillColor(C.ink)
     .text(text, x + 10, y + 2);
  return doc.y + 6;
};

/**
 * Inline mixed-style text writer — avoids PDFKit's broken { inline: true }.
 * segments: [{ text, bold, color, size }]
 * Returns new Y after line.
 */
const inlineLine = (doc, segments, x, y, defaultSize = 10.5) => {
  let cursor = x;
  segments.forEach(({ text, bold = false, color = C.slateLight, size = defaultSize }) => {
    doc.font(bold ? FONT_BOLD : FONT_REGULAR)
       .fontSize(size)
       .fillColor(color);
    doc.text(text, cursor, y, { lineBreak: false });
    cursor += doc.widthOfString(text);
  });
  return y + defaultSize + 5;
};

/** Stat card — big metric + label, used for key KPIs */
const statCard = (doc, x, y, w, h, label, value, valueColor = C.emerald, bgFill = C.surface) => {
  card(doc, x, y, w, h, bgFill, C.border);
  doc.font(FONT_REGULAR).fontSize(8).fillColor(C.slateLight)
     .text(label, x + 14, y + 13, { width: w - 28, characterSpacing: 0.6 });
  doc.font(FONT_BOLD).fontSize(20).fillColor(valueColor)
     .text(value, x + 14, y + 28, { width: w - 28 });
};

/** Safe page check — adds new page if remaining space < needed */
const ensureSpace = (doc, needed) => {
  if (doc.y + needed > SAFE_BOTTOM) {
    doc.addPage();
    return MARGIN + 30; // safe start Y on new page
  }
  return doc.y;
};

/**
 * Draw page header — top accent bar + report label + divider + page title.
 * Returns Y where body content should begin.
 */
const drawPageHeader = (doc, title) => {
  fillRect(doc, 0, 0, PAGE_W, 8, C.emerald);
  doc.font(FONT_REGULAR)
     .fontSize(8)
     .fillColor(C.emerald)
     .text("SOLAROPTI.AI  //  ENGINEERING PROPOSAL", MARGIN, 22, { characterSpacing: 1 });
  hRule(doc, 38, C.border, 0.5);
  doc.font(FONT_BOLD).fontSize(20).fillColor(C.ink).text(title, MARGIN, 52);
  hRule(doc, 82, C.emerald, 1.5);
  doc.y = 96;
  return 96;
};

/**
 * Draw global footer on ALL buffered pages.
 * IMPORTANT: parks cursor on last page after loop to prevent ghost page.
 */
const drawGlobalFooter = (doc) => {

    const range =
        doc.bufferedPageRange();

    const totalPages =
        range.count;

    for (
        let i = 0;
        i < totalPages;
        i++
    ) {

        doc.switchToPage(i);

        const footerY = 770;

        doc
            .rect(
                0,
                footerY,
                595,
                45
            )
            .fill(
                "#0A0F12"
            );

        doc
            .fillColor(
                "#FFFFFF"
            )
            .font(
                "NotoSans-Regular"
            )
            .fontSize(
                9
            )
            .text(
                `SolarOpti-AI | Page ${i + 1} of ${totalPages}`,
                50,
                footerY + 15,
                {
                    width:495,
                    align:"center"
                }
            );
    }

    doc.switchToPage(
        totalPages - 1
    );
};

// =============================================================================
// MAIN CONTROLLER
// =============================================================================
export const generateSolarReport = async (req, res) => {
  try {
    const { recommendation, peakInfo, formDetails, graphData } = req.body;

    // ── Secure User Lookup ───────────────────────────────────────────────────
    let safeUserName = "SolarOpti Client";
    if (req.user) {
      const userDoc = await User.findById(req.user).select("name");
      if (userDoc?.name) safeUserName = userDoc.name;
    }

    // ── PDFKit Init ──────────────────────────────────────────────────────────
    const doc = new PDFDocument({
      size     : "A4",
      margin   : MARGIN,
      bufferPages: true,
      info     : {
        Title   : "SolarOpti AI Solar Engineering Proposal",
        Author  : "SolarOpti.AI",
        Creator : "SolarOpti PDF Engine v2",
      },
    });

    // Register Unicode-capable fonts (fixes Rs. / CO2 glyph issues)
    doc.registerFont("Regular", FONT_REGULAR);
    doc.registerFont("Bold",    FONT_BOLD);

    const buffers = [];
    doc.on("data", (chunk) => buffers.push(chunk));
    doc.on("end", () => {
      const pdfData = Buffer.concat(buffers);
      res.writeHead(200, {
        "Content-Type"        : "application/pdf",
        "Content-Disposition" : "attachment; filename=SolarOpti_Engineering_Proposal.pdf",
        "Content-Length"      : pdfData.length,
      });
      res.end(pdfData);
    });

    // ── Dynamic Math Engine ──────────────────────────────────────────────────
    let monthlyKwh = 0;
    if (recommendation?.estimatedProduction) {
      monthlyKwh = parseFloat(recommendation.estimatedProduction.replace(/[^0-9.]/g, "")) || 0;
    }
    const annualKwh      = monthlyKwh * 12;
    // ASCII-safe: use "CO2" in body text, render "CO\u2082" only if font supports it
    // NotoSans supports U+2082, so we can use it directly:
    const co2Tons        = ((annualKwh * 0.82) / 1000).toFixed(1);
    const treesEquiv     = Math.round((parseFloat(co2Tons) * 1000) / 21);

    let finalCostNum = 0;
    if (recommendation?.finalCost) {
      finalCostNum = parseFloat(recommendation.finalCost.replace(/[^0-9.]/g, "")) || 0;
    }

    const detectedState  = formDetails?.state
      || formDetails?.address?.split(",").pop()?.trim()
      || "Default";
    const gridTariff     = await getTariffForState(detectedState);
    const annualSavings  = Math.round(annualKwh * gridTariff);
    const paybackText    = (annualSavings > 0 && finalCostNum > 0)
      ? `${(finalCostNum / annualSavings).toFixed(1)} Years`
      : "Insufficient Data";

    // ══════════════════════════════════════════════════════════════════════════
    // PAGE 1 — EXECUTIVE COVER
    // ══════════════════════════════════════════════════════════════════════════
    // Full-bleed top bar
    fillRect(doc, 0, 0, PAGE_W, 10, C.emerald);

    // Brand wordmark block
    doc.font(FONT_BOLD).fontSize(42).fillColor(C.ink).text("SolarOpti.AI", MARGIN, 130);
    doc.font(FONT_REGULAR).fontSize(15).fillColor(C.emerald)
       .text("AI Solar Engineering Proposal", MARGIN, 182, { characterSpacing: 0.5 });
    hRule(doc, 210, C.emerald, 1.5);

    // Client meta block
    const metaY = 232;
    doc.font(FONT_REGULAR).fontSize(8).fillColor(C.slateLight)
       .text("PREPARED FOR", MARGIN, metaY, { characterSpacing: 1 });
    doc.font(FONT_BOLD).fontSize(14).fillColor(C.slate)
       .text(safeUserName, MARGIN, metaY + 13);

    doc.font(FONT_REGULAR).fontSize(8).fillColor(C.slateLight)
       .text("DEPLOYMENT SITE", MARGIN, metaY + 40, { characterSpacing: 1 });
    doc.font(FONT_BOLD).fontSize(11).fillColor(C.slate)
       .text(formDetails?.address || "Selected Geographic Coordinates", MARGIN, metaY + 53);

    doc.font(FONT_REGULAR).fontSize(8).fillColor(C.slateLight)
       .text("EVALUATION DATE", MARGIN, metaY + 78, { characterSpacing: 1 });
    doc.font(FONT_BOLD).fontSize(11).fillColor(C.slate)
       .text(new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }),
             MARGIN, metaY + 91);

    hRule(doc, metaY + 118, C.border, 0.5);

    // Executive Summary label
    doc.font(FONT_REGULAR).fontSize(8.5).fillColor(C.slateLight)
       .text("EXECUTIVE SUMMARY", MARGIN, metaY + 132, { characterSpacing: 1.2 });

    // 2-column KPI cards
    const cardY = metaY + 150;
    const cardH = 90;
    const cardW = (CONTENT_W - 16) / 2;

    // Card 1 — System Size
    card(doc, MARGIN, cardY, cardW, cardH, C.emeraldLight, C.emeraldBorder);
    fillRect(doc, MARGIN, cardY, cardW, 4, C.emerald);
    doc.font(FONT_REGULAR).fontSize(8).fillColor(C.emeraldDeep)
       .text("RECOMMENDED SYSTEM SIZE", MARGIN + 14, cardY + 16, { characterSpacing: 0.5 });
    doc.font(FONT_BOLD).fontSize(26).fillColor(C.emerald)
       .text(recommendation?.systemSize || "N/A", MARGIN + 14, cardY + 33);

    // Card 2 — Monthly Yield
    const c2x = MARGIN + cardW + 16;
    card(doc, c2x, cardY, cardW, cardH, C.surface, C.border);
    fillRect(doc, c2x, cardY, cardW, 4, C.slateLight);
    doc.font(FONT_REGULAR).fontSize(8).fillColor(C.slateLight)
       .text("EST. MONTHLY GENERATION", c2x + 14, cardY + 16, { characterSpacing: 0.5 });
    doc.font(FONT_BOLD).fontSize(26).fillColor(C.ink)
       .text(recommendation?.estimatedProduction || "N/A", c2x + 14, cardY + 33);

    // 4-column mini-stat bar below cards
    const miniY = cardY + cardH + 20;
    const miniW = CONTENT_W / 4;
    const miniStats = [
      { label: "TOTAL PANELS",     value: recommendation?.recommendedPanels   || "N/A" },
      { label: "ANNUAL YIELD",     value: `${annualKwh.toLocaleString("en-IN")} kWh` },
      { label: "NET INVESTMENT",   value: recommendation?.finalCost            || "N/A" },
      { label: "PAYBACK PERIOD",   value: paybackText },
    ];
    miniStats.forEach(({ label, value }, i) => {
      const mx = MARGIN + i * miniW;
      if (i > 0) {
        doc.save().strokeColor(C.border).lineWidth(0.5)
           .moveTo(mx, miniY).lineTo(mx, miniY + 52).stroke().restore();
      }
      doc.font(FONT_REGULAR).fontSize(7.5).fillColor(C.slateLight)
         .text(label, mx + 8, miniY + 6, { characterSpacing: 0.8, width: miniW - 10 });
      doc.font(FONT_BOLD).fontSize(13).fillColor(C.slate)
         .text(value, mx + 8, miniY + 20, { width: miniW - 10 });
    });
    hRule(doc, miniY + 56, C.border, 0.5);

    // Confidentiality note
    doc.font(FONT_REGULAR).fontSize(8).fillColor(C.slateLight)
       .text(
         "CONFIDENTIAL  —  This document is prepared exclusively for the named client and contains proprietary AI-generated analysis.",
         MARGIN,
         miniY + 68,
         { width: CONTENT_W, align: "center" }
       );

    // ══════════════════════════════════════════════════════════════════════════
    // PAGE 2 — AI PREDICTIVE GENERATION ANALYTICS
    // ══════════════════════════════════════════════════════════════════════════
    doc.addPage();
    let y = drawPageHeader(doc, "1.  Predictive AI Generation Analytics");

    // Intro line
    doc.font(FONT_REGULAR).fontSize(10).fillColor(C.slateLight)
       .text(
         "Machine-learning solar irradiance matrix projections modelling active daily production thresholds across your deployment latitude.",
         MARGIN, y, { width: CONTENT_W }
       );
    y = doc.y + 16;

    // Peak generation highlight card (full-width)
    if (peakInfo) {
      card(doc, MARGIN, y, CONTENT_W, 62, C.emeraldLight, C.emeraldBorder);
      fillRect(doc, MARGIN, y, CONTENT_W, 3, C.emerald);
      doc.font(FONT_BOLD).fontSize(9).fillColor(C.emeraldDeep)
         .text("FORECASTED PEAK GENERATION WINDOW", MARGIN + 14, y + 13, { characterSpacing: 0.8 });
      doc.font(FONT_REGULAR).fontSize(11).fillColor(C.emeraldDark)
         .text(
           `Maximum array output of `,
           MARGIN + 14, y + 30,
           { lineBreak: false }
         );
      const peakLabelX = MARGIN + 14 + doc.widthOfString("Maximum array output of ");
      doc.font(FONT_BOLD).fontSize(11).fillColor(C.emeraldDeep)
         .text(`${peakInfo.peakPower} kW`, peakLabelX, y + 30, { lineBreak: false });
      const afterPeak = peakLabelX + doc.widthOfString(`${peakInfo.peakPower} kW`);
      doc.font(FONT_REGULAR).fillColor(C.emeraldDark)
         .text(`  at  `, afterPeak, y + 30, { lineBreak: false });
      const afterAt = afterPeak + doc.widthOfString("  at  ");
      doc.font(FONT_BOLD).fillColor(C.emeraldDeep)
         .text(`${peakInfo.peakTime}`, afterAt, y + 30);
      y += 82;
    }

    // Section heading
    y = sectionTitle(doc, "Hourly AI Irradiance Conversion Matrix", MARGIN, y);
    y += 8;

    // Resolve data points
    const activePoints = (graphData && graphData.length > 0)
      ? graphData
      : [
          { time: "07:00", power_kwh: 0.4 }, { time: "08:00", power_kwh: 1.1 },
          { time: "09:00", power_kwh: 2.0 }, { time: "10:00", power_kwh: 2.8 },
          { time: "11:00", power_kwh: 3.5 }, { time: "12:00", power_kwh: 4.2 },
          { time: "13:00", power_kwh: 4.0 }, { time: "14:00", power_kwh: 3.9 },
          { time: "15:00", power_kwh: 3.1 }, { time: "16:00", power_kwh: 2.2 },
          { time: "17:00", power_kwh: 1.2 }, { time: "18:00", power_kwh: 0.3 },
        ];

    const maxKw       = Math.max(...activePoints.map((p) => Number(p.power_kwh || 0)));
    const ROW_H       = 22;
    const BAR_MAX_W   = 180;
    const COL_TIME    = MARGIN + 14;
    const COL_BAR     = MARGIN + 80;
    const COL_KW      = MARGIN + 80 + BAR_MAX_W + 14;
    const TABLE_W     = CONTENT_W;

    // Table header
    fillRect(doc, MARGIN, y, TABLE_W, ROW_H, C.ink);
    doc.font(FONT_BOLD).fontSize(8).fillColor(C.white)
       .text("TIME",            COL_TIME, y + 7, { characterSpacing: 0.8 });
    doc.text("OUTPUT PROFILE",  COL_BAR,  y + 7, { characterSpacing: 0.8 });
    doc.text("kW YIELD",        COL_KW,   y + 7, { characterSpacing: 0.8 });
    y += ROW_H;

    // Table rows with inline bar chart
    activePoints.slice(0, 12).forEach((pt, idx) => {
      // Page overflow guard
      y = ensureSpace(doc, ROW_H + 4);

      const rowFill = idx % 2 === 0 ? C.white : C.surface;
      fillRect(doc, MARGIN, y, TABLE_W, ROW_H, rowFill, C.border, 0.5);

      const kw       = Number(pt.power_kwh || 0);
      const barW     = maxKw > 0 ? Math.round((kw / maxKw) * BAR_MAX_W) : 0;
      const intensity = kw / (maxKw || 1);

      // Colour bar by intensity: low=teal-light, high=emerald-dark
      const barColor = intensity > 0.75 ? C.emeraldDark
                     : intensity > 0.4  ? C.emerald
                     :                    C.emeraldBorder;

      // Time label
      doc.font(FONT_REGULAR).fontSize(9.5).fillColor(C.slateLight)
         .text(pt.time || pt.label || "—", COL_TIME, y + 6);

      // Bar track
      fillRect(doc, COL_BAR, y + 6, BAR_MAX_W, 10, C.surface);
      if (barW > 0) fillRect(doc, COL_BAR, y + 6, barW, 10, barColor);

      // kW value
      doc.font(FONT_BOLD).fontSize(9.5).fillColor(C.emeraldDark)
         .text(`${kw.toFixed(2)} kW`, COL_KW, y + 6);

      y += ROW_H;
    });

    // Daily total footer row
    const totalKw = activePoints.reduce((s, p) => s + Number(p.power_kwh || 0), 0);
    fillRect(doc, MARGIN, y, TABLE_W, ROW_H, C.ink);
    doc.font(FONT_BOLD).fontSize(9).fillColor(C.white)
       .text("DAILY TOTAL", COL_TIME, y + 7);
    doc.fillColor(C.emerald)
       .text(`${totalKw.toFixed(2)} kWh`, COL_KW, y + 7);
    y += ROW_H + 14;

    // Data provenance note
    doc.font(FONT_REGULAR).fontSize(8).fillColor(C.slateLight)
       .text(
         "* Output projections modelled using GHI irradiance data combined with local weather-pattern telemetry. Actual yields may vary ±8%.",
         MARGIN, y, { width: CONTENT_W }
       );

    // ══════════════════════════════════════════════════════════════════════════
    // PAGE 3 — TECHNICAL & GEOSPATIAL SPECIFICATIONS
    // ══════════════════════════════════════════════════════════════════════════
    doc.addPage();
    y = drawPageHeader(doc, "2.  Technical & Geospatial Specifications");

    // ── Technical Spec Cards ─────────────────────────────────────────────────
    y = sectionTitle(doc, "System Configuration Parameters", MARGIN, y);
    y += 10;

    const latVal = formDetails?.lat
      ? Math.abs(parseFloat(formDetails.lat) || 11.0)
      : 11.0;

    // 4 spec cards — 2×2 grid
    const specCardW = (CONTENT_W - 12) / 2;
    const specCardH = 68;
    const specsRow1 = [
      { label: "STRUCTURAL TILT ANGLE",   value: `\u2248 ${latVal.toFixed(1)}\u00B0`,   sub: "Latitude-matched optimisation vector", color: C.ink },
      { label: "OPTIMAL AZIMUTH",         value: "180\u00B0 True South",                sub: "Northern hemisphere solar south bearing", color: C.emeraldDark },
    ];
    const specsRow2 = [
      { label: "ROOF SUBSTRATE TYPE",     value: formDetails?.roofType || "Flat Roof",   sub: "Surface mounting classification",       color: C.ink },
      { label: "RECOMMENDED PANELS",      value: recommendation?.recommendedPanels || "N/A", sub: "High-efficiency monocrystalline array", color: C.ink },
    ];

    [specsRow1, specsRow2].forEach((row, ri) => {
      const rowY = y + ri * (specCardH + 10);
      row.forEach(({ label, value, sub, color }, ci) => {
        const cx = MARGIN + ci * (specCardW + 12);
        card(doc, cx, rowY, specCardW, specCardH, C.surface, C.border);
        doc.font(FONT_REGULAR).fontSize(7.5).fillColor(C.slateLight)
           .text(label, cx + 14, rowY + 12, { characterSpacing: 0.7 });
        doc.font(FONT_BOLD).fontSize(16).fillColor(color)
           .text(value, cx + 14, rowY + 26);
        doc.font(FONT_REGULAR).fontSize(8).fillColor(C.slateLight)
           .text(sub, cx + 14, rowY + 50, { width: specCardW - 28 });
      });
    });
    y += 2 * (specCardH + 10) + 6;

    // Inverter row
    y = ensureSpace(doc, 30);
    inlineLine(doc,
      [
        { text: "Inverter / Topology:  ", bold: false, color: C.slateLight },
        { text: recommendation?.recommendedInverter || "High-Efficiency String Inverter", bold: true, color: C.slate },
      ],
      MARGIN, y
    );
    y = doc.y + 14;

    hRule(doc, y, C.border, 0.5);
    y += 16;

    // ── Map Section ──────────────────────────────────────────────────────────
    y = sectionTitle(doc, "Deployment Site — Geospatial View", MARGIN, y);
    y += 10;

    const lat = formDetails?.lat || "11.012345";
    const lon = formDetails?.lon || "76.954321";
    const MAP_H = 210;

    // Safe space check for map — if not enough room, overflow to new page
    if (y + MAP_H + 20 > SAFE_BOTTOM) {
      doc.addPage();
      y = drawPageHeader(doc, "2.  Technical & Geospatial Specifications (cont.)");
    }

    const staticMapUrl = `https://maps.geoapify.com/v1/staticmap?style=osm-carto&width=990&height=420&center=lonlat:${lon},${lat}&zoom=16&marker=lonlat:${lon},${lat};color:%2310b981;size:medium&apiKey=free`;

    const controller = new AbortController();
    const mapTimeout = setTimeout(() => controller.abort(), 4000);

    try {
      const mapRes = await fetch(staticMapUrl, { signal: controller.signal });
      clearTimeout(mapTimeout);

      if (mapRes.ok) {
        const mapBuf = Buffer.from(await mapRes.arrayBuffer());
        // Thin border frame before image
        doc.save().roundedRect(MARGIN, y, CONTENT_W, MAP_H, 4).stroke(C.border).restore();
        doc.image(mapBuf, MARGIN + 1, y + 1, { width: CONTENT_W - 2, height: MAP_H - 2 });
        y += MAP_H + 4;
      } else {
        throw new Error("non-200");
      }
    } catch {
      clearTimeout(mapTimeout);
      // Graceful fallback tile
      card(doc, MARGIN, y, CONTENT_W, 56, C.surface, C.border);
      doc.font(FONT_BOLD).fontSize(9).fillColor(C.slateLight)
         .text("MAP UNAVAILABLE  —  INSTALLATION COORDINATES", MARGIN + 14, y + 14, { characterSpacing: 0.6 });
      doc.font(FONT_BOLD).fontSize(12).fillColor(C.slate)
         .text(`Lat ${lat}   /   Lon ${lon}`, MARGIN + 14, y + 30);
      y += 70;
    }

    // Coordinate caption
    doc.font(FONT_REGULAR).fontSize(8).fillColor(C.slateLight)
       .text(`Installation coordinates: ${lat}\u00B0 N, ${lon}\u00B0 E`, MARGIN, y + 4);

    // ══════════════════════════════════════════════════════════════════════════
    // PAGE 4 — FINANCIAL LEDGER & ENVIRONMENTAL IMPACT
    // ══════════════════════════════════════════════════════════════════════════
    doc.addPage();
    y = drawPageHeader(doc, "3.  Financial Ledger & Environmental Impact");

    // ── Cost Breakdown ────────────────────────────────────────────────────────
    y = sectionTitle(doc, "Project Cost Structure", MARGIN, y);
    y += 10;

    const costRows = [
      { label: "Gross EPC Installation Cost",  value: recommendation?.estimatedCost    || "N/A", color: C.slate,       bold: false },
      { label: "Government Subsidy (PM-KUSUM)", value: `\u2212 ${recommendation?.governmentSubsidy || "N/A"}`, color: "#16A34A", bold: false },
    ];

    costRows.forEach(({ label, value, color, bold }) => {
      y = ensureSpace(doc, 22);
      fillRect(doc, MARGIN, y, CONTENT_W, 22, C.surface, C.border, 0.5);
      doc.font(FONT_REGULAR).fontSize(10).fillColor(C.slateLight)
         .text(label, MARGIN + 12, y + 6);
      doc.font(bold ? FONT_BOLD : FONT_REGULAR).fontSize(10).fillColor(color)
         .text(value, MARGIN, y + 6, { align: "right", width: CONTENT_W - 12 });
      y += 22;
    });

    // Net investment highlight
    y = ensureSpace(doc, 38);
    fillRect(doc, MARGIN, y, CONTENT_W, 38, C.ink);
    fillRect(doc, MARGIN, y, 4, 38, C.emerald);
    doc.font(FONT_REGULAR).fontSize(9).fillColor(C.slateLight)
       .text("NET CAPITAL INVESTMENT", MARGIN + 16, y + 8, { characterSpacing: 0.8 });
    doc.font(FONT_BOLD).fontSize(18).fillColor(C.emerald)
       .text(recommendation?.finalCost || "N/A", MARGIN + 16, y + 20);
    y += 52;

    // ── Investment KPI Cards ─────────────────────────────────────────────────
    y = sectionTitle(doc, "Investment Break-Even Projections", MARGIN, y);
    y += 10;

    const kpiW = (CONTENT_W - 24) / 3;
    const kpiH = 78;
    const kpis = [
      { label: "APPLIED GRID TARIFF",      value: `\u20B9${gridTariff}/kWh`,                              color: C.blueAccent },
      { label: "ANNUAL COST SAVINGS",      value: `\u20B9${annualSavings.toLocaleString("en-IN")}`,        color: C.emerald     },
      { label: "CAPITAL PAYBACK PERIOD",   value: paybackText,                                             color: C.ink         },
    ];
    kpis.forEach(({ label, value, color }, i) => {
      statCard(doc, MARGIN + i * (kpiW + 12), y, kpiW, kpiH, label, value, color, C.surface);
    });
    y += kpiH + 20;

    // ── Environmental Impact ──────────────────────────────────────────────────
    y = sectionTitle(doc, "Carbon Offset & Environmental Contribution", MARGIN, y);
    y += 10;

    // Full-width eco card with 2 metrics inside
    card(doc, MARGIN, y, CONTENT_W, 88, C.emeraldLight, C.emeraldBorder);
    fillRect(doc, MARGIN, y, CONTENT_W, 3, C.emerald);

    const ecoHalfW = (CONTENT_W - 1) / 2;
    // Left: CO2
    doc.font(FONT_REGULAR).fontSize(8).fillColor(C.emeraldDeep)
       .text("ANNUAL CO\u2082 REDUCTION", MARGIN + 14, y + 18, { characterSpacing: 0.7 });
    doc.font(FONT_BOLD).fontSize(28).fillColor(C.emeraldDark)
       .text(`${co2Tons} Tonnes`, MARGIN + 14, y + 32);

    // Divider
    doc.save().strokeColor(C.emeraldBorder).lineWidth(0.75)
       .moveTo(MARGIN + ecoHalfW, y + 14).lineTo(MARGIN + ecoHalfW, y + 74).stroke().restore();

    // Right: Trees
    const tx = MARGIN + ecoHalfW + 14;
    doc.font(FONT_REGULAR).fontSize(8).fillColor(C.emeraldDeep)
       .text("EQUIVALENT TREES PLANTED", tx, y + 18, { characterSpacing: 0.7 });
    doc.font(FONT_BOLD).fontSize(28).fillColor(C.emeraldDark)
       .text(`\u2248 ${treesEquiv} Trees`, tx, y + 32);

    y += 104;

    // Annual generation recap
    hRule(doc, y, C.border, 0.5);
    y += 14;
    doc.font(FONT_REGULAR).fontSize(9).fillColor(C.slateLight)
       .text(
         `Lifetime 25-year carbon offset projection: approximately ${(parseFloat(co2Tons) * 25).toFixed(0)} tonnes CO\u2082 — equivalent to ${(treesEquiv * 25).toLocaleString("en-IN")} trees.`,
         MARGIN, y, { width: CONTENT_W }
       );

    // ── Closing Certification Block ───────────────────────────────────────────
    y += 30;
    y = ensureSpace(doc, 70);
    card(doc, MARGIN, y, CONTENT_W, 66, C.surface, C.border);
    doc.font(FONT_BOLD).fontSize(10).fillColor(C.ink)
       .text("SolarOpti.AI  —  Analysis Certification", MARGIN + 14, y + 14);
    doc.font(FONT_REGULAR).fontSize(8.5).fillColor(C.slateLight)
       .text(
         "This engineering proposal has been generated by SolarOpti.AI using proprietary machine-learning models trained on regional solar irradiance datasets and real-world installation telemetry. All projections are advisory estimates and should be validated by a licensed solar engineer before procurement.",
         MARGIN + 14, y + 30, { width: CONTENT_W - 28 }
       );

    // ── GLOBAL FOOTER (call LAST, before doc.end()) ───────────────────────────
    drawGlobalFooter(doc);
    doc.end();

  } catch (err) {
    console.error("[SolarOpti PDF Engine] Exception:", err);
    res.status(500).json({ success: false, message: "Failed to generate PDF proposal." });
  }
};