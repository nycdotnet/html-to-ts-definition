import * as htmlparser from "htmlparser2";
import * as fs from 'fs';
import * as Promise from 'bluebird';

const readFile = Promise.promisify<string, string, string>(fs.readFile);

const attributeMap = {
  "button": "HTMLButtonElement",
  "div": "HTMLDivElement",
  "input": "HTMLInputElement",
  "span": "HTMLSpanElement",
  "textarea": "HTMLTextAreaElement"
}

export const format = {
  header : 'interface Document {',
  footer : '}',
  newLine : '\n',
  indent : '  '
};

interface ElementIdToTypeMap {
  [elementId: string]: string[]
}

export function inventoryHtmlFile(htmlFileName: string, encoding = "utf8"): Promise<ElementIdToTypeMap> {
  return new Promise<ElementIdToTypeMap>((resolve, reject) => {
    const results : ElementIdToTypeMap = {};
    const parser = new htmlparser.Parser({
        onopentag: (name, attribs) => {
          const id = attribs["id"];
          if (id && (name in attributeMap)) {
            if (!(id in results)) {
              results[id] = [];
            }
            if (results[id].indexOf(attributeMap[name]) === -1) {
               results[id].push(attributeMap[name]);
            }
          }
        },
        onend: () => resolve(results)
      });
    readFile(htmlFileName, encoding).then((result) => {
      parser.write(result);
      parser.end();
    }).catch((ex) => {
      return reject(ex);
    });
  });
}

function definitionContent({ header, footer, newLine, indent}: typeof format, mapping: ElementIdToTypeMap) {
  const result: string[] = [];
  result.push(header);
  for (let key in mapping) {
    result.push(`${indent}getElementById(elementId: "${key}") : ${mapping[key].join(' | ')};`);
  }
  result.push(footer);
  return result.join(newLine);
}

inventoryHtmlFile("./artifacts/test.html").then((result) => {
  console.log(definitionContent(format, result));
});
