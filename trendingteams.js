import {RefreshingAuthProvider} from '@twurple/auth';
import {ChatClient} from '@twurple/chat';
import {promises as fs} from 'fs';
import pg from 'pg';
import express from 'express';
import * as dotenv from 'dotenv';
import mysql from 'mysql2';
import cors from 'cors';


const app = express();
dotenv.config();
const port = 3000;
app.use(cors());
app.listen({port}, () => {
    console.log('Server is running on port 3000');
});
app.get('/', (req, res) => {
    res.send('Hello, world!');
});
app.get('/api/data', (req,res) => {
    connection.query(
        'SELECT COUNT(*) AS nahhCount FROM chat_info WHERE chat_info_message LIKE "%NAHH%"',
        (error, results, fields) => {
            if (error) {
                console.error(error);
                res.status(500).send('Error retrieving data from the database');
            } else {
                res.json(results[0]); // Return the count
            }
        }
    );
});


const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    database: process.env.DATABASE,
    password: process.env.PASSWORD
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


    const chatClient = new ChatClient({authProvider, channels: ['fufupatwo', 'xqc', 'm0xy', 'shroud', 'buddha',]});
    await chatClient.connect();

    //onAuthSuccess will print connected in chat.
    chatClient.onAuthenticationSuccess(() => {
        chatClient.say('fufupatwo', 'Hello, I\'m now connected!');
    });


    chatClient.onAuthenticationSuccess(() => {
        chatClient.say('xqc', 'Hi');
    })

    const emoteKeywords = await new Promise((resolve, reject) => {
        connection.query('SELECT emotes_name FROM `emotes`', (err, emotesResults, emotesFields) => {
            if (err) {
                reject(err);
            } else {
                const emoteNames = emotesResults.map(emote => emote.emotes_name);
                resolve(emoteNames);
            }
        });
    });

    chatClient.onMessage(async (channel, user, text, msg) => {
        // Insert into chat_info table
        connection.query(
            'INSERT INTO `chat_info` (chat_info_channel, chat_info_user, chat_info_message, chat_info_date, chat_info_bits_per_msg) VALUES (?, ?, ?, ?, ?)',
            [channel, user, text, msg.date, msg.bits],
            async (err, results, fields) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Inserted into chat_info table');
                    const chat_info_id = results.insertId;

                    //use sql query
                    //emotes = select name from emotes...


                    //for each word in sentence .. select name from emotes
                    //count name from emotes where name = word
                    for (const emoteName of emoteKeywords) {
                        if (text.includes(emoteName)) {
                            const existingEmote = await new Promise((resolve, reject) => {
                                connection.query(
                                    'SELECT * FROM `emotes` WHERE emotes_name = ?',
                                    [emoteName],
                                    (err, emoteResults, emoteFields) => {
                                        if (err) {
                                            reject(err);
                                        } else {
                                            resolve(emoteResults);
                                        }
                                    }
                                );
                            });

                            if (existingEmote.length > 0) {
                                connection.query(
                                    'INSERT INTO `user_emotes` (chat_info_id, emotes_id) VALUES (?, ?)',
                                    [chat_info_id, existingEmote[0].emotes_id],
                                    (userEmotesErr, userEmotesResults, userEmotesFields) => {
                                        console.log(userEmotesErr);
                                        console.log(userEmotesResults);
                                        console.log(userEmotesFields);
                                    }
                                );
                            }
                        }
                    }
                }
            }
        );
    });
}

main();

/*
    chatClient.onMessage((channel, user, text, msg) => {

        //console.log(channel, user, text, year + "-" + month + "-" + date);
        console.log(text);
        connection.query(
            'INSERT INTO `chat_info` (channel,user,message,date,bits_per_msg) VALUES (?,?,?,?,?)',
            [channel, user, text, msg.date,msg.bits],
            function (err, results, fields) {
                console.log(err);
                console.log(results);
                console.log(fields);
            }
        );

    });
}
main();*/
/*SQL QUERY FOR NAME -> STORE IN ANOTHER TABLE ->






 */

/*
app.get('/getRequest/teamcount/:teamname', (req, res) => {
    const {teamname} = req.params;

    const searchSql = "SELECT COUNT(*) AS total_count FROM twitchchat WHERE message LIKE '%' || $1 || '%'";
    const values = [teamname];

    pool.query(searchSql, values, (err, result) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Error retrieving team count');
        } else {
            const totalCount = result.rows[0].total_count;
            console.log('Total Count:', totalCount);
            res.send({totalCount});
            res.send("hello");
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


    const chatClient = new ChatClient({authProvider, channels: ['fufupatwo', 'xqc']});
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

        pool.query(sql, [channel, user, text], (err, result) => {
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
*/

