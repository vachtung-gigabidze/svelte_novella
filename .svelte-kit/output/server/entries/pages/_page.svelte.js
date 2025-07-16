import "clsx";
import { Q as pop, O as push } from "../../chunks/index.js";
import { createClient } from "@supabase/supabase-js";
import "@sveltejs/kit/internal";
import "../../chunks/exports.js";
import "../../chunks/state.svelte.js";
const supabaseUrl = "https://vycjpmuyscfygstjjied.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ5Y2pwbXV5c2NmeWdzdGpqaWVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyMTQxMDcsImV4cCI6MjA2Mjc5MDEwN30.3t3wUSpe8n0PHPscRQx5vu_fX9B5_d0bEOJMvwLPYAQ";
const supabase = createClient(supabaseUrl, supabaseKey);
function Auth($$payload, $$props) {
  push();
  {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<p>Для авторизации откройте приложение в Telegram</p>`;
  }
  $$payload.out += `<!--]-->`;
  pop();
}
function StoryList($$payload, $$props) {
  push();
  $$payload.out += `<div class="story-list svelte-ch64z8">`;
  {
    $$payload.out += "<!--[-->";
    $$payload.out += `<p>Загрузка...</p>`;
  }
  $$payload.out += `<!--]--></div>`;
  pop();
}
function _page($$payload, $$props) {
  push();
  let isLoggedIn = false;
  supabase.auth.onAuthStateChange((event) => {
    isLoggedIn = event === "SIGNED_IN";
  });
  if (!isLoggedIn) {
    $$payload.out += "<!--[-->";
    Auth($$payload);
  } else {
    $$payload.out += "<!--[!-->";
    StoryList($$payload);
  }
  $$payload.out += `<!--]-->`;
  pop();
}
export {
  _page as default
};
