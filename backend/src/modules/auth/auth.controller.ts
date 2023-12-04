import {
  Controller,
  Req,
  Res,
  Get,
  UseGuards,
  Options,
  Redirect,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { PrismaClient } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { JWT_SECRET } from './constants';
import { UserService } from 'modules/user/user.service';
import { JwtAuthGuard } from './jwt-auth.guard';

const prisma = new PrismaClient();

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
    private userservive: UserService,
  ) {}

  @Get()
  home(): any {
    return 'Home';
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req) {
    return req.user;
  }
  
  
  @Get('user')
  // @UseGuards(JwtAuthGuard)
  async user(@Req() req: any) {
    try {
      const ccokie = req.cookies;
      
      const userfromcookie =  this.authService.getUserFromCookie(ccokie);
      if (userfromcookie === undefined)
      {
        return undefined;
      }
      return this.userservive.getUserbyId(userfromcookie.intraId);
    } catch (e) {
      console.log('Error: ', e);
      return 'Error : indefind user';
    }
  }

  @Get('42')
  @UseGuards(AuthGuard('42'))
  login(@Res() res: any) {
    res.redirect('http://localhost:3000/profile');
  }

  @Get('42/callback')
  @UseGuards(AuthGuard('42'))
  async callback(@Req() req: any, @Res() res: any, @Res() response: any) {
    try {      
      let userdata = this.authService.getUser(req.user);

        const userExists = await prisma.user.findUnique({
          where: {
            intraId: userdata.intraId,
          },
        });
        if (userExists) {
          // res.redirect('http://localhost:3001/auth/user');
          
          const { created_at, updated_at, ...userWithoutDate } = userExists;
          console.log('userWithoutDate: ' , userWithoutDate);

          const payload = { userWithoutDate };
          const jwt = this.jwtService.sign(payload, {
            secret: JWT_SECRET,
          });
          res.cookie('jwt', jwt);
          return this.login(res);
        }


      const user = await prisma.user.create({
        data: {
          intraId: req.user.UId,
          fullname: req.user.usual_full_name,
          login: req.user.username,
          email: req.user.email,
          Avatar: req.user.Avatar,
          created_at: new Date(),
          updated_at: new Date(),
        },
      });

      const { created_at, updated_at, ...userWithoutDate } = user;
      console.log('userWithoutDate: ' , userWithoutDate);


      const payload = { userWithoutDate };
      const jwt = this.jwtService.sign(payload, {
        secret: JWT_SECRET,
      });
      res.cookie('jwt', jwt);
      // response.redirect('http://localhost:3001/auth/user');
      return this.login(res);
    } catch (e) {
      console.log('Error: ', e);
    }
  }

  @Get('logout')
  async logout(@Res() res: any) {
    try {
      res.clearCookie('jwt');
      // const user = await prisma.user.delete({
      //   where: {
      //     intraId: res.user.UId,
      //   },
      // });
      // res.redirect('http://localhost:3001/auth/user');
      return 'logout';
    } catch (e) {
      console.log('Error: ', e);
      res.status(500).send('Internal Server Error');
    }
  }
}

// TODO
// 1- user logs in to 42, ans issues a token (JWT)
// 2- the broswer store the JWT in a cookie or local storage
// 3- on every request, the browser sends the JWT in the header
// 4- the server validates the JWT and sends the response
// 5- the server sends a new JWT if the old one is expired