import type { DashboardStats } from '../types/api'
import { articleService } from './article.service'
import { categoryService } from './category.service'
import { pageService } from './page.service'
import { productService } from './product.service'

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    const [pages, products, articles, categories] = await Promise.all([
      pageService.list(),
      productService.list(),
      articleService.list(),
      categoryService.list(),
    ])

    return {
      pages: pages.length,
      products: products.length,
      articles: articles.length,
      categories: categories.length,
    }
  },
}
