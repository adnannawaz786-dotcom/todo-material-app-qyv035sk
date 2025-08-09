'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Loader2 } from 'lucide-react';

const AddTodo = ({ onAddTodo, isLoading = false }) => {
  const [todoText, setTodoText] = useState('');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('general');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (todoText.trim() && !isLoading) {
      const newTodo = {
        id: Date.now().toString(),
        text: todoText.trim(),
        completed: false,
        priority,
        category,
        createdAt: new Date().toISOString(),
      };
      onAddTodo(newTodo);
      setTodoText('');
      setIsExpanded(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const priorityColors = {
    low: 'bg-green-100 text-green-800 border-green-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    high: 'bg-red-100 text-red-800 border-red-200'
  };

  const categoryOptions = [
    { value: 'general', label: 'General' },
    { value: 'work', label: 'Work' },
    { value: 'personal', label: 'Personal' },
    { value: 'shopping', label: 'Shopping' },
    { value: 'health', label: 'Health' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-2xl mx-auto mb-8"
    >
      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="flex gap-4 items-start">
            <div className="flex-1">
              <textarea
                value={todoText}
                onChange={(e) => setTodoText(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsExpanded(true)}
                placeholder="Add a new task..."
                className="w-full resize-none border-0 outline-none text-lg placeholder-gray-500 bg-transparent min-h-[60px] leading-relaxed"
                rows={isExpanded ? 3 : 1}
                disabled={isLoading}
              />
              
              <motion.div
                initial={false}
                animate={{ 
                  height: isExpanded ? 'auto' : 0,
                  opacity: isExpanded ? 1 : 0 
                }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-100">
                  {/* Priority Selection */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-600">Priority:</span>
                    <div className="flex gap-1">
                      {['low', 'medium', 'high'].map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setPriority(p)}
                          className={`px-3 py-1 rounded-full text-xs font-medium border transition-all duration-200 ${
                            priority === p
                              ? priorityColors[p]
                              : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                          }`}
                        >
                          {p.charAt(0).toUpperCase() + p.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Category Selection */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-600">Category:</span>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="px-3 py-1 rounded-lg text-sm border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={isLoading}
                    >
                      {categoryOptions.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.button
              type="submit"
              disabled={!todoText.trim() || isLoading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-200 ${
                todoText.trim() && !isLoading
                  ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Plus className="w-5 h-5" />
              )}
            </motion.button>
          </div>

          {isExpanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100"
            >
              <button
                type="button"
                onClick={() => {
                  setIsExpanded(false);
                  setTodoText('');
                  setPriority('medium');
                  setCategory('general');
                }}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                disabled={isLoading}
              >
                Cancel
              </button>
              
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500">
                  Press Enter to add task
                </span>
                <button
                  type="submit"
                  disabled={!todoText.trim() || isLoading}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    todoText.trim() && !isLoading
                      ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isLoading ? 'Adding...' : 'Add Task'}
                </button>
              </div>
            </motion.div>
          )}
        </form>
      </div>
    </motion.div>
  );
};

export default AddTodo;