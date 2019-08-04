export function execShellCommand(cmd: string): Promise<string> {
  const exec = require('child_process').exec;
  return new Promise((resolve, reject) => {
   exec(cmd, (error: any, stdout: string, stderr: string) => {
     if (error) {
       reject(stderr);
     } else {
       resolve(stdout.trim());
     }
   });
  });
}
