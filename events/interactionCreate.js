const { Events, PermissionsBitField } = require("discord.js");

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isChatInputCommand()) return;

        const command = interaction.client.commands.get(
            interaction.commandName
        );

        if (!command) {
            console.error(
                `No command matching ${interaction.commandName} was found.`
            );
            return;
        }

        try {
            // Vérification des permissions utilisateur
            if (command.permissions && command.permissions.length > 0) {
                const missingPermissions = command.permissions.filter(
                    (permission) =>
                        !interaction.member.permissions.has(
                            PermissionsBitField.Flags[permission]
                        )
                );

                if (missingPermissions.length > 0) {
                    return interaction.reply({
                        content: `Vous n'avez pas les permissions nécessaires pour utiliser cette commande : ${missingPermissions.join(
                            ", "
                        )}`,
                        ephemeral: true,
                    });
                }
            }

            // Vérification des permissions du bot
            if (command.permissions && command.permissions.length > 0) {
                const botMissingPermissions = command.permissions.filter(
                    (permission) =>
                        !interaction.guild.me.permissions.has(
                            PermissionsBitField.Flags[permission]
                        )
                );

                if (botMissingPermissions.length > 0) {
                    return interaction.reply({
                        content: `Je n'ai pas les permissions nécessaires pour exécuter cette commande : ${botMissingPermissions.join(
                            ", "
                        )}`,
                        ephemeral: true,
                    });
                }
            }

            // Exécution de la commande
            await command.execute(interaction, interaction.client);
        } catch (error) {
            console.error(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({
                    content:
                        "Une erreur est survenue lors de l'exécution de cette commande.",
                    ephemeral: true,
                });
            } else {
                await interaction.reply({
                    content:
                        "Une erreur est survenue lors de l'exécution de cette commande.",
                    ephemeral: true,
                });
            }
        }
    },
};
