import React from 'react';
import { Clock, ChevronDown } from 'lucide-react';

export type TimeRange = '24h' | '3d' | '7d' | '30d' | 'ytd';

interface TimeFilterProps {
  selectedRange: TimeRange;
  onRangeChange: (range: TimeRange) => void;
}

const TimeFilter: React.FC<TimeFilterProps> = ({ selectedRange, onRangeChange }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const ranges: { value: TimeRange; label: string }[] = [
    { value: '24h', label: 'Last 24 Hours' },
    { value: '3d', label: 'Last 3 Days' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: 'ytd', label: 'Year to Date' },
  ];

  const selectedLabel = ranges.find(range => range.value === selectedRange)?.label;

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (value: TimeRange) => {
    onRangeChange(value);
    setIsOpen(false);
  };

  return (
    <div className="relative flex items-center space-x-2" ref={dropdownRef}>
      <Clock className="h-5 w-5 text-gray-400" />
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-48 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <span>{selectedLabel}</span>
        <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-48 top-full bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
          <div className="py-1">
            {ranges.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => handleSelect(value)}
                className={`block w-full text-left px-4 py-2 text-sm ${
                  selectedRange === value
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeFilter;