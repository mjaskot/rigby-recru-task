import express, { Router } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { errors } from "celebrate";

import { Config, ConfigEnum } from "./interfaces/Config";
import { Logger } from "./interfaces/Logger";
import { errorHandler } from "../errors/errorHandler";

export class App {
  #app: express.Express;
  #logger: Logger;
  #config: Config;

  bootstrap(logger: Logger, config: Config): App {
    this.#logger = logger;
    this.#config = config;

    this.#app = express();
    this.#app.use(bodyParser.json());
    this.#app.use(cors());

    return this;
  }

  addRouter(path: string, router: Router) {
    this.#app.use(path, router);
  }

  startHTTPServer(): void {
    this.#app.use(errors());
    this.#app.use(errorHandler);

    const port = this.#config.get(ConfigEnum.PORT);
    try {
      this.#app.listen(port, () => {
        this.#logger.info(`Server is listening on port -> ${port}`);
      });
    } catch (err: any) {
      this.#logger.error(err);
    }
  }
}
