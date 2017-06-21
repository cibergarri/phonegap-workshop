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
            if (this.homePage) {
                this.slidePage(this.homePage);
            } else {
                this.homePage = new HomeView(this.store).render();
                this.slidePage(this.homePage);
            }
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

    slidePage: function(page) {
        var currentPageDest,
            self = this;
    
        // If there is no current page (app just started) -> No transition: Position new page in the view port
        if (!this.currentPage) {
            $(page.el).attr('class', 'page stage-center');
            $('body').append(page.el);
            this.currentPage = page;
            return;
        }
    
        // Cleaning up: remove old pages that were moved out of the viewport
        $('.stage-right, .stage-left').not('.homePage').remove();

        if (page === app.homePage) {
            // Always apply a Back transition (slide from left) when we go back to the search page
            $(page.el).attr('class', 'page stage-left');
            currentPageDest = "stage-right";
        } else {
            // Forward transition (slide from right)
            $(page.el).attr('class', 'page stage-right');
            currentPageDest = "stage-left";
        }
    
        $('body').append(page.el);
    
        // Wait until the new page has been added to the DOM...
        setTimeout(function() {
            // Slide out the current page: If new page slides from the right -> slide current page to the left, and vice versa
            $(self.currentPage.el).attr('class', 'page transition ' + currentPageDest);
            // Slide in the new page
            $(page.el).attr('class', 'page stage-center transition');
            self.currentPage = page;
        });
    
    },
};

app.initialize();