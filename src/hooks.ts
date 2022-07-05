import type { GetSession } from "@sveltejs/kit"
import * as cookie from "cookie"
import type { APIUser } from "discord-api-types/v10"
import { discord, user } from "$lib/data"
import { ObjectId } from "mongodb"

export const getSession: GetSession = async (event) => {
	let { access_token, refresh_token } = cookie.parse(event.request.headers.get("cookie") || "")

	if (refresh_token && !access_token) {
		const discord_response = await fetch(
			`${event.url.protocol}//${event.url.host}/api/refresh?refresh_token=${refresh_token}`
		).then((r) => r.json())

		access_token = discord_response.access_token
		refresh_token = discord_response.refresh_token
	}

	if (access_token) {
		// returns a discord user if JWT was valid
		const discordUser = await discord<APIUser>("/users/@me", access_token)
		user.set({
			_id: new ObjectId(),
			accessToken: access_token,
			discordUser,
		})

		if (discordUser.id) {
			return {
				// only include properties needed client-side —
				// exclude anything else attached to the user
				// like access tokens etc
				user: discordUser,
				accessToken: access_token,
				refreshToken: refresh_token,
			}
		}
	}

	// not authenticated, return empty user object
	return {
		user: undefined,
		accessToken: undefined,
		refreshToken: undefined,
	}
}
