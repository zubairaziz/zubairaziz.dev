/// <reference types="vite/client" />

import {
	createRootRoute,
	HeadContent,
	Link,
	Outlet,
	Scripts,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import type * as React from 'react'
import { DefaultCatchBoundary } from '~/components/DefaultCatchBoundary'
import { NotFound } from '~/components/NotFound'
import { WebMcp } from '~/components/WebMcp'
import { me } from '~/lib/me'
import { seo } from '~/lib/seo'
import appCss from '~/styles/app.css?url'

/**
 * JSON-LD `Person` structured data. `sameAs` is derived from `me.links` so it
 * never drifts out of sync with the visible footer links.
 */
const SOCIAL_LABELS = new Set(['github', 'x', 'linkedin'])

const personJsonLd = {
	'@context': 'https://schema.org',
	'@type': 'Person',
	name: me.name,
	url: `https://${me.host}/`,
	jobTitle: me.role,
	sameAs: me.links
		.filter((link) => SOCIAL_LABELS.has(link.label))
		.map((link) => link.href),
}

/**
 * The root route owns the full HTML document:
 *
 *  - `head()` → <title>/<meta>/<link> managed by the router (SEO)
 *  - `shellComponent` → the <html>/<head>/<body> shell. It is ALWAYS
 *    server-rendered, even when child routes disable their own SSR, which is
 *    what makes full-document SSR work.
 *  - `component` → the app layout that renders matched routes via <Outlet/>.
 */
export const Route = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: 'utf-8' },
			{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
			{ name: 'theme-color', content: '#090b0c' },
			...seo({
				title: 'Zubair Aziz — zubairaziz.dev',
				description: `The personal site of ${me.name}, ${me.role}.`,
				image: 'https://zubairaziz.dev/opengraph-image.png',
				url: 'https://zubairaziz.dev/',
			}),
			{ 'script:ld+json': personJsonLd },
		],
		links: [
			{ rel: 'stylesheet', href: appCss },
			{ rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
			{ rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
			{ rel: 'manifest', href: '/site.webmanifest' },
			{ rel: 'api-catalog', href: '/.well-known/api-catalog' },
			{ rel: 'ai-catalog', href: '/.well-known/ai-catalog.json' },
		],
	}),
	shellComponent: RootDocument,
	component: RootComponent,
	errorComponent: DefaultCatchBoundary,
	notFoundComponent: () => <NotFound />,
})

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className="dark">
			<head>
				<HeadContent />
			</head>
			<body>
				{children}
				<Scripts />
				{import.meta.env.DEV ? (
					<TanStackRouterDevtools position="bottom-right" />
				) : null}
			</body>
		</html>
	)
}

function RootComponent() {
	return (
		<div className="min-h-screen">
			<header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
				<nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 font-mono text-sm">
					<Link to="/" className="flex items-center text-foreground">
						<span className="text-primary">admin@zubairaziz</span>
						<span className="text-muted-foreground">.dev:~$</span>
						<span
							className="cursor-blink inline-block h-4 w-2 bg-primary"
							aria-hidden="true"
						/>
					</Link>
					<span className="flex items-center gap-2 text-xs text-muted-foreground">
						<span className="size-1.5 animate-pulse rounded-full bg-primary" />
						available
					</span>
				</nav>
			</header>

			<main className="mx-auto max-w-5xl px-4 py-12">
				<Outlet />
			</main>

			<WebMcp />
		</div>
	)
}
