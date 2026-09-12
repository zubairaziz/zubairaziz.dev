import { Link } from '@tanstack/react-router'
import { Button } from '~/components/ui/button'

export function DefaultCatchBoundary({ error }: { error: unknown }) {
	console.error(error)

	return (
		<div className="mx-auto flex min-h-[40vh] w-full max-w-5xl flex-col items-start justify-center gap-4 font-mono">
			<p className="text-sm text-muted-foreground">
				<span className="text-primary">$</span> ./render --strict
			</p>
			<h1 className="font-heading text-3xl font-bold text-foreground">
				Segmentation fault
			</h1>
			<p className="max-w-md text-muted-foreground">
				The process crashed while rendering this page. You can head back to a
				safe state below.
			</p>
			<div className="flex gap-3">
				<Button render={<Link to="/" />}>cd ~</Button>
				<Button variant="outline" onClick={() => window.location.reload()}>
					Retry
				</Button>
			</div>
		</div>
	)
}
