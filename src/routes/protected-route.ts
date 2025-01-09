// import React from 'react';
// import { Navigate, useLocation } from 'react-router-dom';
// import { UserRole } from '../types/auth';
// import { useAuthStore } from '../lib/auth/authstore';

// interface ProtectedRouteProps {
//   children: React.ReactNode;
//   allowedRoles?: UserRole[];
// }

// export const ProtectedRoute = ({ children, allowedRoles = [] }: ProtectedRouteProps) => {
//   const { user, isAuthenticated } = useAuthStore();
//   const location = useLocation();

//   console.log('user', user);
//   console.log('isAuthenticated', isAuthenticated);
//   console.log('allowedRoles', allowedRoles);
//   console.log('children', children);

//   if (!isAuthenticated) {
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   if (allowedRoles.length > 0 && user?.role && !allowedRoles.includes(user.role)) {
//     return <Navigate to="/unauthorized" replace />;
//   }

//   return <>{children}</>;
// };