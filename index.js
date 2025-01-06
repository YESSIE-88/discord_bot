const dotenv = require('dotenv');
dotenv.config();

const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent, // Required to read message content
    ],
});

client.login(process.env.DISCORD_TOKEN).then(() => {
    console.log('Bot logged in successfully!');
}).catch(err => {
    console.error('Error logging in:', err);
});

client.on("ready", () => {
    console.log('Bot is online and ready!');
});

// Helper function to capitalize the first letter of each word
function capitalizeWords(text) {
    return text.replace(/\b\w/g, (char) => char.toUpperCase());
}

client.on("messageCreate", async (message) => {

    if (
        message.channel.type === 0 && // Ensure it's a text channel
        !message.author.bot // Ignore bot messages
    ) {
        
        // Sign in with the sign in channel
        if (message.channel.name === '🍰﹕sign-in') {
            console.log(`Message in sign-in channel: ${message.author.tag}: ${message.content}`);
            
            try {
                const member = message.guild.members.cache.get(message.author.id);
                
                if (member) {

                    // Check if the user's nickname already contains the emoji 🧁
                    if (member.nickname?.includes('🧁') || member.displayName.includes('🧁')) {
                        console.log(`User ${message.author.tag} already signed in. Skipping further processing.`);
                    } else {
                        const words = message.content.trim().split(/\s+/);

                        if (words.length === 3) {
                            let newNickname = `${words[0]} 🧁 ${words[1]} ${words[2]}`;

                            // Automatically capitalize the first character of each word
                            newNickname = capitalizeWords(newNickname);

                            if (newNickname.length > 32) {
                                await message.reply({
                                    content: 'Nickname is too long. Please ensure your nickname is 32 characters or less. If you need additional help you can @ an admin.'
                                });
                                console.log('Nickname is too long:', newNickname);
                            } else {
                                await member.setNickname(newNickname);
                                console.log(`Changed nickname for ${message.author.tag} to "${newNickname}"`);

                                const messages = await message.channel.messages.fetch({ limit: 100 });
                                const messagesArray = Array.from(messages.values());

                                for (let i = 0; i < messagesArray.length; i++) {
                                    try {
                                        if (messagesArray[i].author.id === message.author.id && messagesArray[i - 1]?.author.bot) {
                                            await messagesArray[i].delete();
                                            console.log(`Deleted message ${i + 1}/${messagesArray.length}`);
                                            await messagesArray[i - 1].delete();
                                            console.log(`Deleted bot's message ${i}/${messagesArray.length}`);
                                        }
                                    } catch (err) {
                                        console.error(`Error reading message at index ${i}:`, err);
                                    }
                                }

                                await message.reply({
                                    content: `Thanks for signing in, ${message.author}!`
                                });

                            }
                        } else {
                            await message.reply({
                                content: 'Invalid nickname format, please enter your nickname as: "{name} {sso firstname} {sso lastname}". If you need additional help, you can @ an admin.'
                            });
                            console.log(`Message does not have exactly 3 words: "${message.content}"`);
                        }
                    }

                } else {
                    console.error('Member not found in guild.');
                }
            } catch (err) {
                console.error('Error processing sign-in:', err);
            }
        }

        // Generate a custom embed with a specific channel
        else if (message.channel.name === 'random') { // random channel used for bot commands
            // Check if the message starts with a '/'
            if (message.content.startsWith('embed/')) {
                // Generate an embed with some text that says "Welcome to the server!"
                const embed = {
                    color: 0x0099ff, // Blue color
                    title: 'Welcome to the Server!',
                    description: 'We are excited to have you here! 🎉\nFeel free to explore and join the fun.',
                    fields: [
                        { name: 'Guidelines', value: 'Please read the rules in the #rules channel.' },
                        { name: 'Getting Started', value: 'Introduce yourself in the #introductions channel!' },
                    ],
                    footer: { text: 'Enjoy your stay!' },
                };
        
                // Find the "general" channel and send the embed
                const generalChannel = message.guild.channels.cache.find(channel => channel.name === 'general');
                if (generalChannel) {
                    await generalChannel.send({ embeds: [embed] });
                    console.log('Embed sent to the general channel.');
                } else {
                    console.error('General channel not found!');
                }
            }
        }
        

    }
});

client.on('error', (err) => {
    console.error('Bot encountered an error:', err);
});
