# Data Structure Visualizer 2.0
**Interactive C, Python & Java Algorithm Tracing, Auto-Follow Viewport & Memory Inspection**

> Developed by **Pratyush Jaiswal**

A client-side interactive educational IDE and visualization tool for understanding fundamental data structures, memory layouts, algorithms, and loop patterns during program execution.

Students and educators can write standard **C (C99)**, **Python (3.x)**, or **Java (17)** programs, execute them entirely inside the browser without requiring a backend server, and observe step-by-step memory transitions, pointer rewiring, stack/queue operations, binary search tree branching, search/sort algorithms, and incremental pattern printing.

---

## 1. Key Features & Iteration 3 Enhancements

1. **Multi-Language Tracing (C, Python, Java)**:
   - Genuine client-side execution engines for C, Python, and Java (no fake traces).
   - Dynamic CodeMirror syntax mode switching (`text/x-csrc`, `text/x-python`, `text/x-java`).
   - 41 preloaded educational algorithms and pattern programs organized across all three languages.

2. **Intelligent Auto-Follow Viewport**:
   - Automatically and smoothly scrolls the graphic viewport to center the currently active, accessed, or modified element.
   - Preserves comfortable surrounding context with safe margins.
   - Features a dedicated **Auto-Follow toggle button** (enabled by default) so students can inspect manually without viewport fighting.
   - Respects user accessibility preferences (`prefers-reduced-motion`).

3. **Complete Mobile Responsiveness**:
   - Designed and verified for screens from 360px narrow mobile up to 1440px+ ultra-wide desktops.
   - Eliminated array and data structure clipping: flex safe-centering and internal horizontal scrolling ensure the very last array element can always be inspected with generous padding.
   - Mobile tabs (**Source Editor** and **Visualization**) preserve execution state, current step, and CodeMirror contents during view switching.

4. **Pedagogical Execution Inspector & Variable Panel**:
   - Clean array pointer labeling: index variables (`i`, `j`, `pos`) are accurately placed above indexed cells, while accumulator and scalar variables (`sum`, `total`, `max`, `min`) remain strictly in the **Local Variables** table.
   - **Execution Inspector Tab**: Displays active operation, targeted line, variable state delta, and a human-friendly explanation of each step.
   - **Memory State Tab**: Live summary of structure type, element count, declared capacity, and current line.
   - **Console Output**: Real-time program `stdout` synchronized with visualization.

5. **Dedicated Pattern Printing Visualization**:
   - Displays nested loop rows, columns, and symbols in an interactive visual matrix.
   - Distinguishes spaces, numbers, and symbols clearly with monospace character blocks.
   - Highlights the active character as it is incrementally generated.

6. **Refined Dark VS Code Design System**:
   - Polished color palette: Dark charcoal (`#1E1E1E`), panel surfaces (`#252526`, `#2D2D30`), restrained blue accents (`#007ACC`), and crisp borders (`#3C3C3C`).
   - High-contrast, prominent **Run Code** button with subtle elevation depth and distinct hover/disabled states.
   - Developer credit discreetly displayed in the application footer: *"Developed by Pratyush Jaiswal"*.

---

## 2. Project Structure

```text
c-data-structure-visualizer/
├── index.html          # Clean IDE shell, language selector, auto-follow toggle, controls & dock
├── style.css           # VS Code dark design tokens, responsive breakpoints, 3D depth, pattern grid
├── engine.js           # Multi-language C, Python, and Java parser, AST interpreter, & trace generator
├── visualizer.js       # Modular rendering engine & intelligent Auto-Follow viewport controller
├── app.js              # CodeMirror manager, multi-language preset library, and UI event controller
└── README.md           # Documentation, architecture, local running, and static hosting deployment
```

---

## 3. Supported Languages & Engine Capabilities

### A. C Language (C99)
- **Supported Constructs**: `int main()`, variable declarations (`int`, `char`, `struct`), fixed-size arrays (`int arr[5] = {10, 20, 30};`), pointer dereferencing (`->`, `.`), `malloc()` and `free()`, `for` loops, `while` loops, `if/else`, and `printf()`.
- **Preloaded Examples**:
  - Array Initialization, Traversal & Sum, Element Update, Insertion, Deletion, Min & Max.
  - Singly Linked List Creation, Traversal, Insertion at Head, Deletion.
  - Stack (Push & Pop), Queue (Enqueue & Dequeue).
  - Binary Search Tree (Insertion & Traversal).
  - Linear Search & Bubble Sort.
  - Pattern Printing: Right-Angled Star Triangle, Pyramid Pattern, Number Triangle, Multiplication Table.

### B. Python (3.x)
- **Supported Constructs**: Variables, arithmetic expressions, lists (`[10, 20, 30]`, `.append()`, `.pop()`, `.insert()`), indexing (`arr[i] = val`), `len()`, `for i in range(...)` (start, stop, step), `while` loops, `if/elif/else`, `print(..., end="")`, `class Node`, and `class TreeNode`.
- **Preloaded Examples**:
  - List Initialization & Indexing, List Traversal & Sum.
  - Stack Operations using List, Queue Operations using List.
  - Singly Linked List with `Node` class.
  - Linear Search, Bubble Sort, Minimum & Maximum.
  - Pattern Printing: Right-Angled Star Triangle, Inverted Triangle, Pyramid Pattern, Number Triangle, Multiplication Table.

### C. Java (17)
- **Supported Constructs**: `public class Main { public static void main(String[] args) { ... } }`, array declarations (`int[] arr = {10, 20, 30};`, `int[] arr = new int[5];`), `for` loops, `while` loops, `if/else`, `System.out.print()` and `System.out.println()`.
- **Preloaded Examples**:
  - Array Initialization & Traversal, Element Update.
  - Stack Operations, Queue Operations.
  - Linear Search, Bubble Sort.
  - Pattern Printing: Star Triangle, Pyramid Pattern, Number Triangle.

---

## 4. Local Running Instructions

Because the application is 100% client-side with zero backend dependencies, you can run it locally with any simple HTTP server:

### Option A: Using Python (Zero external dependencies)
```powershell
# Open terminal in the project directory
cd "d:\New folder\c-data-structure-visualizer"

# Start lightweight local server
python -m http.server 3000
```
Open **`http://localhost:3000`** in your browser.

### Option B: Using Node.js
```bash
cd c-data-structure-visualizer
npx serve .
```

---

## 5. Free Static Hosting Deployment Guide

The application is completely static (HTML, CSS, Vanilla JS) and deployable to any free static host without database or build configuration.

### A. Deploying to Netlify (Drag-and-Drop or Git)

#### Method 1: Netlify Drop (Instant, No CLI needed)
1. Navigate to [app.netlify.com/drop](https://app.netlify.com/drop).
2. Log in with your free Netlify account.
3. Drag and drop the `c-data-structure-visualizer` folder directly into the browser window.
4. Netlify will deploy the site instantly and give you a live production URL (e.g. `https://data-structure-visualizer.netlify.app`).

#### Method 2: Netlify from GitHub
1. Push the project to a GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of Data Structure Visualizer 2.0"
   git remote add origin https://github.com/<your-username>/data-structure-visualizer.git
   git push -u origin main
   ```
2. Log in to [Netlify](https://app.netlify.com/) and click **"Add new site"** → **"Import an existing project"**.
3. Connect your GitHub repository.
4. Settings:
   - **Base directory**: `.` (or leave blank if repository root contains `index.html`)
   - **Build command**: *(leave blank)*
   - **Publish directory**: `.` (or root `/`)
5. Click **"Deploy Site"**.

---

### B. Deploying to Vercel

1. Install Vercel CLI (or use the web dashboard at [vercel.com](https://vercel.com)):
   ```bash
   npm i -g vercel
   ```
2. In the project folder, run:
   ```bash
   cd c-data-structure-visualizer
   vercel
   ```
3. When prompted:
   - *Set up and deploy?* **Y**
   - *Which scope?* Select your account
   - *Link to existing project?* **N**
   - *What's your project's name?* `data-structure-visualizer`
   - *In which directory is your code located?* `./`
   - *Want to modify settings?* **N**
4. Vercel will output a live URL (e.g. `https://data-structure-visualizer.vercel.app`).

---

### C. Deploying to GitHub Pages

1. Push your code to a GitHub repository on branch `main`.
2. Go to the repository **Settings** → **Pages** (under Code and automation).
3. Under **Build and deployment**:
   - **Source**: `Deploy from a branch`
   - **Branch**: `main`
   - **Folder**: `/ (root)`
4. Click **Save**.
5. Within 1–2 minutes, your project will be live at `https://<your-username>.github.io/<repo-name>/`.

---

## 6. Deployment Verification Checklist

Before sharing your live deployment, verify the following:
- [x] **Entry Point**: `index.html` loads with no 404 errors on CSS or JavaScript files.
- [x] **Multi-Language Selector**: Switching between C, Python, and Java correctly updates the editor mode, preloaded examples, and badges.
- [x] **Execution Verification**: Running custom and preset code generates step-by-step traces for all three languages.
- [x] **Auto-Follow**: Viewport follows the active element and centers it smoothly with comfortable margins.
- [x] **Mobile Responsiveness**: Viewport tested at 360px, 390px, 430px, 768px, 1024px, and 1440px. The last array element is never clipped and is fully scrollable inside the viewport.
- [x] **Developer Credit**: Confirmed *"Developed by Pratyush Jaiswal"* is visible in the application footer.
- [x] **Static Independence**: Zero calls to external backend APIs; 100% client-side operation.

---

## 7. Quality Assurance & Test Results

The application underwent rigorous automated testing across all 41 educational presets and UI criteria (`test_all_examples.js`):

| Test Category | Total Presets | Status | Trace Generation |
| :--- | :---: | :---: | :--- |
| **C Language (C99)** | 19 Examples | **100% PASS** | Real AST execution traces for Arrays, Lists, Stacks, Queues, BST, Search, Sort, Patterns |
| **Python (3.x)** | 13 Examples | **100% PASS** | Real AST execution traces for Lists, Stacks, Queues, Linked Lists, Algorithms, Patterns |
| **Java (17)** | 9 Examples | **100% PASS** | Real AST execution traces for Arrays, Stacks, Queues, Search, Sort, Patterns |
| **UI & Auto-Follow** | 7 Criteria | **100% PASS** | Auto-Follow UI, Language Selector, Prominent Run Button, Responsive Breakpoints, Safe Centering |

---

## 8. License & Developer Credit

Developed by **Pratyush Jaiswal**.
Created for students, educators, and developers worldwide to learn Data Structures and Algorithms with visual clarity.
