import React, { useState } from 'react';
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Copy,
  ExternalLink,
  MessageCircle,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import {
  buildWhatsAppClickToChatUrl,
  buildWhatsAppOrderMessage,
  generateOrderReference,
} from '../config/whatsapp';
import { FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING_FEE } from '../data/products';
import { CartItem, DemoOrderReceipt, Product } from '../types/shop';
import { ResilientImage } from './ResilientImage';

interface CartDrawerProps {
  isOpen: boolean;
  items: CartItem[];
  onClose: () => void;
  onUpdateQuantity: (key: string, delta: number) => void;
  onRemoveItem: (key: string) => void;
  onClearCart: () => void;
  onInspectProduct: (product: Product) => void;
}

interface FieldErrors {
  customerName?: string;
  phone?: string;
  address?: string;
  city?: string;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  items,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onInspectProduct,
}) => {
  const [step, setStep] = useState<
    'cart' | 'checkout' | 'awaiting-confirmation' | 'confirmed'
  >('cart');
  const [promoInput, setPromoInput] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');

  // Complete checkout form fields
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card-demo'>('cod');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const [pendingOrder, setPendingOrder] = useState<DemoOrderReceipt | null>(null);
  const [receipt, setReceipt] = useState<DemoOrderReceipt | null>(null);
  const [copiedMessage, setCopiedMessage] = useState(false);

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const promoDiscount = promoApplied ? Math.round(subtotal * 0.1) : 0;
  const discountedSubtotal = Math.max(0, subtotal - promoDiscount);
  const shippingFee =
    items.length === 0 || discountedSubtotal >= FREE_SHIPPING_THRESHOLD
      ? 0
      : STANDARD_SHIPPING_FEE;
  const total = discountedSubtotal + shippingFee;
  const remainingForFreeShipping = Math.max(
    0,
    FREE_SHIPPING_THRESHOLD - discountedSubtotal
  );
  const freeShippingProgress = Math.min(
    100,
    Math.round((discountedSubtotal / FREE_SHIPPING_THRESHOLD) * 100)
  );

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const normalized = promoInput.trim().toUpperCase();
    if (normalized === 'ZAYN10') {
      setPromoApplied(true);
      setPromoError('');
    } else {
      setPromoError('Invalid code. Try ZAYN10 for 10% off.');
    }
  };

  const validateCheckoutFields = (): FieldErrors => {
    const errors: FieldErrors = {};
    if (customerName.trim().length < 2) {
      errors.customerName = 'Please enter your full name.';
    }
    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length < 7 || phoneDigits.length > 15) {
      errors.phone = 'Enter a valid WhatsApp or mobile number (7–15 digits).';
    }
    if (address.trim().length < 6) {
      errors.address = 'Please enter your complete delivery address.';
    }
    if (city.trim().length < 2) {
      errors.city = 'Please enter your city.';
    }
    return errors;
  };

  const triggerWhatsAppLink = (url: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePlaceOrderOnWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    const errors = validateCheckoutFields();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    const orderNumber = generateOrderReference();
    const paymentMethodLabel =
      paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Card Preview (Pay on Delivery)';

    const whatsappMessage = buildWhatsAppOrderMessage({
      orderNumber,
      customerName: customerName.trim(),
      phone: phone.trim(),
      address: address.trim(),
      city: city.trim(),
      notes: notes.trim() || undefined,
      paymentMethodLabel,
      items: [...items],
      subtotal,
      promoApplied,
      promoDiscount,
      shippingFee,
      total,
    });

    const whatsappUrl = buildWhatsAppClickToChatUrl(whatsappMessage);

    const draftOrder: DemoOrderReceipt = {
      orderNumber,
      customerName: customerName.trim(),
      phone: phone.trim(),
      address: address.trim(),
      city: city.trim(),
      notes: notes.trim() || undefined,
      paymentMethod,
      whatsappUrl,
      whatsappMessage,
      items: [...items],
      subtotal,
      promoDiscount,
      shippingFee,
      total,
      placedAt: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    // Store pending order and open official wa.me click-to-chat link.
    // Cart is intentionally NOT cleared yet until customer confirms sending.
    setPendingOrder(draftOrder);
    setCopiedMessage(false);
    setStep('awaiting-confirmation');
    triggerWhatsAppLink(whatsappUrl);
  };

  const handleConfirmWhatsAppOrderSent = () => {
    if (!pendingOrder) return;
    setReceipt(pendingOrder);
    setPendingOrder(null);
    onClearCart();
    setPromoApplied(false);
    setPromoInput('');
    setStep('confirmed');
  };

  const handleCopyMessage = async () => {
    if (!pendingOrder) return;
    try {
      await navigator.clipboard.writeText(pendingOrder.whatsappMessage);
      setCopiedMessage(true);
      window.setTimeout(() => setCopiedMessage(false), 2000);
    } catch {
      // Clipboard fallback ignored if blocked
    }
  };

  const handleCloseDrawer = () => {
    if (step === 'confirmed') {
      setStep('cart');
      setReceipt(null);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleCloseDrawer}
            className="fixed inset-0 bg-slate-950/50 backdrop-blur-[2px]"
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Shopping Bag"
            className="relative z-10 w-full max-w-md bg-white h-full flex flex-col shadow-2xl border-l border-slate-200"
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                {(step === 'checkout' || step === 'awaiting-confirmation') && (
                  <button
                    type="button"
                    onClick={() =>
                      setStep(step === 'awaiting-confirmation' ? 'checkout' : 'cart')
                    }
                    aria-label="Go back"
                    className="w-8 h-8 -ml-1 inline-flex items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                )}
                <h2 className="text-lg font-bold text-slate-950 font-display">
                  {step === 'cart' && 'Shopping Bag'}
                  {step === 'checkout' && 'Checkout Details'}
                  {step === 'awaiting-confirmation' && 'Complete WhatsApp Order'}
                  {step === 'confirmed' && 'Order Confirmed'}
                </h2>
              </div>

              <button
                type="button"
                onClick={handleCloseDrawer}
                aria-label="Close shopping bag"
                className="w-9 h-9 inline-flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-950 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-5 py-5">
              {step === 'confirmed' && receipt ? (
                <div className="py-4 space-y-6">
                  <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-5 text-center">
                    <CheckCircle2 className="w-10 h-10 text-blue-600 mx-auto mb-3" />
                    <p className="text-xs font-semibold uppercase tracking-wider text-blue-700 mb-1">
                      WhatsApp Order Recorded
                    </p>
                    <h3 className="text-xl font-bold text-slate-950 font-display">
                      Order #{receipt.orderNumber} Confirmed
                    </h3>
                    <p className="text-sm text-slate-600 mt-2">
                      Thank you, {receipt.customerName}. Your order has been sent via
                      WhatsApp and your shopping bag has been cleared.
                    </p>
                  </div>

                  <div className="border border-slate-200 rounded-xl p-4 space-y-3 text-sm">
                    <div className="flex justify-between gap-4 text-slate-600">
                      <span>WhatsApp / Phone</span>
                      <span className="font-medium text-slate-900 tabular-nums">
                        {receipt.phone}
                      </span>
                    </div>
                    <div className="flex justify-between gap-4 text-slate-600">
                      <span>Delivery Address</span>
                      <span className="font-medium text-slate-900 text-right max-w-[210px]">
                        {receipt.address}, {receipt.city}
                      </span>
                    </div>
                    <div className="flex justify-between gap-4 text-slate-600">
                      <span>Payment Method</span>
                      <span className="font-medium text-slate-900">
                        {receipt.paymentMethod === 'cod'
                          ? 'Cash on Delivery'
                          : 'Card Preview (Pay on Delivery)'}
                      </span>
                    </div>
                    <div className="pt-3 border-t border-slate-100 flex justify-between font-bold text-slate-950 tabular-nums">
                      <span>Grand Total</span>
                      <span>${receipt.total}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleCloseDrawer}
                    className="w-full py-3.5 min-h-[46px] text-sm font-semibold text-white bg-slate-950 hover:bg-blue-600 rounded-lg transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : step === 'awaiting-confirmation' && pendingOrder ? (
                <div className="space-y-5">
                  <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
                        Step 2 of 2 · Press Send in WhatsApp
                      </span>
                      <span className="text-xs font-mono font-semibold text-slate-900">
                        {pendingOrder.orderNumber}
                      </span>
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      WhatsApp has been opened with your complete order message. Please
                      press <strong>Send</strong> inside WhatsApp, then click{' '}
                      <strong>Confirm Order</strong> below to complete your order and clear
                      your bag.
                    </p>
                  </div>

                  {/* Direct Click-to-Chat Re-open & Copy */}
                  <div className="flex flex-wrap gap-2.5">
                    <a
                      href={pendingOrder.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[42px] text-xs font-semibold text-white bg-[#16A34A] hover:bg-[#15803D] rounded-lg transition-colors whitespace-nowrap"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Open WhatsApp Again</span>
                    </a>
                    <button
                      type="button"
                      onClick={handleCopyMessage}
                      className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 min-h-[42px] text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
                    >
                      {copiedMessage ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-blue-600" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Text</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Generated WhatsApp Order Summary Preview */}
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                      Generated WhatsApp Message
                    </p>
                    <pre className="whitespace-pre-wrap break-words font-sans text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-xl p-4 max-h-64 overflow-y-auto leading-relaxed">
                      {pendingOrder.whatsappMessage}
                    </pre>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-600">
                    Your cart items remain saved until you confirm below.
                  </div>
                </div>
              ) : items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4">
                  <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center mb-4">
                    <ShoppingBag className="w-6 h-6 text-slate-500" />
                  </div>
                  <h3 className="text-base font-bold text-slate-950 mb-1 font-display">
                    Your ShopZayn bag is empty
                  </h3>
                  <p className="text-sm text-slate-500 max-w-xs mb-6">
                    Browse our 7 curated categories and add products to see your live order
                    summary here.
                  </p>
                  <button
                    type="button"
                    onClick={handleCloseDrawer}
                    className="px-5 py-2.5 min-h-[42px] text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                  >
                    Start Browsing
                  </button>
                </div>
              ) : step === 'cart' ? (
                <div className="space-y-5">
                  {/* Free Shipping Progress */}
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5">
                    <div className="flex justify-between text-xs font-medium text-slate-700 mb-2">
                      {remainingForFreeShipping === 0 ? (
                        <span className="text-blue-700 font-semibold">
                          Unlocked: Free Express Shipping
                        </span>
                      ) : (
                        <span>
                          Add <strong className="tabular-nums">${remainingForFreeShipping}</strong>{' '}
                          more for Free Express Shipping
                        </span>
                      )}
                      <span className="tabular-nums text-slate-500">
                        {freeShippingProgress}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 transition-all duration-300"
                        style={{ width: `${freeShippingProgress}%` }}
                      />
                    </div>
                  </div>

                  {/* Cart Items */}
                  <ul className="divide-y divide-slate-200">
                    {items.map((item) => (
                      <li key={item.key} className="py-4 flex gap-3.5">
                        <button
                          type="button"
                          onClick={() => {
                            onInspectProduct(item.product);
                            onClose();
                          }}
                          className="w-20 h-20 rounded-lg overflow-hidden border border-slate-200 shrink-0 bg-slate-100"
                        >
                          <ResilientImage
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-full h-full"
                          />
                        </button>

                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  onInspectProduct(item.product);
                                  onClose();
                                }}
                                className="text-left text-sm font-semibold text-slate-950 hover:text-blue-600 line-clamp-1 font-display"
                              >
                                {item.product.name}
                              </button>
                              <button
                                type="button"
                                onClick={() => onRemoveItem(item.key)}
                                aria-label={`Remove ${item.product.name}`}
                                className="text-slate-400 hover:text-red-600 p-1 -mr-1 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            <p className="text-xs text-slate-500 mt-0.5 truncate">
                              {item.variantLabel}
                              {item.sizeLabel ? ` · Size ${item.sizeLabel}` : ''}
                            </p>
                          </div>

                          <div className="flex items-center justify-between mt-3">
                            <div className="inline-flex items-center border border-slate-200 rounded-md bg-slate-50">
                              <button
                                type="button"
                                onClick={() => onUpdateQuantity(item.key, -1)}
                                aria-label="Decrease item quantity"
                                className="w-8 h-8 inline-flex items-center justify-center text-slate-600 hover:text-slate-950"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="w-7 text-center text-xs font-semibold text-slate-950 tabular-nums">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => onUpdateQuantity(item.key, 1)}
                                aria-label="Increase item quantity"
                                className="w-8 h-8 inline-flex items-center justify-center text-slate-600 hover:text-slate-950"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <span className="text-sm font-bold text-slate-950 tabular-nums font-display">
                              ${item.product.price * item.quantity}
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>

                  {/* Promo Code */}
                  <form onSubmit={handleApplyPromo} className="pt-2">
                    <label
                      htmlFor="promo-code"
                      className="block text-xs font-medium text-slate-600 mb-1.5"
                    >
                      Promo code{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setPromoInput('ZAYN10');
                          setPromoError('');
                        }}
                        className="text-blue-600 hover:underline font-semibold ml-1"
                      >
                        (Use ZAYN10)
                      </button>
                    </label>
                    <div className="flex gap-2">
                      <input
                        id="promo-code"
                        type="text"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value)}
                        placeholder="Enter code"
                        disabled={promoApplied}
                        className="flex-1 h-10 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600 disabled:bg-slate-100"
                      />
                      {promoApplied ? (
                        <button
                          type="button"
                          onClick={() => {
                            setPromoApplied(false);
                            setPromoInput('');
                          }}
                          className="px-3.5 h-10 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
                        >
                          Remove
                        </button>
                      ) : (
                        <button
                          type="submit"
                          className="px-4 h-10 text-xs font-semibold text-white bg-slate-950 hover:bg-blue-600 rounded-lg transition-colors"
                        >
                          Apply
                        </button>
                      )}
                    </div>
                    {promoError && (
                      <p className="text-xs text-red-600 mt-1.5">{promoError}</p>
                    )}
                    {promoApplied && (
                      <p className="text-xs text-blue-700 font-medium mt-1.5">
                        Code ZAYN10 applied — 10% extra savings!
                      </p>
                    )}
                  </form>
                </div>
              ) : (
                /* Step: Complete Checkout Form */
                <form
                  id="whatsapp-checkout-form"
                  noValidate
                  onSubmit={handlePlaceOrderOnWhatsApp}
                  className="space-y-4"
                >
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 text-xs text-slate-600 leading-relaxed">
                    Fill in your delivery details below. Clicking{' '}
                    <strong className="text-slate-900">Place Order on WhatsApp</strong> will
                    open your formatted order directly in WhatsApp so you can review and press
                    Send.
                  </div>

                  {/* Customer Full Name */}
                  <div>
                    <label
                      htmlFor="checkout-name"
                      className="block text-xs font-semibold text-slate-700 mb-1"
                    >
                      Customer Full Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      id="checkout-name"
                      type="text"
                      value={customerName}
                      onChange={(e) => {
                        setCustomerName(e.target.value);
                        if (fieldErrors.customerName) {
                          setFieldErrors((prev) => ({ ...prev, customerName: undefined }));
                        }
                      }}
                      placeholder="e.g. Zayn Ahmed"
                      className={`w-full h-11 px-3 text-sm border rounded-lg focus:outline-none ${
                        fieldErrors.customerName
                          ? 'border-red-500 focus:border-red-600'
                          : 'border-slate-200 focus:border-blue-600'
                      }`}
                    />
                    {fieldErrors.customerName && (
                      <p className="text-xs text-red-600 mt-1">{fieldErrors.customerName}</p>
                    )}
                  </div>

                  {/* WhatsApp / Mobile Number */}
                  <div>
                    <label
                      htmlFor="checkout-phone"
                      className="block text-xs font-semibold text-slate-700 mb-1"
                    >
                      WhatsApp / Mobile Number <span className="text-red-600">*</span>
                    </label>
                    <input
                      id="checkout-phone"
                      type="tel"
                      inputMode="tel"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (fieldErrors.phone) {
                          setFieldErrors((prev) => ({ ...prev, phone: undefined }));
                        }
                      }}
                      placeholder="e.g. 0300 1234567"
                      className={`w-full h-11 px-3 text-sm border rounded-lg focus:outline-none ${
                        fieldErrors.phone
                          ? 'border-red-500 focus:border-red-600'
                          : 'border-slate-200 focus:border-blue-600'
                      }`}
                    />
                    {fieldErrors.phone && (
                      <p className="text-xs text-red-600 mt-1">{fieldErrors.phone}</p>
                    )}
                  </div>

                  {/* Complete Delivery Address */}
                  <div>
                    <label
                      htmlFor="checkout-address"
                      className="block text-xs font-semibold text-slate-700 mb-1"
                    >
                      Complete Delivery Address <span className="text-red-600">*</span>
                    </label>
                    <textarea
                      id="checkout-address"
                      rows={2}
                      value={address}
                      onChange={(e) => {
                        setAddress(e.target.value);
                        if (fieldErrors.address) {
                          setFieldErrors((prev) => ({ ...prev, address: undefined }));
                        }
                      }}
                      placeholder="House / Apartment, Street, Sector or Area"
                      className={`w-full p-3 text-sm border rounded-lg focus:outline-none ${
                        fieldErrors.address
                          ? 'border-red-500 focus:border-red-600'
                          : 'border-slate-200 focus:border-blue-600'
                      }`}
                    />
                    {fieldErrors.address && (
                      <p className="text-xs text-red-600 mt-1">{fieldErrors.address}</p>
                    )}
                  </div>

                  {/* City */}
                  <div>
                    <label
                      htmlFor="checkout-city"
                      className="block text-xs font-semibold text-slate-700 mb-1"
                    >
                      City <span className="text-red-600">*</span>
                    </label>
                    <input
                      id="checkout-city"
                      type="text"
                      value={city}
                      onChange={(e) => {
                        setCity(e.target.value);
                        if (fieldErrors.city) {
                          setFieldErrors((prev) => ({ ...prev, city: undefined }));
                        }
                      }}
                      placeholder="e.g. Lahore, Karachi, Islamabad"
                      className={`w-full h-11 px-3 text-sm border rounded-lg focus:outline-none ${
                        fieldErrors.city
                          ? 'border-red-500 focus:border-red-600'
                          : 'border-slate-200 focus:border-blue-600'
                      }`}
                    />
                    {fieldErrors.city && (
                      <p className="text-xs text-red-600 mt-1">{fieldErrors.city}</p>
                    )}
                  </div>

                  {/* Payment Method */}
                  <div>
                    <span className="block text-xs font-semibold text-slate-700 mb-2">
                      Payment Method
                    </span>
                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('cod')}
                        className={`p-3 text-left rounded-lg border text-xs font-semibold transition-colors min-h-[44px] ${
                          paymentMethod === 'cod'
                            ? 'border-blue-600 bg-blue-50 text-blue-900'
                            : 'border-slate-200 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        Cash on Delivery
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('card-demo')}
                        className={`p-3 text-left rounded-lg border text-xs font-semibold transition-colors min-h-[44px] ${
                          paymentMethod === 'card-demo'
                            ? 'border-blue-600 bg-blue-50 text-blue-900'
                            : 'border-slate-200 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        Card Preview (COD)
                      </button>
                    </div>
                  </div>

                  {/* Optional Order Notes */}
                  <div>
                    <label
                      htmlFor="checkout-notes"
                      className="block text-xs font-semibold text-slate-700 mb-1"
                    >
                      Order Notes <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      id="checkout-notes"
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Delivery timing, landmark, or gift instructions"
                      className="w-full h-11 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </form>
              )}
            </div>

            {/* Footer Totals & Action */}
            {items.length > 0 && step !== 'confirmed' && (
              <div className="border-t border-slate-200 px-5 py-4 bg-slate-50 space-y-3">
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between text-slate-600 tabular-nums">
                    <span>Subtotal</span>
                    <span>${subtotal}</span>
                  </div>
                  {promoDiscount > 0 && (
                    <div className="flex justify-between text-blue-700 font-medium tabular-nums">
                      <span>Promo (ZAYN10)</span>
                      <span>-${promoDiscount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-600 tabular-nums">
                    <span>Delivery Charges</span>
                    <span>{shippingFee === 0 ? 'Free' : `$${shippingFee}`}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex justify-between text-base font-bold text-slate-950 tabular-nums font-display">
                    <span>Grand Total</span>
                    <span>${total}</span>
                  </div>
                </div>

                {step === 'cart' ? (
                  <button
                    type="button"
                    onClick={() => setStep('checkout')}
                    className="w-full py-3.5 min-h-[48px] text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                  >
                    Proceed to Checkout
                  </button>
                ) : step === 'checkout' ? (
                  <button
                    type="submit"
                    form="whatsapp-checkout-form"
                    className="w-full inline-flex items-center justify-center gap-2 py-3.5 min-h-[48px] text-sm font-semibold text-white bg-[#16A34A] hover:bg-[#15803D] rounded-lg transition-colors shadow-sm"
                  >
                    <MessageCircle className="w-4 h-4 shrink-0" />
                    <span>Place Order on WhatsApp (${total})</span>
                  </button>
                ) : (
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={handleConfirmWhatsAppOrderSent}
                      className="w-full inline-flex items-center justify-center gap-2 py-3.5 min-h-[48px] text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>I’ve Sent Order on WhatsApp — Confirm</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep('checkout')}
                      className="w-full py-2.5 min-h-[40px] text-xs font-semibold text-slate-600 hover:text-slate-950 transition-colors"
                    >
                      Back to Edit Order (Keep Bag)
                    </button>
                  </div>
                )}
              </div>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
};
