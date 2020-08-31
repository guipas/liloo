liloo
=====



[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/liloo.svg)](https://npmjs.org/package/liloo)
[![Downloads/week](https://img.shields.io/npm/dw/liloo.svg)](https://npmjs.org/package/liloo)
[![License](https://img.shields.io/npm/l/liloo.svg)](https://github.com/guipas/liloo/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
* [Job file](#jobs)
# Usage
<!-- usage -->
```sh-session
$ npx job.json
```
# Jobs
Here is an example of a file that launches a few process to develop an express application locally:
```
{
  "defaultSpawnOptions" : { "cwd" : "/home/user/projects/api" },
  "commands": {
    "UI" : [ "npm", ["start"],  { "cwd" : "/home/user/projects/ui" } ],
    "watch-ts" : [ "npm", ["run", "watch-ts"] ],
    "watch-express" : [ "npm", ["run", "watch-express"] ],
    "ssh-tunnel" : {
      "command" : [ 
        "ssh", 
        [ 
          "-R", "5000:localhost:5000", 
          "root@remote.server" 
        ] 
      ],
      "pre" : [
        ["echo", ["Connecting to distant server..."]]
      ]
    }
  }
}
```
<!-- usagestop -->
# Commands
<!-- commands -->
<!-- commandsstop -->
