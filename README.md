# WP Deploy
This is a repository holding a reusable workflow that can be used in GitHub actions to deploy a site to any server that supports rsync.

## Example usage
This workflow can only be used in private repositories in the JCO-Digital organization.

This is an example YAML file for using this:
```yml
name: Deploy site

on:
  push:
    branch:
      - main

env:
  SERVER_URL: 'game@vanillacitadel.bojaco.com:/sites/game.jquest.fi/files'

jobs:
  deploy:
    uses: jco-digital/deploy-wp-action/.github/workflows/deploy-wp-workflow.yml@main
    with:
      server_url: game@vanillacitadel.bojaco.com
      base_path: /sites/game.jquest.fi/files
      is_jcore2: true
      theme_name: game-jquest
      deploy_plugins: true
    secrets: inherit


```
