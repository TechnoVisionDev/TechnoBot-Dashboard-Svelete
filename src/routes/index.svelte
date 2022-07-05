<script lang="ts">
	import { user } from "$lib/data"
	import { session } from "$app/stores"
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<pre>
  <code>
    {JSON.stringify($user)}
  </code>
</pre>

<a href="/api/auth">auth</a>
<a href="/api/refresh?refresh_token={encodeURIComponent($session.refreshToken ?? '')}">refresh</a>
<a href="/api/signout">signout</a>
