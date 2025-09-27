"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import AdminRouteGuard from "@/lib/components/auth/AdminRouteGuard";
import { 
  Users, 
  Plus, 
  Shield,
  Settings
} from "lucide-react";

interface CreateUserForm {
  email: string;
  firstName: string;
  lastName: string;
  role: 'consultant' | 'admin' | 'staffer';
}

export default function AdminPage() {
  const [form, setForm] = useState<CreateUserForm>({
    email: '',
    firstName: '',
    lastName: '',
    role: 'consultant'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'User created successfully!' });
        setForm({
          email: '',
          firstName: '',
          lastName: '',
          role: 'consultant'
        });
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to create user' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to create user' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminRouteGuard>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Admin Panel</h1>
            <p className="text-gray-600 mt-1">Manage users and system settings</p>
          </div>
          <Badge variant="secondary" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Administrator
          </Badge>
        </div>

        {/* Admin Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                User Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Create and manage user accounts for the platform.
              </p>
              <Button onClick={() => window.location.href = '/dashboard'}>
                View Dashboard
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                System Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Configure system-wide settings and preferences.
              </p>
              <Button variant="outline" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Manage security settings and access controls.
              </p>
              <Button variant="outline" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Create User Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Create New User
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="role">Role</Label>
                <Select value={form.role} onValueChange={(value: any) => setForm({ ...form, role: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="consultant">Consultant</SelectItem>
                    <SelectItem value="admin">Administrator</SelectItem>
                    <SelectItem value="staffer">Staff Member</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {message && (
                <div className={`p-3 rounded-md ${
                  message.type === 'success' 
                    ? 'bg-green-100 text-green-800 border border-green-200'
                    : 'bg-red-100 text-red-800 border border-red-200'
                }`}>
                  {message.text}
                </div>
              )}

              <Button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create User'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminRouteGuard>
  );
}