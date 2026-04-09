import React from 'react'
import { motion } from 'framer-motion'
import { Menu, Bell, User, Search } from 'lucide-react'
import { useAppDispatch } from '../hooks/useRedux'
import { toggleSidebar } from '../store/slices/uiSlice'

const Header: React.FC = () => {
  const dispatch = useAppDispatch()

  return (
    <header className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => dispatch(toggleSidebar())}
          className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
        >
          <Menu size={20} />
        </motion.button>
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search..."
            className="bg-slate-800 border-none rounded-full py-1.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-500 w-64 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          className="p-2 hover:bg-slate-800 rounded-full relative transition-colors"
        >
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full border-2 border-slate-900" />
        </motion.button>
        <div className="flex items-center gap-3 pl-4 border-l border-slate-800">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold">User</p>
            <p className="text-[10px] text-slate-400">admin@example.com</p>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center cursor-pointer shadow-lg shadow-indigo-500/20"
          >
            <User size={20} />
          </motion.div>
        </div>
      </div>
    </header>
  )
}

export default Header
