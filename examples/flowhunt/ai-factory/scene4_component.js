// Scene 4: AI Projects Closing CTA — FlowHunt brand reveal & feature recap (15s = 450 frames @ 30fps)
// Light themed closing with FlowHunt logo, "AI Projects" gradient text, feature bullets with real SVG icons, and CTA button.
function AIFactoryClosingScene(props) {
  var f = props.frame || 0;
  var W = props.layerSize.width;
  var H = props.layerSize.height;
  var e = React.createElement;

  // ===== EASING & HELPERS =====
  function eo3(t) { return 1 - Math.pow(1 - t, 3); }
  function eob(t) { var c = 2.2; return Math.min(1 + ((c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2)), 1.12); }
  function cl(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function p(s, n) { return cl((f - s) / (n - s), 0, 1); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function hash(i) { return (((i * 2654435761) >>> 0) % 10000) / 10000; }
  function breathe(seed, speed) { return (Math.sin(f * (speed || 0.06) + (seed || 0) * 3.7) + 1) * 0.5; }
  function float(seed, amp, speed) { return Math.sin(f * (speed || 0.04) + (seed || 0) * 4.1) * (amp || 2); }

  // ===== COLORS (FlowHunt brand) =====
  var C_GR1 = '#984ad7';
  var C_GR2 = '#465ce0';
  var C_GR3 = '#0497dc';
  var C_BG = '#f0f4f8';
  var C_CARD = '#ffffff';
  var C_CARD_BORDER = '#e5e7eb';
  var C_TEXT = '#111827';
  var C_TEXT_DIM = '#6b7280';
  var C_TEXT_MUTED = '#9ca3af';
  var C_BLUE = '#3b82f6';

  var FLOWHUNT_PATH = 'M2.6,12.7l-.9,2.1c-.2.4,0,.8.2,1.1.2.2.4.3.7.3s.5,0,.7-.3l.8-.8,3.2-3.2c.1-.1,0-.4-.2-.4h-1.8s0,0,0,0c-1.9,0-3.4-1.6-3.4-3.5,0-1.9,1.6-3.3,3.5-3.3h3.8c0,0,.1,0,.2,0l1.5-1.5c.1-.1,0-.4-.2-.4h-5.4C2.5,2.7,0,5.2,0,8.1c0,2,1.1,3.7,2.6,4.6h0ZM14.5,11.5c1.9,0,3.4-1.5,3.5-3.3,0-1.9-1.5-3.5-3.4-3.5s0,0,0,0h-1.8c-.2,0-.3-.3-.2-.4l3.3-3.3h0l.7-.7c.4-.4,1-.4,1.4,0,.3.3.4.8.3,1.1l-.9,2.1c1.6.9,2.6,2.6,2.6,4.6,0,3-2.5,5.4-5.5,5.4h-5.4c-.2,0-.3-.3-.2-.4l1.5-1.5s.1,0,.2,0h3.8,0ZM13.6,6.3c1,0,1.7.8,1.7,1.7s-.8,1.7-1.7,1.7-1.7-.8-1.7-1.7.8-1.7,1.7-1.7ZM6.5,6.3c1,0,1.7.8,1.7,1.7s-.8,1.7-1.7,1.7-1.7-.8-1.7-1.7.8-1.7,1.7-1.7Z';
  var ROBOT_PATH = 'M10 .667a1 1 0 011 1v.667h2.333A2.667 2.667 0 0116 5v3.334a2.667 2.667 0 01-2.5 2.661v.054l2.78 1.39a1 1 0 01-.894 1.79l-1.886-.944V17.5a1 1 0 01-2 0V16h-3v1.5a1 1 0 11-2 0v-4.215l-1.886.943a1 1 0 11-.894-1.789l2.78-1.39v-.054A2.667 2.667 0 014 8.334V5a2.667 2.667 0 012.667-2.666H9v-.667a1 1 0 011-1zM6.667 4.334A.667.667 0 006 5v3.334A.667.667 0 006.667 9h6.666A.667.667 0 0014 8.334V5a.667.667 0 00-.667-.666H6.667zM11.5 11h-3v3h3v-2.313a.97.97 0 010-.042V11zM8.333 5.667a1 1 0 011 1v.008a1 1 0 01-2 0v-.008a1 1 0 011-1zm3.334 0a1 1 0 011 1v.008a1 1 0 11-2 0v-.008a1 1 0 011-1z';
  var SPARKLE_PATH = 'M12 0L13.5 8.5L22 10L13.5 11.5L12 20L10.5 11.5L2 10L10.5 8.5L12 0Z';
  var LIST_PATH = 'M3 6H21V8H3V6ZM3 11H21V13H3V11ZM3 16H21V18H3V16Z';
  var LINK_PATH = 'M3.9 12C3.9 10.29 5.29 8.9 7 8.9H11V7H7C4.24 7 2 9.24 2 12S4.24 17 7 17H11V15.1H7C5.29 15.1 3.9 13.71 3.9 12ZM8 13H16V11H8V13ZM17 7H13V8.9H17C18.71 8.9 20.1 10.29 20.1 12S18.71 15.1 17 15.1H13V17H17C19.76 17 22 14.76 22 12S19.76 7 17 7Z';
  var BELL_PATH = 'M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z';
  var CHECK_PATH = 'M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z';

  var children = [];

  // ===== TIMELINE (450 frames = 15s) =====
  // f0-30:    Fade in
  // f30-90:   FlowHunt logo zooms in with pulse rings
  // f80-130:  "FlowHunt AI Projects" text reveal
  // f130-280: 4 feature bullets fade in (staggered, with icons)
  // f240-320: CTA button bounces in
  // f300-360: URL + tagline appears
  // f300+:    Subtle breathing/floating
  // f420-450: Fade out

  // Global fade
  var fadeIn = f < 30 ? eo3(p(0, 30)) : 1;
  var fadeOut = f >= 425 ? 1 - eo3(p(425, 450)) : 1;
  var globalOp = fadeIn * fadeOut;

  // ===== BACKGROUND (light gradient) =====
  children.push(e('div', { key: 'bg', style: {
    position: 'absolute', top: 0, left: 0, width: W, height: H,
    background: 'radial-gradient(ellipse at 50% 40%, #ffffff 0%, ' + C_BG + ' 60%, #e8ecf4 100%)',
    opacity: globalOp
  }}));

  // Subtle grid dots
  children.push(e('div', { key: 'dots', style: {
    position: 'absolute', top: 0, left: 0, width: W, height: H,
    backgroundImage: 'radial-gradient(circle, #c7cdd4 1px, transparent 1px)',
    backgroundSize: '32px 32px',
    opacity: globalOp * 0.35,
    pointerEvents: 'none'
  }}));

  // Soft radial glow behind logo
  if (f >= 30) {
    var glowOp = f < 70 ? eo3(p(30, 70)) : 1;
    var glowBreath = breathe(0, 0.05);
    children.push(e('div', { key: 'glow', style: {
      position: 'absolute',
      left: W / 2 - 350, top: H * 0.18 - 150,
      width: 700, height: 400, borderRadius: '50%',
      background: 'radial-gradient(ellipse, rgba(70,92,224,' + (0.12 + glowBreath * 0.06) + ') 0%, rgba(152,74,215,' + (0.06 + glowBreath * 0.03) + ') 35%, transparent 70%)',
      filter: 'blur(40px)',
      opacity: glowOp * globalOp,
      pointerEvents: 'none'
    }}));
  }

  // ===== FLOWHUNT LOGO (centered, large, with pulse rings) =====
  var logoStart = 30;
  var logoOp = f >= logoStart ? (f < logoStart + 40 ? eo3(p(logoStart, logoStart + 40)) : 1) : 0;
  var logoScale = f >= logoStart ? (f < logoStart + 40 ? eob(p(logoStart, logoStart + 40)) : 1) : 0;
  var logoFloat = logoScale >= 1 ? float(0, 3, 0.04) : 0;
  var logoBreath = logoScale >= 1 ? breathe(0, 0.05) : 0;

  if (logoOp > 0) {
    var logoSize = 100;
    var logoCX = W / 2;
    var logoCY = H * 0.27;

    // Pulse rings emanating
    if (f >= logoStart + 30) {
      for (var pri = 0; pri < 2; pri++) {
        var pPhase = ((f - logoStart - 30 + pri * 40) % 80) / 80;
        var pR = logoSize / 2 + 15 + pPhase * 60;
        var pAlpha = (1 - pPhase) * 0.18;
        children.push(e('div', { key: 'pulse-' + pri, style: {
          position: 'absolute',
          left: logoCX - pR, top: logoCY - pR + logoFloat,
          width: pR * 2, height: pR * 2, borderRadius: '50%',
          border: '1.5px solid rgba(70,92,224,' + pAlpha + ')',
          opacity: globalOp,
          pointerEvents: 'none'
        }}));
      }
    }

    // FlowHunt logo (gradient bg with white SVG)
    children.push(e('div', { key: 'logo', style: {
      position: 'absolute',
      left: logoCX - logoSize / 2, top: logoCY - logoSize / 2 + logoFloat,
      width: logoSize, height: logoSize, borderRadius: 22,
      background: 'linear-gradient(135deg, ' + C_GR1 + ', ' + C_GR2 + ', ' + C_GR3 + ')',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      opacity: logoOp * globalOp,
      transform: 'scale(' + logoScale + ')',
      boxShadow: '0 12px 40px rgba(70,92,224,' + (0.25 + logoBreath * 0.1) + '), 0 0 ' + (30 + logoBreath * 20) + 'px rgba(152,74,215,0.2)',
      zIndex: 5
    }},
      e('svg', { width: 60, height: 49, viewBox: '0 0 20 16.2', fill: 'none' },
        e('path', { d: FLOWHUNT_PATH, fill: '#ffffff' })
      )
    ));
  }

  // ===== "FlowHunt AI Projects" TEXT =====
  var textStart = 80;
  var textOp = f >= textStart ? (f < textStart + 35 ? eo3(p(textStart, textStart + 35)) : 1) : 0;
  if (textOp > 0) {
    children.push(e('div', { key: 'word', style: {
      position: 'absolute',
      left: 0, top: H * 0.27 + 70 + logoFloat,
      width: W, textAlign: 'center',
      opacity: textOp * globalOp,
      zIndex: 6
    }},
      e('span', { style: {
        fontSize: 52, fontWeight: 800, letterSpacing: '-1.2px',
        color: C_TEXT
      }}, 'FlowHunt'),
      e('span', { style: {
        fontSize: 52, fontWeight: 800, letterSpacing: '-1.2px',
        background: 'linear-gradient(135deg, ' + C_GR1 + ', ' + C_GR2 + ', ' + C_GR3 + ')',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        marginLeft: 16
      }}, 'AI Projects')
    ));

    // Tagline below
    var tagOp = f >= textStart + 20 ? eo3(p(textStart + 20, textStart + 50)) : 0;
    children.push(e('div', { key: 'tagline', style: {
      position: 'absolute',
      left: 0, top: H * 0.27 + 145 + logoFloat,
      width: W, textAlign: 'center',
      fontSize: 16, fontWeight: 400, color: C_TEXT_DIM,
      opacity: tagOp * globalOp,
      zIndex: 6
    }}, 'Describe your goals. We build the workforce.'));
  }

  // ===== FEATURE BULLETS =====
  var features = [
    { iconPath: SPARKLE_PATH, color: '#984ad7', text: 'Natural language project creation' },
    { iconPath: ROBOT_PATH, color: '#465ce0', text: 'Auto-generated multi-agent teams', vb: '0 0 20 20' },
    { iconPath: LIST_PATH, color: '#0497dc', text: 'Real-time Kanban task tracking' },
    { iconPath: BELL_PATH, color: '#16a34a', text: 'Stay in the loop via Slack & iMessage' }
  ];

  var bulletStartBase = 130;
  var bulletStartY = H * 0.55;
  var bulletGap = 48;
  var bulletW = 380;
  var bulletX = W / 2 - bulletW / 2;

  features.forEach(function(feat, fi) {
    var fStart = bulletStartBase + fi * 14;
    var fOp = f >= fStart ? eo3(p(fStart, fStart + 28)) : 0;
    var fX = f >= fStart ? -25 * (1 - eo3(p(fStart, fStart + 28))) : -25;

    if (fOp <= 0.01) return;

    children.push(e('div', { key: 'feat-' + fi, style: {
      position: 'absolute',
      left: bulletX + fX, top: bulletStartY + fi * bulletGap,
      width: bulletW,
      display: 'flex', alignItems: 'center', gap: 14,
      opacity: fOp * globalOp,
      zIndex: 7
    }},
      // Icon container
      e('div', { style: {
        width: 36, height: 36, borderRadius: 10,
        background: feat.color + '15',
        border: '1px solid ' + feat.color + '30',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0
      }},
        e('svg', { width: 18, height: 18, viewBox: feat.vb || '0 0 24 24', fill: feat.color },
          e('path', { d: feat.iconPath })
        )
      ),
      // Text
      e('span', { style: {
        fontSize: 16, fontWeight: 500, color: C_TEXT,
        letterSpacing: '-0.1px'
      }}, feat.text)
    ));
  });

  // ===== CTA BUTTON =====
  var ctaStart = 240;
  var ctaOp = f >= ctaStart ? eo3(p(ctaStart, ctaStart + 35)) : 0;
  var ctaScale = f >= ctaStart ? (f < ctaStart + 35 ? eob(p(ctaStart, ctaStart + 35)) : 1) : 0;
  if (ctaOp > 0) {
    var ctaBreath = ctaScale >= 1 ? breathe(20, 0.06) : 0;
    var ctaPulse = 1 + ctaBreath * 0.025;
    var ctaFloat = ctaScale >= 1 ? float(20, 2, 0.04) : 0;
    var btnW = 260;
    var btnH = 56;

    // Pulse ring behind CTA
    if (ctaScale >= 1) {
      var ringPhase = ((f - ctaStart - 35) % 70) / 70;
      var ringR = btnW / 2 + ringPhase * 30;
      children.push(e('div', { key: 'cta-ring', style: {
        position: 'absolute',
        left: W / 2 - ringR, top: H * 0.83 + btnH / 2 - ringR + ctaFloat,
        width: ringR * 2, height: ringR * 2, borderRadius: '50%',
        border: '1.5px solid rgba(70,92,224,' + ((1 - ringPhase) * 0.2) + ')',
        opacity: globalOp,
        pointerEvents: 'none'
      }}));
    }

    children.push(e('div', { key: 'cta', style: {
      position: 'absolute',
      left: W / 2 - btnW / 2, top: H * 0.83 + ctaFloat,
      width: btnW, height: btnH, borderRadius: 28,
      background: 'linear-gradient(135deg, ' + C_GR1 + ', ' + C_GR2 + ', ' + C_GR3 + ')',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
      color: '#ffffff', fontSize: 18, fontWeight: 700, letterSpacing: '0.2px',
      opacity: ctaOp * globalOp,
      transform: 'scale(' + (ctaScale * ctaPulse) + ')',
      boxShadow: '0 8px ' + (28 + ctaBreath * 14) + 'px rgba(70,92,224,' + (0.35 + ctaBreath * 0.15) + '), 0 4px 12px rgba(152,74,215,0.2)',
      zIndex: 8
    }},
      'Try AI Projects Free',
      e('svg', { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: '#ffffff', strokeWidth: 2.5, strokeLinecap: 'round', strokeLinejoin: 'round' },
        e('path', { d: 'M5 12H19M13 6L19 12L13 18' })
      )
    ));
  }

  // ===== URL =====
  var urlStart = 295;
  var urlOp = f >= urlStart ? eo3(p(urlStart, urlStart + 30)) : 0;
  if (urlOp > 0) {
    children.push(e('div', { key: 'url', style: {
      position: 'absolute',
      left: 0, top: H * 0.92,
      width: W, textAlign: 'center',
      fontSize: 14, fontWeight: 500, color: C_TEXT_MUTED,
      letterSpacing: '0.5px',
      opacity: urlOp * globalOp,
      zIndex: 7
    }}, 'flowhunt.io/ai-projects'));
  }

  // ===== AMBIENT PARTICLES =====
  if (f >= 30) {
    var partOp = f < 60 ? eo3(p(30, 60)) : 1;
    for (var pi = 0; pi < 14; pi++) {
      var pSeed = hash(pi + 700);
      var pSpeed = 0.1 + pSeed * 0.3;
      var pxBase = hash(pi + 800) * W;
      var pPhase = ((f - 30) * pSpeed + pSeed * 200) % 150;
      var pY = H + 10 - pPhase * (H + 30) / 150;
      var pFadeIn = Math.min(pPhase / 12, 1);
      var pFadeOut = Math.max(0, 1 - (pPhase - 120) / 30);
      var pAlpha = pFadeIn * pFadeOut * partOp * 0.18;
      var pSize = 2 + pSeed * 3;
      var pColor = [C_GR1, C_GR2, C_GR3][pi % 3];
      var pWobble = Math.sin(pPhase * 0.06 + pSeed * 6.28) * 18;
      if (pAlpha > 0.01) {
        children.push(e('div', { key: 'pt' + pi, style: {
          position: 'absolute',
          left: pxBase + pWobble, top: pY,
          width: pSize, height: pSize, borderRadius: '50%',
          background: pColor, opacity: pAlpha * globalOp,
          boxShadow: '0 0 ' + (pSize * 2) + 'px ' + pColor + '40',
          pointerEvents: 'none', zIndex: 4
        }}));
      }
    }
  }

  return e('div', { style: {
    position: 'relative', width: W, height: H, overflow: 'hidden',
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    background: C_BG
  }}, children);
}
