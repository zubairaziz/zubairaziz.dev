/**
 * Small helper for building typed `<meta>` tags for `head()` on routes.
 */
export function seo({
	title,
	description,
	keywords,
	image,
	url,
}: {
	title?: string
	description?: string
	keywords?: Array<string>
	image?: string
	url?: string
}) {
	const tags = [
		{ title },
		{ name: 'description', content: description },
		{ name: 'keywords', content: keywords?.join(', ') },
		{ name: 'twitter:title', content: title },
		{ name: 'twitter:description', content: description },
		{
			name: 'twitter:card',
			content: image ? 'summary_large_image' : 'summary',
		},
		...(image ? [{ name: 'twitter:image', content: image }] : []),
		{ property: 'og:title', content: title },
		{ property: 'og:description', content: description },
		{ property: 'og:type', content: 'website' },
		...(url ? [{ property: 'og:url', content: url }] : []),
		...(image
			? [
					{ property: 'og:image', content: image },
					{ property: 'og:image:width', content: '1200' },
					{ property: 'og:image:height', content: '630' },
					{ property: 'og:image:alt', content: title },
				]
			: []),
	]

	return tags.filter(
		(tag) =>
			(tag.title != null && tag.title !== '') ||
			(tag.content != null && tag.content !== ''),
	)
}
