import React from 'react'
import ReactDOM from 'react-dom/client'
import '@fontsource-variable/inter'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import { App } from '@/app'
import './globals.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route index element={<App />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
