# Writing an interactive film article

An interactive film article has three layers that tell the same story at different speeds:

1. **The film** (`film/`): 8–12 chapters, 7–10 minutes, narrated. The reader presses play
   and watches; or scrubs, or jumps by chapter. Live scenes let them take over.
2. **The prose** (`index.mdx`): the written article, section by section, each section
   standing on its own, with the formulas and the careful statements the film glosses.
   The film is embedded near the top; sections may link to chapters.
3. **Explorables** (`explorables/`): small live scenes embedded between sections, each
   making one idea tangible with two or three controls and a readout.

Rules of thumb:

- The narration is spoken language: short sentences, one idea each, no formula read out loud.
- The prose says precisely what the film shows, and states conventions once.
- Every number the film shows is computed, never typed in.
- Every claim is true as stated. A special case is announced as one.
- A reader who skips the film loses nothing that is stated; a reader who skips the prose
  still gets the intuition.
