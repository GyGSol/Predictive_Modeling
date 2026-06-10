/**
 * PRODE-5: Modelo de equipo (Liga Argentina)
 * T-Shirt: M
 */
import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema(
  {
    apiFootballId: { type: Number, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    code: { type: String, trim: true },
    logo: { type: String, trim: true },
    country: { type: String, default: 'Argentina', trim: true },
    leagueId: { type: Number, required: true, index: true },
    attackStrength: { type: Number, default: 1 },
    defenseStrength: { type: Number, default: 1 },
  },
  { timestamps: true }
);

export const Team = mongoose.models.Team || mongoose.model('Team', teamSchema);
