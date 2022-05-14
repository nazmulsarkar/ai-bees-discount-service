import { PartialType } from '@nestjs/mapped-types';
import { CreateSessionDTO } from './create-session.dto';

export class UpdateSessionDTO extends PartialType(CreateSessionDTO) {}
