# Lee's Portfolio (ICT251 Activity 3)

An interactive, responsive personal portfolio for ICT251 Web Technologies at Mulungushi University. It builds on my Activity 2 website and adds JavaScript features, then deploys as a static site through GitHub to Render.

**Live site:** https://YOUR-SITE-NAME.onrender.com *(replace with your Render URL)*

## What is on the site

About Me, My Hobbies, Projects & Skills, My Learning Plan (with table), My Photos, My Media (video and audio) and Contact. It uses semantic HTML5, one external stylesheet with a Rust & Slate palette, and a light/dark theme.

## The four JavaScript features

All the logic is in `js/script.js`.

| # | Feature | How to test it |
|---|---------|----------------|
| 1 | **Contact form validation and preview** (compulsory) | Press "Check and preview" with empty fields: each field shows an error. Type only spaces in Name or Message: still rejected. Enter `abc` or `a@b` as the email: rejected. Enter valid details: a preview appears below the form, with no page reload. The form is a browser demonstration only; nothing is sent. |
| 2 | **Mobile navigation** | Make the window narrower than 900px (or use a phone). Press "Menu" to open and "Close" to close. Choosing a link, or pressing Escape, also closes it. |
| 3 | **Theme switch** | Press "Dark mode" in the navigation. The whole site changes theme and the button changes to "Light mode". The choice is remembered with localStorage. |
| 4 | **Gallery viewer** | In My Photos, press Next and Previous. The photo, caption and "Photo X of 3" counter change. Previous is disabled on the first photo and Next on the last. |

## Project structure

```
index.html
css/styles.css
js/script.js
images/   photo1.jpg, photo2.jpg, photo3.jpg
videos/   intro.mp4, voice.mp3
```

All file and folder names are lowercase so the site works on Render, which is case-sensitive.

## Deployment

Static Site on Render: Branch `main`, Root Directory blank, Build Command `echo "No build required"`, Publish Directory `.`, Auto-Deploy on.

## Sources and credits

- Fonts: Fraunces and DM Sans from Google Fonts.
- Icons: simple inline SVG shapes written for this project.
- Course material: ICT251 lecture slides and the Activity 3 brief.

