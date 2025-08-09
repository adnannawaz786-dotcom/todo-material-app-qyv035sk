'use client';

import { createContext, useContext, useReducer, useEffect } from 'react';

const TodoContext = createContext();

// Action types
const TODO_ACTIONS = {
  ADD_TODO: 'ADD_TODO',
  DELETE_TODO: 'DELETE_TODO',
  TOGGLE_TODO: 'TOGGLE_TODO',
  EDIT_TODO: 'EDIT_TODO',
  SET_FILTER: 'SET_FILTER',
  CLEAR_COMPLETED: 'CLEAR_COMPLETED',
  LOAD_TODOS: 'LOAD_TODOS'
};

// Filter types
export const FILTERS = {
  ALL: 'all',
  ACTIVE: 'active',
  COMPLETED: 'completed'
};

// Initial state
const initialState = {
  todos: [],
  filter: FILTERS.ALL,
  nextId: 1
};

// Todo reducer
function todoReducer(state, action) {
  switch (action.type) {
    case TODO_ACTIONS.LOAD_TODOS:
      return {
        ...state,
        todos: action.payload.todos,
        nextId: action.payload.nextId
      };

    case TODO_ACTIONS.ADD_TODO:
      const newTodo = {
        id: state.nextId,
        text: action.payload.text.trim(),
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      return {
        ...state,
        todos: [...state.todos, newTodo],
        nextId: state.nextId + 1
      };

    case TODO_ACTIONS.DELETE_TODO:
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload.id)
      };

    case TODO_ACTIONS.TOGGLE_TODO:
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload.id
            ? {
                ...todo,
                completed: !todo.completed,
                updatedAt: new Date().toISOString()
              }
            : todo
        )
      };

    case TODO_ACTIONS.EDIT_TODO:
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload.id
            ? {
                ...todo,
                text: action.payload.text.trim(),
                updatedAt: new Date().toISOString()
              }
            : todo
        )
      };

    case TODO_ACTIONS.SET_FILTER:
      return {
        ...state,
        filter: action.payload.filter
      };

    case TODO_ACTIONS.CLEAR_COMPLETED:
      return {
        ...state,
        todos: state.todos.filter(todo => !todo.completed)
      };

    default:
      return state;
  }
}

// Local storage helpers
const STORAGE_KEY = 'todo-material-app-todos';

const loadTodosFromStorage = () => {
  if (typeof window === 'undefined') return { todos: [], nextId: 1 };
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      return {
        todos: data.todos || [],
        nextId: data.nextId || 1
      };
    }
  } catch (error) {
    console.error('Error loading todos from localStorage:', error);
  }
  
  return { todos: [], nextId: 1 };
};

const saveTodosToStorage = (todos, nextId) => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ todos, nextId }));
  } catch (error) {
    console.error('Error saving todos to localStorage:', error);
  }
};

// Context provider component
export function TodoProvider({ children }) {
  const [state, dispatch] = useReducer(todoReducer, initialState);

  // Load todos from localStorage on mount
  useEffect(() => {
    const stored = loadTodosFromStorage();
    dispatch({
      type: TODO_ACTIONS.LOAD_TODOS,
      payload: stored
    });
  }, []);

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    if (state.todos.length > 0 || state.nextId > 1) {
      saveTodosToStorage(state.todos, state.nextId);
    }
  }, [state.todos, state.nextId]);

  // Action creators
  const addTodo = (text) => {
    if (!text || !text.trim()) return;
    dispatch({
      type: TODO_ACTIONS.ADD_TODO,
      payload: { text }
    });
  };

  const deleteTodo = (id) => {
    dispatch({
      type: TODO_ACTIONS.DELETE_TODO,
      payload: { id }
    });
  };

  const toggleTodo = (id) => {
    dispatch({
      type: TODO_ACTIONS.TOGGLE_TODO,
      payload: { id }
    });
  };

  const editTodo = (id, text) => {
    if (!text || !text.trim()) return;
    dispatch({
      type: TODO_ACTIONS.EDIT_TODO,
      payload: { id, text }
    });
  };

  const setFilter = (filter) => {
    dispatch({
      type: TODO_ACTIONS.SET_FILTER,
      payload: { filter }
    });
  };

  const clearCompleted = () => {
    dispatch({
      type: TODO_ACTIONS.CLEAR_COMPLETED
    });
  };

  // Computed values
  const filteredTodos = state.todos.filter(todo => {
    switch (state.filter) {
      case FILTERS.ACTIVE:
        return !todo.completed;
      case FILTERS.COMPLETED:
        return todo.completed;
      case FILTERS.ALL:
      default:
        return true;
    }
  });

  const todosCount = {
    total: state.todos.length,
    active: state.todos.filter(todo => !todo.completed).length,
    completed: state.todos.filter(todo => todo.completed).length
  };

  const contextValue = {
    // State
    todos: state.todos,
    filteredTodos,
    filter: state.filter,
    todosCount,
    
    // Actions
    addTodo,
    deleteTodo,
    toggleTodo,
    editTodo,
    setFilter,
    clearCompleted,
    
    // Constants
    FILTERS
  };

  return (
    <TodoContext.Provider value={contextValue}>
      {children}
    </TodoContext.Provider>
  );
}

// Custom hook to use the todo context
export function useTodos() {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodos must be used within a TodoProvider');
  }
  return context;
}

export default TodoContext;