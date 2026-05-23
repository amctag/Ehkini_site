"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export default function CountryCodeSelect({
  ariaLabel,
  disabled = false,
  name = "country_code",
  onChange,
  options,
  value
}) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef(null);
  const selectedOption = useMemo(
    () => options.find((option) => option.value === value) ?? options[0],
    [options, value]
  );

  useEffect(() => {
    if (!isOpen) return undefined;

    function handleOutsideClick(event) {
      if (!rootRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    window.addEventListener("mousedown", handleOutsideClick);
    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("mousedown", handleOutsideClick);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  function selectCountry(nextValue) {
    onChange(nextValue);
    setIsOpen(false);
  }

  return (
    <div className="auth-country-select" ref={rootRef}>
      <input type="hidden" name={name} value={value} />
      <button
        type="button"
        className="auth-country-trigger"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        disabled={disabled}
        onClick={() => setIsOpen((current) => !current)}
      >
        <span>{selectedOption?.label ?? value}</span>
        <span className="auth-country-caret" aria-hidden="true">
          v
        </span>
      </button>

      {isOpen ? (
        <div className="auth-country-menu" role="listbox" aria-label={ariaLabel}>
          {options.map((country) => (
            <button
              type="button"
              role="option"
              aria-selected={country.value === value}
              className={country.value === value ? "active" : ""}
              key={`${country.value}-${country.label}`}
              onClick={() => selectCountry(country.value)}
            >
              {country.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
