import { useState } from "react";
import { PaletteIcon, ChevronRightIcon } from "lucide-react";
import { useThemeStore } from "../store/useThemeStore";
import { THEMES, CUSTOM_THEMES } from "../constants";

const ThemeSelector = () => {
  const { theme, setTheme } = useThemeStore();
  const [showCustomThemes, setShowCustomThemes] = useState(false);

  const handleThemeSelect = (themeName) => {
    if (themeName === "custom") {
      setShowCustomThemes(true);
    } else {
      setTheme(themeName);
      setShowCustomThemes(false);
    }
  };

  return (
    <div className="dropdown dropdown-end">
      {/* DROPDOWN TRIGGER */}
      <button tabIndex={0} className="btn btn-ghost btn-circle">
        <PaletteIcon className="size-5" />
      </button>

      <div
        tabIndex={0}
        className="dropdown-content mt-2 p-1 shadow-2xl bg-base-200 backdrop-blur-lg rounded-2xl
        w-56 border border-base-content/10 max-h-80 overflow-y-auto"
      >
        <div className="space-y-1">
          {THEMES.map((themeOption) => (
            <button
              key={themeOption.name}
              className={`
              w-full px-4 py-3 rounded-xl flex items-center gap-3 transition-colors
              ${
                theme === themeOption.name
                  ? "bg-primary/10 text-primary"
                  : "hover:bg-base-content/5"
              }
            `}
              onClick={() => handleThemeSelect(themeOption.name)}
            >
              <PaletteIcon className="size-4" />
              <span className="text-sm font-medium">{themeOption.label}</span>
              {/* THEME PREVIEW COLORS */}
              <div className="ml-auto flex gap-1">
                {themeOption.colors.map((color, i) => (
                  <span
                    key={i}
                    className="size-2 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              {themeOption.name === "custom" && (
                <ChevronRightIcon className="size-4 ml-1" />
              )}
            </button>
          ))}
          
          {/* Custom Theme Submenu */}
          {showCustomThemes && (
            <div className="ml-4 border-l-2 border-base-content/20 pl-2 mt-2">
              <div className="text-xs font-semibold text-base-content/70 mb-2 px-2">
                Choose Custom Theme:
              </div>
              {CUSTOM_THEMES.map((customTheme) => (
                <button
                  key={customTheme.name}
                  className={`
                  w-full px-3 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm
                  ${
                    theme === customTheme.name
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-base-content/5"
                  }
                `}
                  onClick={() => setTheme(customTheme.name)}
                >
                  <span className="font-medium">{customTheme.label}</span>
                  <div className="ml-auto flex gap-1">
                    {customTheme.colors.map((color, i) => (
                      <span
                        key={i}
                        className="size-1.5 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default ThemeSelector;
