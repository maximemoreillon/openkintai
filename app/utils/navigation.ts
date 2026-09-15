// Vue Router only knows the current tab's own navigation history — if a page
// was opened directly (typed URL, bookmark, external link) there's nothing
// to go back to, and router.back() would either no-op or leave the app
// entirely. `history.state.back` (set by Vue Router's HTML5 history) is
// null in that case, so fall back to a known route instead.
export function goBack(router: ReturnType<typeof useRouter>, fallback: string) {
  if (window.history.state?.back) {
    router.back();
  } else {
    router.push(fallback);
  }
}
