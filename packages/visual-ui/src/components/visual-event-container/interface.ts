export type EventActionType = 'none' | 'url' | 'toast' | 'jscode'

export type EventTriggerType = 'none' | 'click' | 'hover' | 'longPress'

export interface VisualEventContainerProps {
  eventType?: EventTriggerType
  actionType?: EventActionType
  actionUrl?: string
  actionText?: string
  actionCode?: string
}
