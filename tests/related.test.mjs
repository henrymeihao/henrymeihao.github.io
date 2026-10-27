import test from 'node:test';
import assert from 'node:assert/strict';
import {relatedPosts} from '../scripts/related.mjs';

test('curated recommendations exclude unpublished, missing, self and duplicate targets', () => {
  const posts = [{slug:'a'}, {slug:'b'}, {slug:'c'}, {slug:'d'}, {slug:'e'}];
  const links = {a: ['a','draft','b','b','c','d','e'].map(slug => ({slug, note:'关联说明'}))};
  const result = relatedPosts(posts[0], posts, links);
  assert.deepEqual(result.map(p => p.slug), ['b','c','d']);
  assert.equal(result[0].note, '关联说明');
  assert.deepEqual(relatedPosts(posts[1], posts, links), []);
});
