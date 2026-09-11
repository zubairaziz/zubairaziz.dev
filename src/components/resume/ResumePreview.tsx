import type { ResumeFormApi } from '~/lib/resume/form'
import { type ResumeTheme, themeToStyle } from '~/lib/resume/themes'
import { ResumeDocument } from './ResumeDocument'

/**
 * The live preview. Wraps the pure document in a letter-sized "paper" that
 * carries the theme CSS variables, and subscribes to form values so the
 * document re-renders on every keystroke.
 *
 * `id="resume-print-root"` is what the print stylesheet targets for the
 * print-to-PDF export.
 */
export function ResumePreview({
	form,
	theme,
}: {
	form: ResumeFormApi
	theme: ResumeTheme
}) {
	return (
		<div
			id="resume-print-root"
			className="resume-paper mx-auto w-full max-w-204"
			style={themeToStyle(theme)}
		>
			<form.Subscribe selector={(state) => state.values}>
				{(values) => <ResumeDocument data={values} />}
			</form.Subscribe>
		</div>
	)
}
