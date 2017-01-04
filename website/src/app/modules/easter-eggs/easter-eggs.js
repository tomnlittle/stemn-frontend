import './easter-eggs.scss'
angular.module('modules.easter-eggs', []);
angular.module('modules.easter-eggs').

run(function ($compile, $rootScope) {
    /*
     * Konami-JS ~
     * :: Now with support for touch events and multiple instances for
     * :: those situations that call for multiple easter eggs!
     * Code: http://konami-js.googlecode.com/
     * Examples: http://www.snaptortoise.com/konami-js
     * Copyright (c) 2009 George Mandis (georgemandis.com, snaptortoise.com)
     * Version: 1.4.2 (9/2/2013)
     * Licensed under the MIT License (http://opensource.org/licenses/MIT)
     * Tested in: Safari 4+, Google Chrome 4+, Firefox 3+, IE7+, Mobile Safari 2.2.1 and Dolphin Browser
     */

    var Konami = function (callback) {
        var konami = {
            addEvent: function (obj, type, fn, ref_obj) {
                if (obj.addEventListener)
                    obj.addEventListener(type, fn, false);
                else if (obj.attachEvent) {
                    // IE
                    obj["e" + type + fn] = fn;
                    obj[type + fn] = function () {
                        obj["e" + type + fn](window.event, ref_obj);
                    }
                    obj.attachEvent("on" + type, obj[type + fn]);
                }
            },
            input: "",
            pattern: "38384040373937396665",
            load: function (link) {
                this.addEvent(document, "keydown", function (e, ref_obj) {
                    if (ref_obj) konami = ref_obj; // IE
//                    konami.input += e ? e.keyCode : event.keyCode;
                    konami.input += e ? e.keyCode : ''; // Removed event.keyCode (hopefully this fixes mobile)
                    if (konami.input.length > konami.pattern.length)
                        konami.input = konami.input.substr((konami.input.length - konami.pattern.length));
                    if (konami.input == konami.pattern) {
                        konami.code(link);
                        konami.input = "";
                        e.preventDefault();
                        return false;
                    }
                }, this);
            },
            code: function (link) {
                window.location = link
            },
        }

        typeof callback === "string" && konami.load(callback);
        if (typeof callback === "function") {
            konami.code = callback;
            konami.load();
        }

        return konami;
    }


    // Run the code -------------------------------------------------------------
    var easter_egg = new Konami(function() {
        alert('You know your Konami well...')

        var eggTpl = angular.element('<egg id="egg"></egg>');
        // Compile the popup element
        $compile(eggTpl)($rootScope);
        // Add to body
        angular.element(document.body).append(eggTpl);

   });
}).


directive('egg', function($window, $timeout) {
    /*****************************************
    Make sure to pass in an id on the element
    <particles id="stars-1"></particles>
    /****************************************/
	return {
		restrict: 'E',
        replace: true,
        template: '<div class="egg">'+
        '<md-button class="md-icon-button close-btn" ng-click="closeEgg()"><md-icon md-svg-icon="navigation:close"></md-icon></md-button>'+
        '<audio autoplay><source src="/assets/images/eggs/sagan.mp3" type="audio/mpeg"></audio>'+
        '<p class="message">Nice work! You\'ve found Tiffany\'s secret.</p>'+
        '</div>',
		link: function(scope, element, attrs, fn) {
            $timeout(function(){
                $window.particlesJS(attrs.id, options)
            },100)
            scope.closeEgg = function(){
                element.remove();
            }

            var options = {
                "particles": {
                    "number": {
                        "value": 150,
                        "density": {
                            "enable": false,
                            "value_area": 800
                        }
                    },
                    "color": {
                        "value": "#ffffff"
                    },
                    "shape": {
                        "type": "star",
                        "stroke": {
                            "width": 0,
                            "color": "#000000"
                        },
                        "polygon": {
                            "nb_sides": 5
                        },
                    },
                    "opacity": {
                        "value": 0.5,
                        "random": false,
                        "anim": {
                            "enable": false,
                            "speed": 1,
                            "opacity_min": 0.1,
                            "sync": false
                        }
                    },
                    "size": {
                        "value": 4,
                        "random": true,
                        "anim": {
                            "enable": false,
                            "speed": 40,
                            "size_min": 0.1,
                            "sync": false
                        }
                    },
                    "line_linked": {
                        "enable": false,
                        "distance": 150,
                        "color": "#ffffff",
                        "opacity": 0.4,
                        "width": 1
                    },
                    "move": {
                        "enable": true,
                        "speed": 14,
                        "direction": "left",
                        "random": false,
                        "straight": true,
                        "out_mode": "out",
                        "bounce": false,
                        "attract": {
                            "enable": false,
                            "rotateX": 600,
                            "rotateY": 1200
                        }
                    }
                },
                "interactivity": {
                    "detect_on": "canvas",
                    "events": {
                        "onhover": {
                            "enable": true,
                            "mode": "bubble"
                        },
                        "onclick": {
                            "enable": true,
                            "mode": "repulse"
                        },
                        "resize": true
                    },
                    "modes": {
                        "grab": {
                            "distance": 200,
                            "line_linked": {
                                "opacity": 1
                            }
                        },
                        "bubble": {
                            "distance": 200,
                            "size": 5,
                            "duration": 2,
                            "opacity": 8,
                            "speed": 3
                        },
                        "repulse": {
                            "distance": 200,
                            "duration": 0.4
                        },
                    }
                },
                "retina_detect": true
            }
		}
	};
});