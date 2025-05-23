const { Events, EmbedBuilder, AuditLogEvent } = require("discord.js");
const config = require("../config");

module.exports = {
    name: Events.GuildBanAdd,
    async execute(ban) {
        try {
            const guild = ban.guild;
            const auditLogs = await guild.fetchAuditLogs({
                limit: 1,
                type: AuditLogEvent.MemberBanAdd,
            });
            const logEntry = auditLogs.entries.first();
            const author = logEntry ? `<@${logEntry.executor.id}>` : "Inconnu";

            const logEmbed = new EmbedBuilder()
                .setColor("Purple")
                .setTitle("Utilisateur banni")
                .setDescription(`${ban.user.tag} (${ban.user.id})`)
                .addFields({ name: "Auteur", value: author })
                .setTimestamp()
                .setFooter({
                    text: config.name + " " + config.version,
                    iconURL: ban.client.user.displayAvatarURL(),
                });

            const logChannel = ban.client.channels.cache.get(config.logChannel);
            await logChannel.send({ embeds: [logEmbed] });
        } catch (error) {
            console.error("Erreur dans l'événement GuildBanAdd :", error);
        }
    },
};
