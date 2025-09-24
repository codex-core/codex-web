import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Target, Zap, Cloud, Shield, Database, Cog } from "lucide-react";
import Link from "next/link";

const services = [
  {
    icon: Target,
    title: "Cloud Strategy & Planning",
    description: "Comprehensive cloud strategy development tailored to your business needs. We help you plan your cloud journey from initial assessment to implementation roadmap.",
    features: ["Cloud readiness assessment", "Migration planning", "Cost optimization strategy", "Risk assessment"]
  },
  {
    icon: Zap,
    title: "Cloud Migration Services",
    description: "Seamless migration of your applications and data to the cloud with minimal downtime and maximum efficiency.",
    features: ["Application migration", "Data migration", "Infrastructure migration", "Legacy system modernization"]
  },
  {
    icon: Cloud,
    title: "Infrastructure as Code",
    description: "Automate your infrastructure deployment and management with Infrastructure as Code practices and tools.",
    features: ["Terraform implementation", "AWS CloudFormation", "Azure ARM templates", "Automation pipelines"]
  },
  {
    icon: Shield,
    title: "Cloud Security & Compliance",
    description: "Ensure your cloud infrastructure meets the highest security standards and compliance requirements.",
    features: ["Security assessments", "Compliance auditing", "Identity management", "Data protection"]
  },
  {
    icon: Database,
    title: "Data & Analytics",
    description: "Unlock the power of your data with cloud-native analytics and data management solutions.",
    features: ["Data lake implementation", "Analytics platforms", "Business intelligence", "Machine learning"]
  },
  {
    icon: Cog,
    title: "DevOps & Site Reliability",
    description: "Implement DevOps practices and ensure your applications run reliably at scale.",
    features: ["CI/CD pipelines", "Monitoring & alerting", "Performance optimization", "Incident response"]
  }
];

export default function Solutions() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 lg:pt-32 lg:pb-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              Our{" "}
              <span className="bg-gradient-to-r from-foreground via-muted-foreground to-foreground bg-clip-text text-transparent">
                Solutions
              </span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
              Comprehensive cloud solutions designed to transform your business operations, 
              improve efficiency, and drive innovation through cutting-edge technology.
            </p>
            <div className="mt-10">
              <Button asChild size="lg" className="h-12 px-8">
                <Link href="/contact">
                  Get Started Today
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service, index) => (
                <div
                  key={service.title}
                  className="rounded-2xl border bg-card p-8 transition-all hover:shadow-lg"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <service.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold">{service.title}</h3>
                  <p className="mt-4 text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                  <ul className="mt-6 space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <div className="flex-shrink-0 w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-3" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to Transform Your Business?
            </h2>
            <p className="mt-6 text-lg text-muted-foreground">
              Let's discuss how our cloud solutions can help you achieve your business goals. 
              Schedule a free consultation with our experts today.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="h-12 px-8">
                <Link href="/contact">
                  Schedule Free Consultation
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild size="lg" className="h-12 px-8">
                <Link href="/about">
                  Learn More About Us
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}