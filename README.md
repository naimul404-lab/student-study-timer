# Study Flow — Timer & Revision Planner

A calm, student-friendly study timer and revision planner built with plain HTML, CSS, and JavaScript. It helps students start a focus session, take a break, plan revision work, and build a steady study routine.

## Why this project matters

Students often struggle with staying focused and keeping revision organized. This project gives them a simple, low-pressure way to manage study sessions, track progress, and keep their next tasks visible without feeling overwhelmed.

## Features

- Adjustable focus and break durations
- Start, pause, and reset timer controls
- Daily session tracking and study-minute summary
- Add, complete, and remove revision tasks
- Optional subject labels for tasks
- Clear completed tasks and a simple daily goal
- Save progress in browser local storage
- Responsive, student-friendly interface
- No backend, login, or third-party account required

## Project structure

```text
student-study-timer/
├── index.html
├── styles.css
├── script.js
├── README.md
├── LICENSE
└── .gitignore
```

## Run locally

From the repository folder, run:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Publish with GitHub Pages

In the repository, open Settings → Pages, choose Deploy from a branch, select main and / (root), and save. Once the deployment finishes, GitHub will provide the live URL in the Pages settings.

## Privacy and limitations

Your tasks and progress are saved in browser local storage. They do not sync across devices and can be removed if browser data is cleared. Avoid storing sensitive details. The timer follows the current page state and will keep working normally in the browser session.

## What this project shows

This project is a strong portfolio example because it solves a real student problem:

- staying focused during study sessions
- taking healthy breaks
- keeping revision tasks organized
- building a simple study habit

## License

MIT. See [LICENSE](LICENSE).
