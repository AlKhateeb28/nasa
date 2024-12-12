function getPage1ChartOption() {
    return {
        series: [{
            name: "ФЦК",
            data: []
        }],
        fill: {
            type: "gradient",
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.7,
                opacityTo: 0.9,
                stops: [0, 99, 100],
                gradientToColors: ["#f5fffa"]
            }
        },
        chart: {
            width: 1330,
            height: 230,
            type: "area",
            toolbar: {show: false},
            zoom: {enabled: false}
        },
        dataLabels: {
            enabled: true,
            fontWeight: "normal",
            formatter: function (val) {
                return val === 0 ? "" : val;
            },
            style: {
                fontSize: "10px",
                fontWeight: "bold"
            },
            background: {
                enabled: true,
                foreColor: "#f5fffa"
            }
        },
        grid: {
            borderColor: "#d2d1d1",
            padding: {
                top: 15
            }
        },
        stroke: {
            curve: 'smooth',
            width: 3
        },
        xaxis: {
            position: "bottom",
            axisBorder: {show: false},
            axisTicks: {show: false},
            tooltip: {enabled: false},
            labels: {
                show: true,
                style: {
                    fontSize: "12px",
                    fontFamily: "'Noto Sans', sans-serif"
                }
            }
        },
        yaxis: {labels: {show: false}, axisTicks: {show: false}, axisBorder: {show: false}},
        legend: {
            labels: {
                colors: ["darkslategray"]
            }
        }
    };
}

$(document).ready(function () {
    initVisitPage(true);
});