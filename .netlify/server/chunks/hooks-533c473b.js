const handle = async ({ event, resolve }) => {
  const response = await resolve(event);
  response.headers.set("Access-Control-Allow-Origin", "*");
  return response;
};
export { handle };
