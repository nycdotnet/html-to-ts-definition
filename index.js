var htmlparser = require("htmlparser2");
var fs = require('fs');
var Promise = require('bluebird');
var readFile = Promise.promisify(fs.readFile);
var attributeMap = {
    "button": "HTMLButtonElement",
    "div": "HTMLDivElement",
    "input": "HTMLInputElement",
    "span": "HTMLSpanElement",
    "textarea": "HTMLTextAreaElement"
};
exports.format = {
    header: 'interface Document {',
    footer: '}',
    newLine: '\n',
    indent: '  '
};
function inventoryHtmlFile(htmlFileName, encoding) {
    if (encoding === void 0) { encoding = "utf8"; }
    return new Promise(function (resolve, reject) {
        var results = {};
        var parser = new htmlparser.Parser({
            onopentag: function (name, attribs) {
                var id = attribs["id"];
                if (id && (name in attributeMap)) {
                    if (!(id in results)) {
                        results[id] = [];
                    }
                    if (results[id].indexOf(attributeMap[name]) === -1) {
                        results[id].push(attributeMap[name]);
                    }
                }
            },
            onend: function () { return resolve(results); }
        });
        readFile(htmlFileName, encoding).then(function (result) {
            parser.write(result);
            parser.end();
        }).catch(function (ex) {
            return reject(ex);
        });
    });
}
exports.inventoryHtmlFile = inventoryHtmlFile;
function definitionContent(_a, mapping) {
    var header = _a.header, footer = _a.footer, newLine = _a.newLine, indent = _a.indent;
    var result = [];
    result.push(header);
    for (var key in mapping) {
        result.push(indent + "getElementById(elementId: \"" + key + "\") : " + mapping[key].join(' | ') + ";");
    }
    result.push(footer);
    return result.join(newLine);
}
inventoryHtmlFile("./artifacts/test.html").then(function (result) {
    console.log(definitionContent(exports.format, result));
});
