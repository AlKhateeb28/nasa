const webSocket = getWebSocket(window.WebSocket);

const pingTimeout = 15000;
let pongDate = new Date();

function checkPingState() {
    const currentDatetime = new Date();

    if ((currentDatetime - pongDate) > pingTimeout) {
        setWSStateAsLost();
    } else {
        pongDate = currentDatetime + pingTimeout;

        if (webSocket.readyState === WebSocket.OPEN) {
            console.log("Websocket.Server is active");

            setWSStateAsAlive();

            webSocket.send("ping");
        } else {
            console.log("Websocket.Server is dead");

            setWSStateAsDead();
        }        
    }
}

function setWSStateAsAlive() {
    const wsServerElement = $("#ws_server");
    wsServerElement.removeClass("ws-server-unknown");
    wsServerElement.removeClass("ws-server-inactive");
    wsServerElement.addClass("ws-server-active");

    wsServerElement.html("Active<div style='position: absolute; left: 130px; top: 61px;'>" + WebsocketInfo.FULL_SVG + "</div>");
}

function setWSStateAsDead() {
    const wsServerElement = $("#ws_server");
    wsServerElement.removeClass("ws-server-active");
    wsServerElement.addClass("ws-server-inactive");

    wsServerElement.html("Dead<div style='position: absolute; left: 130px; top: 61px;'>" + WebsocketInfo.LOW_SVG + "</div>");

    $("#start_datetime").css("color", "silver");
}

function setWSStateAsLost() {
    const wsServerElement = $("#ws_server");
    wsServerElement.removeClass("ws-server-active");
    wsServerElement.addClass("ws-server-inactive");

    wsServerElement.html("Lost<div style='position: absolute; left: 130px; top: 61px;'>" + WebsocketInfo.LOST_SVG + "</div>");

    $("#start_datetime").css("color", "#fc9002");
}

async function wsReceiveMessage(promise) {
    if (typeof promise === "string") {
        wsShowMessage(promise);
    } else {
        promise.text().then((value) => {
            wsShowMessage(value);
        });
    }
}

function wsShowMessage(message) {
    setWSStateAsAlive();

    pongDate = new Date();
}

class WebsocketInfo {
    static LOW_SVG = "<svg fill='#fc0202' width='26px' height='26px' viewBox='0 0 32 32' version='1.1' xmlns='http://www.w3.org/2000/svg'>\n" +
        "<title>alt-battery-1</title>\n" +
        "<path d='M0 20q0 2.496 1.76 4.256t4.256 1.76h17.984q2.496 0 4.256-1.76t1.76-4.256h1.984v-8h-1.984q0-2.464-1.76-4.224t-4.256-1.76h-17.984q-2.496 0-4.256 1.76t-1.76 4.224v8zM4 20v-8q0-0.832 0.576-1.408t1.44-0.576h17.984q0.832 0 1.408 0.576t0.608 1.408v8q0 0.832-0.608 1.44t-1.408 0.576h-17.984q-0.832 0-1.44-0.576t-0.576-1.44zM6.016 20h1.984v-8h-1.984v8z'></path>\n" +
        "</svg>";

    static LOST_SVG = "<svg fill='#fc9002' width='26px' height='26px' viewBox='0 0 32 32' version='1.1' xmlns='http://www.w3.org/2000/svg'>\n" +
        "<title>alt-battery-1</title>\n" +
        "<path d='M0 20q0 2.496 1.76 4.256t4.256 1.76h17.984q2.496 0 4.256-1.76t1.76-4.256h1.984v-8h-1.984q0-2.464-1.76-4.224t-4.256-1.76h-17.984q-2.496 0-4.256 1.76t-1.76 4.224v8zM4 20v-8q0-0.832 0.576-1.408t1.44-0.576h17.984q0.832 0 1.408 0.576t0.608 1.408v8q0 0.832-0.608 1.44t-1.408 0.576h-17.984q-0.832 0-1.44-0.576t-0.576-1.44zM6.016 20h1.984v-8h-1.984v8z'></path>\n" +
        "</svg>";

    static FULL_SVG = "<svg fill='#ffffff' width='26px' height='26px' viewBox='0 0 32 32' version='1.1' xmlns='http://www.w3.org/2000/svg'>" +
        "<title>alt-battery-5</title>" +
        "<path d='M0 20q0 2.496 1.76 4.256t4.256 1.76h17.984q2.496 0 4.256-1.76t1.76-4.256h1.984v-8h-1.984q0-2.464-1.76-4.224t-4.256-1.76h-17.984q-2.496 0-4.256 1.76t-1.76 4.224v8zM4 20v-8q0-0.832 0.576-1.408t1.44-0.576h17.984q0.832 0 1.408 0.576t0.608 1.408v8q0 0.832-0.608 1.44t-1.408 0.576h-17.984q-0.832 0-1.44-0.576t-0.576-1.44zM6.016 20h1.984v-8h-1.984v8zM10.016 20h1.984v-8h-1.984v8zM14.016 20h1.984v-8h-1.984v8zM18.016 20h1.984v-8h-1.984v8zM22.016 20h1.984v-8h-1.984v8z'></path>" +
        "</svg>";

    constructor(theme) {
        if (theme == null || theme == undefined || theme == "") {
            theme = "light";
        }

        this.theme = theme;
    }

    getTemplate(templateId) {
        return $("#" + templateId).html();
    }

    getContent() {
        return `
            <style>
				.float-left {
                    float: left;
                }
 
                .statistic {
                    margin-right: 4px;
                }

                .ws_statistic {
                    border: 1px solid #7e7e7e;
                    border-radius: 1px;
                    box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2);                    
                    margin-bottom: 10px;
                }

                .light-theme-background {
                    background-color: #ffffffff;
                }

                .dark-theme-background {
                    background-color: #212529;
                }

                .light-theme-caption {
                    color: #4b0082;
                }

                .dark-theme-caption {
                    color: #ffebcd;
                }

                .light-theme-time {
                    color: #228b22;
                }

                .dark-theme-time {
                    color: #adff2f;
                }

                .start_datetime {
                    position: absolute;                    
                    margin-left: 5px;
                    margin-top: 6px;
                    font-size: 11px;
                }

                .header-label {
                    margin-top: 27px;
                    margin-left: 90px;
                    font-size: 16px;
                    font-weight: bold;
                }

                .ws-server {
                    border-radius: 2rem !important;
                    padding-left: 3rem !important;
                    padding-right: 3rem !important;
                    margin-top: 10px;
                    margin-left: 10px;
                    margin-right: 10px;
                    margin-bottom: 10px;
                    width: 63px;
                    height: 21px;
                }

                .ws-server-active {
                    background-image: linear-gradient(290deg, #7928ca, #ff0080, #7928ca) !important;
                    color: mintcream;
                }

                .ws-server-inactive {
                    background-image: linear-gradient(290deg, #212529, #5e5f5e, #212529) !important;
                    color: darkgray;
                }

                .ws-server-unknown {
                    background-image: linear-gradient(290deg, #212529, #5e5f5e, #212529) !important;
                    color: mintcream;
                }
            </style>
            
			<div id="ws_card" class="float-left statistic ws_statistic">
                <div id="start_datetime" class="start_datetime"></div>
                <div>
                    <div id="ws_caption" class="header-label rock-and-roll">
                        WS Server
                    </div>
                </div>
                <div id="ws_server" class="ws-server ws-server-unknown">
                    Unknown
                </div>                    
            </div>			
        `;
    }

    addWebsocketInfo(parentId) {
        $("#" + parentId).append(this.getContent());

        const starDatetimeElement = $("#start_datetime");

        if (this.theme == "light") {
            $("#ws_card").addClass("light-theme-background");
            $("#ws_caption").addClass("light-theme-caption");
            starDatetimeElement.addClass("light-theme-time");
        } else {
            $("#ws_card").addClass("dark-theme-background");
            $("#ws_caption").addClass("dark-theme-caption");
            starDatetimeElement.addClass("dark-theme-time");
        }

        starDatetimeElement.html("Activated: " + this.getCurrentDateTime());

        webSocket.onmessage = function (event) {
            setWSStateAsAlive();

            wsReceiveMessage(event.data).then(r => r);
        };

        setInterval(checkPingState, pingTimeout);
    }

    getCurrentDateTime() {
        const currentDate = new Date();

        return currentDate.toLocaleString("ru-RU").split(",")[0] +
            currentDate.toLocaleString("ru-RU").split(",")[1];
    }
}