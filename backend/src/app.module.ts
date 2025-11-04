import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosModule } from './modulos/usuarios/usuarios.module';
import { AuthGuard } from './core/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { ClientesModule } from './modulos/clientes/clientes.module';
import { ProductosModule } from './modulos/productos/productos.module';
import { CategoriaModule } from './modulos/categoria/categoria.module';
import { VentasModule } from './modulos/ventas/ventas.module';
import { DashboardModule } from './modulos/dashboard/dashboard.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    UsuariosModule,
    ClientesModule,
    ProductosModule,
    CategoriaModule,
    VentasModule,
    DashboardModule,
  ],
  controllers: [],
  providers: [{
    provide: 'APP_GUARD',
    useClass: AuthGuard
  }, JwtService],
})
export class AppModule {}
