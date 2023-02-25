
import { RefreshingAuthProvider } from '@twurple/auth';
import { ChatClient } from '@twurple/chat';
import { promises as fs } from 'fs';

const clientId = 'n3ndma0ivr6j04zmvtu2bzmpqg546w';
const accessToken = 'ze4rkhapqt38z45gvrj67tatcmuek5';
const clientSecret = 'okkjahms1h3vjdodn1jew50dgvsn7a';
const refreshToken = 'wn2wyi5w4yqebxrkc62ps176sljggbmuopj6namvsfrk1w7nt7';
async function main() {

    const tokenData = JSON.parse(await fs.readFile('./tokens.125328655.json', 'UTF-8'));
    const authProvider = new RefreshingAuthProvider(
        {
            clientId,
            clientSecret,
            onRefresh: async (userId, newTokenData) => await fs.writeFile(`./tokens.${userId}.json`, JSON.stringify(newTokenData, null, 4), 'UTF-8')
        }
    );

    authProvider.addUserForToken(tokenData, ['chat']);

    const chatClient = new ChatClient({ authProvider, channels: ['fufupatwo'] });
    await chatClient.connect();


    chatClient.onMessage((channel, user, text) => {
        if (text === '!ping') {
            chatClient.say(channel, 'Pong!');
        } else if (text === '!dice') {
            const diceRoll = Math.floor(Math.random() * 6) + 1;
            chatClient.say(channel, `@${user} rolled a ${diceRoll}`)
        }
    });

    chatClient.onSub((channel, user) => {
        chatClient.say(channel, `Thanks to @${user} for subscribing to the channel!`);
    });

    chatClient.onResub((channel, user, subInfo) => {
        chatClient.say(channel, `Thanks to @${user} for subscribing to the channel for a total of ${subInfo.months} months!`);
    });

    chatClient.onSubGift((channel, user, subInfo) => {
        chatClient.say(channel, `Thanks to ${subInfo.gifter} for gifting a subscription to ${user}!`);
    });

    
//auth token is correct, clientID is correct, accessToken correct.
}

main();