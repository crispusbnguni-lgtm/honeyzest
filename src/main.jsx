import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
// Change BrowserRouter to HashRouter
import { HashRouter } from 'react-router-dom' 
import StoreContextProvider from './StoreContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter> {/* Changed from BrowserRouter */}
      <StoreContextProvider>
        <App />
      </StoreContextProvider>
    </HashRouter>
  </React.StrictMode>,
)