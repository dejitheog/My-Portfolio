// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import Portfolio from './portfolio'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <Portfolio />
//   </StrictMode>
// )





import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Portfolio from './portfolio'
import AiChat from './AiChat'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route path="/chat" element={<AiChat />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)