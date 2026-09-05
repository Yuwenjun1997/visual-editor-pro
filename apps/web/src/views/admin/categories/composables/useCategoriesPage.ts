import { ElMessage, ElMessageBox } from 'element-plus'
import { useAuthStore } from '../../../../stores/auth'
import { categoryService } from '../../../../services/category.service'
import type { CategoryRow } from '../../../../types/api'
export const useCategoriesPage = () => {
  const authStore = useAuthStore()
  const typeFilter = ref<'product' | 'article'>('product')
  const categories = ref<CategoryRow[]>([])
  const loading = ref(false)
  const saving = ref(false)
  const createDialogVisible = ref(false)
  const newName = ref('')
  const newSort = ref(0)
  const newType = ref<'product' | 'article'>(typeFilter.value)
  const visibleCategories = computed(() => categories.value.filter((c) => c.type === typeFilter.value))
  const load = async () => {
    loading.value = true
    try {
      categories.value = await categoryService.list()
    } catch (error: any) {
      ElMessage.error(error?.message || '分类加载失败')
    } finally {
      loading.value = false
    }
  }
  onMounted(load)
  const openCreateDialog = () => {
    newType.value = typeFilter.value
    newName.value = ''
    newSort.value = 0
    createDialogVisible.value = true
  }
  const create = async () => {
    const name = newName.value.trim()
    if (!name) {
      ElMessage.warning('请输入分类名称')
      return
    }
    if (!authStore.user) {
      ElMessage.error('未登录')
      return
    }
    saving.value = true
    try {
      await categoryService.create({
        user_id: authStore.user.id,
        name,
        type: newType.value,
        sort: newSort.value,
      })
      ElMessage.success('已创建')
      newName.value = ''
      newSort.value = 0
      createDialogVisible.value = false
      await load()
    } catch (error: any) {
      ElMessage.error(error?.message || '创建失败')
    } finally {
      saving.value = false
    }
  }
  const updateSort = async (row: CategoryRow, value: number) => {
    try {
      await categoryService.update(row.id, { sort: value || 0 })
    } catch (error: any) {
      ElMessage.error(error?.message || '排序更新失败')
      load()
    }
  }
  const remove = async (row: CategoryRow) => {
    await ElMessageBox.confirm(`确定删除分类「${row.name}」吗?`, '删除确认', {
      type: 'warning',
    })
      .then(async () => {
        await categoryService.remove(row.id)
        ElMessage.success('已删除')
        load()
      })
      .catch(() => {})
  }
  return {
    typeFilter,
    loading,
    saving,
    createDialogVisible,
    newName,
    newSort,
    newType,
    visibleCategories,
    openCreateDialog,
    create,
    updateSort,
    remove,
  }
}
