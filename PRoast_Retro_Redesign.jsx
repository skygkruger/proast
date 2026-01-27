'use client';

import React, { useState, useEffect } from 'react';

// ═══════════════════════════════════════════════════════════════
//  PROAST - PASTEL RETRO TERMINAL REDESIGN
//  Primary Accent: Soft Coral (#eb6f92)
// ═══════════════════════════════════════════════════════════════

export default function PRoastRetro() {
  const [codeInput, setCodeInput] = useState('');
  const [roastResult, setRoastResult] = useState(null);
  const [severityLevel, setSeverityLevel] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);

  // Blinking cursor effect
  useEffect(() => {
    const interval = setInterval(() => setCursorVisible(v => !v), 530);
    return () => clearInterval(interval);
  }, []);

  const severityLevels = [
    { label: 'GENTLE', icon: ':)', bar: '░░░░', color: '#a8d8b9', desc: 'kind mentor' },
    { label: 'HONEST', icon: ':|', bar: '▒▒░░', color: '#ffe9b0', desc: 'straight shooter' },
    { label: 'BRUTAL', icon: '>:(', bar: '▓▓▒░', color: '#f5a97f', desc: 'no sugar coating' },
    { label: 'SAVAGE', icon: 'X_X', bar: '████', color: '#eb6f92', desc: 'gordon ramsay mode' },
  ];

  const handleRoast = async () => {
    if (!codeInput.trim()) return;
    setIsLoading(true);
    setRoastResult(null);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Example roast result (replace with actual API)
    setRoastResult({
      headline: 'YOUR CODE HAS 3 DEADLY SINS',
      rating: 2,
      sins: [
        {
          title: 'NAMING CATASTROPHE',
          description: 'Variable "x" tells me nothing. Are you hiding evidence?',
          fix: 'Rename to userAuthToken or something descriptive',
          severity: 'high'
        },
        {
          title: 'ERROR HANDLING? NEVER HEARD OF IT',
          description: 'Your try-catch catches everything and does nothing.',
          fix: 'Handle specific errors, log them, inform the user',
          severity: 'medium'
        },
        {
          title: 'FUNCTION IDENTITY CRISIS',
          description: 'This function has more responsibilities than a Swiss Army knife.',
          fix: 'Split into getUserData(), validateUser(), formatResponse()',
          severity: 'high'
        }
      ],
      praise: 'At least your indentation is consistent.'
    });
    setIsLoading(false);
  };

  return (
    <div 
      className="min-h-screen font-mono text-sm"
      style={{ 
        backgroundColor: '#1a1a2e',
        color: '#a8b2c3'
      }}
    >
      {/* ═══════════════════════════════════════════════════════ */}
      {/*                       HEADER                            */}
      {/* ═══════════════════════════════════════════════════════ */}
      
      <header className="border-b" style={{ borderColor: '#6e6a86' }}>
        <div className="max-w-4xl mx-auto px-4">
          <pre className="text-xs py-2" style={{ color: '#eb6f92' }}>
{`╔════════════════════════════════════════════════════════════════════════════════╗
║  PROAST                                      [DOCS]  [PRICING]  [GITHUB]  [@]  ║
╚════════════════════════════════════════════════════════════════════════════════╝`}
          </pre>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        
        {/* ═══════════════════════════════════════════════════════ */}
        {/*                     ASCII LOGO                          */}
        {/* ═══════════════════════════════════════════════════════ */}
        
        <div className="text-center" style={{ color: '#eb6f92' }}>
          <pre className="text-xs leading-tight inline-block">
{`
██████╗ ██████╗  ██████╗  █████╗ ███████╗████████╗
██╔══██╗██╔══██╗██╔═══██╗██╔══██╗██╔════╝╚══██╔══╝
██████╔╝██████╔╝██║   ██║███████║███████╗   ██║   
██╔═══╝ ██╔══██╗██║   ██║██╔══██║╚════██║   ██║   
██║     ██║  ██║╚██████╔╝██║  ██║███████║   ██║   
╚═╝     ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝   ╚═╝   
`}
          </pre>
          <p className="text-xs tracking-widest mt-2" style={{ color: '#f2cdcd' }}>
            ·:·:· CODE REVIEWER WITH ATTITUDE v1.0 ·:·:·
          </p>
        </div>

        {/* ═══════════════════════════════════════════════════════ */}
        {/*                      TAGLINE                            */}
        {/* ═══════════════════════════════════════════════════════ */}
        
        <div className="text-center space-y-2">
          <p style={{ color: '#e8e3e3' }}>
            Get your code roasted. Learn something. Share the shame.
          </p>
          <p className="text-xs" style={{ color: '#6e6a86' }}>
            // brutally honest feedback with adjustable savagery
          </p>
        </div>

        {/* ═══════════════════════════════════════════════════════ */}
        {/*                 SEVERITY SELECTOR                       */}
        {/* ═══════════════════════════════════════════════════════ */}
        
        <div style={{ color: '#e8e3e3' }}>
          <pre className="text-xs">
{`┌─────────────────────────────────────────────────────────────────────────────┐
│  SELECT ROAST INTENSITY                                                     │
├─────────────────────────────────────────────────────────────────────────────┤`}
          </pre>
          
          <div 
            className="px-4 py-3 border-l border-r space-y-2"
            style={{ borderColor: '#e8e3e3' }}
          >
            {severityLevels.map((sev, i) => (
              <button
                key={sev.label}
                onClick={() => setSeverityLevel(i)}
                className="w-full text-left flex items-center gap-4 py-2 transition-all hover:translate-x-1"
                style={{ 
                  color: severityLevel === i ? sev.color : '#6e6a86'
                }}
              >
                <span className="w-6">{severityLevel === i ? '[x]' : '[ ]'}</span>
                <span className="w-8 text-center">{sev.icon}</span>
                <span className="w-16">{sev.label}</span>
                <span style={{ color: sev.color }}>{sev.bar}</span>
                <span className="text-xs" style={{ color: '#6e6a86' }}>// {sev.desc}</span>
              </button>
            ))}
          </div>
          
          <pre className="text-xs">
{`├─────────────────────────────────────────────────────────────────────────────┤
│  CURRENT: ${severityLevels[severityLevel].icon} ${severityLevels[severityLevel].label.padEnd(64)}│
└─────────────────────────────────────────────────────────────────────────────┘`}
          </pre>
        </div>

        {/* ═══════════════════════════════════════════════════════ */}
        {/*                    CODE INPUT                           */}
        {/* ═══════════════════════════════════════════════════════ */}
        
        <div style={{ color: '#eb6f92' }}>
          <pre className="text-xs">
{`┌─────────────────────────────────────────────────────────────────────────────┐
│  PASTE YOUR CODE                                                    [-][x]  │
├─────────────────────────────────────────────────────────────────────────────┤`}
          </pre>
          
          <div 
            className="px-4 py-4 border-l border-r"
            style={{ borderColor: '#eb6f92' }}
          >
            <div className="flex items-start gap-2">
              <span style={{ color: '#f2cdcd' }}>{'>'}</span>
              <textarea
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value)}
                placeholder="paste your code here... we promise not to judge too harshly"
                rows={8}
                className="flex-1 bg-transparent outline-none resize-none font-mono text-xs"
                style={{ 
                  color: '#e8e3e3', 
                  caretColor: '#f2cdcd',
                  backgroundColor: '#16161a',
                  padding: '12px',
                  borderRadius: '2px'
                }}
              />
            </div>
          </div>
          
          <pre className="text-xs">
{`└─────────────────────────────────────────────────────────────────────────────┘`}
          </pre>
        </div>

        {/* ═══════════════════════════════════════════════════════ */}
        {/*                      BUTTONS                            */}
        {/* ═══════════════════════════════════════════════════════ */}
        
        <div className="flex flex-wrap gap-4 justify-center">
          {/* Primary Action */}
          <button 
            onClick={handleRoast}
            disabled={isLoading || !codeInput.trim()}
            className="transition-all hover:translate-y-px disabled:opacity-50"
            style={{ color: severityLevels[severityLevel].color }}
          >
            <pre className="text-xs leading-tight">
{isLoading 
  ? `╔═════════════════════════════╗
║  [~] ANALYZING SINS...      ║
╚═════════════════════════════╝`
  : `╔═════════════════════════════╗
║  [>] ROAST MY CODE          ║
╚═════════════════════════════╝`}
            </pre>
          </button>

          {/* Clear Button */}
          <button 
            onClick={() => { setCodeInput(''); setRoastResult(null); }}
            className="transition-all hover:translate-y-px"
            style={{ color: '#6e6a86' }}
          >
            <pre className="text-xs leading-tight">
{`┌─────────────────────────────┐
│  [x] CLEAR                  │
└─────────────────────────────┘`}
            </pre>
          </button>
        </div>

        {/* ═══════════════════════════════════════════════════════ */}
        {/*                   ROAST RESULT                          */}
        {/* ═══════════════════════════════════════════════════════ */}
        
        {(roastResult || isLoading) && (
          <div style={{ color: '#eb6f92' }}>
            <pre className="text-xs">
{`╔═════════════════════════════════════════════════════════════════════════════╗
║  ROAST RESULTS                                                              ║
╠═════════════════════════════════════════════════════════════════════════════╣`}
            </pre>
            
            <div 
              className="px-4 py-4 border-l-2 border-r-2 space-y-6"
              style={{ borderColor: '#eb6f92' }}
            >
              {isLoading ? (
                <div className="text-center py-8" style={{ color: '#ffe9b0' }}>
                  <pre className="text-xs">
{`
[~] Analyzing your code...
[~] Finding all the sins...
[~] Preparing brutal honesty...
`}
                  </pre>
                </div>
              ) : roastResult && (
                <>
                  {/* Headline */}
                  <div className="text-center" style={{ color: '#eb6f92' }}>
                    <pre className="text-sm font-bold">
{`>>> ${roastResult.headline} <<<`}
                    </pre>
                    <pre className="text-xs mt-2">
{`RATING: ${'X_X '.repeat(roastResult.rating)}${':| '.repeat(5 - roastResult.rating)}`}
                    </pre>
                  </div>

                  {/* Sins */}
                  <div className="space-y-4">
                    {roastResult.sins.map((sin, i) => (
                      <div key={i} style={{ color: sin.severity === 'high' ? '#eb6f92' : '#f5a97f' }}>
                        <pre className="text-xs">
{`┌─ [!] SIN #${i + 1}: ${sin.title} ${'─'.repeat(Math.max(0, 50 - sin.title.length))}┐`}
                        </pre>
                        <div 
                          className="px-4 py-2 border-l border-r text-xs"
                          style={{ borderColor: 'currentColor', color: '#e8e3e3' }}
                        >
                          <p className="mb-2">{sin.description}</p>
                          <p style={{ color: '#a8d8b9' }}>[/] FIX: {sin.fix}</p>
                        </div>
                        <pre className="text-xs">
{`└${'─'.repeat(72)}┘`}
                        </pre>
                      </div>
                    ))}
                  </div>

                  {/* Praise */}
                  <div style={{ color: '#a8d8b9' }}>
                    <pre className="text-xs">
{`┌─ [/] REDEMPTION ─────────────────────────────────────────────────────────────┐
│                                                                              │
│  ${roastResult.praise.padEnd(68)}  │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘`}
                    </pre>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-4 justify-center">
                    <button 
                      className="transition-all hover:translate-y-px"
                      style={{ color: '#f2cdcd' }}
                    >
                      <pre className="text-xs">[:] COPY ROAST</pre>
                    </button>
                    <button 
                      className="transition-all hover:translate-y-px"
                      style={{ color: '#7eb8da' }}
                    >
                      <pre className="text-xs">[^] SHARE CARD</pre>
                    </button>
                    <button 
                      className="transition-all hover:translate-y-px"
                      style={{ color: '#c4a7e7' }}
                    >
                      <pre className="text-xs">[+] SAVE TO HISTORY</pre>
                    </button>
                  </div>
                </>
              )}
            </div>
            
            <pre className="text-xs">
{`╠═════════════════════════════════════════════════════════════════════════════╣
║  STATUS: ${isLoading ? '(~) ROASTING IN PROGRESS' : '(o) ROAST COMPLETE     '}                                          ║
╚═════════════════════════════════════════════════════════════════════════════╝`}
            </pre>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════ */}
        {/*                 SEVERITY EXAMPLES                       */}
        {/* ═══════════════════════════════════════════════════════ */}
        
        <div className="space-y-3">
          <p className="text-xs" style={{ color: '#6e6a86' }}>// SEVERITY EXAMPLES</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { level: ':) GENTLE', text: '"This variable name could be more descriptive for better readability."', color: '#a8d8b9' },
              { level: ':| HONEST', text: '"Naming a variable x in a 200-line function is a code smell."', color: '#ffe9b0' },
              { level: '>:( BRUTAL', text: '"Your variable naming suggests you are trying to hide evidence."', color: '#f5a97f' },
              { level: 'X_X SAVAGE', text: '"I have seen better naming conventions in minified JavaScript."', color: '#eb6f92' },
            ].map((example, i) => (
              <div key={i} style={{ color: example.color }}>
                <pre className="text-xs leading-tight">
{`┌─ ${example.level} ${'─'.repeat(24)}┐
│                                    │
│  "${example.text.slice(0, 32)}${example.text.length > 32 ? '...' : ''}"
│                                    │
└────────────────────────────────────┘`}
                </pre>
              </div>
            ))}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════ */}
        {/*                    FEATURES                             */}
        {/* ═══════════════════════════════════════════════════════ */}
        
        <div className="space-y-3">
          <p className="text-xs" style={{ color: '#6e6a86' }}>// FEATURES</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div style={{ color: '#eb6f92' }}>
              <pre className="text-xs leading-tight">
{`┌───────────────────────────┐
│                           │
│    X_X SAVAGE MODE        │
│                           │
│  Gordon Ramsay-level      │
│  feedback for devs who    │
│  can handle the truth.    │
│                           │
└───────────────────────────┘`}
              </pre>
            </div>
            
            <div style={{ color: '#a8d8b9' }}>
              <pre className="text-xs leading-tight">
{`┌───────────────────────────┐
│                           │
│    [/] REAL FIXES         │
│                           │
│  Every roast includes     │
│  actionable suggestions   │
│  to actually fix it.      │
│                           │
└───────────────────────────┘`}
              </pre>
            </div>
            
            <div style={{ color: '#7eb8da' }}>
              <pre className="text-xs leading-tight">
{`┌───────────────────────────┐
│                           │
│    [^] SHARE CARDS        │
│                           │
│  Generate shareable       │
│  roast cards. Bond with   │
│  devs through shame.      │
│                           │
└───────────────────────────┘`}
              </pre>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════ */}
        {/*                    PRICING                              */}
        {/* ═══════════════════════════════════════════════════════ */}
        
        <div className="space-y-3">
          <p className="text-xs" style={{ color: '#6e6a86' }}>// PRICING</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* Free Tier */}
            <div style={{ color: '#a8b2c3' }}>
              <pre className="text-xs leading-tight">
{`┌─────────────────────────────────┐
│                                 │
│      ┌─────┐                    │
│      │  F  │   FREE             │
│      └─────┘                    │
│                                 │
│      $0/forever                 │
│                                 │
│      [/] 3 roasts/day           │
│      [/] Gentle -> Brutal       │
│      [/] Basic feedback         │
│      [x] Savage mode            │
│      [x] Share cards            │
│                                 │
│     ┌─────────────────────┐     │
│     │   CURRENT PLAN      │     │
│     └─────────────────────┘     │
│                                 │
└─────────────────────────────────┘`}
              </pre>
            </div>
            
            {/* Pro Tier */}
            <div style={{ color: '#eb6f92' }}>
              <pre className="text-xs leading-tight">
{`╔═════════════════════════════════╗
║   * * * NO MERCY MODE * * *     ║
║                                 ║
║      ╔═════╗                    ║
║      ║ X_X ║   PRO              ║
║      ╚═════╝                    ║
║                                 ║
║      $12/month                  ║
║                                 ║
║      [/] Unlimited roasts       ║
║      [/] All severity levels    ║
║      [/] SAVAGE mode unlocked   ║
║      [/] Shareable roast cards  ║
║      [/] Roast history          ║
║                                 ║
║     ╔═════════════════════╗     ║
║     ║  [>] GET ROASTED    ║     ║
║     ╚═════════════════════╝     ║
║                                 ║
╚═════════════════════════════════╝`}
              </pre>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════ */}
        {/*                  SOCIAL PROOF                           */}
        {/* ═══════════════════════════════════════════════════════ */}
        
        <div className="space-y-3">
          <p className="text-xs" style={{ color: '#6e6a86' }}>// DEVELOPER TRAUMA</p>
          
          <div style={{ color: '#a8b2c3' }}>
            <pre className="text-xs leading-tight">
{`┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  "PRoast said my error handling strategy was 'hope for the best'.           │
│   It wasn't wrong."                                           - @dev_anon   │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  "I showed my coworkers my Savage mode results.                             │
│   Now they're all trying to get worse scores than me."     - reddit user    │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  "The roast was brutal but the fixes were actually helpful.                 │
│   10/10 would get destroyed again."                      - HN commenter     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘`}
            </pre>
          </div>
        </div>

      </main>

      {/* ═══════════════════════════════════════════════════════ */}
      {/*                      FOOTER                             */}
      {/* ═══════════════════════════════════════════════════════ */}
      
      <footer className="border-t mt-16" style={{ borderColor: '#6e6a86' }}>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <pre className="text-xs text-center" style={{ color: '#6e6a86' }}>
{`
════════════════════════════════════════════════════════════════════════════════

                        ROASTED WITH <3 IN THE TERMINAL

                                (c) 2025 PROAST
                         
              [HOME]  [DOCS]  [PRICING]  [GITHUB]  [TWITTER]  [CONTACT]

════════════════════════════════════════════════════════════════════════════════
`}
          </pre>
        </div>
      </footer>
    </div>
  );
}
