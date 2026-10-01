export const formatINR = (amount) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(
    amount
  );

export const CATEGORIES = ['electronics', 'fashion', 'home', 'books', 'sports', 'beauty'];
