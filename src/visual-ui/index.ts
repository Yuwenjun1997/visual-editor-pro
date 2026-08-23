import './assets/scss/index.scss'
import './assets/fonts/bootstrap/bootstrap-icons.css'

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
import VisualButton from './components/visual-button'
import VisualCountDown from './components/visual-count-down'
import VisualCustomerService from './components/visual-customer-service'
import VisualCoupon from './components/visual-coupon'
import VisualQRCode from './components/visual-qrcode'
import VisualTabs from './components/visual-tabs'
import VisualEventContainer from './components/visual-event-container'

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
    app.component('VisualButton', VisualButton)
    app.component('VisualCountDown', VisualCountDown)
    app.component('VisualCustomerService', VisualCustomerService)
    app.component('VisualCoupon', VisualCoupon)
    app.component('VisualQRCode', VisualQRCode)
    app.component('VisualTabs', VisualTabs)
    app.component('VisualEventContainer', VisualEventContainer)
  },
}
