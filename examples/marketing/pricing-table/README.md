# Pricing Table

Animated pricing comparison with 3 tiers and staggered entrance animations.

## Preview

![Preview](./preview.gif)

[View animated SVG](preview.svg)

## Features

- 3-tier pricing layout
- Highlighted "popular" middle tier
- Staggered entrance animations
- Customizable colors and text

## Usage

```bash
pnpm run examples:render marketing/pricing-table
```

## Inputs

| Input | Type | Required | Default |
|-------|------|----------|---------|
| `headerTitle` | string | Yes | Choose Your Plan |
| `tier1Name` | string | Yes | Starter |
| `tier1Price` | string | Yes | $9/mo |
| `tier2Name` | string | Yes | Professional |
| `tier2Price` | string | Yes | $29/mo |
| `tier3Name` | string | Yes | Enterprise |
| `tier3Price` | string | Yes | $99/mo |
| `primaryColor` | color | No | #3b82f6 |
