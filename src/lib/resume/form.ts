import { useForm } from '@tanstack/react-form'
import { type ResumeData, resumeSchema } from './types'

/**
 * A single, inferred form instance type shared by the form, preview, and
 * export components. `useForm` infers all of its validator generics from the
 * options, so capturing its return type here avoids repeating 12 generic
 * arguments at every call site.
 */
export function useResumeForm(defaultValues: ResumeData) {
	return useForm({
		defaultValues,
		validators: {
			onChange: resumeSchema,
			onSubmit: resumeSchema,
		},
	})
}

export type ResumeFormApi = ReturnType<typeof useResumeForm>
