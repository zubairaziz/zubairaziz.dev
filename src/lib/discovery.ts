/**
 * Machine-readable agent-discovery payloads (well-known URIs, Link headers,
 * markdown). Everything here is derived from `src/lib/me.ts` where possible so
 * the site has a single source of truth.
 *
 * These builders are pure data — the HTTP layer (headers, status codes,
 * content negotiation) lives in `src/start.ts`, which is server-only.
 */
import { me } from './me'
import { SKILL_DIGEST } from './skill-digest.gen'

export const BASE = `https://${me.host}`

/** OAuth issuer advertised across discovery documents. */
export const ISSUER = BASE

/** Relation types + targets advertised on the homepage `Link` response headers. */
export const DISCOVERY_LINK_HEADERS = [
	`<${BASE}/.well-known/api-catalog>; rel="api-catalog"`,
	`<${BASE}/openapi.json>; rel="service-desc"`,
	`<${BASE}/llms.txt>; rel="service-doc"`,
	`<${BASE}/.well-known/ai-catalog.json>; rel="describedby"`,
	`<${BASE}/.well-known/ai-catalog.json>; rel="ai-catalog"`,
	`<${BASE}/.well-known/mcp/server-card.json>; rel="mcp-server-card"`,
	`<${BASE}/.well-known/agent-skills/index.json>; rel="agent-skills"`,
]

/** Markdown representation of the homepage (Accept: text/markdown negotiation). */
export function homepageMarkdown(): string {
	const words = me.tagline.words
	const built =
		words.length > 1
			? `${words.slice(0, -1).join(', ')}, and ${words[words.length - 1]}`
			: words[0]

	return [
		`# ${me.name}`,
		'',
		`> ${me.name} — ${me.role} building ${built}.`,
		'',
		`The personal site of ${me.name}, a terminal-styled one-pager at ${BASE}.`,
		'',
		'## Working on',
		'',
		...me.now.map((item) => `- [${item.label}](${item.href})`),
		'',
		'## Links',
		'',
		...me.links.map((link) => `- [${link.label}](${link.href})`),
		'',
		'## Agent resources',
		'',
		`- [API catalog](${BASE}/.well-known/api-catalog)`,
		`- [AI catalog (ARD)](${BASE}/.well-known/ai-catalog.json)`,
		`- [MCP server card](${BASE}/.well-known/mcp/server-card.json)`,
		`- [Agent skills index](${BASE}/.well-known/agent-skills/index.json)`,
		`- [Auth.md](${BASE}/auth.md)`,
		'',
	].join('\n')
}

/** RFC 9727 api-catalog document (application/linkset+json). */
export function apiCatalog(): Record<string, unknown> {
	return {
		linkset: [
			{
				anchor: `${BASE}/`,
				'service-desc': [
					{
						href: `${BASE}/openapi.json`,
						type: 'application/vnd.oai.openapi+json',
					},
				],
				'service-doc': [
					{
						href: `${BASE}/llms.txt`,
						type: 'text/plain',
					},
				],
				status: [
					{
						href: `${BASE}/`,
						type: 'text/html',
					},
				],
			},
		],
	}
}

/** ARD (Agentic Resource Discovery) capability manifest. */
export function ardCatalog(): Record<string, unknown> {
	return {
		specVersion: '1.0',
		host: {
			displayName: me.name,
			identifier: `did:web:${me.host}`,
		},
		entries: [
			{
				identifier: `urn:air:${me.host}:server:home`,
				displayName: `${me.name} — Personal Site`,
				type: 'application/mcp-server-card+json',
				url: `${BASE}/.well-known/mcp/server-card.json`,
				representativeQueries: [
					'who is Zubair Aziz',
					'what projects is Zubair Aziz working on',
					'how can I contact Zubair Aziz',
				],
			},
			{
				identifier: `urn:air:${me.host}:api:site`,
				displayName: `${me.name} — Site API`,
				type: 'application/vnd.oai.openapi+json',
				url: `${BASE}/openapi.json`,
				representativeQueries: [
					'get Zubair Aziz profile data',
					'list Zubair Aziz current projects',
					'get Zubair Aziz social links',
				],
			},
		],
	}
}

/** MCP Server Card (SEP-2127 / SEP-1649). */
export function mcpServerCard(): Record<string, unknown> {
	return {
		schemaVersion: '2025-10-17',
		serverInfo: {
			name: me.host,
			title: `${me.name} — Personal Site`,
			version: '1.0.0',
		},
		transport: {
			type: 'streamable-http',
			endpoint: `${BASE}/mcp`,
		},
		capabilities: {
			tools: {},
			resources: {},
			prompts: {},
		},
	}
}

/**
 * Agent Skills discovery index (Agent Skills Discovery RFC v0.2.0).
 *
 * `digest` is the SHA-256 of `public/skills/about/SKILL.md`, generated at
 * build time by `scripts/generate-skill.ts` into `skill-digest.gen.ts` so it
 * always matches the artifact actually served.
 */
export function agentSkillsIndex(): Record<string, unknown> {
	return {
		$schema: 'https://schemas.agentskills.io/discovery/0.2.0/schema.json',
		skills: [
			{
				name: 'about-zubair',
				type: 'skill-md',
				description: `${me.name} — ${me.role}: current projects and contact links.`,
				url: `${BASE}/skills/about/SKILL.md`,
				digest: SKILL_DIGEST,
			},
		],
	}
}

/** OAuth 2.0 Authorization Server metadata (RFC 8414). */
export function oauthAuthorizationServer(): Record<string, unknown> {
	return {
		issuer: ISSUER,
		authorization_endpoint: `${ISSUER}/oauth/authorize`,
		token_endpoint: `${ISSUER}/oauth/token`,
		jwks_uri: `${ISSUER}/.well-known/jwks.json`,
		grant_types_supported: ['authorization_code', 'client_credentials'],
		response_types_supported: ['code'],
		token_endpoint_auth_methods_supported: [
			'client_secret_post',
			'client_secret_basic',
		],
		agent_auth: {
			skill: `${ISSUER}/auth.md`,
			register_uri: `${ISSUER}/agent/register`,
			identity_types_supported: ['anonymous'],
			anonymous: {
				credential_types_supported: ['bearer_token'],
				claim_uri: `${ISSUER}/agent/claim`,
			},
		},
	}
}

/** OpenID Connect discovery metadata — mirrors the OAuth authorization server. */
export function openIdConfiguration(): Record<string, unknown> {
	return oauthAuthorizationServer()
}

/** OAuth 2.0 Protected Resource Metadata (RFC 9728). */
export function oauthProtectedResource(): Record<string, unknown> {
	return {
		resource: ISSUER,
		authorization_servers: [ISSUER],
		scopes_supported: ['read:profile'],
		bearer_methods_supported: ['header'],
	}
}

/** Placeholder JSON Web Key Set referenced by the discovery documents. */
export function jwks(): Record<string, unknown> {
	return { keys: [] }
}

/** Agent registration instructions served at `/auth.md` (WorkOS auth.md). */
export function authMarkdown(): string {
	return [
		'# auth.md',
		'',
		`Agent registration and authentication for **${me.host}**.`,
		'',
		'## Audience',
		'',
		'AI agents that want to interact with the site and its published APIs.',
		'',
		'## Registration',
		'',
		`- Register an agent at: ${ISSUER}/agent/register`,
		'',
		'## Supported methods',
		'',
		'- Anonymous access with a bearer token credential.',
		'',
		'## Credential use',
		'',
		'Present the issued token as a bearer token in the HTTP authorization header.',
		'',
		'## Revocation',
		'',
		`- Revoke a credential at: ${ISSUER}/agent/revoke`,
		'',
		'## Discovery',
		'',
		`- OAuth Protected Resource Metadata: ${ISSUER}/.well-known/oauth-protected-resource`,
		`- OAuth Authorization Server Metadata: ${ISSUER}/.well-known/oauth-authorization-server`,
		'',
	].join('\n')
}
