import { createFileRoute } from '@tanstack/react-router'
import { Eye, EyeOff } from 'lucide-react'
import { useEffect, useState } from 'react'
import { ExportMenu } from '~/components/resume/ExportMenu'
import { ResumeForm } from '~/components/resume/ResumeForm'
import { ResumePreview } from '~/components/resume/ResumePreview'
import { ThemeSelector } from '~/components/resume/ThemeSelector'
import { Button } from '~/components/ui/button'
import { sampleResume } from '~/lib/resume/defaults'
import { useResumeForm } from '~/lib/resume/form'
import {
	loadResume,
	loadTheme,
	saveResume,
	saveTheme,
} from '~/lib/resume/storage'
import { resolveTheme, resolveThemeId, type ThemeId } from '~/lib/resume/themes'
import { seo } from '~/lib/seo'

export const Route = createFileRoute('/tools/resume-builder/')({
	// The tool is fully client-side (localStorage-backed). Disabling SSR avoids
	// a hydration mismatch between the server-rendered sample and stored data.
	ssr: false,
	component: ResumeBuilder,
	head: () => ({
		meta: [
			...seo({
				title: 'Resume Builder — zubairaziz.dev',
				description:
					'Build a professional resume in the browser with live preview and export it to Markdown or PDF.',
				url: 'https://zubairaziz.dev/tools/resume-builder/',
			}),
		],
	}),
})

function ResumeBuilder() {
	const [themeId, setThemeId] = useState<ThemeId>(() =>
		resolveThemeId(loadTheme()),
	)
	const [showPreview, setShowPreview] = useState(false)
	// Lazy one-time init: prefer stored data, fall back to the sample.
	const [initial] = useState(() => loadResume() ?? sampleResume())
	const form = useResumeForm(initial)

	// Persist on every change.
	useEffect(() => {
		const subscription = form.store.subscribe(() =>
			saveResume(form.state.values),
		)
		return () => subscription.unsubscribe()
	}, [form])

	const theme = resolveTheme(themeId)

	function handleThemeChange(id: ThemeId) {
		setThemeId(id)
		saveTheme(id)
	}

	return (
		<div className="flex flex-col gap-8">
			<header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
				<div className="flex flex-col gap-1">
					<h1 className="font-heading text-2xl font-bold text-foreground">
						Resume Builder
					</h1>
					<p className="max-w-md text-sm text-muted-foreground">
						Fill in your details, watch the preview update live, then export as
						Markdown or a print-ready PDF.
					</p>
				</div>

				<div className="flex flex-wrap items-end gap-x-6 gap-y-4">
					<ThemeSelector value={themeId} onChange={handleThemeChange} />
					<ExportMenu form={form} />
				</div>
			</header>

			<div className="grid items-start gap-10 lg:grid-cols-2">
				<ResumeForm form={form} />

				<div className="flex flex-col gap-3">
					<div className="lg:hidden">
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={() => setShowPreview((v) => !v)}
						>
							{showPreview ? (
								<EyeOff data-icon="inline-start" />
							) : (
								<Eye data-icon="inline-start" />
							)}
							{showPreview ? 'Hide preview' : 'Show preview'}
						</Button>
					</div>

					<div className={showPreview ? 'block' : 'hidden lg:block'}>
						<div className="lg:sticky lg:top-20">
							<ResumePreview form={form} theme={theme} />
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
