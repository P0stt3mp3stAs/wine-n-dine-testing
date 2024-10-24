'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Auth } from 'aws-amplify'
import { useRouter } from 'next/navigation'
import { ChevronDown, LogOut } from 'lucide-react'

const Navbar = () => {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  // Check authentication status on component mount
  useEffect(() => {
    checkUser()
  }, [])

  // Function to check current authenticated user
  const checkUser = async () => {
    try {
      const currentUser = await Auth.currentAuthenticatedUser()
      setUser(currentUser)
    } catch (err) {
      setUser(null)
    }
  }

  // Handle sign out
  const handleSignOut = async () => {
    try {
      await Auth.signOut()
      setUser(null)
      setDropdownOpen(false)
      router.push('/')
    } catch (err) {
      console.error('Error signing out:', err)
    }
  }

  return (
    <nav className="bg-white shadow rounded-lg mt-3 mx-5">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 font-bold">
          {/* Left side navigation links */}
          <div className="flex items-center">
            <div className="flex space-x-4">
              <Link href="/" className="text-black font-bold hover:text-red-700 px-3 py-2 rounded-md text-sm">
                Home
              </Link>
              <Link href="/3d" className="text-black font-bold hover:text-red-700 px-3 py-2 rounded-md text-sm">
                3D
              </Link>
              <Link href="/menu" className="text-black font-bold hover:text-red-700 px-3 py-2 rounded-md text-sm">
                Menu
              </Link>
            </div>
          </div>

          {/* Right side authentication section */}
          <div className="flex items-center">
            {user ? (
              // User is logged in - show profile dropdown
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2 text-black font-bold px-3 py-2 rounded-md text-sm hover:bg-gray-100"
                >
                  <span>{user.attributes.email}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <button
                      onClick={handleSignOut}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // User is not logged in - show auth buttons
              <div className="flex space-x-4">
                <Link href="/auth/signin" className="text-black font-bold hover:text-red-700 px-3 py-2 rounded-md text-sm">
                  Log-In
                </Link>
                <Link href="/auth/signup" className="text-white font-bold bg-red-500 hover:bg-red-400 px-3 py-2 rounded-md text-sm">
                  Sign-Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar