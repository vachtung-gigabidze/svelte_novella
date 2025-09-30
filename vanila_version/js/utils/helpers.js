// Вспомогательные функции
(function() {
    'use strict';
    
    var Helpers = {
        // Аналог $: в Svelte для реактивности
        createReactive: function(initialValue) {
            var value = initialValue;
            var subscribers = [];
            
            return {
                get: function() { return value; },
                set: function(newValue) {
                    if (value !== newValue) {
                        value = newValue;
                        subscribers.forEach(function(callback) {
                            callback(value);
                        });
                    }
                },
                subscribe: function(callback) {
                    subscribers.push(callback);
                    return function() {
                        var index = subscribers.indexOf(callback);
                        if (index > -1) {
                            subscribers.splice(index, 1);
                        }
                    };
                }
            };
        },
        
        // Дебаунс
        debounce: function(func, wait) {
            var timeout;
            return function() {
                var context = this, args = arguments;
                clearTimeout(timeout);
                timeout = setTimeout(function() {
                    func.apply(context, args);
                }, wait);
            };
        },
        
        // Форматирование чисел
        formatNumber: function(num) {
            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
        }
    };
    
    window.Helpers = Helpers;
})();