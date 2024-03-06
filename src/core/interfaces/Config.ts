export interface Config {
	get(name: string): string
}

export enum ConfigEnum {
  PORT = "PORT",
  NODE_ENV = "NODE_ENV",
  DB_HOST = "DB_HOST",
  DB_NAME = "DB_NAME",
  DB_USERNAME = "DB_USERNAME",
  DB_PASSWORD = "DB_PASSWORD",
  DB_PORT = "DB_PORT",
}