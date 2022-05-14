const clients = {};

export function sendEventsToAll(clientId: string) {
  const client = clients[clientId];
  console.log({ client, clientId, clients });
  if (client) {
    client.response.write(`data sent to this client ${clientId}`);
  }
}

export function sseEventsHandler(request, response, next) {
  const headers = {
    'Content-Type': 'text/event-stream',
    Connection: 'keep-alive',
    'Cache-Control': 'no-cache',
  };
  response.writeHead(200, headers);

  const data = `connection started`;

  response.write(data);

  let clientId = request.query?.id;

  clients[clientId] = { response };

  console.log('middleware got called');

  request.on('close', () => {
    console.log(`${clientId} Connection closed`);
    // clients = clients.filter((client) => client.id !== clientId);
    delete clients[clientId];
  });

  clientId++;
  // next();
}
