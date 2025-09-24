"use client";

import { Building2, Landmark, Truck, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";

const industries = [
  {
    icon: Building2,
    title: "Infrastructure",
    description: "Our team of experts will work with you to understand your unique business needs and develop a customized solution that meets your specific requirements. Whether you need to migrate your existing infrastructure to the cloud or want to leverage the latest cloud technologies."
  },
  {
    icon: Landmark,
    title: "Government",
    description: "Our team of experienced consultants offers government cloud solutions that are tailored to meet the needs of your organization. We work with you every step of the way to ensure that your cloud journey is smooth and successful."
  },
  {
    icon: Landmark,
    title: "Banking",
    description: "Our innovative solutions have been developed specifically with banking clients in mind, and we have a track record of delivering exceptional results. From security to compliance, we'll ensure that your cloud banking needs are fully met."
  },
  {
    icon: Truck,
    title: "Logistics",
    description: "Making it simple for your business to grow and thrive in today's increasingly competitive online marketplace. With our advanced cloud-based technology and comprehensive support services, your business can operate more efficiently and effectively than ever before."
  },
  {
    icon: ShoppingCart,
    title: "E-commerce",
    description: "We specialize in providing e-commerce cloud solutions to businesses of all sizes. Our team of experts is dedicated to helping your business succeed in the digital world. With our help, you can streamline your processes."
  }
];

export default function Industries() {
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
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                Industries
              </span>
            </h2>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              We serve diverse industries with tailored cloud solutions that meet specific sector requirements and challenges.
            </p>
          </motion.div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {industries.map((industry, index) => (
              <motion.div
                key={industry.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="rounded-2xl border bg-card p-8 transition-all hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <industry.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-6 text-xl font-semibold">{industry.title}</h3>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  {industry.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}