import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { blogArticles } from "@/lib/blog";

export default function Article() {
  const { slug } = useParams();
  const article = blogArticles.find((entry) => entry.slug === slug);

  if (!article) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Article not found</h1>
            <p className="text-muted-foreground mb-6">
              The article you are looking for may have been moved or renamed.
            </p>
            <Link to="/blog">
              <Button>Browse the journal</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const related = blogArticles.filter((entry) => entry.slug !== article.slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        <article className="container mx-auto max-w-4xl px-4 md:px-8 py-12 md:py-16">
          <Link
            to="/blog"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to journal
          </Link>

          <p className="text-sm text-primary font-semibold uppercase tracking-wide">
            {article.category} · {article.readTime}
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mt-3 mb-4">{article.title}</h1>
          <p className="text-sm text-muted-foreground mb-8">{article.date}</p>

          <img
            src={article.image}
            alt={article.title}
            className="w-full max-h-[460px] object-cover rounded-xl mb-10"
          />

          <div className="max-w-3xl space-y-6 text-lg leading-8 text-muted-foreground">
            {article.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-12 p-6 bg-muted/50 border border-border rounded-xl">
            <p className="font-semibold mb-2">Ready to put this into practice?</p>
            <p className="text-sm text-muted-foreground mb-4">
              Browse the collection and compare measurements on every product page.
            </p>
            <Link to="/shop">
              <Button>
                Explore eyewear
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </article>

        {/* Related articles */}
        <section className="border-t border-border/50 bg-muted/30">
          <div className="container mx-auto max-w-7xl px-4 md:px-8 py-12">
            <h2 className="text-2xl font-bold mb-6">Keep reading</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {related.map((entry) => (
                <Link
                  key={entry.slug}
                  to={`/article/${entry.slug}`}
                  className="group rounded-xl border border-border bg-card overflow-hidden hover:border-primary/50 transition-colors"
                >
                  <img
                    src={entry.image}
                    alt={entry.title}
                    className="aspect-video w-full object-cover"
                  />
                  <div className="p-5">
                    <p className="text-xs text-primary font-semibold uppercase tracking-wide">
                      {entry.category}
                    </p>
                    <h3 className="font-bold mt-2 group-hover:text-primary transition-colors">
                      {entry.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-2">{entry.readTime}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
