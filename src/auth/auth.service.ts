import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service.js';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateGoogleUser(details: any) {
    let user = await this.usersService.findByGoogleId(details.googleId);
    if (user) {
      return user;
    }

    user = await this.usersService.findByEmail(details.email);
    if (user) {
      user.googleId = details.googleId;
      user.picture = details.picture;
      return await this.usersService.saveUser(user);
    }

    return await this.usersService.createUser(details);
  }
  generateJwt(user: any) {
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}