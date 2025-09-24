"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log("Subscribing email:", email);
    setSubscribed(true);
    setEmail("");
  };

  return (
    <section className="py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-2xl font-bold text-muted-foreground mb-2">
              FOMO got you puzzled?
            </h2>
            <h3 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Subscribe to our weekly newsletter.
            </h3>
            
            <div className="mt-8 rounded-2xl border bg-card p-8">
              {subscribed ? (
                <div className="text-center">
                  <div className="text-green-600 font-semibold mb-2">
                    ✓ Successfully subscribed!
                  </div>
                  <p className="text-muted-foreground">
                    Thank you for subscribing to our newsletter. You'll receive updates about our latest insights and cloud solutions.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="text-left">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2 text-left">
                    <input
                      type="checkbox"
                      id="newsletter-consent"
                      required
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="newsletter-consent" className="text-sm text-muted-foreground">
                      Yes, subscribe me to your newsletter.
                    </Label>
                  </div>
                  
                  <Button type="submit" size="lg" className="w-full">
                    Subscribe
                  </Button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}