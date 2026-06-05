import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { OnboardingTour } from '@/components/UI/OnboardingTour';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('OnboardingTour', () => {
  beforeEach(() => {
    localStorageMock.clear();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('shows first step content after delay', async () => {
    render(<OnboardingTour />);
    
    // Tour should not be visible immediately
    expect(screen.queryByText('Klik Peta')).not.toBeInTheDocument();
    
    // Advance timer to show the tour
    act(() => {
      jest.advanceTimersByTime(1100);
    });
    
    expect(screen.getByText('Klik Peta')).toBeInTheDocument();
    expect(screen.getByText(/Klik di mana saja pada peta/)).toBeInTheDocument();
  });

  it('"Selanjutnya" advances to next step', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<OnboardingTour />);
    
    act(() => {
      jest.advanceTimersByTime(1100);
    });
    
    const nextButton = screen.getByRole('button', { name: /selanjutnya/i });
    await user.click(nextButton);
    
    // Should now show step 2
    expect(screen.getByText('Panel Data')).toBeInTheDocument();
    expect(screen.getByText(/Gunakan panel samping untuk melihat informasi detail/)).toBeInTheDocument();
  });

  it('"Lewati" dismisses tour', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<OnboardingTour />);
    
    act(() => {
      jest.advanceTimersByTime(1100);
    });
    
    const skipButton = screen.getByRole('button', { name: /lewati/i });
    await user.click(skipButton);
    
    // Tour should be dismissed
    expect(screen.queryByText('Klik Peta')).not.toBeInTheDocument();
  });

  it('stores completion in localStorage', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<OnboardingTour />);
    
    act(() => {
      jest.advanceTimersByTime(1100);
    });
    
    const skipButton = screen.getByRole('button', { name: /lewati/i });
    await user.click(skipButton);
    
    expect(localStorageMock.getItem('moonphase-gis-onboarding-seen')).toBe('true');
  });

  it('does not show tour if already completed', () => {
    localStorageMock.setItem('moonphase-gis-onboarding-seen', 'true');
    
    render(<OnboardingTour />);
    
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    
    expect(screen.queryByText('Klik Peta')).not.toBeInTheDocument();
  });

  it('completes after clicking through all steps', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<OnboardingTour />);
    
    act(() => {
      jest.advanceTimersByTime(1100);
    });
    
    // Step 1 -> Step 2
    await user.click(screen.getByRole('button', { name: /selanjutnya/i }));
    expect(screen.getByText('Panel Data')).toBeInTheDocument();
    
    // Step 2 -> Step 3
    await user.click(screen.getByRole('button', { name: /selanjutnya/i }));
    expect(screen.getByText('Cari Lokasi')).toBeInTheDocument();
    
    // Step 3 -> Complete (button says "Mengerti!")
    await user.click(screen.getByRole('button', { name: /mengerti!/i }));
    
    // Tour should be dismissed
    expect(screen.queryByText('Cari Lokasi')).not.toBeInTheDocument();
    expect(localStorageMock.getItem('moonphase-gis-onboarding-seen')).toBe('true');
  });

  it('shows step indicators', async () => {
    render(<OnboardingTour />);
    
    act(() => {
      jest.advanceTimersByTime(1100);
    });
    
    // Should have 3 step indicator dots
    const stepIndicators = document.querySelectorAll('.rounded-full');
    expect(stepIndicators.length).toBeGreaterThanOrEqual(3);
  });
});
