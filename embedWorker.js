const dotenv = require('dotenv');
dotenv.config();
const { parentPort } = require('worker_threads');
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');

// Whales frames for ascii animation
const whale_0 = `
\`\`\`


              
              
         ___ ____     |"\/"|
       ,'        \`.    \\  /
       |  O        \\___/  |
^~^~^~^~^~^~^~^~^~^~^~^~^~^~^~^~

\`\`\`
`;

const whale_1 = `
\`\`\`


              
              
         ___:____     |"\/"|
       ,'        \`.    \\  /
       |  O        \\___/  |
^~^~^~^~^~^~^~^~^~^~^~^~^~^~^~^~

\`\`\`
`;

const whale_2 = `
\`\`\`


              
           ":"
         ___:____     |"\/"|
       ,'        \`.    \\  /
       |  O        \\___/  |
^~^~^~^~^~^~^~^~^~^~^~^~^~^~^~^~

\`\`\`
`;

const whale_3 = `
\`\`\`

             
          "":""
           ':'
         ___:____     |"\/"|
       ,'        \`.    \\  /
       |  O        \\___/  |
^~^~^~^~^~^~^~^~^~^~^~^~^~^~^~^~

\`\`\`
`;

const whale_4 = `
\`\`\`

         ."":"".     
        "   :   "
            :
         ___:____     |"\/"|
       ,'        \`.    \\  /
       |  O        \\___/  |
^~^~^~^~^~^~^~^~^~^~^~^~^~^~^~^~

\`\`\`
`;

// Blocking sleep function
function sleep(ms) {
    const start = Date.now();
    while (Date.now() - start < ms) {
        // Busy-wait loop (blocks execution)
    }
}

parentPort.on('message', async (data) => {
    const { messageId, channelId, guildId} = data;

    const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

    client.once('ready', async () => {
        console.log('Worker thread connected to Discord!');

        const guild = client.guilds.cache.get(guildId);
        if (!guild) {
            console.error('Guild not found');
            client.destroy();
            return;
        }

        const channel = guild.channels.cache.get(channelId);
        if (!channel || !channel.isTextBased()) {
            console.error('Channel not found or not a text channel.');
            client.destroy();
            return;
        }

        try {
            const targetMessage = await channel.messages.fetch(messageId);
            for (let i = 0; i < 5; i++) {

                let updatedEmbed = EmbedBuilder.from(targetMessage.embeds[0])
                    .setDescription(whale_0);
                await targetMessage.edit({ embeds: [updatedEmbed] });
                sleep(1000);  // Delay for 1000ms (1 second)

                updatedEmbed = EmbedBuilder.from(targetMessage.embeds[0])
                    .setDescription(whale_1);
                await targetMessage.edit({ embeds: [updatedEmbed] });
                sleep(1000);  // Delay for 1000ms (1 second)

                updatedEmbed = EmbedBuilder.from(targetMessage.embeds[0])
                    .setDescription(whale_2);
                await targetMessage.edit({ embeds: [updatedEmbed] });
                sleep(1000);  // Delay for 1000ms (1 second)

                updatedEmbed = EmbedBuilder.from(targetMessage.embeds[0])
                    .setDescription(whale_3);
                await targetMessage.edit({ embeds: [updatedEmbed] });
                sleep(1000);  // Delay for 1000ms (1 second)

                updatedEmbed = EmbedBuilder.from(targetMessage.embeds[0])
                    .setDescription(whale_4);
                await targetMessage.edit({ embeds: [updatedEmbed] });
                sleep(1000);  // Delay for 1000ms (1 second)
            }

            parentPort.postMessage({ status: 'done' }); // Let the parent know it can re enable the button

        } catch (err) {
            console.error('Error editing the embed:', err);
        }

        client.destroy(); // Clean up the bot instance
    });

    client.login(process.env.DISCORD_TOKEN); // Get token from environment variable
});
