# Recipe Card

Recipe introduction card for cooking videos with food image.

## Preview

![Preview](preview.gif)

## Usage

```bash
pnpm run examples:render food/recipe-card
```

## Inputs

| Key | Type | Default |
|-----|------|---------|
| `foodImage` | image | Pasta carbonara image |
| `category` | string | "ITALIAN CUISINE" |
| `recipeName` | string | "Homemade Pasta Carbonara" |
| `prepTime` | string | "Prep: 15 min" |
| `cookTime` | string | "Cook: 20 min" |
| `difficulty` | string | "Easy" |

## Custom Image

```bash
pnpm run examples:render food/recipe-card \
  --input foodImage="https://example.com/my-dish.jpg" \
  --input recipeName="My Recipe"
```
