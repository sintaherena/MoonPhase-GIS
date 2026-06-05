import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComparisonPanel } from '@/components/Sidebar/ComparisonPanel';
import type { PinData } from '@/hooks/useMultiPin';

const mockPin: PinData = {
  id: 'pin-1',
  coordinate: { lat: -6.2, lng: 106.8 },
  label: 'Jakarta',
  color: '#22D3EE',
  moonData: {
    phase: 'full_moon',
    phaseLabel: 'Full Moon',
    illumination: 0.98,
    distance: 384400,
    azimuth: 180,
    elevation: 45,
    moonrise: new Date('2026-06-05T18:00:00Z'),
    moonset: new Date('2026-06-06T06:00:00Z'),
    ageDays: 14.5,
    observedAt: new Date('2026-06-05T12:00:00Z'),
    coordinate: { lat: -6.2, lng: 106.8 },
  },
};

const defaultProps = {
  pins: [],
  selectedPinId: null,
  onSelectPin: jest.fn(),
  onRemovePin: jest.fn(),
  onAddPin: jest.fn(),
  onClearAll: jest.fn(),
  isMultiPinMode: false,
  maxPins: 5,
};

describe('ComparisonPanel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows "Enable" button when not in multi-pin mode', () => {
    render(<ComparisonPanel {...defaultProps} />);
    expect(screen.getByRole('button', { name: /^enable$/i })).toBeInTheDocument();
  });

  it('shows description text when not in multi-pin mode', () => {
    render(<ComparisonPanel {...defaultProps} />);
    expect(screen.getByText('Multi-Pin Mode')).toBeInTheDocument();
    expect(screen.getByText(/Compare lunar data across multiple locations/)).toBeInTheDocument();
  });

  it('calls onAddPin when Enable button is clicked', async () => {
    const user = userEvent.setup();
    const onAddPin = jest.fn();

    render(<ComparisonPanel {...defaultProps} onAddPin={onAddPin} />);
    await user.click(screen.getByRole('button', { name: /^enable$/i }));

    expect(onAddPin).toHaveBeenCalledTimes(1);
  });

  it('shows pin list when in multi-pin mode with pins', () => {
    render(
      <ComparisonPanel
        {...defaultProps}
        isMultiPinMode={true}
        pins={[mockPin]}
      />
    );

    expect(screen.getByText(/Pin Comparison/)).toBeInTheDocument();
    expect(screen.getByText('Jakarta')).toBeInTheDocument();
  });

  it('shows empty state when no pins in multi-pin mode', () => {
    render(
      <ComparisonPanel
        {...defaultProps}
        isMultiPinMode={true}
        pins={[]}
      />
    );

    expect(screen.getByText(/Click the map to add comparison pins/)).toBeInTheDocument();
  });

  it('shows pin count in header', () => {
    render(
      <ComparisonPanel
        {...defaultProps}
        isMultiPinMode={true}
        pins={[mockPin]}
      />
    );

    expect(screen.getByText(/Pin Comparison \(1\/5\)/)).toBeInTheDocument();
  });

  it('shows Add button when under max pins', () => {
    render(
      <ComparisonPanel
        {...defaultProps}
        isMultiPinMode={true}
        pins={[mockPin]}
      />
    );

    expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
  });

  it('hides Add button when at max pins', () => {
    render(
      <ComparisonPanel
        {...defaultProps}
        isMultiPinMode={true}
        pins={[mockPin]}
        maxPins={1}
      />
    );

    expect(screen.queryByRole('button', { name: /add/i })).not.toBeInTheDocument();
  });

  it('shows Clear All button when pins exist', () => {
    render(
      <ComparisonPanel
        {...defaultProps}
        isMultiPinMode={true}
        pins={[mockPin]}
      />
    );

    expect(screen.getByRole('button', { name: /clear all/i })).toBeInTheDocument();
  });

  it('calls onClearAll when Clear All is clicked', async () => {
    const user = userEvent.setup();
    const onClearAll = jest.fn();

    render(
      <ComparisonPanel
        {...defaultProps}
        isMultiPinMode={true}
        pins={[mockPin]}
        onClearAll={onClearAll}
      />
    );

    await user.click(screen.getByRole('button', { name: /clear all/i }));
    expect(onClearAll).toHaveBeenCalledTimes(1);
  });
});
