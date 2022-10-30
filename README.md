# action-authorised-actor

[![Test](https://github.com/natterstefan/action-authorised-actor/actions/workflows/test.yml/badge.svg)](https://github.com/natterstefan/action-authorised-actor/actions/workflows/test.yml) [![CodeQL](https://github.com/natterstefan/action-authorised-actor/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/natterstefan/action-authorised-actor/actions/workflows/codeql-analysis.yml)

> Execute a GitHub Action only if the (triggering) actor is authorised to do so.

## Use Case

Instead of adding `if` conditions here and there to determine if the actor is authorised, use this action to simplify the process.

## Usage

Add the action to your workflow, define `actor` (optional, `env.GITHUB_ACTOR` by default) and `authorisedActors` and decide if the workflow should fail silently (`failSilently`) or not.

### Before

```yml
- name: Release Tag
  if: ${{ github.actor == 'username' }}
  run: npx semantic-release
```

### After

```yml
- name: Can actor release?
  uses: natterstefan/action-authorised-actor@v1
  with:
    # JSON: string[]
    authorisedActors: |
      [
        "octocat",
        "natterstefan",
        "nektos/act"
      ]
    # or utilise GitHub Secrets, to obfuscate who's part of the list
    # authorisedActors: ${{secrets.authorisedActor}}

# if `failSilently` was set to `false`, this step will not start if the actor is
# not authorised (included in `authorisedActors`). Instead the workflow will
# exit with 1 (=failure).
- name: Release Tag
  run: npx semantic-release
```

Take a look at more examples in the
[`test.yml`](.github/workflows/test.yml#L24) Workflow file.

## Development

> First, you'll need to have a reasonably modern version of `node` handy. This
> won't work with versions older than 16, for instance.

Install the dependencies

```bash
npm install
```

Build the package for distribution

```bash
# package the source files
npm run package
# afterward create a release with the release GitHub action
```

Run the tests

```bash
npm run package # or npm run dev (watch mode)
npm test
```

Test the workflow locally with <https://github.com/nektos/act>!

```bash
# or npm run dev (watch mode)
npm run package

# in another terminal window run
act -j test_failSilenty_True
act -s authorisedActor="[nektos/act]" -j test_failSilenty_true_with_Secret

# Uncomment test case first, as this one will exit with 1 (=failure)
act -j testFailSilentyFalse
```

## Alternatives

- [natterstefan/action-eligible-actor](https://github.com/natterstefan/action-eligible-actor): configure which actor is eligible to run workflow with ease with a `eligible-actors-rules.json` configuration file
- [actions-cool/check-user-permission: 👮 A GitHub Action to check user permission of the current repository.](https://github.com/actions-cool/check-user-permission)
- [im-open/is-actor-authorized: Action that determines if the actor who initiated the workflow is authorized to do so.](https://github.com/im-open/is-actor-authorized)

## LICENSE

[MIT](LICENSE)

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://natterstefan.me/"><img src="https://avatars.githubusercontent.com/u/1043668?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Stefan Natter</b></sub></a><br /><a href="#ideas-natterstefan" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/natterstefan/action-authorised-actor/commits?author=natterstefan" title="Code">💻</a> <a href="https://github.com/natterstefan/action-authorised-actor/commits?author=natterstefan" title="Documentation">📖</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
