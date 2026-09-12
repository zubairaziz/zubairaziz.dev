import { createPortal } from 'react-dom'
import type { ResumeFormApi } from '~/lib/resume/form'
import { type ResumeTheme, themeToStyle } from '~/lib/resume/themes'
import { ResumeDocument } from './ResumeDocument'

/**
 * A hidden, print-only copy of the resume rendered into a portal at the very
 * end of <body>. Keeping it a direct child of <body> (instead of nested deep
 * inside the builder layout) lets the print stylesheet hide the entire app
 * with `display: none` while leaving the resume in normal document flow — so
 * the browser paginates multi-page resumes correctly. (Absolutely-positioned
 * print targets get clipped to the first page in Chrome.)
 *
 * It stays in sync with the form via the same `<form.Subscribe>` the on-screen
 * preview uses; `display: none` on screen means it costs no layout.
 */
export function ResumePrintPortal({
	form,
	theme,
}: {
	form: ResumeFormApi
	theme: ResumeTheme
}) {
	return createPortal(
		<div
			id="resume-print-root"
			className="resume-paper resume-print-root"
			style={themeToStyle(theme)}
		>
			<form.Subscribe selector={(state) => state.values}>
				{(values) => <ResumeDocument data={values} />}
			</form.Subscribe>
		</div>,
		document.body,
	)
}
