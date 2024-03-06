import "reflect-metadata";
import { DataSource } from "typeorm";
import { EnvConfig } from "./core/Config";

import * as dotenv from "dotenv";
import { ConfigEnum } from "./core/interfaces/Config";
import {WinstonLogger} from './core/WinstonLogger'

dotenv.config();

const logger = new WinstonLogger("DATABASE")
const config = new EnvConfig();

const NODE_ENV = config.get(ConfigEnum.NODE_ENV);
const dbHost = config.get(ConfigEnum.DB_HOST);
const dbName = config.get(ConfigEnum.DB_NAME);
const dbPassowrd = config.get(ConfigEnum.DB_PASSWORD);
const dbPort = config.get(ConfigEnum.DB_PORT);
const dbUsername = config.get(ConfigEnum.DB_USERNAME);

export const PostgresDataSource = new DataSource({
  type: "postgres",
  host: dbHost,
  port: parseInt(dbPort || "5432"),
  username: dbUsername,
  password: dbPassowrd,
  database: dbName,

  synchronize: NODE_ENV === "dev" ? true : false,
  //logging logs sql command on the treminal
  logging: NODE_ENV === "dev" ? false : false,
  entities: [__dirname + "/../**/*.entity.{js,ts}"],
  migrations: [__dirname + "migrations/*.ts"],
	migrationsTableName: "custom_migration_table",
  subscribers: [],
});

PostgresDataSource.initialize().then(() => {
	logger.info("Data Source has been initialized")
}).catch((err) => {
	logger.error("Error during Data Source initialization")
	logger.error(err)
})