import relationships from '../content/related.json' with { type: 'json' };

export function relatedPosts(post, posts, links = relationships) {
  const seen = new Set([post.slug]);
  return (links[post.slug] || []).flatMap(link => {
    const target = posts.find(candidate => candidate.slug === link.slug);
    if (!target || seen.has(link.slug)) return [];
    seen.add(link.slug);
    return [{...target, note: link.note}];
  }).slice(0, 3);
}
