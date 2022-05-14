import { Injectable } from '@nestjs/common';
import { SwedenCityEnum } from '../enums/sweden-city.enum';

@Injectable()
export class CityService {
  public getCities() {
    return Object.entries(SwedenCityEnum).map(([_, value]) => value);
  }
}
