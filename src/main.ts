require("dotenv").config();

import { App } from "./core/App";
import { EnvConfig } from "./core/Config";
import { WinstonLogger } from "./core/WinstonLogger";
import { createProductsRouter } from "./product/Product.router";
import { createCartRouter } from "./cart/Cart.router";

async function main() {
  const app = new App();
  const logger = new WinstonLogger("App");
  const config = new EnvConfig();

  app.bootstrap(logger, config);

  app.addRouter("/products", createProductsRouter());
  app.addRouter("/cart", createCartRouter());

  app.startHTTPServer();
}

main();
