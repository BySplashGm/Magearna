const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const axios = require("axios");
const config = require("../../config.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Informations sur l'uptime de Magearna"),
    async execute(interaction, client) {

        const apiPing =  Date.now() - interaction.createdTimestamp;
        
        const uptime = Math.round((Date.now() - client.uptime) / 1000);

        const embed = new EmbedBuilder()
            .setTitle("Ping")
            .setDescription("Pong!")
            .setColor(config.color)
            .setFooter({
                text: `${config.name} ${config.version}`,
                iconURL: client.user.displayAvatarURL(),
            })
            .addFields(
                { name: "API", value: `\`${apiPing}ms\``, inline: true },
                { name: "Uptime", value: `<t:${uptime}:R>`, inline: true }
            )
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
