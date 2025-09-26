"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Shield, 
  CheckCircle2, 
  Users, 
  Lock, 
  Zap, 
  Award,
  AlertTriangle,
  ArrowRight,
  Building2,
  UserCheck,
  Database,
  TrendingUp
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const verificationSteps = [
  {
    id: 1,
    title: "Secure Connection",
    description: "Connect securely through Plaid's bank-level encryption",
    icon: Lock,
  },
  {
    id: 2,
    title: "Identity Verification",
    description: "Verify your identity using official government documents",
    icon: UserCheck,
  },
  {
    id: 3,
    title: "Data Validation",
    description: "Cross-reference information across multiple trusted sources",
    icon: Database,
  },
  {
    id: 4,
    title: "Codex Verified Badge",
    description: "Receive your verified consultant badge and enhanced profile",
    icon: Award,
  },
];

const benefits = [
  {
    icon: Shield,
    title: "Premium Client Access",
    description: "Verified consultants get priority access to high-value client projects and exclusive opportunities."
  },
  {
    icon: TrendingUp,
    title: "Higher Success Rate",
    description: "Verified consultants see 3x higher engagement rates from clients compared to unverified profiles."
  },
  {
    icon: Award,
    title: "Trusted Badge",
    description: "Display the \"Codex Verified\" badge that instantly builds trust with potential clients."
  },
  {
    icon: Building2,
    title: "Enterprise Clients",
    description: "Many enterprise clients require verified consultants for compliance and security reasons."
  }
];

const comparisons = [
  {
    feature: "Identity Verification",
    codex: "Bank-level verification with Plaid",
    others: "Basic email verification only",
    codexIcon: CheckCircle2,
    othersIcon: AlertTriangle
  },
  {
    feature: "Consultant Quality",
    codex: "Verified professionals only",
    others: "Anyone can sign up",
    codexIcon: CheckCircle2,
    othersIcon: AlertTriangle
  },
  {
    feature: "Client Trust",
    codex: "Verified badge builds instant trust",
    others: "No verification indicators",
    codexIcon: CheckCircle2,
    othersIcon: AlertTriangle
  },
  {
    feature: "Spam Protection",
    codex: "Zero tolerance for fake accounts",
    others: "Flooded with spam accounts",
    codexIcon: CheckCircle2,
    othersIcon: AlertTriangle
  }
];

export default function IdentityVerification() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20 pt-20 pb-16 lg:pt-32 lg:pb-24">
        <div className="absolute inset-0 bg-grid-black/[0.02] bg-[length:50px_50px] dark:bg-grid-white/[0.02]" />
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex justify-center mb-6"
            >
              <Badge className="bg-blue-100 text-blue-800 border-blue-300 text-sm px-4 py-2">
                <Shield className="w-4 h-4 mr-2" />
                Powered by Plaid
              </Badge>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl mb-6"
            >
              <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent">
                Codex Verified
              </span>{" "}
              Consultants
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-muted-foreground"
            >
              Bank-level identity verification that sets us apart from other consulting platforms. 
              No spam accounts, no fake profiles—just verified, trusted professionals.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-10"
            >
              <Button asChild size="lg" className="text-lg px-8 py-6">
                <Link href="/signup">
                  <UserCheck className="mr-2 h-5 w-5" />
                  Get Verified Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6" asChild>
                <Link href="/consultants">
                  Learn About Our Network
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
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
                The Problem with Other Platforms
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Most consulting platforms are flooded with unverified accounts, spam profiles, 
                and consultants who haven't proven their identity or credentials.
              </p>
            </motion.div>

            <div className="grid gap-8 md:grid-cols-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="text-center p-6 h-full border-red-200 bg-red-50/50 dark:bg-red-950/10">
                  <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-3 text-red-900 dark:text-red-100">
                    Fake Profiles
                  </h3>
                  <p className="text-red-700 dark:text-red-300">
                    Anyone can create multiple accounts with fake credentials, 
                    making it hard for clients to find genuine consultants.
                  </p>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="text-center p-6 h-full border-red-200 bg-red-50/50 dark:bg-red-950/10">
                  <Users className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-3 text-red-900 dark:text-red-100">
                    Inflated Numbers
                  </h3>
                  <p className="text-red-700 dark:text-red-300">
                    Platforms boost their consultant numbers with unverified accounts, 
                    creating more noise than signal for clients.
                  </p>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <Card className="text-center p-6 h-full border-red-200 bg-red-50/50 dark:bg-red-950/10">
                  <Shield className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-3 text-red-900 dark:text-red-100">
                    No Trust Indicators
                  </h3>
                  <p className="text-red-700 dark:text-red-300">
                    Clients have no way to distinguish between verified professionals 
                    and potentially fraudulent accounts.
                  </p>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Solution */}
      <section className="py-20 lg:py-32">
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
                Our Solution: Plaid-Powered Verification
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                We use Plaid's bank-level security and verification technology to ensure 
                every consultant on our platform is a real, verified professional.
              </p>
            </motion.div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {verificationSteps.map((step, index) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20 mx-auto mb-6">
                    <step.icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-4 text-sm font-bold">
                    {step.id}
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
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
                Benefits of Being Codex Verified
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Verified consultants enjoy exclusive advantages and higher success rates
              </p>
            </motion.div>

            <div className="grid gap-8 md:grid-cols-2">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="p-6 h-full">
                    <div className="flex items-start space-x-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/20">
                        <benefit.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-20 lg:py-32">
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
                Codex Studios vs. Other Platforms
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                See why verified consultants and clients choose Codex Studios
              </p>
            </motion.div>

            <div className="overflow-hidden rounded-lg border">
              <div className="grid grid-cols-3 gap-0">
                <div className="bg-muted/50 p-4 font-semibold text-center">Feature</div>
                <div className="bg-blue-50 dark:bg-blue-950/20 p-4 font-semibold text-center text-blue-900 dark:text-blue-100">
                  Codex Studios
                </div>
                <div className="bg-muted/50 p-4 font-semibold text-center">Other Platforms</div>
              </div>
              
              {comparisons.map((comparison, index) => (
                <motion.div
                  key={comparison.feature}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="grid grid-cols-3 gap-0 border-t"
                >
                  <div className="p-4 font-medium">{comparison.feature}</div>
                  <div className="bg-blue-50/50 dark:bg-blue-950/10 p-4 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <comparison.codexIcon className="w-4 h-4 text-green-600" />
                      <span className="text-sm">{comparison.codex}</span>
                    </div>
                  </div>
                  <div className="p-4 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <comparison.othersIcon className="w-4 h-4 text-red-500" />
                      <span className="text-sm text-muted-foreground">{comparison.others}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Shield className="w-16 h-16 text-blue-600 mx-auto mb-6" />
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
                Ready to Get Codex Verified?
              </h2>
              <p className="text-lg text-muted-foreground mb-10">
                Join our elite network of verified consultants and stand out from the crowd. 
                Identity verification is coming soon—sign up now to be first in line.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="h-12 px-8">
                  <Link href="/signup">
                    <UserCheck className="mr-2 h-4 w-4" />
                    Join the Waitlist
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" asChild size="lg" className="h-12 px-8">
                  <Link href="/consultants">
                    Learn More About Our Network
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}