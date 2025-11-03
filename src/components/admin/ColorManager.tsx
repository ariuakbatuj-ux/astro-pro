import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface Color {
  id: string;
  name: string;
  hex: string;
  stock: number;
}

interface ColorManagerProps {
  onColorsChange: (colors: Color[]) => void;
}

export const ColorManager: React.FC<ColorManagerProps> = ({ onColorsChange }) => {
  const [colors, setColors] = useState<Color[]>([]);
  const [newColor, setNewColor] = useState({ name: '', hex: '#000000', stock: 0 });

  const predefinedColors = [
    { name: 'Black', hex: '#000000' },
    { name: 'White', hex: '#ffffff' },
    { name: 'Red', hex: '#ef4444' },
    { name: 'Blue', hex: '#3b82f6' },
    { name: 'Green', hex: '#10b981' },
    { name: 'Yellow', hex: '#f59e0b' },
    { name: 'Purple', hex: '#8b5cf6' },
    { name: 'Pink', hex: '#ec4899' },
    { name: 'Orange', hex: '#f97316' },
    { name: 'Gray', hex: '#6b7280' },
    { name: 'Navy', hex: '#1e40af' },
    { name: 'Maroon', hex: '#7f1d1d' }
  ];

  const addColor = () => {
    if (!newColor.name.trim()) return;

    const color: Color = {
      id: `color-${Date.now()}`,
      name: newColor.name.trim(),
      hex: newColor.hex,
      stock: newColor.stock
    };

    const updatedColors = [...colors, color];
    setColors(updatedColors);
    onColorsChange(updatedColors);
    setNewColor({ name: '', hex: '#000000', stock: 0 });
  };

  const removeColor = (id: string) => {
    const updatedColors = colors.filter(color => color.id !== id);
    setColors(updatedColors);
    onColorsChange(updatedColors);
  };

  const updateColor = (id: string, field: keyof Omit<Color, 'id'>, value: string | number) => {
    const updatedColors = colors.map(color => 
      color.id === id ? { ...color, [field]: value } : color
    );
    setColors(updatedColors);
    onColorsChange(updatedColors);
  };

  const selectPredefinedColor = (predefined: { name: string; hex: string }) => {
    setNewColor(prev => ({
      ...prev,
      name: predefined.name,
      hex: predefined.hex
    }));
  };

  return (
    <Card title="Color Variations" subtitle="Manage available colors and their inventory">
      <div className="space-y-6">
        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
          <h4 className="font-medium text-gray-800">Add New Color</h4>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Quick Select Colors</label>
            <div className="grid grid-cols-6 gap-2">
              {predefinedColors.map((color) => (
                <button
                  key={color.hex}
                  type="button"
                  onClick={() => selectPredefinedColor(color)}
                  className={`
                    w-10 h-10 rounded-lg border-2 hover:scale-105 transition-transform
                    ${color.hex === '#ffffff' ? 'border-gray-300' : 'border-transparent'}
                  `}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                >
                  {color.hex === '#ffffff' && (
                    <div className="w-full h-full rounded-md border border-gray-200"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Color Name</label>
              <input
                type="text"
                placeholder="e.g., Midnight Blue, Rose Gold"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                value={newColor.name}
                onChange={(e) => setNewColor(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Color Code</label>
              <div className="flex space-x-2">
                <input
                  type="color"
                  className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                  value={newColor.hex}
                  onChange={(e) => setNewColor(prev => ({ ...prev, hex: e.target.value }))}
                />
                <input
                  type="text"
                  placeholder="#000000"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 font-mono text-sm"
                  value={newColor.hex}
                  onChange={(e) => setNewColor(prev => ({ ...prev, hex: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
              <input
                type="number"
                min="0"
                placeholder="Available quantity"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                value={newColor.stock || ''}
                onChange={(e) => setNewColor(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
              />
            </div>
          </div>

          <Button onClick={addColor} disabled={!newColor.name.trim()}>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Color
          </Button>
        </div>

        {colors.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-gray-800">Available Colors</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {colors.map((color) => (
                <div key={color.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                  <div className="flex items-center space-x-4 mb-3">
                    <div
                      className="w-12 h-12 rounded-lg border-2 border-gray-200 shadow-sm"
                      style={{ backgroundColor: color.hex }}
                    ></div>
                    <div className="flex-1">
                      <input
                        type="text"
                        className="w-full px-2 py-1 text-lg font-medium border-none focus:ring-2 focus:ring-orange-500 rounded"
                        value={color.name}
                        onChange={(e) => updateColor(color.id, 'name', e.target.value)}
                      />
                      <p className="text-sm text-gray-500 font-mono">{color.hex}</p>
                    </div>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => removeColor(color.id)}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <label className="text-sm font-medium text-gray-700">Color Code:</label>
                      <input
                        type="text"
                        className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded font-mono focus:ring-2 focus:ring-orange-500"
                        value={color.hex}
                        onChange={(e) => updateColor(color.id, 'hex', e.target.value)}
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <label className="text-sm font-medium text-gray-700">Stock:</label>
                      <input
                        type="number"
                        min="0"
                        className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-orange-500"
                        value={color.stock}
                        onChange={(e) => updateColor(color.id, 'stock', parseInt(e.target.value) || 0)}
                      />
                      <div className={`w-2 h-2 rounded-full ${
                        color.stock > 10 ? 'bg-green-500' : 
                        color.stock > 5 ? 'bg-yellow-500' : 
                        color.stock > 0 ? 'bg-orange-500' : 'bg-red-500'
                      }`}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {colors.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <div className="w-16 h-16 mx-auto mb-3 bg-gray-100 rounded-lg flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5H9a2 2 0 00-2 2v10a2 2 0 002 2h12V5z" />
              </svg>
            </div>
            <p>No colors added yet</p>
            <p className="text-sm">Add color variations to give customers more options</p>
          </div>
        )}
      </div>
    </Card>
  );
};