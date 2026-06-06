export function formatPrice(price: number, currency: string) {
  return new Intl.NumberFormat("en-RW", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatListingType(type: string) {
  return type.replace(/_/g, " ");
}
