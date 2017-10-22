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

# The rules

The rules contained in this repository can be seen by the following example `tslint.json`:

```
{
  "rules": {
    "no-forbidden-dependencies": {
      "options": [
        {
          "path": "no-forbidden-dependencies",
          "forbiddenImport": "dont-access"
        }
      ]
    },
    "no-index-in-import": true
  }
}
```

* **no-forbidden-dependencies**: This rules can be used to forbid certain dependencies in your project. If you have a folder
`my-folder` that is not allowed to use any classes from some folder named, say, `secret-folder`, you can use this rule
and the following configuration:

```
{
  "rules": {
    "no-forbidden-dependencies": {
      "options": [
        {
          "path": "my-folder",
          "forbiddenImport": "secret-folder"
        }
      ]
    }
  }
}
```

This prevents any file whose path *matches* `my-folder` from importing any file whose path *matches* `secret-folder`.
I.e. both file `src/my-folder/file.ts` and file `src/abc/my-folder.ts` are prevent from importing `secret-folder`. The
same matching logic applies to the import statements, i.e. it does not matter where the string `secret-folder` is
located in the import statement - any such import statement will be forbidden.

You can also use regular expressions for `path` and `forbidden-import`. Note, however, that you need to escape certain
characters, like backslashes. This means you cannot use `\w+`. Instead, you need to write `\\w+`.

* **no-index-in-import**: This rule checks that import statements don't import from `index` files explicitly, i.e. like
```
import MyClass from './folder/index
```
Instead, the import statement should look like
```
import MyClass from './folder'
```