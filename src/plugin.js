import 'source-map-support/register';
import wrap from './wrap.js';

export default function ({ Plugin, types: t }) {
    function alreadyWrapped (node) {
        let body = node.body.body;
        return body && body.length === 1 && t.isTryStatement(body[0]);
    }

    return new Plugin('async-try-catch', {
        visitor: {
            Function (node) {
                if (node.async && !alreadyWrapped(node)) {
                    node.body = wrap(node.body);
                }
            }
        }
    });
}
