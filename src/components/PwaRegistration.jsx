import { useEffect } from 'react'
import { toast } from '@heroui/react'
import { registerSW } from 'virtual:pwa-register'

export default function PwaRegistration() {
  useEffect(() => {
    if (!import.meta.env.PROD || !('serviceWorker' in navigator)) return

    caches.delete('touch-log-v1').catch((error) => {
      console.error('Legacy offline cache cleanup failed:', error)
    })

    let registration
    const checkForUpdate = () => {
      registration?.update().catch((error) => {
        console.error('Service worker update check failed:', error)
      })
    }

    const updateInterval = window.setInterval(checkForUpdate, 60 * 60 * 1000)
    window.addEventListener('focus', checkForUpdate)

    registerSW({
      immediate: true,
      onOfflineReady() {
        toast.success('Ready for offline use', {
          description:
            'Touch Log is cached and can now be opened without an internet connection.',
          timeout: 6000,
        })
      },
      onNeedRefresh() {
        window.dispatchEvent(new Event('touch-log:pwa-updating'))
      },
      onRegisteredSW(_serviceWorkerUrl, serviceWorkerRegistration) {
        registration = serviceWorkerRegistration
      },
    })

    return () => {
      window.clearInterval(updateInterval)
      window.removeEventListener('focus', checkForUpdate)
    }
  }, [])

  return null
}
