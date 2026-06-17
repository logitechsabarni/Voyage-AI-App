import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { generateTripPlan } from './server/core/geminiEngine';
import { getDestinationWeather } from './server/services/weather';
import { generatePersonalizedRecommendations } from './server/services/recommendationEngine';
import { TripRequest } from './src/types';

// Load variables from .env
dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Global parse middlewares
  app.use(express.json());

  // API Route: Heartbeat / Health Check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'healthy', platform: 'VoyageAI Pro server framework' });
  });

  // API Route: Core Travel Planning Engine
  app.post('/api/plan-trip', async (req, res) => {
    try {
      const tripParams: TripRequest = req.body;
      
      if (!tripParams.destinationCity || !tripParams.startDate) {
        res.status(400).json({ error: 'destinationCity and startDate are required fields' });
        return;
      }

      console.log(`[VoyageAI] Planning customized trip to ${tripParams.destinationCity}...`);

      // Trigger parallel asynchronous generators for high speed execution
      const [itineraryPlan, weatherReport] = await Promise.all([
        generateTripPlan(tripParams),
        Promise.resolve(getDestinationWeather(tripParams.destinationCity, tripParams.destinationCountry, tripParams.duration, tripParams.startDate))
      ]);

      // Calculate localized matches & scores algorithmically
      const rankedInterests = generatePersonalizedRecommendations(tripParams);

      res.json({
        plan: itineraryPlan,
        weather: weatherReport,
        recommendations: rankedInterests
      });
    } catch (error: any) {
      console.error('[VoyageAI] Exception during api/plan-trip:', error);
      res.status(500).json({
        error: 'Engine timed out or faulted',
        message: 'VoyageAI temporarily switched to intelligent offline mode'
      });
    }
  });

  // API Route: Separate Weather service just in case
  app.get('/api/weather', (req, res) => {
    const { city, country, duration, startDate } = req.query;
    if (!city || !startDate) {
       res.status(400).json({ error: 'Missing city or startDate parameter' });
       return;
    }
    const weather = getDestinationWeather(
      String(city),
      String(country || ''),
      Number(duration || 5),
      String(startDate)
    );
    res.json(weather);
  });

  // Hot module replacement or static file serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`-----------------------------------------------`);
    console.log(`✈️  VoyageAI Pro Travel Platform Active`);
    console.log(`   Running securely on http://localhost:${PORT}`);
    console.log(`-----------------------------------------------`);
  });
}

startServer();
