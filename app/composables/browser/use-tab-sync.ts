// Single instance of the channel so we don't create multiple listeners
let channel: BroadcastChannel | null = null

export function notifyTabsOfUpdate(payload: any) {
  if (channel) {
    // Strips Vue proxies and reactivity, making it safe to send
    channel.postMessage(JSON.parse(JSON.stringify(payload)))
  }
}
export function initializeTabSync() {
  if (!import.meta.client || channel)
    return

  const gameStore = useGameStore()
  channel = new BroadcastChannel('game-state-sync')

  channel.onmessage = (event) => {
    if (event.data) {
      console.log('Tab sync received. Patching state directly.')
      console.log(event.data)
      // Update store immediately with data from the message
      gameStore.$patch(event.data)
    }
  }
}
