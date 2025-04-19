const parser = require('$:/tm/fountain/lib/fountain.js')
const jsonml = require('$:/tm/fountain/lib/jsonml-dom.js')

const fountain = new parser.Fountain()

class FountainParser {
  constructor(_type, text, _options) {

    const { html } = fountain.parse(text)
    const { title_page: titlePage, script } = html
    const titleTokens = jsonml.fromHTMLText(titlePage)
    const scriptTokens = jsonml.fromHTMLText(script)

    const titleNodes = transformNodes(titleTokens)
    const scriptNodes = transformNodes(scriptTokens)

    this.tree = [
      {
        type: "element", tag: "article",
        attributes: {
          class: {
            type: "string",
            value: "fountain-screenplay"
          },
        },
        children: [
          ...(
            titleNodes.length ?
              [
                {
                  type: "element", tag: "header",
                  attributes: {
                    class: {
                      type: "string",
                      value: "screenplay-title-page"
                    }
                  },
                  children: titleNodes
                }
              ]
              : []
          ),
          ...scriptNodes
        ]
      }
    ]
  }
}

exports['text/fountain'] = FountainParser

// Borrwed from 
// $:/plugins/bimlas/asciidoctor/wrapper.js
function transformNodes(nodes) {
  var results = [];
  for (var index = 0; index < nodes.length; index++) {
    results.push(transformNode(nodes[index]));
  }
  return results;
}

function transformNode(node) {
  if ($tw.utils.isArray(node)) {
    var p = 0,
      widget = { type: "element", tag: node[p++] };
    if (!$tw.utils.isArray(node[p]) && typeof (node[p]) === "object") {
      widget.attributes = {};
      $tw.utils.each(node[p++], function (value, name) {
        widget.attributes[name] = { type: "string", value: value };
      });
    }
    widget.children = transformNodes(node.slice(p++));
    return widget;
  } else {
    return { type: "text", text: node };
  }
}