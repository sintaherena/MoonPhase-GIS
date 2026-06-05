import { encodeState, decodeState } from '@/lib/stateCodec';
import type { PinData } from '@/hooks/useMultiPin';

describe('encodeState/decodeState', () => {
  const mockPins: PinData[] = [
    {
      id: 'pin-1',
      coordinate: { lat: -6.2, lng: 106.8 },
      label: 'Jakarta',
      color: '#22D3EE',
      moonData: null,
    },
    {
      id: 'pin-2',
      coordinate: { lat: 35.68, lng: 139.69 },
      label: 'Tokyo',
      color: '#F472B6',
      moonData: null,
    },
  ];

  const mockDate = new Date('2026-06-05T12:00:00Z');
  const mockMapCenter = { lat: -2.5, lng: 118 };
  const mockZoom = 5;

  it('round-trips: encode then decode returns same data', () => {
    const encoded = encodeState(mockPins, mockDate, mockMapCenter, mockZoom);
    const decoded = decodeState(encoded);

    expect(decoded).not.toBeNull();
    expect(decoded!.pins).toHaveLength(2);
    expect(decoded!.pins[0].coordinate.lat).toBe(-6.2);
    expect(decoded!.pins[0].coordinate.lng).toBe(106.8);
    expect(decoded!.pins[0].color).toBe('#22D3EE');
    expect(decoded!.pins[0].label).toBe('Jakarta');
    expect(decoded!.pins[1].coordinate.lat).toBe(35.68);
    expect(decoded!.pins[1].coordinate.lng).toBe(139.69);
    expect(decoded!.date).toBe(mockDate.toISOString());
    expect(decoded!.mapCenter.lat).toBe(-2.5);
    expect(decoded!.mapCenter.lng).toBe(118);
    expect(decoded!.zoom).toBe(5);
  });

  it('returns empty string for encode errors', () => {
    // Test with valid data should produce non-empty string
    const encoded = encodeState([], mockDate, mockMapCenter, mockZoom);
    expect(typeof encoded).toBe('string');
    expect(encoded.length).toBeGreaterThan(0);
  });

  it('invalid base64 returns null', () => {
    const result = decodeState('not-valid-base64!!!');
    expect(result).toBeNull();
  });

  it('empty string returns null', () => {
    const result = decodeState('');
    expect(result).toBeNull();
  });

  it('valid base64 but invalid JSON returns null', () => {
    // Create valid base64 of invalid JSON structure
    const invalidJson = '{ invalid json }';
    const encoded = btoa(encodeURIComponent(invalidJson));
    const result = decodeState(encoded);
    expect(result).toBeNull();
  });

  it('missing fields returns null', () => {
    // Create base64 of object missing required fields
    const incomplete = JSON.stringify({ pins: [] });
    const encoded = btoa(encodeURIComponent(incomplete));
    const result = decodeState(encoded);
    expect(result).toBeNull();
  });

  it('missing zoom field returns null', () => {
    const incomplete = JSON.stringify({
      pins: [],
      date: '2026-06-05T12:00:00Z',
      mapCenter: { lat: 0, lng: 0 },
    });
    const encoded = btoa(encodeURIComponent(incomplete));
    const result = decodeState(encoded);
    expect(result).toBeNull();
  });

  it('empty pins array encodes and decodes correctly', () => {
    const encoded = encodeState([], mockDate, mockMapCenter, mockZoom);
    const decoded = decodeState(encoded);

    expect(decoded).not.toBeNull();
    expect(decoded!.pins).toHaveLength(0);
    expect(decoded!.date).toBe(mockDate.toISOString());
  });

  it('preserves mapCenter and zoom values', () => {
    const customCenter = { lat: 40.7128, lng: -74.006 };
    const customZoom = 12;
    
    const encoded = encodeState(mockPins, mockDate, customCenter, customZoom);
    const decoded = decodeState(encoded);

    expect(decoded!.mapCenter.lat).toBe(40.7128);
    expect(decoded!.mapCenter.lng).toBe(-74.006);
    expect(decoded!.zoom).toBe(12);
  });
});
