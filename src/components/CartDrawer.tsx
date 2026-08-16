import React, { useState } from 'react';
import {
  X,
  Trash2,
  Scissors,
  ShoppingBag,
  ArrowLeft,
  Sparkles,
  Tag,
  Check,
  Info,
  ShieldCheck,
} from 'lucide-react';
import { CartItem, CurrencyCode } from '../types';
import { formatPrice } from '../data/currencies';

interface CartDrawerProps {
  isOpen: boolean;
  cart: CartItem[];
  currency: CurrencyCode;
  onClose: () => void;
  onUpdateMeters: (id: string, newMeters: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onProceedToCheckout: (discountAmount: number, couponCode: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  cart,
  currency,
  onClose,
  onUpdateMeters,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout,
}) => {
  if (!isOpen) return null;

  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscountRate, setAppliedDiscountRate] = useState<number>(0);
  const [couponMessage, setCouponMessage] = useState<{ text: string; isError?: boolean } | null>(
    null
  );

  const subtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);
  const totalMeters = cart.reduce((sum, item) => sum + (item.isSampleOnly ? 0.1 : item.meters), 0);

  const FREE_SHIPPING_THRESHOLD = 12000;
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const shippingFee = isFreeShipping || cart.length === 0 ? 0 : 600;

  const discountAmount = Number((subtotal * appliedDiscountRate).toFixed(0));
  const finalTotal = Math.max(0, Number((subtotal - discountAmount + shippingFee).toFixed(0)));

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = couponCode.trim().toUpperCase();
    if (clean === 'FABRIC10' || clean === 'AKMICHA10' || clean === 'DZ10') {
      setAppliedDiscountRate(0.1);
      setCouponMessage({ text: 'تم تطبيق كود الخصم (10%) بنجاح! 🎉' });
    } else if (clean === 'AKMICHA2026' || clean === 'NASEEJ2026' || clean === 'EID2026' || clean === 'DZ15') {
      setAppliedDiscountRate(0.15);
      setCouponMessage({ text: 'تم تطبيق كود الخصم الحصري (15%) بنجاح! 🌟' });
    } else {
      setCouponMessage({ text: 'كود الخصم غير صالح أو منتهي الصلاحية', isError: true });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer Container */}
      <div className="fixed inset-y-0 left-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-white border-r border-stone-200 shadow-2xl flex flex-col justify-between">
          
          {/* Drawer Top Header */}
          <div className="px-5 py-4 border-b border-stone-200/80 bg-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-stone-900 flex items-center justify-center text-amber-400">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-black text-stone-900 font-['Cairo']">
                  سلة الأقمشة والقص
                </h2>
                <span className="text-[11px] text-stone-500 font-medium">
                  {cart.length} أصناف • إجمالي {totalMeters.toFixed(2)} متر
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-stone-900 text-white px-5 py-2.5 text-xs">
            <div className="flex items-center justify-between font-bold mb-1">
              <span>{isFreeShipping ? '🎉 تهانينا! مؤهل للتوصيل المجاني' : '🚚 التوصيل المجاني (فوق 12,000 د.ج)'}</span>
              <span className="text-amber-400 font-mono">
                {isFreeShipping
                  ? 'مجاني'
                  : `متبقي ${formatPrice(remainingForFreeShipping, currency)}`}
              </span>
            </div>
            <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-amber-500 h-full transition-all duration-500 rounded-full"
                style={{
                  width: `${Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)}%`,
                }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mx-auto">
                  <Scissors className="w-8 h-8 text-stone-400" />
                </div>
                <h3 className="text-base font-bold text-stone-800">سلة المشتريات فارغة حالياً</h3>
                <p className="text-xs text-stone-500 max-w-xs mx-auto">
                  تصفح مجموعتنا من حزم الأقمشة وحدد الطول المناسب بالمتر لإضافتها إلى السلة.
                </p>
                <button
                  onClick={onClose}
                  className="px-5 py-2 rounded-xl bg-stone-900 text-amber-400 text-xs font-bold shadow-xs hover:bg-stone-800 transition-colors cursor-pointer"
                >
                  تصفح حزم الأقمشة
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-stone-200 rounded-2xl p-3 flex gap-3 relative shadow-xs"
                >
                  <img
                    src={item.image}
                    alt={item.fabricNameAr}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border border-stone-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="text-xs font-black text-stone-900 truncate font-['Cairo']">
                        {item.fabricNameAr}
                      </h4>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-stone-400 hover:text-red-600 transition-colors p-1"
                        title="حذف من السلة"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-stone-600">
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-black/20"
                        style={{ backgroundColor: item.color.hex }}
                      />
                      <span>{item.color.nameAr}</span>
                      <span>•</span>
                      <span className="font-mono text-amber-700 font-bold">
                        {formatPrice(item.pricePerMeter, currency)}/م
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onUpdateMeters(item.id, Math.max(0.5, item.meters - 0.5))}
                          className="w-6 h-6 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-800 font-black text-xs flex items-center justify-center cursor-pointer"
                        >
                          -
                        </button>
                        <span className="px-2 py-0.5 bg-stone-50 rounded-md border border-stone-200 font-mono font-black text-xs text-stone-900">
                          {item.meters} م
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateMeters(item.id, item.meters + 0.5)}
                          className="w-6 h-6 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-800 font-black text-xs flex items-center justify-center cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      <span className="font-black text-xs font-mono text-stone-900">
                        {formatPrice(item.totalPrice, currency)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary & Checkout */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-stone-200 bg-stone-50/70 space-y-3">
              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="space-y-1">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="كود الخصم (جرب DZ10)"
                      className="w-full text-xs uppercase font-mono bg-white border border-stone-300 rounded-xl pr-8 pl-3 py-2 outline-none focus:border-amber-600"
                    />
                    <Tag className="w-3.5 h-3.5 text-stone-400 absolute right-2.5 top-1/2 -translate-y-1/2" />
                  </div>
                  <button
                    type="submit"
                    className="px-3.5 py-2 bg-stone-900 text-amber-400 text-xs font-bold rounded-xl hover:bg-stone-800 transition-colors cursor-pointer"
                  >
                    تطبيق
                  </button>
                </div>

                {couponMessage && (
                  <p
                    className={`text-[11px] font-bold ${
                      couponMessage.isError ? 'text-red-600' : 'text-emerald-700'
                    }`}
                  >
                    {couponMessage.text}
                  </p>
                )}
              </form>

              {/* Costs Breakdown */}
              <div className="space-y-1.5 text-xs text-stone-600 pt-1">
                <div className="flex justify-between">
                  <span>المجموع الفرعي للأقمشة:</span>
                  <span className="font-mono font-bold text-stone-900">
                    {formatPrice(subtotal, currency)}
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>خصم الكوبون ({appliedDiscountRate * 100}%):</span>
                    <span className="font-mono">- {formatPrice(discountAmount, currency)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>رسوم التوصيل والقص:</span>
                  <span className="font-mono font-bold text-stone-900">
                    {shippingFee === 0 ? 'مجاني' : formatPrice(shippingFee, currency)}
                  </span>
                </div>

                <div className="pt-2 border-t border-stone-200 flex justify-between text-sm font-black text-stone-900">
                  <span>الإجمالي النهائي (عند الاستلام):</span>
                  <span className="text-base font-mono text-amber-700">
                    {formatPrice(finalTotal, currency)}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => onProceedToCheckout(discountAmount, couponCode)}
                className="w-full py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-black text-sm flex items-center justify-center gap-2 shadow-xs transition-all active:scale-98 cursor-pointer"
              >
                <span>المتابعة لإتمام الطلب والدفع</span>
                <ArrowLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-3 text-[10px] text-stone-400 font-medium">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  معاينة القماش قبل الدفع
                </span>
                <span>•</span>
                <span>توصيل لـ 58 ولاية</span>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};

