"use client";

import RoleGuard from './RoleGuard';

interface AdminRouteGuardProps {
  children: React.ReactNode;
}

export default function AdminRouteGuard({ children }: AdminRouteGuardProps) {
  return (
    <RoleGuard 
      requiredRoles={['admin']}
      fallbackPath="/"
      fallbackMessage="You need administrator permissions to access this area."
    >
      {children}
    </RoleGuard>
  );
}
