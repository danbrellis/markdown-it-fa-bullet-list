/* globals before, describe, it */

const fs = require('fs');
const assert = require('assert');
const md = require('markdown-it');
const cheerio = require('cheerio');
const faBulletedLists = require('..');

describe('markdown-it-task-lists', function() {
    let fixtures = {}, rendered = {}, $ = {}, parser;

    before(function() {
        const files = {
            bullet: 'bullet.md',
            ordered: 'ordered.md',
            mixedNested: 'mixed-nested.md'
        };

        parser = md().use(faBulletedLists);

        for (let key in files) {
            fixtures[key] = fs.readFileSync(__dirname + '/fixtures/' + files[key]).toString();
            rendered[key] = parser.render(fixtures[key]);
            $[key] = cheerio.load(rendered[key]);
        }
    });

    it('renders tab-indented code differently than default markdown-it', function() {
        const parserDefault = md();
        assert.notEqual(rendered.bullet, parserDefault.render(fixtures.bullet));
    });

    it('adds span.fa-li > i.fas.fa-check-square in items', function () {
        //<span class="fa-li"><i class="fas fa-check-square"></i></span>
        assert.equal($.bullet('span.fa-li > i.fas.fa-check-square').length, 4);
    });

    it('keeps list item text unchanged', function() {
        const parserDefault = md();
        const $$ = cheerio.load(parserDefault.render(fixtures.bullet));
        const plainListItems = $$('ul').find('li');
        $.bullet('ul').find('li').each((i, e) => {
            assert.equal($.bullet(e).text(), $$(plainListItems[i]).text());
        });
    });

    it('adds class .fa-ul to ul tag', function () {
        assert.equal($.bullet('ul.fa-ul').attr('class'), "fa-ul");
    });

    it('skips ordered list items', function () {
        assert.equal($.ordered('ul.fa-ul').length, 0);
        assert.equal($.ordered('span.fa-li > i.fas.fa-check-square').length, 0);
    });

    it('adds specified class from options', function () {
        let iconClass = "fas fa-heart";
        const heartsParser = md().use(faBulletedLists, {class: iconClass});
        const $$ = cheerio.load(heartsParser.render(fixtures.bullet));
        assert.equal($$('span.fa-li > i.fas.fa-heart').length, 4);
    });

    it('implements for <ul> nested in <ol>', function(){
        const subList = $.mixedNested('ol ul.fa-ul');
        assert(subList.length);
        assert.equal($.bullet('span.fa-li > i.fas.fa-check-square', subList).length, 4);
    });

    it('implements for nested <ul> and parent <ul>', function(){
        const subList = $.mixedNested('ul.fa-ul ul.fa-ul');
        assert(subList.length);
        const parentList = subList.parent().parent().html();
        assert.equal($.bullet('span.fa-li > i.fas.fa-check-square', parentList).length, 5);
    });

    it('only adds .fa-ul to most immediate parent list', function () {
        assert($.mixedNested('ol:not(.fa-ul) ul.fa-ul').length);
    });
});