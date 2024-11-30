const { Events, EmbedBuilder, AuditLogEvent } = require('discord.js');

module.exports = {
    name: Events.MessageUpdate,
    async execute(oldMessage, newMessage) {
        if (oldMessage.author.id == oldMessage.client.user.id) return;

        const logs = await oldMessage.guild.fetchAuditLogs({
            type: AuditLogEvent.MessageDelete,
            limit: 1,
          });

        const firstEntry = logs.entries.first();
        const { executorId, target, targetId } = firstEntry;
        const deleter = await oldMessage.client.users.fetch(executorId);

        const logEmbed = new EmbedBuilder()
            .setColor('Orange')
            .setTitle('Message modifié')
            .setDescription(`Un message a été modifié dans <#${oldMessage.channel.id}>`)
            .addFields(
                { name: 'Auteur du message', value: `<@${oldMessage.author.id}>` },
                { name: 'Contenu', value: (oldMessage.content || 'Aucun contenu // ou pièces jointes') + "→" + (newMessage.content || 'Aucun contenu // ou pièces jointes')}
            )
            .setTimestamp()
            .setFooter({text: 'Magearna', iconURL: oldMessage.client.user.displayAvatarURL()});

        const logChannel = oldMessage.client.channels.cache.get(process.env.LOGMESSAGESCHANNEL);
        logChannel.send({ embeds: [logEmbed] });
    },
};