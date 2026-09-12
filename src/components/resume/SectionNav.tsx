import { cn } from 'cn'
import { useEffect, useState } from 'react'
import { Button } from '~/components/ui/button'
import type { ResumeFormApi } from '~/lib/resume/form'
import {
	computeSectionFilled,
	sectionAnchor,
	sections,
} from '~/lib/resume/sections'

function scrollToSection(id: string) {
	const target = document.getElementById(sectionAnchor(id))
	if (!target) return
	const prefersReduced = window.matchMedia(
		'(prefers-reduced-motion: reduce)',
	).matches
	target.scrollIntoView({
		behavior: prefersReduced ? 'auto' : 'smooth',
		block: 'start',
	})
}

/**
 * Sticky left-hand rail: lists every form section, tracks the section in view
 * via IntersectionObserver, and shows a filled-state dot per section. Hidden
 * below `xl` where it would compete for space with the form + preview.
 */
export function SectionNav({
	form,
	className,
}: {
	form: ResumeFormApi
	className?: string
}) {
	const [activeId, setActiveId] = useState(sections[0].id)

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						setActiveId(entry.target.id.replace('resume-section-', ''))
					}
				}
			},
			{ rootMargin: '-20% 0px -70% 0px', threshold: 0 },
		)

		for (const section of sections) {
			const el = document.getElementById(sectionAnchor(section.id))
			if (el) observer.observe(el)
		}

		return () => observer.disconnect()
	}, [])

	return (
		<nav
			aria-label="Resume sections"
			className={cn('sticky top-20 hidden xl:block', className)}
		>
			<form.Subscribe selector={(state) => state.values}>
				{(values) => {
					const filled = computeSectionFilled(values)
					return (
						<ol className="flex flex-col gap-1">
							{sections.map((section) => {
								const Icon = section.icon
								const isActive = section.id === activeId
								return (
									<li key={section.id}>
										<Button
											type="button"
											variant="ghost"
											size="sm"
											className={cn(
												'w-full justify-start gap-2.5',
												isActive
													? 'bg-muted text-foreground'
													: 'text-muted-foreground',
											)}
											onClick={() => scrollToSection(section.id)}
											aria-current={isActive ? 'true' : undefined}
										>
											<Icon data-icon="inline-start" />
											<span className="flex-1 text-left">{section.label}</span>
											<span
												aria-hidden="true"
												className={cn(
													'size-1.5 rounded-full',
													filled.has(section.id) ? 'bg-primary' : 'bg-border',
												)}
											/>
										</Button>
									</li>
								)
							})}
						</ol>
					)
				}}
			</form.Subscribe>
		</nav>
	)
}
