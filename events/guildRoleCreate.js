const { Events, EmbedBuilder, AuditLogEvent } = require("discord.js");
const config = require("../config");

module.exports = {
    name: Events.GuildRoleCreate,
    async execute(role) {
        try {
            const guild = role.guild;
            const auditLogs = await guild.fetchAuditLogs({
                limit: 1,
                type: AuditLogEvent.RoleCreate,
            });
            const logEntry = auditLogs.entries.first();
            const author = logEntry ? `<@${logEntry.executor.id}>` : "Inconnu";

            const logEmbed = new EmbedBuilder()
                .setColor("Green")
                .setTitle("Rôle créé")
                .addFields(
                    { name: "Nom", value: `\`${role.name}\``, inline: true },
                    {
                        name: "Couleur",
                        value: `\`${role.hexColor}\``,
                        inline: true,
                    },
                    { name: "Auteur", value: author, inline: false }
                )
                .setTimestamp()
                .setFooter({
                    text: config.name + " " + config.version,
                    iconURL: role.client.user.displayAvatarURL(),
                });

            const logChannel = role.client.channels.cache.get(
                config.logChannel
            );
            await logChannel.send({ embeds: [logEmbed] });
        } catch (error) {
            console.error("Erreur dans l'événement GuildRoleCreate :", error);
        }
    },
};
