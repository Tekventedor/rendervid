// Scene Agents: AI Projects Agents Hierarchy View — mimics the FlowHunt agents UI 1:1 (10s = 300 frames @ 30fps)
// Shows the post-setup agents canvas with Supervisor connected to 3 worker agents.
function AIFactoryAgentsScene(props) {
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
  function breathe(seed, speed) { return (Math.sin(f * (speed || 0.06) + (seed || 0) * 3.7) + 1) * 0.5; }
  function float(seed, amp, speed) { return Math.sin(f * (speed || 0.04) + (seed || 0) * 4.1) * (amp || 2); }

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

  // SVG paths
  var FLOWHUNT_PATH = 'M2.6,12.7l-.9,2.1c-.2.4,0,.8.2,1.1.2.2.4.3.7.3s.5,0,.7-.3l.8-.8,3.2-3.2c.1-.1,0-.4-.2-.4h-1.8s0,0,0,0c-1.9,0-3.4-1.6-3.4-3.5,0-1.9,1.6-3.3,3.5-3.3h3.8c0,0,.1,0,.2,0l1.5-1.5c.1-.1,0-.4-.2-.4h-5.4C2.5,2.7,0,5.2,0,8.1c0,2,1.1,3.7,2.6,4.6h0ZM14.5,11.5c1.9,0,3.4-1.5,3.5-3.3,0-1.9-1.5-3.5-3.4-3.5s0,0,0,0h-1.8c-.2,0-.3-.3-.2-.4l3.3-3.3h0l.7-.7c.4-.4,1-.4,1.4,0,.3.3.4.8.3,1.1l-.9,2.1c1.6.9,2.6,2.6,2.6,4.6,0,3-2.5,5.4-5.5,5.4h-5.4c-.2,0-.3-.3-.2-.4l1.5-1.5s.1,0,.2,0h3.8,0ZM13.6,6.3c1,0,1.7.8,1.7,1.7s-.8,1.7-1.7,1.7-1.7-.8-1.7-1.7.8-1.7,1.7-1.7ZM6.5,6.3c1,0,1.7.8,1.7,1.7s-.8,1.7-1.7,1.7-1.7-.8-1.7-1.7.8-1.7,1.7-1.7Z';
  var ROBOT_PATH = 'M10 .667a1 1 0 011 1v.667h2.333A2.667 2.667 0 0116 5v3.334a2.667 2.667 0 01-2.5 2.661v.054l2.78 1.39a1 1 0 01-.894 1.79l-1.886-.944V17.5a1 1 0 01-2 0V16h-3v1.5a1 1 0 11-2 0v-4.215l-1.886.943a1 1 0 11-.894-1.789l2.78-1.39v-.054A2.667 2.667 0 014 8.334V5a2.667 2.667 0 012.667-2.666H9v-.667a1 1 0 011-1zM6.667 4.334A.667.667 0 006 5v3.334A.667.667 0 006.667 9h6.666A.667.667 0 0014 8.334V5a.667.667 0 00-.667-.666H6.667zM11.5 11h-3v3h3v-2.313a.97.97 0 010-.042V11zM8.333 5.667a1 1 0 011 1v.008a1 1 0 01-2 0v-.008a1 1 0 011-1zm3.334 0a1 1 0 011 1v.008a1 1 0 11-2 0v-.008a1 1 0 011-1z';
  var LIST_PATH = 'M3 6H21V8H3V6ZM3 11H21V13H3V11ZM3 16H21V18H3V16Z';
  var CHAT_PATH = 'M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z';
  var SETTINGS_PATH = 'M12 8C9.79 8 8 9.79 8 12C8 14.21 9.79 16 12 16C14.21 16 16 14.21 16 12C16 9.79 14.21 8 12 8ZM19.43 12.97L21.54 14.63C21.73 14.78 21.78 15.05 21.66 15.27L19.66 18.73C19.54 18.95 19.27 19.03 19.05 18.95L16.56 17.95C16.04 18.34 15.48 18.68 14.87 18.93L14.5 21.58C14.46 21.82 14.25 22 14 22H10C9.75 22 9.54 21.82 9.5 21.58L9.13 18.93C8.52 18.68 7.96 18.34 7.44 17.95L4.95 18.95C4.73 19.03 4.46 18.95 4.34 18.73L2.34 15.27C2.22 15.05 2.27 14.78 2.46 14.63L4.57 12.97C4.53 12.65 4.5 12.33 4.5 12C4.5 11.67 4.53 11.34 4.57 11.03L2.46 9.37C2.27 9.22 2.22 8.95 2.34 8.73L4.34 5.27C4.46 5.05 4.73 4.96 4.95 5.05L7.44 6.05C7.96 5.66 8.52 5.32 9.13 5.07L9.5 2.42C9.54 2.18 9.75 2 10 2H14C14.25 2 14.46 2.18 14.5 2.42L14.87 5.07C15.48 5.32 16.04 5.66 16.56 6.05L19.05 5.05C19.27 4.96 19.54 5.05 19.66 5.27L21.66 8.73C21.78 8.95 21.73 9.22 21.54 9.37L19.43 11.03C19.47 11.34 19.5 11.67 19.5 12C19.5 12.33 19.47 12.65 19.43 12.97Z';
  var STAR_PATH = 'M12 2L15 8L21 9L17 13L18 19L12 16L6 19L7 13L3 9L9 8Z';
  var CAMERA_PATH = 'M9 2L7 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4H17L15 2H9ZM12 17C9.2 17 7 14.8 7 12C7 9.2 9.2 7 12 7C14.8 7 17 9.2 17 12C17 14.8 14.8 17 12 17Z';
  var BARS_PATH = 'M3 11V13H21V11H3ZM3 7V9H21V7H3ZM3 15V17H21V15H3Z';
  var SEARCH_PATH = 'M11 2C15.97 2 20 6.03 20 11C20 15.97 15.97 20 11 20C6.03 20 2 15.97 2 11C2 6.03 6.03 2 11 2ZM11 4C7.13 4 4 7.13 4 11C4 14.87 7.13 18 11 18C14.87 18 18 14.87 18 11C18 7.13 14.87 4 11 4ZM21.41 22L15.41 16L16.41 15L22.41 21L21.41 22Z';
  var CHECK_PATH = 'M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z';
  var BOLT_PATH = 'M11 21H10L11 14H7.5C7.22 14 7 13.78 7 13.5C7 13.36 7.05 13.24 7.13 13.14L13 3H14L13 10H16.5C16.78 10 17 10.22 17 10.5C17 10.62 16.95 10.74 16.88 10.84L11 21Z';
  var ENVELOPE_PATH = 'M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z';
  var PLUS_PATH = 'M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z';

  var children = [];

  // ===== TIMELINE (300 frames = 10s) =====
  var fadeIn = f < 30 ? eo3(p(0, 30)) : 1;
  var fadeOut = f >= 285 ? 1 - eo3(p(285, 300)) : 1;
  var globalOp = fadeIn * fadeOut;

  // ===== BACKGROUND =====
  children.push(e('div', { key: 'bg', style: {
    position: 'absolute', top: 0, left: 0, width: W, height: H,
    background: C_BG, opacity: globalOp
  }}));

  // ===== ICON STRIP (far left) =====
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

  // ===== NAV PANEL =====
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
      e('div', { style: { fontSize: 11, fontWeight: 600, color: C_TEXT } }, 'Astora LTD'),
      e('div', { style: { fontSize: 9, color: C_TEXT_MUTED, marginTop: 1 } }, 'yboroumand@qualityunit.com')
    ),
    e('div', { key: 'project-back', style: {
      padding: '8px 14px', borderTop: '1px solid ' + C_CARD_BORDER, borderBottom: '1px solid ' + C_CARD_BORDER
    }},
      e('div', { style: { display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600, color: C_TEXT, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } },
        e('span', { style: { fontSize: 11, flexShrink: 0 } }, '\u2190'),
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
        padding: '5px 8px', fontSize: 12, fontWeight: 400, color: C_TEXT_DIM,
        display: 'flex', alignItems: 'center', gap: 6, borderRadius: 4
      }},
        e('svg', { width: 11, height: 11, viewBox: '0 0 24 24', fill: '#6b7280' },
          e('path', { d: CHAT_PATH })
        ),
        'Chat'
      )
    ),
    e('div', { key: 'spacer', style: { flex: 1 } }),
    e('div', { key: 'user-area', style: {
      padding: '10px 14px', borderTop: '1px solid ' + C_CARD_BORDER,
      display: 'flex', alignItems: 'center', gap: 8
    }},
      e('div', { style: {
        width: 24, height: 24, borderRadius: '50%',
        background: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', fontSize: 10, fontWeight: 600, flexShrink: 0
      }}, 'A'),
      e('div', { style: { flex: 1, minWidth: 0 } },
        e('div', { style: { fontSize: 10, fontWeight: 600, color: C_TEXT } }, 'Arshia Kahani'),
        e('div', { style: { fontSize: 8, color: C_TEXT_MUTED } }, 'Enterprise  99993600.58')
      )
    )
  ));

  // ===== HEADER / TAB BAR =====
  var headerH = 50;

  children.push(e('div', { key: 'header', style: {
    position: 'absolute', top: 0, left: totalSidebarW, right: 0, height: headerH,
    background: '#ffffff', borderBottom: '1px solid ' + C_CARD_BORDER,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 20px',
    opacity: globalOp, zIndex: 15
  }},
    // Tabs
    e('div', { style: { display: 'flex', gap: 0, height: '100%' } },
      [
        { label: 'Issues', active: false, icon: LIST_PATH },
        { label: 'Agents', active: true, icon: ROBOT_PATH, vb: '0 0 20 20' },
        { label: 'Settings', active: false, icon: SETTINGS_PATH }
      ].map(function(tab, i) {
        var tColor = tab.active ? C_BLUE : C_TEXT_MUTED;
        return e('div', { key: 'tab-' + i, style: {
          padding: '0 14px', display: 'flex', alignItems: 'center', gap: 5,
          borderBottom: tab.active ? '2px solid ' + C_BLUE : '2px solid transparent',
          color: tColor,
          fontSize: 13, fontWeight: tab.active ? 600 : 400,
          marginBottom: -1
        }},
          e('svg', { width: 12, height: 12, viewBox: tab.vb || '0 0 24 24', fill: tColor },
            e('path', { d: tab.icon })
          ),
          tab.label
        );
      })
    ),
    // + Add Agent button
    e('div', { style: {
      padding: '6px 14px', borderRadius: 6,
      background: C_BLUE, color: '#ffffff',
      fontSize: 12, fontWeight: 600,
      display: 'flex', alignItems: 'center', gap: 5,
      boxShadow: '0 1px 3px rgba(59,130,246,0.3)'
    }},
      e('svg', { width: 12, height: 12, viewBox: '0 0 24 24', fill: '#ffffff' },
        e('path', { d: PLUS_PATH })
      ),
      'Add Agent'
    )
  ));

  // ===== CANVAS AREA =====
  var canvasLeft = totalSidebarW;
  var canvasTop = headerH;
  var canvasW = W - totalSidebarW;
  var canvasH = H - headerH;

  // Subtle dot grid background
  children.push(e('div', { key: 'canvas-dots', style: {
    position: 'absolute',
    left: canvasLeft, top: canvasTop, width: canvasW, height: canvasH,
    backgroundImage: 'radial-gradient(circle, #d1d5db 1px, transparent 1px)',
    backgroundSize: '24px 24px',
    opacity: globalOp * 0.4,
    pointerEvents: 'none', zIndex: 4
  }}));

  // ===== HIERARCHY TREE =====
  // Supervisor at top, 3 agents below
  var treeCX = canvasLeft + canvasW / 2;
  var supW = 280, supH = 90;
  var supY = canvasTop + 100;
  var supX = treeCX - supW / 2;

  var agentW = 230, agentH = 110;
  var agentY = supY + supH + 130;
  var agentGap = 30;
  var totalAgentsW = agentW * 3 + agentGap * 2;
  var agentsStartX = treeCX - totalAgentsW / 2;

  var agents = [
    {
      name: 'Ticket Analyzer', role: 'Agent',
      bgIcon: '#dbeafe', iconColor: '#3b82f6', icon: SEARCH_PATH
    },
    {
      name: 'Action Item Creator', role: 'Agent',
      bgIcon: '#dcfce7', iconColor: '#16a34a', icon: LIST_PATH
    },
    {
      name: 'Team Communicator', role: 'Agent',
      bgIcon: '#fef3c7', iconColor: '#f59e0b', icon: ENVELOPE_PATH
    }
  ];

  // ===== CONNECTION LINES (drawn first, behind nodes) =====
  // Vertical line from supervisor down to junction point
  var junctionY = supY + supH + 50;

  var linesOp = f >= 70 ? eo3(p(70, 110)) : 0;

  // Vertical from supervisor
  children.push(e('div', { key: 'line-v-sup', style: {
    position: 'absolute',
    left: treeCX - 1, top: supY + supH,
    width: 2, height: 50,
    backgroundImage: 'linear-gradient(180deg, #d1d5db 50%, transparent 50%)',
    backgroundSize: '2px 6px',
    opacity: linesOp * globalOp, zIndex: 5
  }}));

  // Junction dot at supervisor end
  children.push(e('div', { key: 'jun-sup', style: {
    position: 'absolute',
    left: treeCX - 5, top: junctionY - 5,
    width: 10, height: 10, borderRadius: '50%',
    border: '2px solid #d1d5db', background: '#ffffff',
    opacity: linesOp * globalOp, zIndex: 6
  }}));

  // Horizontal line connecting agents
  agents.forEach(function(_, ai) {
    var ax = agentsStartX + ai * (agentW + agentGap) + agentW / 2;
    // Vertical line down to agent
    children.push(e('div', { key: 'line-v-' + ai, style: {
      position: 'absolute',
      left: ax - 1, top: junctionY,
      width: 2, height: agentY - junctionY,
      backgroundImage: 'linear-gradient(180deg, #d1d5db 50%, transparent 50%)',
      backgroundSize: '2px 6px',
      opacity: linesOp * globalOp, zIndex: 5
    }}));
    // Junction dot at agent end
    children.push(e('div', { key: 'jun-a-' + ai, style: {
      position: 'absolute',
      left: ax - 5, top: agentY - 5,
      width: 10, height: 10, borderRadius: '50%',
      border: '2px solid #d1d5db', background: '#ffffff',
      opacity: linesOp * globalOp, zIndex: 6
    }}));
  });

  // Horizontal junction line
  var firstAX = agentsStartX + agentW / 2;
  var lastAX = agentsStartX + 2 * (agentW + agentGap) + agentW / 2;
  children.push(e('div', { key: 'line-h', style: {
    position: 'absolute',
    left: firstAX, top: junctionY - 1,
    width: lastAX - firstAX, height: 2,
    backgroundImage: 'linear-gradient(90deg, #d1d5db 50%, transparent 50%)',
    backgroundSize: '6px 2px',
    opacity: linesOp * globalOp, zIndex: 5
  }}));

  // ===== SUPERVISOR NODE =====
  var supOp = f >= 40 ? eo3(p(40, 80)) : 0;
  var supScale = f >= 40 ? lerp(0.92, 1, eo3(p(40, 80))) : 0.92;
  var supFloat = supOp >= 1 ? float(0, 1.5, 0.025) : 0;

  children.push(e('div', { key: 'supervisor', style: {
    position: 'absolute',
    left: supX, top: supY + supFloat,
    width: supW, height: supH,
    background: '#ffffff',
    border: '1px solid ' + C_CARD_BORDER,
    borderRadius: 12,
    boxShadow: '0 2px 12px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)',
    padding: '18px 22px',
    display: 'flex', alignItems: 'center', gap: 16,
    opacity: supOp * globalOp,
    transform: 'scale(' + supScale + ')',
    zIndex: 8
  }},
    // Bolt icon (Supervisor)
    e('div', { style: {
      width: 48, height: 48, borderRadius: 10,
      background: '#ede9fe',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0
    }},
      e('svg', { width: 30, height: 30, viewBox: '0 0 24 24', fill: '#7c3aed' },
        e('path', { d: BOLT_PATH })
      )
    ),
    e('div', { style: { flex: 1, minWidth: 0 } },
      e('div', { style: { fontSize: 19, fontWeight: 700, color: C_TEXT, letterSpacing: '-0.3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, 'Newsletter Site Director'),
      e('div', { style: { fontSize: 13, fontWeight: 500, color: '#7c3aed', marginTop: 4 } }, 'Supervisor'),
      e('div', { style: {
        marginTop: 8, display: 'inline-flex', alignItems: 'center', gap: 5,
        background: '#f3f4f6', borderRadius: 6, padding: '3px 8px'
      }},
        e('svg', { width: 11, height: 11, viewBox: '0 0 24 24', fill: '#6b7280' },
          e('path', { d: STAR_PATH })
        ),
        e('span', { style: { fontSize: 10, color: C_TEXT_DIM, fontWeight: 500 } }, 'claude-sonnet-4.6')
      )
    )
  ));

  // ===== AGENT NODES =====
  agents.forEach(function(agent, ai) {
    var agStart = 110 + ai * 18;
    var agOp = f >= agStart ? eo3(p(agStart, agStart + 30)) : 0;
    var agScale = f >= agStart ? lerp(0.92, 1, eo3(p(agStart, agStart + 30))) : 0.92;
    var agFloat = agOp >= 1 ? float(ai * 5 + 10, 1.5, 0.025 + ai * 0.005) : 0;

    var ax = agentsStartX + ai * (agentW + agentGap);

    children.push(e('div', { key: 'agent-' + ai, style: {
      position: 'absolute',
      left: ax, top: agentY + agFloat,
      width: agentW, height: agentH,
      background: '#ffffff',
      border: '1px solid ' + C_CARD_BORDER,
      borderRadius: 12,
      boxShadow: '0 2px 12px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)',
      padding: '16px 18px',
      opacity: agOp * globalOp,
      transform: 'scale(' + agScale + ')',
      zIndex: 8
    }},
      // Top row: icon + name + role
      e('div', { style: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 } },
        e('div', { style: {
          width: 42, height: 42, borderRadius: 10,
          background: agent.bgIcon,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0
        }},
          e('svg', { width: 24, height: 24, viewBox: '0 0 24 24', fill: agent.iconColor },
            e('path', { d: agent.icon })
          )
        ),
        e('div', { style: { flex: 1, minWidth: 0 } },
          e('div', { style: { fontSize: 15, fontWeight: 700, color: C_TEXT, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, agent.name),
          e('div', { style: { fontSize: 12, fontWeight: 500, color: C_TEXT_DIM, marginTop: 2 } }, agent.role)
        )
      ),
      // Bottom row: model badge + count
      e('div', { style: {
        display: 'flex', alignItems: 'center', gap: 6,
        background: '#f9fafb', borderRadius: 6, padding: '5px 8px'
      }},
        e('svg', { width: 11, height: 11, viewBox: '0 0 24 24', fill: '#6b7280' },
          e('path', { d: STAR_PATH })
        ),
        e('span', { style: { fontSize: 10, color: C_TEXT_DIM, fontWeight: 500, flex: 1 } }, 'claude-sonnet-4.6'),
        e('div', { style: { display: 'flex', alignItems: 'center', gap: 3 } },
          e('svg', { width: 10, height: 10, viewBox: '0 0 24 24', fill: '#9ca3af' },
            e('path', { d: 'M21 6.5L19.5 5L12 12.5L4.5 5L3 6.5L12 15.5L21 6.5Z' })
          ),
          e('span', { style: { fontSize: 10, color: C_TEXT_MUTED, fontWeight: 500 } }, '1')
        )
      )
    ));
  });

  // ===== SUCCESS TOAST =====
  var toastStart = 175;
  var toastOp = 0;
  if (f >= toastStart) {
    var toastIn = f < toastStart + 25 ? eo3(p(toastStart, toastStart + 25)) : 1;
    var toastOut = f >= 270 ? 1 - eo3(p(270, 295)) : 1;
    toastOp = toastIn * toastOut;
  }
  if (toastOp > 0) {
    var toastW = 320;
    var toastY = H - 90;
    var toastSlideY = lerp(20, 0, toastOp);

    children.push(e('div', { key: 'toast', style: {
      position: 'absolute',
      left: canvasLeft + canvasW / 2 - toastW / 2,
      top: toastY + (1 - toastOp) * toastSlideY,
      width: toastW, height: 50,
      background: '#ffffff',
      border: '1px solid ' + C_CARD_BORDER,
      borderRadius: 10,
      boxShadow: '0 8px 24px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)',
      padding: '0 18px',
      display: 'flex', alignItems: 'center', gap: 12,
      opacity: toastOp * globalOp, zIndex: 25
    }},
      e('div', { style: {
        width: 24, height: 24, borderRadius: '50%',
        background: '#dcfce7',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0
      }},
        e('svg', { width: 14, height: 14, viewBox: '0 0 24 24', fill: '#16a34a' },
          e('path', { d: CHECK_PATH })
        )
      ),
      e('span', { style: { fontSize: 13, fontWeight: 500, color: C_TEXT } }, 'Agent team created successfully.')
    ));
  }

  // ===== ZOOM CONTROLS (bottom-right) =====
  var zoomBtns = ['+', '-', '\u26F6', '\u{1F512}'];
  zoomBtns.forEach(function(label, zi) {
    children.push(e('div', { key: 'zoom-' + zi, style: {
      position: 'absolute',
      right: 24, top: H - 200 + zi * 36,
      width: 30, height: 30, borderRadius: 6,
      background: '#ffffff',
      border: '1px solid ' + C_CARD_BORDER,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: C_TEXT_DIM, fontSize: 14,
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      opacity: globalOp, zIndex: 20
    }}, label));
  });

  // ===== VOICEOVER =====
  var vo1Op = f >= 30 ? (f < 60 ? eo3(p(30, 60)) : (f < 230 ? 1 : (f < 260 ? 1 - eo3(p(230, 260)) : 0))) : 0;
  if (vo1Op > 0) {
    children.push(e('div', { key: 'vo1', style: {
      position: 'absolute', bottom: 30, left: canvasLeft, width: canvasW, textAlign: 'center',
      opacity: vo1Op * globalOp, zIndex: 22, pointerEvents: 'none'
    }},
      e('div', { style: {
        display: 'inline-block', padding: '10px 24px', borderRadius: 12,
        background: 'rgba(255,255,255,0.95)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
        border: '1px solid ' + C_CARD_BORDER
      }},
        e('span', { style: { color: C_TEXT, fontSize: 15, fontWeight: 500 } },
          'Your AI team is ready \u2014 a Supervisor coordinating specialized worker agents'
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
