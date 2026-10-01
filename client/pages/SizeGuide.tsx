import { Link } from "react-router-dom";
import { ArrowRight, Glasses, Ruler } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const measurements = [
  {
    title: "Lens width",
    description:
      "The horizontal width of one lens, measured in millimeters. Most frames range from 40–62mm. Compare it with a pair you already find comfortable.",
  },
  {
    title: "Bridge width",
    description:
      "The space between the lenses that rests on your nose, usually 14–24mm. A well-fitting bridge keeps frames in place without pinching or sliding.",
  },
  {
    title: "Temple length",
    description:
      "The length of the arms from the hinge to the curve that rests behind your ear, typically 120–150mm. Temples should feel secure without pressing.",
  },
  {
    title: "Frame width",
    description:
      "The total horizontal width of the frame at its widest point. It should roughly match the width of your face — no wider than your temples.",
  },
];

const sizeTable = [
  { size: "Small", lens: "50mm and below", bridge: "18mm and below", temple: "135mm and below", face: "Narrow" },
  { size: "Medium", lens: "51–55mm", bridge: "19–21mm", temple: "136–145mm", face: "Average" },
  { size: "Large", lens: "56mm and above", bridge: "22mm and above", temple: "146mm and above", face: "Wide" },
];

const whereToFind = [
  "Most glasses have these numbers printed on the inside of the temple arm, like: 52 □ 18 140.",
  "52 is the lens width in millimeters, 18 is the bridge width, and 140 is the temple length.",
  "If the numbers are worn off, measure your current glasses with a ruler in millimeters.",
];

export default function SizeGuide() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-accent/5">
          <div className="container mx-auto max-w-7xl px-4 md:px-8 py-16 md:py-20">
            <div className="max-w-3xl">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <Ruler className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Frame Size Guide</h1>
              <p className="text-lg text-muted-foreground">
                A few measurements can make it much easier to compare frame fit before you order.
              </p>
            </div>
          </div>
        </section>

        {/* Measurements */}
        <section className="container mx-auto max-w-7xl px-4 md:px-8 py-16">
          <h2 className="text-3xl font-bold mb-3">Know your measurements</h2>
          <p className="text-muted-foreground mb-10 max-w-2xl">
            Eyewear sizes use three numbers, in millimeters. Here is what each one means.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {measurements.map((item) => (
              <div
                key={item.title}
                className="bg-card border border-border rounded-xl p-6 hover:border-primary/40 transition-colors"
              >
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-6">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Size table */}
        <section className="bg-muted/30 border-y border-border/50">
          <div className="container mx-auto max-w-7xl px-4 md:px-8 py-16">
            <h2 className="text-3xl font-bold mb-3">Quick reference</h2>
            <p className="text-muted-foreground mb-8">
              Typical ranges by frame size. Individual products may vary slightly.
            </p>
            <div className="bg-card border border-border rounded-xl overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Frame size</TableHead>
                    <TableHead>Lens width</TableHead>
                    <TableHead>Bridge width</TableHead>
                    <TableHead>Temple length</TableHead>
                    <TableHead>Best for</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sizeTable.map((row) => (
                    <TableRow key={row.size}>
                      <TableCell className="font-semibold">{row.size}</TableCell>
                      <TableCell>{row.lens}</TableCell>
                      <TableCell>{row.bridge}</TableCell>
                      <TableCell>{row.temple}</TableCell>
                      <TableCell>{row.face}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </section>

        {/* Where to find your numbers */}
        <section className="container mx-auto max-w-7xl px-4 md:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div>
              <h2 className="text-3xl font-bold mb-3">Where to find your numbers</h2>
              <ul className="space-y-4 mt-6">
                {whereToFind.map((tip) => (
                  <li key={tip} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <p className="text-muted-foreground leading-7">{tip}</p>
                  </li>
                ))}
              </ul>
              <div className="mt-8 p-5 bg-primary/5 border border-primary/20 rounded-xl">
                <p className="font-semibold text-sm mb-1">Between sizes?</p>
                <p className="text-sm text-muted-foreground">
                  When in doubt, size up for comfort or contact our team — we are happy to compare
                  a specific product with your current measurements.
                </p>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden bg-muted aspect-[4/3]">
              <img
                src="https://images.unsplash.com/photo-1559056199-641a0ac8b3f2?w=800&h=600&fit=crop"
                alt="Frame measurements demonstration"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="container mx-auto max-w-7xl px-4 md:px-8 pb-20">
          <div className="rounded-2xl bg-primary text-primary-foreground p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary-foreground/10 flex items-center justify-center flex-shrink-0">
                <Glasses className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-1">Ready to find your fit?</h2>
                <p className="text-primary-foreground/80">
                  Every product page lists its measurements in the specifications tab.
                </p>
              </div>
            </div>
            <Link to="/shop" className="flex-shrink-0">
              <Button
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90"
              >
                Browse frames
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
