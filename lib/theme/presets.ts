export interface ThemePreset {
  id: string;
  label: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
}

export const themePresets: ThemePreset[] = [
  {
    id: "default",
    label: "Standard",
    primaryColor: "#171717",
    secondaryColor: "#525252",
    accentColor: "#2563eb",
    backgroundColor: "#ffffff",
    textColor: "#171717",
  },
  {
    id: "fjord",
    label: "Fjord",
    primaryColor: "#0f172a",
    secondaryColor: "#334155",
    accentColor: "#0ea5e9",
    backgroundColor: "#f8fafc",
    textColor: "#0f172a",
  },
  {
    id: "skog",
    label: "Skog",
    primaryColor: "#14231b",
    secondaryColor: "#3f5d4c",
    accentColor: "#22c55e",
    backgroundColor: "#f6faf7",
    textColor: "#14231b",
  },
  {
    id: "solnedgang",
    label: "Solnedgang",
    primaryColor: "#2a1a12",
    secondaryColor: "#8a5a3b",
    accentColor: "#f97316",
    backgroundColor: "#fffaf5",
    textColor: "#2a1a12",
  },
  {
    id: "tundra",
    label: "Tundra",
    primaryColor: "#241b2f",
    secondaryColor: "#5b4b6f",
    accentColor: "#a855f7",
    backgroundColor: "#faf8fc",
    textColor: "#241b2f",
  },
];

export function findPreset(id: string) {
  return themePresets.find((preset) => preset.id === id);
}
