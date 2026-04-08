function DeepAgentScene(props) {
  var f = props.frame || 0;
  var W = props.layerSize.width;
  var H = props.layerSize.height;
  var e = React.createElement;

  // ===== EASING =====
  function eio(t) { return t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3) / 2; }
  function eo3(t) { return 1 - Math.pow(1-t, 3); }
  function eob(t) { var c = 1.7; return Math.min(1 + ((c+1)*Math.pow(t-1,3) + c*Math.pow(t-1,2)), 1.08); }
  function cl(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function p(s, n) { return cl((f-s)/(n-s), 0, 1); }
  function lerp(a, b, t) { return a + (b-a)*t; }
  function hash(i) { return (((i * 2654435761) >>> 0) % 10000) / 10000; }

  // ===== COLORS (FlowHunt palette from source) =====
  var C_PRI = '#1c64f2';
  var C_G100 = '#f3f4f6';
  var C_G200 = '#e5e7eb';
  var C_G300 = '#d1d5db';
  var C_G400 = '#9ca3af';
  var C_G500 = '#6b7280';
  var C_G600 = '#4b5563';
  var C_G900 = '#111827';
  var C_BG = '#EAECF1';

  // FlowHunt gradient colors
  var C_GR1 = '#984ad7';
  var C_GR2 = '#465ce0';
  var C_GR3 = '#0497dc';

  // ===== LAYOUT =====
  var TB = 52;
  var AX = W / 2;
  var AY = H - 56;

  // Brain center — centered in canvas, slightly above middle
  var CX = W / 2;
  var CY = TB + (H - TB) * 0.45;
  var BRANCH_R = Math.min(W, H) * 0.25;

  // ===== DEEP AGENT STATUS MESSAGES =====
  var STATUS_MSGS = [
    'Breaking down the problem...',
    'Planning analysis steps...',
    'Identifying data sources...',
    'Mapping execution strategy...',
    'Preparing agent tasks...'
  ];

  // ===== TASK DEFINITIONS =====
  var TASKS = [
    { label: 'Crawl Pages', desc: 'Crawl & index 50 pages', color: '#10b981', angle: -120, result: '47 pages indexed' },
    { label: 'SEO Analysis', desc: 'Analyze SEO metrics', color: C_PRI, angle: -60, result: 'Rankings pulled' },
    { label: 'Content Scoring', desc: 'Score content quality', color: '#f59e0b', angle: 0, result: '38 pages scored' },
    { label: 'Competitor Research', desc: 'Research competitors', color: '#ec4899', angle: 60, result: '5 competitors mapped' },
    { label: 'Strategy', desc: 'Generate optimization plan', color: C_GR1, angle: 120, result: 'Plan generated' }
  ];

  // Task timing constants
  var BRANCH_START = [360, 385, 410, 435, 460];
  var TASK_COMPLETE_START = [500, 535, 565, 595, 625];
  var TASK_COMPLETE_END = [530, 560, 590, 620, 650];

  // ===== PROMPT TEXT =====
  var PT = 'Analyze my top 50 landing pages and build a detailed SEO optimization plan with priorities';

  // ===== CAMERA =====
  var cS = 1, cTX = 0, cTY = 0;

  var aS = 1.5;
  var aTX = W/2 - AX * aS;
  var aTY = H * 0.6 - AY * aS;

  var aS2 = 1.6;
  var aTX2 = W/2 - AX * aS2;
  var aTY2 = H * 0.6 - AY * aS2;

  if (f < 20) {
    cS = 1; cTX = 0; cTY = 0;
  } else if (f < 60) {
    var t = eio(p(20, 60));
    cS = lerp(1, aS, t); cTX = lerp(0, aTX, t); cTY = lerp(0, aTY, t);
  } else if (f < 195) {
    var t = eio(p(60, 195));
    cS = lerp(aS, aS2, t); cTX = lerp(aTX, aTX2, t); cTY = lerp(aTY, aTY2, t);
  } else if (f < 260) {
    var t = eio(p(195, 260));
    cS = lerp(aS2, aS, t); cTX = lerp(aTX2, aTX, t); cTY = lerp(aTY2, aTY, t);
  } else if (f < 310) {
    var t = eio(p(260, 310));
    cS = lerp(aS, 1, t); cTX = lerp(aTX, 0, t); cTY = lerp(aTY, 0, t);
  } else {
    cS = 1; cTX = 0; cTY = 0;
  }

  // ===== TYPING =====
  var tc = 0;
  if (f >= 65 && f < 195) tc = Math.min(Math.floor((f - 65) * 0.72), PT.length);
  else if (f >= 195) tc = PT.length;
  var dt = PT.substring(0, tc);
  var cur = f >= 60 && f < 210 && Math.floor(f/12) % 2 === 0;

  // ===== LOADING STATE =====
  var loadGlow = 0;
  if (f >= 200 && f < 220) loadGlow = eo3(p(200, 220));
  else if (f >= 220 && f < 245) loadGlow = 1;
  else if (f >= 245 && f < 260) loadGlow = 1 - eo3(p(245, 260));
  var shP = -((f * 3) % 200);

  // Current status message (cycles every ~25 frames)
  var statusMsg = STATUS_MSGS[0];
  if (f >= 205) {
    statusMsg = STATUS_MSGS[Math.floor((f - 205) / 25) % STATUS_MSGS.length];
  }

  // Loading response area visibility
  var sR = f >= 205 && f < 260;
  var rO = sR ? (f < 218 ? eo3(p(205, 218)) : f < 248 ? 1 : 1 - eo3(p(248, 260))) : 0;

  // ===== TEXT BADGES =====
  var t1O = f < 20 ? (f < 8 ? eo3(p(0, 8)) : f < 14 ? 1 : 1 - eo3(p(14, 20))) : 0;
  var t6O = f >= 730 && f < 800 ? (f < 745 ? eo3(p(730, 745)) : f < 785 ? 1 : 1 - eo3(p(785, 800))) : 0;

  // ===== HIGHLIGHT =====
  var hlO = f >= 800 ? (f < 835 ? eo3(p(800, 835)) : 1) : 0;

  // ===== SVG HELPER =====
  function svg(w, h, vb, ch) {
    return e('svg', { width: w, height: h, viewBox: vb, fill: 'none', xmlns: 'http://www.w3.org/2000/svg' }, ch);
  }

  // ===== FLOWHUNT GRADIENT ICON =====
  function fhIcon(size) {
    return e('svg', { width: size, height: size, viewBox: '0 0 20 16.2', fill: 'none' },
      e('defs', null,
        e('linearGradient', { id: 'fhg', x1: '20', y1: '9.9', x2: '0', y2: '9.9',
          gradientTransform: 'translate(0 18) scale(1 -1)', gradientUnits: 'userSpaceOnUse' },
          e('stop', { offset: '0', stopColor: C_GR1 }),
          e('stop', { offset: '.5', stopColor: C_GR2 }),
          e('stop', { offset: '1', stopColor: C_GR3 })
        )
      ),
      e('path', {
        d: 'M2.6,12.7l-.9,2.1c-.2.4,0,.8.2,1.1.2.2.4.3.7.3s.5,0,.7-.3l.8-.8,3.2-3.2c.1-.1,0-.4-.2-.4h-1.8s0,0,0,0c-1.9,0-3.4-1.6-3.4-3.5,0-1.9,1.6-3.3,3.5-3.3h3.8c0,0,.1,0,.2,0l1.5-1.5c.1-.1,0-.4-.2-.4h-5.4C2.5,2.7,0,5.2,0,8.1c0,2,1.1,3.7,2.6,4.6h0ZM14.5,11.5c1.9,0,3.4-1.5,3.5-3.3,0-1.9-1.5-3.5-3.4-3.5s0,0,0,0h-1.8c-.2,0-.3-.3-.2-.4l3.3-3.3h0l.7-.7c.4-.4,1-.4,1.4,0,.3.3.4.8.3,1.1l-.9,2.1c1.6.9,2.6,2.6,2.6,4.6,0,3-2.5,5.4-5.5,5.4h-5.4c-.2,0-.3-.3-.2-.4l1.5-1.5s.1,0,.2,0h3.8,0ZM13.6,6.3c1,0,1.7.8,1.7,1.7s-.8,1.7-1.7,1.7-1.7-.8-1.7-1.7.8-1.7,1.7-1.7ZM6.5,6.3c1,0,1.7.8,1.7,1.7s-.8,1.7-1.7,1.7-1.7-.8-1.7-1.7.8-1.7,1.7-1.7Z',
        fill: 'url(#fhg)'
      })
    );
  }

  // ===== COLOR INTERPOLATION HELPER =====
  function lerp_color(c1, c2, t) {
    var r1 = parseInt(c1.slice(1,3), 16), g1 = parseInt(c1.slice(3,5), 16), b1 = parseInt(c1.slice(5,7), 16);
    var r2 = parseInt(c2.slice(1,3), 16), g2 = parseInt(c2.slice(3,5), 16), b2 = parseInt(c2.slice(5,7), 16);
    var r = Math.round(r1 + (r2 - r1) * t);
    var g = Math.round(g1 + (g2 - g1) * t);
    var b = Math.round(b1 + (b2 - b1) * t);
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  // ===== TOP BAR (FlowToolBarV3) =====
  function topBar() {
    return e('div', { key: 'tb', style: {
      position: 'absolute', top: 0, left: 0, width: W, height: TB,
      background: '#fff', borderBottom: '1px solid ' + C_G200,
      display: 'flex', alignItems: 'center', padding: '0 16px',
      zIndex: 10, boxSizing: 'border-box'
    }},
      e('div', { style: { display: 'flex', alignItems: 'center', gap: 16 }},
        e('div', { style: {
          display: 'flex', alignItems: 'center', gap: 4,
          padding: '6px 14px', borderRadius: 8,
          border: '1px solid ' + C_G300, background: '#fff',
          fontSize: 14, fontWeight: 500, color: C_G900
        }},
          svg(16, 16, '0 0 24 24', [
            e('path', { key: 'c', d: 'M15 6l-6 6 6 6', stroke: C_G600, strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' })
          ]),
          'Agents'
        ),
        e('div', { style: { display: 'flex', alignItems: 'center', gap: 4, fontSize: 14, color: C_G900 }},
          'Deep Agent \u2014 SEO Analysis',
          svg(14, 14, '0 0 24 24', [
            e('path', { key: 'd', d: 'M6 9l6 6 6-6', stroke: C_G500, strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' })
          ])
        )
      ),
      e('div', { style: { position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }},
        e('div', { style: {
          display: 'flex', alignItems: 'center', borderRadius: 9999,
          background: C_G100, padding: 4
        }},
          e('div', { style: {
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '5px 16px', borderRadius: 9999,
            background: C_G900,
            fontSize: 14, fontWeight: 500
          }},
            svg(14, 14, '0 0 24 24', [
              e('path', { key: 'p', d: 'M4 20h4l10.5-10.5a2.121 2.121 0 00-3-3L5 17v3h0z',
                stroke: '#fff', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round', fill: 'none' })
            ]),
            e('span', { style: { color: '#fff' } }, 'Edit')
          ),
          e('div', { style: {
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '5px 16px', borderRadius: 9999,
            background: 'transparent',
            fontSize: 14, fontWeight: 500
          }},
            svg(14, 14, '0 0 24 24', [
              e('path', { key: 'p', d: 'M7 4v16l13-8z', stroke: C_G600, strokeWidth: '2',
                strokeLinecap: 'round', strokeLinejoin: 'round', fill: 'none' })
            ]),
            e('span', { style: { color: C_G600 } }, 'Run')
          )
        )
      ),
      e('div', { style: { marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }},
        e('div', { style: { display: 'flex', alignItems: 'center', gap: 4, fontSize: 14, color: C_G500, marginRight: 4 }},
          svg(18, 18, '0 0 24 24', [
            e('circle', { key: 'c', cx: '12', cy: '12', r: '10', fill: '#15803d' }),
            e('path', { key: 'p', d: 'M8 12l3 3 5-5', stroke: '#fff', strokeWidth: '2.5', strokeLinecap: 'round', strokeLinejoin: 'round' })
          ]),
          'Saved'
        ),
        e('div', { style: {
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '6px 12px', borderRadius: 8,
          border: '1px solid ' + C_G300, background: '#fff',
          fontSize: 14, color: C_G600
        }},
          svg(14, 14, '0 0 24 24', [
            e('path', { key: 'h', d: 'M12 8v4l2 2', stroke: C_G500, strokeWidth: '2', strokeLinecap: 'round', fill: 'none' }),
            e('path', { key: 'h2', d: 'M3.05 11a9 9 0 1 1 .5 4m-.5 5v-5h5', stroke: C_G500, strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round', fill: 'none' })
          ]),
          'History',
          e('span', { style: { background: C_G100, padding: '2px 8px', borderRadius: 6, fontSize: 12, color: C_G900 }}, 'Version: 2')
        ),
        e('div', { style: { width: 1, height: 32, background: C_G200, margin: '0 4px' }}),
        e('div', { style: {
          padding: '6px 16px', borderRadius: 8,
          background: C_PRI, color: '#fff',
          fontSize: 14, fontWeight: 600
        }}, 'Publish')
      )
    );
  }

  // ===== FLOATING SIDEBAR (FlowSidebarV3) =====
  function floatingSidebar() {
    return e('div', { key: 'fs', style: {
      position: 'absolute', top: TB + 16, left: 16, zIndex: 8,
      display: 'flex', gap: 8, alignItems: 'center'
    }},
      e('div', { style: {
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '6px 12px', borderRadius: 8,
        border: '1px solid ' + C_G300, background: '#fff',
        fontSize: 13, fontWeight: 500, color: C_G900,
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
      }},
        svg(14, 14, '0 0 24 24', [
          e('path', { key: 'c1', d: 'M3 12l3 3 3-3-3-3z', stroke: C_G600, strokeWidth: '1.8', fill: 'none', strokeLinejoin: 'round' }),
          e('path', { key: 'c2', d: 'M15 12l3 3 3-3-3-3z', stroke: C_G600, strokeWidth: '1.8', fill: 'none', strokeLinejoin: 'round' }),
          e('path', { key: 'c3', d: 'M9 6l3 3 3-3-3-3z', stroke: C_G600, strokeWidth: '1.8', fill: 'none', strokeLinejoin: 'round' }),
          e('path', { key: 'c4', d: 'M9 18l3 3 3-3-3-3z', stroke: C_G600, strokeWidth: '1.8', fill: 'none', strokeLinejoin: 'round' })
        ]),
        'Components'
      ),
      e('div', { style: { display: 'flex' }},
        e('div', { style: {
          padding: '6px 8px', borderRadius: '8px 0 0 8px',
          border: '1px solid ' + C_G300, background: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
        }},
          svg(14, 14, '0 0 24 24', [
            e('path', { key: 'u', d: 'M9 14l-4-4 4-4', stroke: C_G500, strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round', fill: 'none' }),
            e('path', { key: 'u2', d: 'M5 10h11a4 4 0 110 8h-1', stroke: C_G500, strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round', fill: 'none' })
          ])
        ),
        e('div', { style: {
          padding: '6px 8px', borderRadius: '0 8px 8px 0',
          border: '1px solid ' + C_G300, borderLeft: 'none', background: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
        }},
          svg(14, 14, '0 0 24 24', [
            e('path', { key: 'r', d: 'M15 14l4-4-4-4', stroke: C_G500, strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round', fill: 'none' }),
            e('path', { key: 'r2', d: 'M19 10H8a4 4 0 100 8h1', stroke: C_G500, strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round', fill: 'none' })
          ])
        )
      )
    );
  }

  // ===== CANVAS BACKGROUND =====
  function canvasBg() {
    return e('div', { key: 'cv', style: {
      position: 'absolute', top: TB, left: 0, width: W, height: H - TB, background: C_BG
    }},
      e('div', { style: {
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(circle, ' + C_G300 + ' 1px, transparent 1px)',
        backgroundSize: '24px 24px', opacity: 0.6
      }})
    );
  }

  // ===== ZOOM CONTROLS =====
  function zoomCtrls() {
    var btn = function(label, k) {
      return e('div', { key: k, style: {
        width: 28, height: 28, background: '#fff', border: '1px solid ' + C_G200,
        borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 14, color: C_G500
      }}, label);
    };
    return e('div', { key: 'zc', style: {
      position: 'absolute', bottom: 100, left: 16, display: 'flex',
      flexDirection: 'column', gap: 2, zIndex: 8
    }}, btn('+', 'z1'), btn('\u2013', 'z2'), btn('\u2637', 'z3'));
  }

  // ===== BADGE =====
  function badge(text, yPos, op, extra) {
    if (op <= 0) return null;
    var s = {
      position: 'absolute', left: '50%', top: yPos,
      transform: 'translateX(-50%) translateY(' + ((1-op)*14) + 'px)',
      opacity: op, background: 'linear-gradient(135deg,#1c64f2,#3b82f6)',
      color: '#fff', padding: '10px 28px', borderRadius: 10,
      fontSize: 16, fontWeight: 600, zIndex: 30,
      letterSpacing: '0.2px', whiteSpace: 'nowrap',
      boxShadow: '0 4px 20px rgba(28,100,242,0.3)'
    };
    if (extra) { for (var k in extra) { s[k] = extra[k]; } }
    return e('div', { key: 'b-' + text.substring(0, 8), style: s }, text);
  }

  // ===== FLOW ASSISTANT INPUT (Deep Agent prompt) =====
  function flowAssist() {
    var phV = tc === 0 && f < 60;
    var isExpanded = f >= 55;
    var showShimmer = f >= 200 && f < 260;

    // Animate width expansion
    var aW;
    if (sR) { aW = 800; }
    else if (f >= 50 && f < 67) { aW = lerp(640, 800, eo3(p(50, 67))); }
    else if (f >= 67) { aW = 800; }
    else { aW = 640; }
    var bR = sR ? 16 : 9999;

    // Pulsing glow during loading
    var glowPulse = Math.sin(f * 0.12) * 0.5 + 0.5;
    var glowShadow;
    if (loadGlow > 0) {
      var g1 = (20 + glowPulse * 25) * loadGlow;
      var g2 = (40 + glowPulse * 30) * loadGlow;
      var g3 = (60 + glowPulse * 20) * loadGlow;
      glowShadow = '0 0 ' + g1 + 'px rgba(70,92,224,' + (0.35 * loadGlow) + '),' +
        '0 0 ' + g2 + 'px rgba(152,74,215,' + (0.2 * loadGlow) + '),' +
        '0 0 ' + g3 + 'px rgba(4,151,220,' + (0.12 * loadGlow) + '),' +
        '0 4px 24px rgba(0,0,0,0.12)';
    } else {
      glowShadow = '0 4px 20px rgba(0,0,0,0.1), 0 2px 6px rgba(0,0,0,0.06)';
    }

    var borderCol = loadGlow > 0
      ? '2px solid rgba(70,92,224,' + (0.5 * loadGlow) + ')'
      : 'none';

    return e('div', { key: 'fa', style: {
      position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)',
      width: aW, zIndex: 10
    }},
      e('div', { style: {
        overflow: 'hidden', background: C_G100, borderRadius: bR,
        boxShadow: glowShadow,
        border: borderCol
      }},
        // Response area — vibrant loading
        sR ? e('div', { style: {
          borderBottom: '1px solid ' + C_G200, padding: 16, opacity: rO
        }},
          e('div', { style: { display: 'flex', alignItems: 'flex-start', gap: 12 }},
            e('div', { style: {
              width: 32, height: 32, borderRadius: 16, background: C_G200,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              boxShadow: '0 0 ' + (6 + glowPulse * 10) + 'px rgba(70,92,224,' + (0.4 * loadGlow) + ')',
              transform: 'scale(' + (1 + glowPulse * 0.06 * loadGlow) + ')'
            }}, fhIcon(18)),
            e('div', { style: { flex: 1 }},
              e('div', { style: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }},
                e('div', { style: {
                  width: 16, height: 16, borderRadius: 8,
                  border: '2.5px solid ' + C_G200,
                  borderTopColor: C_GR2,
                  borderRightColor: C_GR1,
                  transform: 'rotate(' + (f * 9) + 'deg)'
                }}),
                e('span', { style: {
                  fontSize: 14, fontWeight: 500,
                  background: 'linear-gradient(90deg,' + C_G500 + ' 0%,' + C_G500 + ' 30%,' + C_GR1 + ' 42%,' + C_GR2 + ' 50%,' + C_GR3 + ' 58%,' + C_G500 + ' 70%,' + C_G500 + ' 100%)',
                  backgroundSize: '200% 100%',
                  backgroundPosition: shP + '% 0',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}, statusMsg)
              ),
              e('div', { style: {
                height: 3, borderRadius: 2, marginBottom: 10,
                background: C_G200, overflow: 'hidden'
              }},
                e('div', { style: {
                  height: '100%', borderRadius: 2,
                  width: (Math.min(p(205, 255), 0.92) * 100) + '%',
                  background: 'linear-gradient(90deg, ' + C_GR1 + ', ' + C_GR2 + ', ' + C_GR3 + ')',
                  backgroundSize: '300% 100%',
                  backgroundPosition: (-shP * 0.5) + '% 0'
                }})
              ),
              e('div', { style: { display: 'flex', flexDirection: 'column', gap: 6 }},
                e('div', { style: { height: 10, borderRadius: 5, width: '80%',
                  background: 'linear-gradient(90deg,' + C_G200 + ' 0%,' + C_GR3 + '33 30%,' + C_G200 + ' 50%,' + C_GR2 + '33 70%,' + C_G200 + ' 100%)',
                  backgroundSize: '200% 100%', backgroundPosition: shP + '% 0' }}),
                e('div', { style: { height: 10, borderRadius: 5, width: '55%',
                  background: 'linear-gradient(90deg,' + C_G200 + ' 0%,' + C_GR1 + '33 30%,' + C_G200 + ' 50%,' + C_GR3 + '33 70%,' + C_G200 + ' 100%)',
                  backgroundSize: '200% 100%', backgroundPosition: (shP - 30) + '% 0' }}),
                e('div', { style: { height: 10, borderRadius: 5, width: '40%',
                  background: 'linear-gradient(90deg,' + C_G200 + ' 0%,' + C_GR2 + '33 30%,' + C_G200 + ' 50%,' + C_GR1 + '33 70%,' + C_G200 + ' 100%)',
                  backgroundSize: '200% 100%', backgroundPosition: (shP - 60) + '% 0' }})
              )
            )
          )
        ) : null,
        // Input area
        e('div', { style: {
          display: 'flex', alignItems: 'center', gap: 10, padding: '12px 24px'
        }},
          showShimmer ?
            e('div', { style: {
              flex: 1, fontSize: 14,
              background: 'linear-gradient(90deg,' + C_G400 + ' 0%,' + C_G400 + ' 28%,' + C_GR1 + ' 40%,' + C_GR2 + ' 50%,' + C_GR3 + ' 60%,' + C_G400 + ' 72%,' + C_G400 + ' 100%)',
              backgroundSize: '200% 100%',
              backgroundPosition: shP + '% 0',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}, PT) :
            e('div', { style: {
              flex: 1, fontSize: 14, color: phV ? C_G500 : C_G900,
              lineHeight: '1.5', minHeight: 20
            }},
              phV ? 'Ask AI...' : e('span', null, dt, cur ? e('span', { style: { color: C_PRI, fontWeight: 700 } }, '|') : null)
            ),
          !isExpanded ? e('span', { style: {
            padding: '2px 6px', borderRadius: 4,
            border: '1px solid ' + C_G300, background: '#fff',
            fontSize: 12, fontWeight: 500, color: C_G500
          }}, 'Ctrl+K') : null,
          isExpanded ? e('div', { style: {
            width: 32, height: 32, borderRadius: 16,
            background: tc > 0 ? C_PRI : C_G300,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
          }},
            svg(16, 16, '0 0 24 24', [
              e('path', { key: 'a', d: 'M12 19V5m0 0l-7 7m7-7l7 7', stroke: '#fff', strokeWidth: '2.5', strokeLinecap: 'round', strokeLinejoin: 'round' })
            ])
          ) : null
        )
      )
    );
  }

  // ===== LOADING PARTICLES (rising sparkles, dripping drops, ring pulses) =====
  function loadingParticles() {
    if (f < 205 || f >= 260) return null;
    var pO = f < 218 ? eo3(p(205, 218)) : f < 248 ? 1 : 1 - eo3(p(248, 260));
    if (pO <= 0) return null;

    var children = [];
    var colors = [C_GR1, C_GR2, C_GR3, C_PRI, '#3b82f6', '#60a5fa'];

    // Rising sparkles
    for (var i = 0; i < 16; i++) {
      var seed = hash(i + 100);
      var speed = 0.4 + seed * 1.0;
      var xOff = (hash(i + 200) - 0.5) * 500;
      var phase = ((f - 205) * speed + seed * 180) % 110;
      var yOff = -phase * 2.2;
      var fadeIn = Math.min(phase / 12, 1);
      var fadeOut = Math.max(0, 1 - (phase - 70) / 40);
      var alpha = fadeIn * fadeOut * pO;
      var size = 2 + seed * 5;
      var color = colors[i % colors.length];
      var wobble = Math.sin(phase * 0.15 + seed * 6.28) * 15;

      children.push(e('div', { key: 'sp' + i, style: {
        position: 'absolute',
        left: AX + xOff + wobble - size / 2,
        top: AY + 10 + yOff,
        width: size, height: size,
        borderRadius: '50%',
        background: color,
        opacity: alpha * 0.7,
        boxShadow: '0 0 ' + (size * 2) + 'px ' + color + '60',
        zIndex: 9
      }}));
    }

    // Dripping drops
    for (var j = 0; j < 8; j++) {
      var dSeed = hash(j + 500);
      var dX = AX - 200 + (j / 7) * 400;
      var dSpeed = 0.3 + dSeed * 0.6;
      var dPhase = ((f - 205) * dSpeed + dSeed * 120) % 90;
      var dY = AY + 35 + dPhase * 2;
      var dFadeIn = Math.min(dPhase / 10, 1);
      var dFadeOut = Math.max(0, 1 - (dPhase - 50) / 40);
      var dAlpha = dFadeIn * dFadeOut * pO;
      var dSize = 2 + dSeed * 3;
      var dColor = colors[j % colors.length];
      var tailLen = Math.min(dPhase * 0.5, 14);

      children.push(e('div', { key: 'dr' + j, style: {
        position: 'absolute',
        left: dX - dSize / 2,
        top: dY,
        width: dSize,
        height: dSize + tailLen,
        borderRadius: dSize / 2,
        background: 'linear-gradient(to bottom, ' + dColor + ', transparent)',
        opacity: dAlpha * 0.5,
        zIndex: 9
      }}));
    }

    // Expanding ring pulses
    for (var r = 0; r < 3; r++) {
      var rPhase = ((f - 205 + r * 30) % 90);
      var rScale = 0.5 + (rPhase / 90) * 1.5;
      var rAlpha = (1 - rPhase / 90) * pO * 0.15;
      if (rAlpha > 0) {
        children.push(e('div', { key: 'rng' + r, style: {
          position: 'absolute',
          left: AX - 200 * rScale,
          top: AY - 30 * rScale,
          width: 400 * rScale,
          height: 60 * rScale,
          borderRadius: '50%',
          border: '2px solid ' + C_GR2,
          opacity: rAlpha,
          zIndex: 8
        }}));
      }
    }

    return e('div', { key: 'lparts', style: {
      position: 'absolute', top: 0, left: 0, width: W, height: H,
      pointerEvents: 'none', zIndex: 9
    }}, children);
  }

  // ===== CENTRAL BRAIN NODE =====
  function brainNode() {
    if (f < 260) return null;

    var brainScale = f < 310 ? eob(p(260, 310)) : 1;
    var brainOp = f < 290 ? eo3(p(260, 290)) : 1;

    // Convergence: brain turns green after all tasks complete
    var isComplete = f >= 700;
    var greenT = isComplete ? (f < 730 ? eo3(p(700, 730)) : 1) : 0;
    var brainSize = 60 + (isComplete ? greenT * 8 : 0);

    var gradFrom = isComplete ? lerp_color('#984ad7', '#10b981', greenT) : C_GR1;
    var gradMid = isComplete ? lerp_color('#465ce0', '#059669', greenT) : C_GR2;
    var gradTo = isComplete ? lerp_color('#0497dc', '#34d399', greenT) : C_GR3;

    var labelText = isComplete ? 'Analysis Complete' : 'Deep Agent';
    var labelColor = isComplete ? '#10b981' : C_GR2;

    var children = [];

    // Pulse rings — 3 concentric, staggered by 30 frames, fade out as they expand
    if (f >= 260 && f < 700) {
      for (var r = 0; r < 3; r++) {
        var rPhase = ((f - 260 + r * 30) % 90) / 90;
        var rRadius = 40 + rPhase * 120;
        var rAlpha = (1 - rPhase) * 0.25 * brainOp;
        if (rAlpha > 0.01) {
          children.push(e('div', { key: 'pr' + r, style: {
            position: 'absolute',
            left: CX - rRadius,
            top: CY - rRadius,
            width: rRadius * 2,
            height: rRadius * 2,
            borderRadius: '50%',
            border: '2px solid ' + C_GR2,
            opacity: rAlpha,
            pointerEvents: 'none'
          }}));
        }
      }
    }

    // Completion ring (convergence phase 680-730)
    if (f >= 680 && f < 730) {
      var crPhase = p(680, 730);
      var crRadius = 40 + crPhase * 250;
      var crAlpha = (1 - crPhase) * 0.4;
      children.push(e('div', { key: 'compring', style: {
        position: 'absolute',
        left: CX - crRadius,
        top: CY - crRadius,
        width: crRadius * 2,
        height: crRadius * 2,
        borderRadius: '50%',
        border: '3px solid ' + C_GR2,
        opacity: crAlpha,
        pointerEvents: 'none'
      }}));
    }

    // Brain circle with gradient fill
    children.push(e('div', { key: 'brain', style: {
      position: 'absolute',
      left: CX - brainSize / 2,
      top: CY - brainSize / 2,
      width: brainSize,
      height: brainSize,
      borderRadius: '50%',
      background: 'linear-gradient(135deg, ' + gradFrom + ', ' + gradMid + ', ' + gradTo + ')',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      transform: 'scale(' + brainScale + ')',
      opacity: brainOp,
      boxShadow: '0 0 30px ' + (isComplete ? 'rgba(16,185,129,0.4)' : 'rgba(70,92,224,0.35)') + ', 0 4px 20px rgba(0,0,0,0.15)',
      zIndex: 6
    }},
      fhIcon(28)
    ));

    // Label below brain
    children.push(e('div', { key: 'blbl', style: {
      position: 'absolute',
      left: CX - 80,
      top: CY + brainSize / 2 + 10,
      width: 160,
      textAlign: 'center',
      fontSize: 14,
      fontWeight: 600,
      color: labelColor,
      opacity: brainOp,
      transform: 'scale(' + brainScale + ')'
    }}, labelText));

    return e('div', { key: 'braingrp', style: {
      position: 'absolute', top: 0, left: 0, width: W, height: H,
      pointerEvents: 'none', zIndex: 5
    }}, children);
  }

  // ===== THINKING PHASE — ORBITING PARTICLES =====
  function thinkingParticles() {
    if (f < 310 || f > 480) return null;
    var tO = 1;
    if (f < 330) tO = eo3(p(310, 330));
    else if (f > 460) tO = 1 - eo3(p(460, 480));

    var children = [];
    var pColors = [C_GR1, C_GR2, C_GR3, C_PRI, C_GR1, C_GR2, C_GR3, C_PRI, C_GR1, C_GR2];

    for (var i = 0; i < 10; i++) {
      var seed = hash(i + 50);
      var speed = 0.04 + seed * 0.03;
      var angle = (f - 310) * speed + seed * Math.PI * 2;
      var radius = 60 + Math.sin(angle * 0.3) * 20;
      var px = CX + Math.cos(angle) * radius;
      var py = CY + Math.sin(angle) * radius * 0.6;
      var pSize = 3 + hash(i) * 4;
      var pAlpha = (0.4 + Math.sin(angle) * 0.3) * tO;
      var pColor = pColors[i];

      children.push(e('div', { key: 'tp' + i, style: {
        position: 'absolute',
        left: px - pSize / 2,
        top: py - pSize / 2,
        width: pSize, height: pSize,
        borderRadius: '50%',
        background: pColor,
        opacity: pAlpha,
        boxShadow: '0 0 ' + (pSize * 3) + 'px ' + pColor + '80',
        zIndex: 7
      }}));
    }

    return e('div', { key: 'thinkp', style: {
      position: 'absolute', top: 0, left: 0, width: W, height: H,
      pointerEvents: 'none', zIndex: 7
    }}, children);
  }

  // ===== SCANNING LINE (thinking phase) =====
  function scanningLine() {
    if (f < 310 || f > 480) return null;
    var sO = 1;
    if (f < 325) sO = eo3(p(310, 325));
    else if (f > 465) sO = 1 - eo3(p(465, 480));

    var canvasH = H - TB;
    var lineY = TB + ((f - 310) * 4) % canvasH;

    return e('div', { key: 'scanline', style: {
      position: 'absolute',
      left: 0,
      top: lineY,
      width: W,
      height: 2,
      background: 'linear-gradient(90deg, transparent, ' + C_GR2 + '40, transparent)',
      opacity: sO * 0.6,
      pointerEvents: 'none',
      zIndex: 4
    }});
  }

  // ===== TASK BRANCHES (Planning + Execution + Convergence) =====
  function taskBranches() {
    if (f < 360) return null;
    var children = [];

    for (var i = 0; i < 5; i++) {
      var bStart = BRANCH_START[i];
      if (f < bStart) continue;

      var task = TASKS[i];
      var angleRad = task.angle * Math.PI / 180;
      var tX = CX + Math.cos(angleRad) * BRANCH_R;
      var tY = CY + Math.sin(angleRad) * BRANCH_R;

      // Branch line draw progress (25 frames to draw)
      var lineP = f < bStart + 25 ? eio(p(bStart, bStart + 25)) : 1;

      // Task card scale-in (bouncy, starts 10 frames after branch drawing begins)
      var cardStart = bStart + 10;
      var cardScale = f >= cardStart ? (f < cardStart + 20 ? eob(p(cardStart, cardStart + 20)) : 1) : 0;
      var cardOp = f >= cardStart ? (f < cardStart + 15 ? eo3(p(cardStart, cardStart + 15)) : 1) : 0;

      // Task completion
      var tCompleteStart = TASK_COMPLETE_START[i];
      var tCompleteEnd = TASK_COMPLETE_END[i];
      var isTaskComplete = f >= tCompleteEnd;
      var progressP = 0;
      if (f >= tCompleteStart && f < tCompleteEnd) {
        progressP = eo3(p(tCompleteStart, tCompleteEnd));
      } else if (f >= tCompleteEnd) {
        progressP = 1;
      }

      // Checkmark
      var checkOp = f >= tCompleteEnd ? (f < tCompleteEnd + 12 ? eo3(p(tCompleteEnd, tCompleteEnd + 12)) : 1) : 0;

      // Result label
      var resultOp = f >= tCompleteEnd + 5 ? (f < tCompleteEnd + 18 ? eo3(p(tCompleteEnd + 5, tCompleteEnd + 18)) : 1) : 0;

      // Card glow on completion
      var glowIntensity = 0;
      if (f >= tCompleteEnd && f < tCompleteEnd + 20) {
        glowIntensity = 1 - eo3(p(tCompleteEnd, tCompleteEnd + 20));
      }

      // Branch line pulsing during convergence (680-730)
      var linePulse = 0;
      if (f >= 680 && f < 730) {
        linePulse = Math.sin((f - 680) * 0.3) * 0.5 + 0.5;
      }

      // === Dashed connection line ===
      var lineLen = BRANCH_R * lineP;
      var lineColor = linePulse > 0 ? task.color : C_G300;
      var lineOpacity = linePulse > 0 ? 0.5 + linePulse * 0.5 : 0.8;

      children.push(e('div', { key: 'bl' + i, style: {
        position: 'absolute',
        left: CX,
        top: CY,
        width: lineLen,
        height: 0,
        borderTop: '2px dashed ' + lineColor,
        opacity: lineOpacity,
        transformOrigin: '0 0',
        transform: 'rotate(' + task.angle + 'deg)',
        zIndex: 3
      }}));

      // === Data dots flowing along branch (execution phase 480-680, convergence 680-730) ===
      if (f >= 480 && f < 730 && lineP >= 1) {
        var isConverging = f >= 680;
        for (var d = 0; d < 4; d++) {
          var dotPhase = ((f - 480 + d * 25) % 100) / 100;
          var dotPos = isConverging ? (1 - dotPhase) : dotPhase;
          var dotX = lerp(CX, tX, dotPos);
          var dotY = lerp(CY, tY, dotPos);
          var dotAlpha = Math.sin(dotPhase * Math.PI) * 0.8;
          if (isConverging && !isTaskComplete) dotAlpha *= 0.3;

          children.push(e('div', { key: 'dd' + i + '-' + d, style: {
            position: 'absolute',
            left: dotX - 3,
            top: dotY - 3,
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: task.color,
            opacity: dotAlpha,
            boxShadow: '0 0 10px ' + task.color + '90',
            zIndex: 7
          }}));
        }
      }

      // === Task card ===
      var CARD_W = 160;
      var CARD_H = 50;
      var cardLeft = tX - CARD_W / 2;
      var cardTop = tY - CARD_H / 2;

      var cardShadow = glowIntensity > 0
        ? '0 0 ' + (15 + glowIntensity * 15) + 'px ' + task.color + Math.round(glowIntensity * 60).toString(16).padStart(2, '0') + ', 0 2px 8px rgba(0,0,0,0.08)'
        : '0 2px 8px rgba(0,0,0,0.08)';

      if (cardOp > 0) {
        children.push(e('div', { key: 'tc' + i, style: {
          position: 'absolute',
          left: cardLeft,
          top: cardTop,
          width: CARD_W,
          height: CARD_H,
          borderRadius: 10,
          background: '#fff',
          border: '1.5px solid ' + task.color + '40',
          boxShadow: cardShadow,
          transform: 'scale(' + cardScale + ')',
          opacity: cardOp,
          overflow: 'hidden',
          zIndex: 6,
          boxSizing: 'border-box'
        }},
          // Card content
          e('div', { style: {
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 10px', height: CARD_H - 3, boxSizing: 'border-box'
          }},
            // Colored dot indicator
            e('div', { style: {
              width: 10, height: 10, borderRadius: '50%',
              background: task.color, flexShrink: 0,
              boxShadow: '0 0 6px ' + task.color + '60'
            }}),
            // Labels
            e('div', { style: { flex: 1, minWidth: 0 }},
              e('div', { style: { fontSize: 11, fontWeight: 600, color: C_G900, lineHeight: '1.2' }}, task.label),
              e('div', { style: { fontSize: 9, color: C_G500, marginTop: 2, lineHeight: '1.2' }}, task.desc)
            ),
            // Checkmark circle
            checkOp > 0 ? e('div', { style: {
              opacity: checkOp, flexShrink: 0,
              transform: 'scale(' + (checkOp < 1 ? eob(checkOp) : 1) + ')'
            }},
              svg(16, 16, '0 0 24 24', [
                e('circle', { key: 'bg', cx: '12', cy: '12', r: '10', fill: '#10b981' }),
                e('path', { key: 'ck', d: 'M7 12l4 4 6-7', stroke: '#fff', strokeWidth: '2.5', strokeLinecap: 'round', strokeLinejoin: 'round', fill: 'none' })
              ])
            ) : null
          ),
          // Progress bar at bottom of card
          progressP > 0 ? e('div', { style: {
            position: 'absolute', bottom: 0, left: 0, width: '100%', height: 3
          }},
            e('div', { style: {
              height: '100%', borderRadius: '0 2px 2px 0',
              width: (progressP * 100) + '%',
              background: 'linear-gradient(90deg, ' + task.color + '80, ' + task.color + ')'
            }})
          ) : null
        ));

        // Result label below card
        if (resultOp > 0) {
          children.push(e('div', { key: 'rl' + i, style: {
            position: 'absolute',
            left: tX - 60,
            top: tY + CARD_H / 2 + 6,
            width: 120,
            textAlign: 'center',
            fontSize: 10,
            fontWeight: 500,
            color: '#10b981',
            opacity: resultOp,
            transform: 'translateY(' + ((1 - resultOp) * 6) + 'px)'
          }}, task.result));
        }
      }
    }

    return e('div', { key: 'branches', style: {
      position: 'absolute', top: 0, left: 0, width: W, height: H,
      pointerEvents: 'none', zIndex: 5
    }}, children);
  }

  // ===== RESULT CARD =====
  function resultCard() {
    if (f < 730) return null;
    var rcScale = f < 760 ? eob(p(730, 760)) : 1;
    var rcOp = f < 745 ? eo3(p(730, 745)) : 1;

    return e('div', { key: 'rcard', style: {
      position: 'absolute',
      left: CX - 160,
      top: CY + 80,
      width: 320,
      borderRadius: 12,
      background: '#fff',
      borderLeft: '4px solid #10b981',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.06)',
      padding: '14px 18px',
      transform: 'scale(' + rcScale + ')',
      opacity: rcOp,
      zIndex: 8,
      boxSizing: 'border-box'
    }},
      e('div', { style: { fontSize: 14, fontWeight: 600, color: C_G900, marginBottom: 6 }}, '\uD83D\uDCC4 SEO Optimization Plan'),
      e('div', { style: { fontSize: 12, color: C_G500, marginBottom: 10 }}, '47 pages \u2022 12 issues \u2022 5 quick wins'),
      e('div', { style: {
        display: 'inline-block',
        padding: '4px 12px', borderRadius: 6,
        background: '#ecfdf5', color: '#059669',
        fontSize: 11, fontWeight: 600
      }}, 'Ready to review')
    );
  }

  // ===== HIGHLIGHT OVERLAY =====
  function highlight() {
    if (hlO <= 0) return null;
    return e('div', { key: 'hl', style: {
      position: 'absolute', top: 0, left: 0, width: W, height: H,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(8,8,24,' + (0.7 * hlO) + ')', zIndex: 50
    }},
      e('div', { style: { opacity: hlO, transform: 'translateY(' + ((1-hlO)*30) + 'px)' }},
        e('div', { style: { fontSize: 56, fontWeight: 800, color: '#fff', textAlign: 'center', letterSpacing: '-0.5px', lineHeight: '1.3', maxWidth: 900 }},
          e('span', { style: { background: 'linear-gradient(135deg,' + C_GR1 + ',' + C_GR2 + ',' + C_GR3 + ')', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } }, 'Deep Agent')
        ),
        e('div', { style: { marginTop: 20, fontSize: 18, color: 'rgba(255,255,255,0.55)', fontWeight: 400, textAlign: 'center' } }, 'Give it a goal. Get a strategy.')
      )
    );
  }

  // ===== RENDER =====
  return e('div', { style: {
    position: 'relative', width: W, height: H, overflow: 'hidden',
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    background: C_BG
  }},
    // Camera transform wrapper
    e('div', { style: {
      position: 'absolute', width: W, height: H,
      transformOrigin: '0 0',
      transform: 'translate(' + cTX + 'px,' + cTY + 'px) scale(' + cS + ')',
      willChange: 'transform'
    }},
      canvasBg(),
      topBar(),
      floatingSidebar(),
      zoomCtrls(),
      scanningLine(),
      brainNode(),
      thinkingParticles(),
      taskBranches(),
      resultCard(),
      loadingParticles(),
      flowAssist()
    ),
    badge('FlowHunt Deep Agent', 50, t1O, { fontSize: 20, letterSpacing: '0.5px', background: 'linear-gradient(135deg,' + C_GR1 + ',' + C_GR2 + ',' + C_GR3 + ')' }),
    badge('From goal to strategy \u2014 in seconds', 50, t6O, { background: 'linear-gradient(135deg,#10b981,#059669)', boxShadow: '0 4px 20px rgba(16,185,129,0.3)' }),
    highlight()
  );
}
