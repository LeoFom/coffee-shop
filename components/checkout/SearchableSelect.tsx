import { useEffect, useRef, useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';

export interface SearchableOption {
  ref?: string;
  cityRef?: string;
  label?: string;
  sublabel?: string;
}

interface SearchableSelectProps {
  placeholder: string;
  value: SearchableOption | null;
  onSelect: (option: SearchableOption | null) => void;
  fetchOptions: (query: string) => Promise<SearchableOption[]>;
  disabled?: boolean;
  minChars?: number;
}

export default function SearchableSelect({
  placeholder,
  value,
  onSelect,
  fetchOptions,
  disabled = false,
  minChars = 2,
}: SearchableSelectProps) {
  const [query, setQuery] = useState('');
  const [options, setOptions] = useState<SearchableOption[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debouncedQuery = useDebounce(query, 350);

  useEffect(() => {
    if (disabled) {
      setOptions([]);
      setLoading(false);
      return;
    }

    if (debouncedQuery.length < minChars) {
      setOptions([]);
      return;
    }

    let active = true;
    setLoading(true);

    fetchOptions(debouncedQuery)
      .then((result) => {
        if (active) setOptions(Array.isArray(result) ? result : []);
      })
      .catch(() => {
        if (active) setOptions([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [debouncedQuery, fetchOptions, minChars, disabled]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={wrapperRef}>
      <input
        type="text"
        disabled={disabled}
        placeholder={placeholder}
        value={value?.label ?? query}
        onChange={(e) => {
          onSelect(null);
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        className="w-full border border-brand-brown/15 rounded-xl px-4 py-3 text-sm text-brand-text bg-white outline-none focus:border-brand-brown/40 transition-colors disabled:bg-brand-bg disabled:text-brand-muted disabled:cursor-not-allowed"
      />

      {isOpen && (query.length >= minChars || value) && !disabled && (
        <div className="absolute z-20 mt-2 w-full bg-white border border-brand-brown/10 rounded-xl shadow-lg max-h-72 overflow-y-auto">
          {loading && (
            <div className="px-4 py-3 text-sm text-brand-muted">Пошук...</div>
          )}

          {!loading && options.length === 0 && query.length >= minChars && (
            <div className="px-4 py-3 text-sm text-brand-muted">Нічого не знайдено</div>
          )}

          {!loading &&
            options.map((option, index) => (
              <button
                type="button"
                key={`${option.ref ?? option.cityRef ?? option.label}-${index}`}
                onClick={() => {
                  onSelect(option);
                  setQuery('');
                  setIsOpen(false);
                }}
                className="w-full text-left px-4 py-3 hover:bg-brand-bg transition-colors border-b border-brand-brown/5 last:border-b-0"
              >
                <div className="text-sm font-medium text-brand-brown">{option.label}</div>
                {option.sublabel && (
                  <div className="text-xs text-brand-muted mt-0.5">{option.sublabel}</div>
                )}
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
