# System Architecture

Detailed technical documentation of Tratlus's architecture, design patterns, and system integrations.

---

## High-Level Architecture

```mermaid
flowchart TB
    subgraph User["User Layer"]
        Browser[Web Browser/PWA]
    end
    
    subgraph Frontend["Frontend Layer (React 19)"]
        Router[TanStack Router]
        Pages[Page Components]
        UI[Glassmorphic UI System]
        Hooks[Custom Hooks]
    end
    
    subgraph State["State Management"]
        ThemeCtx[Theme Context]
        SoundCtx[Sound Context]
        LocalState[Component State]
        QueryCache[TanStack Query Cache]
    end
    
    subgraph Services["External Services"]
        Gemini[Google Gemini AI]
        OSM[OpenStreetMap Embed]
        Nominatim[Nominatim Geocoding]
    end
    
    Browser --> Router
    Router --> Pages
    Pages --> UI
    Pages --> Hooks
    
    Hooks --> ThemeCtx
    Hooks --> SoundCtx
    Hooks --> LocalState
    Hooks --> QueryCache
    
    QueryCache --> Gemini
    Pages --> OSM
    Pages --> Nominatim
```

---

## Application Flow

```mermaid
stateDiagram-v2
    [*] --> Landing
    Landing --> Swiping: Start Swiping
    Landing --> Loading: Load data
    Loading --> Swiping: Data ready
    
    Swiping --> Questionnaire: Skip or complete swipes
    Questionnaire --> Generating: Generate Itinerary
    Generating --> Itinerary: AI response complete
    
    Itinerary --> Itinerary: Edit activities
    Itinerary --> Generating: Re-optimize
    Itinerary --> [*]: Export PDF
```

---

## Component Hierarchy

```mermaid
graph TD
    App[App.tsx / Router]
    App --> ThemeProvider
    ThemeProvider --> SoundProvider
    SoundProvider --> RouteTree
    
    RouteTree --> IndexRoute[index.tsx - Main Orchestrator]
    
    subgraph PageComponents["Page Components"]
        IndexRoute --> LandingPage
        IndexRoute --> LoadingPage
        IndexRoute --> SwipePage
        IndexRoute --> QuestionnairePage
        IndexRoute --> GeneratingPage
        IndexRoute --> ItineraryPage
    end
    
    subgraph UIComponents["Glassmorphic UI System"]
        Button
        Card
        Dialog
        Input
        Slider
        Progress
        Badge
    end
    
    PageComponents --> UIComponents
```

---

## State Management Strategy

### Local State (useState)
The primary state management approach, keeping state close to where it's used:

| State Category | Location | Purpose |
|----------------|----------|---------|
| App State | `index.tsx` | Current screen (landing, swiping, questionnaire, etc.) |
| Swipe Data | `index.tsx` | Current card, liked/disliked destinations |
| Questionnaire | `index.tsx` | Form values, dietary preferences, budget |
| Itinerary | `index.tsx` | Generated trip data, activities, days |
| UI State | `index.tsx` | Dialogs, editing mode, drag state |

### Context Providers

```typescript
// Theme Context
interface ThemeContext {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

// Sound Context  
interface SoundContext {
  isMuted: boolean;
  volume: number;
  playSound: (type: string) => void;
  toggleMute: () => void;
}
```

### TanStack Query
Used for AI interactions with built-in caching, error handling, and streaming support.

---

## AI Integration Architecture

### Itinerary Generation Flow

```mermaid
sequenceDiagram
    participant User
    participant App as React App
    participant Hook as useGenerateItinerary
    participant Gemini as Google Gemini

    User->>App: Click "Generate Itinerary"
    App->>App: Collect preferences
    App->>Hook: mutate({ prompt })
    Hook->>Gemini: POST with structured prompt
    
    loop Streaming Response
        Gemini-->>Hook: JSON chunks
        Hook-->>App: onSuccess callback
    end
    
    App->>App: Parse itinerary JSON
    App->>App: setItinerary(data)
    App->>App: Navigate to Itinerary view
    App->>App: Pre-fetch nearby activities
    App->>App: Pre-load map coordinates
```

### Prompt Engineering

The AI prompt includes:
- Destination and trip duration
- Liked/disliked destination tags with weighted scores
- Dietary restrictions and allergies
- Transportation preferences
- Accommodation requirements
- Budget constraints

Response structure enforced via JSON schema prompting.

---

## Map Integration

```mermaid
sequenceDiagram
    participant App
    participant Nominatim as Nominatim API
    participant OSM as OpenStreetMap Embed

    App->>Nominatim: GET /search?q={destination}
    Nominatim-->>App: { lat, lon }
    App->>App: Store coordinates
    
    Note over App: When user opens Map View
    App->>OSM: Render iframe with bbox
    OSM-->>App: Interactive map display
```

### Geocoding Strategy
- Coordinates fetched **immediately** after itinerary generation
- Stored in state for instant map display
- Fallback geocoding if coordinates not available

---

## Component Communication

### Props Flow (Prop Drilling Pattern)

```
index.tsx (Main Orchestrator)
    ├─> SwipePage
    │     ├─ destinations, currentIndex
    │     ├─ handleSwipe, handleSkip
    │     └─ isDarkMode, playSound
    │
    ├─> QuestionnairePage  
    │     ├─ formState (30+ form values)
    │     ├─ setters for each value
    │     └─ handleGenerate
    │
    └─> ItineraryPage
          ├─ itinerary data
          ├─ 40+ props for full functionality
          ├─ handlers for edit, delete, drag
          └─ map coordinates, nearby activities
```

### Design Decision: Prop Drilling vs Context
We chose prop drilling for page components because:
1. **Explicit data flow** - Easy to trace where data comes from
2. **No context re-render issues** - State changes only affect relevant components
3. **Type safety** - TypeScript catches missing props at compile time

---

## Performance Optimizations

### Implemented Strategies

| Strategy | Implementation |
|----------|----------------|
| **Code Splitting** | Page components in separate files |
| **Memoization** | `useCallback` for stable handlers |
| **Lazy Map Loading** | Coordinates pre-fetched, map iframe loaded on demand |
| **Optimistic UI** | Immediate feedback on interactions |
| **Animation Performance** | CSS transforms, will-change hints |

### Bundle Considerations
- Tree-shaking via Vite/Rolldown
- Dynamic imports for heavy components
- SVG icons instead of font icons
- Minimal dependencies

---

## File Organization Philosophy

```
src/
├── components/
│   ├── pages/     # Feature pages (extracted from index.tsx)
│   ├── ui/        # shadcn/ui primitives (button, card, dialog...)
│   ├── landing/   # Landing page specific components
│   └── data/      # Static data (destinations, tags)
├── hooks/         # Reusable logic (AI, responsive)
├── contexts/      # Global state (theme, sound)
├── routes/        # TanStack Router file-based routes
└── lib/           # Utilities (cn, helpers)
```

### Separation of Concerns
- **index.tsx**: State management and orchestration (~2100 lines)
- **Page Components**: UI rendering and local interactions
- **Hooks**: Reusable business logic
- **UI Components**: Presentational primitives

---

## Security Considerations

| Concern | Mitigation |
|---------|------------|
| **API Key Exposure** | `.env` file with `VITE_` prefix, gitignored |
| **XSS in User Input** | React's built-in escaping |
| **iframe Security** | OpenStreetMap trusted source |
| **Input Validation** | Zod schemas for form data |

---

## Future Architecture Considerations

- **Backend Integration**: Supabase or similar for trip persistence
- **Auth**: User accounts for saved itineraries
- **Real-time Collaboration**: Share trips with travel companions
- **Offline Support**: Service worker for PWA offline mode
