# Actual test record — 2026-09-22

Node syntax checks passed. Six engine groups and five real Chromium 151.0.7922.34 browser groups passed.

- Unicode normalization, duplicates, input bounds and malformed words.
- Seed repeatability and 320 generated puzzles: 3,200 declared paths spell their claimed words; all requested words are placed or explicitly unplaced.
- Overpacked grid produces a nonempty unplaced list; invalid selections return no match.
- Reverse-pair regression: exact selected spelling is preferred for AB/BA. One source-inspection repair, followed by engine and browser reruns.
- Actual browser keyboard play solved all default clues. Stale exports disable after edits. Markup-like title remains text. Invalid words and unplaced lists are visible.
- Both PNGs actually downloaded, reopened at 1200×1800, and inspected at a known answer cell: plain paper [255,253,245,255], answer highlight [211,223,151,255].
- 390px layout with 16×16 horizontally scrollable board. No HTTP requests, storage or page errors in offline test context.

Desktop UI and exported answer visually inspected. Export height was increased during implementation to leave room for long clue lists. This is deterministic verification plus same-agent inspection, not cross-model review. No configured linter or type checker was run.

Not run: real printing, Android/iOS hardware, Safari/Firefox, screen-reader user study, learning-effectiveness study. Rare Unicode characters depend on system font coverage. No real personal or customer data used.
# V1.1 targeted verification

Four additional groups passed on Chromium 151.0.7922.34: roving Tab and directional/Home/End boundaries; Space selection and Escape cancellation; Enter matching and Tab exit; regenerated 16x16/pointer focus and invalidation safety. Browser offline, no application HTTP requests or runtime errors.

Original engine and export source are byte-identical to V1; earlier engine/export evidence below is inherited, not rerun. No Android or screen-reader test performed. V1.1 remote publication pending at this checkpoint.
# V1.2 focused recipe checks

2026-09-22: syntax check and five groups in test-recipe.cjs PASS on desktop Chromium151.0.7922.34. Strict schema/type/version/size validation; actual downloaded JSON reimport with exact full-puzzle equality; cancellation and malformed/wrong-type/oversized files retaining inputs; late reads rejecting newer edits;390px no horizontal page overflow and offline operation with zero HTTP requests or page errors.

Not verified: mobile devices, Safari, physical printing, permanent storage of downloads, all OS fonts. Save file excludes solving progress. No dependencies added; puzzle.js, app.js and keyboard.js remain unchanged. Earlier results below are inherited.
