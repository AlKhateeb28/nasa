"use strict";

function getWebSocket(windowWebSocket) {
    if (!window.WebSocket) {
        throw "WebSocket в этом браузере не поддерживается.";
    }

    let protocol;

    if(window.location.protocol === "https:") {
        protocol = "wss";
    } else {
        protocol = "ws";
    }

    //return new WebSocket("ws://10.176.16.38:3000/");
    return new WebSocket(protocol + "://192.168.0.96:3000/");
}