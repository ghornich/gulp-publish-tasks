'use strict';

var fs = require('fs');
var browserify = require('browserify');
var markdownTOC = require('markdown-toc');

var UPDATE_SOURCE_TAG = 'publish-tasks:auto-version';
var UPDATE_SOURCE_TAG_REGEX = new RegExp(`(${UPDATE_SOURCE_TAG}[\\s\\S]+?['"\`])(\\d+\\.){2}\\d+`, 'g');

/**
 * Create a browser-compatible build of an npm package (using Browserify)
 *
 * @param  {String} sourcePath
 * @param  {String} destinationPath
 * @param  {Object} [options={}]
 * @param  {Boolean} [options.minify=false] - minify build
 */
exports.browserify = function (sourcePath, destinationPath, options) {
    options = options || {};
    options.minify = options.minify || false;

    var stream = browserify(sourcePath);

    if (options.minify) {
        stream = stream.plugin('minifyify', { map: false }); //TODO options.map?
    }

    return stream.bundle()
    .on('error', handleStreamError)
    .pipe(fs.createWriteStream(destinationPath))
};

/**
 * Updates the table of contents in a markdown file (using markdown-toc)
 *
 * @param  {String} markdownPath
 */
exports.updateMarkdownTOC = function (markdownPath) {
    var content = fs.readFileSync(markdownPath, { encoding: 'utf-8' });

    content = markdownTOC.insert(content);

    fs.writeFileSync(markdownPath, content, { encoding: 'utf-8' });
};

/**
 * Updates every `publish-tasks:auto-version` tagged line's version
 * Currently only finds numeric semvers (e.g. '2.33.1')
 *
 * @param  {String} sourcePath - path of the source file
 * @param  {String} newVersion - new semver
 */
exports.updateSourceVersion = function (sourcePath, newVersion) {
    var source = fs.readFileSync(sourcePath, { encoding: 'utf-8' });

    if (!UPDATE_SOURCE_TAG_REGEX.test(source)) {
        console.error(`ERROR: version tag not found in file '${sourcePath}'`);
        return;
    }

    var newSource = source.replace(UPDATE_SOURCE_TAG_REGEX, '$1' + newVersion);

    if (source === newSource) {
        //throw new Error('source version change failed: version didn\'t change');
        console.error('WARNING: source version didn\'t change, current: ' + newVersion);
        return;
    }

    fs.writeFileSync(sourcePath, newSource, { encoding: 'utf-8' });
};

exports.handleStreamError = handleStreamError;

function handleStreamError(error) {
    console.error(error.stack);
    this.emit('end');
}
