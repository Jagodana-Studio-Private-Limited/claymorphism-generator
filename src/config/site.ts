export const siteConfig = {
  name: "Claymorphism Generator",
  title: "Claymorphism Generator — Free CSS Clay Effect Tool",
  description:
    "Generate beautiful claymorphism CSS effects instantly. Customize colors, shadows, and border radius to create soft 3D clay-like UI elements. Copy the CSS with one click.",
  url: "https://claymorphism-generator.tools.jagodana.com",
  ogImage: "/opengraph-image",

  headerIcon: "Layers",
  brandAccentColor: "#ec4899",

  keywords: [
    "claymorphism generator",
    "clay morphism CSS",
    "CSS clay effect",
    "clay UI design",
    "claymorphism tool",
    "CSS box shadow generator",
    "clay CSS generator",
    "3D clay button CSS",
    "neumorphism vs claymorphism",
    "soft UI CSS",
  ],
  applicationCategory: "DesignApplication",

  themeColor: "#a855f7",

  creator: "Jagodana",
  creatorUrl: "https://jagodana.com",
  twitterHandle: "@jagodana",

  socialProfiles: [
    "https://twitter.com/jagodana",
  ],

  links: {
    github:
      "https://github.com/Jagodana-Studio-Private-Limited/claymorphism-generator",
    website: "https://jagodana.com",
  },

  footer: {
    about:
      "Claymorphism Generator helps designers and developers create trendy clay-style UI elements with multi-layered box shadows. Free, no login required.",
    featuresTitle: "Features",
    features: [
      "Real-time preview",
      "Multi-layer shadow control",
      "Color presets",
      "One-click CSS copy",
    ],
  },

  hero: {
    badge: "Free CSS Design Tool",
    titleLine1: "Create Stunning",
    titleGradient: "Clay UI Effects",
    subtitle:
      "Generate soft, puffy claymorphism CSS with multi-layered shadows in seconds. Customize colors, border radius, and shadow depth — then copy the CSS.",
  },

  featureCards: [
    {
      icon: "🎨",
      title: "Live Preview",
      description:
        "See your claymorphism effect update in real-time as you adjust every parameter.",
    },
    {
      icon: "🌈",
      title: "Color Presets",
      description:
        "Start with beautiful preset palettes or pick your own custom colors instantly.",
    },
    {
      icon: "📋",
      title: "Copy CSS Instantly",
      description:
        "Get clean, production-ready CSS code you can paste directly into your project.",
    },
  ],

  relatedTools: [
    {
      name: "Box Shadow Generator",
      url: "https://box-shadow-generator.tools.jagodana.com",
      icon: "🌑",
      description: "Build complex CSS box shadows with a visual editor.",
    },
    {
      name: "Glassmorphism Generator",
      url: "https://glassmorphism-generator.tools.jagodana.com",
      icon: "🪟",
      description: "Generate frosted-glass CSS backdrop-filter effects.",
    },
    {
      name: "Neumorphism Generator",
      url: "https://neumorphism-generator.tools.jagodana.com",
      icon: "⬜",
      description: "Create soft UI neumorphism effects with CSS shadows.",
    },
    {
      name: "CSS Gradient Generator",
      url: "https://css-gradient-generator.tools.jagodana.com",
      icon: "🎆",
      description: "Generate beautiful CSS gradients for backgrounds.",
    },
    {
      name: "Border Radius Generator",
      url: "https://border-radius-generator.tools.jagodana.com",
      icon: "🔲",
      description: "Craft custom border-radius CSS shapes visually.",
    },
    {
      name: "CSS Button Generator",
      url: "https://css-button-generator.tools.jagodana.com",
      icon: "🔘",
      description: "Design and export custom CSS button styles.",
    },
  ],

  howToSteps: [
    {
      name: "Pick a Preset or Color",
      text: "Choose a built-in color preset or pick your own background color for the clay element.",
      url: "",
    },
    {
      name: "Adjust Shadow Settings",
      text: "Tune the shadow blur, size, depth, and inner highlight to get the clay depth you want.",
      url: "",
    },
    {
      name: "Copy the CSS",
      text: "Click 'Copy CSS' to copy the complete box-shadow and border-radius CSS to your clipboard.",
      url: "",
    },
  ],
  howToTotalTime: "PT1M",

  faq: [
    {
      question: "What is claymorphism in CSS?",
      answer:
        "Claymorphism is a UI design trend that makes interface elements look like soft, puffy 3D clay objects. It uses bright saturated colors, large border radii, and multi-layered box shadows — typically a dark drop shadow and a light inner highlight — to create the 3D clay illusion.",
    },
    {
      question: "How do I create a claymorphism effect in CSS?",
      answer:
        "A claymorphism effect uses the CSS box-shadow property with multiple layers: a bottom-right dark shadow, a top-left light shadow, and an inset inner glow. Combined with a large border-radius and a bright background color, this creates the characteristic soft clay look. This generator builds the CSS for you instantly.",
    },
    {
      question: "Is claymorphism different from neumorphism?",
      answer:
        "Yes. Neumorphism uses muted, near-background colors with subtle extruded shadows for a soft embossed look. Claymorphism uses bright, saturated colors with bolder multi-layered shadows to make elements appear like inflated 3D clay objects. Claymorphism is generally more colorful and visually pop.",
    },
    {
      question: "What CSS properties does claymorphism use?",
      answer:
        "Claymorphism relies on: background-color (bright, saturated), border-radius (large, e.g. 20–40px), and box-shadow (multiple layers — dark outer shadow + light outer highlight + optional inset highlight). No special CSS features are required, making it universally supported.",
    },
    {
      question: "Is this claymorphism CSS generator free?",
      answer:
        "Yes, completely free. No login or account required. Adjust the controls, preview the effect, and copy the CSS directly into your project.",
    },
  ],

  pages: {
    "/": {
      title: "Claymorphism Generator — Free CSS Clay Effect Tool",
      description:
        "Generate beautiful claymorphism CSS effects instantly. Customize colors, shadows, and border radius to create soft 3D clay-like UI elements.",
      changeFrequency: "weekly" as const,
      priority: 1,
    },
  },
} as const;

export type SiteConfig = typeof siteConfig;
