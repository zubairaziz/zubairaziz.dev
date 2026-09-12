import { Plus, Trash2 } from 'lucide-react'
import type { ReactNode } from 'react'
import { Button } from '~/components/ui/button'
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from '~/components/ui/field'
import { Input } from '~/components/ui/input'
import { Textarea } from '~/components/ui/textarea'
import {
	newCertification,
	newEducation,
	newExperience,
	newLink,
	newSkillGroup,
} from '~/lib/resume/defaults'
import type { ResumeFormApi } from '~/lib/resume/form'
import { type SectionDef, sectionAnchor, sections } from '~/lib/resume/sections'
import { joinSkills, newId, splitSkills } from '~/lib/resume/types'

function Section({
	def,
	index,
	action,
	children,
}: {
	def: SectionDef
	index: number
	action?: ReactNode
	children: ReactNode
}) {
	const Icon = def.icon
	return (
		<section
			id={sectionAnchor(def.id)}
			className="scroll-mt-24 border border-border bg-card"
		>
			<div className="flex items-center justify-between gap-2 border-b border-border px-4 py-2.5">
				<h2 className="flex items-center gap-2.5">
					<span className="font-mono text-xs text-muted-foreground tabular-nums">
						{String(index + 1).padStart(2, '0')}
					</span>
					<Icon className="size-4 text-primary" aria-hidden="true" />
					<span className="font-heading text-sm font-semibold text-foreground">
						{def.label}
					</span>
				</h2>
				{action}
			</div>
			<div className="flex flex-col gap-5 p-4">{children}</div>
		</section>
	)
}

function AddButton({
	onClick,
	children,
}: {
	onClick: () => void
	children: ReactNode
}) {
	return (
		<Button type="button" variant="outline" size="sm" onClick={onClick}>
			<Plus data-icon="inline-start" />
			{children}
		</Button>
	)
}

function RemoveButton({ onClick }: { onClick: () => void }) {
	return (
		<Button
			type="button"
			variant="ghost"
			size="icon-sm"
			className="absolute top-1.5 right-1.5 text-muted-foreground hover:text-destructive"
			onClick={onClick}
			aria-label="Remove entry"
		>
			<Trash2 />
		</Button>
	)
}

export function ResumeForm({ form }: { form: ResumeFormApi }) {
	return (
		<form
			className="flex flex-col gap-8"
			onSubmit={(e) => {
				e.preventDefault()
				form.handleSubmit()
			}}
		>
			{/* Contact */}
			<Section def={sections[0]} index={0}>
				<FieldGroup>
					<form.Field name="contact.name">
						{(field) => {
							const isInvalid =
								field.state.meta.isTouched && !field.state.meta.isValid
							return (
								<Field data-invalid={isInvalid || undefined}>
									<FieldLabel htmlFor={field.name}>Full name</FieldLabel>
									<Input
										id={field.name}
										name={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										aria-invalid={isInvalid || undefined}
										placeholder="Jane Doe"
										autoComplete="name"
									/>
									{isInvalid ? (
										<FieldError errors={field.state.meta.errors} />
									) : null}
								</Field>
							)
						}}
					</form.Field>

					<form.Field name="contact.email">
						{(field) => {
							const isInvalid =
								field.state.meta.isTouched && !field.state.meta.isValid
							return (
								<Field data-invalid={isInvalid || undefined}>
									<FieldLabel htmlFor={field.name}>Email</FieldLabel>
									<Input
										id={field.name}
										name={field.name}
										type="email"
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										aria-invalid={isInvalid || undefined}
										placeholder="jane@example.com"
										autoComplete="email"
									/>
									{isInvalid ? (
										<FieldError errors={field.state.meta.errors} />
									) : null}
								</Field>
							)
						}}
					</form.Field>

					<form.Field name="contact.phone">
						{(field) => (
							<Field>
								<FieldLabel htmlFor={field.name}>Phone</FieldLabel>
								<Input
									id={field.name}
									name={field.name}
									type="tel"
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									placeholder="+1 (555) 000-0000"
									autoComplete="tel"
								/>
							</Field>
						)}
					</form.Field>

					<form.Field name="contact.location">
						{(field) => (
							<Field>
								<FieldLabel htmlFor={field.name}>Location</FieldLabel>
								<Input
									id={field.name}
									name={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									placeholder="Brooklyn, NY"
								/>
							</Field>
						)}
					</form.Field>
				</FieldGroup>
			</Section>

			{/* Summary */}
			<Section def={sections[1]} index={1}>
				<form.Field name="summary">
					{(field) => (
						<Field>
							<FieldLabel htmlFor={field.name}>Professional summary</FieldLabel>
							<Textarea
								id={field.name}
								name={field.name}
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								placeholder="A short paragraph about who you are and what you do."
								rows={4}
							/>
						</Field>
					)}
				</form.Field>
			</Section>

			{/* Links */}
			<Section
				def={sections[2]}
				index={2}
				action={
					<form.Field name="links" mode="array">
						{(field) => (
							<AddButton onClick={() => field.pushValue(newLink())}>
								Add link
							</AddButton>
						)}
					</form.Field>
				}
			>
				<form.Field name="links" mode="array">
					{(field) => (
						<div className="flex flex-col gap-4">
							{field.state.value.length === 0 ? (
								<p className="border border-dashed border-border p-3 text-xs text-muted-foreground">
									No links yet. Add GitHub, LinkedIn, or a portfolio.
								</p>
							) : (
								field.state.value.map((link, i) => (
									<div
										key={link.id}
										className="relative flex flex-col gap-3 border border-border p-4 pt-9"
									>
										<span className="absolute top-2.5 left-4 font-mono text-xs text-muted-foreground">
											Entry {String(i + 1).padStart(2, '0')}
										</span>
										<FieldGroup>
											<form.Field name={`links[${i}].label`}>
												{(lf) => (
													<Field>
														<FieldLabel htmlFor={lf.name}>Label</FieldLabel>
														<Input
															id={lf.name}
															name={lf.name}
															value={lf.state.value}
															onBlur={lf.handleBlur}
															onChange={(e) => lf.handleChange(e.target.value)}
															placeholder="GitHub"
														/>
													</Field>
												)}
											</form.Field>

											<form.Field name={`links[${i}].url`}>
												{(uf) => {
													const isInvalid =
														uf.state.meta.isTouched && !uf.state.meta.isValid
													return (
														<Field data-invalid={isInvalid || undefined}>
															<FieldLabel htmlFor={uf.name}>URL</FieldLabel>
															<Input
																id={uf.name}
																name={uf.name}
																type="url"
																value={uf.state.value}
																onBlur={uf.handleBlur}
																onChange={(e) =>
																	uf.handleChange(e.target.value)
																}
																aria-invalid={isInvalid || undefined}
																placeholder="https://github.com/jane"
															/>
															{isInvalid ? (
																<FieldError errors={uf.state.meta.errors} />
															) : null}
														</Field>
													)
												}}
											</form.Field>
										</FieldGroup>
										<RemoveButton onClick={() => field.removeValue(i)} />
									</div>
								))
							)}
						</div>
					)}
				</form.Field>
			</Section>

			{/* Experience */}
			<Section
				def={sections[3]}
				index={3}
				action={
					<form.Field name="experience" mode="array">
						{(field) => (
							<AddButton onClick={() => field.pushValue(newExperience())}>
								Add role
							</AddButton>
						)}
					</form.Field>
				}
			>
				<form.Field name="experience" mode="array">
					{(field) => (
						<div className="flex flex-col gap-4">
							{field.state.value.length === 0 ? (
								<p className="border border-dashed border-border p-3 text-xs text-muted-foreground">
									No roles yet. Add your work history.
								</p>
							) : (
								field.state.value.map((entry, i) => (
									<div
										key={entry.id}
										className="relative flex flex-col gap-3 border border-border p-4 pt-9"
									>
										<span className="absolute top-2.5 left-4 font-mono text-xs text-muted-foreground">
											Entry {String(i + 1).padStart(2, '0')}
										</span>
										<FieldGroup>
											<form.Field name={`experience[${i}].position`}>
												{(f) => (
													<Field>
														<FieldLabel htmlFor={f.name}>Position</FieldLabel>
														<Input
															id={f.name}
															name={f.name}
															value={f.state.value}
															onBlur={f.handleBlur}
															onChange={(e) => f.handleChange(e.target.value)}
															placeholder="Senior Software Engineer"
														/>
													</Field>
												)}
											</form.Field>

											<form.Field name={`experience[${i}].company`}>
												{(f) => (
													<Field>
														<FieldLabel htmlFor={f.name}>Company</FieldLabel>
														<Input
															id={f.name}
															name={f.name}
															value={f.state.value}
															onBlur={f.handleBlur}
															onChange={(e) => f.handleChange(e.target.value)}
															placeholder="Northwind Labs"
														/>
													</Field>
												)}
											</form.Field>

											<div className="grid grid-cols-2 gap-3">
												<form.Field name={`experience[${i}].startDate`}>
													{(f) => (
														<Field>
															<FieldLabel htmlFor={f.name}>
																Start (MM/YYYY)
															</FieldLabel>
															<Input
																id={f.name}
																name={f.name}
																value={f.state.value}
																onBlur={f.handleBlur}
																onChange={(e) => f.handleChange(e.target.value)}
																placeholder="01/2021"
															/>
														</Field>
													)}
												</form.Field>

												<form.Field name={`experience[${i}].endDate`}>
													{(f) => (
														<Field>
															<FieldLabel htmlFor={f.name}>
																End (or Present)
															</FieldLabel>
															<Input
																id={f.name}
																name={f.name}
																value={f.state.value}
																onBlur={f.handleBlur}
																onChange={(e) => f.handleChange(e.target.value)}
																placeholder="Present"
															/>
														</Field>
													)}
												</form.Field>
											</div>

											<form.Field
												name={`experience[${i}].responsibilities`}
												mode="array"
											>
												{(f) => (
													<Field>
														<FieldLabel>Responsibilities</FieldLabel>
														<div className="flex flex-col gap-2">
															{f.state.value.map((resp, ri) => (
																<form.Field
																	key={resp.id}
																	name={`experience[${i}].responsibilities[${ri}].text`}
																>
																	{(rf) => (
																		<div className="flex items-center gap-2">
																			<Input
																				id={rf.name}
																				name={rf.name}
																				value={rf.state.value}
																				onBlur={rf.handleBlur}
																				onChange={(e) =>
																					rf.handleChange(e.target.value)
																				}
																				placeholder="What you built, owned, and shipped."
																				aria-label={`Responsibility ${ri + 1}`}
																			/>
																			<Button
																				type="button"
																				variant="ghost"
																				size="icon-sm"
																				className="shrink-0 text-muted-foreground hover:text-destructive"
																				onClick={() => f.removeValue(ri)}
																				aria-label="Remove responsibility"
																			>
																				<Trash2 />
																			</Button>
																		</div>
																	)}
																</form.Field>
															))}
															<AddButton
																onClick={() =>
																	f.pushValue({ id: newId('resp'), text: '' })
																}
															>
																Add responsibility
															</AddButton>
														</div>
													</Field>
												)}
											</form.Field>
										</FieldGroup>
										<RemoveButton onClick={() => field.removeValue(i)} />
									</div>
								))
							)}
						</div>
					)}
				</form.Field>
			</Section>

			{/* Education */}
			<Section
				def={sections[4]}
				index={4}
				action={
					<form.Field name="education" mode="array">
						{(field) => (
							<AddButton onClick={() => field.pushValue(newEducation())}>
								Add school
							</AddButton>
						)}
					</form.Field>
				}
			>
				<form.Field name="education" mode="array">
					{(field) => (
						<div className="flex flex-col gap-4">
							{field.state.value.length === 0 ? (
								<p className="border border-dashed border-border p-3 text-xs text-muted-foreground">
									No education yet. Add a school or degree.
								</p>
							) : (
								field.state.value.map((entry, i) => (
									<div
										key={entry.id}
										className="relative flex flex-col gap-3 border border-border p-4 pt-9"
									>
										<span className="absolute top-2.5 left-4 font-mono text-xs text-muted-foreground">
											Entry {String(i + 1).padStart(2, '0')}
										</span>
										<FieldGroup>
											<form.Field name={`education[${i}].school`}>
												{(f) => (
													<Field>
														<FieldLabel htmlFor={f.name}>School</FieldLabel>
														<Input
															id={f.name}
															name={f.name}
															value={f.state.value}
															onBlur={f.handleBlur}
															onChange={(e) => f.handleChange(e.target.value)}
															placeholder="University of Washington"
														/>
													</Field>
												)}
											</form.Field>

											<div className="grid grid-cols-2 gap-3">
												<form.Field name={`education[${i}].degree`}>
													{(f) => (
														<Field>
															<FieldLabel htmlFor={f.name}>Degree</FieldLabel>
															<Input
																id={f.name}
																name={f.name}
																value={f.state.value}
																onBlur={f.handleBlur}
																onChange={(e) => f.handleChange(e.target.value)}
																placeholder="B.S."
															/>
														</Field>
													)}
												</form.Field>

												<form.Field name={`education[${i}].field`}>
													{(f) => (
														<Field>
															<FieldLabel htmlFor={f.name}>
																Field of study
															</FieldLabel>
															<Input
																id={f.name}
																name={f.name}
																value={f.state.value}
																onBlur={f.handleBlur}
																onChange={(e) => f.handleChange(e.target.value)}
																placeholder="Computer Science"
															/>
														</Field>
													)}
												</form.Field>
											</div>

											<form.Field name={`education[${i}].graduationDate`}>
												{(f) => (
													<Field>
														<FieldLabel htmlFor={f.name}>
															Graduation year
														</FieldLabel>
														<Input
															id={f.name}
															name={f.name}
															value={f.state.value}
															onBlur={f.handleBlur}
															onChange={(e) => f.handleChange(e.target.value)}
															placeholder="2018"
														/>
													</Field>
												)}
											</form.Field>
										</FieldGroup>
										<RemoveButton onClick={() => field.removeValue(i)} />
									</div>
								))
							)}
						</div>
					)}
				</form.Field>
			</Section>

			{/* Skills */}
			<Section
				def={sections[5]}
				index={5}
				action={
					<form.Field name="skills" mode="array">
						{(field) => (
							<AddButton onClick={() => field.pushValue(newSkillGroup())}>
								Add group
							</AddButton>
						)}
					</form.Field>
				}
			>
				<form.Field name="skills" mode="array">
					{(field) => (
						<div className="flex flex-col gap-4">
							{field.state.value.length === 0 ? (
								<p className="border border-dashed border-border p-3 text-xs text-muted-foreground">
									No skills yet. Group them by category (Languages, Tools…).
								</p>
							) : (
								field.state.value.map((group, i) => (
									<div
										key={group.id}
										className="relative flex flex-col gap-3 border border-border p-4 pt-9"
									>
										<span className="absolute top-2.5 left-4 font-mono text-xs text-muted-foreground">
											Entry {String(i + 1).padStart(2, '0')}
										</span>
										<FieldGroup>
											<form.Field name={`skills[${i}].category`}>
												{(f) => (
													<Field>
														<FieldLabel htmlFor={f.name}>Category</FieldLabel>
														<Input
															id={f.name}
															name={f.name}
															value={f.state.value}
															onBlur={f.handleBlur}
															onChange={(e) => f.handleChange(e.target.value)}
															placeholder="Languages"
														/>
													</Field>
												)}
											</form.Field>

											<form.Field name={`skills[${i}].items`}>
												{(f) => (
													<Field>
														<FieldLabel htmlFor={f.name}>Skills</FieldLabel>
														<Input
															id={f.name}
															name={f.name}
															value={joinSkills(f.state.value)}
															onBlur={f.handleBlur}
															onChange={(e) =>
																f.handleChange(splitSkills(e.target.value))
															}
															placeholder="TypeScript, Go, SQL"
														/>
													</Field>
												)}
											</form.Field>
										</FieldGroup>
										<RemoveButton onClick={() => field.removeValue(i)} />
									</div>
								))
							)}
						</div>
					)}
				</form.Field>
			</Section>

			{/* Certifications */}
			<Section
				def={sections[6]}
				index={6}
				action={
					<form.Field name="certifications" mode="array">
						{(field) => (
							<AddButton onClick={() => field.pushValue(newCertification())}>
								Add cert
							</AddButton>
						)}
					</form.Field>
				}
			>
				<form.Field name="certifications" mode="array">
					{(field) => (
						<div className="flex flex-col gap-4">
							{field.state.value.length === 0 ? (
								<p className="border border-dashed border-border p-3 text-xs text-muted-foreground">
									No certifications yet.
								</p>
							) : (
								field.state.value.map((entry, i) => (
									<div
										key={entry.id}
										className="relative flex flex-col gap-3 border border-border p-4 pt-9"
									>
										<span className="absolute top-2.5 left-4 font-mono text-xs text-muted-foreground">
											Entry {String(i + 1).padStart(2, '0')}
										</span>
										<FieldGroup>
											<form.Field name={`certifications[${i}].name`}>
												{(f) => (
													<Field>
														<FieldLabel htmlFor={f.name}>Name</FieldLabel>
														<Input
															id={f.name}
															name={f.name}
															value={f.state.value}
															onBlur={f.handleBlur}
															onChange={(e) => f.handleChange(e.target.value)}
															placeholder="AWS Solutions Architect"
														/>
													</Field>
												)}
											</form.Field>

											<div className="grid grid-cols-2 gap-3">
												<form.Field name={`certifications[${i}].issuer`}>
													{(f) => (
														<Field>
															<FieldLabel htmlFor={f.name}>Issuer</FieldLabel>
															<Input
																id={f.name}
																name={f.name}
																value={f.state.value}
																onBlur={f.handleBlur}
																onChange={(e) => f.handleChange(e.target.value)}
																placeholder="Amazon Web Services"
															/>
														</Field>
													)}
												</form.Field>

												<form.Field name={`certifications[${i}].date`}>
													{(f) => (
														<Field>
															<FieldLabel htmlFor={f.name}>Date</FieldLabel>
															<Input
																id={f.name}
																name={f.name}
																value={f.state.value}
																onBlur={f.handleBlur}
																onChange={(e) => f.handleChange(e.target.value)}
																placeholder="2022"
															/>
														</Field>
													)}
												</form.Field>
											</div>
										</FieldGroup>
										<RemoveButton onClick={() => field.removeValue(i)} />
									</div>
								))
							)}
						</div>
					)}
				</form.Field>
			</Section>
		</form>
	)
}
