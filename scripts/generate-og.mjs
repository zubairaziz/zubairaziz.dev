/**
 * Generates `scripts/og-image.html` — a standalone 1200x630 card that mirrors
 * the site's terminal theme, with JetBrains Mono + Oxanium embedded as base64
 * (no network needed). The card is then screenshotted to
 * `public/opengraph-image.png`.
 *
 * Run: node scripts/generate-og.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

/* ------------------------------------------------------------------ */
/* oklch -> sRGB hex (matches the .dark tokens in src/styles/app.css) */
/* ------------------------------------------------------------------ */
function oklchToHex(L, C, Hdeg) {
	const h = (Hdeg * Math.PI) / 180
	const a = C * Math.cos(h)
	const b = C * Math.sin(h)
	const l_ = L + 0.3963377774 * a + 0.2158037573 * b
	const m_ = L - 0.1055613458 * a - 0.0638541728 * b
	const s_ = L - 0.0894841775 * a - 1.291485548 * b
	const l = l_ ** 3
	const m = m_ ** 3
	const s = s_ ** 3
	const r = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s
	const g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s
	const bl = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s
	const toSrgb = (c) => {
		c = Math.min(1, Math.max(0, c))
		c = c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055
		return Math.round(c * 255)
	}
	const hex = (n) => n.toString(16).padStart(2, '0')
	return `#${hex(toSrgb(r))}${hex(toSrgb(g))}${hex(toSrgb(bl))}`
}

const colors = {
	background: oklchToHex(0.148, 0.004, 228.8),
	foreground: oklchToHex(0.987, 0.002, 197.1),
	primary: oklchToHex(0.64, 0.25, 15),
	'muted-foreground': oklchToHex(0.723, 0.014, 214.4),
	card: oklchToHex(0.218, 0.008, 223.9),
}

console.log('theme colors (hex):')
for (const [k, v] of Object.entries(colors)) console.log(`  ${k}: ${v}`)

/* ------------------------------------------------------------------ */
/* Embed the variable fonts as base64 data URIs                        */
/* ------------------------------------------------------------------ */
const b64 = (rel) => readFileSync(join(root, rel)).toString('base64')

const jetbrains = b64(
	'node_modules/@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2',
)
const oxanium = b64(
	'node_modules/@fontsource-variable/oxanium/files/oxanium-latin-wght-normal.woff2',
)

/* ------------------------------------------------------------------ */
/* Card layout (uses oklch() directly for exact theme colors)          */
/* ------------------------------------------------------------------ */
const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<style>
  @font-face {
    font-family: "JetBrains Mono";
    font-style: normal;
    font-weight: 100 800;
    font-display: block;
    src: url(data:font/woff2;base64,${jetbrains}) format("woff2");
  }
  @font-face {
    font-family: "Oxanium";
    font-style: normal;
    font-weight: 200 800;
    font-display: block;
    src: url(data:font/woff2;base64,${oxanium}) format("woff2");
  }

  :root {
    --bg: oklch(0.148 0.004 228.8);
    --fg: oklch(0.987 0.002 197.1);
    --primary: oklch(0.64 0.25 15);
    --muted: oklch(0.723 0.014 214.4);
    --border: oklch(1 0 0 / 10%);
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }

  html, body {
    width: 1200px;
    height: 630px;
    overflow: hidden;
  }

  body {
    background:
      radial-gradient(1000px 500px at 85% -10%, oklch(0.64 0.25 15 / 0.16), transparent 60%),
      radial-gradient(800px 500px at -10% 110%, oklch(0.64 0.25 15 / 0.08), transparent 60%),
      var(--bg);
    color: var(--fg);
    font-family: "JetBrains Mono", monospace;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .window {
    width: 1104px;
    height: 534px;
    border: 1px solid var(--border);
    border-radius: 20px;
    background: oklch(0.148 0.004 228.8 / 0.6);
    box-shadow: 0 30px 80px oklch(0 0 0 / 0.5);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .titlebar {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 18px 24px;
    border-bottom: 1px solid var(--border);
  }

  .dot { width: 14px; height: 14px; border-radius: 50%; }
  .dot.a { background: oklch(0.704 0.191 22.216); }
  .dot.b { background: oklch(0.723 0.014 214.4 / 0.6); }
  .dot.c { background: oklch(0.723 0.014 214.4 / 0.35); }

  .title {
    margin-left: auto;
    margin-right: auto;
    transform: translateX(-34px);
    color: var(--muted);
    font-size: 20px;
    letter-spacing: 0.02em;
  }

  .title .prompt { color: var(--primary); }

  .body {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 26px;
    padding: 40px 72px 56px;
  }

  .line {
    font-size: 28px;
    line-height: 1.2;
  }

  .line .prompt { color: var(--primary); }
  .line .cmd { color: var(--muted); }

  .name {
    font-family: "Oxanium", sans-serif;
    font-weight: 700;
    font-size: 108px;
    line-height: 0.95;
    letter-spacing: -0.02em;
    color: var(--fg);
  }

  .tagline {
    font-size: 32px;
    line-height: 1.3;
  }

  .tagline .comment { color: var(--muted); }
  .tagline .accent { color: var(--primary); }

  .cursor {
    display: inline-block;
    width: 20px;
    height: 34px;
    background: var(--primary);
    margin-left: 8px;
    vertical-align: -4px;
  }

  .footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 72px 52px;
    color: var(--muted);
    font-size: 22px;
  }

  .footer .status { color: var(--primary); }
  .footer .dot-live {
    display: inline-block;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: var(--primary);
    margin-right: 10px;
    vertical-align: 1px;
  }
</style>
</head>
<body>
  <div class="window">
    <div class="titlebar">
      <span class="dot a"></span><span class="dot b"></span><span class="dot c"></span>
      <span class="title"><span class="prompt">admin@zubairaziz</span>.dev:~$</span>
    </div>
    <div class="body">
      <div class="line"><span class="prompt">$</span> <span class="cmd">whoami</span></div>
      <div class="name">ZUBAIR AZIZ</div>
      <div class="tagline">
        <span class="comment">// I build</span>
        <span class="accent"> websites &middot; mobile apps &middot; custom software &middot; developer tools</span>
        <span class="cursor"></span>
      </div>
    </div>
    <div class="footer">
      <span>~/zubairaziz.dev</span>
      <span><span class="dot-live"></span><span class="status">available</span></span>
    </div>
  </div>
</body>
</html>`

writeFileSync(join(root, 'scripts', 'og-image.html'), html, 'utf8')
console.log('\nwrote scripts/og-image.html')
