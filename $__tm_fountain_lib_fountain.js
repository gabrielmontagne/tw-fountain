"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fountain = void 0;
const lexer_1 = require("./lexer");
const utilities_1 = require("./utilities");
class Fountain {
  parse(script, getTokens) {
        // throw an error if given script source isn't a string
        if (typeof script === 'undefined' || script === null)
            throw new Error("Script is undefined or null.");
        if (typeof script !== 'string')
            throw new Error(`Script should be \`string\`, input was \`${Object.prototype.toString.call(script)}\`.`);
        try {
            let title = '';
            const [titlePageTokens, scriptTokens] = lexer_1.Lexer.tokenize(script);
            this.tokens = titlePageTokens.concat(scriptTokens);
            const titleToken = titlePageTokens.find(token => token.type === 'title');
            if (titleToken === null || titleToken === void 0 ? void 0 : titleToken.text) {
                // lexes any inlines on the title then removes any HTML / line breaks
                title = (0, utilities_1.unEscapeHTML)(lexer_1.InlineLexer.reconstruct(titleToken.text)
                    .replace('<br />', ' ')
                    .replace(/<(?:.|\n)*?>/g, ''));
            }
            return {
                title,
                html: {
                    title_page: titlePageTokens
                        .map(token => this.to_html(token)).join(''),
                    script: scriptTokens
                        .map(token => this.to_html(token)).join('')
                },
                tokens: getTokens ? this.tokens : []
            };
        }
        catch (error) {
            error.message +=
                '\nPlease submit an issue to https://github.com/jonnygreenwald/fountain-js/issues';
            throw error;
        }
    }
    to_html(token) {
        let lexedText = '';
        if (token === null || token === void 0 ? void 0 : token.text) {
            lexedText = lexer_1.InlineLexer
                .reconstruct(token.text, token.type === 'action');
        }
        switch (token.type) {
            case 'title': return `<h1>${lexedText}</h1>`;
            case 'author':
            case 'authors': return `<p class="authors">${lexedText}</p>`;
            case 'contact':
            case 'copyright':
            case 'credit':
            case 'date':
            case 'draft_date':
            case 'notes':
            case 'revision':
            case 'source': return `<p class="${token.type.replace(/_/g, '-')}">${lexedText}</p>`;
            case 'scene_heading': return `<h3${(token.scene_number ? ` id="${token.scene_number}">` : `>`) + lexedText}</h3>`;
            case 'transition': return `<h2>${lexedText}</h2>`;
            case 'dual_dialogue_begin': return `<div class="dual-dialogue">`;
            case 'dialogue_begin': return `<div class="dialogue${token.dual ? ' ' + token.dual : ''}">`;
            case 'character': return `<h4>${lexedText}</h4>`;
            case 'parenthetical': return `<p class="parenthetical">${lexedText}</p>`;
            case 'dialogue': return `<p>${lexedText}</p>`;
            case 'dialogue_end': return `</div>`;
            case 'dual_dialogue_end': return `</div>`;
            case 'section': return;
            case 'synopsis': return;
            case 'note': return `<!-- ${lexedText} -->`;
            case 'boneyard_begin': return `<!-- `;
            case 'boneyard_end': return ` -->`;
            case 'action': return `<p>${lexedText}</p>`;
            case 'centered': return `<p class="centered">${lexedText}</p>`;
            case 'lyrics': return `<p class="lyrics">${lexedText}</p>`;
            case 'page_break': return `<hr />`;
            case 'spaces': return;
        }
    }
}
exports.Fountain = Fountain;
//# sourceMappingURL=fountain.js.map
