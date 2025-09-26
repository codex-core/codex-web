import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Target, Award, Globe } from "lucide-react";
import Link from "next/link";

const values = [
  {
    icon: Target,
    title: "Innovation",
    description: "We stay at the forefront of cloud technology, continuously exploring new solutions and methodologies to deliver cutting-edge services to our clients."
  },
  {
    icon: Users,
    title: "Partnership",
    description: "We believe in building long-term partnerships with our clients, working closely together to understand their unique needs and deliver tailored solutions."
  },
  {
    icon: Award,
    title: "Excellence",
    description: "We are committed to delivering exceptional quality in everything we do, from initial consultation to ongoing support and maintenance."
  },
  {
    icon: Globe,
    title: "Global Impact",
    description: "Our solutions help businesses across the globe transform their operations and achieve greater success through cloud technology."
  }
];

const team = [
  {
    name: "Leadership Team",
    description: "Our experienced leadership team brings decades of combined experience in cloud computing, enterprise architecture, and business transformation."
  },
  {
    name: "Cloud Architects",
    description: "Expert cloud architects who design and implement scalable, secure, and cost-effective cloud solutions tailored to your business needs."
  },
  {
    name: "DevOps Engineers",
    description: "Skilled DevOps engineers who ensure smooth deployment, monitoring, and maintenance of your cloud infrastructure and applications."
  },
  {
    name: "Consultants",
    description: "Strategic consultants who work closely with you to understand your business objectives and translate them into actionable cloud strategies."
  }
];

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 lg:pt-32 lg:pb-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              About{" "}
              <span className="bg-gradient-to-r from-foreground via-muted-foreground to-foreground bg-clip-text text-transparent">
                Codex Studios
              </span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
              Isn't it time for your business to reach its apex? Your greatest success is just around the corner.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="rounded-2xl border bg-card p-8 lg:p-12">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-8">
                Our Story
              </h2>
              
              <div className="prose prose-lg max-w-none text-muted-foreground">
                <p className="text-lg leading-relaxed mb-6">
                  Codex Studios was founded in 2020, and since then, we've been busy harnessing the power of cloud 
                  to bring about transformative, ground-breaking solutions to businesses across the globe. We're all 
                  about making the cloud work for you, not the other way around.
                </p>
                
                <p className="text-lg leading-relaxed mb-6">
                  Say goodbye to mystifying jargon, complex systems, and underutilized resources - we're here to make 
                  your cloud journey as breezy as a walk in the park. Our team of experienced professionals combines 
                  deep technical expertise with a genuine passion for helping businesses succeed.
                </p>
                
                <p className="text-lg leading-relaxed">
                  From small startups to large enterprises, we've helped organizations across various industries 
                  leverage cloud technology to improve efficiency, reduce costs, and drive innovation. Our approach 
                  is always collaborative, transparent, and focused on delivering measurable results.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 lg:py-32 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Our Values
              </h2>
              <p className="mt-6 text-lg text-muted-foreground">
                The principles that guide everything we do
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {values.map((value) => (
                <div
                  key={value.title}
                  className="rounded-2xl border bg-card p-6 text-center transition-all hover:shadow-lg"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mx-auto">
                    <value.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold">{value.title}</h3>
                  <p className="mt-4 text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Our Team
              </h2>
              <p className="mt-6 text-lg text-muted-foreground">
                Meet the experts who make cloud transformation possible
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              {team.map((member) => (
                <div
                  key={member.name}
                  className="rounded-2xl border bg-card p-8 transition-all hover:shadow-lg"
                >
                  <h3 className="text-xl font-semibold mb-4">{member.name}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {member.description}
                  </p>
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
              Ready to Work Together?
            </h2>
            <p className="mt-6 text-lg text-muted-foreground">
              Let's discuss how we can help your business reach new heights with our cloud solutions.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="h-12 px-8">
                <Link href="/contact">
                  Get In Touch
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild size="lg" className="h-12 px-8">
                <Link href="/solutions">
                  View Our Solutions
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