const {
    Events,
    EmbedBuilder,
    AuditLogEvent,
    ChannelType,
} = require("discord.js");
const config = require("../config.js");

module.exports = {
    name: Events.ChannelDelete,
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
                .setColor("Red")
                .setTitle("Salon supprimé")
                .addFields(
                    { name: "Nom", value: `\`${channel.name}\``, inline: true },
                    { name: "Type", value: channelType, inline: true },
                    { name: "Auteur", value: author, inline: true }
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
