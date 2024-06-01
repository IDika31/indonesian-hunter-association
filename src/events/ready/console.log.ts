import type { Client } from "discord.js";

export default function(client: Client<true>) {
    console.log(`Logged in as ${client.user?.tag}!`);
}