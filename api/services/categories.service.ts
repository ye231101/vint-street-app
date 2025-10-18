/**
 * Categories Service
 * Service for fetching and managing category data
 */

import { Category, CategoryResponse } from '../types/category.types';

class CategoriesService {
  private baseUrl: string;

  constructor() {
    // Use the same base URL as other services
    this.baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL || 'https://vintstreet.com/wp-json';
  }

  /**
   * Fetch all categories from the API
   */
  async getCategories(): Promise<Category[]> {
    try {
      console.log('CategoriesService - Fetching categories from API');

      const response = await fetch(`${this.baseUrl}/vint-street-app/v1/shop/categories`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: CategoryResponse = await response.json();
      console.log(`CategoriesService - Fetched ${data.categories.length} categories`);

      // Log category details at debug level
      data.categories.forEach((category) => {
        console.log(`Category: ${category.name} (${category.children.length} children)`);
        category.children.forEach((child) => {
          console.log(`  - Child: ${child.name}`);
        });
      });

      return data.categories;
    } catch (error) {
      console.error('CategoriesService - Error fetching categories:', error);
      throw error;
    }
  }

  /**
   * Find a category by its slug in the category hierarchy
   */
  findCategoryBySlug(categories: Category[], targetSlug: string): Category | null {
    for (const category of categories) {
      if (category.slug === targetSlug) {
        return category;
      }

      const found = this.findCategoryBySlug(category.children, targetSlug);
      if (found) {
        return found;
      }
    }
    return null;
  }

  /**
   * Get the path to a category by its slug
   */
  getCategoryPath(categories: Category[], targetSlug: string): Category[] {
    for (const category of categories) {
      if (category.slug === targetSlug) {
        return [category];
      }

      const childPath = this.getCategoryPath(category.children, targetSlug);
      if (childPath.length > 0) {
        return [category, ...childPath];
      }
    }
    return [];
  }

  /**
   * Get all leaf categories (categories with no children)
   */
  getAllLeafCategories(categories: Category[]): Category[] {
    const leafCategories: Category[] = [];

    const traverse = (cats: Category[]) => {
      cats.forEach((cat) => {
        if (cat.children.length === 0) {
          leafCategories.push(cat);
        } else {
          traverse(cat.children);
        }
      });
    };

    traverse(categories);
    return leafCategories;
  }

  /**
   * Filter categories based on search criteria
   */
  filterCategories(categories: Category[], searchTerm: string): Category[] {
    if (!searchTerm.trim()) {
      return categories;
    }

    const term = searchTerm.toLowerCase();
    return categories.filter(
      (category) =>
        category.name.toLowerCase().includes(term) ||
        category.description.toLowerCase().includes(term) ||
        this.filterCategories(category.children, searchTerm).length > 0
    );
  }

  /**
   * Sort categories by weight/priority
   */
  sortCategoriesByWeight(categories: Category[]): Category[] {
    const weights: { [key: string]: number } = {
      mens: 10,
      womens: 9,
      juniors: 8,
      footwear: 7,
      games: 6,
      collectibles: 4,
      uncategorised: 0,
    };

    return [...categories].sort((a, b) => {
      const weightA = weights[a.slug.toLowerCase()] || 5;
      const weightB = weights[b.slug.toLowerCase()] || 5;
      return weightB - weightA;
    });
  }
}

export const categoriesService = new CategoriesService();
