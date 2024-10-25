# Develop your first CLI tool

This is a template project to develop a Node CLI tool.

## How to use

First, clone this repository to your computer. And run the commands below:

```bash
# install dependencies
yarn

# build dist files
yarn build

# or into watch mode
yarn watch

# execute this CLI command
npx helium --help
```

## Project structure

```
src
├── app.ts # main entry of this cli app
├── cliParser.ts # parse command and process arguments, run command handler
├── command # put your command here
│         ├── index.ts
│         └── start.cmd.ts # a example command named 'start'
├── legacy # some basic structure for cli, e.g. logger/loading-spinner/error-handler
│         ├── bootstrap.ts
│         ├── command
│         ├── constants.ts
│         ├── exception
│         ├── help.ts
│         ├── loader.ts
│         └── logger.ts
└── utils # some common util files
```

## Add new command

As the project structure showed above, cli commands are at `src/command` directory. You can add your own command refer to `start.cmd.ts`.

## Change entry command name

The default entry command name is `helium` now. Change it to any other name by:

* Change the file name of `/bin/helium` to `/bin/name-you-like`;
* Change the field `helium` of `package.json -> bin` (please also change the field key to the same name);
