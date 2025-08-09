import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { Plus, Trash2, Check, X, Edit3, Calendar, Filter, Search } from 'lucide-react';

export default function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Load todos from localStorage on component mount
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (newTodo.trim() !== '') {
      const todo = {
        id: Date.now(),
        text: newTodo.trim(),
        completed: false,
        createdAt: new Date().toISOString(),
        priority: 'medium'
      };
      setTodos([...todos, todo]);
      setNewTodo('');
    }
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const toggleComplete = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const startEdit = (id, text) => {
    setEditingId(id);
    setEditText(text);
  };

  const saveEdit = () => {
    if (editText.trim() !== '') {
      setTodos(todos.map(todo =>
        todo.id === editingId ? { ...todo, text: editText.trim() } : todo
      ));
    }
    setEditingId(null);
    setEditText('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const handleKeyPress = (e, action) => {
    if (e.key === 'Enter') {
      action();
    }
  };

  const filteredTodos = todos.filter(todo => {
    const matchesFilter = filter === 'all' || 
                         (filter === 'active' && !todo.completed) || 
                         (filter === 'completed' && todo.completed);
    const matchesSearch = todo.text.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const completedCount = todos.filter(todo => todo.completed).length;
  const activeCount = todos.length - completedCount;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Material Todo
          </h1>
          <p className="text-gray-600">
            Organize your tasks with Material Design 3
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
        >
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Tasks</p>
                  <p className="text-2xl font-bold text-gray-900">{todos.length}</p>
                </div>
                <div className="p-2 bg-blue-100 rounded-full">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active</p>
                  <p className="text-2xl font-bold text-orange-600">{activeCount}</p>
                </div>
                <div className="p-2 bg-orange-100 rounded-full">
                  <Edit3 className="h-5 w-5 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-green-600">{completedCount}</p>
                </div>
                <div className="p-2 bg-green-100 rounded-full">
                  <Check className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Todo Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold text-gray-900">
                Task Manager
              </CardTitle>
              
              {/* Add Todo Input */}
              <div className="flex gap-2 mt-4">
                <div className="flex-1">
                  <input
                    type="text"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, addTodo)}
                    placeholder="Add a new task..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/90"
                  />
                </div>
                <Button
                  onClick={addTodo}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search tasks..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="flex gap-2">
                  {['all', 'active', 'completed'].map((filterType) => (
                    <Button
                      key={filterType}
                      onClick={() => setFilter(filterType)}
                      variant={filter === filterType ? 'default' : 'outline'}
                      size="sm"
                      className={`capitalize ${
                        filter === filterType
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <Filter className="h-4 w-4 mr-1" />
                      {filterType}
                    </Button>
                  ))}
                </div>
              </div>

              <Separator className="mb-4" />

              {/* Todo List */}
              <div className="space-y-3">
                <AnimatePresence>
                  {filteredTodos.map((todo) => (
                    <motion.div
                      key={todo.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                      className={`p-4 rounded-xl border transition-all duration-200 ${
                        todo.completed
                          ? 'bg-green-50 border-green-200'
                          : 'bg-white border-gray-200 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <button
                            onClick={() => toggleComplete(todo.id)}
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                              todo.completed
                                ? 'bg-green-500 border-green-500 text-white'
                                : 'border-gray-300 hover:border-green-400'
                            }`}
                          >
                            {todo.completed && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                              >
                                <Check className="h-4 w-4" />
                              </motion.div>
                            )}
                          </button>

                          {editingId === todo.id ? (
                            <input
                              type="text"
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              onKeyPress={(e) => handleKeyPress(e, saveEdit)}
                              className="flex-1 px-3 py-1 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              autoFocus
                            />
                          ) : (
                            <span
                              className={`flex-1 ${
                                todo.completed
                                  ? 'line-through text-gray-500'
                                  : 'text-gray-900'
                              }`}
                            >
                              {todo.text}
                            </span>
                          )}

                          {!todo.completed && (
                            <Badge variant="outline" className="text-xs">
                              {todo.priority}
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {editingId === todo.id ? (
                            <>
                              <Button
                                onClick={saveEdit}
                                size="sm"
                                className="h-8 w-8 p-0 bg-green-600 hover:bg-green-700"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                onClick={cancelEdit}
                                size="sm"
                                variant="outline"
                                className="h-8 w-8 p-0"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                onClick={() => startEdit(todo.id, todo.text)}
                                size="sm"
                                variant="outline"
                                className="h-8 w-8 p-0 hover:bg-blue-50"
                              >
                                <Edit3 className="h-4 w-4" />
                              </Button>
                              <Button
                                onClick={() => deleteTodo(todo.id)}
                                size="sm"
                                variant="outline"
                                className="h-8 w-8 p-0 hover:bg-red-50 hover:border-red-200"
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>

                      {todo.createdAt && (
                        <div className="mt-2 text-xs text-gray-400">
                          Created: {new Date(todo.createdAt).toLocaleDateString()}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>

                {filteredTodos.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                  >
                    <div className="text-gray-400 text-lg mb-2">
                      {searchTerm ? 'No tasks match your search' : 'No tasks yet'}
                    </div>
                    <div className="text-gray-500 text-sm">
                      {searchTerm ? 'Try a different search term' : 'Add your first task above to get started'}
                    </div>
                  </motion.div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-8 text-gray-500 text-sm"
        >
          Built with Material Design 3 • Next.js • Tailwind CSS
        </motion.div>
      </div>
    </div>
  );
}