import { getPresetForQuality, getCRFForQuality } from '../ffmpeg-encoder';

describe('FFmpeg Encoder', () => {
  describe('getPresetForQuality', () => {
    it('should return ultrafast for draft quality', () => {
      expect(getPresetForQuality('draft')).toBe('ultrafast');
    });

    it('should return medium for standard quality', () => {
      expect(getPresetForQuality('standard')).toBe('medium');
    });

    it('should return slow for high quality', () => {
      expect(getPresetForQuality('high')).toBe('slow');
    });
  });

  describe('getCRFForQuality', () => {
    it('should return 28 for draft quality', () => {
      expect(getCRFForQuality('draft')).toBe(28);
    });

    it('should return 23 for standard quality', () => {
      expect(getCRFForQuality('standard')).toBe(23);
    });

    it('should return 18 for high quality', () => {
      expect(getCRFForQuality('high')).toBe(18);
    });

    it('should return lower CRF for higher quality (lower = better)', () => {
      const draftCRF = getCRFForQuality('draft');
      const standardCRF = getCRFForQuality('standard');
      const highCRF = getCRFForQuality('high');

      expect(draftCRF).toBeGreaterThan(standardCRF);
      expect(standardCRF).toBeGreaterThan(highCRF);
    });
  });
});
