import Slider from "rc-slider";
import React, { useState, useCallback, useEffect } from "react";

import { getAllCategories, getSubcategoriesForCategory } from "../../utils/data/industrial-categories";
import { filterCategories, getFilterTagsByCategory, validateTagSelection, filterPresets } from "../../utils/data/industrial-filter-tags";
import IndustrialCheckbox from "./form-builder/industrial-checkbox";
import Checkbox from "./form-builder/checkbox";

const { createSliderWithTooltip } = Slider;
const Range = createSliderWithTooltip(Slider.Range);

interface IndustrialFilterState {
  categories: string[];
  subcategories: string[];
  materialTypes: string[];
  pressureRange: { min: number; max: number };
  temperatureRange: { min: number; max: number };
  certifications: string[];
  deliveryTerms: string[];
  paymentTerms: string[];
  priceRange: { min: number; max: number };
  leadTimeMax: number;
  tags: string[];
  industryApplications: string[];
  searchQuery: string;
}

const initialFilterState: IndustrialFilterState = {
  categories: [],
  subcategories: [],
  materialTypes: [],
  pressureRange: { min: 0, max: 10000 },
  temperatureRange: { min: -200, max: 1000 },
  certifications: [],
  deliveryTerms: [],
  paymentTerms: [],
  priceRange: { min: 0, max: 100000 },
  leadTimeMax: 365,
  tags: [],
  industryApplications: [],
  searchQuery: ""
};

interface IndustrialFilterProps {
  onFilterChange?: (filters: IndustrialFilterState) => void;
  className?: string;
}

const IndustrialFilter: React.FC<IndustrialFilterProps> = ({
  onFilterChange,
  className = ""
}) => {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<IndustrialFilterState>(initialFilterState);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    categories: true,
    technical: false,
    certifications: false,
    commercial: false,
    applications: false
  });
  const [selectedPreset, setSelectedPreset] = useState<string>("");

  // Notify parent of filter changes
  useEffect(() => {
    onFilterChange?.(filters);
  }, [filters, onFilterChange]);

  const updateFilters = useCallback((updates: Partial<IndustrialFilterState>) => {
    setFilters(prev => ({ ...prev, ...updates }));
  }, []);

  const toggleSection = useCallback((section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  }, []);

  const handleCategoryChange = useCallback((category: string, checked: boolean) => {
    const newCategories = checked 
      ? [...filters.categories, category]
      : filters.categories.filter(c => c !== category);
    
    // Clear subcategories if category is deselected
    let newSubcategories = filters.subcategories;
    if (!checked) {
      const categorySubcats = getSubcategoriesForCategory(category);
      newSubcategories = filters.subcategories.filter(sub => !categorySubcats.includes(sub));
    }
    
    updateFilters({ 
      categories: newCategories,
      subcategories: newSubcategories
    });
  }, [filters.categories, filters.subcategories, updateFilters]);

  const handleSubcategoryChange = useCallback((subcategory: string, checked: boolean) => {
    const newSubcategories = checked
      ? [...filters.subcategories, subcategory]
      : filters.subcategories.filter(s => s !== subcategory);
    
    updateFilters({ subcategories: newSubcategories });
  }, [filters.subcategories, updateFilters]);

  const handleTagChange = useCallback((tag: string, checked: boolean) => {
    const newTags = checked
      ? [...filters.tags, tag]
      : filters.tags.filter(t => t !== tag);
    
    // Validate tag selection for conflicts
    const validation = validateTagSelection(newTags);
    if (validation.valid) {
      updateFilters({ tags: newTags });
    } else {
      // Remove conflicting tags
      const validTags = newTags.filter(t => !validation.conflicts.includes(t));
      updateFilters({ tags: validTags });
    }
  }, [filters.tags, updateFilters]);

  const applyPreset = useCallback((presetKey: string) => {
    const preset = filterPresets[presetKey as keyof typeof filterPresets];
    if (preset) {
      updateFilters({
        tags: preset.tags,
        industryApplications: [preset.name]
      });
      setSelectedPreset(presetKey);
    }
  }, [updateFilters]);

  const clearFilters = useCallback(() => {
    setFilters(initialFilterState);
    setSelectedPreset("");
  }, []);

  return (
    <div className={`industrial-filter ${className}`}>
      <button
        type="button"
        onClick={() => setFiltersOpen(!filtersOpen)}
        className={`industrial-filter__menu-btn ${filtersOpen ? "industrial-filter__menu-btn--active" : ""}`}
      >
        Industrial Filters <i className="icon-down-open" />
        {(filters.categories.length + filters.tags.length + filters.certifications.length) > 0 && (
          <span className="filter-count">
            {filters.categories.length + filters.tags.length + filters.certifications.length}
          </span>
        )}
      </button>

      <div className={`industrial-filter__wrapper ${filtersOpen ? "industrial-filter__wrapper--open" : ""}`}>
        
        {/* Search Bar */}
        <div className="filter-section">
          <div className="search-input">
            <input
              type="text"
              placeholder="Search industrial products..."
              value={filters.searchQuery}
              onChange={(e) => updateFilters({ searchQuery: e.target.value })}
              className="filter-search"
            />
            <i className="icon-search" />
          </div>
        </div>

        {/* Industry Presets */}
        <div className="filter-section">
          <h4>Industry Presets</h4>
          <div className="preset-buttons">
            {Object.entries(filterPresets).map(([key, preset]) => (
              <button
                key={key}
                type="button"
                onClick={() => applyPreset(key)}
                className={`preset-btn ${selectedPreset === key ? "active" : ""}`}
                title={preset.description}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="filter-section">
          <button 
            type="button" 
            onClick={() => toggleSection("categories")}
            className="section-toggle"
          >
            Categories {expandedSections.categories ? "−" : "+"}
          </button>
          
          {expandedSections.categories && (
            <div className="filter-content">
              {getAllCategories().map((category) => (
                <div key={category} className="category-group">
                  <IndustrialCheckbox
                    name="category"
                    label={category}
                    checked={filters.categories.includes(category)}
                    onChange={(checked) => handleCategoryChange(category, checked)}
                  />
                  
                  {/* Subcategories */}
                  {filters.categories.includes(category) && (
                    <div className="subcategory-list">
                      {getSubcategoriesForCategory(category).map((subcategory) => (
                        <IndustrialCheckbox
                          key={subcategory}
                          name="subcategory"
                          label={subcategory}
                          checked={filters.subcategories.includes(subcategory)}
                          onChange={(checked) => handleSubcategoryChange(subcategory, checked)}
                          className="subcategory-checkbox"
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Technical Specifications */}
        <div className="filter-section">
          <button 
            type="button" 
            onClick={() => toggleSection("technical")}
            className="section-toggle"
          >
            Technical Specs {expandedSections.technical ? "−" : "+"}
          </button>
          
          {expandedSections.technical && (
            <div className="filter-content">
              {/* Pressure Range */}
              <div className="range-filter">
                <label>Pressure Rating (PSI)</label>
                <Range
                  min={0}
                  max={10000}
                  value={[filters.pressureRange.min, filters.pressureRange.max]}
                  onChange={([min, max]) => updateFilters({ 
                    pressureRange: { min, max } 
                  })}
                  tipFormatter={(value) => `${value} PSI`}
                />
                <div className="range-labels">
                  <span>{filters.pressureRange.min} PSI</span>
                  <span>{filters.pressureRange.max} PSI</span>
                </div>
              </div>

              {/* Temperature Range */}
              <div className="range-filter">
                <label>Temperature Range (°C)</label>
                <Range
                  min={-200}
                  max={1000}
                  value={[filters.temperatureRange.min, filters.temperatureRange.max]}
                  onChange={([min, max]) => updateFilters({ 
                    temperatureRange: { min, max } 
                  })}
                  tipFormatter={(value) => `${value}°C`}
                />
                <div className="range-labels">
                  <span>{filters.temperatureRange.min}°C</span>
                  <span>{filters.temperatureRange.max}°C</span>
                </div>
              </div>

              {/* Technical Filter Tags */}
              <div className="tag-group">
                <h5>Technical Properties</h5>
                {getFilterTagsByCategory("technical").map((tag) => (
                  <Checkbox
                    key={tag.id}
                    name="technical-tag"
                    label={tag.name}
                    checked={filters.tags.includes(tag.id)}
                    onChange={(checked) => handleTagChange(tag.id, checked)}
                    title={tag.description}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Certifications & Compliance */}
        <div className="filter-section">
          <button 
            type="button" 
            onClick={() => toggleSection("certifications")}
            className="section-toggle"
          >
            Certifications {expandedSections.certifications ? "−" : "+"}
          </button>
          
          {expandedSections.certifications && (
            <div className="filter-content">
              <div className="tag-group">
                {getFilterTagsByCategory("certifications").map((tag) => (
                  <Checkbox
                    key={tag.id}
                    name="certification"
                    label={tag.name}
                    checked={filters.tags.includes(tag.id)}
                    onChange={(checked) => handleTagChange(tag.id, checked)}
                    title={tag.description}
                    className="certification-checkbox"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Commercial Terms */}
        <div className="filter-section">
          <button 
            type="button" 
            onClick={() => toggleSection("commercial")}
            className="section-toggle"
          >
            Commercial Terms {expandedSections.commercial ? "−" : "+"}
          </button>
          
          {expandedSections.commercial && (
            <div className="filter-content">
              {/* Price Range */}
              <div className="range-filter">
                <label>Price Range (EUR)</label>
                <Range
                  min={0}
                  max={100000}
                  value={[filters.priceRange.min, filters.priceRange.max]}
                  onChange={([min, max]) => updateFilters({ 
                    priceRange: { min, max } 
                  })}
                  tipFormatter={(value) => `€${value}`}
                />
                <div className="range-labels">
                  <span>€{filters.priceRange.min}</span>
                  <span>€{filters.priceRange.max}</span>
                </div>
              </div>

              {/* Lead Time */}
              <div className="range-filter">
                <label>Max Lead Time (days)</label>
                <Slider
                  min={1}
                  max={365}
                  value={filters.leadTimeMax}
                  onChange={(value) => updateFilters({ leadTimeMax: value as number })}
                  tipFormatter={(value) => `${value} days`}
                />
                <div className="range-labels">
                  <span>Max: {filters.leadTimeMax} days</span>
                </div>
              </div>

              {/* Commercial Filter Tags */}
              <div className="tag-group">
                <h5>Commercial Options</h5>
                {getFilterTagsByCategory("commercial").map((tag) => (
                  <Checkbox
                    key={tag.id}
                    name="commercial-tag"
                    label={tag.name}
                    checked={filters.tags.includes(tag.id)}
                    onChange={(checked) => handleTagChange(tag.id, checked)}
                    title={tag.description}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Industry Applications */}
        <div className="filter-section">
          <button 
            type="button" 
            onClick={() => toggleSection("applications")}
            className="section-toggle"
          >
            Applications {expandedSections.applications ? "−" : "+"}
          </button>
          
          {expandedSections.applications && (
            <div className="filter-content">
              <div className="tag-group">
                {getFilterTagsByCategory("applications").map((tag) => (
                  <Checkbox
                    key={tag.id}
                    name="application"
                    label={tag.name}
                    checked={filters.tags.includes(tag.id)}
                    onChange={(checked) => handleTagChange(tag.id, checked)}
                    title={tag.description}
                    className="application-checkbox"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Filter Actions */}
        <div className="filter-actions">
          <button
            type="button"
            onClick={clearFilters}
            className="btn btn-clear"
          >
            Clear All
          </button>
          <button
            type="submit"
            className="btn btn-submit btn--rounded btn--yellow"
          >
            Apply Filters
          </button>
        </div>

        {/* Active Filters Summary */}
        {(filters.categories.length + filters.tags.length) > 0 && (
          <div className="active-filters">
            <h5>Active Filters:</h5>
            <div className="filter-tags">
              {filters.categories.map(cat => (
                <span key={cat} className="filter-tag category-tag">
                  {cat}
                  <button onClick={() => handleCategoryChange(cat, false)}>×</button>
                </span>
              ))}
              {filters.subcategories.map(sub => (
                <span key={sub} className="filter-tag subcategory-tag">
                  {sub}
                  <button onClick={() => handleSubcategoryChange(sub, false)}>×</button>
                </span>
              ))}
              {filters.tags.map(tagId => {
                const allTags = filterCategories.flatMap(cat => cat.tags);
                const tag = allTags.find(t => t.id === tagId);
                return tag ? (
                  <span key={tagId} className="filter-tag tag-tag">
                    {tag.name}
                    <button onClick={() => handleTagChange(tagId, false)}>×</button>
                  </span>
                ) : null;
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IndustrialFilter; 