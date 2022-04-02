import {DataSource} from "typeorm";
import winston from "winston";
import {TypeormWinstonAdapter} from "../logging/typeormWinstonAdapter";


export class EnvironmentProcessor {

    public static dataSqlLiteSource(): DataSource {
        return new DataSource({
            type: "sqlite",
            database: "data/bot.db",
            synchronize: true,
            logging: true,
            logger: new TypeormWinstonAdapter(),
            entities: [
                "src/bot/api/models/*.ts",
            ],
        });
    }

    public static dataPostgresSource(): DataSource {
        return new DataSource({
            type: "postgres",
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            username: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            synchronize: true,
            logging: false
        });
    }

   public static isProduction(): boolean {
        return process.env.NODE_ENV === "production";
    }
}
