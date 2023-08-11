## FILE generation app

The app watch `command.txt` file to get the commands and perform file operation accordingly.

Start the app:
`npm run start`

Commands can be executed by updating command.txt file with below syntax one at a time

#### ADD FILES

`ADD_FILE:pathname`

eg. `ADD_FILE:./hello.txt`

#### REMOVE FILES

`REMOVE_FILE:pathname`

eg. `REMOVE_FILE:./hello.txt`

#### RENAME FILES

`RENAME_FILE:oldPath newPath`

eg. `RENAME_FILE:./hello.txt ./new.txt`

#### APPEND FILES

`APPEND_FILE:pathname @ content`

eg. `APPEND_FILE:./hello.txt @ This new content will be appended`

#### EXIT APP

`EXIT:`

eg. `EXIT:`
