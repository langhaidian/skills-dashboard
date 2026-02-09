require('../scripts/register-ts.cjs');

const test = require('node:test');
const assert = require('node:assert/strict');
const cheerio = require('cheerio');

const { __test } = require('../lib/skills.ts');

test('normalizeSkillUrl and isSkillUrl', () => {
  const normalized = __test.normalizeSkillUrl('/owner/repo/skill');
  assert.equal(normalized, 'https://skills.sh/owner/repo/skill');
  assert.equal(__test.normalizeSkillUrl('https://skills.sh/owner/repo/skill'), 'https://skills.sh/owner/repo/skill');
  assert.equal(__test.normalizeSkillUrl('https://example.com/owner/repo/skill'), null);

  assert.equal(__test.isSkillUrl('https://skills.sh/'), false);
  assert.equal(__test.isSkillUrl('https://skills.sh/docs'), false);
  assert.equal(__test.isSkillUrl('https://skills.sh/agents'), false);
  assert.equal(__test.isSkillUrl('https://skills.sh/owner/repo/skill'), true);
});

test('parseSkillParts', () => {
  assert.deepEqual(
    __test.parseSkillParts('https://skills.sh/owner/repo/skill'),
    { owner: 'owner', repo: 'repo', name: 'skill' }
  );
  assert.equal(__test.parseSkillParts('https://skills.sh/owner/repo'), null);
});

test('parseDownloads', () => {
  assert.equal(__test.parseDownloads('106.9K'), 106900);
  assert.equal(__test.parseDownloads('1,200'), 1200);
  assert.equal(__test.parseDownloads('1.2M'), 1200000);
  assert.equal(__test.parseDownloads('100K+'), 100000);
  assert.equal(__test.parseDownloads('?'), 0);
});

test('parseRankAndDownloads', () => {
  const $ = cheerio.load('<main><a><div>1</div><div>Name</div><div>106.9K</div></a></main>');
  const anchor = $('a').first();
  const parsed = __test.parseRankAndDownloads(anchor, 99);
  assert.equal(parsed.rank, 1);
  assert.equal(parsed.downloads, '106.9K');

  const $empty = cheerio.load('<main><a><div>Name</div></a></main>');
  const parsedEmpty = __test.parseRankAndDownloads($empty('a').first(), 5);
  assert.equal(parsedEmpty.rank, 5);
  assert.equal(parsedEmpty.downloads, '?');
});

test('selectSkillAnchors prefers main', () => {
  const $ = cheerio.load('<main><a id=\"main\">A</a></main><a id=\"outside\">B</a>');
  const anchors = __test.selectSkillAnchors($);
  assert.equal(anchors.length, 1);
  assert.equal(anchors.attr('id'), 'main');
});

