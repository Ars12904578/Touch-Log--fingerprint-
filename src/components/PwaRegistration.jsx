import { useEffect } from 'react'
import { registerSW } from 'virtual:pwa-register'

export default function PwaRegistration({ onStatusChange }) {
  useEffect(() => {
    if (!import.meta.env.PROD || !('serviceWorker' in navigator)) return

    let registration
    onStatusChange('loading')
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
        onStatusChange('ready')
      },
      onNeedReload() {
        window.location.reload()
      },
      onRegisteredSW(_serviceWorkerUrl, serviceWorkerRegistration) {
        registration = serviceWorkerRegistration
        if (registration?.active) {
          onStatusChange('ready')
        }
      },
      onRegisterError(error) {
        console.error('Service worker registration failed:', error)
        onStatusChange('error')
      },
    })

    return () => {
      window.clearInterval(updateInterval)
      window.removeEventListener('focus', checkForUpdate)
      document.removeEventListener('visibilitychange', checkForUpdate)
    }
  }, [onStatusChange])

  return null
}
