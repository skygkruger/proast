# PASTEL RETRO TERMINAL
## Complete Implementation Guide

**For:** RegexGPT & PRoast Redesigns  
**Version:** 1.0  
**Last Updated:** January 2025  
**Time Required:** 1-2 hours per app

---

# TABLE OF CONTENTS

1. [Quick Start Checklist](#1-quick-start-checklist)
2. [Backup Your Apps First](#2-backup-your-apps-first)
3. [Update Configuration Files](#3-update-configuration-files)
4. [Implement RegexGPT Redesign](#4-implement-regexgpt-redesign)
5. [Implement PRoast Redesign](#5-implement-proast-redesign)
6. [ASCII Logo Options](#6-ascii-logo-options)
7. [Connect Your APIs](#7-connect-your-apis)
8. [Testing Checklist](#8-testing-checklist)
9. [Deploy to Production](#9-deploy-to-production)
10. [Rollback If Needed](#10-rollback-if-needed)
11. [Troubleshooting Guide](#11-troubleshooting-guide)

---

# 1. QUICK START CHECKLIST

Before you begin, make sure you have:

```
[ ] Node.js v18+ installed
[ ] Your projects running locally (npm run dev works)
[ ] Git installed and configured
[ ] Access to your GitHub repositories
[ ] Your Stripe payment links ready
[ ] 1-2 hours of uninterrupted time
```

**Golden Rules:**

```
┌────────────────────────────────────────────────────────────┐
│  [!] ALWAYS backup before making changes                   │
│  [!] Test locally before deploying                         │
│  [!] Make changes one file at a time                       │
│  [!] Commit after each successful step                     │
│  [!] Keep old files until new design is verified           │
└────────────────────────────────────────────────────────────┘
```

---

# 2. BACKUP YOUR APPS FIRST

## Step 2.1: Create Git Backup Branch

Open terminal and navigate to your project:

```bash
# For RegexGPT
cd ~/projects/regexgpt

# Create backup branch
git checkout -b backup-before-redesign
git push origin backup-before-redesign

# Return to main and create feature branch
git checkout main
git checkout -b retro-redesign
```

**Repeat for PRoast:**

```bash
cd ~/projects/proast
git checkout -b backup-before-redesign
git push origin backup-before-redesign
git checkout main
git checkout -b retro-redesign
```

## Step 2.2: Verify Backup Exists

```bash
# List all branches
git branch -a

# You should see:
#   main
# * retro-redesign
#   backup-before-redesign
```

---

# 3. UPDATE CONFIGURATION FILES

These changes apply to BOTH projects.

## Step 3.1: Update Tailwind Config

Open `tailwind.config.js` and replace with:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Backgrounds
        'retro-deep': '#1a1a2e',
        'retro-card': '#16161a',
        'retro-hover': '#232336',
        // Text
        'retro-text': '#e8e3e3',
        'retro-secondary': '#a8b2c3',
        'retro-muted': '#6e6a86',
        // Accents
        'pastel-cyan': '#7eb8da',
        'pastel-mint': '#a8d8b9',
        'pastel-lavender': '#c4a7e7',
        'pastel-rose': '#f2cdcd',
        'pastel-cream': '#ffe9b0',
        'pastel-peach': '#f5a97f',
        'pastel-coral': '#eb6f92',
      },
      fontFamily: {
        mono: ['var(--font-mono)', 'JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
}
```

## Step 3.2: Update Global Styles

Open `src/app/globals.css` and ADD these styles (keep existing @tailwind directives):

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* ════════════════════════════════════════════════════════════ */
/*  PASTEL RETRO TERMINAL STYLES                                */
/* ════════════════════════════════════════════════════════════ */

:root {
  --bg-deep: #1a1a2e;
  --bg-card: #16161a;
  --text-primary: #e8e3e3;
  --text-secondary: #a8b2c3;
  --text-muted: #6e6a86;
  --accent-cyan: #7eb8da;
  --accent-mint: #a8d8b9;
  --accent-lavender: #c4a7e7;
  --accent-rose: #f2cdcd;
  --accent-cream: #ffe9b0;
  --accent-peach: #f5a97f;
  --accent-coral: #eb6f92;
}

body {
  background-color: var(--bg-deep);
  color: var(--text-secondary);
}

pre {
  font-family: inherit;
  margin: 0;
}

::selection {
  background-color: var(--accent-lavender);
  color: var(--bg-deep);
}

::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: var(--bg-card);
}

::-webkit-scrollbar-thumb {
  background: var(--text-muted);
}

*:focus-visible {
  outline: 1px solid var(--accent-cyan);
  outline-offset: 2px;
}
```

## Step 3.3: Add JetBrains Mono Font

Open `src/app/layout.tsx` and update:

```tsx
import { JetBrains_Mono } from 'next/font/google'
import './globals.css'

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'],
  variable: '--font-mono',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={jetbrainsMono.variable}>
      <body className="font-mono">{children}</body>
    </html>
  )
}
```

## Step 3.4: Test Configuration

```bash
# Restart dev server
npm run dev

# Open http://localhost:3000
# Background should now be dark navy (#1a1a2e)
```

**Commit if working:**

```bash
git add .
git commit -m "Add retro terminal base styles and colors"
```

---

# 4. IMPLEMENT REGEXGPT REDESIGN

## Step 4.1: Backup Current Page

```bash
cd ~/projects/regexgpt
mv src/app/page.tsx src/app/page.backup.tsx
```

## Step 4.2: Create New Page

Create a new file `src/app/page.tsx` with the complete redesign code.

**The full code is provided in the separate file: `RegexGPT_Retro_Redesign.jsx`**

Copy the entire contents into your new `src/app/page.tsx`.

## Step 4.3: Key Sections to Customize

After copying, you need to customize these sections:

### A) Your API Endpoint (Line ~25-45)

Find the `handleGenerate` function and update to match your API:

```tsx
const handleGenerate = async () => {
  if (!inputValue.trim()) return;
  setIsLoading(true);
  setOutputValue('');
  
  try {
    // ═══════════════════════════════════════════════════
    // CUSTOMIZE THIS SECTION FOR YOUR API
    // ═══════════════════════════════════════════════════
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        prompt: inputValue,
        mode: activeTab === 0 ? 'generate' : 'explain'
      }),
    });
    
    const data = await response.json();
    
    // Update based on your API response structure:
    setOutputValue(data.regex || data.result);
    // ═══════════════════════════════════════════════════
  } catch (error) {
    console.error('Error:', error);
    setOutputValue('Error: Please try again.');
  } finally {
    setIsLoading(false);
  }
};
```

### B) Your Stripe Payment Link

Find the PRO pricing section (around line ~280) and add your link:

```tsx
{/* Wrap the PRO card in a link */}
<a 
  href="https://buy.stripe.com/YOUR_LINK_HERE"
  target="_blank"
  rel="noopener noreferrer"
  className="block hover:opacity-90 transition-opacity"
>
  <div style={{ color: '#c4a7e7' }}>
    {/* PRO pricing card content */}
  </div>
</a>
```

### C) Choose Your ASCII Logo

See Section 6 for logo options. Replace the logo section with your preferred design.

## Step 4.4: Test Locally

```bash
npm run dev
```

**Verify these work:**
- [ ] Page loads without errors
- [ ] Logo displays correctly
- [ ] Input field accepts text
- [ ] Generate button works
- [ ] Results display
- [ ] Copy button works

## Step 4.5: Commit Changes

```bash
git add .
git commit -m "Implement RegexGPT retro terminal redesign"
```

---

# 5. IMPLEMENT PROAST REDESIGN

## Step 5.1: Navigate and Backup

```bash
cd ~/projects/proast
mv src/app/page.tsx src/app/page.backup.tsx
```

## Step 5.2: Create New Page

Copy contents of `PRoast_Retro_Redesign.jsx` into new `src/app/page.tsx`.

## Step 5.3: Customize Your API

Find the `handleRoast` function and update:

```tsx
const handleRoast = async () => {
  if (!codeInput.trim()) return;
  setIsLoading(true);
  setRoastResult(null);
  
  try {
    // ═══════════════════════════════════════════════════
    // CUSTOMIZE THIS SECTION FOR YOUR API
    // ═══════════════════════════════════════════════════
    const response = await fetch('/api/roast', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        code: codeInput,
        severity: severityLevels[severityLevel].label.toLowerCase()
      }),
    });
    
    const data = await response.json();
    
    // Map your API response to expected format:
    setRoastResult({
      headline: data.headline || 'ROAST COMPLETE',
      rating: data.rating || 3,
      sins: data.sins || data.issues || [],
      praise: data.praise || 'You tried.'
    });
    // ═══════════════════════════════════════════════════
  } catch (error) {
    console.error('Error:', error);
  } finally {
    setIsLoading(false);
  }
};
```

## Step 5.4: Add Stripe Link

Same process as RegexGPT - wrap PRO pricing card in your payment link.

## Step 5.5: Test and Commit

```bash
npm run dev
# Test all functionality
git add .
git commit -m "Implement PRoast retro terminal redesign"
```

---

# 6. ASCII LOGO OPTIONS

Choose the best logo for your needs. Smaller logos work better on mobile.

## RegexGPT Logos

### Option A: Full Size (Desktop Hero)
```
██████╗ ███████╗ ██████╗ ███████╗██╗  ██╗ ██████╗ ██████╗ ████████╗
██╔══██╗██╔════╝██╔════╝ ██╔════╝╚██╗██╔╝██╔════╝ ██╔══██╗╚══██╔══╝
██████╔╝█████╗  ██║  ███╗█████╗   ╚███╔╝ ██║  ███╗██████╔╝   ██║   
██╔══██╗██╔══╝  ██║   ██║██╔══╝   ██╔██╗ ██║   ██║██╔═══╝    ██║   
██║  ██║███████╗╚██████╔╝███████╗██╔╝ ██╗╚██████╔╝██║        ██║   
╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚═╝        ╚═╝   
```

### Option B: Medium (Recommended)
```
┌─────────────────────────────────────────────────────┐
│                                                     │
│   ██████  ███████  ██████  ███████ ██   ██ ██████   │
│   ██   ██ ██      ██       ██       ██ ██  ██   ██  │
│   ██████  █████   ██   ███ █████     ███   ██████   │
│   ██   ██ ██      ██    ██ ██       ██ ██  ██       │
│   ██   ██ ███████  ██████  ███████ ██   ██ ██       │
│                                                     │
│                    G  P  T                          │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Option C: Compact (Mobile-Friendly)
```
╔═══════════════════════════════════╗
║                                   ║
║      ┌─┐┌─┐┌─┐┌─┐─┐ ┬┌─┐┌─┐┌┬┐    ║
║      ├┬┘├┤ │ ┬├┤ ┌┴┬┘│ ┬├─┘ │     ║
║      ┴└─└─┘└─┘└─┘┴ └─└─┘┴   ┴     ║
║                                   ║
║       pattern generator v1.0      ║
║                                   ║
╚═══════════════════════════════════╝
```

### Option D: Minimal (Very Mobile-Friendly)
```
┌───────────────────────────────┐
│                               │
│    [>] R E G E X G P T        │
│                               │
│    pattern generator v1.0     │
│                               │
└───────────────────────────────┘
```

### Option E: Stylized Box
```
╔══════════════════════════════════════════╗
║  ┌─┐ ┌─┐ ┌─┐ ┌─┐ ─┐ ┬ ┌─┐ ┌─┐ ┌┬┐       ║
║  │┬┘ ├┤  │ ┬ ├┤  ┌┴┬┘ │ ┬ ├─┘  │        ║
║  ┴└─ └─┘ └─┘ └─┘ ┴ └─ └─┘ ┴    ┴        ║
╠══════════════════════════════════════════╣
║  describe patterns in plain english      ║
╚══════════════════════════════════════════╝
```

---

## PRoast Logos

### Option A: Full Size (Desktop Hero)
```
██████╗ ██████╗  ██████╗  █████╗ ███████╗████████╗
██╔══██╗██╔══██╗██╔═══██╗██╔══██╗██╔════╝╚══██╔══╝
██████╔╝██████╔╝██║   ██║███████║███████╗   ██║   
██╔═══╝ ██╔══██╗██║   ██║██╔══██║╚════██║   ██║   
██║     ██║  ██║╚██████╔╝██║  ██║███████║   ██║   
╚═╝     ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝   ╚═╝   
```

### Option B: With Flame Border (Recommended)
```
        ╱╲    ╱╲    ╱╲
       ╱  ╲  ╱  ╲  ╱  ╲
      ╱    ╲╱    ╲╱    ╲
┌─────────────────────────────────┐
│                                 │
│    ██████  ██████   ██████      │
│    ██   ██ ██   ██ ██    ██     │
│    ██████  ██████  ██    ██     │
│    ██      ██   ██ ██    ██     │
│    ██      ██   ██  ██████      │
│                                 │
│     A  S  T     X_X             │
│                                 │
└─────────────────────────────────┘
```

### Option C: Compact with Severity
```
╔═══════════════════════════════════════╗
║                                       ║
║    ┌─┐┬─┐┌─┐┌─┐┌─┐┌┬┐                 ║
║    ├─┘├┬┘│ │├─┤└─┐ │                  ║
║    ┴  ┴└─└─┘┴ ┴└─┘ ┴                  ║
║                                       ║
║    :)  :|  >:(  X_X                   ║
║                                       ║
║    code reviewer with attitude        ║
║                                       ║
╚═══════════════════════════════════════╝
```

### Option D: Minimal Roast
```
┌───────────────────────────────────┐
│                                   │
│    X_X  P R O A S T               │
│                                   │
│    code reviewer with attitude    │
│                                   │
│    :)  :|  >:(  X_X               │
│                                   │
└───────────────────────────────────┘
```

### Option E: Fire Theme
```
╔═════════════════════════════════════════╗
║          ╱▔▔▔╲   ╱▔▔▔╲   ╱▔▔▔╲          ║
║         ╱ ╱╲  ╲ ╱ ╱╲  ╲ ╱ ╱╲  ╲         ║
╠═════════════════════════════════════════╣
║                                         ║
║      P R O A S T     v1.0               ║
║                                         ║
║      get roasted. learn something.      ║
║                                         ║
╚═════════════════════════════════════════╝
```

---

## How to Use a Logo

Replace the logo section in your page.tsx:

```tsx
{/* ASCII LOGO */}
<div className="text-center" style={{ color: '#7eb8da' }}>
  <pre className="text-xs leading-tight inline-block">
{`
┌───────────────────────────────┐
│                               │
│    [>] R E G E X G P T        │
│                               │
│    pattern generator v1.0     │
│                               │
└───────────────────────────────┘
`}
  </pre>
</div>
```

**Color Guide:**
- RegexGPT: `#7eb8da` (cyan)
- PRoast: `#eb6f92` (coral)

---

# 7. CONNECT YOUR APIS

## RegexGPT API Integration

Your API route (`src/app/api/generate/route.ts`) should return:

```typescript
// Expected response format
{
  regex: string,       // The generated regex pattern
  explanation?: string // Optional explanation
}

// Or
{
  result: string,      // The result (regex or explanation)
}
```

**Update handleGenerate to match your response:**

```tsx
const data = await response.json();

// If your API returns { regex, explanation }
setOutputValue(data.regex);
if (data.explanation) {
  setExplanation(data.explanation);
}

// If your API returns { result }
setOutputValue(data.result);
```

## PRoast API Integration

Your API route should return:

```typescript
// Expected response format
{
  headline: string,
  rating: number,      // 1-5
  sins: Array<{
    title: string,
    description: string,
    fix: string,
    severity: 'high' | 'medium' | 'low'
  }>,
  praise: string
}
```

**If your API format is different, transform it:**

```tsx
const data = await response.json();

setRoastResult({
  headline: data.summary || data.headline || 'ROAST COMPLETE',
  rating: data.score ? Math.ceil(data.score / 20) : 3, // Convert 0-100 to 1-5
  sins: data.issues?.map(issue => ({
    title: issue.name || issue.title,
    description: issue.message || issue.description,
    fix: issue.suggestion || issue.fix || 'Consider refactoring',
    severity: issue.level || 'medium'
  })) || [],
  praise: data.positives?.[0] || data.praise || 'You showed up.'
});
```

---

# 8. TESTING CHECKLIST

## Before Deploying, Verify:

### RegexGPT Tests

```
VISUAL
──────────────────────────────────────────
[ ] Background is dark navy (#1a1a2e)
[ ] ASCII logo displays correctly
[ ] Cyan accent color throughout (#7eb8da)
[ ] Box characters align (┌─┐ not broken)
[ ] Blinking cursor works
[ ] Mobile layout looks good (< 768px)

FUNCTIONAL
──────────────────────────────────────────
[ ] Tab switching works (Generate/Explain)
[ ] Input accepts text
[ ] Generate button triggers loading state
[ ] API call succeeds
[ ] Results display in output box
[ ] Copy button copies text
[ ] Examples populate input when clicked
[ ] Pricing cards display
[ ] Stripe link opens payment page

CONSOLE
──────────────────────────────────────────
[ ] No JavaScript errors (F12 → Console)
[ ] No failed network requests (F12 → Network)
```

### PRoast Tests

```
VISUAL
──────────────────────────────────────────
[ ] Background is dark navy (#1a1a2e)
[ ] ASCII logo displays correctly
[ ] Coral accent color throughout (#eb6f92)
[ ] Severity selector shows 4 options
[ ] Mobile layout looks good

FUNCTIONAL
──────────────────────────────────────────
[ ] Severity selector changes selection
[ ] Code input accepts multiline text
[ ] Roast button triggers loading state
[ ] API call succeeds
[ ] Results show headline, sins, praise
[ ] Each sin has title, description, fix
[ ] Action buttons work
[ ] Pricing cards display
[ ] Stripe link works

CONSOLE
──────────────────────────────────────────
[ ] No JavaScript errors
[ ] No failed network requests
```

---

# 9. DEPLOY TO PRODUCTION

## Step 9.1: Push to GitHub

```bash
# For RegexGPT
cd ~/projects/regexgpt
git push origin retro-redesign

# For PRoast
cd ~/projects/proast
git push origin retro-redesign
```

## Step 9.2: Merge to Main

**Option A: Via GitHub (Recommended)**

1. Go to your repository on GitHub
2. Click "Pull requests" → "New pull request"
3. Set base: `main`, compare: `retro-redesign`
4. Click "Create pull request"
5. Review changes
6. Click "Merge pull request"

**Option B: Via Command Line**

```bash
git checkout main
git merge retro-redesign
git push origin main
```

## Step 9.3: Verify Deployment

Vercel will auto-deploy when main updates.

1. Go to your Vercel dashboard
2. Watch the deployment progress
3. Once complete, visit your live URL
4. Clear cache (Ctrl+Shift+R) and test

## Step 9.4: Post-Deploy Checklist

```
[ ] Live site loads correctly
[ ] API calls work in production
[ ] Stripe payment link works
[ ] Mobile version works
[ ] No console errors
```

---

# 10. ROLLBACK IF NEEDED

## Quick Rollback via Vercel

1. Go to Vercel Dashboard → Your Project
2. Click "Deployments"
3. Find the last working deployment
4. Click "..." → "Promote to Production"

## Rollback via Git

```bash
# Option 1: Revert last commit
git checkout main
git revert HEAD
git push origin main

# Option 2: Reset to backup branch
git checkout main
git reset --hard backup-before-redesign
git push origin main --force
```

## Restore Individual Files

```bash
# Restore just the page file
git checkout backup-before-redesign -- src/app/page.tsx
git commit -m "Rollback page to previous version"
git push origin main
```

---

# 11. TROUBLESHOOTING GUIDE

## Issue: Page Won't Load

**Check Console (F12):**
- Look for red error messages
- Common causes: syntax error, missing import

**Fix:**
```bash
# Compare with old file
diff src/app/page.tsx src/app/page.backup.tsx

# Restore and try again
cp src/app/page.backup.tsx src/app/page.tsx
```

---

## Issue: Box Characters Look Wrong

**Symptoms:** `┌─┐` displays as `???` or `â"Œâ"€â"?`

**Fix 1:** Ensure UTF-8 encoding
```html
<!-- In layout.tsx or HTML head -->
<meta charSet="utf-8" />
```

**Fix 2:** Check font supports box-drawing
- JetBrains Mono ✓
- Fira Code ✓
- Consolas ✓
- Arial ✗

---

## Issue: Colors Not Applying

**Fix 1:** Restart dev server
```bash
# Stop server (Ctrl+C)
rm -rf .next
npm run dev
```

**Fix 2:** Check tailwind.config.js was saved

**Fix 3:** Verify globals.css is imported in layout.tsx

---

## Issue: API Not Working

**Check Network Tab (F12 → Network):**
- Is the request being made?
- What status code? (200, 404, 500?)
- What's in the response?

**Fix:** Compare with your old page.tsx API call format

---

## Issue: Fonts Not Loading

**Symptoms:** Text appears in default sans-serif

**Fix 1:** Check layout.tsx has font import

**Fix 2:** Check className includes font variable:
```tsx
<html lang="en" className={jetbrainsMono.variable}>
```

**Fix 3:** Check globals.css has font-family set

---

## Issue: Build Fails on Vercel

**Check build logs for specific error**

**Common fixes:**
```bash
# Run build locally first
npm run build

# Fix any TypeScript errors shown
# Then push again
```

---

# QUICK REFERENCE

## File Changes Summary

```
BOTH PROJECTS:
├── tailwind.config.js      (add colors)
├── src/app/globals.css     (add styles)
├── src/app/layout.tsx      (add font)
└── src/app/page.tsx        (replace entirely)
```

## Color Reference

```
Background:     #1a1a2e
Card:           #16161a
Text Primary:   #e8e3e3
Text Secondary: #a8b2c3
Text Muted:     #6e6a86

Cyan:           #7eb8da   (RegexGPT)
Coral:          #eb6f92   (PRoast)
Mint:           #a8d8b9   (Success)
Lavender:       #c4a7e7   (Pro/Premium)
Rose:           #f2cdcd   (Cursor/Accent)
Cream:          #ffe9b0   (Warning)
Peach:          #f5a97f   (Brutal)
```

## Git Commands

```bash
# Create backup
git checkout -b backup-$(date +%Y%m%d)

# See changes
git diff

# Undo uncommitted changes
git checkout -- src/app/page.tsx

# Undo last commit
git revert HEAD
```

---

**You've got this! Follow the steps, test thoroughly, and keep your backups until everything works perfectly.**

```
════════════════════════════════════════════════════════════════

              HAPPY CODING! <3
              
════════════════════════════════════════════════════════════════
```
