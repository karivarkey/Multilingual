import { useState } from "react";
import { keyboards, KeyboardLayout } from "../lib/keyboardLayouts";

export default function VirtualKeyboard({
  language,
  value,
  onChange,
}: {
  language: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [mode, setMode] = useState<"main" | "matra" | "conjuncts">("main");

  if (!keyboards[language]) return null;

  const layout: KeyboardLayout = keyboards[language];

  const handleKeyClick = (key: string) => {
    if (mode === "main") {
      onChange(value + key);
    } else {
      // Matra modifies last character - basic behavior: if there's at least one character
      // and last character is a base (from layout.main), append the matra after it.
      // For more advanced rendering (pre-base matras, conjuncts) a language-specific
      // shaping engine would be needed; this simple approach works for many cases.
      if (!value) return;
      const lastChar = value.slice(-1);
      // If last char is space, do nothing
      if (lastChar.trim() === "") return;
      // Replace the last character sequence with lastChar + matra (append matra)
      onChange(value.slice(0, -1) + lastChar + key);
    }
  };

  const handleBackspace = () => {
    if (!value) return;
    onChange(value.slice(0, -1));
  };

  return (
    <div className="mt-3 p-3 border rounded bg-slate-100 dark:bg-slate-800">
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => setMode("main")}
          className={`px-2 py-1 rounded ${mode === "main" ? "bg-indigo-600 text-white" : "bg-gray-300"}`}
        >
          Letters
        </button>
        <button
          onClick={() => setMode("matra")}
          className={`px-2 py-1 rounded ${mode === "matra" ? "bg-indigo-600 text-white" : "bg-gray-300"}`}
        >
          Matras
        </button>
        <button
          onClick={() => setMode("conjuncts")}
          className={`px-2 py-1 rounded ${mode === "conjuncts" ? "bg-indigo-600 text-white" : "bg-gray-300"}`}
        >
          Conjuncts
        </button>
        <button onClick={handleBackspace} className="ml-auto px-2 py-1 rounded bg-red-500 text-white">⌫</button>
      </div>

      <div className="grid grid-cols-8 gap-2">
        {(mode === "main" ? layout.main : mode === "matra" ? layout.matra : (layout.conjuncts || [])).map((k) => (
          <button
            key={k}
            onClick={() => handleKeyClick(k)}
            className="p-2 text-lg rounded bg-white dark:bg-slate-700 hover:bg-indigo-200"
          >
            {k === " " ? "␣" : k}
          </button>
        ))}
      </div>
    </div>
  );
}
