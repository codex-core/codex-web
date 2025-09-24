"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function About() {
  return (
    <section className="py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              The Story of{" "}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                Codex
              </span>
            </h2>
            
            <p className="mt-6 text-lg text-muted-foreground">
              Isn't it time for your business to reach its apex? Your greatest success is just around the corner.
            </p>

            <div className="mt-8 rounded-2xl border bg-card p-8 text-left">
              <p className="text-lg leading-relaxed text-muted-foreground">
                Codex Studios was founded in 2020, and since then, we've been busy harnessing the power of cloud 
                to bring about transformative, ground-breaking solutions to businesses across the globe. We're all 
                about making the cloud work for you, not the other way around. Say goodbye to mystifying jargon, 
                complex systems, and underutilized resources - we're here to make your cloud journey as breezy as 
                a walk in the park.
              </p>
              
              <div className="mt-8 flex justify-center">
                <Button asChild size="lg">
                  <Link href="/about">
                    Read More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}