import { Types } from 'mongoose';
import { Set } from '../../types/set.type';
import { EloDTO, EloTeamDTO } from '../../../common/dto/elo.dto';

export const eloRatingStub = (): EloDTO => {
  const teamA: EloTeamDTO = {
    _id: Types.ObjectId('60f144f712ca6712c035953c'),
    players: [
      {
        _id: Types.ObjectId('60f144f712ca6712c035843c'),
        rankPoint: 2600,
      },
      {
        _id: Types.ObjectId('60f144f712ca6712c035853c'),
        rankPoint: 2700,
      },
    ],
  };
  const teamB: EloTeamDTO = {
    _id: Types.ObjectId('60f144f712ca6712c035753c'),
    players: [
      {
        _id: Types.ObjectId('60f144f712ca6712c035643c'),
        rankPoint: 2800,
      },
      {
        _id: Types.ObjectId('60f144f712ca6712c035653c'),
        rankPoint: 2300,
      },
    ],
  };

  const sets: Set[] = [
    { teamAPoint: 6, teamBPoint: 4 },
    { teamAPoint: 4, teamBPoint: 6 },
    { teamAPoint: 6, teamBPoint: 4 },
  ];

  const eloDto: EloDTO = {
    teamA: teamA,
    teamB: teamB,
    sets: sets,
  };
  return eloDto;
};
