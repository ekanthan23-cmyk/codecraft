# CodeCraft persistence upgrade

- [x] Upgrade the frontend-only project to the full-stack database and authentication foundation.
- [x] Add user-scoped tables for learner profile, learning paths, lesson progress, notes, practice activity, and workspace drafts.
- [x] Generate and apply the database migration without inserting demonstration user data.
- [x] Build authenticated data procedures and connect dashboard actions to persisted records.
- [x] Validate TypeScript, server behavior, database schema, and responsive dashboard presentation.
- [x] Verify persisted dashboard loading, signed-out empty, and authenticated workspace states at desktop and mobile sizes.
- [x] Exercise the authenticated persistence procedure routing in unit tests and verify the browser’s signed-out error state; live browser sign-in remains user-controlled.
- [x] Add a polished multi-technology workspace launcher for Python, C++, HTML, CSS, JavaScript, React, and SQL/database work.
- [x] Adapt the lesson brief, editor starter code, output presentation, and workspace controls to the selected technology.
- [x] Persist each learner’s selected workspace tool and separate draft context without disrupting existing saved work.
- [x] Verify the language launcher, workspace interactions, persistence contract, and responsive behavior.
- [x] Validate a non-Java workspace’s adaptive editor and controls; authenticated save-and-restore remains user-session dependent.
- [x] Build a student-centric dashboard hub for daily free workshops, learning continuation, and clear next actions.
- [x] Add dedicated resource-library views for approachable Java, Python, C++, C, HTML, CSS, JavaScript, React, SQL, and DSA learning materials.
- [x] Add project creation, project upload/submission details, concise submission-date markers, and publish-ready project status views.
- [x] Add an AI tutor that answers student coding and DSA questions with hints, solutions, and step-by-step explanations.
- [x] Create user-scoped database records and protected procedures for projects, submissions, learning resources, workshop attendance, and tutor interactions.
- [x] Validate the student navigation, AI tutor guidance, project workflow, resource browsing, persistence contracts, and responsive behavior.
- [x] Add clearly beginner-oriented study cards for C, C++, and DSA so every library topic has an approachable entry point.
- [x] Validate protected student persistence routes for project creation/submission, resource saves, workshop joins, and restored-state contracts with automated router coverage; live browser sign-in remains user-controlled.
- [x] Exercise the live AI tutor in the application with DSA and Python coding questions, confirming step-by-step replies; private conversation storage is covered by the tutor service tests.
- [x] Allow guest students to receive AI tutor answers without persistence, while reserving private tutor-history storage for signed-in students.
- [x] Add automated protected-route coverage for project submission and restored project, resource-save, and workshop-join state reads.
- [x] Replace the fixed dashboard date and greeting with a live local calendar date and time-of-day greeting.
- [x] Validate the dynamic date display without changing the existing dashboard layout.
- [x] Add a dedicated developer profile page for Kanthan with B.Tech CSE credentials, developer role, and concise personal introduction.
- [x] Add verified email and phone contact actions to the developer profile once the details are provided.
- [x] Connect the developer profile page to the CodeCraft navigation and validate the responsive layout.
- [x] Upload the supplied Kanthan portrait as a secure CodeCraft web asset.
- [x] Replace the Developer-page initials block with the supplied portrait while preserving responsive presentation and accessibility.
- [x] Reframe the Developer portrait as a larger square image focused on Kanthan’s face and upper body.
- [x] Remove the yellow decorative badge overlay and validate portrait clarity on desktop and mobile.

- [x] Refine the visual system toward navy, blue, and light-blue college-portal styling with less card clutter.
- [x] Rework the dashboard around student biodata, learning plan, study progress, and performance summaries.
- [x] Compress the Developer page into a small corner profile with calling/contact action only.
- [x] Make the AI Tutor primarily conversation-first for project and coding support.
- [x] Add workshop link fields for Zoom/Meet and other external learning sessions.
- [x] Connect the Study Library to in-portal or direct linked study materials and return-to-workspace actions.
- [x] Validate the redesigned portal at desktop and mobile sizes with working navigation and links.

> Scope note: third-party Zoom/Meet and external website connections will use safe outbound links or configurable resource URLs unless the user later supplies credentials and requests a full API integration.

> Reference note: Nextwave-style portal inspiration will guide structure and information hierarchy without copying proprietary branding or assets.

> Data note: Dashboard performance and biodata will remain user-scoped; no invented student metrics or personal details will be added.

> Browser note: the managed preview editor can intercept direct coordinate typing/clicking; the workshop HTTPS hrefs and Join live state were verified in the rendered DOM, and the normal input event path was exercised without adding any external meeting credentials.

- [x] Add a real editable Zoom/Google Meet link field for each workshop so live sessions can be configured without code changes.
- [x] Exercise redesigned navigation and key actions in the browser, including developer contact, library reading/return, and workshop link behavior.

- [x] Verify the Developer email and phone actions resolve to the expected mailto and tel targets.
- [x] Enter and save a valid HTTPS workshop link, confirm the Join live action appears, and verify a workshop study link opens correctly.

- [x] Exercise the workshop live-link input and Save button through the normal browser UI, without console or localStorage injection, and confirm Join live appears.
- [x] Verify a workshop study link opens successfully in the browser, or add automated href coverage and document any popup limitation.

- [x] Redesign the CodeCraft first page as a scrollable personal learning portal inspired by the supplied reference layout.
- [x] Add a top update/search/profile strip, left navigation, workshop update feed, schedule, and learning-progress sections.
- [x] Make the supplied Kanthan portrait a clickable profile entry point with personal ID, profession, code/work data, and learning details.
- [x] Structure workshop updates so future API-backed content can replace the current local feed without changing the layout.
- [x] Validate first-page scrolling, profile interaction, responsive behavior, and current navigation.

- [x] Add current learning details to the clickable personal profile panel.
- [x] Add automated first-page interaction contract coverage for the profile entry point and navigation labels.
- [x] Re-run checks and document the redesigned first-page interaction validation before the final checkpoint.

> First-page validation note: the live browser preview rendered the new portal with the workshop update strip, schedule, tracker, workspace cards, profile card, and all six navigation routes visible. TypeScript and 18 Vitest tests passed, including profile-trigger, personal-data, learning-details, and navigation contracts. Direct click and console-trigger attempts on the managed preview’s portrait button were intercepted by the preview editor overlay, so the interaction handler was verified through automated source-contract coverage rather than changing user/session data.
