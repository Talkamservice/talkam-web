# Design-fidelity audit — v2 web UI vs `.dc.html` decks

The decks in `Talkam mental wellness design system/` are **exact specifications**.
One-to-one replication: same sections in the same order, same components, same copy
verbatim, same item ordering and direction, same chart types, same buttons, icons,
QR codes, badges, borders, backgrounds. Nothing added, removed, or "improved".

**Allowed deviations** (each one listed explicitly per page):

- (a) deck-only affordances (variant/tab switchers) converted to real routes
- (b) responsive behaviour below the deck's designed width (decks are `min-width:1180px`)
- (c) anything physically impossible in the stack

Method per page: deck rendered headless at 1440×900 (DSF 2) from the `.dc.html`
source, implementation rendered at the same viewport, compared section by section
top to bottom, cross-checked against the deck's literal markup for true values.

---

## 1. B2B Employee Dashboard

Deck: `TalkAM B2B Employee Dashboard.dc.html` · Routes: `/business/employee/*`
Deck screens: Home, My Sessions, Check-ins & Mood, Community, Messages,
Profile & Privacy, Help & Support (deck `sc-if` page states → real routes).

### 1.1 Shell — sidebar

| # | Section | Deck | Implementation (before) | Type |
|---|---------|------|--------------------------|------|
| 1 | Sidebar width | `224px` | `232px` | size |
| 2 | Block under logo | Teal privacy strip: shield icon + "Private by default — Zenith Bank never sees this", `rgba(59,168,143,0.12)` bg, `rgba(59,168,143,0.25)` border, radius 10, text `#6FCDB6` @10.5px | Workspace card with avatar "C" + "Chidinma Eze" / "Zenith Bank Nigeria" | wrong component |
| 3 | Portal label | "My Wellbeing" | "My Wellbeing" | ✅ |
| 4 | Nav item type scale | 13px / weight 600 / `rgba(255,255,255,0.45)` / padding `9px 10px` / radius 10 / gap 10 | 13px/600 but gap 2.5 (10px) ✅, padding ✅ | ✅ |
| 5 | Active nav | `background:rgba(1,127,200,0.2); color:#fff` — icon inherits `currentColor` | Active icon force-coloured `text-brand-400` | colour |
| 6 | Nav order | Home, My Sessions `1`, Check-ins & Mood, Community, Messages `2`, ACCOUNT, Profile & Privacy, Help & Support, Sign Out | same order ✅ | ✅ |
| 7 | "My Sessions" count pill | `rgba(59,168,143,0.28)` bg, `#6FCDB6` text | `bg-wellness-400/30`, `text-[#7FDCC6]` | colour |
| 8 | "Messages" count pill | `rgba(1,127,200,0.28)` bg, `#68B4E1` text | `bg-brand-400/30 text-brand-200` | colour |
| 9 | Section label | `ACCOUNT` — 9px, weight 700, `rgba(255,255,255,0.2)`, tracking .1em, padding `12px 8px 6px` | "Account" (title case, CSS-capitalised) | copy |
| 10 | Sidebar footer user | avatar `#EEF4FC` bg / `#015C94` "C", name "Chidinma Eze", sub "Zenith Bank Nigeria", **no chevron, not a button** | same but with `ChevronUp` + click-to-open sign-out popover | extra element |
| 11 | Logo tile gradient | `linear-gradient(135deg,#017FC8,#02D8FD)` | ✅ | ✅ |

### 1.2 Shell — topbar

| # | Section | Deck | Implementation (before) | Type |
|---|---------|------|--------------------------|------|
| 12 | Search field | **absent** on the employee deck | Search input present (`xl:` and up) | extra element |
| 13 | Primary CTA colour | teal `#3BA88F`, shadow `0 4px 12px rgba(59,168,143,0.25)` | blue `bg-brand-400` | colour |
| 14 | Primary CTA label | "Book a Session" | "Book a session" | copy |
| 15 | Notification bell | 34×34, radius 9, `#F2F3F7` bg, `#E8E9EF` border, stroke `#444`; unread dot 7×7 `#AC4242`, 1.5px white ring, `top:6px right:6px` | ✅ shape, dot always shown | ✅ / behaviour |
| 16 | Notification panel | 340px dropdown, "Notifications" + "Mark all read", 4 rows, unread rows `#F8F9FC` with kind-coloured dot | **missing entirely** | missing |
| 17 | Page title / subtitle | `Home` / `Chidinma · Zenith Bank Nigeria` | `Home` / `Your private wellbeing space` | copy |
| 18 | Subtitles, other pages | sessions `1 upcoming · 4 past sessions`; checkins `Private trend summary — full history on mobile`; community `Anonymous · trending this week`; messages `Encrypted · therapist chat`; profile `Account, consent & safety`; help `Answers, guides, and live help when you need it` | all six rewritten | copy |
| 19 | Content padding | `26px 28px`, gap 20px | `p-7` (28px all round), gap 20 | size |

### 1.3 Home

| # | Section | Deck | Implementation (before) | Type |
|---|---------|------|--------------------------|------|
| 20 | Section order | greeting → privacy note → check-in card → [next session ▏get the app] → 4 quick links → [fortnight chart ▏recommended] | greeting → privacy → check-in → [next session ▏get the app] → **wellbeing snapshot (full width)** → **3 quick links** → **recommended (full-width list)** | order |
| 21 | Greeting name | "Good morning, **Adaeze**" | "Good morning, **Chidinma**" | copy |
| 22 | V2 PREVIEW pill | purple gradient pill `linear-gradient(135deg,#6B44A8,#8B5FC2)`, white dot, 10px/800, tracking .05em, shadow `0 3px 8px rgba(107,68,168,0.3)` | **missing** | missing |
| 23 | Greeting size | 20px / weight 900 / `-0.01em` | `text-h2` (24px) / 800 | size |
| 24 | Privacy note | `#F5F0FF` bg, `#E3D5FF` border, radius 12, padding `12px 16px`, shield icon `#6B44A8`, text 12px `#5A3990` | ✅ (InfoStrip purple) | ✅ |
| 25 | Check-in heading | "How are you feeling today?" 14px/800 + "A 5-second check-in — private to you" 11px | ✅ | ✅ |
| 26 | **Mood scale direction** | **Rough → Low → Okay → Good → Great** | **Great → Good → Okay → Low → Rough** (reversed) | order |
| 27 | Mood tile style | `flex:1`, column, gap 5, padding `11px 6px`, radius 12, border 1.5px `#EEF0F4`, bg `#fff`; selected border `#017FC8` bg `#EEF4FC`; emoji 26px; label 11px/700 `#444` | radius/border/colour all differ, label colour differs | style |
| 27b | Mood-message note under row | **not present on Home** (only on Check-ins) | extra paragraph rendered on pick | extra element |
| 28 | "Logged today" badge | `#E8F7F4` bg / `#1F6B59` / 11px / 700 / "✓ Logged today" | Badge with a dot, text "Logged today" | copy/style |
| 29 | Grid split | `1.3fr 1fr` | `1.4fr 1fr` | size |
| 30 | Next session card | radius 16, padding `22px 24px`, gradient `135deg,#141B34,#1A2E5A`, shadow `0 4px 16px rgba(20,27,52,0.18)`, teal radial glow `rgba(59,168,143,0.16)` top-right | radius 16 ✅, padding 20, **blue** radial glow `rgba(1,127,200,0.28)`, no shadow | style |
| 31 | Next-session eyebrow | 7px teal dot + "NEXT SESSION" 10px/700 `#6FCDB6` tracking .08em | dot 6px, text `text-white/60` | colour |
| 32 | Therapist avatar | 52×52 circle `#017FC8`, initials 18px/800 | 44×44 | size |
| 33 | Therapist name / meta | 17px/800 white; meta 12px `rgba(255,255,255,0.5)` | 15px; meta `text-white/60` | size |
| 34 | Session buttons | 3 × `flex:1` full-width row, margin-top 20: **Reschedule** (`rgba(255,255,255,0.1)`, border `rgba(255,255,255,0.18)`, white), **Cancel** (`rgba(172,66,66,0.15)`, border `rgba(172,66,66,0.3)`, `#FF9B9B`), **Join Room** (`#3BA88F`, white, weight 800) | auto-width pills; Cancel styled identical to Reschedule (grey); Join Room **blue** | colour/size |
| 35 | Get the app — QR code | 88×88 white tile, `#E2E2E2` border, radius 10, 6px pad, 8×8 grid of `#141B34`/`#fff` cells from a fixed 64-value seed | **missing entirely** | missing |
| 36 | Store buttons | stacked **vertically**, `#141B34` bg, radius 9, padding `8px 10px`; caption 9px `rgba(255,255,255,0.5)` "Download on the" / "Get it on"; name 11.5px/800 | horizontal row, caption "GET IT ON" (uppercased) | order/copy |
| 37 | Quick links | **4** cards, `repeat(4,1fr)`, gap 14, each column-flex gap 10, icon tile 38×38 radius 11: (1) Daily check-in / "How are you feeling today?" `#FFF0F0`+`#AC4242` activity, (2) Trending in Community / "Work Stress is trending this week" `#EEF4FC`+`#017FC8` message-square, (3) Message your therapist / "2 unread messages" `#E8F7F4`+`#3BA88F` message-circle, (4) Rate your last session / "With Dr. Chioma O. · Jul 2" `#FBF5E8`+`#9A6E0A` check | **3** cards (Daily check-in / Community "Talk freely, anonymously" / My sessions "Upcoming and past"), horizontal layout, 40×40 tiles | count/copy/layout |
| 38 | Wellbeing block position | right after quick links, grid `1.5fr 1fr` with "Recommended for you" beside it | before quick links, full width | order |
| 39 | Wellbeing title | "Your wellbeing this fortnight" / "Trending up — private to you" + "View check-ins →" link `#017FC8` 12px/700 | "Wellbeing snapshot" / "Last 14 days · private to you", no link | copy/missing |
| 40 | **Chart type** | **area line chart** — 70px tall SVG, 14-point polyline `#3BA88F` 2.5px non-scaling stroke + gradient fill `#3BA88F` .28→0, values `[40,55,45,60,50,70,65,75,68,80,72,85,78,88]` | **bar chart**, blue bars, different values | chart type |
| 41 | Chart position | **below** the header, **above** the stats | below the stats | order |
| 42 | Stats | **3** tiles `repeat(3,1fr)` gap 12, centred, `#F8F9FC` bg radius 12 padding `12px 6px`, value 19px/900, label 10.5px `#858585`: `7` "day check-in streak" `#3BA88F`, `4 / 6` "sessions used this quarter" `#017FC8`, `+18%` "mood vs last month" `#1F8A5B` | **4** tiles: `7 days` "Check-in streak", `Good` "Average mood", `21` "Days logged", `+12%` "vs last month" | count/copy |
| 43 | Recommended for you | right column, heading 13px/800, **2** cards (`class="card"`, row, gap 13, `flex:1`): icon tile 42×42 radius 12 tinted; eyebrow 9.5px/800 tracking .08em in accent; title 13px/800; sub 11px `#858585`. Items: **GUIDED / "5-minute box breathing" / "Calm your nervous system before a busy day"** (`#EEF4FC`/`#017FC8`, activity path) and **READ / "Setting boundaries at work" / "A practical guide from the TalkAM library"** (`#E8F7F4`/`#1F6B59`, book path) | full-width PanelCard "Recommended for you" / "From the TalkAM Journal" with **3 blog article rows** (grounding techniques / sleep science / anxiety at work) + chevrons | content replaced |

### 1.4 My Sessions

| # | Section | Deck | Implementation (before) | Type |
|---|---------|------|--------------------------|------|
| 44 | Section order | summary strip → [next-session hero ▏prep checklist] → care team → History → cancellation policy | summary strip → next session card → prep checklist → care team → **tabs** → list | order |
| 45 | Summary strip | 4 cards `repeat(4,1fr)` gap 12, padding `16px 18px`, value 22px/900 accent, label 11.5px: `1` Upcoming `#017FC8`, `4` Completed `#141B34`, `2 / 6` Sessions used `#1F8A5B`, `😄` Mood trending up `#9A6E0A` | `1` Upcoming, `3` Completed, `4 / 6` Used this cycle, `+12%` Mood trend — all navy | copy/values/colour |
| 46 | Next-session hero | own card: gradient `135deg,#0F1E3D,#17305C`, radius 18, border `#1E2D5A`, padding 22, teal radial `rgba(59,168,143,0.28)`; header row "YOUR NEXT SESSION" 11px/800 tracking .1em `#6FCDB6` + type pill "Video"; avatar 52×52 **radius 15** + shadow; name 18px/800; when `Today · 4:00 PM – 4:50 PM WAT`; buttons **Join Room →** (`#3BA88F`, `flex:1`, radius 11, shadow), Reschedule, Cancel (`rgba(255,80,80,0.14)` / `#FF9E9E`) | reuses the Home next-session card verbatim (wrong gradient, radius, copy, button order and labels) | wrong component |
| 47 | Prep checklist | card beside hero (`1.5fr 1fr`): "Before you join" 13px/800 + "A calmer session starts here" 11px; 3 rows with 20×20 checkbox (done = `#3BA88F` filled + white tick, todo = `#fff` + `#D2D6E0` border); done text `#9299A8` **line-through**; items: "Complete your pre-session mood check-in" ✓, "Find a quiet, private space" ✓, "Jot down what you'd like to talk about" ☐ | full-width card, subtitle "A short prep list — it makes the 50 minutes count", 3 grey tiles with green CheckCircle for all, different labels + invented notes | layout/copy/state |
| 48 | Care team | heading "Your care team" 13px/800 above the card; card row: 56×56 radius 16 avatar; name 15px/800 + `★ 4.9` gold; "Clinical Psychologist · Anxiety · Work stress" 12px; note "Continuing work on boundary-setting and box-breathing." 11.5px `#5B6577`; right column: **Message** (`#017FC8` filled) over **Book again** (`#F2F3F7` outline) | no heading; rating as a gold Badge; title only; note inside a blue InfoStrip with different copy; buttons horizontal, Message = secondary, Book again = primary blue | layout/copy/colour |
| 49 | Session tabs | **none** — the deck lists history directly under a "History" heading | Upcoming/Past tab switcher added | extra element |
| 50 | History list | "History" heading 13px/800, then a white radius-16 card; rows padding `14px 20px`, 38×38 circle avatar, name 13px/700 + date `Jul 2 · Video · 50 min` 11px, private mood-shift emoji `😔→🙂`, status pill (`Completed` green / `No-show` red), "Rate session" button when applicable, ⋯ report menu. 4 rows: Dr. Chioma O. Jul 2 (Completed, ratable, 😔→🙂), Dr. Adewale K. Jun 25 (Completed, 😐→🙂), Dr. Adewale K. Jun 11 (Completed), Dr. Chioma O. May 28 (**No-show**) | 3 invented past rows with focus tags, blue type badges, star ratings; no mood shift, no no-show, no ⋯ menu | content replaced |
| 51 | Cancellation policy | `#EEF4FC` strip, radius 12, padding `12px 16px`, 12px `#015C94`: "Cancellation policy: full refund up to 24 hours before your session, 50% refund within 24 hours, no refund for no-shows." | **missing** | missing |

### 1.5 Check-ins & Mood

| # | Section | Deck | Implementation (before) | Type |
|---|---------|------|--------------------------|------|
| 52 | Section order | stats strip → check-in card → [mood trend ▏streak card] → [driving factors ▏recent check-ins] | privacy strip → stats → check-in → [trend ▏top factors] → recent check-ins | order |
| 53 | Privacy strip | **not on this screen** | `PrivacyStrip` rendered at the top | extra element |
| 54 | Stats strip | `9` day streak `#3BA88F`, `🙂` avg mood `#017FC8`, `12 / 14` days logged `#141B34`, `+18%` vs last month `#1F8A5B` — value 22px/900, label 11.5px | `7 days` Current streak, `Good` Average mood, `21` Days logged, `+12%` vs last month | copy/values/colour |
| 55 | Check-in header | "How are you feeling today?" + "A quick daily check-in — takes 5 seconds, seen only by you" | "Today's check-in" + "Pick how you're feeling, then tag what's driving it" | copy |
| 56 | **Mood scale direction** | **Great → Good → Okay → Low → Rough** (opposite of Home — deliberate in the deck) | Great → Good → Okay → Low → Rough ✅ | ✅ |
| 57 | Mood tile style | padding `14px 8px`, radius 12, bg `#F8F9FC`, border 1.5px `#E8E9EF`, text `#717171`; active bg `#EEF4FC`, border `#017FC8`, text `#015C94` | different (shared MoodRow) | style |
| 58 | Factor prompt | "What's affecting your mood? *(optional)*" — 12px/700 navy with the parenthetical 400-weight `#858585` | "WHAT'S DRIVING IT? (OPTIONAL)" uppercase 11px | copy |
| 59 | Factor chips | **emoji + label**: 💼 Work, 😴 Sleep, 👨‍👩‍👧 Family, 🩺 Health, 💰 Finances, 💬 Relationships, 🏃 Exercise, 🧘 Rest; pill radius 9999, padding `8px 13px`, 12.5px/700, border 1.5px `#E8E9EF`, bg white, text `#5B6577`; selected border `#017FC8` bg `#EEF4FC` text `#015C94` | labels only, no emoji; unselected `bg-ink-100`; selected solid navy + "✓" | style/missing |
| 60 | Mood message box | always visible, `#F8F9FC` radius 10, padding `11px 14px`, 12px `#444`; default "Pick a mood above and we'll check in with a short note." | only rendered after a pick, green tint, sits above the factors | style/order |
| 61 | Save button | right-aligned, height 46, radius 11, `#3BA88F` when a mood is picked else `#C7CEDA` | left-aligned blue `PrimaryButton` | colour/position |
| 62 | "✓ Saved today" badge | `#E8F7F4`/`#1F6B59` pill in the card header after save | **missing** | missing |
| 63 | Mood trend card | grid `2fr 1fr`; header "Your mood trend" + "Last 14 days · visible only to you" + `▲ Trending up` badge; **bar chart** 110px, 14 bars `#D1EEFE` with the last `#017FC8`, radius `3px 3px 0 0`, values `[55,62,48,70,66,58,72,80,64,58,75,68,60,74]`; axis labels "Jun 26" / "Jul 9" | "Mood trend" / "Last 14 days"; no badge; 120px bars; different values; no axis labels | copy/size/missing |
| 64 | Streak card | navy gradient card beside the trend: "STREAK" 11px/700 `rgba(255,255,255,0.5)` tracking .06em, `9 days` 34px/900 white, "Longest yet — keep it up", footnote "Detailed journaling and full mood history live in the mobile app." | **missing** — replaced by a "Top factors" card | missing |
| 65 | Driving factors | grid `1fr 1.6fr`; card "What's driving your mood" 14px/800 + "Most-logged factors · last 14 days"; 3 bars height 6 radius 3 on `#F0F0F2`: Work 64% `#017FC8`, Sleep 48% `#6B44A8`, Rest 32% `#3BA88F`; label 12.5px/700 `#3E4A52`, pct 12px `#858585` | 4 factors with different labels/percentages/colours, 5px bars, pct coloured | count/values |
| 66 | Recent check-ins | plain card, title "Recent check-ins" 14px/800 (no subtitle); rows `11px 0` with 24px emoji, "Yesterday · Okay" 12.5px/700, note 11px, tags right-aligned 10.5px `#9299A8`; 3 seed rows: Yesterday 😐 Okay "Sleep · Work" "Tired but managed the workload.", Mon Jul 7 😄 Great "Exercise · Social" "Good session with Dr. Adewale.", Sun Jul 6 🙂 Good "Family · Rest" "Restful day with family." | PanelCard with subtitle "Only you can see these", 4 invented rows, tags inline as a grey badge | content replaced |

### 1.6 Community

| # | Section | Deck | Implementation (before) | Type |
|---|---------|------|--------------------------|------|
| 67 | Info strip | **blue** `#EEF4FC` / `#C9E2F9` border, info-circle `#015C94`: "Posting and replying happen in the mobile app under your anonymous username — never linked to your work account." | **purple** shield strip with different copy | colour/copy |
| 68 | Heading | "Trending topics this week" 13px/800 | **missing** | missing |
| 69 | Content | **6 topic cards** `repeat(3,1fr)` gap 14 — coloured name chip + "N posts", quoted snippet 13px `#444`, "— anonymous · Nh ago" 11px `#C4C8D4`. Work Stress 214 / Anxiety 181 / Relationships 97 / Grief 42 / Depression 88 / General Support 130, each with its own chip palette | **4 group cards** (Work Stress, Anxiety Support, Sleep & Rest, General Support) with member counts and "Open" buttons | content replaced |
| 70 | Footer CTA | full-width navy bar, height 48, radius 12, 13px/800: "Continue the conversation on the app →" | Card with a phone icon, "The full community lives on mobile" + paragraph + store badges | content replaced |

### 1.7 Messages

| # | Section | Deck | Implementation (before) | Type |
|---|---------|------|--------------------------|------|
| 71 | Info strip | purple `#F5F0FF`/`#E3D5FF`, shield `#6B44A8`: "End-to-end encrypted. Zenith Bank can see that messages were sent (daily/weekly totals only) — never who, when in detail, or what." | **missing** | missing |
| 72 | Layout | single white card, radius 16, border `#E8E9EF`, **fixed height 460px**, 260px thread rail + conversation pane | two separate PanelCards in a `280px 1fr` grid, no fixed height | layout |
| 73 | Thread rows | 3 threads: Dr. Adewale K. "That's completely understandable —" (`#017FC8`), Dr. Chioma O. "See you at our next session!" (`#3BA88F`), TalkAM Support "Your session receipt is ready" (`#858585`); active row `#EEF4FC` + 3px `#017FC8` left border; 36×36 avatar; no time, no unread pill | 2 invented threads with times and unread pills | content replaced |
| 74 | Conversation header | 34×34 avatar, "Dr. Adewale K." 13px/800, "● Online" 10px `#3BA88F` | PanelCard title + "End-to-end encrypted · never seen by your employer" | copy |
| 75 | Bubbles | 3 messages, max-width 70%, radius `14px 14px 14px 3px` (them, `#F0F0F2`) / `14px 14px 3px 14px` (me, `#017FC8`), 13px, **no timestamps** | different copy, timestamps, `rounded-ds-md` | style/content |
| 76 | Composer | 42px input radius 10 border 1.5px `#E2E2E2` + **"Send"** text button `#017FC8` radius 10 | 40px input + icon-only send button | size/copy |

### 1.8 Profile & Privacy

| # | Section | Deck | Implementation (before) | Type |
|---|---------|------|--------------------------|------|
| 77 | Grid | `1fr 1fr`, 5 cards in order: Profile, Privacy Settings, Security, Safety, Danger Zone | `xl:grid-cols-2`, 4 cards: consent, notifications, security, safety | order/count |
| 78 | Profile card | **missing entirely** — deck has Full Name `Chidinma Eze`, Work Email `chidinma.eze@zenithbank.com` (focused: `#017FC8` border + `0 0 0 3px rgba(1,127,200,0.1)` ring, label in brand blue), Community Username `quietharbor22` with the hint "Never shown to employer or therapist", and a navy **Save Changes** button (46px, radius 12) | not implemented | missing |
| 79 | Privacy Settings | title + "Your NDPA consent choices — change anytime"; 4 rows, each 13px/600 title + `Required`/`Optional` 10.5px sub; locked toggles rendered as **grey `#C4C8D4` switches in the on position**; Anonymous community on (`#3BA88F`), Anonymised research off (`#E2E2E2`) | "Your consent choices", per-item explanatory notes, `Required` badge + padlock icon instead of a toggle | copy/component |
| 80 | Notification preferences card | **not in the deck** | full card with 4 toggles | extra section |
| 81 | Security card | "Add an extra step to keep your account safe"; row "Two-factor authentication" + "Email a one-time code to your work email at every sign-in" (max-width 230px); when on, a `#E8F7F4` confirmation strip with a tick: "2FA is on — a 6-digit code is emailed to you each time you sign in." | "Add a second step when you sign in"; label "Two-factor authentication (2FA)"; different note; **no confirmation strip** | copy/missing |
| 82 | Safety card | "Something wasn't right in a session or chat?" + full-width left-aligned `#F2F3F7` button "Report a therapist or a session" | "Report a session or therapist — goes to TalkAM, never your employer" + inline "Report a concern" button with a flag icon | copy/style |
| 83 | Danger Zone | card with `#FFCDD2` border, title `#8B2E2E` "Danger Zone", "Permanent — cannot be undone", full-width `#AC4242` "Delete my account" button | **missing** | missing |

### 1.9 Help & Support

| # | Section | Deck | Implementation (before) | Type |
|---|---------|------|--------------------------|------|
| 84 | Grid | `1.5fr 1fr`, left: FAQ + Knowledge base; right: Still need help? + privacy note | `1.5fr 1fr`, left: crisis strip + FAQ; right: Talk to someone + Wellness reading + privacy note | order/count |
| 85 | Crisis strip | **not in the deck** | red "In crisis right now?" strip | extra section |
| 86 | FAQ | "Frequently asked questions" + "Quick answers before you reach out — most things are covered here."; `<details>` rows `#F8F9FC`, radius 12, border `#EEEEEE`, padding `13px 16px`; **6** questions (verbatim, listed in the deck script) | subtitle "The things members ask us most"; **5** different questions | copy/count |
| 87 | Knowledge base card | "Knowledge base" + "Guides and walkthroughs — powered by our Informly help center." + 200px dashed `#C9CEDA` placeholder with a book icon and the Informly note | **missing** | missing |
| 88 | Still need help? | "Still need help?" with 2 tiles (`#F8F9FC`, radius 12, border `#EEEEEE`): Live chat (`#017FC8` icon tile) and support@talkam.net (`#3BA88F`) | "Talk to someone", tiles use `bg-ink-50` + `#EEEEEE`, 8×8 icon tiles | copy/size |
| 89 | Wellness reading card | **not in the deck** | full PanelCard of blog links | extra section |
| 90 | Privacy note card | teal-tinted card `rgba(59,168,143,0.1)` border `rgba(59,168,143,0.25)`, title `#1F6B59` "Private by default", body `#3E5C54`: "Support requests you send here are never visible to Zenith Bank — only TalkAM staff can see them, same as your sessions and messages." | navy card, "Your privacy, always", different body | colour/copy |
| 91 | Informly launcher | fixed 52×52 `#017FC8` FAB bottom-right with chat icon and `0 10px 28px rgba(1,127,200,0.4)` shadow | **missing** | missing |

### 1.10 Modals

| # | Modal | Deck | Implementation (before) | Type |
|---|-------|------|--------------------------|------|
| 92 | Scrim / sheet | `rgba(10,18,32,0.55)`, sheet radius **18px**, shadow `0 24px 60px rgba(0,0,0,0.35)`; titled sheets get a 28×28 `#F2F3F7` close square | shared `Modal` — `navy-900/50` + backdrop blur, radius `ds-xl`, `shadow-e4`, plain × button | style |
| 93 | Reschedule | max-w 460; "Currently: Today · 4:00 PM with Dr. Adewale K. Pick a new available slot below."; 6 slots in a 2-col grid as single labels ("Thu Jul 9 · 10:00 AM"), selected = solid navy; gold note "Rescheduling more than 24h before your session is free and instant."; full-width navy **Confirm New Time** | subtitle = session time; 3-col slot grid with day/date over time, selected = brand tint; no gold note; right-aligned "Keep current time" + "Reschedule" | copy/layout/missing |
| 94 | Cancel | max-w 420; 48px red icon circle; "Cancel this session?"; body naming the **full refund** in teal + the 50% / no-show terms; two equal buttons **Keep Session** / **Cancel Session** | no icon; different body copy; right-aligned buttons "Keep session" / "Cancel session" | missing/copy |
| 95 | Feedback | max-w 440; "How was your session?" + "With Dr. Chioma O. · Jul 2 — private, only visible to you and TalkAM"; 34px stars; **post-session mood row** + mood note; textarea; full-width navy **Submit Feedback** | subtitle "Your rating is private to TalkAM"; 32px stars; **no mood row**; right-aligned "Skip" / "Submit rating" | missing/copy |
| 96 | Pre-session mood | "Before you join…" + the Zenith Bank privacy line; small mood row; full-width teal **Continue to Session Room →** (enters the in-call screen) | different subtitle; mood row + an invented 3-item checklist; "Not yet" / "Join session room →"; no in-call screen | copy/missing |
| 97 | Booking | max-w 440; therapist strip (AK · "Anxiety · CBT · Today at 4:00 PM WAT"); **"How would you like to connect?" — Video call / Voice call only**; blue reminder note; full-width navy **Confirm Session →** | SESSION TYPE with **three** options incl. "Chat"; an invented AVAILABLE SLOTS grid; allowance note; "Cancel" / "Confirm booking" | count/copy |
| 98 | Session cap reached | centred 56px icon tile, "You've reached your monthly session limit", "6 of 6" body, blue note, **Not now (1fr) / Notify admin to top up (1.4fr)**, then a green confirmation state with a **Done** button | different title/copy, gold strip, equal-width right-aligned buttons, no post-request state | copy/missing |
| 99 | In-call screen | full-screen `#0A1220`: timer + "Encrypted · not recorded", video stage with 120px avatar + 140×100 self-view ("YOU"), or the voice variant; mute / camera / 60×52 red end-call controls | **missing entirely** | missing |
| 100 | Report | max-w 460; 4 deck reasons ("Therapist was late or unavailable", "Unprofessional conduct", "Inappropriate message in chat", "Something else"); selected = `#FFF0F0`/`#FFCDD2`; **Cancel** / red **Submit Report** | 4 different reasons; selected = brand blue; blue primary "Submit report" | copy/colour |
| 101 | Delete account | **missing** — deck has the red trash circle, the anonymisation copy, a "Type DELETE to confirm" input, and **Keep Account** / **Delete Forever** | not implemented | missing |
| 102 | Sign out | **missing** — deck has "Sign out of TalkAM?", "You'll need your work email and password to sign back in.", **Stay Signed In** / **Sign Out** | sidebar linked straight to /business/login | missing |

**Total discrepancies found: 102 — all 102 fixed.**

### ✅ PASS — B2B Employee Dashboard

Re-screenshotted deck and implementation at 1440×900 (DSF 2) and compared
section by section across all seven screens. Zero unapproved differences.

Files: `src/components/v2/dashboard/dashboardshell.jsx`,
`src/routes/v2/business/employee/*`, `src/fakedata/v2/employee.js`.

**Allowed deviations**

| Kind | Deviation |
|------|-----------|
| (a) | The deck's seven `sc-if` page states are seven real routes under `/business/employee`; the deck's own sidebar click-through is the route navigation. |
| (a) | The deck's `sessionCapReached` demo-prop toggle has no UI here — the cap modal is reachable from the booking flow instead. |
| (b) | Below `lg` (1024px) the 224px sidebar becomes a slide-over behind a hamburger, the 4-up and 3-up grids reflow to 2-up/1-up, and the Messages panel stacks its rail above the thread. The decks are `min-width:1180px` and specify nothing below it. |
| (c) | Page height renders 1031px vs the deck's 1020px (~1%). The app self-hosts Nunito while the deck loads it from Google Fonts; the marginally different font metrics accumulate over ~15 stacked text blocks. All specified sizes, paddings and line-heights are applied literally. |
| (c) | The deck's QR block is a hard-coded 64-cell pattern, not a scannable code; transcribed cell-for-cell from the deck's `qrSeed`, so it is equally non-scannable. |

---
## 2. Landing — variant 1C

Deck: `TalkAM Landing Page.dc.html` § **OPTION 1C — PRODUCT-FORWARD** (lines
465–815; variants 1A and 1B are deliberately not implemented) · Route: `/`
Deck section order: NAV + HERO → APP SHOWCASE → APP DOWNLOAD BANNER →
FOR BUSINESS → FOR PROFESSIONALS → STATS → FOOTER.

Section order, components, copy, phone mock-ups, browser-frame dashboard,
store badges and footer groups were already a faithful transcription. The
discrepancies were dimensional.

| # | Section | Deck | Implementation (before) | Type |
|---|---------|------|--------------------------|------|
| 103 | Global line-height | decks inherit the browser default (`normal`) and set an explicit line-height only where it matters | Tailwind preflight imposes `1.5` on every unstyled line box, inflating every text block | size |
| 104 | Hero band padding | `52px 72px 80px` — **72px** horizontal, unlike every other band | `px-6 lg:px-14` (56px), so the eyebrow, h1, form and phone all sat 16px too far left/right | size |
| 105 | Nav "Business Login →" | `rgba(255,255,255,0.08)` fill, 1.5px `rgba(255,255,255,0.25)` border, **13px**/700, padding `10px 20px`, pill | `bg-white/10`, `text-caption` (12px), fixed `h-8` (32px) from the `sm` button size | colour/size |
| 106 | Stats labels | no max-width — every label sits on one line | `max-w-[220px]` wrapped "Community members already on the web" onto two lines and grew the band by 26px | size |
| 107 | Stats grid | uniform `gap:16px` | `gap-x-4 gap-y-10` | size |
| 108 | "Explore for Business →" | bespoke button — radius **13**, padding `14px 28px`, **15px**/800 | `DsButton size="lg"` — radius 14, fixed 56px height, 16px/700 | size |
| 109 | "Apply as a Professional" | bespoke button — 56px tall, radius 14, padding `0 30px`, **15px**/800 | `DsButton size="lg"` — px 28, 16px/700 | size |

**Discrepancies found: 7 — all 7 fixed.**

### ✅ PASS — Landing 1C

Section heights, deck vs implementation, after the fixes: hero 891/887,
app showcase 965/965, download banner 178/178, for business 628/628,
for professionals 349/351, stats 263/263, footer 338/340. Re-screenshotted
every band at 1440 and compared; zero unapproved differences.

Files: `src/components/layout/v2/marketinglayout.jsx`, `marketingnav.jsx`,
`src/routes/v2/landing/sections/{hero,bands,forbusiness}.jsx`.

**Allowed deviations**

| Kind | Deviation |
|------|-----------|
| (a) | The deck stacks variants 1A / 1B / 1C in one document behind `.dv-opt` anchors. Only 1C is built, as chosen; the variant anchors have no counterpart. |
| (a) | The deck's cross-page links point at sibling `.dc.html` files; they are real routes here. |
| (b) | Below `lg` the hero stacks (copy above phone), the three showcase phones wrap, and the stats grid drops to 2-up. The deck specifies nothing below 1180px. |
| (c) | `.pf-shot:hover` / `.dash-tilt:hover` use `animation-timeline: view()` in the deck, which no browser resolves consistently outside the design tool; the equivalent entrance is driven by `useScrollReveal` with the same 0.9s curve. |

---
## 3. Pricing

Deck: `TalkAM Pricing.dc.html` · Route: `/pricing`
Deck section order: NAV → HERO → PRICING LAYERS → BILLING SUMMARY BAND →
WHAT'S INCLUDED → FAIRNESS PRICING EXPLAINER → FAQ → CTA → FOOTER.

The body was a faithful transcription — tier names, prices, units, badges,
notes, the six "Every plan includes" cards, the ₦475,000 worked example and
the six FAQ entries all matched the deck verbatim. The discrepancies were the
page chrome.

| # | Section | Deck | Implementation (before) | Type |
|---|---------|------|--------------------------|------|
| 110 | Nav links | **Features · Pricing · FAQ**, "Pricing" active in `#017FC8`/700 | the landing nav — The App · For Business · For Therapists · Journal | wrong content |
| 111 | Nav logo / padding | 24px logo, `24px 56px` padding | 26px logo, 26px vertical padding | size |
| 112 | Footer | single `40px 56px` row: `© … All rights reserved.` + **Terms of Use · Privacy Policy · Business Login** | the landing four-column footer | wrong component |
| 113 | Hero eyebrow pill | `margin-bottom:22px` | `mb-5` (20px) | size |
| 114 | Hero lead paragraph | `font-size:16px`, `margin:0 auto 8px` | `text-body-lg` (16px/**1.7 forced**), no bottom margin | size |
| 115 | FAQ disclosure marker | the Pricing deck does **not** hide the native `<details>` marker — rows show the browser triangle on the **left**, and more than one row can be open | `DsAccordion` `+`/`–` on the right, single-open | icon/behaviour |
| 116 | FAQ question size | `font-size:14px` (line-height normal) | `text-body` → forced 1.65 line-height, rows 4px taller | size |
| 117 | CTA paragraph | `font-size:14px` | `text-body` → forced 1.65 | size |
| 118 | CTA button | an **inline** `<a>`, radius 13, padding `14px 30px`, 15px/800 — being inline is what keeps the blue band 241px tall | `DsButton size="lg"` block pill: radius 14, fixed 56px height, 16px/700, band 33px taller | size |

**Discrepancies found: 9 — all 9 fixed.**

### ✅ PASS — Pricing

Section heights, deck vs implementation, after the fixes: nav+hero 392/392,
pricing layers 331/331, billing band 141/142, every-plan-includes 505/507,
how-we-price-it 427/427, FAQ 592/582, CTA 241/246, footer 96/98.

Files: `src/routes/v2/pricing/pricing.jsx`,
`src/components/layout/v2/{marketingnav,marketingfooter,marketinglayout}.jsx`,
`src/components/v2/accordion.jsx`, `src/constants/v2routes.js`.

**Note on the marketing chrome:** every marketing deck draws its own nav row
and its own footer, and they genuinely differ (link sets, active treatment,
CTA label and fill, four-column vs single-row footer). The nav and footer are
now per-page props rather than one shared set — the remaining marketing pages
below are wired the same way.

**Allowed deviations**

| Kind | Deviation |
|------|-----------|
| (a) | The deck's `.dc.html` cross-links are real routes; "Features" and "FAQ" point at the landing page's `#app` / `#faq` anchors, which is where those sections live. |
| (b) | Below `lg` the three tier cards stack, the billing band wraps its CTA, and the nav collapses to a drawer. |
| (c) | FAQ rows use the native `<details>` marker to match the deck exactly; its exact glyph is drawn by the browser, so it is Chrome's triangle rather than an asset we control. |

---
## 4. For Business

Deck: `TalkAM For Business.dc.html` · Route: `/for-business`
Deck section order: NAV → HERO → sector strip → why-TalkAM grid → seat management
→ privacy band → session billing → three steps → CTA → FOOTER. Section order,
copy, dashboard previews and card content were already faithful.

| # | Section | Deck | Implementation (before) | Type |
|---|---------|------|--------------------------|------|
| 119 | Font weight 900 | every hero/section `<h2>`, the hero stat figures and the CTA's primary button are `font-weight:900` | the app self-hosted Nunito only up to ExtraBold (800), so every 900 fell back a weight | weight |
| 120 | Nav links | **five** — The App · **For Business** (active: white/800 + 2px `#017FC8` underline) · For Therapists · Pricing · Journal | four, no active treatment | wrong content |
| 121 | Nav CTA | solid `#017FC8`, 13px/800, padding `11px 22px`, shadow `0 8px 20px rgba(1,127,200,0.35)` | translucent white pill | colour |
| 122 | Nav padding | `22px 56px` | 26px vertical | size |
| 123 | Hero band padding | `92px 56px 120px` | `pt-[52px]` — hero 53px short | size |
| 124 | Hero eyebrow | `margin-bottom:22px` | `mb-5` (20px) | size |
| 125 | Hero paragraph | `font-size:18px; line-height:1.65` | `text-h4` — the DS token forces **1.35** line-height | size |
| 126 | Hero buttons | padding `16px 32px`, radius 14, 16px/800 | `DsButton size="lg"` — fixed 56px height, px 28, 700 | size |
| 127 | Hero stat figures | `font-size:26px; font-weight:900` | `text-h2` (24px/800) | size |
| 128 | "Care that scales…" h2 | 38px/900 | 800 | weight |
| 129 | Section lead paragraph | `font-size:16px; line-height:1.65` | `text-body-lg` — forces 1.7 | size |
| 130 | "Invite in bulk…" / "Only pay for sessions…" h2 | 32px/900 | `text-display` (32px/**1.15 forced**) /800 | size |
| 131 | Privacy band icon tile | `margin:0 auto 22px` | `mb-5` (20px) | size |
| 132 | Privacy band h2 | 34px/900 | 800 | weight |
| 133 | Privacy band paragraph | `font-size:17px; line-height:1.7` | `text-h4` (18px/1.35) | size |
| 134 | Privacy band pill | `margin-top:22px` | `mt-5` (20px) | size |
| 135 | "Live for your team…" h2 | 36px/900 | 800 | weight |
| 136 | Step titles | `font-size:18px; font-weight:800` (line-height normal) | `text-h4` — forces 1.35 | size |
| 137 | CTA h2 | 40px/900 | 800 | weight |
| 138 | CTA paragraph | `font-size:17px; margin-bottom:30px` | `text-h4` (18px/1.35), `mb-7` (28px) | size |
| 139 | CTA buttons | padding `16px 34px`; primary is **900**, secondary 800 | `DsButton size="lg"` — fixed height, px 28, 700 | size |

**Discrepancies found: 21 — all 21 fixed.**

### ✅ PASS — For Business

Section heights, deck vs implementation, after the fixes: nav+hero 811/819,
sector strip 142/142, why-TalkAM 825/820, seat management 636/636, privacy
band 451/451, session billing 636/636, three steps 496/491, CTA 413/418,
footer 338/340.

Files: `src/routes/v2/forbusiness/forbusiness.jsx`,
`src/assets/fonts/Nunito-Black.ttf` (new), `src/index.css`,
`tailwind.config.js`, `src/constants/v2routes.js`.

**Allowed deviations**

| Kind | Deviation |
|------|-----------|
| (a) | Deck cross-links are real routes. |
| (b) | Below `lg` the hero stacks, the browser frame is hidden (the deck's own `.hide-sm` does the same below 820px), and the 3-up grids reflow. |

**Applied across the whole v2 site, listed here because it is new:** the
`black-nunito` (900) face was added — `src/assets/fonts/Nunito-Black.ttf`,
exposed as Tailwind's `font-blackNunito`. Every deck sets `font-weight:900` on
its hero headings and display figures; without the face the browser silently
fell back to ExtraBold. The landing hero + stats, the pricing h1 + prices, and
the employee dashboard's greeting, KPI figures and streak counter were
re-pointed at it too.

---
