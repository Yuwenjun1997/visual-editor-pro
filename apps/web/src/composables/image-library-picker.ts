import type { ComponentPublicInstance } from 'vue'

type Picker = ComponentPublicInstance & { open: () => Promise<string | null> }
let picker: Picker | null = null

export const registerImageLibraryPicker = (instance: Picker | null) => {
  picker = instance
}

export const pickImageFromLibrary = () => {
  if (!picker) return Promise.reject(new Error('图片库尚未初始化'))
  return picker.open()
}
