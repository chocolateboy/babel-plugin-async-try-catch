import 'source-map-support/register';
import _                     from 'lodash';
import assert                from 'power-assert';
import { BUILDER_KEYS }      from 'babel-core/lib/types/index.js';
import cloneWithWhitelist    from 'espurify/lib/clone-ast.js';
import Fs                    from 'fs';
import Path                  from 'path';
import root                  from 'rootrequire';
import { transformFileSync } from 'babel-core';

const PLUGIN_PATH = `${root}/target/src/plugin.js`;
const TEST_CASES  = `${root}/test/fixtures`;

let whitelist = _(BUILDER_KEYS)
    .map((value, key) => [ key, [ 'type' ].concat(_.keys(value)) ])
    .zipObject()
    .value();

let espurify = cloneWithWhitelist(whitelist);

function dump (filename, { code, ast }) {
    console.log(filename);
    console.log(code);
    // console.log(JSON.stringify(espurify(ast.program), null, 4));
}

function ast (filename, $plugins) {
    let plugins = $plugins ? [ $plugins ] : [];

    let output = transformFileSync(filename, {
        whitelist: [ 'es7.asyncFunctions' ],
        plugins
    });

    // dump(filename, output);

    return espurify(output.ast.program);
}

describe('plugin', () => {
    for (let testCase of Fs.readdirSync(TEST_CASES)) {
        let actual = Path.join(TEST_CASES, testCase, 'actual.js');
        let expected = Path.join(TEST_CASES, testCase, 'expected.js');
        let name = testCase.replace(/\W+/g, ' ');

        it(name, () => {
            let got = ast(actual, PLUGIN_PATH);
            let want = ast(expected);

            assert.deepEqual(got, want);
        });
    }
});
