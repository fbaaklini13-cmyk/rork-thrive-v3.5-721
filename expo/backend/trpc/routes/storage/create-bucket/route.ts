import { z } from "zod";
import { publicProcedure } from "@/backend/trpc/create-context";
import { createClient } from "@supabase/supabase-js";

const inputSchema = z.object({
  name: z.string().min(3).max(63).regex(/^[a-z0-9-]+$/, "lowercase letters, numbers, and dashes only"),
  public: z.boolean().default(false),
  fileSizeLimit: z.string().optional(),
  allowedMimeTypes: z.array(z.string()).optional(),
});

export default publicProcedure
  .input(inputSchema)
  .mutation(async ({ input }) => {
    const supabaseUrl = process.env.SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL || "";
    const serviceRole = process.env.SUPABASE_SERVICE_ROLE || "";

    if (!supabaseUrl || !serviceRole) {
      console.error("[storage.createBucket] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE env vars");
      throw new Error("Server is not configured with Supabase admin credentials");
    }

    const admin = createClient(supabaseUrl, serviceRole);

    console.log("[storage.createBucket] Creating bucket", input);

    const { data, error } = await admin.storage.createBucket(input.name, {
      public: input.public,
      fileSizeLimit: input.fileSizeLimit,
      allowedMimeTypes: input.allowedMimeTypes,
    });

    if (error) {
      console.error("[storage.createBucket] Error", error);
      throw new Error(error.message);
    }

    return { ok: true, bucket: data };
  });
