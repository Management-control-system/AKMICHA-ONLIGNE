import React from 'react';
import { ShoppingBag, Lock, LogOut, ShieldCheck, Plus, Package, ClipboardList } from 'lucide-react';
import { CartItem } from '../types';

interface SimpleHeaderProps {
  cart: CartItem[];
  ordersCount: number;
  onOpenCart: () => void;
  onOpenOrders: () => void;
  isAdminLoggedIn: boolean;
  onOpenAdminLogin: () => void;
  onAdminLogout: () => void;
  onOpenAddProduct: () => void;
}

export const SimpleHeader: React.FC<SimpleHeaderProps> = ({
  cart,
  ordersCount,
  onOpenCart,
  onOpenOrders,
  isAdminLoggedIn,
  onOpenAdminLogin,
  onAdminLogout,
  onOpenAddProduct,
}) => {
  const totalItems = cart.length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80">
      {/* Admin bar if logged in */}
      {isAdminLoggedIn && (
        <div className="bg-amber-600 text-white text-xs py-2 px-4 font-bold">
          <div className="max-w-5xl mx-auto flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="bg-stone-900 text-amber-300 text-[11px] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                وضع الإدارة مفعل
              </span>
              <span>يمكنك متابعة طلبات الزبائن، إضافة حزم جديدة، أو حذف الموديلات.</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onOpenOrders}
                className="px-3 py-1 bg-stone-900 text-amber-300 rounded-lg text-xs font-bold hover:bg-stone-800 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <ClipboardList className="w-3.5 h-3.5" />
                <span>طلبات الزبائن ({ordersCount})</span>
              </button>
              <button
                onClick={onOpenAddProduct}
                className="px-3 py-1 bg-stone-900 text-white rounded-lg text-xs font-bold hover:bg-stone-800 transition-all flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ إضافة حزمة</span>
              </button>
              <button
                onClick={onAdminLogout}
                className="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
              >
                <LogOut className="w-3 h-3" />
                <span>خروج</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main clean header */}
      <div className="max-w-5xl mx-auto px-4 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-stone-900 flex items-center justify-center text-amber-500 shadow-xs">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-black text-stone-900 font-['Cairo'] tracking-tight">
              أقمشة أونلاين
            </h1>
            <p className="text-[11px] text-stone-500 font-medium">
              توصيل لـ 58 ولاية • الدفع عند الاستلام بالدينار الجزائري (د.ج)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Orders Button for Store Owner */}
          <button
            onClick={onOpenOrders}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-stone-100 hover:bg-stone-200 text-stone-800 transition-colors cursor-pointer"
            title="عرض ومتابعة طلبات الزبائن"
          >
            <ClipboardList className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden sm:inline">طلبات الزبائن</span>
            {ordersCount > 0 && (
              <span className="bg-amber-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {ordersCount}
              </span>
            )}
          </button>

          {isAdminLoggedIn && (
            <button
              onClick={onOpenAddProduct}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">إضافة حزمة</span>
            </button>
          )}

          {!isAdminLoggedIn && (
            <button
              onClick={onOpenAdminLogin}
              className="text-[11px] font-bold text-stone-600 hover:text-stone-900 flex items-center gap-1.5 bg-stone-100 hover:bg-stone-200 px-3 py-2 rounded-xl transition-colors cursor-pointer"
              title="دخول صاحب المتجر"
            >
              <Lock className="w-3.5 h-3.5 text-stone-500" />
              <span>دخول التاجر</span>
            </button>
          )}

          {/* Cart button */}
          <button
            onClick={onOpenCart}
            className="relative flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-amber-400" />
            <span>السلة</span>
            {totalItems > 0 && (
              <span className="bg-amber-500 text-stone-950 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
