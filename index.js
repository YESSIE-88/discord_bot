const dotenv = require('dotenv');
dotenv.config();

const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { Worker } = require('worker_threads');

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

// Track bot states
let testing = false; // Indicate if we are testing the bot (changes output channels)

let makingNewEmbed = false;
let attempEditEmbed = false;
let editingSelectedEmbed = false;
let makingNewEventPoll = false;
let waitingForChannel = false;
let waitingForTitle = false;
let waitingForText = false;
let waitingForTime = false;
let waitingForColor = false;
let waitingForEditingChoice = false;
let targetChannel = null; // Store the selected channel
let targetEmbed = null; // Store the selected emebed to edit
let customTitle = ""; // Store the custom title
let customText = ""; // Store the custom text
let customColor = "#c0f7ff"; // Default color (Light Blue)
let whaleEmbedMessageId = null; // Variable to store the message ID (for the ascii animation)
let catEmbedMessageId = null; // Variable to store the message ID (for the ascii animation)
let whale_button_pressed = false; // Boolean to track the whale button state
let cat_button_pressed = false; // Boolean to track the cat button state
let editing_channel_path = false;
let selected_channel_index = null;


let abscences_channel_name = '₊˚🌼ෆabsences';
let general_channel_name = '◜general🪻';
let testing_channel_name = 'botbotbot1';
let event_poll_channel_name = '₊˚🌼ෆevent-polls';

const channels = testing
  ? {
      welcome: 'welcome',
      interview: 'general_bt_voice',
      signIn: 'general_bt_text'
    }
  : {
      welcome: '◜🌸₊welcome',
      interview: '🌙﹕interview-chat',
      signIn: '🌟﹕sign-in'
    };

let welcome_channel_name   = channels.welcome;
let interview_channel_name = channels.interview;
let sign_in_channel_name   = channels.signIn;




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
        // else if (message.channel.name === sign_in_channel_name) {
        //     console.log(`Message in sign-in channel: ${message.author.tag}: ${message.content}`);
            
        //     try {
        //         const member = message.guild.members.cache.get(message.author.id);
                
        //         if (member) {

        //             // Check if the user's nickname already contains the emoji 🧁
        //             if (member.nickname?.includes('🧁') || member.displayName.includes('🧁')) {
        //                 console.log(`User ${message.author.tag} already signed in. Skipping further processing.`);
        //             } else {
        //                 const words = message.content.trim().split(/\s+/);

        //                 if (words.length === 3) {
        //                     let newNickname = `${words[0]} 🧁 ${words[1]} ${words[2]}`;

        //                     // Automatically capitalize the first character of each word
        //                     newNickname = capitalizeWords(newNickname);

        //                     if (newNickname.length > 32) {
        //                         await message.reply({
        //                             content: 'Nickname is too long. Please ensure your nickname is 32 characters or less. If you need additional help you can @ an admin.'
        //                         });
        //                         console.log('Nickname is too long:', newNickname);
        //                     } else {
        //                         await member.setNickname(newNickname);
        //                         console.log(`Changed nickname for ${message.author.tag} to "${newNickname}"`);

        //                         const messages = await message.channel.messages.fetch({ limit: 100 });
        //                         const messagesArray = Array.from(messages.values());

        //                         for (let i = 0; i < messagesArray.length; i++) {
        //                             try {
        //                                 if (messagesArray[i].author.id === message.author.id && messagesArray[i - 1]?.author.bot) {
        //                                     await messagesArray[i].delete();
        //                                     console.log(`Deleted message ${i + 1}/${messagesArray.length}`);
        //                                     await messagesArray[i - 1].delete();
        //                                     console.log(`Deleted bot's message ${i}/${messagesArray.length}`);
        //                                 }
        //                             } catch (err) {
        //                                 console.error(`Error reading message at index ${i}:`, err);
        //                             }
        //                         }

        //                         await message.reply({
        //                             content: `Thanks for signing in, ${message.author}!`
        //                         });

        //                     }
        //                 } else {
        //                     await message.reply({
        //                         content: 'Invalid nickname format, please enter your nickname as: "{name} {sso firstname} {sso lastname}". If you need additional help, you can @ an admin.'
        //                     });
        //                     console.log(`Message does not have exactly 3 words: "${message.content}"`);
        //                 }
        //             }

        //         } else {
        //             console.error('Member not found in guild.');
        //         }
        //     } catch (err) {
        //         console.error('Error processing sign-in:', err);
        //     }
        // }

        // This channel will be used for bot commands
        else if (message.channel.name === 'random') {

            if (message.content === 'help' || message.content === 'Help') {
                await message.reply(`
                    The commands you can use are:
                    \nbot_be_annoying (makes the bot repeat everything everyone says)
                    \nbot_stop_annoying (makes the bot stop repeating everything)
                    \nbot_make_embed (create an embed)
                    \nbot_cancel_make_embed (discard embed creation)
                    \nbot_make_event_poll (create an event poll)
                    \nbot_cancel_make_event_poll (discard event poll creation)
                    \nbot_edit_embed (edit an already existing embed)
                    \nbot_cancel_edit_embed (discard editing an embed)
                    \nbot_whale_animation (whale ascii animation in embed)
                    \nbot_cat_animation (cat ascii animation in embed)
                    \nbot_change_channel_path (change the values of the variables for the target channels of the bot)`)
            }

            else if (message.content === 'bot_change_channel_path') {
                editing_channel_path = true;
                selected_channel_index = null;

                await message.reply(
                    `Editing channel path for bot:\n` +
                    `1. sign_in_channel_name = ${sign_in_channel_name}\n` +
                    `2. abscences_channel_name = ${abscences_channel_name}\n` +
                    `3. general_channel_name = ${general_channel_name}\n` +
                    `4. testing_channel_name = ${testing_channel_name}\n` +
                    `5. event_poll_channel_name = ${event_poll_channel_name}\n` +
                    `6. welcome_channel_name = ${welcome_channel_name}\n` +
                    `7. interview_channel_name = ${interview_channel_name}\n\n` +
                    `Reply with 1, 2, 3, 4, 5, 6 or 7 to edit the corresponding channel name, or anything else to cancel.`
                );
            }

            // Wait for number input (1–5)
            else if (editing_channel_path && selected_channel_index === null) {
                const input = message.content.trim();
                if (['1', '2', '3', '4', '5', '6', '7'].includes(input)) {
                    selected_channel_index = parseInt(input);
                    await message.reply('Please enter the **new channel name** to assign to this path.');
                } else {
                    editing_channel_path = false;
                    await message.reply('Channel path edit cancelled.');
                }
            }

            // Wait for new channel name
            else if (editing_channel_path && selected_channel_index !== null) {
                const newChannelName = message.content.trim();

                switch (selected_channel_index) {
                    case 1:
                        sign_in_channel_name = newChannelName;
                        break;
                    case 2:
                        abscences_channel_name = newChannelName;
                        break;
                    case 3:
                        general_channel_name = newChannelName;
                        break;
                    case 4:
                        testing_channel_name = newChannelName;
                        break;
                    case 5:
                        event_poll_channel_name = newChannelName;
                        break;
                    case 6:
                        welcome_channel_name = newChannelName;
                        break;
                    case 6:
                        interview_channel_name = newChannelName;
                        break;
                }

                await message.reply(`Channel path updated for option ${selected_channel_index}: now set to "${newChannelName}".`);

                // Reset state
                editing_channel_path = false;
                selected_channel_index = null;
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

                else if (makingNewEventPoll){
                    await message.reply('I am alreay in the process of making an event poll. Please complete or cancel it.');
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

                else if (makingNewEventPoll){
                    await message.reply('I am alreay in the process of making an event poll. Please complete or cancel it.');
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

            else if (message.content === 'bot_make_event_poll') {
                if (makingNewEmbed) {
                    await message.reply('I am already in the process of creating an embed. Please complete or cancel it.');
                } 
                
                else if (attempEditEmbed || editingSelectedEmbed) {
                    await message.reply('I am alreay in the process of editing an embed. Please complete or cancel it.');
                }

                else if (makingNewEventPoll){
                    await message.reply('I am alreay in the process of making an event poll. Please complete or cancel it.');
                }

                else {
                    makingNewEventPoll = true;
                    waitingForTitle = true;
                    await message.reply('What title would you like for the event poll?');
                }
            }

            else if (message.content === 'bot_cancel_make_event_poll'){
                if (makingNewEventPoll) {
                    waitingForTitle = false;
                    waitingForText = false;
                    waitingForTime = false;
                    customTitle = "";
                    customText = "";
                    makingNewEventPoll = false;
                    await message.reply('Canceled making the event poll.');
                } else {
                    await message.reply('There is no event poll creation process to cancel.');
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
                
                if (makingNewEmbed || makingNewEventPoll) {
                    waitingForTitle = false; // Reset title state
                    waitingForText = true; // Move to the next step
                    embed_or_event_poll = makingNewEmbed ? "embed" : "event poll";
                    await message.reply(`Title saved. What body text would you like for the ${embed_or_event_poll}?`);
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

                if (makingNewEmbed) {
                    waitingForColor = true;
                    waitingForText = false; // Reset text state
                    await message.reply(`Text saved. Please provide a color code for the embed in the format "#RRGGBB". For example: "#c0f7ff".`);
                } 
                
                else if (makingNewEventPoll) {
                    waitingForTime = true;
                    waitingForText = false; // Reset text state
                    await message.reply(`Text saved. What time is the event? Please provide a time in the format "hh:mm AM/PM". For example: "08:30 PM".`);
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

            else if (waitingForTime) {
                const timeInput = message.content.trim();
                const timeRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i;

                if (timeRegex.test(timeInput)) {
                    eventColor = "#CE9C5C"
                    customTime = timeInput;
                    waitingForTime = false;

                    if (makingNewEventPoll) {
                        const embed = {
                            color: parseInt(eventColor.slice(1), 16),
                            title: customTitle,
                            description: `\n\n${customText}\n\nWhen: Tonight @ ${customTime.toUpperCase()} EST\n\n💚 I will be attending\n🟡 I will maybe be attending\n🟥 I won’t be attending\n\nPlease answer the following at least an hour prior to the event!`,
                        };

                        try {
                            const targetChannelName = testing ? testing_channel_name : event_poll_channel_name;
                            targetChannel = message.guild.channels.cache.find(channel => channel.name === targetChannelName);

                            const sentMessage = await targetChannel.send({ embeds: [embed] });

                            // React to the message with the required emojis
                            await sentMessage.react('💚');
                            await sentMessage.react('🟡');
                            await sentMessage.react('🟥');

                            console.log(`Event poll sent to "${targetChannel.name}" with title: "${customTitle}", time: "${customTime}".`);
                            await message.reply(`Event poll successfully sent to "${targetChannel.name}"!`);
                        } catch (err) {
                            console.error(`Error sending event poll to "${targetChannel?.name}":`, err);
                            await message.reply('There was an error sending the event poll. Please try again later.');
                        }

                        // Reset all states
                        targetChannel = null;
                        customTitle = "";
                        customText = "";
                        customTime = "";
                        makingNewEventPoll = false;
                    }

                } else {
                    await message.reply('Invalid time format. Please provide a valid time in the format "hh:mm AM/PM". For example: "08:30 AM" or "2:45 pm".');
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

            else if (message.content === 'bot_whale_animation') {
                if (makingNewEmbed) {
                    await message.reply('I am in the process of creating an embed. Please complete or cancel it.');
                } 
                
                else if (attempEditEmbed || editingSelectedEmbed) {
                    await message.reply('I am in the process of editing an embed. Please complete or cancel it.');
                } 
                
                else {
                    customTitle = "Whale Animation!!!";
                    customText = " ";
                    customColor = "#3c75de";
                    
                    // Create the embed using EmbedBuilder
                    const embed = new EmbedBuilder()
                        .setColor(customColor)
                        .setTitle(customTitle)
                        .setDescription(customText);
            
                    // Create a button using ButtonBuilder
                    const button = new ButtonBuilder()
                        .setCustomId('whale_animation_button')
                        .setLabel('Start Animation')
                        .setStyle(ButtonStyle.Primary);
            
                    // Create an action row for the button
                    const row = new ActionRowBuilder().addComponents(button);
            
                    // Retrieve the target channel by its name
                    if (testing) {
                        targetChannel = message.guild.channels.cache.find(channel => channel.name === testing_channel_name && channel.isTextBased());
                    }
                    else {
                        targetChannel = message.guild.channels.cache.find(channel => channel.name === general_channel_name && channel.isTextBased());
                    }
            
                    if (targetChannel) {
                        try {
                            // Send the embed and store the message ID for later
                            const sentMessage = await targetChannel.send({ embeds: [embed], components: [row] });
                            console.log(`Embed sent to the "${targetChannel.name}" channel with title: "${customTitle}", text: "${customText}", and color: "${customColor}".`);
                            await message.reply(`Embed successfully sent to the "${targetChannel.name}" channel with the title: "${customTitle}", text: "${customText}", and color: "${customColor}".`);
                            
                            // Store the sent message ID
                            whaleEmbedMessageId = sentMessage.id;
                        } catch (err) {
                            console.error(`Error sending embed to the "${targetChannel.name}" channel:`, err);
                            await message.reply('There was an error sending the embed. Please try again later.');
                        }
                    } else {
                        await message.reply(`Could not find the "${general_channel_name}" channel.`);
                    }
            
                    customTitle = "";
                    customText = "";
                    customColor = "#c0f7ff"; // Reset to default color
                }
            }

            else if (message.content === 'bot_cat_animation') {
                if (makingNewEmbed) {
                    await message.reply('I am in the process of creating an embed. Please complete or cancel it.');
                } 
                
                else if (attempEditEmbed || editingSelectedEmbed) {
                    await message.reply('I am in the process of editing an embed. Please complete or cancel it.');
                } 
                
                else {
                    customTitle = "Cat Animation!!!";
                    customText = " ";
                    customColor = "#da59e3";
                    
                    // Create the embed using EmbedBuilder
                    const embed = new EmbedBuilder()
                        .setColor(customColor)
                        .setTitle(customTitle)
                        .setDescription(customText);
            
                    // Create a button using ButtonBuilder
                    const button = new ButtonBuilder()
                        .setCustomId('cat_animation_button')
                        .setLabel('Start Animation')
                        .setStyle(ButtonStyle.Primary);
            
                    // Create an action row for the button
                    const row = new ActionRowBuilder().addComponents(button);
            
                    // Retrieve the target channel by its name
                    if (testing) {
                        targetChannel = message.guild.channels.cache.find(channel => channel.name === testing_channel_name && channel.isTextBased());
                    }
                    else {
                        targetChannel = message.guild.channels.cache.find(channel => channel.name === general_channel_name && channel.isTextBased());
                    }
            
                    if (targetChannel) {
                        try {
                            // Send the embed and store the message ID for later
                            const sentMessage = await targetChannel.send({ embeds: [embed], components: [row] });
                            console.log(`Embed sent to the "${targetChannel.name}" channel with title: "${customTitle}", text: "${customText}", and color: "${customColor}".`);
                            await message.reply(`Embed successfully sent to the "${targetChannel.name}" channel with the title: "${customTitle}", text: "${customText}", and color: "${customColor}".`);
                            
                            // Store the sent message ID
                            catEmbedMessageId = sentMessage.id;
                        } catch (err) {
                            console.error(`Error sending embed to the "${targetChannel.name}" channel:`, err);
                            await message.reply('There was an error sending the embed. Please try again later.');
                        }
                    } else {
                        await message.reply(`Could not find the "${general_channel_name}" channel.`);
                    }
            
                    customTitle = "";
                    customText = "";
                    customColor = "#c0f7ff"; // Reset to default color
                }
            }
            
        }

        // Copy messages over from the abscences anouncement channel to the logging channel
        else if (message.channel.name === abscences_channel_name) {
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

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton()) return;

    if (interaction.customId === 'whale_animation_button' && !whale_button_pressed) {
        console.log(`Button clicked by ${interaction.user.tag}`);
        whale_button_pressed = true;

        if (!whaleEmbedMessageId) {
            console.error('Error: No stored message ID.');
            return;
        }

        if (testing) {
            targetChannel = interaction.guild.channels.cache.find(channel => channel.name === testing_channel_name && channel.isTextBased());
        }
        else {
            targetChannel = interaction.guild.channels.cache.find(channel => channel.name === general_channel_name && channel.isTextBased());
        }

        if (!targetChannel) {
            console.error('Error: Target channel not found.');
            return;
        }

        // ✅ Pass only necessary data to the worker
        const worker = new Worker('./embedWorker.js');
        worker.postMessage({
            messageId: whaleEmbedMessageId,
            channelId: targetChannel.id,
            guildId: interaction.guild.id,
            animal: "whale"
        });

        worker.on('error', (err) => console.error('Worker Error:', err));
        worker.on('exit', (code) => {
            if (code !== 0) console.error(`Worker stopped with exit code ${code}`);
        });

        worker.on('message', (message) => {
            if (message.status === 'done') {
                console.log('Worker has finished running!');
                whale_button_pressed = false;
            }
        });
        

        await interaction.deferUpdate(); // Acknowledge interaction
    }

    else if (interaction.customId === 'cat_animation_button' && !cat_button_pressed) {
        console.log(`Button clicked by ${interaction.user.tag}`);
        whale_button_pressed = true;

        if (!catEmbedMessageId) {
            console.error('Error: No stored message ID.');
            return;
        }

        if (testing) {
            targetChannel = interaction.guild.channels.cache.find(channel => channel.name === testing_channel_name && channel.isTextBased());
        }
        else {
            targetChannel = interaction.guild.channels.cache.find(channel => channel.name === general_channel_name && channel.isTextBased());
        }


        if (!targetChannel) {
            console.error('Error: Target channel not found.');
            return;
        }

        // ✅ Pass only necessary data to the worker
        const worker = new Worker('./embedWorker.js');
        worker.postMessage({
            messageId: catEmbedMessageId,
            channelId: targetChannel.id,
            guildId: interaction.guild.id,
            animal: "cat"
        });

        worker.on('error', (err) => console.error('Worker Error:', err));
        worker.on('exit', (code) => {
            if (code !== 0) console.error(`Worker stopped with exit code ${code}`);
        });

        worker.on('message', (message) => {
            if (message.status === 'done') {
                console.log('Worker has finished running!');
                cat_button_pressed = false;
            }
        });
        

        await interaction.deferUpdate(); // Acknowledge interaction
    }
});


client.on("guildMemberAdd", async (member) => {

    const channel = member.guild.channels.cache.find(
        ch => ch.name === welcome_channel_name && ch.isTextBased()
    );

    if (!channel) {
        console.error(`Welcome channel "${welcome_channel_name}" not found.`);
        return;
    }

    // Build embed with your new formatting
    const welcomeEmbed = new EmbedBuilder()
        .setColor("#733d7e")
        // ${member.user.username} if you want to display the users name
        .setTitle(`- Welcome to *${member.guild.name}*!! ✨`)
        .setDescription(
            `\nWhile you wait for your interview, please make sure to ` + 
            `<#${member.guild.channels.cache.find(ch => ch.name === sign_in_channel_name)?.id}>\n\n` +
            `Afterwards, please let us know when you'll be able to have a 15 minute voice-chat interview with our leaders in ` +
            `<#${member.guild.channels.cache.find(ch => ch.name === interview_channel_name)?.id}>\n\n` +
            `Thank you, and good luck! ^-^`
        )


    channel.send({ embeds: [welcomeEmbed] });
});
