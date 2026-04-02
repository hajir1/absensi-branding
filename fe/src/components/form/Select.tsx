import { useEffect, useState } from "react";

interface Option {
  value: string;
  label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  options: Option[];
  placeholder?: string;
  onChange: (value: string) => void;
  className?: string;
  defaultValue?: string;
  isValueSelected?: number | string;
  isRequired?: boolean;
  isOptionDisabled?: boolean;
}

const Select: React.FC<SelectProps> = ({
  options,
  isOptionDisabled=false,
  placeholder = "Select an option",
  onChange,
  className = "",
  isValueSelected = 0,
  isRequired = false,
  defaultValue = isValueSelected ? isValueSelected.toString() : "",
}) => {
  // Manage the selected value
  const [selectedValue, setSelectedValue] = useState<string>(defaultValue);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedValue(value);
    onChange(value); // Trigger parent handler
  };

  // Sinkronisasi dengan prop isValueSelected
  useEffect(() => {
    if (isValueSelected !== undefined && isValueSelected !== null) {
      setSelectedValue(String(isValueSelected));
    }
  }, [isValueSelected]);

  return (
    <select
      required={isRequired}
      className={`h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${
        selectedValue
          ? "text-gray-800 dark:text-white/90"
          : "text-gray-400 dark:text-gray-400"
      } ${className}`}
      value={selectedValue}
      onChange={handleChange}
    >
      {/* Placeholder option */}
      <option
        value=""
        disabled
        className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
      >
        {placeholder}
      </option>
      {/* Map over options */}
      {(options as any)?.map((option: any, index: number) => (
        <option
          key={index}
          disabled={isOptionDisabled}
          value={option.value}
          // selected={option.value === isValueSelected}
          className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
        >
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select;
