const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");
const config = require("../../config.js");

module.exports = {
    category: 'Utils',
    permissions: [],
    ownerOnly: false,
    usage: '/help [commande]',
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Obtenir la liste des commandes")
        .addStringOption(option =>
            option.setName('commande')
                .setDescription('Nom de la commande')
        ),

    async execute(interaction, client) {
        const commands = [];
        const commandDir = path.join(__dirname, '..');

        // Parcours des commandes pour les collecter
        fs.readdirSync(commandDir).forEach(folder => {
            const commandFiles = fs.readdirSync(path.join(commandDir, folder)).filter(file => file.endsWith('.js'));

            for (const file of commandFiles) {
                const command = require(path.join(commandDir, folder, file));

                if (command.data) {
                    commands.push({
                        name: command.data.name,
                        description: command.data.description,
                        category: command.category || 'Autres',
                        permissions: command.permissions || [],
                        ownerOnly: command.ownerOnly || false,
                        usage: command.usage || `/${command.data.name}`,
                    });
                }
            }
        });

        const commandName = interaction.options.getString('commande');

        if (commandName) {
            // Cherche une commande spécifique
            const command = commands.find(cmd => cmd.name.toLowerCase() === commandName.toLowerCase());

            if (!command) {
                return interaction.reply({
                    content: `La commande \`${commandName}\` est introuvable.`,
                    ephemeral: true,
                });
            }

            // Embed pour une commande spécifique
            const embed = new EmbedBuilder()
                .setTitle(`Commande /${command.name}`)
                .setDescription(command.description || 'Aucune description disponible.')
                .addFields(
                    { name: '📁 Catégorie', value: command.category, inline: true },
                    { name: '⚙️ Permissions', value: command.permissions.length > 0 ? command.permissions.join(', ') : 'Aucune', inline: true },
                    { name: '📝 Utilisation', value: command.usage, inline: false }
                )
                .setColor(config.color)
                .setFooter({
                    text: `${config.name} ${config.version}`,
                    iconURL: client.user.displayAvatarURL(),
                })
                .setTimestamp();
            
                if(command.ownerOnly) {
                    embed.addFields({
                        name: '📛 Propriétaire', value: 'Oui'
                    })
                }

            return interaction.reply({ embeds: [embed], ephemeral: true });
        } else {
            // Embed pour la liste des commandes
            const embed = new EmbedBuilder()
                .setTitle("Liste des commandes")
                .setDescription("Voici la liste des commandes disponibles")
                .setColor(config.color)
                .setFooter({
                    text: `${config.name} ${config.version}`,
                    iconURL: client.user.displayAvatarURL(),
                })
                .setTimestamp();

            // Regroupe les commandes par catégorie
            const categories = {};
            commands.forEach(command => {
                if (!categories[command.category]) {
                    categories[command.category] = [];
                }
                categories[command.category].push(command);
            });

            // Ajoute les commandes par catégorie dans l'embed
            for (const [category, cmds] of Object.entries(categories)) {
                embed.addFields({
                    name: category,
                    value: cmds.map(cmd => `\`/${cmd.name}\`: ${cmd.description}`).join('\n'),
                });
            }

            return interaction.reply({ embeds: [embed], ephemeral: true });
        }
    },
};
