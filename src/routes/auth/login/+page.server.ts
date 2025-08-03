import { SPLASH_MESSAGE } from "$env/static/public";

export async function load() {
  return {
    message: SPLASH_MESSAGE
  };
} 