/**
 * PRODE-5: Modelo de partido
 * T-Shirt: M
 */
import mongoose from 'mongoose';

const matchSchema = new mongoose.Schema(
  {
    apiFootballId: { type: Number, required: true, unique: true, index: true },
    leagueId: { type: Number, required: true, index: true },
    season: { type: Number, required: true, index: true },
    round: { type: String, trim: true },
    homeTeamId: { type: Number, required: true, index: true },
    awayTeamId: { type: Number, required: true, index: true },
    kickoff: { type: Date, required: true, index: true },
    status: { type: String, default: 'NS', trim: true },
    homeGoals: { type: Number, default: null },
    awayGoals: { type: Number, default: null },
    predictedHomeGoals: { type: Number, default: null },
    predictedAwayGoals: { type: Number, default: null },
    probHomeWin: { type: Number, default: null },
    probDraw: { type: Number, default: null },
    probAwayWin: { type: Number, default: null },
  },
  { timestamps: true }
);

export const Match = mongoose.models.Match || mongoose.model('Match', matchSchema);
