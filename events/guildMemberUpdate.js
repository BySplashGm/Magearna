const { Events, EmbedBuilder, AuditLogEvent } = require("discord.js");

module.exports = {
    name: Events.GuildMemberUpdate,
    async execute(oldMember, newMember) {
        try {
            if (
                oldMember.communicationDisabledUntilTimestamp !==
                newMember.communicationDisabledUntilTimestamp
            ) {
                const guild = newMember.guild;
                const auditLogs = await guild.fetchAuditLogs({
                    limit: 1,
                    type: AuditLogEvent.MemberUpdate,
                });
                const logEntry = auditLogs.entries.first();
                const author = logEntry
                    ? `<@${logEntry.executor.id}>`
                    : "Inconnu";

                const logEmbed = new EmbedBuilder()
                    .setColor("Yellow")
                    .setTitle("Utilisateur en timeout")
                    .setDescription(
                        `${newMember.user.tag} (${newMember.user.id})`
                    )
                    .addFields(
                        { name: "Auteur", value: author },
                        {
                            name: "Fin du timeout",
                            value: newMember.communicationDisabledUntil
                                ? `<t:${Math.floor(
                                      newMember.communicationDisabledUntilTimestamp /
                                          1000
                                  )}:F>`
                                : "Aucun",
                        }
                    )
                    .setTimestamp()
                    .setFooter({
                        text: "Magearna",
                        iconURL: newMember.client.user.displayAvatarURL(),
                    });

                const logChannel = newMember.client.channels.cache.get(
                    process.env.LOGCHANNEL
                );
                await logChannel.send({ embeds: [logEmbed] });
            }

            const changes = [];

            if (oldMember.nickname !== newMember.nickname) {
                changes.push({
                    name: "Pseudo",
                    value: `\`${oldMember.nickname || "Aucun"}\` → \`${
                        newMember.nickname || "Aucun"
                    }\``,
                });
            }

            const addedRoles = newMember.roles.cache.filter(
                (role) => !oldMember.roles.cache.has(role.id)
            );
            const removedRoles = oldMember.roles.cache.filter(
                (role) => !newMember.roles.cache.has(role.id)
            );

            if (addedRoles.size > 0) {
                changes.push({
                    name: "Rôles ajoutés",
                    value: addedRoles.map((role) => role.name).join(", "),
                });
            }
            if (removedRoles.size > 0) {
                changes.push({
                    name: "Rôles retirés",
                    value: removedRoles.map((role) => role.name).join(", "),
                });
            }

            if (changes.length === 0) return;

            const logEmbed = new EmbedBuilder()
                .setColor("Blue")
                .setTitle("Utilisateur modifié")
                .setDescription(
                    `<@${newMember.user.id}> (${newMember.user.tag})`
                )
                .addFields(...changes)
                .setTimestamp()
                .setFooter({
                    text: "Magearna",
                    iconURL: newMember.client.user.displayAvatarURL(),
                });

            const logChannel = newMember.client.channels.cache.get(
                process.env.LOGCHANNEL
            );
            await logChannel.send({ embeds: [logEmbed] });
        } catch (error) {
            console.error("Erreur dans l'événement GuildMemberUpdate :", error);
        }
    },
};
