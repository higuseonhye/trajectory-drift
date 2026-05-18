"use client";

interface JsonUploadProps {
  onLoad: (text: string, fileName: string) => void;
  disabled?: boolean;
}

export function JsonUpload({ onLoad, disabled }: JsonUploadProps) {
  return (
    <div className="flex items-center gap-2">
      <label
        className={`cursor-pointer rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-medium text-zinc-400 transition hover:border-zinc-600 hover:text-zinc-200 ${
          disabled ? "pointer-events-none opacity-40" : ""
        }`}
      >
        <input
          type="file"
          accept=".json,application/json"
          className="sr-only"
          disabled={disabled}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = () => {
              if (typeof reader.result === "string") {
                onLoad(reader.result, file.name);
              }
            };
            reader.readAsText(file);
            e.target.value = "";
          }}
        />
        Upload logs
      </label>
    </div>
  );
}
