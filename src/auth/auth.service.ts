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
    // 1. Buscamos si el usuario ya se logueó con Google antes
    let user = await this.usersService.findByGoogleId(details.googleId);
    if (user) {
      return user;
    }

    // 2. Si no existe con Google, buscamos si ya existe un registro con ese email
    user = await this.usersService.findByEmail(details.email);
    if (user) {
      user.googleId = details.googleId;
      user.picture = details.picture;
      return await this.usersService.saveUser(user);
    }

    // 3. Si no existe de ninguna forma, lo creamos como nuevo
    return await this.usersService.createUser(details);
  }

  // Generamos el token de sesión
  generateJwt(user: any) {
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}