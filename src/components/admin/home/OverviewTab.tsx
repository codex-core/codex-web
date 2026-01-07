import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, FileText, Download, Printer } from "lucide-react";

interface AdminStats {
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  pendingApplications: number;
  totalUsers: number;
  recentJobsCount: number;
}

interface OverviewTabProps {
  stats: AdminStats;
  onViewJobs: () => void;
  onViewApplicants: () => void;
  onExportReport: () => void;
  onPrintReport: () => void;
}

export function OverviewTab({ 
  stats, 
  onViewJobs, 
  onViewApplicants, 
  onExportReport, 
  onPrintReport 
}: OverviewTabProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            {stats.recentJobsCount} jobs posted in the last 7 days
          </p>
          <Button onClick={onViewJobs}>
            View All Jobs
          </Button>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Applications Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Review {stats.pendingApplications} pending applications
          </p>
          <Button onClick={onViewApplicants}>
            View Applications
          </Button>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start" onClick={onExportReport}>
              <Download className="mr-2 h-4 w-4" />
              Export Reports
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={onPrintReport}>
              <Printer className="mr-2 h-4 w-4" />
              Print Summary
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}