export default async function fetchCustomPages() {
  const response = await fetch('/api/custom-pages');

  return response.json();
}
