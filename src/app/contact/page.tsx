"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MailIcon, PhoneIcon, MapPinIcon, LinkedinIcon, InstagramIcon, CheckCircle, AlertCircle } from "lucide-react";

export default function Contact() {
  const [formInputs, setFormInputs] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const updateInput = (field: string, value: string) => {
    setFormInputs(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const submitForm = async () => {
    // Validate required fields
    if (!formInputs.firstName || !formInputs.lastName || !formInputs.email || !formInputs.subject || !formInputs.message) {
      setSubmitStatus('error');
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formInputs.email)) {
      setSubmitStatus('error');
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formInputs),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send message');
      }

      setSubmitStatus('success');
      // Clear form
      setFormInputs({
        firstName: '',
        lastName: '',
        email: '',
        company: '',
        phone: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 lg:pt-32 lg:pb-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              Get In{" "}
              <span className="bg-gradient-to-r from-foreground via-muted-foreground to-foreground bg-clip-text text-transparent">
                Touch
              </span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
              Ready to transform your business with cloud solutions? Let's start the conversation. 
              Schedule a free consultation with our experts today.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-12 lg:grid-cols-2">
              {/* Contact Form */}
              <div className="rounded-2xl border bg-card p-8">
                <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
                
                {/* Success/Error Messages */}
                {submitStatus === 'success' && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <p className="text-green-800">
                      Thank you! Your message has been sent successfully. We'll get back to you within 24 hours.
                    </p>
                  </div>
                )}
                
                {submitStatus === 'error' && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <p className="text-red-800">{errorMessage}</p>
                  </div>
                )}
                
                <form className="space-y-6" noValidate>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input 
                        id="firstName" 
                        name="firstName"
                        value={formInputs.firstName}
                        onChange={(e) => updateInput('firstName', e.target.value)}
                        placeholder="John" 
                        className="mt-1"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input 
                        id="lastName" 
                        name="lastName"
                        value={formInputs.lastName}
                        onChange={(e) => updateInput('lastName', e.target.value)}
                        placeholder="Doe" 
                        className="mt-1"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input 
                      id="email" 
                      name="email"
                      type="email"
                      value={formInputs.email}
                      onChange={(e) => updateInput('email', e.target.value)}
                      placeholder="john@example.com" 
                      className="mt-1"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="company">Company (Optional)</Label>
                    <Input 
                      id="company" 
                      name="company"
                      value={formInputs.company}
                      onChange={(e) => updateInput('company', e.target.value)}
                      placeholder="Your Company" 
                      className="mt-1"
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Phone Number (Optional)</Label>
                    <Input 
                      id="phone" 
                      name="phone"
                      type="tel"
                      value={formInputs.phone}
                      onChange={(e) => updateInput('phone', e.target.value)}
                      placeholder="+1 (555) 123-4567" 
                      className="mt-1"
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="subject">Subject *</Label>
                    <Input 
                      id="subject" 
                      name="subject"
                      value={formInputs.subject}
                      onChange={(e) => updateInput('subject', e.target.value)}
                      placeholder="How can we help you?" 
                      className="mt-1"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea 
                      id="message"
                      name="message"
                      value={formInputs.message}
                      onChange={(e) => updateInput('message', e.target.value)}
                      placeholder="Tell us about your project and how we can help..."
                      className="mt-1 min-h-[120px]"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  <button 
                    type="button" 
                    className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                    onClick={submitForm}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </div>

              {/* Contact Information */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold mb-6">Let's talk</h2>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    We'd love to hear about your project and discuss how our cloud solutions 
                    can help your business grow. Reach out to us using any of the methods below.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <MailIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Email</h3>
                      <p className="text-muted-foreground">info@codexstudios.io</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <PhoneIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Phone</h3>
                      <p className="text-muted-foreground">(301) 674-2624</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <MapPinIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Address</h3>
                      <p className="text-muted-foreground">
                        20 S Charles St Ste 403 #857<br />
                        Baltimore, Maryland 21201<br />
                        United States
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-8">
                  <h3 className="font-semibold mb-4">Follow Us</h3>
                  <div className="flex space-x-4">
                    <a
                      href="https://www.linkedin.com/company/codexstudios-io"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors"
                    >
                      <LinkedinIcon className="h-5 w-5" />
                    </a>
                    <a
                      href="https://www.instagram.com/wixstudio"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors"
                    >
                      <InstagramIcon className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 lg:py-32 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Frequently Asked Questions
              </h2>
              <p className="mt-6 text-lg text-muted-foreground">
                Quick answers to common questions about our services
              </p>
            </div>

            <div className="space-y-8">
              <div className="rounded-2xl border bg-card p-6">
                <h3 className="text-lg font-semibold mb-2">How long does a typical cloud migration take?</h3>
                <p className="text-muted-foreground">
                  The timeline varies depending on the complexity and size of your infrastructure. 
                  Simple migrations can take 2-4 weeks, while complex enterprise migrations may take 3-6 months. 
                  We provide detailed timelines during our initial consultation.
                </p>
              </div>

              <div className="rounded-2xl border bg-card p-6">
                <h3 className="text-lg font-semibold mb-2">Do you provide ongoing support after migration?</h3>
                <p className="text-muted-foreground">
                  Yes, we offer comprehensive ongoing support and maintenance services to ensure your 
                  cloud infrastructure continues to operate efficiently and securely.
                </p>
              </div>

              <div className="rounded-2xl border bg-card p-6">
                <h3 className="text-lg font-semibold mb-2">What cloud platforms do you work with?</h3>
                <p className="text-muted-foreground">
                  We work with all major cloud platforms including AWS, Microsoft Azure, Google Cloud Platform, 
                  and hybrid cloud solutions. We'll help you choose the best platform for your needs.
                </p>
              </div>

              <div className="rounded-2xl border bg-card p-6">
                <h3 className="text-lg font-semibold mb-2">How do you ensure data security during migration?</h3>
                <p className="text-muted-foreground">
                  We follow industry best practices including encryption in transit and at rest, 
                  secure transfer protocols, and comprehensive backup strategies to ensure your data 
                  remains secure throughout the migration process.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}