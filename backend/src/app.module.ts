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
import { PagosModule } from './modulos/pagos/pagos.module';
import { AutenticacionModule } from './modulos/autenticacion/autenticacion.module';
import { PerfilUsuarioModule } from './modulos/usuarios/perfil-usuario/perfil-usuario.module';
import { CloudinaryService } from './core/cloudinary.service';
import { CloudinaryProvider } from './core/cloudinary.config';


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
      // logging: ['query','error', 'warn']
    }),
    UsuariosModule,
    ClientesModule,
    ProductosModule,
    CategoriaModule,
    VentasModule,
    DashboardModule,
    PagosModule,
    PerfilUsuarioModule,
    AutenticacionModule
  ],
  controllers: [],
  providers: [{
    provide: 'APP_GUARD',
    useClass: AuthGuard
  }, JwtService, CloudinaryService, CloudinaryProvider],
})
export class AppModule {}
