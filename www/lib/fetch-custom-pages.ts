export default async function fetchCustomPages() {
  const response = await fetch('/api/site-config/custom-pages');

  return response.json();
}
