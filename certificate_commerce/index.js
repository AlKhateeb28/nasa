var persons = [];
var pagingSize = 20;

class IndexPage extends Object {
    constructor() {
        super();
    }

    static initialize() {
        $("#grid").append(Common.getTemplate("grid_row_template"));

        $("#grid_box").append(Common.getTemplate("card_template"));

        $("#card_find").on("keypress", function (event) {
            if (event.which == 13) {
                event.preventDefault();

                IndexPage.onFind();
            }
        });

        $("#card_table").append(Common.getTemplate("header_row_template"));
    }

    static onFind() {
        const findElement = $("#card_find");

        if(findElement.val().length < 3) {
            alert("Слишком короткая строка. Введите более 2 символов!");
        }

        $("#loader").css("visibility", "visible");

        $.ajax({
            url: "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/custom_web_template.html?object_id=7134264789160591460&name=" + findElement.val() + "&code=" + $("#type").val(),
            async: true,
            type: "GET",
            dataType: "json",
            success: function (data) {
                if(data.errorMessage.indexOf("#") < 0) {
                    IndexPage.createPersons(data);

                    const tableElement = $("#card_table");

                    tableElement.empty();
                    tableElement.append(Common.getTemplate("header_row_template"));

                    IndexPage.show20Rows();

                    //$("#paging").css("padding-top", IndexPage.getPagingOffset(0));

                    IndexPage.showPageMessage(0);

                    $("#page_box").empty();
                    IndexPage.showPageButtons(1);
                } else {
                    console.log("Error: " + data.errorMessage.indexOf("#"));
                }

                $("#loader").css("visibility", "hidden");
            },
            error: function(error) {
                console.log("State: " + error.readyState + " Response: " + error.response + " ResponseText: " + error.responseText + " Status: " + error.status);

                $("#loader").css("visibility", "hidden");
            }
        });
    }

    static createPersons(data) {
        persons = [];

        data.persons.forEach((person, index) => {
            const element = {};
            element.id = person.id;
            element.fio = person.fio;
            element.email = person.email;
            element.positionName = person.positionName;
            element.inn = person.inn;
            element.organizationName = person.organizationName;

            persons.push(element);
        });
    }

    static show20Rows() {
        persons.forEach((person, index) => {
            if (index < pagingSize) {
                IndexPage.createRow(person, index);
            }
        });
    }

    static createRow(person, index) {
        $("#card_table").append(Common.getTemplate("member_row_template"));

        $("#row").attr("id", "row_" + index);
        $("#row_" + index).attr("data-id", person.id);

        $("#fio").attr("id", "fio_" + index);
        $("#fio_" + index).html(person.fio);

        $("#email").attr("id", "email_" + index);
        $("#email_" + index).html(person.email);

        $("#position").attr("id", "position_" + index);
        $("#position_" + index).html(person.positionName);

        $("#inn").attr("id", "inn_" + index);
        $("#inn_" + index).html(person.inn);

        $("#name").attr("id", "name_" + index);
        $("#name_" + index).html(person.organizationName);
    }

    static getPagingOffset(offset) {
        let start = pagingSize * offset;
        let finish = start + pagingSize;

        finish--;

        let count = 0;

        for(let i = 0; i < persons.length; i++) {
            if(i >= start && i <= finish) {
                count++;
            }
        }

        return 540 - (count * 27);
    }

    static showPageMessage(offset) {
        let start = pagingSize * offset;
        let finish = start + pagingSize;

        start++;

        const personsLength = persons.length;

        if(personsLength <= finish) {
            finish = personsLength;
        }

        $("#page_message").html("с " + start + " по " + finish + " запись из " + personsLength);
    }

    static showPageButtons(selectedIndex) {
        const personsLength = persons.length;

        if(personsLength > pagingSize) {
            const pageCount = Math.ceil(personsLength / pagingSize);

            for(let i = 0; i < pageCount; i++) {
                if(i === 6) {
                    $("#page_box").append(Common.getTemplate("page_button_template"));

                    $("#page_button").attr("id", "page_button_" + i);

                    const buttonElement = $("#page_button_" + i);

                    buttonElement.html("+ " + (personsLength - i * pagingSize) + " страниц");
                    buttonElement.attr("title", "Воспользуйтесь поиском");

                    buttonElement.addClass("unselected-button");
                    buttonElement.addClass("last-page-button");

                    buttonElement.on( "click", function() {
                        $("#card_find").focus();
                    });

                    break;
                } else {
                    $("#page_box").append(Common.getTemplate("page_button_template"));

                    $("#page_button").attr("id", "page_button_" + i);

                    const buttonElement = $("#page_button_" + i);

                    buttonElement.addClass("fake-btn");
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

        const buttonGroupElements = $(".fake-btn");
        buttonGroupElements.removeClass("selected-button");
        buttonGroupElements.addClass("unselected-button");

        selectedButton.removeClass("unselected-button");
        selectedButton.addClass("selected-button");

        const offset = parseInt(selectedButton.html()) - 1;

        IndexPage.showPageMessage(offset);

        IndexPage.showPaging20Rows(offset);

        /*$("#paging_" + groupId).css(
            "padding-top",
            IndexPage.getPagingOffset(groupId, parseInt(selectedButton.html()) - 1, localGroup)
        );*/
    }

    static showPaging20Rows(offset) {
        const start = pagingSize * parseInt(offset);
        let finish = start + pagingSize;

        finish--;

        const tableElement = $("#card_table");
        tableElement.empty();
        tableElement.append(Common.getTemplate("header_row_template"));


        persons.forEach((person, index) => {
            if (index >= start && index <= finish) {
                IndexPage.createRow(person, index);
            }
        });

        const top = IndexPage.getPagingOffset(offset);

        $("#paging").css("margin-top", top + "px");
    }

    static goToCommercialCertificates(element) {
        const selectedRow = $("#" + element.id);

        $(".row").removeClass("selected-row");
        selectedRow.addClass("selected-row");

        alert(selectedRow.attr("data-id"));
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