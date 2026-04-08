// Scene 3: AI Projects Chat — Persistent scrolling conversation (30s = 900 frames @ 30fps)
// Real FlowHunt chat UI. Messages persist and scroll up — nothing fades out.
function AIFactoryChatScene(props) {
  var f = props.frame || 0;
  var W = props.layerSize.width;
  var H = props.layerSize.height;
  var e = React.createElement;

  // ===== EASING & HELPERS =====
  function eo3(t) { return 1 - Math.pow(1 - t, 3); }
  function eio2(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }
  function cl(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function p(s, n) { return cl((f - s) / (n - s), 0, 1); }
  function lerp(a, b, t) { return a + (b - a) * t; }

  // ===== COLORS =====
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
  var C_BLUE_DARK = '#2563eb';

  // SVG path constants
  var FLOWHUNT_PATH = 'M2.6,12.7l-.9,2.1c-.2.4,0,.8.2,1.1.2.2.4.3.7.3s.5,0,.7-.3l.8-.8,3.2-3.2c.1-.1,0-.4-.2-.4h-1.8s0,0,0,0c-1.9,0-3.4-1.6-3.4-3.5,0-1.9,1.6-3.3,3.5-3.3h3.8c0,0,.1,0,.2,0l1.5-1.5c.1-.1,0-.4-.2-.4h-5.4C2.5,2.7,0,5.2,0,8.1c0,2,1.1,3.7,2.6,4.6h0ZM14.5,11.5c1.9,0,3.4-1.5,3.5-3.3,0-1.9-1.5-3.5-3.4-3.5s0,0,0,0h-1.8c-.2,0-.3-.3-.2-.4l3.3-3.3h0l.7-.7c.4-.4,1-.4,1.4,0,.3.3.4.8.3,1.1l-.9,2.1c1.6.9,2.6,2.6,2.6,4.6,0,3-2.5,5.4-5.5,5.4h-5.4c-.2,0-.3-.3-.2-.4l1.5-1.5s.1,0,.2,0h3.8,0ZM13.6,6.3c1,0,1.7.8,1.7,1.7s-.8,1.7-1.7,1.7-1.7-.8-1.7-1.7.8-1.7,1.7-1.7ZM6.5,6.3c1,0,1.7.8,1.7,1.7s-.8,1.7-1.7,1.7-1.7-.8-1.7-1.7.8-1.7,1.7-1.7Z';
  var WRENCH_PATH = 'M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z';
  var BELL_PATH = 'M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z';
  var SPARKLE_PATH = 'M12 0L13.5 8.5L22 10L13.5 11.5L12 20L10.5 11.5L2 10L10.5 8.5L12 0Z';
  var CHAT_PATH = 'M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z';
  var LIST_PATH = 'M3 6H21V8H3V6ZM3 11H21V13H3V11ZM3 16H21V18H3V16Z';
  var STAR_PATH = 'M12 2L15 8L21 9L17 13L18 19L12 16L6 19L7 13L3 9L9 8Z';
  var CAMERA_PATH = 'M9 2L7 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4H17L15 2H9ZM12 17C9.2 17 7 14.8 7 12C7 9.2 9.2 7 12 7C14.8 7 17 9.2 17 12C17 14.8 14.8 17 12 17Z';
  var BARS_PATH = 'M3 11V13H21V11H3ZM3 7V9H21V7H3ZM3 15V17H21V15H3Z';
  var CHART_PATH = 'M3 21V19H21V21H3ZM5 17V8H8V17H5ZM10 17V3H13V17H10ZM15 17V11H18V17H15Z';

  var children = [];

  // ===== GLOBAL FADES =====
  var fadeIn = f < 40 ? eo3(p(0, 40)) : 1;
  var fadeOut = f >= 640 ? 1 - eo3(p(640, 660)) : 1;
  var globalOp = fadeIn * fadeOut;

  // ===== BACKGROUND =====
  children.push(e('div', { key: 'bg', style: {
    position: 'absolute', top: 0, left: 0, width: W, height: H,
    background: C_BG, opacity: globalOp
  }}));

  // ===== SIDEBAR (two-part: icon strip + nav panel) =====
  var iconStripW = 36;
  var navPanelW = 170;
  var totalSidebarW = iconStripW + navPanelW;

  var iconStripIcons = [
    { label: 'AI Projects', active: true, kind: 'flowhunt' },
    { label: 'AI Studio', active: false, kind: 'star' },
    { label: 'Photomatic', active: false, kind: 'camera' },
    { label: 'Ads AI', active: false, kind: 'bars' }
  ];

  function renderStripIcon(kind, color) {
    if (kind === 'flowhunt') {
      return e('svg', { width: 18, height: 14.6, viewBox: '0 0 20 16.2', fill: 'none' },
        e('path', { d: FLOWHUNT_PATH, fill: color }));
    }
    if (kind === 'star') {
      return e('svg', { width: 18, height: 18, viewBox: '0 0 24 24', fill: color },
        e('path', { d: STAR_PATH }));
    }
    if (kind === 'camera') {
      return e('svg', { width: 18, height: 18, viewBox: '0 0 24 24', fill: color },
        e('path', { d: CAMERA_PATH }));
    }
    return e('svg', { width: 18, height: 18, viewBox: '0 0 24 24', fill: color },
      e('path', { d: BARS_PATH }));
  }

  // Icon strip
  children.push(e('div', { key: 'icon-strip', style: {
    position: 'absolute', top: 0, left: 0, width: iconStripW, height: H,
    background: '#ffffff', borderRight: '1px solid #f0f0f0',
    opacity: globalOp, zIndex: 12,
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    paddingTop: 10, gap: 4
  }},
    iconStripIcons.map(function(icon, i) {
      var isActive = icon.active;
      return e('div', { key: 'icon-' + i, style: {
        width: 32, height: 40, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 2,
        borderRadius: 6,
        background: isActive ? 'linear-gradient(135deg, ' + C_GR1 + ', ' + C_GR2 + ', ' + C_GR3 + ')' : 'transparent'
      }},
        e('div', { style: {
          width: 24, height: 24, borderRadius: 4,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }},
          renderStripIcon(icon.kind, isActive ? '#ffffff' : '#94a3b8')
        ),
        e('div', { style: {
          fontSize: 5, fontWeight: 500, textAlign: 'center', lineHeight: '1.1',
          color: isActive ? '#fff' : '#9ca3af', whiteSpace: 'nowrap'
        }}, icon.label)
      );
    })
  ));

  // Nav panel
  var CONVERSATIONS = [
    { time: '2h ago', num: '2' },
    { time: '16h ago', num: '2' },
    { time: '3h ago', num: '3' },
    { time: '16h ago', num: '1' }
  ];

  children.push(e('div', { key: 'nav-panel', style: {
    position: 'absolute', top: 0, left: iconStripW, width: navPanelW, height: H,
    background: '#ffffff', borderRight: '1px solid ' + C_CARD_BORDER,
    opacity: globalOp, zIndex: 11,
    display: 'flex', flexDirection: 'column'
  }},
    e('div', { key: 'logo-area', style: {
      padding: '14px 14px 10px 14px', display: 'flex', alignItems: 'center', gap: 8
    }},
      e('div', { style: {
        width: 26, height: 26, borderRadius: 6,
        background: 'linear-gradient(135deg, ' + C_GR1 + ', ' + C_GR2 + ', ' + C_GR3 + ')',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
      }},
        e('svg', { width: 14, height: 12, viewBox: '0 0 20 16.2', fill: 'none' },
          e('path', { d: FLOWHUNT_PATH, fill: '#ffffff' })
        )
      ),
      e('span', { style: { color: C_TEXT, fontSize: 14, fontWeight: 700, letterSpacing: '-0.3px' } }, 'FlowHunt')
    ),
    e('div', { key: 'workspace', style: { padding: '0 14px 10px 14px' } },
      e('div', { style: { fontSize: 11, fontWeight: 600, color: C_TEXT } }, 'My Personal one'),
      e('div', { style: { fontSize: 9, color: C_TEXT_MUTED, marginTop: 1 } }, 'test1@test.com')
    ),
    e('div', { key: 'project-back', style: {
      padding: '8px 14px', borderTop: '1px solid ' + C_CARD_BORDER, borderBottom: '1px solid ' + C_CARD_BORDER
    }},
      e('div', { style: { display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600, color: C_TEXT } },
        e('span', { style: { fontSize: 11 } }, '\u2190'),
        'Newsletter Site'
      ),
      e('div', { style: { fontSize: 9, color: C_TEXT_MUTED, marginTop: 2 } }, 'Back to projects')
    ),
    e('div', { key: 'nav-items', style: { padding: '8px 14px', display: 'flex', flexDirection: 'column', gap: 2 } },
      e('div', { style: {
        padding: '5px 8px', fontSize: 12, fontWeight: 400, color: C_TEXT_DIM,
        display: 'flex', alignItems: 'center', gap: 6, borderRadius: 4
      }},
        e('svg', { width: 11, height: 11, viewBox: '0 0 24 24', fill: '#6b7280' },
          e('path', { d: LIST_PATH })
        ),
        'Issues'
      ),
      e('div', { style: {
        padding: '5px 8px', fontSize: 12, fontWeight: 700, color: C_TEXT,
        display: 'flex', alignItems: 'center', gap: 6, borderRadius: 4,
        background: '#f3f4f6'
      }},
        e('svg', { width: 11, height: 11, viewBox: '0 0 24 24', fill: '#111827' },
          e('path', { d: CHAT_PATH })
        ),
        'Chat'
      )
    ),
    e('div', { key: 'recent-label', style: {
      padding: '10px 14px 4px 14px', fontSize: 8, fontWeight: 600,
      color: C_TEXT_MUTED, textTransform: 'uppercase', letterSpacing: '0.6px'
    }}, 'Recent Conversations'),
    e('div', { key: 'conversations', style: { padding: '0 14px', display: 'flex', flexDirection: 'column', gap: 2 } },
      CONVERSATIONS.map(function(conv, i) {
        return e('div', { key: 'conv-' + i, style: {
          padding: '4px 8px', fontSize: 10, color: C_TEXT_DIM,
          display: 'flex', alignItems: 'center', gap: 6, borderRadius: 4
        }},
          e('div', { style: { width: 6, height: 6, borderRadius: '50%', background: '#d1d5db', flexShrink: 0 } }),
          e('span', { style: { color: C_TEXT_MUTED, fontSize: 9 } }, conv.time),
          e('span', { style: { marginLeft: 'auto', fontSize: 9, color: C_TEXT_DIM } }, conv.num)
        );
      })
    ),
    e('div', { key: 'spacer', style: { flex: 1 } }),
    e('div', { key: 'user-area', style: {
      padding: '10px 14px', borderTop: '1px solid ' + C_CARD_BORDER,
      display: 'flex', alignItems: 'center', gap: 8
    }},
      e('div', { style: {
        width: 24, height: 24, borderRadius: '50%',
        background: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', fontSize: 10, fontWeight: 600, flexShrink: 0
      }}, 'N'),
      e('div', { style: { flex: 1, minWidth: 0 } },
        e('div', { style: { fontSize: 10, fontWeight: 600, color: C_TEXT } }, 'Test'),
        e('div', { style: { fontSize: 8, color: C_TEXT_MUTED } }, 'Enterprise  99908.64')
      )
    )
  ));

  // ===== CHAT AREA LAYOUT =====
  var chatLeft = totalSidebarW;
  var chatTop = 0;
  var chatW = W - totalSidebarW;
  var inputBarH = 100;
  var chatViewportH = H - inputBarH;
  var contentLeft = chatLeft + 100;
  var contentW = chatW - 200;

  // ===== TIMELINE (900 frames = 30s) =====
  // f0-50:    Fade in welcome state ("How can I help?")
  // f50-220:  Type first message (170 frames - very slow)
  // f220-250: Send: welcome fades, conversation begins
  // f250-340: Tool calls slide in (3 tools, 30 frames each)
  // f340-440: AI text response + table title fade in
  // f440-580: 5 table rows reveal one by one (28 frames each)
  // f580-650: Pause for reading
  // f650-790: Type second message (140 frames)
  // f790-815: Send second message
  // f815-870: Routing badge + tool call + SEO metrics (scrolled into view)
  // f815+:    Notification slides in from right
  // f870-900: Fade out

  // ===== WELCOME STATE (visible f0-235) =====
  var welcomeOp = f < 130 ? 1 : (f < 150 ? 1 - eo3(p(130, 150)) : 0);
  if (welcomeOp > 0) {
    var welcomeCY = chatTop + chatViewportH / 2 - 60;

    children.push(e('div', { key: 'wel-sparkle', style: {
      position: 'absolute',
      left: chatLeft + chatW / 2 - 22,
      top: welcomeCY - 60,
      width: 44, height: 44, borderRadius: 12,
      background: 'linear-gradient(135deg, ' + C_GR1 + ', ' + C_GR2 + ', ' + C_GR3 + ')',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      opacity: welcomeOp * globalOp, zIndex: 8,
      boxShadow: '0 4px 16px rgba(70,92,224,0.25)'
    }},
      e('svg', { width: 24, height: 24, viewBox: '0 0 24 24', fill: '#ffffff' },
        e('path', { d: SPARKLE_PATH })
      )
    ));

    children.push(e('div', { key: 'wel-heading', style: {
      position: 'absolute',
      left: chatLeft, top: welcomeCY,
      width: chatW, textAlign: 'center',
      fontSize: 28, fontWeight: 700, color: C_TEXT,
      letterSpacing: '-0.5px',
      opacity: welcomeOp * globalOp, zIndex: 8
    }}, 'How can I help?'));

    children.push(e('div', { key: 'wel-sub', style: {
      position: 'absolute',
      left: chatLeft, top: welcomeCY + 42,
      width: chatW, textAlign: 'center',
      fontSize: 13, fontWeight: 400, color: C_TEXT_DIM,
      opacity: welcomeOp * globalOp, zIndex: 8
    }}, 'A team of agents managing the website for ai newsletter'));

    var taW = 540;
    var taH = 90;
    var taX = chatLeft + (chatW - taW) / 2;
    var taY = welcomeCY + 80;

    children.push(e('div', { key: 'wel-textarea', style: {
      position: 'absolute',
      left: taX, top: taY, width: taW, height: taH,
      background: '#ffffff',
      border: '1px solid ' + C_CARD_BORDER,
      borderRadius: 12,
      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      padding: '14px 18px',
      opacity: welcomeOp * globalOp, zIndex: 8
    }},
      (function() {
        var text = 'what are the latest blogs created';
        var typeStart = 30;
        var typeEnd = 110;
        if (f < typeStart) return e('span', { style: { color: C_TEXT_MUTED, fontSize: 14 } }, 'Ask anything about your project...');
        var prog = cl((f - typeStart) / (typeEnd - typeStart), 0, 1);
        var chars = Math.floor(prog * text.length);
        var blink = (f % 30) < 15;
        return e('span', { style: { color: C_TEXT, fontSize: 14, fontWeight: 400 } },
          text.substring(0, chars),
          blink ? e('span', { style: { borderRight: '2px solid ' + C_BLUE, marginLeft: 1 } }, '\u200B') : null
        );
      })(),
      e('div', { style: {
        position: 'absolute', right: 12, bottom: 12,
        width: 30, height: 30, borderRadius: '50%',
        background: f >= 100 ? '#111827' : '#e5e7eb',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }},
        e('svg', { width: 14, height: 14, viewBox: '0 0 24 24', fill: 'none', stroke: f >= 100 ? '#ffffff' : '#9ca3af', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' },
          e('path', { d: 'M12 19V5M5 12L12 5L19 12' })
        )
      )
    ));

    var sugY = taY + taH + 16;
    var sugW = 175;
    var sugGap = 8;
    var sugTotal = sugW * 3 + sugGap * 2;
    var sugStartX = chatLeft + (chatW - sugTotal) / 2;
    var suggestions = [
      { icon: SPARKLE_PATH, color: '#984ad7', text: 'What should we publish this week?' },
      { icon: WRENCH_PATH, color: '#465ce0', text: 'Are CI/CD failures blocking deployment?' },
      { icon: CHART_PATH, color: '#0497dc', text: 'How to grow subscribers fast?' }
    ];
    suggestions.forEach(function(sug, si) {
      var sFade = f >= 35 ? eo3(p(35 + si * 5, 55 + si * 5)) : 0;
      children.push(e('div', { key: 'sug-' + si, style: {
        position: 'absolute',
        left: sugStartX + si * (sugW + sugGap), top: sugY,
        width: sugW, height: 50,
        background: '#ffffff',
        border: '1px solid ' + C_CARD_BORDER,
        borderRadius: 10,
        padding: '10px 12px',
        display: 'flex', alignItems: 'center', gap: 8,
        opacity: welcomeOp * globalOp * sFade, zIndex: 8,
        boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
      }},
        e('svg', { width: 14, height: 14, viewBox: '0 0 24 24', fill: sug.color },
          e('path', { d: sug.icon })
        ),
        e('span', { style: { fontSize: 11, color: C_TEXT, lineHeight: '1.3', flex: 1 } }, sug.text),
        e('span', { style: { fontSize: 12, color: C_TEXT_MUTED } }, '\u203A')
      ));
    });
  }

  // ===== CONVERSATION (persistent scrolling) =====
  // We define each chat element in absolute "document" coordinates.
  // The viewport scrolls down (scrollY increases) to keep the latest item visible.
  var convoOp = f >= 130 ? eo3(p(130, 160)) : 0;

  if (convoOp > 0) {
    // Document Y positions (in scroll-space, top-down)
    var docTop = 30;
    var msg1Y = docTop;            // user message 1
    var msg1H = 50;
    var gap1 = 24;

    var tools1Y = msg1Y + msg1H + gap1;     // tool call rows
    var toolH = 46;
    var toolGap = 8;
    var tools1H = toolH * 3 + toolGap * 2;
    var gap2 = 24;

    var respTextY = tools1Y + tools1H + gap2;  // AI response text
    var respTextH = 46;
    var gap3 = 14;

    var tableTitleY = respTextY + respTextH + gap3;
    var tableTitleH = 28;
    var gap4 = 12;

    var tableY = tableTitleY + tableTitleH + gap4;
    var tableHeaderH = 32;
    var tableRowH = 30;
    var tableH = tableHeaderH + tableRowH * 5;
    var gap5 = 36;

    var msg2Y = tableY + tableH + gap5;       // user message 2
    var msg2H = 50;
    var gap6 = 24;

    var routeY = msg2Y + msg2H + gap6;        // routing badge
    var routeH = 32;
    var gap7 = 12;

    var tool2Y = routeY + routeH + gap7;      // tool call (ask_from_coworker)
    var tool2H = 46;
    var gap8 = 24;

    var seoTitleY = tool2Y + tool2H + gap8;   // SEO header
    var seoTitleH = 26;
    var gap9 = 12;

    var metricsY = seoTitleY + seoTitleH + gap9;  // metrics row
    var metricsH = 70;
    var docBottom = metricsY + metricsH + 30;

    // Compute scrollY based on frame: scroll smoothly so latest content is visible
    // Viewport: chatTop to chatTop + chatViewportH
    // Anchor scroll points (when content needs to be visible)
    function targetScrollFor(elementBottomY) {
      var viewBottom = chatTop + chatViewportH - 40;
      if (elementBottomY > viewBottom) {
        return elementBottomY - viewBottom;
      }
      return 0;
    }

    // Scroll keyframes
    var scrollKeys = [
      { f: 130, y: 0 },
      { f: 200, y: 0 },                              // tools shown, no scroll yet
      { f: 230, y: targetScrollFor(tableTitleY + tableTitleH) },
      { f: 320, y: targetScrollFor(tableY + tableH) },
      { f: 470, y: targetScrollFor(msg2Y + msg2H) },
      { f: 510, y: targetScrollFor(tool2Y + tool2H) },
      { f: 560, y: targetScrollFor(metricsY + metricsH) }        // scroll to show metrics
    ];

    function getScrollY() {
      if (f <= scrollKeys[0].f) return scrollKeys[0].y;
      for (var i = 0; i < scrollKeys.length - 1; i++) {
        var a = scrollKeys[i], b = scrollKeys[i + 1];
        if (f >= a.f && f < b.f) {
          var t = eo3((f - a.f) / (b.f - a.f));
          return lerp(a.y, b.y, t);
        }
      }
      return scrollKeys[scrollKeys.length - 1].y;
    }

    var scrollY = getScrollY();

    // Helper: render at document Y, applying scrollY offset
    function placeAt(docY, height) {
      return chatTop + docY - scrollY;
    }

    // Clipping container
    children.push(e('div', { key: 'chat-clip', style: {
      position: 'absolute',
      left: chatLeft, top: chatTop, width: chatW, height: chatViewportH,
      overflow: 'hidden',
      opacity: globalOp, zIndex: 6
    }}));

    // ----- USER MESSAGE 1 (visible f230+) -----
    var msg1Op = f >= 125 ? eo3(p(125, 150)) : 0;
    if (msg1Op > 0) {
      children.push(e('div', { key: 'msg1', style: {
        position: 'absolute',
        left: chatLeft, top: placeAt(msg1Y),
        width: chatW, display: 'flex', justifyContent: 'flex-end',
        paddingRight: 100,
        opacity: msg1Op * convoOp * globalOp, zIndex: 8
      }},
        e('div', { style: {
          padding: '12px 18px',
          background: 'linear-gradient(135deg, ' + C_BLUE + ', ' + C_BLUE_DARK + ')',
          color: '#ffffff',
          borderRadius: '16px 16px 4px 16px',
          fontSize: 14, fontWeight: 500,
          maxWidth: 360,
          boxShadow: '0 2px 8px rgba(59,130,246,0.2)'
        }}, 'what are the latest blogs created')
      ));
    }

    // ----- TOOL CALLS 1 (3 rows, slide in staggered) -----
    var tools1 = [
      { name: 'search_and_load_tools', sub: 'search_and_load_tools', dur: '155ms' },
      { name: 'github_search_code', sub: 'github_search_code', dur: '995ms' },
      { name: 'github_get_file', sub: 'github_get_file', dur: '1258ms' }
    ];
    tools1.forEach(function(tool, ti) {
      var tStart = 160 + ti * 14;
      var tOp = f >= tStart ? eo3(p(tStart, tStart + 30)) : 0;
      var tSlide = (1 - (f >= tStart ? eo3(p(tStart, tStart + 30)) : 0)) * 12;
      if (tOp <= 0.01) return;

      children.push(e('div', { key: 'tool1-' + ti, style: {
        position: 'absolute',
        left: contentLeft, top: placeAt(tools1Y + ti * (toolH + toolGap)) + tSlide,
        width: contentW, height: toolH,
        background: '#f9fafb',
        border: '1px solid ' + C_CARD_BORDER,
        borderRadius: 8,
        padding: '0 16px',
        display: 'flex', alignItems: 'center', gap: 12,
        opacity: tOp * convoOp * globalOp, zIndex: 7,
        boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
      }},
        e('svg', { width: 16, height: 16, viewBox: '0 0 24 24', fill: '#6b7280' },
          e('path', { d: WRENCH_PATH })
        ),
        e('div', { style: { flex: 1 } },
          e('div', { style: { fontSize: 13, fontWeight: 600, color: C_TEXT } }, 'Using ' + tool.name),
          e('div', { style: { fontSize: 10, color: C_TEXT_MUTED, marginTop: 2 } }, tool.sub)
        ),
        e('span', { style: { fontSize: 11, color: C_TEXT_MUTED, marginRight: 6 } }, tool.dur),
        e('span', { style: { fontSize: 12, color: C_TEXT_MUTED } }, '\u2304')
      ));
    });

    // ----- AI RESPONSE TEXT -----
    var respOp = f >= 200 ? eo3(p(200, 225)) : 0;
    if (respOp > 0) {
      children.push(e('div', { key: 'resp-text', style: {
        position: 'absolute',
        left: contentLeft, top: placeAt(respTextY),
        width: contentW,
        fontSize: 14, color: C_TEXT, lineHeight: '1.6',
        opacity: respOp * convoOp * globalOp, zIndex: 8
      }},
        'Here\u2019s a summary of the ',
        e('span', { style: { fontWeight: 700 } }, '5 latest blog posts'),
        ' on the AI Newsletter site, pulled directly from ',
        e('span', { style: { fontFamily: 'monospace', background: '#f3f4f6', padding: '2px 6px', borderRadius: 4, fontSize: 12 } }, 'src/app/blog/page.tsx'),
        ':'
      ));
    }

    // ----- TABLE TITLE -----
    var tblTitleOp = f >= 225 ? eo3(p(225, 245)) : 0;
    if (tblTitleOp > 0) {
      children.push(e('div', { key: 'tbl-title', style: {
        position: 'absolute',
        left: contentLeft, top: placeAt(tableTitleY),
        fontSize: 15, fontWeight: 700, color: C_TEXT,
        opacity: tblTitleOp * convoOp * globalOp, zIndex: 8
      }}, '\u{1F4DD} Latest Blog Posts'));
    }

    // ----- TABLE -----
    var tblOp = f >= 250 ? eo3(p(250, 270)) : 0;
    if (tblOp > 0) {
      var tblW = contentW;
      var c1W = 44;
      var rest = tblW - c1W;
      var c2W = rest * 0.42;
      var c3W = rest * 0.18;
      var c4W = rest * 0.14;
      var c5W = rest * 0.26;

      // Header
      children.push(e('div', { key: 'tbl-h', style: {
        position: 'absolute',
        left: contentLeft, top: placeAt(tableY), width: tblW, height: tableHeaderH,
        background: '#f9fafb',
        border: '1px solid ' + C_CARD_BORDER,
        borderRadius: '8px 8px 0 0',
        display: 'flex', alignItems: 'center',
        fontSize: 11, fontWeight: 700, color: C_TEXT_DIM,
        opacity: tblOp * convoOp * globalOp, zIndex: 8
      }},
        e('div', { style: { width: c1W, padding: '0 10px', textAlign: 'center' } }, '#'),
        e('div', { style: { width: c2W, padding: '0 10px' } }, 'Title'),
        e('div', { style: { width: c3W, padding: '0 10px' } }, 'Date'),
        e('div', { style: { width: c4W, padding: '0 10px' } }, 'Read'),
        e('div', { style: { width: c5W, padding: '0 10px' } }, 'Tags')
      ));

      var rows = [
        { n: 1, title: 'Building Reliable AI Pipelines with LangGraph', date: 'Mar 25, 2026', read: '12 min', tags: 'LangGraph, Pipelines' },
        { n: 2, title: 'Vector Databases: A Practical Comparison', date: 'Mar 18, 2026', read: '8 min', tags: 'Vector DB, RAG' },
        { n: 3, title: 'From Prototype to Production: LLM Best Practices', date: 'Mar 11, 2026', read: '15 min', tags: 'LLM, Production' },
        { n: 4, title: 'Structured Output Patterns for LLM Applications', date: 'Mar 4, 2026', read: '10 min', tags: 'LLM, Patterns' },
        { n: 5, title: 'Evaluation-Driven Development for AI Features', date: 'Feb 25, 2026', read: '11 min', tags: 'Eval, Testing' }
      ];

      rows.forEach(function(row, ri) {
        var rStart = 270 + ri * 12;
        var rOp = f >= rStart ? eo3(p(rStart, rStart + 28)) : 0;
        var rSlide = (1 - (f >= rStart ? eo3(p(rStart, rStart + 28)) : 0)) * 8;
        if (rOp <= 0.01) return;

        children.push(e('div', { key: 'tbl-r' + ri, style: {
          position: 'absolute',
          left: contentLeft, top: placeAt(tableY + tableHeaderH + ri * tableRowH) + rSlide,
          width: tblW, height: tableRowH,
          background: '#ffffff',
          borderLeft: '1px solid ' + C_CARD_BORDER,
          borderRight: '1px solid ' + C_CARD_BORDER,
          borderBottom: '1px solid ' + C_CARD_BORDER,
          borderRadius: ri === 4 ? '0 0 8px 8px' : 0,
          display: 'flex', alignItems: 'center',
          fontSize: 11, color: C_TEXT,
          opacity: rOp * convoOp * globalOp, zIndex: 7
        }},
          e('div', { style: { width: c1W, padding: '0 10px', textAlign: 'center', color: C_TEXT_MUTED } }, row.n),
          e('div', { style: { width: c2W, padding: '0 10px', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, row.title),
          e('div', { style: { width: c3W, padding: '0 10px', color: C_TEXT_DIM } }, row.date),
          e('div', { style: { width: c4W, padding: '0 10px', color: C_TEXT_DIM } }, row.read),
          e('div', { style: { width: c5W, padding: '0 10px', color: C_BLUE, fontSize: 10 } }, row.tags)
        ));
      });
    }

    // ----- USER MESSAGE 2 (f790+) -----
    var msg2Op = f >= 460 ? eo3(p(460, 480)) : 0;
    if (msg2Op > 0) {
      children.push(e('div', { key: 'msg2', style: {
        position: 'absolute',
        left: chatLeft, top: placeAt(msg2Y),
        width: chatW, display: 'flex', justifyContent: 'flex-end',
        paddingRight: 100,
        opacity: msg2Op * convoOp * globalOp, zIndex: 8
      }},
        e('div', { style: {
          padding: '12px 18px',
          background: 'linear-gradient(135deg, ' + C_BLUE + ', ' + C_BLUE_DARK + ')',
          color: '#ffffff',
          borderRadius: '16px 16px 4px 16px',
          fontSize: 14, fontWeight: 500,
          maxWidth: 360,
          boxShadow: '0 2px 8px rgba(59,130,246,0.2)'
        }}, 'ask team mate about how SEO is going')
      ));
    }

    // ----- ROUTING BADGE -----
    var routeOp = f >= 480 ? eo3(p(480, 500)) : 0;
    if (routeOp > 0) {
      children.push(e('div', { key: 'route', style: {
        position: 'absolute',
        left: contentLeft, top: placeAt(routeY),
        display: 'flex', alignItems: 'center', gap: 10,
        opacity: routeOp * convoOp * globalOp, zIndex: 8
      }},
        e('div', { style: {
          padding: '5px 12px', borderRadius: 12,
          background: '#dbeafe', border: '1px solid #93c5fd',
          color: '#1e40af', fontSize: 11, fontWeight: 600,
          display: 'flex', alignItems: 'center', gap: 5
        }},
          e('div', { style: { width: 6, height: 6, borderRadius: '50%', background: '#22c55e' } }),
          'newsletter_site_director'
        ),
        e('div', { style: { display: 'flex', alignItems: 'center', gap: 4 } },
          [0, 1, 2].map(function(di) {
            var phase = ((f - 480 + di * 5) % 30) / 30;
            return e('div', { key: 'd' + di, style: {
              width: 5, height: 5, borderRadius: '50%',
              background: C_BLUE,
              opacity: 0.3 + 0.7 * phase
            }});
          }),
          e('span', { style: { color: C_BLUE, fontSize: 14, fontWeight: 700, marginLeft: 2 } }, '\u2192')
        ),
        e('div', { style: {
          padding: '5px 12px', borderRadius: 12,
          background: '#dcfce7', border: '1px solid #86efac',
          color: '#166534', fontSize: 11, fontWeight: 600,
          display: 'flex', alignItems: 'center', gap: 5,
          boxShadow: '0 0 8px rgba(34,197,94,0.3)'
        }},
          e('div', { style: { width: 6, height: 6, borderRadius: '50%', background: '#22c55e' } }),
          'growth_analytics_agent'
        )
      ));
    }

    // ----- TOOL CALL 2 (ask_from_coworker) -----
    var tool2Op = f >= 500 ? eo3(p(500, 520)) : 0;
    if (tool2Op > 0) {
      children.push(e('div', { key: 'tool2', style: {
        position: 'absolute',
        left: contentLeft, top: placeAt(tool2Y),
        width: contentW, height: tool2H,
        background: '#f9fafb',
        border: '1px solid ' + C_CARD_BORDER,
        borderRadius: 8,
        padding: '0 16px',
        display: 'flex', alignItems: 'center', gap: 12,
        opacity: tool2Op * convoOp * globalOp, zIndex: 7,
        boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
      }},
        e('svg', { width: 16, height: 16, viewBox: '0 0 24 24', fill: '#6b7280' },
          e('path', { d: WRENCH_PATH })
        ),
        e('div', { style: { flex: 1 } },
          e('div', { style: { fontSize: 13, fontWeight: 600, color: C_TEXT } }, 'Using ask_from_coworker'),
          e('div', { style: { fontSize: 10, color: C_TEXT_MUTED, marginTop: 2 } }, 'ask_from_coworker')
        ),
        e('span', { style: { fontSize: 11, color: C_TEXT_MUTED, marginRight: 6 } }, '224ms'),
        e('span', { style: { fontSize: 12, color: C_TEXT_MUTED } }, '\u2304')
      ));
    }

    // ----- SEO TITLE + METRICS -----
    var seoOp = f >= 520 ? eo3(p(520, 540)) : 0;
    if (seoOp > 0) {
      children.push(e('div', { key: 'seo-title', style: {
        position: 'absolute',
        left: contentLeft, top: placeAt(seoTitleY),
        fontSize: 15, fontWeight: 700, color: C_TEXT,
        opacity: seoOp * convoOp * globalOp, zIndex: 8
      }}, '\u{1F4CA} SEO Status Report'));

      var metrics = [
        { label: 'Impressions', value: '12,847', change: '+23%', color: '#16a34a' },
        { label: 'Clicks', value: '1,432', change: '+18%', color: '#16a34a' },
        { label: 'Avg Position', value: '14.2', change: '-3.1', color: '#16a34a' }
      ];
      var mGap = 14;
      var mW = (contentW - mGap * 2) / 3;

      metrics.forEach(function(m, mi) {
        var mStart = 530 + mi * 6;
        var mOp = f >= mStart ? eo3(p(mStart, mStart + 22)) : 0;
        if (mOp <= 0.01) return;

        children.push(e('div', { key: 'metric-' + mi, style: {
          position: 'absolute',
          left: contentLeft + mi * (mW + mGap), top: placeAt(metricsY),
          width: mW, height: 64,
          background: '#ffffff',
          border: '1px solid ' + C_CARD_BORDER,
          borderRadius: 10,
          padding: '10px 14px',
          opacity: mOp * convoOp * globalOp, zIndex: 8,
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
        }},
          e('div', { style: { fontSize: 10, color: C_TEXT_MUTED, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px' } }, m.label),
          e('div', { style: { display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 4 } },
            e('span', { style: { fontSize: 22, fontWeight: 700, color: C_TEXT } }, m.value),
            e('span', { style: { fontSize: 11, fontWeight: 600, color: m.color } }, m.change)
          )
        ));
      });
    }
  }

  // ===== NOTIFICATION CARD (slides in from right at f815+) =====
  var notifShow = f >= 530;
  if (notifShow) {
    var notifSlide = eo3(p(530, 565));
    var notifW = 280;
    var notifX = W - notifW * notifSlide - 24;
    var notifY = 80;
    var notifOp = notifSlide * globalOp;

    children.push(e('div', { key: 'notif', style: {
      position: 'absolute',
      left: notifX, top: notifY,
      width: notifW,
      background: '#ffffff',
      border: '1px solid ' + C_CARD_BORDER,
      borderLeft: '4px solid #22c55e',
      borderRadius: 12,
      padding: '14px 16px',
      boxShadow: '0 12px 32px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.06)',
      opacity: notifOp, zIndex: 30
    }},
      e('div', { style: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 } },
        e('div', { style: {
          width: 22, height: 22, borderRadius: 6,
          background: 'linear-gradient(135deg, ' + C_GR1 + ', ' + C_GR2 + ', ' + C_GR3 + ')',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }},
          e('svg', { width: 12, height: 12, viewBox: '0 0 24 24', fill: '#ffffff' },
            e('path', { d: BELL_PATH })
          )
        ),
        e('span', { style: { fontSize: 12, fontWeight: 700, color: C_TEXT } }, 'FlowHunt'),
        e('span', { style: { fontSize: 10, color: C_TEXT_MUTED } }, '\u2022 just now')
      ),
      e('div', { style: { fontSize: 12, color: C_TEXT, lineHeight: '1.5', marginBottom: 6 } },
        e('span', { style: { color: '#16a34a', fontWeight: 600 } }, '\u2713 '),
        '3 tasks completed in Newsletter Site'
      ),
      e('div', { style: { fontSize: 12, color: C_TEXT, lineHeight: '1.5', marginBottom: 10 } },
        e('span', { style: { color: C_BLUE, fontWeight: 600 } }, '\u{1F4CA} '),
        'SEO report ready for review'
      ),
      e('div', { style: {
        fontSize: 10, color: C_TEXT_MUTED, paddingTop: 8,
        borderTop: '1px solid ' + C_CARD_BORDER
      }}, 'Stay in the loop via Slack, iMessage, or email')
    ));
  }

  // ===== INPUT BAR AT BOTTOM =====
  var inputBarY = H - inputBarH;
  children.push(e('div', { key: 'input-bar', style: {
    position: 'absolute',
    left: chatLeft, top: inputBarY,
    width: chatW, height: inputBarH,
    background: '#ffffff',
    borderTop: '1px solid ' + C_CARD_BORDER,
    padding: '14px 100px',
    opacity: globalOp, zIndex: 14
  }},
    // Agent badges above input
    e('div', { style: {
      display: 'flex', gap: 6, marginBottom: 10,
      justifyContent: 'flex-start'
    }},
      e('div', { style: {
        padding: '4px 11px',
        background: 'linear-gradient(135deg, ' + C_BLUE + ', ' + C_BLUE_DARK + ')',
        color: '#ffffff',
        borderRadius: 12,
        fontSize: 10, fontWeight: 600,
        display: 'flex', alignItems: 'center', gap: 5
      }},
        e('div', { style: { width: 6, height: 6, borderRadius: '50%', background: '#86efac' } }),
        'newsletter_site_director'
      ),
      f >= 500 ? e('div', { style: {
        padding: '4px 11px',
        background: 'linear-gradient(135deg, #16a34a, #15803d)',
        color: '#ffffff',
        borderRadius: 12,
        fontSize: 10, fontWeight: 600,
        display: 'flex', alignItems: 'center', gap: 5,
        opacity: eo3(p(500, 525))
      }},
        e('div', { style: { width: 6, height: 6, borderRadius: '50%', background: '#86efac' } }),
        'growth_analytics_agent'
      ) : null
    ),
    e('div', { style: {
      width: '100%', height: 44,
      background: '#f5f7fa',
      border: '1px solid ' + C_CARD_BORDER,
      borderRadius: 10,
      padding: '0 16px',
      display: 'flex', alignItems: 'center',
      fontSize: 13, color: C_TEXT_MUTED
    }},
      e('div', { style: { flex: 1 } },
        // Show typing in input for second message phase (f650-790)
        f >= 380 && f < 460 ? (function() {
          var t = 'ask team mate about how SEO is going';
          var prog = cl((f - 380) / 80, 0, 1);
          var c = Math.floor(prog * t.length);
          var blink = (f % 30) < 15;
          return e('span', { style: { color: C_TEXT } },
            t.substring(0, c),
            blink ? e('span', { style: { borderRight: '2px solid ' + C_BLUE, marginLeft: 1 } }, '\u200B') : null
          );
        })() : 'Reply...'
      ),
      e('div', { style: {
        width: 30, height: 30, borderRadius: '50%',
        background: '#111827',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }},
        e('svg', { width: 13, height: 13, viewBox: '0 0 24 24', fill: 'none', stroke: '#ffffff', strokeWidth: 2.5, strokeLinecap: 'round', strokeLinejoin: 'round' },
          e('path', { d: 'M12 19V5M5 12L12 5L19 12' })
        )
      )
    )
  ));

  // ===== VOICEOVER TEXT =====
  var vo1Op = f >= 30 ? (f < 55 ? eo3(p(30, 55)) : (f < 320 ? 1 : (f < 350 ? 1 - eo3(p(320, 350)) : 0))) : 0;
  if (vo1Op > 0) {
    children.push(e('div', { key: 'vo1', style: {
      position: 'absolute', bottom: inputBarH + 14, left: chatLeft, width: chatW, textAlign: 'center',
      opacity: vo1Op * globalOp, zIndex: 22, pointerEvents: 'none'
    }},
      e('div', { style: {
        display: 'inline-block', padding: '10px 24px', borderRadius: 12,
        background: 'rgba(255,255,255,0.95)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
        border: '1px solid ' + C_CARD_BORDER
      }},
        e('span', { style: { color: C_TEXT, fontSize: 15, fontWeight: 500 } },
          'Just ask \u2014 your Supervisor has full context of every task'
        )
      )
    ));
  }

  var vo2Op = f >= 380 ? (f < 410 ? eo3(p(380, 410)) : (f < 600 ? 1 : (f < 630 ? 1 - eo3(p(600, 630)) : 0))) : 0;
  if (vo2Op > 0) {
    children.push(e('div', { key: 'vo2', style: {
      position: 'absolute', bottom: inputBarH + 14, left: chatLeft, width: chatW, textAlign: 'center',
      opacity: vo2Op * globalOp, zIndex: 22, pointerEvents: 'none'
    }},
      e('div', { style: {
        display: 'inline-block', padding: '10px 24px', borderRadius: 12,
        background: 'rgba(255,255,255,0.95)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
        border: '1px solid ' + C_CARD_BORDER
      }},
        e('span', { style: { color: C_TEXT, fontSize: 15, fontWeight: 500 } },
          'Agents talk to each other \u2014 cross-team queries happen automatically'
        )
      )
    ));
  }

  return e('div', { style: {
    position: 'relative', width: W, height: H, overflow: 'hidden',
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    background: C_BG
  }}, children);
}
