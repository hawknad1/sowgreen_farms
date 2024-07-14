// export interface Product {
//   category: string;
//   url: string;
//   prices: number;
//   title: string;
//   images: string;
//   currency: string;
//   warranty: string;
//   _warnings: string;
//   breadcrumbs: string;
//   description: string;
//   out_of_stock: boolean;
// }

export interface Product {
  id: string;
  categoryName: string;
  imageUrl: string;
  price: number;
  title: string;
  description: string;
  inStock: boolean;
  products: [];
}
