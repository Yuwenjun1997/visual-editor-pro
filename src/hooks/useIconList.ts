import { listIcons } from '@iconify/vue'
import { useClipboard } from '@vueuse/core'
import { ElMessage } from 'element-plus'

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
  const onlyName = ref<boolean>(false)
  const dye = ref<boolean>(false)

  const clipboard = useClipboard()

  const copyIcon = (icon: string) => {
    const iconText = onlyName.value ? icon : `<Icon icon="${icon}" />`
    clipboard.copy(iconText)
    ElMessage.success('拷贝成功:' + iconText)
  }

  const sourceIcons = loadIcons(['line-md', 'ep', 'bi', 'ion'])
  const filterIcons = ref<string[]>(sourceIcons)
  const iconTotal = computed(() => filterIcons.value.length)
  const icons = ref<string[]>([])
  const pageSize = ref<number>(params.pageSize || 132)
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
    onlyName,
    keyword,
    dye,
    copyIcon,
    onSearch,
    onCurrentChange,
    limitIcons,
  }
}
