"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkipToNextToken = void 0;
/**
 * @description: This function will update the tokenizer instance
 *               such that the next token will be the ones
 *               provided in the  'tokens' array.
 * @params     : tk     , a tokenizer instance
 * @params     : tokens , a list of 'tokens' that is to be
 * @ret        : return a token
 * @note       : function may end up in an infinite loop
 *               if 'EOF' token is not in 'tokens'
 */
function SkipToNextToken(tk, tokens) {
    var TOKEN;
    while (!tokens.includes(TOKEN)) {
        TOKEN = tk.getToken();
    }
    return TOKEN;
}
exports.SkipToNextToken = SkipToNextToken;
//# sourceMappingURL=htmlPermissiveParserUtils.js.map