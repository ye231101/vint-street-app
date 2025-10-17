/**
 * Product Types
 * Types for product data from Typesense
 */

export interface ProductAttributes {
  pa_size?: string[];
  pa_colour?: string[];
  pa_color?: string[];
  pa_condition?: string[];
  pa_gender?: string[];
  flaws?: string[];
  pa_collar_to_hem_cm?: string[];
  pa_set?: string[];
  [key: string]: string[] | undefined;
}

export interface VintStreetListing {
  id: number;
  name: string;
  price: number;
  stockQuantity: number;
  permalink?: string;
  onSale: boolean;
  featured: boolean;
  brand: string;
  attributes: ProductAttributes;
  fullImageUrls: string[];
  thumbnailImageUrls: string[];
  description?: string;
  favoritesCount: number;
  averageRating: number;
  reviewCount: number;
  sku?: string;
  shortDescription?: string;
  stockStatus: string;
  categories: string[];
  categorySlugs: string[];
  vendorId: number;
  vendorName: string;
  vendorShopName: string;
  vendorShopUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TypesenseSearchHit {
  document: TypesenseProductDocument;
  highlight?: any;
  highlights?: any[];
  text_match?: number;
}

export interface TypesenseProductDocument {
  id: string;
  name: string;
  price: string | number;
  stock_quantity?: string | number;
  permalink?: string;
  onSale?: boolean;
  featured?: boolean;
  brand?: string | string[];
  pa_size?: string[];
  pa_colour?: string[];
  pa_color?: string[];
  pa_condition?: string[];
  pa_gender?: string[];
  flaws?: string[];
  collar_to_hem_cm?: string[];
  pa_set?: string[];
  image_urls?: string | string[];
  image_urls_thumbnail?: string | string[];
  description?: string;
  favorites_count?: number;
  average_rating?: number;
  review_count?: number;
  sku?: string;
  short_description?: string;
  stock_status?: string;
  categories?: string[];
  category_slugs?: string[];
  vendor_id?: string | number;
  vendor_name?: string;
  vendor_shop_name?: string;
  vendor_shop_url?: string;
  created_at?: number;
  updated_at?: number;
  post_status?: string;
  catalog_visibility?: string;
}

export interface TypesenseSearchResponse {
  hits: TypesenseSearchHit[];
  found: number;
  page: number;
  per_page?: number;
  facets?: TypesenseFacet[];
}

export interface TypesenseFacet {
  field: string;
  counts: Array<{
    value: string;
    count: number;
  }>;
}

export interface SearchParams {
  query: string;
  queryBy?: string;
  filterBy?: string;
  sortBy?: string;
  perPage?: number;
  page?: number;
  facetBy?: string[];
  facetSize?: number;
}
