import { ElMessage, ElMessageBox } from 'element-plus'
import { categoryService } from '../../../../services/category.service'
import { articleService } from '../../../../services/article.service'
import type { ArticleRow, CategoryRow } from '../../../../types/api'
export const useArticlesPage = () => {
  const route = useRoute()
  const router = useRouter()
  const articles = ref<ArticleRow[]>([])
  const categories = ref<CategoryRow[]>([])
  const keyword = ref(String(route.query.keyword || ''))
  const filterCategory = ref(String(route.query.category || ''))
  const filterStatus = ref(String(route.query.status || ''))
  const page = ref(Math.max(1, Number(route.query.page) || 1))
  const pageSize = ref([20, 50, 100].includes(Number(route.query.pageSize)) ? Number(route.query.pageSize) : 20)
  const total = ref(0)
  const loading = ref(false)
  const categoryName = (id: string | null) => categories.value.find((c) => c.id === id)?.name
  let loadSequence = 0
  const load = async () => {
    const sequence = ++loadSequence
    loading.value = true
    try {
      const [articleData, categoryData] = await Promise.all([
        articleService.list({
          page: page.value,
          pageSize: pageSize.value,
          keyword: keyword.value,
          categoryId: filterCategory.value,
          status: filterStatus.value,
        }),
        categoryService.list(),
      ])
      if (sequence !== loadSequence) return
      articles.value = articleData.items
      total.value = articleData.total
      categories.value = categoryData.filter((c) => c.type === 'article')
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
  const openCreate = () => router.push({ name: 'article-create', query: listQuery() })
  const openEdit = (row: ArticleRow) =>
    router.push({ name: 'article-edit', params: { id: row.id }, query: listQuery() })
  const remove = async (row: ArticleRow) => {
    await ElMessageBox.confirm(`确定删除文章「${row.title}」吗?`, '删除确认', {
      type: 'warning',
    })
      .then(async () => {
        await articleService.remove(row.id)
        ElMessage.success('已删除')
        await load()
      })
      .catch(() => {})
  }
  return {
    articles,
    categories,
    keyword,
    filterCategory,
    filterStatus,
    page,
    pageSize,
    total,
    loading,
    categoryName,
    load,
    query,
    resetQuery,
    handleSizeChange,
    openCreate,
    openEdit,
    remove,
  }
}
