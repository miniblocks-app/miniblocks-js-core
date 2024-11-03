# miniblocks-js-core

A temporary server for the miniblocks project, until migrating to GoLang.

## To run the serer:

Set up the environment variables in the .env file.

Then:

> pnpm i
 
> pnpm run dev

### To set up docker image releases automatically with GitHub actions:

>username: ${{ secrets.DOCKERHUB_USERNAME }}

>password: ${{ secrets.DOCKERHUB_TOKEN }}

Create the fallowing secrets in GitHub!