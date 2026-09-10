import { StartClient } from '@tanstack/react-start/client'
import { StrictMode, startTransition } from 'react'
import { hydrateRoot } from 'react-dom/client'

/**
 * Client entry — hydrates the full document that `src/server.ts` rendered.
 *
 * `StartClient` auto-resolves the router (configured in `src/router.tsx`)
 * and rehydrates the SSR'd markup on the client.
 */
startTransition(() => {
	hydrateRoot(
		document,
		<StrictMode>
			<StartClient />
		</StrictMode>,
	)
})
