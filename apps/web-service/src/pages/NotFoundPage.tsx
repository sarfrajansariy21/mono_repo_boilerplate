import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'

const NotFoundPage: React.FC = () => {
  return (
    <div className="h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <motion.h1
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-9xl font-black text-slate-800 mb-4"
      >
        404
      </motion.h1>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-3xl font-bold mb-2">Page Not Found</h2>
        <p className="text-slate-400 mb-8 max-w-md">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
        >
          <Home size={20} />
          Back to Dashboard
        </Link>
      </motion.div>
    </div>
  )
}

export default NotFoundPage
