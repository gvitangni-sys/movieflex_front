import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-netflix-red/10 via-black/80 to-netflix-gray/20 opacity-40" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-card/90 backdrop-blur-sm rounded-lg shadow-card p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-netflix-red mb-2">NETFLIX</h1>
            <h2 className="text-xl font-semibold text-foreground">{title}</h2>
            {subtitle && (
              <p className="text-muted-foreground mt-2">{subtitle}</p>
            )}
          </div>
          
          {children}
        </div>
      </motion.div>
    </div>
  );
};
