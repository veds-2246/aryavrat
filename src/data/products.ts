export type Product = {
  id: string;
  name: string;
  description: string;
  pricePerLitre: number;
  minimumQuantity: number;
  quantityStep: number;
};

export const PRODUCTS: Record<string, Product> = {
  'cow-milk': {
    id: 'cow-milk',
    name: 'Fresh Cow Milk',
    description: 'Pure fresh cow milk delivered every morning.',

    // Temporary development price.
    // Change this once the actual selling price is finalized.
    pricePerLitre: 60,

    minimumQuantity: 0.5,
    quantityStep: 0.5,
  },
};

export const getProduct = (
  productId: string,
): Product | undefined => {
  return PRODUCTS[productId];
};