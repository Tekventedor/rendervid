# AI Integration Guide

Use AI models to generate, modify, and optimize Rendervid templates.

## Overview

Rendervid's JSON-based templates and capabilities API are designed for AI integration. You can use AI models to:

- Generate templates from natural language descriptions
- Modify existing templates based on instructions
- Create variations of templates
- Optimize templates for specific use cases

## Capabilities API

The engine provides structured information about all available features:

```typescript
import { RendervidEngine } from '@rendervid/core';

const engine = new RendervidEngine();
const capabilities = engine.getCapabilities();

// Returns structured data about:
// - Layer types and their properties
// - Animation presets and effects
// - Easing functions
// - Filters and their parameters
// - Input types and validation
```

### Capabilities Structure

```typescript
interface Capabilities {
  layerTypes: LayerTypeInfo[];
  animations: {
    entrance: AnimationPresetInfo[];
    exit: AnimationPresetInfo[];
    emphasis: AnimationPresetInfo[];
  };
  easings: EasingInfo[];
  filters: FilterInfo[];
  inputTypes: InputTypeInfo[];
  transitions: TransitionInfo[];
}
```

## Prompt Engineering

### Basic Template Generation

```typescript
const systemPrompt = `You are a video template generator for Rendervid.
Generate JSON templates based on user descriptions.

Available capabilities:
${JSON.stringify(capabilities, null, 2)}

Template structure:
{
  "name": "string",
  "output": { "type": "video", "width": number, "height": number, "fps": number, "duration": number },
  "inputs": [...],
  "composition": { "scenes": [...] }
}

Rules:
1. Use only valid layer types: text, image, video, shape, audio, group, lottie, custom
2. Use only valid animation effects from the capabilities
3. Ensure positions and sizes fit within output dimensions
4. Include entrance and exit animations for dynamic elements
`;

const userPrompt = "Create a 10-second Instagram story announcing a sale with animated text";

const response = await openai.chat.completions.create({
  model: "gpt-4",
  messages: [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt }
  ],
  response_format: { type: "json_object" }
});

const template = JSON.parse(response.choices[0].message.content);
```

### Template Modification

```typescript
const modifyPrompt = `Given this template:
${JSON.stringify(existingTemplate, null, 2)}

Modify it to: ${userInstructions}

Return the complete modified template as JSON.`;
```

### Structured Output with JSON Schema

Provide the template schema for better results:

```typescript
const templateSchema = {
  type: "object",
  properties: {
    name: { type: "string" },
    output: {
      type: "object",
      properties: {
        type: { enum: ["video", "image"] },
        width: { type: "integer", minimum: 1 },
        height: { type: "integer", minimum: 1 },
        fps: { type: "integer", minimum: 1, maximum: 120 },
        duration: { type: "number", minimum: 0.1 }
      },
      required: ["type", "width", "height"]
    },
    inputs: { type: "array" },
    composition: { type: "object" }
  },
  required: ["name", "output", "composition"]
};
```

## Integration Examples

### OpenAI Integration

```typescript
import OpenAI from 'openai';
import { RendervidEngine } from '@rendervid/core';

const openai = new OpenAI();
const engine = new RendervidEngine();

async function generateTemplate(description: string) {
  const capabilities = engine.getCapabilities();

  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo",
    messages: [
      {
        role: "system",
        content: `Generate Rendervid video templates as JSON.

Available features:
- Layer types: ${capabilities.layerTypes.map(l => l.name).join(', ')}
- Animations: ${Object.values(capabilities.animations).flat().map(a => a.name).join(', ')}
- Easings: ${capabilities.easings.map(e => e.name).join(', ')}

Output valid JSON matching the Rendervid template schema.`
      },
      {
        role: "user",
        content: description
      }
    ],
    response_format: { type: "json_object" }
  });

  const template = JSON.parse(response.choices[0].message.content);

  // Validate before returning
  const validation = engine.validateTemplate(template);
  if (!validation.valid) {
    throw new Error(`Invalid template: ${validation.errors.join(', ')}`);
  }

  return template;
}
```

### Anthropic Claude Integration

```typescript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

async function generateWithClaude(description: string) {
  const capabilities = engine.getCapabilities();

  const response = await anthropic.messages.create({
    model: "claude-3-opus-20240229",
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: `Generate a Rendervid video template for: ${description}

Available capabilities:
${JSON.stringify(capabilities, null, 2)}

Respond with only valid JSON matching the template schema.`
      }
    ]
  });

  const content = response.content[0];
  if (content.type === 'text') {
    return JSON.parse(content.text);
  }
}
```

### Function Calling

Use function calling for structured template generation:

```typescript
const tools = [
  {
    type: "function",
    function: {
      name: "create_template",
      description: "Create a Rendervid video template",
      parameters: {
        type: "object",
        properties: {
          name: { type: "string", description: "Template name" },
          width: { type: "integer", description: "Video width" },
          height: { type: "integer", description: "Video height" },
          duration: { type: "number", description: "Duration in seconds" },
          scenes: {
            type: "array",
            items: {
              type: "object",
              properties: {
                backgroundColor: { type: "string" },
                layers: { type: "array" }
              }
            }
          }
        },
        required: ["name", "width", "height", "duration", "scenes"]
      }
    }
  }
];

const response = await openai.chat.completions.create({
  model: "gpt-4-turbo",
  messages: [{ role: "user", content: description }],
  tools,
  tool_choice: { type: "function", function: { name: "create_template" } }
});
```

## Validation & Error Handling

Always validate AI-generated templates:

```typescript
async function safeGenerateTemplate(description: string) {
  const maxRetries = 3;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const template = await generateTemplate(description);
      const validation = engine.validateTemplate(template);

      if (validation.valid) {
        return template;
      }

      // Provide error feedback for retry
      description = `${description}

Previous attempt had errors: ${validation.errors.join(', ')}
Please fix these issues.`;

    } catch (error) {
      if (attempt === maxRetries - 1) {
        throw error;
      }
    }
  }

  throw new Error('Failed to generate valid template after retries');
}
```

## Custom Component Registration

Register custom components and expose their schemas to AI:

```typescript
// Register component with schema
engine.components.register('PriceDisplay', PriceDisplay, {
  type: 'object',
  properties: {
    price: { type: 'number', description: 'Price value' },
    currency: { type: 'string', description: 'Currency symbol' },
    discount: { type: 'number', description: 'Discount percentage' }
  },
  required: ['price']
});

// Get all component schemas for AI
const componentSchemas = engine.components.list();

// Include in prompt
const prompt = `Available custom components:
${componentSchemas.map(c => `- ${c.name}: ${JSON.stringify(c.propsSchema)}`).join('\n')}`;
```

## Template Variations

Generate multiple variations of a template:

```typescript
async function generateVariations(
  baseTemplate: Template,
  count: number
): Promise<Template[]> {
  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo",
    messages: [
      {
        role: "system",
        content: "Generate variations of video templates. Return a JSON array."
      },
      {
        role: "user",
        content: `Generate ${count} variations of this template with different:
- Color schemes
- Animation styles
- Typography choices

Base template:
${JSON.stringify(baseTemplate, null, 2)}`
      }
    ],
    response_format: { type: "json_object" }
  });

  const result = JSON.parse(response.choices[0].message.content);
  return result.variations;
}
```

## Streaming Template Generation

For long templates, use streaming:

```typescript
async function streamTemplate(description: string) {
  const stream = await openai.chat.completions.create({
    model: "gpt-4-turbo",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: description }
    ],
    stream: true
  });

  let template = '';
  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || '';
    template += content;
    // Update UI progressively
  }

  return JSON.parse(template);
}
```

## Best Practices

1. **Include capabilities** - Always provide the capabilities data to the AI
2. **Validate output** - Never trust AI output without validation
3. **Provide examples** - Include example templates in prompts
4. **Handle errors** - Implement retry logic with error feedback
5. **Use structured output** - Prefer JSON mode or function calling
6. **Limit scope** - Break complex templates into smaller parts
7. **Version prompts** - Track prompt versions for reproducibility

## Common Patterns

### Template from Text Description

```typescript
const template = await generateTemplate(
  "A 15-second product showcase video with the product image in the center, " +
  "animated title at the top, and a call-to-action button at the bottom. " +
  "Use blue and white colors with smooth fade animations."
);
```

### Template from Image Analysis

```typescript
// Analyze reference image/video
const analysis = await openai.chat.completions.create({
  model: "gpt-4-vision-preview",
  messages: [{
    role: "user",
    content: [
      { type: "text", text: "Describe this video frame's layout, colors, and typography" },
      { type: "image_url", image_url: { url: referenceImageUrl } }
    ]
  }]
});

// Generate template matching the style
const template = await generateTemplate(
  `Create a template matching this style: ${analysis.choices[0].message.content}`
);
```

### Batch Generation

```typescript
async function generateBatch(descriptions: string[]) {
  return Promise.all(
    descriptions.map(desc => safeGenerateTemplate(desc))
  );
}
```

## Related Documentation

- [Capabilities API](/api/core/capabilities)
- [Template Schema](/templates/schema)
- [Validation](/api/core/validation)
