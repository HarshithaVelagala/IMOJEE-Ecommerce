import React from 'react';

type OptionProps = {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
};

function SelectOption({ label, value, options, onChange }: OptionProps) {
  return (
    <div className="flex flex-col space-y-1">
      <label className="text-sm font-medium text-neutral-700">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded border border-gray-300 p-1 text-sm"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function ProductOptions({
  size,
  setSize,
  paperType,
  setPaperType,
  sheets,
  setSheets,
  duplicate,
  setDuplicate,
  binding,
  setBinding,
  color,
  setColor,
}: {
  size: string;
  setSize: (v: string) => void;
  paperType: string;
  setPaperType: (v: string) => void;
  sheets: string;
  setSheets: (v: string) => void;
  duplicate: string;
  setDuplicate: (v: string) => void;
  binding: string;
  setBinding: (v: string) => void;
  color: string;
  setColor: (v: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-4 mb-4">
      <SelectOption
        label="Size"
        value={size}
        options={["A4", "A5", "Letter"]}
        onChange={setSize}
      />
      <SelectOption
        label="Paper Type"
        value={paperType}
        options={["Matte", "Glossy", "Recycled"]}
        onChange={setPaperType}
      />
      <SelectOption
        label="Number of Sheets"
        value={sheets}
        options={["50", "100", "150", "200"]}
        onChange={setSheets}
      />
      <SelectOption
        label="Duplicate / Triplicate"
        value={duplicate}
        options={["Single", "Duplicate", "Triplicate"]}
        onChange={setDuplicate}
      />
      <SelectOption
        label="Binding"
        value={binding}
        options={["Stapled", "Saddle Stitch", "Perfect Bound"]}
        onChange={setBinding}
      />
      <SelectOption
        label="Printing Color"
        value={color}
        options={["Full Color", "Black & White"]}
        onChange={setColor}
      />
    </div>
  );
}
