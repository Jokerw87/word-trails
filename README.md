# 词语寻宝纸 / Word Trails

An original, dependency-free browser word-search activity. Chinese characters, Latin letters and numbers; editable words; repeatable seeded grids; keyboard or mouse solving; separate question/answer PNGs. Open `index.html` locally. No account, uploads, tracking or persistent storage.

## Three steps

1. Enter 1–20 words, one per line. Choose an 8/10/12/16 grid and a seed. Words must be 2 characters or longer and fit the grid. Unicode NFKC normalization, uppercasing and deduplication are disclosed in the UI.
2. Generate; check the placed/unplaced warning. Select a word's start and end cells using clicks or Tab + Space. Words not fitted are never silently included as clues.
3. Export question and answer separately as 1200×1800 PNG. Print using your normal image/print application; physical printing is not tested.

Default placement goes right, down or down-right. The optional advanced mode adds all eight straight directions. A deterministic, bounded greedy search prioritizes overlaps; it is not an optimal packing solver. Unplaced words can often be addressed with a larger grid or fewer words. Filler can form extra matches; they are accepted. The answer highlights generated path cells, not every accidental match. Reverse pairs such as AB/BA prefer the exact selected spelling.

No dictionary, spelling validation, pronunciation or educational efficacy claim. Verify suitability of words yourself. Fonts depend on the local OS; rare characters may lack glyphs. Data is lost on close. Large grids scroll horizontally on narrow screens.

## Research and scope

Checked 2026-09-22: [Marjona6/word-search-generator](https://github.com/Marjona6/word-search-generator) already offers custom words, direction controls and printable grids. [CrossHatch](https://github.com/ben4808/crosshatch) is a richer offline crossword constructor, not the same puzzle type. This is a personal learning/creative artifact, not a claimed market gap or validated business. No source or word-list database copied. The short natural-world example was entered for this demo.

Initial publication does not select a reuse license. Runtime has zero third-party dependencies; system fonts are not bundled.

## Tests

Run `node test-engine.cjs`. For browser tests set `PLAYWRIGHT_MODULE` to an existing Playwright module and run `node test-browser.cjs`. Test outputs are ignored; see TEST_RESULTS.md for actual evidence and limitations.
# V1.1 keyboard addition

The board now has one Tab stop. Use arrow keys to move, Space/Enter to choose endpoints, Escape to cancel, Home/End for row boundaries, and Ctrl+Home/End for board boundaries. Tab exits the board. Mouse selection is retained. Generation, matching and PNG engine are unchanged from V1.

Run `test-keyboard.cjs` with `PLAYWRIGHT_MODULE` pointing to an installed Playwright module. This is a keyboard usability improvement, not a screen-reader or WCAG conformance certification.
