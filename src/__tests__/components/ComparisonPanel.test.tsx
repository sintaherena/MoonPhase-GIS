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
    phaseLabel: 'Bulan Purnama',
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

  it('shows "Aktifkan" button when not in multi-pin mode', () => {
    render(<ComparisonPanel {...defaultProps} />);
    
    const button = screen.getByRole('button', { name: /aktifkan/i });
    expect(button).toBeInTheDocument();
  });

  it('shows description text when not in multi-pin mode', () => {
    render(<ComparisonPanel {...defaultProps} />);
    
    expect(screen.getByText('Mode Multi-Pin')).toBeInTheDocument();
    expect(screen.getByText(/Bandingkan data bulan dari beberapa lokasi/)).toBeInTheDocument();
  });

  it('calls onAddPin when Aktifkan button is clicked', async () => {
    const user = userEvent.setup();
    const onAddPin = jest.fn();
    
    render(<ComparisonPanel {...defaultProps} onAddPin={onAddPin} />);
    
    const button = screen.getByRole('button', { name: /aktifkan/i });
    await user.click(button);
    
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
    
    expect(screen.getByText(/Perbandingan Pin/)).toBeInTheDocument();
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
    
    expect(screen.getByText(/Klik peta untuk menambahkan pin perbandingan/)).toBeInTheDocument();
  });

  it('shows pin count in header', () => {
    render(
      <ComparisonPanel
        {...defaultProps}
        isMultiPinMode={true}
        pins={[mockPin]}
      />
    );
    
    expect(screen.getByText(/Perbandingan Pin \(1\/5\)/)).toBeInTheDocument();
  });

  it('shows Tambah button when under max pins', () => {
    render(
      <ComparisonPanel
        {...defaultProps}
        isMultiPinMode={true}
        pins={[mockPin]}
      />
    );
    
    expect(screen.getByRole('button', { name: /tambah/i })).toBeInTheDocument();
  });

  it('hides Tambah button when at max pins', () => {
    render(
      <ComparisonPanel
        {...defaultProps}
        isMultiPinMode={true}
        pins={[mockPin]}
        maxPins={1}
      />
    );
    
    expect(screen.queryByRole('button', { name: /tambah/i })).not.toBeInTheDocument();
  });

  it('shows Hapus Semua button when pins exist', () => {
    render(
      <ComparisonPanel
        {...defaultProps}
        isMultiPinMode={true}
        pins={[mockPin]}
      />
    );
    
    expect(screen.getByRole('button', { name: /hapus semua/i })).toBeInTheDocument();
  });

  it('calls onClearAll when Hapus Semua is clicked', async () => {
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
    
    await user.click(screen.getByRole('button', { name: /hapus semua/i }));
    expect(onClearAll).toHaveBeenCalledTimes(1);
  });
});
