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

  const counts = Object.values(stats).map((s) => s.count);
  const errors = Object.values(stats).map((s) => s.errors);
  const maxCount = counts.length ? Math.max(...counts) : 1;
  const maxError = errors.length ? Math.max(...errors) : 1;

  // Get top keys for each category
  const topFrequent = useMemo(() => {
    return Object.entries(stats)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 5)
      .filter(([, s]) => s.count > 0);
  }, [stats]);

  const topErrors = useMemo(() => {
    return Object.entries(stats)
      .sort((a, b) => b[1].errors - a[1].errors)
      .slice(0, 5)
      .filter(([, s]) => s.errors > 0);
  }, [stats]);

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
      const { count = 0, errors = 0 } = stats[key] || {};
      
      if (activeView === "frequency") {
        const ratio = count / maxCount;
        const intensity = Math.round(ratio * 100);
        return `hsl(217, 91%, ${100 - intensity * 0.5}%)`;
      } else {
        const ratio = errors / maxError;
        const intensity = Math.round(ratio * 100);
        return `hsl(0, ${ratio * 100}%, ${100 - intensity * 0.4}%)`;
      }
    };
    
    return keyList
      .map((key) => {
        const colorClass = `key-${key.replace(/[^a-zA-Z0-9]/g, "_")}`;
        const color = getKeyColor(key);
        const { count = 0, errors = 0 } = stats[key] || {};
        const hasData = activeView === "frequency" ? count > 0 : errors > 0;
        
        return `.hg-theme-default .hg-button.${colorClass} { 
          background: ${hasData ? color : '#f3f4f6'} !important; 
          color: ${hasData ? '#fff' : '#9ca3af'} !important;
          font-weight: ${hasData ? '500' : '400'} !important;
        }`;
      })
      .join("\n");
  }, [keyList, stats, maxCount, maxError, activeView]);

  return (
    <div className="w-full max-w-5xl mx-auto p-6">
      <style>{customStyles}</style>
      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveView("frequency")}
          className={`px-6 py-2.5 rounded-md font-medium transition-all ${
            activeView === "frequency"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Most Used Keys
        </button>
        <button
          onClick={() => setActiveView("errors")}
          className={`px-6 py-2.5 rounded-md font-medium transition-all ${
            activeView === "errors"
              ? "bg-white text-red-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Most Missed Keys
        </button>
      </div>

      {/* Keyboard Visualization */}
      <div className="bg-[#899] rounded-xl shadow-sm border border-gray-200 p-6">
        <Keyboard layout={layout.layout} layoutName="default" buttonTheme={buttonTheme} />
        
        {/* Expand/Collapse Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full mt-4 flex items-center justify-center gap-2 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all group"
        >
          <span className="text-sm font-medium">
            {isExpanded ? "Hide" : "Show"} Detailed Stats
          </span>
          <ChevronDown 
            className={`w-4 h-4 transition-transform duration-300 ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {/* Stats Panel - Expandable */}
      <div 
        className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 ${
          isExpanded ? "mt-6 opacity-100 max-h-150" : "mt-0 opacity-0 max-h-0"
        }`}
      >
        <div className="p-6">
          {activeView === "frequency" ? (
            <>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-3 h-3 bg-blue-600 rounded-full"></span>
                Top 5 Most Used Keys
              </h3>
              {topFrequent.length > 0 ? (
                <div className="space-y-3">
                  {topFrequent.map(([key, data]) => (
                    <div key={key} className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center font-mono font-semibold text-gray-700">
                        {key === " " ? "␣" : key}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium text-gray-700">
                            {data.count} presses
                          </span>
                          <span className="text-xs text-gray-500">
                            {((data.count / maxCount) * 100).toFixed(0)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${(data.count / maxCount) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No typing data yet. Start typing to see your stats!</p>
              )}
            </>
          ) : (
            <>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-3 h-3 bg-red-600 rounded-full"></span>
                Top 5 Most Missed Keys
              </h3>
              {topErrors.length > 0 ? (
                <div className="space-y-3">
                  {topErrors.map(([key, data]) => (
                    <div key={key} className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center font-mono font-semibold text-gray-700">
                        {key === " " ? "␣" : key}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium text-gray-700">
                            {data.errors} errors
                          </span>
                          <span className="text-xs text-gray-500">
                            {((data.errors / maxError) * 100).toFixed(0)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-red-600 h-2 rounded-full transition-all"
                            style={{ width: `${(data.errors / maxError) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No errors recorded yet. Great job!</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}