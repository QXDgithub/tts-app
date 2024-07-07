// src/components/TextInput.tsx
"use client";

import React, { useState, useEffect, useRef } from 'react';

interface TextInputProps {
  onSubmit?: (value: string) => void;
  clearInput?: boolean;
  isDisabled?: boolean;
}

export default function TextInput({ onSubmit, clearInput, isDisabled }: TextInputProps) {
  const [value, setValue] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value.replace(/\D/g, '').slice(0, 8);
    setValue(newValue);
  };

  useEffect(() => {
    if (value.length === 8 && onSubmit) {
      onSubmit(value);
    }
  }, [value, onSubmit]);

  useEffect(() => {
    if (clearInput) {
      setValue('');
      inputRef.current?.focus();
    }
  }, [clearInput]);

  // This effect will run on component mount and after each render
  useEffect(() => {
    inputRef.current?.focus();
  });

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '20vh' }}>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleChange}
        disabled={isDisabled}
        style={{
          padding: '10px',
          fontSize: '16px',
          width: '200px',
          textAlign: 'center',
          opacity: isDisabled ? 0.5 : 1,
        }}
        placeholder="Enter 8-digit number"
      />
    </div>
  );
}