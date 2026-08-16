import React from 'react';
import { Filter, X, Check, ArrowUpDown, SlidersHorizontal, Eye } from 'lucide-react';
import { FilterState } from '../types';
import { COMMON_COLORS_PALETTE } from '../data/fabrics';

interface FabricFilterProps {
  filter: FilterState;
  onChangeFilter: (f: FilterState) => void;
  totalResults: number;
}

export const FabricFilter: React.FC<FabricFilterProps> = ({
  filter,
  onChangeFilter,
  totalResults,
}) => {
  const toggleColor = (colorName: string) => {
    const exists = filter.selectedColors.includes(colorName);
    const newColors = exists
      ? filter.selectedColors.filter((c) => c !== colorName)
      : [...filter.selectedColors, colorName];
    onChangeFilter({ ...filter, selectedColors: newColors });
  };

  const toggleUse = (use: string) => {
    const exists = filter.selectedUses.includes(use);
    const newUses = exists
      ? filter.selectedUses.filter((u) => u !== use)
      : [...filter.selectedUses, use];
    onChangeFilter({ ...filter, selectedUses: newUses });
  };

  const handleResetFilters = () => {
    onChangeFilter({
      searchQuery: '',
      category: 'all',
      selectedColors: [],
      selectedPatterns: [],
      selectedSeasons: [],
      selectedUses: [],
      selectedOrigins: [],
      priceRange: [0, 350],
      inStockOnly: false,
      sortBy: 'popular',
    });
  };

  const hasActiveFilters =
    filter.selectedColors.length > 0 ||
    filter.selectedUses.length > 0 ||
    filter.inStockOnly ||
    filter.searchQuery !== '' ||
    filter.category !== 'all' ||
    filter.priceRange[1] < 350;

  const COMMON_USES = [
    'ثياب رجالية',
    'فساتين سهرة',
    'عبايات',
    'قفاطين فاخرة',
    'قمصان كلاسيك',
    'ستائر',
    'بدلات رسمية',
    'تنجيد مفروشات',
  ];

  return (
    <div className="bg-white rounded-2xl border border-[#ded5c5] p-4 sm:p-5 shadow-xs space-y-5">
      
      {/* Top Filter Header & Sort Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-stone-200">
        
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#f4efe6] flex items-center justify-center text-[#1b2a22]">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-stone-900">خيارات الفلترة والتصنيف</h2>
            <p className="text-xs text-stone-500">تم العثور على <strong>{totalResults}</strong> نوع قماش</p>
          </div>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <span className="text-xs text-stone-500 font-medium flex items-center gap-1">
            <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
            الترتيب:
          </span>
          <select
            value={filter.sortBy}
            onChange={(e) => onChangeFilter({ ...filter, sortBy: e.target.value as any })}
            aria-label="ترتيب الأقمشة حسب"
            className="bg-[#f4efe6] border border-[#dcd4c5] text-xs font-bold text-stone-800 rounded-xl px-3 py-1.5 outline-none focus:border-[#c6923b] cursor-pointer"
          >
            <option value="popular">الأكثر طلباً ومبيعاً</option>
            <option value="rating">الأعلى تقييماً (5 نجوم)</option>
            <option value="price_asc">السعر: من الأقل للأعلى</option>
            <option value="price_desc">السعر: من الأعلى للأقل</option>
            <option value="newest">أحدث الأقمشة المضافة</option>
          </select>

          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-2.5 py-1.5 rounded-xl transition-colors flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>إعادة ضبط</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Colors Palette Multi-Select */}
        <div className="md:col-span-6 space-y-2">
          <label className="text-xs font-bold text-stone-800 flex items-center justify-between">
            <span>فلترة حسب درجات الألوان:</span>
            {filter.selectedColors.length > 0 && (
              <span className="text-[11px] text-[#966b24] font-medium">
                ({filter.selectedColors.length} محددة)
              </span>
            )}
          </label>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            {COMMON_COLORS_PALETTE.map((color) => {
              const isSelected = filter.selectedColors.includes(color.nameAr);
              return (
                <button
                  key={color.nameAr}
                  onClick={() => toggleColor(color.nameAr)}
                  title={color.nameAr}
                  className={`group relative flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-[#1b2a22] text-[#f4efe6] shadow-xs'
                      : 'bg-[#f4efe6] text-stone-700 hover:bg-[#eae3d5]'
                  }`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-black/20 shadow-2xs inline-block"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span>{color.nameAr}</span>
                  {isSelected && <Check className="w-3 h-3 text-[#d8af56]" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Use Cases / Purpose Multi-Select */}
        <div className="md:col-span-6 space-y-2">
          <label className="text-xs font-bold text-stone-800 flex items-center justify-between">
            <span>الاستخدام والتفصيل:</span>
          </label>

          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {COMMON_USES.map((use) => {
              const isSelected = filter.selectedUses.includes(use);
              return (
                <button
                  key={use}
                  onClick={() => toggleUse(use)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold transition-colors ${
                    isSelected
                      ? 'bg-[#c6923b] text-stone-950 shadow-xs'
                      : 'bg-[#f4efe6] text-stone-700 hover:bg-[#eae3d5] border border-[#dcd4c5]'
                  }`}
                >
                  {use}
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Bottom Row: Price Slider & Stock Availability Toggle */}
      <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Price Slider */}
        <div className="w-full sm:w-80 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold text-stone-700">
            <span>الحد الأقصى لسعر المتر:</span>
            <span className="text-[#966b24] font-mono text-sm">{filter.priceRange[1]} ر.س / متر</span>
          </div>
          <input
            type="range"
            min={40}
            max={350}
            step={10}
            value={filter.priceRange[1]}
            onChange={(e) =>
              onChangeFilter({
                ...filter,
                priceRange: [filter.priceRange[0], Number(e.target.value)],
              })
            }
            aria-label="الحد الأقصى لسعر المتر"
            className="w-full accent-[#c6923b] cursor-pointer h-1.5 bg-stone-200 rounded-lg"
          />
        </div>

        {/* Stock Switch */}
        <label className="flex items-center gap-2 cursor-pointer select-none bg-[#f4efe6] hover:bg-[#eae3d5] px-3.5 py-2 rounded-xl border border-[#dcd4c5] transition-colors">
          <input
            type="checkbox"
            checked={filter.inStockOnly}
            onChange={(e) => onChangeFilter({ ...filter, inStockOnly: e.target.checked })}
            className="rounded accent-[#1b2a22] w-4 h-4 cursor-pointer"
          />
          <span className="text-xs font-bold text-stone-800">
            عرض الأقمشة المتوفرة فوراً في المستودع (مخزون &gt; 5 أمتار)
          </span>
        </label>

      </div>

    </div>
  );
};
