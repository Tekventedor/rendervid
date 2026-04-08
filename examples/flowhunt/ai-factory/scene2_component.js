// Scene 2: AI Projects Setup Wizard — Mimics the real FlowHunt setup flow 1:1 (15s = 450 frames @ 30fps)
// 5-step wizard: Name → Specification → Integrations → Channel → AI Setup → Team reveal
function AIFactoryAgentSetupScene(props) {
  var f = props.frame || 0;
  var W = props.layerSize.width;
  var H = props.layerSize.height;
  var e = React.createElement;

  // ===== EASING & HELPERS =====
  function eo3(t) { return 1 - Math.pow(1 - t, 3); }
  function eob(t) { var c = 2.0; return Math.min(1 + ((c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2)), 1.08); }
  function cl(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function p(s, n) { return cl((f - s) / (n - s), 0, 1); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function hash(i) { return (((i * 2654435761) >>> 0) % 10000) / 10000; }
  function breathe(seed, speed) { return (Math.sin(f * (speed || 0.06) + (seed || 0) * 3.7) + 1) * 0.5; }
  function float(seed, amp, speed) { return Math.sin(f * (speed || 0.04) + (seed || 0) * 4.1) * (amp || 2); }

  // ===== COLORS =====
  var C_GR1 = '#984ad7';
  var C_GR2 = '#465ce0';
  var C_GR3 = '#0497dc';
  var C_BG = '#ffffff';
  var C_CARD = '#ffffff';
  var C_CARD_BORDER = '#e5e7eb';
  var C_TEXT = '#111827';
  var C_TEXT_DIM = '#6b7280';
  var C_TEXT_MUTED = '#9ca3af';
  var C_BLUE = '#3b82f6';
  var C_BLUE_DARK = '#2563eb';
  var C_INPUT_BG = '#f9fafb';

  // SVG path constants
  var FLOWHUNT_PATH = 'M2.6,12.7l-.9,2.1c-.2.4,0,.8.2,1.1.2.2.4.3.7.3s.5,0,.7-.3l.8-.8,3.2-3.2c.1-.1,0-.4-.2-.4h-1.8s0,0,0,0c-1.9,0-3.4-1.6-3.4-3.5,0-1.9,1.6-3.3,3.5-3.3h3.8c0,0,.1,0,.2,0l1.5-1.5c.1-.1,0-.4-.2-.4h-5.4C2.5,2.7,0,5.2,0,8.1c0,2,1.1,3.7,2.6,4.6h0ZM14.5,11.5c1.9,0,3.4-1.5,3.5-3.3,0-1.9-1.5-3.5-3.4-3.5s0,0,0,0h-1.8c-.2,0-.3-.3-.2-.4l3.3-3.3h0l.7-.7c.4-.4,1-.4,1.4,0,.3.3.4.8.3,1.1l-.9,2.1c1.6.9,2.6,2.6,2.6,4.6,0,3-2.5,5.4-5.5,5.4h-5.4c-.2,0-.3-.3-.2-.4l1.5-1.5s.1,0,.2,0h3.8,0ZM13.6,6.3c1,0,1.7.8,1.7,1.7s-.8,1.7-1.7,1.7-1.7-.8-1.7-1.7.8-1.7,1.7-1.7ZM6.5,6.3c1,0,1.7.8,1.7,1.7s-.8,1.7-1.7,1.7-1.7-.8-1.7-1.7.8-1.7,1.7-1.7Z';
  var ROBOT_PATH = 'M10 .667a1 1 0 011 1v.667h2.333A2.667 2.667 0 0116 5v3.334a2.667 2.667 0 01-2.5 2.661v.054l2.78 1.39a1 1 0 01-.894 1.79l-1.886-.944V17.5a1 1 0 01-2 0V16h-3v1.5a1 1 0 11-2 0v-4.215l-1.886.943a1 1 0 11-.894-1.789l2.78-1.39v-.054A2.667 2.667 0 014 8.334V5a2.667 2.667 0 012.667-2.666H9v-.667a1 1 0 011-1zM6.667 4.334A.667.667 0 006 5v3.334A.667.667 0 006.667 9h6.666A.667.667 0 0014 8.334V5a.667.667 0 00-.667-.666H6.667zM11.5 11h-3v3h3v-2.313a.97.97 0 010-.042V11zM8.333 5.667a1 1 0 011 1v.008a1 1 0 01-2 0v-.008a1 1 0 011-1zm3.334 0a1 1 0 011 1v.008a1 1 0 11-2 0v-.008a1 1 0 011-1z';
  var CHECK_PATH = 'M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z';
  var SPARKLE_PATH = 'M12 0L13.5 8.5L22 10L13.5 11.5L12 20L10.5 11.5L2 10L10.5 8.5L12 0Z';
  var CHAT_PATH = 'M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z';
  var CODE_PATH = 'M9.4 16.6L4.8 12L9.4 7.4L8 6L2 12L8 18L9.4 16.6ZM14.6 16.6L19.2 12L14.6 7.4L16 6L22 12L16 18L14.6 16.6Z';
  var CHART_PATH = 'M3 21V19H21V21H3ZM5 17V8H8V17H5ZM10 17V3H13V17H10ZM15 17V11H18V17H15Z';
  var BRAIN_PATH = 'M12 3a3 3 0 00-3 3v1.5a3 3 0 00-2 2.83V12a3 3 0 002 2.83V16a3 3 0 003 3 3 3 0 003-3v-1.17a3 3 0 002-2.83V10.33a3 3 0 00-2-2.83V6a3 3 0 00-3-3z';
  var LANG_PATH = 'M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z';
  var ARROW_LEFT_PATH = 'M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z';

  // Integration logos (simple SVG paths)
  var INTEGRATIONS = [
    { name: 'Airtable', color: '#fcb400', bg: '#fffbeb', icon: 'M11.992 1.966c-.434 0-.866.086-1.27.257L1.779 6.038c-.45.19-.448.83.004 1.017l8.991 3.7c.785.323 1.665.323 2.45 0l8.991-3.7c.452-.187.453-.826.004-1.016l-8.957-3.816c-.405-.171-.838-.257-1.27-.257zM23 8.55a.484.484 0 00-.301.066l-9.209 5.06a.484.484 0 00-.218.41v8.16a.484.484 0 00.694.423l9.21-4.43a.484.484 0 00.273-.43V8.74a.484.484 0 00-.449-.49zM1 8.55a.484.484 0 00-.395.486v8.85a.484.484 0 00.272.43l9.21 4.43a.484.484 0 00.694-.422V14.18a.484.484 0 00-.218-.41L1.353 8.617A.484.484 0 001 8.55z' },
    { name: 'Slack', color: '#4a154b', bg: '#fdf4ff', icon: 'M5.042 15.165a2.528 2.528 0 01-2.52 2.523A2.528 2.528 0 010 15.165a2.527 2.527 0 012.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 012.521-2.52 2.527 2.527 0 012.521 2.52v6.313A2.528 2.528 0 018.834 24a2.528 2.528 0 01-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 01-2.521-2.52A2.528 2.528 0 018.834 0a2.528 2.528 0 012.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 012.521 2.521 2.528 2.528 0 01-2.521 2.521H2.522A2.528 2.528 0 010 8.834a2.528 2.528 0 012.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 012.522-2.521A2.528 2.528 0 0124 8.834a2.528 2.528 0 01-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 01-2.523 2.521 2.527 2.527 0 01-2.52-2.521V2.522A2.527 2.527 0 0115.165 0a2.528 2.528 0 012.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 012.523 2.522A2.528 2.528 0 0115.165 24a2.527 2.527 0 01-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 01-2.52-2.523 2.526 2.526 0 012.52-2.52h6.313A2.527 2.527 0 0124 15.165a2.528 2.528 0 01-2.522 2.523h-6.313z' },
    { name: 'Google Docs', color: '#4285f4', bg: '#eff6ff', icon: 'M14.727 6.727H14V0H4.91c-.905 0-1.637.732-1.637 1.636v20.728c0 .904.732 1.636 1.636 1.636h14.182c.904 0 1.636-.732 1.636-1.636V6.727h-5.999zM6.55 19.09v-1.227h10.91v1.227H6.55zm10.909-2.454H6.55v-1.227h10.91v1.227zm0-2.455H6.55v-1.227h10.91v1.227zm0-2.454H6.55V10.5h10.91v1.227zM14 7.364V0l7.364 7.364H14z' },
    { name: 'Google Calendar', color: '#1a73e8', bg: '#eff6ff', icon: 'M19.5 22h-15A2.5 2.5 0 012 19.5v-15A2.5 2.5 0 014.5 2h15A2.5 2.5 0 0122 4.5v15a2.5 2.5 0 01-2.5 2.5zM4.5 4a.5.5 0 00-.5.5v15a.5.5 0 00.5.5h15a.5.5 0 00.5-.5v-15a.5.5 0 00-.5-.5h-15zM12 18l-1.5-3-3-1.5 3-1.5L12 9l1.5 3 3 1.5-3 1.5L12 18z' },
    { name: 'Google Sheets', color: '#34a853', bg: '#f0fdf4', icon: 'M14.727 0H4.91c-.904 0-1.637.732-1.637 1.636v20.728c0 .904.733 1.636 1.637 1.636h14.182c.904 0 1.636-.732 1.636-1.636V6.727L14.727 0zM7.364 18.273V10.09h9.272v8.182H7.364zM14 7.364V0l7.364 7.364H14zM8.591 11.318h2.045v1.637H8.591v-1.637zm0 2.864h2.045v1.636H8.591v-1.636zm0 2.864h2.045V18H8.591v-.954zm3.273-5.728h2.045v1.637h-2.045v-1.637zm0 2.864h2.045v1.636h-2.045v-1.636zm0 2.864h2.045V18h-2.045v-.954zm3.272-5.728h2.045v1.637h-2.045v-1.637zm0 2.864h2.045v1.636h-2.045v-1.636zm0 2.864h2.045V18h-2.045v-.954z' },
    { name: 'Search Console', color: '#458cf5', bg: '#eff6ff', icon: 'M11 2C15.97 2 20 6.03 20 11C20 15.97 15.97 20 11 20C6.03 20 2 15.97 2 11C2 6.03 6.03 2 11 2ZM11 4C7.13 4 4 7.13 4 11C4 14.87 7.13 18 11 18C14.87 18 18 14.87 18 11C18 7.13 14.87 4 11 4ZM21.41 22L15.41 16L16.41 15L22.41 21L21.41 22Z' },
    { name: 'Instagram', color: '#e4405f', bg: '#fdf2f8', icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z' },
    { name: 'WordPress', color: '#21759b', bg: '#eff6ff', icon: 'M12.158 12.786L9.46 20.625c.806.237 1.657.366 2.54.366 1.047 0 2.051-.181 2.986-.51-.024-.038-.046-.079-.065-.124l-2.762-7.571zM3.009 12c0 3.559 2.068 6.634 5.067 8.092L3.788 8.341C3.289 9.459 3.009 10.696 3.009 12zm15.06-.453c0-1.112-.399-1.881-.741-2.48-.456-.741-.883-1.368-.883-2.109 0-.826.627-1.596 1.51-1.596.04 0 .078.005.116.007-1.598-1.464-3.728-2.36-6.069-2.36-3.14 0-5.904 1.613-7.512 4.053.211.007.41.011.579.011.94 0 2.396-.114 2.396-.114.484-.028.541.684.057.741 0 0-.487.057-1.029.085l3.275 9.739 1.968-5.901-1.401-3.838c-.484-.028-.943-.085-.943-.085-.485-.029-.428-.769.057-.741 0 0 1.484.114 2.368.114.94 0 2.397-.114 2.397-.114.485-.028.542.684.057.741 0 0-.488.057-1.029.085l3.249 9.665.897-2.996c.456-1.169.684-2.115.684-2.907zm1.82-3.86c.039.286.06.593.06.924 0 .912-.171 1.938-.684 3.22l-2.746 7.94c2.673-1.558 4.47-4.454 4.47-7.771.001-1.564-.399-3.034-1.1-4.314zM12 22C6.486 22 2 17.514 2 12S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z' },
    { name: 'Atlassian', color: '#0052cc', bg: '#eff6ff', icon: 'M7.12 11.084a.555.555 0 00-.795.123L.107 19.45a.567.567 0 00.46.892h8.652a.508.508 0 00.46-.293c1.875-3.866.747-9.726-2.559-8.965zm4.502-7.073C10.65 5.86 11.16 8.077 12 10.31c.84 2.231 1.92 5.073 2.916 7.063 1.04 2.207 2.056 2.969 3.973 2.969h4.547a.572.572 0 00.46-.892S13.54 1.396 13.282.96A.527.527 0 0012.388.96c-.327.487-.766 1.305-.766 1.305z' }
  ];

  var children = [];

  // ===== TIMELINE (450 frames = 15s) =====
  var fadeIn = f < 25 ? eo3(p(0, 25)) : 1;
  var fadeOut = f >= 440 ? 1 - eo3(p(440, 450)) : 1;
  var globalOp = fadeIn * fadeOut;

  // ===== BACKGROUND =====
  children.push(e('div', { key: 'bg', style: {
    position: 'absolute', top: 0, left: 0, width: W, height: H,
    background: C_BG, opacity: globalOp
  }}));

  // ===== "Back to Projects" link (top-left) =====
  children.push(e('div', { key: 'back-link', style: {
    position: 'absolute', left: 60, top: 30,
    display: 'flex', alignItems: 'center', gap: 6,
    color: C_TEXT_DIM, fontSize: 14, fontWeight: 500,
    opacity: globalOp, zIndex: 10
  }},
    e('svg', { width: 14, height: 14, viewBox: '0 0 24 24', fill: '#6b7280' },
      e('path', { d: ARROW_LEFT_PATH })
    ),
    'Back to Projects'
  ));

  // ===== LEFT WIZARD COLUMN =====
  var leftColW = W * 0.5;
  var wizardX = 60;
  var wizardY = 80;
  var wizardW = leftColW - 120;

  // ===== WIZARD HEADER =====
  children.push(e('div', { key: 'wizard-header', style: {
    position: 'absolute', left: wizardX, top: wizardY,
    display: 'flex', alignItems: 'center', gap: 14,
    opacity: globalOp, zIndex: 8
  }},
    e('div', { style: {
      width: 44, height: 44, borderRadius: 10,
      background: '#dbeafe',
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }},
      e('svg', { width: 24, height: 24, viewBox: '0 0 20 20', fill: C_BLUE },
        e('path', { d: ROBOT_PATH })
      )
    ),
    e('div', { style: { fontSize: 28, fontWeight: 700, color: C_TEXT, letterSpacing: '-0.5px' } }, 'Create a new Project')
  ));

  // ===== STEPPER =====
  function getCurrentStep() {
    if (f < 105) return 1;
    if (f < 195) return 2;
    if (f < 290) return 3;
    if (f < 355) return 4;
    return 5;
  }
  var currentStep = getCurrentStep();

  var steps = ['Name', 'Specification', 'Integrations', 'Channel', 'AI Setup'];
  var stepperY = wizardY + 80;
  var stepperGap = (wizardW - 80) / 4;
  var stepCircleSize = 38;

  // Connecting lines
  for (var li = 0; li < 4; li++) {
    var lineX = wizardX + 40 + li * stepperGap + stepCircleSize / 2;
    var lineW = stepperGap - stepCircleSize;
    var isComplete = currentStep > li + 1;
    var lineColor = isComplete ? C_BLUE : '#d1d5db';
    children.push(e('div', { key: 'line-' + li, style: {
      position: 'absolute',
      left: lineX, top: stepperY + stepCircleSize / 2 - 1,
      width: lineW, height: 2,
      background: lineColor,
      opacity: globalOp, zIndex: 7
    }}));
  }

  // Circles + labels
  steps.forEach(function(label, si) {
    var stepNum = si + 1;
    var cx = wizardX + 40 + si * stepperGap;
    var isActive = currentStep === stepNum;
    var isComplete = currentStep > stepNum;
    var bg = (isActive || isComplete) ? C_BLUE : '#ffffff';
    var brd = (isActive || isComplete) ? C_BLUE : '#d1d5db';
    var fg = (isActive || isComplete) ? '#ffffff' : '#9ca3af';

    children.push(e('div', { key: 'step-' + si, style: {
      position: 'absolute',
      left: cx, top: stepperY,
      width: stepCircleSize, height: stepCircleSize, borderRadius: '50%',
      background: bg, border: '2px solid ' + brd,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: fg, fontSize: 14, fontWeight: 700,
      opacity: globalOp, zIndex: 8
    }},
      isComplete
        ? e('svg', { width: 18, height: 18, viewBox: '0 0 24 24', fill: '#ffffff' },
            e('path', { d: CHECK_PATH }))
        : String(stepNum)
    ));

    children.push(e('div', { key: 'step-lbl-' + si, style: {
      position: 'absolute',
      left: cx + stepCircleSize / 2 - 50, top: stepperY + stepCircleSize + 8,
      width: 100, textAlign: 'center',
      fontSize: 12, fontWeight: isActive ? 700 : 500,
      color: isActive ? C_TEXT : C_TEXT_DIM,
      opacity: globalOp, zIndex: 8
    }}, label));
  });

  // ===== STEP CONTENT AREA =====
  var contentY = stepperY + 100;

  // ===== STEP 1: NAME =====
  if (currentStep === 1) {
    var s1Op = f < 25 ? eo3(p(0, 25)) : 1;

    children.push(e('div', { key: 's1-title', style: {
      position: 'absolute',
      left: wizardX, top: contentY,
      fontSize: 22, fontWeight: 700, color: C_TEXT,
      opacity: s1Op * globalOp, zIndex: 8
    }}, 'Name your project'));

    children.push(e('div', { key: 's1-sub', style: {
      position: 'absolute',
      left: wizardX, top: contentY + 32,
      fontSize: 14, color: C_TEXT_DIM,
      opacity: s1Op * globalOp, zIndex: 8
    }}, 'Give your project a memorable name.'));

    children.push(e('div', { key: 's1-label', style: {
      position: 'absolute',
      left: wizardX, top: contentY + 80,
      fontSize: 13, fontWeight: 600, color: C_TEXT,
      opacity: s1Op * globalOp, zIndex: 8
    }}, 'Project Name'));

    children.push(e('div', { key: 's1-input', style: {
      position: 'absolute',
      left: wizardX, top: contentY + 105, width: wizardW, height: 48,
      background: '#ffffff',
      border: '1.5px solid ' + (f >= 30 ? C_BLUE : C_CARD_BORDER),
      borderRadius: 8,
      padding: '0 16px',
      display: 'flex', alignItems: 'center',
      fontSize: 14, color: C_TEXT,
      opacity: s1Op * globalOp, zIndex: 8,
      boxShadow: f >= 30 ? '0 0 0 3px rgba(59,130,246,0.1)' : 'none'
    }},
      (function() {
        var text = 'Newsletter Site';
        if (f < 30) return e('span', { style: { color: C_TEXT_MUTED } }, 'e.g. Content Marketing');
        var prog = cl((f - 30) / 60, 0, 1);
        var chars = Math.floor(prog * text.length);
        var blink = (f % 30) < 15;
        return e('span', null,
          text.substring(0, chars),
          blink ? e('span', { style: { borderRight: '2px solid ' + C_BLUE, marginLeft: 1 } }, '\u200B') : null
        );
      })()
    ));

    var btnReady = f >= 75;
    children.push(e('div', { key: 's1-btn', style: {
      position: 'absolute',
      left: wizardX, top: contentY + 175, width: wizardW, height: 46,
      background: btnReady ? C_BLUE : '#bfdbfe',
      borderRadius: 8,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#ffffff', fontSize: 14, fontWeight: 600,
      opacity: s1Op * globalOp, zIndex: 8,
      boxShadow: btnReady ? '0 1px 3px rgba(59,130,246,0.3)' : 'none',
      transform: f >= 95 && f < 105 ? 'scale(0.97)' : 'scale(1)'
    }}, 'Continue'));
  }

  // ===== STEP 2: SPECIFICATION =====
  if (currentStep === 2) {
    var s2Op = f < 115 ? eo3(p(105, 115)) : 1;

    children.push(e('div', { key: 's2-title', style: {
      position: 'absolute',
      left: wizardX, top: contentY,
      fontSize: 22, fontWeight: 700, color: C_TEXT,
      opacity: s2Op * globalOp, zIndex: 8
    }}, 'Define your project'));

    children.push(e('div', { key: 's2-sub', style: {
      position: 'absolute',
      left: wizardX, top: contentY + 32,
      fontSize: 14, color: C_TEXT_DIM,
      opacity: s2Op * globalOp, zIndex: 8
    }}, 'Describe what your AI agents should work on.'));

    children.push(e('div', { key: 's2-name-lbl', style: {
      position: 'absolute',
      left: wizardX, top: contentY + 80,
      fontSize: 13, fontWeight: 600, color: C_TEXT,
      opacity: s2Op * globalOp, zIndex: 8
    }}, 'Project Name'));
    children.push(e('div', { key: 's2-name-input', style: {
      position: 'absolute',
      left: wizardX, top: contentY + 105, width: wizardW, height: 44,
      background: C_INPUT_BG,
      border: '1px solid ' + C_CARD_BORDER,
      borderRadius: 8,
      padding: '0 16px',
      display: 'flex', alignItems: 'center',
      fontSize: 14, color: C_TEXT,
      opacity: s2Op * globalOp, zIndex: 8
    }}, 'Newsletter Site'));

    children.push(e('div', { key: 's2-spec-lbl', style: {
      position: 'absolute',
      left: wizardX, top: contentY + 168,
      fontSize: 13, fontWeight: 600, color: C_TEXT,
      opacity: s2Op * globalOp, zIndex: 8
    }}, 'Project Specification'));
    children.push(e('div', { key: 's2-spec-input', style: {
      position: 'absolute',
      left: wizardX, top: contentY + 193, width: wizardW, height: 130,
      background: '#ffffff',
      border: '1.5px solid ' + (f >= 120 ? C_BLUE : C_CARD_BORDER),
      borderRadius: 8,
      padding: '14px 16px',
      fontSize: 13, color: C_TEXT, lineHeight: '1.6',
      opacity: s2Op * globalOp, zIndex: 8,
      boxShadow: f >= 120 ? '0 0 0 3px rgba(59,130,246,0.1)' : 'none',
      overflow: 'hidden'
    }},
      (function() {
        var text = 'Build and manage a newsletter website with automated content creation, SEO optimization, and growth analytics. The site should publish weekly articles and track performance.';
        if (f < 120) return e('span', { style: { color: C_TEXT_MUTED } }, 'Describe the goals and tasks for your AI team...');
        var prog = cl((f - 120) / 60, 0, 1);
        var chars = Math.floor(prog * text.length);
        var blink = (f % 30) < 15;
        return e('span', null,
          text.substring(0, chars),
          blink ? e('span', { style: { borderRight: '2px solid ' + C_BLUE, marginLeft: 1 } }, '\u200B') : null
        );
      })()
    ));

    children.push(e('div', { key: 's2-back', style: {
      position: 'absolute',
      left: wizardX, top: contentY + 345, width: 100, height: 44,
      background: '#ffffff',
      border: '1px solid ' + C_CARD_BORDER,
      borderRadius: 8,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: C_TEXT, fontSize: 14, fontWeight: 500,
      opacity: s2Op * globalOp, zIndex: 8
    }}, 'Back'));
    children.push(e('div', { key: 's2-cont', style: {
      position: 'absolute',
      left: wizardX + 110, top: contentY + 345, width: wizardW - 110, height: 44,
      background: f >= 175 ? C_BLUE : '#bfdbfe',
      borderRadius: 8,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#ffffff', fontSize: 14, fontWeight: 600,
      opacity: s2Op * globalOp, zIndex: 8,
      boxShadow: f >= 175 ? '0 1px 3px rgba(59,130,246,0.3)' : 'none',
      transform: f >= 188 && f < 195 ? 'scale(0.97)' : 'scale(1)'
    }}, 'Continue'));
  }

  // ===== STEP 3: INTEGRATIONS =====
  if (currentStep === 3) {
    var s3Op = f < 210 ? eo3(p(195, 210)) : 1;

    children.push(e('div', { key: 's3-title', style: {
      position: 'absolute',
      left: wizardX, top: contentY,
      fontSize: 22, fontWeight: 700, color: C_TEXT,
      opacity: s3Op * globalOp, zIndex: 8
    }}, 'Connect Integrations'));

    children.push(e('div', { key: 's3-sub', style: {
      position: 'absolute',
      left: wizardX, top: contentY + 32,
      fontSize: 13, color: C_TEXT_DIM,
      opacity: s3Op * globalOp, zIndex: 8
    }}, 'Connect the tools and services your agents will have access to.'));

    var gridY = contentY + 70;
    var gridGap = 10;
    var cellW = (wizardW - gridGap * 2) / 3;
    var cellH = 92;

    INTEGRATIONS.forEach(function(intg, ii) {
      var row = Math.floor(ii / 3);
      var col = ii % 3;
      var cx = wizardX + col * (cellW + gridGap);
      var cy = gridY + row * (cellH + gridGap);
      var enterFrame = 215 + ii * 5;
      var iOp = f >= enterFrame ? eo3(p(enterFrame, enterFrame + 18)) : 0;
      var iScale = f >= enterFrame ? lerp(0.96, 1, eo3(p(enterFrame, enterFrame + 18))) : 0.96;

      var isIntegrated = (ii === 0 || ii === 1 || ii === 5) && f >= 250 + ii * 4;

      children.push(e('div', { key: 'intg-' + ii, style: {
        position: 'absolute',
        left: cx, top: cy, width: cellW, height: cellH,
        background: '#ffffff',
        border: '1px solid ' + (isIntegrated ? '#86efac' : C_CARD_BORDER),
        borderRadius: 10,
        padding: '12px 12px',
        opacity: iOp * s3Op * globalOp, zIndex: 7,
        transform: 'scale(' + iScale + ')',
        boxShadow: isIntegrated ? '0 0 0 2px rgba(34,197,94,0.15)' : '0 1px 2px rgba(0,0,0,0.03)'
      }},
        e('div', { style: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 } },
          e('div', { style: {
            width: 26, height: 26, borderRadius: 6,
            background: intg.bg,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
          }},
            e('svg', { width: 16, height: 16, viewBox: '0 0 24 24', fill: intg.color },
              e('path', { d: intg.icon })
            )
          ),
          e('span', { style: { fontSize: 11, fontWeight: 700, color: C_TEXT, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, intg.name)
        ),
        e('div', { style: { display: 'flex', gap: 5 } },
          e('div', { style: {
            flex: 1, padding: '6px 0', borderRadius: 5,
            background: '#f3f4f6', color: C_TEXT_DIM,
            fontSize: 9, fontWeight: 500, textAlign: 'center'
          }}, 'Manage'),
          e('div', { style: {
            flex: 1, padding: '6px 0', borderRadius: 5,
            background: isIntegrated ? '#dcfce7' : C_BLUE,
            color: isIntegrated ? '#16a34a' : '#ffffff',
            fontSize: 9, fontWeight: 600, textAlign: 'center'
          }}, isIntegrated ? '\u2713 Integrated' : 'Integrate')
        )
      ));
    });

    var btnY = gridY + 3 * (cellH + gridGap) + 4;
    children.push(e('div', { key: 's3-back', style: {
      position: 'absolute',
      left: wizardX, top: btnY, width: 90, height: 40,
      background: '#ffffff',
      border: '1px solid ' + C_CARD_BORDER,
      borderRadius: 8,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: C_TEXT, fontSize: 13, fontWeight: 500,
      opacity: s3Op * globalOp, zIndex: 8
    }}, 'Back'));
    children.push(e('div', { key: 's3-cont', style: {
      position: 'absolute',
      left: wizardX + 100, top: btnY, width: wizardW - 100, height: 40,
      background: f >= 270 ? C_BLUE : '#bfdbfe',
      borderRadius: 8,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#ffffff', fontSize: 13, fontWeight: 600,
      opacity: s3Op * globalOp, zIndex: 8,
      boxShadow: f >= 270 ? '0 1px 3px rgba(59,130,246,0.3)' : 'none',
      transform: f >= 283 && f < 290 ? 'scale(0.97)' : 'scale(1)'
    }}, 'Continue'));
  }

  // ===== STEP 4: CHANNEL =====
  if (currentStep === 4) {
    var s4Op = f < 305 ? eo3(p(290, 305)) : 1;

    children.push(e('div', { key: 's4-title', style: {
      position: 'absolute',
      left: wizardX, top: contentY,
      fontSize: 22, fontWeight: 700, color: C_TEXT,
      opacity: s4Op * globalOp, zIndex: 8
    }}, 'Choose a communication channel'));

    children.push(e('div', { key: 's4-sub', style: {
      position: 'absolute',
      left: wizardX, top: contentY + 32,
      fontSize: 14, color: C_TEXT_DIM,
      opacity: s4Op * globalOp, zIndex: 8
    }}, 'Select how your agents will communicate with users.'));

    children.push(e('div', { key: 's4-slack', style: {
      position: 'absolute',
      left: wizardX, top: contentY + 75, width: wizardW, height: 80,
      background: '#ffffff',
      border: '1.5px solid ' + (f >= 320 ? C_BLUE : C_CARD_BORDER),
      borderRadius: 10,
      padding: '16px 20px',
      display: 'flex', alignItems: 'center', gap: 16,
      opacity: s4Op * globalOp, zIndex: 8,
      boxShadow: f >= 320 ? '0 0 0 3px rgba(59,130,246,0.1)' : '0 1px 3px rgba(0,0,0,0.04)'
    }},
      e('div', { style: {
        width: 44, height: 44, borderRadius: 10,
        background: '#fdf4ff',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
      }},
        e('svg', { width: 26, height: 26, viewBox: '0 0 24 24', fill: '#4a154b' },
          e('path', { d: INTEGRATIONS[1].icon })
        )
      ),
      e('div', { style: { flex: 1 } },
        e('div', { style: { fontSize: 16, fontWeight: 700, color: C_TEXT, marginBottom: 3 } }, 'Slack'),
        e('div', { style: { fontSize: 12, color: C_TEXT_DIM } }, 'Connect your agents to a Slack channel or direct message.')
      )
    ));

    if (f >= 320) {
      var chListOp = eo3(p(320, 340));
      var channels = ['all-ai-over-coffee', 'social', 'ask_flo', 'ai', 'ask_flowhunt'];
      children.push(e('div', { key: 's4-channels-label', style: {
        position: 'absolute',
        left: wizardX, top: contentY + 175,
        fontSize: 11, fontWeight: 700, color: C_TEXT_MUTED,
        textTransform: 'uppercase', letterSpacing: '0.6px',
        opacity: chListOp * s4Op * globalOp, zIndex: 8
      }}, 'Channels'));

      channels.forEach(function(ch, ci) {
        var isSelected = ci === 4;
        children.push(e('div', { key: 's4-ch-' + ci, style: {
          position: 'absolute',
          left: wizardX, top: contentY + 200 + ci * 36, width: wizardW, height: 32,
          background: isSelected ? '#eff6ff' : '#ffffff',
          border: '1px solid ' + (isSelected ? C_BLUE : C_CARD_BORDER),
          borderRadius: 6,
          padding: '0 14px',
          display: 'flex', alignItems: 'center', gap: 8,
          fontSize: 12, color: C_TEXT,
          opacity: chListOp * s4Op * globalOp, zIndex: 7
        }},
          e('span', { style: { color: C_TEXT_MUTED, fontSize: 13, fontWeight: 600 } }, '#'),
          ch,
          isSelected ? e('span', { style: { marginLeft: 'auto', display: 'flex', alignItems: 'center' } },
            e('svg', { width: 14, height: 14, viewBox: '0 0 24 24', fill: C_BLUE },
              e('path', { d: CHECK_PATH })
            )
          ) : null
        ));
      });
    }

    var s4BtnY = f >= 320 ? contentY + 395 : contentY + 195;
    children.push(e('div', { key: 's4-back', style: {
      position: 'absolute',
      left: wizardX, top: s4BtnY, width: 90, height: 40,
      background: '#ffffff',
      border: '1px solid ' + C_CARD_BORDER,
      borderRadius: 8,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: C_TEXT, fontSize: 13, fontWeight: 500,
      opacity: s4Op * globalOp, zIndex: 8
    }}, 'Back'));
    children.push(e('div', { key: 's4-cont', style: {
      position: 'absolute',
      left: wizardX + 100, top: s4BtnY, width: wizardW - 100, height: 40,
      background: f >= 335 ? C_BLUE : '#bfdbfe',
      borderRadius: 8,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#ffffff', fontSize: 13, fontWeight: 600,
      opacity: s4Op * globalOp, zIndex: 8,
      boxShadow: f >= 335 ? '0 1px 3px rgba(59,130,246,0.3)' : 'none',
      transform: f >= 348 && f < 355 ? 'scale(0.97)' : 'scale(1)'
    }}, 'Continue'));
  }

  // ===== STEP 5: AI SETUP / BUILDING =====
  if (currentStep === 5) {
    var s5Op = f < 370 ? eo3(p(355, 370)) : 1;

    if (f < 415) {
      children.push(e('div', { key: 's5-icon', style: {
        position: 'absolute',
        left: wizardX + wizardW / 2 - 32, top: contentY + 50,
        width: 64, height: 64, borderRadius: 14,
        background: '#dbeafe',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        opacity: s5Op * globalOp, zIndex: 8,
        boxShadow: '0 0 0 ' + (4 + breathe(0, 0.08) * 6) + 'px rgba(59,130,246,0.1)'
      }},
        e('svg', { width: 36, height: 36, viewBox: '0 0 20 20', fill: C_BLUE },
          e('path', { d: ROBOT_PATH })
        )
      ));

      var spinAngle = (f - 355) * 6;
      children.push(e('div', { key: 's5-spinner', style: {
        position: 'absolute',
        left: wizardX + wizardW / 2 - 40, top: contentY + 42,
        width: 80, height: 80, borderRadius: '50%',
        border: '3px solid #e5e7eb',
        borderTopColor: C_BLUE,
        transform: 'rotate(' + spinAngle + 'deg)',
        opacity: s5Op * globalOp, zIndex: 7
      }}));

      children.push(e('div', { key: 's5-title', style: {
        position: 'absolute',
        left: wizardX, top: contentY + 140, width: wizardW,
        textAlign: 'center',
        fontSize: 22, fontWeight: 700, color: C_TEXT,
        opacity: s5Op * globalOp, zIndex: 8
      }}, 'Building your team'));

      var statusMsgs = [
        'Analyzing current team structure...',
        'Configuring agent: Newsletter Site Director',
        'Configuring agent: Content Curator',
        'Configuring agent: SEO Specialist',
        'Adding sub-worker: Growth Analytics',
        'Validating agent team configuration...'
      ];
      var msgIdx = Math.floor((f - 360) / 9) % statusMsgs.length;
      if (f < 360) msgIdx = 0;

      children.push(e('div', { key: 's5-status', style: {
        position: 'absolute',
        left: wizardX, top: contentY + 178, width: wizardW,
        textAlign: 'center',
        fontSize: 13, color: C_TEXT_DIM,
        opacity: s5Op * globalOp, zIndex: 8
      }}, statusMsgs[msgIdx]));

      var progPct = cl((f - 360) / 55, 0, 1);
      children.push(e('div', { key: 's5-bar-bg', style: {
        position: 'absolute',
        left: wizardX + wizardW / 2 - 150, top: contentY + 215, width: 300, height: 6,
        background: '#e5e7eb', borderRadius: 3,
        opacity: s5Op * globalOp, zIndex: 7
      }}));
      children.push(e('div', { key: 's5-bar', style: {
        position: 'absolute',
        left: wizardX + wizardW / 2 - 150, top: contentY + 215, width: 300 * progPct, height: 6,
        background: 'linear-gradient(90deg, ' + C_BLUE + ', ' + C_GR2 + ')',
        borderRadius: 3,
        opacity: s5Op * globalOp, zIndex: 8
      }}));

      children.push(e('div', { key: 's5-cancel', style: {
        position: 'absolute',
        left: wizardX, top: contentY + 250, width: wizardW,
        textAlign: 'center',
        fontSize: 12, color: C_TEXT_MUTED,
        opacity: s5Op * globalOp, zIndex: 8
      }}, 'Cancel'));
    } else {
      var revealOp = eo3(p(415, 440));

      children.push(e('div', { key: 's5r-title', style: {
        position: 'absolute',
        left: wizardX, top: contentY,
        fontSize: 22, fontWeight: 700, color: C_TEXT,
        opacity: revealOp * globalOp, zIndex: 8
      }}, 'Your AI Team'));

      children.push(e('div', { key: 's5r-sub', style: {
        position: 'absolute',
        left: wizardX, top: contentY + 32,
        fontSize: 13, color: C_TEXT_DIM,
        opacity: revealOp * globalOp, zIndex: 8
      }}, 'Review the generated team and periodic tasks below.'));

      var teamMembers = [
        { name: 'Newsletter Site Director', role: 'Supervisor', color: '#7c3aed' },
        { name: 'Content Curator', role: 'Agent', color: '#3b82f6' },
        { name: 'SEO Specialist', role: 'Agent', color: '#10b981' },
        { name: 'Growth Analytics', role: 'Agent', color: '#f59e0b' }
      ];

      teamMembers.forEach(function(m, mi) {
        var mStart = 420 + mi * 5;
        var mFade = f >= mStart ? eo3(p(mStart, mStart + 18)) : 0;
        children.push(e('div', { key: 's5r-m-' + mi, style: {
          position: 'absolute',
          left: wizardX, top: contentY + 75 + mi * 56, width: wizardW, height: 48,
          background: '#ffffff',
          border: '1px solid ' + C_CARD_BORDER,
          borderLeft: '3px solid ' + m.color,
          borderRadius: 8,
          padding: '0 14px',
          display: 'flex', alignItems: 'center', gap: 12,
          opacity: mFade * revealOp * globalOp, zIndex: 8,
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
        }},
          e('div', { style: {
            width: 28, height: 28, borderRadius: 6,
            background: m.color,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
          }},
            e('svg', { width: 16, height: 16, viewBox: '0 0 20 20', fill: '#ffffff' },
              e('path', { d: ROBOT_PATH })
            )
          ),
          e('div', { style: { flex: 1 } },
            e('div', { style: { fontSize: 13, fontWeight: 600, color: C_TEXT } }, m.name),
            e('div', { style: { fontSize: 10, color: C_TEXT_MUTED, marginTop: 1, textTransform: 'uppercase', letterSpacing: '0.5px' } }, m.role)
          ),
          e('span', { style: {
            fontSize: 9, fontWeight: 600, color: '#16a34a',
            background: '#dcfce7', padding: '3px 8px', borderRadius: 10
          }}, '\u2713 Ready')
        ));
      });

      children.push(e('div', { key: 's5r-btn', style: {
        position: 'absolute',
        left: wizardX, top: contentY + 320, width: wizardW, height: 46,
        background: 'linear-gradient(135deg, #16a34a, #15803d)',
        borderRadius: 8,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        color: '#ffffff', fontSize: 14, fontWeight: 600,
        opacity: revealOp * globalOp, zIndex: 8,
        boxShadow: '0 2px 8px rgba(22,163,74,0.3)'
      }},
        e('svg', { width: 16, height: 16, viewBox: '0 0 24 24', fill: '#ffffff' },
          e('path', { d: CHECK_PATH })
        ),
        'Accept & Continue'
      ));
    }
  }

  // ===== RIGHT GRADIENT PANEL =====
  var rightX = leftColW;
  var rightW = W - leftColW;

  children.push(e('div', { key: 'right-bg', style: {
    position: 'absolute',
    left: rightX, top: 0, width: rightW, height: H,
    background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 30%, #4338ca 60%, #1e3a8a 100%)',
    opacity: globalOp, zIndex: 4
  }}));

  children.push(e('div', { key: 'right-grid', style: {
    position: 'absolute',
    left: rightX, top: 0, width: rightW, height: H,
    backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
    backgroundSize: '60px 60px',
    opacity: globalOp, zIndex: 5,
    pointerEvents: 'none'
  }}));

  var rightCX = rightX + rightW / 2;
  var rightCY = H / 2 - 40;

  var floatIcons = [
    { dx: -180, dy: -120, size: 48, icon: ROBOT_PATH, vb: '0 0 20 20' },
    { dx: 180, dy: -100, size: 44, icon: CODE_PATH, vb: '0 0 24 24' },
    { dx: 200, dy: 60, size: 50, icon: BRAIN_PATH, vb: '0 0 24 24' },
    { dx: -200, dy: 50, size: 46, icon: CHART_PATH, vb: '0 0 24 24' },
    { dx: 0, dy: 180, size: 42, icon: LANG_PATH, vb: '0 0 24 24' }
  ];

  floatIcons.forEach(function(ic, ii) {
    var fY = float(ii * 7, 6, 0.03);
    var fX = float(ii * 11 + 30, 4, 0.025);
    var pulse = breathe(ii, 0.05);
    children.push(e('div', { key: 'right-ic-' + ii, style: {
      position: 'absolute',
      left: rightCX + ic.dx + fX - ic.size / 2,
      top: rightCY + ic.dy + fY - ic.size / 2,
      width: ic.size, height: ic.size, borderRadius: 12,
      background: 'rgba(255,255,255,' + (0.06 + pulse * 0.04) + ')',
      backdropFilter: 'blur(8px)',
      border: '1px solid rgba(255,255,255,0.1)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      opacity: globalOp * 0.85, zIndex: 6
    }},
      e('svg', { width: ic.size * 0.55, height: ic.size * 0.55, viewBox: ic.vb, fill: 'rgba(255,255,255,0.85)' },
        e('path', { d: ic.icon })
      )
    ));
  });

  var logoFloat = float(0, 4, 0.025);
  var logoGlow = breathe(0, 0.04);
  children.push(e('div', { key: 'right-logo', style: {
    position: 'absolute',
    left: rightCX - 90, top: rightCY - 90 + logoFloat,
    width: 180, height: 180,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    opacity: globalOp * 0.75, zIndex: 7,
    filter: 'drop-shadow(0 0 ' + (24 + logoGlow * 16) + 'px rgba(59,130,246,0.5))'
  }},
    e('svg', { width: 140, height: 114, viewBox: '0 0 20 16.2', fill: 'none' },
      e('path', { d: FLOWHUNT_PATH, fill: 'rgba(96,165,250,0.85)' })
    )
  ));

  children.push(e('div', { key: 'right-badge', style: {
    position: 'absolute',
    left: rightCX - 130, top: H - 140,
    width: 260, padding: '10px 20px',
    background: 'rgba(255,255,255,0.08)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: 24,
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    color: 'rgba(255,255,255,0.95)',
    fontSize: 11, fontWeight: 700, letterSpacing: '1.2px',
    opacity: globalOp, zIndex: 7
  }},
    e('div', { style: {
      width: 14, height: 14, borderRadius: 4,
      background: 'linear-gradient(135deg, #22c55e, #16a34a)',
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }},
      e('svg', { width: 9, height: 9, viewBox: '0 0 24 24', fill: '#ffffff' },
        e('path', { d: CHECK_PATH })
      )
    ),
    'SYNCHRONIZED COLLABORATION'
  ));

  children.push(e('div', { key: 'right-dots', style: {
    position: 'absolute',
    left: rightCX - 24, top: H - 100,
    display: 'flex', gap: 6,
    opacity: globalOp, zIndex: 7
  }},
    [0, 1, 2].map(function(di) {
      var isActive = di === 1;
      return e('div', { key: 'd' + di, style: {
        width: isActive ? 18 : 6, height: 6, borderRadius: 3,
        background: isActive ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.3)'
      }});
    })
  ));

  return e('div', { style: {
    position: 'relative', width: W, height: H, overflow: 'hidden',
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    background: C_BG
  }}, children);
}
