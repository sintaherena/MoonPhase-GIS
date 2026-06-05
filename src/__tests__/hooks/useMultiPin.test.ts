import { renderHook, act } from '@testing-library/react';
import { useMultiPin, PIN_COLORS, MAX_PINS } from '@/hooks/useMultiPin';

describe('useMultiPin', () => {
  const jakartaCoordinate = { lat: -6.2, lng: 106.8 };
  const tokyoCoordinate = { lat: 35.68, lng: 139.69 };
  const testDate = new Date('2026-06-05T12:00:00Z');

  it('initializes with empty pins array', () => {
    const { result } = renderHook(() => useMultiPin());
    expect(result.current.pins).toHaveLength(0);
    expect(result.current.selectedPinId).toBeNull();
    expect(result.current.isMultiPinMode).toBe(false);
  });

  it('addPin increases count', () => {
    const { result } = renderHook(() => useMultiPin());

    act(() => {
      const success = result.current.addPin(jakartaCoordinate, testDate);
      expect(success).toBe(true);
    });

    expect(result.current.pins).toHaveLength(1);
    expect(result.current.pins[0].coordinate.lat).toBe(-6.2);
    expect(result.current.pins[0].coordinate.lng).toBe(106.8);
  });

  it('addPin respects MAX_PINS limit', () => {
    const { result } = renderHook(() => useMultiPin());

    // Add MAX_PINS pins
    for (let i = 0; i < MAX_PINS; i++) {
      act(() => {
        const success = result.current.addPin(
          { lat: i * 10, lng: i * 10 },
          testDate
        );
        expect(success).toBe(true);
      });
    }

    expect(result.current.pins).toHaveLength(MAX_PINS);

    // Try to add one more - should fail
    act(() => {
      const success = result.current.addPin(
        { lat: 999, lng: 999 },
        testDate
      );
      expect(success).toBe(false);
    });

    expect(result.current.pins).toHaveLength(MAX_PINS);
  });

  it('removePin decreases count', () => {
    const { result } = renderHook(() => useMultiPin());

    act(() => {
      result.current.addPin(jakartaCoordinate, testDate);
    });
    expect(result.current.pins).toHaveLength(1);

    const pinId = result.current.pins[0].id;

    act(() => {
      result.current.removePin(pinId);
    });

    expect(result.current.pins).toHaveLength(0);
  });

  it('removePin deselects if removed pin was selected', () => {
    const { result } = renderHook(() => useMultiPin());

    act(() => {
      result.current.addPin(jakartaCoordinate, testDate);
    });

    const pinId = result.current.pins[0].id;

    act(() => {
      result.current.selectPin(pinId);
    });

    expect(result.current.selectedPinId).toBe(pinId);

    act(() => {
      result.current.removePin(pinId);
    });

    expect(result.current.selectedPinId).toBeNull();
  });

  it('selectPin changes selectedPinId', () => {
    const { result } = renderHook(() => useMultiPin());

    act(() => {
      result.current.addPin(jakartaCoordinate, testDate);
      result.current.addPin(tokyoCoordinate, testDate);
    });

    const firstPinId = result.current.pins[0].id;
    const secondPinId = result.current.pins[1].id;

    act(() => {
      result.current.selectPin(firstPinId);
    });
    expect(result.current.selectedPinId).toBe(firstPinId);

    act(() => {
      result.current.selectPin(secondPinId);
    });
    expect(result.current.selectedPinId).toBe(secondPinId);

    act(() => {
      result.current.selectPin(null);
    });
    expect(result.current.selectedPinId).toBeNull();
  });

  it('clearAllPins empties array', () => {
    const { result } = renderHook(() => useMultiPin());

    act(() => {
      result.current.addPin(jakartaCoordinate, testDate);
      result.current.addPin(tokyoCoordinate, testDate);
    });

    expect(result.current.pins).toHaveLength(2);

    act(() => {
      result.current.clearAllPins();
    });

    expect(result.current.pins).toHaveLength(0);
    expect(result.current.selectedPinId).toBeNull();
  });

  it('toggleMultiPinMode toggles isMultiPinMode', () => {
    const { result } = renderHook(() => useMultiPin());

    expect(result.current.isMultiPinMode).toBe(false);

    act(() => {
      result.current.toggleMultiPinMode();
    });

    expect(result.current.isMultiPinMode).toBe(true);

    act(() => {
      result.current.toggleMultiPinMode();
    });

    expect(result.current.isMultiPinMode).toBe(false);
  });

  it('PIN_COLORS has 5 colors', () => {
    expect(PIN_COLORS).toHaveLength(5);
    PIN_COLORS.forEach((color) => {
      expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });
  });

  it('assigns colors from PIN_COLORS to pins', () => {
    const { result } = renderHook(() => useMultiPin());

    act(() => {
      result.current.addPin(jakartaCoordinate, testDate);
    });

    expect(PIN_COLORS).toContain(result.current.pins[0].color);
  });

  it('generates unique pin IDs', () => {
    const { result } = renderHook(() => useMultiPin());

    act(() => {
      result.current.addPin(jakartaCoordinate, testDate);
      result.current.addPin(tokyoCoordinate, testDate);
    });

    const ids = result.current.pins.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('pin has moonData when added', () => {
    const { result } = renderHook(() => useMultiPin());

    act(() => {
      result.current.addPin(jakartaCoordinate, testDate);
    });

    expect(result.current.pins[0].moonData).not.toBeNull();
    expect(result.current.pins[0].moonData?.phase).toBeDefined();
    expect(result.current.pins[0].moonData?.illumination).toBeGreaterThanOrEqual(0);
  });
});
