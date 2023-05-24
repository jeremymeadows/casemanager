import { redirect } from "@sveltejs/kit";

export async function GET() {
  throw redirect(307, '/admin/settings');
}
