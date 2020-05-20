const express = require('express');
const SocketServer = require('ws').Server;

//init Express
const app = express();
const port = 5000;

const server = app.listen(port, () => {
    console.log('server is listening on port: ' + port);
})

//http api endpoint
app.get('/', (req, res) => {
	res.send("Server is live!");
})

let getRandom = () => {
	return Math.random();
}

//create Web Socket Server
const wss = new SocketServer({ server });

//init Websocket ws and handle incoming connect requests
wss.on('connection', ws  =>{
	ws.send(JSON.stringify({welcome: 'Do you want to get random numbers? (yes,no)'}));
	let needRandom = false;

	//on connect messge
	ws.on('message', message => {
		message === 'yes' ? needRandom = true : ws.terminate();
	})

	ws.randomInterval = setInterval( () => {
		if(needRandom) {
			ws.send(JSON.stringify({random: getRandom()}));
		}
	}, 3000)

	ws.on('close', () => {
		clearInterval(ws.randomInterval);
	})
})