import { CartItem } from '../types/shop';

/**
 * Configured ShopZayn WhatsApp Business number in international format without '+'.
 * Defaults to the configured storefront business number (03706900516 -> 923706900516)
 * and can be overridden via VITE_WHATSAPP_BUSINESS_NUMBER.
 */
const RAW_WHATSAPP_NUMBER =
  (import.meta.env.VITE_WHATSAPP_BUSINESS_NUMBER as string | undefined) ||
  '923706900516';

export const SHOPZAYN_WHATSAPP_NUMBER = RAW_WHATSAPP_NUMBER.replace(/\D/g, '');

export function generateOrderReference(): string {
  const randomDigits = Math.floor(100000 + Math.random() * 900000);
  return `SZ-${randomDigits}`;
}

export interface WhatsAppOrderPayload {
  orderNumber: string;
  customerName: string;
  phone: string;
  address: string;
  city: string;
  notes?: string;
  paymentMethodLabel: string;
  items: CartItem[];
  subtotal: number;
  promoApplied: boolean;
  promoDiscount: number;
  shippingFee: number;
  total: number;
}

export function buildWhatsAppOrderMessage(payload: WhatsAppOrderPayload): string {
  const lines: string[] = [
    `*NEW ORDER — SHOPZAYN*`,
    `Order Reference: *${payload.orderNumber}*`,
    ``,
    `*Customer Details*`,
    `Name: ${payload.customerName}`,
    `Phone / WhatsApp: ${payload.phone}`,
    `Delivery Address: ${payload.address}`,
    `City: ${payload.city}`,
  ];

  if (payload.notes && payload.notes.trim()) {
    lines.push(`Order Notes: ${payload.notes.trim()}`);
  }

  lines.push(``, `*Order Items*`);

  payload.items.forEach((item, index) => {
    const variantDetails = [
      item.variantLabel,
      item.sizeLabel ? `Size ${item.sizeLabel}` : '',
    ]
      .filter(Boolean)
      .join(' · ');

    const lineSubtotal = item.product.price * item.quantity;
    lines.push(
      `${index + 1}. ${item.product.name}${variantDetails ? ` (${variantDetails})` : ''}`,
      `   Qty: ${item.quantity} × $${item.product.price} = $${lineSubtotal}`
    );
  });

  lines.push(
    ``,
    `*Order Summary*`,
    `Products Subtotal: $${payload.subtotal}`
  );

  if (payload.promoApplied && payload.promoDiscount > 0) {
    lines.push(`Promo Discount (ZAYN10): -$${payload.promoDiscount}`);
  }

  lines.push(
    `Delivery Charges: ${payload.shippingFee === 0 ? 'Free' : `$${payload.shippingFee}`}`,
    `*Grand Total: $${payload.total}*`,
    `Payment Method: ${payload.paymentMethodLabel}`
  );

  return lines.join('\n');
}

export function buildWhatsAppClickToChatUrl(message: string): string {
  return `https://wa.me/${SHOPZAYN_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
