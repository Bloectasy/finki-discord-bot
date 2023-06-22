# FINKI Discord Bot

Discord bot for the [`FINKI Students`](https://discord.gg/finki-studenti-810997107376914444) Discord server, powered by [discord.js](https://github.com/discordjs/discord.js) 14. Requires Node.js ≥ 18 and PostgreSQL.

It's recommended, but not required to run this inside a Docker container.

## Installation

### Installation (Docker)

1. Clone the repository: `git clone git@github.com:Delemangi/finki-discord-bot.git`
2. Build the images: `docker compose build`

### Installation (Normal)

1. Clone the repository: `git clone git@github.com:Delemangi/finki-discord-bot.git`
2. Install the dependencies: `npm i`

## Running

### Running (Docker)

`docker compose up`

### Running (Normal)

`npm run start`

### Scripts

1. `npm run command:delete [...command IDs]` - delete the provided application commands, otherwise delete all if none are provided
2. `npm run command:register` - registers all commands as global application commands
3. `npm run embed:activities <channel ID> [newlines]` - send an activities embed to `channel ID`  with `newlines` number of newlines in the message content
4. `npm run embed:colors <channel ID> <image> [newlines]` - send a colors embed to `channel ID` with `image` as the embed description and `newlines` number of newlines in the message content
5. `npm run embed:courses <channel ID> <newlines> <...semesters>` - send courses embeds to `channel ID` for all semesters, as set in `roles.json` with `newlines` number of newlines in the message content
6. `npm run embed:notifications <channel ID> [newlines]` - send a notifications embed to `channel ID` with `newlines` number of newlines in the message content
7. `npm run embed:programs <channel ID> [newlines]` - send a programs embed to `channel ID` with `newlines` number of newlines in the message content
8. `npm run embed:rules <channel ID>` - sends the rules embed to `channel ID`
9. `npm run embed:years <channel ID> [newlines]` - send a years embed to `channel ID` with `newlines` number of newlines in the message content
10. `npm run embed:vip <channel ID>` - send a VIP embed to `channel ID`
11. `npm run forum:courses <channel ID>` - creates threads for all courses in `channel ID` forum
12. `npm run forum:companies <channel ID>` creates threads for all companies in `channel ID` forum
13. `npm run server:info [server ID]` - check the server stats for `server ID`

The arguments marked with `< >` are required, while the arguments marked with `[ ]` are optional.

## Configuration

### Basic configuration

1. Create a `.env` file in the root directory containing the environment variables for `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`
2. Create a `config` folder in the root directory containing:
    1. `anto.json` - an array of all Anto quotes
    2. `classrooms.json` - an array of all the classrooms
    3. `config.json` - the basic bot configuration
    4. `courses.json` - an array of the names of all courses
    5. `information.json` - an array of all the course information
    6. `links.json` - an array of links for the `link` command
    7. `participants.json` - an array of all courses and their number of participants
    8. `prerequisites.json` - an array of course prerequisites
    9. `professors.json` - an array of all courses and their professors and assistants
    10. `questions.json` - an array questions and answers for the `faq` command
    11. `quiz.json` - an array of the quiz questions
    12. `responses.json` - an array of command responses
    13. `roles.json` - roles for the scripts and for the embeds
    14. `rules.json` - an array of the server rules
    15. `sessions.json` - an object of all exam sessions
    16. `staff.json` - an array of the staff

### FAQ files

Create a `files` folder in the root directory. Any files that should be attached to the FAQ should be here.

### Sessions

Create a `sessions` folder in the root directory. All the session schedule files should go there. The files names should match the respective names in the `sessions.json` config file.

## Logging

The bot logs `info` and above messages in the console, and logs `debug` and above messages in `bot.log`, which gets wiped on every bot restart.
