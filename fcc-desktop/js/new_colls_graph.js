function getCreatedCollaboratorsHourOption() {
    return {
        series: [{
            name: "muc",
            color: "#ffc107",
            data: collaborators.muc
        },
            {
                name: "остальные",
                color: "#7cfc00",
                data: collaborators.other
            }],
        chart: {
            width: "100%",
            height: 550,
            type: "area",
            toolbar: {show: false},
            zoom: {enabled: false}
        },
        dataLabels: {
            enabled: false,
            fontWeight: "normal",
            formatter: function (val) {
                return val === 0 ? "" : val;
            },
            style: {
                fontSize: "10px",
                fontFamily: "'ArnamuMonoBold', sans-serif",
                fontWeight: "normal",
                colors: ["#f5fffa"]
            }
        },
        grid: {
            borderColor: "#5b5b5b",
            padding: {
                top: 25
            }
        },
        stroke: {curve: 'smooth'},
        xaxis: {
            categories: getHourXAxisCategories(new Date().getHours()),
            position: "bottom",
            axisBorder: {show: false},
            axisTicks: {show: false},
            tooltip: {enabled: false},
            labels: {
                show: true,
                style: {
                    fontSize: "10px",
                    fontFamily: "'Noto Sans', sans-serif",
                    colors: ["blanchedalmond", "blanchedalmond", "blanchedalmond", "blanchedalmond", "blanchedalmond", "blanchedalmond",
                        "blanchedalmond", "blanchedalmond", "blanchedalmond", "blanchedalmond", "blanchedalmond", "blanchedalmond",
                        "blanchedalmond", "blanchedalmond", "blanchedalmond", "blanchedalmond", "blanchedalmond", "blanchedalmond",
                        "blanchedalmond", "blanchedalmond", "blanchedalmond", "blanchedalmond", "blanchedalmond", "blanchedalmond"
                    ]
                }
            }
        },
        yaxis: {
            labels: {
                show: true,
                style: {
                    fontSize: "10px",
                    fontFamily: "'Noto Sans', sans-serif",
                    colors: ["blanchedalmond"]
                }
            }
        },
        legend: {
            labels: {
                colors: ["#f5fffa"]
            }
        }
    };
}

function getHourXAxisCategories(hour) {
    let hourCategories = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]

    for(let i = 23; i >= 0; i--) {
        hourCategories[i] = String(hour).padStart(2, "0") + ":00";

        hour = hour - 1;

        if(hour < 0) {
            hour = 23
        }
    }

    return hourCategories;
}

function addNewCollaboratorCount(list) {
    let result = 0;

    list.forEach((hours) => {
        result += hours;
    });

    return result;
}

function getCurrentDateTime() {
    const currentDate = new Date();

    return currentDate.toLocaleString("ru-RU").split(",")[0] +
        currentDate.toLocaleString("ru-RU").split(",")[1];
}

$(document).ready(function () {
    const hourOptions = getCreatedCollaboratorsHourOption();

    createdCollsHourChart = new ApexCharts($("#createdCollsHourChart").get(0), hourOptions);
    createdCollsHourChart.render();

    $("#mucCountHour").html(addNewCollaboratorCount(collaborators.muc));
    $("#otherCountHour").html(addNewCollaboratorCount(collaborators.other));

    $("#hour_datetime").html(getCurrentDateTime());
});