"use client";
import * as React from "react";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ComboboxProps {
  items: Array<{ value: string; label: string }>;
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  className?: string;
  inputMode?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onClear?: () => void;
}

export function Combobox({
  items,
  value: controlledValue,
  onValueChange,
  placeholder = "Select item...",
  searchPlaceholder = "Search...",
  emptyMessage = "No item found.",
  className,
  inputMode = false,
  searchValue: controlledSearchValue,
  onSearchChange,
  onClear,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState("");
  const [internalSearchValue, setInternalSearchValue] = React.useState("");
  const [selectedIndex, setSelectedIndex] = React.useState(-1);

  // Use controlled values if provided, otherwise use internal state
  const value = controlledValue !== undefined ? controlledValue : internalValue;
  const searchValue =
    controlledSearchValue !== undefined
      ? controlledSearchValue
      : internalSearchValue;

  const handleSelect = (currentValue: string) => {
    const selectedItem = items.find((item) => item.value === currentValue);
    const newValue = currentValue === value ? "" : currentValue;

    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }

    if (inputMode && selectedItem) {
      if (controlledSearchValue === undefined) {
        setInternalSearchValue(selectedItem.label);
      }
      onSearchChange?.(selectedItem.label);
    }

    onValueChange?.(newValue);
    setOpen(false);
  };

  const filteredItems = React.useMemo(() => {
    if (!searchValue) return items;
    return items.filter((item) =>
      item.label.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [items, searchValue]);



  if (inputMode) {
    return (
      <div className="relative">
        <input
          type="text"
          value={searchValue}
          onChange={(e) => {
            const newValue = e.target.value;
            if (controlledSearchValue === undefined) {
              setInternalSearchValue(newValue);
            }
            onSearchChange?.(newValue);
            setOpen(newValue.length > 0);
            setSelectedIndex(-1);
          }}
          onKeyDown={(e) => {
            if (!open) return;

            if (e.key === "ArrowDown") {
              e.preventDefault();
              setSelectedIndex((prev) =>
                prev < filteredItems.length - 1 ? prev + 1 : prev
              );
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
            } else if (e.key === "Enter") {
              e.preventDefault();
              if (selectedIndex >= 0) {
                handleSelect(filteredItems[selectedIndex].value);
                setSelectedIndex(-1);
              }
            } else if (e.key === "Escape") {
              setOpen(false);
              setSelectedIndex(-1);
            } else if (e.key === "Delete" && onClear) {
              e.preventDefault();
              onClear();
              setOpen(false);
              setSelectedIndex(-1);
            }
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 200)}
          placeholder={placeholder}
          className={cn(
            "flex h-10 w-full rounded-md border px-3 py-2 text-sm",
            "bg-gray-800 border-gray-700 text-gray-200 placeholder:text-gray-500",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
            className
          )}
        />

        {open && filteredItems.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-lg max-h-40 overflow-y-auto">
            {filteredItems.map((item, index) => (
              <div
                key={item.value}
                className={cn(
                  "px-3 py-2 hover:bg-gray-700 cursor-pointer text-gray-200 text-sm",
                  selectedIndex === index && "bg-gray-700"
                )}
                onMouseDown={() => handleSelect(item.value)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                {item.label}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700",
            className
          )}
        >
          {value
            ? items.find((item) => item.value === value)?.label
            : placeholder}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 bg-gray-800 border-gray-700">
        <Command className="bg-gray-800">
          <CommandInput
            placeholder={searchPlaceholder}
            className="bg-gray-800 text-gray-200 border-gray-700"
          />
          <CommandList className="bg-gray-800">
            <CommandEmpty className="text-gray-400">
              {emptyMessage}
            </CommandEmpty>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={handleSelect}
                  className="text-gray-200 hover:bg-gray-700 data-[selected]:bg-gray-700"
                >
                  <CheckIcon
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === item.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
