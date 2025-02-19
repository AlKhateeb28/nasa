class Common extends Object {
    constructor() {
        super();
    }

    static getTemplate(templateId) {
        return $("#" + templateId).html();
    }
}