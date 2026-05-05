var WebSocketServer = new require("ws");
var isSleeping = false;

var jsonMessage = "";
function reviver(key, value) {
    if (typeof value !== 'number' || Number.MAX_SAFE_INTEGER > value) {
        return value;
    }
    const maxLen = Number.MAX_SAFE_INTEGER.toString().length - 1;

    const needle = String(value).substr(0, maxLen);

    const re = new RegExp(`${needle}\\d+`);
    const matches = jsonMessage.match(re);
    if (matches) {
        return BigInt(matches[0]);
    }
    return value;
}

function isSleepingTime() {
    const currentTimeParts = new Date().toLocaleString("ru-RU").split(", ")[1].split(":");
    const timeAsNumber = parseInt(currentTimeParts[0] + currentTimeParts[1]);

    if (timeAsNumber >= 0 && timeAsNumber <= 600) {
        if (!isSleeping) {
            isSleeping = true;

            clients = {};
            challenges = [];

            console.log(getCurrentDateTime() + " | Sleeping ... All listeners are killed.");
        }

        return true;
    } else {
        if (isSleeping) {
            console.log(getCurrentDateTime() + " | Woke up. Processing ...");
        }

        isSleeping = false;

        return false;
    }
}

function getCurrentDateTime() {
    const currentDate = new Date();

    return currentDate.toLocaleString("ru-RU").split(",")[0] +
        currentDate.toLocaleString("ru-RU").split(",")[1];
}

function isInfoMessage(message) {
    const messageLowerCase = message.toString().toLowerCase();

    if (messageLowerCase.indexOf("close") > -1 || messageLowerCase.indexOf("ping") > -1 || messageLowerCase.indexOf("visitors") > -1) {
        return true;
    } else {
        return false;
    }
}

function addChalenge(id, agent) {
    let isChalengeExist = false;

    challenges.forEach((challenge) => {
        if (challenge.id === id) {
            isChalengeExist = true;
        }
    });

    if (!isChalengeExist && agent.type === "AGENT") {
        let challenge = {};
        challenge.id = id;
        challenge.datetime = new Date();
        challenges.push(challenge);
    }
}

const random = () => {
    return Date.now() + Math.random();
}

var websocketPort = 3000;
var clients = {};
var challenges = [];

var webSocketServer = new WebSocketServer.Server({ port: websocketPort });

webSocketServer.on("connection", function(wsClient) {
    if (!isSleepingTime()) {
        var id = random();

        clients[id] = wsClient;
        clients[id].id = "Dashboard Listener";

        console.log(getCurrentDateTime() + " | " + id + " new client | Agent.ID: " + clients[id].id);

        clients[id].send("pong");

        if (challenges.length > 0) {
            const result = {};
            result.type = "CHALLENGE";
            result.challenges = challenges;

            const challengeMessage = JSON.stringify(result);

            console.log(getCurrentDateTime() + " | Sending message to " + id + " | Message: " + challengeMessage);

            clients[id].send("#" + challengeMessage);
        }
    }

    wsClient.on("message", function(message) {
        if (!isSleepingTime()) {
            if (isInfoMessage(message)) {
                const messageLowerCase = message.toString().toLowerCase();

                if (messageLowerCase.indexOf("close") > - 1) {
                    console.log(getCurrentDateTime() + " | " + id + " connection is closed by AGENT");
                    delete clients[id];
                } else if (messageLowerCase.indexOf("clear") > - 1) {
					const agentId = clients[id].id;
					 
                    for (let clientId in clients) {
                        if(clients[clientId].id === agentId) {
                            console.log(getCurrentDateTime() + " | " + id + " connection is closed by AGENT");
							delete clients[clientId];
						}
                    }
                } else if (messageLowerCase.indexOf("ping") > - 1) {
                    for (let id in clients) {
                        clients[id].send("pong");
                    }
                } else if (messageLowerCase.indexOf("visitors") > - 1) {
                    let visitors = [];

                    for (let id in clients) {
                        let visitor = {};
                        visitor.id = id;
                        visitor.agentId = clients[id].id;

                        visitors.push(visitor);
                    }

                    visitorsMessage = JSON.stringify(visitors, reviver);

                    clients[id].send("vis-" + visitorsMessage);
                }
            } else {
                const agentMessage = message.toString().substring(message.indexOf("#") + 1).replaceAll("&quot;", '"');

                jsonMessage = agentMessage;
                let agent = JSON.parse(agentMessage, reviver);

                if (clients[id] !== undefined) {
                    clients[id].id = agent.id + " ";
                }

                console.log(getCurrentDateTime() + " | " + id + " received message: " + message);

                for (let clientId in clients) {
                    console.log(getCurrentDateTime() + " | Sending message to " + clientId + " | Agent.ID: " + clients[clientId].id);

                    clients[clientId].send(message);
                }

                addChalenge(id, agent);
            }
        }
    }
    );

    wsClient.on("close", function() {
        console.log(getCurrentDateTime() + " " + id + " connection is closed by SERVER");
        delete clients[id];
    });

});

console.log(getCurrentDateTime() + " Server started on port " + websocketPort);

