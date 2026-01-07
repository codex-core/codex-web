"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Upload,
  Plus,
  FileText,
  AlertCircle,
  CheckCircle
} from "lucide-react";

interface JobFormData {
  title: string;
  company: string;
  location: string;
  type: string;
  experience: string;
  salary: string;
  description: string;
  requirements: string;
  benefits: string;
  status: 'active' | 'inactive' | 'draft';
}

export default function CreateJobPage() {
  const [activeTab, setActiveTab] = useState<'manual' | 'upload'>('manual');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  // Manual form state
  const [formData, setFormData] = useState<JobFormData>({
    title: '',
    company: '',
    location: '',
    type: 'Full-time',
    experience: 'Mid-level',
    salary: '',
    description: '',
    requirements: '',
    benefits: '',
    status: 'draft'
  });

  // JSON upload state
  const [jsonContent, setJsonContent] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  const handleFormChange = (field: keyof JobFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Job created successfully!' });
        // Reset form
        setFormData({
          title: '',
          company: '',
          location: '',
          type: 'Full-time',
          experience: 'Mid-level',
          salary: '',
          description: '',
          requirements: '',
          benefits: '',
          status: 'draft'
        });
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to create job' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to create job' });
    } finally {
      setLoading(false);
    }
  };

  const handleJsonSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      let jobsData;
      
      if (uploadFile) {
        const text = await uploadFile.text();
        jobsData = JSON.parse(text);
      } else if (jsonContent) {
        jobsData = JSON.parse(jsonContent);
      } else {
        setMessage({ type: 'error', text: 'Please provide JSON content or upload a file' });
        setLoading(false);
        return;
      }

      // Handle both single job and array of jobs
      const jobs = Array.isArray(jobsData) ? jobsData : [jobsData];
      let successCount = 0;
      let errorCount = 0;

      for (const job of jobs) {
        try {
          const response = await fetch('/api/jobs', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(job),
          });

          const data = await response.json();
          if (data.success) {
            successCount++;
          } else {
            errorCount++;
          }
        } catch (error) {
          errorCount++;
        }
      }

      if (successCount > 0) {
        setMessage({ 
          type: 'success', 
          text: `Successfully created ${successCount} job(s)${errorCount > 0 ? `, ${errorCount} failed` : ''}` 
        });
        setJsonContent('');
        setUploadFile(null);
      } else {
        setMessage({ type: 'error', text: 'Failed to create any jobs' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Invalid JSON format' });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadFile(file);
      setJsonContent(''); // Clear manual JSON input when file is selected
    }
  };

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Create Job</h1>
          <p className="text-muted-foreground">Add a new job posting</p>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`flex items-center gap-2 p-4 rounded-md mb-6 ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-700 border border-green-200' 
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <AlertCircle className="h-5 w-5" />
          )}
          {message.text}
        </div>
      )}

      {/* Tabs */}
      <div className="flex space-x-1 rounded-lg bg-gray-100 p-1 mb-6">
        <button
          className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            activeTab === 'manual'
              ? 'bg-white text-gray-900 shadow'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('manual')}
        >
          <Plus className="h-4 w-4 inline mr-2" />
          Manual Entry
        </button>
        <button
          className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            activeTab === 'upload'
              ? 'bg-white text-gray-900 shadow'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('upload')}
        >
          <Upload className="h-4 w-4 inline mr-2" />
          JSON Upload
        </button>
      </div>

      {/* Manual Entry Form */}
      {activeTab === 'manual' && (
        <Card>
          <CardHeader>
            <CardTitle>Job Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleManualSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="title">Job Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleFormChange('title', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="company">Company *</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => handleFormChange('company', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleFormChange('location', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="salary">Salary</Label>
                  <Input
                    id="salary"
                    value={formData.salary}
                    onChange={(e) => handleFormChange('salary', e.target.value)}
                    placeholder="e.g., $80,000 - $120,000"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label htmlFor="type">Job Type</Label>
                  <select
                    id="type"
                    value={formData.type}
                    onChange={(e) => handleFormChange('type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Freelance">Freelance</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="experience">Experience Level</Label>
                  <select
                    id="experience"
                    value={formData.experience}
                    onChange={(e) => handleFormChange('experience', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Entry-level">Entry-level</option>
                    <option value="Mid-level">Mid-level</option>
                    <option value="Senior-level">Senior-level</option>
                    <option value="Executive">Executive</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => handleFormChange('status', e.target.value as 'active' | 'inactive' | 'draft')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Job Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleFormChange('description', e.target.value)}
                  rows={4}
                  required
                />
              </div>

              <div>
                <Label htmlFor="requirements">Requirements</Label>
                <Textarea
                  id="requirements"
                  value={formData.requirements}
                  onChange={(e) => handleFormChange('requirements', e.target.value)}
                  rows={4}
                  placeholder="List the job requirements..."
                />
              </div>

              <div>
                <Label htmlFor="benefits">Benefits</Label>
                <Textarea
                  id="benefits"
                  value={formData.benefits}
                  onChange={(e) => handleFormChange('benefits', e.target.value)}
                  rows={3}
                  placeholder="List the benefits offered..."
                />
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Job'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* JSON Upload Form */}
      {activeTab === 'upload' && (
        <Card>
          <CardHeader>
            <CardTitle>Upload Jobs from JSON</CardTitle>
            <p className="text-sm text-muted-foreground">
              Upload a JSON file or paste JSON content to create multiple jobs at once.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleJsonSubmit} className="space-y-6">
              <div>
                <Label htmlFor="file-upload">Upload JSON File</Label>
                <div className="mt-2">
                  <input
                    id="file-upload"
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
                {uploadFile && (
                  <p className="text-sm text-green-600 mt-2">
                    <FileText className="h-4 w-4 inline mr-1" />
                    {uploadFile.name} selected
                  </p>
                )}
              </div>

              <div className="text-center text-muted-foreground">
                <span>or</span>
              </div>

              <div>
                <Label htmlFor="json-content">Paste JSON Content</Label>
                <Textarea
                  id="json-content"
                  value={jsonContent}
                  onChange={(e) => setJsonContent(e.target.value)}
                  rows={10}
                  placeholder={`Paste your JSON here. Example format:
{
  "title": "Software Engineer",
  "company": "Tech Corp",
  "location": "Remote",
  "type": "Full-time",
  "experience": "Mid-level",
  "salary": "$80,000 - $120,000",
  "description": "Job description...",
  "requirements": "Requirements...",
  "benefits": "Benefits...",
  "status": "active"
}

Or an array of jobs: [{ job1 }, { job2 }, ...]`}
                  disabled={!!uploadFile}
                />
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={loading || (!uploadFile && !jsonContent)}>
                  {loading ? 'Uploading...' : 'Create Jobs'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}