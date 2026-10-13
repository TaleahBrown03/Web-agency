// Single source of truth for pricing + contact info, shared across
// Services.astro, ContactForm.astro, LiveDemos.astro, and the quote calculator
// so they can't drift out of sync. Edit prices and inclusions here only.

export const PHONE_DISPLAY = "(845) 445-9268";
export const PHONE_HREF = "tel:+18454459268";
export const CARE_PLAN_PRICE = "$50–$100/mo";
export const BOOKING_URL = "https://cal.com/orangewebworks/consultation";

export const formatUsd = (amount: number) => `$${amount.toLocaleString("en-US")}`;

export interface PricingTier {
  id: "starter" | "growth" | "custom";
  name: string;
  /** Lowest price in the range, in dollars. */
  priceMin: number;
  /** Highest price in the range, in dollars. Null for open-ended (Custom) pricing. */
  priceMax: number | null;
  /** Full price or range, e.g. "$1,000–$1,500". Derived from priceMin/priceMax. */
  price: string;
  /** Lowest price in the range, for "From $X" labels. Derived from priceMin. */
  startsAt: string;
  /** Pages included before extra-page pricing applies. Null when scoped per project. */
  includedPages: number | null;
  /** True when one standard third-party booking integration is part of the package. */
  includesStandardBooking: boolean;
  sizeLabel: string;
  description: string;
  targetAudience: string;
  /** Optional lead-in shown above the feature list. */
  featuresIntro?: string;
  features: string[];
  /** Short note about what the client provides, shown under the feature list. */
  clientNote?: string;
  highlight?: boolean;
  color: "cyan" | "emerald" | "violet";
}

type TierInput = Omit<PricingTier, "price" | "startsAt">;

const CLIENT_SUPPLIES_CONTENT = "You supply the final text and images.";

const TIER_INPUTS: TierInput[] = [
  {
    id: "starter",
    name: "Starter",
    priceMin: 1000,
    priceMax: 1500,
    includedPages: 1,
    includesStandardBooking: false,
    sizeLabel: "Single-Page",
    description: "A clean, professional single page to get you found and get you calls.",
    targetAudience: "Barbers, landscapers, handymen, solo operators",
    features: [
      "1-page custom-built site (no templates)",
      "Mobile-friendly design",
      "Business details, services, and contact information",
      "Click-to-call and social profile links",
      "Contact form that emails you directly",
      "Business email setup (you pay any email-provider subscription)",
      "Google Business Profile setup help (you own the profile, give us access, and complete any verification)",
      "One revision round",
      "30 days of support after launch",
    ],
    clientNote: CLIENT_SUPPLIES_CONTENT,
    color: "cyan",
  },
  {
    id: "growth",
    name: "Growth",
    priceMin: 2500,
    priceMax: 3200,
    includedPages: 5,
    includesStandardBooking: true,
    sizeLabel: "Multi-Page",
    description: "A custom-coded multi-page site built to rank locally and turn visitors into booked jobs.",
    targetAudience: "HVAC, restaurants, retail, established local shops",
    features: [
      "Up to 5 custom pages",
      "Design tailored to your brand",
      "Mobile-friendly design",
      "Contact form and clear calls to action",
      "Basic local SEO + relevant schema markup for one service area",
      "One standard third-party booking integration",
      "Google Analytics setup (once you give us access to your account)",
      "Bi-weekly performance check-ins for 90 days",
      "Two revision rounds",
      "90 days of support after launch",
    ],
    clientNote: CLIENT_SUPPLIES_CONTENT,
    highlight: true,
    color: "emerald",
  },
  {
    id: "custom",
    name: "Custom",
    priceMin: 4000,
    priceMax: null,
    includedPages: null,
    includesStandardBooking: false,
    sizeLabel: "Custom Scope",
    description: "For projects that go beyond a standard site. Scoped and quoted individually after a free consultation.",
    targetAudience: "Multi-location shops, high call volume businesses",
    featuresIntro: "Custom-coded and scoped to your project. Can include:",
    features: [
      "As many pages as the project needs",
      "Live booking with calendar sync",
      "Instant SMS lead alerts",
      "CRM integration",
      "Payment processing",
    ],
    color: "violet",
  },
];

export const PRICING_TIERS: PricingTier[] = TIER_INPUTS.map((tier) => ({
  ...tier,
  price:
    tier.priceMax === null
      ? `${formatUsd(tier.priceMin)}+`
      : `${formatUsd(tier.priceMin)}–${formatUsd(tier.priceMax)}`,
  startsAt: formatUsd(tier.priceMin),
}));

export const TIER_BY_ID = Object.fromEntries(PRICING_TIERS.map((t) => [t.id, t])) as Record<
  PricingTier["id"],
  PricingTier
>;

export const PRICE_RANGE = `${PRICING_TIERS[0].startsAt}–${PRICING_TIERS[PRICING_TIERS.length - 1].price}`;

// ---------------------------------------------------------------------------
// Quote calculator add-ons (one-time, added to Starter/Growth estimates).
// Hosting, third-party subscriptions, and care plans are never part of the estimate.
// ---------------------------------------------------------------------------

export const QUOTE_ADDONS = {
  extraPage: {
    label: "Extra pages",
    description: "Each page beyond the pages your package includes.",
    price: 250,
    /** Upper limit for the extra-page counter. Needing more switches the estimate to a custom quote. */
    maxQuantity: 10,
    moreLabel: "I need more than 10 extra pages",
  },
  standardBooking: {
    label: "Standard third-party booking integration",
    description: "Connect a standard third-party booking tool to your site.",
    price: 350,
  },
  stockImages: {
    label: "Stock-image selection and placement (up to 5 images)",
    description: "We find and place up to five stock images on your site.",
    price: 100,
    note: "Stock-image licensing is not included unless separately agreed.",
  },
} as const;

/** Requirements that can't be priced without a consultation. Selecting any switches to a custom quote. */
export const CONSULTATION_OPTIONS = [
  { id: "custom-booking", label: "Custom booking workflow or CRM-connected booking" },
  { id: "ecommerce", label: `E-commerce / online store (from ${TIER_BY_ID.growth.startsAt}, quoted after a consultation)` },
  { id: "advanced-integration", label: "Other advanced integration or feature" },
] as const;

/** E-commerce starts at the Growth price; the final price is always set after a consultation. */
export const ECOMMERCE_PRICE_NOTE = `From ${TIER_BY_ID.growth.startsAt} · final price set after a consultation`;

export const CLIENT_IMAGES_NOTE = "Using your own photos? Basic placement within your package's scope is included at no extra charge.";
export const QUOTE_DISCLAIMER = "Estimate only. Final pricing depends on project scope and will be confirmed in a written quote.";
export const QUOTE_EXCLUSIONS = "Hosting, third-party subscriptions, and monthly care plans are not part of this one-time estimate.";
export const CUSTOM_QUOTE_LABEL = "Custom quote after consultation";
