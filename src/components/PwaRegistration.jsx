import { useEffect } from 'react'
import { toast } from '@heroui/react'
import { registerSW } from 'virtual:pwa-register'

export default function PwaRegistration() {
  useEffect(() => {
    if (!import.meta.env.PROD || !('serviceWorker' in navigator)) return

    let registration
    const checkForUpdate = () => {
      if (document.visibilityState !== 'visible') return

      registration?.update().catch((error) => {
        console.error('Service worker update check failed:', error)
      })
    }

    const updateInterval = window.setInterval(checkForUpdate, 60 * 60 * 1000)
    window.addEventListener('focus', checkForUpdate)
    document.addEventListener('visibilitychange', checkForUpdate)

    registerSW({
      immediate: true,
      onOfflineReady() {
        toast.success('Ready for offline use', {
          description:
            'Touch Log is cached and can now be opened without an internet connection.',
          timeout: 6000,
        })
      },
      onNeedReload() {
        window.location.reload()
      },
      onRegisteredSW(_serviceWorkerUrl, serviceWorkerRegistration) {
        registration = serviceWorkerRegistration
      },
    })

    return () => {
      window.clearInterval(updateInterval)
      window.removeEventListener('focus', checkForUpdate)
      document.removeEventListener('visibilitychange', checkForUpdate)
    }
  }, [])

  return null
}
