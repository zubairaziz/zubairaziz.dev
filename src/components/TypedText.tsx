import { useEffect, useState } from 'react'

const TYPE_MS = 55
const DELETE_MS = 30
const HOLD_MS = 1500

/**
 * Types and deletes through a list of words in a loop. The first word is
 * rendered in full on the server (so there is no hydration mismatch) and the
 * animation only runs after mount. Respects `prefers-reduced-motion` by
 * rotating whole words instead of typing.
 */
export function TypedText({
	words,
	className,
}: {
	words: string[]
	className?: string
}) {
	const [index, setIndex] = useState(0)
	const [sub, setSub] = useState(() => words[0]?.length ?? 0)
	const [phase, setPhase] = useState<'typing' | 'holding' | 'deleting'>(
		'holding',
	)

	useEffect(() => {
		const word = words[index]
		if (!word) return

		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			const id = window.setInterval(() => {
				setIndex((i) => (i + 1) % words.length)
			}, 1600)
			return () => window.clearInterval(id)
		}

		const delay =
			phase === 'typing' ? TYPE_MS : phase === 'deleting' ? DELETE_MS : HOLD_MS

		const id = window.setTimeout(() => {
			if (phase === 'typing') {
				const next = sub + 1
				setSub(next)
				if (next >= word.length) setPhase('holding')
			} else if (phase === 'deleting') {
				const next = sub - 1
				if (next <= 0) {
					setSub(0)
					setPhase('typing')
					setIndex((i) => (i + 1) % words.length)
				} else {
					setSub(next)
				}
			} else {
				setPhase('deleting')
			}
		}, delay)

		return () => window.clearTimeout(id)
	}, [index, sub, phase, words])

	const shown =
		phase === 'holding'
			? (words[index] ?? '')
			: (words[index] ?? '').slice(0, sub)

	return <span className={className}>{shown}</span>
}
