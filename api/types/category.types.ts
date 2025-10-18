/**
 * Category Types
 * Type definitions for category-related data structures
 */

export interface Category {
  id: number;
  name: string;
  slug: string;
  children: Category[];
  parentId?: number;
  count: number;
  description: string;
  image?: string;
}

export interface CategoryResponse {
  categories: Category[];
}

export interface CategoryFilters {
  categories?: string[];
  subcategories?: string[];
}

export interface CategoryNavigation {
  path: Category[];
  currentCategory?: Category;
  breadcrumbs: string[];
}
