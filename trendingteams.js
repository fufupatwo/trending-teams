import { RefreshingAuthProvider } from '@twurple/auth';
import { ChatClient } from '@twurple/chat';
import { promises as fs } from 'fs';
import pg from 'pg';
import express from 'express';
import * as dotenv from 'dotenv';

const app = express();
dotenv.config();

const port = 3000;
app.listen({port}, () => {
    console.log('Server is running on port 3000');
});
app.get('/', (req, res) => {
    res.send('Hello, world!');
});


const pool = new pg.Pool({

    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
});
pool.connect();

app.get('/getRequest/:channel/user/:username/message_count', (req, res) => {
    const {channel, username} = req.params;

    const testsql = "SELECT * FROM twitchchat WHERE channel LIKE '%hello%' OR message LIKE '%hello%'";

    pool.query(testsql,(err, result) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Error retrieving message count');
        } else {
            const usernames = result.rows.map(row => row.username);
            res.send({usernames});
        }
    });
});

const sqlCreateTable = "CREATE TABLE IF NOT EXISTS twitchchat (id SERIAL PRIMARY KEY, channel TEXT NOT NULL, username TEXT NOT NULL, message TEXT NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)";
pool.query(sqlCreateTable, (err, res) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log('Table created successfully');
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
        chatClient.say('xqc', 'Hi');
    })


    chatClient.onMessage((channel, user, text) => {

        console.log(channel, user, text, year + "-" + month + "-" + date);

        const sql = "INSERT INTO twitchchat (channel,username,message) VALUES ($1,$2,$3) RETURNING *";

        pool.query(sql, [channel,user,text], (err, result) => {
            if (err) {
                console.error(err.message);
            } else if (result.rowCount === 0) {
                console.log('Data was not found in the database');
            } else {
                console.log('Data was found in the database:');
               // console.log(result);
                console.log(`ID: ${result.rows[0].id}, Channel: ${result.rows[0].channel}, Username: ${result.rows[0].username}, Message: ${result.rows[0].message}`);
            }
        });
    });
}





main();