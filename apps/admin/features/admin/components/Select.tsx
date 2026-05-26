'use client';

import { useEffect, useId, useMemo, useRef, useState, useCallback, type KeyboardEvent } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface SelectOption<T extends string> {
  value: T;
  label: string;
  disabled?: boolean;
}

type SelectSize = 'sm' | 'md';

interface SelectProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  options: SelectOption<T>[];
  className?: string;
  triggerClassName?: string;
  size?: SelectSize;
  title?: string;
  placeholder?: string;
  disabled?: boolean;
}

// Custom dark-theme dropdown. Replaces native <select> which can't be styled
// past the trigger — browsers render the option list using OS defaults
// (bright blue selection + white background) that don't match the dark UI.
//
// Keyboard model: matches native <select> as closely as a custom widget can.
//   - Space / Enter / Arrow{Up,Down} on the trigger → open the listbox and
//     highlight the currently-selected (or first enabled) option.
//   - Arrow{Up,Down} when open → move active highlight, skipping disabled.
//   - Home / End → jump to first / last enabled option.
//   - Enter / Space when open → commit the highlighted option.
//   - Escape → close without committing.
//   - Tab → close and let focus move naturally.
//   - Printable character → type-ahead jump to the next enabled option whose
//     label starts with the buffered string (buffer clears after 500 ms).
//
// Focus stays on the trigger button at all times; the listbox is non-focusable
// and we use aria-activedescendant to expose the highlighted option to AT.
export function Select<T extends string>({
  value,
  onChange,
  options,
  className,
  triggerClassName,
  size = 'md',
  title,
  placeholder = '—',
  disabled = false,
}: SelectProps<T>) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);
  const typeAheadRef = useRef<{ buffer: string; resetAt: number }>({ buffer: '', resetAt: 0 });
  const reactId = useId();
  const listboxId = `select-${reactId}`;

  const enabledIndices = useMemo(
    () => options.map((o, i) => (o.disabled ? -1 : i)).filter((i) => i >= 0),
    [options],
  );

  const findFirstEnabled = useCallback(() => enabledIndices[0] ?? -1, [enabledIndices]);
  const findLastEnabled = useCallback(
    () => enabledIndices[enabledIndices.length - 1] ?? -1,
    [enabledIndices],
  );
  const findNextEnabled = useCallback(
    (from: number, dir: 1 | -1) => {
      if (enabledIndices.length === 0) return -1;
      const pos = enabledIndices.indexOf(from);
      if (pos === -1) return dir === 1 ? findFirstEnabled() : findLastEnabled();
      const next = pos + dir;
      if (next < 0) return enabledIndices[enabledIndices.length - 1];
      if (next >= enabledIndices.length) return enabledIndices[0];
      return enabledIndices[next];
    },
    [enabledIndices, findFirstEnabled, findLastEnabled],
  );

  const openListbox = useCallback(() => {
    if (disabled) return;
    const selectedIdx = options.findIndex((o) => o.value === value && !o.disabled);
    setActiveIndex(selectedIdx >= 0 ? selectedIdx : findFirstEnabled());
    setOpen(true);
  }, [disabled, options, value, findFirstEnabled]);

  const closeListbox = useCallback(() => {
    setOpen(false);
    setActiveIndex(-1);
  }, []);

  const commit = useCallback(
    (index: number) => {
      const opt = options[index];
      if (!opt || opt.disabled) return;
      onChange(opt.value);
      closeListbox();
    },
    [options, onChange, closeListbox],
  );

  // Click-outside & global Escape — listbox is a child of containerRef so
  // clicks inside it are correctly excluded from the outside-click test.
  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        closeListbox();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, closeListbox]);

  // Scroll the active option into view when it changes.
  useEffect(() => {
    if (!open || activeIndex < 0 || !listboxRef.current) return;
    const el = listboxRef.current.querySelector<HTMLLIElement>(
      `[data-index="${activeIndex}"]`,
    );
    el?.scrollIntoView({ block: 'nearest' });
  }, [open, activeIndex]);

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;

    // When closed, only a few keys should open the listbox.
    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openListbox();
      }
      return;
    }

    // When open, handle navigation / commit / close.
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((i) => findNextEnabled(i, 1));
        return;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((i) => findNextEnabled(i, -1));
        return;
      case 'Home':
        e.preventDefault();
        setActiveIndex(findFirstEnabled());
        return;
      case 'End':
        e.preventDefault();
        setActiveIndex(findLastEnabled());
        return;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (activeIndex >= 0) commit(activeIndex);
        return;
      case 'Escape':
        e.preventDefault();
        closeListbox();
        return;
      case 'Tab':
        // Let focus move naturally; just close the listbox.
        closeListbox();
        return;
      default:
        // Type-ahead: any single printable character buffers and jumps to
        // the next enabled option whose label starts with the buffer. The
        // buffer resets after 500 ms of idle time, so quick "ch" jumps to
        // "Chemistry" but a slow c…h types-ahead twice.
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
          const now = Date.now();
          const buf = now - typeAheadRef.current.resetAt > 500 ? '' : typeAheadRef.current.buffer;
          const next = (buf + e.key).toLowerCase();
          typeAheadRef.current = { buffer: next, resetAt: now };
          const match = options.findIndex(
            (o, i) =>
              !o.disabled &&
              i !== activeIndex &&
              o.label.toLowerCase().startsWith(next),
          );
          // If no match past the current position, try from the top.
          const fallback =
            match === -1
              ? options.findIndex((o) => !o.disabled && o.label.toLowerCase().startsWith(next))
              : match;
          if (fallback >= 0) {
            e.preventDefault();
            setActiveIndex(fallback);
          }
        }
    }
  };

  const selected = options.find((o) => o.value === value);

  const triggerPadding = size === 'sm' ? 'px-2 py-1 text-xs' : 'px-3 py-2 text-sm';
  const chevronSize = size === 'sm' ? 'h-3 w-3' : 'h-4 w-4';
  const optionPadding = size === 'sm' ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-sm';
  const activeOptionId = activeIndex >= 0 ? `${listboxId}-opt-${activeIndex}` : undefined;

  return (
    <div ref={containerRef} className={`relative ${className ?? ''}`}>
      <button
        ref={triggerRef}
        type="button"
        title={title}
        disabled={disabled}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        aria-activedescendant={activeOptionId}
        onClick={() => (open ? closeListbox() : openListbox())}
        onKeyDown={handleKeyDown}
        className={`flex w-full items-center justify-between rounded-md ${triggerClassName ?? 'bg-gray-800/60 hover:bg-gray-700/60 focus:bg-gray-700/60'} ${triggerPadding} text-white focus:outline-none focus:ring-1 focus:ring-purple-500/50 disabled:cursor-not-allowed disabled:opacity-50`}
      >
        <span className="truncate">{selected?.label ?? placeholder}</span>
        <ChevronDown
          className={`${chevronSize} ml-1 shrink-0 text-white/50 transition-transform ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>
      {open && !disabled && (
        <ul
          id={listboxId}
          ref={listboxRef}
          role="listbox"
          className="absolute z-50 mt-1 max-h-60 min-w-full w-max overflow-auto rounded-md border border-white/10 bg-[#0B0F15] py-1 shadow-2xl"
        >
          {options.map((o, i) => {
            const isSelected = o.value === value;
            const isActive = i === activeIndex;
            return (
              <li
                key={o.value}
                id={`${listboxId}-opt-${i}`}
                data-index={i}
                role="option"
                aria-selected={isSelected}
                aria-disabled={o.disabled || undefined}
                onMouseEnter={() => !o.disabled && setActiveIndex(i)}
                onClick={() => commit(i)}
                className={`flex items-center justify-between gap-2 ${optionPadding} ${
                  o.disabled
                    ? 'cursor-not-allowed text-white/30'
                    : isSelected
                      ? 'cursor-pointer bg-orange-500/15 text-orange-200'
                      : isActive
                        ? 'cursor-pointer bg-white/10 text-white'
                        : 'cursor-pointer text-white/80 hover:bg-white/5'
                }`}
              >
                <span className="truncate">{o.label}</span>
                {isSelected && <Check className="h-3.5 w-3.5 shrink-0 text-orange-300" />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

