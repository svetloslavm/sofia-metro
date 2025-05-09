# Sofia Metro [![Netlify Status](https://api.netlify.com/api/v1/badges/19f729a7-1162-49a9-84b0-e80cf72f23fd/deploy-status)](https://app.netlify.com/sites/sofiametro/deploys)

Sofia Metro is a React + TypeScript application built with Vite. It provides a modern and efficient setup for developing web applications with features like HMR (Hot Module Replacement) and ESLint integration.

## Features

- **React + TypeScript**: Leverage the power of React and TypeScript for building scalable and maintainable applications.
- **Vite**: Fast and modern build tool for web development.
- **Custom Plugins**: Includes plugins like `vite-tsconfig-paths` and `@svgr/rollup` for enhanced development experience.
- **Responsive Design**: Styled with CSS to ensure a consistent look across devices.

## Screenshot

![Screenshot of Face Landmark Detection](./src/assets/screenshot.png)

## Data Source

The application use GEOJSON data from [Sofia Plan API](https://sofiaplan.bg/api/), which provides information related to urban planning and development in Sofia.

## Getting Started

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd sofia-metro
   ```

2. Create a `.env` file in the root directory and add your Mapbox access token:

   ```env
   VITE_MAPBOX_TOKEN=your_mapbox_access_token
   ```

   You can obtain your Mapbox access token by following the instructions at [Mapbox Access Tokens](https://docs.mapbox.com/help/getting-started/access-tokens/).

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:8000`.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
