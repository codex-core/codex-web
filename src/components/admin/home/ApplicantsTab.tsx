import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Download, Printer, Eye, FileText } from "lucide-react";

interface Applicant {
  applicationId: string;
  jobId: string;
  jobTitle: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  status: 'pending' | 'screening' | 'interview' | 'offer' | 'rejected' | 'hired';
  appliedAt: string;
  resumeKey?: string;
  location?: string;
  experience?: string;
  skills?: string[];
  phone?: string;
  linkedinUrl?: string;
  coverLetter?: string;
}

interface ApplicantsTabProps {
  applicants: Applicant[];
  onExportReport: () => void;
  onPrintReport: () => void;
  onViewProfile: (applicant: Applicant) => void;
  onDownloadResume: (applicant: Applicant) => void;
}

export function ApplicantsTab({ 
  applicants, 
  onExportReport, 
  onPrintReport, 
  onViewProfile, 
  onDownloadResume 
}: ApplicantsTabProps) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredApplicants = applicants.filter(applicant => {
    const matchesStatus = statusFilter === 'all' || applicant.status === statusFilter;
    const fullName = `${applicant.firstName} ${applicant.lastName}`;
    const matchesSearch = fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         applicant.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search applicants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-input bg-background rounded-md text-sm"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="screening">Screening</option>
            <option value="interview">Interview</option>
            <option value="offer">Offer</option>
            <option value="rejected">Rejected</option>
            <option value="hired">Hired</option>
          </select>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onExportReport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={onPrintReport}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr>
                  <th className="text-left p-4 font-medium">Applicant</th>
                  <th className="text-left p-4 font-medium">Position</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Applied Date</th>
                  <th className="text-left p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplicants.map((applicant) => {
                  const fullName = `${applicant.firstName} ${applicant.lastName}`;
                  return (
                    <tr key={applicant.applicationId} className="border-b hover:bg-muted/50">
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              {applicant.firstName[0]}{applicant.lastName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{fullName}</div>
                            <div className="text-sm text-muted-foreground">{applicant.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">{applicant.jobTitle}</td>
                      <td className="p-4">
                        <Badge 
                          variant={
                            applicant.status === 'hired' ? 'default' :
                            applicant.status === 'rejected' ? 'destructive' :
                            applicant.status === 'interview' || applicant.status === 'offer' ? 'secondary' : 'outline'
                          }
                        >
                          {applicant.status}
                        </Badge>
                      </td>
                      <td className="p-4">{new Date(applicant.appliedAt).toLocaleDateString()}</td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onViewProfile(applicant)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {applicant.resumeKey && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onDownloadResume(applicant)}
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}