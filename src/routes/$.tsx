import { createFileRoute } from '@tanstack/react-router'
import { NotFound } from '~/components/NotFound'

/**
 * Catch-all route (`/$`) — matches any unmatched path and renders the shared
 * NotFound component. Combined with `notFoundComponent` on the root route for
 * cases where a loader throws `notFound()`.
 */
export const Route = createFileRoute('/$')({
	component: NotFound,
})
