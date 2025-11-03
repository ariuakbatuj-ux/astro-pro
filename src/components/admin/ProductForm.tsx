import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { ImageUpload } from './ImageUpload';
import { ColorManager } from './ColorManager';

interface ProductFormData {
  name: string;
  description: string;
  shortDescription: string;
  category: string;
  brand: string;
  sku: string;
  price: number;
  comparePrice: number;
  weight: string;
  dimensions: {
    length: string;
    width: string;
    height: string;
  };
  tags: string[];
  seo: {
    title: string;
    description: string;
    keywords: string;
  };
}

interface Size {
  id: string;
  name: string;
  stock: number;
  price: number;
}

interface Color {
  id: string;
  name: string;
  hex: string;
  stock: number;
}

const categories = [
  'Electronics', 'Clothing & Fashion', 'Home & Garden', 'Sports & Fitness',
  'Beauty & Health', 'Books & Media', 'Toys & Games', 'Automotive',
  'Office Supplies', 'Pet Supplies', 'Food & Beverages', 'Other'
];

export const ProductForm: React.FC = () => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    shortDescription: '',
    category: '',
    brand: '',
    sku: '',
    price: 0,
    comparePrice: 0,
    weight: '',
    dimensions: { length: '', width: '', height: '' },
    tags: [],
    seo: { title: '', description: '', keywords: '' }
  });

  const [images, setImages] = useState<File[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof ProductFormData] as any),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.description.trim()) newErrors.description = 'Product description is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.price || formData.price <= 0) newErrors.price = 'Valid price is required';
    if (images.length === 0) newErrors.images = 'At least one product image is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (status: 'draft' | 'published') => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const productData = {
        ...formData,
        images,
        sizes,
        colors,
        status,
        createdAt: new Date().toISOString()
      };

      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Product submitted:', productData);
      alert(`Product ${status} successfully!`);
      
    } catch (error) {
      alert('Error saving product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card title="Basic Information" subtitle="Essential product details">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Input
              label="Product Name"
              placeholder="Enter product name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              error={errors.name}
              required
            />

            <Input
              label="Brand"
              placeholder="Product brand or manufacturer"
              value={formData.brand}
              onChange={(e) => handleInputChange('brand', e.target.value)}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                  errors.category ? 'border-red-500' : ''
                }`}
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              {errors.category && (
                <p className="text-sm text-red-600 mt-1">{errors.category}</p>
              )}
            </div>

            <Input
              label="SKU"
              placeholder="Stock Keeping Unit"
              value={formData.sku}
              onChange={(e) => handleInputChange('sku', e.target.value)}
              helperText="Leave empty to auto-generate"
            />
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Price"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={formData.price || ''}
                onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                error={errors.price}
                required
                icon={<span className="text-gray-500">$</span>}
              />

              <Input
                label="Compare Price"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={formData.comparePrice || ''}
                onChange={(e) => handleInputChange('comparePrice', parseFloat(e.target.value) || 0)}
                helperText="Original price for discount display"
                icon={<span className="text-gray-500">$</span>}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
              <textarea
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Brief product summary for search results"
                value={formData.shortDescription}
                onChange={(e) => handleInputChange('shortDescription', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Tags
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Add tags (press Enter)"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <Button type="button" onClick={addTag} disabled={!currentTag.trim()}>
                  Add
                </Button>
              </div>
              
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1.5 inline-flex items-center justify-center w-4 h-4 text-orange-400 hover:text-orange-600"
                      >
                        <svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Description <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={6}
            className={`w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
              errors.description ? 'border-red-500' : ''
            }`}
            placeholder="Detailed product description, features, specifications..."
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
          />
          {errors.description && (
            <p className="text-sm text-red-600 mt-1">{errors.description}</p>
          )}
        </div>
      </Card>

      <div>
        <ImageUpload onImagesChange={setImages} />
        {errors.images && (
          <p className="text-sm text-red-600 mt-2 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            {errors.images}
          </p>
        )}
      </div>

      <ColorManager onColorsChange={setColors} />

      <Card title="Shipping Information" subtitle="Package dimensions and weight">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Weight"
            placeholder="e.g., 1.5 lbs, 0.75 kg"
            value={formData.weight}
            onChange={(e) => handleInputChange('weight', e.target.value)}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Dimensions</label>
            <div className="grid grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="Length"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                value={formData.dimensions.length}
                onChange={(e) => handleInputChange('dimensions.length', e.target.value)}
              />
              <input
                type="text"
                placeholder="Width"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                value={formData.dimensions.width}
                onChange={(e) => handleInputChange('dimensions.width', e.target.value)}
              />
              <input
                type="text"
                placeholder="Height"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                value={formData.dimensions.height}
                onChange={(e) => handleInputChange('dimensions.height', e.target.value)}
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">Enter dimensions in inches or cm</p>
          </div>
        </div>
      </Card>

      <Card title="SEO Optimization" subtitle="Improve search engine visibility">
        <div className="space-y-4">
          <Input
            label="SEO Title"
            placeholder="Product title for search engines"
            value={formData.seo.title}
            onChange={(e) => handleInputChange('seo.title', e.target.value)}
            helperText="Leave empty to use product name"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SEO Description</label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="Description for search engine results"
              value={formData.seo.description}
              onChange={(e) => handleInputChange('seo.description', e.target.value)}
            />
            <p className="text-sm text-gray-500 mt-1">Keep under 160 characters for best results</p>
          </div>

          <Input
            label="Keywords"
            placeholder="Comma-separated keywords"
            value={formData.seo.keywords}
            onChange={(e) => handleInputChange('seo.keywords', e.target.value)}
            helperText="e.g., smartphone, electronics, mobile phone"
          />
        </div>
      </Card>

      <div className="flex items-center justify-between bg-white p-6 rounded-xl shadow-sm border border-gray-200 sticky bottom-0">
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Auto-saved</span>
          </div>
          <span>•</span>
          <span>Last saved: Just now</span>
        </div>

        <div className="flex space-x-3">
          <Button
            variant="secondary"
            onClick={() => handleSubmit('draft')}
            disabled={isSubmitting}
          >
            Save as Draft
          </Button>
          <Button
            onClick={() => handleSubmit('published')}
            disabled={isSubmitting}
            isLoading={isSubmitting}
          >
            Publish Product
          </Button>
        </div>
      </div>
    </div>
  );
};