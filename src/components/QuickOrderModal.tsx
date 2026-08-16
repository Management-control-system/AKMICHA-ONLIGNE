import React, { useState } from 'react';
import {
  X,
  Phone,
  MapPin,
  Scissors,
  CheckCircle2,
  Truck,
  ShieldCheck,
  Sparkles,
  User,
  ShoppingBag,
} from 'lucide-react';
import { Fabric, FabricColor, CurrencyCode, Order } from '../types';
import { ALGERIA_WILAYAS } from '../data/wilayas';
import { formatPrice } from '../data/currencies';

interface QuickOrderModalProps {
  isOpen: boolean;
  fabric: Fabric | null;
  selectedColor?: FabricColor;
  initialMeters?: number;
  currency: CurrencyCode;
  onClose: () => void;
  onConfirmOrder: (order: Order) => void;
}

export const QuickOrderModal: React.FC<QuickOrderModalProps> = ({
  isOpen,
  fabric,
  selectedColor,
  initialMeters = 2.0,
  currency,
  onClose,
  onConfirmOrder,
}) => {
  if (!isOpen || !fabric) return null;

  const [activeColor, setActiveColor] = useState<FabricColor>(
    selectedColor || fabric.colors[0] || {
      id: 'c1',
      nameAr: 'اللون الأساسي',
      nameEn: 'Base',
      hex: '#c6923b',
      inStockMeters: 50,
      image: fabric.galleryImages[0] || '',
    }
  );

  const [meters, setMeters] = useState<number>(initialMeters || 2.0);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [selectedWilayaCode, setSelectedWilayaCode] = useState('16'); // Alger default
  const [customerAddress, setCustomerAddress] = useState('');
  const [deliveryType, setDeliveryType] = useState<'home' | 'desk'>('home');
  const [orderNotes, setOrderNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<Order | null>(null);

  const selectedWilaya = ALGERIA_WILAYAS.find((w) => w.code === selectedWilayaCode) || ALGERIA_WILAYAS[15];

  // Price calculations in DZD
  const fabricSubtotal = fabric.pricePerMeter * meters;
  const deliveryCost = deliveryType === 'home' ? selectedWilaya.deliveryHome : selectedWilaya.deliveryDesk;
  const grandTotal = fabricSubtotal + deliveryCost;

  const PRESET_METERS = [
    { label: '0.5م', value: 0.5, desc: 'نصف متر' },
    { label: '1.0م', value: 1.0, desc: 'متر' },
    { label: '1.5م', value: 1.5, desc: 'متر ونصف' },
    { label: '2.0م', value: 2.0, desc: 'مترين' },
    { label: '2.5م', value: 2.5, desc: 'مترين ونصف' },
    { label: '3.0م', value: 3.0, desc: '3 أمتار' },
    { label: '3.5م', value: 3.5, desc: 'طاقة ثوب/فستان' },
    { label: '5.0م', value: 5.0, desc: '5 أمتار' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerPhone.trim() || customerPhone.length < 9) {
      alert('يرجى كتابة رقم هاتف صحيح ليتواصل معكم عامل التوصيل');
      return;
    }
    if (!customerName.trim()) {
      alert('يرجى كتابة اسمكم الكريم');
      return;
    }

    setIsSubmitting(true);

    const newOrder: Order = {
      id: `NSJ-${Date.now().toString().slice(-5)}`,
      trackingNumber: `TRK-${Date.now().toString().slice(-8)}DZ`,
      createdAt: new Date().toISOString(),
      customerName: customerName.trim(),
      phone: customerPhone.trim(),
      email: `${customerPhone.trim()}@customer.dz`,
      city: selectedWilaya.name,
      district: deliveryType === 'home' ? 'توصيل منزلي' : 'استلام من المكتب (Stop Desk)',
      addressDetails: `${customerAddress.trim() || selectedWilaya.name} - (${deliveryType === 'home' ? 'توصيل للمنزل' : 'استلام من مكتب التوصيل'})`,
      cuttingNotes: orderNotes || `قص متصل ${meters} متر للولاية ${selectedWilaya.name}`,
      items: [
        {
          id: `line-${Date.now()}`,
          fabricId: fabric.id,
          fabricNameAr: fabric.nameAr,
          fabricNameEn: fabric.nameEn,
          fabricTypeAr: fabric.typeAr,
          color: activeColor,
          meters: meters,
          isSampleOnly: false,
          pricePerMeter: fabric.pricePerMeter,
          totalPrice: fabricSubtotal,
          image: activeColor.image || fabric.galleryImages[0],
          widthCm: fabric.widthCm,
          cuttingInstructions: `قص ${meters} متر متصل - لون ${activeColor.nameAr}`,
        },
      ],
      subtotal: fabricSubtotal,
      shippingFee: deliveryCost,
      discount: 0,
      total: grandTotal,
      paymentMethod: 'cod',
      paymentStatus: 'pending_cod',
      status: 'received',
      statusHistory: [
        {
          status: 'received',
          titleAr: 'تم استلام الطلب وتأكيده بنجاح',
          titleEn: 'Order Received & Confirmed',
          descriptionAr: `تم تسجيل طلب قص ${meters} متر من قماش (${fabric.nameAr}) وإرسالها للتجهيز والشحن لولاية ${selectedWilaya.name}`,
          timestamp: new Date().toISOString(),
        },
      ],
      estimatedDeliveryDate: new Date(Date.now() + 2 * 24 * 3600 * 1000).toISOString(),
    };

    setTimeout(() => {
      onConfirmOrder(newOrder);
      setIsSubmitting(false);
      setOrderSuccess(newOrder);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="relative bg-white rounded-3xl border border-stone-200 shadow-2xl max-w-xl w-full max-h-[94vh] overflow-y-auto flex flex-col my-auto text-stone-900">
        
        {/* Header */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-5 py-4 border-b border-stone-200/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-stone-900 flex items-center justify-center text-amber-400 shadow-xs">
              <Scissors className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-stone-900 font-['Cairo']">
                طلب وتوصيل القماش السريع
              </h2>
              <p className="text-xs text-stone-500 font-medium">
                الدفع عند الاستلام بعد معاينة القماش (58 ولاية)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {orderSuccess ? (
          /* Order Success View */
          <div className="p-6 text-center space-y-5">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                رقم الطلب: {orderSuccess.id}
              </span>
              <h3 className="text-xl font-black text-stone-900 font-['Cairo'] mt-2">
                تم تسجيل وتأكيد طلبيتك بنجاح! 🎉
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-md mx-auto">
                شكراً لثقتكم. سيتم الاتصال بكم على الرقم <strong className="text-stone-900 font-mono">{orderSuccess.phone}</strong> لتأكيد خروج عامل التوصيل لـ <strong className="text-amber-700">{selectedWilaya.name}</strong>.
              </p>
            </div>

            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 text-right space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-stone-200">
                <span className="text-stone-500">القماش المطلوب:</span>
                <span className="font-bold text-stone-800">{fabric.nameAr}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-200">
                <span className="text-stone-500">الكمية المقصوصة:</span>
                <span className="font-bold text-amber-700 font-mono">{meters} متر</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-200">
                <span className="text-stone-500">الولاية وطريقة التوصيل:</span>
                <span className="font-bold text-stone-800">{selectedWilaya.name} ({deliveryType === 'home' ? 'للمنزل' : 'للمكتب'})</span>
              </div>
              <div className="flex justify-between py-1 text-sm font-black text-stone-900">
                <span>المبلغ الإجمالي عند الاستلام:</span>
                <span className="text-amber-700 font-mono">
                  {formatPrice(grandTotal, currency)}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setOrderSuccess(null);
                onClose();
              }}
              className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-white rounded-2xl font-black text-sm transition-all shadow-xs cursor-pointer"
            >
              تم، العودة للمتجر
            </button>
          </div>
        ) : (
          /* Main Order Form */
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5">
            
            {/* 1. Selected Fabric Preview & Color Pick */}
            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-3 sm:p-4 flex gap-3.5 items-center">
              <img
                src={activeColor.image || fabric.galleryImages[0]}
                alt={fabric.nameAr}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover border border-stone-200 shrink-0 shadow-xs"
              />
              <div className="flex-1 min-w-0 space-y-1">
                <span className="inline-block text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md">
                  {fabric.typeAr}
                </span>
                <h4 className="text-xs sm:text-sm font-black text-stone-900 truncate font-['Cairo']">
                  {fabric.nameAr}
                </h4>
                <div className="text-xs font-black text-amber-700">
                  {formatPrice(fabric.pricePerMeter, currency)} / للمتر
                </div>

                {/* Color Variants Switcher if more than 1 */}
                {fabric.colors.length > 1 && (
                  <div className="pt-1 flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] text-stone-500 font-bold">اللون:</span>
                    {fabric.colors.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setActiveColor(c)}
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold border transition-all flex items-center gap-1 cursor-pointer ${
                          activeColor.id === c.id
                            ? 'border-amber-600 bg-amber-50 text-amber-900 ring-1 ring-amber-600'
                            : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                        }`}
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-black/20"
                          style={{ backgroundColor: c.hex }}
                        />
                        <span>{c.nameAr}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 2. Meters Selection */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                  <Scissors className="w-3.5 h-3.5 text-amber-600" />
                  <span>حدد عدد الأمتار المطلوبة للقص:</span>
                </label>

                {/* Counter Stepper */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setMeters((m) => Math.max(0.5, Number((m - 0.5).toFixed(1))))}
                    className="w-7 h-7 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 font-black flex items-center justify-center text-sm cursor-pointer"
                  >
                    -
                  </button>
                  <span className="font-mono font-black text-sm text-amber-700 px-2.5 py-0.5 bg-amber-50 rounded-lg border border-amber-200 min-w-[50px] text-center">
                    {meters} م
                  </span>
                  <button
                    type="button"
                    onClick={() => setMeters((m) => Number((m + 0.5).toFixed(1)))}
                    className="w-7 h-7 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 font-black flex items-center justify-center text-sm cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Quick meter chips */}
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                {PRESET_METERS.map((p) => {
                  const isSelected = meters === p.value;
                  return (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => setMeters(p.value)}
                      className={`py-1.5 rounded-xl text-center transition-all flex flex-col items-center justify-center cursor-pointer ${
                        isSelected
                          ? 'bg-stone-900 text-amber-400 ring-2 ring-amber-500 shadow-xs'
                          : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200'
                      }`}
                    >
                      <span className="text-xs font-black font-mono">{p.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Customer Info */}
            <div className="space-y-3 pt-2 border-t border-stone-100">
              <h4 className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-amber-600" />
                <span>معلومات الزبون والشحن:</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                {/* Customer Full Name */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-stone-700">
                    الاسم الكامل <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="مثال: أحمد محمد / فاطمة"
                    className="w-full bg-stone-50 border border-stone-300 focus:border-amber-600 rounded-xl px-3 py-2 text-xs font-semibold outline-none"
                  />
                </div>

                {/* Phone Number */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-stone-700">
                    رقم الهاتف للتأكيد والتوصيل <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="مثال: 0661234567 أو 0550123456"
                      className="w-full bg-stone-50 border border-stone-300 focus:border-amber-600 rounded-xl px-3 py-2 text-xs font-bold font-mono outline-none"
                    />
                    <Phone className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* Wilaya Selection (58 ولاية) */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="block text-[11px] font-bold text-stone-700 flex items-center justify-between">
                    <span>الولاية (58 ولاية) <span className="text-red-500">*</span></span>
                    <span className="text-[10px] text-amber-700 font-bold">
                      سعر التوصيل: {deliveryCost} د.ج
                    </span>
                  </label>
                  <div className="relative">
                    <select
                      value={selectedWilayaCode}
                      onChange={(e) => setSelectedWilayaCode(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-300 focus:border-amber-600 rounded-xl px-3 py-2 text-xs font-bold text-stone-900 outline-none appearance-none cursor-pointer"
                    >
                      {ALGERIA_WILAYAS.map((w) => (
                        <option key={w.code} value={w.code}>
                          {w.name} — (توصيل منزلي {w.deliveryHome} د.ج / مكتب {w.deliveryDesk} د.ج)
                        </option>
                      ))}
                    </select>
                    <MapPin className="w-3.5 h-3.5 text-amber-600 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Delivery Type (منزل أو مكتب) */}
                <div className="sm:col-span-2 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDeliveryType('home')}
                    className={`p-2.5 rounded-xl border text-right transition-all flex items-center gap-2 cursor-pointer ${
                      deliveryType === 'home'
                        ? 'border-amber-600 bg-amber-50 text-amber-900 ring-1 ring-amber-600'
                        : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <Truck className="w-4 h-4 text-amber-600" />
                    <div>
                      <div className="text-xs font-bold">توصيل لباب المنزل</div>
                      <div className="text-[10px] text-stone-500 font-mono">{selectedWilaya.deliveryHome} د.ج</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryType('desk')}
                    className={`p-2.5 rounded-xl border text-right transition-all flex items-center gap-2 cursor-pointer ${
                      deliveryType === 'desk'
                        ? 'border-amber-600 bg-amber-50 text-amber-900 ring-1 ring-amber-600'
                        : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <MapPin className="w-4 h-4 text-amber-600" />
                    <div>
                      <div className="text-xs font-bold">استلام من المكتب (Stop Desk)</div>
                      <div className="text-[10px] text-stone-500 font-mono">{selectedWilaya.deliveryDesk} د.ج</div>
                    </div>
                  </button>
                </div>

                {/* Exact Address / Municipality */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="block text-[11px] font-bold text-stone-700">
                    البلدية أو العنوان بالتفصيل (اختياري)
                  </label>
                  <input
                    type="text"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    placeholder="مثال: بلدية زرالدة، بالقرب من المسجد الكبير"
                    className="w-full bg-stone-50 border border-stone-300 focus:border-amber-600 rounded-xl px-3 py-2 text-xs font-medium outline-none"
                  />
                </div>

              </div>
            </div>

            {/* 4. Total and Confirm Order Button */}
            <div className="bg-stone-900 text-white rounded-2xl p-4 space-y-3 shadow-md">
              <div className="flex items-center justify-between text-xs border-b border-stone-800 pb-2">
                <span className="text-stone-400">
                  سعر القماش ({meters} متر × {formatPrice(fabric.pricePerMeter, currency)}):
                </span>
                <span className="font-bold font-mono">
                  {formatPrice(fabricSubtotal, currency)}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs border-b border-stone-800 pb-2">
                <span className="text-stone-400">تكلفة التوصيل ({selectedWilaya.name.split('(')[0]}):</span>
                <span className="font-bold text-amber-400 font-mono">
                  {formatPrice(deliveryCost, currency)}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm sm:text-base font-black pt-1">
                <span>المجموع الكلي عند الاستلام:</span>
                <span className="text-amber-400 font-mono text-lg">
                  {formatPrice(grandTotal, currency)}
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-amber-600 hover:bg-amber-700 text-white font-black rounded-xl text-sm sm:text-base transition-all active:scale-98 shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>جاري تأكيد وتسجيل الطلب...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-white" />
                    <span>تأكيد الطلب الآن (الدفع عند الاستلام)</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-3 text-[10px] text-stone-400 pt-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  معاينة القماش قبل الدفع
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-amber-400" />
                  توصيل سريع لـ 58 ولاية
                </span>
              </div>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
