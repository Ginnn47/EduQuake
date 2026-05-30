export const apiClient = {
  async get(path) {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`Request failed: ${response.status}`);
    return response.json();
  },
};
