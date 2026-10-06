import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './css/index.css'
import './css/satoshi.css'
import { Toast } from '@heroui/react'
import App from './App.jsx'
import PwaRegistration from './components/PwaRegistration.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <>
      <Toast.Provider placement="top" />
      <PwaRegistration />
      <App />
    </>
  </StrictMode>,
)
