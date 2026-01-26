'use client'

import { useState } from 'react'
import Link from 'next/link'

const colors = {
  bg: '#1a1a2e',
  bgLight: '#252542',
  text: '#e8e3e3',
  muted: '#6e6a86',
  coral: '#eb6f92',
  mint: '#a8d8b9',
  cream: '#ffe9b0',
  lavender: '#c4a7e7',
}

const sections = [
  { id: 'getting-started', label: '[>] Getting Started' },
  { id: 'roast-levels', label: '[~] Roast Levels' },
  { id: 'features', label: '[+] Features' },
  { id: 'github', label: '[/] GitHub Integration' },
  { id: 'api', label: '[#] API Reference' },
  { id: 'faq', label: '[?] FAQ' },
]

const Logo = () => (
  <div style={{
    color: colors.coral,
    border: `1px solid ${colors.coral}`,
    padding: '12px',
    textAlign: 'center' as const,
  }}>
    <div style={{
      fontSize: '24px',
      fontWeight: 'bold',
      letterSpacing: '4px',
      marginBottom: '8px',
    }}>
      PROAST
    </div>
    <div style={{
      fontSize: '10px',
      color: colors.muted,
      letterSpacing: '1px',
    }}>
      :) · :| · {'>'}:( · X_X
    </div>
  </div>
)

interface CodeBlockProps {
  children: React.ReactNode
  title?: string
}

const CodeBlock = ({ children, title }: CodeBlockProps) => (
  <div style={{
    background: colors.bg,
    border: `1px solid ${colors.muted}`,
    marginBottom: '16px',
  }}>
    {title && (
      <div style={{
        padding: '8px 12px',
        borderBottom: `1px solid ${colors.muted}`,
        color: colors.muted,
        fontSize: '12px',
      }}>
        {title}
      </div>
    )}
    <pre style={{
      margin: 0,
      padding: '12px',
      color: colors.coral,
      fontSize: '13px',
      lineHeight: '1.5',
      overflow: 'auto',
      whiteSpace: 'pre-wrap',
    }}>
      {children}
    </pre>
  </div>
)

interface RoastLevelBadgeProps {
  level: string
  icon: string
  color: string
}

const RoastLevelBadge = ({ level, icon, color }: RoastLevelBadgeProps) => (
  <span style={{
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 10px',
    background: colors.bgLight,
    border: `1px solid ${color}`,
    color: color,
    fontSize: '12px',
  }}>
    {icon} {level}
  </span>
)

export default function PRoastDocs() {
  const [activeSection, setActiveSection] = useState('getting-started')

  const renderContent = () => {
    switch (activeSection) {
      case 'getting-started':
        return (
          <div>
            <h2 style={{ color: colors.coral, marginTop: 0 }}>┌─ Getting Started ─┐</h2>

            <p style={{ color: colors.text, lineHeight: '1.7' }}>
              PRoast is a brutally honest AI code reviewer. Paste your code or connect
              a GitHub PR, select your pain tolerance, and receive feedback that
              actually helps you improve.
            </p>

            <h3 style={{ color: colors.mint }}>How It Works</h3>

            <div style={{
              background: colors.bgLight,
              border: `1px solid ${colors.muted}`,
              padding: '16px',
              marginBottom: '16px',
            }}>
              <div style={{ color: colors.text, marginBottom: '12px' }}>
                <span style={{ color: colors.coral }}>[1]</span> Paste code or enter a GitHub PR URL
              </div>
              <div style={{ color: colors.text, marginBottom: '12px' }}>
                <span style={{ color: colors.coral }}>[2]</span> Choose your roast level (Gentle to Savage)
              </div>
              <div style={{ color: colors.text, marginBottom: '12px' }}>
                <span style={{ color: colors.coral }}>[3]</span> Get detailed feedback with actual fixes
              </div>
              <div style={{ color: colors.text }}>
                <span style={{ color: colors.coral }}>[4]</span> Share your roast card on social media
              </div>
            </div>

            <h3 style={{ color: colors.mint }}>Quick Example</h3>

            <CodeBlock title="input: awful_code.js">
{`function getData(x) {
  var data = null;
  for (var i = 0; i < x.length; i++) {
    if (x[i] != null && x[i] != undefined) {
      data = x[i];
    }
  }
  return data;
}`}
            </CodeBlock>

            <CodeBlock title="output: brutal roast">
{`┌─────────────────────────────────────────────────────────┐
│  ROAST LEVEL: BRUTAL                           >:(      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  "Did you write this with your elbows?"                 │
│                                                         │
│  ISSUES DETECTED: 6                                     │
│                                                         │
│  [!] Using 'var' in 2024? Bold choice.                  │
│  [!] 'getData' tells me nothing. What data? From where? │
│  [!] This loop does ONE thing: return the last non-null │
│      value. Ever heard of Array.findLast()?             │
│  [!] Checking != null AND != undefined? Just use x[i]   │
│  [!] No types. No safety. Just vibes.                   │
│  [!] Single letter param 'x'? Very mysterious.          │
│                                                         │
└─────────────────────────────────────────────────────────┘

ACTUAL FIX:
const getLastValidItem = (items: unknown[]): unknown =>
  items.findLast(item => item != null);`}
            </CodeBlock>

            <h3 style={{ color: colors.mint }}>Supported Languages</h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '8px',
              marginBottom: '16px',
            }}>
              {['JavaScript', 'TypeScript', 'Python', 'Go', 'Rust', 'Java', 'C#', 'Ruby', 'PHP'].map(lang => (
                <div key={lang} style={{
                  background: colors.bgLight,
                  border: `1px solid ${colors.muted}`,
                  padding: '8px 12px',
                  color: colors.text,
                  fontSize: '13px',
                }}>
                  [+] {lang}
                </div>
              ))}
            </div>
          </div>
        )

      case 'roast-levels':
        return (
          <div>
            <h2 style={{ color: colors.coral, marginTop: 0 }}>┌─ Roast Levels ─┐</h2>

            <p style={{ color: colors.muted, marginBottom: '24px' }}>
              Choose your pain tolerance. Each level adjusts the tone while keeping feedback actionable.
            </p>

            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <RoastLevelBadge level="GENTLE" icon=":)" color={colors.mint} />
              </div>
              <p style={{ color: colors.text, lineHeight: '1.7', marginBottom: '8px' }}>
                Constructive and encouraging. Perfect for junior devs or when you need your ego intact.
              </p>
              <CodeBlock>
{`"This function could be improved with some refactoring.
Consider using more descriptive variable names to help
future maintainers understand the code better."`}
              </CodeBlock>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <RoastLevelBadge level="HONEST" icon=":|" color={colors.cream} />
              </div>
              <p style={{ color: colors.text, lineHeight: '1.7', marginBottom: '8px' }}>
                Direct and clear. No sugarcoating, but no unnecessary heat either.
              </p>
              <CodeBlock>
{`"This is a problem. The variable name 'x' communicates
nothing about what this function does. The loop is
inefficient and there's a built-in method for this."`}
              </CodeBlock>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <RoastLevelBadge level="BRUTAL" icon=">:(" color="#f5a97f" />
              </div>
              <p style={{ color: colors.text, lineHeight: '1.7', marginBottom: '8px' }}>
                Harsh but fair. You asked for it.
              </p>
              <CodeBlock>
{`"Did you write this during a power outage? This loop
is doing the job of a single built-in method. And 'var'
in 2024? What's next, jQuery?"`}
              </CodeBlock>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <RoastLevelBadge level="SAVAGE" icon="X_X" color={colors.coral} />
                <span style={{
                  color: colors.bgLight,
                  background: colors.lavender,
                  padding: '2px 8px',
                  fontSize: '11px',
                }}>PRO</span>
              </div>
              <p style={{ color: colors.text, lineHeight: '1.7', marginBottom: '8px' }}>
                Maximum devastation. Not for the faint of heart. Only available to Pro users who have proven they can handle it.
              </p>
              <CodeBlock>
{`"I've seen cleaner code in a ransomware sample. This
function is proof that Stack Overflow answers from 2009
should come with expiration dates. The only thing this
code is optimized for is job security through obscurity."`}
              </CodeBlock>
            </div>

            <div style={{
              background: colors.bgLight,
              border: `1px solid ${colors.coral}`,
              padding: '16px',
              marginTop: '24px',
            }}>
              <div style={{ color: colors.coral, marginBottom: '8px' }}>
                [!] Important Note
              </div>
              <div style={{ color: colors.text, lineHeight: '1.6' }}>
                Every roast, regardless of level, includes actionable fixes and explanations.
                The goal is to make you a better developer, not just to roast you.
              </div>
            </div>
          </div>
        )

      case 'features':
        return (
          <div>
            <h2 style={{ color: colors.coral, marginTop: 0 }}>┌─ Features ─┐</h2>

            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ color: colors.mint }}>[&gt;] Code Analysis</h3>
              <p style={{ color: colors.text, lineHeight: '1.7' }}>
                PRoast analyzes your code for:
              </p>
              <CodeBlock>
{`- Anti-patterns and code smells
- Security vulnerabilities
- Performance issues
- Naming conventions
- Modern syntax opportunities
- Type safety gaps
- Dead code and unused imports
- Complexity warnings`}
              </CodeBlock>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ color: colors.mint }}>[&gt;] Shareable Roast Cards</h3>
              <p style={{ color: colors.text, lineHeight: '1.7' }}>
                Generate beautiful roast summary cards to share on Twitter, LinkedIn,
                or your team Slack. Show the world your worst code and the lessons learned.
              </p>
              <div style={{
                background: colors.bgLight,
                border: `1px solid ${colors.muted}`,
                padding: '20px',
                marginTop: '12px',
                textAlign: 'center' as const,
              }}>
                <div style={{
                  border: `2px solid ${colors.coral}`,
                  padding: '16px',
                  display: 'inline-block',
                }}>
                  <div style={{ color: colors.coral, fontSize: '18px', marginBottom: '8px' }}>
                    CODE ROAST RESULTS
                  </div>
                  <div style={{ color: colors.muted, fontSize: '24px', marginBottom: '4px' }}>
                    SCORE: 23/100
                  </div>
                  <div style={{ color: colors.text, fontSize: '12px' }}>
                    &quot;Certified Dumpster Fire&quot;
                  </div>
                  <div style={{ color: colors.muted, fontSize: '10px', marginTop: '12px' }}>
                    proast.dev
                  </div>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ color: colors.mint }}>[&gt;] Actual Fixes</h3>
              <p style={{ color: colors.text, lineHeight: '1.7' }}>
                Every issue identified comes with a working fix. No vague suggestions -
                actual code you can copy and use.
              </p>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ color: colors.mint, display: 'flex', alignItems: 'center', gap: '8px' }}>
                [&gt;] Roast History
                <span style={{
                  color: colors.bgLight,
                  background: colors.lavender,
                  padding: '2px 8px',
                  fontSize: '11px',
                }}>PRO</span>
              </h3>
              <p style={{ color: colors.text, lineHeight: '1.7' }}>
                Track your improvement over time. See your roast scores trend upward
                (hopefully) as you become a better developer.
              </p>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ color: colors.mint, display: 'flex', alignItems: 'center', gap: '8px' }}>
                [&gt;] Team Leaderboard
                <span style={{
                  color: colors.bgLight,
                  background: colors.lavender,
                  padding: '2px 8px',
                  fontSize: '11px',
                }}>TEAM</span>
              </h3>
              <p style={{ color: colors.text, lineHeight: '1.7' }}>
                Compete with your team for the highest code quality scores.
                Or expose who writes the worst code. Your choice.
              </p>
            </div>
          </div>
        )

      case 'github':
        return (
          <div>
            <h2 style={{ color: colors.coral, marginTop: 0 }}>┌─ GitHub Integration ─┐</h2>

            <p style={{ color: colors.text, lineHeight: '1.7' }}>
              Connect PRoast directly to your GitHub pull requests for automated code reviews.
            </p>

            <h3 style={{ color: colors.mint }}>Connecting a PR</h3>

            <div style={{
              background: colors.bgLight,
              border: `1px solid ${colors.muted}`,
              padding: '16px',
              marginBottom: '16px',
            }}>
              <div style={{ color: colors.text, marginBottom: '12px' }}>
                <span style={{ color: colors.coral }}>[1]</span> Copy your GitHub PR URL
              </div>
              <CodeBlock>
{`https://github.com/username/repo/pull/123`}
              </CodeBlock>
              <div style={{ color: colors.text, marginBottom: '12px' }}>
                <span style={{ color: colors.coral }}>[2]</span> Paste into PRoast
              </div>
              <div style={{ color: colors.text, marginBottom: '12px' }}>
                <span style={{ color: colors.coral }}>[3]</span> Authorize GitHub access (first time only)
              </div>
              <div style={{ color: colors.text }}>
                <span style={{ color: colors.coral }}>[4]</span> Receive roast for all changed files
              </div>
            </div>

            <h3 style={{ color: colors.mint }}>What Gets Analyzed</h3>

            <CodeBlock>
{`- All added lines in the PR
- Modified functions/classes
- New file patterns
- Import changes
- Test coverage (if detectable)
- Commit message quality (bonus roast)`}
            </CodeBlock>

            <h3 style={{ color: colors.mint, display: 'flex', alignItems: 'center', gap: '8px' }}>
              GitHub App
              <span style={{
                color: colors.bgLight,
                background: colors.lavender,
                padding: '2px 8px',
                fontSize: '11px',
              }}>TEAM</span>
            </h3>

            <p style={{ color: colors.text, lineHeight: '1.7' }}>
              Install the PRoast GitHub App to automatically roast every PR in your repo:
            </p>

            <CodeBlock>
{`Features:
- Auto-comment on new PRs
- Configurable roast level per repo
- Block merge if score below threshold
- Weekly team roast digest`}
            </CodeBlock>

            <div style={{
              background: colors.bgLight,
              border: `1px solid ${colors.mint}`,
              padding: '16px',
              marginTop: '24px',
            }}>
              <div style={{ color: colors.mint, marginBottom: '8px' }}>
                [i] Privacy Note
              </div>
              <div style={{ color: colors.text, lineHeight: '1.6' }}>
                PRoast only accesses the specific PR you submit. We don&apos;t store your code
                after analysis. GitHub tokens are encrypted and can be revoked anytime.
              </div>
            </div>
          </div>
        )

      case 'api':
        return (
          <div>
            <h2 style={{ color: colors.coral, marginTop: 0 }}>┌─ API Reference ─┐</h2>

            <div style={{
              background: colors.bgLight,
              border: `1px solid ${colors.lavender}`,
              padding: '12px 16px',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}>
              <span style={{
                color: colors.bgLight,
                background: colors.lavender,
                padding: '2px 8px',
                fontSize: '11px',
              }}>PRO</span>
              <span style={{ color: colors.text }}>
                API access requires a Pro or Team subscription
              </span>
            </div>

            <h3 style={{ color: colors.mint }}>Authentication</h3>
            <CodeBlock title="header">
{`Authorization: Bearer YOUR_API_KEY`}
            </CodeBlock>

            <h3 style={{ color: colors.mint }}>Roast Code</h3>
            <CodeBlock title="POST /api/v1/roast">
{`Request:
{
  "code": "function getData(x) { ... }",
  "language": "javascript",
  "level": "brutal"  // gentle | honest | brutal | savage
}

Response:
{
  "success": true,
  "score": 23,
  "grade": "F",
  "tagline": "Certified Dumpster Fire",
  "issues": [
    {
      "line": 1,
      "severity": "error",
      "message": "Function name 'getData' is meaninglessly vague",
      "roast": "Did a random word generator name this?",
      "fix": "const getLastValidItem = (items) => ..."
    }
  ],
  "summary": "6 issues found. Your code has the structural integrity of a house of cards in a hurricane.",
  "card_url": "https://proast.dev/cards/abc123.png"
}`}
            </CodeBlock>

            <h3 style={{ color: colors.mint }}>Roast GitHub PR</h3>
            <CodeBlock title="POST /api/v1/roast/github">
{`Request:
{
  "pr_url": "https://github.com/user/repo/pull/123",
  "level": "honest"
}

Response:
{
  "success": true,
  "pr_title": "Add user authentication",
  "files_analyzed": 4,
  "total_score": 67,
  "files": [
    {
      "path": "src/auth.ts",
      "score": 45,
      "issues": [...]
    }
  ],
  "commit_message_roast": "At least the commit message was decent."
}`}
            </CodeBlock>

            <h3 style={{ color: colors.mint }}>Generate Roast Card</h3>
            <CodeBlock title="POST /api/v1/card">
{`Request:
{
  "roast_id": "abc123",
  "style": "dark",  // dark | light | neon
  "include_code": false
}

Response:
{
  "success": true,
  "card_url": "https://proast.dev/cards/abc123.png",
  "dimensions": { "width": 1200, "height": 630 }
}`}
            </CodeBlock>

            <h3 style={{ color: colors.mint }}>Rate Limits</h3>
            <div style={{
              background: colors.bgLight,
              border: `1px solid ${colors.muted}`,
              padding: '16px',
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
                color: colors.text,
              }}>
                <div>Free tier:</div>
                <div style={{ color: colors.muted }}>3 roasts/day</div>
                <div>Pro tier:</div>
                <div style={{ color: colors.lavender }}>100 roasts/day</div>
                <div>Team tier:</div>
                <div style={{ color: colors.mint }}>Unlimited</div>
              </div>
            </div>
          </div>
        )

      case 'faq':
        return (
          <div>
            <h2 style={{ color: colors.coral, marginTop: 0 }}>┌─ FAQ ─┐</h2>

            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ color: colors.mint }}>[?] Is the roasting actually helpful?</h3>
              <p style={{ color: colors.text, lineHeight: '1.7' }}>
                Yes. Every roast includes actionable fixes and explanations. The humor
                is just the delivery mechanism for real code review feedback that will
                make you a better developer.
              </p>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ color: colors.mint }}>[?] Why would I want my code roasted?</h3>
              <p style={{ color: colors.text, lineHeight: '1.7' }}>
                Traditional code review is dry and often ignored. PRoast makes feedback
                memorable. You&apos;ll remember &quot;this loop looks like it was written during
                a fever dream&quot; longer than &quot;consider optimizing this loop.&quot;
              </p>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ color: colors.mint }}>[?] Is my code stored?</h3>
              <p style={{ color: colors.text, lineHeight: '1.7' }}>
                Code is processed in memory and deleted immediately after analysis.
                We only store the roast results and metadata if you choose to save
                them to your history (Pro feature).
              </p>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ color: colors.mint }}>[?] Can I use PRoast for code I don&apos;t own?</h3>
              <p style={{ color: colors.text, lineHeight: '1.7' }}>
                You can roast any code you have legal access to. Please don&apos;t use
                PRoast to publicly shame other developers without their consent.
              </p>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ color: colors.mint }}>[?] How is the score calculated?</h3>
              <p style={{ color: colors.text, lineHeight: '1.7' }}>
                Scores are based on:
              </p>
              <CodeBlock>
{`- Code complexity (cyclomatic, cognitive)
- Modern syntax usage
- Naming quality
- Type safety
- Security patterns
- Performance considerations
- Test coverage (if detectable)`}
              </CodeBlock>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ color: colors.mint }}>[?] Can I disable the roasting and just get feedback?</h3>
              <p style={{ color: colors.text, lineHeight: '1.7' }}>
                Set roast level to &quot;Gentle&quot; for constructive, encouraging feedback
                without the burns. It&apos;s still honest, just nicer about it.
              </p>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ color: colors.mint }}>[?] How do I unlock Savage mode?</h3>
              <p style={{ color: colors.text, lineHeight: '1.7' }}>
                Savage mode is available to Pro subscribers. We gate it because
                it&apos;s genuinely harsh and we want to make sure you&apos;re ready for it.
              </p>
            </div>

            <div style={{
              background: colors.bgLight,
              border: `1px solid ${colors.muted}`,
              padding: '16px',
              marginTop: '32px',
            }}>
              <div style={{ color: colors.muted, marginBottom: '8px' }}>
                Still have questions?
              </div>
              <div style={{ color: colors.text }}>
                Contact us at{' '}
                <span style={{ color: colors.coral }}>support@proast.dev</span>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: colors.bg,
      fontFamily: "'JetBrains Mono', 'Fira Code', 'SF Mono', Consolas, monospace",
      color: colors.text,
    }}>
      {/* Header */}
      <header style={{
        borderBottom: `1px solid ${colors.muted}`,
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ color: colors.coral, fontSize: '18px' }}>PRoast</span>
          <span style={{ color: colors.muted }}>|</span>
          <span style={{ color: colors.muted }}>Documentation</span>
        </div>
        <nav style={{ display: 'flex', gap: '24px' }}>
          <Link href="/" style={{ color: colors.muted, textDecoration: 'none' }}>[~] Home</Link>
          <span style={{ color: colors.coral }}>[?] Docs</span>
          <Link href="/#pricing" style={{ color: colors.muted, textDecoration: 'none' }}>[$] Pricing</Link>
        </nav>
      </header>

      <div style={{ display: 'flex', position: 'relative' }}>
        {/* Sidebar */}
        <aside style={{
          width: '260px',
          minWidth: '260px',
          flexShrink: 0,
          borderRight: `1px solid ${colors.muted}`,
          padding: '24px',
          minHeight: 'calc(100vh - 60px)',
          overflow: 'hidden',
        }}>
          <Logo />

          <div style={{ marginTop: '32px' }}>
            <div style={{ color: colors.muted, fontSize: '12px', marginBottom: '16px' }}>
              DOCUMENTATION
            </div>

            {sections.map(section => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '10px 12px',
                  marginBottom: '4px',
                  background: activeSection === section.id ? colors.bgLight : 'transparent',
                  border: activeSection === section.id ? `1px solid ${colors.coral}` : '1px solid transparent',
                  color: activeSection === section.id ? colors.coral : colors.text,
                  textAlign: 'left' as const,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  fontSize: '14px',
                }}
              >
                {section.label}
              </button>
            ))}
          </div>

          <div style={{
            marginTop: '32px',
            padding: '16px',
            background: colors.bgLight,
            border: `1px solid ${colors.muted}`,
          }}>
            <div style={{ color: colors.coral, marginBottom: '8px', fontSize: '13px' }}>
              [!] Warning
            </div>
            <div style={{ color: colors.muted, fontSize: '12px', lineHeight: '1.5' }}>
              Savage mode has been known to cause existential crises in
              senior developers. Proceed with caution.
            </div>
          </div>
        </aside>

        {/* Main Content Wrapper */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', overflow: 'auto' }}>
          <main style={{
            width: '100%',
            maxWidth: '800px',
            padding: '32px 48px',
          }}>
            {renderContent()}
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        borderTop: `1px solid ${colors.muted}`,
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        color: colors.muted,
        fontSize: '12px',
      }}>
        <span>PRoast v1.0.0</span>
        <span>Your code is bad and we&apos;ll tell you why</span>
      </footer>
    </div>
  )
}
