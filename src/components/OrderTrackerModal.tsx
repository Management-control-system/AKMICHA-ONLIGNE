import React, { useState } from 'react';
import {
  X,
  Search,
  Truck,
  Scissors,
  CheckCircle2,
  Package,
  Clock,
  MapPin,
  FileText,
  Printer,
  ChevronRight,
  ArrowRight,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { Order, OrderStatus, CurrencyCode } from '../types';
import { formatPrice } from '../data/currencies';

interface OrderTrackerModalProps {
  orders: Order[];
  currency: CurrencyCode;
  onClose: () => void;
  onAdvanceOrderStatus: (orderId: string) => void;
}

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({
  orders,
  currency,
  onClose,
  onAdvanceOrderStatus,
}) => {
  const [searchKey, setSearchKey] = useState(orders[0]?.id || '');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(orders[0] || null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = searchKey.trim().toUpperCase();
    const found = orders.find(
      (o) =>
        o.id.toUpperCase() === clean ||
        o.trackingNumber.toUpperCase() === clean ||
        o.phone.includes(clean)
    );
    if (found) {
      setSelectedOrder(found);
    } else {
      alert('لم يتم العثور على طلب بهذا الرقم أو رقم الجوال');
    }
  };

  const TRACKING_STEPS: {
    status: OrderStatus;
    titleAr: string;
    descriptionAr: string;
    icon: any;
  }[] = [
    {
      status: 'received',
      titleAr: 'تم استلام الطلب وتأكيد الحجز',
      descriptionAr: 'تم تسجيل الطلب وتخصيص لفات القماش من المستودع.',
      icon: CheckCircle2,
    },
    {
      status: 'cutting',
      titleAr: 'القياس الدقيق وقص القماش بالليزر',
      descriptionAr: 'يقوم الخبير بقص الأمتار بدقة 0.25م حسب مواصفاتك.',
      icon: Scissors,
    },
    {
      status: 'packing',
      titleAr: 'الكي بالبخار والتغليف الفاخر',
      descriptionAr: 'تغليف القماش داخل أكياس قماشية مفرغة للحماية من الرطوبة.',
      icon: Package,
    },
    {
      status: 'shipped',
      titleAr: 'تم التسليم لشركة الشحن',
      descriptionAr: 'الشحنة في طريقها للتسليم عبر أسطول النقل السريع.',
      icon: Truck,
    },
    {
      status: 'delivered',
      titleAr: 'تم التوصيل بنجاح للعميل',
      descriptionAr: 'تم تسليم طاقة القماش بالكامل، ملبوس العافية!',
      icon: Sparkles,
    },
  ];

  const getStepIndex = (status: OrderStatus): number => {
    const map: Record<OrderStatus, number> = {
      received: 0,
      cutting: 1,
      packing: 2,
      shipped: 3,
      delivered: 4,
      cancelled: -1,
    };
    return map[status] ?? 0;
  };

  const currentStepIndex = selectedOrder ? getStepIndex(selectedOrder.status) : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="relative bg-[#fcfbf9] rounded-3xl border border-[#ded5c5] shadow-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto flex flex-col my-auto">
        
        {/* Header Bar */}
        <div className="sticky top-0 z-30 bg-[#fcfbf9]/95 backdrop-blur-md px-6 py-4 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-950 flex items-center justify-center text-emerald-400">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-[#1b2a22] font-['Cairo']">
                نظام تتبع قص وشحن الأقمشة
              </h2>
              <span className="text-[11px] text-stone-500 font-medium">
                تتبع فوري لمراحل القص والتجهيز والشحن
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-7 space-y-6">
          
          {/* Order Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchKey}
                onChange={(e) => setSearchKey(e.target.value)}
                placeholder="أدخل رقم الطلب (مثال: NSJ-84920) أو رقم الجوال..."
                className="w-full bg-[#f4efe6] border border-[#dcd4c5] rounded-xl pr-10 pl-3 py-2.5 text-xs sm:text-sm font-bold font-mono outline-none focus:border-[#c6923b]"
              />
              <Search className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#1b2a22] text-[#d8af56] text-xs font-bold rounded-xl hover:bg-[#273d32] transition-colors"
            >
              بحث وتتبع
            </button>
          </form>

          {/* Quick Orders Chips list */}
          {orders.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              <span className="text-stone-400 text-[11px] flex-shrink-0">الطلبات المسجلة:</span>
              {orders.map((o) => (
                <button
                  key={o.id}
                  onClick={() => {
                    setSelectedOrder(o);
                    setSearchKey(o.id);
                  }}
                  className={`px-3 py-1 rounded-lg font-mono text-[11px] font-bold border transition-all flex-shrink-0 ${
                    selectedOrder?.id === o.id
                      ? 'bg-[#c6923b] text-stone-950 border-[#c6923b]'
                      : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  {o.id} ({o.customerName})
                </button>
              ))}
            </div>
          )}

          {selectedOrder ? (
            <div className="space-y-6">
              
              {/* Order Status Hero Card */}
              <div className="bg-[#1b2a22] text-[#f4efe6] p-5 rounded-2xl border border-[#d8af56]/30 shadow-md space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/10">
                  <div>
                    <span className="text-[10px] text-[#d8af56] font-bold block">رقم تتبع الشحنة:</span>
                    <strong className="text-base font-mono text-white">{selectedOrder.trackingNumber}</strong>
                  </div>

                  <div className="text-left">
                    <span className="text-[10px] text-stone-400 font-medium block">تاريخ الطلب:</span>
                    <span className="text-xs text-stone-200 font-mono">
                      {new Date(selectedOrder.createdAt).toLocaleDateString('ar-SA')}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-stone-400 block text-[10px]">العميل المستلم:</span>
                    <strong className="text-white">{selectedOrder.customerName}</strong>
                  </div>

                  <div>
                    <span className="text-stone-400 block text-[10px]">الوجهة:</span>
                    <strong className="text-white">{selectedOrder.city}</strong>
                  </div>

                  <div>
                    <span className="text-stone-400 block text-[10px]">حالة الدفع:</span>
                    <strong className="text-emerald-400">
                      {selectedOrder.paymentStatus === 'paid' ? 'مدفوع إلكترونياً' : 'دفع عند الاستلام'}
                    </strong>
                  </div>

                  <div>
                    <span className="text-stone-400 block text-[10px]">الموعد المتوقع:</span>
                    <strong className="text-[#d8af56]">{selectedOrder.estimatedDeliveryDate}</strong>
                  </div>
                </div>

                {/* Simulate Next Step Button */}
                <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[11px] text-stone-300">
                    الحالة الحالية: <strong>{TRACKING_STEPS[currentStepIndex]?.titleAr}</strong>
                  </span>

                  {currentStepIndex < 4 && (
                    <button
                      onClick={() => onAdvanceOrderStatus(selectedOrder.id)}
                      className="px-3 py-1.5 bg-[#c6923b] hover:bg-[#b58331] text-stone-950 font-black text-xs rounded-xl shadow-xs transition-transform active:scale-95 flex items-center gap-1"
                      title="محاكاة انتقال الطلب إلى المرحلة التالية"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>تقديم مرحلة الطلب (محاكاة)</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Graphical Stepper Timeline */}
              <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-4">
                <h3 className="text-xs font-black text-stone-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#966b24]" />
                  <span>المسار الزمني لمراحل تنفيذ وقص الطلب:</span>
                </h3>

                <div className="relative pr-6 space-y-6 before:absolute before:right-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-stone-200">
                  {TRACKING_STEPS.map((step, idx) => {
                    const isPassed = idx <= currentStepIndex;
                    const isCurrent = idx === currentStepIndex;
                    const IconComponent = step.icon;

                    return (
                      <div key={step.status} className="relative flex items-start gap-4">
                        {/* Step Marker Circle */}
                        <div
                          className={`absolute -right-6 top-0 w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all ${
                            isCurrent
                              ? 'bg-[#c6923b] text-stone-950 ring-4 ring-[#c6923b]/20 font-black scale-110 shadow-sm'
                              : isPassed
                              ? 'bg-[#1b2a22] text-[#d8af56]'
                              : 'bg-stone-200 text-stone-400'
                          }`}
                        >
                          <IconComponent className="w-3.5 h-3.5" />
                        </div>

                        <div className="flex-1 min-w-0 pr-3">
                          <div className="flex items-center justify-between gap-2">
                            <h4
                              className={`text-xs font-bold ${
                                isCurrent
                                  ? 'text-[#966b24]'
                                  : isPassed
                                  ? 'text-stone-900'
                                  : 'text-stone-400'
                              }`}
                            >
                              {step.titleAr}
                            </h4>
                            {isCurrent && (
                              <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-bold animate-pulse">
                                جاري التنفيذ الآن
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-stone-500 mt-0.5">
                            {step.descriptionAr}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Items & Cutting Instructions Breakdown */}
              <div className="bg-[#f7f4ee] p-4 rounded-2xl border border-[#ded5c5] space-y-3 text-xs">
                <h3 className="font-bold text-stone-900 flex items-center gap-1.5">
                  <Scissors className="w-4 h-4 text-[#966b24]" />
                  <span>تفاصيل الأقمشة المقصوصة في هذا الطلب:</span>
                </h3>

                <div className="space-y-2">
                  {selectedOrder.items.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white p-3 rounded-xl border border-stone-200 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt=""
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-lg object-cover border border-stone-200"
                        />
                        <div>
                          <strong className="text-stone-900 block">{item.fabricNameAr}</strong>
                          <div className="flex items-center gap-2 text-stone-500 text-[11px]">
                            <span
                              className="w-2.5 h-2.5 rounded-full border border-black/20"
                              style={{ backgroundColor: item.color.hex }}
                            />
                            <span>{item.color.nameAr}</span>
                            <span>•</span>
                            <span className="font-mono font-bold text-[#1b2a22]">
                              الطول: {item.meters} متر
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-left">
                        <strong className="font-mono text-stone-900">
                          {formatPrice(item.totalPrice, currency)}
                        </strong>
                      </div>
                    </div>
                  ))}
                </div>

                {selectedOrder.cuttingNotes && (
                  <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200 text-[11px] text-amber-900">
                    <strong>ملاحظات القص:</strong> {selectedOrder.cuttingNotes}
                  </div>
                )}

                <div className="pt-2 border-t border-stone-200 flex justify-between font-black text-sm text-[#1b2a22]">
                  <span>إجمالي الطلب:</span>
                  <span className="font-mono">{formatPrice(selectedOrder.total, currency)}</span>
                </div>
              </div>

            </div>
          ) : (
            <div className="text-center py-10 text-stone-500 text-xs">
              لم يتم تحديد أي طلب بعد.
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
