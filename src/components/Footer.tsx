"use client";

import Link from "next/link";
import { LinkedinIcon, InstagramIcon, MailIcon, PhoneIcon } from "lucide-react";

const footerLinks = {
  company: [
    { name: "Home", href: "/" },
    { name: "Solutions", href: "/solutions" },
    { name: "About", href: "/about" },
    { name: "Insights", href: "/insights" },
    { name: "Contact", href: "/contact" },
    { name: "Jobs", href: "/jobs" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Terms of Service", href: "/terms" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-4">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <span className="text-2xl font-bold bg-gradient-to-r from-foreground via-muted-foreground to-foreground bg-clip-text text-transparent">
                CODEX STUDIOS
              </span>
            </Link>
            <p className="text-muted-foreground mb-6 max-w-md">
              Your partner in the cloud. Comprehensive cloud infrastructure services, 
              agile innovation, and staffing solutions since 2020.
            </p>
            
            <div className="space-y-2 text-sm text-muted-foreground">
              <div>20 S Charles St Ste 403 #857</div>
              <div>Baltimore, Maryland 21201 US</div>
              <div className="flex items-center space-x-2 mt-4">
                <MailIcon className="h-4 w-4" />
                <a href="mailto:info@codexxstudios.com" className="hover:text-foreground transition-colors">
                  info@codexxstudios.com
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <PhoneIcon className="h-4 w-4" />
                <a href="tel:(301)674-2624" className="hover:text-foreground transition-colors">
                  (301) 674-2624
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            
            {/* Social Links */}
            <div className="mt-8">
              <h3 className="font-semibold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a
                  href="https://www.linkedin.com/company/codexstudios-io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <LinkedinIcon className="h-5 w-5" />
                </a>
                <a
                  href="https://www.instagram.com/wixstudio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <InstagramIcon className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © 2020 by CODEX STUDIOS. Made with 🖤
          </p>
        </div>
      </div>
    </footer>
  );
}