import type { CSSProperties } from 'react'
import type { ResumeData } from '~/lib/resume/types'

/**
 * The rendered resume document. Pure and self-contained — it reads colors,
 * fonts, and spacing exclusively from the `--resume-*` CSS variables set by
 * `themeToStyle(...)` on an ancestor, so it never hardcodes palette values.
 */

const sectionStyle: CSSProperties = {
	marginBottom: 'var(--resume-section-gap)',
}

const headingStyle: CSSProperties = {
	fontFamily: 'var(--resume-heading-font)',
	color: 'var(--resume-heading)',
	fontSize: '0.92em',
	textTransform: 'uppercase',
	letterSpacing: '0.06em',
	borderBottom: '1px solid var(--resume-border)',
	paddingBottom: '4px',
	marginBottom: '8px',
}

const entryStyle: CSSProperties = {
	marginBottom: 'var(--resume-item-gap)',
}

const accentBar: CSSProperties = {
	width: '24px',
	height: '2px',
	background: 'var(--resume-accent)',
	marginBottom: '8px',
}

function joinParts(
	parts: Array<string | undefined>,
	separator = ' · ',
): string {
	return parts.filter((part) => part && part.trim().length > 0).join(separator)
}

function joinDates(start: string, end: string): string {
	if (!start.trim() && !end.trim()) return ''
	return joinParts([start, end], ' – ')
}

export function ResumeDocument({ data }: { data: ResumeData }) {
	const {
		contact,
		summary,
		links,
		experience,
		education,
		skills,
		certifications,
	} = data

	const visibleLinks = links.filter((l) => l.label.trim() || l.url.trim())
	const visibleExperience = experience.filter(
		(e) => e.company.trim() || e.position.trim(),
	)
	const visibleEducation = education.filter(
		(e) => e.school.trim() || e.degree.trim() || e.field.trim(),
	)
	const visibleSkills = skills.filter(
		(s) => s.category.trim() || s.items.length > 0,
	)
	const visibleCertifications = certifications.filter(
		(c) => c.name.trim() || c.issuer.trim(),
	)

	const contactLine = joinParts([
		contact.email,
		contact.phone,
		contact.location,
	])

	return (
		<article
			style={{
				fontFamily: 'var(--resume-body-font)',
				fontSize: 'var(--resume-font-size)',
				color: 'var(--resume-text)',
				lineHeight: 1.45,
			}}
		>
			{/* Header */}
			<header style={sectionStyle}>
				<h1
					style={{
						fontFamily: 'var(--resume-heading-font)',
						color: 'var(--resume-heading)',
						fontSize: '2em',
						lineHeight: 1.1,
						margin: 0,
					}}
				>
					{contact.name.trim() || 'Your Name'}
				</h1>
				{contactLine ? (
					<p
						style={{
							margin: '6px 0 0',
							color: 'var(--resume-muted)',
						}}
					>
						{contactLine}
					</p>
				) : null}
				{visibleLinks.length > 0 ? (
					<p style={{ margin: '4px 0 0' }}>
						{visibleLinks.map((link) => (
							<span key={link.id}>
								<a
									href={link.url.trim() || undefined}
									style={{
										color: 'var(--resume-accent)',
										textDecoration: 'none',
									}}
								>
									{link.label.trim() || link.url.trim()}
								</a>
								{' · '}
							</span>
						))}
					</p>
				) : null}
			</header>

			{/* Summary */}
			{summary.trim() ? (
				<section style={sectionStyle}>
					<h2 style={headingStyle}>Summary</h2>
					<p style={{ margin: 0 }}>{summary.trim()}</p>
				</section>
			) : null}

			{/* Experience */}
			{visibleExperience.length > 0 ? (
				<section style={sectionStyle}>
					<h2 style={headingStyle}>Experience</h2>
					{visibleExperience.map((entry) => (
						<div key={entry.id} style={entryStyle}>
							<h3
								style={{
									margin: 0,
									fontFamily: 'var(--resume-heading-font)',
									color: 'var(--resume-heading)',
									fontSize: '1.05em',
								}}
							>
								{joinParts([entry.position, entry.company], ' — ')}
							</h3>
							<p
								style={{
									margin: '2px 0 4px',
									color: 'var(--resume-accent)',
									fontSize: '0.92em',
								}}
							>
								{joinDates(entry.startDate, entry.endDate)}
							</p>
							{entry.description.trim() ? (
								<p style={{ margin: 0 }}>{entry.description.trim()}</p>
							) : null}
						</div>
					))}
				</section>
			) : null}

			{/* Education */}
			{visibleEducation.length > 0 ? (
				<section style={sectionStyle}>
					<h2 style={headingStyle}>Education</h2>
					{visibleEducation.map((entry) => (
						<div key={entry.id} style={entryStyle}>
							<h3
								style={{
									margin: 0,
									fontFamily: 'var(--resume-heading-font)',
									color: 'var(--resume-heading)',
									fontSize: '1.05em',
								}}
							>
								{entry.school.trim() || entry.degree.trim() || 'Education'}
							</h3>
							<p
								style={{
									margin: '2px 0 0',
									color: 'var(--resume-muted)',
								}}
							>
								{joinParts([entry.degree, entry.field, entry.graduationDate])}
							</p>
						</div>
					))}
				</section>
			) : null}

			{/* Skills */}
			{visibleSkills.length > 0 ? (
				<section style={sectionStyle}>
					<h2 style={headingStyle}>Skills</h2>
					{visibleSkills.map((group) => {
						const items = group.items.filter((item) => item.trim())
						if (!group.category.trim() && items.length === 0) return null
						return (
							<div key={group.id} style={entryStyle}>
								<div style={accentBar} />
								{group.category.trim() ? (
									<strong style={{ color: 'var(--resume-heading)' }}>
										{group.category.trim()}:{' '}
									</strong>
								) : null}
								<span>{items.join(', ')}</span>
							</div>
						)
					})}
				</section>
			) : null}

			{/* Certifications */}
			{visibleCertifications.length > 0 ? (
				<section style={sectionStyle}>
					<h2 style={headingStyle}>Certifications</h2>
					{visibleCertifications.map((entry) => (
						<div key={entry.id} style={entryStyle}>
							<strong style={{ color: 'var(--resume-heading)' }}>
								{entry.name.trim() || 'Certification'}
							</strong>
							{entry.issuer.trim() || entry.date.trim() ? (
								<span style={{ color: 'var(--resume-muted)' }}>
									{' — '}
									{joinParts([entry.issuer, entry.date], ' · ')}
								</span>
							) : null}
						</div>
					))}
				</section>
			) : null}
		</article>
	)
}
