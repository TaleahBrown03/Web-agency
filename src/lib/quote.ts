// Estimate logic for the quote calculator. Pure functions only, so the calculator,
// the contact form, and the build all compute the same numbers from pricing.ts.
import {
  CONSULTATION_OPTIONS,
  CUSTOM_QUOTE_LABEL,
  QUOTE_ADDONS,
  QUOTE_DISCLAIMER,
  TIER_BY_ID,
  formatUsd,
  type PricingTier,
} from '../data/pricing';

export type ConsultationId = (typeof CONSULTATION_OPTIONS)[number]['id'];

export interface QuoteSelection {
  tierId: PricingTier['id'];
  extraPages: number;
  /** Visitor needs more extra pages than the calculator's limit; switches to a custom quote. */
  morePages: boolean;
  standardBooking: boolean;
  stockImages: boolean;
  consultation: ConsultationId[];
}

export interface QuoteLine {
  label: string;
  /** Display value: a price, "Included", or the custom-quote label. */
  value: string;
}

export interface QuoteResult {
  tier: PricingTier;
  /** True when the selection can't be priced without a consultation. */
  needsCustomQuote: boolean;
  /** Base range line followed by add-on lines. */
  lines: QuoteLine[];
  addOnTotal: number;
  /** Null when a custom quote is needed. */
  estimateMin: number | null;
  estimateMax: number | null;
  /** Estimate range, or the custom-quote label. */
  totalLabel: string;
}

export const DEFAULT_SELECTION: QuoteSelection = {
  tierId: 'growth',
  extraPages: 0,
  morePages: false,
  standardBooking: false,
  stockImages: false,
  consultation: [],
};

const CONSULTATION_IDS = CONSULTATION_OPTIONS.map((o) => o.id) as readonly string[];

/** Whole number between 0 and the configured max; anything else becomes 0 or the max. */
export function clampExtraPages(value: unknown): number {
  const n = typeof value === 'number' ? value : Number.parseInt(String(value ?? ''), 10);
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.min(Math.floor(n), QUOTE_ADDONS.extraPage.maxQuantity);
}

export function isTierId(value: unknown): value is PricingTier['id'] {
  return typeof value === 'string' && value in TIER_BY_ID;
}

export function computeQuote(selection: QuoteSelection): QuoteResult {
  const tier = TIER_BY_ID[selection.tierId];
  const lines: QuoteLine[] = [{ label: `${tier.name} package`, value: tier.price }];
  let addOnTotal = 0;
  let needsCustomQuote = tier.priceMax === null;

  // Fixed-price add-ons only apply to packages with a defined price range.
  if (tier.priceMax !== null) {
    const extraPages = clampExtraPages(selection.extraPages);
    if (extraPages > 0) {
      const cost = extraPages * QUOTE_ADDONS.extraPage.price;
      addOnTotal += cost;
      lines.push({
        label: `${extraPages} extra page${extraPages === 1 ? '' : 's'} × ${formatUsd(QUOTE_ADDONS.extraPage.price)}`,
        value: formatUsd(cost),
      });
    }
    if (selection.morePages) {
      needsCustomQuote = true;
      lines.push({ label: QUOTE_ADDONS.extraPage.moreLabel, value: CUSTOM_QUOTE_LABEL });
    }

    // Growth already includes one standard booking integration, so it's never charged again.
    if (tier.includesStandardBooking) {
      lines.push({ label: QUOTE_ADDONS.standardBooking.label, value: 'Included' });
    } else if (selection.standardBooking) {
      addOnTotal += QUOTE_ADDONS.standardBooking.price;
      lines.push({ label: QUOTE_ADDONS.standardBooking.label, value: formatUsd(QUOTE_ADDONS.standardBooking.price) });
    }

    if (selection.stockImages) {
      addOnTotal += QUOTE_ADDONS.stockImages.price;
      lines.push({ label: QUOTE_ADDONS.stockImages.label, value: formatUsd(QUOTE_ADDONS.stockImages.price) });
    }
  }

  for (const option of CONSULTATION_OPTIONS) {
    if (selection.consultation.includes(option.id)) {
      needsCustomQuote = true;
      lines.push({ label: option.label, value: CUSTOM_QUOTE_LABEL });
    }
  }

  if (needsCustomQuote) {
    return { tier, needsCustomQuote, lines, addOnTotal, estimateMin: null, estimateMax: null, totalLabel: 'Request a custom quote' };
  }

  const estimateMin = tier.priceMin + addOnTotal;
  const estimateMax = (tier.priceMax as number) + addOnTotal;
  return {
    tier,
    needsCustomQuote,
    lines,
    addOnTotal,
    estimateMin,
    estimateMax,
    totalLabel: `${formatUsd(estimateMin)}–${formatUsd(estimateMax)}`,
  };
}

/** Selections only (never personal data), in a short, readable query string. */
export function selectionToParams(selection: QuoteSelection): URLSearchParams {
  const params = new URLSearchParams({ tier: selection.tierId, quote: '1' });
  const tier = TIER_BY_ID[selection.tierId];
  if (tier.priceMax !== null) {
    const extraPages = clampExtraPages(selection.extraPages);
    if (extraPages > 0) params.set('pages', String(extraPages));
    if (selection.morePages) params.set('morepages', '1');
    if (selection.standardBooking && !tier.includesStandardBooking) params.set('booking', '1');
    if (selection.stockImages) params.set('stock', '1');
  }
  if (selection.consultation.length > 0) params.set('consult', selection.consultation.join(','));
  return params;
}

/** Reads calculator selections from a URL. Returns null if the URL didn't come from the calculator. */
export function selectionFromParams(params: URLSearchParams): QuoteSelection | null {
  const tierId = params.get('tier');
  if (params.get('quote') !== '1' || !isTierId(tierId)) return null;
  const consultation = (params.get('consult') ?? '')
    .split(',')
    .filter((id): id is ConsultationId => CONSULTATION_IDS.includes(id));
  return {
    tierId,
    extraPages: clampExtraPages(params.get('pages')),
    morePages: params.get('morepages') === '1',
    standardBooking: params.get('booking') === '1',
    stockImages: params.get('stock') === '1',
    consultation: [...new Set(consultation)],
  };
}

/** Plain-text summary for the contact form's message field and hidden fields. */
export function quoteSummaryText(result: QuoteResult): string {
  const label = result.needsCustomQuote ? 'Estimate' : 'Estimated range';
  return [
    'Quote calculator selections:',
    ...result.lines.map((line) => `- ${line.label}: ${line.value}`),
    `${label}: ${result.totalLabel}`,
    QUOTE_DISCLAIMER,
  ].join('\n');
}
