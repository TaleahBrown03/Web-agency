// Single source of truth for pricing + contact info, shared across
// Services.astro, ContactForm.astro, and LiveDemos.astro so they can't drift out of sync.

export const PHONE_DISPLAY = "(845) 445-9268";
export const PHONE_HREF = "tel:+18454459268";

export interface PricingTier {
  id: "starter" | "growth" | "automated";
  name: string;
  price: string;
  sizeLabel: string;
  description: string;
  targetAudience: string;
  features: string[];
  highlight?: boolean;
  color: "cyan" | "emerald" | "violet";
}

export const PRICING_TIERS: PricingTier[] = [
  {
    id: "starter",
    name: "Starter",
    price: "$375",
    sizeLabel: "Single-Page",
    description: "A clean, professional single page to get you found and get you calls.",
    targetAudience: "Barbers, landscapers, handymen, solo operators",
    features: [
      "1-page custom-built site (no templates)",
      "Mobile-friendly design",
      "Contact form that emails you directly",
      "Custom business email setup",
      "Google Business Profile setup",
      "30 days of support after launch",
    ],
    color: "cyan",
  },
  {
    id: "growth",
    name: "Growth",
    price: "$550+",
    sizeLabel: "Multi-Page",
    description: "A multi-page site built to rank locally and turn visitors into booked jobs.",
    targetAudience: "HVAC, restaurants, retail, established local shops",
    features: [
      "3-5 custom pages",
      "Local SEO + schema markup",
      "Online booking/appointment integration",
      "Google Analytics setup",
      "Monthly performance check-in",
      "90 days of support after launch",
    ],
    highlight: true,
    color: "emerald",
  },
  {
    id: "automated",
    name: "Automated",
    price: "$875+",
    sizeLabel: "Enterprise",
    description: "For businesses ready to run lead flow, booking, and follow-up on autopilot.",
    targetAudience: "Multi-location shops, high call volume businesses",
    features: [
      "Unlimited custom pages",
      "Live booking with calendar sync",
      "Instant SMS lead alerts",
      "CRM integration",
      "Payment processing",
      "Priority support",
    ],
    color: "violet",
  },
];
