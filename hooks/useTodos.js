import { useState, useEffect } from 'react';

export const useTodos = () => {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'completed'

  // Load todos from localStorage on mount
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      try {
        setTodos(JSON.parse(savedTodos));
      } catch (error) {
        console.error('Error parsing saved todos:', error);
        setTodos([]);
      }
    }
  }, []);

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // Add a new todo
  const addTodo = (text) => {
    if (!text.trim()) return;
    
    const newTodo = {
      id: Date.now() + Math.random(),
      text: text.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    };
    
    setTodos(prev => [newTodo, ...prev]);
  };

  // Delete a todo
  const deleteTodo = (id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  // Toggle todo completion status
  const toggleTodo = (id) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id 
        ? { ...todo, completed: !todo.completed }
        : todo
    ));
  };

  // Edit todo text
  const editTodo = (id, newText) => {
    if (!newText.trim()) return;
    
    setTodos(prev => prev.map(todo => 
      todo.id === id 
        ? { ...todo, text: newText.trim() }
        : todo
    ));
  };

  // Clear all completed todos
  const clearCompleted = () => {
    setTodos(prev => prev.filter(todo => !todo.completed));
  };

  // Toggle all todos completion status
  const toggleAll = () => {
    const allCompleted = todos.every(todo => todo.completed);
    setTodos(prev => prev.map(todo => ({
      ...todo,
      completed: !allCompleted
    })));
  };

  // Get filtered todos based on current filter
  const getFilteredTodos = () => {
    switch (filter) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  };

  // Get todo counts
  const getTodoCounts = () => {
    const total = todos.length;
    const completed = todos.filter(todo => todo.completed).length;
    const active = total - completed;
    
    return { total, completed, active };
  };

  return {
    todos: getFilteredTodos(),
    allTodos: todos,
    filter,
    setFilter,
    addTodo,
    deleteTodo,
    toggleTodo,
    editTodo,
    clearCompleted,
    toggleAll,
    counts: getTodoCounts(),
    hasCompletedTodos: todos.some(todo => todo.completed),
    hasActiveTodos: todos.some(todo => !todo.completed),
  };
};