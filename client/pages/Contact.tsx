import { useState } from "react";
import { Clock, Mail, MapPin, Phone, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { toast } from "sonner";

const topics = [
  { value: "product", label: "Product question" },
  { value: "order", label: "Existing order" },
  { value: "returns", label: "Returns & exchanges" },
  { value: "fit", label: "Fit & sizing help" },
  { value: "other", label: "Something else" },
];

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    topic: "",
    orderNumber: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    // Simulate request latency so the UX matches a real submission flow.
    await new Promise((resolve) => setTimeout(resolve, 600));
    setSubmitting(false);
    setForm({ name: "", email: "", topic: "", orderNumber: "", message: "" });
    toast.success("Message sent! Our team will reply within one business day.");
  };

  const isFormValid =
    form.name.trim() && form.email.trim() && form.topic && form.message.trim();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="bg-gradient-to-br from-primary/10 via-background to-accent/5">
          <div className="container mx-auto max-w-7xl px-4 md:px-8 py-16 md:py-20">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
              <p className="text-lg text-muted-foreground">
                Product questions, fit guidance, or order support — our team is happy to help.
              </p>
            </div>
          </div>
        </section>

        <div className="container mx-auto max-w-7xl px-4 md:px-8 py-12 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact form */}
            <div className="lg:col-span-2">
              <form
                onSubmit={handleSubmit}
                className="bg-card border border-border rounded-xl p-6 md:p-8 space-y-5"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="contact-name">Full name</Label>
                    <Input
                      id="contact-name"
                      value={form.name}
                      onChange={(event) => updateField("name", event.target.value)}
                      placeholder="Jane Smith"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="contact-email">Email</Label>
                    <Input
                      id="contact-email"
                      type="email"
                      value={form.email}
                      onChange={(event) => updateField("email", event.target.value)}
                      placeholder="jane@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="contact-topic">Topic</Label>
                    <Select value={form.topic} onValueChange={(value) => updateField("topic", value)}>
                      <SelectTrigger id="contact-topic">
                        <SelectValue placeholder="Choose a topic" />
                      </SelectTrigger>
                      <SelectContent>
                        {topics.map((topic) => (
                          <SelectItem key={topic.value} value={topic.value}>
                            {topic.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="contact-order">Order number (optional)</Label>
                    <Input
                      id="contact-order"
                      value={form.orderNumber}
                      onChange={(event) => updateField("orderNumber", event.target.value)}
                      placeholder="e.g. ORD-10234"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="contact-message">Message</Label>
                  <Textarea
                    id="contact-message"
                    value={form.message}
                    onChange={(event) => updateField("message", event.target.value)}
                    placeholder="Tell us how we can help..."
                    rows={6}
                    required
                  />
                </div>

                <Button type="submit" size="lg" disabled={!isFormValid || submitting}>
                  <Send className="mr-2 w-4 h-4" />
                  {submitting ? "Sending..." : "Send message"}
                </Button>
              </form>
            </div>

            {/* Contact info sidebar */}
            <div className="space-y-4">
              <div className="bg-card border border-border rounded-xl p-6 space-y-5">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-sm">Email support</p>
                    <a
                      href="mailto:support@optics.com"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      support@optics.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-sm">Phone support</p>
                    <a
                      href="tel:18006784271"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      1-800-OPTICS-1
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-sm">Hours</p>
                    <p className="text-sm text-muted-foreground">
                      Mon–Fri, 9:00 AM–5:00 PM ET
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-sm">Visit us</p>
                    <p className="text-sm text-muted-foreground">
                      123 Vision Street
                      <br />
                      New York, NY 10001
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
                <p className="font-semibold text-sm mb-2">Order questions?</p>
                <p className="text-sm text-muted-foreground">
                  Include your order number so we can pull up the details faster. You can find it
                  in your order history.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
