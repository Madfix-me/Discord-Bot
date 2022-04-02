import {Logger, QueryRunner} from "typeorm";
import winston from "winston";

export class TypeormWinstonAdapter implements Logger {
    log(level: "log" | "info" | "warn", message: any, queryRunner?: QueryRunner): any {
        winston.log(level, message);
    }

    logMigration(message: string, queryRunner?: QueryRunner): any {
    }

    logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner): any {
        winston.log("info", query, parameters);
    }

    logQueryError(error: string | Error, query: string, parameters?: any[], queryRunner?: QueryRunner): any {
        winston.log("error", error.toString(), query, parameters);
    }

    logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner): any {
        winston.log("warn", `Slow query: ${time}ms`, query, parameters);
    }

    logSchemaBuild(message: string, queryRunner?: QueryRunner): any {
    }

}
