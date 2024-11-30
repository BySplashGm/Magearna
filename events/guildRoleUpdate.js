const { Events, EmbedBuilder, AuditLogEvent } = require('discord.js');

module.exports = {
    name: Events.GuildRoleUpdate,
    async execute(oldRole, newRole) {
        try {
            const changes = [];
            if (oldRole.name !== newRole.name) {
                changes.push({ name: 'Nom', value: `\`${oldRole.name}\` → \`${newRole.name}\`` });
            }
            if (oldRole.hexColor !== newRole.hexColor) {
                changes.push({ name: 'Couleur', value: `\`${oldRole.hexColor}\` → \`${newRole.hexColor}\`` });
            }
            if (oldRole.permissions.bitfield !== newRole.permissions.bitfield) {
                changes.push({ name: 'Permissions', value: 'Permissions modifiées', inline: false });
            }

            if (changes.length === 0) return;

            const guild = newRole.guild;
            const auditLogs = await guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.RoleUpdate });
            const logEntry = auditLogs.entries.first();
            const author = logEntry ? `<@${logEntry.executor.id}>` : "Inconnu";

            const logEmbed = new EmbedBuilder()
                .setColor('Orange')
                .setTitle(`Rôle ${oldRole.name} mis à jour`)
                .addFields(
                    ...changes,
                    { name: 'Auteur', value: author, inline: false }
                )
                .setTimestamp()
                .setFooter({ text: 'Magearna', iconURL: newRole.client.user.displayAvatarURL() });

            const logChannel = newRole.client.channels.cache.get(process.env.LOGCHANNEL);
            await logChannel.send({ embeds: [logEmbed] });
        } catch (error) {
            console.error("Erreur dans l'événement GuildRoleUpdate :", error);
        }
    },
};
