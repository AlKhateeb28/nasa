var months = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
var monthsNames = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];

var colors = ["#7928ca", "#ff0080", "#0d6efd", "#fd7e14", "#191970", "#4a4fd4", "#5f9ea0", "#008000", "#00008b", "#ff7f50"];

var obj = null;

class Calendar extends Object {
    pageId = null;
    owner = null;
    contentId = null;
    dataUrl = null;
    selectedDate = "";
    currentEventIndex = 0;

    events = [];
    yearEvents = [];

    constructor(pageId, contentId, dataUrl) {
        super();

        this.pageId = pageId;
        this.contentId = contentId;
        this.dataUrl = dataUrl;

        this.initYearEvents();

        //setInterval(this.getNotifications, 15000);
        this.getNotifications()

        //this.refreshData(moment().format("YYYY-MM-DD"));
    }

    refreshData(owner, selectedDate) {
        this.owner = owner;
        this.selectedDate = selectedDate;

        this.currentEventIndex = 0;
        GlobalPage.showWaiter();

        const contentElement = $("#" + this.contentId);
        contentElement.empty();
        contentElement.append(this.getContent(owner));

        const currentDateElement = $("#page" + this.pageId + "_currentDate");
        currentDateElement.html(moment().format("DD") + "&nbsp;" + monthsNames[moment().month()] + "&nbsp;" + moment().format("YYYY"));
        currentDateElement.attr("day", moment().format("DD"));
        currentDateElement.attr("month", moment().month() + 1);
        currentDateElement.attr("year", moment().format("YYYY"));

        const currentMonthElement = $("#page" + this.pageId + "_currentMonth");
        currentMonthElement.html(months[moment(this.selectedDate).month()]);
        currentMonthElement.attr("day", moment(this.selectedDate).format("DD"));
        currentMonthElement.attr("month", moment(this.selectedDate).format("MM"));
        currentMonthElement.attr("year", moment(this.selectedDate).format("YYYY"));

        const currentYearElement = $("#page" + this.pageId + "_currentYear");
        currentYearElement.html(moment(this.selectedDate).year());
        currentYearElement.attr("day", moment(this.selectedDate).format("DD"));
        currentYearElement.attr("month", moment(this.selectedDate).format("MM"));
        currentYearElement.attr("year", moment(this.selectedDate).format("YYYY"));

        for(let i = 0; i < 42; i++) {
            $("#page" + this.pageId + "_calendar").append(Page.template("page" + this.pageId + "_day_template"));

            $("#page" + this.pageId + "_parent").attr("id", "page" + this.pageId + "_parent_" + i);
            $("#page" + this.pageId + "_parent_" + i).attr("index", i);

            $("#page" + this.pageId + "_day").attr("id", "page" + this.pageId + "_day_" + i);
            $("#page" + this.pageId + "_day_name").attr("id", "page" + this.pageId + "_day_name_" + i);
            $("#page" + this.pageId + "_schedule").attr("id", "page" + this.pageId + "_schedule_" + i);
        }

        const days = Calendar.getDaysMap(this.selectedDate);

        days.forEach((element, index) => {
            const parentElement = $("#page" + this.pageId + "_parent_" + index);
            //parentElement.addClass("e-" + element.day + element.month + element.year)
            parentElement.attr("day", element.day);
            parentElement.attr("month", element.month);
            parentElement.attr("year", element.year);
            parentElement.attr("year", element.year);

            const dayElement = $("#page" + this.pageId + "_day_" + index);

            dayElement.html(element.day);

            $("#page" + this.pageId + "_day_name_" + index).html(Calendar.getDayName(element.date));

            if(element.dayOfWeek === 0 || element.dayOfWeek === 6) {
                parentElement.css("background-color", "#ffefd5");
                parentElement.attr("work", 0);
            } else {
                parentElement.attr("work", 1);
            }

            if(!element.owner) {
                parentElement.attr("owner", element.owner);
                parentElement.css("color", "silver");
            }

            if(moment().format("DD") === element.day &&
                moment().format("MM") === element.month &&
                moment().format("YYYY") === element.year) {

                parentElement.css("background-color", "#8ccbff");
                parentElement.css("color", "#f5ffff");

                if(moment().format("DD") === moment(this.selectedDate).format("DD") &&
                    moment().format("MM") === moment(this.selectedDate).format("MM") &&
                    moment().format("YYYY") === moment(this.selectedDate).format("YYYY")) {

                    parentElement.addClass("calendar-day-box-border");
                }
            }

            if(moment(this.selectedDate).format("DD") === element.day &&
                moment(this.selectedDate).format("MM") === element.month &&
                moment(this.selectedDate).format("YYYY") === element.year) {

                parentElement.addClass("calendar-day-box-border");
            }

            // CHECK AND MARK CUSTOM HOLIDAYS
            if(this.hasHolidayEvent(element.day, element.month, element.year)) {
                parentElement.css("background-color", "#ffefd5");
            } else if(this.hasWorkingEvent(element.day, element.month,   element.year)) {
                parentElement.css("background-color", "#ffffff");
            }
        });

        GlobalPage.sleep(1);

        const dates = Calendar.getStartFinishDates(this.pageId);

        let instance = this;

        $.ajax({
            url: this.dataUrl + "&start=" + dates.start + "&finish=" + dates.finish,
            async: false,
            type: "GET",
            dataType: "json",
            success: function (data) {
                if(data.errorMessage.indexOf("#") < 0) {
                    instance.events = data.events;

                    instance.events.forEach((event, index) => {
                        instance.addEventOnCalendar(event, instance.pageId, index);
                    });

                    instance.showDayEvents();

                    GlobalPage.hideWaiter();
                } else {
                    console.log("Error: " + data.errorMessage);
                }
            },
            error: function(error) {
                console.log("State: " + error.readyState + " Response: " + error.response + " ResponseText: " + error.responseText + " Status: " + error.status);
            }
        });
    }

    initYearEvents() {
        let yearEvent = {};
        yearEvent.year = 2024;
        yearEvent.holiday = [];
        yearEvent.holiday.push("e-04.11.2024");
        yearEvent.holiday.push("e-30.12.2024");
        yearEvent.holiday.push("e-31.12.2024");

        yearEvent.working = [];
        yearEvent.working.push("e-02.11.2024");
        yearEvent.working.push("e-28.12.2024");

        this.yearEvents.push(yearEvent);

        yearEvent = {};
        yearEvent.year = 2025;
        yearEvent.holiday = [];
        yearEvent.holiday.push("e-01.01.2025");
        yearEvent.holiday.push("e-02.01.2025");
        yearEvent.holiday.push("e-03.01.2025");
        yearEvent.holiday.push("e-06.01.2025");
        yearEvent.holiday.push("e-07.01.2025");
        yearEvent.holiday.push("e-08.01.2025");
        yearEvent.holiday.push("e-01.05.2025");
        yearEvent.holiday.push("e-02.05.2025");
        yearEvent.holiday.push("e-08.05.2025");
        yearEvent.holiday.push("e-09.05.2025");
        yearEvent.holiday.push("e-12.06.2025");
        yearEvent.holiday.push("e-13.06.2025");
        yearEvent.holiday.push("e-03.11.2025");
        yearEvent.holiday.push("e-04.11.2025");
        yearEvent.holiday.push("e-31.12.2025");

        yearEvent.working = [];
        yearEvent.working.push("e-01.11.2024");

        this.yearEvents.push(yearEvent);
    }

    getContent(owner) {
        return `
            <style>
            .float-left {
                float: left;
            }

            .float-right {
                float: right;
            }
            
            .fcc-card {
                border-radius: 10px;
                box-shadow: 0 2px 6px 0 rgb(218 218 253 / 65%), 0 2px 6px 0 rgb(206 206 238 / 54%);
                border-width: 4px !important;
                background-color: white;
                margin-top: 20px;
                margin-left: 10px;
            }
            
            .calendar-header {
                font-size: 2em;
                width: 97%;
                padding: 5px 15px 5px;
                cursor: pointer;
            }
            
            .calendar-header1 {
                color: cornflowerblue;
            }
            
            .calendar {
                width: 80%;
                height: 46em;
                min-width: 900px;
                padding-left: 10px;
                padding-top: 10px;
            }
            
            .calendar-day-box {
                width: 13.7%;
                border-radius: 10px;
                border: 1px solid var(--color-border);
                cursor: pointer;
                margin: 2px;
            }
            
            .calendar-day-box-color {
                color: #2f4f4f;
            }
            
            .calendar-day-box-border {
                border-radius: 10px;
                border: 1px solid #000000;              
            }
            
            .calendar-day-box:hover {
                color: var(--color-mintcream);
                background-color: var(--color-lightblue) !important;
            }
            
            .btn-up-down {
                border-radius: 10px;
                border: 1px solid var(--color-border);
            }
            
            .fcc-small-card {
                border-radius: 3px;
                height: 30px;
                padding-left: 3px; 
                width: 100px;
                margin-top: 2px;                           
            }
            
            .event-info {
                color: mintcream;
                margin: 5px;
                font-size: 1.5em;
                text-align: center;
                background: url(./images/banner02.png) no-repeat 1% / 101%;
            }
            </style>
            
            <div>
                <div id="page` + this.pageId + `_currentDate" class="fcc-card calendar-header calendar-header1" onclick="` + owner + `.goToTodayDate(this)"></div>                            
            </div>
            
            <div class="fcc-card calendar-header" style="height: 36px;">
                <div class="float-left" style="margin-top: 6px;">
                    <div id="page` + this.pageId + `_month_up" class="float-left" style="padding-right: 5px;" onclick="` + owner + `.monthUp()">
                        <img src="./images/small_up.png" alt=""/>                    
                    </div>
                    <div id="page` + this.pageId + `_month_down" class="float-left" style="padding-right: 5px;" onclick="` + owner + `.monthDown()">
                        <img src="./images/small_down.png" alt=""/>                    
                    </div>
                </div>
                <div id="page` + this.pageId + `_currentMonth" class="float-left" style="width: 140px; margin-left: 5px;"></div>
                <div class="float-left" style="margin-top: 6px;">
                    <div id="page` + this.pageId + `_year_up" class="float-left" style="padding-right: 5px;" onclick="` + owner + `.yearUp()">
                        <img src="./images/small_up.png" alt=""/>                    
                    </div>
                    <div id="page` + this.pageId + `_year_down" class="float-left" style="padding-right: 5px;" onclick="` + owner + `.yearDown()">
                        <img src="./images/small_down.png" alt=""/>                    
                    </div>
                </div>                                  
                <div id="page` + this.pageId + `_currentYear" class="float-left" style="width: 60px; margin-left: 5px;: "></div>
                
                <div class="float-left" style="margin-left: 20px; cursor: pointer;" onclick="` + owner + `.goToPrevMonth()">
                    <img src="./images/up.png" alt=""/>       
                </div>
                <div class="float-left" style="margin-left: 15px; cursor: pointer;" onclick="` + owner + `.goToNextMonth()">
                    <img src="./images/down.png" alt=""/>
                </div>
            </div>            

            <div>
                <div id="page` + this.pageId + `_calendar" class="float-left fcc-card calendar"></div>
                <div id="page` + this.pageId + `_info" class="float-left fcc-card" style="height: 46.5em; width: 17.6%;">
                    <div>
                        <div class="event-info">События и мероприятия</div>
                        <!--div style="margin-bottom: 5px;">
                            <button type="button" onclick="ModalWindow.show('Some text in the Modal Window...<br>Some text in the Modal Window...');">Добавить уведомление</button>
                        </div-->
                        <div id="page` + this.pageId + `_info_content"></div>                        
                    </div>
                </div>
            </div>
            
            <!-- DAY TEMPLATE -->
            <script type="text/html" id="page` + this.pageId + `_day_template">
                <div id="page` + this.pageId + `_parent" class="float-left calendar-day-box" style="min-width: 150px; min-height: 100px;" onclick="` + owner + `.selectDay(this)">
                    <div class="float-left">
                        <div id="page` + this.pageId + `_day" style="font-size: 3em; margin: 10px;"></div>
                        <div id="page` + this.pageId + `_day_name" class="float-right" style="font-size: 1.5em"></div>
                    </div>
                    <div id="page` + this.pageId + `_schedule" class="float-left schedule"></div>
                </div>
            </script>
            <!-- SMALL CARD TEMPLATE -->
            <script type="text/html" id="page` + this.pageId + `_event_template">
                <div id="page` + this.pageId + `_event_card" class="fcc-small-card" onmouseover="Calendar.hideEvent(this)" onmouseout="Calendar.showEvents(this)">
                    <div id="page` + this.pageId + `_event_card_type" style="font-size: 0.8em;"></div>                    
                    <div id="page` + this.pageId + `_event_card_name" class="float-right" style="font-size: 0.7em; margin-top: 1px; margin-right: 4px;"></div>
                </div>
            </script>
            <!-- DAY INFO TEMPLATE -->
            <script type="text/html" id="page` + this.pageId + `_event_info_template">
                <div id="page` + this.pageId + `_info_box" style="padding-top: 5px;">
                     <div>
                        <div id="page` + this.pageId + `_info_type" class="float-left" style="text-indent: 5px; font-weight: bold;"></div>
                        <div class="float-right" style="margin-top: -11px; margin-right: 10px; cursor: pointer">
                            <img id="page` + this.pageId + `_info_img" src="./images/notification.png" title="Отключить"/>
                        </div>
                     </div>
                     <div id="page` + this.pageId + `_info_time" style="text-indent: 70%; margin-right: 5px; color: #ff00ff"></div>
                     <div id="page` + this.pageId + `_info_name" style="border-bottom: 1px solid #dee2e6; text-indent: 5px; padding-bottom: 2px; font-size: 0.95em;"></div>
                </div>
            </script>
        `;
    }

    hasHolidayEvent(day, month, year) {
        for(let i = 0; i <= this.yearEvents.length - 1; i++) {
            if(this.yearEvents[i].year === parseInt(year)) {
                for(let j = 0; j <= this.yearEvents[i].holiday.length - 1; j++) {
                    if(this.yearEvents[i].holiday[j] === "e-" + day + "." + month + "." + year) {
                        return true;
                    }
                }
            }
        }
    }

    hasWorkingEvent(day, month, year) {
        for(let i = 0; i <= this.yearEvents.length - 1; i++) {
            if(parseInt(this.yearEvents[i].year) === parseInt(year)) {
                for(let j = 0; j <= this.yearEvents[i].working.length - 1; j++) {
                    if(this.yearEvents[i].working[j] === "e-" + day + "." + month + "." + year) {
                        return true;
                    }
                }
            }
        }
    }

    showDayEvents(pageId) {
        let count = 1;

        const infoContentElement = $("#page" + this.pageId + "_info_content");
        infoContentElement.empty();

        this.events.forEach((event, index) => {
            const startDate = Calendar.rotateDate(event.start.split(" ")[0]);
            const finishDate = Calendar.rotateDate(event.finish.split(" ")[0]);

            if((moment(startDate).isSame(this.selectedDate) || moment(this.selectedDate).isAfter(startDate)) && (moment(finishDate).isSame(this.selectedDate) || moment(this.selectedDate).isBefore(finishDate))) {
                infoContentElement.append(Page.template("page" + this.pageId + "_event_info_template"));

                $("#page" + this.pageId + "_info_box").attr("id", "page" + this.pageId + "_info_box_" + index);
                if(count % 2 === 0) {
                    $("#page" + this.pageId + "_info_box_" + index).css("background-color", "#f8f8ff");
                }

                $("#page" + this.pageId + "_info_type").attr("id", "page" + this.pageId + "_info_type_" + index);
                $("#page" + this.pageId + "_info_img").attr("id", "page" + this.pageId + "_info_img_" + index);

                const infoTypeElement = $("#page" + this.pageId + "_info_type_" + index);

                switch (parseInt(event.type)) {
                    case 0:
                        infoTypeElement.html(event.typeName);
                        $("#page" + this.pageId + "_info_img_" + index).css("visibility", "hidden");
                        break;
                    case 1:
                        infoTypeElement.html(event.typeName);
                        $("#page" + this.pageId + "_info_img_" + index).css("visibility", "visible");
                        break;
                    default:
                        infoTypeElement.html("Неизвестный тип");
                }

                $("#page" + this.pageId + "_info_time").attr("id", "page" + this.pageId + "_info_time_" + index);
                $("#page" + this.pageId + "_info_time_" + index).html(event.start.split(" ")[1] + " - " + event.finish.split(" ")[1]);

                $("#page" + this.pageId + "_info_name").attr("id", "page" + this.pageId + "_info_name_" + index);
                $("#page" + this.pageId + "_info_name_" + index).html(event.name);

                count++;
            }
        });
    }

    goToTodayDate(element) {
        const selectedElement = $("#" + element.id);
        const selectedDate = moment(selectedElement.attr("year") + "-" + selectedElement.attr("month") + "-" + selectedElement.attr("day")).format("YYYY-MM-DD");

        this.refreshData(this.owner, selectedDate);
    }

    monthUp() {
        const splitDate = this.selectedDate.split("-");

        let prevMonth = parseInt(splitDate[1]) - 1;
        if(prevMonth === 0) {
            prevMonth = 12;
        }

        this.selectedDate = splitDate[0] + "-" + String(prevMonth).padStart(2, "0") + "-" + splitDate[2];

        this.refreshData(this.owner, this.selectedDate);
    }

    monthDown() {
        const splitDate = this.selectedDate.split("-");

        let nextMonth = parseInt(splitDate[1]) + 1;
        if(nextMonth === 13) {
            nextMonth = 1;
        }

        this.selectedDate = splitDate[0] + "-" + String(nextMonth).padStart(2, "0") + "-" + splitDate[2];

        this.refreshData(this.owner, this.selectedDate);
    }

    yearUp() {
        const splitDate = this.selectedDate.split("-");

        this.selectedDate = (parseInt(splitDate[0]) - 1) + "-" + splitDate[1] + "-" + splitDate[2];

        this.refreshData(this.owner, this.selectedDate);
    }

    yearDown() {
        const splitDate = this.selectedDate.split("-");

        this.selectedDate = (parseInt(splitDate[0]) + 1) + "-" + splitDate[1] + "-" + splitDate[2];

        this.refreshData(this.owner, this.selectedDate);
    }

    goToPrevMonth() {
        const splitDate = this.selectedDate.split("-");

        let prevMonth = parseInt(splitDate[1]) - 1;
        let prevYear = parseInt(splitDate[0]);
        if(prevMonth === 0) {
            prevMonth = 12;
            prevYear = prevYear - 1;
        }

        this.selectedDate = prevYear + "-" + String(prevMonth).padStart(2, "0") + "-" + splitDate[2];

        this.refreshData(this.owner, this.selectedDate);
    }

    goToNextMonth() {
        const splitDate = this.selectedDate.split("-");

        let nextMonth = parseInt(splitDate[1]) + 1;
        let nextYear = parseInt(splitDate[0]);
        if(nextMonth === 13) {
            nextMonth = 1;
            nextYear = nextYear + 1;
        }

        this.selectedDate = nextYear + "-" + String(nextMonth).padStart(2, "0") + "-" + splitDate[2];

        this.refreshData(this.owner, this.selectedDate);
    }

    selectDay(element) {
        const selectedElement = $("#" + element.id);
        const clearedElements = $(".calendar-day-box");

        clearedElements.removeClass("calendar-day-box-color");
        clearedElements.removeClass("calendar-day-box-border");

        selectedElement.addClass("calendar-day-box-color");
        selectedElement.addClass("calendar-day-box-border");

        this.selectedDate = moment(selectedElement.attr("year") + "-" + selectedElement.attr("month") + "-" + selectedElement.attr("day")).format("YYYY-MM-DD");

        if(selectedElement.attr("owner") === "false") {
            this.refreshData(this.owner, this.selectedDate);
        }

        this.showDayEvents();
    }

    addEventOnCalendar(event, parentPageId, eventIndex) {
        const calendarChildren =  $("#page" + parentPageId + "_calendar").children(".calendar-day-box");
        let eventColor = colors[this.currentEventIndex];

        this.currentEventIndex++;

        calendarChildren.each(function(index, element){
            const startDate = Calendar.rotateDate(event.start.split(" ")[0]);
            const finishDate = Calendar.rotateDate(event.finish.split(" ")[0]);

            const elementDate = $(this).attr("year") + "-" + $(this).attr("month") + "-" + $(this).attr("day");

            if((moment(startDate).isSame(elementDate) || moment(elementDate).isAfter(startDate)) && (moment(finishDate).isSame(elementDate) || moment(elementDate).isBefore(finishDate)) && parseInt($(this).attr("work")) === 1) {
                $(this).children(".schedule:first").append(Page.template("page" + parentPageId + "_event_template"));

                $("#page" + parentPageId + "_event_card").attr("id", "page" + parentPageId + "_event_card_" + $(this).attr("index") + "_" + eventIndex);
                const eventCardElement = $("#page" + parentPageId + "_event_card_" + $(this).attr("index") + "_" + eventIndex);
                eventCardElement.attr("event_id", event.id);
                eventCardElement.addClass("event-id-" + event.id);

                $("#page" + parentPageId + "_event_card_type").attr("id", "page" + parentPageId + "_event_card_type_" + $(this).attr("index") + "_" + eventIndex);
                const typeElement = $("#page" + parentPageId + "_event_card_type_" + $(this).attr("index") + "_" + eventIndex);

                $("#page" + parentPageId + "_event_card_name").attr("id", "page" + parentPageId + "_event_card_name_" + $(this).attr("index") + "_" + eventIndex);
                const nameElement = $("#page" + parentPageId + "_event_card_name_" + $(this).attr("index") + "_" + eventIndex);

                const eventType = parseInt(event.type);

                if(Calendar.isAllowed(eventType)) {
                    switch (eventType) {
                        case 0:
                            eventCardElement.css("background-color", eventColor);
                            eventCardElement.css("color", "#f5ffff");

                            break;
                        case 1:
                            eventCardElement.css("background-color", "#7cfc00");
                            eventCardElement.css("color", "#2f4f4f");

                            break;
                    }

                    typeElement.html(event.typeName);

                    const startParts = event.start.split(" ");
                    const finishParts = event.finish.split(" ");

                    nameElement.html(startParts[1] + " - " + finishParts[1]);
                }
            }
        });
    }

    getNotifications() {
        let userIdParameter = "";
        const pickedId = GlobalPage.getPickedUserId();

        if(pickedId !== null) {
            userIdParameter = "&user_id=" + pickedId;
        }

        const instance = this;

        const dates = Calendar.getStartFinishDates(this.pageId);

        $.ajax({
            url: this.dataUrl + "&start=" + dates.start + "&finish=" + dates.finish + userIdParameter,
            async: false,
            type: "GET",
            dataType: "json",
            success: function (data) {
                if(data.errorMessage.indexOf("#") < 0) {
                    instance.events = data.events;

                    instance.events.forEach((event, index) => {
                        instance.addEventOnCalendar(event, instance.pageId, index);
                    });

                    instance.showDayEvents();
                } else {
                    console.log("Error: " + data.errorMessage);
                }
            },
            error: function(error) {
                console.log("State: " + error.readyState + " Response: " + error.response + " ResponseText: " + error.responseText + " Status: " + error.status);
            }
        });
    }

    // STATIC METHODS
    static isAllowed(type) {
        switch (type) {
            case 0:
                return true;
            case 1:
                return true;
            default:
                return false;
        }
    }

    static showEvents() {
        $(".fcc-small-card").css("visibility", "visible");
    }

    static hideEvent(element) {
        $(".fcc-small-card").css("visibility", "hidden");

        const selectedElement = $("#" + element.id);

        $(".event-id-" + selectedElement.attr("event_id")).css("visibility", "visible");
    }

    static getDaysMap(date) {
        this.selectedDate = moment(date).format("YYYY-MM-DD");

        const daysList = [];

        let firstDayOfWeek = moment(date).startOf("month").day();
        if(firstDayOfWeek === 0) {
            firstDayOfWeek = 7;
        }

        let currentDate =  moment(date).startOf("month").subtract(firstDayOfWeek - 1, 'days');

        let dayCounter = 1;

        if(firstDayOfWeek !== 1) {
            for (let i = firstDayOfWeek - 1; i > 0; i--) {
                const element = {};
                element.day = currentDate.format("DD");
                element.month = currentDate.format("MM");
                element.year = currentDate.format("YYYY");
                element.dayOfWeek = currentDate.day();
                element.date = moment(element.day + "." + element.month + "." + element.year, "DD.MM.YYYY");
                element.owner = false;

                daysList.push(element);

                currentDate = currentDate.add(1, 'days');

                dayCounter++;
            }
        }

        const lastDay = parseInt(moment(date).endOf('month').format("DD"));

        for(let i = 1; i <= lastDay; i++) {
            const element = {};
            element.day = String(i).padStart(2, "0");
            element.month = moment(date).format("MM");
            element.year = moment(date).format("YYYY");
            element.date = moment(element.day + "-" + element.month + "-" + element.year, "DD-MM-YYYY");
            element.dayOfWeek = moment(element.date).day();
            element.owner = true;

            daysList.push(element);

            dayCounter++;
        }

        let dayNumber = 1;

        for(let i = dayCounter + 1; i <= 43; i++) {
            const dayOfNextMonth = moment(date).endOf('month').add(dayNumber, "days");

            const element = {};
            element.day = dayOfNextMonth.format("DD");
            element.month = dayOfNextMonth.format("MM");
            element.year = dayOfNextMonth.format("YYYY");
            element.dayOfWeek = dayOfNextMonth.day();
            element.date = moment(element.day + "-" + element.month + "-" + element.year, "DD-MM-YYYY");
            element.owner = false;

            daysList.push(element);

            dayNumber++;
        }

        return daysList;
    }

    static getDayName(date) {
        const dayOfWeek = moment(date).day();

        switch (dayOfWeek) {
            case 0:
                return "ВС";
            case 1:
                return "ПН";
            case 2:
                return "ВТ";
            case 3:
                return "СР";
            case 4:
                return "ЧТ";
            case 5:
                return "ПТ";
            default:
                return "СБ";
        }
    }

    static rotateDate(date) {
        const dateParts = date.split(".");

        return dateParts[2] + "-" + dateParts[1] + "-" + dateParts[0];
    }

    static getStartFinishDates(pageId) {
        const calendarElement = $("#page" + pageId + "_calendar");

        const result = {};

        const firstDayElement = calendarElement.children(":first");
        const lastDayElement = calendarElement.children(":last");

        result.start =  firstDayElement.attr("day") + "." + firstDayElement.attr("month") + "." + firstDayElement.attr("year");
        result.finish =  lastDayElement.attr("day") + "." + lastDayElement.attr("month") + "." + lastDayElement.attr("year");

        return result;
    }
}