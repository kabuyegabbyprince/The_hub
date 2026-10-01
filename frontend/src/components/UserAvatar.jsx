import React from 'react';

export const UserAvatar = ({ user, size = 'md', className = '' }) => {
  const getInitials = (name) => {
    if (!name) return '??';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-20 h-20 text-2xl'
  };

  if (user?.avatarUrl) {
    return (
      <img
        src={user.avatarUrl}
        alt={user.fullName || 'User'}
        className={`${sizeClasses[size]} rounded-full object-cover ring-2 ring-blue-500/20 ${className}`}
      />
    );
  }

  return (
    <div 
      className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center text-white font-bold border border-blue-400/30 shadow-sm ${className}`}
    >
      {getInitials(user?.fullName || 'User')}
    </div>
  );
};
