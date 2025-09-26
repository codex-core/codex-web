"use client";

import { Button } from "@/components/ui/button";
import { Cloud, Server, Users, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
      <div className="absolute inset-0 bg-grid-black/[0.02] bg-[length:50px_50px] dark:bg-grid-white/[0.02]" />
      <div className="container relative mx-auto px-4 py-20 lg:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl"
          >
            We Engineer{" "}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
              Results
            </span>
            , Not Just Roadmaps
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground"
          >
            Comprehensive cloud infrastructure services, agile innovation, and comprehensive staffing solutions. 
            From cloud migrations to infrastructure as code and site reliability services.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-4 "
          >
            <Button asChild size="lg" className="h-12 px-8">
              <Link href="/contact">
                Schedule a Free Consultation
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild size="lg" className="h-12 px-8">
              <Link href="/solutions">
                View Our Solutions
              </Link>
            </Button>
          </motion.div>
        </div>

        {/* Feature Cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mx-auto mt-20 grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3"
        >
          <div className="relative overflow-hidden rounded-2xl border bg-card p-8 transition-all hover:shadow-lg">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-foreground/10">
              <Cloud className="h-6 w-6 text-foreground" />
            </div>
            <h3 className="mt-4 text-xl font-semibold">Cloud Solutions</h3>
            <p className="mt-2 text-muted-foreground">
              Our comprehensive cloud infrastructure services range from cloud migrations, 
              infrastructure as code, site reliability and much more
            </p>
            <Button variant="link" asChild className="mt-4 p-0">
              <Link href="/contact">
                Schedule a Free Consultation
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="relative overflow-hidden rounded-2xl border bg-card p-8 transition-all hover:shadow-lg">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted-foreground/20">
              <Server className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-xl font-semibold">Agile Innovation</h3>
            <p className="mt-2 text-muted-foreground">
              Offering web and cloud computing solutions for agile teams and small businesses
            </p>
            <Button variant="link" asChild className="mt-4 p-0">
              <Link href="/insights">
                Read Our Latest Report
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="relative overflow-hidden rounded-2xl border bg-card p-8 transition-all hover:shadow-lg">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-foreground/5">
              <Users className="h-6 w-6 text-foreground/80" />
            </div>
            <h3 className="mt-4 text-xl font-semibold">Comprehensive Staffing</h3>
            <p className="mt-2 text-muted-foreground">
              Focusing on understanding and meeting the diverse needs of both employers and 
              job seekers to create optimal matches
            </p>
            <Button variant="link" asChild className="mt-4 p-0">
              <Link href="/solutions">
                Check Our Solutions
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}