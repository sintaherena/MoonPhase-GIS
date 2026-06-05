'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useMap } from 'react-leaflet';
import type { GeoCoordinate } from '@/types';

interface SearchResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  type: string;
}

export interface SearchBarProps {
  onLocationSelect: (coordinate: GeoCoordinate) => void;
}

export function SearchBar({ onLocationSelect }: SearchBarProps) {
  const map = useMap();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchLocation = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 3) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'MoonPhaseGIS/1.0 (moonphase-gis-app)',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Gagal mencari lokasi');
      }

      const data: SearchResult[] = await response.json();
      setResults(data);
      setIsOpen(data.length > 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleInputChange = useCallback(
    (value: string) => {
      setQuery(value);
      setError(null);

      // Debounce search
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        searchLocation(value);
      }, 300);
    },
    [searchLocation]
  );

  const handleSelect = useCallback(
    (result: SearchResult) => {
      const lat = parseFloat(result.lat);
      const lng = parseFloat(result.lon);

      if (!isNaN(lat) && !isNaN(lng)) {
        const coordinate: GeoCoordinate = { lat, lng };
        onLocationSelect(coordinate);
        map.flyTo([lat, lng], 10, { duration: 1.5 });
        setQuery(result.display_name.split(',')[0]);
        setIsOpen(false);
      }
    },
    [onLocationSelect, map]
  );

  const handleClear = useCallback(() => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    setError(null);
    inputRef.current?.focus();
  }, []);

  // Extract short name from display_name
  const getShortName = (displayName: string): string => {
    const parts = displayName.split(',');
    return parts[0]?.trim() ?? displayName;
  };

  // Extract country/state from display_name
  const getRegion = (displayName: string): string => {
    const parts = displayName.split(',');
    return parts.slice(1, 3).join(',').trim() ?? '';
  };

  return (
    <div ref={containerRef} className="relative z-[1001]">
      <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-space-surface/95 px-3 py-2 shadow-lg backdrop-blur-md">
        {/* Search icon */}
        <svg
          className="h-4 w-4 flex-shrink-0 text-moonlight-muted"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder="Cari lokasi..."
          className="w-48 bg-transparent text-sm text-moonlight placeholder-moonlight-muted focus:outline-none sm:w-64"
          role="combobox"
          aria-label="Cari lokasi di peta"
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-controls={isOpen ? 'search-results' : undefined}
        />

        {/* Loading spinner */}
        {isLoading && (
          <svg
            className="h-4 w-4 animate-spin text-cyber-cyan"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}

        {/* Clear button */}
        {query && !isLoading && (
          <button
            onClick={handleClear}
            className="text-moonlight-muted transition-colors hover:text-moonlight"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="mt-1 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-400">
          {error}
        </div>
      )}

      {/* Results dropdown */}
      {isOpen && results.length > 0 && (
        <div
          id="search-results"
          role="listbox"
          aria-label="Hasil pencarian lokasi"
          className="absolute left-0 right-0 mt-2 overflow-hidden rounded-lg border border-white/10 bg-space-surface/95 shadow-xl backdrop-blur-md"
        >
          {results.map((result) => (
            <button
              key={result.place_id}
              onClick={() => handleSelect(result)}
              role="option"
              aria-selected={false}
              className="flex w-full flex-col gap-0.5 border-b border-white/5 px-3 py-2 text-left transition-colors last:border-b-0 hover:bg-white/5"
            >
              <span className="text-sm text-moonlight">{getShortName(result.display_name)}</span>
              <span className="text-xs text-moonlight-muted">{getRegion(result.display_name)}</span>
            </button>
          ))}
        </div>
      )}

      {/* Empty state */}
      {isOpen && results.length === 0 && !isLoading && query.length >= 3 && (
        <div className="mt-2 rounded-lg border border-white/10 bg-space-surface/95 px-3 py-4 text-center text-xs text-moonlight-muted backdrop-blur-md">
          Tidak ada hasil ditemukan
        </div>
      )}
    </div>
  );
}
