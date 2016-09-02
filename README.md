# gulp-publish-tasks
Common gulp tasks I use to automate publishing of npm packages.

## NOTICE

  **Stability: 2 - UNSTABLE**

## Tasks

### browserify

Build a browser-compatible file from an npm package. Uses [Browserify][2].

| argument | type | description |
| :-- | :-- | :-- |
| sourcePath | String | source js file path
| destinationPath | String | destination file path
| [options=`{}`] | Object | — |
| [options.minify=`false`] | Boolean | minify output with `minifyify` |

### updateMarkdownTOC

Insert a **Table of Contents** into a markdown file. Uses the excellent [markdown-toc][1] package.

| argument | type | description |
| :-- | :-- | :-- |
| markdownPath | String | Path to the markdown file (e.g. `'README.md'`). Path is relative to gulpfile's location. |

### updateSourceVersion

Updates the source version string in a javascript file. Replacement locations must be tagged with `publish-tasks:auto-version` comment.

| name | type | description |
| :-- | :-- | :-- |
| sourcePath | String | Path to the source file. Path is relative to gulpfile's location. |
| newVersion | String | New semver to be inserted (best to use package.json's version field). |

**Notice:** currently only supports numeric semvers (e.g. `2.3.11`).

## Usage

In your gulpfile, register the tasks, then use them as usual.

```js
//gulpfile.js
var publishTasks = require('gulp-publish-tasks');
var version = require('package.json').version;
...
gulp.task('update-readme-toc', () => publishTasks.updateMarkdownTOC('README.md'));
gulp.task('update-source-version', () => publishTasks.updateSourceVersion('path/to/source.js', version));
```

```js
//path/to/source.js
...
/* publish-tasks:auto-version */
MyLibrary.VERSION = '1.0.0'; // ------ will be replaced with version from package.json
```

## TODO

* unit tests
* more tasks

[1]: https://github.com/jonschlinkert/markdown-toc
[2]: http://browserify.org/
