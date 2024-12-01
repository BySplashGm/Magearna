const { Events, MessageFlags } = require("discord.js");
const config = require("../config");

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
