import Link from "next/link";

export function FooterSection() {
  return (
    <footer className="bg-muted/20 border-t py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center space-y-8 text-center">
          {/* Big Text branding */}
          <h2 className="text-5xl font-extrabold tracking-tighter opacity-10 md:text-7xl">
            Culm LMS
          </h2>

          <div className="mt-8 grid w-full max-w-4xl grid-cols-2 gap-8 text-left md:grid-cols-4">
            <div className="space-y-3">
              <h4 className="text-lg font-semibold">Platform</h4>
              <ul className="text-muted-foreground space-y-2 text-sm">
                <li>
                  <Link
                    href="/courses"
                    className="hover:text-primary transition-colors"
                  >
                    Courses
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pricing"
                    className="hover:text-primary transition-colors"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="/features"
                    className="hover:text-primary transition-colors"
                  >
                    Features
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="text-lg font-semibold">Resources</h4>
              <ul className="text-muted-foreground space-y-2 text-sm">
                <li>
                  <Link
                    href="/blog"
                    className="hover:text-primary transition-colors"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/help"
                    className="hover:text-primary transition-colors"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    href="/community"
                    className="hover:text-primary transition-colors"
                  >
                    Community
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="text-lg font-semibold">Company</h4>
              <ul className="text-muted-foreground space-y-2 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="hover:text-primary transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/careers"
                    className="hover:text-primary transition-colors"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-primary transition-colors"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="text-lg font-semibold">Legal</h4>
              <ul className="text-muted-foreground space-y-2 text-sm">
                <li>
                  <Link
                    href="/privacy"
                    className="hover:text-primary transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="hover:text-primary transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="text-muted-foreground mt-8 flex w-full max-w-4xl flex-col items-center justify-between border-t pt-8 text-sm md:flex-row">
            <p>© {new Date().getFullYear()} Culm LMS. All rights reserved.</p>
            <div className="mt-4 flex space-x-4 md:mt-0">
              <Link href="#" className="hover:text-primary transition-colors">
                Twitter
              </Link>
              <Link href="#" className="hover:text-primary transition-colors">
                GitHub
              </Link>
              <Link href="#" className="hover:text-primary transition-colors">
                Discord
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
