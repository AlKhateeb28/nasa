const blackNameList = [
    "ГОСУДАРСТВЕННОЕ УНИТАРНОЕ ПРЕДПРИЯТИЕ ГОРОДА ",
    "ГОСУДАРСТВЕННОЕ УНИТАРНОЕ ПРЕДПРИЯТИЕ ГОРОДА МОСКВЫ ",
    "ОРДЕНА ЛЕНИНА И ОРДЕНА ТРУДОВОГО КРАСНОГО ЗНАМЕНИ ",
    "ЗАКРЫТОЕ АКЦИОНЕРНОЕ ОБЩЕСТВО ",
    "АКЦИОНЕРНОЕ ОБЩЕСТВО ",
    "ОБЩЕСТВО С ОГРАНИЧЕННОЙ ОТВЕТСТВЕННОСТЬЮ ",
    "АВТОНОМНАЯ НЕКОММЕРЧЕСКАЯ ОРГАНИЗАЦИЯ ",
    "ОБЩЕСТВО С ОГРАНИЧЕННОЙ ОТВЕТСТВЕННОСТЬЮ ",
    "АВТОНОМНОЕ УЧРЕЖДЕНИЕ ЧУВАШСКОЙ РЕСПУБЛИКИ ",
    "МИНИСТЕРСТВА ЭКОНОМИЧЕСКОГО РАЗВИТИЯ, ПРОМЫШЛЕННОСТИ И ТОРГОВЛИ ЧУВАШСКОЙ РЕСПУБЛИКИ",
    "ФЕДЕРАЛЬНОЕ ГОСУДАРСТВЕННОЕ УНИТАРНОЕ ПРЕДПРИЯТИЕ ",
    "ГОСУДАРСТВЕННОЕ АВТОНОМНОЕ НАУЧНОЕ УЧРЕЖДЕНИЕ ",
    "МУНИЦИПАЛЬНОЕ ПРЕДПРИЯТИЕ ГОРОДА ВЛАДИВОСТОКА ",
    "ФЕДЕРАЛЬНОЕ КАЗЕННОЕ ПРЕДПРИЯТИЕ ",
    "МОСКОВСКИЙ ОРДЕНА ЛЕНИНА И ОРДЕНА ТРУДОВОГО КРАСНОГО ЗНАМЕНИ "
];

class Common extends Object {
    constructor() {
        super();
    }

    static getTemplate(templateId) {
        return $("#" + templateId).html();
    }

    static normalizeOrganisationName(name) {
        if(name.indexOf('"') >= 0) {
            name = name.toUpperCase().substring(name.indexOf('"'), name.lastIndexOf('"') + 1);
        } else if(name.indexOf('«') >= 0) {
            name = name.toUpperCase().substring(name.indexOf('«'), name.lastIndexOf('»') + 1);
        }

        blackNameList.forEach((element, index) => {
            name.replaceAll(element, "");
        });

        return name;
    }
}