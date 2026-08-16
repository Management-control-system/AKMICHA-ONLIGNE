import React, { useState } from 'react';
import {
  Scissors,
  Star,
  Sparkles,
  ShieldCheck,
  Ruler,
  Check,
  ShoppingBag,
  Eye,
  Info,
  Plus,
  Minus,
  Trash2,
} from 'lucide-react';
import { Fabric, FabricColor, CurrencyCode } from '../types';
import { formatPrice } from '../data/currencies';

interface FabricCardProps {
  fabric: Fabric;
  currency: CurrencyCode;
  onOpenDetails: (fabric: Fabric, initialColor?: FabricColor, initialMeters?: number) => void;
  onQuickAddToCart: (fabric: Fabric, color: FabricColor, meters: number) => void;
  onDirectOrder?: (fabric: Fabric, color: FabricColor, meters: number) => void;
  onDeleteFabric?: (fabricId: string) => void;
}

export const FabricCard: React.FC<FabricCardProps> = ({
  fabric,
  currency,
  onOpenDetails,
  onQuickAddToCart,
  onDirectOrder,
  onDeleteFabric,
}) => {
  const [selectedColor, setSelectedColor] = useState<FabricColor>(fabric.colors[0] || {
    id: 'col-1',
    nameAr: 'اللون الأساسي',
    nameEn: 'Base',
    hex: '#c6923b',
    inStockMeters: 50,
    image: fabric.galleryImages[0] || '',
  });
  const [selectedMeters, setSelectedMeters] = useState<number>(1.0);
  const [isAddedToast, setIsAddedToast] = useState(false);

  const calculatedPrice = fabric.pricePerMeter * selectedMeters;
  const currentStock = selectedColor?.inStockMeters ?? 0;
  const isLowStock = currentStock > 0 && currentStock <= 15;
  const isOutOfStock = currentStock <= 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    onQuickAddToCart(fabric, selectedColor, selectedMeters);
    setIsAddedToast(true);
    setTimeout(() => setIsAddedToast(false), 2000);
  };

  const PRESET_LENGTHS = [
    { label: '0.5م (نصف متر)', meters: 0.5 },
    { label: '1.0م (متر)', meters: 1.0 },
    { label: '2.0م (مترين)', meters: 2.0 },
    { label: '3.0م (3 أمتار)', meters: 3.0 },
    { label: '3.5م (طاقة ثوب)', meters: 3.5 },
    { label: '5.0م (5 أمتار)', meters: 5.0 },
  ];

  const handleIncreaseHalf = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedMeters((prev) => Number((prev + 0.5).toFixed(1)));
  };

  const handleDecreaseHalf = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedMeters((prev) => Math.max(0.5, Number((prev - 0.5).toFixed(1))));
  };

  return (
    <div
      onClick={() => onOpenDetails(fabric, selectedColor, selectedMeters)}
      className="group bg-white rounded-2xl border border-[#ded5c5] hover:border-[#c6923b] overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer relative"
    >
      {/* Top Image Container */}
      <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
        <img
          src={selectedColor.image || fabric.galleryImages[0]}
          alt={fabric.nameAr}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
        />

        {/* Gradient overlay for badges */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1 items-start">
          {fabric.isBestSeller && (
            <span className="bg-[#1b2a22] text-[#d8af56] text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs border border-[#d8af56]/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              الأكثر طلباً
            </span>
          )}
          {fabric.isNewArrival && (
            <span className="bg-blue-900 text-blue-100 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
              وصل حديثاً
            </span>
          )}
          {fabric.originalPricePerMeter && (
            <span className="bg-red-700 text-white text-[10px] font-black px-1.5 py-0.5 rounded-md shadow-xs">
              خصم {Math.round(((fabric.originalPricePerMeter - fabric.pricePerMeter) / fabric.originalPricePerMeter) * 100)}%
            </span>
          )}
        </div>

        {/* Top Left: Origin Badge & Admin Delete Button */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
          <span className="bg-white/90 backdrop-blur-xs text-stone-800 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs border border-stone-200">
            {fabric.originAr}
          </span>
          {onDeleteFabric && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm(`هل أنت متأكد من حذف موديل (${fabric.nameAr}) نهائياً من المتجر؟`)) {
                  onDeleteFabric(fabric.id);
                }
              }}
              title="حذف هذا الموديل نهائياً (خاص بالمدير)"
              className="w-6 h-6 rounded-md bg-red-600/90 hover:bg-red-700 text-white flex items-center justify-center shadow-xs transition-colors"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Bottom Image Overlay: Remaining stock roll indicator */}
        <div className="absolute bottom-2.5 right-2.5 left-2.5 flex items-center justify-between text-white text-xs font-semibold">
          <div className="flex items-center gap-1 bg-black/50 backdrop-blur-xs px-2 py-0.5 rounded-md">
            <span
              className={`w-2 h-2 rounded-full ${
                isOutOfStock
                  ? 'bg-red-500'
                  : isLowStock
                  ? 'bg-amber-400 animate-pulse'
                  : 'bg-emerald-400'
              }`}
            />
            <span className="text-[11px]">
              {isOutOfStock
                ? 'نفد المخزون'
                : `المتبقي في اللفة: ${currentStock} متر`}
            </span>
          </div>

          <div className="flex items-center gap-1 bg-black/50 backdrop-blur-xs px-2 py-0.5 rounded-md text-[11px]">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{fabric.rating}</span>
            <span className="text-stone-300 text-[9px]">({fabric.reviewsCount})</span>
          </div>
        </div>
      </div>

      {/* Product Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        
        {/* Fabric Title & Type */}
        <div>
          <div className="flex items-center justify-between text-[11px] text-[#966b24] font-bold mb-0.5">
            <span>{fabric.typeAr}</span>
            <span className="text-stone-400 font-normal">عرض {fabric.widthCm} سم</span>
          </div>
          <h3 className="text-sm font-bold text-stone-900 line-clamp-1 group-hover:text-[#966b24] transition-colors">
            {fabric.nameAr}
          </h3>
          <p className="text-xs text-stone-500 line-clamp-2 mt-1 font-normal leading-relaxed">
            {fabric.descriptionAr}
          </p>
        </div>

        {/* Color Palette Selector */}
        <div className="space-y-1 pt-1">
          <div className="flex items-center justify-between text-[11px] text-stone-500 font-medium">
            <span>اللون: <strong className="text-stone-800">{selectedColor.nameAr}</strong></span>
            <span className="text-[10px] text-stone-400">{fabric.colors.length} ألوان</span>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {fabric.colors.map((color) => {
              const isSelected = selectedColor.id === color.id;
              return (
                <button
                  key={color.id}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedColor(color);
                  }}
                  title={`${color.nameAr} (متوفر ${color.inStockMeters}م)`}
                  className={`w-6 h-6 rounded-full border transition-transform flex items-center justify-center relative ${
                    isSelected
                      ? 'scale-115 border-[#1b2a22] ring-2 ring-[#c6923b]/50'
                      : 'border-black/20 hover:scale-105'
                  }`}
                  style={{ backgroundColor: color.hex }}
                >
                  {isSelected && (
                    <Check
                      className={`w-3 h-3 ${
                        color.hex.toLowerCase() === '#ffffff' || color.hex.toLowerCase() === '#fbfbfd'
                          ? 'text-black'
                          : 'text-white'
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Length Selector Buttons */}
        <div className="bg-[#f7f4ee] rounded-xl p-2.5 space-y-2 border border-[#e8e1d3]">
          <div className="flex items-center justify-between text-[11px] text-stone-700 font-bold">
            <span className="flex items-center gap-1.5 text-stone-900">
              <Scissors className="w-3.5 h-3.5 text-[#966b24]" />
              اختر الطول المطلوب:
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleDecreaseHalf}
                className="w-5 h-5 rounded-md bg-stone-200 hover:bg-stone-300 text-stone-700 flex items-center justify-center font-bold text-xs"
                title="إنقاص نصف متر"
              >
                -
              </button>
              <span className="text-[#966b24] font-black font-mono text-xs px-1.5 py-0.5 bg-white rounded border border-[#d8cfbe]">
                {selectedMeters} م
              </span>
              <button
                type="button"
                onClick={handleIncreaseHalf}
                className="w-5 h-5 rounded-md bg-stone-200 hover:bg-stone-300 text-stone-700 flex items-center justify-center font-bold text-xs"
                title="زيادة نصف متر"
              >
                +
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-1">
            {PRESET_LENGTHS.map((preset) => {
              const isSelected = selectedMeters === preset.meters;
              return (
                <button
                  key={preset.meters}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedMeters(preset.meters);
                  }}
                  className={`py-1.5 px-1 rounded-lg text-[10px] font-black transition-all flex flex-col items-center justify-center leading-tight ${
                    isSelected
                      ? 'bg-[#1b2a22] text-[#d8af56] shadow-xs ring-1 ring-[#c6923b]'
                      : 'bg-white text-stone-700 hover:bg-[#ede5d8] border border-stone-200'
                  }`}
                >
                  <span>{preset.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Price & Order Actions Section */}
        <div className="pt-2.5 border-t border-stone-100 space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-[10px] text-stone-400 font-medium">
              سعر المتر: {formatPrice(fabric.pricePerMeter, currency)}
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-base font-black text-[#1b2a22]">
                {formatPrice(calculatedPrice, currency)}
              </span>
              <span className="text-[10px] text-stone-500 font-medium">
                (لـ {selectedMeters}م)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              disabled={isOutOfStock || selectedMeters > currentStock}
              onClick={(e) => {
                e.stopPropagation();
                if (onDirectOrder) {
                  onDirectOrder(fabric, selectedColor, selectedMeters);
                } else {
                  handleQuickAdd(e);
                }
              }}
              className={`py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 shadow-md ${
                isOutOfStock || selectedMeters > currentStock
                  ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                  : 'bg-[#c6923b] hover:bg-[#b58331] text-stone-950 active:scale-95'
              }`}
            >
              <Scissors className="w-3.5 h-3.5" />
              <span>اطلب الآن مباشرة</span>
            </button>

            <button
              type="button"
              disabled={isOutOfStock || selectedMeters > currentStock}
              onClick={handleQuickAdd}
              className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 border ${
                isOutOfStock || selectedMeters > currentStock
                  ? 'border-stone-200 bg-stone-100 text-stone-400 cursor-not-allowed'
                  : isAddedToast
                  ? 'border-emerald-600 bg-emerald-600 text-white'
                  : 'border-stone-300 bg-white hover:bg-stone-50 text-stone-800 active:scale-95'
              }`}
            >
              {isAddedToast ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>تمت للسلة</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5 text-stone-600" />
                  <span>أضف للسلة</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
