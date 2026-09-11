import { Field, FieldTitle } from '~/components/ui/field'
import { ToggleGroup, ToggleGroupItem } from '~/components/ui/toggle-group'
import { type ThemeId, themeList } from '~/lib/resume/themes'

export function ThemeSelector({
	value,
	onChange,
}: {
	value: ThemeId
	onChange: (id: ThemeId) => void
}) {
	return (
		<Field>
			<FieldTitle id="theme-selector-label">Theme</FieldTitle>
			<ToggleGroup
				aria-labelledby="theme-selector-label"
				value={[value]}
				onValueChange={(v) => {
					if (v[0]) onChange(v[0] as ThemeId)
				}}
				spacing={2}
				variant="outline"
				size="sm"
				className="flex-wrap"
			>
				{themeList.map((theme) => (
					<ToggleGroupItem key={theme.id} value={theme.id}>
						{theme.name}
					</ToggleGroupItem>
				))}
			</ToggleGroup>
		</Field>
	)
}
