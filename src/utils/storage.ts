import { Fabric, CartItem, Order, CurrencyCode } from '../types';
import { INITIAL_FABRICS } from '../data/fabrics';

const STORAGE_KEYS = {
  FABRICS: 'akmicha_fabrics_stock_v2',
  CART: 'akmicha_cart_v2',
  ORDERS: 'akmicha_orders_v2',
  CURRENCY: 'akmicha_currency_v2',
};

// Initial demo orders so tracking can be tested immediately out of the box
const INITIAL_DEMO_ORDERS: Order[] = [
  {
    id: 'NSJ-84920',
    trackingNumber: 'TRK-984210SA',
    createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(), // 1.5 days ago
    customerName: 'محمد السبيعي',
    phone: '0551234567',
    email: 'm.subaie@example.com',
    city: 'الرياض',
    district: 'حي النرجس',
    addressDetails: 'شارع رقم 14، فيلا 28',
    cuttingNotes: 'يرجى قص قطعة القطن الياباني إلى طاقة ثوب 3.5م وقطعة 1.5م لجلابية',
    items: [
      {
        id: 'cart-line-demo-1',
        fabricId: 'fab-jp-cotton-1',
        fabricNameAr: 'قطن ياباني فاخر للثياب (تويوبو 5000)',
        fabricNameEn: 'Japanese Premium Thobe Cotton (Toyobo)',
        fabricTypeAr: 'قطن ياباني 100%',
        color: {
          id: 'c-white',
          nameAr: 'أبيض ناصع (ثلجي)',
          nameEn: 'Bright Pure White',
          hex: '#fbfbfd',
          inStockMeters: 60.0,
          image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80',
        },
        meters: 5.0,
        pricePerMeter: 68,
        totalPrice: 340,
        image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80',
        widthCm: 148,
        cuttingInstructions: 'طاقة ثوب 3.5 متر + قطعة 1.5 متر',
      },
      {
        id: 'cart-line-demo-2',
        fabricId: 'fab-kr-royal-crepe',
        fabricNameAr: 'كريب كوري ملكي للعبايات (Royal Korean Crepe)',
        fabricNameEn: 'Korean Royal Jet Black Abaya Crepe',
        fabricTypeAr: 'كريب جورجيت كوري ممتاز',
        color: {
          id: 'c-jet-black',
          nameAr: 'أسود كربون فاحم',
          nameEn: 'Double Jet Black',
          hex: '#0d0d0f',
          inStockMeters: 110.0,
          image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
        },
        meters: 3.5,
        pricePerMeter: 48,
        totalPrice: 168,
        image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
        widthCm: 172,
        cuttingInstructions: 'طاقة عباية واحدة 3.5 متر كاملة',
      },
    ],
    subtotal: 508,
    shippingFee: 0, // Free over 300
    discount: 50.8, // Coupon FABRIC10
    total: 457.2,
    paymentMethod: 'online_card',
    paymentStatus: 'paid',
    status: 'shipped',
    statusHistory: [
      {
        status: 'received',
        titleAr: 'تم استلام الطلب وتأكيد الدفع الإلكتروني',
        titleEn: 'Order Received & Payment Confirmed',
        descriptionAr: 'تم تأكيد عملية الدفع بنجاح وإرسال الطلب لغرفة القص بالليزر.',
        timestamp: new Date(Date.now() - 36 * 3600 * 1000).toLocaleString('ar-SA'),
      },
      {
        status: 'cutting',
        titleAr: 'جاري القياس الدقيق وقص الأقمشة بالليزر',
        titleEn: 'Precision Fabric Measuring & Laser Cutting',
        descriptionAr: 'تم إخراج لفات الأقمشة وقص 5.0م قطن ياباني و 3.5م كريب كوري حسب التعليمات.',
        timestamp: new Date(Date.now() - 28 * 3600 * 1000).toLocaleString('ar-SA'),
      },
      {
        status: 'packing',
        titleAr: 'الكي بالبخار والتغليف الفاخر المعزول',
        titleEn: 'Steam Pressing & Luxury Protected Packaging',
        descriptionAr: 'تم كي الأقمشة وتغليفها داخل صناديق قماشية واقية من الرطوبة والأتربة.',
        timestamp: new Date(Date.now() - 16 * 3600 * 1000).toLocaleString('ar-SA'),
      },
      {
        status: 'shipped',
        titleAr: 'تم التسليم لشركة الشحن (أرامكس Express)',
        titleEn: 'Handed to Courier (Aramex Express)',
        descriptionAr: 'شحنتك الآن في طريقها لمدينة الرياض برقم تتبع TRK-984210SA.',
        timestamp: new Date(Date.now() - 6 * 3600 * 1000).toLocaleString('ar-SA'),
      },
    ],
    estimatedDeliveryDate: 'غداً خلال أوقات العمل الرسمية',
  },
];

export function getStoredFabrics(): Fabric[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.FABRICS);
    if (!data) return INITIAL_FABRICS;
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_FABRICS;
  } catch (e) {
    console.error('Failed to load fabrics from localStorage', e);
    return INITIAL_FABRICS;
  }
}

export function saveStoredFabrics(fabrics: Fabric[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.FABRICS, JSON.stringify(fabrics));
  } catch (e) {
    console.error('Failed to save fabrics to localStorage', e);
  }
}

export function getStoredCart(): CartItem[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CART);
    if (!data) return [];
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

export function saveStoredCart(cart: CartItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  } catch (e) {
    console.error('Failed to save cart to localStorage', e);
  }
}

export function getStoredOrders(): Order[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_DEMO_ORDERS));
      return INITIAL_DEMO_ORDERS;
    }
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_DEMO_ORDERS;
  } catch (e) {
    return INITIAL_DEMO_ORDERS;
  }
}

export function saveStoredOrders(orders: Order[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  } catch (e) {
    console.error('Failed to save orders to localStorage', e);
  }
}

export function getStoredCurrency(): CurrencyCode {
  try {
    const code = localStorage.getItem(STORAGE_KEYS.CURRENCY) as CurrencyCode;
    return code || 'DZD';
  } catch (e) {
    return 'DZD';
  }
}

export function saveStoredCurrency(currency: CurrencyCode): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CURRENCY, currency);
  } catch (e) {}
}

/**
 * Deduct meters from warehouse inventory automatically upon order placement
 */
export function deductInventoryStock(
  currentFabrics: Fabric[],
  orderItems: CartItem[]
): Fabric[] {
  const updatedFabrics = currentFabrics.map((fabric) => {
    // Check if any cart item matches this fabric
    const matchingItems = orderItems.filter((item) => item.fabricId === fabric.id);
    if (matchingItems.length === 0) return fabric;

    // Clone colors
    const updatedColors = fabric.colors.map((color) => {
      const itemsForColor = matchingItems.filter((item) => item.color.id === color.id);
      if (itemsForColor.length === 0) return color;

      const totalDeductedMeters = itemsForColor.reduce(
        (sum, item) => sum + (item.isSampleOnly ? 0.1 : item.meters),
        0
      );

      const newStock = Math.max(0, Number((color.inStockMeters - totalDeductedMeters).toFixed(2)));
      return {
        ...color,
        inStockMeters: newStock,
      };
    });

    return {
      ...fabric,
      colors: updatedColors,
    };
  });

  saveStoredFabrics(updatedFabrics);
  return updatedFabrics;
}
