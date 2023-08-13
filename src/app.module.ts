import * as path from 'path';
import { config } from './config';
import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { WishesModule } from './wishes/wishes.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) =>
        ({
          type: config.get('postgres_client'),
          host: config.get('postgres_host'),
          port: config.get('postgres_port'),
          username: config.get('postgres_user'),
          password: config.get('postgres_password'),
          database: config.get('postgres_db'),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          autoLoadEntities: true,
          synchronize: true,
        }) as TypeOrmModuleOptions,
      inject: [ConfigService],
    }),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'build'),
    }),
    WishesModule,
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
