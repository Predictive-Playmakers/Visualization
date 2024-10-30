# Tournament Bracket Visualizer

An interactive NCAA tournament bracket visualizer built with React and TypeScript. Features drag-and-drop functionality for managing teams through tournament rounds.

![Tournament Bracket Demo](screenshot.png)

## Features

- Interactive drag-and-drop bracket management
- Real-time score tracking
- Conference-based team coloring
- Responsive design
- Tournament progress visualization

## Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Predictive-Playmakers/Visualization.git
cd Visualization
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Bracket Navigation
- Teams are initially populated in the first round
- Drag teams to advance them through rounds
- Teams are color-coded by conference:
  - Blue: East Region
  - Green: West Region

### Team Management
- Drag and drop teams between rounds
- Scores are automatically generated for advancing teams
- Teams must advance through proper matchups
- Conference restrictions apply until final rounds

### Interface Controls
- **Settings**: Configure bracket settings (coming soon)
- **Collaborators**: Manage shared access (coming soon)
- **Save**: Save current bracket state (coming soon)
- **Export**: Export bracket data (coming soon)

## Project Structure

```
tournament-bracket/
├── src/
│   ├── components/
│   │   └── TournamentBracket.tsx   # Main bracket component
│   ├── App.tsx                     # Root application component
│   ├── index.tsx                   # Application entry point
│   └── index.css                   # Global styles and Tailwind imports
├── public/
├── package.json
└── tailwind.config.js
```

## Local Development

1. Install VSCode Extensions (recommended):
   - Tailwind CSS IntelliSense
   - ESLint
   - Prettier

2. Configure VSCode settings:
```json
{
  "css.validate": false,
  "tailwindCSS.emmetCompletions": true,
  "editor.quickSuggestions": {
    "strings": true
  }
}
```

3. Run in development mode:
```bash
npm start
```

4. Build for production:
```bash
npm run build
```

## Technologies Used

- React 18
- TypeScript
- Tailwind CSS
- Lucide Icons
- HTML5 Drag and Drop API

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Known Issues

- Connecting lines between matchups not yet implemented
- Mobile drag-and-drop support limited
- Team validation rules need refinement

## Future Enhancements

- [ ] Add connecting lines between matchups
- [ ] Implement bracket history/undo
- [ ] Add team statistics display
- [ ] Improve mobile responsiveness
- [ ] Add tournament simulation features
- [ ] Implement bracket sharing

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Design inspired by official NCAA bracket visualizations
- Built for the Predictive Playmakers project