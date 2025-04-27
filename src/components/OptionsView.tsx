import React, { useState, useEffect } from 'react';
import { useSidebar } from '../context/SidebarContext';
import { ArrowLeft } from 'lucide-react';

interface OptionsViewProps {
  onBack: () => void;
}

export const OptionsView: React.FC<OptionsViewProps> = ({ onBack }) => {
  const { state, dispatch } = useSidebar();
  const { theme } = state;

  const [options, setOptions] = useState({
    autoHideDelay: state.autoHideDelay,
    transparency: state.transparency,
    autoHideWhenInactive: state.autoHideWhenInactive,
    sortBy: state.sortBy,
    confirmDeletion: state.confirmDeletion,
    runAtStartup: state.runAtStartup,
    checkUpdates: state.checkUpdates,
    font: { ...state.font }
  });

  useEffect(() => {
    if (options.runAtStartup) {
      // Create Windows startup entry
      try {
        // This would typically use a native module or IPC in Electron
        // For web, we'll just simulate it
        console.log('Setting up Windows startup...');
      } catch (error) {
        console.error('Failed to set up Windows startup:', error);
      }
    }
  }, [options.runAtStartup]);

  const handleSliderChange = (key: 'autoHideDelay' | 'transparency' | 'fontSize' | 'fontWeight', value: number) => {
    if (key === 'fontSize' || key === 'fontWeight') {
      setOptions(prev => ({
        ...prev,
        font: {
          ...prev.font,
          [key === 'fontSize' ? 'size' : 'weight']: value
        }
      }));
    } else {
      setOptions(prev => ({ ...prev, [key]: value }));
    }
  };

  const handleFontFamilyChange = (value: string) => {
    setOptions(prev => ({
      ...prev,
      font: {
        ...prev.font,
        family: value
      }
    }));
  };

  const handleCheckboxChange = (key: keyof typeof options) => {
    setOptions(prev => ({ ...prev, [key]: !prev[key as keyof typeof options] }));
  };

  const handleSave = () => {
    dispatch({ type: 'UPDATE_OPTIONS', payload: options });
    onBack();
  };

  const systemFonts = [
    { value: 'system-ui', label: 'System Default' },
    { value: 'Arial', label: 'Arial' },
    { value: 'Helvetica', label: 'Helvetica' },
    { value: 'Verdana', label: 'Verdana' },
    { value: 'Tahoma', label: 'Tahoma' },
    { value: 'Trebuchet MS', label: 'Trebuchet MS' },
    { value: 'Times New Roman', label: 'Times New Roman' },
    { value: 'Georgia', label: 'Georgia' },
    { value: 'Garamond', label: 'Garamond' },
    { value: 'Courier New', label: 'Courier New' },
    { value: 'Segoe UI', label: 'Segoe UI' },
  ];

  const sliderOptions = [
    { 
      key: 'autoHideDelay' as const,
      label: 'Auto-hide delay',
      min: 0,
      max: 2000,
      step: 100,
      unit: 'ms',
      value: options.autoHideDelay
    },
    { 
      key: 'transparency' as const,
      label: 'Transparency',
      min: 0,
      max: 100,
      step: 5,
      unit: '%',
      value: options.transparency
    },
  ];

  const fontSliderOptions = [
    {
      key: 'fontSize' as const,
      label: 'Font Size',
      min: 12,
      max: 24,
      step: 1,
      unit: 'px',
      value: options.font.size
    },
    {
      key: 'fontWeight' as const,
      label: 'Font Weight',
      min: 300,
      max: 700,
      step: 100,
      unit: '',
      value: options.font.weight
    }
  ];

  const sortOptions = [
    { value: 'manual', label: 'Manual' },
    { value: 'name', label: 'Name' },
    { value: 'type', label: 'Type' },
    { value: 'category', label: 'Category' },
    { value: 'last_used', label: 'Last Used' },
  ];

  const optionsStyle = {
    fontFamily: options.font.family,
    fontSize: `${options.font.size}px`,
    fontWeight: options.font.weight
  };

  return (
    <div className="h-full flex flex-col" style={optionsStyle}>
      <div className="flex items-center p-3 border-b border-gray-700">
        <button
          onClick={onBack}
          className={`p-1.5 rounded-full mr-2 ${
            theme === 'dark' 
              ? 'text-gray-400 hover:text-white hover:bg-gray-800' 
              : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
          }`}
        >
          <ArrowLeft size={18} />
        </button>
        <h2 className="text-lg font-semibold">Options</h2>
      </div>

      <div className="flex-grow overflow-y-auto">
        <div className="p-4 space-y-6">
          {/* Font Options */}
          <div className="space-y-4 pb-4 border-b border-gray-700">
            <h3 className="text-sm font-medium">Font Settings</h3>
            
            <div className="space-y-2">
              <label className="text-sm block">Font Family</label>
              <select
                value={options.font.family}
                onChange={(e) => handleFontFamilyChange(e.target.value)}
                className={`w-full p-2 rounded-md text-sm ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600'
                    : 'bg-white border-gray-300'
                } border`}
                style={{ fontFamily: options.font.family }}
              >
                {systemFonts.map((font) => (
                  <option 
                    key={font.value} 
                    value={font.value}
                    style={{ fontFamily: font.value }}
                  >
                    {font.label}
                  </option>
                ))}
              </select>
            </div>

            {fontSliderOptions.map((option) => (
              <div key={option.key} className="space-y-2">
                <label className="text-sm block">
                  {option.label}
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="range"
                    min={option.min}
                    max={option.max}
                    step={option.step}
                    value={option.value}
                    onChange={(e) => handleSliderChange(option.key, Number(e.target.value))}
                    className="flex-grow"
                  />
                  <span className="text-sm w-16 text-right">
                    {option.value}{option.unit}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Slider Options */}
          {sliderOptions.map((option) => (
            <div key={option.key} className="space-y-2">
              <label className="text-sm font-medium block">
                {option.label}
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="range"
                  min={option.min}
                  max={option.max}
                  step={option.step}
                  value={option.value}
                  onChange={(e) => handleSliderChange(option.key, Number(e.target.value))}
                  className="flex-grow"
                />
                <span className="text-sm w-16 text-right">
                  {option.value}{option.unit}
                </span>
              </div>
            </div>
          ))}

          {/* Other Options */}
          <div className="space-y-4 pt-4 border-t border-gray-700">
            <div className="flex items-center justify-between">
              <label className="text-sm">Sort items by</label>
              <select
                value={options.sortBy}
                onChange={(e) => setOptions(prev => ({ 
                  ...prev, 
                  sortBy: e.target.value as typeof options.sortBy 
                }))}
                className={`ml-2 p-1.5 rounded text-sm ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600'
                    : 'bg-white border-gray-300'
                } border`}
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {[
              { key: 'autoHideWhenInactive', label: 'Auto-hide when inactive' },
              { key: 'confirmDeletion', label: 'Confirm item deletion' },
              { key: 'runAtStartup', label: 'Run at startup' },
              { key: 'checkUpdates', label: 'Check for updates' },
            ].map(({ key, label }) => (
              <div key={key} className="flex items-center">
                <input
                  type="checkbox"
                  checked={options[key as keyof typeof options] as boolean}
                  onChange={() => handleCheckboxChange(key as keyof typeof options)}
                  className={`mr-2 rounded border ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600' 
                      : 'bg-white border-gray-300'
                  }`}
                />
                <label className="text-sm">{label}</label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleSave}
          className={`w-full px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white`}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};