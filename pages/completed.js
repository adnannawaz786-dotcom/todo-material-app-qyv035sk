import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { CheckCircle2, Trash2, RotateCcw, Calendar, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CompletedPage() {
  const [completedTodos, setCompletedTodos] = useState([]);
  const [stats, setStats] = useState({
    totalCompleted: 0,
    completedToday: 0,
    completedThisWeek: 0
  });

  useEffect(() => {
    // Load completed todos from localStorage
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      const allTodos = JSON.parse(savedTodos);
      const completed = allTodos.filter(todo => todo.completed);
      setCompletedTodos(completed);
      
      // Calculate stats
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
      
      const completedToday = completed.filter(todo => 
        todo.completedAt && new Date(todo.completedAt) >= startOfDay
      ).length;
      
      const completedThisWeek = completed.filter(todo => 
        todo.completedAt && new Date(todo.completedAt) >= startOfWeek
      ).length;
      
      setStats({
        totalCompleted: completed.length,
        completedToday,
        completedThisWeek
      });
    }
  }, []);

  const handleRestoreTodo = (todoId) => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      const allTodos = JSON.parse(savedTodos);
      const updatedTodos = allTodos.map(todo =>
        todo.id === todoId 
          ? { ...todo, completed: false, completedAt: null }
          : todo
      );
      localStorage.setItem('todos', JSON.stringify(updatedTodos));
      
      // Update local state
      setCompletedTodos(prev => prev.filter(todo => todo.id !== todoId));
      setStats(prev => ({
        ...prev,
        totalCompleted: prev.totalCompleted - 1
      }));
    }
  };

  const handleDeleteTodo = (todoId) => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      const allTodos = JSON.parse(savedTodos);
      const updatedTodos = allTodos.filter(todo => todo.id !== todoId);
      localStorage.setItem('todos', JSON.stringify(updatedTodos));
      
      // Update local state
      setCompletedTodos(prev => prev.filter(todo => todo.id !== todoId));
      setStats(prev => ({
        ...prev,
        totalCompleted: prev.totalCompleted - 1
      }));
    }
  };

  const clearAllCompleted = () => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      const allTodos = JSON.parse(savedTodos);
      const activeTodos = allTodos.filter(todo => !todo.completed);
      localStorage.setItem('todos', JSON.stringify(activeTodos));
      
      setCompletedTodos([]);
      setStats({
        totalCompleted: 0,
        completedToday: 0,
        completedThisWeek: 0
      });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="outline" size="sm" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Todos
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                  Completed Tasks
                </h1>
                <p className="text-gray-600 mt-1">Review your accomplishments</p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Total Completed</p>
                    <p className="text-2xl font-bold text-green-900">{stats.totalCompleted}</p>
                  </div>
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Today</p>
                    <p className="text-2xl font-bold text-blue-900">{stats.completedToday}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-50 to-violet-50 border-purple-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600">This Week</p>
                    <p className="text-2xl font-bold text-purple-900">{stats.completedThisWeek}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          {completedTodos.length > 0 && (
            <div className="flex justify-end">
              <Button
                onClick={clearAllCompleted}
                variant="destructive"
                size="sm"
                className="gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Clear All Completed
              </Button>
            </div>
          )}
        </motion.div>

        {/* Completed Todos List */}
        {completedTodos.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <CheckCircle2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No completed tasks yet</h3>
            <p className="text-gray-600 mb-6">Complete some tasks to see them here!</p>
            <Link href="/">
              <Button className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Go to Todo List
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {completedTodos.map((todo, index) => (
                <motion.div
                  key={todo.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-white/70 backdrop-blur-sm border-gray-200 hover:shadow-md transition-all duration-200">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                            <h3 className="font-medium text-gray-900 line-through decoration-gray-400">
                              {todo.text}
                            </h3>
                          </div>
                          
                          {todo.description && (
                            <p className="text-sm text-gray-600 ml-8 mb-3 line-through decoration-gray-300">
                              {todo.description}
                            </p>
                          )}
                          
                          <div className="flex items-center gap-3 ml-8 text-sm text-gray-500">
                            {todo.priority && (
                              <Badge
                                variant="outline"
                                className={`${getPriorityColor(todo.priority)} text-xs opacity-75`}
                              >
                                {todo.priority} priority
                              </Badge>
                            )}
                            {todo.category && (
                              <Badge variant="secondary" className="text-xs opacity-75">
                                {todo.category}
                              </Badge>
                            )}
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Completed {formatDate(todo.completedAt)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Button
                            onClick={() => handleRestoreTodo(todo.id)}
                            variant="outline"
                            size="sm"
                            className="gap-2 text-blue-600 border-blue-200 hover:bg-blue-50"
                          >
                            <RotateCcw className="h-4 w-4" />
                            Restore
                          </Button>
                          <Button
                            onClick={() => handleDeleteTodo(todo.id)}
                            variant="outline"
                            size="sm"
                            className="gap-2 text-red-600 border-red-200 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}