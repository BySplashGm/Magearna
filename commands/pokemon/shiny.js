const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const axios = require("axios");
const config = require("../../config.js");
const pokedexFr = require("../../pokedexFr.json");

module.exports = {
    category: "Pokémon",
    permissions: [],
    ownerOnly: false,
    usage: "/shiny <Nom du Pokémon>",
    data: new SlashCommandBuilder()
        .setName("shiny")
        .setDescription("Obtenez une image d'un Pokémon sous sa forme shiny.")
        .addStringOption((option) =>
            option
                .setName("pokemon")
                .setDescription("Nom du Pokémon")
                .setRequired(true)
                .setMinLength(1)
                .setMaxLength(30)
        ),
    async execute(interaction, client) {
        const pokemon = interaction.options.getString("pokemon").toLowerCase();

        const pokemonName = pokedexFr[pokemon];

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
            await interaction.reply({
                content:
                    "Désolé, je n'ai pas trouvé ce Pokémon. Vérifie son nom et réessaie sans accent ou caractère spécial.",
                ephemeral: true,
            });
        }
    },
};
