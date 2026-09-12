type Link = {
	label: string
	href: string
}

type Me = {
	name: string
	host: string
	role: string
	tagline: {
		prefix: string
		words: string[]
	}
	projects: Array<Link | { title: string; links: Array<Link> }>
	links: Link[]
}

/**
 * Single source of truth for the home page content.
 * Edit this file to update what the site says — nothing else hardcodes copy.
 */
export const me: Me = {
	name: 'Zubair Aziz',
	host: 'zubairaziz.dev',
	role: 'software engineer',
	tagline: {
		prefix: 'I build',
		words: ['websites', 'mobile apps', 'custom software', 'developer tools'],
	},
	projects: [
		{ label: 'quiltt', href: 'https://www.quiltt.io/' },
		{ label: 'tabtally', href: 'https://www.tabtally.io/' },
		{
			label: 'resume-builder',
			href: 'https://www.zubairaziz.dev/tools/resume-builder',
		},
	],
	links: [
		{ label: 'github', href: 'https://github.com/zubairaziz' },
		{ label: 'x', href: 'https://x.com/zubairaziz_13' },
		{ label: 'linkedin', href: 'https://www.linkedin.com/in/zubairaziz13' },
		{ label: 'email', href: 'mailto:zubairaziz.dev@gmail.com' },
		{ label: 'whatsapp', href: 'https://wa.me/+601140015269' },
	],
}
