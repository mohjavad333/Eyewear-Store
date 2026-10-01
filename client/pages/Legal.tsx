import { Link, useLocation } from "react-router-dom";
import { ArrowRight, BookOpen, LockKeyhole, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type Section = { heading: string; body: string };

type LegalPage = {
  title: string;
  icon: typeof BookOpen;
  intro: string;
  updated: string;
  sections: Section[];
};

const pages: Record<string, LegalPage> = {
  "/privacy": {
    title: "Privacy Policy",
    icon: LockKeyhole,
    intro:
      "A plain-language overview of the account and shopping information used by this application.",
    updated: "Last updated: September 2026",
    sections: [
      {
        heading: "Information we collect",
        body: "When you create an account, Optics stores your name, email address, password hash, saved addresses, cart, wishlist, and order details. These records exist to provide account features and to fulfill your orders.",
      },
      {
        heading: "How we use information",
        body: "Your contact details are used for order confirmations and support replies. Browsing data such as cart and wishlist contents is used only to power your own shopping experience — we do not sell personal information.",
      },
      {
        heading: "Password security",
        body: "Passwords are stored as bcrypt hashes and are never returned by account APIs. Keep your password private and sign out on shared devices.",
      },
      {
        heading: "Payments",
        body: "Online payment processing is not integrated yet. The checkout payment form is a prototype; please do not enter real payment-card details.",
      },
      {
        heading: "Your choices",
        body: "You can update your profile and saved addresses at any time from the account page, or contact support to request removal of your account data.",
      },
    ],
  },
  "/terms": {
    title: "Terms & Conditions",
    icon: ShieldCheck,
    intro: "These store terms are provided as a customer-facing draft for this application.",
    updated: "Last updated: September 2026",
    sections: [
      {
        heading: "Using the store",
        body: "Optics provides a catalog of eyewear for personal, non-commercial purchase. You agree to provide accurate account information and to keep your sign-in credentials secure.",
      },
      {
        heading: "Product information",
        body: "Product descriptions, availability, prices, and promotional offers may change. The product and order records shown in your account are the source of truth for this storefront.",
      },
      {
        heading: "Orders and payment",
        body: "Checkout currently creates a demonstration order and does not charge a payment method. Do not enter real card details or treat an order as paid until a payment provider is integrated.",
      },
      {
        heading: "Returns",
        body: "Unworn frames in original packaging can be returned within 30 days of delivery. Contact support with your order number to start a return or exchange.",
      },
      {
        heading: "Liability",
        body: "Optics provides the storefront as-is. To the fullest extent permitted by law, our liability for any claim relating to a purchase is limited to the amount paid for the relevant order.",
      },
    ],
  },
  "/security": {
    title: "Account Security",
    icon: LockKeyhole,
    intro: "A few simple steps help protect your Optics account.",
    updated: "Last updated: September 2026",
    sections: [
      {
        heading: "Choose a unique password",
        body: "Use a password you do not reuse on other services. Optics stores passwords as bcrypt hashes, so no one at Optics can read your original password.",
      },
      {
        heading: "Protect your session",
        body: "Sign in creates a bearer token stored on your device. Sign out when using a shared device, and never share your account token or password with anyone.",
      },
      {
        heading: "Rate limiting and monitoring",
        body: "The store applies rate limits to sign-in, registration, and order creation to block automated abuse. Repeated failed attempts are temporarily throttled.",
      },
      {
        heading: "Report a concern",
        body: "If you believe your account is at risk, contact support and change your password anywhere else you may have reused it.",
      },
    ],
  },
  "/forgot-password": {
    title: "Password Help",
    icon: LockKeyhole,
    intro:
      "Email and password sign-in is available. Self-service password reset is not enabled for this app yet.",
    updated: "Last updated: September 2026",
    sections: [
      {
        heading: "Need help signing in?",
        body: "Contact support from the email address associated with your account. For security, do not send your password by email.",
      },
      {
        heading: "Reset coming soon",
        body: "Self-service password reset via email is planned. Until then, support can verify your identity and help restore access.",
      },
    ],
  },
  "/accessibility": {
    title: "Accessibility",
    icon: ShieldCheck,
    intro:
      "We want the Optics shopping experience to work for as many people as possible.",
    updated: "Last updated: September 2026",
    sections: [
      {
        heading: "Built-in accessibility",
        body: "The storefront supports keyboard navigation, labeled form fields, responsive layouts from mobile to desktop, and text alternatives for product imagery where available.",
      },
      {
        heading: "Contrast and readability",
        body: "Color themes follow accessible contrast targets, and interactive states such as focus rings are always visible for keyboard users.",
      },
      {
        heading: "Assistive technology",
        body: "Pages are built with semantic HTML and landmark regions so screen readers can navigate between the header, main content, and footer efficiently.",
      },
      {
        heading: "Need assistance?",
        body: "Contact support if a page or shopping task is difficult to use. Include the page and the assistive technology or browser involved, if you can.",
      },
    ],
  },
};

export default function Legal() {
  const location = useLocation();
  const page = pages[location.pathname];

  if (!page) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Page not found</h1>
            <Link to="/">
              <Button>Back to home</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const Icon = page.icon;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="bg-gradient-to-br from-primary/10 via-background to-accent/5">
          <div className="container mx-auto max-w-7xl px-4 md:px-8 py-16 md:py-20">
            <div className="max-w-3xl">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{page.title}</h1>
              <p className="text-lg text-muted-foreground">{page.intro}</p>
              <p className="text-sm text-muted-foreground/80 mt-4">{page.updated}</p>
            </div>
          </div>
        </section>

        <section className="container mx-auto max-w-4xl px-4 md:px-8 py-12 md:py-16">
          <div className="space-y-5">
            {page.sections.map((section) => (
              <section key={section.heading} className="rounded-xl border border-border bg-card p-6">
                <h2 className="text-xl font-bold mb-3">{section.heading}</h2>
                <p className="text-muted-foreground leading-7">{section.body}</p>
              </section>
            ))}
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link to="/contact">
              <Button variant="outline">
                Contact support
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link to="/">
              <Button variant="ghost">Back to home</Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
