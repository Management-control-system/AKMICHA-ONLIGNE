import React, { useState } from 'react';
import {
  X,
  Layers,
  Plus,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Scissors,
  Package,
  Sparkles,
  TrendingUp,
  Search,
} from 'lucide-react';
import { Fabric, FabricColor, CurrencyCode } from '../types';
import { formatPrice } from '../data/currencies';
import { INITIAL_FABRICS } from '../data/fabrics';

interface InventoryManagerModalProps {
  fabrics: Fabric[];
  currency: CurrencyCode;
  onClose: () => void;
  onUpdateColorStock: (fabricId: string, colorId: string, newMeters: number) => void;
  onResetToDefault: () => void;
}

export const InventoryManagerModal: React.FC<InventoryManagerModalProps> = ({
  fabrics,
  currency,
  onClose,
  onUpdateColorStock,
  onResetToDefault,
}) => {
  const [searchFilter, setSearchFilter] = useState('');
  const [onlyLowStock, setOnlyLowStock] = useState(false);

  // Restock modal helper state
  const [restockingTarget, setRestockingTarget] = useState<{
    fabric: Fabric;
    color: FabricColor;
  } | null>(null);
  const [addedMeters, setAddedMeters] = useState<number>(30);

  const totalWarehouseMeters = fabrics.reduce(
    (sum, f) => sum + f.colors.reduce((cSum, c) => cSum + c.inStockMeters, 0),
    0
  );

  const totalWarehouseValue = fabrics.reduce(
    (sum, f) => sum + f.colors.reduce((cSum, c) => cSum + c.inStockMeters * f.pricePerMeter, 0),
    0
  );

  const totalLowStockRolls = fabrics.reduce(
    (sum, f) => sum + f.colors.filter((c) => c.inStockMeters > 0 && c.inStockMeters <= 15).length,
    0
  );

  const totalEmptyRolls = fabrics.reduce(
    (sum, f) => sum + f.colors.filter((c) => c.inStockMeters <= 0).length,
    0
  );

  const handleApplyRestock = () => {
    if (!restockingTarget) return;
    const newMeters = Number((restockingTarget.color.inStockMeters + addedMeters).toFixed(2));
    onUpdateColorStock(restockingTarget.fabric.id, restockingTarget.color.id, newMeters);
    setRestockingTarget(null);
  };

  const filteredFabrics = fabrics.filter((fabric) => {
    const matchesSearch =
      fabric.nameAr.includes(searchFilter) ||
      fabric.typeAr.includes(searchFilter) ||
      fabric.originAr.includes(searchFilter);

    if (onlyLowStock) {
      const hasLow = fabric.colors.some((c) => c.inStockMeters <= 15);
      return matchesSearch && hasLow;
    }
    return matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="relative bg-[#fcfbf9] rounded-3xl border border-[#ded5c5] shadow-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto flex flex-col my-auto">
        
        {/* Header Bar */}
        <div className="sticky top-0 z-30 bg-[#fcfbf9]/95 backdrop-blur-md px-6 py-4 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#1b2a22] flex items-center justify-center text-[#d8af56]">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-[#1b2a22] font-['Cairo']">
                لوحة إدارة المخزون الحي ولفات الأقمشة
              </h2>
              <span className="text-[11px] text-stone-500 font-medium">
                تحديث تلقائي للمخزون مع كل عملية قص وشراء
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onResetToDefault}
              className="text-[11px] font-bold text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1"
              title="إعادة تعيين أمتار المخزون إلى القيم الافتراضية"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">إعادة ضبط المستودع</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-7 space-y-6">
          
          {/* Warehouse Summary KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            
            <div className="bg-[#1b2a22] text-[#f4efe6] p-4 rounded-2xl border border-[#d8af56]/30 shadow-xs">
              <span className="text-[10px] text-[#d8af56] font-bold block">إجمالي أمتار المخزون:</span>
              <strong className="text-xl sm:text-2xl font-mono font-black text-white">
                {totalWarehouseMeters.toFixed(1)} م
              </strong>
              <span className="text-[10px] text-stone-400 block mt-0.5">جاهزة للقص الفوري</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
              <span className="text-[10px] text-stone-500 font-bold block">القيمة الإجمالية للمخزون:</span>
              <strong className="text-base sm:text-lg font-mono font-black text-[#1b2a22]">
                {formatPrice(totalWarehouseValue, currency)}
              </strong>
              <span className="text-[10px] text-emerald-700 block mt-0.5">أقمشة نخب أول</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
              <span className="text-[10px] text-amber-700 font-bold block">لفات قاربت على النفاد:</span>
              <strong className="text-xl font-mono font-black text-amber-700">
                {totalLowStockRolls} لفة
              </strong>
              <span className="text-[10px] text-stone-500 block mt-0.5">&lt; 15 متر متبقية</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
              <span className="text-[10px] text-stone-500 font-bold block">أنواع الأقمشة المسجلة:</span>
              <strong className="text-xl font-mono font-black text-stone-900">
                {fabrics.length} أنواع
              </strong>
              <span className="text-[10px] text-stone-400 block mt-0.5">متعددة الألوان والدرجات</span>
            </div>

          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="ابحث في المخزون..."
                className="w-full bg-[#f4efe6] border border-[#dcd4c5] rounded-xl pr-9 pl-3 py-2 text-xs font-semibold outline-none focus:border-[#c6923b]"
              />
              <Search className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>

            <label className="flex items-center gap-2 cursor-pointer select-none bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-xl border border-amber-200 text-xs text-amber-900 font-bold">
              <input
                type="checkbox"
                checked={onlyLowStock}
                onChange={(e) => setOnlyLowStock(e.target.checked)}
                className="accent-amber-700 rounded"
              />
              <span>عرض اللفات التي تحتاج لإعادة التزويد فقط</span>
            </label>
          </div>

          {/* Fabrics Inventory Rolls List */}
          <div className="space-y-4">
            {filteredFabrics.map((fabric) => (
              <div
                key={fabric.id}
                className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                  <div className="flex items-center gap-3">
                    <img
                      src={fabric.galleryImages[0]}
                      alt=""
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-xl object-cover border border-stone-200"
                    />
                    <div>
                      <h3 className="text-xs font-bold text-stone-900">{fabric.nameAr}</h3>
                      <span className="text-[10px] text-[#966b24] font-semibold">
                        {fabric.typeAr} • {fabric.originAr} • {formatPrice(fabric.pricePerMeter, currency)} / متر
                      </span>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-stone-600 font-mono">
                    عرض: {fabric.widthCm} سم
                  </span>
                </div>

                {/* Rolls per Color */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {fabric.colors.map((color) => {
                    const isLow = color.inStockMeters > 0 && color.inStockMeters <= 15;
                    const isEmpty = color.inStockMeters <= 0;

                    return (
                      <div
                        key={color.id}
                        className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 transition-all ${
                          isEmpty
                            ? 'bg-red-50/70 border-red-200'
                            : isLow
                            ? 'bg-amber-50/70 border-amber-200'
                            : 'bg-stone-50 border-stone-200'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className="w-4 h-4 rounded-full border border-black/20 flex-shrink-0"
                            style={{ backgroundColor: color.hex }}
                          />
                          <div className="min-w-0">
                            <span className="text-xs font-bold text-stone-800 block truncate">
                              {color.nameAr}
                            </span>
                            <span
                              className={`text-[10px] font-mono font-bold ${
                                isEmpty
                                  ? 'text-red-700'
                                  : isLow
                                  ? 'text-amber-800'
                                  : 'text-emerald-700'
                              }`}
                            >
                              {isEmpty
                                ? 'نفد (0 م)'
                                : `المتبقي: ${color.inStockMeters} متر`}
                            </span>
                          </div>
                        </div>

                        {/* Restock Button */}
                        <button
                          onClick={() => setRestockingTarget({ fabric, color })}
                          className="px-2 py-1 rounded-lg bg-white hover:bg-stone-100 border border-stone-200 text-stone-700 text-[10px] font-bold shadow-2xs flex items-center gap-1 active:scale-95"
                          title="إضافة أمتار إلى هذه اللفة"
                        >
                          <Plus className="w-3 h-3 text-[#966b24]" />
                          <span>تزويد</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* Mini Restock Dialog */}
      {restockingTarget && (
        <div className="fixed inset-0 z-60 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-2xl max-w-sm w-full space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black text-stone-900">
                إضافة أمتار إلى لفة القماش
              </h4>
              <button
                onClick={() => setRestockingTarget(null)}
                className="w-6 h-6 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="text-xs text-stone-600">
              القماش: <strong>{restockingTarget.fabric.nameAr}</strong>
              <div className="mt-1">
                اللون: <strong>{restockingTarget.color.nameAr}</strong> (المتوفر حالياً:{' '}
                {restockingTarget.color.inStockMeters}م)
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-800 block">
                عدد الأمتار المراد إضافتها للفة:
              </label>
              <div className="flex gap-2">
                {[15, 30, 50, 100].map((m) => (
                  <button
                    key={m}
                    onClick={() => setAddedMeters(m)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold border ${
                      addedMeters === m
                        ? 'bg-[#1b2a22] text-[#d8af56] border-[#1b2a22]'
                        : 'bg-stone-50 text-stone-700 border-stone-200'
                    }`}
                  >
                    +{m}م
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleApplyRestock}
              className="w-full py-2.5 rounded-xl bg-[#c6923b] text-stone-950 font-black text-xs shadow-xs hover:bg-[#b58331]"
            >
              تأكيد إضافة {addedMeters} متر للمخزون
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
