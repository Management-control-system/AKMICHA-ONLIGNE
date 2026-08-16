import React, { useState, useRef } from 'react';
import {
  X,
  Scissors,
  Check,
  Star,
  Ruler,
  ShieldCheck,
  Sparkles,
  ShoppingBag,
  Info,
  ZoomIn,
  Truck,
  Layers,
  Heart,
  Share2,
} from 'lucide-react';
import { Fabric, FabricColor, CurrencyCode } from '../types';
import { formatPrice } from '../data/currencies';

interface FabricDetailModalProps {
  fabric: Fabric | null;
  initialColor?: FabricColor;
  initialMeters?: number;
  currency: CurrencyCode;
  onClose: () => void;
  onAddToCart: (
    fabric: Fabric,
    color: FabricColor,
    meters: number,
    isSampleOnly?: boolean,
    cuttingInstructions?: string
  ) => void;
  onOpenCalculator: () => void;
  onDirectOrder?: (fabric: Fabric, color: FabricColor, meters: number) => void;
}

export const FabricDetailModal: React.FC<FabricDetailModalProps> = ({
  fabric,
  initialColor,
  initialMeters = 1.0,
  currency,
  onClose,
  onAddToCart,
  onOpenCalculator,
  onDirectOrder,
}) => {
  if (!fabric) return null;

  const [selectedColor, setSelectedColor] = useState<FabricColor>(
    initialColor || fabric.colors[0]
  );
  const [selectedMeters, setSelectedMeters] = useState<number>(initialMeters || 1.0);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [cuttingInstructions, setCuttingInstructions] = useState('');
  const [isSampleMode, setIsSampleMode] = useState(false);
  const [isAddedSuccess, setIsAddedSuccess] = useState(false);

  // Magnifier Loupe state
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0, show: false });
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const currentStock = selectedColor?.inStockMeters ?? 0;
  const isOutOfStock = currentStock <= 0;
  const isExceedingStock = !isSampleMode && selectedMeters > currentStock;

  const unitPrice = fabric.pricePerMeter;
  const calculatedTotal = isSampleMode
    ? fabric.samplePrice
    : Number((unitPrice * selectedMeters).toFixed(2));

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y, show: true });
  };

  const handleMouseLeave = () => {
    setZoomPos((prev) => ({ ...prev, show: false }));
  };

  const handleIncrement = (amount: number) => {
    const next = Math.max(fabric.minMeters, Number((selectedMeters + amount).toFixed(2)));
    if (next <= currentStock) {
      setSelectedMeters(next);
    }
  };

  const handleDecrement = (amount: number) => {
    const next = Math.max(fabric.minMeters, Number((selectedMeters - amount).toFixed(2)));
    setSelectedMeters(next);
  };

  const handleDirectMetersChange = (val: string) => {
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      setSelectedMeters(num);
    }
  };

  const handleAdd = () => {
    if (isOutOfStock || isExceedingStock) return;
    onAddToCart(
      fabric,
      selectedColor,
      isSampleMode ? 0.1 : selectedMeters,
      isSampleMode,
      cuttingInstructions
    );
    setIsAddedSuccess(true);
    setTimeout(() => {
      setIsAddedSuccess(false);
      onClose();
    }, 1200);
  };

  const PRESET_LENGTHS = [
    { label: '0.5م (نصف متر)', meters: 0.5 },
    { label: '1.0م (متر كامل)', meters: 1.0 },
    { label: '2.0م (مترين)', meters: 2.0 },
    { label: '3.0م (طاقة عباية)', meters: 3.0 },
    { label: '3.5م (طاقة ثوب رجالي)', meters: 3.5 },
    { label: '5.0م (خمسة أمتار)', meters: 5.0 },
  ];

  const currentImage =
    fabric.galleryImages[activeImageIndex] || selectedColor.image || fabric.galleryImages[0];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      
      {/* Modal Container */}
      <div className="relative bg-[#fcfbf9] rounded-3xl border border-[#ded5c5] shadow-2xl max-w-5xl w-full max-h-[92vh] overflow-y-auto overflow-x-hidden flex flex-col my-auto">
        
        {/* Header Bar */}
        <div className="sticky top-0 z-30 bg-[#fcfbf9]/95 backdrop-blur-md px-6 py-4 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-[#1b2a22] text-[#d8af56] text-xs font-black px-2.5 py-1 rounded-lg">
              {fabric.typeAr}
            </span>
            <span className="text-xs text-stone-500 font-medium hidden sm:inline">
              المنشأ: {fabric.originAr}
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left / Images Gallery & Loupe (5 Cols) */}
          <div className="lg:col-span-6 space-y-4">
            
            {/* Main Interactive Zoom Stage */}
            <div
              ref={imageContainerRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shadow-md cursor-crosshair group select-none"
            >
              <img
                src={currentImage}
                alt={fabric.nameAr}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />

              {/* Magnifier Lens Preview Overlay */}
              {zoomPos.show && (
                <div
                  className="absolute pointer-events-none w-48 h-48 rounded-2xl border-2 border-[#c6923b] shadow-2xl overflow-hidden bg-white hidden sm:block z-20"
                  style={{
                    left: `${zoomPos.x}%`,
                    top: `${zoomPos.y}%`,
                    transform: 'translate(-50%, -50%)',
                    backgroundImage: `url(${currentImage})`,
                    backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                    backgroundSize: '350%',
                    backgroundRepeat: 'no-repeat',
                  }}
                />
              )}

              {/* Floating Helper */}
              <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium px-2.5 py-1 rounded-lg flex items-center gap-1.5 pointer-events-none">
                <ZoomIn className="w-3.5 h-3.5 text-[#d8af56]" />
                <span>حرّك الفأرة لتقريب فحص نسجة القماش</span>
              </div>
            </div>

            {/* Thumbnail selector */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {fabric.galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                    activeImageIndex === idx
                      ? 'border-[#c6923b] ring-2 ring-[#c6923b]/30 scale-105'
                      : 'border-stone-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Fabric Specifications Breakdown Table */}
            <div className="bg-[#f5efe4] rounded-2xl p-4 border border-[#ded5c5] space-y-2.5">
              <h4 className="text-xs font-black text-stone-900 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-[#966b24]" />
                <span>المواصفات التقنية للقماش:</span>
              </h4>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white/80 p-2 rounded-xl">
                  <span className="text-stone-400 block text-[10px]">عرض الطاقة:</span>
                  <strong className="text-stone-800">{fabric.widthCm} سم ({Math.round(fabric.widthCm / 2.54)} إنش)</strong>
                </div>

                <div className="bg-white/80 p-2 rounded-xl">
                  <span className="text-stone-400 block text-[10px]">وزن القماش:</span>
                  <strong className="text-stone-800">{fabric.weightGsm} gsm</strong>
                </div>

                <div className="bg-white/80 p-2 rounded-xl">
                  <span className="text-stone-400 block text-[10px]">التركيبة:</span>
                  <strong className="text-stone-800 line-clamp-1">{fabric.compositionAr}</strong>
                </div>

                <div className="bg-white/80 p-2 rounded-xl">
                  <span className="text-stone-400 block text-[10px]">درجة الوقفة والانسدال:</span>
                  <strong className="text-stone-800">{fabric.drapeAr}</strong>
                </div>

                <div className="bg-white/80 p-2 rounded-xl">
                  <span className="text-stone-400 block text-[10px]">المرونة والتمدد:</span>
                  <strong className="text-stone-800">{fabric.stretchAr}</strong>
                </div>

                <div className="bg-white/80 p-2 rounded-xl">
                  <span className="text-stone-400 block text-[10px]">الموسم الملائم:</span>
                  <strong className="text-stone-800">{fabric.seasonAr}</strong>
                </div>
              </div>

              {/* Care instruction bullets */}
              <div className="pt-2 border-t border-stone-300">
                <span className="text-[11px] font-bold text-stone-700 block mb-1">تعليمات العناية:</span>
                <ul className="text-[11px] text-stone-600 space-y-0.5 list-disc list-inside">
                  {fabric.careInstructionsAr.map((inst, i) => (
                    <li key={i}>{inst}</li>
                  ))}
                </ul>
              </div>
            </div>

          </div>

          {/* Right / Fabric Selection & Precision Length Calculator (7 Cols) */}
          <div className="lg:col-span-6 space-y-5">
            
            {/* Header info */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{fabric.rating}</span>
                </div>
                <span className="text-xs text-stone-400">({fabric.reviewsCount} تقييم حقيقي)</span>
                <span className="text-stone-300">•</span>
                <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                  متوفر جاهز للقص الفوري
                </span>
              </div>

              <h2 className="text-2xl font-black text-[#1b2a22] font-['Cairo']">
                {fabric.nameAr}
              </h2>
              <p className="text-xs text-stone-500 font-mono mt-0.5">{fabric.nameEn}</p>
              <p className="text-xs text-stone-600 leading-relaxed mt-2">
                {fabric.descriptionAr}
              </p>
            </div>

            {/* Color Palette Selector */}
            <div className="space-y-2 bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-stone-800">
                  اختر اللون: <strong className="text-[#966b24]">{selectedColor.nameAr}</strong>
                </span>
                <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                  المتبقي في اللفة: {currentStock} متر
                </span>
              </div>

              <div className="flex items-center gap-2 flex-wrap pt-1">
                {fabric.colors.map((c) => {
                  const isSelected = selectedColor.id === c.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setSelectedColor(c)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                        isSelected
                          ? 'bg-[#1b2a22] text-white border-[#1b2a22] shadow-sm'
                          : 'bg-white text-stone-700 hover:bg-stone-100 border-stone-300'
                      }`}
                    >
                      <span
                        className="w-4 h-4 rounded-full border border-black/20"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span>{c.nameAr}</span>
                      <span className="text-[10px] opacity-70">({c.inStockMeters}م)</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mode Switch: Custom Meters vs Sample Swatch */}
            <div className="grid grid-cols-2 gap-2 bg-[#eae3d5] p-1 rounded-xl">
              <button
                onClick={() => setIsSampleMode(false)}
                className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  !isSampleMode
                    ? 'bg-white text-[#1b2a22] shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Scissors className="w-3.5 h-3.5 text-[#966b24]" />
                <span>شراء بالأمتار (قص مخصص)</span>
              </button>

              <button
                onClick={() => setIsSampleMode(true)}
                className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  isSampleMode
                    ? 'bg-white text-[#1b2a22] shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#966b24]" />
                <span>طلب عينة قماش (10×10 سم)</span>
              </button>
            </div>

            {/* PRECISION LENGTH SELECTOR & LIVE CALCULATOR */}
            {!isSampleMode ? (
              <div className="bg-[#f7f4ee] p-4 sm:p-5 rounded-2xl border border-[#ded5c5] space-y-4">
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Scissors className="w-4 h-4 text-[#966b24]" />
                    <span className="text-xs font-black text-stone-900">
                      حدد طول القماش المطلوب بالمتر:
                    </span>
                  </div>

                  <button
                    onClick={onOpenCalculator}
                    className="text-[11px] font-bold text-[#966b24] hover:underline flex items-center gap-1"
                  >
                    <Ruler className="w-3 h-3" />
                    حاسبة قياس الأمتار
                  </button>
                </div>

                {/* Fine Increment Stepper & Direct Input */}
                <div className="flex items-center gap-2 justify-center bg-white p-2 rounded-2xl border border-[#ded5c5]">
                  <button
                    onClick={() => handleDecrement(0.5)}
                    className="px-3 py-2 bg-stone-100 hover:bg-stone-200 rounded-xl text-xs font-bold text-stone-700 active:scale-95"
                  >
                    - 0.5م
                  </button>
                  <button
                    onClick={() => handleDecrement(0.25)}
                    className="px-3 py-2 bg-stone-100 hover:bg-stone-200 rounded-xl text-xs font-bold text-stone-700 active:scale-95"
                  >
                    - 0.25م
                  </button>

                  <div className="flex-1 max-w-[130px] relative">
                    <input
                      type="number"
                      step={fabric.meterStep}
                      min={fabric.minMeters}
                      max={currentStock}
                      value={selectedMeters}
                      onChange={(e) => handleDirectMetersChange(e.target.value)}
                      aria-label="طول القماش بالمتر"
                      className="w-full text-center text-xl font-black font-mono text-[#1b2a22] bg-[#f7f4ee] rounded-xl py-1.5 border border-[#dcd4c5] outline-none focus:border-[#c6923b]"
                    />
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-400">
                      متر
                    </span>
                  </div>

                  <button
                    onClick={() => handleIncrement(0.25)}
                    className="px-3 py-2 bg-stone-100 hover:bg-stone-200 rounded-xl text-xs font-bold text-stone-700 active:scale-95"
                  >
                    + 0.25م
                  </button>
                  <button
                    onClick={() => handleIncrement(0.5)}
                    className="px-3 py-2 bg-stone-100 hover:bg-stone-200 rounded-xl text-xs font-bold text-stone-700 active:scale-95"
                  >
                    + 0.5م
                  </button>
                </div>

                {/* Preset Fast Length Buttons */}
                <div className="grid grid-cols-3 sm:grid-cols-3 gap-1.5">
                  {PRESET_LENGTHS.map((preset) => {
                    const isSelected = selectedMeters === preset.meters;
                    return (
                      <button
                        key={preset.meters}
                        onClick={() => setSelectedMeters(preset.meters)}
                        className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all text-center ${
                          isSelected
                            ? 'bg-[#1b2a22] text-[#d8af56] shadow-xs'
                            : 'bg-white text-stone-700 hover:bg-[#ede5d8] border border-stone-200'
                        }`}
                      >
                        {preset.label}
                      </button>
                    );
                  })}
                </div>

                {/* Stock Warning or Safety Meter Bar */}
                {isExceedingStock ? (
                  <div className="bg-red-50 text-red-700 p-2.5 rounded-xl text-xs font-bold border border-red-200">
                    ⚠️ الكمية المطلوبة ({selectedMeters} متر) تتجاوز المخزون المتبقي في هذه اللفة ({currentStock} متر). يرجى تقليل الطول.
                  </div>
                ) : (
                  <div className="text-[11px] text-stone-500 flex items-center justify-between px-1">
                    <span>المتبقي في لفة المخزون بعد القص:</span>
                    <strong className="text-stone-800 font-mono">
                      {(currentStock - selectedMeters).toFixed(2)} متر
                    </strong>
                  </div>
                )}

                {/* Special Cutting Instructions Note */}
                <div className="space-y-1 pt-1">
                  <label className="text-xs font-bold text-stone-700 block">
                    ملاحظات أو تقسيمات القص (اختياري):
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: يرجى قصها قطعتين (3.5 متر للثوب + 1.5 متر جلابية)..."
                    value={cuttingInstructions}
                    onChange={(e) => setCuttingInstructions(e.target.value)}
                    className="w-full text-xs bg-white border border-[#dcd4c5] rounded-xl px-3 py-2 outline-none focus:border-[#c6923b]"
                  />
                </div>

              </div>
            ) : (
              /* Sample Swatch Notice */
              <div className="bg-amber-50/80 border border-amber-200 p-4 rounded-2xl text-xs text-amber-900 space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm text-[#966b24]">
                  <Sparkles className="w-4 h-4" />
                  <span>عينة قماش حقيقية 10×10 سم</span>
                </div>
                <p>
                  نرسل لك عينة فعلية من هذا القماش واللون المختار مجهزة ومرفق معها بطاقة المواصفات للتأكد من ملمس القماش وانسيابيته وتوافقه مع ذوقك قبل طلب أمتار كاملة.
                </p>
                <div className="font-bold text-stone-900">
                  سعر العينة: {formatPrice(fabric.samplePrice, currency)}
                </div>
              </div>
            )}

            {/* Total Computation & Final Add to Cart Bar */}
            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="text-xs text-stone-500 font-medium">
                  {isSampleMode
                    ? 'تكلفة العينة:'
                    : `التكلفة الإجمالية لـ (${selectedMeters} متر):`}
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-black text-[#1b2a22]">
                    {formatPrice(calculatedTotal, currency)}
                  </span>
                  {!isSampleMode && (
                    <span className="text-xs text-stone-400">
                      ({formatPrice(unitPrice, currency)} / متر)
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                {onDirectOrder && (
                  <button
                    disabled={isOutOfStock || isExceedingStock}
                    onClick={() => {
                      onDirectOrder(fabric, selectedColor, isSampleMode ? 1.0 : selectedMeters);
                      onClose();
                    }}
                    className={`px-6 py-3.5 rounded-xl font-black text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 ${
                      isOutOfStock || isExceedingStock
                        ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                        : 'bg-[#c6923b] hover:bg-[#b58331] text-stone-950'
                    }`}
                  >
                    <Scissors className="w-4 h-4 text-stone-950" />
                    <span>شراء وتوصيل مباشر الآن</span>
                  </button>
                )}

                <button
                  disabled={isOutOfStock || isExceedingStock}
                  onClick={handleAdd}
                  className={`px-6 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 border transition-all active:scale-95 ${
                    isOutOfStock || isExceedingStock
                      ? 'border-stone-200 bg-stone-100 text-stone-400 cursor-not-allowed'
                      : isAddedSuccess
                      ? 'border-emerald-700 bg-emerald-700 text-white'
                      : 'border-stone-300 bg-white hover:bg-stone-50 text-stone-800'
                  }`}
                >
                  {isAddedSuccess ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>تمت الإضافة للسلة!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>
                        {isSampleMode ? 'أضف العينة للسلة' : `أضف للسلة`}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
