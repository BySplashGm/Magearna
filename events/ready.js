const { Events, ActivityType, PresenceUpdateStatus } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
		client.user.setPresence({ activities: [{ name: 'des Prismillons', type: ActivityType.Watching }], status: PresenceUpdateStatus.Idle});
	},
};