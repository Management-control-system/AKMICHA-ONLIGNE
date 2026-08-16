import React, { useState, useEffect } from 'react';
import { Fabric, FabricColor, CartItem, Order, OrderStatus, CurrencyCode } from './types';
import {
  getStoredFabrics,
  saveStoredFabrics,
  getStoredCart,
  saveStoredCart,
  getStoredOrders,
  saveStoredOrders,
  getStoredCurrency,
  saveStoredCurrency,
  deductInventoryStock,
} from './utils/storage';
import { SimpleHeader } from './components/SimpleHeader';
import { FabricPackageCard } from './components/FabricPackageCard';
import { QuickOrderModal } from './components/QuickOrderModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { AddProductModal } from './components/AddProductModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { OrdersManagerModal } from './components/OrdersManagerModal';
import { Package, Sparkles, ClipboardList } from 'lucide-react';

export default function App() {
  const [fabrics, setFabrics] = useState<Fabric[]>(() => getStoredFabrics());
  const [cart, setCart] = useState<CartItem[]>(() => getStoredCart());
  const [orders, setOrders] = useState<Order[]>(() => getStoredOrders());
  const [currency, setCurrency] = useState<CurrencyCode>(() => getStoredCurrency());
  
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    try {
      return localStorage.getItem('akmicha_is_admin') === 'true';
    } catch {
      return false;
    }
  });

  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutDiscount, setCheckoutDiscount] = useState(0);
  const [checkoutCoupon, setCheckoutCoupon] = useState('');

  // Quick Direct Order Modal State
  const [quickOrderModal, setQuickOrderModal] = useState<{
    isOpen: boolean;
    fabric: Fabric | null;
    selectedColor?: FabricColor;
    initialMeters?: number;
  }>({
    isOpen: false,
    fabric: null,
    initialMeters: 2.0,
  });

  // Sync to LocalStorage
  useEffect(() => {
    saveStoredFabrics(fabrics);
  }, [fabrics]);

  useEffect(() => {
    saveStoredCart(cart);
  }, [cart]);

  useEffect(() => {
    saveStoredOrders(orders);
  }, [orders]);

  useEffect(() => {
    saveStoredCurrency(currency);
  }, [currency]);

  useEffect(() => {
    try {
      localStorage.setItem('akmicha_is_admin', isAdminLoggedIn ? 'true' : 'false');
    } catch {}
  }, [isAdminLoggedIn]);

  // Cart Operations
  const handleAddToCart = (
    fabric: Fabric,
    color: FabricColor,
    meters: number,
    isSampleOnly: boolean = false,
    cuttingInstructions?: string
  ) => {
    const linePrice = isSampleOnly
      ? fabric.samplePrice
      : Number((fabric.pricePerMeter * meters).toFixed(2));

    const newItem: CartItem = {
      id: `${fabric.id}-${color.id}-${Date.now()}`,
      fabricId: fabric.id,
      fabricNameAr: fabric.nameAr,
      fabricNameEn: fabric.nameEn,
      fabricTypeAr: fabric.typeAr,
      color: color,
      meters: meters,
      isSampleOnly: isSampleOnly,
      pricePerMeter: fabric.pricePerMeter,
      totalPrice: linePrice,
      image: color.image || fabric.galleryImages[0],
      widthCm: fabric.widthCm,
      cuttingInstructions: cuttingInstructions,
    };

    setCart((prev) => [newItem, ...prev]);
  };

  const handleRemoveFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const handleUpdateCartItemMeters = (cartItemId: string, meters: number) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === cartItemId) {
          const newTotal = Number((item.pricePerMeter * meters).toFixed(2));
          return { ...item, meters, totalPrice: newTotal };
        }
        return item;
      })
    );
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleAddFabric = (newFabric: Fabric) => {
    setFabrics((prev) => [newFabric, ...prev]);
  };

  const handleDeleteFabric = (fabricId: string) => {
    setFabrics((prev) => prev.filter((f) => f.id !== fabricId));
  };

  const handleOrderCreated = (order: Order) => {
    setOrders((prev) => [order, ...prev]);
    const updated = deductInventoryStock(fabrics, order.items);
    setFabrics(updated);
    setCart([]);
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          return {
            ...order,
            status: newStatus,
          };
        }
        return order;
      })
    );
  };

  const handleDeleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-900 flex flex-col font-['Cairo'] selection:bg-[#c6923b]/20">
      
      {/* 1. Ultra Clean Minimal Header */}
      <SimpleHeader
        cart={cart}
        ordersCount={orders.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenOrders={() => setIsOrdersOpen(true)}
        isAdminLoggedIn={isAdminLoggedIn}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
        onAdminLogout={() => setIsAdminLoggedIn(false)}
        onOpenAddProduct={() => setIsAddProductOpen(true)}
      />

      {/* 2. Main Content: Pure Fabric Packages Grid */}
      <main className="flex-1 max-w-5xl mx-auto px-4 py-8 w-full space-y-6">
        
        {/* Simple friendly introduction banner */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-right">
            <h2 className="text-xl font-black text-stone-900 flex items-center justify-center sm:justify-start gap-2">
              <span>حزم وتشكيلات الأقمشة</span>
              <Sparkles className="w-4 h-4 text-[#c6923b]" />
            </h2>
            <p className="text-xs text-stone-500 font-medium">
              اختر القماش المناسب لك، حدد عدد الأمتار المطلوبة، واطلب مباشرة بتوصيل سريع لجميع الولايات مع الدفع عند الاستلام.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsOrdersOpen(true)}
              className="px-4 py-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <ClipboardList className="w-4 h-4 text-amber-600" />
              <span>طلبات الزبائن ({orders.length})</span>
            </button>

            {isAdminLoggedIn && (
              <button
                onClick={() => setIsAddProductOpen(true)}
                className="px-5 py-3 rounded-2xl bg-[#c6923b] hover:bg-[#b58331] text-stone-950 font-black text-xs shadow-sm transition-all cursor-pointer shrink-0"
              >
                + إضافة حزمة صور
              </button>
            )}
          </div>
        </div>

        {/* The Pure Image Packages Grid */}
        {fabrics.length === 0 ? (
          <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center space-y-3">
            <Package className="w-12 h-12 text-stone-300 mx-auto" />
            <h3 className="text-base font-bold text-stone-700">لا توجد حزم أقمشة حالياً</h3>
            <p className="text-xs text-stone-400">يمكنك إضافة حزم جديدة من زر الإدارة في الأعلى.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {fabrics.map((fabric) => (
              <FabricPackageCard
                key={fabric.id}
                fabric={fabric}
                currency={currency}
                onDirectOrder={(fab, color, meters) =>
                  setQuickOrderModal({
                    isOpen: true,
                    fabric: fab,
                    selectedColor: color,
                    initialMeters: meters,
                  })
                }
                onAddToCart={(fab, color, meters) => handleAddToCart(fab, color, meters)}
                onDelete={isAdminLoggedIn ? handleDeleteFabric : undefined}
              />
            ))}
          </div>
        )}

      </main>

      {/* 3. Simple Footer */}
      <footer className="bg-white border-t border-stone-200 py-6 text-center text-xs text-stone-500">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>متجر أقمشة أونلاين - توصيل سريع والدفع عند الاستلام</span>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsOrdersOpen(true)}
              className="text-[11px] font-bold text-stone-600 hover:text-stone-900 underline cursor-pointer"
            >
              عرض طلبات الزبائن ({orders.length})
            </button>
            <span>•</span>
            <button
              onClick={() => {
                if (isAdminLoggedIn) {
                  setIsAdminLoggedIn(false);
                } else {
                  setIsAdminLoginOpen(true);
                }
              }}
              className="text-[11px] font-bold text-stone-400 hover:text-stone-700 underline cursor-pointer"
            >
              {isAdminLoggedIn ? 'تسجيل الخروج من لوحة التاجر' : 'لوحة تحكم صاحب المتجر (إضافة صور/حزم)'}
            </button>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <OrdersManagerModal
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
        orders={orders}
        currency={currency}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onDeleteOrder={handleDeleteOrder}
      />

      <QuickOrderModal
        isOpen={quickOrderModal.isOpen}
        fabric={quickOrderModal.fabric}
        selectedColor={quickOrderModal.selectedColor}
        initialMeters={quickOrderModal.initialMeters}
        currency={currency}
        onClose={() => setQuickOrderModal({ isOpen: false, fabric: null })}
        onOrderCreated={handleOrderCreated}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        currency={currency}
        onRemoveItem={handleRemoveFromCart}
        onUpdateItemMeters={handleUpdateCartItemMeters}
        onProceedToCheckout={(discount, coupon) => {
          setCheckoutDiscount(discount);
          setCheckoutCoupon(coupon);
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        onClearCart={handleClearCart}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        currency={currency}
        discountAmount={checkoutDiscount}
        couponCode={checkoutCoupon}
        onOrderCreated={handleOrderCreated}
      />

      <AddProductModal
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        onAddFabric={handleAddFabric}
        currency={currency}
      />

      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={() => setIsAdminLoggedIn(true)}
      />

    </div>
  );
}
