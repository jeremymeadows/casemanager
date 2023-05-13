// import { get } from 'svelte/store';
import { redirect } from '@sveltejs/kit';
// import { cookies } from '$lib/utils/stores';
import { db } from '$lib/server/database';


export function get_session(cookies: any) {
  let session_id = cookies.get('session');
  if (!session_id) {
    throw redirect(307, '/auth/login')
  }
  return session_id;
}
