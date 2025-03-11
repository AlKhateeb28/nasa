var groups = [];
var pagingSize = 20;
var foundGroups = [];

function getCurrentDate() {
    const currentDate = new Date();

    return currentDate.toLocaleString("ru-RU").split(",")[0];
}

class IndexPage extends Object {
    constructor() {
        super();
    }

    static initialize() {
        $.ajax({
            url: "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/custom_web_template.html?object_id=7129411328548795350",
            async: false,
            type: "GET",
            dataType: "json",
            success: function (data) {
                if(data.errorMessage.indexOf("#") < 0) {
                    IndexPage.createGroupMembers(data);

                    groups.forEach((group, groupIndex) => {
                        $("#grid").append(Common.getTemplate("grid_row_template"));

                        $("#left_box").attr("id", "left_box_" + group.id);
                        $("#grid_box").attr("id", "grid_box_" + group.id);
                        $("#right_box").attr("id", "right_box_" + group.id);

                        if(groupIndex === 0) {
                            $("#right_box_" + group.id).append(Common.getTemplate("report_template"));
                        }

                        $("#grid_box_" + group.id).append(Common.getTemplate("card_template"));

                        $("#card").attr("id", "card_" + group.id);
                        $("#card_" + group.id).attr("data-group-id", "" + group.id);

                        $("#group").attr("id", "group_" + group.id);
                        $("#group_" + group.id).html(group.name);

                        $("#card_find").attr("id", "card_find_" + group.id);

                        const findElement = $("#card_find_" + group.id);
                        findElement.attr("data-group-id", group.id);
                        findElement.on( "keypress", function( event ) {
                            if (event.which == 13) {
                                event.preventDefault();

                                IndexPage.onFind(this);
                            }
                        } );

                        $("#card_table").attr("id", "card_table_" + group.id);
                        $("#card_table_" + group.id).append(Common.getTemplate("header_row_template"));

                        IndexPage.show20Rows(group);

                        $("#paging").attr("id", "paging_" + group.id);
                        $("#paging_" + group.id).css("padding-top", IndexPage.getPagingOffset(group.id, 0));

                        $("#page_message").attr("id", "page_message_" + group.id);
                        IndexPage.showPageMessage(group.id, 0);

                        $("#page_box").attr("id", "page_box_" + group.id);
                        IndexPage.showPageButtons(group.id, 1);
                    });
                } else {
                    console.log("Error: " + data.errorMessage.indexOf("#"));
                }
            },
            error: function(error) {
                console.log("State: " + error.readyState + " Response: " + error.response + " ResponseText: " + error.responseText + " Status: " + error.status);
            }
        });
    }

    static createGroupMembers(data) {
        data.trainerGroups.forEach((trainerGroup, groupIndex) => {
            const group = {};
            group.id = trainerGroup.groupId;
            group.name = trainerGroup.name;
            group.index = groupIndex;
            group.members = [];

            trainerGroup.members.forEach((member, index) => {
                const element = {};
                element.id = member.id;
                element.fio = member.fio;
                element.email = member.email;
                element.inn = member.inn;
                element.name = member.org_name;
                element.dismiss = member.isDismiss;

                group.members.push(element);
            });

            groups.push(group);
        });
    }

    static show20Rows(group) {
        group.members.forEach((member, index) => {
            if (index < pagingSize) {
                IndexPage.createRow("card_table_" + group.id, group.id, member, index);
            }
        });
    }

    static showPaging20Rows(groups, groupId, offset) {
        groups.forEach((group, groupIndex) => {
            if(parseInt(group.id) === parseInt(groupId)) {
                const start = pagingSize * (parseInt(offset) - 1);
                let finish = start + pagingSize;

                finish--;

                const tableElement = $("#card_table_" + group.id);
                tableElement.empty();
                tableElement.append(Common.getTemplate("header_row_template"));

                group.members.forEach((member, index) => {
                    if (index >= start && index <= finish) {
                        IndexPage.createRow("card_table_" + group.id, group.id, member, index);
                    }
                });
            }
        });
    }

    static createRow(tableId, groupId, member, index) {
        $("#" + tableId).append(Common.getTemplate("member_row_template"));

        $("#row").attr("id", "row_" + groupId + "_" + index);

        const rowElement = $("#row_" + groupId + "_" + index);
        rowElement.attr("data-id", member.id);

        $("#fio").attr("id", "fio_" + groupId + "_" + index);
        $("#fio_" + groupId + "_" + index).html(member.fio);

        $("#email").attr("id", "email_" + groupId + "_" + index);
        $("#email_" + groupId + "_" + index).html(member.email);

        $("#inn").attr("id", "inn_" + groupId + "_" + index);
        $("#inn_" + groupId + "_" + index).html(member.inn);

        $("#name").attr("id", "name_" + groupId + "_" + index);
        $("#name_" + groupId + "_" + index).html(Common.normalizeOrganisationName(member.name));

        $("#dismiss").attr("id", "dismiss_" + groupId + "_" + index);
        if(member.isDismiss) {
            rowElement.css("background-color", "#fca0b6");
            $("#dismiss_" + groupId + "_" + index).html("Да");
        }
    }

    static showPageMessage(groupId, offset, group) {
        let start = pagingSize * offset;
        let finish = start + pagingSize;

        start++;

        if(group === undefined) {
            group = IndexPage.getGroupById(groupId);
        }

        const memberLength = group.members.length;

        if(memberLength <= finish) {
            finish = memberLength;
        }

        $("#page_message_" + groupId).html("с " + start + " по " + finish + " запись из " + memberLength);
    }

    static getGroupById(groupId) {
        for(let i = 0; i < groups.length; i++) {
            if(parseInt(groups[i].id) === parseInt(groupId)) {
                return groups[i];
            }
        }
    }

    static getFoundGroupById(groupId) {
        for(let i = 0; i < foundGroups.length; i++) {
            if(parseInt(foundGroups[i].id) === parseInt(groupId)) {
                return foundGroups[i];
            }
        }
    }

    static isInSearchMode(groupId) {
        return IndexPage.getFoundGroupIndexById(groupId) !== null;
    }

    static getFoundGroupIndexById(groupId) {
        for(let i = 0; i < foundGroups.length; i++) {
            if(parseInt(foundGroups[i].id) === parseInt(groupId)) {
                return i;
            }
        }

        return null;
    }

    static showPageButtons(groupId, selectedIndex, group) {
        if(group === undefined) {
            group = IndexPage.getGroupById(groupId);
        }

        const memberLength = group.members.length;

        if(memberLength > pagingSize) {
            const pageCount = Math.round(memberLength / pagingSize) + 1;

            for(let i = 0; i < pageCount; i++) {
                if(i === 6) {
                    $("#page_box_" + groupId).append(Common.getTemplate("page_button_template"));

                    $("#page_button").attr("id", "page_button_" + groupId + "_" + i);

                    const buttonElement = $("#page_button_" + groupId + "_" + i);

                    buttonElement.html("+ " + (memberLength - i * pagingSize) + " страниц");
                    buttonElement.attr("title", "Воспользуйтесь поиском");

                    buttonElement.addClass("unselected-button");
                    buttonElement.addClass("last-page-button");

                    buttonElement.on( "click", function() {
                        $("#card_find_" + groupId).focus();
                    });

                    break;
                } else {
                    $("#page_box_" + groupId).append(Common.getTemplate("page_button_template"));

                    $("#page_button").attr("id", "page_button_" + groupId + "_" + i);

                    const buttonElement = $("#page_button_" + groupId + "_" + i);

                    buttonElement.addClass("btn-" + groupId);
                    buttonElement.attr("data-group", "" + groupId);
                    buttonElement.attr("data-index", i);
                    buttonElement.html(i + 1);

                    if(i === selectedIndex - 1) {
                        buttonElement.addClass("selected-button");
                    } else {
                        buttonElement.addClass("unselected-button");
                    }

                    if (i === 0) {
                        buttonElement.addClass("first-page-button");
                    }

                    if (i === pageCount - 1) {
                        buttonElement.addClass("last-page-button");
                    }

                    buttonElement.on( "click", function() {
                        IndexPage.onButtonClick(this);
                    });
                }
            }
        }
    }

    static onButtonClick(element) {
        const selectedButton = $("#" + element.id);

        const buttonGroupElements = $(".btn-" + selectedButton.attr("data-group"));
        buttonGroupElements.removeClass("selected-button");
        buttonGroupElements.addClass("unselected-button");

        selectedButton.removeClass("unselected-button");
        selectedButton.addClass("selected-button");

        const groupId = selectedButton.attr("data-group");

        let localGroups, localGroup;
        if(IndexPage.isInSearchMode(groupId)) {
            localGroups = foundGroups;
            localGroup = IndexPage.getFoundGroupById(groupId);
        } else {
            localGroups = groups;
            localGroup = IndexPage.getGroupById(groupId);
        }

        IndexPage.showPageMessage(groupId, parseInt(selectedButton.html()) - 1, localGroup);
        IndexPage.showPaging20Rows(localGroups, groupId, selectedButton.html());

        $("#paging_" + groupId).css(
            "padding-top",
            IndexPage.getPagingOffset(groupId, parseInt(selectedButton.html()) - 1, localGroup)
        );
    }

    static getPagingOffset(groupId, offset, group) {
        if(group === undefined) {
            group = IndexPage.getGroupById(groupId);
        }

        let start = 0;
        let finish = 0;

        if(parseInt(group.id) === parseInt(groupId)) {
            start = pagingSize * offset;
            finish = start + pagingSize;
        }

        finish--;

        let count = 0;

        for(let i = 0; i < group.members.length; i++) {
            if(i >= start && i <= finish) {
                count++;
            }
        }

        return 540 - (count * 27);
    }

    static onFind(element) {
        const findElement = $("#" + element.id);
        const groupId = findElement.attr("data-group-id");

        if(findElement.val().length === 0) {
            $("#card_table_" + groupId).empty();
            $("#page_box_" + groupId).empty();

            IndexPage.showPaging20Rows(groups, groupId, 1);
            IndexPage.showPageMessage(groupId, 0);
            IndexPage.showPageButtons(groupId, 1);

            const foundGroupIndex = IndexPage.getFoundGroupIndexById(groupId);
            if(foundGroupIndex !== null) {
                foundGroups.splice(foundGroupIndex, 1)
            }

            return;
        }

        if(findElement.val().length >= 3) {
            const tableElement = $("#card_table_" + groupId).empty();
            tableElement.append(Common.getTemplate("header_row_template"));

            const pageBoxElement = $("#page_box_" + groupId);
            pageBoxElement.empty();

            const foundGroupIndex = IndexPage.getFoundGroupIndexById(groupId);
            if(foundGroupIndex !== null) {
                foundGroups.splice(foundGroupIndex, 1);
            }

            const foundGroup = {};
            foundGroup.id = groupId;
            foundGroup.name = "";
            foundGroup.index = 0;
            foundGroup.members = [];

            const group = IndexPage.getGroupById(groupId);

            group.members.forEach((member, index) => {
                if (member.fio.toUpperCase().indexOf(findElement.val().toUpperCase()) >= 0 || member.email.toUpperCase().indexOf(findElement.val().toUpperCase()) >= 0) {
                    const element = {};
                    element.fio = member.fio;
                    element.email = member.email;
                    element.inn = member.inn;
                    element.name = member.name;
                    element.dismiss = member.dismiss;

                    foundGroup.members.push(element);
                }
            });

            foundGroups.push(foundGroup)

            IndexPage.showPaging20Rows(foundGroups, groupId, 1);
            IndexPage.showPageMessage(groupId, 0, foundGroup);
            IndexPage.showPageButtons(groupId, 1, foundGroup);
        }
    }

    static goToUserCertificate(element) {
        window.open("https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/custom_web_template.html?object_id=7124784700424928410&person_id=" + $("#" + element.id).attr("data-id"), "_blank");
    }

    static startAgent() {
        const messageBox = $("#report_message");
        messageBox.html("Выгрузка ...");
        //messageBox.css("display", "none");

        $.ajax({
            url: "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/custom_web_template.html?object_id=7129036886315589942&agent_id=7128692997944933910",
            async: false,
            type: "GET",
            dataType: "json",
            success: function (data) {
                if(data.errorMessage.indexOf("#") < 0) {
                    messageBox.html("Выгрузка завершена");
                    $("#report_message").css("display", "block");

                    const fileURL = "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/Reports/inner_trainers/dossier_vt_" + getCurrentDate() + ".xlsx";

                    var link= document.createElement('a');
                    document.body.appendChild(link);
                    link.href = fileURL;
                    link.rel = "nofollow";
                    link.click();

                    setTimeout(IndexPage.hideMessageBox, 15000);
                } else {
                    console.log("Error: " + data.errorMessage.indexOf("#"));
                }
            },
            error: function(error) {
                console.log("State: " + error.readyState + " Response: " + error.response + " ResponseText: " + error.responseText + " Status: " + error.status);
            }
        });
    }

    static hideMessageBox() {
        $("#report_message").css("display", "none");
    }

    static goHome() {
        document.location.href = "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/";
    }

    static sortData(element, type) {
        const sortElement = $("#" + element.id);
        const sortOrder = sortElement.attr("data-sort");

        let order = "none";

        if(sortOrder === "none") {
            $(".sort_image").attr("src", "./fcc/js/images/sort_none.png");
            $(".sort_image").attr("data-sort", "none");

            sortElement.attr("src", "./fcc/js/images/sort_asc.png");
            sortElement.attr("data-sort", "asc");

            order = "asc";
        } else {
            if(sortOrder === "asc") {
                sortElement.attr("src", "./fcc/js/images/sort_desc.png");
                sortElement.attr("data-sort", "desc");

                order = "desc";
            } else {
                sortElement.attr("src", "./fcc/js/images/sort_asc.png");
                sortElement.attr("data-sort", "asc");

                order = "asc";
            }
        }

        /*$("#card_table_" + groupId).empty();
        $("#page_box_" + groupId).empty();

        IndexPage.initialize(order, type)*/;
    }
}