"use strict";

function getWebSocket(windowWebSocket) {
    if (!window.WebSocket) {
        throw "WebSocket в этом браузере не поддерживается.";
    }

    // WITH PARAMETER var ws = new WebSocket('ws://example.com/?token=abc123');

    return new WebSocket("ws://10.176.16.38:3000/");
    //return new WebSocket("ws://192.168.0.96:3000/");
}