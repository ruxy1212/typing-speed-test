import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import layout from "simple-keyboard-layouts/build/layouts/english";

type KeyStats = {
  [key: string]: {
    count: number;
    errors: number;
  };
};

interface HeatmapProps {
  stats: KeyStats;
  keyList: string[];
}

export default function Heatmap({ stats, keyList }: HeatmapProps) {
  const [activeView, setActiveView] = useState<"frequency" | "errors">("frequency");
  const [isExpanded, setIsExpanded] = useState(false);
  const [layoutName, setLayoutName] = useState("default");

  const filteredStats = useMemo(() => {
    return Object.fromEntries(
      Object.entries(stats).filter(([key]) => key !== " " && key !== "{space}")
    );
  }, [stats]);

  const buttonAttributes = useMemo(() => {
    const excludedKeys = [" ", "{space}", "{enter}", "{bksp}", "{tab}", "{lock}", "{shift}", "{control}", "{alt}", ".com"];
    return keyList
    .filter((key) => !excludedKeys.includes(key.toLowerCase()))
    .map((key) => {
      const { count = 0, errors = 0 } = stats[key] || {};
      const tooltipText = `Count: ${count}\nErrors: ${errors}`;
      
      return {
        attribute: "data-tooltip",
        value: tooltipText,
        buttons: key,
      };
    });
  }, [keyList, stats]);

  const handleKeyPress = (button: string) => {
    if (button === "{shift}" || button === "{lock}") {
      // Toggle between default and shift layouts
      setLayoutName(layoutName === "default" ? "shift" : "default");
    }
  };

  const counts = Object.values(filteredStats).map((s) => s.count);
  const errors = Object.values(filteredStats).map((s) => s.errors);
  const maxCount = counts.length ? Math.max(...counts) : 1;
  const maxError = errors.length ? Math.max(...errors) : 1;

  // Get top keys for each category
  const topFrequent = useMemo(() => {
    return Object.entries(filteredStats)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 5)
      .filter(([, s]) => s.count > 0);
  }, [filteredStats]);

  const topErrors = useMemo(() => {
    return Object.entries(filteredStats)
      .sort((a, b) => b[1].errors - a[1].errors)
      .slice(0, 5)
      .filter(([, s]) => s.errors > 0);
  }, [filteredStats]);

  // Generate buttonTheme array with custom classes for each key
  const buttonTheme = useMemo(() => {
    return keyList.map((key) => {
      const colorClass = `key-${key.replace(/[^a-zA-Z0-9]/g, "_")}`;
      return {
        class: colorClass,
        buttons: key,
      };
    });
  }, [keyList]);

  // Generate dynamic CSS for each key based on active view
  const customStyles = useMemo(() => {
    const getKeyColor = (key: string) => {
      const { count = 0, errors = 0 } = filteredStats[key] || {};
      
      if (activeView === "frequency") {
        const ratio = Math.min(count / maxCount, 1);
        const intensity = (ratio * 50) + 25;
        return `hsl(214, 100%, ${100 - intensity * 0.5}%)`;
      } else {
        const ratio = errors / maxError;
        if(ratio == 0 && maxCount) return 'hsl(354, 0%, 100%)';
        if(key === 'm') console.log(key, ratio, errors, maxError);
        if(key === ',') console.log(key, ratio, errors, maxError);

        const saturation = 30 + (ratio * 70);
        const lightness = 80 - (ratio * 20);
        return `hsl(354, ${saturation}%, ${lightness}%)`;
      }
    };
    // 30.654205607476637 - 30 = ratio * 70
    // 0.654205607476637 = ratio * 70
    return keyList
      .map((key) => {
        const colorClass = `key-${key.split('').map(char => 
          /[a-zA-Z0-9]/.test(char) ? char : char.charCodeAt(0)
        ).join('')}`;
        const color = getKeyColor(key);
        const { count = 0, errors = 0 } = filteredStats[key] || {};
        const hasData = activeView === "frequency" ? count > 0 : errors > 0;
        
        return `.hg-theme-default .hg-button.${colorClass} { 
          background: ${key === ' ' || key === '{space}' ? 'hsl(214, 25%, 25%)' : hasData ? color : 'hsl(0, 0%, 15%)'} !important; 
          color: ${hasData ? '#fff' : 'hsl(0, 0%, 100%)'} !important;
          font-weight: ${hasData ? '500' : '400'} !important;
        }`;
      })
      .join("\n");
  }, [keyList, filteredStats, maxCount, maxError, activeView]);

  return (
    <div className="w-full">
      <style>{customStyles}</style>
      {/* Tab Navigation */}
      <div className="flex justify-center">
        <div className="flex justify-center gap-2 mb-6 bg-ts-neutral-400 p-1 rounded-lg">
          <button
            onClick={() => setActiveView("frequency")}
            className={`cursor-pointer px-4 md:px-6 py-2 md:py-2.5 rounded-md font-medium transition-all ${
              activeView === "frequency"
                ? "bg-ts-neutral-0 text-ts-blue-600 shadow-sm"
                : "text-ts-neutral-700 hover:text-ts-neutral-900"
            }`}
          >
            Most Used Keys
          </button>
          <button
            onClick={() => setActiveView("errors")}
            className={`cursor-pointer px-4 md:px-6 py-2 md:py-2.5 rounded-md font-medium transition-all ${
              activeView === "errors"
                ? "bg-ts-neutral-0 text-ts-red-500 shadow-sm"
                : "text-ts-neutral-700 hover:text-ts-neutral-900"
            }`}
          >
            Most Missed Keys
          </button>
        </div>
      </div>

      {/* Keyboard Visualization */}
      <div className="bg-ts-neutral-400 rounded-xl shadow-sm border border-ts-neutral-400 p-2">
        <Keyboard 
          layout={layout.layout} 
          layoutName={layoutName} 
          buttonTheme={buttonTheme} 
          onKeyPress={handleKeyPress} 
          buttonAttributes={buttonAttributes} />
      </div>

      {/* Expand/Collapse Button */}
      <div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-4 cursor-pointer mx-auto flex items-center justify-center gap-2 px-5 py-2 text-ts-neutral-0 hover:text-ts-neutral-800 hover:bg-ts-neutral-0 rounded-lg transition-all duration-500 group"
        >
          <span className="text-sm font-medium">
            Show
            {isExpanded ? "Less" : "More"}
          </span>
          <ChevronDown 
            className={`w-4 h-4 transition-transform animate-bounce duration-300 ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>
      <div 
        className={`bg-ts-neutral-700 rounded-xl shadow-sm border border-ts-neutral-0 overflow-hidden transition-all duration-300 ${
          isExpanded ? "mt-6 opacity-100 max-h-150" : "mt-0 opacity-0 max-h-0"
        }`}
      >
        <div className="p-6">
          {activeView === "frequency" ? (
            <>
              <h3 className="text-lg font-semibold text-ts-neutral-0 mb-4 flex items-center gap-2">
                <span className="w-3 h-3 bg-ts-blue-600 rounded-full"></span>
                Top 5 Most Used Keys
              </h3>
              {topFrequent.length > 0 ? (
                <div className="space-y-3">
                  {topFrequent.map(([key, data]) => (
                    <div key={key} className="flex items-center gap-4">
                      <div className="w-8 h-8 text-ts-neutral-0 rounded flex items-center justify-center font-mono font-semibold bg-ts-blue-400">
                        {key === " " ? "␣" : key}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium text-ts-neutral-0">
                            {data.count} presses
                          </span>
                          <span className="text-xs text-ts-neutral-0/80">
                            {((data.count / maxCount) * 100).toFixed(0)}%
                          </span>
                        </div>
                        <div className="w-full bg-ts-neutral-400 rounded-full h-2">
                          <div
                            className="bg-ts-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${(data.count / maxCount) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-ts-neutral-0/75 text-center text-sm">No typing data yet. Start typing to see your stats!</p>
              )}
            </>
          ) : (
            <>
              <h3 className="text-lg font-semibold text-ts-neutral-0 mb-4 flex items-center gap-2">
                <span className="w-3 h-3 bg-ts-red-500 rounded-full"></span>
                Top 5 Most Missed Keys
              </h3>
              {topErrors.length > 0 ? (
                <div className="space-y-3">
                  {topErrors.map(([key, data]) => (
                    <div key={key} className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-ts-red-500 rounded flex items-center justify-center font-mono font-semibold text-ts-neutral-0">
                        {key === " " ? "␣" : key}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium text-ts-neutral-0">
                            {data.errors} errors
                          </span>
                          <span className="text-xs text-ts-neutral-0/80">
                            {((data.errors / maxError) * 100).toFixed(0)}%
                          </span>
                        </div>
                        <div className="w-full bg-ts-neutral-400 rounded-full h-2">
                          <div
                            className="bg-ts-red-500 h-2 rounded-full transition-all"
                            style={{ width: `${(data.errors / maxError) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-ts-neutral-0/75 text-center text-sm">No errors recorded yet. Great job!</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}