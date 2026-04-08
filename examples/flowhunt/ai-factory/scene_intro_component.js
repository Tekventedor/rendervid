// Scene Intro: Short FlowHunt AI Projects logo reveal (3s = 90 frames @ 30fps)
function AIFactoryIntroScene(props) {
  var f = props.frame || 0;
  var W = props.layerSize.width;
  var H = props.layerSize.height;
  var e = React.createElement;

  function eo3(t) { return 1 - Math.pow(1 - t, 3); }
  function eob(t) { var c = 2.0; return Math.min(1 + ((c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2)), 1.08); }
  function cl(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function p(s, n) { return cl((f - s) / (n - s), 0, 1); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function hash(i) { return (((i * 2654435761) >>> 0) % 10000) / 10000; }
  function breathe(seed, speed) { return (Math.sin(f * (speed || 0.06) + (seed || 0) * 3.7) + 1) * 0.5; }

  var C_GR1 = '#984ad7';
  var C_GR2 = '#465ce0';
  var C_GR3 = '#0497dc';
  var C_TEXT = '#111827';

  var FLOWHUNT_PATH = 'M2.6,12.7l-.9,2.1c-.2.4,0,.8.2,1.1.2.2.4.3.7.3s.5,0,.7-.3l.8-.8,3.2-3.2c.1-.1,0-.4-.2-.4h-1.8s0,0,0,0c-1.9,0-3.4-1.6-3.4-3.5,0-1.9,1.6-3.3,3.5-3.3h3.8c0,0,.1,0,.2,0l1.5-1.5c.1-.1,0-.4-.2-.4h-5.4C2.5,2.7,0,5.2,0,8.1c0,2,1.1,3.7,2.6,4.6h0ZM14.5,11.5c1.9,0,3.4-1.5,3.5-3.3,0-1.9-1.5-3.5-3.4-3.5s0,0,0,0h-1.8c-.2,0-.3-.3-.2-.4l3.3-3.3h0l.7-.7c.4-.4,1-.4,1.4,0,.3.3.4.8.3,1.1l-.9,2.1c1.6.9,2.6,2.6,2.6,4.6,0,3-2.5,5.4-5.5,5.4h-5.4c-.2,0-.3-.3-.2-.4l1.5-1.5s.1,0,.2,0h3.8,0ZM13.6,6.3c1,0,1.7.8,1.7,1.7s-.8,1.7-1.7,1.7-1.7-.8-1.7-1.7.8-1.7,1.7-1.7ZM6.5,6.3c1,0,1.7.8,1.7,1.7s-.8,1.7-1.7,1.7-1.7-.8-1.7-1.7.8-1.7,1.7-1.7Z';

  var children = [];

  // Total: 90 frames
  // f0-15:  Logo zooms in with bounce
  // f10-30: Pulse rings emanate
  // f15-40: "FlowHunt AI Projects" text reveals
  // f40-75: Hold
  // f75-90: Fade out

  var fadeIn = f < 12 ? eo3(p(0, 12)) : 1;
  var fadeOut = f >= 78 ? 1 - eo3(p(78, 90)) : 1;
  var globalOp = fadeIn * fadeOut;

  // Background: soft radial gradient
  children.push(e('div', { key: 'bg', style: {
    position: 'absolute', top: 0, left: 0, width: W, height: H,
    background: 'radial-gradient(ellipse at 50% 45%, #ffffff 0%, #f0f4f8 50%, #e8ecf4 100%)',
    opacity: globalOp
  }}));

  // Subtle grid dots
  children.push(e('div', { key: 'dots', style: {
    position: 'absolute', top: 0, left: 0, width: W, height: H,
    backgroundImage: 'radial-gradient(circle, #c7cdd4 1px, transparent 1px)',
    backgroundSize: '32px 32px',
    opacity: globalOp * 0.3,
    pointerEvents: 'none'
  }}));

  var cx = W / 2;
  var cy = H / 2 - 30;

  // Glow behind logo
  if (f >= 6) {
    var glowBreath = breathe(0, 0.08);
    children.push(e('div', { key: 'glow', style: {
      position: 'absolute',
      left: cx - 280, top: cy - 180,
      width: 560, height: 360, borderRadius: '50%',
      background: 'radial-gradient(ellipse, rgba(70,92,224,' + (0.18 + glowBreath * 0.08) + ') 0%, rgba(152,74,215,' + (0.08 + glowBreath * 0.04) + ') 40%, transparent 70%)',
      filter: 'blur(50px)',
      opacity: globalOp,
      pointerEvents: 'none'
    }}));
  }

  // Logo zoom-in
  var logoOp = f >= 0 ? eo3(p(0, 18)) : 0;
  var logoScale = f >= 0 ? eob(p(0, 22)) : 0;
  var logoSize = 130;

  // Pulse rings
  if (f >= 12) {
    for (var pri = 0; pri < 2; pri++) {
      var pPhase = ((f - 12 + pri * 25) % 50) / 50;
      var pR = logoSize / 2 + 20 + pPhase * 80;
      var pAlpha = (1 - pPhase) * 0.22;
      children.push(e('div', { key: 'pulse-' + pri, style: {
        position: 'absolute',
        left: cx - pR, top: cy - pR,
        width: pR * 2, height: pR * 2, borderRadius: '50%',
        border: '2px solid rgba(70,92,224,' + pAlpha + ')',
        opacity: globalOp,
        pointerEvents: 'none'
      }}));
    }
  }

  // Logo
  children.push(e('div', { key: 'logo', style: {
    position: 'absolute',
    left: cx - logoSize / 2, top: cy - logoSize / 2,
    width: logoSize, height: logoSize, borderRadius: 28,
    background: 'linear-gradient(135deg, ' + C_GR1 + ', ' + C_GR2 + ', ' + C_GR3 + ')',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    opacity: logoOp * globalOp,
    transform: 'scale(' + logoScale + ')',
    boxShadow: '0 16px 50px rgba(70,92,224,0.35), 0 0 60px rgba(152,74,215,0.25)',
    zIndex: 5
  }},
    e('svg', { width: 80, height: 65, viewBox: '0 0 20 16.2', fill: 'none' },
      e('path', { d: FLOWHUNT_PATH, fill: '#ffffff' })
    )
  ));

  // "FlowHunt AI Projects" text
  var textOp = f >= 18 ? eo3(p(18, 38)) : 0;
  var textY = f >= 18 ? lerp(20, 0, eo3(p(18, 38))) : 20;
  if (textOp > 0) {
    children.push(e('div', { key: 'text', style: {
      position: 'absolute',
      left: 0, top: cy + 90 + textY,
      width: W, textAlign: 'center',
      opacity: textOp * globalOp,
      zIndex: 6
    }},
      e('span', { style: {
        fontSize: 56, fontWeight: 800, letterSpacing: '-1.2px',
        color: C_TEXT
      }}, 'FlowHunt'),
      e('span', { style: {
        fontSize: 56, fontWeight: 800, letterSpacing: '-1.2px',
        background: 'linear-gradient(135deg, ' + C_GR1 + ', ' + C_GR2 + ', ' + C_GR3 + ')',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        marginLeft: 18
      }}, 'AI Projects')
    ));
  }

  // Tagline
  var tagOp = f >= 28 ? eo3(p(28, 48)) : 0;
  if (tagOp > 0) {
    children.push(e('div', { key: 'tagline', style: {
      position: 'absolute',
      left: 0, top: cy + 170,
      width: W, textAlign: 'center',
      fontSize: 18, fontWeight: 400, color: '#6b7280',
      letterSpacing: '0.3px',
      opacity: tagOp * globalOp,
      zIndex: 6
    }}, 'Build your AI workforce in minutes'));
  }

  return e('div', { style: {
    position: 'relative', width: W, height: H, overflow: 'hidden',
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    background: '#f0f4f8'
  }}, children);
}
