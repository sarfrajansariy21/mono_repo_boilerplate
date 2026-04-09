import React from 'react'
import { motion } from 'framer-motion'
import { Activity, Users, ShoppingCart, DollarSign } from 'lucide-react'

const HomePage: React.FC = () => {
  const stats = [
    { label: 'Total Revenue', value: '$45,231', icon: <DollarSign className="text-emerald-500" />, change: '+12.5%' },
    { label: 'Active Users', value: '2,345', icon: <Users className="text-blue-500" />, change: '+3.2%' },
    { label: 'Total Sales', value: '1,205', icon: <ShoppingCart className="text-orange-500" />, change: '+5.4%' },
    { label: 'Growth', value: '18.2%', icon: <Activity className="text-indigo-500" />, change: '+2.1%' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <p className="text-slate-400 mt-1">Welcome back, here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 hover:border-indigo-500/50 transition-colors group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-slate-900 rounded-xl group-hover:scale-110 transition-transform">
                {stat.icon}
              </div>
              <span className="text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">
                {stat.change}
              </span>
            </div>
            <p className="text-slate-400 text-sm">{stat.label}</p>
            <p className="text-2xl font-bold mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 h-80 flex items-center justify-center">
          <p className="text-slate-500 italic">Chart Placeholder: Revenue Analytics</p>
        </div>
        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 h-80 flex items-center justify-center">
          <p className="text-slate-500 italic">Chart Placeholder: User Activities</p>
        </div>
      </div>
    </div>
  )
}

export default HomePage
