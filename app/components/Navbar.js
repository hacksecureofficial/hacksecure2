'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { useState, useEffect } from 'react'

export default function Navbar() {
  const router = useRouter()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const checkUser = async () => {
      const res = await fetch('/api/user')
      if (res.ok) {
        const userData = await res.json()
        setUser(userData)
      }
    }
    checkUser()
  }, [])

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/logout', {
        method: 'POST',
      })
      if (res.ok) {
        setUser(null)
      }
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  return (
    <nav className="bg-black text-white p-4 sticky top-0 z-10 border-b border-gray-800">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">HACK SEC</Link>
        <div className="hidden md:flex space-x-4">
          <Link href="/coming-soon" className="hover:text-gray-300">Courses</Link>
          <Link href="/about" className="hover:text-gray-300">About us</Link>
          <Link href="/contact" className="hover:text-gray-300">Contact us</Link>
          <Link href="/coming-soon" className="hover:text-gray-300">Achievements</Link>
        </div>
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <span>Welcome, {user.name}</span>
              <Button 
                variant="outline" 
                className="bg-black text-white border-white hover:bg-white hover:text-black"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/signup">
                <Button variant="outline" className="bg-black text-white border-white hover:bg-white hover:text-black">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
