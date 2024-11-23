# Bracket Visualization Application

This project provides a dynamic and interactive application for visualizing sports brackets, predicting match outcomes, and analyzing match statistics using SHAP visualizations.

## View Live

Check out the live application deployed on Netlify:

[Bracket Visualization Application](https://genuine-dolphin-0ec97a.netlify.app/)

## Features

- **Bracket Display**: Render sports brackets with interactive components.
- **Match Prediction**: Display predicted outcomes for matches with visualized SHAP contributions.
- **Team Preview**: Drag-and-drop enabled team cards for better user interactivity.
- **Statistics Modal**: View detailed match statistics with SHAP-based feature importance visualizations.
- **Responsive Design**: Adapts to various screen sizes for optimal user experience.

## Components Overview

### 1. `App.jsx`
The main application entry point that initializes and integrates all components.

### 2. `BracketConnector.jsx`
Handles the visual connections between different rounds in the bracket.

### 3. `BracketGroup.jsx`
Manages groups of matches within the same bracket level.

### 4. `BracketMatch.jsx`
Renders individual match details, including teams, statistics, and interactive features like SHAP visualizations.

### 5. `FinalMatches.jsx`
Displays the final rounds, including the championship match and semifinals, with responsive and interactive visuals.

### 6. `StatisticsModal.jsx`
A modal component for detailed SHAP visualizations. Fetches and displays SHAP data related to matches for better insights.

### 7. `TeamPreview.jsx`
A drag-and-drop-enabled component for previewing and arranging teams within the bracket.

## Getting Started

### Prerequisites

- **Node.js**: Ensure Node.js is installed on your system.
- **React**: The application is built with React and assumes familiarity with it.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo-url.git
   cd your-project-directory

2. Install dependencies:
   ```bash
   npm install


3. Start the development server:
   ```bash
   npm start
