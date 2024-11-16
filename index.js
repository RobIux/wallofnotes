import cluster from 'cluster';
import os from 'os';
import { createServer } from './server/index.js';

const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
  console.log(`Master process ${process.pid} is running`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker process ${worker.process.pid} died. Restarting...`);
    cluster.fork();
  });
} else {
  createServer().listen(4567, () => {
    console.log(`Worker process ${process.pid} started server on port 4567`);
  });
}