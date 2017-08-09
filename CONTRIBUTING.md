# Important scripts
* `yarn compile` compiles the rules into the `dist` folder.
* `yarn test` runs the tests. These tests are using the test runner that comes with tslint (cf. https://palantir.github.io/tslint/develop/testing-rules/)

_Important note_: Currently, running the tests does not compile the rules. You need to execute both targets consecutively yourself.

# Manual testing
If you want to try out some rules manually, e.g. on source files of other projects, use the following command:

`./node_modules/tslint/bin/tslint --rules-dir ./dist/rules -c ./test/rules/no-index-in-import/tslint.json /target-dir/*`

This will use all rules in `./dist/rules` - the compilation output folder - and run them against all files in `/target-dir`.
If there are not only typescript files in the target folder, you need to write `/target-dir/*.ts`.
`./test/rules/no-index-in-import/tslint.json` specifies the linting configuration. Make sure that the rules in `./dist/rules`
that you wanted to test are _enabled_ in your configuration.
