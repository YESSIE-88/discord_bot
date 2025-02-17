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

const { EmbedBuilder } = require('discord.js');

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

// Track bot states
let makingNewEmbed = false;
let attempEditEmbed = false;
let editingSelectedEmbed = false;
let waitingForChannel = false;
let waitingForTitle = false;
let waitingForText = false;
let waitingForColor = false;
let waitingForEditingChoice = false;
let targetChannel = null; // Store the selected channel
let targetEmbed = null; // Store the selected emebed to edit
let customTitle = ""; // Store the custom title
let customText = ""; // Store the custom text
let customColor = "#c0f7ff"; // Default color (Light Blue)

let annoying = false;

client.on("messageCreate", async (message) => {

    if (
        message.channel.type === 0 && // Ensure it's a text channel
        !message.author.bot // Ignore bot messages
    ) {

        //Bot repeating everthing to be annoying :D
        if (message.channel.name !== 'random' && annoying) {
            await message.reply(message.content)
        }
        
        //Sign in with the sign in channel
        else if (message.channel.name === '🍰﹕sign-in') {
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

        // This channel will be used for bot commands
        else if (message.channel.name === 'random') {

            if (message.content === 'help' || message.content === 'Help') {
                await message.reply('The commands you can use are:\nbot_be_annoying (makes the bot repeat everything everyone says)\nbot_stop_annoying (makes the bot stop repeating everything)\nbot_make_embed (create an embed)\nbot_cancel_make_embed (discard embed creation)\nbot_edit_embed (edit an already existing embed)\nbot_cancel_edit_embed (discard editing an embed)')
            }

            else if (message.content === 'bot_be_annoying'){
                annoying = true;
                await message.reply('I am going to be so annoying');
            }

            else if (message.content ==='bot_stop_annoying'){
                annoying = false;
                await message.reply('Okay Ill stop');
            }

            // Command to start embed creation
            else if (message.content ==='bot_make_embed') {
                if (makingNewEmbed) {
                    await message.reply('I am already in the process of creating an embed. Please complete or cancel it.');
                } 
                
                else if (attempEditEmbed || editingSelectedEmbed) {
                    await message.reply('I am alreay in the process of editing an embed. Please complete or cancel it.');
                }

                else {
                    waitingForChannel = true;
                    makingNewEmbed = true;
                    await message.reply('In which channel would you like to generate the embed?');
                }
            }

            // Command to cancel embed creation
            else if (message.content === 'bot_cancel_make_embed') {
                if (makingNewEmbed) {
                    waitingForChannel = false;
                    waitingForTitle = false;
                    waitingForText = false;
                    waitingForColor = false;
                    targetChannel = null;
                    customTitle = "";
                    customText = "";
                    customColor = "#c0f7ff"; // Reset to default color
                    makingNewEmbed = false;
                    await message.reply('Canceled making the embed.');
                } else {
                    await message.reply('There is no embed creation process to cancel.');
                }
            }

            // Command to edit an existing embed
            else if (message.content === 'bot_edit_embed') {
                if (makingNewEmbed) {
                    await message.reply('I am already in the process of creating an embed. Please complete or cancel it.');
                } 
                
                else if (attempEditEmbed || editingSelectedEmbed) {
                    await message.reply('I am alreay in the process of editing an embed. Please complete or cancel it.');
                }
                
                else {
                    waitingForChannel = true;
                    attempEditEmbed = true;
                    await message.reply('In which channel is the embed you would like to edit?');
                }
            }

            // Command to cancel embed editing
            else if (message.content === 'bot_cancel_edit_embed') {
                if (attempEditEmbed || editingSelectedEmbed) {
                    waitingForChannel = false;
                    waitingForTitle = false;
                    waitingForText = false;
                    waitingForColor = false;
                    targetChannel = null;
                    customTitle = "";
                    customText = "";
                    customColor = "#c0f7ff"; // Reset to default color
                    attempEditEmbed = false;
                    editingSelectedEmbed = false;
                    await message.reply('Canceled editing the embed.');
                } else {
                    await message.reply('There is no embed editing process to cancel.');
                }
            }

            // Handle channel response when waiting for channel input
            else if (waitingForChannel) {
                const targetChannelName = message.content.trim();
                targetChannel = message.guild.channels.cache.find(channel => channel.name === targetChannelName);

                if (targetChannel && targetChannel.isTextBased()) {
                    waitingForChannel = false;
                    waitingForTitle = true; // Move to the next step
                    if (makingNewEmbed) {
                        await message.reply(`Channel "${targetChannelName}" selected. What title would you like for the embed?`);
                    } else if (attempEditEmbed) {
                        await message.reply(`Channel "${targetChannelName}" selected. What is the title of the embed you would like to edit?`);
                    }
                } else {
                    await message.reply(`Channel "${targetChannelName}" not found or is not a text channel. Please try again.`);
                }
            }

            // Handle title response when waiting for title input
            else if (waitingForTitle) {
                customTitle = message.content.trim();
                
                if (makingNewEmbed) {
                    waitingForTitle = false; // Reset title state
                    waitingForText = true; // Move to the next step
                    await message.reply(`Title saved. What body text would you like for the embed?`);
                } 
                
                else if (attempEditEmbed) {
                    // Check embed exists
                    try {
                        let searchMessages = await targetChannel.messages.fetch({ limit: 100 }); // Fetch last 100 messages
                        for (let searchMessage of searchMessages.values()) {
                            if (searchMessage.embeds.length > 0) {
                                for (let embed of searchMessage.embeds) {
                                    if (embed.title === customTitle) {
                                        targetEmbed = searchMessage; // Save the embed object to edit it.
                                        waitingForTitle = false;
                                        waitingForEditingChoice = true;
                                        await message.reply('Embed located. What part of the embed would you like to change?\nTitle: 1\nText: 2\nColour: 3');
                                    }
                                }
                            }
                        }
                    } catch (error) {
                        console.error("Error fetching messages:", error);
                    }
                }

                else if (editingSelectedEmbed){
                    const oldEmbed = targetEmbed.embeds[0];

                    const updatedEmbed = EmbedBuilder.from(oldEmbed).setTitle(customTitle);

                    await targetEmbed.edit({ embeds: [updatedEmbed] });

                    editingSelectedEmbed = false;
                    waitingForTitle = false;
                }
            }

            // Handle text response when waiting for text input
            else if (waitingForText) {
                customText = message.content.trim();
                if (makingNewEmbed){
                    waitingForText = false; // Reset text state
                    waitingForColor = true; // Move to the next step
                    await message.reply(`Text saved. Please provide a color code for the embed in the format "#RRGGBB". For example: "#c0f7ff".`);
                } 
                
                else if(editingSelectedEmbed) {
                    const oldEmbed = targetEmbed.embeds[0];

                    const updatedEmbed = EmbedBuilder.from(oldEmbed).setDescription(customText);

                    await targetEmbed.edit({ embeds: [updatedEmbed] });

                    editingSelectedEmbed = false;
                    waitingForText = false;   
                }
            }

            // Handle color response when waiting for color input
            else if (waitingForColor) {
                const colorInput = message.content.trim();
                const colorRegex = /^#[0-9A-Fa-f]{6}$/;

                if (colorRegex.test(colorInput)) {
                    customColor = colorInput; // Store the valid hex color
                    waitingForColor = false; // Reset color state

                    if (makingNewEmbed){
                        const embed = {
                        color: parseInt(customColor.slice(1), 16), // Convert the hex color to an integer
                        title: customTitle, // Use the custom title
                        description: customText, // Use the custom text
                    };

                    // Send the embed to the specified channel
                    try {
                        await targetChannel.send({ embeds: [embed] });
                        console.log(`Embed sent to the "${targetChannel.name}" channel with title: "${customTitle}", text: "${customText}", and color: "${customColor}".`);
                        await message.reply(`Embed successfully sent to the "${targetChannel.name}" channel with the title: "${customTitle}", text: "${customText}", and color: "${customColor}".`);
                    } catch (err) {
                        console.error(`Error sending embed to the "${targetChannel.name}" channel:`, err);
                        await message.reply('There was an error sending the embed. Please try again later.');
                    }

                    // Reset all states
                    targetChannel = null;
                    customTitle = "";
                    customText = "";
                    customColor = "#c0f7ff"; // Reset to default color
                    makingNewEmbed = false;
                    } 
                    
                    else if (editingSelectedEmbed){

                        const oldEmbed = targetEmbed.embeds[0];

                        const updatedEmbed = EmbedBuilder.from(oldEmbed).setColor(customColor);

                        await targetEmbed.edit({ embeds: [updatedEmbed] });

                        editingSelectedEmbed = false;
                        waitingForColor = false;
                    }
                    
                } else {
                    await message.reply('Invalid color code. Please provide a valid hex code in the format "#RRGGBB". For example: "#c0f7ff".');
                }
            }

            else if (waitingForEditingChoice){
                if (message.content === '1') {
                    await message.reply('Please enter the new title');
                    attempEditEmbed = false;
                    editingSelectedEmbed = true;
                    waitingForTitle = true;
                } 
                
                else if (message.content === '2'){
                    await message.reply('Please enter new text');
                    attempEditEmbed = false;
                    editingSelectedEmbed = true;
                    waitingForText = true;
                }
                
                else if (message.content === '3'){
                    await message.reply('Please enter new colour');
                    attempEditEmbed = false;
                    editingSelectedEmbed = true;
                    waitingForColor = true;
                }
                
                else {
                    await message.reply('That is not a valid choice');             
                }
            }
        }

        // Copy messages over from the abscences anouncement channel to the logging channel
        else if (message.channel.name === '₊˚🌼ෆabsences') {
            // Get the sender's display name or username
            const senderName = message.member ? message.member.displayName : message.author.username;
            
            // Get the message content
            const messageContent = message.content;
        
            // Find the target channel named 'absence-logs'
            const logChannel = message.guild.channels.cache.find(channel => channel.name === 'absence-logs');
        
            if (logChannel && logChannel.isTextBased()) {
                // Send the formatted message to 'absence-logs'
                await logChannel.send(`**Absence Notice**\n📌 **From:** ${senderName}\n📝 **Message:** ${messageContent}`);
                console.log(`Logged absence message from ${senderName} to 'absence-logs'`);
            } else {
                console.error('Error: Could not find the "absence-logs" channel.');
            }
        }

    }
});

client.on('error', (err) => {
    console.error('Bot encountered an error:', err);
});
