/** Copy text to the clipboard; show a toast either way (the clipboard can be blocked, so it is wrapped in try/catch). */
export async function copyText(text, toast, message = "Copied") {
  try {
    await navigator.clipboard.writeText(text);
    toast(message);
    return true;
  } catch {
    toast("Copying is not available in this browser");
    return false;
  }
}
