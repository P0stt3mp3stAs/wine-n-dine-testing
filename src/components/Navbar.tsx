import Link from 'next/link'

const Navbar = () => {
  return (
    <nav className="bg-white shadow rounded-lg mt-3 mx-5">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 font-bold  ">
          <div className="flex items-center">
            <div className="flex space-x-4">
              <Link href="/" className="text-black font-bold hover:text-red-700 px-3 py-2 rounded-md text-sm">
                Home
              </Link>
              <Link href="/3d-menu" className="text-black font-bold hover:text-red-700 px-3 py-2 rounded-md text-sm">
                3D
              </Link>
              <Link href="/3d-menu" className="text-black font-bold hover:text-red-700 px-3 py-2 rounded-md text-sm">
                Menu
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex space-x-4">
              <Link href="/login" className="text-black font-bold hover:text-red-700 px-3 py-2 rounded-md text-sm">
                Log-In
              </Link>
              <Link href="/signup" className="text-white font-bold bg-red-500 hover:bg-red-400 px-3 py-2 rounded-md text-sm">
                Sign-Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar