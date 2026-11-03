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

## Python

The build workflow (`build-project.yml`) can set up a Python toolchain in addition to Node and PHP. It is off by
default, so existing builds are unaffected.

| Input                 | Default            | Description                                                             |
|-----------------------|--------------------|-------------------------------------------------------------------------|
| `use_python`          | `false`            | Set up Python for the build                                              |
| `python_version`      | `3.13`             | Python version passed to `actions/setup-python`                          |
| `python_requirements` | `requirements.txt` | Requirements file, installed with pip (and pip-cached) when it exists    |

If the requirements file is missing, Python is still installed but nothing is installed with pip, so projects that
manage their own dependencies inside `make ci` can leave the file out.

```yml
jobs:
  build:
    uses: jco-digital/deploy-wp-action/.github/workflows/build-project.yml@main
    with:
      use_python: true
      python_version: "3.12"
    secrets: inherit
```

`__pycache__` and `.venv` are excluded from the build artifact and from the default rsync excludes in
`server-deploy.yml`.

## Secrets

`secrets: inherit` gives the shared workflow every organization secret the calling repository can use. Passing only
the secrets a job needs limits what a change to this repository, or to an action it uses, could reach.

| Workflow            | Secret                   | Needed                                                   |
|---------------------|--------------------------|----------------------------------------------------------|
| `build-project.yml` | `COMPOSER_AUTH`          | Always                                                   |
|                     | `TOKEN_PRIVATE_KEY`      | Always, for the GitHub App token (with `vars.TOKEN_APP_ID`) |
|                     | `BUILD_NPM_TOKEN`        | With `use_npm_token: true`                               |
|                     | `FONT_AWESOME_PRO_TOKEN` | When the project installs Font Awesome Pro               |
|                     | `SLACK_BOT_TOKEN`        | With `slack_channel`                                     |
| `server-deploy.yml` | `SSH_GITHUB_KEY`         | Always                                                   |
|                     | `KNOCK_PORTS`            | When the server uses port knocking                       |
|                     | `SLACK_BOT_TOKEN`        | With `slack_channel`                                     |

```yml
jobs:
  build:
    uses: jco-digital/deploy-wp-action/.github/workflows/build-project.yml@v4
    secrets:
      COMPOSER_AUTH: ${{ secrets.COMPOSER_AUTH }}
      TOKEN_PRIVATE_KEY: ${{ secrets.TOKEN_PRIVATE_KEY }}
      SLACK_BOT_TOKEN: ${{ secrets.SLACK_BOT_TOKEN }}
```

## Environments

`server-deploy.yml` takes an optional `environment` input, the name of a GitHub environment for the deploy job. The
environment's deployment branch rules then apply, and its secrets replace secrets with the same name, so for example a
production-only `SSH_GITHUB_KEY` can be kept in a `production` environment limited to the main branch.

```yml
  deploy:
    needs: [build]
    uses: jco-digital/deploy-wp-action/.github/workflows/server-deploy.yml@v4
    with:
      environment: production
      server_url: site@example.com
      base_path: files
      paths: wp-content/themes/site/
```

## Pinning

The actions used in these workflows are pinned to commits, and Dependabot proposes updates. Callers can pin this
repository the same way, for example `build-project.yml@<commit> # v4.5.0`.
