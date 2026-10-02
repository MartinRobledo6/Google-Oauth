import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity.js';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findByGoogleId(googleId: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ googleId });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ email });
  }

  async saveUser(user: User): Promise<User> {
    return this.usersRepository.save(user);
  }

  async createUser(details: Partial<User>): Promise<User> {
    const newUser = this.usersRepository.create(details);
    return this.usersRepository.save(newUser);
  }
}