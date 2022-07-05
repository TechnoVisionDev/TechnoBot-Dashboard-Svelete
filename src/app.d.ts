/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare namespace App {
	// interface Locals {}
	// interface Platform {}
	interface Session {
		user: import("discord-api-types/v10").APIUser | undefined
		accessToken: string | undefined
		refreshToken: string | undefined
	}
	// interface Stuff {}
}
