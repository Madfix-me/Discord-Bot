import {DataSource} from "typeorm";
import {EnvironmentProcessor} from "./utils/environmentProcessor";
import winston from "winston";


export class Database {

    public readonly _dataSource: DataSource;

    constructor(result: () => void) {
        this._dataSource = EnvironmentProcessor.isProduction() ? EnvironmentProcessor.dataPostgresSource() : EnvironmentProcessor.dataSqlLiteSource();
        this._dataSource.initialize().then(() => {
            winston.info("Database initialized");
            result();
        }).catch(reason => {
            winston.error("Database initialization failed");
            winston.error(reason);
        });
    }
}
