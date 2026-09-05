import { ElMessage, ElMessageBox } from 'element-plus'
import { categoryService } from '../../../../services/category.service'
import { productService } from '../../../../services/product.service'
import type { CategoryRow, ProductRow } from '../../../../types/api'
export const useProductsPage = () => {
  const route = useRoute()
  const router = useRouter()
  const products = ref<ProductRow[]>([])
  const categories = ref<CategoryRow[]>([])
  const keyword = ref(String(route.query.keyword || ''))
  const filterCategory = ref(String(route.query.category || ''))
  const filterStatus = ref(String(route.query.status || ''))
  const page = ref(Math.max(1, Number(route.query.page) || 1))
  const pageSize = ref([20, 50, 100].includes(Number(route.query.pageSize)) ? Number(route.query.pageSize) : 20)
  const total = ref(0)
  const loading = ref(false)
  const categoryName = (id: string | null) => categories.value.find((c) => c.id === id)?.name
  const statusText = (s: string) => (s === 'published' ? '已上架' : s === 'draft' ? '草稿' : '下架')
  let loadSequence = 0
  const load = async () => {
    const sequence = ++loadSequence
    loading.value = true
    try {
      const [productsData, categoryData] = await Promise.all([
        productService.list({
          page: page.value,
          pageSize: pageSize.value,
          keyword: keyword.value,
          categoryId: filterCategory.value,
          status: filterStatus.value,
        }),
        categoryService.list(),
      ])
      if (sequence !== loadSequence) return
      products.value = productsData.items
      total.value = productsData.total
      categories.value = categoryData.filter((c) => c.type === 'product')
    } catch (error: any) {
      ElMessage.error(error?.message || '数据加载失败')
    } finally {
      loading.value = false
    }
  }
  onMounted(load)
  const query = () => {
    page.value = 1
    load()
  }
  const resetQuery = () => {
    keyword.value = ''
    filterCategory.value = ''
    filterStatus.value = ''
    query()
  }
  watch([keyword, filterCategory, filterStatus], () => {
    page.value = 1
  })
  const handleSizeChange = () => {
    page.value = 1
    load()
  }
  const listQuery = () => ({
    keyword: keyword.value,
    category: filterCategory.value,
    status: filterStatus.value,
    page: String(page.value),
    pageSize: String(pageSize.value),
  })
  const openCreate = () => router.push({ name: 'product-create', query: listQuery() })
  const openEdit = (row: ProductRow) =>
    router.push({ name: 'product-edit', params: { id: row.id }, query: listQuery() })
  const remove = async (row: ProductRow) => {
    await ElMessageBox.confirm(`确定删除商品「${row.title}」吗?`, '删除确认', {
      type: 'warning',
    })
      .then(async () => {
        await productService.remove(row.id)
        ElMessage.success('已删除')
        await load()
      })
      .catch(() => {})
  }
  return {
    products,
    categories,
    keyword,
    filterCategory,
    filterStatus,
    page,
    pageSize,
    total,
    loading,
    categoryName,
    statusText,
    load,
    query,
    resetQuery,
    handleSizeChange,
    openCreate,
    openEdit,
    remove,
  }
}
