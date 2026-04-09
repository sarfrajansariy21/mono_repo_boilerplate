import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, CheckCircle, Circle } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../hooks/useRedux'
import { addTodo, deleteTodo, toggleTodo } from '../store/slices/todoSlice'

const TodosPage: React.FC = () => {
  const [text, setText] = useState('')
  const dispatch = useAppDispatch()
  const todos = useAppSelector((state) => state.todo.todos)

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return
    dispatch(
      addTodo({
        id: Date.now().toString(),
        text,
        completed: false,
      }),
    )
    setText('')
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Todo List</h1>
        <p className="text-slate-400 mt-1">Manage your tasks with Redux state.</p>
      </div>

      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What needs to be done?"
          className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
        />
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          Add
        </motion.button>
      </form>

      <div className="space-y-3">
        <AnimatePresence initial={false}>
          {todos.map((todo) => (
            <motion.div
              key={todo.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex items-center justify-between bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 group hover:border-indigo-500/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => dispatch(toggleTodo(todo.id))}
                  className="text-slate-400 hover:text-indigo-500 transition-colors"
                >
                  {todo.completed ? (
                    <CheckCircle size={22} className="text-emerald-500" />
                  ) : (
                    <Circle size={22} />
                  )}
                </button>
                <span className={`${todo.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                  {todo.text}
                </span>
              </div>
              <button
                onClick={() => dispatch(deleteTodo(todo.id))}
                className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
              >
                <Trash2 size={18} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
        {todos.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <p>No tasks yet. Enjoy your day!</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default TodosPage
