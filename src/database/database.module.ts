import { Module, Global } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'

//Config
import config from '../config'

@Global()
@Module({
    imports: [
        MongooseModule.forRootAsync({
            useFactory: (configService: ConfigType<typeof config>) => {
                const { connection, host, port, dbName, user, password } =
                    configService.mongo
                return {
                    uri: `${connection}://${user}:${password}@${host}:${port}`,
                    dbName,
                }
            },
            inject: [config.KEY],
        }),
    ],
    exports: [MongooseModule],
})
export class DatabaseModule {}
