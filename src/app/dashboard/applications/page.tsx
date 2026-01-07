"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePasswordless } from "@/lib/cognito-react";
import { 
  FileText, 
  Search, 
  ExternalLink,
  Download,
  Calendar,
  Building2,
  MapPin
} from "lucide-react";
import Link from "next/link";

interface Application {
  applicationId: string;
  jobTitle: string;
  company: string;
  location: string;
  status: 'pending' | 'reviewed' | 'rejected' | 'accepted';
  appliedAt: string;
  resumeKey?: string;
  jobDescription?: string;
  salary?: string;
}

export default function ApplicationsPage() {
  const { tokensParsed } = usePasswordless();
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const email = tokensParsed?.idToken.email;
        if (!email) {
          console.error("No email found in token");
          return;
        }

        // First, get user profile to get userId
        const userResponse = await fetch(`/api/users/check?email=${encodeURIComponent(email)}`);
        if (!userResponse.ok) {
          throw new Error('Failed to fetch user profile');
        }
        
        const userData = await userResponse.json();
        if (!userData.exists) {
          console.error("User not found in database");
          return;
        }

        const user = userData.user;

        // Now fetch applications for this user
        const applicationsResponse = await fetch(`/api/users/${user.userId}/applications`);
        if (!applicationsResponse.ok) {
          throw new Error('Failed to fetch applications');
        }

        const applicationsData = await applicationsResponse.json();
        const userApplications = applicationsData.applications || [];

        setApplications(userApplications);
        setFilteredApplications(userApplications);
      } catch (error) {
        console.error('Error fetching applications:', error);
        // For development, still show empty state rather than crash
        setApplications([]);
        setFilteredApplications([]);
      } finally {
        setLoading(false);
      }
    };

    if (tokensParsed) {
      fetchApplications();
    }
  }, [tokensParsed]);

  useEffect(() => {
    let filtered = applications;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(app => 
        app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.company.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    setFilteredApplications(filtered);
  }, [applications, searchQuery, statusFilter]);

  const getStatusIcon = (status: string) => {
    const iconClass = "w-4 h-4";
    switch (status) {
      case 'pending':
        return <div className={`${iconClass} rounded-full bg-yellow-400`}></div>;
      case 'reviewed':
        return <div className={`${iconClass} rounded-full bg-blue-400`}></div>;
      case 'accepted':
        return <div className={`${iconClass} rounded-full bg-green-400`}></div>;
      case 'rejected':
        return <div className={`${iconClass} rounded-full bg-red-400`}></div>;
      default:
        return <div className={`${iconClass} rounded-full bg-gray-400`}></div>;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'reviewed':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'accepted':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Applications</h1>
        <div className="text-sm text-muted-foreground">
          {filteredApplications.length} of {applications.length} applications
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search applications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={statusFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("all")}
          >
            All
          </Button>
          <Button
            variant={statusFilter === "pending" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("pending")}
          >
            Pending
          </Button>
          <Button
            variant={statusFilter === "reviewed" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("reviewed")}
          >
            Reviewed
          </Button>
          <Button
            variant={statusFilter === "accepted" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("accepted")}
          >
            Accepted
          </Button>
          <Button
            variant={statusFilter === "rejected" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("rejected")}
          >
            Rejected
          </Button>
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No applications found</h3>
              <p className="text-muted-foreground">
                {searchQuery || statusFilter !== "all" 
                  ? "Try adjusting your search or filters"
                  : "Start applying to jobs to see them here"
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredApplications.map((app) => (
            <Card key={app.applicationId} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-xl">{app.jobTitle}</CardTitle>
                      <Badge className={getStatusColor(app.status)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(app.status)}
                          <span className="capitalize">{app.status}</span>
                        </div>
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Building2 className="w-4 h-4" />
                        {app.company}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {app.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Applied {new Date(app.appliedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {app.resumeKey && (
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-1" />
                        Resume
                      </Button>
                    )}
                    <Link href={`/jobs/${app.jobTitle.replace(/\s+/g, '-').toLowerCase()}`}>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="w-4 h-4 mr-1" />
                      View Job
                    </Button>
                    </Link>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {app.salary && (
                    <div className="text-sm">
                      <span className="font-medium">Salary: </span>
                      <span className="text-green-600">{app.salary}</span>
                    </div>
                  )}
                  {app.jobDescription && (
                    <div className="text-sm text-muted-foreground">
                      {app.jobDescription.length > 150 
                        ? `${app.jobDescription.substring(0, 150)}...`
                        : app.jobDescription
                      }
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}