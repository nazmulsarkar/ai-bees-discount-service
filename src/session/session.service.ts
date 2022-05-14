import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Session } from '../entities/session.entity';
import { CreateSessionDTO } from './dto/create-session.dto';

@Injectable()
export class SessionService {
  constructor(
    @InjectModel(Session.name) private readonly sessionModel: Model<Session>,
    private readonly jwtService: JwtService,
  ) {}

  async findOne(filter: Partial<Session>) {
    try {
      return this.sessionModel
        .findOne({
          ...filter,
        })
        .exec();
    } catch (err) {
      throw new NotFoundException(`Session not found!`);
    }
  }

  async create(createSessionDto: CreateSessionDTO) {
    const token = new this.sessionModel(createSessionDto);
    return await token.save();
  }

  async updateOne(
    filter: Partial<Session>,
    updateSessionDto: Partial<Session>,
  ): Promise<Session> {
    const updatedSession = await this.sessionModel.findOneAndUpdate(
      { ...filter },
      updateSessionDto,
      { new: true, upsert: true },
    );

    if (!updatedSession) {
      throw new NotFoundException(`Session not found!`);
    }

    return updatedSession;
  }

  async remove(id: string) {
    return await this.sessionModel.findOneAndDelete({ _id: id });
  }

  public async generateRefreshToken(userId: Types.ObjectId): Promise<Session> {
    try {
      const refreshToken = await this.jwtService.signAsync({
        userId,
      });
      const created = await this.updateOne(
        { userId },
        {
          userId,
          refreshToken,
        },
      );
      return created;
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  public async verifyAndGenerateRefreshToken(
    refreshToken: string,
  ): Promise<Session> {
    try {
      const { userId } = await this.jwtService.verify(refreshToken);

      const session = await this.findOne({ refreshToken });
      // if (!session) {
      //   return session;
      // }
      const { _id } = session;
      const newRefreshToken = await this.jwtService.signAsync({
        userId,
      });

      return this.updateOne(
        { _id },
        {
          refreshToken: newRefreshToken,
        },
      );
    } catch (err) {
      throw new UnauthorizedException(err);
    }
  }
}
