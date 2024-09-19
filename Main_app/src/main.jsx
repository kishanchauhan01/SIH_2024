import React from 'react'
import ReactDOM from 'react-dom/client'  
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import './index.css' 
import App from './App.jsx'
import Home from './components/Home/Home.jsx'



const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' >
      <Route path='' element={<Home />} />
      <Route path='/form' element={<App />} />
    </Route>
  )
)


createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);