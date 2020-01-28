const express = require('express');
const { Client } = require('pg');
const redis = require('redis');

const app = express();

const dbCredentials = require('./db.json');

const client = new Client({
    user: dbCredentials.username,
    password: dbCredentials.password,
    host: dbCredentials.host,
    database: dbCredentials.database,
    port: dbCredentials.port
});

function wait(ms){
    var start = new Date().getTime();
    var end = start;
    while(end < start + ms) {
        end = new Date().getTime();
    }
}

const startServer = async function() {
    let attemptsLeft = 5;
    while (attemptsLeft !== 0) {
        try {
            await client.connect();
            console.log("La connection à la base de données a réussie");
            break;
        } catch (e) {
            attemptsLeft -= 1;
            console.log("There was an error. Attempts left:", attemptsLeft);
            await wait(5000);
        }
    }
};

startServer();

const redisClient = redis.createClient({ host: 'redis' });


app.get('/', function(req, res) {
    res.json({
        message: "Hello world",
    });
});

app.get('/status', async function(req, res) {
    const postgresUptime = await client.query('select extract(epoch from current_timestamp - pg_postmaster_start_time()) as uptime');
    const redisConnectedClients = await redisClient.server_info.connected_clients

    console.log(redisConnectedClients);
    res.json({
        status: "Ok",
        postgresUptime: Number(postgresUptime.rows[0].uptime),
        redisConnectedClients: Number(redisConnectedClients),
    });
});

app.listen(3030, () => {
    console.log("Le serveur est lancé sur le port 3000");
});