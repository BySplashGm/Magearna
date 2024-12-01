const { Events, EmbedBuilder, AuditLogEvent } = require("discord.js");
const config = require("../config");

module.exports = {
    name: Events.GuildUpdate,
    async execute(oldGuild, newGuild) {
        try {
            const changes = [];
            if (oldGuild.name !== newGuild.name) {
                changes.push({
                    name: "Nom",
                    value: `\`${oldGuild.name}\` → \`${newGuild.name}\``,
                });
            }

            if (changes.length === 0) return;

            const guild = newGuild;
            const auditLogs = await guild.fetchAuditLogs({
                limit: 1,
                type: AuditLogEvent.RoleUpdate,
            });
            const logEntry = auditLogs.entries.first();
            const author = logEntry ? `<@${logEntry.executor.id}>` : "Inconnu";

            const logEmbed = new EmbedBuilder()
                .setColor("Orange")
                .setTitle(`Serveur ${oldGuild.name} mis à jour`)
                .addFields(...changes, {
                    name: "Auteur",
                    value: author,
                    inline: false,
                })
                .setTimestamp()
                .setFooter({
                    text: config.name + " " + config.version,
                    iconURL: newGuild.client.user.displayAvatarURL(),
                });

            const logChannel = newGuild.client.channels.cache.get(
                config.logChannel
            );
            await logChannel.send({ embeds: [logEmbed] });
        } catch (error) {
            console.error("Erreur dans l'événement GuildRoleUpdate :", error);
        }
    },
};
