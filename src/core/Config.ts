import { Config, ConfigEnum } from "./interfaces/Config";

export class EnvConfig implements Config {
  get(name: ConfigEnum) {
    const envVariable = process.env[name];

    if (!envVariable) {
      throw new Error(`Error loading environmental variable ${name}.`);
    }

    return envVariable;
  }
}