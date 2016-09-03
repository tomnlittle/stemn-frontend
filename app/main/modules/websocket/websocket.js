import Primus from 'primus';

const Socket = Primus.createSocket({ transformer : 'websockets' });

const lib = {
  log : (data) => console.log(data)
};

export const initialise = (config) => {
  const socket = new Socket(`${config.host}:${config.port}?authorization=${config.token}`);



  const socketError = (err) => socket.write({
    action : 'log',
    payload : {
      type : 'error',
      message : err.message
    }
  });

  socket.on('error', socketError);

  return socket;
}
