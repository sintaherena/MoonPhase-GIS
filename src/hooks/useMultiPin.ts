'use client';

import { useState, useCallback, useMemo } from 'react';
import type { GeoCoordinate, MoonDetailData } from '@/types';
import { getMoonData } from '@/lib/moonCalc';

export const PIN_COLORS = ['#22D3EE', '#F472B6', '#A78BFA', '#34D399', '#FB923C'] as const;
export const MAX_PINS = 5;

export interface PinData {
  id: string;
  coordinate: GeoCoordinate;
  label: string;
  color: string;
  moonData: MoonDetailData | null;
}

export interface UseMultiPinResult {
  pins: PinData[];
  selectedPinId: string | null;
  isMultiPinMode: boolean;
  addPin: (coordinate: GeoCoordinate, date: Date) => boolean;
  removePin: (id: string) => void;
  updatePin: (id: string, coordinate: GeoCoordinate, date: Date) => void;
  selectPin: (id: string | null) => void;
  clearAllPins: () => void;
  toggleMultiPinMode: () => void;
  getAvailableColor: () => string;
}

let pinIdCounter = 0;

function generatePinId(): string {
  pinIdCounter += 1;
  return `pin-${Date.now()}-${pinIdCounter}`;
}

export function useMultiPin(): UseMultiPinResult {
  const [pins, setPins] = useState<PinData[]>([]);
  const [selectedPinId, setSelectedPinId] = useState<string | null>(null);
  const [isMultiPinMode, setIsMultiPinMode] = useState(false);

  const getAvailableColor = useCallback(() => {
    const usedColors = pins.map((p) => p.color);
    const available = PIN_COLORS.find((c) => !usedColors.includes(c));
    return available ?? PIN_COLORS[pins.length % PIN_COLORS.length];
  }, [pins]);

  const addPin = useCallback(
    (coordinate: GeoCoordinate, date: Date): boolean => {
      if (pins.length >= MAX_PINS) return false;

      const color = getAvailableColor();
      const moonData = getMoonData(coordinate, date);
      const label = `Pin ${pins.length + 1}`;

      const newPin: PinData = {
        id: generatePinId(),
        coordinate,
        label,
        color,
        moonData,
      };

      setPins((prev) => [...prev, newPin]);
      return true;
    },
    [pins, getAvailableColor]
  );

  const removePin = useCallback((id: string) => {
    setPins((prev) => prev.filter((p) => p.id !== id));
    setSelectedPinId((prev) => (prev === id ? null : prev));
  }, []);

  const updatePin = useCallback(
    (id: string, coordinate: GeoCoordinate, date: Date) => {
      setPins((prev) =>
        prev.map((p) => {
          if (p.id !== id) return p;
          const moonData = getMoonData(coordinate, date);
          return { ...p, coordinate, moonData };
        })
      );
    },
    []
  );

  const selectPin = useCallback((id: string | null) => {
    setSelectedPinId(id);
  }, []);

  const clearAllPins = useCallback(() => {
    setPins([]);
    setSelectedPinId(null);
  }, []);

  const toggleMultiPinMode = useCallback(() => {
    setIsMultiPinMode((prev) => !prev);
  }, []);

  return useMemo(
    () => ({
      pins,
      selectedPinId,
      isMultiPinMode,
      addPin,
      removePin,
      updatePin,
      selectPin,
      clearAllPins,
      toggleMultiPinMode,
      getAvailableColor,
    }),
    [
      pins,
      selectedPinId,
      isMultiPinMode,
      addPin,
      removePin,
      updatePin,
      selectPin,
      clearAllPins,
      toggleMultiPinMode,
      getAvailableColor,
    ]
  );
}
