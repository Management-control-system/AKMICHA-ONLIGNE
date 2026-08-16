import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  Plus,
  Trash2,
  Scissors,
  Check,
  Sparkles,
  Image as ImageIcon,
  Ruler,
  Tag,
  DollarSign,
  Layers,
} from 'lucide-react';
import { Fabric, FabricCategory, FabricColor, CurrencyCode } from '../types';
import { CURRENCIES } from '../data/currencies';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddFabric: (newFabric: Fabric) => void;
  currency: CurrencyCode;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  onAddFabric,
  currency,
}) => {
  const [nameAr, setNameAr] = useState('');
  const [typeAr, setTypeAr] = useState('قماش مشجر قطني');
  const [category, setCategory] = useState<FabricCategory>('cotton');
  const [pricePerMeter, setPricePerMeter] = useState<number>(45);
  const [minMeters, setMinMeters] = useState<number>(0.5);
  const [widthCm, setWidthCm] = useState<number>(140);
  const [stockMeters, setStockMeters] = useState<number>(50);
  const [descriptionAr, setDescriptionAr] = useState('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedColorHex, setSelectedColorHex] = useState<string>('#dfd7cd');
  const [colorNameAr, setColorNameAr] = useState<string>('بيج مشجر ورود');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Quick preset sample pictures
  const PRESET_FABRIC_IMAGES = [
    {
      title: 'قماش مشجر ورود ريفي (مثل صورتك)',
      url: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=1000&q=80',
    },
    {
      title: 'قماش قطن زهور ناعم',
      url: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&w=1000&q=80',
    },
    {
      title: 'قماش كتان طبيعي ناعم',
      url: 'https://images.unsplash.com/photo-1528458909336-e7a0adfed0a5?auto=format&fit=crop&w=1000&q=80',
    },
    {
      title: 'حرير ملون فاخر',
      url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=80',
    },
  ];

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImagePreview(base64);
        setImageUrl(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImagePreview(base64);
        setImageUrl(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameAr.trim()) {
      alert('يرجى كتابة اسم الموديل أو نوع القماش');
      return;
    }

    const finalImage =
      imageUrl ||
      imagePreview ||
      'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=1000&q=80';

    const colorObj: FabricColor = {
      id: `col-${Date.now()}`,
      nameAr: colorNameAr || 'لون الموديل الأساسي',
      nameEn: 'Base Color',
      hex: selectedColorHex,
      inStockMeters: stockMeters,
      image: finalImage,
    };

    const newFabric: Fabric = {
      id: `fab-custom-${Date.now()}`,
      nameAr: nameAr.trim(),
      nameEn: nameAr.trim(),
      category: category,
      typeAr: typeAr.trim() || 'قماش فاخر',
      typeEn: 'Premium Fabric',
      descriptionAr:
        descriptionAr.trim() ||
        'قماش فاخر عالي الجودة متوفر للطلب بالقص المباشر بالمتر ونصف المتر مع سرعة الشحن والتوصيل.',
      descriptionEn: 'High quality premium fabric available per meter with precision cutting.',
      pricePerMeter: Number(pricePerMeter),
      samplePrice: 10,
      minMeters: minMeters,
      meterStep: 0.25,
      widthCm: widthCm,
      weightGsm: 140,
      compositionAr: '100% قطن طبيعي عالي الجودة',
      compositionEn: '100% Premium Cotton',
      drapeAr: 'انسيابي وناعم',
      stretchAr: 'بدون ليكرا',
      seasonAr: 'صيفي ولجميع الفصول',
      patternAr: 'مشجر / ورود',
      originAr: 'مستورد نخب أول',
      originEn: 'Imported',
      tags: ['جديد', 'مشجر', 'أقمشة أونلاين'],
      usesAr: ['فساتين', 'جلابيات', 'شراشف وأطقم', 'ملابس أطفال'],
      rating: 5.0,
      reviewsCount: 1,
      isNewArrival: true,
      colors: [colorObj],
      galleryImages: [finalImage],
      careInstructionsAr: [
        'غسيل بماء بارد أو دافئ للحفاظ على جودة الألوان',
        'كوي بدرجة حرارة معتدلة',
      ],
    };

    setIsSubmitting(true);
    setTimeout(() => {
      onAddFabric(newFabric);
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="relative bg-white rounded-3xl border border-[#d8cfbe] shadow-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto flex flex-col my-auto">
        
        {/* Modal Header */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1b2a22] flex items-center justify-center text-[#d8af56] shadow-sm">
              <Plus className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-[#1b2a22] font-['Cairo']">
                إضافة موديل قماش جديد
              </h2>
              <p className="text-xs text-stone-500 font-medium">
                حمل صورة القماش وحدد سعر المتر ليتمكن زبائنك من شرائه فوراً
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* 1. Image Upload Section */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-stone-800">
              صورة موديل القماش <span className="text-red-500">*</span>
            </label>

            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[160px] ${
                imagePreview
                  ? 'border-[#c6923b] bg-amber-50/20'
                  : 'border-stone-300 hover:border-[#c6923b] bg-stone-50/60 hover:bg-amber-50/10'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageFileChange}
                className="hidden"
              />

              {imagePreview ? (
                <div className="relative group w-full flex flex-col items-center">
                  <img
                    src={imagePreview}
                    alt="معاينة صورة الموديل"
                    className="max-h-48 rounded-xl object-contain shadow-md border border-stone-200"
                  />
                  <span className="text-[11px] text-[#966b24] font-bold mt-2 bg-amber-100/70 px-3 py-1 rounded-full">
                    اضغط لتغيير الصورة
                  </span>
                </div>
              ) : (
                <div className="space-y-2 py-4">
                  <div className="w-12 h-12 mx-auto rounded-full bg-amber-100 text-[#966b24] flex items-center justify-center shadow-xs">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div className="text-xs font-bold text-stone-700">
                    اضغط هنا لتحميل صورة القماش من جهازك أو هاتفك
                  </div>
                  <p className="text-[11px] text-stone-400">
                    يدعم JPG, PNG, WEBP (يمكنك سحب وإفلات الصورة هنا مباشرة)
                  </p>
                </div>
              )}
            </div>

            {/* Quick URL paste or Sample Picker */}
            <div className="pt-1 flex flex-col gap-1.5">
              <div className="text-[11px] text-stone-500 font-medium">أو اختر صورة جاهزة كنموذج سريع:</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {PRESET_FABRIC_IMAGES.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setImageUrl(preset.url);
                      setImagePreview(preset.url);
                    }}
                    className={`p-1.5 rounded-xl border text-right flex items-center gap-2 transition-all ${
                      imagePreview === preset.url
                        ? 'border-[#c6923b] bg-amber-50 text-[#966b24]'
                        : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-600'
                    }`}
                  >
                    <img
                      src={preset.url}
                      alt={preset.title}
                      className="w-7 h-7 rounded-lg object-cover"
                    />
                    <span className="text-[10px] font-bold truncate">{preset.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 2. Basic Info (Name, Price, Category) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Fabric Name */}
            <div className="space-y-1 sm:col-span-2">
              <label className="block text-xs font-bold text-stone-800">
                اسم الموديل / القماش <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={nameAr}
                onChange={(e) => setNameAr(e.target.value)}
                placeholder="مثال: قماش قطني مشجر ورود ريفية بيج"
                className="w-full bg-[#fbf9f5] border border-stone-300 focus:border-[#c6923b] rounded-xl px-3.5 py-2.5 text-sm font-semibold outline-none transition-all"
              />
            </div>

            {/* Price Per Meter */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-stone-800 flex items-center justify-between">
                <span>سعر المتر الواحد <span className="text-red-500">*</span></span>
                <span className="text-[11px] text-[#966b24] font-bold">
                  {CURRENCIES[currency]?.symbolAr}
                </span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={1}
                  step={0.5}
                  required
                  value={pricePerMeter}
                  onChange={(e) => setPricePerMeter(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#fbf9f5] border border-stone-300 focus:border-[#c6923b] rounded-xl px-3.5 py-2.5 text-sm font-black text-[#1b2a22] outline-none"
                />
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-400">
                  {CURRENCIES[currency]?.symbolAr} / متر
                </span>
              </div>
            </div>

            {/* In-Stock Meters */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-stone-800">
                كمية اللفة المتوفرة (بالمتر)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={1}
                  step={1}
                  value={stockMeters}
                  onChange={(e) => setStockMeters(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#fbf9f5] border border-stone-300 focus:border-[#c6923b] rounded-xl px-3.5 py-2.5 text-sm font-bold outline-none"
                />
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-400">
                  متر متوفر
                </span>
              </div>
            </div>

            {/* Fabric Type */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-stone-800">
                النوع / الخامة
              </label>
              <input
                type="text"
                value={typeAr}
                onChange={(e) => setTypeAr(e.target.value)}
                placeholder="مثال: قطن طبيعي، كتان، حرير، كريب..."
                className="w-full bg-[#fbf9f5] border border-stone-300 focus:border-[#c6923b] rounded-xl px-3.5 py-2 text-xs font-semibold outline-none"
              />
            </div>

            {/* Minimum Allowed Meter */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-stone-800">
                أقل كمية للقص
              </label>
              <select
                value={minMeters}
                onChange={(e) => setMinMeters(parseFloat(e.target.value))}
                className="w-full bg-[#fbf9f5] border border-stone-300 focus:border-[#c6923b] rounded-xl px-3 py-2 text-xs font-bold outline-none"
              >
                <option value={0.5}>نصف متر (0.5 م)</option>
                <option value={1.0}>متر كامل (1.0 م)</option>
                <option value={2.0}>مترين (2.0 م)</option>
              </select>
            </div>

            {/* Fabric Width */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-stone-800">
                عرض القماش (سم)
              </label>
              <select
                value={widthCm}
                onChange={(e) => setWidthCm(parseInt(e.target.value))}
                className="w-full bg-[#fbf9f5] border border-stone-300 focus:border-[#c6923b] rounded-xl px-3 py-2 text-xs font-bold outline-none"
              >
                <option value={140}>عرض عادي (140 سم / 58 إنش)</option>
                <option value={150}>عرض 150 سم (60 إنش)</option>
                <option value={170}>عرضين عريض (170 سم / 68 إنش للعبايات والستائر)</option>
                <option value={280}>عرض كبير للمفارش والستائر (280 سم)</option>
              </select>
            </div>

            {/* Color Details */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-stone-800">
                اسم ولون الموديل
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={selectedColorHex}
                  onChange={(e) => setSelectedColorHex(e.target.value)}
                  className="w-9 h-9 p-0.5 rounded-xl border border-stone-300 cursor-pointer bg-white"
                />
                <input
                  type="text"
                  value={colorNameAr}
                  onChange={(e) => setColorNameAr(e.target.value)}
                  placeholder="مثال: بيج مشجر، وردي، أبيض..."
                  className="flex-1 bg-[#fbf9f5] border border-stone-300 focus:border-[#c6923b] rounded-xl px-3 py-2 text-xs font-semibold outline-none"
                />
              </div>
            </div>

          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-stone-800">
              وصف الموديل واستخداماته (اختياري)
            </label>
            <textarea
              rows={2}
              value={descriptionAr}
              onChange={(e) => setDescriptionAr(e.target.value)}
              placeholder="مثال: قماش مريح خفيف وناعم للملابس والفساتين الصيفية وأطقم النوم والشراشف..."
              className="w-full bg-[#fbf9f5] border border-stone-300 focus:border-[#c6923b] rounded-xl px-3.5 py-2 text-xs font-medium outline-none"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100 transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl text-xs font-black bg-[#c6923b] hover:bg-[#b58331] text-stone-950 flex items-center gap-2 shadow-md transition-all active:scale-95"
            >
              {isSubmitting ? (
                <span>جاري الحفظ ونشر الموديل...</span>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>حفظ ونشر الموديل في المتجر</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
