import { createTRPCRouter } from "./create-context";
import hiRoute from "./routes/example/hi/route";
import createBucketRoute from "./routes/storage/create-bucket/route";

export const appRouter = createTRPCRouter({
  example: createTRPCRouter({
    hi: hiRoute,
  }),
  storage: createTRPCRouter({
    createBucket: createBucketRoute,
  }),
});

export type AppRouter = typeof appRouter;
