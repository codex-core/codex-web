"use client";

import { Star } from "lucide-react";
import { motion } from "framer-motion";

const testimonials = [
  {
    quote: "One of the best teams of engineers that I've ever worked with.",
    author: "Manager",
    company: "Insight Global",
    rating: 5
  },
  {
    quote: "They aim to help organizations leverage the power of cloud computing to improve efficiency, scalability, and innovation, while also addressing security, compliance, and cost management challenges.",
    author: "Gloria Mills",
    position: "CEO",
    company: "OhemaasCrown.com",
    rating: 5
  },
  {
    quote: "From the outset, their team demonstrated a deep understanding of our vision, offering innovative solutions that perfectly aligned with our business goals. The professionalism was outstanding.",
    author: "Jonah Kalu",
    position: "COO",
    company: "Swank LLC",
    rating: 5
  }
];

export default function Testimonials() {
  return (
    <section className="py-20 lg:py-32 bg-muted/50">
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
              It's all about a dialogue
            </h2>
            <p className="mt-6 text-lg text-muted-foreground">
              A few words from our clients. See client stories for more.
            </p>
          </motion.div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="rounded-2xl border bg-card p-8 transition-all hover:shadow-lg"
              >
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                
                <blockquote className="text-muted-foreground leading-relaxed mb-6">
                  "{testimonial.quote}"
                </blockquote>
                
                <div className="border-t pt-4">
                  <div className="font-semibold text-foreground">
                    {testimonial.author}
                    {testimonial.position && (
                      <span className="text-muted-foreground font-normal">
                        , {testimonial.position}
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {testimonial.company}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}