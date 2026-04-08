function UseCasesScene(props) {
  var f = props.frame || 0;
  var W = props.layerSize.width;
  var H = props.layerSize.height;
  var e = React.createElement;

  // ===== EASING =====
  function eo3(t) { return 1 - Math.pow(1-t, 3); }
  function eob(t) { var c = 2.2; return Math.min(1 + ((c+1)*Math.pow(t-1,3) + c*Math.pow(t-1,2)), 1.12); }
  function cl(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function p(s, n) { return cl((f-s)/(n-s), 0, 1); }
  function lerp(a, b, t) { return a + (b-a)*t; }
  function hash(i) { return (((i * 2654435761) >>> 0) % 10000) / 10000; }

  // ===== COLORS =====
  var C_PRI = '#1c64f2';
  var C_G100 = '#f3f4f6';
  var C_G200 = '#e5e7eb';
  var C_G300 = '#d1d5db';
  var C_G400 = '#9ca3af';
  var C_G500 = '#6b7280';
  var C_G600 = '#4b5563';
  var C_G900 = '#111827';
  var C_BG = '#EAECF1';
  var C_GR1 = '#984ad7';
  var C_GR2 = '#465ce0';
  var C_GR3 = '#0497dc';

  // CRM brand colors
  var C_ZENDESK = '#FF6600';
  var C_HUBSPOT = '#FF7A59';
  var C_LIVEAGENT = '#48BE02';

  // ===== SVG HELPER =====
  function svg(w, h, vb, ch) {
    return e('svg', { width: w, height: h, viewBox: vb, fill: 'none', xmlns: 'http://www.w3.org/2000/svg' }, ch);
  }

  // ===== COMPRESSED TIMELINE =====
  // Intro:     0-40
  // Section A: 40-400  (SEO & Marketing)
  // Section B: 380-720 (Customer Support)
  // Section C: 700-950 (E-commerce)
  // Closing:   950-1050

  // ===== SECTION VISIBILITY (20-frame cross-fades) =====
  var secAop = 0;
  if (f >= 40 && f < 400) {
    if (f < 60) secAop = eo3(p(40, 60));
    else if (f < 380) secAop = 1;
    else secAop = 1 - eo3(p(380, 400));
  }

  var secBop = 0;
  if (f >= 380 && f < 720) {
    if (f < 400) secBop = eo3(p(380, 400));
    else if (f < 700) secBop = 1;
    else secBop = 1 - eo3(p(700, 720));
  }

  var secCop = 0;
  if (f >= 700 && f < 950) {
    if (f < 720) secCop = eo3(p(700, 720));
    else if (f < 930) secCop = 1;
    else secCop = 1 - eo3(p(930, 950));
  }

  var closingOp = 0;
  if (f >= 950) {
    closingOp = f < 975 ? eo3(p(950, 975)) : 1;
  }

  // ===== MICRO-ANIMATION HELPERS =====
  // Gentle sine float for "alive" feeling (returns px offset)
  function float(seed, amp, speed) {
    return Math.sin(f * (speed || 0.04) + (seed || 0) * 6.28) * (amp || 3);
  }
  // Breathing glow factor 0..1
  function breathe(seed, speed) {
    return 0.5 + 0.5 * Math.sin(f * (speed || 0.06) + (seed || 0) * 6.28);
  }

  // ===== ANIMATED NUMBER =====
  function animNum(target, startF, durF) {
    if (f < startF) return '0';
    var t = cl((f - startF) / durF, 0, 1);
    var val = Math.round(target * eo3(t));
    var s = val.toString();
    var result = '';
    var count = 0;
    for (var i = s.length - 1; i >= 0; i--) {
      if (count > 0 && count % 3 === 0) result = ',' + result;
      result = s[i] + result;
      count++;
    }
    return result;
  }

  // ===== BACKGROUND WITH DOT GRID =====
  function background() {
    return e('div', { key: 'bg', style: {
      position: 'absolute', top: 0, left: 0, width: W, height: H,
      background: C_BG
    }},
      e('div', { style: {
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(circle, ' + C_G300 + ' 1px, transparent 1px)',
        backgroundSize: '24px 24px', opacity: 0.5
      }})
    );
  }

  // ===== INTRO BADGE (f 0-40) =====
  function introBadge() {
    var op = 0;
    if (f < 40) {
      if (f < 8) op = eo3(p(0, 8));
      else if (f < 28) op = 1;
      else op = 1 - eo3(p(28, 40));
    }
    if (op <= 0) return null;

    var badgeShP = -((f * 4) % 300);

    return e('div', { key: 'intro', style: {
      position: 'absolute', top: 0, left: 0, width: W, height: H,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(8,8,24,' + (0.6 * op) + ')',
      zIndex: 40
    }},
      e('div', { style: {
        opacity: op,
        transform: 'translateY(' + ((1 - eob(op)) * 30) + 'px) scale(' + eob(op) + ')'
      }},
        e('div', { style: {
          background: 'linear-gradient(135deg, ' + C_GR1 + ', ' + C_GR2 + ', ' + C_GR3 + ')',
          color: '#fff', padding: '16px 48px', borderRadius: 14,
          fontSize: 28, fontWeight: 700, letterSpacing: '0.3px',
          boxShadow: '0 8px 40px rgba(70,92,224,0.4)',
          textAlign: 'center'
        }},
          e('span', { style: {
            background: 'linear-gradient(90deg, #fff, rgba(255,255,255,0.6), #fff, rgba(255,255,255,0.6), #fff)',
            backgroundSize: '300% 100%',
            backgroundPosition: badgeShP + '% 0',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}, 'FlowHunt v2.0 \u2014 Real Results')
        )
      )
    );
  }

  // ===== SUB-BADGE HELPER =====
  function subBadge(text, startF, endF, extra) {
    var op = 0;
    if (f >= startF && f < endF) {
      var fadeIn = startF + 10;
      var fadeOut = endF - 10;
      if (f < fadeIn) op = eo3(p(startF, fadeIn));
      else if (f < fadeOut) op = 1;
      else op = 1 - eo3(p(fadeOut, endF));
    }
    if (op <= 0) return null;
    var shP = -((f * 4) % 300);
    var s = {
      position: 'absolute', left: '50%', top: 30,
      transform: 'translateX(-50%) translateY(' + ((1 - eob(op)) * 15) + 'px) scale(' + eob(op) + ')',
      opacity: op,
      background: 'linear-gradient(135deg, ' + C_GR1 + ', ' + C_GR2 + ')',
      color: '#fff', padding: '10px 28px', borderRadius: 10,
      fontSize: 16, fontWeight: 600, zIndex: 35,
      letterSpacing: '0.2px', whiteSpace: 'nowrap',
      boxShadow: '0 4px 20px rgba(70,92,224,0.3)'
    };
    if (extra) { for (var k in extra) { s[k] = extra[k]; } }
    return e('div', { key: 'sb-' + text.substring(0, 10), style: s },
      e('span', { style: {
        background: 'linear-gradient(90deg, #fff, rgba(255,255,255,0.6), #fff)',
        backgroundSize: '300% 100%',
        backgroundPosition: shP + '% 0',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}, text)
    );
  }

  // ===== PULSE RINGS HELPER =====
  function pulseRings(cx, cy, startF, color, count, stagger, maxR) {
    var children = [];
    if (f < startF) return children;
    count = count || 3;
    stagger = stagger || 15;
    maxR = maxR || 60;
    for (var r = 0; r < count; r++) {
      var rStart = startF + r * stagger;
      if (f < rStart) continue;
      var rPhase = ((f - rStart) % (stagger * count + 30));
      var rScale = 0.3 + (rPhase / (stagger * count + 30)) * 1.2;
      var rAlpha = (1 - rPhase / (stagger * count + 30)) * 0.25;
      if (rAlpha > 0.01) {
        children.push(e('div', { key: 'pr' + cx + '-' + r, style: {
          position: 'absolute',
          left: cx - maxR * rScale,
          top: cy - maxR * 0.5 * rScale,
          width: maxR * 2 * rScale,
          height: maxR * rScale,
          borderRadius: '50%',
          border: '2px solid ' + color,
          opacity: rAlpha,
          pointerEvents: 'none',
          zIndex: 8
        }}));
      }
    }
    return children;
  }

  // ===== SCANNING LINE =====
  function scanningLine() {
    if (f < 80 || f > 300) return null;
    var sO = 1;
    if (f < 95) sO = eo3(p(80, 95));
    else if (f > 285) sO = 1 - eo3(p(285, 300));
    var lineY = ((f - 80) * 4) % H;
    return e('div', { key: 'scanline', style: {
      position: 'absolute',
      left: 0, top: lineY, width: W, height: 2,
      background: 'linear-gradient(90deg, transparent, ' + C_GR2 + '40, ' + C_GR2 + '80, ' + C_GR2 + '40, transparent)',
      opacity: sO * 0.5,
      pointerEvents: 'none',
      zIndex: 30
    }});
  }

  // =========================================================
  //  SECTION A: SEO & MARKETING AUTOMATION (f 40-400)
  // =========================================================
  function sectionA() {
    if (secAop <= 0) return null;

    var children = [];
    var PAD = 60;
    // Two-column layout filling the screen
    var COL_GAP = 50;
    var LEFT_W = 640;
    var RIGHT_X = PAD + LEFT_W + COL_GAP;
    var RIGHT_W = W - RIGHT_X - PAD;

    // --- Section title ---
    var titleOp = f >= 50 ? (f < 62 ? eo3(p(50, 62)) : 1) : 0;
    if (titleOp > 0) {
      children.push(e('div', { key: 'sec-title', style: {
        position: 'absolute', left: PAD, top: 90,
        opacity: titleOp * secAop,
        transform: 'translateY(' + ((1 - eob(titleOp)) * 15) + 'px)',
        zIndex: 6
      }},
        e('div', { style: { fontSize: 14, fontWeight: 600, color: C_GR2, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 8 } }, 'Automated Pipeline'),
        e('div', { style: { fontSize: 28, fontWeight: 800, color: C_G900, letterSpacing: '-0.5px' } }, 'SEO & Marketing Workflow')
      ));
    }

    // --- Workflow Pipeline Steps ---
    var steps = [
      { label: 'Site Audit', desc: 'Crawl & analyze page structure', color: '#10b981', activateF: 70 },
      { label: 'Keyword Research', desc: 'Discover high-value keywords', color: C_PRI, activateF: 115 },
      { label: 'Content Generation', desc: 'AI-powered article drafts', color: C_GR1, activateF: 160 },
      { label: 'Meta Optimization', desc: 'Titles, descriptions & tags', color: '#f59e0b', activateF: 205 }
    ];

    var STEP_Y_START = 180;
    var STEP_H = 88;
    var STEP_GAP = 20;
    var STEP_W = LEFT_W;

    for (var i = 0; i < steps.length; i++) {
      var step = steps[i];
      var sy = STEP_Y_START + i * (STEP_H + STEP_GAP);

      var cardOp = 0;
      var cardScale = 0;
      if (f >= step.activateF - 8) {
        var cT = p(step.activateF - 8, step.activateF + 4);
        cardOp = eo3(cT);
        cardScale = eob(cT);
      }

      var progFill = 0;
      if (f >= step.activateF) {
        progFill = eo3(p(step.activateF, step.activateF + 30));
      }

      var dotColor = progFill >= 1 ? step.color : C_G300;

      if (cardOp > 0) {
        var stepFloat = progFill >= 1 ? float(i, 2, 0.05) : 0;
        var stepGlow = progFill >= 1 ? breathe(i, 0.07) : 0;
        var stepShadow = progFill >= 1
          ? '0 4px ' + (14 + stepGlow * 8) + 'px ' + step.color + (Math.round(15 + stepGlow * 20)).toString(16)
          : '0 2px 12px rgba(0,0,0,0.06)';
        children.push(e('div', { key: 'step-' + i, style: {
          position: 'absolute',
          left: PAD, top: sy + stepFloat, width: STEP_W, height: STEP_H,
          borderRadius: 14, background: '#fff',
          borderLeft: '5px solid ' + step.color,
          boxShadow: stepShadow,
          opacity: cardOp * secAop,
          transform: 'scale(' + cardScale + ')',
          transformOrigin: 'left center',
          display: 'flex', alignItems: 'center',
          padding: '0 24px', boxSizing: 'border-box', zIndex: 5
        }},
          // Step number / icon circle
          e('div', { style: {
            width: 44, height: 44, borderRadius: 22,
            background: dotColor,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, marginRight: 20,
            boxShadow: progFill >= 1 ? '0 0 ' + (8 + stepGlow * 6) + 'px ' + step.color + '40' : 'none'
          }},
            progFill >= 1 ?
              svg(20, 20, '0 0 24 24', [
                e('path', { key: 'ck', d: 'M5 12l5 5L19 7', stroke: '#fff', strokeWidth: '2.5', strokeLinecap: 'round', strokeLinejoin: 'round' })
              ]) :
              e('span', { style: { fontSize: 16, fontWeight: 700, color: '#fff' } }, '' + (i + 1))
          ),
          // Label, description, progress
          e('div', { style: { flex: 1 } },
            e('div', { style: { fontSize: 17, fontWeight: 700, color: C_G900, marginBottom: 4 } }, step.label),
            e('div', { style: { fontSize: 12, color: C_G500, marginBottom: 8 } }, step.desc),
            e('div', { style: { height: 6, borderRadius: 3, background: C_G200, overflow: 'hidden', position: 'relative' }},
              e('div', { style: {
                height: '100%', borderRadius: 3,
                width: (progFill * 100) + '%',
                background: 'linear-gradient(90deg, ' + step.color + '80, ' + step.color + ')',
                position: 'relative', overflow: 'hidden'
              }},
                progFill > 0.1 ? e('div', { style: {
                  position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.5) 50%, transparent 100%)',
                  backgroundSize: '200% 100%',
                  backgroundPosition: (-((f * 3) % 200)) + '% 0'
                }}) : null
              )
            )
          ),
          // Percentage label on the right
          e('div', { style: {
            marginLeft: 16, fontSize: 18, fontWeight: 700,
            color: progFill >= 1 ? step.color : C_G400,
            minWidth: 48, textAlign: 'right'
          } }, Math.round(progFill * 100) + '%')
        ));

        // Pulse rings on completed steps
        if (progFill >= 1) {
          var rings = pulseRings(PAD + 42, sy + STEP_H / 2, step.activateF + 30, step.color, 3, 15, 40);
          for (var ri = 0; ri < rings.length; ri++) {
            children.push(rings[ri]);
          }
        }
      }

      // Connection lines
      if (i < steps.length - 1 && cardOp > 0) {
        var nextActivateF = steps[i + 1].activateF;
        var lineP = f >= step.activateF + 10 ? eo3(p(step.activateF + 10, nextActivateF - 5)) : 0;
        if (lineP > 0) {
          var lineTop = sy + STEP_H;
          children.push(e('div', { key: 'conn-' + i, style: {
            position: 'absolute',
            left: PAD + 21, top: lineTop, width: 3, height: STEP_GAP * lineP,
            background: 'linear-gradient(to bottom, ' + step.color + ', ' + steps[i+1].color + ')',
            borderRadius: 2, opacity: secAop, zIndex: 4
          }}));
        }
      }
    }

    // --- Sparkle particles ---
    if (f >= 70 && f < 260) {
      var pO = f < 80 ? eo3(p(70, 80)) : f < 245 ? 1 : 1 - eo3(p(245, 260));
      var pColors = [C_GR1, C_GR2, C_GR3, '#10b981', C_PRI, '#f59e0b'];
      for (var pi = 0; pi < 16; pi++) {
        var seed = hash(pi + 100);
        var speed = 0.5 + seed * 1.2;
        var xOff = PAD + 30 + hash(pi + 200) * STEP_W;
        var phase = ((f - 70) * speed + seed * 180) % 100;
        var yOff = -phase * 2.5;
        var fadeIn = Math.min(phase / 10, 1);
        var fadeOut = Math.max(0, 1 - (phase - 60) / 40);
        var alpha = fadeIn * fadeOut * pO * secAop;
        var size = 2 + seed * 5;
        var pColor = pColors[pi % pColors.length];
        var wobble = Math.sin(phase * 0.18 + seed * 6.28) * 18;
        if (alpha > 0.01) {
          children.push(e('div', { key: 'sp' + pi, style: {
            position: 'absolute',
            left: xOff + wobble - size / 2,
            top: STEP_Y_START + 220 + yOff,
            width: size, height: size, borderRadius: '50%',
            background: pColor, opacity: alpha * 0.7,
            boxShadow: '0 0 ' + (size * 2) + 'px ' + pColor + '60', zIndex: 9
          }}));
        }
      }
    }

    // --- Right column: 2x2 Stat Cards Grid + Results Panel ---
    var stats = [
      { label: 'Pages Analyzed', value: 847, suffix: '', appearF: 100, color: '#10b981', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
      { label: 'Keywords Found', value: 2340, suffix: '', appearF: 130, color: C_PRI, icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
      { label: 'Content Pieces', value: 156, suffix: '', appearF: 170, color: C_GR1, icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
      { label: 'Rankings Improved', value: 89, suffix: '%', appearF: 210, color: '#f59e0b', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' }
    ];

    var STAT_COLS = 2;
    var STAT_GAP_X = 24;
    var STAT_GAP_Y = 24;
    var STAT_W = Math.floor((RIGHT_W - STAT_GAP_X) / STAT_COLS);
    var STAT_H = 140;
    var STAT_Y_START = 180;

    for (var j = 0; j < stats.length; j++) {
      var stat = stats[j];
      var sCol = j % STAT_COLS;
      var sRow = Math.floor(j / STAT_COLS);
      var sx = RIGHT_X + sCol * (STAT_W + STAT_GAP_X);
      var statY = STAT_Y_START + sRow * (STAT_H + STAT_GAP_Y);

      var statOp = 0;
      var statScale = 0;
      if (f >= stat.appearF) {
        statOp = f < stat.appearF + 12 ? eo3(p(stat.appearF, stat.appearF + 12)) : 1;
        statScale = f < stat.appearF + 12 ? eob(p(stat.appearF, stat.appearF + 12)) : 1;
      }

      if (statOp > 0) {
        var numStr = animNum(stat.value, stat.appearF, 25);
        var shP = -((f * 4) % 300);
        var statDone = f >= stat.appearF + 25;
        var statFloat = statDone ? float(j + 10, 2.5, 0.04) : 0;
        var statBreathe = statDone ? breathe(j + 10, 0.06) : 0;
        var statShadow = statDone
          ? '0 ' + (4 + statBreathe * 4) + 'px ' + (16 + statBreathe * 12) + 'px ' + stat.color + (Math.round(12 + statBreathe * 18)).toString(16)
          : '0 4px 16px rgba(0,0,0,0.06)';
        children.push(e('div', { key: 'stat-' + j, style: {
          position: 'absolute',
          left: sx, top: statY + statFloat, width: STAT_W, height: STAT_H,
          borderRadius: 16, background: '#fff',
          boxShadow: statShadow,
          opacity: statOp * secAop,
          transform: 'scale(' + statScale + ')',
          transformOrigin: 'center center',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', zIndex: 5,
          padding: '16px', boxSizing: 'border-box'
        }},
          // Icon circle at top
          e('div', { style: {
            width: 36, height: 36, borderRadius: 18,
            background: stat.color + '18',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 10
          }},
            svg(18, 18, '0 0 24 24', [
              e('path', { key: 'ic', d: stat.icon, stroke: stat.color, strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' })
            ])
          ),
          // Animated number with shimmer
          e('div', { style: {
            fontSize: 36, fontWeight: 800,
            letterSpacing: '-0.5px', lineHeight: '1.1',
            background: 'linear-gradient(90deg, ' + stat.color + ', #fff, ' + stat.color + ')',
            backgroundSize: '300% 100%',
            backgroundPosition: shP + '% 0',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          } }, numStr + stat.suffix),
          e('div', { style: {
            fontSize: 13, fontWeight: 500, color: C_G500, marginTop: 6
          } }, stat.label)
        ));
      }
    }

    // --- Results summary panel (bottom right, fills remaining space) ---
    var RESULTS_Y = STAT_Y_START + 2 * (STAT_H + STAT_GAP_Y) + 10;
    var resultsOp = f >= 240 ? (f < 255 ? eo3(p(240, 255)) : 1) : 0;
    if (resultsOp > 0) {
      var resBreathe = resultsOp >= 1 ? breathe(45, 0.05) : 0;
      var resFloat = resultsOp >= 1 ? float(45, 2, 0.035) : 0;
      var resultItems = [
        { label: 'Avg. Load Time', val: '1.2s', delta: '-48%', good: true },
        { label: 'Keyword Density', val: '2.8%', delta: 'Optimal', good: true },
        { label: 'Meta Coverage', val: '94%', delta: '+31%', good: true },
        { label: 'Content Score', val: 'A+', delta: 'Top 5%', good: true }
      ];
      children.push(e('div', { key: 'results-panel', style: {
        position: 'absolute',
        left: RIGHT_X, top: RESULTS_Y + resFloat,
        width: RIGHT_W, height: H - RESULTS_Y - 80,
        borderRadius: 16, background: '#fff',
        boxShadow: '0 ' + (4 + resBreathe * 4) + 'px ' + (20 + resBreathe * 10) + 'px rgba(0,0,0,' + (0.06 + resBreathe * 0.04) + ')',
        opacity: resultsOp * secAop,
        transform: 'scale(' + (f < 255 ? eob(p(240, 255)) : 1) + ')',
        padding: '20px 28px', boxSizing: 'border-box',
        display: 'flex', flexDirection: 'column', zIndex: 5
      }},
        e('div', { style: { fontSize: 15, fontWeight: 700, color: C_G900, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 } },
          svg(18, 18, '0 0 24 24', [
            e('path', { key: 'ch', d: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
              stroke: C_GR2, strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' })
          ]),
          e('span', null, 'Optimization Results')
        ),
        e('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 12, flex: 1 } },
          resultItems.map(function(item, ri) {
            var riOp = f >= 260 + ri * 12 ? (f < 270 + ri * 12 ? eo3(p(260 + ri * 12, 270 + ri * 12)) : 1) : 0;
            return riOp > 0 ? e('div', { key: 'ri-' + ri, style: {
              flex: '1 1 45%', minWidth: 160,
              padding: '14px 16px', borderRadius: 12,
              background: C_G100,
              opacity: riOp,
              transform: 'translateY(' + ((1 - eob(riOp)) * 10) + 'px)',
              display: 'flex', flexDirection: 'column', gap: 4
            }},
              e('div', { style: { fontSize: 11, fontWeight: 600, color: C_G500, textTransform: 'uppercase', letterSpacing: '0.5px' } }, item.label),
              e('div', { style: { display: 'flex', alignItems: 'baseline', gap: 8 } },
                e('span', { style: { fontSize: 22, fontWeight: 800, color: C_G900 } }, item.val),
                e('span', { style: { fontSize: 12, fontWeight: 600, color: '#10b981' } }, item.delta)
              )
            ) : null;
          })
        )
      ));
    }

    // --- Campaign Complete Banner (full width at bottom) ---
    var bannerOp = 0;
    var bannerY = 0;
    if (f >= 300 && f < 380) {
      bannerOp = f < 315 ? eo3(p(300, 315)) : 1;
      bannerY = f < 315 ? lerp(40, 0, eob(p(300, 315))) : 0;
    }
    if (bannerOp > 0) {
      children.push(e('div', { key: 'banner', style: {
        position: 'absolute',
        left: PAD, bottom: 30, right: PAD, height: 64,
        borderRadius: 14,
        background: 'linear-gradient(135deg, #10b981, #059669)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
        opacity: bannerOp * secAop,
        transform: 'translateY(' + (bannerY + (bannerOp >= 1 ? float(40, 2, 0.05) : 0)) + 'px) scale(' + eob(bannerOp) + ')',
        boxShadow: '0 ' + (4 + (bannerOp >= 1 ? breathe(40, 0.06) * 6 : 0)) + 'px ' + (20 + (bannerOp >= 1 ? breathe(40, 0.06) * 14 : 0)) + 'px rgba(16,185,129,' + (0.25 + (bannerOp >= 1 ? breathe(40, 0.06) * 0.15 : 0)) + ')',
        zIndex: 6
      }},
        svg(24, 24, '0 0 24 24', [
          e('circle', { key: 'bg', cx: '12', cy: '12', r: '10', fill: 'rgba(255,255,255,0.3)' }),
          e('path', { key: 'ck', d: 'M7 12l4 4 6-7', stroke: '#fff', strokeWidth: '2.5', strokeLinecap: 'round', strokeLinejoin: 'round' })
        ]),
        e('span', { style: { fontSize: 20, fontWeight: 700, color: '#fff', letterSpacing: '0.3px' } }, 'Campaign Complete \u2014 All 4 Steps Optimized')
      ));
    }

    return e('div', { key: 'secA', style: {
      position: 'absolute', top: 0, left: 0, width: W, height: H,
      opacity: secAop, zIndex: 10
    } }, children);
  }

  // =========================================================
  //  SECTION B: CUSTOMER SUPPORT TRIPLE-CRM (f 380-720)
  // =========================================================
  function sectionB() {
    if (secBop <= 0) return null;

    var children = [];
    var PAD = 40;
    var PANEL_GAP = 24;
    var PANEL_W = Math.floor((W - PAD * 2 - PANEL_GAP * 2) / 3);
    var PANEL_H = H - 200;
    var PANEL_Y = 100;

    var panels = [
      { name: 'Zendesk', color: C_ZENDESK, slideF: 410 },
      { name: 'HubSpot', color: C_HUBSPOT, slideF: 420 },
      { name: 'LiveAgent', color: C_LIVEAGENT, slideF: 430 }
    ];

    // Tickets timing (compressed)
    var tickets = [
      // Round 1
      { panel: 0, custF: 450, typeF: 465, respF: 478, doneF: 510,
        custMsg: 'My order #4521 has not arrived yet.',
        respMsg: 'I found your order! It shipped yesterday via FedEx. Tracking: FX-8842. Expected delivery: Tomorrow by 5 PM.' },
      { panel: 1, custF: 470, typeF: 485, respF: 498, doneF: 530,
        custMsg: 'How do I reset my password?',
        respMsg: 'Click "Forgot Password" on the login page. I have sent a reset link to your email j***@gmail.com.' },
      { panel: 2, custF: 490, typeF: 505, respF: 518, doneF: 550,
        custMsg: 'Can I upgrade my plan?',
        respMsg: 'Absolutely! I have applied the Pro plan to your account. Your new features are active now.' },
      // Round 2
      { panel: 0, custF: 560, typeF: 572, respF: 583, doneF: 605,
        custMsg: 'I need a refund for item #887.',
        respMsg: 'Refund of $49.99 processed. It will appear in 3-5 business days.' },
      { panel: 1, custF: 575, typeF: 587, respF: 598, doneF: 620,
        custMsg: 'Is the API down?',
        respMsg: 'All systems operational. Latency is at 42ms. No issues detected.' },
      { panel: 2, custF: 590, typeF: 602, respF: 613, doneF: 635,
        custMsg: 'Transfer me to billing.',
        respMsg: 'I can handle billing questions! What do you need help with?' }
    ];

    // Data dot particles flowing between CRM panels
    if (f >= 450 && f < 660) {
      var dpO = f < 460 ? eo3(p(450, 460)) : f < 645 ? 1 : 1 - eo3(p(645, 660));
      var dpColors = [C_ZENDESK, C_HUBSPOT, C_LIVEAGENT, C_GR1, C_GR2, C_GR3];
      for (var di = 0; di < 12; di++) {
        var dSeed = hash(di + 300);
        var dSpeed = 0.02 + dSeed * 0.03;
        var dAngle = (f - 450) * dSpeed + dSeed * Math.PI * 2;
        var dCenterX = W / 2;
        var dCenterY = PANEL_Y + PANEL_H / 2;
        var dRadX = 300 + Math.sin(dAngle * 0.4) * 80;
        var dRadY = 100 + Math.cos(dAngle * 0.3) * 40;
        var dpx = dCenterX + Math.cos(dAngle) * dRadX;
        var dpy = dCenterY + Math.sin(dAngle) * dRadY;
        var dpSize = 3 + hash(di) * 4;
        var dpAlpha = (0.3 + Math.sin(dAngle) * 0.3) * dpO * secBop;
        var dpColor = dpColors[di % dpColors.length];

        if (dpAlpha > 0.01) {
          children.push(e('div', { key: 'dp' + di, style: {
            position: 'absolute',
            left: dpx - dpSize / 2, top: dpy - dpSize / 2,
            width: dpSize, height: dpSize,
            borderRadius: '50%',
            background: dpColor,
            opacity: dpAlpha * 0.6,
            boxShadow: '0 0 ' + (dpSize * 2) + 'px ' + dpColor + '50',
            pointerEvents: 'none', zIndex: 9
          }}));
        }
      }
    }

    // Draw three panels
    for (var i = 0; i < panels.length; i++) {
      var panel = panels[i];
      var px = PAD + i * (PANEL_W + PANEL_GAP);

      // Slide in from bottom (faster, bouncier)
      var panelOp = 0;
      var panelSlideY = 0;
      if (f >= panel.slideF) {
        panelOp = f < panel.slideF + 15 ? eo3(p(panel.slideF, panel.slideF + 15)) : 1;
        panelSlideY = f < panel.slideF + 15 ? lerp(80, 0, eob(p(panel.slideF, panel.slideF + 15))) : 0;
      }

      if (panelOp > 0) {
        var panelChildren = [];

        // Header with pulse ring on ticket resolve
        var headerPulse = false;
        for (var hc = 0; hc < tickets.length; hc++) {
          if (tickets[hc].panel === i && f >= tickets[hc].doneF && f < tickets[hc].doneF + 20) {
            headerPulse = true;
            break;
          }
        }

        panelChildren.push(e('div', { key: 'hdr', style: {
          padding: '16px 20px',
          borderBottom: '3px solid ' + panel.color,
          display: 'flex', alignItems: 'center', gap: 10,
          position: 'relative'
        }},
          e('div', { style: {
            width: 32, height: 32, borderRadius: 8,
            background: panel.color,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transform: headerPulse ? 'scale(1.1)' : 'scale(1)'
          }},
            svg(18, 18, '0 0 24 24', [
              e('path', { key: 'h', d: 'M20 6L9 17l-5-5', stroke: '#fff', strokeWidth: '2.5', strokeLinecap: 'round', strokeLinejoin: 'round' })
            ])
          ),
          e('span', { style: { fontSize: 18, fontWeight: 700, color: C_G900 } }, panel.name)
        ));

        // Chat area
        var chatChildren = [];
        for (var t = 0; t < tickets.length; t++) {
          var ticket = tickets[t];
          if (ticket.panel !== i) continue;

          var ticketChildren = [];

          // Customer message (faster, springy)
          var custOp = f >= ticket.custF ? (f < ticket.custF + 8 ? eo3(p(ticket.custF, ticket.custF + 8)) : 1) : 0;
          if (custOp > 0) {
            ticketChildren.push(e('div', { key: 'cust-' + t, style: {
              maxWidth: '85%',
              padding: '10px 14px',
              borderRadius: '14px 14px 14px 4px',
              background: C_G100, fontSize: 12, color: C_G900,
              lineHeight: '1.4', opacity: custOp,
              transform: 'translateX(' + ((1 - eob(custOp)) * -15) + 'px)',
              marginBottom: 8
            } }, ticket.custMsg));
          }

          // Typing indicator
          var typingOp = 0;
          if (f >= ticket.typeF && f < ticket.respF) {
            typingOp = f < ticket.typeF + 6 ? eo3(p(ticket.typeF, ticket.typeF + 6)) : 1;
          }
          if (typingOp > 0) {
            var dotPhase = (f - ticket.typeF) * 0.25;
            ticketChildren.push(e('div', { key: 'type-' + t, style: {
              display: 'flex', gap: 4, padding: '10px 14px',
              borderRadius: '14px 14px 14px 4px',
              background: panel.color + '15',
              alignSelf: 'flex-end', opacity: typingOp,
              marginBottom: 8, maxWidth: 60
            }},
              e('div', { style: { width: 7, height: 7, borderRadius: '50%', background: panel.color, opacity: 0.4 + 0.6 * Math.abs(Math.sin(dotPhase)) } }),
              e('div', { style: { width: 7, height: 7, borderRadius: '50%', background: panel.color, opacity: 0.4 + 0.6 * Math.abs(Math.sin(dotPhase + 1)) } }),
              e('div', { style: { width: 7, height: 7, borderRadius: '50%', background: panel.color, opacity: 0.4 + 0.6 * Math.abs(Math.sin(dotPhase + 2)) } })
            ));
          }

          // AI response (springy)
          var respOp = f >= ticket.respF ? (f < ticket.respF + 8 ? eo3(p(ticket.respF, ticket.respF + 8)) : 1) : 0;
          if (respOp > 0) {
            ticketChildren.push(e('div', { key: 'resp-' + t, style: {
              maxWidth: '85%',
              padding: '10px 14px',
              borderRadius: '14px 14px 4px 14px',
              background: panel.color + '18',
              borderLeft: '3px solid ' + panel.color,
              fontSize: 12, color: C_G900, lineHeight: '1.4',
              alignSelf: 'flex-end', opacity: respOp,
              transform: 'translateX(' + ((1 - eob(respOp)) * 15) + 'px)',
              marginBottom: 8
            } }, ticket.respMsg));
          }

          // Resolved checkmark (bouncier)
          var doneOp = f >= ticket.doneF ? (f < ticket.doneF + 8 ? eo3(p(ticket.doneF, ticket.doneF + 8)) : 1) : 0;
          if (doneOp > 0) {
            ticketChildren.push(e('div', { key: 'done-' + t, style: {
              display: 'flex', alignItems: 'center', gap: 6,
              alignSelf: 'flex-end', opacity: doneOp,
              transform: 'scale(' + eob(doneOp) + ')',
              marginBottom: 12
            }},
              svg(16, 16, '0 0 24 24', [
                e('circle', { key: 'bg', cx: '12', cy: '12', r: '10', fill: '#10b981' }),
                e('path', { key: 'ck', d: 'M7 12l4 4 6-7', stroke: '#fff', strokeWidth: '2.5', strokeLinecap: 'round', strokeLinejoin: 'round' })
              ]),
              e('span', { style: { fontSize: 11, fontWeight: 600, color: '#10b981' } }, 'Resolved')
            ));
          }

          if (ticketChildren.length > 0) {
            chatChildren.push(e('div', { key: 'ticket-' + t, style: {
              display: 'flex', flexDirection: 'column', marginBottom: 4
            } }, ticketChildren));
          }
        }

        panelChildren.push(e('div', { key: 'chat', style: {
          padding: '12px 16px', flex: 1,
          display: 'flex', flexDirection: 'column', overflow: 'hidden'
        } }, chatChildren));

        // Alive: gentle float + breathing colored shadow per panel
        var panelFloat = panelOp >= 1 ? float(i + 20, 2, 0.035) : 0;
        var panelBreathe = panelOp >= 1 ? breathe(i + 20, 0.05) : 0;
        var panelShadow = panelOp >= 1
          ? '0 ' + (4 + panelBreathe * 6) + 'px ' + (24 + panelBreathe * 16) + 'px ' + panel.color + (Math.round(15 + panelBreathe * 20)).toString(16)
          : '0 4px 24px rgba(0,0,0,0.08)';
        children.push(e('div', { key: 'panel-' + i, style: {
          position: 'absolute',
          left: px, top: PANEL_Y + panelSlideY + panelFloat,
          width: PANEL_W, height: PANEL_H,
          borderRadius: 16, background: '#fff',
          boxShadow: panelShadow,
          opacity: panelOp * secBop,
          overflow: 'hidden',
          display: 'flex', flexDirection: 'column', zIndex: 5
        } }, panelChildren));
      }
    }

    // --- "70%+ Tickets Automated" overlay with shimmer ---
    var overlayOp = 0;
    var overlayScale = 0;
    if (f >= 660 && f < 700) {
      overlayOp = f < 675 ? eo3(p(660, 675)) : 1;
      overlayScale = f < 675 ? eob(p(660, 675)) : 1;
    }
    if (overlayOp > 0) {
      var shP70 = -((f * 4) % 300);
      children.push(e('div', { key: 'overlay-stat', style: {
        position: 'absolute',
        left: W / 2 - 280, top: H / 2 - 60,
        width: 560, height: 120,
        borderRadius: 20,
        background: 'linear-gradient(135deg, ' + C_GR1 + ', ' + C_GR2 + ', ' + C_GR3 + ')',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column',
        opacity: overlayOp * secBop,
        transform: 'scale(' + overlayScale + ')',
        boxShadow: '0 8px 40px rgba(70,92,224,0.4)',
        zIndex: 20
      }},
        e('div', { style: {
          fontSize: 42, fontWeight: 800, letterSpacing: '-1px',
          background: 'linear-gradient(90deg, #fff, rgba(255,255,255,0.5), #fff, rgba(255,255,255,0.5), #fff)',
          backgroundSize: '300% 100%',
          backgroundPosition: shP70 + '% 0',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        } }, '70%+'),
        e('div', { style: { fontSize: 18, fontWeight: 500, color: 'rgba(255,255,255,0.85)', marginTop: 4 } }, 'Tickets Automated')
      ));
    }

    return e('div', { key: 'secB', style: {
      position: 'absolute', top: 0, left: 0, width: W, height: H,
      opacity: secBop, zIndex: 10
    } }, children);
  }

  // =========================================================
  //  SECTION C: E-COMMERCE SALES CHATBOT (f 700-950)
  // =========================================================
  function sectionC() {
    if (secCop <= 0) return null;

    var children = [];
    var STORE_PAD = 60;

    // --- Camera zoom into chatbot area ---
    // f780-810: zoom in (chat conversation starts)
    // f810-910: hold zoom on chat
    // f910-930: zoom back out (before sales stat overlay)
    var zoomT = 0;
    if (f >= 780 && f < 940) {
      if (f < 808) zoomT = eo3(p(780, 808));
      else if (f < 915) zoomT = 1;
      else zoomT = 1 - eo3(p(915, 940));
    }
    // Chat center target: CHAT_X + CHAT_W/2 = (W-420) + 190, CHAT_Y + CHAT_H/2 = 150 + 290
    var zoomCX = W - 230;
    var zoomCY = 440;
    var zoomS = 1 + zoomT * 0.45; // 1.0 -> 1.45x
    // translate so chat center moves to viewport center at full zoom
    var zoomTX = (W / 2 - zoomCX) * zoomT;
    var zoomTY = (H / 2 - zoomCY) * zoomT;

    // --- Store Top Bar with animated nav underline ---
    var storeBarOp = f >= 710 ? (f < 720 ? eo3(p(710, 720)) : 1) : 0;
    if (storeBarOp > 0) {
      var navItems = ['New In', 'Women', 'Men', 'Sale'];
      // Animated underline cycles through nav items
      var navActiveIdx = f >= 730 ? Math.floor(((f - 730) * 0.08) % 4) : -1;
      var navEls = [];
      for (var ni = 0; ni < navItems.length; ni++) {
        var isActive = ni === navActiveIdx;
        navEls.push(e('span', { key: 'nav' + ni, style: {
          fontSize: 14, fontWeight: isActive ? 700 : 500,
          color: isActive ? C_GR2 : C_G600,
          position: 'relative', paddingBottom: 4
        }},
          navItems[ni],
          isActive ? e('div', { style: {
            position: 'absolute', bottom: 0, left: 0, right: 0, height: 2,
            background: C_GR2, borderRadius: 1
          }}) : null
        ));
      }

      children.push(e('div', { key: 'store-bar', style: {
        position: 'absolute', top: 0, left: 0, width: W, height: 60,
        background: '#fff', borderBottom: '1px solid ' + C_G200,
        display: 'flex', alignItems: 'center', padding: '0 40px',
        opacity: storeBarOp * secCop, zIndex: 6
      }},
        e('div', { style: { fontSize: 22, fontWeight: 800, color: C_G900, letterSpacing: '-0.5px' } }, 'Fashion Store'),
        e('div', { style: { flex: 1 } }),
        e('div', { style: { display: 'flex', gap: 28 } }, navEls),
        e('div', { style: { marginLeft: 40, display: 'flex', gap: 16, alignItems: 'center' } },
          // Search icon with subtle pulse
          e('div', { style: {
            transform: 'scale(' + (1 + breathe(70, 0.08) * 0.06) + ')'
          }},
            svg(20, 20, '0 0 24 24', [
              e('circle', { key: 'c', cx: '11', cy: '11', r: '8', stroke: C_G500, strokeWidth: '2', fill: 'none' }),
              e('path', { key: 'l', d: 'M21 21l-4.35-4.35', stroke: C_G500, strokeWidth: '2', strokeLinecap: 'round' })
            ])
          ),
          e('div', { style: { position: 'relative' } },
            svg(20, 20, '0 0 24 24', [
              e('path', { key: 'b', d: 'M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18', stroke: C_G500, strokeWidth: '2', fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' }),
              e('path', { key: 'a', d: 'M16 10a4 4 0 01-8 0', stroke: C_G500, strokeWidth: '2', fill: 'none', strokeLinecap: 'round' })
            ]),
            // Cart badge appears at f 890 + pulse ring
            f >= 890 ? e('div', { style: {
              position: 'absolute', top: -6, right: -6,
              width: 16, height: 16, borderRadius: 8,
              background: '#ef4444', color: '#fff',
              fontSize: 10, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              opacity: f < 900 ? eo3(p(890, 900)) : 1,
              transform: 'scale(' + (f < 900 ? eob(p(890, 900)) : 1) + ')'
            } }, '1') : null
          )
        )
      ));

      // Cart icon pulse rings
      if (f >= 890 && f < 920) {
        var cartRings = pulseRings(W - 40 - 10, 30, 890, '#ef4444', 3, 8, 30);
        for (var cri = 0; cri < cartRings.length; cri++) {
          children.push(cartRings[cri]);
        }
      }
    }

    // --- Product Grid (2x2) ---
    var products = [
      { name: 'Summer Floral Dress', price: '$89.99', oldPrice: '$119.99', color: '#fecaca', textColor: '#dc2626', badge: 'HOT', badgeColor: '#ef4444', rating: 4.8 },
      { name: 'Linen Blazer', price: '$129.00', oldPrice: null, color: '#bfdbfe', textColor: '#2563eb', badge: 'NEW', badgeColor: '#2563eb', rating: 4.5 },
      { name: 'Cotton Maxi Skirt', price: '$69.50', oldPrice: '$95.00', color: '#d9f99d', textColor: '#65a30d', badge: 'SALE', badgeColor: '#65a30d', rating: 4.6 },
      { name: 'Silk Camisole', price: '$59.00', oldPrice: null, color: '#e9d5ff', textColor: '#7c3aed', badge: 'NEW', badgeColor: '#7c3aed', rating: 4.9 }
    ];

    var GRID_X = STORE_PAD;
    var GRID_Y = 90;
    var CARD_W = 380;
    var CARD_H = 400;
    var CARD_GAP = 30;

    for (var i = 0; i < products.length; i++) {
      var prod = products[i];
      var col = i % 2;
      var row = Math.floor(i / 2);
      var cx = GRID_X + col * (CARD_W + CARD_GAP);
      var cy = GRID_Y + row * (CARD_H + CARD_GAP);

      // Faster stagger with more pop (6 frame stagger, bouncier)
      var prodAppear = 718 + i * 6;
      var prodOp = f >= prodAppear ? (f < prodAppear + 10 ? eo3(p(prodAppear, prodAppear + 10)) : 1) : 0;
      var prodScale = f >= prodAppear ? (f < prodAppear + 10 ? eob(p(prodAppear, prodAppear + 10)) : 1) : 0;

      // Pulse effect on first product at f 890 (add to cart)
      var pulseScale = 1;
      if (i === 0 && f >= 885 && f < 905) {
        var pulseT = p(885, 905);
        pulseScale = 1 + 0.04 * Math.sin(pulseT * Math.PI);
      }

      if (prodOp > 0) {
        var prodFloat = prodOp >= 1 ? float(i + 30, 2.5, 0.03 + i * 0.005) : 0;
        var prodBreathe = prodOp >= 1 ? breathe(i + 30, 0.04 + i * 0.008) : 0;
        var prodShadow = prodOp >= 1
          ? '0 ' + (3 + prodBreathe * 5) + 'px ' + (12 + prodBreathe * 10) + 'px ' + prod.textColor + (Math.round(10 + prodBreathe * 15)).toString(16)
          : '0 2px 12px rgba(0,0,0,0.06)';

        var imgH = CARD_H - 100;
        // Shimmer sweep across product image
        var shimmerX = ((f * 3 + i * 80) % (CARD_W + 200)) - 200;

        var cardChildren = [];
        // Product image area with shimmer sweep
        cardChildren.push(e('div', { key: 'img', style: {
          height: imgH, background: prod.color,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative', overflow: 'hidden'
        }},
          // Main product placeholder
          e('div', { style: {
            width: 100, height: 120, borderRadius: 12,
            background: 'rgba(255,255,255,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }},
            svg(48, 48, '0 0 24 24', [
              e('path', { key: 'img', d: 'M4 16l4-4a3 3 0 014 0l4 4m-2-2l1-1a3 3 0 014 0l3 3M4 20h16a2 2 0 002-2V6a2 2 0 00-2-2H4a2 2 0 00-2 2v12a2 2 0 002 2z',
                stroke: prod.textColor, strokeWidth: '1.5', fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' })
            ])
          ),
          // Shimmer sweep overlay
          prodOp >= 1 ? e('div', { style: {
            position: 'absolute', top: 0, left: shimmerX, width: 120, height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
            pointerEvents: 'none'
          }}) : null,
          // Animated badge (top-left corner)
          f >= prodAppear + 12 ? e('div', { key: 'badge', style: {
            position: 'absolute', top: 12, left: 12,
            padding: '4px 12px', borderRadius: 6,
            background: prod.badgeColor, color: '#fff',
            fontSize: 11, fontWeight: 800, letterSpacing: '1px',
            opacity: f < prodAppear + 20 ? eo3(p(prodAppear + 12, prodAppear + 20)) : 1,
            transform: 'scale(' + (f < prodAppear + 20 ? eob(p(prodAppear + 12, prodAppear + 20)) : (1 + breathe(i + 80, 0.1) * 0.04)) + ')',
            boxShadow: '0 2px 8px ' + prod.badgeColor + '60'
          }}, prod.badge) : null,
          // Heart icon (top-right) with pulse on hover sim
          f >= prodAppear + 15 ? e('div', { key: 'heart', style: {
            position: 'absolute', top: 12, right: 12,
            width: 32, height: 32, borderRadius: 16,
            background: 'rgba(255,255,255,0.85)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: f < prodAppear + 22 ? eo3(p(prodAppear + 15, prodAppear + 22)) : 1,
            transform: 'scale(' + (f < prodAppear + 22 ? eob(p(prodAppear + 15, prodAppear + 22)) : (1 + breathe(i + 90, 0.12) * 0.08)) + ')',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }},
            svg(16, 16, '0 0 24 24', [
              e('path', { key: 'h', d: 'M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z',
                stroke: '#ef4444', strokeWidth: '2', fill: (i === 0 && f >= 860) ? '#ef4444' : 'none', strokeLinecap: 'round', strokeLinejoin: 'round' })
            ])
          ) : null
        ));

        // Product info area with star rating + price
        var starsAppear = prodAppear + 18;
        cardChildren.push(e('div', { key: 'info', style: { padding: '10px 16px' } },
          e('div', { style: { fontSize: 14, fontWeight: 600, color: C_G900, marginBottom: 4 } }, prod.name),
          // Star rating row
          f >= starsAppear ? e('div', { key: 'stars', style: {
            display: 'flex', alignItems: 'center', gap: 3, marginBottom: 6,
            opacity: f < starsAppear + 10 ? eo3(p(starsAppear, starsAppear + 10)) : 1,
            transform: 'translateX(' + ((f < starsAppear + 10 ? (1 - eob(p(starsAppear, starsAppear + 10))) * 8 : 0)) + 'px)'
          }},
            // 5 stars, filled based on rating
            [1,2,3,4,5].map(function(s) {
              var filled = s <= Math.floor(prod.rating);
              var half = !filled && s === Math.ceil(prod.rating);
              return svg(14, 14, '0 0 24 24', [
                e('path', { key: 'st' + s, d: 'M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z',
                  fill: filled ? '#f59e0b' : (half ? '#f59e0b80' : C_G300),
                  stroke: filled || half ? '#f59e0b' : C_G300,
                  strokeWidth: '1' })
              ]);
            }),
            e('span', { style: { fontSize: 11, fontWeight: 600, color: C_G500, marginLeft: 4 } }, prod.rating.toFixed(1))
          ) : null,
          // Price row with old price strikethrough
          e('div', { style: { display: 'flex', alignItems: 'center', gap: 8 } },
            e('div', { style: { fontSize: 16, fontWeight: 700, color: prod.textColor } }, prod.price),
            prod.oldPrice ? e('div', { style: {
              fontSize: 13, color: C_G400, textDecoration: 'line-through',
              opacity: f >= prodAppear + 14 ? (f < prodAppear + 22 ? eo3(p(prodAppear + 14, prodAppear + 22)) : 1) : 0
            }}, prod.oldPrice) : null
          )
        ));

        children.push(e('div', { key: 'prod-' + i, style: {
          position: 'absolute',
          left: cx, top: cy + prodFloat, width: CARD_W, height: CARD_H,
          borderRadius: 16, background: '#fff',
          boxShadow: prodShadow,
          overflow: 'hidden',
          opacity: prodOp * secCop,
          transform: 'scale(' + (prodScale * pulseScale) + ')',
          zIndex: 4
        }}, cardChildren));
      }
    }

    // --- Floating shopping particles (hearts, sparkles) ---
    if (f >= 730 && f < 920) {
      var shopPO = f < 745 ? eo3(p(730, 745)) : f < 905 ? 1 : 1 - eo3(p(905, 920));
      var shopPColors = ['#ef4444', '#ec4899', '#f59e0b', C_GR2, '#7c3aed', '#2563eb'];
      for (var spi = 0; spi < 14; spi++) {
        var spSeed = hash(spi + 500);
        var spSpeed = 0.3 + spSeed * 0.8;
        var spXBase = 80 + hash(spi + 510) * (W - 160);
        var spPhase = ((f - 730) * spSpeed + spSeed * 150) % 110;
        var spY = H * 0.85 - spPhase * 3;
        var spFadeIn = Math.min(spPhase / 12, 1);
        var spFadeOut = Math.max(0, 1 - (spPhase - 70) / 40);
        var spAlpha = spFadeIn * spFadeOut * shopPO * secCop;
        var spWobble = Math.sin(spPhase * 0.12 + spSeed * 6.28) * 22;
        var spSize = 3 + spSeed * 5;
        var spColor = shopPColors[spi % shopPColors.length];
        if (spAlpha > 0.01) {
          children.push(e('div', { key: 'shp' + spi, style: {
            position: 'absolute',
            left: spXBase + spWobble - spSize / 2, top: spY,
            width: spSize, height: spSize, borderRadius: '50%',
            background: spColor, opacity: spAlpha * 0.5,
            boxShadow: '0 0 ' + (spSize * 2) + 'px ' + spColor + '40',
            pointerEvents: 'none', zIndex: 3
          }}));
        }
      }
    }

    // --- Sparkle burst on product recommendation ---
    if (f >= 890 && f < 915) {
      var burstO = f < 900 ? eo3(p(890, 900)) : 1 - eo3(p(900, 915));
      var burstColors = ['#ef4444', '#f59e0b', C_GR1, C_GR2, '#10b981', '#ec4899'];
      for (var bi = 0; bi < 16; bi++) {
        var bSeed = hash(bi + 700);
        var bAngle = (bi / 16) * Math.PI * 2 + bSeed * 0.5;
        var bDist = 20 + (f - 890) * (3 + bSeed * 3);
        var bx = GRID_X + CARD_W / 2 + Math.cos(bAngle) * bDist;
        var by = GRID_Y + CARD_H / 2 + Math.sin(bAngle) * bDist;
        var bSize = 3 + bSeed * 5;
        if (burstO > 0.01) {
          children.push(e('div', { key: 'burst' + bi, style: {
            position: 'absolute',
            left: bx - bSize / 2, top: by - bSize / 2,
            width: bSize, height: bSize,
            borderRadius: '50%',
            background: burstColors[bi % burstColors.length],
            opacity: burstO * 0.8 * secCop,
            boxShadow: '0 0 ' + (bSize * 2) + 'px ' + burstColors[bi % burstColors.length] + '60',
            pointerEvents: 'none', zIndex: 25
          }}));
        }
      }
    }

    // --- Chat Widget (FlowHunt UI) ---
    var CHAT_X = W - 420;
    var CHAT_Y = 150;
    var CHAT_W = 380;
    var CHAT_H = 580;
    var C_BLUE = '#0084FF'; // FlowHunt user bubble blue
    var C_BOT_BG = '#f5f0e8'; // Warm cream for bot messages

    // FlowHunt logo icon helper (stylized swirl)
    function fhIcon(sz, color) {
      return svg(sz, sz, '0 0 24 24', [
        e('path', { key: 'sw1', d: 'M12 3C7 3 3 7.5 3 12c0 2.5 1.2 4.8 3 6.2', stroke: color, strokeWidth: '2.2', fill: 'none', strokeLinecap: 'round' }),
        e('path', { key: 'sw2', d: 'M12 3c3.5 0 6.5 2 8 5', stroke: color, strokeWidth: '2.2', fill: 'none', strokeLinecap: 'round' }),
        e('path', { key: 'sw3', d: 'M9 8c2-2 6-1 7 2s-1 6-4 6-5-2-4-5', stroke: color, strokeWidth: '2', fill: 'none', strokeLinecap: 'round' }),
        e('circle', { key: 'dot', cx: '12', cy: '12', r: '1.5', fill: color })
      ]);
    }

    // Bot icon (small circle before expansion) with animated ripple rings
    var botIconOp = f >= 740 ? (f < 748 ? eo3(p(740, 748)) : 1) : 0;
    var chatExpand = f >= 750 ? (f < 768 ? eo3(p(750, 768)) : 1) : 0;

    if (botIconOp > 0 && chatExpand < 0.1) {
      // Ripple rings around bot icon
      for (var bri = 0; bri < 3; bri++) {
        var briPhase = ((f - 740 + bri * 10) % 30) / 30;
        var briScale = 1 + briPhase * 0.8;
        var briAlpha = (1 - briPhase) * 0.2 * botIconOp;
        if (briAlpha > 0.01) {
          children.push(e('div', { key: 'bot-rip' + bri, style: {
            position: 'absolute',
            right: 40 - 28 * (briScale - 1), bottom: 40 - 28 * (briScale - 1),
            width: 56 * briScale, height: 56 * briScale,
            borderRadius: '50%', border: '2px solid ' + C_GR2,
            opacity: briAlpha * secCop,
            pointerEvents: 'none', zIndex: 14
          }}));
        }
      }
      children.push(e('div', { key: 'bot-icon', style: {
        position: 'absolute',
        right: 40, bottom: 40, width: 56, height: 56, borderRadius: 28,
        background: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 4px ' + (20 + breathe(50, 0.08) * 12) + 'px rgba(70,92,224,' + (0.15 + breathe(50, 0.08) * 0.15) + ')',
        opacity: botIconOp * secCop,
        transform: 'scale(' + eob(botIconOp) + ') translateY(' + float(50, 3, 0.06) + 'px)',
        zIndex: 15
      }},
        fhIcon(30, C_GR2)
      ));
    }

    // Expanded chat window
    if (chatExpand > 0) {
      var chatWinChildren = [];

      // ---- FlowHunt Header: white bg, "FlowHunt" bold, refresh icon ----
      chatWinChildren.push(e('div', { key: 'ch-hdr', style: {
        padding: '14px 18px',
        background: '#fff',
        borderBottom: '1px solid ' + C_G200,
        borderRadius: '16px 16px 0 0',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }},
        e('span', { style: { fontSize: 16, fontWeight: 800, color: C_G900, letterSpacing: '-0.3px' } }, 'FlowHunt'),
        // Refresh icon with slow spin animation
        e('div', { style: {
          transform: 'rotate(' + (f * 0.5) + 'deg)',
          opacity: 0.5
        }},
          svg(18, 18, '0 0 24 24', [
            e('path', { key: 'ref', d: 'M23 4v6h-6M1 20v-6h6', stroke: C_G500, strokeWidth: '2', fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' }),
            e('path', { key: 'arc1', d: 'M3.51 9a9 9 0 0114.85-3.36L23 10', stroke: C_G500, strokeWidth: '2', fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' }),
            e('path', { key: 'arc2', d: 'M20.49 15a9 9 0 01-14.85 3.36L1 14', stroke: C_G500, strokeWidth: '2', fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' })
          ])
        )
      ));

      // ---- Chat messages area ----
      // Timeline: user1 @785, typing @812, bot1 @825, icons @837, user2 @845, typing2 @870, bot2+card @882
      var msgChildren = [];

      // --- User message: bright blue pill, right-aligned, white text ---
      var custTyping = '';
      var CUST_MSG_1 = 'hello what are you?';
      if (f >= 785 && f < 810) {
        var chars = Math.min(Math.floor((f - 785) * 0.9), CUST_MSG_1.length);
        custTyping = CUST_MSG_1.substring(0, chars);
      } else if (f >= 810) {
        custTyping = CUST_MSG_1;
      }
      if (f >= 785) {
        var cm1Op = f < 793 ? eo3(p(785, 793)) : 1;
        msgChildren.push(e('div', { key: 'cm1-row', style: {
          alignSelf: 'flex-end', opacity: cm1Op,
          transform: 'translateX(' + ((1 - eob(cm1Op)) * 12) + 'px)',
          marginBottom: 4, maxWidth: '80%'
        }},
          e('div', { style: {
            padding: '10px 18px',
            borderRadius: 20,
            background: C_BLUE, color: '#fff',
            fontSize: 13, lineHeight: '1.4', fontWeight: 500
          }}, custTyping + (f < 810 && f >= 785 && Math.floor(f / 6) % 2 === 0 ? '|' : '')),
          // Copy icon below user message
          f >= 810 ? e('div', { style: {
            display: 'flex', justifyContent: 'center', marginTop: 4,
            opacity: f < 818 ? eo3(p(810, 818)) : 0.4
          }},
            svg(14, 14, '0 0 24 24', [
              e('rect', { key: 'r1', x: '9', y: '9', width: '13', height: '13', rx: '2', ry: '2', stroke: C_G400, strokeWidth: '1.5', fill: 'none' }),
              e('path', { key: 'p1', d: 'M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1', stroke: C_G400, strokeWidth: '1.5', fill: 'none' })
            ])
          ) : null
        ));
      }

      // --- Bot FlowHunt avatar + typing indicator ---
      if (f >= 812 && f < 825) {
        var btDot = (f - 812) * 0.3;
        msgChildren.push(e('div', { key: 'bt1-row', style: {
          display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 4
        }},
          e('div', { style: {
            width: 28, height: 28, borderRadius: 14, flexShrink: 0, marginTop: 4,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}, fhIcon(22, C_GR2)),
          e('div', { style: {
            display: 'flex', gap: 4, padding: '10px 14px',
            borderRadius: '4px 18px 18px 18px',
            background: C_BOT_BG, maxWidth: 60
          }},
            e('div', { style: { width: 7, height: 7, borderRadius: '50%', background: C_G400, transform: 'translateY(' + (Math.sin(btDot) * -3) + 'px)', opacity: 0.4 + 0.6 * Math.abs(Math.sin(btDot)) } }),
            e('div', { style: { width: 7, height: 7, borderRadius: '50%', background: C_G400, transform: 'translateY(' + (Math.sin(btDot + 1) * -3) + 'px)', opacity: 0.4 + 0.6 * Math.abs(Math.sin(btDot + 1)) } }),
            e('div', { style: { width: 7, height: 7, borderRadius: '50%', background: C_G400, transform: 'translateY(' + (Math.sin(btDot + 2) * -3) + 'px)', opacity: 0.4 + 0.6 * Math.abs(Math.sin(btDot + 2)) } })
          )
        ));
      }

      // --- Bot response: FlowHunt avatar + cream bubble + action icons ---
      if (f >= 825) {
        var br1Op = f < 835 ? eo3(p(825, 835)) : 1;
        var BOT_RESP_1 = 'I\'m an AI assistant that you can chat with via this app. I can help answer questions, recommend products, and guide you through purchases.';
        msgChildren.push(e('div', { key: 'br1-row', style: {
          display: 'flex', alignItems: 'flex-start', gap: 8,
          opacity: br1Op,
          transform: 'translateY(' + ((1 - eob(br1Op)) * 8) + 'px)',
          marginBottom: 4
        }},
          e('div', { style: {
            width: 28, height: 28, borderRadius: 14, flexShrink: 0, marginTop: 4,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}, fhIcon(22, C_GR2)),
          e('div', { style: { flex: 1 } },
            e('div', { style: {
              padding: '10px 14px',
              borderRadius: '4px 18px 18px 18px',
              background: C_BOT_BG,
              fontSize: 12, color: C_G900, lineHeight: '1.5'
            }}, BOT_RESP_1),
            // Action icons row: copy, thumbs up, thumbs down
            f >= 837 ? e('div', { style: {
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginTop: 6, paddingLeft: 4, paddingRight: 4,
              opacity: f < 845 ? eo3(p(837, 845)) : 0.45
            }},
              svg(13, 13, '0 0 24 24', [
                e('rect', { key: 'r1', x: '9', y: '9', width: '13', height: '13', rx: '2', ry: '2', stroke: C_G400, strokeWidth: '1.5', fill: 'none' }),
                e('path', { key: 'p1', d: 'M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1', stroke: C_G400, strokeWidth: '1.5', fill: 'none' })
              ]),
              e('div', { style: { display: 'flex', gap: 10 } },
                svg(13, 13, '0 0 24 24', [
                  e('path', { key: 'tu', d: 'M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3',
                    stroke: C_G400, strokeWidth: '1.5', fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' })
                ]),
                svg(13, 13, '0 0 24 24', [
                  e('path', { key: 'td', d: 'M10 15V19a3 3 0 003 3l4-9V2H5.72a2 2 0 00-2 1.7l-1.38 9a2 2 0 002 2.3H10zM17 2h2.67A2.31 2.31 0 0122 4v7a2.31 2.31 0 01-2.33 2H17',
                    stroke: C_G400, strokeWidth: '1.5', fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' })
                ])
              )
            ) : null
          )
        ));
      }

      // --- User: "I'm looking for a summer dress" (blue pill) ---
      var custTyping2 = '';
      var CUST_MSG_2 = 'I\'m looking for a summer dress';
      if (f >= 845 && f < 870) {
        var chars2 = Math.min(Math.floor((f - 845) * 1.3), CUST_MSG_2.length);
        custTyping2 = CUST_MSG_2.substring(0, chars2);
      } else if (f >= 870) {
        custTyping2 = CUST_MSG_2;
      }
      if (f >= 845) {
        var cm2Op = f < 853 ? eo3(p(845, 853)) : 1;
        msgChildren.push(e('div', { key: 'cm2-row', style: {
          alignSelf: 'flex-end', opacity: cm2Op,
          transform: 'translateX(' + ((1 - eob(cm2Op)) * 12) + 'px)',
          marginBottom: 4, maxWidth: '80%'
        }},
          e('div', { style: {
            padding: '10px 18px', borderRadius: 20,
            background: C_BLUE, color: '#fff',
            fontSize: 13, lineHeight: '1.4', fontWeight: 500
          }}, custTyping2 + (f < 870 && f >= 845 && Math.floor(f / 6) % 2 === 0 ? '|' : ''))
        ));
      }

      // --- Bot typing #2 ---
      if (f >= 872 && f < 882) {
        var btDot2 = (f - 872) * 0.35;
        msgChildren.push(e('div', { key: 'bt2-row', style: {
          display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 4
        }},
          e('div', { style: { width: 28, height: 28, borderRadius: 14, flexShrink: 0, marginTop: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' } }, fhIcon(22, C_GR2)),
          e('div', { style: { display: 'flex', gap: 4, padding: '10px 14px', borderRadius: '4px 18px 18px 18px', background: C_BOT_BG, maxWidth: 60 } },
            e('div', { style: { width: 7, height: 7, borderRadius: '50%', background: C_G400, transform: 'translateY(' + (Math.sin(btDot2) * -3) + 'px)', opacity: 0.4 + 0.6 * Math.abs(Math.sin(btDot2)) } }),
            e('div', { style: { width: 7, height: 7, borderRadius: '50%', background: C_G400, transform: 'translateY(' + (Math.sin(btDot2 + 1) * -3) + 'px)', opacity: 0.4 + 0.6 * Math.abs(Math.sin(btDot2 + 1)) } }),
            e('div', { style: { width: 7, height: 7, borderRadius: '50%', background: C_G400, transform: 'translateY(' + (Math.sin(btDot2 + 2) * -3) + 'px)', opacity: 0.4 + 0.6 * Math.abs(Math.sin(btDot2 + 2)) } })
          )
        ));
      }

      // --- Bot: recommendation with product card ---
      if (f >= 882) {
        var br2Op = f < 892 ? eo3(p(882, 892)) : 1;
        var recShimmerX = ((f * 4) % 400) - 100;
        var recDone = f >= 892;
        msgChildren.push(e('div', { key: 'br2-row', style: {
          display: 'flex', alignItems: 'flex-start', gap: 8,
          opacity: br2Op,
          transform: 'translateY(' + ((1 - eob(br2Op)) * 8) + 'px)',
          marginBottom: 4
        }},
          e('div', { style: { width: 28, height: 28, borderRadius: 14, flexShrink: 0, marginTop: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' } }, fhIcon(22, C_GR2)),
          e('div', { style: { flex: 1 } },
            // Text response
            e('div', { style: {
              padding: '10px 14px',
              borderRadius: '4px 18px 18px 18px',
              background: C_BOT_BG,
              fontSize: 12, color: C_G900, lineHeight: '1.5',
              marginBottom: 8
            }}, 'Great choice! Here\'s our top pick for summer:'),
            // Product card inside chat
            e('div', { style: {
              borderRadius: 12, border: '1px solid ' + C_G200,
              overflow: 'hidden',
              transform: recDone ? 'translateY(' + float(65, 1.5, 0.05) + 'px)' : 'none',
              boxShadow: recDone ? '0 ' + (2 + breathe(65, 0.06) * 3) + 'px ' + (8 + breathe(65, 0.06) * 6) + 'px rgba(0,0,0,0.08)' : 'none'
            }},
              e('div', { style: {
                height: 55, background: '#fecaca',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative', overflow: 'hidden'
              }},
                svg(24, 24, '0 0 24 24', [
                  e('path', { key: 'img', d: 'M4 16l4-4a3 3 0 014 0l4 4m-2-2l1-1a3 3 0 014 0l3 3',
                    stroke: '#dc2626', strokeWidth: '1.5', fill: 'none', strokeLinecap: 'round' })
                ]),
                recDone ? e('div', { style: {
                  position: 'absolute', top: 0, left: recShimmerX, width: 80, height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
                  pointerEvents: 'none'
                }}) : null,
                f >= 893 ? e('div', { style: {
                  position: 'absolute', top: 5, right: 5,
                  padding: '2px 7px', borderRadius: 4,
                  background: '#10b981', color: '#fff',
                  fontSize: 8, fontWeight: 700,
                  opacity: f < 900 ? eo3(p(893, 900)) : 1,
                  transform: 'scale(' + (f < 900 ? eob(p(893, 900)) : (1 + breathe(66, 0.1) * 0.05)) + ')'
                }}, 'BEST MATCH') : null
              ),
              e('div', { style: { padding: '8px 12px', background: '#fff' } },
                e('div', { style: { fontSize: 12, fontWeight: 600, color: C_G900 } }, 'Summer Floral Dress'),
                e('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 3 } },
                  e('div', { style: { display: 'flex', alignItems: 'center', gap: 2 } },
                    [1,2,3,4,5].map(function(s) {
                      return svg(10, 10, '0 0 24 24', [
                        e('path', { key: 'rs' + s, d: 'M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z',
                          fill: s <= 4 ? '#f59e0b' : '#f59e0b80', stroke: '#f59e0b', strokeWidth: '1' })
                      ]);
                    }),
                    e('span', { style: { fontSize: 9, color: C_G500, marginLeft: 2 } }, '4.8')
                  ),
                  e('div', { style: { fontSize: 14, fontWeight: 700, color: '#dc2626' } }, '$89.99')
                )
              )
            ),
            // Action icons
            f >= 900 ? e('div', { style: {
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginTop: 6, paddingLeft: 4, paddingRight: 4,
              opacity: f < 908 ? eo3(p(900, 908)) : 0.45
            }},
              svg(13, 13, '0 0 24 24', [
                e('rect', { key: 'r1', x: '9', y: '9', width: '13', height: '13', rx: '2', ry: '2', stroke: C_G400, strokeWidth: '1.5', fill: 'none' }),
                e('path', { key: 'p1', d: 'M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1', stroke: C_G400, strokeWidth: '1.5', fill: 'none' })
              ]),
              e('div', { style: { display: 'flex', gap: 10 } },
                svg(13, 13, '0 0 24 24', [
                  e('path', { key: 'tu', d: 'M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3',
                    stroke: C_G400, strokeWidth: '1.5', fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' })
                ]),
                svg(13, 13, '0 0 24 24', [
                  e('path', { key: 'td', d: 'M10 15V19a3 3 0 003 3l4-9V2H5.72a2 2 0 00-2 1.7l-1.38 9a2 2 0 002 2.3H10zM17 2h2.67A2.31 2.31 0 0122 4v7a2.31 2.31 0 01-2.33 2H17',
                    stroke: C_G400, strokeWidth: '1.5', fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' })
                ])
              )
            ) : null
          )
        ));
      }

      chatWinChildren.push(e('div', { key: 'ch-msgs', style: {
        flex: 1, padding: '16px 16px 8px',
        display: 'flex', flexDirection: 'column', overflow: 'hidden'
      } }, msgChildren));

      // ---- Input area: "+" icon + rounded "Ask me any question..." ----
      var plusPulse = breathe(80, 0.08);
      chatWinChildren.push(e('div', { key: 'ch-input', style: {
        padding: '10px 16px',
        borderTop: '1px solid ' + C_G200,
        display: 'flex', alignItems: 'center', gap: 10
      }},
        // Plus button
        e('div', { style: {
          width: 28, height: 28, borderRadius: 14,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transform: 'scale(' + (1 + plusPulse * 0.06) + ')'
        }},
          svg(18, 18, '0 0 24 24', [
            e('line', { key: 'v', x1: '12', y1: '5', x2: '12', y2: '19', stroke: C_G400, strokeWidth: '2', strokeLinecap: 'round' }),
            e('line', { key: 'h', x1: '5', y1: '12', x2: '19', y2: '12', stroke: C_G400, strokeWidth: '2', strokeLinecap: 'round' })
          ])
        ),
        // Input field
        e('div', { style: {
          flex: 1, padding: '9px 16px', borderRadius: 22,
          background: '#eef2ff', fontSize: 13, color: C_G400
        }}, 'Ask me any question...')
      ));

      // ---- Footer: "Powered by FlowHunt" ----
      chatWinChildren.push(e('div', { key: 'ch-footer', style: {
        padding: '8px 0',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }},
        e('span', { style: { fontSize: 11, color: C_G400 } }, 'Powered by '),
        e('span', { style: { fontSize: 11, fontWeight: 700, color: C_G900 } }, 'FlowHunt')
      ));

      // ---- Chat window rendering ----
      var chatBreathe = chatExpand >= 1 ? breathe(55, 0.06) : 0;
      children.push(e('div', { key: 'chat-win', style: {
        position: 'absolute',
        left: CHAT_X, top: CHAT_Y + (chatExpand >= 1 ? float(55, 2, 0.04) : 0),
        width: CHAT_W, height: CHAT_H,
        borderRadius: 16, background: '#f9fafb',
        border: '1px solid ' + C_G200,
        boxShadow: '0 ' + (4 + chatBreathe * 4) + 'px ' + (24 + chatBreathe * 12) + 'px rgba(0,0,0,' + (0.08 + chatBreathe * 0.04) + ')',
        opacity: chatExpand * secCop,
        transform: 'scale(' + lerp(0.3, 1, eob(chatExpand)) + ')',
        transformOrigin: 'bottom right',
        overflow: 'hidden',
        display: 'flex', flexDirection: 'column', zIndex: 15
      } }, chatWinChildren));
    }

    // --- "24/7 Sales Agent" stat overlay with shimmer ---
    var salesOp = 0;
    var salesScale = 0;
    if (f >= 920 && f < 945) {
      salesOp = f < 930 ? eo3(p(920, 930)) : 1;
      salesScale = f < 930 ? eob(p(920, 930)) : 1;
    }
    if (salesOp > 0) {
      var shP24 = -((f * 4) % 300);
      children.push(e('div', { key: 'sales-stat', style: {
        position: 'absolute',
        left: 60, top: H / 2 - 50,
        width: 400, height: 100,
        borderRadius: 16,
        background: 'linear-gradient(135deg, ' + C_GR1 + ', ' + C_GR2 + ')',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column',
        opacity: salesOp * secCop,
        transform: 'scale(' + salesScale + ')',
        boxShadow: '0 8px 40px rgba(70,92,224,0.4)',
        zIndex: 20
      }},
        e('div', { style: {
          fontSize: 36, fontWeight: 800, letterSpacing: '-0.5px',
          background: 'linear-gradient(90deg, #fff, rgba(255,255,255,0.5), #fff, rgba(255,255,255,0.5), #fff)',
          backgroundSize: '300% 100%',
          backgroundPosition: shP24 + '% 0',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        } }, '24/7 Sales Agent'),
        e('div', { style: { fontSize: 15, fontWeight: 500, color: 'rgba(255,255,255,0.8)', marginTop: 4 } }, 'Never miss a customer')
      ));
    }

    return e('div', { key: 'secC', style: {
      position: 'absolute', top: 0, left: 0, width: W, height: H,
      opacity: secCop, zIndex: 10, overflow: 'hidden'
    }},
      e('div', { key: 'secC-cam', style: {
        position: 'absolute', top: 0, left: 0, width: W, height: H,
        transform: 'translate(' + zoomTX + 'px, ' + zoomTY + 'px) scale(' + zoomS + ')',
        transformOrigin: zoomCX + 'px ' + zoomCY + 'px'
      }}, children)
    );
  }

  // =========================================================
  //  CLOSING HIGHLIGHT (f 950-1050) with celebration particles
  // =========================================================
  function closing() {
    if (closingOp <= 0) return null;

    var scaleIn = f < 985 ? eob(p(950, 985)) : 1;
    var textOp = f < 980 ? eo3(p(960, 980)) : 1;
    var subOp = f < 1000 ? eo3(p(980, 1000)) : 1;

    var closingChildren = [];

    // Dark overlay
    closingChildren.push(e('div', { key: 'cl-bg', style: {
      position: 'absolute', top: 0, left: 0, width: W, height: H,
      background: 'rgba(8,8,24,' + (0.75 * closingOp) + ')'
    }}));

    // Celebration particles (rising sparkles)
    if (f >= 960) {
      var cpO = f < 975 ? eo3(p(960, 975)) : 1;
      var cpColors = [C_GR1, C_GR2, C_GR3, '#10b981', '#f59e0b', '#ec4899', '#3b82f6'];
      for (var ci = 0; ci < 20; ci++) {
        var cSeed = hash(ci + 900);
        var cSpeed = 0.3 + cSeed * 0.8;
        var cxOff = (hash(ci + 950) - 0.5) * W * 0.8;
        var cPhase = ((f - 960) * cSpeed + cSeed * 200) % 120;
        var cyOff = -cPhase * 2.8;
        var cFadeIn = Math.min(cPhase / 12, 1);
        var cFadeOut = Math.max(0, 1 - (cPhase - 80) / 40);
        var cAlpha = cFadeIn * cFadeOut * cpO;
        var cSize = 2 + cSeed * 6;
        var cColor = cpColors[ci % cpColors.length];
        var cWobble = Math.sin(cPhase * 0.15 + cSeed * 6.28) * 20;

        if (cAlpha > 0.01) {
          closingChildren.push(e('div', { key: 'cp' + ci, style: {
            position: 'absolute',
            left: W / 2 + cxOff + cWobble - cSize / 2,
            top: H * 0.7 + cyOff,
            width: cSize, height: cSize,
            borderRadius: '50%',
            background: cColor,
            opacity: cAlpha * 0.7,
            boxShadow: '0 0 ' + (cSize * 2) + 'px ' + cColor + '60',
            zIndex: 51
          }}));
        }
      }
    }

    // Text content with shimmer
    var shPClose = -((f * 4) % 300);
    closingChildren.push(e('div', { key: 'cl-text', style: {
      position: 'absolute', top: 0, left: 0, width: W, height: H,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      zIndex: 52
    }},
      e('div', { style: {
        transform: 'scale(' + scaleIn + ')',
        textAlign: 'center'
      }},
        e('div', { style: {
          fontSize: 72, fontWeight: 800, letterSpacing: '-1px',
          lineHeight: '1.2', opacity: textOp
        }},
          e('span', { style: {
            background: 'linear-gradient(90deg, ' + C_GR1 + ', ' + C_GR2 + ', ' + C_GR3 + ', #fff, ' + C_GR3 + ', ' + C_GR2 + ', ' + C_GR1 + ')',
            backgroundSize: '300% 100%',
            backgroundPosition: shPClose + '% 0',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          } }, 'Real Results')
        ),
        e('div', { style: {
          marginTop: 24, fontSize: 24, fontWeight: 500,
          color: 'rgba(255,255,255,0.55)',
          opacity: subOp,
          letterSpacing: '6px',
          textTransform: 'uppercase'
        } }, 'Marketing. Support. Sales.')
      )
    ));

    return e('div', { key: 'closing', style: {
      position: 'absolute', top: 0, left: 0, width: W, height: H,
      zIndex: 50
    } }, closingChildren);
  }

  // ===== RENDER =====
  return e('div', { style: {
    position: 'relative', width: W, height: H, overflow: 'hidden',
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    background: C_BG
  }},
    background(),
    sectionA(),
    sectionB(),
    sectionC(),
    scanningLine(),
    introBadge(),
    subBadge('SEO & Marketing Automation', 45, 120, null),
    subBadge('Customer Support \u2014 Multi-CRM', 385, 460, { background: 'linear-gradient(135deg, ' + C_ZENDESK + ', ' + C_HUBSPOT + ')' }),
    subBadge('E-commerce Sales', 705, 760, { background: 'linear-gradient(135deg, ' + C_GR2 + ', ' + C_GR3 + ')' }),
    closing()
  );
}
