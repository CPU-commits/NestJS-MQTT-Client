import { Global, Module } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import config from 'src/config'

@Global()
@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            inject: [config.KEY],
            useFactory: (configService: ConfigType<typeof config>) => {
                const { user, host, dbName, password, port } =
                    configService.postgres
                return {
                    type: 'postgres',
                    host,
                    username: user,
                    port,
                    password,
                    database: dbName,
                }
            },
        }),
    ],
    exports: [TypeOrmModule],
})
export class DatabaseModule {}
