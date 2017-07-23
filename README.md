# Linting rules for the userflow

This repo contains some additional linting rules that turned out to be useful.
They have first been used in the userflow project, but might be useful elsewhere.

# Using the rules in your project

Compile these rules (cf. [contribution guidelines](./CONTRIBUTING.md)), then copy the compilation output folder into some folder in your project, say folder
`own-rules`. Then, add this folder to the `rulesDirectory` array in your `tslint.json`. In addition, you need to enable the rules that you want to use.

# TODOs

* Enable all rules in this project by default
