const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const axios = require("axios");
const config = require("../../config.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("shiny")
        .setDescription("Obtenez une image d'un Pokémon sous sa forme shiny.")
        .addStringOption((option) =>
            option
                .setName("pokemon")
                .setDescription("Nom anglais ou numéro du Pokémon shiny")
                .setRequired(true)
                .setMinLength(1)
                .setMaxLength(30)
        ),
    async execute(interaction, client) {
        const pokemonName = interaction.options.getString("pokemon").toLowerCase();

        try {
            const response = await axios.get(
                `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
            );
            const pokemonData = response.data;

            // Deuxième requête : informations spécifiques (espèce) pour traductions
            const speciesResponse = await axios.get(
                `https://pokeapi.co/api/v2/pokemon-species/${pokemonData.id}`
            );
            const speciesData = speciesResponse.data;

            // Trouver le nom et la description en français
            const frenchName = speciesData.names.find(
                (entry) => entry.language.name === "fr"
            )?.name;
            const frenchDescription = speciesData.flavor_text_entries
                .find(
                    (entry) =>
                        entry.language.name === "fr" &&
                        entry.version.name === "x"
                )
                ?.flavor_text.replace(/\n/g, " ")
                .replace(/\f/g, " ");

            const shinyImage = pokemonData.sprites.other.home.front_shiny;

            const embed = new EmbedBuilder()
                .setTitle(`${frenchName || pokemonData.name} Shiny`)
                .setImage(shinyImage)
                .setColor("Gold")
                .setFooter({
                    text: `${config.name} ${config.version}`,
                    iconURL: client.user.displayAvatarURL(),
                })
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error(error);
            await interaction.reply(
                `Désolé, je n'ai pas trouvé ce Pokémon. Vérifie son nom anglais et réessaie.`
            );
        }
    },
};
