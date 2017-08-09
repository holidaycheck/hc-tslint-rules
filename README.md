# Linting rules for the userflow

This repo contains some additional linting rules that turned out to be useful.
They have first been used in the userflow project, but might be useful elsewhere.

# Using the rules in your project

* Add a dependency to your ```package.json``` like
```"uf-tslint-rules": "git+https://<token>@github.hc.ag/userflow/uf-tslint-rules.git#<sha>"```
where ```<token>``` is some OAuth token for authorization (people tend to use the one from claptrap ;) ) and ```<sha>```
is the commit sha of the version that you want to include.
* Add the rules directory to you ```tslint.json``` like
```"rulesDirectory": ["./node_modules/uf-tslint-rules/dist/rules"]``` and activate the rules you need e.g. ```"no-index-in-import": true```.
(Per default, they are switched off....)

Note: The Typescript rules are compiled ```postinstall```, i.e. after you installed them in your project.

# TODOs

* Enable all rules in this project by default
* Properly publish the project's artifact to a lib folder
