const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhNjNkODU4MzU2ODgxZTQwYzdlZGMwODg1ZTJmZmMwMSIsInN1YiI6IjY0MzEzNmVkMWI3Mjk0MDBmMWUyMzY0NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.bWUvPGhOJfx8QqaTG3TanX6MZ4HeTuS7imDpusDvPO4',
  },
};

export const personSearch = async (query: string) => {
  const response = await fetch(
    `https://api.themoviedb.org/3/search/person?query=${query}`,
    options
  );
  const data = await response.json();
  return data;
};
