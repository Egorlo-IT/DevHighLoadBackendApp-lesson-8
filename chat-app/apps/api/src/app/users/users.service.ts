import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersEntity } from './users.entity';
import { Role } from '../auth/role/role.enum';
import { UserCreateDto } from './dto/user-create.dto';
import { hash } from '../../utils/crypto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>
  ) {}

  async create(user: UserCreateDto, avatarPath?: string) {
    const userEntity = new UsersEntity();
    userEntity.firstName = user.firstName;
    userEntity.lastName = user.lastName;
    userEntity.email = user.email;
    userEntity.password = await hash(user.password);
    userEntity.roles = user.role;
    userEntity.avatar = avatarPath ? avatarPath : null;

    return await this.usersRepository.save(userEntity);
  }

  async findById(id: string): Promise<UsersEntity> {
    const data = await this.usersRepository.findOneById(id);
    return data;
  }

  async findByEmail(email: string): Promise<UsersEntity> {
    const data = await this.usersRepository.find({
      where: {
        email: email,
      },
    });

    return data[0];
  }

  async setModerator(idUser: string): Promise<UsersEntity> {
    const _user = await this.findById(idUser);
    if (!_user) {
      throw new UnauthorizedException();
    }
    _user.roles = Role.Moderator;
    return this.usersRepository.save(_user);
  }

  async edit(user: UsersEntity, idUser: string) {
    const result = await this.usersRepository.update(idUser, user);
    return result;
  }

  async findAll(): Promise<UsersEntity[]> {
    const data = await this.usersRepository.find();
    return data;
  }
}
