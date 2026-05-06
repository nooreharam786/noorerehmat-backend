import { app } from "./app";
import { env } from "./config/env";

if (require.main === module) {
  app.listen(env.PORT, () => {
    console.log(`Sacred Journey API running on http://localhost:${env.PORT}`);
  });
}

export default app;
