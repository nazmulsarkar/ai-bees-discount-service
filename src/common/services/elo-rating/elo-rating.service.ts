import { Injectable } from '@nestjs/common';
import { Set } from '../../types/set.type';
import { EloDTO, EloPlayerDTO } from '../../../common/dto/elo.dto';
import { MatchResult } from '../../enums/MatchResult.enum';
import { getWinPoints } from '../../helpers/utils';
const maxValueOfK = 64;

@Injectable()
export class EloRatingService {
  private factorK: number;
  private setCount: number;
  private teamAPlayers: EloPlayerDTO[];
  private teamBPlayers: EloPlayerDTO[];
  private avgRPTeamA: number;
  private avgRPTeamB: number;
  public isTeamAWinner: MatchResult;
  public teamARating: number;
  public teamBRating: number;

  constructor(eloDTO: EloDTO) {
    // console.log('cons: ', eloDTO);
    this.setCount = eloDTO.sets.length || 1;
    this.factorK = maxValueOfK * (1 - 1 / Math.pow(2, this.setCount));
    this.teamAPlayers = eloDTO.teamA.players;
    this.teamBPlayers = eloDTO.teamB.players;
    this.avgRPTeamA = this.getAvgRatingOfTeam(this.teamAPlayers);
    this.avgRPTeamB = this.getAvgRatingOfTeam(this.teamBPlayers);
    this.isTeamAWinner =
      eloDTO.sets.length > 0
        ? this.checkWinnerTeamA(eloDTO.sets)
        : eloDTO.isTeamAWinner;

    this.eloRating(
      this.avgRPTeamA,
      this.avgRPTeamB,
      this.factorK,
      this.isTeamAWinner,
    );
    // console.log(this.teamARating);
    // console.log(this.teamBRating);
  }

  // Function to calculate Elo rating
  // K is a constant.
  // d determines whether Player A wins or
  // Player B.
  public eloRating(Ra: number, Rb: number, K: number, d: MatchResult) {
    // console.log('eloR: ', Ra, Rb, K, d);
    // To calculate the Winning
    // Probability of Player B
    const Pb: number = this.probability(Ra, Rb);

    // To calculate the Winning
    // Probability of Player A
    const Pa: number = this.probability(Rb, Ra);

    // Case -1 When Player A wins
    // Updating the Elo Ratings
    if (d === MatchResult.WINNER) {
      this.teamARating = Math.round(K * (1 - Pa));
      this.teamBRating = Math.round(K * (0 - Pb));
    }

    // Case -2 When Player B wins
    // Updating the Elo Ratings
    else if (d === MatchResult.LOOSER) {
      this.teamARating = Math.round(K * (0 - Pa));
      this.teamBRating = Math.round(K * (1 - Pb));
    } else {
      this.teamARating = Math.round(K * (0.5 - Pa));
      this.teamBRating = Math.round(K * (0.5 - Pb));
    }
  }

  // Function to calculate the Probability / Expectation
  private probability(ratingA: number, ratingB: number): number {
    return (1 * 1) / (1 + 1 * Math.pow(10, (1 * (ratingA - ratingB)) / 400));
  }

  // Function to calculate the Probability / Expectation
  private getAvgRatingOfTeam(players: EloPlayerDTO[]): number {
    const rankPoints = players.map((p) => p.rankPoint);
    const sum = rankPoints.reduce((a, b) => a + b, 0);
    return sum / players.length;
  }

  // Function to calculate the Probability / Expectation
  private checkWinnerTeamA(sets: Set[]): MatchResult {
    const winPoint = getWinPoints(sets);
    let matchResult: MatchResult;
    const diff = winPoint.teamA - winPoint.teamB;
    if (diff > 0) {
      matchResult = MatchResult.WINNER;
    }
    if (diff < 0) {
      matchResult = MatchResult.LOOSER;
    }
    if (diff === 0) {
      matchResult = MatchResult.DRAW;
    }
    return matchResult;
  }
}
