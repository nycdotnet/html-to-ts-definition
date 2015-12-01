# html-to-ts-definition
Scans HTML files and makes TypeScript definition files

Still just a spike.  Change the call to inventoryHtmlFile() at the bottom of the script to try your file.

Obvious enhancements:
  * Support for multiple HTML files.
  * Support all TypeScript HTML element types.
  * Grunt/Gulp Plugin, etc.
  * Add support to grunt-ts.
  * Publish to npm.

Pull requests accepted.  MIT licensed.

Given this HTML file:
```html
<html>
<head>
</head>
<body>
  <div id="myDiv"></div>
  <span id="mySpan1"></span>
  <span id="mySpan2"></span>
  <textarea id="txt"></textarea>
  <input id="txt" value="I know it is invalid to have multiple elements with the same ID.  This is to simulate future support for multiple files." />
</body>
</html>
```

Will return this TypeScript definition file:
```typescript
interface Document {
  getElementById(elementId: "myDiv") : HTMLDivElement;
  getElementById(elementId: "mySpan1") : HTMLSpanElement;
  getElementById(elementId: "mySpan2") : HTMLSpanElement;
  getElementById(elementId: "txt") : HTMLTextAreaElement | HTMLInputElement;
}
```
