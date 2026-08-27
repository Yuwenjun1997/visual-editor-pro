import { listIcons } from '@iconify/vue'

interface UseIconListParams {
  pageSize?: number
  pageNum?: number
}

export function loadIcons(collection: string[]) {
  const icons: string[] = []
  collection.forEach((item) => {
    icons.push(...listIcons(undefined, item).sort())
  })
  return icons
}

export function useIconList(params: UseIconListParams = {}) {
  const keyword = ref<string>('')

  const sourceIcons = loadIcons(['bi'])
  const filterIcons = ref<string[]>(sourceIcons)
  const iconTotal = computed(() => filterIcons.value.length)
  const icons = ref<string[]>([])
  const pageSize = ref<number>(params.pageSize || 49)
  const pageNum = ref<number>(params.pageNum || 1)

  const limitIcons = (icons: string[]) => {
    const start = (pageNum.value - 1) * pageSize.value
    const end = pageNum.value * pageSize.value
    return icons.slice(start, end)
  }

  const onSearch = () => {
    filterIcons.value = sourceIcons.filter(
      (icon) => icon.indexOf(keyword.value) > -1
    )
    icons.value = limitIcons(filterIcons.value)
  }

  const onCurrentChange = (current: number) => {
    pageNum.value = current
    icons.value = limitIcons(filterIcons.value)
  }

  onSearch() // 初始化

  return {
    pageSize,
    pageNum,
    iconTotal,
    sourceIcons,
    icons,
    keyword,
    onSearch,
    limitIcons,
    onCurrentChange,
  }
}
