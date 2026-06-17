class Notification {
    constructor(message, type, livingtime, caption) {
        //super();		
        this.message = message;
        this.type = type;
        this.livingtime = livingtime;

        this.caption = "Нет описания";
        if (caption !== undefined) {
            this.caption = caption;
        }

        this.notifyElement = null;

        this.initialize();
    }

    initialize() {
        this.notifyElement = document.createElement("div");

        this.notifyElement.id = "stickyNotification";
        this.notifyElement.style.display = "block";
        this.notifyElement.style.position = "absolute";
        this.notifyElement.style.width = "350px";
        this.notifyElement.style.height = "150px";
        this.notifyElement.style.padding = "10px";
        this.notifyElement.style.borderRadius = "5px";
        this.notifyElement.style.border = "1px solid black";
        this.notifyElement.style.right = "10px";
        this.notifyElement.style.bottom = "10px";
        this.notifyElement.style.backgroundColor = "whitesmoke";


        const css = this.getCssProperties(this.type);

        this.notifyElement.innerHTML = "<div>" +
            "<div>" +
            "<div style='background-image: " + css.backgroundImage + "; font-weight: bold; color: " + css.color + "; text-align: center; width: 91%; padding-right: 3px;'>" + css.text + "</div>" +
            "<div style='float: right; margin-top: -19px; cursor: pointer;' onclick='$(\"#stickyNotification\").remove();'>" +
            "<svg width='20px' height='20px' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>" +
            "<path fill-rule='evenodd' clip-rule='evenodd' d='M12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22ZM8.96965 8.96967C9.26254 8.67678 9.73742 8.67678 10.0303 8.96967L12 10.9394L13.9696 8.96969C14.2625 8.6768 14.7374 8.6768 15.0303 8.96969C15.3232 9.26258 15.3232 9.73746 15.0303 10.0303L13.0606 12L15.0303 13.9697C15.3232 14.2625 15.3232 14.7374 15.0303 15.0303C14.7374 15.3232 14.2625 15.3232 13.9696 15.0303L12 13.0607L10.0303 15.0303C9.73744 15.3232 9.26256 15.3232 8.96967 15.0303C8.67678 14.7374 8.67678 14.2626 8.96967 13.9697L10.9393 12L8.96965 10.0303C8.67676 9.73744 8.67676 9.26256 8.96965 8.96967Z' fill='#1C274C'/>" +
            "</svg>" +
            "</div>" +
            "</div>" +
            "<div style='color: black; background-color: whitesmoke; margin-top: 10px;'>" + this.message + "</div>" +
            "</div>";

        document.addEventListener("scroll", (event) => {
            let btmPos = -window.scrollY + 10;
            this.notifyElement.style.bottom = btmPos + "px";
        });

        if (this.livingtime !== undefined && this.livingtime !== null) {
            setTimeout(function () {
                $("#stickyNotification").remove();
            }, this.livingtime);
        }
    }

    show() {
        document.body.appendChild(this.notifyElement);
    }

    hide() {
        $("#stickyNotification").remove();
    }

    getCssProperties(type) {
        const result = {};

        switch (type) {
            case 0:
                result.backgroundImage = "linear-gradient(-20deg, #00ff00, #00ff00, #00ff00 100%)";
                result.color = "black";
                result.text = "Информация";

                break;
            case 1:
                result.backgroundImage = "linear-gradient(-20deg, #ffa500, #ffa500, #ffa500 100%)";
                result.color = "black";
                result.text = "Внимание";

                break;
            case 2:
                result.backgroundImage = "linear-gradient(-20deg, #ff0000, #ff0000, #ff0000 100%)";
                result.color = "white";
                result.text = "Ошибка";

                break;
            case 4:
                result.backgroundImage = "linear-gradient(-20deg, #4e4376, #2b5876, #4e4376 100%)";
                result.color = "#f5fffa";
                result.text = this.caption;

                break;
            default:                
                result.backgroundImage = "linear-gradient(-20deg, #00ff00, #00ff00, #00ff00 100%)";
                result.color = "black";
                result.text = "Информация";

                break;
        }

        return result;
    }
}