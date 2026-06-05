'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'moonphase-gis-onboarding-seen';
const TOTAL_STEPS = 3;

interface Step {
  title: string;
  description: string;
  targetId: string;
}

const steps: Step[] = [
  {
    title: 'Klik Peta',
    description: 'Klik di mana saja pada peta untuk menempatkan pin dan melihat data bulan',
    targetId: 'map-section',
  },
  {
    title: 'Panel Data',
    description: 'Gunakan panel samping untuk melihat informasi detail tentang fase bulan',
    targetId: 'sidebar-section',
  },
  {
    title: 'Cari Lokasi',
    description: 'Ketik nama kota atau negara untuk langsung terbang ke lokasi tersebut',
    targetId: 'search-section',
  },
];

export function OnboardingTour() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Check if user has seen the tour
    if (typeof window !== 'undefined') {
      const hasSeen = localStorage.getItem(STORAGE_KEY);
      if (!hasSeen) {
        // Delay showing the tour
        const timer = setTimeout(() => {
          setIsVisible(true);
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handleComplete = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setIsVisible(false);
    setCurrentStep(0);
  }, []);

  const handleNext = useCallback(() => {
    if (currentStep < TOTAL_STEPS - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleComplete();
    }
  }, [currentStep, handleComplete]);

  const handleSkip = useCallback(() => {
    handleComplete();
  }, [handleComplete]);

  if (!isVisible) return null;

  const step = steps[currentStep];

  return (
    <div className="fixed inset-0 z-[3000]">
      {/* Semi-transparent backdrop */}
      <div className="absolute inset-0 bg-black/70" />

      {/* Step content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="mx-4 w-full max-w-sm rounded-xl border border-white/10 bg-space-surface p-6 shadow-2xl backdrop-blur-md">
          {/* Step indicator */}
          <div className="mb-4 flex justify-center gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full transition-all ${
                  index === currentStep
                    ? 'w-6 bg-cyber-cyan'
                    : index < currentStep
                    ? 'bg-cyber-cyan/50'
                    : 'bg-white/20'
                }`}
              />
            ))}
          </div>

          {/* Content */}
          <div className="mb-6 text-center">
            <h3 className="mb-2 text-lg font-semibold text-moonlight">{step.title}</h3>
            <p className="text-sm text-moonlight-muted">{step.description}</p>
          </div>

          {/* Highlight area indicator */}
          <div className="mb-6 flex justify-center">
            <div className="rounded-lg border-2 border-dashed border-cyber-cyan/30 px-4 py-2">
              <span className="font-mono text-xs text-cyber-cyan">{step.targetId}</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={handleSkip}
              className="rounded-lg px-4 py-2 text-sm text-moonlight-muted transition-colors hover:text-moonlight"
            >
              Lewati
            </button>
            <button
              onClick={handleNext}
              className="rounded-lg bg-cyber-cyan px-6 py-2 text-sm font-medium text-space-deep transition-all hover:bg-cyber-cyan/90 hover:shadow-lg hover:shadow-cyber-cyan/20"
            >
              {currentStep < TOTAL_STEPS - 1 ? 'Selanjutnya' : 'Mengerti!'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
