# Study Flow — Timer & Revision Planner

A calm, student-friendly study timer and revision planner built with plain HTML, CSS, and JavaScript. It helps learners start a focus session, take a break, plan review tasks, and notice daily progress without creating an account.

## Features

- Adjustable focus and break durations (with sensible limits)
- Start, pause, and reset controls; completed focus sessions count toward daily progress
- Daily session and focus-minute summary that rolls over each day
- Add, complete, and remove revision tasks, optionally grouped with a subject
- Clear completed tasks and set a simple daily focus goal
- Saves settings, progress, and tasks in browser local storage
- Responsive layout, keyboard focus support, and reduced-motion support
- No backend, account, analytics, or external data collection

## Run locally

From the project directory, start a static server:

```bash
python -m http.server 8000
```

Then visit <http://localhost:8000>. You can also open `index.html` directly in a modern browser.

## Publish with GitHub Pages

In the repository, open **Settings → Pages**, choose **Deploy from a branch**, select `main` and `/(root)`, and save. GitHub will display the published URL in Pages settings once deployment is complete.

## Privacy and limitations

Your tasks and progress are saved in local storage on the browser and device you use. They do not sync across devices and can be removed if browser data is cleared. Avoid storing sensitive information. Keep a separate backup of important plans. The timer runs in the current page; browser or device sleep behavior may affect how it appears, although remaining time is recalculated when the page becomes visible again.

## Project files

```text
student-study-timer/
├── index.html
├── styles.css
├── script.js
└── README.md
```

## License

MIT. See [LICENSE](LICENSE).
