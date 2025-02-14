import { v4 as uuidv4 } from 'uuid'

const activeKey = ref<string>(uuidv4())

export const useReload = () => {
  const reload = () => {
    activeKey.value = uuidv4()
  }
  return {
    reload,
    activeKey,
  }
}
