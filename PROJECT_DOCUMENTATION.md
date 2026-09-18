# OrbitBoard — Project Documentation

**OrbitBoard** is a Reddit-style niche community & discussion platform built with **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4**, and **Socket.IO**. It supports user authentication, community "Orbits" (subreddit-style groups), posts, comments, chat, and moderation tools.

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Project Structure](#project-structure)
3. [App Pages (Routing)](#app-pages-routing)
4. [Contexts (Global State)](#contexts-global-state)
5. [Hooks](#hooks)
6. [Services (API Layer)](#services-api-layer)
7. [Mock Data](#mock-data)
8. [UI Components](#ui-components)
9. [Layout Components](#layout-components)
10. [Feature Components](#feature-components)
11. [Utils](#utils)
12. [Config Files](#config-files)

---

## Tech Stack

| Technology | Purpose |
|---|---|
| **Next.js 16.3.4** | React framework with App Router, SSR, and Turbopack |
| **React 19.2.8** | UI library |
| **Tailwind CSS v4** | Styling with CSS variables for theming |
| **Socket.IO Client** | Real-time communication (chat, live updates) |
| **Framer Motion** | Animations |
| **Lucide React** | Icon library |
| **React Hook Form** | Form state management |
| **React Hot Toast** | Toast notifications |
| **Emoji Picker React** | Emoji picker in text areas |
| **date-fns** | Date formatting utilities |
| **tailwind-merge + clsx** | Class name merging utility |

---

## Project Structure

```
OrbitBoard/
├── public/                    # Static assets (images, SVGs)
├── src/
│   ├── app/                   # Next.js App Router pages
│   │   ├── (auth)/            # Authentication pages group
│   │   ├── (main)/            # Main app pages group
│   │   ├── layout.jsx         # Root layout with providers
│   │   ├── page.jsx           # Landing/onboarding page
│   │   └── globals.css        # Global styles & theme tokens
│   ├── components/
│   │   ├── ui/                # Reusable UI primitives
│   │   ├── layout/            # App shell components
│   │   ├── feed/              # Feed-related components
│   │   ├── comments/          # Comment thread components
│   │   ├── post/              # Post creation & display
│   │   ├── chat/              # Chat/messaging components
│   │   └── mod/               # Moderation components
│   ├── context/               # React Context providers
│   ├── hooks/                 # Custom React hooks
│   ├── services/              # API service layer (mock)
│   ├── mock/                  # Mock data files
│   └── utils/                 # Utility functions
├── next.config.mjs            # Next.js configuration
├── tailwind.config.js         # Tailwind configuration
├── eslint.config.mjs          # ESLint configuration
└── package.json               # Dependencies & scripts
```

---

## App Pages (Routing)

### Root Layout — `src/app/layout.jsx`
The root layout wraps the entire app with three providers in order:
1. **ThemeProvider** — handles light/dark theme
2. **AuthProvider** — handles user session
3. **SocketProvider** — handles real-time socket connection

It also renders a global `<Toaster>` for toast notifications.

### Landing Page — `src/app/page.jsx`
The public landing/onboarding page. Shows the Orbit branding with **"Create an Account"** and **"Log In"** buttons, plus a **"Continue as Guest"** link.

### Auth Pages — `src/app/(auth)/`

| Route | File | Purpose |
|---|---|---|
| `/onboarding` | `onboarding/page.jsx` | Full-screen welcome page with a phone mockup image, brand identity, and auth CTAs |
| `/login` | `login/page.jsx` | Login form with email + password validation |
| `/forgot-password` | `forgot-password/page.jsx` | Email input to request a password reset code |
| `/verify-otp` | `verify-otp/page.jsx` | 6-digit OTP verification with a 60-second resend timer (dev-only mock OTP generation) |
| `/reset-password` | `reset-password/page.jsx` | New password + confirm password form with success state |
| `/register/enter-fullname` | `register/enter-fullname/page.jsx` | Step 1 of 4: Full name input |
| `/register/enter-username` | `register/enter-username/page.jsx` | Step 2 of 4: Username + avatar upload |
| `/register/enter-email` | `register/enter-email/page.jsx` | Step 3 of 4: Email address input |
| `/register/enter-password` | `register/enter-password/page.jsx` | Step 4 of 4: Password + confirm, shows success modal |

The auth layout (`(auth)/layout.jsx`) provides a shared header with the Orbit logo, a centered content area, and a footer with privacy/terms links.

### Main App Pages — `src/app/(main)/`

| Route | File | Purpose |
|---|---|---|
| `/` | `page.jsx` | Main feed page (currently a stub) |
| `/r/[orbitName]` | `r/[orbitName]/page.jsx` | Individual orbit/community page (stub) |
| `/r/[orbitName]/post/[postId]` | `r/[orbitName]/post/[postId]/page.jsx` | Individual post detail page (stub) |
| `/profile/[username]` | `/profile/[username]/page.jsx` | User profile page (stub) |
| `/r/messages` | `r/messages/page.jsx` | Direct messages page (stub) |
| `/r/mod` | `r/mod/page.jsx` | Moderation desk page (stub) |

> **Note:** The main app pages are currently empty stubs — the components they will use are already built.

---

## Contexts (Global State)

### `src/context/ThemeContext.jsx`
Provides light/dark theme management.

- **Themes:** `ocean` (light) and `blue-dark` (dark)
- **Initial theme:** Determined before first render from `localStorage` or system `prefers-color-scheme`
- **Exposes:** `{ theme, setTheme, toggleTheme, themes }`
- **Effect:** Injects CSS variables into `document.documentElement` and toggles the `.dark` class

### `src/context/AuthContext.jsx`
Provides authentication state and session management.

- **State:** `{ user, token, loading }`
- **Persistence:** Reads/writes `orbitboard_token` and `orbitboard_user` in `localStorage`
- **Exposes:** `{ user, token, loading, isAuthenticated, login, logout, updateUser }`
- **Methods:**
  - `login(userData, authToken)` — saves session to state + localStorage
  - `logout()` — clears session from state + localStorage
  - `updateUser(updatedFields)` — merges updated fields into the user object

### `src/context/SocketContext.jsx`
Provides a real-time Socket.IO connection.

- **Uses `useSyncExternalStore`** (React 19 pattern) to expose the socket instance and connection status without calling `setState` inside effects
- **Connection:** Connects to `NEXT_PUBLIC_SOCKET_URL` (defaults to `http://localhost:5000`) with the auth token
- **Exposes:** `{ socket, isConnected }`
- **Cleanup:** Disconnects the socket and resets state when the user logs out or the token changes

---

## Hooks

### `src/hooks/useAuth.js`
Custom hook that returns the `AuthContext` value. Throws an error if used outside an `AuthProvider`.

### `src/hooks/useTheme.js`
Custom hook that returns the `ThemeContext` value. Throws an error if used outside a `ThemeProvider`.

### `src/hooks/useSocket.js`
Currently an empty stub file (no implementation yet).

---

## Services (API Layer)

All services are **mock implementations** with simulated network delays. They are designed to be swapped out for real API calls later.

### `src/services/authService.js`
Authentication API:
- `login({ email, password })` — finds a mock user by email, returns `{ user, token }`
- `register({ username, email, password })` — creates a new mock user with a DiceBear avatar
- `requestPasswordReset(email)` — mock OTP request
- `verifyOtpAndResetPassword({ email, otp, newPassword })` — mock OTP verification
- `getCurrentUser()` — returns the default mock user

### `src/services/postService.js`
Post feed API:
- `getPosts({ orbitName, sortBy })` — fetches posts, optionally filtered by orbit, sorted by `hot` / `new` / `top`
- `getPostById(postId)` — fetches a single post
- `votePost(postId, direction)` — upvote/downvote a post (1, -1, or 0)
- `createPost({ orbitId, orbitName, title, type, bodyText, imageUrl, linkUrl, author })` — creates a post, auto-generates a link preview for `link` type posts

### `src/services/orbitService.js`
Orbit/community API:
- `getAllOrbits()` — returns all mock orbits
- `getOrbitByName(name)` — finds an orbit by name
- `toggleJoinOrbit(orbitId, userId)` — mock join/leave action

### `src/services/commentService.js`
Comment API:
- `getCommentsByPostId(postId)` — fetches comments and builds a nested tree
- `createComment({ postId, parentId, content, author, attachments })` — adds a comment or reply
- `voteComment(commentId, direction)` — upvote/downvote a comment

### `src/services/chatService.js`
Direct messaging API:
- `getConversations(userId)` — returns mock conversation list
- `getMessagesByConversationId(conversationId)` — returns messages for a conversation
- `sendMessage({ conversationId, senderId, receiverId, text, attachments })` — sends a new message

### `src/services/modService.js`
Moderation API:
- `getPendingReports(orbitId)` — returns pending moderation reports
- `softDeleteContent({ targetType, targetId })` — soft-deletes a post/comment
- `resolveReport(reportId, action)` — resolves or dismisses a report

---

## Mock Data

### `src/mock/mockUsers.js`
Three mock users:
- `alex_dev` (usr_001) — regular member
- `sarah_code` (usr_002) — member + moderator of r/reactjs
- `orbit_admin` (usr_003) — global admin

Also exports `currentUserMock` (defaults to `alex_dev`).

### `src/mock/mockOrbits.js`
Three mock communities:
- `r/reactjs` — React & Modern Frontend (14,850 members)
- `r/webdev` — Web Development & Architecture (22,100 members)
- `r/uiux` — UI/UX & Product Design (9,400 members)

Each orbit has rules, moderators, and member counts.

### `src/mock/mockPosts.js`
Three mock posts:
- `post_101` — Link post in r/reactjs about React 19 (342 votes, pinned)
- `post_102` — Text post in r/webdev about comment tree architecture (185 votes)
- `post_103` — Image post in r/uiux about ocean theme variables (94 votes)

### `src/mock/mockComments.js`
Four mock comments for `post_101`:
- `cmt_501` — Root comment by alex_dev
- `cmt_502` — Reply to cmt_501 by sarah_code
- `cmt_503` — Nested reply to cmt_502 by orbit_admin (with PDF attachment)
- `cmt_504` — Second root comment by orbit_admin

---

## UI Components

### `src/components/ui/Button.jsx`
Reusable button with variants (`primary`, `secondary`, `danger`, `ghost`) and sizes (`sm`, `md`, `lg`). Supports `isLoading` state with a spinner.

### `src/components/ui/FloatingLabelInput.jsx`
Base input component with a floating label that animates above the input when focused or filled. Supports error states, max length, and a right-side element (e.g., password toggle).

### `src/components/ui/TextInput.jsx`
Text input wrapper around `FloatingLabelInput`. Restricts input to letters, spaces, and hyphens. Live validation: minimum 4 characters.

### `src/components/ui/EmailInput.jsx`
Email input wrapper around `FloatingLabelInput`. Live email format validation.

### `src/components/ui/PasswordInput.jsx`
Password input with show/hide toggle and a live requirements checklist (6-15 chars, uppercase, lowercase, number, special symbol). Supports `hideRequirements` prop to skip the checklist.

### `src/components/ui/NumberInput.jsx`
Numeric input for OTP codes. Strips non-digits, enforces max length, and supports paste handling.

### `src/components/ui/SelectDropdown.jsx`
Custom dropdown select with click-outside-to-close behavior and a checkmark on the selected option.

### `src/components/ui/TextArea.jsx`
Auto-growing textarea with expand/collapse toggle and a character counter.

### `src/components/ui/SearchPillInput.jsx`
Collapsible search input that expands from a search icon into a pill-shaped input field.

### `src/components/ui/RichTextArea.jsx`
Rich text input with attachment support (file upload), emoji picker, and a send button. Used for chat/messaging.

### `src/components/ui/EmojiPickerPopover.jsx`
Popover wrapper around the `emoji-picker-react` library. Closes on outside click.

### `src/components/ui/AttachmentPreviewBar.jsx`
Horizontal bar showing uploaded file attachments with remove buttons.

### `src/components/ui/FileUploadInput.jsx`
Drag-and-drop file upload with image preview, remove button, and error state.

### `src/components/ui/Modal.jsx`
Reusable modal with backdrop blur, close button, and title.

### `src/components/ui/Avatar.jsx`
Circular avatar with sizes (`sm`, `md`, `lg`). Falls back to the first letter of the alt text if no image.

### `src/components/ui/Badge.jsx`
Small pill badge with variants (`info`, `mod`, `admin`).

### `src/components/ui/ProgressBar.jsx`
Step progress bar with dynamic color (orange → yellow → green) and percentage display.

---

## Layout Components

### `src/components/layout/Navbar.jsx`
Sticky top navigation bar with:
- OrbitBoard logo
- Search pill input
- Theme toggle button
- Messages link with notification dot
- User dropdown menu (profile, moderation desk, logout)
- Login/Sign Up buttons for guests

### `src/components/layout/SidebarLeft.jsx`
Desktop left sidebar (hidden on mobile) with:
- Primary navigation (Home Feed, Popular & Hot, Explore Orbits)
- "Your Orbits" community list with member counts

### `src/components/layout/SidebarRight.jsx`
Desktop right sidebar (hidden on smaller screens) with:
- Orbit overview widget (avatar, description, member/online counts)
- Community rules widget
- Trending discussions widget

### `src/components/layout/MobileBottomBar.jsx`
Mobile bottom navigation bar with Home, Explore, Create (primary FAB), Chat, and Profile tabs.

### `src/components/layout/Header.jsx`
Currently an empty stub file.

---

## Feature Components

### Feed Components — `src/components/feed/`

| Component | Purpose |
|---|---|
| `postCard.jsx` | Post card for the feed (currently empty stub) |
| `VoteBox.jsx` | Upvote/downvote control with vote count and active state colors |
| `LinkPreviewCard.jsx` | Rich link preview card with image, domain, title, and description |
| `FeedFilterTabs.jsx` | Filter tabs for Hot / New / Top / Rising |
| `CreatePostDrawer.jsx` | Slide-in drawer from the right containing the `CreatePostForm` |

### Comment Components — `src/components/comments/`

| Component | Purpose |
|---|---|
| `CommentThread.jsx` | Top-level comment section with a form and recursive comment tree rendering |
| `CommentItem.jsx` | Individual comment with collapse/expand, voting, reply form, and nested replies |
| `CommentForm.jsx` | Comment input with emoji picker, image/link buttons, and submit |

### Post Components — `src/components/post/`

| Component | Purpose |
|---|---|
| `OpenGraphCard.jsx` | Open Graph link preview card for post detail pages |
| `CreatePostForm.jsx` | Full post creation form with orbit selector, content type tabs (text/media/link), title, and body |

### Chat Components — `src/components/chat/`

| Component | Purpose |
|---|---|
| `ChatThread.jsx` | Full chat thread with message list, auto-scroll, and input bar |
| `ConversationList.jsx` | List of conversations with avatars, last message preview, and active state |
| `ChatWindow.jsx` | Chat window with header, message bubbles, and input form |
| `MessageBubble.jsx` | Individual message bubble (left for received, right for sent) |

### Mod Components — `src/components/mod/`

| Component | Purpose |
|---|---|
| `ReportQueueCard.jsx` | Moderation report card with ignore/remove actions and a confirmation modal |
| `UserModActions.jsx` | Mod tools for a user: mute and ban buttons with a ban confirmation modal |

---

## Utils

### `src/utils/cn.js`
Class name utility combining `clsx` and `tailwind-merge` for conditional Tailwind classes.

### `src/utils/formatTime.js`
- `formatTimeAgo(dateString)` — formats a timestamp as a compact relative time (e.g., "5m ago", "2h ago", "3d ago")
- `formatDate(dateString, formatStr)` — formats a timestamp as a full date (e.g., "Sep 1, 2026")

### `src/utils/treeHelpers.js`
- `buildCommentTree(flatComments)` — transforms a flat array of comments into a nested tree structure with `replies` arrays
- `countTotalComments(commentTree)` — recursively counts all comments including nested replies

---

## Config Files

### `next.config.mjs`
- Enables the **React Compiler** (`reactCompiler: true`)
- Configures remote image patterns for `res.cloudinary.com`

### `tailwind.config.js`
- Enables class-based dark mode (`.dark` class)
- Maps CSS variables to Tailwind color utilities:
  - `main` → `var(--bg-main)`
  - `surface` / `surface-hover` → `var(--bg-surface)` / `var(--bg-surface-hover)`
  - `border-subtle` → `var(--border-subtle)`
  - `text-primary` / `text-secondary` → `var(--text-primary)` / `var(--text-secondary)`
  - `accent` → `var(--accent-warm)`

### `src/app/globals.css`
- Defines **Ocean Light** theme tokens on `:root`
- Defines **Ocean Dark** theme tokens on `.dark`
- Maps tokens to Tailwind v4 `@theme` colors
- Custom scrollbar styling

### `eslint.config.mjs`
- Uses `eslint-config-next/core-web-vitals` with global ignores for `.next`, `out`, `build`, and `next-env.d.ts`

---

## How to Run

```bash
# Install dependencies
npm install

# Start the development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run ESLint
npm run lint
```

---

## Key Notes

1. **All services are mock implementations** — they simulate network delays and use in-memory data. To connect a real backend, replace the service functions with actual API calls.
2. **The main app pages are stubs** — the components they will use (feed, comments, chat, mod) are already built and ready to be wired in.
3. **Theming is CSS-variable based** — the `ThemeContext` injects CSS variables at runtime, and Tailwind utilities reference them via the `@theme` mapping.
4. **Socket.IO is configured** — the `SocketContext` connects to `NEXT_PUBLIC_SOCKET_URL` (default `http://localhost:5000`) when a user is authenticated.
5. **React 19 patterns** — the codebase uses `useSyncExternalStore` for external systems (socket) and avoids `setState` in effects where possible.