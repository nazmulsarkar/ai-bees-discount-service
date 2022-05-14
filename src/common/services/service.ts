// src/service.ts
import {
  Injectable,
  InternalServerErrorException,
  LoggerService,
} from '@nestjs/common';
import { Document, FilterQuery, Model, UpdateQuery } from 'mongoose';

/**
 * Abstract base service that other services can extend to provide base CRUD
 * functionality such as to create, find, update and delete data.
 */
@Injectable()
export abstract class Service<T extends Document> {
  private readonly modelName: string;
  private readonly serviceLogger: LoggerService;

  /**
   * The constructor must receive the injected model from the child service in
   * order to provide all the proper base functionality.
   *
   * @param {Logger} logger - The injected logger.
   * @param {Model} model - The injected model.
   */
  constructor(logger: LoggerService, private readonly model: Model<T>) {
    // Services who extend this service already contain a property called
    // 'logger' so we will assign it to a different name.
    this.serviceLogger = logger;

    for (const modelName of Object.keys(model.collection.conn.models)) {
      if (model.collection.conn.models[modelName] === this.model) {
        this.modelName = modelName;
        break;
      }
    }
  }

  /**
   * Find one entry and return the result.
   *
   * @throws InternalServerErrorException
   */
  async findOne(
    conditions: Partial<Record<keyof T, unknown>>,
    projection: string | Record<string, unknown> = {},
    options: Record<string, unknown> = {},
  ): Promise<T> {
    try {
      return await this.model.findOne(
        conditions as FilterQuery<T>,
        projection,
        options,
      );
    } catch (err) {
      this.serviceLogger.error(`Could not find ${this.modelName} entry:`);
      this.serviceLogger.error(err);
      throw new InternalServerErrorException();
    }
  }

  /**
   * Update one entry and return the result.
   *
   * @throws InternalServerErrorException
   */
  async updateOne(
    conditions: Partial<Record<keyof T, unknown>>,
    update: UpdateQuery<Record<keyof T, unknown>>,
    options: Record<string, unknown> = {},
  ): Promise<T> {
    try {
      return await this.model.findOneAndUpdate(
        conditions as FilterQuery<T>,
        update,
        options,
      );
    } catch (err) {
      this.serviceLogger.error(`Could not find ${this.modelName} entry:`);
      this.serviceLogger.error(err);
      throw new InternalServerErrorException();
    }
  }

  // More methods here such as: create, update and delete.
}
