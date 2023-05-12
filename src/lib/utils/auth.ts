// import { get } from 'svelte/store';
import { redirect } from '@sveltejs/kit';
// import { cookies } from '$lib/utils/stores';

// export function get_cookies() {
//   let c: any = {};
//   document.cookie.split(';').forEach((e) => {
//     let [k, v] = e.split('=');
//     c[k] = v;
//   });
//   cookies.set(c);
// }

// export function require_auth() {
//   get_cookies();
//   if (get(cookies)['session']) {
//     window.location.href = '/auth/login';
//   }
// }

export function get_session(cookies: any) {
  let session_id = cookies.get('session');
  if (!session_id) {
    throw redirect(307, '/auth/login')
  }
  return session_id;
}
