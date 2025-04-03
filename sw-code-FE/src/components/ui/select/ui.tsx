import {useState} from "react";

interface SimpleSelectProps {
    options: { value: string; label: string }[];
    defaultValue?: string;
    onChange?: (value: string) => void;
}

export const SimpleSelect = ({options, defaultValue, onChange}: SimpleSelectProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(defaultValue || options[0]?.value || "");

    const handleSelect = (value: string) => {
        setSelectedValue(value);
        setIsOpen(false);
        onChange?.(value);
    };

    const selectedLabel = options.find(opt => opt.value === selectedValue)?.label || "";

    return (
        <div className="relative inline-block w-fit text-[8px]">
            <button
                type="button"
                className="w-full px-2 py-1 text-left bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none"
                onClick={() => setIsOpen(!isOpen)}
            >
                {selectedLabel}
                <span className="float-right ml-2">▼</span>
            </button>

            {isOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                    {options.map((option) => (
                        <div
                            key={option.value}
                            className={`px-2 py-1 cursor-pointer hover:bg-blue-50 ${
                                selectedValue === option.value ? "bg-blue-100" : ""
                            }`}
                            onClick={() => handleSelect(option.value)}
                        >
                            {option.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};