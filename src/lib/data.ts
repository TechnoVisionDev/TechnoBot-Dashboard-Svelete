import { browser } from "$app/env"
import type { APIUser } from "discord-api-types/v10"
import { MongoClient, type WithId } from "mongodb"
import { writable as localStore } from "svelte-local-storage-store"
import { get } from "svelte/store"

export type User = WithId<{
	accessToken: string
	discordUser: APIUser
}>

export const user = localStore<User | undefined>("user", undefined)

export const discord = async <T = any>(href: string, token = get(user)?.accessToken): Promise<T> =>
	await fetch(`https://discord.com/api/v10${href}`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	}).then((r) => r.json())

export const mongo = (
	await new MongoClient(import.meta.env.VITE_MONGODB_URI, {
		retryWrites: true,
		w: "majority",
	}).connect()
)
	.db("Dashboard")
	.collection("users")

user.subscribe(async ($user) => {
	if ($user && browser) {
		await mongo.findOneAndUpdate({ _id: $user._id }, { $mod: $user }, { upsert: true })
	}
})
