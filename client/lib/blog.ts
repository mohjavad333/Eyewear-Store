export interface BlogArticle {
  slug: string;
  title: string;
  category: string;
  date: string;
  image: string;
  excerpt: string;
  readTime: string;
  paragraphs: string[];
}

export const blogArticles: BlogArticle[] = [
  {
    slug: "choose-sunglasses",
    title: "How to Choose the Right Sunglasses",
    category: "Fit guide",
    date: "June 12, 2025",
    image:
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=900&h=560&fit=crop",
    excerpt:
      "Find a comfortable frame shape and understand the lens features that matter for everyday sun protection.",
    readTime: "4 min read",
    paragraphs: [
      "The right pair balances comfort, coverage, and your personal style. Start with a frame that feels secure without pinching at the temples or sliding down your nose.",
      "For everyday sun protection, look for lenses marked UV400 or 100% UVA/UVB protection. Lens tint and polarization affect glare and contrast, but a darker tint alone does not guarantee UV protection.",
      "Polarized lenses reduce reflected glare from water, roads, and car hoods, which makes them popular for driving and outdoor sports. If you spend most of your day in the city, a standard UV400 lens is usually enough.",
      "Try a few shapes and check that the frame width follows your face comfortably. Our size guide can help you compare frame width, bridge, and temple measurements before you order.",
    ],
  },
  {
    slug: "blue-light-lenses",
    title: "A Practical Guide to Blue-Light Lenses",
    category: "Lens guide",
    date: "June 5, 2025",
    image:
      "https://images.unsplash.com/photo-1508296695146-367ec3be0d35?w=900&h=560&fit=crop",
    excerpt:
      "Understand lens options, screen habits, and ways to find a comfortable setup for long days at the desk.",
    readTime: "5 min read",
    paragraphs: [
      "Blue-light filtering lenses are one option for people who spend long stretches in front of screens. Comfort also depends on regular breaks, lighting, screen distance, and an up-to-date prescription.",
      "A good first step costs nothing: follow the 20-20-20 rule. Every 20 minutes, look at something 20 feet away for 20 seconds. Many people find this alone reduces end-of-day eye strain.",
      "Lens features vary by product. Review the individual product details to see which lens options are listed, and consult an eye-care professional about persistent vision concerns.",
      "If you decide to try blue-light filtering lenses, start with a light filter. Heavy tints can distort color perception, which matters if you do design or photo work.",
    ],
  },
  {
    slug: "frame-care",
    title: "Keep Your Frames Looking Their Best",
    category: "Care",
    date: "May 28, 2025",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&h=560&fit=crop",
    excerpt:
      "Simple cleaning and storage habits help protect your frames and lenses for years of daily wear.",
    readTime: "3 min read",
    paragraphs: [
      "Rinse lenses before wiping so dust does not scratch the surface. Use a clean microfiber cloth and lens-safe cleaner rather than paper towels or household sprays.",
      "When you are not wearing your glasses, store them in a protective case. Leaving them lens-down on a table is the fastest way to collect scratches.",
      "Use both hands to take your glasses off to help keep the frame aligned. If they start to feel lopsided, most optical shops will adjust them for free.",
      "Avoid leaving frames on a hot car dashboard or in direct sunlight for extended periods — heat can warp acetate and damage lens coatings.",
    ],
  },
  {
    slug: "face-shape-guide",
    title: "Matching Frames to Your Face Shape",
    category: "Style",
    date: "May 15, 2025",
    image:
      "https://images.unsplash.com/photo-1559056199-641a0ac8b3f2?w=900&h=560&fit=crop",
    excerpt:
      "A quick framework for choosing frame shapes that complement round, square, oval, and heart-shaped faces.",
    readTime: "6 min read",
    paragraphs: [
      "Face shape is a starting point, not a rule — but it is a useful one. The general idea is contrast: angular frames balance round faces, and softer, rounded frames soften angular faces.",
      "Round faces tend to pair well with rectangular and angular frames, which add definition. Square faces suit round and oval frames that soften strong jawlines.",
      "Oval faces are the most flexible and can carry most shapes, from aviators to cat-eye styles. Heart-shaped faces often look balanced with bottom-heavy frames or rimless styles.",
      "The most important test is comfort and confidence. If a frame feels right and you keep reaching for it, that matters more than any chart.",
    ],
  },
  {
    slug: "polarized-vs-uv",
    title: "Polarized vs. UV Protection: What's the Difference?",
    category: "Lens guide",
    date: "April 30, 2025",
    image:
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=900&h=560&fit=crop",
    excerpt:
      "These two lens features get confused constantly. Here is what each one actually does for your eyes.",
    readTime: "4 min read",
    paragraphs: [
      "UV protection shields your eyes from ultraviolet radiation, the invisible part of sunlight that can damage eye tissue over time. It is a health feature, full stop.",
      "Polarization is a comfort feature. It cuts reflected glare from horizontal surfaces like water and pavement, improving clarity while driving or fishing.",
      "The two are independent: a lens can have both, either, or neither. Always check the product specs — dark lenses without UV protection can actually be worse than no sunglasses, because your pupils dilate and let in more UV.",
      "For everyday wear, we recommend UV400 as the non-negotiable baseline, with polarization as a worthwhile upgrade if you drive or spend time near water.",
    ],
  },
  {
    slug: "aviator-buying-guide",
    title: "The Aviator: A Buying Guide to a Classic",
    category: "Style",
    date: "April 18, 2025",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&h=560&fit=crop",
    excerpt:
      "From cockpit origins to modern materials — what to look for when buying aviator sunglasses.",
    readTime: "5 min read",
    paragraphs: [
      "Aviators were designed in the 1930s for pilots, which explains the teardrop shape: it was built to cover the full field of vision and block glare from every angle.",
      "Modern aviators vary widely. Classic metal frames with double bridges remain the most versatile, while flat-lens fashion versions trade some coverage for a contemporary look.",
      "Pay attention to nose pads — adjustable metal pads fit a much wider range of nose shapes than fixed acetate bridges, which matters because aviators are a larger frame.",
      "Finally, check the lens quality. A good aviator should have UV400 protection and optical-grade lenses; steep discounts on designer-branded styles are often a red flag for counterfeits.",
    ],
  },
];
