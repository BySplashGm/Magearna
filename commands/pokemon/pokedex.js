const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const axios = require("axios");
const config = require("../../config.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("pokedex")
        .setDescription("Obtenir les informations d'un Pokémon")
        .addStringOption((option) =>
            option
                .setName("pokemon")
                .setDescription("Nom en anglais ou numéro du Pokémon")
                .setRequired(true)
                .setMinLength(1)
                .setMaxLength(30)
        ),
    async execute(interaction, client) {
        const pokemonName = interaction.options.getString("pokemon");
        const typeTranslations = {
            normal: "Normal ⚪",
            fire: "Feu 🔥",
            water: "Eau 💧",
            electric: "Électrik ⚡",
            grass: "Plante 🍃",
            ice: "Glace ❄️",
            fighting: "Combat ✊",
            poison: "Poison ☠️",
            ground: "Sol 🌍",
            flying: "Vol 🌬️",
            psychic: "Psy 🔮",
            bug: "Insecte 🐛",
            rock: "Roche 🪨",
            ghost: "Spectre 👻",
            dragon: "Dragon 🐉",
            dark: "Ténèbres 🌑",
            steel: "Acier ⚙️",
            fairy: "Fée ✨",
        };

        const typeColors = {
            normal: "#A8A77A",
            fire: "#EE8130",
            water: "#6390F0",
            electric: "#F7D02C",
            grass: "#7AC74C",
            ice: "#96D9D6",
            fighting: "#C22E28",
            poison: "#A33EA1",
            ground: "#E2BF65",
            flying: "#A98FF3",
            psychic: "#F95587",
            bug: "#A6B91A",
            rock: "#B6A136",
            ghost: "#735797",
            dragon: "#6F35FC",
            dark: "#705746",
            steel: "#B7B7CE",
            fairy: "#D685AD",
        };

        const statEmojis = {
            hp: "🟩",
            attack: "🟨",
            defense: "🟧",
            "special-attack": "🟦",
            "special-defense": "🟪",
            speed: "🟥",
        };

        function generateStatBar(statValue, emoji) {
            const barLength = Math.floor(statValue / 10); // 1 carré par tranche de 10
            return emoji.repeat(barLength); // Répète l'émoji autant de fois que nécessaire
        }

        try {
            // Première requête : informations générales sur le Pokémon
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

            const firstType = pokemonData.types[0].type.name;
            const embedColor = typeColors[firstType] || "#FFFFFF";

            const embed = new EmbedBuilder()
                .setTitle(`Informations sur ${frenchName || pokemonData.name}`)
                .setDescription(
                    frenchDescription ||
                        "Pas de description disponible en français."
                )
                .addFields(
                    {
                        name: "Type(s)",
                        value: pokemonData.types
                            .map(
                                (type) =>
                                    typeTranslations[type.type.name] ||
                                    type.type.name
                            )
                            .join(", "),
                        inline: false,
                    },
                    {
                        name: "Numéro",
                        value: `#${pokemonData.id}`,
                        inline: true,
                    },
                    {
                        name: "Taille",
                        value: `${pokemonData.height / 10} m`,
                        inline: true,
                    },
                    {
                        name: "Poids",
                        value: `${pokemonData.weight / 10} kg`,
                        inline: true,
                    },
                    {
                        name: "Statistiques",
                        value: `
                        ${generateStatBar(
                            pokemonData.stats[0].base_stat,
                            statEmojis.hp
                        )} PV: ${
                            pokemonData.stats[0].base_stat
                        }\n${generateStatBar(
                            pokemonData.stats[1].base_stat,
                            statEmojis.attack
                        )} Attaque: ${
                            pokemonData.stats[1].base_stat
                        }\n${generateStatBar(
                            pokemonData.stats[2].base_stat,
                            statEmojis.defense
                        )} Défense: ${
                            pokemonData.stats[2].base_stat
                        }\n${generateStatBar(
                            pokemonData.stats[3].base_stat,
                            statEmojis["special-attack"]
                        )} Attaque Spé.: ${
                            pokemonData.stats[3].base_stat
                        }\n${generateStatBar(
                            pokemonData.stats[4].base_stat,
                            statEmojis["special-defense"]
                        )} Défense Spé.: ${
                            pokemonData.stats[4].base_stat
                        }\n${generateStatBar(
                            pokemonData.stats[5].base_stat,
                            statEmojis.speed
                        )} Vitesse: ${pokemonData.stats[5].base_stat}
                        `,
                    },
                    {
                        name: "Page vers Poképédia",
                        value: `[Cliquez ici pour la page Poképédia](https://www.pokepedia.fr/${frenchName})`,
                        inline: true,
                    },
                    {
                        name: "Taux de capture",
                        value: `${speciesData.capture_rate}`,
                        inline: true,
                    }
                )
                .setThumbnail(pokemonData.sprites.other.home.front_default)
                .setColor(embedColor)
                .setFooter({
                    text: config.name + " " + config.version,
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
