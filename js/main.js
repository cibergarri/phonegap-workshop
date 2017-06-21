var app = {
    initialize: function() {
        var self = this;
        this.detailsURL = /^#employees\/(\d{1,})/;        
        this.store = new WebSqlStore(function() {
            $('body').html(new HomeView(self.store).render().el);
            self.route();
            //self.showAlert('Welcome to the Store', 'Info');
        });
        
        this.registerEvents()
    },
    
    registerEvents: function() {
        var self = this;
        // Check of browser supports touch events...
        var hasTouch = (document.documentElement.hasOwnProperty('ontouchstart'));
        // ... if yes: register touch event listener to change the "selected" state of the item
        // ... if not: register mouse events instead
        $('body').on(hasTouch? 'touchstart' : 'mousedown', 'a', function(event) {
            $(event.target).addClass('tappable-active');
        });
        $('body').on(hasTouch? 'touchend' : 'mouseup', 'a', function(event) {
            $(event.target).removeClass('tappable-active');
        });

        $(window).on('hashchange', $.proxy(this.route, this));
    },

    route: function() {
        var hash = window.location.hash;
        if (!hash) {
            $('body').html(new HomeView(this.store).render().el);
            return;
        }
        var match = hash.match(app.detailsURL);
        if (match) {
            this.store.findById(Number(match[1]), function(employee) {
                $('body').html(new EmployeeView(employee).render().el);
            });
        }
    },

    showAlert: function (message, title) {
        if (navigator.notification) {
            navigator.notification.alert(message, null, title, 'OK');
        } else {
            alert(title ? (title + ": " + message) : message);
        }
    },
};

app.initialize();