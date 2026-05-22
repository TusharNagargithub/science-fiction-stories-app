# BrainyLingo – Science Fiction Stories

Angular assignment app. Browse stories, open details, and use 3 tabs: **Word Explorer**, **Story Adventure**, **Brain Quest**.

---

## Requirements

- [Node.js](https://nodejs.org/) (v18 or v20)
- Internet (for API & images)

Check:

```bash
node -v
npm -v
```

---

## Run the project

```bash
# 1. Go to project folder
cd mxpertz-angular-test

# 2. Install packages (first time only)
npm install

# 3. Start app
npm start
```

Open browser: **http://localhost:4200**

Stop app: press `Ctrl + C` in terminal.

> First load may take 10–20 seconds (API is slow). Wait for stories to appear.

---

## How to test

1. Home page → story cards with images  
2. Click filters: New, In Progress, Completed, Clear All  
3. Click any card → story detail page  
4. Open all 3 tabs  
5. Click **BrainyLingo** logo → back to home  

---

## API

- List: `https://mxpertztestapi.onrender.com/api/sciencefiction`
- Detail: `https://mxpertztestapi.onrender.com/api/sciencefiction/{id}`
- Images: `https://ik.imagekit.io/dev24/{filename}`

---

## Routes

| URL | Page |
|-----|------|
| `/` | Stories list |
| `/story/:id` | Story details |

---

## Build (optional)

```bash
npm run build
```

---

## Problems?

| Issue | Fix |
|-------|-----|
| No stories | Wait & refresh page |
| Port busy | `npm start -- --port 4300` |
| Install error | Delete `node_modules`, run `npm install` again |

---

## Tech

Angular 18 · TypeScript · RxJS · Router · SCSS

---

**Author:** Your Name  
**GitHub:** https://github.com/YOUR_USERNAME/YOUR_REPO_NAME  
