# EduVoice - Dynamic Student Feedback Portal
React (Vite) + CSS. Admin demo login: admin / admin123
Written with React.createElement (h) instead of JSX tags - it works the same.
standalone-version.html is a single-file copy that opens directly in a browser.

## Run locally
npm install
npm run dev

## Deploy (GitHub + Vercel)
git init && git add . && git commit -m "Student feedback portal"
git branch -M main && git remote add origin <repo-url> && git push -u origin main
Then vercel.com > Add New Project > import the repo > Deploy (Vite is auto-detected).

## Files / roles
Member 1: src/App.jsx, src/pages/*, src/components/Widgets.jsx
Member 2: src/index.css, src/data.js (text and sample data)
Member 3: footer (in App.jsx), linking pages, GitHub + Vercel deployment
src/hooks.js = saved-data and count-up hooks, src/utils.js = averages and time helpers
