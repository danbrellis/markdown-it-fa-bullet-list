(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.markdownitFaBulletList = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

// Markdown-it plugin to render Font Awesome Icons in a List; see
//
// https://fontawesome.com/how-to-use/on-the-web/styling/icons-in-a-list
//
// Modeled closely after markdown-it-task-lists https://www.npmjs.com/package/markdown-it-task-lists
var iconClass = "fas fa-check-square";

module.exports = function (md, options) {
  if (options) {
    if (options["class"]) iconClass = options["class"];
  }

  md.core.ruler.after('inline', 'fa-bullet-lists', function (state) {
    var tokens = state.tokens;

    for (var i = 2; i < tokens.length; i++) {
      if (shouldAddIcons(tokens, i)) {
        var token = tokens[i];
        token.children.unshift(makeFAIcon(token, state.Token));
        attrSet(tokens[parentToken(tokens, i - 2)], 'class', 'fa-ul');
      }
    }
  });
};

function attrSet(token, name, value) {
  var index = token.attrIndex(name);
  var attr = [name, value];

  if (index < 0) {
    token.attrPush(attr);
  } else {
    token.attrs[index] = attr;
  }
}

function parentToken(tokens, index) {
  var targetLevel = tokens[index].level - 1;

  for (var i = index - 1; i >= 0; i--) {
    if (tokens[i].level === targetLevel) {
      return i;
    }
  }

  return -1;
}

function shouldAddIcons(tokens, index) {
  return isInline(tokens[index]) && isParagraph(tokens[index - 1]) && isInBulletedList(tokens[parentToken(tokens, index - 2)]) && isListItem(tokens[index - 2]);
}

function makeFAIcon(token, TokenConstructor) {
  var icon = new TokenConstructor('html_inline', '', 0);
  icon.content = '<span class="fa-li"><i class="' + iconClass + '"></i></span>';
  return icon;
}

function isInline(token) {
  return token.type === 'inline';
}

function isParagraph(token) {
  return token.type === 'paragraph_open';
}

function isInBulletedList(token) {
  return token && token.type === 'bullet_list_open';
}

function isListItem(token) {
  return token.type === 'list_item_open';
}

},{}]},{},[1])(1)
});
