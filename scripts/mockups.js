/**
 * mockups.js — static product data for the Mojo marketplace.
 *
 * Exposes window.gainPlans used by products/scripts/listing.js
 * to populate the GAIN plan-selector dialog.
 */

window.gainPlans = [
  {
    id: 'pro',
    name: 'Pro',
    tagline: 'Startups / single-product orgs',
    price: '$100',
    interval: '/mo',
    url: 'https://polar.sh',
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
    url: 'https://polar.sh',
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
    url: 'https://polar.sh',
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
