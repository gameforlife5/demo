# demo

Browser-based Snake game that runs entirely on static files.

## Quick start

1. Clone or download this repository.
2. From the project root, launch any static file server (Python example below).
3. Visit the reported URL in a modern browser and start playing.

```bash
python -m http.server 8000
```
Then open http://localhost:8000 in your browser. The game is served from `index.html` at the root of this repo.

### Alternative
If you prefer, you can open `index.html` directly in the browser without starting a server, though some browsers restrict keyboard focus when loading files via the `file://` protocol. A local server is recommended for the best experience.

## Playing inside Codex / VS Code preview

The Preview panel in hosted editors renders pages inside an iframe and blocks many keyboard shortcuts (including the arrow keys). That is why the snake would not respond in preview mode. You can still try it out from Codex by either:

1. Clicking **Open in Browser** for the exposed port so the game runs in its own tab with full keyboard access, or
2. Using the built-in on-screen controls that appear under the score panel (tap/click the arrows to steer the snake).

Those controls exist purely to work around the preview limitation—the gameplay is identical regardless of how you steer.
