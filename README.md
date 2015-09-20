# babel-plugin-async-try-catch

[![npm status](http://img.shields.io/npm/v/babel-plugin-async-try-catch.svg)](https://www.npmjs.org/package/babel-plugin-async-try-catch)
[![build status](https://secure.travis-ci.org/chocolateboy/babel-plugin-async-try-catch.svg)](http://travis-ci.org/chocolateboy/babel-plugin-async-try-catch)

A Babel plugin which wraps the body of async functions in a try/catch block

- [babel-plugin-async-try-catch](#babel-plugin-async-try-catch)
- [INSTALL](#install)
- [SYNOPSIS](#synopsis)
- [DESCRIPTION](#description)
  - [Why?](#why)
  - [Custom Error Handling](#custom-error-handling)
- [SEE ALSO](#see-also)
- [VERSION](#version)
- [AUTHOR](#author)
- [COPYRIGHT AND LICENSE](#copyright-and-license)

## INSTALL

    npm install babel-plugin-async-try-catch

## SYNOPSIS

`$ cat before.js`

```javascript
function asyncError (error) {
    console.error('error:', error);
}

async function printFile (filename) {
    let contents = await fs.readFileAsync(filename, 'utf8');
    console.log(contents);
}
```

`$ babel --plugins async-try-catch --whitelist es7.asyncFunctions before.js`

```javascript
function asyncError (error) {
    console.error('error:', error);
}

async function printFile (filename) {
    try {
        let contents = await fs.readFileAsync(filename, 'utf8');
        console.log(contents);
    } catch (error) {
        asyncError.call(this, error);
    }
}
```

## DESCRIPTION

This is a [Babel](https://www.npmjs.com/package/babel) [plugin](https://babeljs.io/docs/advanced/plugins/)
which wraps the body of async functions in a try/catch block.

If an exception is thrown it is passed to a callback whose `this` value is set
to the `this` value inside the catch block. The callback name is currently hardwired as
`asyncBlock`, but this will be configurable when Babel adds support for
[plugin options](https://github.com/babel/babel/issues/1833).

If an async function's sole top-level statement is a try/catch, try/finally or try/catch/finally
statement, it is not wrapped.

### Why?

The ES7 [async/await proposal](https://tc39.github.io/ecmascript-asyncawait/)
makes asynchronous programming [heavenly](https://jakearchibald.com/2014/es7-async-functions/),
but async functions have one major gotcha: they silently swallow synchronous exceptions
raised within the body of the function. As a result, it is recommended to wrap the body
of async functions inside a try/catch block:

> Another, more insidious problem is that you have to be careful to wrap your code in try/catches,
> or else a promise might be rejected, in which case the error is silently swallowed. (!)
>
> My advice is to ensure that your async functions are entirely surrounded by try/catches, at least
> at the top level
>
> Nolan Lawson — [Taming the asynchronous beast with ES7](http://pouchdb.com/2015/03/05/taming-the-async-beast-with-es7.html)

This plugin automatically surrounds the body of async functions with a try/catch block,
so you can take advantage of the sanity and simplicity of async/await without the boilerplate.

### Custom Error Handling

If you find yourself still manually writing try/catch blocks in order to perform custom error handling, remember
that the callback can be defined/overridden locally e.g. rather than writing:

```javascript
async function printFile (filename) {
    try {
        let contents = await fs.readFileAsync(filename, 'utf8');
        console.log(contents);
    } catch (error) {
        console.error(`error reading ${filename}:`, error.stack);
    }
}
```

\- you could write:

```javascript
async function printFile (filename) {
    var asyncError = error => console.error(`error reading ${filename}:`, error.stack);
    let contents = await fs.readFileAsync(filename, 'utf8');
    console.log(contents);
}
```

Note the use of `var` (rather than `let`) to
[hoist](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/var#var_hoisting)
the declaration out of the `try` block so that it remains visible in the `catch` block.

It's also worth remembering that information about the [call site](https://github.com/stacktracejs/stackframe)
at which an error occurred can easily be determined from an exception's
[stack trace](https://github.com/stacktracejs/stacktrace.js#stacktracefromerrorerror-optional-options--promisearraystackframe).

## SEE ALSO

* [async/await](https://tc39.github.io/ecmascript-asyncawait/)
* [babel](https://www.npmjs.com/package/babel)
* [babel-plugins](https://babeljs.io/docs/advanced/plugins/)

## VERSION

0.0.1

## AUTHOR

[chocolateboy](mailto:chocolate@cpan.org)

## COPYRIGHT AND LICENSE

Copyright © 2015 by chocolateboy

This module is free software; you can redistribute it and/or modify it under the
terms of the [Artistic License 2.0](http://www.opensource.org/licenses/artistic-license-2.0.php).
