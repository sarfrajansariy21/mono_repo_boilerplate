import React from 'react'
import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LayoutDashboard, CheckSquare, Settings, LogOut, ChevronLeft, Users } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../hooks/useRedux'
import { toggleSidebar } from '../store/slices/uiSlice'

const Sidebar: React.FC = () => {
  const dispatch = useAppDispatch()
  const isOpen = useAppSelector((state) => state.ui.sidebarOpen)

  const navItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/' },
    { icon: <Users size={20} />, label: 'Users', path: '/users' },
    { icon: <CheckSquare size={20} />, label: 'Todos', path: '/todos' },
    { icon: <Settings size={20} />, label: 'Settings', path: '/settings' },
  ]

  return (
    <motion.aside
      initial={false}
      animate={{ width: isOpen ? 260 : 80 }}
      className="bg-slate-950 border-r border-slate-800 flex flex-col relative"
    >
      <div className="h-16 flex items-center px-6 gap-3 overflow-hidden whitespace-nowrap">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shrink-0">
          <span className="font-bold text-lg">A</span>
        </div>
        <motion.span
          animate={{ opacity: isOpen ? 1 : 0 }}
          className="font-bold text-xl tracking-tight"
        >
          Antigravity
        </motion.span>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-300 group ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
              }`
            }
          >
            <span className="shrink-0">{item.icon}</span>
            <motion.span
              animate={{ opacity: isOpen ? 1 : 0, x: isOpen ? 0 : -10 }}
              className="font-medium whitespace-nowrap"
            >
              {item.label}
            </motion.span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button className="w-full flex items-center gap-4 px-3 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-500 transition-all duration-300">
          <LogOut size={20} className="shrink-0" />
          <motion.span
            animate={{ opacity: isOpen ? 1 : 0 }}
            className="font-medium whitespace-nowrap"
          >
            Logout
          </motion.span>
        </button>
      </div>

      <button
        onClick={() => dispatch(toggleSidebar())}
        className="absolute -right-3 top-20 w-6 h-6 bg-slate-800 border border-slate-700 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-colors"
      >
        <ChevronLeft size={14} className={`transition-transform duration-300 ${!isOpen ? 'rotate-180' : ''}`} />
      </button>
    </motion.aside>
  )
}

export default Sidebar
