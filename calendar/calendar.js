var selectedMonth = null;
var selectedYear = null;

class Calendar extends Object {
    static afterSelectAction = "";
    static isActive = false;

    constructor() {
        super();
    }

    static getContent() {
        return `
        <!DOCTYPE html>
        <html lang="en" dir="ltr">
        
        <head>
            <meta charset="utf-8">
            <title>Calendar</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    font-family: 'Poppins', sans-serif;
                }
        
                body {
                    font-family: 'Trebuchet MS', Verdana, Tahoma, sans-serif;
                    min-height: 100vh;
                    padding: 0 10px;
                }
        
                .calendar-container {
                    /*background-color: navajowhite;*/
                    background-color: whitesmoke;
                    width: 450px;
                    border-radius: 10px;
                    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.12);
                }
        
                .calendar-container header {
                    display: flex;
                    align-items: center;
                    padding: 25px 30px 10px;
                    justify-content: space-between;
                }
        
                header .calendar-navigation {
                    display: flex;
                }
        
                header .calendar-navigation span {
                    height: 38px;
                    width: 38px;
                    margin: 0 1px;
                    cursor: pointer;
                    text-align: center;
                    line-height: 38px;
                    border-radius: 50%;
                    user-select: none;
                    color: #aeabab;
                    font-size: 1.9rem;
                }
        
                .calendar-navigation span:last-child {
                    margin-right: -10px;
                }
        
                header .calendar-navigation span:hover {
                    background: #f2f2f2;
                }
                        
                header .calendar-current-date {
                    font-weight: 500;
                    font-size: 1.45rem;
                }
        
                .calendar-body {
                    padding: 20px;
                }
        
                .calendar-body ul {
                    list-style: none;
                    flex-wrap: wrap;
                    display: flex;
                    text-align: center;
                }
        
                .calendar-body .calendar-dates {
                    margin-bottom: 20px;
                }
        
                .calendar-body li {
                    width: calc(100% / 7);
                    font-size: 1.07rem;
                    color: #414141;
                }
        
                .calendar-body .calendar-weekdays li {
                    cursor: default;
                    font-weight: 500;
                }
        
                .calendar-body .calendar-dates li {
                    margin-top: 30px;
                    position: relative;
                    z-index: 1;
                    cursor: pointer;
                }
        
                
        
                .calendar-dates li.active {
                    color: #fff;
                }
        
                .calendar-dates li::before {
                    position: absolute;
                    content: "";
                    z-index: -1;
                    top: 50%;
                    left: 50%;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    transform: translate(-50%, -50%);
                }
        
                .calendar-dates li.active::before {
                    background: #49aff2;
                }
        
                .calendar-dates li:not(.inactive):hover::before {
                    background: #e4e1e1;
                }        
                
                .alien {
                    background: #f5f5f5 !important;
                }
            </style>
        
            <script type="text/javascript" src="./scripts/jquery.js"></script>
        </head>
        
        <body>
        <div id="calendar" class="calendar-container">
            <header class="calendar-header">
                <p class="calendar-current-date" style="color: #49aff2;"></p>
                <div id="navigation" class="calendar-navigation" style="display: none;">
                    <span id="calendar-prev" class="material-symbols-rounded">
                        <img src="./fcc/js/images/prev.png" style="width: 16px;"/>
                    </span>
                    <span id="calendar-next" class="material-symbols-rounded">
                        <img src="./fcc/js/images/next.png" style="width: 16px;"/>
                    </span>
                    <span id="calendar-close" class="material-symbols-rounded" onclick="event.stopPropagation(); Calendar.hide()">
                        <img src="./fcc/js/images/close.png" style="width: 16px;"/>
                    </span>
                </div>
            </header>
        
            <div class="calendar-body">
                <ul class="calendar-weekdays">
                    <li>ПН</li>
                    <li>ВТ</li>
                    <li>СР</li>
                    <li>ЧТ</li>
                    <li>ПТ</li>
                    <li>СБ</li>
                    <li>ВС</li>
                </ul>
                <ul class="calendar-dates"></ul>
            </div>
        </div>
                
        </body>
        </html>
    `;
    }

    static initialize() {
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth();

        selectedMonth = month + 1;
        selectedYear = year;

        const day = document.querySelector(".calendar-dates");

        const currdate = document
            .querySelector(".calendar-current-date");

        const prenexIcons = document
            .querySelectorAll(".calendar-navigation span");

        // Array of month names
        const months = [
            "Январь",
            "Февраль",
            "Март",
            "Апрель",
            "Май",
            "Июнь",
            "Июль",
            "Август",
            "Сентябрь",
            "Октябрь",
            "Ноябрь",
            "Декабрь"
        ];

        const manipulate = () => {
            let dayone = new Date(year, month, 1).getDay();
            let lastdate = new Date(year, month + 1, 0).getDate();
            let dayend = new Date(year, month, lastdate).getDay();
            let monthlastdate = new Date(year, month, 0).getDate();
            let lit = "";

            if(dayone != 0) {
                dayone--;
            }

            for (let i = dayone; i > 0; i--) {
                lit += `<li class="alien"></li>`;
            }

            for (let i = 1; i <= lastdate; i++) {
                let isToday = i === date.getDate() && month === new Date().getMonth() && year === new Date().getFullYear() ? "active" : "inactive";

                lit += `<li class="${isToday}" onclick="Calendar.onSelectDate(${i})">${i}</li>`;
            }

            for (let i = dayend; i < 6; i++) {
                lit += `<li class="alien"></li>`
            }

            currdate.innerText = `${months[month]} ${year}`;

            day.innerHTML = lit;
        }

        manipulate();

        prenexIcons.forEach(icon => {
            icon.addEventListener("click", () => {
                event.stopPropagation();

                if(icon.id !== "calendar-close") {
                    month = icon.id === "calendar-prev" ? month - 1 : month + 1;

                    if (month < 0 || month > 11) {
                        date = new Date(year, month, new Date().getDate());

                        year = date.getFullYear();

                        month = date.getMonth();
                    } else {
                        date = new Date();
                    }

                    selectedMonth = month + 1;
                    selectedYear = year;

                    manipulate();
                }
            });
        });

        setTimeout(function() {
            $("#navigation").css("display", "block");
        }, 5000 );
    }

    static onSelectDate(day) {
        if(day.toString().length === 1) {
            day = "0" + day;
        }

        if(selectedMonth.toString().length === 1) {
            selectedMonth = "0" + selectedMonth;
        }

        if(this.afterSelectAction.length !== 0) {
            document.getElementById(this.afterSelectAction).value = day + "." + selectedMonth + "." + selectedYear;

            Calendar.hide();
        }
    }

    static show() {
        $("#calendar").css("display", "block");

        Calendar.isActive = true;
    }

    static hide() {
        $("#calendar").css("display", "none");

        Calendar.isActive = false;
    }
}
