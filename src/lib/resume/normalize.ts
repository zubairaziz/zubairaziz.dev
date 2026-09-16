import { newId, type ResumeData } from './types'

type UnknownRecord = Record<string, unknown>

function asRecord(value: unknown): UnknownRecord {
	return value !== null && typeof value === 'object' && !Array.isArray(value)
		? (value as UnknownRecord)
		: {}
}

function asArray(value: unknown): unknown[] {
	return Array.isArray(value) ? value : []
}

function asString(value: unknown): string {
	return typeof value === 'string' ? value : ''
}

function asId(value: unknown, prefix: string): string {
	return typeof value === 'string' && value.trim() !== ''
		? value
		: newId(prefix)
}

function asStringArray(value: unknown): string[] {
	if (!Array.isArray(value)) return []
	return value.filter((item): item is string => typeof item === 'string')
}

/**
 * Coerce an arbitrary (agent-provided) value into a structurally valid
 * `ResumeData`. Missing fields default to empty and missing entry ids are
 * generated, so agents can omit ids and optional sections. The result is then
 * validated against `resumeSchema` for semantic rules (required name, URL
 * format) before it's applied to the form.
 */
export function normalizeResume(value: unknown): ResumeData {
	const root = asRecord(value)
	const contact = asRecord(root.contact)

	return {
		contact: {
			name: asString(contact.name),
			email: asString(contact.email),
			phone: asString(contact.phone),
			location: asString(contact.location),
		},
		summary: asString(root.summary),
		links: asArray(root.links).map((item) => {
			const entry = asRecord(item)
			return {
				id: asId(entry.id, 'link'),
				label: asString(entry.label),
				url: asString(entry.url),
			}
		}),
		experience: asArray(root.experience).map((item) => {
			const entry = asRecord(item)
			return {
				id: asId(entry.id, 'exp'),
				company: asString(entry.company),
				position: asString(entry.position),
				startDate: asString(entry.startDate),
				endDate: asString(entry.endDate),
				responsibilities: asArray(entry.responsibilities).map((resp) => {
					const responsibility = asRecord(resp)
					return {
						id: asId(responsibility.id, 'resp'),
						text: asString(responsibility.text),
					}
				}),
			}
		}),
		education: asArray(root.education).map((item) => {
			const entry = asRecord(item)
			return {
				id: asId(entry.id, 'edu'),
				school: asString(entry.school),
				degree: asString(entry.degree),
				field: asString(entry.field),
				graduationDate: asString(entry.graduationDate),
			}
		}),
		skills: asArray(root.skills).map((item) => {
			const entry = asRecord(item)
			return {
				id: asId(entry.id, 'skill'),
				category: asString(entry.category),
				items: asStringArray(entry.items),
			}
		}),
		certifications: asArray(root.certifications).map((item) => {
			const entry = asRecord(item)
			return {
				id: asId(entry.id, 'cert'),
				name: asString(entry.name),
				issuer: asString(entry.issuer),
				date: asString(entry.date),
			}
		}),
	}
}
