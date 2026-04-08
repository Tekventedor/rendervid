function ClosingScene(props) {
  var f = props.frame || 0;
  var W = props.layerSize.width;
  var H = props.layerSize.height;
  var e = React.createElement;

  // ===== EASING =====
  function eo3(t) { return 1 - Math.pow(1 - t, 3); }
  function eob(t) { var c = 2.2; return Math.min(1 + ((c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2)), 1.12); }
  function cl(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function p(s, n) { return cl((f - s) / (n - s), 0, 1); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function hash(i) { return (((i * 2654435761) >>> 0) % 10000) / 10000; }

  // Micro-animations
  function breathe(seed, speed) {
    return (Math.sin(f * (speed || 0.06) + (seed || 0) * 3.7) + 1) * 0.5;
  }
  function float(seed, amp, speed) {
    return Math.sin(f * (speed || 0.05) + (seed || 0) * 4.1) * (amp || 3);
  }

  // ===== COLORS =====
  var C_GR1 = '#984ad7';
  var C_GR2 = '#465ce0';
  var C_GR3 = '#0497dc';
  var C_G400 = '#9ca3af';
  var C_G500 = '#6b7280';

  // ===== SVG HELPER =====
  function svg(w, h, vb, ch) {
    return e('svg', { width: w, height: h, viewBox: vb, fill: 'none', xmlns: 'http://www.w3.org/2000/svg' }, ch);
  }

  // ===== TIMELINE (450 frames = 15s) =====
  // f0-30:    Background fade in
  // f20-65:   Logo icon scale-in with bounce
  // f50-80:   "v2.0" badge pops in
  // f40-120:  Pulse rings around logo (3 rings staggered)
  // f70-110:  "FlowHunt" wordmark fades in
  // f100-140: Tagline "A workflow engine rebuilt for AI" slides up
  // f150-190: Sub-tagline slides up
  // f220-270: "Start Free" CTA bounces in
  // f260-300: "flowhunt.io" fades in
  // f0-450:   Ambient particles throughout
  // f300+:    Everything breathes, CTA pulses

  var children = [];

  // ===== BACKGROUND =====
  // Dark gradient that fades in
  var bgOp = f < 30 ? eo3(p(0, 30)) : 1;
  children.push(e('div', { key: 'bg', style: {
    position: 'absolute', top: 0, left: 0, width: W, height: H,
    background: 'radial-gradient(ellipse at 50% 40%, #0f1629 0%, #080818 50%, #030308 100%)',
    opacity: bgOp
  }}));

  // Subtle animated grid dots
  if (bgOp > 0) {
    children.push(e('div', { key: 'bg-dots', style: {
      position: 'absolute', top: 0, left: 0, width: W, height: H,
      backgroundImage: 'radial-gradient(circle, rgba(70,92,224,0.12) 1px, transparent 1px)',
      backgroundSize: '40px 40px',
      opacity: bgOp * 0.5
    }}));
  }

  // Radial glow behind logo area
  var glowOp = f >= 15 ? (f < 50 ? eo3(p(15, 50)) : 1) : 0;
  if (glowOp > 0) {
    var glowBreath = breathe(10, 0.04);
    children.push(e('div', { key: 'bg-glow', style: {
      position: 'absolute',
      left: W / 2 - 350, top: H * 0.28 - 200,
      width: 700, height: 400,
      borderRadius: '50%',
      background: 'radial-gradient(ellipse, rgba(70,92,224,' + (0.15 + glowBreath * 0.08) + ') 0%, rgba(152,74,215,' + (0.08 + glowBreath * 0.04) + ') 40%, transparent 70%)',
      opacity: glowOp,
      filter: 'blur(40px)',
      pointerEvents: 'none', zIndex: 1
    }}));
  }

  // ===== AMBIENT PARTICLES =====
  if (f >= 10) {
    var partOp = f < 40 ? eo3(p(10, 40)) : 1;
    var partColors = [C_GR1, C_GR2, C_GR3, '#10b981', '#f59e0b', '#ec4899', '#3b82f6', '#fff'];
    for (var pi = 0; pi < 30; pi++) {
      var pSeed = hash(pi + 100);
      var pSpeed = 0.15 + pSeed * 0.5;
      var pxBase = hash(pi + 200) * W;
      var pPhase = ((f - 10) * pSpeed + pSeed * 300) % 160;
      var pY = H + 20 - pPhase * (H + 60) / 160;
      var pFadeIn = Math.min(pPhase / 15, 1);
      var pFadeOut = Math.max(0, 1 - (pPhase - 120) / 40);
      var pAlpha = pFadeIn * pFadeOut * partOp;
      var pWobble = Math.sin(pPhase * 0.08 + pSeed * 6.28) * 30;
      var pSize = 2 + pSeed * 5;
      var pColor = partColors[pi % partColors.length];
      if (pAlpha > 0.01) {
        children.push(e('div', { key: 'ap' + pi, style: {
          position: 'absolute',
          left: pxBase + pWobble - pSize / 2, top: pY,
          width: pSize, height: pSize, borderRadius: '50%',
          background: pColor,
          opacity: pAlpha * 0.4,
          boxShadow: '0 0 ' + (pSize * 3) + 'px ' + pColor + '50',
          pointerEvents: 'none', zIndex: 2
        }}));
      }
    }
  }

  // ===== FLOWHUNT LOGO ICON =====
  var logoOp = f >= 20 ? (f < 65 ? eo3(p(20, 65)) : 1) : 0;
  var logoScale = f >= 20 ? (f < 65 ? eob(p(20, 65)) : 1) : 0;

  if (logoOp > 0) {
    var logoSize = 90;
    var logoCX = W / 2;
    var logoCY = H * 0.30;
    var logoFloat = logoScale >= 1 ? float(1, 3, 0.035) : 0;
    var logoGlow = logoScale >= 1 ? breathe(1, 0.05) : 0;

    // Pulse rings around logo
    if (f >= 40 && f < 180) {
      for (var ri = 0; ri < 3; ri++) {
        var ringStart = 40 + ri * 18;
        if (f < ringStart) continue;
        var ringPhase = ((f - ringStart) % 60) / 60;
        var ringRadius = 55 + ringPhase * 80;
        var ringAlpha = (1 - ringPhase) * 0.3 * logoOp;
        if (ringAlpha > 0.01) {
          children.push(e('div', { key: 'lr' + ri, style: {
            position: 'absolute',
            left: logoCX - ringRadius, top: logoCY - ringRadius + logoFloat,
            width: ringRadius * 2, height: ringRadius * 2,
            borderRadius: '50%',
            border: '2px solid rgba(70,92,224,' + ringAlpha + ')',
            pointerEvents: 'none', zIndex: 4
          }}));
        }
      }
    }

    // Persistent gentle pulse ring after initial burst
    if (f >= 180) {
      var pulsePhase = ((f - 180) % 90) / 90;
      var pulseR = 55 + pulsePhase * 60;
      var pulseA = (1 - pulsePhase) * 0.15;
      children.push(e('div', { key: 'lr-persist', style: {
        position: 'absolute',
        left: logoCX - pulseR, top: logoCY - pulseR + logoFloat,
        width: pulseR * 2, height: pulseR * 2,
        borderRadius: '50%',
        border: '1.5px solid rgba(70,92,224,' + pulseA + ')',
        pointerEvents: 'none', zIndex: 4
      }}));
    }

    // Logo icon container with glow
    children.push(e('div', { key: 'logo', style: {
      position: 'absolute',
      left: logoCX - logoSize / 2, top: logoCY - logoSize / 2 + logoFloat,
      width: logoSize, height: logoSize,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      opacity: logoOp,
      transform: 'scale(' + logoScale + ')',
      filter: 'drop-shadow(0 0 ' + (20 + logoGlow * 15) + 'px rgba(70,92,224,' + (0.4 + logoGlow * 0.2) + '))',
      zIndex: 5
    }},
      e('svg', { width: logoSize, height: logoSize * 0.81, viewBox: '0 0 20 16.2', fill: 'none' },
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
      )
    ));
  }

  // ===== "v2.0" BADGE =====
  var vBadgeOp = f >= 50 ? (f < 80 ? eo3(p(50, 80)) : 1) : 0;
  var vBadgeScale = f >= 50 ? (f < 80 ? eob(p(50, 80)) : 1) : 0;
  if (vBadgeOp > 0) {
    var vFloat = vBadgeScale >= 1 ? float(2, 2, 0.04) : 0;
    children.push(e('div', { key: 'v-badge', style: {
      position: 'absolute',
      left: W / 2 + 42, top: H * 0.30 - 50 + vFloat,
      padding: '4px 12px', borderRadius: 8,
      background: 'linear-gradient(135deg, ' + C_GR1 + ', ' + C_GR2 + ')',
      color: '#fff', fontSize: 14, fontWeight: 700,
      letterSpacing: '0.5px',
      opacity: vBadgeOp,
      transform: 'scale(' + vBadgeScale + ')',
      boxShadow: '0 4px 16px rgba(70,92,224,0.4)',
      zIndex: 6
    }}, 'v2.0'));
  }

  // ===== "FlowHunt" WORDMARK =====
  var wordOp = f >= 70 ? (f < 110 ? eo3(p(70, 110)) : 1) : 0;
  if (wordOp > 0) {
    var wordFloat = wordOp >= 1 ? float(3, 2.5, 0.035) : 0;
    var shWord = -((f * 3) % 400);
    children.push(e('div', { key: 'wordmark', style: {
      position: 'absolute',
      left: 0, width: W,
      top: H * 0.30 + 55 + wordFloat,
      textAlign: 'center',
      opacity: wordOp,
      transform: 'translateY(' + ((1 - wordOp) * 15) + 'px)',
      zIndex: 6
    }},
      e('span', { style: {
        fontSize: 52, fontWeight: 800, letterSpacing: '-1px',
        background: 'linear-gradient(90deg, #fff, rgba(255,255,255,0.6), #fff, rgba(255,255,255,0.6), #fff)',
        backgroundSize: '400% 100%',
        backgroundPosition: shWord + '% 0',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}, 'FlowHunt')
    ));
  }

  // ===== TAGLINE: "A workflow engine rebuilt for AI" =====
  var tagOp = f >= 100 ? (f < 140 ? eo3(p(100, 140)) : 1) : 0;
  if (tagOp > 0) {
    var shTag = -((f * 4) % 350);
    children.push(e('div', { key: 'tagline', style: {
      position: 'absolute',
      left: 0, width: W,
      top: H * 0.53,
      textAlign: 'center',
      opacity: tagOp,
      transform: 'translateY(' + ((1 - tagOp) * 20) + 'px)',
      zIndex: 6
    }},
      e('span', { style: { fontSize: 28, fontWeight: 400, color: 'rgba(255,255,255,0.5)' } }, 'A workflow engine '),
      e('span', { style: {
        fontSize: 28, fontWeight: 700,
        background: 'linear-gradient(90deg, ' + C_GR1 + ', ' + C_GR2 + ', ' + C_GR3 + ', #fff, ' + C_GR3 + ', ' + C_GR2 + ', ' + C_GR1 + ')',
        backgroundSize: '350% 100%',
        backgroundPosition: shTag + '% 0',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}, 'rebuilt for AI')
    ));
  }

  // ===== SUB-TAGLINE: "Describe what you need, and let the agent build it." =====
  var subOp = f >= 150 ? (f < 190 ? eo3(p(150, 190)) : 1) : 0;
  if (subOp > 0) {
    children.push(e('div', { key: 'sub-tag', style: {
      position: 'absolute',
      left: 0, width: W,
      top: H * 0.53 + 50,
      textAlign: 'center',
      opacity: subOp,
      transform: 'translateY(' + ((1 - subOp) * 15) + 'px)',
      zIndex: 6
    }},
      e('span', { style: {
        fontSize: 20, fontWeight: 400, color: 'rgba(255,255,255,0.4)',
        lineHeight: '1.6'
      }}, 'Describe what you need, and let the agent build it.')
    ));
  }

  // ===== HORIZONTAL SHIMMER LINE =====
  if (f >= 130 && f < 200) {
    var lineProgress = eo3(p(130, 200));
    var lineX = -200 + lineProgress * (W + 400);
    var lineOp = lineProgress < 0.1 ? lineProgress / 0.1 : lineProgress > 0.8 ? (1 - lineProgress) / 0.2 : 1;
    children.push(e('div', { key: 'shimmer-line', style: {
      position: 'absolute',
      left: lineX - 150, top: H * 0.50,
      width: 300, height: 1,
      background: 'linear-gradient(90deg, transparent, rgba(70,92,224,' + (lineOp * 0.6) + '), rgba(152,74,215,' + (lineOp * 0.4) + '), transparent)',
      pointerEvents: 'none', zIndex: 5
    }}));
  }

  // ===== "Start Free" CTA BUTTON =====
  var ctaOp = f >= 220 ? (f < 270 ? eo3(p(220, 270)) : 1) : 0;
  var ctaScale = f >= 220 ? (f < 270 ? eob(p(220, 270)) : 1) : 0;
  if (ctaOp > 0) {
    var ctaBreath = ctaScale >= 1 ? breathe(20, 0.06) : 0;
    var ctaPulse = 1 + ctaBreath * 0.03;
    var ctaGlow = 0.3 + ctaBreath * 0.2;
    var ctaFloat = ctaScale >= 1 ? float(20, 2, 0.04) : 0;

    // Glow ring behind button
    if (ctaScale >= 1) {
      var ctaRingPhase = ((f - 270) % 80) / 80;
      var ctaRingR = 30 + ctaRingPhase * 40;
      var ctaRingA = (1 - ctaRingPhase) * 0.12;
      children.push(e('div', { key: 'cta-ring', style: {
        position: 'absolute',
        left: W / 2 - 110 - ctaRingR + 110, top: H * 0.72 - ctaRingR + 25 + ctaFloat,
        width: ctaRingR * 2, height: ctaRingR * 2,
        borderRadius: '50%',
        border: '1.5px solid rgba(70,92,224,' + ctaRingA + ')',
        pointerEvents: 'none', zIndex: 7
      }}));
    }

    children.push(e('div', { key: 'cta', style: {
      position: 'absolute',
      left: W / 2 - 110, top: H * 0.72 + ctaFloat,
      width: 220, height: 50,
      borderRadius: 25,
      background: 'linear-gradient(135deg, ' + C_GR1 + ', ' + C_GR2 + ', ' + C_GR3 + ')',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontSize: 18, fontWeight: 700,
      letterSpacing: '0.5px',
      opacity: ctaOp,
      transform: 'scale(' + (ctaScale * ctaPulse) + ')',
      boxShadow: '0 6px ' + (30 + ctaBreath * 15) + 'px rgba(70,92,224,' + ctaGlow + ')',
      zIndex: 8
    }},
      // Arrow icon
      e('span', { style: { marginRight: 8 } }, 'Start Free'),
      svg(18, 18, '0 0 24 24', [
        e('path', { key: 'arr', d: 'M5 12h14M12 5l7 7-7 7', stroke: '#fff', strokeWidth: '2.5', strokeLinecap: 'round', strokeLinejoin: 'round' })
      ])
    ));
  }

  // ===== "flowhunt.io" URL =====
  var urlOp = f >= 260 ? (f < 300 ? eo3(p(260, 300)) : 1) : 0;
  if (urlOp > 0) {
    var urlFloat = urlOp >= 1 ? float(30, 1.5, 0.04) : 0;
    children.push(e('div', { key: 'url', style: {
      position: 'absolute',
      left: 0, width: W,
      top: H * 0.72 + 65 + urlFloat,
      textAlign: 'center',
      opacity: urlOp * 0.6,
      transform: 'translateY(' + ((1 - urlOp) * 10) + 'px)',
      zIndex: 6
    }},
      e('span', { style: {
        fontSize: 16, fontWeight: 500, color: 'rgba(255,255,255,0.5)',
        letterSpacing: '1px'
      }}, 'flowhunt.io')
    ));
  }

  // ===== BOTTOM DECORATIVE LINE =====
  if (f >= 250) {
    var lineOp2 = f < 290 ? eo3(p(250, 290)) : 1;
    var lineW = 200 + breathe(40, 0.03) * 40;
    children.push(e('div', { key: 'bottom-line', style: {
      position: 'absolute',
      left: W / 2 - lineW / 2, top: H * 0.72 + 100,
      width: lineW, height: 1,
      background: 'linear-gradient(90deg, transparent, rgba(70,92,224,' + (lineOp2 * 0.3) + '), rgba(152,74,215,' + (lineOp2 * 0.2) + '), transparent)',
      pointerEvents: 'none', zIndex: 5
    }}));
  }

  // ===== CORNER ACCENTS (subtle geometric decorations) =====
  if (f >= 80) {
    var cornerOp = f < 120 ? eo3(p(80, 120)) : 1;
    // Top-left corner lines
    children.push(e('div', { key: 'corner-tl', style: {
      position: 'absolute', top: 50, left: 60,
      width: 60, height: 60,
      borderLeft: '1px solid rgba(70,92,224,' + (cornerOp * 0.15) + ')',
      borderTop: '1px solid rgba(70,92,224,' + (cornerOp * 0.15) + ')',
      opacity: cornerOp, zIndex: 3
    }}));
    // Top-right
    children.push(e('div', { key: 'corner-tr', style: {
      position: 'absolute', top: 50, right: 60,
      width: 60, height: 60,
      borderRight: '1px solid rgba(70,92,224,' + (cornerOp * 0.15) + ')',
      borderTop: '1px solid rgba(70,92,224,' + (cornerOp * 0.15) + ')',
      opacity: cornerOp, zIndex: 3
    }}));
    // Bottom-left
    children.push(e('div', { key: 'corner-bl', style: {
      position: 'absolute', bottom: 50, left: 60,
      width: 60, height: 60,
      borderLeft: '1px solid rgba(70,92,224,' + (cornerOp * 0.12) + ')',
      borderBottom: '1px solid rgba(70,92,224,' + (cornerOp * 0.12) + ')',
      opacity: cornerOp, zIndex: 3
    }}));
    // Bottom-right
    children.push(e('div', { key: 'corner-br', style: {
      position: 'absolute', bottom: 50, right: 60,
      width: 60, height: 60,
      borderRight: '1px solid rgba(70,92,224,' + (cornerOp * 0.12) + ')',
      borderBottom: '1px solid rgba(70,92,224,' + (cornerOp * 0.12) + ')',
      opacity: cornerOp, zIndex: 3
    }}));
  }

  // ===== BURST SPARKLES ON CTA APPEAR =====
  if (f >= 230 && f < 290) {
    var burstO = f < 255 ? eo3(p(230, 255)) : 1 - eo3(p(255, 290));
    var burstColors = [C_GR1, C_GR2, C_GR3, '#10b981', '#f59e0b', '#ec4899'];
    for (var bi = 0; bi < 12; bi++) {
      var bSeed = hash(bi + 800);
      var bAngle = (bi / 12) * Math.PI * 2 + bSeed * 0.5;
      var bDist = 20 + (f - 230) * (2 + bSeed * 2.5);
      var bx = W / 2 + Math.cos(bAngle) * bDist;
      var by = H * 0.72 + 25 + Math.sin(bAngle) * bDist * 0.6;
      var bSize = 3 + bSeed * 5;
      if (burstO > 0.01) {
        children.push(e('div', { key: 'burst' + bi, style: {
          position: 'absolute',
          left: bx - bSize / 2, top: by - bSize / 2,
          width: bSize, height: bSize,
          borderRadius: '50%',
          background: burstColors[bi % burstColors.length],
          opacity: burstO * 0.7,
          boxShadow: '0 0 ' + (bSize * 2) + 'px ' + burstColors[bi % burstColors.length] + '60',
          pointerEvents: 'none', zIndex: 9
        }}));
      }
    }
  }

  // ===== RENDER =====
  return e('div', { style: {
    position: 'relative', width: W, height: H, overflow: 'hidden',
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    background: '#030308'
  }}, children);
}
