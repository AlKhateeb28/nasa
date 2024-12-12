const sleep = ms => new Promise(r => setTimeout(callback, ms));

function callback() {
    console.log(1);
}

sleep(10000).then(() => {
    // Do something after the sleep!
});
//setInterval(callback, 1000);
