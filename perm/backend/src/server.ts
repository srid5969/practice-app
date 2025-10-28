import { env } from "./environment";
import App from "./app";

const app: App = new App();
app.init().then(() => {
  const PORT = env.port;
  app.httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});