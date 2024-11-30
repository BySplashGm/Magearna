const { Events, EmbedBuilder, time, TimestampStyles } = require('discord.js');
require('dotenv').config();

module.exports = {
	name: Events.GuildMemberAdd,
	execute(member) {
		const messageEmbed = new EmbedBuilder()
            .setColor("Purple")
            .setDescription(`🎉 **Bienvenue, <@${member.user.id}> !** 🎉
            Nous sommes heureux de t’accueillir parmi nous !
            N’hésite pas à te présenter et à participer aux discussions ! Amuse-toi bien ! 😊`)
            .setFooter({text: 'Magearna', iconURL: member.client.user.displayAvatarURL()})
            .setThumbnail(member.user.displayAvatarURL())
            .setTimestamp()
            .setTitle("Nouveau membre 👋");
        
        const channel = member.client.channels.cache.get('1309918567541772332');
        channel.send({ embeds: [messageEmbed] });

        const logEmbed = new EmbedBuilder()
            .setAuthor({ name: member.user.tag, iconURL: member.user.displayAvatarURL() })
            .setColor("Green")
            .setFooter({text: 'Magearna', iconURL: member.client.user.displayAvatarURL()})
            .setTimestamp()
            .addFields(
                { name: "Nom", value: `<@${member.user.id}>` },
                { name: "Créé", value: time(Math.round(member.user.createdTimestamp / 1000), TimestampStyles.RelativeTime) + " / "  + time(Math.round(member.user.createdTimestamp / 1000)) },
                { name: "Rejoint", value: time(Math.round(member.joinedTimestamp / 1000), TimestampStyles.RelativeTime) + " / " + time(Math.round(member.joinedTimestamp / 1000)) }
            )
            .setTitle("❎ Nouveau Membre");

        const logChannel = member.client.channels.cache.get(process.env.LOGCHANNEL);
        logChannel.send({ embeds: [logEmbed] });
	},
};