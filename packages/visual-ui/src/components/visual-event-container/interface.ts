export type EventActionType = 'none' | 'url' | 'toast' | 'jscode' | 'event'

export type EventTriggerType = 'none' | 'click' | 'hover' | 'longPress'
import type { VisualUrlValue } from '../../types/url'

export interface VisualEventContainerProps {
  eventType?: EventTriggerType
  actionType?: EventActionType
  actionUrl?: VisualUrlValue
  actionText?: string
  actionCode?: string
  eventName?: string
}
