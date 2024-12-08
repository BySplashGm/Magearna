const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const config = require("../../config");

module.exports = {
    category: "Pokémon",
    permissions: [],
    ownerOnly: false,
    usage: "/type <type> [type2]",
    data: new SlashCommandBuilder()
        .setName("type")
        .setDescription("Obtenez les résistances et faiblesses d'un type.")
        .addStringOption((option) =>
            option
                .setName("type")
                .setDescription("Type du Pokémon")
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("type2")
                .setDescription("Second type du Pokémon")
                .setRequired(false)
        ),
    async execute(interaction) {
        const type1 = interaction.options.getString("type").toLowerCase();
        const type2 = interaction.options.getString("type2")?.toLowerCase();

        const TYPE_CHART = {
            normal: {
                weaknesses: ["combat"],
                resistances: [],
                immunities: ["spectre"],
            },
            feu: {
                weaknesses: ["eau", "roche", "sol"],
                resistances: [
                    "insecte",
                    "feu",
                    "plante",
                    "glace",
                    "acier",
                    "fée",
                ],
                immunities: [],
            },
            eau: {
                weaknesses: ["électrik", "plante"],
                resistances: ["feu", "eau", "glace", "acier"],
                immunities: [],
            },
            electrik: {
                weaknesses: ["sol"],
                resistances: ["électrik", "vol", "acier"],
                immunities: [],
            },
            plante: {
                weaknesses: ["feu", "glace", "poison", "vol", "insecte"],
                resistances: ["eau", "électrik", "plante", "sol"],
                immunities: [],
            },
            glace: {
                weaknesses: ["feu", "combat", "roche", "acier"],
                resistances: ["glace"],
                immunities: [],
            },
            combat: {
                weaknesses: ["vol", "psy", "fée"],
                resistances: ["insecte", "roche", "ténèbres"],
                immunities: [],
            },
            poison: {
                weaknesses: ["sol", "psy"],
                resistances: ["plante", "combat", "poison", "insecte", "fée"],
                immunities: [],
            },
            sol: {
                weaknesses: ["eau", "plante", "glace"],
                resistances: ["poison", "roche"],
                immunities: ["électrik"],
            },
            vol: {
                weaknesses: ["électrik", "glace", "roche"],
                resistances: ["plante", "combat", "insecte"],
                immunities: ["sol"],
            },
            psy: {
                weaknesses: ["insecte", "spectre", "ténèbres"],
                resistances: ["combat", "psy"],
                immunities: [],
            },
            insecte: {
                weaknesses: ["feu", "vol", "roche"],
                resistances: ["plante", "combat", "sol"],
                immunities: [],
            },
            roche: {
                weaknesses: ["eau", "plante", "combat", "sol", "acier"],
                resistances: ["normal", "feu", "poison", "vol"],
                immunities: [],
            },
            spectre: {
                weaknesses: ["spectre", "ténèbres"],
                resistances: ["poison", "insecte"],
                immunities: ["normal", "combat"],
            },
            dragon: {
                weaknesses: ["glace", "dragon", "fée"],
                resistances: ["feu", "eau", "électrik", "plante"],
                immunities: [],
            },
            tenebres: {
                weaknesses: ["combat", "insecte", "fée"],
                resistances: ["spectre", "ténèbres"],
                immunities: ["psy"],
            },
            acier: {
                weaknesses: ["feu", "combat", "sol"],
                resistances: [
                    "normal",
                    "plante",
                    "glace",
                    "vol",
                    "psy",
                    "insecte",
                    "roche",
                    "dragon",
                    "acier",
                    "fée",
                ],
                immunities: ["poison"],
            },
            fee: {
                weaknesses: ["poison", "acier"],
                resistances: ["combat", "insecte", "ténèbres"],
                immunities: ["dragon"],
            },
        };

        const types = [type1, type2].filter(Boolean);
        const invalidTypes = types.filter((type) => !TYPE_CHART[type]);

        if (invalidTypes.length > 0) {
            return interaction.reply({
                content: `Type(s) invalide(s) : ${invalidTypes.join(", ")}`,
                ephemeral: true,
            });
        }

        const typeData1 = TYPE_CHART[type1];
        const typeData2 = type2
            ? TYPE_CHART[type2]
            : { weaknesses: [], resistances: [], immunities: [] };

        // Rassembler les faiblesses, résistances et immunités
        const combinedWeaknesses = new Set([
            ...typeData1.weaknesses,
            ...typeData2.weaknesses,
        ]);
        const combinedResistances = new Set([
            ...typeData1.resistances,
            ...typeData2.resistances,
        ]);
        const combinedImmunities = new Set([
            ...typeData1.immunities,
            ...typeData2.immunities,
        ]);

        // Calcul des faiblesses critiques (x4) et normales (x2)
        const criticalWeaknesses = [...combinedWeaknesses].filter(
            (weakness) =>
                typeData1.weaknesses.includes(weakness) &&
                typeData2.weaknesses.includes(weakness)
        );
        const normalWeaknesses = [...combinedWeaknesses].filter(
            (weakness) =>
                !criticalWeaknesses.includes(weakness) &&
                (typeData1.weaknesses.includes(weakness) ||
                    typeData2.weaknesses.includes(weakness))
        );

        // Exclure les faiblesses compensées par une résistance ou une immunité
        const finalWeaknesses = normalWeaknesses.filter((weakness) => {
            if (
                typeData1.resistances.includes(weakness) ||
                typeData2.resistances.includes(weakness)
            ) {
                return false; // Cette faiblesse est compensée par une résistance
            }
            if (
                typeData1.immunities.includes(weakness) ||
                typeData2.immunities.includes(weakness)
            ) {
                return false; // Cette faiblesse est compensée par une immunité
            }
            return true; // Garder cette faiblesse
        });

        // Calcul des résistances fortes (x0.25) et normales (x0.5)
        const strongResistances = [...combinedResistances].filter(
            (resistance) =>
                typeData1.resistances.includes(resistance) &&
                typeData2.resistances.includes(resistance)
        );
        let normalResistances = [...combinedResistances].filter(
            (resistance) =>
                !strongResistances.includes(resistance) &&
                (typeData1.resistances.includes(resistance) ||
                    typeData2.resistances.includes(resistance))
        );

        // Exclure les résistances qui sont aussi des faiblesses
        normalResistances = normalResistances.filter(
            (resistance) => !combinedWeaknesses.has(resistance)
        );

        // Immunités (x0)
        const immunities = [...combinedImmunities].filter(
            (immunity) =>
                !typeData1.weaknesses.includes(immunity) &&
                !typeData2.weaknesses.includes(immunity)
        );

        const embed = new EmbedBuilder()
            .setTitle(
                `Sensibilités ${
                    type2 != null
                        ? "des types " + types.join(" et ")
                        : "du type " + type1
                }`
            )
            .setColor(config.color)
            .setFooter({
                text: config.name + " " + config.version,
                iconURL: interaction.client.user.displayAvatarURL(),
            })
            .setTimestamp()
            .setFields(
                {
                    name: "💀 Faiblesses critiques (x4)",
                    value:
                        criticalWeaknesses.length > 0
                            ? criticalWeaknesses.join(", ")
                            : "Aucune",
                },
                {
                    name: "🤕 Faiblesses (x2)",
                    value:
                        finalWeaknesses.length > 0
                            ? finalWeaknesses.join(", ")
                            : "Aucune",
                },
                {
                    name: "🛡️ Résistances fortes (x0.25)",
                    value:
                        strongResistances.length > 0
                            ? strongResistances.join(", ")
                            : "Aucune",
                },
                {
                    name: "🥱 Résistances (x0.5)",
                    value:
                        normalResistances.length > 0
                            ? normalResistances.join(", ")
                            : "Aucune",
                },
                {
                    name: "📛 Immunités (x0)",
                    value:
                        immunities.length > 0
                            ? immunities.join(", ")
                            : "Aucune",
                }
            );

        await interaction.reply({ embeds: [embed] });
    },
};
