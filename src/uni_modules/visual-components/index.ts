import './scss/index.scss'
import './static/fonts/bootstrap/bootstrap-icons.css'

import VisualApp from './components/visual-app'
import VisualText from './components/visual-text'
import VisualFlex from './components/visual-flex'
import VisualObject from './components/visual-object'
import VisualObjectArray from './components/visual-object-array'
import VisualCarousel from './components/visual-carousel'
import VisualGrid from './components/visual-grid'
import VisualImage from './components/visual-image'
import VisualImageTextList from './components/visual-image-text-list'
import VisualImageTextCard from './components/visual-image-text-card'
import VisualPictureWrap from './components/visual-picture-wrap'
import VisualVideo from './components/visual-video'
import VisualMap from './components/visual-map'
import VisualSection from './components/visual-section'
import VisualForm from './components/visual-form'

import type { App } from 'vue'
import type { CustomThemeConfig } from './types/theme'
import { useTheme } from './hooks/useTheme'

export default {
  install(app: App, options: CustomThemeConfig = {}) {
    useTheme().initTheme(options)
    app.component('VisualApp', VisualApp)
    app.component('VisualText', VisualText)
    app.component('VisualFlex', VisualFlex)
    app.component('VisualObject', VisualObject)
    app.component('VisualObjectArray', VisualObjectArray)
    app.component('VisualCarousel', VisualCarousel)
    app.component('VisualGrid', VisualGrid)
    app.component('VisualImage', VisualImage)
    app.component('VisualImageTextList', VisualImageTextList)
    app.component('VisualImageTextCard', VisualImageTextCard)
    app.component('VisualPictureWrap', VisualPictureWrap)
    app.component('VisualVideo', VisualVideo)
    app.component('VisualMap', VisualMap)
    app.component('VisualSection', VisualSection)
    app.component('VisualForm', VisualForm)
  },
}
