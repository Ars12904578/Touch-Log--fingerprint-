import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './css/index.css'
import './css/satoshi.css'
import App from './App.jsx'

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .getRegistrations()
    .then((registrations) =>
      Promise.all(
        registrations
          .filter((registration) => {
            const worker =
              registration.active ??
              registration.waiting ??
              registration.installing
            return worker && new URL(worker.scriptURL).pathname === '/sw.js'
          })
          .map((registration) => registration.unregister()),
      ),
    )
    .catch((error) => {
      console.error('Failed to remove the previous service worker:', error)
    })
}

if ('caches' in window) {
  window.caches
    .keys()
    .then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((cacheName) => cacheName.startsWith('workbox-'))
          .map((cacheName) => window.caches.delete(cacheName)),
      ),
    )
    .catch((error) => {
      console.error('Failed to remove previous offline caches:', error)
    })
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
