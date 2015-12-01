# html-to-ts-definition
Scans HTML files and makes TypeScript definition files

Still just a spike.  Change the call to inventoryHtmlFile() at the bottom of the script to try your file.

Given this HTML file:
```html
<html>
<head>
</head>
<body>
  <div id="myDiv"></div>
  <span id="mySpan1"></span>
  <span id="mySpan2"></span>
  <textarea id="txt"></span>
</body>
</html>
```

Will return this TypeScript definition file:
```typescript
interface Document {
  getElementById(elementId: "myDiv") : HTMLDivElement;
  getElementById(elementId: "mySpan1") : HTMLSpanElement;
  getElementById(elementId: "mySpan2") : HTMLSpanElement;
  getElementById(elementId: "txt") : HTMLTextAreaElement;
}
```
