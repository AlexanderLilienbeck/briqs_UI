import React from "react";

interface IndustrialCheckboxProps {
  type?: string;
  label: string;
  name: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
  title?: string;
  disabled?: boolean;
}

const IndustrialCheckbox: React.FC<IndustrialCheckboxProps> = ({ 
  type = "", 
  label, 
  name, 
  checked = false,
  onChange,
  className = "",
  title,
  disabled = false
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.checked);
  };

  return (
    <label
      htmlFor={`${label}-${name}`}
      className={`checkbox ${type ? `checkbox--${type}` : ""} ${className}`}
      title={title}
    >
      <input
        name={name}
        onChange={handleChange}
        type="checkbox"
        id={`${label}-${name}`}
        checked={checked}
        disabled={disabled}
      />
      <span className="checkbox__check" />
      <p className="checkbox-label">{label}</p>
    </label>
  );
};

export default IndustrialCheckbox; 