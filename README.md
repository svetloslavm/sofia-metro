# Sofia Metro [![Netlify Status](https://api.netlify.com/api/v1/badges/19f729a7-1162-49a9-84b0-e80cf72f23fd/deploy-status)](https://app.netlify.com/sites/sofiametro/deploys)

Sofia Metro is a web application designed to visualize and interact with urban planning data for Sofia, Bulgaria. Built with React and TypeScript, it leverages modern tools like Vite for fast development and Mapbox for interactive mapping.

## Technologies Used

- **React**: A JavaScript library for building user interfaces.
- **TypeScript**: A strongly typed programming language that builds on JavaScript.
- **Vite**: A fast development build tool.
- **Mapbox**: For interactive mapping and geospatial visualization.
- **Deck.gl**: A WebGL-powered framework for high-performance visualizations of large datasets.

## Screenshot

![Screenshot of Sofia Metro Application](./src/assets/screenshot.png)

## Data Source

The application uses GEOJSON data from the [Sofia Plan API](https://sofiaplan.bg/api/), providing detailed information about urban planning and development in Sofia.

## Getting Started

Follow these steps to set up and run the project locally:

1. **Clone the repository**:

   ```bash
   git clone https://github.com/svetloslavm/sofia-metro.git
   cd sofia-metro
   ```

2. **Set up environment variables**:

   Create a `.env` file in the root directory and add your Mapbox access token:

   ```env
   VITE_MAPBOX_TOKEN=your_mapbox_access_token
   ```

   Obtain your Mapbox access token by following the instructions at [Mapbox Access Tokens](https://docs.mapbox.com/help/getting-started/access-tokens/).

3. **Install dependencies**:

   ```bash
   npm install
   ```

4. **Start the development server**:

   ```bash
   npm run dev
   ```

5. **Open the application**:

   Navigate to `http://localhost:8000` in your browser.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
