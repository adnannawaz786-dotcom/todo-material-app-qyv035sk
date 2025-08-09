import React from 'react';
import { motion } from 'framer-motion';
import { Trash2, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { cn } from '../lib/utils';

const TodoItem = ({ 
  todo, 
  onToggleComplete, 
  onDelete, 
  index 
}) => {
  const handleToggle = () => {
    onToggleComplete(todo.id);
  };

  const handleDelete = () => {
    onDelete(todo.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ 
        duration: 0.3,
        delay: index * 0.05,
        ease: [0.4, 0, 0.2, 1]
      }}
      layout
      className="group"
    >
      <Card className={cn(
        "p-4 transition-all duration-300 hover:shadow-md border-l-4",
        "bg-gradient-to-r from-surface-container to-surface-container-low",
        todo.completed 
          ? "border-l-outline opacity-70 bg-gradient-to-r from-surface-container-low to-surface-container-lowest" 
          : "border-l-primary hover:border-l-primary-container"
      )}>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggle}
            className={cn(
              "h-8 w-8 rounded-full p-0 transition-all duration-200",
              "border-2 hover:scale-110 active:scale-95",
              todo.completed
                ? "bg-primary border-primary text-on-primary hover:bg-primary/90"
                : "border-outline hover:border-primary hover:bg-primary/10"
            )}
          >
            <motion.div
              initial={false}
              animate={{ 
                scale: todo.completed ? 1 : 0,
                opacity: todo.completed ? 1 : 0 
              }}
              transition={{ duration: 0.2 }}
            >
              <Check className="h-4 w-4" />
            </motion.div>
          </Button>

          <div className="flex-1 min-w-0">
            <motion.p
              className={cn(
                "text-sm font-medium transition-all duration-300",
                "break-words leading-relaxed",
                todo.completed
                  ? "text-on-surface-variant line-through"
                  : "text-on-surface"
              )}
              animate={{
                opacity: todo.completed ? 0.7 : 1,
              }}
              transition={{ duration: 0.3 }}
            >
              {todo.text}
            </motion.p>
            
            {todo.createdAt && (
              <motion.p
                className="text-xs text-on-surface-variant mt-1"
                animate={{
                  opacity: todo.completed ? 0.5 : 0.7,
                }}
                transition={{ duration: 0.3 }}
              >
                {new Date(todo.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </motion.p>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              scale: 1 
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className={cn(
                "h-8 w-8 p-0 text-error hover:text-on-error",
                "hover:bg-error/10 transition-colors duration-200"
              )}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>

        {/* Material Design 3 ripple effect */}
        <motion.div
          className="absolute inset-0 rounded-lg pointer-events-none"
          initial={false}
          whileTap={{
            background: [
              "radial-gradient(circle at center, transparent 0%, transparent 100%)",
              "radial-gradient(circle at center, rgba(103, 80, 164, 0.1) 0%, transparent 70%)",
              "radial-gradient(circle at center, transparent 0%, transparent 100%)"
            ]
          }}
          transition={{ duration: 0.6 }}
        />
      </Card>
    </motion.div>
  );
};

export default TodoItem;