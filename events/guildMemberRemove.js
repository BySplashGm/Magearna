require("dotenv").config();
const {
    Events,
    EmbedBuilder,
    time,
    TimestampStyles,
    AuditLogEvent,
} = require("discord.js");

module.exports = {
    name: Events.GuildMemberRemove,
    async execute(member) {
        try {
            const guild = member.guild;
            const auditLogs = await guild.fetchAuditLogs({
                limit: 1,
                type: AuditLogEvent.MemberKick,
            });
            const logEntry = auditLogs.entries.first();
            const isKick = logEntry && logEntry.target.id === member.id;

            if (isKick) {
                const author = `<@${logEntry.executor.id}>`;

                const logEmbed = new EmbedBuilder()
                    .setColor("Yellow")
                    .setTitle("Utilisateur expulsé")
                    .setDescription(`${member.user.tag} (${member.user.id})`)
                    .addFields({ name: "Auteur", value: author })
                    .setTimestamp()
                    .setFooter({
                        text: "Magearna",
                        iconURL: member.client.user.displayAvatarURL(),
                    });

                const logChannel = member.client.channels.cache.get(
                    process.env.LOGCHANNEL
                );
                await logChannel.send({ embeds: [logEmbed] });
            }

            const logEmbed = new EmbedBuilder()
                .setAuthor({
                    name: member.user.tag,
                    iconURL: member.user.displayAvatarURL(),
                })
                .setColor("Red")
                .setFooter({
                    text: "Magearna",
                    iconURL: member.client.user.displayAvatarURL(),
                })
                .setTimestamp()
                .addFields(
                    { name: "Nom", value: `<@${member.user.id}>` },
                    {
                        name: "Créé",
                        value:
                            time(
                                Math.round(member.user.createdTimestamp / 1000),
                                TimestampStyles.RelativeTime
                            ) +
                            " / " +
                            time(
                                Math.round(member.user.createdTimestamp / 1000)
                            ),
                    },
                    {
                        name: "Rejoint",
                        value:
                            time(
                                Math.round(member.joinedTimestamp / 1000),
                                TimestampStyles.RelativeTime
                            ) +
                            " / " +
                            time(Math.round(member.joinedTimestamp / 1000)),
                    }
                )
                .setTitle("❌ Nouveau départ");

            const logChannel = member.client.channels.cache.get(
                process.env.LOGCHANNEL
            );
            logChannel.send({ embeds: [logEmbed] });
        } catch (error) {
            console.error("Erreur dans l'événement GuildMemberRemove :", error);
        }
    },
};
