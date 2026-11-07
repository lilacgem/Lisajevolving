import React from 'react'
import ReactDOM from 'react-dom/client'
import { lazy, Suspense } from 'react'
const App = lazy(() => new URLSearchParams(location.search).has('mirror') ? import('./App.jsx') : import('./Home.jsx'))
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Suspense fallback={<p style={{color:'#ddd',padding:24}}>Opening your space…</p>}><App /></Suspense>
    </React.StrictMode>,
)
