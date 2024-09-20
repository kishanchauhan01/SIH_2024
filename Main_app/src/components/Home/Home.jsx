import React from 'react'
import { NavLink , Link } from 'react-router-dom'

function Home() {
  return (
    <div>
      <NavLink
        to="/form"
        className={({ isActive }) =>
          `inline-flex items-center px-8 py-4 text-lg font-bold rounded-full transition duration-300 ease-in-out
          ${isActive ? 'bg-orange-700 text-white shadow-lg' : 'bg-gray-300 text-gray-800 hover:bg-orange-600 hover:text-white'}
          border border-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-600`
        }
      >
        File an Application For PRGI
      </NavLink>
    </div>
  )
}

export default Home
