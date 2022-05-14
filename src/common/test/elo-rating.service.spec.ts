import { MatchResult } from '../enums/MatchResult.enum';
import { EloRatingService } from '../services/elo-rating/elo-rating.service';
import { eloRatingStub } from './stubs/elo-rating.stub';

describe('EloRatingService', () => {
  const eloRatingInput = eloRatingStub();
  let service = new EloRatingService(eloRatingInput);

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('service should get proper value when teamA winner', () => {
    expect(service.teamARating).toEqual(20);
    expect(service.teamBRating).toEqual(-20);
  });

  it('service should get proper value when teamA looser', () => {
    eloRatingInput.sets = [
      { teamAPoint: 6, teamBPoint: 4 },
      { teamAPoint: 4, teamBPoint: 6 },
      { teamAPoint: 4, teamBPoint: 6 },
    ];
    service = new EloRatingService(eloRatingInput);
    expect(service.teamARating).toEqual(-36);
    expect(service.teamBRating).toEqual(36);
  });

  it('service should get proper value when teamA makes draw', () => {
    eloRatingInput.sets = [
      { teamAPoint: 6, teamBPoint: 4 },
      { teamAPoint: 4, teamBPoint: 6 },
      { teamAPoint: 5, teamBPoint: 5 },
    ];
    service = new EloRatingService(eloRatingInput);
    expect(service.teamARating).toEqual(-8);
    expect(service.teamBRating).toEqual(8);
  });

  it('service should get proper value when teamA wins in single game', () => {
    eloRatingInput.sets = [];
    eloRatingInput.isTeamAWinner = MatchResult.WINNER;
    service = new EloRatingService(eloRatingInput);
    expect(service.teamARating).toEqual(12);
    expect(service.teamBRating).toEqual(-12);
  });

  it('service should get proper value when teamA looses in single game', () => {
    eloRatingInput.sets = [];
    eloRatingInput.isTeamAWinner = MatchResult.LOOSER;
    service = new EloRatingService(eloRatingInput);
    expect(service.teamARating).toEqual(-20);
    expect(service.teamBRating).toEqual(20);
  });

  it('service should get proper value when teamA makes draw in single game', () => {
    eloRatingInput.sets = [];
    eloRatingInput.isTeamAWinner = MatchResult.DRAW;
    service = new EloRatingService(eloRatingInput);
    expect(service.teamARating).toEqual(-4);
    expect(service.teamBRating).toEqual(4);
  });
});
