import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  //   UseInterceptors,
} from '@nestjs/common';
import { AuthLoginDTO } from './dto/auth-login.dto';
import { AuthRegisterDTO } from './dto/auth-register.dto';
// import { AuthResetDTO } from './dto/auth-reset.dto';
// import { AuthForgetDTO } from './dto/auth-forget.dto';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { AuthGuard } from '../../guards/auth.guard';
import { User } from '../../decorators/user.decorator';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @ApiOperation({
    summary: 'Autenticar usuário',
    description: 'Autenticar usuário com email e senha.',
  })
  @Post('login')
  async login(@Body() { email, password }: AuthLoginDTO) {
    return this.authService.login(email, password);
  }

  @Post('register')
  async register(@Body() body: AuthRegisterDTO) {
    return this.authService.register(body);
  }

  //   @Post('forget')
  //   async forget(@Body() { email }: AuthForgetDTO) {
  //     return await this.authService.forget(email);
  //   }

  //   @Post('reset')
  //   async reset(@Body() { password, token }: AuthResetDTO) {
  //     return this.authService.reset(password, token);
  //   }

  @ApiOperation({
    summary: 'Detalhar usuário autenticado',
    description: 'Detalhar usuário autenticado.',
  })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard)
  @Post('me')
  async me(@User() user, @Req() { tokenPayload }) {
    return { user, tokenPayload };
  }
}
