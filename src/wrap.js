export default function wrap (node, callback = 'asyncError') {
    return {
        "body": [
            {
                "block": node,
                "finalizer": null,
                "handler": {
                    "body": {
                        "body": [
                            {
                                "expression": {
                                    "arguments": [
                                        {
                                            "type": "ThisExpression"
                                        },
                                        {
                                            "name": "error",
                                            "type": "Identifier"
                                        }
                                    ],
                                    "callee": {
                                        "computed": false,
                                        "object": {
                                            "name": callback,
                                            "type": "Identifier"
                                        },
                                        "property": {
                                            "name": "call",
                                            "type": "Identifier"
                                        },
                                        "type": "MemberExpression"
                                    },
                                    "type": "CallExpression"
                                },
                                "type": "ExpressionStatement"
                            }
                        ],
                        "type": "BlockStatement"
                    },
                    "param": {
                        "name": "error",
                        "type": "Identifier"
                    },
                    "type": "CatchClause"
                },
                "type": "TryStatement"
            }
        ],
        "type": "BlockStatement"
    }
}
