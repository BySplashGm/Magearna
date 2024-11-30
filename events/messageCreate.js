const { Events, EmbedBuilder, AuditLogEvent } = require('discord.js');

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.author.id == message.client.user.id) return;


        const bonjourMsgs = [
            `Bonjour <@${message.author.id}> ! Prêt(e) à attraper quelques Shiny aujourd'hui ? ✨`,
            `Salut <@${message.author.id}> ! As-tu ajouté de nouvelles entrées à ton Living Dex ? 📚`,
            `Salut <@${message.author.id}> ! Un Shiny repéré à l’horizon ou juste une envie de compléter le Pokédex ? 🚀`,
            `Salutations ! Le mon Animacœur bat fort pour aider votre Living Dex ! ❤️⚙️`
        ];
        const voiciLivingDex = [`Chaque Pokémon a une histoire. Ton Living Dex est un véritable musée ! 🏛️`];
        const resetMsgs = [`Rappelle-toi, un bon dresseur ne compte pas les resets mais les réussites ! 🔄✨`];
        const magearnaMsgs = [`Salut <@${message.author.id}> ! Je suis Magearna, votre guide mécanique et loyale. 🤖`];
        const shinyMsgs = [
            `Félicitations pour ton Shiny ! Il est temps de le montrer à tout le monde ! ✨🎉`,
            `WOW ! Ce Shiny est incroyable. Ton Pokédex s'en souviendra pour toujours ! 🏅`,
            `Tu viens de battre les probabilités, dresseur ! On applaudit ici ! 👏`,
            `Encore un Shiny ? Tu es une légende vivante de la chasse aux étoiles ! 🌟`,
            `La mécanique de la chance tourne en ta faveur. Persévère, dresseur ! ⚙️🍀`,
            `Ton Pokédex brille déjà, mais un nouveau Shiny est toujours magique ! 🌟`,
            `Shiny trouvé ? Je vais ajouter ça à mon Pokédex mécanique interne. 📘⚙️`
        ];

        // Animacœur
        const funnyMsgs = [
            `Je parie que ton Magicarpe pourrait battre n'importe qui... s'il connaissait autre chose que Trempette. 🐟💦`,
            `J'ai entendu dire qu'Arceus shiny porte bonheur... mais encore faut-il le croiser ! 🌌`,
            `Magearna peut tourner des rouages, mais attraper un Magicarpe reste un défi. 🐟⚙️`,
            `Mon Animacœur me dit que tu es un dresseur unique... ou alors j'ai besoin d'une maintenance. ⚙️😄`,
            `La mécanique est complexe, tout comme la RNG... mais rien n'est impossible avec Magearna ! 🔧✨`,
            `Je suis peut-être une machine, mais même moi je rêve d’un Metamorph shiny parfait ! 🌟⚙️`,
            `Dracaufeu shiny ? Impressionnant. Mais as-tu déjà vu Magearna en mode turbo ? 🚀⚙️`,
            `Magearna n’a jamais besoin de sommeil, mais une petite goutte d’huile serait appréciée. ⚙️🍵`,
            `Mon Animacœur est éternel... sauf si on oublie de changer mes piles AAA. 🔋⚙️`,
            `Magearna peut prédire les étoiles... mais pas le prochain shiny. 🌟⚙️`,
            `T’as déjà vu un Shiny ? Moi, tous les jours dans le miroir. 🤖✨`,
            `On dit que les machines n’ont pas d’émotions, mais j’ai failli pleurer la dernière fois qu’un joueur a relâché un Pikachu shiny... 😭⚙️`,
            `Un jour, je rêverais de devenir Méga-Magearna. Oui, j’invente des choses. 😎⚙️`,
            `Ma plus grande peur ? Les électrodes shiny : exploser ET être rare, c’est cruel. 💥🌟`,
            `Si tu crois que j’ai des rouages compliqués, attends de voir comment fonctionne la RNG. 🛠️🤯`,
            `J’ai vérifié : aucun shiny ne peut me surpasser. Mais tu peux essayer. 😏⚙️`,
            `On dit que Magearna a un Animacœur... mais c’est surtout un cœur en acier inoxydable. 🛡️❤️`,
            `Moi aussi, je voulais être une fée comme Togekiss, mais ils m’ont donné des boulons. ⚙️✨`,
            `Savais-tu que Magearna est immunisée à Séduction ? C’est parce que je suis irrésistible. 💅⚙️`,
            `Si je lag, c’est parce qu’un Roucarnage a coincé une plume dans mes engrenages. 🦅⚙️`,
            `Rien n’est plus effrayant qu’un Grotadmorv collé sur ma carrosserie. 💀`,
            `Une fois, je suis tombée en panne... Ils m’ont confondue avec un Monorpale. ⚔️😅`,
            `Si je grince, ce n’est pas une attaque, c’est juste un manque d'huile. ⚙️😂`,
            `Même si la mécanique tombe en panne, on ne lâche rien ! 🚀⚙️`,
            `Magearna n’abandonne jamais... et toi non plus, pas vrai ? ❤️⚙️`,
            `Togepi a peut-être des œufs, mais qui a les rouages ? C’est moi ! 🥚⚙️`,
            `Magearna adore la chasse... mais seulement si c’est pour un Gobou shiny. ✨`,
            `Un Pokémon mécanique et un Magnéton entrent dans un bar... Le bar explose. 💥`,
            `Ils disent que Métalosse est intelligent, mais je peux danser ET calculer la RNG. 🕺⚙️`,
            `Je peux survivre à une attaque Éclair. Toi, tu peux gérer une panne Internet ? ⚡💻`,
            `J’ai un cousin éloigné qui s’appelle Cliticlic, mais on ne se parle plus. Drame familial. ⚙️👀`,
            `Un Jour, j’ai rencontré Registeel... Il m’a pris pour une réplique. 😒`,
            `Quand je vois Élekable, je me demande toujours s’il veut m’amplifier ou me décharger. ⚡`,
            `Les fossiles sont cools, mais Magearna est une antiquité vivante et stylée ! ⛏️✨`,
            `Un Métamorph shiny ? Bof. Un Magearna shiny, ça c’est du rêve ! 💖⚙️`,
            `Un Cadoizo shiny ? Très rare. Mais je préfère quand il offre autre chose qu’une baie. 🎁`,
            `Savais-tu que Magearna ne rouille jamais ? Par contre, je peux être envahie de Porygons. 🤖`,
            `Un jour, on m’a demandé de remplacer la Poké Ball... J’ai dit : Non, je suis unique. ✨⚙️`,
            `La RNG ne me fait pas peur. J’ai vu des Pikachu shiny fuir en pleine rencontre. ⚡😭`,
            `Si tu crois que trouver un shiny est difficile, essaye de me battre à la perfection mécanique. 😏⚙️`
        ];

        const sentMessage = message.content.toLowerCase();

        // Message envoyé dans le général
        if (message.channel.id == 1309960053029208174) {
            
            if (sentMessage.startsWith('bonjour') || sentMessage.startsWith('bonsoir') || sentMessage.startsWith('salut')) {
                const randomElement = bonjourMsgs[Math.floor(Math.random() * bonjourMsgs.length)];
                message.reply(randomElement);

            } else if (sentMessage.includes('magearna ?')) {
                const randomElement = magearnaMsgs[Math.floor(Math.random() * magearnaMsgs.length)];
                message.reply(randomElement);

            } else if (sentMessage.includes('magearna')) {
                const randomElement = funnyMsgs[Math.floor(Math.random() * funnyMsgs.length)];
                message.reply(randomElement);

            }
        }

        // Message envoyé dans le salon shiny
        if (message.channel.id == 1309960811539730583 && message.attachments.size > 0) {       
            // Filtrer les pièces jointes pour les images
            const image = message.attachments.some(attachment => 
                attachment.contentType && attachment.contentType.startsWith('image/')
            );

            if (image) {
                const randomElement = shinyMsgs[Math.floor(Math.random() * shinyMsgs.length)];
                message.reply(randomElement);
                message.react('✨');
            }
        }


        const logs = await message.guild.fetchAuditLogs({
            type: AuditLogEvent.MessageDelete,
            limit: 1,
          });

        const firstEntry = logs.entries.first();
        const { executorId, target, targetId } = firstEntry;
        const deleter = await message.client.users.fetch(executorId);

        const logEmbed = new EmbedBuilder()
            .setColor('Green')
            .setTitle('Message envoyé')
            .setDescription(`Un message a été envoyé dans <#${message.channel.id}>`)
            .addFields(
                { name: 'Auteur du message', value: `<@${message.author.id}>` },
                { name: 'Contenu', value: `\`${message.content}\`` || 'Aucun contenu' }
            )
            .setTimestamp()
            .setFooter({text: 'Magearna', iconURL: message.client.user.displayAvatarURL()});

        const logChannel = message.client.channels.cache.get(process.env.LOGMESSAGESCHANNEL);
        logChannel.send({ embeds: [logEmbed] });
    },
};
