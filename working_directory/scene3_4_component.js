function DeepAgentMultiScene(props) {
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
  var C_AGT = '#BF125D';
  var C_GR1 = '#984ad7';
  var C_GR2 = '#465ce0';
  var C_GR3 = '#0497dc';

  // ===== LAYOUT =====
  var TB = 52;
  var AX = W / 2;
  var AY = H - 56;

  // Brain center
  var CX = 960, CY = 350;
  // Leader card above brain
  var LX = 960, LY = 220;
  // Child cards in 2x2 grid around brain
  var C1X = 640, C1Y = 450;
  var C2X = 1280, C2Y = 450;
  var C3X = 640, C3Y = 650;
  var C4X = 1280, C4Y = 650;
  var LW = 280, CW = 220, CH = 64;

  // ===== PROMPT TEXT =====
  var PT = 'Analyze my top 50 landing pages and build a detailed SEO optimization plan with priorities';

  // ===== STATUS MESSAGES =====
  var STATUS_MSGS = [
    'Breaking down the problem...',
    'Planning analysis steps...',
    'Identifying data sources...',
    'Mapping execution strategy...',
    'Preparing agent tasks...'
  ];

  // ===== CAMERA =====
  var cS = 1, cTX = 0, cTY = 0;

  // Prompt zoom targets
  var aS = 1.5;
  var aTX = W/2 - AX * aS;
  var aTY = H * 0.6 - AY * aS;
  var aS2 = 1.6;
  var aTX2 = W/2 - AX * aS2;
  var aTY2 = H * 0.6 - AY * aS2;

  // Agent card zoom targets (2x zoom)
  var sc = 2.0;
  var lTX = W/2 - LX*sc, lTY = H/2 - LY*sc;
  var c1TX = W/2 - C1X*sc, c1TY = H/2 - C1Y*sc;
  var c2TX = W/2 - C2X*sc, c2TY = H/2 - C2Y*sc;
  var c3TX = W/2 - C3X*sc, c3TY = H/2 - C3Y*sc;
  var c4TX = W/2 - C4X*sc, c4TY = H/2 - C4Y*sc;

  // Phase 1: Prompt Input (f0-220)
  if (f < 15) {
    cS = 1; cTX = 0; cTY = 0;
  } else if (f < 55) {
    // Zoom to prompt input
    var t = eio(p(15, 55));
    cS = lerp(1, aS, t); cTX = lerp(0, aTX, t); cTY = lerp(0, aTY, t);
  } else if (f < 185) {
    // Subtle zoom during typing
    var t = eio(p(55, 185));
    cS = lerp(aS, aS2, t); cTX = lerp(aTX, aTX2, t); cTY = lerp(aTY, aTY2, t);
  } else if (f < 220) {
    // Hold during loading
    cS = aS2; cTX = aTX2; cTY = aTY2;
  }
  // Phase 2: Brain Appears (f220-380)
  else if (f < 280) {
    // Zoom out to full canvas
    var t = eio(p(220, 280));
    cS = lerp(aS2, 1, t); cTX = lerp(aTX2, 0, t); cTY = lerp(aTY2, 0, t);
  } else if (f < 380) {
    cS = 1; cTX = 0; cTY = 0;
  }
  // Phase 3: Agent Team Assembly (f380-560) - zoom to each agent as it appears
  else if (f < 400) {
    // Zoom to leader
    var t = eio(p(380, 400));
    cS = lerp(1, sc, t); cTX = lerp(0, lTX, t); cTY = lerp(0, lTY, t);
  } else if (f < 430) {
    // Pan to C1 (Research Keywords)
    var t = eio(p(400, 430));
    cS = sc; cTX = lerp(lTX, c1TX, t); cTY = lerp(lTY, c1TY, t);
  } else if (f < 460) {
    // Pan to C2 (Competitors Analysis)
    var t = eio(p(430, 460));
    cS = sc; cTX = lerp(c1TX, c2TX, t); cTY = lerp(c1TY, c2TY, t);
  } else if (f < 490) {
    // Pan to C3 (Copy Writer)
    var t = eio(p(460, 490));
    cS = sc; cTX = lerp(c2TX, c3TX, t); cTY = lerp(c2TY, c3TY, t);
  } else if (f < 520) {
    // Pan to C4 (Publisher)
    var t = eio(p(490, 520));
    cS = sc; cTX = lerp(c3TX, c4TX, t); cTY = lerp(c3TY, c4TY, t);
  } else if (f < 560) {
    // Zoom back to overview
    var t = eio(p(520, 560));
    cS = lerp(sc, 1, t); cTX = lerp(c4TX, 0, t); cTY = lerp(c4TY, 0, t);
  }
  // Phase 4-6: Stay at overview
  else {
    cS = 1; cTX = 0; cTY = 0;
  }

  // ===== TYPING =====
  var tc = 0;
  if (f >= 55 && f < 185) tc = Math.min(Math.floor((f - 55) * 0.72), PT.length);
  else if (f >= 185) tc = PT.length;
  var dt = PT.substring(0, tc);
  var cur = f >= 50 && f < 200 && Math.floor(f/12) % 2 === 0;

  // ===== LOADING STATE (f185-220) =====
  var loadGlow = 0;
  if (f >= 185 && f < 200) loadGlow = eo3(p(185, 200));
  else if (f >= 200 && f < 212) loadGlow = 1;
  else if (f >= 212 && f < 220) loadGlow = 1 - eo3(p(212, 220));
  var shP = -((f * 3) % 200);

  var statusMsg = STATUS_MSGS[0];
  if (f >= 190) statusMsg = STATUS_MSGS[Math.floor((f - 190) / 20) % STATUS_MSGS.length];

  var sR = f >= 190 && f < 220;
  var rO = sR ? (f < 200 ? eo3(p(190, 200)) : f < 215 ? 1 : 1 - eo3(p(215, 220))) : 0;

  // ===== COMPONENT APPEARANCE =====
  // Leader card: f370-400
  var leaderShow = f >= 370;
  var leaderScale = leaderShow ? (f < 400 ? eob(p(370, 400)) : 1) : 0;
  var leaderOp = leaderShow ? (f < 400 ? eo3(p(370, 400)) : 1) : 0;

  // Child agents with connection lines
  var c1Show = f >= 400;
  var c1Scale = c1Show ? (f < 430 ? eob(p(400, 430)) : 1) : 0;
  var c1Op = c1Show ? (f < 430 ? eo3(p(400, 430)) : 1) : 0;
  var conn1Prog = f >= 395 ? eo3(p(395, 430)) : 0;

  var c2Show = f >= 430;
  var c2Scale = c2Show ? (f < 460 ? eob(p(430, 460)) : 1) : 0;
  var c2Op = c2Show ? (f < 460 ? eo3(p(430, 460)) : 1) : 0;
  var conn2Prog = f >= 425 ? eo3(p(425, 460)) : 0;

  var c3Show = f >= 460;
  var c3Scale = c3Show ? (f < 490 ? eob(p(460, 490)) : 1) : 0;
  var c3Op = c3Show ? (f < 490 ? eo3(p(460, 490)) : 1) : 0;
  var conn3Prog = f >= 455 ? eo3(p(455, 490)) : 0;

  var c4Show = f >= 490;
  var c4Scale = c4Show ? (f < 520 ? eob(p(490, 520)) : 1) : 0;
  var c4Op = c4Show ? (f < 520 ? eo3(p(490, 520)) : 1) : 0;
  var conn4Prog = f >= 485 ? eo3(p(485, 520)) : 0;

  // Agent statuses: Idle -> Working -> Done (Phase 4)
  function agentStatus(workStart, doneFrame) {
    if (f < workStart) return 'idle';
    if (f < doneFrame) return 'working';
    return 'done';
  }
  var s1 = agentStatus(580, 720);
  var s2 = agentStatus(600, 740);
  var s3 = agentStatus(620, 780);
  var s4 = agentStatus(700, 840);

  // Progress bar fill for each agent
  function agentProgress(workStart, doneFrame) {
    if (f < workStart) return 0;
    if (f >= doneFrame) return 1;
    return eo3(p(workStart, doneFrame));
  }
  var prog1 = agentProgress(580, 720);
  var prog2 = agentProgress(600, 740);
  var prog3 = agentProgress(620, 780);
  var prog4 = agentProgress(700, 840);

  // ===== BADGES =====
  var t1O = f < 15 ? (f < 5 ? eo3(p(0, 5)) : f < 10 ? 1 : 1 - eo3(p(10, 15))) : 0;
  var t2O = f >= 350 && f < 380 ? (f < 358 ? eo3(p(350, 358)) : f < 372 ? 1 : 1 - eo3(p(372, 380))) : 0;
  var t3O = f >= 560 && f < 580 ? (f < 566 ? eo3(p(560, 566)) : f < 574 ? 1 : 1 - eo3(p(574, 580))) : 0;
  var t4O = f >= 960 && f < 1020 ? (f < 975 ? eo3(p(960, 975)) : f < 1005 ? 1 : 1 - eo3(p(1005, 1020))) : 0;

  // ===== HIGHLIGHT (f1020-1200) =====
  var hlO = f >= 1020 ? (f < 1060 ? eo3(p(1020, 1060)) : 1) : 0;

  // ===== SVG HELPER =====
  function svg(w, h, vb, ch) {
    return e('svg', { width: w, height: h, viewBox: vb, fill: 'none', xmlns: 'http://www.w3.org/2000/svg' }, ch);
  }

  // ===== FLOWHUNT ICON =====
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

  // ===== COLOR INTERPOLATION =====
  function lerp_color(c1, c2, t) {
    var r1 = parseInt(c1.slice(1,3), 16), g1 = parseInt(c1.slice(3,5), 16), b1 = parseInt(c1.slice(5,7), 16);
    var r2 = parseInt(c2.slice(1,3), 16), g2 = parseInt(c2.slice(3,5), 16), b2 = parseInt(c2.slice(5,7), 16);
    var r = Math.round(r1 + (r2 - r1) * t);
    var g = Math.round(g1 + (g2 - g1) * t);
    var b = Math.round(b1 + (b2 - b1) * t);
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  // ===== AGENT ICON =====
  function agentIcon() {
    return e('div', { style: {
      width: 32, height: 32, borderRadius: 6, background: C_AGT,
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, padding: 6
    }},
      e('svg', { width: '100%', height: '100%', viewBox: '0 0 20 20', fill: '#fff', xmlns: 'http://www.w3.org/2000/svg' },
        e('path', { d: 'M10 .667a1 1 0 011 1v.667h2.333A2.667 2.667 0 0116 5v3.334a2.667 2.667 0 01-2.5 2.661v.054l2.78 1.39a1 1 0 01-.894 1.79l-1.886-.944V17.5a1 1 0 01-2 0V16h-3v1.5a1 1 0 11-2 0v-4.215l-1.886.943a1 1 0 11-.894-1.789l2.78-1.39v-.054A2.667 2.667 0 014 8.334V5a2.667 2.667 0 012.667-2.666H9v-.667a1 1 0 011-1zM6.667 4.334A.667.667 0 006 5v3.334A.667.667 0 006.667 9h6.666A.667.667 0 0014 8.334V5a.667.667 0 00-.667-.666H6.667zM11.5 11h-3v3h3v-2.313a.97.97 0 010-.042V11zM8.333 5.667a1 1 0 011 1v.008a1 1 0 01-2 0v-.008a1 1 0 011-1zm3.334 0a1 1 0 011 1v.008a1 1 0 11-2 0v-.008a1 1 0 011-1z' })
      )
    );
  }

  // ===== AGENT CARD (with progress bar) =====
  function agentCard(label, cx, cy, cardW, cardScale, op, status, isLeader, progressVal) {
    if (op <= 0) return null;
    var glow = cardScale < 0.95 ? '0 0 20px ' + C_AGT + '20' : '0 1px 4px rgba(0,0,0,0.06)';
    var statusColor = C_G400;
    var statusText = 'Idle';
    if (status === 'working') { statusColor = C_GR2; statusText = 'Working...'; }
    else if (status === 'done') { statusColor = '#10b981'; statusText = 'Done'; }

    return e('div', {
      key: 'ac-' + label,
      style: {
        position: 'absolute', left: cx - cardW / 2, top: cy - CH / 2,
        width: cardW, height: CH, borderRadius: 8,
        border: '2px solid ' + C_AGT + '60', background: '#fff',
        padding: '8px 12px', boxSizing: 'border-box',
        transform: 'scale(' + cardScale + ')', transformOrigin: '50% 50%',
        opacity: op, boxShadow: glow, zIndex: 4,
        overflow: 'hidden'
      }
    },
      e('div', { style: { display: 'flex', alignItems: 'center', gap: 12, padding: '4px 0' } },
        agentIcon(),
        e('div', { style: { flex: 1 } },
          e('div', { style: { display: 'flex', alignItems: 'center', gap: 6 } },
            e('span', { style: { fontSize: 14, fontWeight: 600, color: C_G900 } }, label),
            isLeader ? e('span', { style: {
              fontSize: 10, padding: '1px 6px', borderRadius: 4,
              background: '#fef3c7', color: '#92400e', fontWeight: 600
            } }, '\u2605 Leader') : null
          ),
          !isLeader ? e('div', { style: { fontSize: 11, color: statusColor, fontWeight: 500, marginTop: 2 } },
            status === 'working' ? e('span', { style: {
              background: 'linear-gradient(90deg,' + C_G400 + ' 0%,' + C_GR1 + ' 42%,' + C_GR2 + ' 50%,' + C_GR3 + ' 58%,' + C_G400 + ' 100%)',
              backgroundSize: '200% 100%', backgroundPosition: shP + '% 0',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
            } }, statusText) :
            status === 'done' ? e('span', { style: { display: 'flex', alignItems: 'center', gap: 4 } },
              svg(12, 12, '0 0 24 24', [
                e('circle', { key: 'bg', cx: '12', cy: '12', r: '10', fill: '#10b981' }),
                e('path', { key: 'ck', d: 'M7 12l4 4 6-7', stroke: '#fff', strokeWidth: '2.5', strokeLinecap: 'round', strokeLinejoin: 'round', fill: 'none' })
              ]),
              statusText
            ) : statusText
          ) : null
        )
      ),
      // Progress bar at bottom
      !isLeader && progressVal > 0 ? e('div', { style: {
        position: 'absolute', bottom: 0, left: 0, width: '100%', height: 3
      }},
        e('div', { style: {
          height: '100%', borderRadius: '0 2px 2px 0',
          width: (progressVal * 100) + '%',
          background: status === 'done' ? '#10b981' : 'linear-gradient(90deg, ' + C_GR2 + '80, ' + C_GR2 + ')'
        }})
      ) : null
    );
  }

  // ===== CONNECTION LINES (SVG bezier from leader to children) =====
  function connectionLines() {
    var svgCh = [];
    var y1 = LY + CH / 2;
    var conns = [
      { x: C1X, y: C1Y - CH/2, prog: conn1Prog, k: 'c1' },
      { x: C2X, y: C2Y - CH/2, prog: conn2Prog, k: 'c2' },
      { x: C3X, y: C3Y - CH/2, prog: conn3Prog, k: 'c3' },
      { x: C4X, y: C4Y - CH/2, prog: conn4Prog, k: 'c4' }
    ];
    for (var i = 0; i < conns.length; i++) {
      var c = conns[i];
      if (c.prog <= 0) continue;
      var x2 = c.x, y2 = c.y;
      var midY = (y1 + y2) / 2;
      var d = 'M ' + LX + ' ' + y1 + ' C ' + LX + ' ' + midY + ' ' + x2 + ' ' + midY + ' ' + x2 + ' ' + y2;
      svgCh.push(
        e('path', { key: c.k, d: d, stroke: C_G300, strokeWidth: 2, fill: 'none',
          pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - c.prog })
      );
      svgCh.push(e('circle', { key: c.k + 's', cx: LX, cy: y1, r: 5, fill: '#fff', stroke: C_AGT, strokeWidth: 2 }));
      if (c.prog >= 0.9) {
        svgCh.push(e('circle', { key: c.k + 'e', cx: x2, cy: y2, r: 5, fill: '#fff', stroke: C_AGT, strokeWidth: 2 }));
      }
    }
    if (svgCh.length === 0) return null;
    return e('svg', {
      key: 'conns', viewBox: '0 0 ' + W + ' ' + H,
      style: { position: 'absolute', top: 0, left: 0, width: W, height: H, zIndex: 3, pointerEvents: 'none' }
    }, svgCh);
  }

  // ===== PLUS CONNECTORS =====
  function plusConnectors() {
    var y1 = LY + CH / 2;
    var conns = [
      { x: C1X, y: C1Y - CH/2, prog: conn1Prog, k: 'p1' },
      { x: C2X, y: C2Y - CH/2, prog: conn2Prog, k: 'p2' },
      { x: C3X, y: C3Y - CH/2, prog: conn3Prog, k: 'p3' },
      { x: C4X, y: C4Y - CH/2, prog: conn4Prog, k: 'p4' }
    ];
    var els = [];
    for (var i = 0; i < conns.length; i++) {
      var c = conns[i];
      if (c.prog < 0.5) continue;
      var midY = (y1 + c.y) / 2;
      var bx = (LX + c.x) / 2;
      var by = y1 * 0.125 + midY * 0.75 + c.y * 0.125;
      var pOp = cl((c.prog - 0.5) / 0.2, 0, 1);
      els.push(e('div', { key: c.k, style: {
        position: 'absolute', left: bx - 13, top: by - 13,
        width: 26, height: 26, borderRadius: 13, background: C_PRI, color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 16, fontWeight: 'bold', zIndex: 5,
        boxShadow: '0 2px 6px rgba(28,100,242,0.3)',
        opacity: pOp, transform: 'scale(' + lerp(0.5, 1, pOp) + ')'
      }}, '+'));
    }
    return els;
  }

  // ===== TOP BAR =====
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
          display: 'flex', alignItems: 'center', borderRadius: 9999, background: C_G100, padding: 4
        }},
          e('div', { style: {
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '5px 16px', borderRadius: 9999, background: C_G900, fontSize: 14, fontWeight: 500
          }},
            svg(14, 14, '0 0 24 24', [
              e('path', { key: 'p', d: 'M4 20h4l10.5-10.5a2.121 2.121 0 00-3-3L5 17v3h0z',
                stroke: '#fff', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round', fill: 'none' })
            ]),
            e('span', { style: { color: '#fff' } }, 'Edit')
          ),
          e('div', { style: {
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '5px 16px', borderRadius: 9999, background: 'transparent', fontSize: 14, fontWeight: 500
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
          background: C_PRI, color: '#fff', fontSize: 14, fontWeight: 600
        }}, 'Publish')
      )
    );
  }

  // ===== FLOATING SIDEBAR =====
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

  // ===== FLOW ASSISTANT INPUT =====
  function flowAssist() {
    var phV = tc === 0 && f < 50;
    var isExpanded = f >= 50;
    var showShimmer = f >= 185 && f < 220;

    var aW;
    if (sR) { aW = 800; }
    else if (f >= 45 && f < 60) { aW = lerp(640, 800, eo3(p(45, 60))); }
    else if (f >= 60) { aW = 800; }
    else { aW = 640; }
    var bR = sR ? 16 : 9999;

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
    var borderCol = loadGlow > 0 ? '2px solid rgba(70,92,224,' + (0.5 * loadGlow) + ')' : 'none';

    // Hide prompt after loading phase
    var faOp = 1;
    if (f >= 220 && f < 260) faOp = 1 - eo3(p(220, 260));
    else if (f >= 260) faOp = 0;
    if (faOp <= 0) return null;

    return e('div', { key: 'fa', style: {
      position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)',
      width: aW, zIndex: 10, opacity: faOp
    }},
      e('div', { style: {
        overflow: 'hidden', background: C_G100, borderRadius: bR,
        boxShadow: glowShadow, border: borderCol
      }},
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
                  borderTopColor: C_GR2, borderRightColor: C_GR1,
                  transform: 'rotate(' + (f * 9) + 'deg)'
                }}),
                e('span', { style: {
                  fontSize: 14, fontWeight: 500,
                  background: 'linear-gradient(90deg,' + C_G500 + ' 0%,' + C_G500 + ' 30%,' + C_GR1 + ' 42%,' + C_GR2 + ' 50%,' + C_GR3 + ' 58%,' + C_G500 + ' 70%,' + C_G500 + ' 100%)',
                  backgroundSize: '200% 100%', backgroundPosition: shP + '% 0',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
                }}, statusMsg)
              ),
              e('div', { style: {
                height: 3, borderRadius: 2, marginBottom: 10,
                background: C_G200, overflow: 'hidden'
              }},
                e('div', { style: {
                  height: '100%', borderRadius: 2,
                  width: (Math.min(p(190, 218), 0.92) * 100) + '%',
                  background: 'linear-gradient(90deg, ' + C_GR1 + ', ' + C_GR2 + ', ' + C_GR3 + ')',
                  backgroundSize: '300% 100%', backgroundPosition: (-shP * 0.5) + '% 0'
                }})
              ),
              e('div', { style: { display: 'flex', flexDirection: 'column', gap: 6 }},
                e('div', { style: { height: 10, borderRadius: 5, width: '80%',
                  background: 'linear-gradient(90deg,' + C_G200 + ' 0%,' + C_GR3 + '33 30%,' + C_G200 + ' 50%,' + C_GR2 + '33 70%,' + C_G200 + ' 100%)',
                  backgroundSize: '200% 100%', backgroundPosition: shP + '% 0' }}),
                e('div', { style: { height: 10, borderRadius: 5, width: '55%',
                  background: 'linear-gradient(90deg,' + C_G200 + ' 0%,' + C_GR1 + '33 30%,' + C_G200 + ' 50%,' + C_GR3 + '33 70%,' + C_G200 + ' 100%)',
                  backgroundSize: '200% 100%', backgroundPosition: (shP - 30) + '% 0' }})
              )
            )
          )
        ) : null,
        e('div', { style: {
          display: 'flex', alignItems: 'center', gap: 10, padding: '12px 24px'
        }},
          showShimmer ?
            e('div', { style: {
              flex: 1, fontSize: 14,
              background: 'linear-gradient(90deg,' + C_G400 + ' 0%,' + C_G400 + ' 28%,' + C_GR1 + ' 40%,' + C_GR2 + ' 50%,' + C_GR3 + ' 60%,' + C_G400 + ' 72%,' + C_G400 + ' 100%)',
              backgroundSize: '200% 100%', backgroundPosition: shP + '% 0',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
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

  // ===== LOADING PARTICLES (Phase 1 loading) =====
  function loadingParticles() {
    if (f < 190 || f >= 225) return null;
    var pO = f < 200 ? eo3(p(190, 200)) : f < 218 ? 1 : 1 - eo3(p(218, 225));
    if (pO <= 0) return null;
    var children = [];
    var colors = [C_GR1, C_GR2, C_GR3, C_PRI, '#3b82f6', '#60a5fa'];
    for (var i = 0; i < 12; i++) {
      var seed = hash(i + 100);
      var speed = 0.4 + seed * 1.0;
      var xOff = (hash(i + 200) - 0.5) * 500;
      var phase = ((f - 190) * speed + seed * 180) % 110;
      var yOff = -phase * 2.2;
      var fadeIn = Math.min(phase / 12, 1);
      var fadeOut = Math.max(0, 1 - (phase - 70) / 40);
      var alpha = fadeIn * fadeOut * pO;
      var size = 2 + seed * 5;
      var color = colors[i % colors.length];
      var wobble = Math.sin(phase * 0.15 + seed * 6.28) * 15;
      children.push(e('div', { key: 'sp' + i, style: {
        position: 'absolute', left: AX + xOff + wobble - size / 2, top: AY + 10 + yOff,
        width: size, height: size, borderRadius: '50%', background: color,
        opacity: alpha * 0.7, boxShadow: '0 0 ' + (size * 2) + 'px ' + color + '60', zIndex: 9
      }}));
    }
    return e('div', { key: 'lparts', style: {
      position: 'absolute', top: 0, left: 0, width: W, height: H, pointerEvents: 'none', zIndex: 9
    }}, children);
  }

  // ===== BRAIN NODE (Phase 2) =====
  function brainNode() {
    if (f < 260) return null;
    var brainScale = f < 310 ? eob(p(260, 310)) : 1;
    var brainOp = f < 290 ? eo3(p(260, 290)) : 1;

    // Convergence: brain turns green (f880-920)
    var isComplete = f >= 880;
    var greenT = isComplete ? (f < 920 ? eo3(p(880, 920)) : 1) : 0;
    var brainSize = 60 + (isComplete ? greenT * 8 : 0);

    var gradFrom = isComplete ? lerp_color('#984ad7', '#10b981', greenT) : C_GR1;
    var gradMid = isComplete ? lerp_color('#465ce0', '#059669', greenT) : C_GR2;
    var gradTo = isComplete ? lerp_color('#0497dc', '#34d399', greenT) : C_GR3;

    var labelText = isComplete ? 'Analysis Complete' : 'Deep Agent';
    var labelColor = isComplete ? '#10b981' : C_GR2;

    // Hide during highlight
    var nodeOp = brainOp;
    if (f >= 1020 && f < 1060) nodeOp = brainOp * (1 - eo3(p(1020, 1060)));
    else if (f >= 1060) nodeOp = 0;
    if (nodeOp <= 0) return null;

    var children = [];

    // Pulse rings during thinking (f260-560)
    if (f >= 260 && f < 560) {
      for (var r = 0; r < 3; r++) {
        var rPhase = ((f - 260 + r * 30) % 90) / 90;
        var rRadius = 40 + rPhase * 120;
        var rAlpha = (1 - rPhase) * 0.25 * brainOp;
        if (rAlpha > 0.01) {
          children.push(e('div', { key: 'pr' + r, style: {
            position: 'absolute', left: CX - rRadius, top: CY - rRadius,
            width: rRadius * 2, height: rRadius * 2, borderRadius: '50%',
            border: '2px solid ' + C_GR2, opacity: rAlpha, pointerEvents: 'none'
          }}));
        }
      }
    }

    // Convergence pulse rings (f880-920)
    if (f >= 880 && f < 920) {
      var crPhase = p(880, 920);
      var crRadius = 40 + crPhase * 250;
      var crAlpha = (1 - crPhase) * 0.4;
      children.push(e('div', { key: 'compring', style: {
        position: 'absolute', left: CX - crRadius, top: CY - crRadius,
        width: crRadius * 2, height: crRadius * 2, borderRadius: '50%',
        border: '3px solid #10b981', opacity: crAlpha, pointerEvents: 'none'
      }}));
    }

    // Brain circle
    children.push(e('div', { key: 'brain', style: {
      position: 'absolute', left: CX - brainSize / 2, top: CY - brainSize / 2,
      width: brainSize, height: brainSize, borderRadius: '50%',
      background: 'linear-gradient(135deg, ' + gradFrom + ', ' + gradMid + ', ' + gradTo + ')',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      transform: 'scale(' + brainScale + ')', opacity: nodeOp,
      boxShadow: '0 0 30px ' + (isComplete ? 'rgba(16,185,129,0.4)' : 'rgba(70,92,224,0.35)') + ', 0 4px 20px rgba(0,0,0,0.15)',
      zIndex: 6
    }}, fhIcon(28)));

    // Label below brain
    children.push(e('div', { key: 'blbl', style: {
      position: 'absolute', left: CX - 80, top: CY + brainSize / 2 + 10,
      width: 160, textAlign: 'center', fontSize: 14, fontWeight: 600,
      color: labelColor, opacity: nodeOp, transform: 'scale(' + brainScale + ')'
    }}, labelText));

    return e('div', { key: 'braingrp', style: {
      position: 'absolute', top: 0, left: 0, width: W, height: H, pointerEvents: 'none', zIndex: 5
    }}, children);
  }

  // ===== THINKING PARTICLES (Phase 2: f310-380) =====
  function thinkingParticles() {
    if (f < 310 || f > 380) return null;
    var tO = 1;
    if (f < 325) tO = eo3(p(310, 325));
    else if (f > 365) tO = 1 - eo3(p(365, 380));

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
      children.push(e('div', { key: 'tp' + i, style: {
        position: 'absolute', left: px - pSize / 2, top: py - pSize / 2,
        width: pSize, height: pSize, borderRadius: '50%', background: pColors[i],
        opacity: pAlpha, boxShadow: '0 0 ' + (pSize * 3) + 'px ' + pColors[i] + '80', zIndex: 7
      }}));
    }
    return e('div', { key: 'thinkp', style: {
      position: 'absolute', top: 0, left: 0, width: W, height: H, pointerEvents: 'none', zIndex: 7
    }}, children);
  }

  // ===== SCANNING LINE (Phase 2: f310-380) =====
  function scanningLine() {
    if (f < 310 || f > 380) return null;
    var sO = 1;
    if (f < 320) sO = eo3(p(310, 320));
    else if (f > 370) sO = 1 - eo3(p(370, 380));
    var canvasH = H - TB;
    var lineY = TB + ((f - 310) * 4) % canvasH;
    return e('div', { key: 'scanline', style: {
      position: 'absolute', left: 0, top: lineY, width: W, height: 2,
      background: 'linear-gradient(90deg, transparent, ' + C_GR2 + '40, transparent)',
      opacity: sO * 0.6, pointerEvents: 'none', zIndex: 4
    }});
  }

  // ===== COMMUNICATION PARTICLES (Phase 4: f560-900) =====
  function commParticles() {
    if (f < 560 || f >= 900) return null;
    var pO = f < 580 ? eo3(p(560, 580)) : f < 880 ? 1 : 1 - eo3(p(880, 900));
    if (pO <= 0) return null;
    var particles = [];
    var colors = [C_GR1, C_GR2, C_GR3];
    var allNodes = [
      { x: LX, y: LY }, { x: C1X, y: C1Y }, { x: C2X, y: C2Y },
      { x: C3X, y: C3Y }, { x: C4X, y: C4Y }
    ];

    // Delegation pulses: Leader to each child
    if (f >= 560 && f < 640) {
      for (var i = 0; i < 4; i++) {
        var startF = 560 + i * 15;
        if (f < startF) continue;
        var pt = cl((f - startF) / 40, 0, 1);
        var px = lerp(LX, allNodes[i + 1].x, eo3(pt));
        var py = lerp(LY, allNodes[i + 1].y, eo3(pt));
        var pFade = pt < 0.1 ? pt / 0.1 : pt > 0.8 ? (1 - pt) / 0.2 : 1;
        particles.push(e('div', { key: 'dp' + i, style: {
          position: 'absolute', left: px - 6, top: py - 6,
          width: 12, height: 12, borderRadius: '50%', background: colors[i % 3],
          opacity: pFade * pO * 0.9,
          boxShadow: '0 0 12px ' + colors[i % 3] + '80', zIndex: 6
        }}));
      }
    }

    // Ongoing communication particles
    for (var j = 0; j < 20; j++) {
      var seed = hash(j + 42);
      var fromIdx = Math.floor(seed * 5);
      var toIdx = Math.floor(hash(j + 100) * 5);
      if (fromIdx === toIdx) toIdx = (toIdx + 1) % 5;
      var speed = 0.3 + hash(j + 200) * 0.5;
      var phase = ((f - 580) * speed + seed * 100) % 60;
      if (phase < 0) continue;
      var pt2 = cl(phase / 60, 0, 1);
      var fromN = allNodes[fromIdx], toN = allNodes[toIdx];
      var ppx = lerp(fromN.x, toN.x, eo3(pt2));
      var ppy = lerp(fromN.y, toN.y, eo3(pt2));
      var fadeP = pt2 < 0.15 ? pt2 / 0.15 : pt2 > 0.75 ? (1 - pt2) / 0.25 : 1;
      var pSize = 3 + hash(j + 300) * 4;
      var pCol = colors[j % 3];
      particles.push(e('div', { key: 'cp' + j, style: {
        position: 'absolute', left: ppx - pSize/2, top: ppy - pSize/2,
        width: pSize, height: pSize, borderRadius: '50%', background: pCol,
        opacity: fadeP * pO * 0.6,
        boxShadow: '0 0 ' + (pSize * 2) + 'px ' + pCol + '40', zIndex: 6
      }}));
    }

    return e('div', { key: 'comm', style: {
      position: 'absolute', top: 0, left: 0, width: W, height: H, pointerEvents: 'none', zIndex: 6
    }}, particles);
  }

  // ===== AGENT CHAT FEED (Phase 4: f560-900) =====
  var CHAT_MSGS = [
    { agent: 'Deep Agent', color: '#fef3c7', textColor: '#92400e', msg: 'Starting SEO optimization task. Creating specialist team...' },
    { agent: 'Deep Agent', color: '#fef3c7', textColor: '#92400e', msg: 'Delegating keyword research to Research Keywords agent' },
    { agent: 'Research Keywords', color: '#ede9fe', textColor: '#6d28d9', msg: 'Received task. Analyzing target: mystore.com/products/relaxed-cap' },
    { agent: 'Research Keywords', color: '#ede9fe', textColor: '#6d28d9', msg: 'Scanning Google Trends for "relaxed cap" and related terms...' },
    { agent: 'Deep Agent', color: '#fef3c7', textColor: '#92400e', msg: 'Delegating competitor analysis to Competitors Analysis agent' },
    { agent: 'Competitors Analysis', color: '#dbeafe', textColor: '#1e40af', msg: 'Received task. Fetching top 5 competitor product pages...' },
    { agent: 'Research Keywords', color: '#ede9fe', textColor: '#6d28d9', msg: 'Found 23 high-volume keywords: "black cap", "streetwear cap", "ss26 collection"...' },
    { agent: 'Research Keywords', color: '#ede9fe', textColor: '#6d28d9', msg: 'Identified keyword gaps: missing "unisex", "adjustable", "cotton blend"' },
    { agent: 'Competitors Analysis', color: '#dbeafe', textColor: '#1e40af', msg: 'Analyzed competitor: hypebeast.com/caps - strong FAQ schema detected' },
    { agent: 'Competitors Analysis', color: '#dbeafe', textColor: '#1e40af', msg: 'Competitor pattern: avg title length 58 chars, 3-4 bullet features' },
    { agent: 'Deep Agent', color: '#fef3c7', textColor: '#92400e', msg: 'Forwarding keyword data to Copy Writer agent' },
    { agent: 'Deep Agent', color: '#fef3c7', textColor: '#92400e', msg: 'Delegating content writing to Copy Writer agent' },
    { agent: 'Copy Writer', color: '#fce7f3', textColor: '#9d174d', msg: 'Received keyword list and competitor analysis. Starting content draft...' },
    { agent: 'Copy Writer', color: '#fce7f3', textColor: '#9d174d', msg: 'Rewriting product title: "Relaxed Fit Black Cotton Cap - SS26 Streetwear Collection"' },
    { agent: 'Research Keywords', color: '#ede9fe', textColor: '#6d28d9', msg: 'Sending long-tail keyword suggestions to Copy Writer' },
    { agent: 'Copy Writer', color: '#fce7f3', textColor: '#9d174d', msg: 'Generating meta description with target keywords (155 chars)...' },
    { agent: 'Copy Writer', color: '#fce7f3', textColor: '#9d174d', msg: 'Adding FAQ schema: "What material is the Relaxed Cap?", "Is it adjustable?"...' },
    { agent: 'Competitors Analysis', color: '#dbeafe', textColor: '#1e40af', msg: 'Sending structured data recommendations to Copy Writer' },
    { agent: 'Copy Writer', color: '#fce7f3', textColor: '#9d174d', msg: 'Draft complete. Sending optimized content to Publisher agent' },
    { agent: 'Deep Agent', color: '#fef3c7', textColor: '#92400e', msg: 'Delegating publishing to Publisher agent' },
    { agent: 'Publisher', color: '#d1fae5', textColor: '#065f46', msg: 'Received optimized content package. Connecting to Shopify API...' },
    { agent: 'Publisher', color: '#d1fae5', textColor: '#065f46', msg: 'Updating product title, description, and meta tags...' },
    { agent: 'Publisher', color: '#d1fae5', textColor: '#065f46', msg: 'Adding FAQ schema markup to product page...' },
    { agent: 'Publisher', color: '#d1fae5', textColor: '#065f46', msg: 'Submitting updated sitemap to Google Search Console' },
    { agent: 'Research Keywords', color: '#ede9fe', textColor: '#6d28d9', msg: 'Task complete. 23 keywords identified, 8 gaps found.' },
    { agent: 'Competitors Analysis', color: '#dbeafe', textColor: '#1e40af', msg: 'Task complete. 5 competitors analyzed, 12 patterns extracted.' },
    { agent: 'Copy Writer', color: '#fce7f3', textColor: '#9d174d', msg: 'Task complete. Title, description, meta tags, and FAQ schema written.' },
    { agent: 'Publisher', color: '#d1fae5', textColor: '#065f46', msg: 'Task complete. All changes published to Shopify store.' },
    { agent: 'Deep Agent', color: '#fef3c7', textColor: '#92400e', msg: 'All agents finished. SEO optimization complete!' },
    { agent: 'Deep Agent', color: '#fef3c7', textColor: '#92400e', msg: 'Summary: 23 keywords targeted, 5 competitors analyzed, all content live.' }
  ];

  function agentChatFeed() {
    if (f < 560 || f >= 920) return null;
    var feedO = f < 575 ? eo3(p(560, 575)) : f < 890 ? 1 : 1 - eo3(p(890, 920));
    if (feedO <= 0) return null;

    var panelW = 440;
    var panelH = H - TB - 20;
    var totalMsgs = CHAT_MSGS.length;
    var feedStart = 560;
    var feedEnd = 880;

    var msgLifespan = 110;
    var msgSpacing = (feedEnd - feedStart) / totalMsgs;
    var slotH = 68;

    var msgs = [];
    for (var i = 0; i < totalMsgs; i++) {
      var m = CHAT_MSGS[i];
      var birthF = feedStart + i * msgSpacing;
      if (f < birthF) continue;
      var age = f - birthF;
      if (age > msgLifespan) continue;
      var life = age / msgLifespan;

      var alpha;
      if (life < 0.15) alpha = eo3(life / 0.15);
      else if (life < 0.75) alpha = 1;
      else alpha = 1 - eo3((life - 0.75) / 0.25);

      var yStart = panelH - 30;
      var yEnd = -slotH;
      var yPos = lerp(yStart, yEnd, eio(life));
      var xSlide = life < 0.1 ? lerp(30, 0, eo3(life / 0.1)) : 0;
      var msc = life < 0.08 ? lerp(0.85, 1, eo3(life / 0.08)) : 1;

      msgs.push(e('div', { key: 'cm' + i, style: {
        position: 'absolute', left: 12, right: 12, top: yPos,
        opacity: alpha * 0.92,
        transform: 'translateX(' + xSlide + 'px) scale(' + msc + ')',
        transformOrigin: 'left center', padding: '10px 14px', borderRadius: 10,
        background: 'rgba(255,255,255,0.72)',
        backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
        boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
        display: 'flex', gap: 10, alignItems: 'flex-start'
      }},
        e('div', { style: {
          width: 26, height: 26, borderRadius: 6, background: C_AGT,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1
        }},
          e('svg', { width: 14, height: 14, viewBox: '0 0 20 20', fill: '#fff' },
            e('path', { d: 'M10 .667a1 1 0 011 1v.667h2.333A2.667 2.667 0 0116 5v3.334a2.667 2.667 0 01-2.5 2.661v.054l2.78 1.39a1 1 0 01-.894 1.79l-1.886-.944V17.5a1 1 0 01-2 0V16h-3v1.5a1 1 0 11-2 0v-4.215l-1.886.943a1 1 0 11-.894-1.789l2.78-1.39v-.054A2.667 2.667 0 014 8.334V5a2.667 2.667 0 012.667-2.666H9v-.667a1 1 0 011-1z' })
          )
        ),
        e('div', { style: { flex: 1, minWidth: 0 } },
          e('span', { style: {
            fontSize: 11, fontWeight: 700, padding: '1px 7px', borderRadius: 4,
            background: m.color, color: m.textColor, marginRight: 6
          }}, m.agent),
          e('span', { style: { fontSize: 12, color: C_G900, lineHeight: '1.5' } }, m.msg)
        )
      ));
    }

    return e('div', { key: 'chatfeed', style: {
      position: 'absolute', top: TB + 8, right: 0,
      width: panelW, height: panelH,
      zIndex: 35, overflow: 'hidden', pointerEvents: 'none', opacity: feedO
    }},
      e('div', { style: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 } }, msgs),
      e('div', { style: {
        position: 'absolute', top: 0, left: 0, right: 0, height: 120,
        background: 'linear-gradient(to bottom, ' + C_BG + ' 0%, ' + C_BG + 'cc 30%, transparent 100%)',
        pointerEvents: 'none', zIndex: 1
      }}),
      e('div', { style: {
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 100,
        background: 'linear-gradient(to top, ' + C_BG + ' 0%, ' + C_BG + '99 25%, transparent 100%)',
        pointerEvents: 'none', zIndex: 1
      }})
    );
  }

  // ===== RESULT CARD (Phase 5: f920-1020) =====
  function resultCard() {
    if (f < 920) return null;
    var rcScale = f < 960 ? eob(p(920, 960)) : 1;
    var rcOp = f < 940 ? eo3(p(920, 940)) : 1;

    // Fade during highlight
    if (f >= 1020 && f < 1060) rcOp = rcOp * (1 - eo3(p(1020, 1060)));
    else if (f >= 1060) return null;

    return e('div', { key: 'rcard', style: {
      position: 'absolute',
      left: CX - 160, top: CY + 80,
      width: 320, borderRadius: 12, background: '#fff',
      borderLeft: '4px solid #10b981',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.06)',
      padding: '14px 18px',
      transform: 'scale(' + rcScale + ')', opacity: rcOp,
      zIndex: 8, boxSizing: 'border-box'
    }},
      e('div', { style: { fontSize: 14, fontWeight: 600, color: C_G900, marginBottom: 6 } }, '\uD83D\uDCC4 SEO Optimization Plan'),
      e('div', { style: { fontSize: 12, color: C_G500, marginBottom: 10 } }, '47 pages \u2022 12 issues \u2022 5 quick wins'),
      e('div', { style: {
        display: 'inline-block', padding: '4px 12px', borderRadius: 6,
        background: '#ecfdf5', color: '#059669', fontSize: 11, fontWeight: 600
      } }, 'Ready to review')
    );
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

  // ===== HIGHLIGHT OVERLAY (Phase 6: f1020-1200) =====
  function highlight() {
    if (hlO <= 0) return null;
    return e('div', { key: 'hl', style: {
      position: 'absolute', top: 0, left: 0, width: W, height: H,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(8,8,24,' + (0.7 * hlO) + ')', zIndex: 50
    }},
      e('div', { style: { opacity: hlO, transform: 'translateY(' + ((1-hlO)*30) + 'px)' }},
        e('div', { style: {
          fontSize: 56, fontWeight: 800, color: '#fff', textAlign: 'center',
          letterSpacing: '-0.5px', lineHeight: '1.3', maxWidth: 900
        }},
          'Multi-Agent ',
          e('span', { style: {
            background: 'linear-gradient(135deg,' + C_GR1 + ',' + C_GR2 + ',' + C_GR3 + ')',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
          } }, 'Deep Agent')
        ),
        e('div', { style: {
          marginTop: 20, fontSize: 18, color: 'rgba(255,255,255,0.55)',
          fontWeight: 400, textAlign: 'center'
        } }, 'Complex tasks. Divided. Conquered.')
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
      canvasBg(), topBar(), floatingSidebar(), zoomCtrls(),
      scanningLine(),
      brainNode(),
      thinkingParticles(),
      connectionLines(),
      plusConnectors(),
      leaderShow ? agentCard('Deep Agent', LX, LY, LW, leaderScale, leaderOp, null, true, 0) : null,
      c1Show ? agentCard('Research Keywords', C1X, C1Y, CW, c1Scale, c1Op, s1, false, prog1) : null,
      c2Show ? agentCard('Competitors Analysis', C2X, C2Y, CW + 30, c2Scale, c2Op, s2, false, prog2) : null,
      c3Show ? agentCard('Copy Writer', C3X, C3Y, CW, c3Scale, c3Op, s3, false, prog3) : null,
      c4Show ? agentCard('Publisher', C4X, C4Y, CW, c4Scale, c4Op, s4, false, prog4) : null,
      commParticles(),
      resultCard(),
      loadingParticles(),
      flowAssist()
    ),
    agentChatFeed(),
    badge('FlowHunt Deep Agent', 50, t1O, { fontSize: 20, letterSpacing: '0.5px', background: 'linear-gradient(135deg,' + C_GR1 + ',' + C_GR2 + ',' + C_GR3 + ')' }),
    badge('Deep Agent creates a team of specialists', 50, t2O, {
      background: 'linear-gradient(135deg,' + C_AGT + ',#e91e8c)',
      boxShadow: '0 4px 20px rgba(191,18,93,0.3)'
    }),
    badge('Agents collaborate autonomously', 50, t3O, {
      background: 'linear-gradient(135deg,' + C_GR1 + ',' + C_GR2 + ',' + C_GR3 + ')'
    }),
    badge('From goal to strategy \u2014 in seconds', 50, t4O, {
      background: 'linear-gradient(135deg,#10b981,#059669)',
      boxShadow: '0 4px 20px rgba(16,185,129,0.3)'
    }),
    highlight()
  );
}
