// Supabase Edge Function (Deno). Deploy: supabase functions deploy delete-account
// SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are provided by the platform; the
// service-role key never leaves the server.
import { createClient } from 'jsr:@supabase/supabase-js@2';
import { handleDeleteAccount } from './handler.ts';

const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, {
  auth: { persistSession: false, autoRefreshToken: false },
});

Deno.serve((req) =>
  handleDeleteAccount(req, {
    async getUserFromToken(token) {
      const { data, error } = await admin.auth.getUser(token);
      return error || !data.user ? null : { id: data.user.id };
    },
    async deleteUser(id) {
      const { error } = await admin.auth.admin.deleteUser(id);
      return { error: error ? error.message : null };
    },
  }),
);
