import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  className?: string;
}

export default function Card({ title, subtitle, children, className = '' }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`bg-white rounded-lg shadow-soft p-6 ${className}`}
    >
      <h3 className="text-xl font-semibold text-black mb-2">{title}</h3>
      {subtitle && <p className="text-gray-600 mb-4">{subtitle}</p>}
      {children && <div className="mt-4">{children}</div>}
    </motion.div>
  );
} 