import React, { useState } from 'react';
import {
  ShoppingBag,
  Search,
  Ruler,
  Truck,
  Layers,
  Sparkles,
  ChevronDown,
  Scissors,
  Lock,
  LogOut,
  ShieldCheck,
} from 'lucide-react';
import { CurrencyCode, CartItem } from '../types';
import { CURRENCIES, formatPrice } from '../data/currencies';

interface NavbarProps {
  cart: CartItem[];
  currency: CurrencyCode;
  onCurrencyChange: (c: CurrencyCode) => void;
  onOpenCart: () => void;
  onOpenCalculator: () => void;
  onOpenTracker: () => void;
  onOpenInventory: () => void;
  onOpenAddProduct: () => void;
  isAdminLoggedIn: boolean;
  onOpenAdminLogin: () => void;
  onAdminLogout: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelectCategory: (cat: any) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cart,
  currency,
  onCurrencyChange,
  onOpenCart,
  onOpenCalculator,
  onOpenTracker,
  onOpenInventory,
  onOpenAddProduct,
  isAdminLoggedIn,
  onOpenAdminLogin,
  onAdminLogout,
  searchQuery,
  onSearchChange,
}) => {
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);

  const totalCartItems = cart.length;
  const totalCartMeters = cart.reduce((sum, item) => sum + (item.isSampleOnly ? 0.1 : item.meters), 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);

  return (
    <header className="sticky top-0 z-40 bg-[#fcfbf9]/95 backdrop-blur-md border-b border-[#e7e2d9] transition-all">
      {/* Top Admin Status Bar or Announcement Bar */}
      {isAdminLoggedIn ? (
        <div className="bg-[#c6923b] text-stone-950 text-xs py-2 px-4 font-black shadow-inner">
          <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="bg-stone-950 text-[#d8af56] text-[11px] px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5" />
                وضع المدير نشط
              </span>
              <span className="text-stone-900 font-bold">
                أنت الآن في لوحة تحكم صاحب المتجر (إضافة صور، أسعار، والمخزون)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onOpenAddProduct}
                className="px-3 py-1 bg-stone-950 text-[#d8af56] rounded-lg text-xs font-bold hover:bg-stone-900 transition-all flex items-center gap-1 shadow-xs"
              >
                <Scissors className="w-3.5 h-3.5" />
                <span>+ إضافة موديل جديد</span>
              </button>
              <button
                onClick={onOpenInventory}
                className="px-3 py-1 bg-stone-900 text-stone-100 rounded-lg text-xs font-bold hover:bg-stone-800 transition-all flex items-center gap-1 shadow-xs"
              >
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <span>إدارة المخزون</span>
              </button>
              <button
                onClick={onAdminLogout}
                className="px-2.5 py-1 bg-red-700 hover:bg-red-800 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1 shadow-xs cursor-pointer"
                title="تسجيل الخروج والعودة لوضع الزبون"
              >
                <LogOut className="w-3 h-3" />
                <span>خروج</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-[#1b2a22] text-[#e8dfc8] text-xs py-1.5 px-4 font-medium">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center bg-[#c6923b] text-black text-[10px] font-bold px-1.5 py-0.5 rounded">
                طلب وتوصيل
              </span>
              <span>✂️ قص ليزري دقيق بالمتر ونصف المتر | الدفع عند الاستلام مع التوصيل لـ 58 ولاية</span>
            </div>

            <div className="flex items-center gap-4 text-stone-300">
              <button
                onClick={onOpenAdminLogin}
                className="text-[11px] font-bold text-amber-200/90 hover:text-amber-100 flex items-center gap-1 bg-white/10 hover:bg-white/20 px-2.5 py-0.5 rounded-lg transition-colors cursor-pointer"
                title="خاص بصاحب المتجر لإضافة وتعديل الأقمشة"
              >
                <Lock className="w-3 h-3 text-[#d8af56]" />
                <span>دخول التاجر / الإدارة</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo & Store Identity */}
          <div className="flex items-center gap-3">
            <a href="#" className="flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#1b2a22] to-[#2b4236] flex items-center justify-center shadow-md border border-[#c6923b]/30 group-hover:scale-105 transition-transform">
                <Scissors className="w-6 h-6 text-[#d8af56] transform -rotate-45" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl font-black tracking-tight text-[#1b2a22] font-['Cairo']">
                    أقمشة أونلاين
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#c6923b] bg-[#c6923b]/10 px-1.5 py-0.5 rounded border border-[#c6923b]/20 font-mono">
                    AKMICHA ONLINE
                  </span>
                </div>
                <span className="text-[11px] text-stone-500 font-medium -mt-1">
                  أفخر الأقمشة الطبيعية والمستوردة بالقص الدقيق
                </span>
              </div>
            </a>
          </div>

          {/* Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="ابحث عن نوع القماش (قطن، حرير، كتان، كريب، صوف...)"
                className="w-full bg-[#f4efe6] border border-[#dcd4c5] focus:border-[#c6923b] focus:bg-white text-sm rounded-xl pr-10 pl-4 py-2.5 outline-none transition-all placeholder:text-stone-400 font-medium"
              />
              <Search className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-700 bg-stone-200 hover:bg-stone-300 w-5 h-5 rounded-full flex items-center justify-center"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Action Tools & Cart */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Direct Model Upload Button (Admin only) */}
            {isAdminLoggedIn && (
              <button
                onClick={onOpenAddProduct}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black bg-[#c6923b] hover:bg-[#b58331] text-stone-950 shadow-md transition-all active:scale-95 border border-[#966b24]/30"
                title="تحميل وإضافة موديل قماش جديد بالصورة والسعر"
              >
                <Scissors className="w-4 h-4 text-stone-950" />
                <span className="font-['Cairo']">+ إضافة موديل</span>
              </button>
            )}

            {/* Smart Meter Calculator Button */}
            <button
              onClick={onOpenCalculator}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold bg-[#efe9dc] text-[#1b2a22] hover:bg-[#e4dcce] border border-[#d8cfbe] transition-colors shadow-xs"
              title="حاسبة قياس الأمتار الذكية للثياب والفساتين والستائر"
            >
              <Ruler className="w-4 h-4 text-[#c6923b]" />
              <span>حاسبة الأمتار</span>
            </button>

            {/* Order Tracking Button */}
            <button
              onClick={onOpenTracker}
              className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold bg-[#efe9dc] text-[#1b2a22] hover:bg-[#e4dcce] border border-[#d8cfbe] transition-colors shadow-xs"
              title="تتبع مسار طلبك ومرحلة قص القماش"
            >
              <Truck className="w-4 h-4 text-emerald-700" />
              <span>تتبع الطلبات</span>
            </button>

            {/* Currency Selector */}
            <div className="relative">
              <button
                onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
                className="flex items-center gap-1 px-2.5 py-2 rounded-xl text-xs font-bold bg-[#f4efe6] text-stone-700 hover:bg-stone-200 border border-[#dcd4c5]"
              >
                <span>{CURRENCIES[currency]?.symbolAr}</span>
                <span className="text-[10px] text-stone-500 font-mono">({currency})</span>
                <ChevronDown className="w-3 h-3 text-stone-500" />
              </button>

              {showCurrencyDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowCurrencyDropdown(false)}
                  />
                  <div className="absolute left-0 mt-1 w-36 bg-white rounded-xl shadow-xl border border-stone-200 py-1.5 z-50 animate-in fade-in zoom-in-95">
                    {(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => (
                      <button
                        key={code}
                        onClick={() => {
                          onCurrencyChange(code);
                          setShowCurrencyDropdown(false);
                        }}
                        className={`w-full text-right px-3 py-1.5 text-xs flex items-center justify-between hover:bg-amber-50 ${
                          currency === code ? 'font-black text-[#966b24] bg-amber-50/50' : 'text-stone-700'
                        }`}
                      >
                        <span>{CURRENCIES[code].symbolAr}</span>
                        <span className="font-mono text-[10px] text-stone-400">({code})</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Shopping Cart Trigger */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#1b2a22] hover:bg-[#25392e] text-[#f4efe6] font-bold text-xs sm:text-sm transition-all shadow-md active:scale-95"
              aria-label="سلة المشتريات"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 text-[#d8af56]" />
                {totalCartItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#c6923b] text-stone-950 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                    {totalCartItems}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">السلة</span>
              {totalCartItems > 0 && (
                <span className="text-xs text-[#d8af56] font-mono mr-1">
                  ({formatPrice(cartSubtotal, currency)})
                </span>
              )}
            </button>

          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="lg:hidden pb-3">
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="ابحث عن أقمشة، خامات، ألوان، استخدامات..."
              className="w-full bg-[#f4efe6] border border-[#dcd4c5] focus:border-[#c6923b] focus:bg-white text-xs sm:text-sm rounded-xl pr-10 pl-4 py-2 outline-none font-medium"
            />
            <Search className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      </div>
    </header>
  );
};
