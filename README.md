# Project Hub [v0.2.0]
A mobile prioritization and organization app

ProjectHub eliminates feature-bloat anxiety and "gut-feeling" roadmap changes by substituting traditional, impulsive drag-and-drop Kanban interactions with an **Intentional Prioritization Wizard** backed by the **RICE Scoring Framework** and **MoSCoW Filters**.

---

## 🚀 Core Philosophy & Features

* **Single-Column Focus Workspace:** Unlike sprawling Kanban boards that induce cognitive overload, the Tasks workspace displays only **one priority column at a time** (High, Med, Low, Later, To Sort). A subtle **15px gradient "Peek" mechanic** on the screen edge signals additional columns waiting to be discovered via intuitive touch swipe gestures.
* **The ProjectHub (Priority Wizard):** To prevent impulsive prioritization shifts, tasks can only be re-sorted or introduced into the roadmap by passing through an objective valuation modal. The Wizard weights metrics using a non-linear **Fibonacci Scale (1, 2, 3, 5, 8)** to eliminate decision fatigue and false precision.
* **The Vault (Project File System):** A background management system that allows solo makers to capture, store, and hide away multiple inspirational project ideas. To enforce radical focus, **only one project can be active at a time**—switching projects reloads the entire application state.
* **The Devlog (Recent Wins):** Checking off a task triggers an instantaneous center-screen **pixel-art confetti modal burst** to celebrate incremental momentum. Completed tasks glide automatically out of the active workspace into a reverse-chronological "Recent Wins" historical log on the Home dashboard.
* **Ghost Entry & Brain Dumps:** Instantly offload raw mental clutter without interrupting your current focus. Use the global centralized **Action Dock (+)** to drop a "Quick Note" or use the dashed **"Ghost Card" entry** inside the "To Sort" column to queue unprioritized items for later review.

---

## 🛠️ Tech Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | Expo SDK 54 / React Native 0.81 | Cross-platform native compilation framework. |
| **Navigation** | Expo Router v6 | Native, file-based tab navigation & modal handling. |
| **Database** | Supabase (PostgreSQL + PostgREST) | Relational backing storage with real-time API bindings. |
| **Auth Model** | Anonymous Device Identity | Zero-friction onboarding; no email or password required. |
| **Secure Storage** | `expo-secure-store` | Hardware-backed keychains for local device identity retention. |
| **UI Components** | Tailwind CSS / NativeWind | Utility-first "Soft-Dark Synthwave" theme construction. |
| **Graphics** | `lucide-react-native` / `react-native-svg` | Vector icons and performance-optimized SVG progress rings. |

---

## 📐 Prioritization Architecture & Logic

The core placement engine acts as an objective validator for your roadmap, calculating real-time tier predictions inside the wizard using a dual-framework hybrid approach:

### 1. The RICE Formula
$$Score = \frac{Reach \times Impact \times Confidence}{Effort}$$

* **Reach:** How many users does this affect per milestone cycle?
* **Impact:** How much does this move the structural needle? *(1 = Minimal, 8 = Massive)*
* **Confidence:** How structurally sure are you of these exact estimates? 
* **Effort:** How many person-weeks will completion require? *(Lower effort yields higher scores)*

*Note: All slider selections utilize the Fibonacci progression `(1, 2, 3, 5, 8)`. This forces clear contrast between items, preventing analysis paralysis between arbitrary adjacent linear scales (e.g., a 6 vs. a 7).*

### 2. The MoSCoW Override & Tie-Breaker Filters
* **Must:** Overrides any calculated RICE mathematical score and routes the item **Always to High Priority**.
* **Won't:** Overrides any calculated RICE mathematical score and routes the item **Always to Later (The Icebox)**.
* **Should / Could:** Serves as a deterministic mathematical tie-breaker when two distinct tasks evaluate to identical RICE scores.

### 📊 Metric Thresholds
| MoSCoW / Calculated Score | Predicted Column Destination |
| :--- | :--- |
| `Must` | **High** (Enforced Always) |
| `Won't` | **Later** (Enforced Always) |
| Score $\ge 25$ | **High** |
| Score $10 - 24$ | **Med** |
| Score $< 10$ | **Low** |

---

## 🗂️ Data Schema

### `projects`
| Column | Type | Constraints / Description |
| :--- | :--- | :--- |
| `id` | `uuid` | Primary Key, Auto-generated |
| `name` | `text` | Project display name |
| `mission` | `text` | One-sentence orientation/purpose statement |
| `device_id` | `text` | Owning device hardware UUID (Row Level Security Key) |
| `user_id` | `uuid` | Nullable; Reserved for future cross-device sync authentication layers |
| `created_at` | `timestamptz` | Generation timestamp |

### `tasks`
| Column | Type | Constraints / Description |
| :--- | :--- | :--- |
| `id` | `uuid` | Primary Key, Auto-generated |
| `project_id` | `uuid` | Foreign Key references `projects(id)` ON DELETE CASCADE |
| `title` | `text` | Outcome-based goal/task title |
| `reach` | `int` | Fibonacci parameter (1 / 2 / 3 / 5 / 8) |
| `impact` | `int` | Fibonacci parameter (1 / 2 / 3 / 5 / 8) |
| `confidence` | `int` | Fibonacci parameter (1 / 2 / 3 / 5 / 8) |
| `effort` | `int` | Fibonacci parameter (1 / 2 / 3 / 5 / 8) |
| `moscow` | `text` | Filtering categorization enum (`Must` / `Should` / `Could` / `Won't`) |
| `priority_column` | `text` | Destination column assignment (`High` / `Med` / `Low` / `Later` / `To Sort`) |
| `completed` | `boolean` | State toggle flag, default `false` |
| `tags` | `text[]` | Flexible custom strategy tag array (e.g., Marketing, Core Feature, Maintenance) |
| `device_id` | `text` | Owning device hardware UUID (Row Level Security Key) |
| `created_at` | `timestamptz` | Generation timestamp |

---

## 🔒 Security Model (Device-Scoped Isolation)

ProjectHub runs a decentralized, zero-account architecture providing complete user data privacy out-of-the-box without requiring identity provider federation:

1.  **Identity Seeding:** On initial execution, `lib/deviceId.ts` evaluates local storage. If blank, it structuralizes a secure UUID v4 and commits it permanently into the platform's hardware secure enclave via `expo-secure-store` (iOS/Android) or `localStorage` fallback (Web environment).
2.  **Header Injection:** The singleton engine `lib/supabase.ts` exposes a reactive context. On startup, `store/appStore.ts` reads the device UUID, mounts it inside the active memory loop, and passes it directly into a custom `x-device-id` HTTP header binding on every outgoing standard network call.
3.  **RLS Enforcement:** PostgreSQL **Row Level Security (RLS)** is explicitly enabled on both database endpoints. All policies evaluate incoming transaction headers:
    ```sql
    CREATE POLICY "Device hardware enforcement rule" 
    ON public.tasks 
    FOR ALL 
    USING (device_id = current_setting('request.headers')::json->>'x-device-id');
    ```
4.  **Implicit Context Protection:** Requests dispatched without valid structural tracking attributes or containing variant headers yield zero matched tuples on query operations and terminate with structural `WITH CHECK` exceptions on mutations. This renders the global Supabase anon key safe to publish in client binaries.

---

## 💻 Local Development Setup

### Prerequisites
* Node.js 18+ (LTS recommended)
* NPM or Yarn package managers
* A clean Supabase project workspace instance (Free tier is perfectly sufficient)

### Steps

1.  **Clone and Install Dependencies:**
    ```bash
    git clone https://github.com/TalonDragon000/project-manager-app.git
    cd project-manager-app
    npm install
    ```

2.  **Environment Setup:**
    Create a `.env` file at your structural workspace project root directory:
    ```env
    EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_endpoint_url
    EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_public_anonymous_key
    ```

3.  **Apply Relational Migrations:**
    Copy and paste the sequential execution files found within `supabase/migrations/` directly into your remote Supabase Project SQL Editor interface in chronological order, or issue the schema directly utilizing the Supabase CLI infrastructure.

4.  **Launch Local Metro Server:**
    ```bash
    npm run dev
    ```
    * Press `i` to mount inside the local iOS simulator cluster.
    * Press `a` to route into the attached Android virtual device emulator.
    * Press `w` to spin up a responsive local web testing frame.

---

## 🛣️ Upcoming Roadmap

* [ ] **Strategy Specs Panel:** Interactive strategic configuration for project-specific target audiences (WHO / WHAT / WHY) inside the dashboard.
* [ ] **Cross-Device Account Sync:** An opt-in secondary authentication middleware layer to transform anonymous device tokens into unified multi-device profiles.
* [ ] **Data Archival Pipelines:** Toggle parameters to completely purge or permanently compress completed tasks from the active UI rendering context.
* [ ] **Project Velocity Analytics:** Visual telemetry reports tracing cycle execution speeds and milestone completion distributions over time.
* [ ] **Stale-Task Push Triggers:** Local automated operating system push notifications targeting high-priority goals lingering inside an unexecuted column profile.