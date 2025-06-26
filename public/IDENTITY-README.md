# ARCANA - Visual Identity Guidelines

This document outlines the visual identity elements for the ARCANA application, a mystical tarot card reading experience.

## Core Identity Elements

### Logo

The ARCANA logo (`logo.svg`) represents the mystical nature of the application with the following elements:
- A dark background representing the unknown
- Blood-red and aged-bone decorative borders
- Moon phases at cardinal points
- A central pentagram/star symbolizing mystical power
- A tarot card outline representing the core functionality
- Zodiac symbols arranged in a circle, representing astrological connections

Usage:
- Use the logo on the main landing page
- Include in marketing materials
- Display in about/info sections

### Favicon

The favicon (`favicon.svg`) is a simplified version of the logo designed for browser tabs and app icons. It maintains the core visual elements while being recognizable at small sizes.

Usage:
- Set as the website favicon
- Use for PWA app icons (with appropriate sizing)
- Include in browser bookmarks

### Loading Animation

The loading animation (`loading-animation.svg`) provides visual feedback during loading states with animated mystical elements:
- Rotating zodiac symbols
- Pulsing moon phases
- A central pulsing star
- The text "REVELANDO" indicating content is being revealed

Usage:
- Display during API calls or data loading
- Show when transitioning between major sections
- Use when generating tarot readings

## Color Palette

The ARCANA application uses a carefully selected color palette that evokes mysticism and ancient wisdom:

- **Deep Black (#0A0A0A)**: Primary background color representing the void and unknown
- **Blood Red (#8B1E24)**: Accent color for important elements, representing passion and power
- **Aged Bone (#D9CBA5)**: Primary text and detail color, representing ancient wisdom and scrolls
- **Bone Dust Gray (#B0B0B0)**: Secondary text and subtle elements

## Typography

- **Primary Decorative Font**: "Cinzel Decorative" for headings and important text
- **Primary Serif Font**: Georgia for body text and readability

## Demo Page

A comprehensive demo page is available at `/identity-demo` that showcases all the visual identity elements:

- Logo in different sizes and variants
- Loading indicators with different configurations
- Interactive loading simulation
- Color palette with hex codes
- Typography examples

Visit this page to see how the identity elements look and behave in a real application context.

## Implementation

### Basic Implementation

To implement these identity elements in the application:

1. For the favicon:
   ```html
   <link rel="icon" href="/favicon.svg" type="image/svg+xml">
   ```

2. For the logo (basic implementation):
   ```jsx
   import Image from 'next/image'

   export function Logo() {
     return (
       <Image 
         src="/logo.svg" 
         alt="ARCANA" 
         width={200} 
         height={200} 
         className="animate-subtleGlow"
       />
     )
   }
   ```

3. For the loading animation (basic implementation):
   ```jsx
   export function LoadingIndicator() {
     return (
       <div className="flex justify-center items-center my-8">
         <img 
           src="/loading-animation.svg" 
           alt="Carregando..." 
           width={120} 
           height={120} 
         />
       </div>
     )
   }
   ```

### Ready-to-Use Components

The application includes pre-built components that implement these identity elements with additional features:

#### Logo Component

```jsx
import { Logo } from '@/components/ui/logo'

// Basic usage
<Logo />

// With size options
<Logo size="sm" />
<Logo size="md" />
<Logo size="lg" />

// Without text
<Logo withText={false} />

// Without link to home
<Logo linkToHome={false} />

// With custom class
<Logo className="my-8" />
```

#### Loading Indicator Component

```jsx
import { LoadingIndicator } from '@/components/ui/loading-indicator'

// Basic usage
<LoadingIndicator />

// With size options
<LoadingIndicator size="sm" />
<LoadingIndicator size="md" />
<LoadingIndicator size="lg" />

// With custom text
<LoadingIndicator text="Consultando os astros..." />

// With custom class
<LoadingIndicator className="my-8" />
```

## Design Principles

When extending the ARCANA visual identity, follow these principles:

1. **Mystical Atmosphere**: Maintain the sense of mystery and ancient wisdom
2. **Elegant Minimalism**: Use decorative elements sparingly for maximum impact
3. **Symbolic Meaning**: Incorporate symbols with connections to tarot and astrology
4. **Consistent Color Palette**: Stick to the defined colors for a cohesive experience
5. **Subtle Animation**: Use animation to enhance the mystical feel, not distract from it

---

These visual identity elements were created to establish a unique and cohesive brand for the ARCANA application, reflecting its focus on tarot readings, astrology, and spiritual guidance.
