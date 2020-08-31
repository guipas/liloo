liloo
=====



[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/liloo.svg)](https://npmjs.org/package/liloo)
[![Downloads/week](https://img.shields.io/npm/dw/liloo.svg)](https://npmjs.org/package/liloo)
[![License](https://img.shields.io/npm/l/liloo.svg)](https://github.com/guipas/liloo/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Job file](#job-file)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g liloo
$ liloo COMMAND
running command...
$ liloo (-v|--version|version)
liloo/0.0.2 linux-x64 node-v11.15.0
$ liloo --help [COMMAND]
USAGE
  $ liloo COMMAND
...
```
<!-- usagestop -->
# Job file
Here is an example of a job file to launch several process when developping an express app locally: 
```
{
  "defaultSpawnOptions" : { "cwd" : "/home/user/projects/api" },
  "commands": {
    "UI" : [ "npm", ["start"],  { "cwd" : "/home/user/projects/react-app" } ],
    "watch-ts" : [ "npm", ["run", "watch-ts"] ],
    "watch-express" : [ "npm", ["run", "watch-express"] ],
    "ssh-tunnel" : {
      "command" : [ 
        "ssh", 
        [ 
          "-R", "5432:localhost:5432", 
          "root@distant.db.server" 
        ] 
      ],
      "pre" : [
        ["echo", ["Connecting to distant server..."]]
      ]
    }
  }
}
```
