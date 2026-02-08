import { describe, it, expect } from 'vitest';
import { resolveStyle, mergeStyles, getStyleClassName } from '../resolver';

describe('resolveStyle', () => {
  it('should return empty object for empty style', () => {
    expect(resolveStyle({})).toEqual({});
  });

  // Spacing
  it('should resolve padding as number', () => {
    const result = resolveStyle({ padding: 10 });
    expect(result.padding).toBe('10px');
  });

  it('should resolve padding as string', () => {
    const result = resolveStyle({ padding: '1rem' });
    expect(result.padding).toBe('1rem');
  });

  it('should resolve paddingX to left and right', () => {
    const result = resolveStyle({ paddingX: 20 });
    expect(result.paddingLeft).toBe('20px');
    expect(result.paddingRight).toBe('20px');
  });

  it('should resolve paddingY to top and bottom', () => {
    const result = resolveStyle({ paddingY: 15 });
    expect(result.paddingTop).toBe('15px');
    expect(result.paddingBottom).toBe('15px');
  });

  it('should resolve individual padding directions', () => {
    const result = resolveStyle({
      paddingTop: 10,
      paddingRight: 20,
      paddingBottom: 30,
      paddingLeft: 40,
    });
    expect(result.paddingTop).toBe('10px');
    expect(result.paddingRight).toBe('20px');
    expect(result.paddingBottom).toBe('30px');
    expect(result.paddingLeft).toBe('40px');
  });

  it('should resolve margin', () => {
    const result = resolveStyle({ margin: 8 });
    expect(result.margin).toBe('8px');
  });

  it('should resolve marginX and marginY', () => {
    const result = resolveStyle({ marginX: 10, marginY: 20 });
    expect(result.marginLeft).toBe('10px');
    expect(result.marginRight).toBe('10px');
    expect(result.marginTop).toBe('20px');
    expect(result.marginBottom).toBe('20px');
  });

  // Borders
  it('should resolve borderRadius as number', () => {
    const result = resolveStyle({ borderRadius: 8 });
    expect(result.borderRadius).toBe('8px');
  });

  it('should resolve borderRadius presets', () => {
    expect(resolveStyle({ borderRadius: 'sm' }).borderRadius).toBe('0.125rem');
    expect(resolveStyle({ borderRadius: 'md' }).borderRadius).toBe('0.375rem');
    expect(resolveStyle({ borderRadius: 'lg' }).borderRadius).toBe('0.5rem');
    expect(resolveStyle({ borderRadius: 'xl' }).borderRadius).toBe('0.75rem');
    expect(resolveStyle({ borderRadius: '2xl' }).borderRadius).toBe('1rem');
    expect(resolveStyle({ borderRadius: '3xl' }).borderRadius).toBe('1.5rem');
    expect(resolveStyle({ borderRadius: 'full' }).borderRadius).toBe('9999px');
    expect(resolveStyle({ borderRadius: 'none' }).borderRadius).toBe('0');
  });

  it('should resolve individual border radii', () => {
    const result = resolveStyle({
      borderTopLeftRadius: 4,
      borderTopRightRadius: 'lg',
      borderBottomRightRadius: 12,
      borderBottomLeftRadius: 'full',
    });
    expect(result.borderTopLeftRadius).toBe('4px');
    expect(result.borderTopRightRadius).toBe('0.5rem');
    expect(result.borderBottomRightRadius).toBe('12px');
    expect(result.borderBottomLeftRadius).toBe('9999px');
  });

  it('should resolve border properties', () => {
    const result = resolveStyle({
      borderWidth: 2,
      borderColor: '#ff0000',
      borderStyle: 'solid',
    });
    expect(result.borderWidth).toBe(2);
    expect(result.borderColor).toBe('#ff0000');
    expect(result.borderStyle).toBe('solid');
  });

  // Shadows
  it('should resolve shadow presets', () => {
    const smResult = resolveStyle({ boxShadow: 'sm' });
    expect(smResult.boxShadow).toBe('0 1px 2px 0 rgb(0 0 0 / 0.05)');

    const xlResult = resolveStyle({ boxShadow: 'xl' });
    expect(xlResult.boxShadow).toContain('0 20px 25px');
  });

  it('should pass through custom shadow strings', () => {
    const result = resolveStyle({ boxShadow: '5px 5px 10px red' });
    expect(result.boxShadow).toBe('5px 5px 10px red');
  });

  // Backgrounds
  it('should resolve backgroundColor', () => {
    const result = resolveStyle({ backgroundColor: '#123456' });
    expect(result.backgroundColor).toBe('#123456');
  });

  it('should resolve linear backgroundGradient', () => {
    const result = resolveStyle({
      backgroundGradient: {
        type: 'linear',
        from: '#ff0000',
        to: '#0000ff',
        direction: 90,
      },
    });
    expect(result.backgroundImage).toBe('linear-gradient(90deg, #ff0000, #0000ff)');
  });

  it('should resolve radial backgroundGradient', () => {
    const result = resolveStyle({
      backgroundGradient: {
        type: 'radial',
        from: '#ff0000',
        to: '#0000ff',
      },
    });
    expect(result.backgroundImage).toBe('radial-gradient(circle, #ff0000, #0000ff)');
  });

  it('should resolve conic backgroundGradient', () => {
    const result = resolveStyle({
      backgroundGradient: {
        type: 'conic',
        from: '#ff0000',
        to: '#0000ff',
        direction: 45,
      },
    });
    expect(result.backgroundImage).toBe('conic-gradient(from 45deg, #ff0000, #0000ff)');
  });

  it('should resolve gradient with via color', () => {
    const result = resolveStyle({
      backgroundGradient: {
        type: 'linear',
        from: '#ff0000',
        via: '#00ff00',
        to: '#0000ff',
        direction: 180,
      },
    });
    expect(result.backgroundImage).toBe('linear-gradient(180deg, #ff0000, #00ff00, #0000ff)');
  });

  it('should resolve backgroundImage as URL', () => {
    const result = resolveStyle({ backgroundImage: 'https://example.com/bg.png' });
    expect(result.backgroundImage).toBe('url(https://example.com/bg.png)');
  });

  it('should resolve backgroundSize and backgroundPosition', () => {
    const result = resolveStyle({
      backgroundSize: 'contain',
      backgroundPosition: 'top left',
    });
    expect(result.backgroundSize).toBe('contain');
    expect(result.backgroundPosition).toBe('top left');
  });

  it('should resolve backdropBlur as number', () => {
    const result = resolveStyle({ backdropBlur: 10 });
    expect(result.backdropFilter).toBe('blur(10px)');
  });

  it('should resolve backdropBlur preset', () => {
    const result = resolveStyle({ backdropBlur: 'md' as any });
    expect(result.backdropFilter).toBe('blur(12px)');
  });

  // Typography
  it('should resolve typography properties', () => {
    const result = resolveStyle({
      fontFamily: 'Roboto, sans-serif',
      fontSize: 24,
      fontWeight: 'bold',
      lineHeight: 1.5,
      letterSpacing: 2,
      textAlign: 'center',
      textColor: '#333',
      textShadow: '1px 1px 2px black',
      textDecoration: 'underline',
      textTransform: 'uppercase',
    });
    expect(result.fontFamily).toBe('Roboto, sans-serif');
    expect(result.fontSize).toBe('24px');
    expect(result.fontWeight).toBe(700);
    expect(result.lineHeight).toBe(1.5);
    expect(result.letterSpacing).toBe('2px');
    expect(result.textAlign).toBe('center');
    expect(result.color).toBe('#333');
    expect(result.textShadow).toBe('1px 1px 2px black');
    expect(result.textDecoration).toBe('underline');
    expect(result.textTransform).toBe('uppercase');
  });

  it('should resolve fontWeight presets', () => {
    expect(resolveStyle({ fontWeight: 'thin' }).fontWeight).toBe(100);
    expect(resolveStyle({ fontWeight: 'light' }).fontWeight).toBe(300);
    expect(resolveStyle({ fontWeight: 'normal' }).fontWeight).toBe(400);
    expect(resolveStyle({ fontWeight: 'medium' }).fontWeight).toBe(500);
    expect(resolveStyle({ fontWeight: 'semibold' }).fontWeight).toBe(600);
    expect(resolveStyle({ fontWeight: 'bold' }).fontWeight).toBe(700);
    expect(resolveStyle({ fontWeight: 'extrabold' }).fontWeight).toBe(800);
    expect(resolveStyle({ fontWeight: 'black' }).fontWeight).toBe(900);
  });

  it('should resolve fontWeight as number pass-through', () => {
    expect(resolveStyle({ fontWeight: 550 }).fontWeight).toBe(550);
  });

  it('should resolve wordBreak and whiteSpace', () => {
    const result = resolveStyle({ wordBreak: 'break-all', whiteSpace: 'nowrap' });
    expect(result.wordBreak).toBe('break-all');
    expect(result.whiteSpace).toBe('nowrap');
  });

  // Layout
  it('should resolve flex layout properties', () => {
    const result = resolveStyle({
      display: 'flex',
      flexDirection: 'column',
      flexWrap: 'wrap',
      justifyContent: 'between',
      alignItems: 'center',
      gap: 16,
    });
    expect(result.display).toBe('flex');
    expect(result.flexDirection).toBe('column');
    expect(result.flexWrap).toBe('wrap');
    expect(result.justifyContent).toBe('space-between');
    expect(result.alignItems).toBe('center');
    expect(result.gap).toBe('16px');
  });

  it('should map justifyContent values', () => {
    expect(resolveStyle({ justifyContent: 'start' }).justifyContent).toBe('flex-start');
    expect(resolveStyle({ justifyContent: 'end' }).justifyContent).toBe('flex-end');
    expect(resolveStyle({ justifyContent: 'center' }).justifyContent).toBe('center');
    expect(resolveStyle({ justifyContent: 'around' }).justifyContent).toBe('space-around');
    expect(resolveStyle({ justifyContent: 'evenly' }).justifyContent).toBe('space-evenly');
  });

  it('should map alignItems values', () => {
    expect(resolveStyle({ alignItems: 'start' }).alignItems).toBe('flex-start');
    expect(resolveStyle({ alignItems: 'end' }).alignItems).toBe('flex-end');
    expect(resolveStyle({ alignItems: 'center' }).alignItems).toBe('center');
    expect(resolveStyle({ alignItems: 'stretch' }).alignItems).toBe('stretch');
    expect(resolveStyle({ alignItems: 'baseline' }).alignItems).toBe('baseline');
  });

  it('should resolve row and column gap', () => {
    const result = resolveStyle({ rowGap: 10, columnGap: 20 });
    expect(result.rowGap).toBe('10px');
    expect(result.columnGap).toBe('20px');
  });

  it('should resolve alignContent', () => {
    const result = resolveStyle({ alignContent: 'center' });
    expect(result.alignContent).toBe('center');
  });

  // Filters
  it('should resolve blur filter as number', () => {
    const result = resolveStyle({ blur: 8 });
    expect(result.filter).toBe('blur(8px)');
  });

  it('should resolve blur filter preset', () => {
    expect(resolveStyle({ blur: 'sm' as any }).filter).toBe('blur(4px)');
    expect(resolveStyle({ blur: 'md' as any }).filter).toBe('blur(12px)');
    expect(resolveStyle({ blur: 'lg' as any }).filter).toBe('blur(24px)');
  });

  it('should resolve brightness filter', () => {
    const result = resolveStyle({ brightness: 150 });
    expect(result.filter).toBe('brightness(1.5)');
  });

  it('should resolve contrast filter', () => {
    const result = resolveStyle({ contrast: 200 });
    expect(result.filter).toBe('contrast(2)');
  });

  it('should resolve grayscale filter', () => {
    const result = resolveStyle({ grayscale: 50 });
    expect(result.filter).toBe('grayscale(50%)');
  });

  it('should resolve saturate filter', () => {
    const result = resolveStyle({ saturate: 150 });
    expect(result.filter).toBe('saturate(1.5)');
  });

  it('should resolve sepia filter', () => {
    const result = resolveStyle({ sepia: 100 });
    expect(result.filter).toBe('sepia(100%)');
  });

  it('should resolve hueRotate filter', () => {
    const result = resolveStyle({ hueRotate: 90 });
    expect(result.filter).toBe('hue-rotate(90deg)');
  });

  it('should resolve invert filter', () => {
    const result = resolveStyle({ invert: 100 });
    expect(result.filter).toBe('invert(100%)');
  });

  it('should combine multiple filters', () => {
    const result = resolveStyle({
      blur: 4,
      brightness: 120,
      contrast: 110,
    });
    expect(result.filter).toBe('blur(4px) brightness(1.2) contrast(1.1)');
  });

  // Overflow
  it('should resolve overflow properties', () => {
    const result = resolveStyle({
      overflow: 'hidden',
      overflowX: 'scroll',
      overflowY: 'auto',
    });
    expect(result.overflow).toBe('hidden');
    expect(result.overflowX).toBe('scroll');
    expect(result.overflowY).toBe('auto');
  });

  // CSS pass-through
  it('should pass through raw CSS properties', () => {
    const result = resolveStyle({
      css: {
        zIndex: 10,
        cursor: 'pointer',
      },
    });
    expect(result.zIndex).toBe(10);
    expect(result.cursor).toBe('pointer');
  });
});

describe('mergeStyles', () => {
  it('should return empty className and style for no args', () => {
    const result = mergeStyles();
    expect(result.className).toBe('');
    expect(result.style).toEqual({});
  });

  it('should pass through className', () => {
    const result = mergeStyles('my-class');
    expect(result.className).toBe('my-class');
  });

  it('should resolve style when provided', () => {
    const result = mergeStyles('cls', { padding: 10 });
    expect(result.className).toBe('cls');
    expect(result.style).toEqual({ padding: '10px' });
  });
});

describe('getStyleClassName', () => {
  it('should pass through className unchanged', () => {
    expect(getStyleClassName('my-class')).toBe('my-class');
    expect(getStyleClassName('foo bar baz')).toBe('foo bar baz');
  });
});
