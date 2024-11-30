const { Events, EmbedBuilder, AuditLogEvent } = require("discord.js");

module.exports = {
    name: Events.MessageDelete,
    async execute(message) {
        if (message.author.id == message.client.user.id) return;

        const logs = await message.guild.fetchAuditLogs({
            type: AuditLogEvent.MessageDelete,
            limit: 1,
        });

        const firstEntry = logs.entries.first();
        const { executorId, target, targetId } = firstEntry;
        const deleter = await message.client.users.fetch(executorId);

        const logEmbed = new EmbedBuilder()
            .setColor("Red")
            .setTitle("Message supprimé")
            .setDescription(
                `Un message a été supprimé dans <#${message.channel.id}> par <@${deleter.id}>`
            )
            .addFields(
                { name: "Auteur du message", value: `<@${message.author.id}>` },
                {
                    name: "Contenu",
                    value:
                        `\`${message.content}\`` ||
                        "Aucun contenu // ou pièces jointes",
                }
            )
            .setTimestamp()
            .setFooter({
                text: "Magearna",
                iconURL: message.client.user.displayAvatarURL(),
            });

        const logChannel = message.client.channels.cache.get(
            process.env.LOGMESSAGESCHANNEL
        );
        logChannel.send({ embeds: [logEmbed] });
    },
};
