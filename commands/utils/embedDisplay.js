const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("embeddisplay")
        .setDescription(
            "Renvoie un embed afin de voir l'emplacement des champs"
        ),
    async execute(interaction, client) {
        const messageEmbed = new EmbedBuilder()
            .setAuthor({
                name: client.user.username,
                iconURL: client.user.displayAvatarURL(),
            })
            .setColor("Red")
            .setDescription("Description Field")
            .setFooter({
                text: "Magearna",
                iconURL: message.client.user.displayAvatarURL(),
            })
            .setImage(client.user.displayAvatarURL())
            .setThumbnail(client.user.displayAvatarURL())
            .setTimestamp()
            .setTitle("Title Field")
            .addFields(
                { name: "Field 1", value: "Value 1" },
                { name: "Field 2", value: "Value 2" }
            );

        await interaction.reply({ embeds: [messageEmbed] });
    },
};
