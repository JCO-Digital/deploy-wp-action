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
