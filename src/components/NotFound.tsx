import { Link } from '@tanstack/react-router'
import { Button } from '~/components/ui/button'

export function NotFound() {
	return (
		<div className="mx-auto flex min-h-[50vh] w-full max-w-5xl flex-col items-start justify-center gap-4 font-mono">
			<p className="text-sm text-muted-foreground">
				<span className="text-primary">$</span> cat /this/path
			</p>
			<h1 className="font-heading text-4xl font-bold text-foreground">
				404 — no such route
			</h1>
			<p className="max-w-md text-muted-foreground">
				cat: /this/path: No such file or directory. Head back to the shell.
			</p>
			<Button render={<Link to="/" />}>cd ~</Button>
		</div>
	)
}
