import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { OnboardingTour } from '@/components/UI/OnboardingTour';

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

    expect(screen.queryByText('Click the Map')).not.toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(1100);
    });

    expect(screen.getByText('Click the Map')).toBeInTheDocument();
    expect(screen.getByText(/Click anywhere on the map/)).toBeInTheDocument();
  });

  it('"Next" advances to next step', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<OnboardingTour />);

    act(() => {
      jest.advanceTimersByTime(1100);
    });

    const nextButton = screen.getByRole('button', { name: /next/i });
    await user.click(nextButton);

    expect(screen.getByText('Data Panel')).toBeInTheDocument();
    expect(screen.getByText(/Use the sidebar panel to view detailed/)).toBeInTheDocument();
  });

  it('"Skip" dismisses tour', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<OnboardingTour />);

    act(() => {
      jest.advanceTimersByTime(1100);
    });

    const skipButton = screen.getByRole('button', { name: /skip/i });
    await user.click(skipButton);

    expect(screen.queryByText('Click the Map')).not.toBeInTheDocument();
  });

  it('stores completion in localStorage', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<OnboardingTour />);

    act(() => {
      jest.advanceTimersByTime(1100);
    });

    const skipButton = screen.getByRole('button', { name: /skip/i });
    await user.click(skipButton);

    expect(localStorageMock.getItem('moonphase-gis-onboarding-seen')).toBe('true');
  });

  it('does not show tour if already completed', () => {
    localStorageMock.setItem('moonphase-gis-onboarding-seen', 'true');

    render(<OnboardingTour />);

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(screen.queryByText('Click the Map')).not.toBeInTheDocument();
  });

  it('completes after clicking through all steps', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<OnboardingTour />);

    act(() => {
      jest.advanceTimersByTime(1100);
    });

    await user.click(screen.getByRole('button', { name: /next/i }));
    expect(screen.getByText('Data Panel')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /next/i }));
    expect(screen.getByText('Search Locations')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /got it!/i }));

    expect(screen.queryByText('Search Locations')).not.toBeInTheDocument();
    expect(localStorageMock.getItem('moonphase-gis-onboarding-seen')).toBe('true');
  });

  it('shows step indicators', async () => {
    render(<OnboardingTour />);

    act(() => {
      jest.advanceTimersByTime(1100);
    });

    const stepIndicators = document.querySelectorAll('.rounded-full');
    expect(stepIndicators.length).toBeGreaterThanOrEqual(3);
  });
});
