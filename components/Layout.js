import React from 'react';
import { motion } from 'framer-motion';
import { CheckSquare, Home, CheckCircle, Plus, Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Separator } from './ui/separator';

const Layout = ({ children, currentPage = 'home' }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navigationItems = [
    {
      id: 'home',
      label: 'All Tasks',
      icon: Home,
      href: '/',
      color: 'text-blue-600'
    },
    {
      id: 'completed',
      label: 'Completed',
      icon: CheckCircle,
      href: '/completed',
      color: 'text-green-600'
    }
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Glassmorphic Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="sticky top-0 z-50 backdrop-blur-md bg-white/30 border-b border-white/20 shadow-lg"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-3"
            >
              <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl shadow-lg">
                <CheckSquare className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                TodoMaterial
              </h1>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                
                return (
                  <motion.a
                    key={item.id}
                    href={item.href}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-white/50 shadow-md border border-white/30'
                        : 'hover:bg-white/30'
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${isActive ? item.color : 'text-gray-600'}`} />
                    <span className={`font-medium ${isActive ? item.color : 'text-gray-700'}`}>
                      {item.label}
                    </span>
                  </motion.a>
                );
              })}
            </nav>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/20 backdrop-blur-md bg-white/20"
          >
            <div className="px-4 py-3 space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                
                return (
                  <motion.a
                    key={item.id}
                    href={item.href}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-white/50 shadow-md border border-white/30'
                        : 'hover:bg-white/30'
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${isActive ? item.color : 'text-gray-600'}`} />
                    <span className={`font-medium ${isActive ? item.color : 'text-gray-700'}`}>
                      {item.label}
                    </span>
                  </motion.a>
                );
              })}
            </div>
          </motion.div>
        )}
      </motion.header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {children}
        </motion.div>
      </main>

      {/* Floating Action Button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.8, type: 'spring', stiffness: 200 }}
        className="fixed bottom-6 right-6 z-40"
      >
        <Button
          size="lg"
          className="h-14 w-14 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 shadow-lg hover:shadow-xl transition-all duration-300 border-0"
          onClick={() => {
            // This will be handled by the parent component
            const event = new CustomEvent('openAddDialog');
            window.dispatchEvent(event);
          }}
        >
          <Plus className="h-6 w-6 text-white" />
        </Button>
      </motion.div>

      {/* Glassmorphic Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="mt-16 backdrop-blur-md bg-white/20 border-t border-white/20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="bg-white/30 backdrop-blur-sm border-white/20 shadow-lg">
            <div className="p-6">
              <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
                    <CheckSquare className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">TodoMaterial</h3>
                    <p className="text-sm text-gray-600">Material Design 3 Todo App</p>
                  </div>
                </div>
                
                <Separator orientation="vertical" className="hidden md:block h-12 bg-white/30" />
                
                <div className="text-center md:text-right">
                  <p className="text-sm text-gray-600">
                    Built with Next.js & Material Design 3
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    © 2024 TodoMaterial. All rights reserved.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </motion.footer>
    </div>
  );
};

export default Layout;