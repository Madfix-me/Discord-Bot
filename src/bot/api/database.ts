import {DataSource} from "typeorm";
import {EnvironmentProcessor} from "./utils/environmentProcessor";
import winston from "winston";


export class Database {

    public readonly _dataSource: DataSource;

    constructor() {
        this._dataSource = EnvironmentProcessor.isProduction() ? EnvironmentProcessor.dataPostgresSource() : EnvironmentProcessor.dataSqlLiteSource();
        this._dataSource.initialize().then(() => {
            winston.info("Database initialized");
        }).catch(error => {
            winston.error("Database initialization failed");
            winston.error(error);
        });
    }
}
