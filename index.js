// Markdown-it plugin to render Font Awesome Icons in a List; see
//
// https://fontawesome.com/how-to-use/on-the-web/styling/icons-in-a-list
//
// Modeled closely after markdown-it-task-lists https://www.npmjs.com/package/markdown-it-task-lists

let iconClass = "fas fa-check-square";

module.exports = function(md, options) {
    if (options) {
        if(options.class) iconClass = options.class;
    }

    md.core.ruler.after('inline', 'fa-bullet-lists', function(state) {
        const tokens = state.tokens;
        for (let i = 2; i < tokens.length; i++) {
            if (shouldAddIcons(tokens, i)) {
                let token = tokens[i];
                token.children.unshift(makeFAIcon(token, state.Token));
                attrSet(tokens[parentToken(tokens, i-2)], 'class', 'fa-ul');
            }
        }
    });
};

function attrSet(token, name, value) {
    const index = token.attrIndex(name);
    const attr = [name, value];

    if (index < 0) {
        token.attrPush(attr);
    } else {
        token.attrs[index] = attr;
    }
}

function parentToken(tokens, index) {
    const targetLevel = tokens[index].level - 1;
    for (let i = index - 1; i >= 0; i--) {
        if (tokens[i].level === targetLevel) {
            return i;
        }
    }
    return -1;
}

function shouldAddIcons(tokens, index) {
    return isInline(tokens[index]) &&
        isParagraph(tokens[index - 1]) &&
        isInBulletedList(tokens[parentToken(tokens, index - 2)]) &&
        isListItem(tokens[index - 2]);
}

function makeFAIcon(token, TokenConstructor) {
    let icon = new TokenConstructor('html_inline', '', 0);
    icon.content = '<span class="fa-li"><i class="'+iconClass+'"></i></span>';
    return icon;
}

function isInline(token) { return token.type === 'inline'; }
function isParagraph(token) { return token.type === 'paragraph_open'; }
function isInBulletedList(token) { return token && token.type === 'bullet_list_open';  }
function isListItem(token) { return token.type === 'list_item_open'; }