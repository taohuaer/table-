(function($) {
    "use strict";

    $.jqPagination = function(el, options) {

        // To avoid scope issues, use 'base' instead of 'this'
        // to reference this class from internal events and functions.

        var base = this;

        // Access to jQuery and DOM versions of element
        base.$el = $(el);
        base.el = el;

        // get input jQuery object
        base.$input = base.$el.find('input');

        // Add a reverse reference to the DOM object
        base.$el.data("jqPagination", base);

        base.init = function() {

            base.options = $.extend({}, $.jqPagination.defaultOptions, options);

            if (base.options.max_page === null) {

                if (base.$input.data('max-page') !== undefined) {
                    base.options.max_page = base.$input.data('max-page');
                } else {
                    base.options.max_page = 1;
                }

            }


            if (base.$input.data('current-page') !== undefined && base.isNumber(base.$input.data('current-page'))) {
                base.options.current_page = base.$input.data('current-page');
            }

            //base.$input.removeAttr('readonly');

            base.updateInput(true);


            base.$input.on('focus.jqPagination mouseup.jqPagination', function(event) {

                //if (event.type === 'focus') {

                //    var current_page = parseInt(base.options.current_page, 10);

                //    $(this).val(current_page).select();

                //}

                //if (event.type === 'mouseup') {
                //    return false;
                //}

            });

            base.$input.on('blur.jqPagination keydown.jqPagination', function(event) {

                var $self = $(this),
                    current_page = parseInt(base.options.current_page, 10);
                if (event.keyCode === 27) {
                    $self.val(current_page);
                    $self.blur();
                }
                if (event.keyCode === 13) {
                    $self.blur();
                }
                if (event.type === 'blur') {
                    base.setPage($self.val());
                }

            });

            base.$el.on('click.jqPagination', 'a', function(event) {

                var $self = $(this);
                if ($self.hasClass('disabled')) {
                    return false;
                }
                if (!event.metaKey && !event.ctrlKey) {
                    event.preventDefault();
                    base.setPage($self.data('action'));
                }

            });

        };

        base.setPage = function(page, prevent_paged) {

            // return current_page value if getting instead of setting
            if (page === undefined) {
                return base.options.current_page;
            }

            var current_page = parseInt(base.options.current_page, 10),
                max_page = parseInt(base.options.max_page, 10);

            if (isNaN(parseInt(page, 10))) {

                switch (page) {

                    case 'first':
                        page = 1;
                        break;

                    case 'prev':
                    case 'previous':
                        page = current_page - 1;
                        break;

                    case 'next':
                        page = current_page + 1;
                        break;

                    case 'last':
                        page = max_page;
                        break;

                }

            }

            page = parseInt(page, 10);

            // reject any invalid page requests
            if (isNaN(page) || page < 1 || page > max_page) {

                // update the input element
                base.setInputValue(current_page);

                return false;

            }

            // update current page options
            base.options.current_page = page;
            base.$input.data('current-page', page);

            // update the input element
            base.updateInput(prevent_paged);

        };

        base.setMaxPage = function(max_page, prevent_paged) {

            // return the max_page value if getting instead of setting
            if (max_page === undefined) {
                return base.options.max_page;
            }

            // ignore if max_page is not a number
            if (!base.isNumber(max_page)) {
                console.error('jqPagination: max_page is not a number');
                return false;
            }

            // ignore if max_page is less than the current_page
            if (max_page < base.options.current_page) {
                console.error('jqPagination: max_page lower than current_page');
                return false;
            }

            // set max_page options
            base.options.max_page = max_page;
            base.$input.data('max-page', max_page);

            // update the input element
            base.updateInput(prevent_paged);

        };

        // ATTN this isn't really the correct name is it?
        base.updateInput = function(prevent_paged) {

            var current_page = parseInt(base.options.current_page, 10);

            // set the input value
            base.setInputValue(current_page);

            // set the link href attributes
            base.setLinks(current_page);

            // we may want to prevent the paged callback from being fired
            if (prevent_paged !== true) {

                // fire the callback function with the current page
                base.options.paged(current_page);


            }

        };

        base.setInputValue = function(page) {

            var page_string = base.options.page_string,
                max_page = base.options.max_page;

            // this looks horrible :-(
            page_string = page_string
                .replace("{current_page}", page)
                .replace("{max_page}", max_page);

            base.$input.val(page_string);

        };

        base.isNumber = function(n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        };

        base.setLinks = function(page) {

            var link_string = base.options.link_string,
                current_page = parseInt(base.options.current_page, 10),
                max_page = parseInt(base.options.max_page, 10);

            if (link_string !== '') {

                // set initial page numbers + make sure the page numbers aren't out of range

                var previous = current_page - 1;
                if (previous < 1) {
                    previous = 1;
                }

                var next = current_page + 1;
                if (next > max_page) {
                    next = max_page;
                }

                // apply each page number to the link string, set it back to the element href attribute
                base.$el.find('a.first').attr('href', link_string.replace('{page_number}', '1'));
                base.$el.find('a.prev, a.previous').attr('href', link_string.replace('{page_number}', previous));
                base.$el.find('a.next').attr('href', link_string.replace('{page_number}', next));
                base.$el.find('a.last').attr('href', link_string.replace('{page_number}', max_page));

            }

            // set disable class on appropriate links
            base.$el.find('a').removeClass('disabled');
            base.$el.find('a').css('opacity', '1');
            //base.$el.find('.next, .last').css('opacity', '0.3');
            if (current_page === max_page) {
                base.$el.find('.next, .last').addClass('disabled');
                base.$el.find('.next, .last').css('opacity', '0.4');
            }

            if (current_page === 1) {
                base.$el.find('.previous, .first').addClass('disabled');
                base.$el.find('.previous, .first').css('opacity', '0.4');
            }

        };

        base.callMethod = function(method, key, value) {

            switch (method.toLowerCase()) {

                case 'option':

                    // if we're getting, immediately return the value
                    if (value === undefined && typeof key !== "object") {
                        return base.options[key];
                    }

                    // set default object to trigger the paged event (legacy opperation)
                    var options = { 'trigger': true },
                        result = false;

                    // if the key passed in is an object
                    if ($.isPlainObject(key) && !value) {
                        $.extend(options, key)
                    } else { // make the key value pair part of the default object
                        options[key] = value;
                    }

                    var prevent_paged = (options.trigger === false);

                    // if current_page property is set call setPage
                    if (options.current_page !== undefined) {
                        result = base.setPage(options.current_page, prevent_paged);
                    }

                    // if max_page property is set call setMaxPage
                    if (options.max_page !== undefined) {
                        result = base.setMaxPage(options.max_page, prevent_paged);
                    }

                    // if we've not got a result fire an error and return false
                    if (result === false) console.error('jqPagination: cannot get / set option ' + key);
                    return result;

                    break;

                case 'destroy':

                    base.$el
                        .off('.jqPagination')
                        .find('*')
                        .off('.jqPagination');

                    break;

                default:

                    // the function name must not exist
                    console.error('jqPagination: method "' + method + '" does not exist');
                    return false;

            }

        };

        // Run initializer
        base.init();

    };

    $.jqPagination.defaultOptions = {
        current_page: 1,
        link_string: '',
        max_page: null,
        page_string: '{current_page}/{max_page}',
        paged: function() {}
    };

    $.fn.jqPagination = function() {

        // get any function parameters
        var self = this,
            $self = $(self),
            args = Array.prototype.slice.call(arguments),
            result = false;

        // if the first argument is a string call the desired function
        // note: we can only do this to a single element, and not a collection of elements

        if (typeof args[0] === 'string') {

            // if we're getting, we can only get value for the first pagination element
            if (args[2] === undefined) {

                result = $self.first().data('jqPagination').callMethod(args[0], args[1]);

            } else {

                // if we're setting, set values for all pagination elements
                $self.each(function() {
                    result = $(this).data('jqPagination').callMethod(args[0], args[1], args[2]);
                });

            }

            return result;
        }

        // if we're not dealing with a method, initialise plugin
        self.each(function() {
            (new $.jqPagination(this, args[0]));
        });

    };

})(jQuery);

// polyfill, provide a fallback if the console doesn't exist
if (!console) {

    var console = {},
        func = function() { return false; };
    console.log = func;
    console.info = func;
    console.warn = func;
    console.error = func;

}