import { addCollection } from '@iconify/vue'
import { icons as lineMdIcons } from '@iconify-json/line-md'
import { icons as epIcons } from '@iconify-json/ep'
import { icons as biIcons } from '@iconify-json/bi'
import { icons as ionIcons } from '@iconify-json/ion'

export function setupIconify() {
  addCollection(lineMdIcons)
  addCollection(epIcons)
  addCollection(biIcons)
  addCollection(ionIcons)
}
