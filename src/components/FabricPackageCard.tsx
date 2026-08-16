import React, { useState } from 'react';
import { Scissors, Check, ShoppingBag, Trash2, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Fabric, FabricColor, CurrencyCode } from '../types';
import { formatPrice } from '../data/currencies';

interface FabricPackageCardProps {
  fabric: Fabric;
  currency: CurrencyCode;
  onDirectOrder: (fabric: Fabric, color: FabricColor, meters: number) => void;
  onAddToCart: (fabric: Fabric, color: FabricColor, meters: number) => void;
  onDelete?: (fabricId: string) => void;
}

export const FabricPackageCard: React.FC<FabricPackageCardProps> = ({
  fabric,
  currency,
  onDirectOrder,
  onAddToCart,
  onDelete,
}) => {
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [meters, setMeters] = useState<number>(2.0);
  const [addedSuccess, setAddedSuccess] = useState(false);

  const colors = fabric.colors && fabric.colors.length > 0 ? fabric.colors : [
    {
      id: 'default',
      nameAr: 'اللون المعروض',
      nameEn: 'Displayed',
      hex: '#c6923b',
      inStockMeters: 50,
      image: fabric.galleryImages[0] || '',
    }
  ];

  const activeColor = colors[selectedColorIndex] || colors[0];
  const activeImage = activeColor.image || fabric.galleryImages[0];
  const isOutOfStock = activeColor.inStockMeters <= 0;
  const totalPrice = fabric.pricePerMeter * meters;

  const PRESET_METERS = [1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 5.0];

  const handleAdd = () => {
    if (isOutOfStock) return;
    onAddToCart(fabric, activeColor, meters);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2000);
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between relative group">
      
      {/* 1. Main Picture / Image Header */}
      <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
        <img
          src={activeImage}
          alt={fabric.nameAr}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Delete button (Admin only) */}
        {onDelete && (
          <button
            onClick={() => {
              if (window.confirm(`هل أنت متأكد من حذف حزمة (${fabric.nameAr})؟`)) {
                onDelete(fabric.id);
              }
            }}
            title="حذف هذه الحزمة"
            className="absolute top-3 left-3 w-8 h-8 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-md transition-all cursor-pointer z-10"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}

        {/* Stock Status Badge */}
        <div className="absolute bottom-3 right-3 bg-stone-900/80 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-xl">
          {isOutOfStock ? (
            <span className="text-red-400">نفد المخزون</span>
          ) : (
            <span>متوفر: {activeColor.inStockMeters} متر</span>
          )}
        </div>

        {/* Price tag badge in DZD */}
        <div className="absolute top-3 right-3 bg-stone-900 text-amber-400 text-xs font-black px-3 py-1.5 rounded-xl shadow-sm border border-stone-800">
          {formatPrice(fabric.pricePerMeter, currency)} / للمتر
        </div>
      </div>

      {/* 2. Package Details & Title */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        
        <div>
          <h2 className="text-base font-black text-stone-900 font-['Cairo'] leading-snug">
            {fabric.nameAr}
          </h2>
          {fabric.descriptionAr && (
            <p className="text-xs text-stone-500 line-clamp-2 mt-1 leading-relaxed">
              {fabric.descriptionAr}
            </p>
          )}
        </div>

        {/* Color / Variety Selection if more than 1 image/color */}
        {colors.length > 1 && (
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-xs font-bold text-stone-600">
              <span>اختر الحزمة / اللون:</span>
              <span className="text-stone-900">{activeColor.nameAr}</span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {colors.map((color, idx) => (
                <button
                  key={color.id || idx}
                  onClick={() => setSelectedColorIndex(idx)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    selectedColorIndex === idx
                      ? 'border-stone-900 bg-stone-900 text-white shadow-xs'
                      : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700'
                  }`}
                >
                  <span
                    className="w-3 h-3 rounded-full border border-black/20 shrink-0"
                    style={{ backgroundColor: color.hex || '#ddd' }}
                  />
                  <span>{color.nameAr}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Length / Meter Selector */}
        <div className="bg-stone-50/80 rounded-2xl p-3.5 border border-stone-200/70 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-700 flex items-center gap-1">
              <Scissors className="w-3.5 h-3.5 text-amber-600" />
              حدد عدد الأمتار المطلوبة:
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setMeters((prev) => Math.max(0.5, Number((prev - 0.5).toFixed(1))))}
                className="w-7 h-7 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-900 font-black text-sm flex items-center justify-center cursor-pointer transition-colors"
              >
                -
              </button>
              <span className="px-2.5 py-1 bg-white rounded-lg border border-stone-200 font-mono font-black text-xs text-stone-900 shadow-xs">
                {meters} م
              </span>
              <button
                type="button"
                onClick={() => setMeters((prev) => Number((prev + 0.5).toFixed(1)))}
                className="w-7 h-7 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-900 font-black text-sm flex items-center justify-center cursor-pointer transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Quick chips */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {PRESET_METERS.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMeters(m)}
                className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  meters === m
                    ? 'bg-stone-900 text-amber-400 font-black'
                    : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
                }`}
              >
                {m} م
              </button>
            ))}
          </div>

          {/* Total calculation line */}
          <div className="pt-2 border-t border-stone-200/80 flex items-center justify-between text-xs">
            <span className="text-stone-500">المجموع لـ ({meters} متر):</span>
            <span className="text-stone-900 font-black text-sm font-mono">
              {formatPrice(totalPrice, currency)}
            </span>
          </div>
        </div>

        {/* 3. Direct Order Action Button */}
        <div className="space-y-2 pt-1">
          <button
            disabled={isOutOfStock}
            onClick={() => onDirectOrder(fabric, activeColor, meters)}
            className={`w-full py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-xs transition-all active:scale-98 cursor-pointer ${
              isOutOfStock
                ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                : 'bg-amber-600 hover:bg-amber-700 text-white shadow-sm'
            }`}
          >
            <Scissors className="w-4 h-4" />
            <span>اطلب الآن مباشرة (توصيل للمنزل)</span>
          </button>

          <button
            disabled={isOutOfStock}
            onClick={handleAdd}
            className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
              isOutOfStock
                ? 'border-stone-200 bg-stone-50 text-stone-400 cursor-not-allowed'
                : addedSuccess
                ? 'border-emerald-600 bg-emerald-600 text-white'
                : 'border-stone-300 bg-white hover:bg-stone-50 text-stone-800'
            }`}
          >
            {addedSuccess ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>تمت الإضافة للسلة بنجاح!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>أضف إلى السلة</span>
              </>
            )}
          </button>
        </div>

      </div>

    </div>
  );
};

