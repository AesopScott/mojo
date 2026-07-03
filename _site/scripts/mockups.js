/**
 * mockups.js — static product data for the Mojo marketplace.
 *
 * Exposes window.gainPlans used by products/scripts/listing.js
 * to populate the GAIN plan-selector dialog.
 */

/**
 * Standard self-service plans (single-org buyer).
 * polarPriceId = Polar product ID — accepted by embed.js for single-price products.
 */
window.gainPlans = [
  {
    id: 'pro',
    name: 'Pro',
    tagline: 'Startups / single-product orgs',
    price: '$100',
    interval: '/mo',
    polarPriceId: '636b0777-d111-414e-968c-455bd5161d3d',
    features: [
      '1 workspace',
      'Up to 10 team members',
      'Up to 15 AI systems tracked',
      'Full intake + risk register',
      'AI Impact Assessment workflow',
      'All sector checklists (HIPAA, FERPA, GLBA, SOX, etc.)',
      '6 saved policies per workspace',
      'AI-generated policy drafting',
      'Posture-drift banners + snapshots',
      'Audit log export (CSV / JSON)',
      'Email support · 48h SLA',
    ],
  },
  {
    id: 'business',
    name: 'Business',
    tagline: 'Mid-market / regulated industries',
    price: '$250',
    interval: '/mo',
    featured: true,
    polarPriceId: '54ceb640-dba6-4fb3-94ef-9ca4a93d6fb5',
    features: [
      '3 workspaces',
      'Up to 25 team members',
      'Up to 35 AI systems tracked',
      'Everything in Pro, plus:',
      'Unlimited saved policies',
      'SSO — Google Workspace',
      'Custom branding (remove GAIN footer)',
      'Vendor BAA & contract tracking',
      'Email support · 24h SLA',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    tagline: 'Large enterprise / multi-BU',
    price: '$500',
    interval: '/mo',
    polarPriceId: 'f95729d1-af9a-4025-8929-b9ba83a174f1',
    features: [
      'Unlimited workspaces',
      'Unlimited team members',
      'Unlimited AI systems tracked',
      'Everything in Business, plus:',
      'SAML SSO (Okta / Azure AD / OneLogin)',
      'API access',
      'Data residency options',
      'Email + dedicated Discord · 8h SLA',
    ],
  },
];

/**
 * MSSP (Managed Security Services Provider) plans.
 * Each plan includes 1 client workspace; additional workspaces are $100/yr each.
 * polarPriceId = Polar product ID for the MSSP product.
 */
window.gainMsspPlans = [
  {
    id: 'pro-mssp',
    name: 'Pro MSSP',
    tagline: 'Up to 10 client workspaces',
    price: '$100',
    interval: '/mo',
    polarPriceId: 'e0063c13-5909-4059-b33c-dc94c1576496',
    features: [
      'Up to 10 managed client workspaces',
      '1 workspace included — add more at $100/yr each',
      'Up to 10 team members per workspace',
      'Up to 15 AI systems tracked per workspace',
      'Full intake + risk register per workspace',
      'AI Impact Assessment workflow',
      'All sector checklists (HIPAA, FERPA, GLBA, SOX, etc.)',
      '6 saved policies per workspace',
      'AI-generated policy drafting',
      'Audit log export (CSV / JSON)',
      'Email support · 48h SLA',
    ],
  },
  {
    id: 'business-mssp',
    name: 'Business MSSP',
    tagline: 'Up to 25 client workspaces',
    price: '$250',
    interval: '/mo',
    featured: true,
    polarPriceId: 'a3db7a0e-d1ef-451b-a93f-7ce817af5b79',
    features: [
      'Up to 25 managed client workspaces',
      '1 workspace included — add more at $100/yr each',
      'Up to 25 team members per workspace',
      'Up to 35 AI systems tracked per workspace',
      'Everything in Pro MSSP, plus:',
      'Unlimited saved policies per workspace',
      'SSO — Google Workspace',
      'Custom branding (remove GAIN footer)',
      'Vendor BAA & contract tracking',
      'Email support · 24h SLA',
    ],
  },
  {
    id: 'enterprise-mssp',
    name: 'Enterprise MSSP',
    tagline: 'Up to 100 client workspaces',
    price: '$500',
    interval: '/mo',
    polarPriceId: 'c61fc9b0-e99a-4ae9-9365-63b18e3b103e',
    features: [
      'Up to 100 managed client workspaces',
      '1 workspace included — add more at $100/yr each',
      'Unlimited team members per workspace',
      'Unlimited AI systems tracked per workspace',
      'Everything in Business MSSP, plus:',
      'SAML SSO (Okta / Azure AD / OneLogin)',
      'API access',
      'Data residency options',
      'Email + dedicated Discord · 8h SLA',
    ],
  },
];
