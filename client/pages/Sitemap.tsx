import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const groups: { title: string; links: [string, string][] }[] = [
  {
    title: "Shop",
    links: [
      ["All eyewear", "/shop"],
      ["Categories", "/categories"],
      ["Sunglasses", "/categories/sunglasses"],
      ["Eyeglasses", "/categories/eyeglasses"],
      ["Blue light", "/categories/blue-light"],
      ["Sports", "/categories/sports"],
      ["Sale", "/sale"],
      ["Search", "/search"],
    ],
  },
  {
    title: "Account",
    links: [
      ["Sign in", "/login"],
      ["Create account", "/register"],
      ["Profile", "/profile"],
      ["Orders", "/orders"],
      ["Cart", "/cart"],
      ["Wishlist", "/wishlist"],
      ["Checkout", "/checkout"],
    ],
  },
  {
    title: "Journal",
    links: [
      ["Blog home", "/blog"],
      ["Choosing sunglasses", "/article/choose-sunglasses"],
      ["Blue-light lenses", "/article/blue-light-lenses"],
      ["Frame care", "/article/frame-care"],
      ["Face shape guide", "/article/face-shape-guide"],
      ["Polarized vs. UV", "/article/polarized-vs-uv"],
      ["Aviator guide", "/article/aviator-buying-guide"],
    ],
  },
  {
    title: "Help & information",
    links: [
      ["Contact", "/contact"],
      ["About Optics", "/about"],
      ["Size guide", "/size-guide"],
      ["Privacy", "/privacy"],
      ["Terms", "/terms"],
      ["Accessibility", "/accessibility"],
      ["Security", "/security"],
    ],
  },
];

export default function Sitemap() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="bg-gradient-to-br from-primary/10 via-background to-accent/5">
          <div className="container mx-auto max-w-7xl px-4 md:px-8 py-16 md:py-20">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Store directory</h1>
              <p className="text-lg text-muted-foreground">
                Every public page on Optics, organized by section.
              </p>
            </div>
          </div>
        </section>

        <section className="container mx-auto max-w-5xl px-4 md:px-8 py-12 md:py-16">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {groups.map((group) => (
              <section key={group.title}>
                <h2 className="font-bold text-xl mb-3">{group.title}</h2>
                <ul className="space-y-2">
                  {group.links.map(([label, href]) => (
                    <li key={href}>
                      <Link
                        className="text-muted-foreground hover:text-primary transition-colors"
                        to={href}
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
