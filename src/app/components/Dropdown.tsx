"use client";

export const Dropdown = ({
  name,
  value,
  onChange,
  options,
}: {
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: {
    value: string;
    label: string;
  }[];
}) => {
  return (
    <select
      className="w-32 border border-slate-200 bg-slate-100  rounded-md p-2"
      name={name}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((option, index) => (
        <option key={`${name}-${index}`} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};
