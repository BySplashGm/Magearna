const {
    Events,
    EmbedBuilder,
    AuditLogEvent,
    ChannelType,
} = require("discord.js");
const config = require("../config.js");

module.exports = {
    name: Events.ChannelCreate,
    async execute(channel) {
        try {
            const guild = channel.guild;
            const auditLogs = await guild.fetchAuditLogs({
                limit: 1,
                type: AuditLogEvent.ChannelCreate,
            });
            const logEntry = auditLogs.entries.first();
            const author = logEntry ? `<@${logEntry.executor.id}>` : "Inconnu";

            const channelType = (() => {
                switch (channel.type) {
                    case ChannelType.GuildText:
                        return "`Texte`";
                    case ChannelType.GuildVoice:
                        return "`Vocal`";
                    case ChannelType.GuildCategory:
                        return "`Catégorie`";
                    default:
                        return "`Autre`";
                }
            })();

            // Création de l'embed
            const logEmbed = new EmbedBuilder()
                .setColor("Green")
                .setTitle("Salon créé")
                .addFields(
                    { name: "Nom", value: `\`${channel.name}\``, inline: true },
                    { name: "Type", value: channelType, inline: true },
                    { name: "Auteur", value: author, inline: true },
                    { name: "Lien", value: `<#${channel.id}>`, inline: false }
                )
                .setTimestamp()
                .setFooter({
                    text: config.name + " " + config.version,
                    iconURL: channel.client.user.displayAvatarURL(),
                });

            const logChannel = channel.client.channels.cache.get(
                config.logChannel
            );
            await logChannel.send({ embeds: [logEmbed] });
        } catch (error) {
            console.error("Erreur dans l'événement ChannelCreate :", error);
        }
    },
};
