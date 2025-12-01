const { exec } = require('child_process');
const path = require('path');

function runCpp(executable, input = '', callback) {
  const execPath = path.join(__dirname, '../../algorithms', executable);
  const command = input ? `${execPath} ${input}` : execPath;
  
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing ${executable}:`, error);
      callback({ error: stderr || error.message });
    } else {
      callback({ success: true, output: stdout.trim() });
    }
  });
}

module.exports = runCpp;