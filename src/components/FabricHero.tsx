import React from 'react';
import { Sparkles, Scissors, ShieldCheck, Truck, RefreshCcw, Ruler, CheckCircle2 } from 'lucide-react';
import { CATEGORIES_LIST } from '../data/fabrics';
import { FabricCategory } from '../types';

interface FabricHeroProps {
  activeCategory: FabricCategory;
  onSelectCategory: (cat: FabricCategory) => void;
  onOpenCalculator: () => void;
  onOpenAddProduct: () => void;
  isAdminLoggedIn?: boolean;
}

export const FabricHero: React.FC<FabricHeroProps> = ({
  activeCategory,
  onSelectCategory,
  onOpenCalculator,
  onOpenAddProduct,
  isAdminLoggedIn = false,
}) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#f5ede0] via-[#fcfbf9] to-[#fcfbf9] border-b border-[#e8dfcf] pt-8 pb-6">
      
      {/* Subtle textured background accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#c6923b]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#1b2a22]/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Main Banner Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Heading & Value Proposition */}
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 bg-[#1b2a22] text-[#d8af56] px-3.5 py-1.5 rounded-full text-xs font-bold shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>أفخر أقمشة العالم بين يديك بالقص الدقيق للأمتار</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1b2a22] tracking-tight leading-[1.2] font-['Cairo']">
              اختر قماشك الفاخر، <br className="hidden sm:inline" />
              <span className="text-[#966b24]">حدد الطول بالمتر والسنتيمتر</span>، ودع الباقي لخبرائنا
            </h1>

            <p className="text-stone-600 text-sm sm:text-base leading-relaxed max-w-2xl font-normal">
              منصة <strong>أقمشة أونلاين (Akmicha Online)</strong> تمنحك حرية شراء الأقمشة الطبيعية والمستوردة بنظام القص الدقيق (يبدأ من نصف متر ومضاعفات الربع متر) مع حساب فوري دقيق للتكلفة، فحص الجودة الميكروسكوبي، وتغليف محكم يحفظ رونق القماش حتى باب منزلك.
            </p>

            {/* Quick Action Badges */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              {isAdminLoggedIn && (
                <button
                  onClick={onOpenAddProduct}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#c6923b] hover:bg-[#b58331] text-stone-950 rounded-xl text-xs sm:text-sm font-black shadow-md transition-all active:scale-95 border border-[#966b24]/40"
                >
                  <Scissors className="w-4 h-4 text-stone-950" />
                  <span>+ أضف موديل قماش جديد الآن</span>
                </button>
              )}

              <button
                onClick={onOpenCalculator}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#1b2a22] hover:bg-[#25392e] text-[#f4efe6] rounded-xl text-xs sm:text-sm font-bold shadow-md transition-transform active:scale-95"
              >
                <Ruler className="w-4 h-4 text-[#d8af56]" />
                <span>حاسبة الأمتار الذكية</span>
              </button>

              <div className="flex items-center gap-1.5 px-3 py-2 bg-white/80 border border-[#ded5c5] rounded-xl text-xs font-semibold text-stone-700">
                <Scissors className="w-4 h-4 text-[#966b24]" />
                <span>قص دقيق بالمتر ونصف المتر (0.5 م)</span>
              </div>
            </div>
          </div>

          {/* Right Column: Highlights Cards */}
          <div className="lg:col-span-4 grid grid-cols-2 sm:grid-cols-2 gap-3">
            
            <div className="bg-white p-3.5 rounded-2xl border border-[#ded5c5] shadow-xs flex flex-col justify-between">
              <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-[#966b24] mb-2">
                <Scissors className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xs font-bold text-stone-900">قص ليزري بالمليمتر</h2>
                <p className="text-[11px] text-stone-500 mt-0.5">قص مستقيم متوازن بدون أي خيوط منسلّة</p>
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-[#ded5c5] shadow-xs flex flex-col justify-between">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 mb-2">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xs font-bold text-stone-900">تتبع الطلب لحظة بلحظة</h2>
                <p className="text-[11px] text-stone-500 mt-0.5">من استلام الطلب حتى مرحلة القص والتسليم</p>
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-[#ded5c5] shadow-xs flex flex-col justify-between">
              <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 mb-2">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xs font-bold text-stone-900">أقمشة أصلية 100%</h2>
                <p className="text-[11px] text-stone-500 mt-0.5">مستوردة مباشرة من اليابان وفرنسا وإيطاليا</p>
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-[#ded5c5] shadow-xs flex flex-col justify-between">
              <div className="w-9 h-9 rounded-xl bg-stone-100 border border-stone-300 flex items-center justify-center text-stone-700 mb-2">
                <RefreshCcw className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xs font-bold text-stone-900">عينات قماش للمنزل</h2>
                <p className="text-[11px] text-stone-500 mt-0.5">اطلب عينة 10×10 سم لتجربة الملمس واللون</p>
              </div>
            </div>

          </div>

        </div>

        {/* Horizontal Categories Scroll Bar */}
        <div className="mt-8 pt-4 border-t border-[#e8dfcf]">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES_LIST.map((category) => {
              const isSelected = activeCategory === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => onSelectCategory(category.id as FabricCategory)}
                  className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#1b2a22] text-[#d8af56] shadow-md border border-[#c6923b]/40 scale-102'
                      : 'bg-white/90 text-stone-700 hover:bg-[#f1eae0] border border-[#ded5c5]'
                  }`}
                >
                  <span>{category.nameAr}</span>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
