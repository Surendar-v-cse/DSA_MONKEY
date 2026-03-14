# DSA MONKEY – Visualizing Data Structures & Algorithms

Algo Lab is an interactive web application designed to teach core Data Structures and Algorithms through clear visualizations and step-by-step animations. Instead of reading static explanations, users can see how algorithms operate internally.

The platform focuses on a small set of fundamental algorithms explained with high clarity, interactive controls, and visual demonstrations.

The interface follows a Neo-Brutalism inspired design combined with retro computing aesthetics to create a unique learning experience.

---

# What This Project Does

Algo Lab helps users understand algorithm behavior by visualizing each step of execution.

Users can:

• Watch algorithms operate step by step
• Control execution speed
• Pause and resume animations
• Observe comparisons, swaps, and traversal paths
• Read explanations and pseudocode alongside the visualization

The goal is to make algorithm logic intuitive through interactive learning.

---

# Algorithms Included

The platform focuses on a few carefully selected algorithms explained with detailed visualization.

## Sorting

* Bubble Sort
* Quick Sort

## Searching

* Binary Search

## Trees

* Binary Tree Traversal

  * Inorder
  * Preorder
  * Postorder

## Graphs

* Breadth First Search (BFS)
* Depth First Search (DFS)

Each algorithm includes:

• Animated visualization
• Concept explanation
• Example walkthrough
• Pseudocode
• Time complexity analysis

---

# Technologies Used

## Frontend

React + Vite
Modern JavaScript (ES6+)
HTML5
CSS3

# Features

Interactive algorithm visualizations
Step-by-step execution
Speed control for animations
Clean Neo-Brutalism interface
Retro themed intro animation
Algorithm explanation panel
Pseudocode and complexity display
Responsive layout

---

# Project Structure

Below is the simplified structure of the project.

```
DSA MONKEY/
│
├── public
│   └── assets
│       └── models
│
├── src
│   ├── components
│   │   ├── visualizers
│   │   │   ├── sorting
│   │   │   ├── searching
│   │   │   ├── trees
│   │   │   └── graphs
│   │   │
│   │   ├── controls
│   │   ├── explanation-panel
│   │   └── layout
│   │
│   ├── pages
│   │   ├── home
│   │   ├── sorting
│   │   ├── searching
│   │   ├── trees
│   │   └── graphs
│   │
│   ├── animations
│   │   └── intro-scene
│   │
│   ├── utils
│   │   └── algorithm-logic
│   │
│   ├── styles
│   │   └── global.css
│   │
│   └── main application entry
│
└── README.md
```

---

# How the Visualizations Work

Each algorithm is implemented as a reusable visualization component.

The algorithm logic runs step by step while updating the visualization state.

The interface highlights:

• elements being compared
• nodes being visited
• swaps or traversal paths

Users can pause, resume, or step through the algorithm to better understand its behavior.

---

# Running the Project Locally

Clone the repository

```
git clone https://github.com/Surendar-v-cse/DSA_MONKEY.git
```

Navigate into the project directory

```
cd DSA_MONKEY
```

Install dependencies

```
npm install
```

Run the development server

```
npm run dev
```

Open the browser at

```
http://localhost:5173
```

---

# Future Improvements

Additional algorithms and visualizations
Algorithm comparison tools
Interactive coding challenges
User progress tracking
More data structure visualizations

---

