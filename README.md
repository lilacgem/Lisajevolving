# LisajEvolving digital home

The repository root contains the prebuilt static website served by the existing host. Editable React/Vite source is in `site-source/`.

To update: run `npm ci` and `npm run build` in `site-source`, then copy the contents of `site-source/dist/` to the repository root and commit the changed files.

The enhanced LisajEvokes compilation is the only published post. Vlogs, Visuals, and Notes show honest empty states until more posts are added. Edit `site-source/src/Home.jsx` for content and `Home.css` for styling.

The player uses local Web Audio analysis and sends bounded frequency values to a same-origin EvoMirror iframe. It does not request microphone access. The M4A audio is extracted from the supplied enhanced MP4 without re-encoding. Original MP4 files are not included.
