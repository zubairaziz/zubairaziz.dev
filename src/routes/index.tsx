import { createFileRoute } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { TypedText } from '~/components/TypedText'
import { me } from '~/lib/me'
import { seo } from '~/lib/seo'

/**
 * `/` — a terminal-shaped one-pager. Every section is a shell command and its
 * output. Copy lives in `src/lib/me.ts`.
 */
export const Route = createFileRoute('/')({
	component: Home,
	head: () => ({
		meta: [
			...seo({
				title: `${me.name} — ${me.host}`,
				description: `${me.name} — ${me.role} building ${me.tagline.words
					.slice(0, -1)
					.join(', ')}, and ${me.tagline.words[me.tagline.words.length - 1]}.`,
				image: `https://${me.host}/opengraph-image.png`,
				url: `https://${me.host}/`,
			}),
		],
		links: [{ rel: 'canonical', href: `https://${me.host}/` }],
	}),
})

function Home() {
	return (
		<div className="mx-auto flex w-full max-w-5xl flex-col gap-12 font-mono">
			{/* $ whoami */}
			<section className="flex flex-col gap-5">
				<Prompt>whoami</Prompt>
				<div className="flex flex-col gap-4 border-l border-border pl-4 sm:pl-6">
					<h1 className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
						{me.name.toUpperCase()}
					</h1>
					<p className="max-w-xl text-lg leading-relaxed text-foreground sm:text-xl">
						<span className="text-muted-foreground">{'// '}</span>
						{me.tagline.prefix}{' '}
						<span aria-hidden="true">
							<TypedText words={me.tagline.words} className="text-primary" />
						</span>
						<span className="sr-only">{me.tagline.words.join(', ')}</span>
					</p>
				</div>
			</section>

			{/* $ tree ~/projects */}
			<section className="flex flex-col gap-3">
				<Prompt>tree ~/projects</Prompt>
				<ul className="list-none border-l border-border pl-4 text-sm text-foreground sm:pl-6">
					<li className="text-muted-foreground leading-tight">.</li>
					{me.projects.map((project, index) => {
						const isLast = index === me.projects.length - 1
						return (
							<li
								className="leading-tight"
								key={'title' in project ? project.title : project.label}
							>
								<span className="text-muted-foreground">
									{isLast ? '└── ' : '├── '}
								</span>
								{'title' in project ? (
									<>
										<span>{project.title}</span>
										<ul className="list-none">
											{project.links.map((link, linkIndex) => {
												const isLastLink =
													linkIndex === project.links.length - 1
												return (
													<li key={link.label}>
														<span className="text-muted-foreground">
															{isLast ? '    ' : '│   '}
															{isLastLink ? '└── ' : '├── '}
														</span>
														<a
															href={link.href}
															className="underline decoration-primary/50 underline-offset-4 transition-colors hover:text-primary hover:decoration-primary"
														>
															{link.label}
														</a>
													</li>
												)
											})}
										</ul>
									</>
								) : (
									<a
										href={project.href}
										className="underline decoration-primary/50 underline-offset-4 transition-colors hover:text-primary hover:decoration-primary"
									>
										{project.label}
									</a>
								)}
							</li>
						)
					})}
				</ul>
			</section>

			{/* $ cat ~/links */}
			<section className="flex flex-col gap-3">
				<Prompt>cat ~/links</Prompt>
				<ul className="flex flex-wrap gap-x-5 gap-y-2 border-l border-border pl-4 sm:pl-6">
					{me.links.map((link) => (
						<li key={link.label}>
							<a
								href={link.href}
								className="text-sm text-foreground underline decoration-primary/50 underline-offset-4 transition-colors hover:text-primary hover:decoration-primary"
							>
								[{link.label}]
							</a>
						</li>
					))}
				</ul>
			</section>

			{/* idle prompt */}
			<div className="flex items-center gap-2 text-sm">
				<span className="text-primary">$</span>
				<span
					className="cursor-blink inline-block h-4 w-2 bg-primary"
					aria-hidden="true"
				/>
			</div>
		</div>
	)
}

function Prompt({ children }: { children: ReactNode }) {
	return (
		<p className="text-sm text-muted-foreground">
			<span className="text-primary">$</span> {children}
		</p>
	)
}
