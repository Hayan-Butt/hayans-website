# Hayan Butt — Personal Website

Personal website of **Hayan Butt**, a Computer Science & Cyber Security student.
I'm open to IT internships and I'm very open to learning.

**Live:** https://hayan-butt.github.io/hayans-website/

## Design
Inspired by early-2000s console menus: glowing blue towers in the background, glossy glass panels,
chrome lettering, a startup animation, spinning "memory card" style project icons and optional menu sounds.

## Pages
| File | What it is |
|------|------------|
| `index.html` | Startup animation + main menu (use ↑ ↓ and Enter) |
| `about.html` | My story, the tools I use, and my journey as "save slots" |
| `projects.html` | Project browser — pick a project to see its details (← → to browse) |
| `contact.html` | Email, LinkedIn and GitHub |
| `404.html` | Custom "page not found" screen |

## Editing projects
All project info lives in `js/projects.js`. Add a new object to the list and it shows up automatically.

## Tech
Plain HTML, CSS and JavaScript — no frameworks and no build step, so it works on GitHub Pages as-is.

```
css/style.css     all styles
js/main.js        background, startup, menus, sounds, page transitions
js/projects.js    project data
favicon.svg       site icon
```

## Run locally
Open `index.html` in a browser, or:

```bash
python -m http.server 8000
```

## Contact
- [LinkedIn](https://www.linkedin.com/in/hayan-butt-582226296/)
- [GitHub](https://github.com/Hayan-Butt)
- Email: hayanbutt90@gmail.com
