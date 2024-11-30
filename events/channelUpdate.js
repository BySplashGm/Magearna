const {
    Events,
    EmbedBuilder,
    AuditLogEvent,
    ChannelType,
} = require("discord.js");

module.exports = {
    name: Events.ChannelUpdate,
    async execute(oldChannel, newChannel) {
        try {
            const changes = [];
            if (oldChannel.name !== newChannel.name) {
                changes.push({
                    name: "Nom",
                    value: `\`${oldChannel.name}\` → \`${newChannel.name}\``,
                });
            }
            if (oldChannel.type !== newChannel.type) {
                const typeToString = (type) => {
                    switch (type) {
                        case ChannelType.GuildText:
                            return "Texte";
                        case ChannelType.GuildVoice:
                            return "Vocal";
                        case ChannelType.GuildCategory:
                            return "Catégorie";
                        default:
                            return "Autre";
                    }
                };
                changes.push({
                    name: "Type",
                    value: `\`${typeToString(
                        oldChannel.type
                    )}\` → \`${typeToString(newChannel.type)}\``,
                });
            }
            if (oldChannel.topic !== newChannel.topic) {
                changes.push({
                    name: "Sujet",
                    value: `\`${oldChannel.topic || "Aucun"}\` → \`${
                        newChannel.topic || "Aucun"
                    }\``,
                });
            }

            if (changes.length === 0) return;

            const guild = newChannel.guild;
            const auditLogs = await guild.fetchAuditLogs({
                limit: 1,
                type: AuditLogEvent.ChannelUpdate,
            });
            const logEntry = auditLogs.entries.first();
            const author = logEntry ? `<@${logEntry.executor.id}>` : "Inconnu";

            const logEmbed = new EmbedBuilder()
                .setColor("Orange")
                .setTitle(`Salon ${oldChannel.name} mis à jour`)
                .addFields(
                    ...changes,
                    { name: "Auteur", value: author, inline: true },
                    { name: "Lien", value: `<#${newChannel.id}>`, inline: true }
                )
                .setTimestamp()
                .setFooter({
                    text: "Magearna",
                    iconURL: newChannel.client.user.displayAvatarURL(),
                });

            const logChannel = newChannel.client.channels.cache.get(
                process.env.LOGCHANNEL
            );
            await logChannel.send({ embeds: [logEmbed] });
        } catch (error) {
            console.error("Erreur dans l'événement ChannelUpdate :", error);
        }
    },
};
