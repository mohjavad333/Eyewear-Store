import { Link } from "react-router-dom";
import { ArrowRight, Check, Glasses, Heart, Leaf, Package, Sparkles, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const values = [
  {
    icon: Sparkles,
    title: "Curated selection",
    description:
      "Every frame is chosen for build quality, comfort, and everyday wearability — no overwhelming walls of near-identical products.",
  },
  {
    icon: Leaf,
    title: "Considered materials",
    description:
      "We favor acetate, titanium, and lightweight alloys that hold their shape and feel good through long days.",
  },
  {
    icon: Heart,
    title: "Honest guidance",
    description:
      "Clear product specs, a practical size guide, and support from real people when you need a second opinion.",
  },
  {
    icon: Package,
    title: "Safe delivery",
    description:
      "Frames ship in protective cases with secure packaging, and every order includes 30-day returns.",
  },
];

const milestones = [
  { year: "2019", text: "Optics started as a small kiosk helping locals find comfortable frames." },
  { year: "2021", text: "We moved online, adding detailed measurements to every product page." },
  { year: "2023", text: "Our blue-light and sports collections launched after months of lens testing." },
  { year: "2025", text: "Over 5,000 happy customers and counting — thank you for your trust." },
];

export default function About() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-accent/5">
          <div className="container mx-auto max-w-7xl px-4 md:px-8 py-16 md:py-24">
            <div className="max-w-3xl">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <Glasses className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">About Optics</h1>
              <p className="text-lg text-muted-foreground mb-6">
                Thoughtful eyewear, carefully chosen for everyday life. We started Optics with a
                simple belief: buying glasses should be as clear as the view through them.
              </p>
              <div className="flex flex-wrap gap-4 text-sm">
                {["5,000+ Happy Customers", "30-Day Returns", "Certified Sellers"].map((badge) => (
                  <div key={badge} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-success" />
                    <span>{badge}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="container mx-auto max-w-7xl px-4 md:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Our story</h2>
              <div className="space-y-4 text-muted-foreground leading-7">
                <p>
                  Optics began with a frustrating shopping trip: walls of frames, no measurements,
                  and no one who could explain the difference between lens coatings. We thought
                  buying something you wear every day deserves better.
                </p>
                <p>
                  Today we combine a curated catalog with practical tools — a frame size guide,
                  honest specifications, and category collections built around how people actually
                  wear glasses: sun protection, screen time, sports, and everyday style.
                </p>
                <p>
                  Whether you are replacing a beloved pair or trying a new shape for the first
                  time, our team is here to help you find a frame that fits your face and your
                  life.
                </p>
              </div>
              <Link to="/shop" className="inline-flex mt-8">
                <Button>
                  Explore our collection
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
            <div className="rounded-2xl overflow-hidden bg-muted aspect-[4/3]">
              <img
                src="https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&h=600&fit=crop"
                alt="Optics store display of eyewear"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="bg-muted/30 border-y border-border/50">
          <div className="container mx-auto max-w-7xl px-4 md:px-8 py-16">
            <div className="max-w-2xl mb-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-3">What we stand for</h2>
              <p className="text-muted-foreground">
                Four principles guide how we pick products and serve customers.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value) => {
                const Icon = value.icon;
                return (
                  <div
                    key={value.title}
                    className="bg-card border border-border rounded-xl p-6 hover:border-primary/40 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground leading-6">{value.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="container mx-auto max-w-7xl px-4 md:px-8 py-16">
          <div className="max-w-2xl mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Milestones</h2>
            <p className="text-muted-foreground">A few moments that shaped the store.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {milestones.map((milestone) => (
              <div key={milestone.year} className="border-l-2 border-primary/30 pl-5">
                <p className="text-2xl font-bold text-primary mb-2">{milestone.year}</p>
                <p className="text-sm text-muted-foreground leading-6">{milestone.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Team CTA */}
        <section className="container mx-auto max-w-7xl px-4 md:px-8 pb-20">
          <div className="rounded-2xl border border-border bg-card p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-1">Questions? Talk to a real person.</h2>
                <p className="text-muted-foreground">
                  Our support team can help with fit, lenses, and orders.
                </p>
              </div>
            </div>
            <Link to="/contact" className="flex-shrink-0">
              <Button variant="outline" size="lg">
                Contact us
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
