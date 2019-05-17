const { spawn } = require('child_process');

// Start up a http-server that will host the web application.
const process = spawn('node', ['./node_modules/http-server/bin/http-server/', '-c-1', './app', '-p 8081']);

// Handle process messages.
process.stdout.on('data', (data) => {
  console.log(`Process stdout:\n${data}`);
});

process.stderr.on('data', (data) => {
  console.log(`Process stderr:\n${data}`);
});

process.on('close', (code) => {
  console.log(`Process child process exited with code ${code}`);
});
