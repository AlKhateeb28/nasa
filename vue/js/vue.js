/*var vueApp = new Vue({
    el: "#app",
    created: function () {

    },
    mounted: function () {
        var vueApp = this;
        //that.initUserTokens();
    },
    data: {
        name: "Test message"
    },
    methods: {
        //wsConnect: function () {
          //  var vueApp = this;
        //},
    }
});*/

const app = Vue.createApp({});

app.component('component-a', {
    template: '<h2>Component A</h2>'
});
app.component('component-b', {
    template: '<h2>Component B</h2>'
});

$(document).ready(function() {
    app.mount('#app');

    alert(Vue.getCurrentInstance().appContext.app);

    //$("#threadBox").append("<div class=thread'>{{vueApp.$root.data()}}</div>");
});