import React, { useState } from 'react';
import {
  X,
  Search,
  Phone,
  MapPin,
  Calendar,
  Package,
  Truck,
  CheckCircle2,
  Trash2,
  Scissors,
  User,
  Filter,
  Printer,
  Copy,
  Check,
  Clock,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { Order, OrderStatus, CurrencyCode } from '../types';
import { formatPrice } from '../data/currencies';

interface OrdersManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  currency: CurrencyCode;
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  onDeleteOrder: (orderId: string) => void;
}

export const OrdersManagerModal: React.FC<OrdersManagerModalProps> = ({
  isOpen,
  onClose,
  orders,
  currency,
  onUpdateOrderStatus,
  onDeleteOrder,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(orders[0] || null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.phone.includes(searchTerm) ||
      (order.city && order.city.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'received':
        return {
          label: 'جديد / مستلم',
          bg: 'bg-amber-100 text-amber-800 border-amber-300',
          icon: Clock,
        };
      case 'cutting':
        return {
          label: 'قيد القص والتجهيز',
          bg: 'bg-blue-100 text-blue-800 border-blue-300',
          icon: Scissors,
        };
      case 'packing':
        return {
          label: 'قيد التغليف',
          bg: 'bg-indigo-100 text-indigo-800 border-indigo-300',
          icon: Package,
        };
      case 'shipped':
        return {
          label: 'قيد التوصيل (مع الموزع)',
          bg: 'bg-purple-100 text-purple-800 border-purple-300',
          icon: Truck,
        };
      case 'delivered':
        return {
          label: 'تم التسليم بنجاح',
          bg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          icon: CheckCircle2,
        };
      case 'cancelled':
        return {
          label: 'ملغى',
          bg: 'bg-rose-100 text-rose-800 border-rose-300',
          icon: AlertCircle,
        };
      default:
        return {
          label: status,
          bg: 'bg-stone-100 text-stone-800 border-stone-300',
          icon: Clock,
        };
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handlePrint = (order: Order) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html dir="rtl" lang="ar">
        <head>
          <title>وصل تسليم - ${order.id}</title>
          <style>
            body { font-family: 'Cairo', Arial, sans-serif; padding: 25px; line-height: 1.5; color: #1c1917; }
            .header { border-bottom: 2px solid #000; padding-bottom: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; }
            .badge { background: #f3f4f6; padding: 4px 8px; border-radius: 6px; font-size: 12px; }
            .table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .table th, .table td { border: 1px solid #e5e7eb; padding: 8px 12px; text-align: right; }
            .table th { background: #f9fafb; font-weight: bold; }
            .total-row { font-weight: bold; background: #fafaf9; }
            .footer { margin-top: 30px; border-top: 1px dashed #ccc; padding-top: 15px; font-size: 12px; color: #666; text-align: center; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h2 style="margin:0;">وصل طلب وتسليم قماش</h2>
              <p style="margin:4px 0; font-size: 13px;">رقم الطلب: <strong>${order.id}</strong></p>
              <p style="margin:0; font-size: 12px; color: #666;">التاريخ: ${new Date(order.createdAt).toLocaleDateString('ar-DZ')}</p>
            </div>
            <div style="text-align: left;">
              <span class="badge">الدفع عند الاستلام</span>
            </div>
          </div>

          <div style="background: #f8fafc; padding: 12px; border-radius: 8px; margin-bottom: 16px;">
            <h4 style="margin:0 0 6px 0;">بيانات الزبون والتسليم:</h4>
            <div><strong>الاسم:</strong> ${order.customerName}</div>
            <div><strong>رقم الهاتف:</strong> ${order.phone}</div>
            <div><strong>الولاية / العنوان:</strong> ${order.city} - ${order.district || ''} (${order.addressDetails})</div>
            ${order.cuttingNotes ? `<div><strong>ملاحظات القص:</strong> ${order.cuttingNotes}</div>` : ''}
          </div>

          <table class="table">
            <thead>
              <tr>
                <th>القماش / اللون</th>
                <th>الأمتار</th>
                <th>سعر المتر</th>
                <th>المجموع</th>
              </tr>
            </thead>
            <tbody>
              ${order.items
                .map(
                  (item) => `
                <tr>
                  <td>${item.fabricNameAr} (${item.color.nameAr})</td>
                  <td>${item.isSampleOnly ? 'عينة' : `${item.meters} م`}</td>
                  <td>${item.pricePerMeter} د.ج</td>
                  <td>${item.totalPrice} د.ج</td>
                </tr>
              `
                )
                .join('')}
              <tr class="total-row">
                <td colspan="3">رسوم التوصيل (${order.city}):</td>
                <td>${order.shippingFee === 0 ? 'مجاني' : `${order.shippingFee} د.ج`}</td>
              </tr>
              ${
                order.discount > 0
                  ? `
                <tr class="total-row">
                  <td colspan="3">الخصم:</td>
                  <td>- ${order.discount} د.ج</td>
                </tr>
              `
                  : ''
              }
              <tr class="total-row" style="font-size: 15px; background: #fef3c7;">
                <td colspan="3">المبلغ الإجمالي الواجب تحصيله نقداً:</td>
                <td><strong>${order.total} د.ج</strong></td>
              </tr>
            </tbody>
          </table>

          <div class="footer">
            متجر أقمشة أونلاين • شكراً لتعاملكم معنا
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in">
      <div className="relative bg-white rounded-3xl border border-stone-200 shadow-2xl max-w-5xl w-full max-h-[92vh] overflow-hidden flex flex-col my-auto">
        
        {/* Modal Top Header */}
        <div className="bg-stone-900 text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold shadow-xs">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black font-['Cairo']">
                  طلبات الزبائن والمبيعات
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[11px] font-bold">
                  {orders.length} طلب
                </span>
              </div>
              <p className="text-[11px] text-stone-400">
                متابعة الطلبات، أرقام هواتف الزبائن للتأكيد، وعناوين التوصيل لـ 58 ولاية
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search and Filters Bar */}
        <div className="p-4 bg-stone-50 border-b border-stone-200 flex flex-col sm:flex-row gap-3 items-center justify-between shrink-0">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="بحث باسم الزبون، الهاتف، أو الولاية..."
              className="w-full bg-white border border-stone-300 rounded-xl pr-9 pl-3 py-2 text-xs font-semibold outline-none focus:border-amber-600"
            />
          </div>

          {/* Status Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 text-xs">
            <span className="text-stone-400 text-[11px] font-bold flex items-center gap-1 shrink-0 ml-1">
              <Filter className="w-3.5 h-3.5" />
              الحالة:
            </span>
            {(
              [
                { key: 'all', label: 'الكل' },
                { key: 'received', label: 'جديد' },
                { key: 'cutting', label: 'قيد القص' },
                { key: 'shipped', label: 'قيد التوصيل' },
                { key: 'delivered', label: 'مكتمل' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key)}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors shrink-0 cursor-pointer ${
                  statusFilter === tab.key
                    ? 'bg-stone-900 text-amber-400 shadow-xs'
                    : 'bg-white hover:bg-stone-200 text-stone-700 border border-stone-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content: Orders List + Order Details Split Pane */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x md:divide-x-reverse divide-stone-200">
          
          {/* Left Column: Orders List */}
          <div className="md:col-span-5 overflow-y-auto p-3 space-y-2.5 max-h-[45vh] md:max-h-none bg-stone-50/50">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-12 space-y-2">
                <Package className="w-10 h-10 text-stone-300 mx-auto" />
                <p className="text-xs font-bold text-stone-600">لا توجد طلبات تطابق البحث</p>
              </div>
            ) : (
              filteredOrders.map((order) => {
                const badge = getStatusBadge(order.status);
                const isSelected = selectedOrder?.id === order.id;

                return (
                  <div
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-right space-y-2 ${
                      isSelected
                        ? 'bg-white border-amber-500 shadow-sm ring-1 ring-amber-500/20'
                        : 'bg-white hover:bg-stone-100/80 border-stone-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-black text-stone-900">
                            {order.id}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${badge.bg}`}
                          >
                            {badge.label}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-stone-900 mt-1 flex items-center gap-1">
                          <User className="w-3 h-3 text-stone-400" />
                          {order.customerName}
                        </h4>
                      </div>

                      <div className="text-left">
                        <span className="font-mono text-xs font-black text-amber-700 block">
                          {formatPrice(order.total, currency)}
                        </span>
                        <span className="text-[10px] text-stone-400 font-mono">
                          {new Date(order.createdAt).toLocaleDateString('ar-DZ')}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1 border-t border-stone-100">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-stone-400" />
                        {order.city}
                      </span>
                      <span className="font-mono font-bold text-stone-700">
                        {order.phone}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right Column: Active Order Details & Actions */}
          <div className="md:col-span-7 overflow-y-auto p-4 sm:p-6 bg-white flex flex-col justify-between space-y-5">
            {selectedOrder ? (
              <div className="space-y-5">
                
                {/* Header of selected order */}
                <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-stone-200">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-black text-stone-900 font-mono">
                        {selectedOrder.id}
                      </h3>
                      <button
                        onClick={() => handleCopy(selectedOrder.id, 'id')}
                        className="text-stone-400 hover:text-stone-700 p-1"
                        title="نسخ رقم الطلب"
                      >
                        {copiedId === 'id' ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                    <p className="text-[11px] text-stone-400">
                      تاريخ الطلب: {new Date(selectedOrder.createdAt).toLocaleString('ar-DZ')}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePrint(selectedOrder)}
                      className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>طباعة الوصل</span>
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`هل أنت متأكد من حذف الطلب ${selectedOrder.id}؟`)) {
                          onDeleteOrder(selectedOrder.id);
                          setSelectedOrder(null);
                        }
                      }}
                      className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                      title="حذف الطلب"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Status Changer Bar */}
                <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-700">تحديث حالة الطلب:</span>
                    <span
                      className={`px-2.5 py-0.5 rounded-md text-xs font-bold border ${
                        getStatusBadge(selectedOrder.status).bg
                      }`}
                    >
                      {getStatusBadge(selectedOrder.status).label}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-1">
                    {[
                      { key: 'received', label: 'مستلم / جديد' },
                      { key: 'cutting', label: 'قيد القص والتجهيز' },
                      { key: 'shipped', label: 'مع الموزع' },
                      { key: 'delivered', label: 'تم التسليم' },
                    ].map((st) => (
                      <button
                        key={st.key}
                        onClick={() =>
                          onUpdateOrderStatus(selectedOrder.id, st.key as OrderStatus)
                        }
                        className={`py-1.5 px-2 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                          selectedOrder.status === st.key
                            ? 'bg-amber-600 text-white shadow-xs'
                            : 'bg-white hover:bg-stone-200 text-stone-700 border border-stone-200'
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Customer Details Box */}
                <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 space-y-3">
                  <h4 className="text-xs font-black text-stone-900">بيانات الزبون والتوصيل:</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-stone-400 block text-[10px]">الاسم الكامل:</span>
                      <strong className="text-stone-900 text-sm">{selectedOrder.customerName}</strong>
                    </div>

                    <div>
                      <span className="text-stone-400 block text-[10px]">رقم الهاتف للتأكيد:</span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <strong className="font-mono text-stone-900 text-sm">{selectedOrder.phone}</strong>
                        <a
                          href={`tel:${selectedOrder.phone}`}
                          className="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold flex items-center gap-1"
                        >
                          <Phone className="w-2.5 h-2.5" />
                          اتصال
                        </a>
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <span className="text-stone-400 block text-[10px]">العنوان والولاية:</span>
                      <div className="font-bold text-stone-800 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>
                          {selectedOrder.city} {selectedOrder.district ? `• دائرة/بلدية ${selectedOrder.district}` : ''} - {selectedOrder.addressDetails}
                        </span>
                      </div>
                    </div>

                    {selectedOrder.cuttingNotes && (
                      <div className="sm:col-span-2 bg-amber-50/80 p-2.5 rounded-xl border border-amber-200/60 text-amber-900">
                        <span className="text-[10px] font-bold block">ملاحظات القص والتغليف من الزبون:</span>
                        <p className="text-xs mt-0.5">{selectedOrder.cuttingNotes}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Ordered Items List */}
                <div className="space-y-2">
                  <h4 className="text-xs font-black text-stone-900">الأقمشة والكميات المطلوبة:</h4>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white border border-stone-200 rounded-xl p-3 flex items-center justify-between gap-3 shadow-2xs"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.fabricNameAr}
                            referrerPolicy="no-referrer"
                            className="w-12 h-12 rounded-lg object-cover border border-stone-200"
                          />
                          <div>
                            <h5 className="text-xs font-black text-stone-900">
                              {item.fabricNameAr}
                            </h5>
                            <div className="flex items-center gap-1 text-[11px] text-stone-500">
                              <span
                                className="w-2.5 h-2.5 rounded-full border border-black/20"
                                style={{ backgroundColor: item.color.hex }}
                              />
                              <span>{item.color.nameAr}</span>
                              <span>•</span>
                              <span className="font-bold text-stone-700">
                                {item.isSampleOnly ? 'عينة قماش' : `${item.meters} متر`}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="text-left font-mono">
                          <span className="text-xs font-black text-stone-900">
                            {formatPrice(item.totalPrice, currency)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Summary Table */}
                <div className="border-t border-stone-200 pt-3 space-y-1 text-xs">
                  <div className="flex justify-between text-stone-600">
                    <span>المجموع الفرعي:</span>
                    <span className="font-mono">{formatPrice(selectedOrder.subtotal, currency)}</span>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-bold">
                      <span>الخصم:</span>
                      <span className="font-mono">- {formatPrice(selectedOrder.discount, currency)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-stone-600">
                    <span>رسوم التوصيل:</span>
                    <span className="font-mono">
                      {selectedOrder.shippingFee === 0
                        ? 'مجاني'
                        : formatPrice(selectedOrder.shippingFee, currency)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-stone-900 pt-1 border-t border-stone-200">
                    <span>الإجمالي عند الاستلام (الدفع نقداً):</span>
                    <span className="text-base font-mono text-amber-700">
                      {formatPrice(selectedOrder.total, currency)}
                    </span>
                  </div>
                </div>

              </div>
            ) : (
              <div className="text-center py-24 space-y-2">
                <Package className="w-12 h-12 text-stone-300 mx-auto" />
                <p className="text-xs font-bold text-stone-500">اختر طلباً من القائمة لعرض تفاصيله</p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
