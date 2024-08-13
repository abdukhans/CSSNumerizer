"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkipToNextToken = void 0;
function SkipToNextToken(tk, tokens) {
    var TOKEN;
    while (!tokens.includes(TOKEN)) {
        TOKEN = tk.getToken();
        // console.log("CUR_TOK: ", Token[TOKEN]);
    }
    return TOKEN;
}
exports.SkipToNextToken = SkipToNextToken;
//# sourceMappingURL=htmlPermissiveParserUtils.js.map