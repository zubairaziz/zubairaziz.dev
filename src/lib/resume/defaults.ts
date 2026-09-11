import { newId, type ResumeData } from './types'

/** A blank resume, ready for a first-time user. */
export function emptyResume(): ResumeData {
	return {
		contact: { name: '', email: '', phone: '', location: '' },
		summary: '',
		links: [],
		experience: [],
		education: [],
		skills: [],
		certifications: [],
	}
}

/** A filled example so the preview isn't blank on first load. */
export function sampleResume(): ResumeData {
	return {
		contact: {
			name: 'Alex Rivera',
			email: 'alex.rivera@example.com',
			phone: '+1 (555) 010-2030',
			location: 'Brooklyn, NY',
		},
		summary:
			'Full-stack engineer with 6 years of experience shipping products end to end — from data modeling and APIs to pixel-level UI. Comfortable owning ambiguity and turning loose requirements into maintainable systems.',
		links: [
			{
				id: 'link-github',
				label: 'GitHub',
				url: 'https://github.com/alexrivera',
			},
			{
				id: 'link-linkedin',
				label: 'LinkedIn',
				url: 'https://linkedin.com/in/alexrivera',
			},
			{
				id: 'link-portfolio',
				label: 'Portfolio',
				url: 'https://alexrivera.dev',
			},
		],
		experience: [
			{
				id: 'exp-1',
				company: 'Northwind Labs',
				position: 'Senior Software Engineer',
				startDate: '01/2021',
				endDate: 'Present',
				responsibilities: [
					{
						id: 'exp-1-r1',
						text: 'Led a team of 4 rebuilding the billing pipeline, cutting invoice latency 40%.',
					},
					{
						id: 'exp-1-r2',
						text: 'Introduced contract testing across 12 services.',
					},
					{
						id: 'exp-1-r3',
						text: 'Drove the migration of a legacy Rails monolith to typed services.',
					},
				],
			},
			{
				id: 'exp-2',
				company: 'Brightline',
				position: 'Software Engineer',
				startDate: '06/2018',
				endDate: '12/2020',
				responsibilities: [
					{
						id: 'exp-2-r1',
						text: 'Built customer-facing dashboards in React and a Node.js gateway serving 200k daily requests.',
					},
					{
						id: 'exp-2-r2',
						text: 'Reduced page load time 55% through code-splitting and caching.',
					},
				],
			},
		],
		education: [
			{
				id: 'edu-1',
				school: 'University of Washington',
				degree: 'B.S.',
				field: 'Computer Science',
				graduationDate: '2018',
			},
		],
		skills: [
			{
				id: 'skill-1',
				category: 'Languages',
				items: ['TypeScript', 'Go', 'SQL'],
			},
			{
				id: 'skill-2',
				category: 'Frameworks',
				items: ['React', 'Node.js', 'PostgreSQL'],
			},
			{
				id: 'skill-3',
				category: 'Tools',
				items: ['Docker', 'AWS', 'GitHub Actions'],
			},
		],
		certifications: [
			{
				id: 'cert-1',
				name: 'AWS Solutions Architect — Associate',
				issuer: 'Amazon Web Services',
				date: '2022',
			},
		],
	}
}

/** Empty entry factories — used by the form's "add" buttons. */

export function newLink() {
	return { id: newId('link'), label: '', url: '' }
}

export function newExperience() {
	return {
		id: newId('exp'),
		company: '',
		position: '',
		startDate: '',
		endDate: '',
		responsibilities: [{ id: newId('resp'), text: '' }],
	}
}

export function newEducation() {
	return {
		id: newId('edu'),
		school: '',
		degree: '',
		field: '',
		graduationDate: '',
	}
}

export function newSkillGroup() {
	return { id: newId('skill'), category: '', items: [] }
}

export function newCertification() {
	return { id: newId('cert'), name: '', issuer: '', date: '' }
}
