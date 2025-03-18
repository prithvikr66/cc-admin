import React from 'react';
import { ChevronDown } from 'lucide-react';

interface FilterDropdownProps {
  label: string;
  options: { value: string; label: string }[];
  value: string | null;
  onChange: (value: string | null) => void;
  icon?: React.ReactNode;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  label,
  options,
  value,
  onChange,
  icon,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedLabel = value ? options.find(opt => opt.value === value)?.label : 'All';

  return (
    <div className="relative flex items-center space-x-2" ref={dropdownRef}>
      {icon && <div className="text-gray-400">{icon}</div>}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-40 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <span className="flex items-center">
          <span className="truncate">{selectedLabel}</span>
        </span>
        <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-40 top-full bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
          <div className="py-1">
            <button
              onClick={() => {
                onChange(null);
                setIsOpen(false);
              }}
              className={`block w-full text-left px-4 py-2 text-sm ${
                value === null
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              All
            </button>
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 text-sm ${
                  value === option.value
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterDropdown