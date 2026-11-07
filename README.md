# LisajEvolving inner universe

The repository root is the prebuilt static website. Editable React/Vite source lives in `site-source/`. Build there with `npm ci` and `npm run build`, then copy the contents of its `dist/` to the repository root.

Living mirrors:
- LisajEvokes, 3:34: violet living mirror and enhanced voice compilation.
- Aujoulevol, 5:42: teal/gold filaments and orbital ribbons, responding to enhanced audio. Profile measurements are in `aujoulevol-profile.json`.

Select a world in the orbit to change the artwork and play its audio. Only one player runs at a time. Sound starts on a visitor's action. Frequency bands use 20–250 Hz, 250–4000 Hz, and 4000–16000 Hz with sample-rate-aware FFT bins. Values pass only to the same-origin mirror iframe. No microphone is requested.

Vlogs, Visuals, and Notes have empty states for future posts. This site has no publishing CMS yet. Edit `Home.jsx` to add content and `Home.css` to change styling.

The local development-only export route is excluded from production. Its server endpoint writes only the two explicitly named WebM files under the local exports folder. Social MP4 exports are delivered separately and are not included in the website repository. Original WAV and MP4 masters are not published.
