import React, { useState } from 'react';
import {
  X,
  CreditCard,
  Truck,
  CheckCircle2,
  Lock,
  Scissors,
  ArrowLeft,
  Copy,
  Check,
  Phone,
  User,
  MapPin,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CartItem, Order, CurrencyCode, OrderStatusHistoryItem } from '../types';
import { ALGERIAN_WILAYAS, getWilayaDeliveryCost } from '../data/wilayas';
import { formatPrice } from '../data/currencies';

interface CheckoutModalProps {
  isOpen: boolean;
  cart: CartItem[];
  currency: CurrencyCode;
  discountAmount: number;
  couponCode?: string;
  onClose: () => void;
  onOrderCreated?: (newOrder: Order) => void;
  onOrderComplete?: (newOrder: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  cart,
  currency,
  discountAmount,
  couponCode,
  onClose,
  onOrderCreated,
  onOrderComplete,
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState<'shipping' | 'payment' | 'success'>('shipping');

  // Customer Shipping Info
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [selectedWilayaCode, setSelectedWilayaCode] = useState(ALGERIAN_WILAYAS[15].code); // '16' - Alger
  const [district, setDistrict] = useState('');
  const [addressDetails, setAddressDetails] = useState('');
  const [cuttingNotes, setCuttingNotes] = useState('');

  const selectedWilaya = ALGERIAN_WILAYAS.find((w) => w.code === selectedWilayaCode) || ALGERIAN_WILAYAS[15];

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'edahabia'>('cod');
  const [isProcessing, setIsProcessing] = useState(false);

  // Completed Order info
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [copiedTracking, setCopiedTracking] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);
  const totalMeters = cart.reduce((sum, item) => sum + (item.isSampleOnly ? 0.1 : item.meters), 0);
  const shippingFee = subtotal >= 12000 || cart.length === 0 ? 0 : getWilayaDeliveryCost(selectedWilayaCode);
  const finalTotal = Math.max(0, Number((subtotal - discountAmount + shippingFee).toFixed(0)));

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !phone || !addressDetails) {
      alert('يرجى تعبئة الاسم، رقم الهاتف، والعنوان بالتفصيل');
      return;
    }
    setStep('payment');
  };

  const handleConfirmOrder = () => {
    setIsProcessing(true);

    setTimeout(() => {
      const orderIdNumber = Math.floor(10000 + Math.random() * 90000);
      const generatedOrderId = `DZ-${orderIdNumber}`;
      const generatedTracking = `YAL-${Math.floor(100000 + Math.random() * 900000)}DZ`;

      const initialHistory: OrderStatusHistoryItem[] = [
        {
          status: 'received',
          titleAr: 'تم استلام الطلب وتأكيد خيار الدفع عند الاستلام',
          titleEn: 'Order Received & Verified',
          descriptionAr: `تم إدراج طلبك لقص ${totalMeters.toFixed(2)} متر وتوصيله لولاية ${selectedWilaya.name}.`,
          timestamp: new Date().toLocaleDateString('ar-DZ'),
        },
      ];

      const newOrder: Order = {
        id: generatedOrderId,
        trackingNumber: generatedTracking,
        createdAt: new Date().toISOString(),
        customerName,
        phone,
        email: email || undefined,
        city: selectedWilaya.name,
        district: district || undefined,
        addressDetails,
        cuttingNotes: cuttingNotes || undefined,
        items: [...cart],
        subtotal,
        shippingFee,
        discount: discountAmount,
        total: finalTotal,
        paymentMethod,
        paymentStatus: 'pending_cod',
        status: 'received',
        statusHistory: initialHistory,
        estimatedDeliveryDate: 'خلال 24 إلى 48 ساعة',
      };

      setCreatedOrder(newOrder);
      setIsProcessing(false);
      setStep('success');

      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#d97706', '#1c1917', '#f59e0b', '#78716c'],
        });
      } catch (e) {}

      if (onOrderCreated) {
        onOrderCreated(newOrder);
      } else if (onOrderComplete) {
        onOrderComplete(newOrder);
      }
    }, 1000);
  };

  const copyTrackingToClipboard = () => {
    if (createdOrder) {
      navigator.clipboard.writeText(createdOrder.id);
      setCopiedTracking(true);
      setTimeout(() => setCopiedTracking(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="relative bg-white rounded-3xl border border-stone-200 shadow-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto flex flex-col my-auto">
        
        {/* Header Bar */}
        <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-stone-200/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-stone-900 flex items-center justify-center text-amber-400">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-black text-stone-900 font-['Cairo']">
                {step === 'shipping'
                  ? 'بيانات التوصيل'
                  : step === 'payment'
                  ? 'تأكيد الحجز وطريقة الدفع'
                  : 'تم تأكيد طلبك بنجاح! 🎉'}
              </h2>
              <span className="text-[11px] text-stone-500 font-medium">
                {step === 'shipping'
                  ? 'الخطوة 1 من 2'
                  : step === 'payment'
                  ? 'الخطوة 2 من 2'
                  : 'رقم الطلب محفوظ'}
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

        {/* Content Body */}
        <div className="p-5 sm:p-7">
          
          {/* STEP 1: Shipping Details */}
          {step === 'shipping' && (
            <form onSubmit={handleProceedToPayment} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-800 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-stone-400" />
                    <span>الاسم واللقب *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="مثال: يوسف بن مهيدي"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-amber-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-800 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-stone-400" />
                    <span>رقم الهاتف للتأكيد *</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="05 / 06 / 07 XX XX XX XX"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold font-mono outline-none focus:border-amber-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-800 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-stone-400" />
                    <span>الولاية (58 ولاية) *</span>
                  </label>
                  <select
                    value={selectedWilayaCode}
                    onChange={(e) => setSelectedWilayaCode(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-amber-600 cursor-pointer"
                  >
                    {ALGERIAN_WILAYAS.map((w) => (
                      <option key={w.code} value={w.code}>
                        {w.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-800 block">
                    البلدية / الدائرة
                  </label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="مثال: باب الزوار / بئر مراد رايس"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-amber-600"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-800 block">
                  تفاصيل العنوان السكني *
                </label>
                <input
                  type="text"
                  required
                  value={addressDetails}
                  onChange={(e) => setAddressDetails(e.target.value)}
                  placeholder="رقم العمارة، الشارع، أو معلم قريب لتسهيل التوصيل..."
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-amber-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-800 flex items-center gap-1">
                  <Scissors className="w-3.5 h-3.5 text-amber-600" />
                  <span>ملاحظات خاصة بالقص والتغليف (اختياري)</span>
                </label>
                <textarea
                  rows={2}
                  value={cuttingNotes}
                  onChange={(e) => setCuttingNotes(e.target.value)}
                  placeholder="أي تعليمات خاصة بالقص أو التغليف..."
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-amber-600"
                />
              </div>

              {/* Order Brief Summary */}
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 flex items-center justify-between text-xs">
                <div>
                  <span className="text-stone-500 block">إجمالي القماش:</span>
                  <strong className="text-stone-900 font-mono text-sm">{totalMeters.toFixed(2)} متر</strong>
                </div>
                <div>
                  <span className="text-stone-500 block">التوصيل ({selectedWilaya.name}):</span>
                  <strong className="text-stone-900 font-mono text-sm">{formatPrice(shippingFee, currency)}</strong>
                </div>
                <div className="text-left">
                  <span className="text-stone-500 block">الإجمالي النهائي:</span>
                  <strong className="text-amber-700 font-mono text-base font-black">
                    {formatPrice(finalTotal, currency)}
                  </strong>
                </div>
              </div>

              {/* Submit to Step 2 */}
              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-black text-sm flex items-center justify-center gap-2 shadow-xs transition-all active:scale-98 cursor-pointer"
              >
                <span>الانتقال لتأكيد الطلب</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* STEP 2: Payment & Confirmation */}
          {step === 'payment' && (
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-800 block">
                  طريقة الدفع:
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-all cursor-pointer ${
                      paymentMethod === 'cod'
                        ? 'bg-stone-900 text-amber-400 border-stone-900 shadow-xs'
                        : 'bg-white text-stone-700 hover:bg-stone-50 border-stone-200'
                    }`}
                  >
                    <Truck className="w-5 h-5" />
                    <div className="text-right">
                      <div className="text-xs font-bold">الدفع عند الاستلام (يداً بيد)</div>
                      <div className="text-[10px] text-stone-400">افحص القماش وادفع للموزع</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('edahabia')}
                    className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-all cursor-pointer ${
                      paymentMethod === 'edahabia'
                        ? 'bg-stone-900 text-amber-400 border-stone-900 shadow-xs'
                        : 'bg-white text-stone-700 hover:bg-stone-50 border-stone-200'
                    }`}
                  >
                    <CreditCard className="w-5 h-5" />
                    <div className="text-right">
                      <div className="text-xs font-bold">البطاقة الذهبية / CIB</div>
                      <div className="text-[10px] text-stone-400">بريد الجزائر / بنوك</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* COD Explanation */}
              <div className="bg-amber-50 border border-amber-200/80 p-4 rounded-2xl text-xs text-amber-900 space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-900">
                  <Truck className="w-4 h-4 text-amber-600" />
                  <span>تأكيد الطلب والدفع عند الاستلام</span>
                </div>
                <p className="leading-relaxed text-stone-700">
                  سيتم قص القماش المختار بعناية وتجهيزه للتسليم إلى <strong className="text-stone-950 font-bold">{selectedWilaya.name}</strong>. الدفع نقداً عند استلام الطرد وفحصه بمبلغ إجمالي <strong className="text-amber-800 font-bold font-mono">{formatPrice(finalTotal, currency)}</strong>.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('shipping')}
                  className="px-4 py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs cursor-pointer"
                >
                  الرجوع للعنوان
                </button>

                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleConfirmOrder}
                  className="flex-1 py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-black text-sm flex items-center justify-center gap-2 shadow-xs transition-all active:scale-98 cursor-pointer"
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      جاري تسجيل طلبك...
                    </span>
                  ) : (
                    <span>تأكيد الطلب النهائي ({formatPrice(finalTotal, currency)})</span>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Success Celebration */}
          {step === 'success' && createdOrder && (
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-xl font-black text-stone-900 font-['Cairo']">
                  شكراً لك! تم تأكيد طلبك بنجاح
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  سنقوم بالتواصل معك هاتفياً على الرقم <strong className="text-stone-800 font-mono">{phone}</strong> قبل إرسال الموزع.
                </p>
              </div>

              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 text-xs text-right space-y-2 max-w-md mx-auto">
                <div className="flex justify-between items-center border-b border-stone-200 pb-2">
                  <span className="text-stone-500">رقم الطلب:</span>
                  <div className="flex items-center gap-1">
                    <span className="font-mono font-black text-stone-900">{createdOrder.id}</span>
                    <button
                      onClick={copyTrackingToClipboard}
                      className="p-1 hover:bg-stone-200 rounded text-stone-500"
                      title="نسخ رقم الطلب"
                    >
                      {copiedTracking ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-500">الولاية والتوصيل:</span>
                  <span className="font-bold text-stone-800">{selectedWilaya.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-500">المبلغ الإجمالي عند الاستلام:</span>
                  <span className="font-mono font-black text-amber-700 text-sm">
                    {formatPrice(createdOrder.total, currency)}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="px-8 py-3 rounded-2xl bg-stone-900 hover:bg-stone-800 text-amber-400 font-bold text-xs shadow-xs transition-colors cursor-pointer"
                >
                  العودة لمعرض الأقمشة
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
