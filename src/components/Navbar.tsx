import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <div className="py-5 px-10 border-[1px] shadow-md sticky  w-full top-0 z-10 bg-white">
      <nav className="flex justify-between">
        <Link
          to="/"
          className="text-2xl font-extralight text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Cashy
        </Link>

        <div className="flex gap-4">
        <Link
          to="/"
          className="text-base font-semibold"
        >
          Check-In
        </Link>
        <Link
          to="/check-out"
          className="text-base font-semibold"
        >
          Check-Out
        </Link>
        </div>
      </nav>
    </div>
  )
}

export default Navbar