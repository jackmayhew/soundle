export interface TimerOptions {
  initialElapsedTime?: number
  onSave?: (time: number) => void
  saveInterval?: number
}
