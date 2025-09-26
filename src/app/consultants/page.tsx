"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, CheckCircle, Users, Briefcase, Clock, Star, Zap, Target } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { consultantProcess, featuredRoles } from "@/config/jobs";

const stats = [
  { label: "Active Consultants", value: "30+", icon: Users },
  { label: "Projects Completed", value: "50+", icon: Briefcase },
  { label: "Average Response Time", value: "24hrs", icon: Clock },
  { label: "Client Satisfaction", value: "99.999%", icon: Star }
];

const whyJoinReasons = [
  {
    icon: Target,
    title: "High-Impact Projects",
    description: "Work on cutting-edge cloud transformation projects with leading companies across various industries."
  },
  {
    icon: Zap,
    title: "Flexible Engagement",
    description: "Choose projects that match your schedule and expertise. Work remotely or on-site based on project needs."
  },
  {
    icon: Users,
    title: "Professional Network",
    description: "Join a community of elite consultants and expand your professional network through collaborative projects."
  },
  {
    icon: Star,
    title: "Competitive Compensation",
    description: "Earn competitive rates for your expertise with transparent project-based compensation structures."
  }
];

export default function Consultants() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20 pt-20 pb-16 lg:pt-32 lg:pb-24">
        <div className="absolute inset-0 bg-grid-black/[0.02] bg-[length:50px_50px] dark:bg-grid-white/[0.02]" />
        {/* Placeholder for hero background image */}
        <div className="absolute right-0 top-0 w-1/3 h-full opacity-10">
          <div className="w-full h-full bg-gradient-to-l from-muted-foreground/20 to-transparent rounded-l-3xl">
          </div>
        </div>
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl"
            >
              Join Our Elite{" "}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                Consultant Network
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-muted-foreground"
            >
              Connect with top-tier consulting opportunities in cloud computing, AI, and full-stack development. 
              Join our vetted network of expert consultants and work on transformative projects with leading organizations.
            </motion.p>

                        <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-10"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button asChild size="lg" className="text-lg px-8 py-6 relative overflow-hidden group">
                  <Link href="/signup">
                    <span className="relative z-10">Apply Now</span>
                    <ArrowRight className="ml-2 h-5 w-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  </Link>
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="#why-join">
                  <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                    Learn More
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mx-auto max-w-6xl"
          >
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center relative group"
                >
                  {/* Placeholder for stat visualization/chart */}
                  <div className="w-full h-20 bg-muted/20 rounded-lg mb-4 group-hover:bg-muted/30 transition-colors">
                  </div>
                  
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-foreground/10 mx-auto mb-4 group-hover:bg-foreground/20 transition-colors">
                    <stat.icon className="h-8 w-8 text-foreground" />
                  </div>
                  <div className="text-3xl font-bold mb-2">{stat.value}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                  
                  {/* Animated accent */}
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-foreground/30 rounded-full opacity-0 group-hover:opacity-100 animate-pulse transition-opacity"></div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Roles Section */}
      <section className="py-20 lg:py-32 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl mb-6">
                Currently Seeking
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                We are actively looking for consultants in these high-demand areas. 
                Apply now to be first in line for exciting opportunities.
              </p>
            </motion.div>

                        <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
              {featuredRoles.map((role, index) => (
                <motion.div
                  key={role.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full transition-all hover:shadow-lg group">
                    <CardHeader>
                      {/* Placeholder for role/tech stack illustration */}
                      <div className="w-full h-24 bg-gradient-to-br from-muted/30 to-muted/10 rounded-lg mb-4 group-hover:from-muted/40 group-hover:to-muted/20 transition-all">
                      </div>
                      
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline">{role.category}</Badge>
                        <Badge className="bg-foreground text-background">High Priority</Badge>
                      </div>
                      <CardTitle className="text-xl">{role.title}</CardTitle>
                      <CardDescription className="text-base">
                        {role.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Key Skills</h4>
                          <div className="flex flex-wrap gap-2">
                            {role.skills.slice(0, 6).map((skill, skillIndex) => (
                              <Badge key={skillIndex} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {role.skills.length > 6 && (
                              <Badge variant="secondary" className="text-xs">
                                +{role.skills.length - 6} more
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Experience Required</h4>
                          <p className="text-sm text-muted-foreground">{role.experience}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <Button asChild size="lg">
                <Link href="/jobs">
                  View All Open Roles
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Join Section */}
      <section id="why-join" className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl mb-6">
                Why Join Codex Studios?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Discover the benefits of joining our exclusive consultant network
              </p>
            </motion.div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {whyJoinReasons.map((reason, index) => (
                <motion.div
                  key={reason.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  {/* Placeholder for consultant photos/illustrations */}
                  <div className="w-full h-32 bg-muted/30 rounded-lg mb-4">
                  </div>
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-foreground/10 mx-auto mb-6">
                    <reason.icon className="h-8 w-8 text-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{reason.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {reason.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="process" className="py-20 lg:py-32 bg-muted/50 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-muted/30 via-background to-muted/20"></div>
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-foreground/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-foreground/3 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative">
          <div className="mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              {/* Placeholder for process flow diagram */}
              <div className="w-32 h-16 bg-muted/40 rounded-lg mx-auto mb-6 flex items-center justify-center">
                <div className="text-2xl opacity-60">🔄</div>
              </div>
              
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl mb-6">
                Our Consultant Process
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                A streamlined process designed to connect talented consultants with the right opportunities
              </p>
            </motion.div>

            <div className="relative">
              {consultantProcess.steps.map((step, index) => (
                <div key={step.id} className="relative">
                  <motion.div
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className={`flex items-center gap-8 ${index % 2 === 1 ? 'flex-row-reverse' : ''} group relative z-10`}
                  >
                    <div className="flex-shrink-0 relative">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-foreground text-background font-bold text-xl group-hover:scale-110 transition-transform">
                        {step.id}
                      </div>
                    </div>
                    <div className="flex-1">
                      <Card className="group-hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-xl">{step.title}</CardTitle>
                            <Badge variant="outline">{step.duration}</Badge>
                          </div>
                          <CardDescription className="text-base">
                            {step.description}
                          </CardDescription>
                        </CardHeader>
                      </Card>
                    </div>
                  </motion.div>
                  
                  {/* Connecting Arrow */}
                  {index < consultantProcess.steps.length - 1 && (
                    <div className="flex justify-center my-8">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 + 0.4 }}
                        viewport={{ once: true }}
                        className="flex flex-col items-center"
                      >
                        <div className="w-px h-8 bg-muted-foreground/30"></div>
                        <svg 
                          className="w-6 h-6 text-muted-foreground/50" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M19 14l-7 7m0 0l-7-7m7 7V3"
                          />
                        </svg>
                        <div className="w-px h-8 bg-muted-foreground/30"></div>
                      </motion.div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
                Consultant Benefits
              </h2>
              <p className="text-lg text-muted-foreground">
                Everything you need to succeed as a Codex Studios consultant
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="grid gap-4 md:grid-cols-2"
            >
              {consultantProcess.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-foreground flex-shrink-0" />
                  <span className="text-muted-foreground">{benefit}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="apply" className="py-20 lg:py-32 bg-muted/50 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-foreground/5 rounded-full animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 bg-foreground/3 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-foreground/3 rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="container mx-auto px-4 relative">
          <div className="mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              {/* Placeholder for success/growth visualization */}
              <div className="w-40 h-20 bg-muted/40 rounded-lg mx-auto mb-8 flex items-center justify-center">
                <div className="text-3xl opacity-70">🚀</div>
              </div>
              
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
                Ready to Join Our Network?
              </h2>
              <p className="text-lg text-muted-foreground mb-10">
                Take the first step towards working on cutting-edge projects with industry-leading clients. 
                Apply now and become part of our elite consultant community.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button asChild size="lg" className="h-12 px-8 relative overflow-hidden group">
                    <Link href="/signup">
                      <span className="relative z-10">Apply Now</span>
                      <ArrowRight className="ml-2 h-4 w-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    </Link>
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button variant="outline" asChild size="lg" className="h-12 px-8">
                    <Link href="/jobs">
                      Browse Open Roles
                    </Link>
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}