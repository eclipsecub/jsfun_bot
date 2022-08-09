//Going to be teaching how to create slash commands for you discord bot

//slash commands are very comparable to chat interactions with the bot. However, each interaction will be initiated with a slash
//and each command will have a provided description. Additionally, there is the organizational benefit of categorizing all of your bot commands into the group of text inputs that must begin with a slash and chat commands have a much larger amount of possible bot responses.


//Importing discordjs and dotenv
import {ClientEvents} from "discord.js";

const {Routes, Client, GatewayIntentBits} = require('discord.js')
const {Guilds, GuildMessages, MessageContent} = GatewayIntentBits;
const {REST} = require('@discordjs/rest'); //REST api that allows you to interact with the discord API specifically
const dotenv = require('dotenv');


//This allows us to access the variables within the .env file
dotenv.config()

//create the client
const client = new Client({
    intents: [
        Guilds, //meaning the bot intends to interact with guilds (servers)
        GuildMessages, //meaning the bot intends to interact with guild messages
        MessageContent

    ] //You must specify what you will be doing with your bot. Specify what info it
    //will be receiving. And what information it can return
    //Specificity in this regard allows you to save bandwidth. Every possible action
    //for the bot would occupy more bandwidth
})

//listening for when the bot goes online
client.on('ready', () => {
    console.log('The bot is ready');
})

//Creating a basic message reply
client.on('messageCreate', (message: any) => {
    //Verify the author of the message is not a bot to prevent a reply loop
    if (!message.author.bot) {
        if (message.content === "pull up") {
            //Send message reply
            message.reply('Okay I pull up');
        }
    }
})

//import your client and guild id from the .env file
const CLIENTID = process.env.CLIENTID;
const GUILDID = process.env.GUILDID;

//Creating an instance of rest using our bot token
const rest = new REST({version: '10'}).setToken(process.env.TOKEN);

//Creating the list of commands for the bot
const commands = [{
    name: 'rockpaperscissors',
    description: 'Play with the bot',
    options: [
        {
            name: 'userchoice',
            description: 'rock paper or scissors',
            type: 3,  //3 meaning of type string
            required: true,
            choices: [{
                name: 'Rock',
                value: 'Rock'
            }, {
                name: 'Paper',
                value: 'Paper'
            }, {
                name: 'Scissors',
                value: 'Scissors'
            }]
        }]},
    {
        name:"Poke",
        type:2
    }
]


//We're going to create guild commands instead of globally accessible commands
//because global commands take one hour to update, whereas guild commands update almost instantly.
//However, if you intend on using these commands with the bot regardless of which server he is on,
//the commands should then be converted to globals when dev work is done

    async function main() {
        try {
            console.log('refreshing application / commands');

            await rest.put(Routes.applicationGuildCommands(CLIENTID, GUILDID), {//rest.put is an http request to the discord api to update our commands
                body: commands
            })
        } catch (err) {
            console.log(err)
        }
    }

//calling the main function
    main();

//listening for interactions
    client.on('interactionCreate', (interaction: any) => {


        if(interaction.isUserContextMenuCommand()){
            if(interaction.commandName === "Poke"){
                interaction.reply({content:`Hey ${interaction.user.tag.slice(0,-5)}! Don't touch me!`})
            }

        }




        else if (interaction.isChatInputCommand()) {

            //Creating the bot's rockpaperscissors response
            let odds = Math.random();
            let botChoice = "";

            //Assigning the float value to either rock paper or scissors
            switch (true) {
                case (odds < 0.34):
                    botChoice = "Scissors"
                    break;
                case (odds > 0.33 && odds < 0.67):
                    botChoice = "Rock"
                    break;
                case (odds > 0.66):
                    botChoice = "Paper"
                    break;
            }

            //Get the user response
            let userChoice = interaction.options.get('userchoice').value
            console.log(userChoice)

            //Create the effectiveness object
            const effectiveness: {[key: string] : any} = {
                Rock : {losesTo: "Paper", winsTo: "Scissors"},
                Paper : {losesTo: "Scissors", winsTo: "Rock"},
                Scissors : {losesTo: "Rock", winsTo: "Paper"}
            }
            console.log(effectiveness[userChoice].winsTo)

            //Respond with the winner
            if(effectiveness[userChoice].winsTo === botChoice){
                interaction.reply({content: "Congrats! You just beat the bot!"})
            }else if(effectiveness[userChoice].losesTo === botChoice){
                interaction.reply({content: "Too bad! You lost to the bot!"})
            }else {
                interaction.reply({content: "Try again! You've tied with the bot!"})
            }


        }
    })











//"TOKEN" must match the name of the variable given in the .env file
    client.login(process.env.TOKEN);