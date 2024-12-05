const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const config = require("../../config.js");

module.exports = {
    category: "Admin",
    permissions: ["ADMINISTRATOR"],
    ownerOnly: false,
    usage: "/announcement <titre> <message>",
    data: new SlashCommandBuilder()
        .setName("announcement")
        .setDescription("Envoie une annonce dans le serveur.")
        .addStringOption((option) =>
            option
                .setName("titre")
                .setDescription("Titre de l'annonce")
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("message")
                .setDescription("Le message de l'annonce")
                .setRequired(true)
        ),

    async execute(interaction) {
        // Récupère le message de l'annonce
        const titreContent = interaction.options.getString("titre");
        const messageContent = interaction.options.getString("message");

        // Crée l'embed
        const announcementEmbed = new EmbedBuilder()
            .setColor(config.color)
            .setTitle(titreContent)
            .setDescription(messageContent)
            .setTimestamp()
            .setFooter({
                text:
                    "Annonce envoyée par " +
                    interaction.user.tag +
                    " | " +
                    config.name +
                    " " +
                    config.version,
                iconURL: interaction.client.user.displayAvatarURL(),
            });

        // Envoie l'embed dans le channel
        await interaction.channel.send({ embeds: [announcementEmbed] });

        // Répond à l'utilisateur pour confirmer l'envoi
        return interaction.reply({
            content: "Annonce envoyée avec succès !",
            ephemeral: true,
        });
    },
};
