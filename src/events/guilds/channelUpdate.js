const { Events, EmbedBuilder } = require('discord.js');
const { channel_logs, color_basic } = require(process.env.CONSTANT);


module.exports = {
    name: Events.ChannelUpdate,
    async execute(oldChannel, newChannel){

        /**
         * Logs the event
         */
        const logChannel = await newChannel.guild.channels.fetch(channel_logs);
        if (!logChannel) return;
        const oldPermissions = oldChannel.permissions;
        const newPermissions = newChannel.permissions;
        
        if (oldChannel.rawPosition !== newChannel.rawPosition) return; // A replacer plus tard
        
        if (newChannel.type === 0) {
            const embedTextuel = new EmbedBuilder()
                .setTitle(`Modification d'un salon textuel`)
                .setColor(color_basic)
                .setDescription(`**Le salon ${newChannel} a été modifié**.
                ${oldChannel.name !== newChannel.name ? `> **Nom :** \`${oldChannel.name}\` => \`${newChannel.name}\`\n` : ``}
                `)
                .setTimestamp()
                .setFooter({ text: newChannel.guild.name, iconURL: newChannel.guild.iconURL() })
                
            logChannel.send({ embeds: [embedTextuel] });
        } else if (newChannel.type === 2) {
            const embedVoice = new EmbedBuilder()
                .setTitle(`Modification d'un salon vocal`)
                .setColor(color_basic)
                .setDescription(`**Le vocal ${newChannel} a été modifié**.
                ${oldChannel.name !== newChannel.name ? `> **Nom :** \`${oldChannel.name}\` => \`${newChannel.name}\`\n` : ``}
                `)
                .setTimestamp()
                .setFooter({ text: newChannel.guild.name, iconURL: newChannel.guild.iconURL() })

            logChannel.send({ embeds: [embedVoice] });
        } else if (newChannel.type === 4) {
            const embedCategorie = new EmbedBuilder()
                .setTitle(`Modification d'une catégorie`)
                .setColor(color_basic)
                .setDescription(`**La catégorie \`${newChannel.name}\` a été modifié**.
                ${oldChannel.name !== newChannel.name ? `> **Nom :** \`${oldChannel.name}\` => \`${newChannel.name}\`\n` : ``}
                `)
                .setTimestamp()
                .setFooter({ text: newChannel.guild.name, iconURL: newChannel.guild.iconURL() })

            logChannel.send({ embeds: [embedCategorie] });
        } else if (newChannel.type === 5) {
            const embedNews = new EmbedBuilder()
                .setTitle(`Modification du salon annonce`)
                .setColor(color_basic)
                .setDescription(`**Le salon ${newChannel} a été modifié**.
                ${oldChannel.name !== newChannel.name ? `> **Nom :** \`${oldChannel.name}\` => \`${newChannel.name}\`\n` : ``}
                `)
                .setTimestamp()
                .setFooter({ text: newChannel.guild.name, iconURL: newChannel.guild.iconURL() })

            logChannel.send({ embeds: [embedNews] });
        } else if (newChannel.type === 13) {
            const embedStage = new EmbedBuilder()
                .setTitle(`Modification du salon stage`)
                .setColor(color_basic)
                .setDescription(`**Le vocal ${newChannel} a été modifié**.
                ${oldChannel.name !== newChannel.name ? `> **Nom :** \`${oldChannel.name}\` => \`${newChannel.name}\`\n` : ``}
                `)
                .setTimestamp()
                .setFooter({ text: newChannel.guild.name, iconURL: newChannel.guild.iconURL() })

            logChannel.send({ embeds: [embedStage] });
        }
    } 
};