const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const config = require("../../config.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Obtenir la liste des commandes"),
    async execute(interaction, client) {
        const embed = new EmbedBuilder()
            .setTitle("Liste des commandes")
            .setDescription("Voici la liste des commandes disponibles (non terminé)")
            .setColor(config.color)
            .setFooter({
                text: `${config.name} ${config.version}`,
                iconURL: client.user.displayAvatarURL(),
            })
            .addFields(
                {
                    name: "Utilitaires",
                    value: "`ping`",
                    inline: true,
                },
                {
                    name: "Pokémon",
                    value: "`pokedex`, `shiny`, `nonshiny`",
                    inline: true,
                }
            )
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
