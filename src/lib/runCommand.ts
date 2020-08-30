const fs = require('fs');
const { spawn } = require('child_process');
const path = require('path');

interface IRunCommandArgs {
  logger: { log: ((s: string) => void); error: ((s: string) => void)};
  command: any;
  defaultSpawnOptions: any;
}

export default function runCommand ({logger, command, defaultSpawnOptions}: IRunCommandArgs) {
  const cmd = command;
  cmd[2] = { ...defaultSpawnOptions, ...cmd[2] };
  console.log('spawn', cmd);
  const child = Reflect.apply(spawn, null, cmd);

  child.stderr.on('data', (chunk: string) => {
    if (logger && logger.error) {
      logger.error(chunk);
    }
  })
  child.stdout.on('data', (chunk: string) => {
    if (logger && logger.log) {
      logger.log(chunk)
    }
  })
  
  return {
    child,
    promise: new Promise((resolve, reject) => {
      child.on('error', reject);
      child.on('close', resolve);
    })
  }
}