import { env } from "./environment";
import App from "./app";
import logger from "./lib/logger";

const app: App = new App();
app.init().then(() => {
  const PORT = env.port;
  app.httpServer.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
    logger.info(`http://127.0.0.1:${PORT}`);
  });
});