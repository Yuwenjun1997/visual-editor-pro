import VisualCustomerService from './visual-customer-service.vue'

export default VisualCustomerService

declare module 'vue' {
  export interface GlobalComponents {
    VisualCustomerService: typeof VisualCustomerService
  }
}
