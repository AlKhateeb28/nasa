let certificates = [];

let currentCertificateIndex = 1;
let totalCertificateIndex = 1;

function initialize() {

}

function clearCertificateForm() {
    $("#number").html("");
    $("#fio").html("");

    $("#delivery").html("");
    $("#delivery").removeClass("green-status");
    $("#delivery").removeClass("red-status");

    $("#expires").html("");
    $("#expires").removeClass("orange-status");
    $("#expires").removeClass("red-status");

    $("#status").css("visibility", "hidden");

    $("#withdrawn").css("visibility", "hidden");

    $("#prev").css("visibility", "hiddden");
    $("#next").css("visibility", "hiddden");
}

function fillCertificateForm(certificate) {
    clearCertificateForm();

    $("#number").html(certificate.serial + "-" + certificate.number + "/" + certificate.year);

    $("#fio").html(certificate.fullname);

    $("#delivery").html(certificate.deliveryDate);

    $("#expires").html(certificate.expireDate);
    if (certificate.expireDate !== null) {
        const expireDate = moment(certificate.expireDate, "DD.MM.YYYY");
        const today = moment();

        const diff = expireDate.diff(today, "days");

        if (diff >= 0 && diff <= 45) {
            $("#expires").removeClass("red-status");
            $("#expires").addClass("orange-status");

            $("#expires").attr("title", "Срок действия сертификата скоро истечет");
        } else if (diff < 0) {
            $("#expires").removeClass("orange-status");
            $("#expires").addClass("red-status");

            $("#expires").attr("title", "Сертификат просрочен");
        } else {
            $("#expires").attr("title", "");
        }
    }

    if (certificate.valid) {
        $("#status").removeClass("red-status");
        $("#status").addClass("green-status");

        $("#status").html("Действителен");
    } else {
        $("#status").removeClass("green-status");
        $("#status").addClass("red-status");

        $("#status").html("Недействителен");
    }

    $("#status").css("visibility", "visible");

    if (certificate.withdrawn) {
        $("#withdrawn").css("visibility", "visible");
    } else {
        $("#withdrawn").css("visibility", "hidden");
    }
}

function find() {
    certificates = [];
    currentCertificateIndex = 1;
    totalCertificateIndex = 1;

    beforeReload();

    clearCertificateForm();

    $.ajax({
        url: "https://xn--d1auh.xn--b1aedfedwqbdfbnzkf0oe.xn--p1ai/custom_web_template.html?object_id=7335330126860569305&number=" + $("#find").val(),
        async: true,
        type: "GET",
        dataType: "json",
        success: function (data) {
            if (data.errorMessage.indexOf("#") < 0) {
                if (data.total === 0) {
                    $("#total").html(0);
                    $("#total").attr("title", "Найдено 0 сертификатов");

                    $("#prev").css("visibility", "hidden");
                    $("#next").css("visibility", "hidden");

                    $("#message").html("Сертификат <strong style='color: yellow;'>" + $("#find").val() + "</strong> не найден");
                    $("#message").css("visibility", "visible");

                    currentCertificateIndex = 1;
                    totalCertificateIndex = 1;
                } else {
                    if (data.total === 1) {
                        $("#total").html(1);
                        $("#total").attr("title", "Найден 1 сертификат");

                        $("#prev").css("visibility", "hidden");
                        $("#next").css("visibility", "hidden");

                        currentCertificateIndex = 1;
                        totalCertificateIndex = 1;
                    } else {
                        $("#total").html("1/" + data.total);
                        if(data.total <= 4) {
                            $("#total").attr("title", "Найдено " + data.total + " сертификата");
                        } else {
                            $("#total").attr("title", "Найдено " + data.total + " сертификатов");
                        }

                        $("#prev").css("visibility", "hidden");
                        $("#next").css("visibility", "visible");

                        currentCertificateIndex = 1;
                        totalCertificateIndex = data.total;
                    }
                    
                    $("#message").css("visibility", "hidden");

                    data.sertificates.forEach((element, index) => {
                        const certificate = {};
                        certificate.serial = element.serial;
                        certificate.number = element.number;
                        certificate.year = element.year;
                        certificate.deliveryDate = element.deliveryDate;
                        certificate.expireDate = element.expireDate;
                        certificate.valid = element.valid;
                        certificate.fullname = element.fullname;
                        certificate.withdrawn = element.withdrawn;
                        certificate.diff = element.diff;

                        certificates.push(certificate);

                        if (index === 0) {
                            fillCertificateForm(certificates[0]);
                        }
                    });
                }
            } else {
                console.log("Error");
                console.log(data.errorMessage);
            }

            afterReload();
        },
        error: function (error) {
            afterReload();

            console.log("Error");
            console.log(error);
            //onError(7257828458375147659);
        }
    });
}

function beforeReload() {
    $("#wait_caption").html("Ищем...")
    $("#wait").css("display", "block");
}

function afterReload() {
    $("#wait").css("display", "none");
}

function goPrev() {
    currentCertificateIndex--;

    $("#next").css("visibility", "visible");

    if (currentCertificateIndex === 1) {
        $("#prev").css("visibility", "hidden");

    }

    $("#total").html(currentCertificateIndex + "/" + totalCertificateIndex)

    fillCertificateForm(certificates[currentCertificateIndex - 1]);
}

function goNext() {
    currentCertificateIndex++;

    $("#prev").css("visibility", "visible");

    if (currentCertificateIndex === totalCertificateIndex) {
        $("#next").css("visibility", "hidden");
    }

    $("#total").html(currentCertificateIndex + "/" + totalCertificateIndex)

    fillCertificateForm(certificates[currentCertificateIndex - 1]);
}