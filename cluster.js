const cluster = require('cluster');
const numOfCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);
  // Fork workers.
  for (let index = 0; index < numOfCPUs; index++) {
    cluster.fork();
  }
  cluster.on('online', function(worker) {
    console.log(`worker ${worker.process.pid} is online`);
  });
  cluster.on('exit', (worker, code, signal) => {
    /*
      worker.exitedAfterDisconnect will be true if we kill the worker voluntary say using worker.kill() or disconnect()
      similarly code !==0 means worker exited with error code 
    */
    if (code !== 0 && !worker.exitedAfterDisconnect) {
      console.log(`worker ${worker.process.pid} so, starting a new one`);
      cluster.fork();
    } else {
      console.log(`worker ${worker.process.pid} killed voluntary`);
    }
  });
} else {
  // Workers can share any TCP connection
  require('./app');
  console.log(`Worker ${process.pid} started`);
}