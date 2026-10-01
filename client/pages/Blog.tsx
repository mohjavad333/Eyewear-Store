import { Link } from "react-router-dom";
import { ArrowRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { blogArticles } from "@/lib/blog";

export default function Blog() {
  const [featured, ...rest] = blogArticles;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-accent/5">
          <div className="container mx-auto max-w-7xl px-4 md:px-8 py-16 md:py-20">
            <div className="max-w-2xl">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">The Optics Journal</h1>
              <p className="text-lg text-muted-foreground">
                Practical advice for choosing, wearing, and caring for eyewear.
              </p>
            </div>
          </div>
        </section>

        {/* Featured article */}
        <section className="container mx-auto max-w-7xl px-4 md:px-8 py-12">
          <Link
            to={`/article/${featured.slug}`}
            className="group grid grid-cols-1 lg:grid-cols-2 gap-8 items-center rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/50 transition-colors"
          >
            <div className="aspect-video lg:aspect-[4/3] lg:h-full overflow-hidden">
              <img
                src={featured.image}
                alt={featured.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-6 md:p-10">
              <p className="text-xs text-primary font-semibold uppercase tracking-wide mb-3">
                Featured · {featured.category} · {featured.readTime}
              </p>
              <h2 className="text-2xl md:text-3xl font-bold mb-3 group-hover:text-primary transition-colors">
                {featured.title}
              </h2>
              <p className="text-muted-foreground leading-7 mb-6">{featured.excerpt}</p>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span>{featured.date}</span>
                <span className="inline-flex items-center text-primary font-semibold">
                  Read guide
                  <ArrowRight className="w-4 h-4 ml-2" />
                </span>
              </div>
            </div>
          </Link>
        </section>

        {/* Article grid */}
        <section className="container mx-auto max-w-7xl px-4 md:px-8 pb-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((entry) => (
              <Link
                key={entry.slug}
                to={`/article/${entry.slug}`}
                className="group rounded-xl border border-border overflow-hidden bg-card hover:border-primary/50 transition-colors flex flex-col"
              >
                <img
                  src={entry.image}
                  alt={entry.title}
                  className="aspect-video w-full object-cover"
                />
                <div className="p-5 flex flex-col flex-1">
                  <p className="text-xs text-primary font-semibold uppercase tracking-wide">
                    {entry.category} · {entry.readTime}
                  </p>
                  <h2 className="text-xl font-bold mt-2 group-hover:text-primary transition-colors">
                    {entry.title}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-2 flex-1">{entry.excerpt}</p>
                  <div className="flex items-center justify-between mt-4 text-sm">
                    <span className="text-muted-foreground">{entry.date}</span>
                    <span className="inline-flex items-center text-primary font-semibold">
                      Read
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
