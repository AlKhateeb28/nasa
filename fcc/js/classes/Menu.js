var menu = null;

function initializeMenu() {
    menu = new Menu();

    menu.generate();
}

class Menu extends Object {
    constructor() {
        super();
    }

    generate() {
        const menu = Menu.getMenu();

        menu.items.forEach((item, index) => {
            if(item.type === "folder") {
                Menu.addMenuItem(item);

                item.items.forEach((element, elementIndex) => {
                    Menu.addMenuItem(element, item.id);
                });

            } else if(item.type === "link") {
                Menu.addMenuItem(item);
            }

            if(item.selected) {
                const history = {};
                history.location = "item_parent_1";
                history.selected = true;

                globalPage.addHistory(history);
            }
        });
    }

    // STATIC METHODS
    static getMenu() {
        return {
            items: [
                {
                    id: 1,
                    name: "Главная",
                    type: "link",
                    image: "./images/home.png",
                    path: "",
                    selected: true,
                    action: "openPage1(1)",
                    disabled: false,
                    items: []
                },
                {
                    id: 10,
                    name: "Онлайн обучение",
                    type: "folder",
                    image: "./images/online_training.png",
                    path: "",
                    selected: false,
                    action: "openPage10(10)",
                    disabled: false,
                    items: [
                        {
                            id: 11,
                            name: "Все курсы",
                            type: "link",
                            image: "./images/all_courses.png",
                            path: "",
                            selected: false,
                            action: "Page10.goToAllCourses()",
                            disabled: false,
                            items: []
                        },
                        {
                            id: 12,
                            name: "Мои курсы",
                            type: "link",
                            image: "./images/training.png",
                            path: "",
                            selected: false,
                            action: "Page10.moveTo('page10_ec_header')",
                            disabled: false,
                            items: []
                        },
                        {
                            id: 13,
                            name: "Учебные планы",
                            type: "link",
                            image: "./images/training_plan.png",
                            path: "",
                            selected: false,
                            action: "Page10.moveTo('page10_ep_header')",
                            disabled: false,
                            items: []
                        },
                        {
                            id: 14,
                            name: "Мои Тесты",
                            type: "link",
                            image: "./images/my_test.png",
                            path: "",
                            selected: false,
                            action: "Page10.moveTo('page10_test_header')",
                            disabled: false,
                            items: []
                        },
                        {
                            id: 15,
                            name: "Вебинары",
                            type: "link",
                            image: "./images/webinar.png",
                            path: "",
                            selected: false,
                            action: "",
                            disabled: true,
                            items: []
                        }
                    ]
                },
                {
                    id: 20,
                    name: "Тренинги (очное)",
                    type: "folder",
                    image: "./images/fulltime_training.png",
                    path: "",
                    selected: false,
                    action: "openPage20(20)",
                    disabled: false,
                    items: []
                },
                {
                    id: 30,
                    name: "Банк знаний",
                    type: "folder",
                    image: "./images/bank.png",
                    path: "",
                    selected: false,
                    action: "openPage30(30)",
                    disabled: false,
                    items: [
                        {
                            id: 31,
                            name: "Материалы тренингов",
                            type: "link",
                            image: "./images/bank1.png",
                            path: "",
                            selected: false,
                            action: "Page.openLink('https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/_wt/custom_doc/doc_id/6730858711332574854')",
                            disabled: false,
                            items: []
                        },
                        {
                            id: 32,
                            name: "Обучающие решения",
                            type: "link",
                            image: "./images/bank2.png",
                            path: "",
                            selected: false,
                            action: "Page.openLink('https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/view_doc.html?mode=doc_type&custom_web_template_id=6927932762477299527&doc_id=6927927814292523559&object_id=6927932762477299527')",
                            disabled: false,
                            items: []
                        },
                        {
                            id: 33,
                            name: "Материалы для РЦК",
                            type: "link",
                            image: "./images/bank3.png",
                            path: "",
                            selected: false,
                            action: "Page.openLink('https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/_wt/custom_doc/doc_id/6978818796020395863')",
                            disabled: false,
                            items: []
                        },
                        {
                            id: 34,
                            name: "Библиотека ФЦК",
                            type: "link",
                            image: "./images/bank4.png",
                            path: "",
                            selected: false,
                            action: "Page.openLink('https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/view_doc.html?mode=main_book_shelves')",
                            disabled: false,
                            items: []
                        }
                    ]
                },
                {
                    id: 40,
                    name: "Управление обучением",
                    type: "folder",
                    image: "./images/management.png",
                    path: "",
                    selected: false,
                    action: null,
                    disabled: false,
                    items: []
                },
                {
                    id: 50,
                    name: "Мои достижения",
                    type: "folder",
                    image: "./images/my_advance.png",
                    path: "",
                    selected: false,
                    action: null,
                    disabled: false,
                    items: []
                },
                {
                    id: 60,
                    name: "Сертификаты",
                    type: "folder",
                    image: "./images/certificate.png",
                    path: "",
                    selected: false,
                    action: null,
                    disabled: false,
                    items: []
                },
                {
                    id: 70,
                    name: "Мой календарь",
                    type: "folder",
                    image: "./images/calendar.png",
                    path: "",
                    selected: false,
                    action: "openPage70(70)",
                    disabled: false,
                    items: []
                },
                {
                    id: 80,
                    name: "Помощь",
                    type: "folder",
                    image: "./images/help.png",
                    path: "",
                    selected: false,
                    action: "openPage80(80)",
                    disabled: false,
                    items: []
                },
                {
                    id: 90,
                    name: "Администратору",
                    type: "folder",
                    image: "./images/admin.png",
                    path: "",
                    selected: false,
                    action: null,
                    disabled: false,
                    items: [{
                        id: 91,
                        name: "Дашборд СДО",
                        type: "link",
                        image: "./images/report.png",
                        path: "",
                        selected: false,
                        action: "openPage91(91)",
                        items: []
                    },
                        {
                            id: 92,
                            name: "Агенты",
                            type: "link",
                            image: "./images/agents.png",
                            path: "",
                            selected: false,
                            action: "openPage92(92)",
                            items: []
                        }]
                },
                {
                    id: 500,
                    name: "Выход",
                    type: "link",
                    image: "./images/exit.png",
                    path: "",
                    selected: false,
                    action: "activeExitPage()",
                    disabled: false,
                    items: []
                }
            ]
        };
    }

    static addMenuItem(item, parentId) {
        let selectedItemClass = "";
        if (item.selected) {
            selectedItemClass = "menu-item-selected";
        }

        $("#main_menu").append(Page.template("menu_item_template"));

        $("#menu_col").attr("id", "menu_col_" + item.id);

        $("#menu_row").attr("id", "menu_row_" + item.id);
        const menuRowElement = $("#menu_row_" + item.id);

        $("#item_parent").attr("id", "item_parent_" + item.id);

        const parentItemElement = $("#item_parent_" + item.id);
        parentItemElement.addClass(selectedItemClass);
        parentItemElement.attr("parent", parentId);
        parentItemElement.attr("index", item.id);

        if(parentId !== undefined) {
            parentItemElement.css("padding-left", "30px");

            menuRowElement.addClass("parent_" + parentId);
            menuRowElement.css("display", "none");
        }
        if(item.type === "folder") {
            parentItemElement.attr("folder", "1");
            parentItemElement.attr("parent", "parent_" + item.id);
        }

        $("#item_img").attr("id", "item_img_" + item.id);
        if(item.image === "") {
            $("#item_img_" + item.id).css("display", "none");
        } else {
            $("#item_img_" + item.id).attr("src", item.image);
        }

        $("#item_caption").attr("id", "item_caption_" + item.id);
        const captionElement = $("#item_caption_" + item.id);
        captionElement.html(item.name);
        if(item.disabled) {
            captionElement.css("color", "lightgray");
        }

        if (item.selected) {
            eval(item.action);
        }
    }

    static getMenuItemById(id) {
        const menu = Menu.getMenu();

        for(let i = 0; i < menu.items.length; i++) {
            if(menu.items[i].id === id) {
                return menu.items[i];
            }

            for(let j = 0; j < menu.items[i].items.length; j++) {
                if(menu.items[i].items[j].id === id) {
                    return menu.items[i].items[j];
                }
            }
        }

        return null;
    }

    static openChildren(id) {
        const menu = Menu.getMenu();

        menu.items.forEach((item, index) => {
            if(item.id == id && item.type === "folder") {
                item.items.forEach((element, elementIndex) => {
                    $("#menu_row_" + element.id).css("display", "block");
                });
            }
        });
    }

    static activateMenuItem(element) {
        const menuElement = $("#" + element.id);

        const item = Menu.getMenuItemById(parseInt(menuElement.attr("index")));

        if(item === null || item.disabled) {
            return;
        }

        $(".menuitem").removeClass("menu-item-selected");
        menuElement.addClass("menu-item-selected");

        if(parseInt(menuElement.attr("folder")) === 1) {
            if(parseInt(menuElement.attr("opened")) === 0) {
                menuElement.attr("opened", "1");

                $("." + menuElement.attr("parent")).css("display", "block");
            } else {
                menuElement.attr("opened", "0");

                $("." + menuElement.attr("parent")).css("display", "none");
            }
        } else {
            Menu.openChildren(parseInt(menuElement.attr("parent")));

            $("#menu_row_" + menuElement.attr("index")).css("display", "block");
        }

        if(item.action !== null) {
            globalPage.addToHistory(element.id);

            eval(item.action);
        }
    }
}

$(document).ready(function () {
    initializeMenu();
});