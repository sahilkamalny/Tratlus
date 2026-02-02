# Technology Stack

Detailed documentation of technology choices, rationale, and implementation decisions.

---

## Core Technologies

### React 19

**Choice**: React 19 with functional components and hooks

**Rationale**:
- Latest React features including improved concurrent rendering
- Excellent TypeScript integration
- Vast ecosystem and community support
- Familiar to most frontend developers

**Key Patterns Used**:
- Custom hooks for reusable logic (`useGenerateItinerary`, `useMobile`)
- Context API for global state (theme, sound)
- Controlled components for form inputs
- Prop drilling for explicit data flow

---

### TypeScript 5.8

**Choice**: Strict TypeScript configuration

**Rationale**:
- Catch errors at compile time
- Self-documenting code with interfaces
- Excellent IDE support and autocomplete
- Safer refactoring

**Example Type Definitions**:
```typescript
interface TravelItinerary {
  destination: string;
  totalDays: number;
  totalEstimatedCost: number;
  days: ItineraryDay[];
}

interface Activity {
  time: string;
  title: string;
  location: string;
  description: string;
  estimatedCost: number;
  type: 'food' | 'attraction' | 'activity' | 'transportation';
  rating?: number;
  duration?: string;
}
```

---

### Vite (Rolldown)

**Choice**: Vite with Rolldown as bundler

**Rationale**:
- Instant server start with native ESM
- Lightning-fast Hot Module Replacement (HMR)
- Optimized production builds
- First-class TypeScript support
- Rolldown provides faster builds than Rollup

**Configuration Highlights**:
- React plugin for JSX transform
- SVGR for SVG component imports
- PWA plugin for service worker generation
- Alias configuration for clean imports (`@/`)

---

## Styling

### Tailwind CSS 4

**Choice**: Utility-first CSS with latest Tailwind version

**Rationale**:
- Rapid prototyping and iteration
- Consistent spacing and sizing
- Built-in dark mode support
- Tree-shaking for minimal bundle size
- CSS variables integration

**Glassmorphic Design System**:
```css
/* Glass effect utilities */
.glass-panel {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.dark .glass-panel {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

---

### Radix UI + shadcn/ui

**Choice**: Radix primitives with shadcn/ui styling

**Rationale**:
- Accessible by default (WAI-ARIA compliant)
- Unstyled primitives for full customization
- Keyboard navigation support
- Focus management
- 49 pre-built components

**Components Used**:
| Component | Purpose |
|-----------|---------|
| `Dialog` | Modals for map view, add activity |
| `Slider` | Budget, volume, food adventurousness |
| `Checkbox` | Dietary preferences, amenities |
| `Progress` | Calibration progress bar |
| `Badge` | Tags, status indicators |
| `Card` | Activity cards, destination cards |
| `Button` | All interactive buttons |

---

## Routing & Data

### TanStack Router

**Choice**: TanStack Router for type-safe routing

**Rationale**:
- Full TypeScript support with inferred types
- File-based routing support
- Excellent developer experience
- Built-in devtools

**Route Structure**:
```
routes/
├── __root.tsx      # Root layout
└── index.tsx       # Main app (single-page flow)
```

---

### TanStack Query

**Choice**: TanStack Query for server state management

**Rationale**:
- Built-in caching and deduplication
- Mutation hooks for AI calls
- Streaming response support
- Error handling and retries

**Usage**:
```typescript
const { mutate: generateItinerary, isPending } = useMutation({
  mutationFn: async (prompt: string) => {
    // Call Gemini API
    return await generateWithGemini(prompt);
  },
  onSuccess: (data) => {
    setItinerary(data.itinerary);
    setAppState("itinerary");
  },
});
```

---

### Zustand

**Choice**: Zustand for lightweight global state (optional use)

**Rationale**:
- Minimal boilerplate
- No providers needed
- TypeScript friendly
- Small bundle size

---

## AI Integration

### Google Gemini API

**Choice**: Gemini API for AI itinerary generation

**Rationale**:
- Fast response times
- Excellent structured JSON output
- Cost-effective for content generation
- Good at following complex prompts

**Integration Pattern**:
```
Client → Custom Hook → Gemini SDK → AI Response → Parse JSON → State
```

**Why Client-Side (for now)**:
- Simpler architecture
- API key in environment variable
- Future: Move to Edge Functions for production

---

## Maps & Geocoding

### OpenStreetMap

**Choice**: OpenStreetMap embed for map display

**Rationale**:
- Free and open-source
- No API key required for embeds
- Global coverage
- Privacy-respecting

**Implementation**:
```typescript
const mapUrl = `https://www.openstreetmap.org/export/embed.html
  ?bbox=${lon - 0.02},${lat - 0.02},${lon + 0.02},${lat + 0.02}
  &layer=mapnik
  &marker=${lat},${lon}`;
```

---

### Nominatim

**Choice**: Nominatim for geocoding

**Rationale**:
- Free tier available
- OpenStreetMap data
- No API key required
- Reliable for destination lookup

**Usage**:
```typescript
const response = await fetch(
  `https://nominatim.openstreetmap.org/search?format=json&q=${destination}`
);
const [result] = await response.json();
const { lat, lon } = result;
```

---

## PDF Generation

### jsPDF

**Choice**: jsPDF for client-side PDF generation

**Rationale**:
- No server required
- Works offline
- Full control over layout
- Small bundle size

**Features Used**:
- Text positioning
- Multi-page support
- Custom formatting

---

## Form Handling

### React Hook Form + Zod

**Choice**: React Hook Form with Zod validation

**Rationale**:
- Minimal re-renders
- TypeScript-first validation
- Excellent performance
- Declarative schema

**Example**:
```typescript
const formSchema = z.object({
  destination: z.string().min(1, "Destination is required"),
  duration: z.number().min(1).max(14),
  budget: z.number().positive(),
});
```

---

## Animation

### CSS + Tailwind Animations

**Choice**: CSS transforms and Tailwind CSS animate utilities

**Rationale**:
- GPU-accelerated
- No JavaScript overhead
- Built-in Tailwind utilities
- Consistent 60fps

**Animation Classes Used**:
- `animate-pulse` - Loading states
- `transition-transform` - Smooth interactions
- `hover:scale-105` - Button feedback
- Custom keyframes for swipe cards

---

## PWA Support

### vite-plugin-pwa

**Choice**: Vite PWA plugin

**Rationale**:
- Automatic service worker generation
- Manifest handling
- Workbox integration
- Zero-config setup

**PWA Features**:
- Home screen installation
- Standalone display mode
- Portrait orientation lock
- Custom icons (192x192, 512x512)

---

## Additional Libraries

| Library | Purpose |
|---------|---------|
| `lucide-react` | Icon library (40+ icons used) |
| `date-fns` | Date formatting and manipulation |
| `clsx` + `tailwind-merge` | Conditional class merging |
| `embla-carousel-react` | Touch-enabled carousels |
| `sonner` | Toast notifications |

---

## Development Tools

| Tool | Purpose |
|------|---------|
| **Biome** | Linting and formatting |
| **Vitest** | Unit testing |
| **TypeScript** | Type checking |
| **Vite** | Development server |

---

## Performance Metrics

### Lighthouse Targets

| Metric | Target | Strategy |
|--------|--------|----------|
| Performance | 90+ | Code splitting, lazy loading |
| Accessibility | 95+ | Radix UI, semantic HTML |
| Best Practices | 100 | Modern APIs, HTTPS |
| SEO | 90+ | Meta tags, semantic structure |

### Bundle Size Optimizations

- Tree-shaking unused code
- Dynamic imports for heavy components
- SVG sprites for icons
- Minimal runtime dependencies

---

## Future Considerations

| Area | Potential Technology |
|------|---------------------|
| **Backend** | Supabase, Vercel Edge |
| **Auth** | Supabase Auth, Clerk |
| **Persistence** | PostgreSQL, IndexedDB |
| **Real-time** | WebSockets, Supabase Realtime |
| **Offline** | Service Worker, Cache API |
