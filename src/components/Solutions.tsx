"use client";

import { Button } from "@/components/ui/button";
import { Target, Zap, Cloud, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const solutions = [
  {
    icon: Target,
    title: "Strategy",
    description: "Understanding the problem is essential for delivering value, as it ensures that solutions are not just innovative but also relevant and targeted, addressing the specific needs and challenges of the clients or market, thereby maximizing impact and effectiveness."
  },
  {
    icon: Zap,
    title: "Execution",
    description: "After careful strategic planning, execution becomes the crucial bridge between vision and reality, transforming meticulously laid plans into tangible results through disciplined action, adaptability, and a relentless focus on achieving set objectives."
  },
  {
    icon: Cloud,
    title: "Cloud Consulting",
    description: "Service provides expert guidance and support to businesses looking to migrate to, optimize, or manage their operations in the cloud. These services cover a wide range of needs, from initial cloud strategy development and platform selection to the implementation of cloud-based solutions and ongoing management.",
    hasButton: true
  }
];

export default function Solutions() {
  return (
    <section className="py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Our{" "}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                Solutions
              </span>
            </h2>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive cloud solutions designed to transform your business and drive innovation.
            </p>
          </motion.div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {solutions.map((solution, index) => (
              <motion.div
                key={solution.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="rounded-2xl border bg-card p-8 transition-all hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <solution.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-6 text-xl font-semibold">{solution.title}</h3>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  {solution.description}
                </p>
                {solution.hasButton && (
                  <Button variant="link" asChild className="mt-6 p-0">
                    <Link href="/solutions">
                      Check Our Solutions
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}