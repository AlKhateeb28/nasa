var sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

function getParameter(name) {
    var params = window
        .location
        .search
        .replace('?','')
        .split('&')
        .reduce(
            function(p,e){
                var a = e.split('=');
                p[ decodeURIComponent(a[0])] = decodeURIComponent(a[1]);
                return p;
            },
            {}
        );

    return params[name];
}

sleep(1000).then(r => alert());
