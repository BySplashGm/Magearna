const { Events, ActivityType, PresenceUpdateStatus } = require("discord.js");
const config = require("../config");
const deployCommands = require('../deploy_commands');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        console.log(`Ready! Logged in as ${client.user.tag}`);
        deployCommands();
        client.user.setPresence({
            activities: [
                { name: "des Prismillons", type: ActivityType.Watching },
            ],
            status: PresenceUpdateStatus.Idle,
        });
    },
};
