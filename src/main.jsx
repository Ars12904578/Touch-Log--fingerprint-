import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './css/index.css'
import './css/poppins.css'
import './css/satoshi.css'
import App from './App.jsx'
import { registerSW } from 'virtual:pwa-register'

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  caches.delete('touch-log-v1').catch((error) => {
    console.error('Legacy offline cache cleanup failed:', error)
  })

  registerSW({
    immediate: true,
    onNeedRefresh() {
      window.dispatchEvent(new Event('touch-log:pwa-updating'))
    },
    onRegisteredSW(_serviceWorkerUrl, registration) {
      if (!registration) return

      const checkForUpdate = () => {
        registration.update().catch((error) => {
          console.error('Service worker update check failed:', error)
        })
      }

      window.setInterval(checkForUpdate, 60 * 60 * 1000)
      window.addEventListener('focus', checkForUpdate)
    },
  })
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
