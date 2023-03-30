import { RefreshingAuthProvider } from '@twurple/auth';
import { ChatClient } from '@twurple/chat';
import { promises as fs } from 'fs';
import sqlite3 from "sqlite3";
import * as dotenv from 'dotenv';
dotenv.config();


const db = new sqlite3.Database("./twitchchat.db", sqlite3.OPEN_READWRITE,(err) =>{

    if (err) return console.error(err.message);
    console.log("connection successful");
});
const sqlCreateTable = "CREATE TABLE IF NOT EXISTS twitchchat (id INTEGER PRIMARY KEY AUTOINCREMENT, channel TEXT NOT NULL, username TEXT NOT NULL, message TEXT NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)";
db.run(sqlCreateTable, (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Chat table created');
    }
});


const clientSecret = process.env.CLIENT_SECRET;
const refreshToken = process.env.REFRESH_TOkEN;
const clientId = process.env.CLIENT_ID;
const accessToken = process.env.ACCESS_TOKEN;

async function main() {
    let ts = Date.now();
    let date_ob = new Date(ts);
    let date = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();

    const tokenData = JSON.parse(await fs.readFile('./tokens.125328655.json', 'UTF-8'));
    const authProvider = new RefreshingAuthProvider(
        {
            clientId,
            clientSecret,
            onRefresh: async (userId, newTokenData) => await fs.writeFile(`./tokens.${userId}.json`, JSON.stringify(newTokenData, null, 4), 'UTF-8')
        }
    );
    await authProvider.addUserForToken(tokenData, ['chat']);


    const chatClient = new ChatClient({authProvider, channels: ['fufupatwo', 'ze1ig']});
    await chatClient.connect();

    //onAuthSuccess will print connected in chat.
    chatClient.onAuthenticationSuccess(() => {
        chatClient.say('fufupatwo', 'Hello, I\'m now connected!');
    });


    chatClient.onAuthenticationSuccess(() => {
        chatClient.say('ze1ig', 'Hi');
    })


    chatClient.onMessage((channel, user, text) => {
        console.log(channel, user, text, year + "-" + month + "-" + date);

        const sql = "INSERT INTO twitchchat (channel,username,message) VALUES (?,?,?)";

        db.run(sql,[channel,user,text], (err) => {
           if (err){
                console.error(err.message);
            }
            else{
                console.log("Message saved to database: " + channel, user, text);
            }
        });

        const selectSql = `SELECT * FROM twitchchat WHERE channel = ? AND username = ? AND message = ?`;
        db.get(selectSql, [channel, user, text], (err, row) => {
            if (err) {
                console.error(err.message);
            } else if (!row) {
                console.log('Data was not found in the database');
            } else {
                console.log('Data was found in the database:');
                console.log(`ID: ${row.id}, Channel: ${row.channel}, Username: ${row.username}, Message: ${row.message}`);
            }
        });
       /* db.all(sql, [], (err, rows) => {
            if (err) {
                console.error(err.message);
            } else {
                rows.forEach((row) =>
                {

                });
            }
        })*/



    });


}





main();