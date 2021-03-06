import {Command, flags} from '@oclif/command'
import * as path from 'path';
import * as fs from 'fs';
import * as chalk from 'chalk';
import { ForegroundColor, Chalk } from 'chalk';
import { SpawnOptions } from 'child_process';

import runCommand from './lib/runCommand';
import colors from './lib/colors';
import cleanString from './lib/cleanString';
import { SpawnArgs } from './models/SpawnArgs'; 


type JobDefinition = { command: SpawnArgs; pre?: SpawnArgs[] };

interface IJobFile {
  defaultSpawnOptions?: SpawnOptions;
  commands: Record<string, (SpawnArgs | JobDefinition)>;
  exitStrategy?: 'race' | 'all';
}


class Liloo extends Command {
  static description = 'Run multiple process in parallel'

  static flags = {
    // add --version flag to show CLI version
    version: flags.version({char: 'v'}),
    help: flags.help({char: 'h'}),
    // job: flags.string({ char: 'j', description: 'path to the json file representing the job to run, default to ./liloo.json'}),
  }

  static args = [{name: 'job'}]

  async run() {
    const {args, flags} = this.parse(Liloo)

    // this.log(`run`, args.job);

    if (args.job) {
      this.runJob(args.job || './liloo.json');
    }
  }

  runJob = async (job: string) => {
    if (job) {
      const jobFile = path.resolve(job);
  
      if (fs.existsSync(jobFile)) {
        console.log('exists')
        const jobConfig: IJobFile = JSON.parse(fs.readFileSync(jobFile).toString());
  
        // console.log('jobs: ', jobConfig);
        const defers: Promise<unknown>[] = [];
        const children = [];
        let j = 0;
  
        for (const job in jobConfig.commands) {
          const maybeCommand: SpawnArgs | JobDefinition = jobConfig.commands[job];
          const mainCommand: SpawnArgs = Array.isArray(maybeCommand) ? maybeCommand : maybeCommand.command;
          const preCommands: SpawnArgs[] = !Array.isArray(maybeCommand) && Array.isArray(maybeCommand.pre) ? maybeCommand.pre : [];
          const color = colors[j % colors.length];
          const log = (...args: string[]) => console.log(chalk[color](...args));
          const error = (...args: string[]) => console.log(chalk.red(...args));
  
          log(`[${job}]`, preCommands.length > 0 ? `${preCommands.length} pre jobs` : `No pre job`);
  
          let i = 1;
          for (const pre of preCommands) {
            log(`[${job}] [pre] ---`);
            log(`[${job}] [pre] running pre job ${i++}`);
            const { child, promise } = runCommand({
              command: pre,
              logger: {
                log: (...args: string[]) => log(`[${job}] [pre] `, ...args.map(a => cleanString(a))),
                error: (...args: string[]) => error(`[${job}] [pre]`, ...args.map(a => cleanString(a))),
              },
              defaultSpawnOptions: jobConfig.defaultSpawnOptions || {},
            })
            children.push(child);
            await promise.catch((e: any) => {
              console.error(e);
            })
          } 
  
          const mainCommandResult = runCommand({
            command: mainCommand,
            logger: {
              log: (...args: string[]) => log(`[${job}] `, ...args.map(a => cleanString(a))),
              error: (...args: string[]) => error(`[${job}] `, ...args.map(a => cleanString(a))),
            },
            defaultSpawnOptions: jobConfig.defaultSpawnOptions || {},
          });
          children.push(mainCommandResult.child);
          defers.push(
            mainCommandResult.promise
            .catch((e: any) => {
              console.error(e);
            })
            .finally(() => {
              log(`[${job}] exited `);
            })
          );
  
          j++;
        }
  
        if (jobConfig.exitStrategy === 'race') {
          await Promise.race(defers);
        } else {
          await Promise.all(defers);
        }
      }
      
    }
    
  }
}

export = Liloo
