import { RefreshingAuthProvider } from '@twurple/auth';
import { ChatClient } from '@twurple/chat';
import { promises as fs } from 'fs';


const clientSecret = 'okkjahms1h3vjdodn1jew50dgvsn7a';
const refreshToken = 'ovrxt976xm2fbc28oe84e23cjnse9v5fq88b0su7mrddqst0dp';
const clientId = 'n3ndma0ivr6j04zmvtu2bzmpqg546w';
const accessToken = 'i97rnyx6471gamnuur3ebnhxvjk2vp';

async function main() {

    const tokenData = JSON.parse(await fs.readFile('./tokens.125328655.json', 'UTF-8'));
    const authProvider = new RefreshingAuthProvider(
        {
            clientId,
            clientSecret,
            onRefresh: async (userId, newTokenData) => await fs.writeFile(`./tokens.${userId}.json`, JSON.stringify(newTokenData, null, 4), 'UTF-8')
        }
    );

    await authProvider.addUserForToken({
        accessToken,
        refreshToken
    }, ['chat']);

    const chatClient = new ChatClient({ authProvider, channels: ['fufupatwo'] });
    await chatClient.connect();

    //onAuthSucc will print connected in chat.
    chatClient.onAuthenticationSuccess(() => {
        chatClient.say('fufupatwo', 'Hello, I\'m now connected!');
    })

    chatClient.join("ze1ig");
    chatClient.onAuthenticationSuccess(() => {
        chatClient.say('fufupatwo', 'Hello, I\'m now connected!');
    })
    //test
   // chatClient.onMessage(('ze1ig')) FIX ME

    chatClient.onMessage((channel, user, text) => {
        if (text === '!ping') {
            chatClient.say(channel, 'Pong!');
        } else if (text === '!dice') {
            const diceRoll = Math.floor(Math.random() * 6) + 1;
            chatClient.say(channel, `@${user} rolled a ${diceRoll}`)
        }
    });






}





main();