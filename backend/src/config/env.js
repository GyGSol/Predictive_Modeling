/**
 * PRODE-1: Setup inicial del backend
 * T-Shirt: S
 */
import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: Number(process.env.PORT || 5000),
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/predictive_modeling',
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  apiFootballKey: process.env.API_FOOTBALL_KEY || '',
  apiFootballBaseUrl: process.env.API_FOOTBALL_BASE_URL || 'https://v3.football.api-sports.io',
  ligaArgentinaLeagueId: Number(process.env.LIGA_ARGENTINA_LEAGUE_ID || 128),
  ligaArgentinaSeason: Number(process.env.LIGA_ARGENTINA_SEASON || 2024),
  homeAdvantage: Number(process.env.HOME_ADVANTAGE || 1.15),
  dixonColesRho: Number(process.env.DIXON_COLES_RHO || -0.13),
};
