import { Download, Printer } from 'lucide-react'
import { Button } from '~/components/ui/button'
import type { ResumeFormApi } from '~/lib/resume/form'
import { resumeToMarkdown } from '~/lib/resume/to-markdown'
import type { ResumeData } from '~/lib/resume/types'

function fileStem(name: string): string {
	const slug = name
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
	return slug || 'resume'
}

function downloadMarkdown(data: ResumeData): void {
	const md = resumeToMarkdown(data)
	const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' })
	const url = URL.createObjectURL(blob)
	const anchor = document.createElement('a')
	anchor.href = url
	anchor.download = `${fileStem(data.contact.name)}.md`
	anchor.click()
	URL.revokeObjectURL(url)
}

function exportPdf(): void {
	const previousTitle = document.title
	const cleanup = () => {
		document.body.classList.remove('printing-resume')
		document.title = previousTitle
		window.removeEventListener('afterprint', cleanup)
	}
	window.addEventListener('afterprint', cleanup)
	// Hint the browser's default save-as filename via the document title.
	document.title = 'resume'
	document.body.classList.add('printing-resume')
	window.print()
}

export function ExportMenu({ form }: { form: ResumeFormApi }) {
	return (
		<div className="flex items-center gap-2">
			<Button
				type="button"
				variant="outline"
				size="sm"
				onClick={() => downloadMarkdown(form.state.values)}
			>
				<Download data-icon="inline-start" />
				Markdown
			</Button>
			<Button type="button" variant="default" size="sm" onClick={exportPdf}>
				<Printer data-icon="inline-start" />
				PDF
			</Button>
		</div>
	)
}
