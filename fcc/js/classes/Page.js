class Page extends Object {
    static activeCardBackgroundColor = "#ffefd5";

    constructor() {
        super();
    }

    static template(templateId) {
        return $("#" + templateId).html();
    }

    static openLink(link) {
        if(link === undefined) {
            console.log("Page: Link is undefined!");
        }

        window
            .open(link, '_blank')
            .focus();
    }

    static sendNotification(title, body, icon, image) {
        const options = {};

        if(body !== undefined) {
            options.body = body;
        }

        if(icon !== undefined) {
            options.icon = icon;
        }

        if(image !== undefined) {
            options.image = image;
        }

        if (!("Notification" in window)) {
            console.log("This browser does not support desktop notification");
        } else if (Notification.permission === "granted") {
            const notification = new Notification(title, options);
        } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then((permission) => {
                if (permission === "granted") {
                    const notification = new Notification(title, options);
                }
            });
        }
    }
}