// Главный файл приложения
(function() {
    'use strict';
    
    var App = {
        init: function() {
            this.state = window.StateManager.getState();
            this.setupEventListeners();
            this.render();
        },
        
        setupEventListeners: function() {
            var self = this;
            
            // Глобальные обработчики событий
            document.addEventListener('keydown', function(e) {
                if (e.key === 'ArrowRight') {
                    self.nextPage();
                } else if (e.key === 'ArrowLeft') {
                    self.prevPage();
                }
            });
            
            // Делегирование событий
            document.addEventListener('click', function(e) {
                if (e.target.matches('[data-action]')) {
                    var action = e.target.getAttribute('data-action');
                    self.handleAction(action, e.target);
                }
            });
        },
        
        handleAction: function(action, target) {
            switch(action) {
                case 'next':
                    this.nextPage();
                    break;
                case 'prev':
                    this.prevPage();
                    break;
                case 'toggle-theme':
                    this.toggleTheme();
                    break;
                case 'toggle-font':
                    this.toggleFont();
                    break;
            }
        },
        
        nextPage: function() {
            var state = this.state;
            if (state.currentPage < state.totalPages) {
                StateManager.updateState({ 
                    currentPage: state.currentPage + 1 
                });
                this.render();
            }
        },
        
        prevPage: function() {
            var state = this.state;
            if (state.currentPage > 1) {
                StateManager.updateState({ 
                    currentPage: state.currentPage - 1 
                });
                this.render();
            }
        },
        
        toggleTheme: function() {
            var state = this.state;
            var newTheme = state.theme === 'light' ? 'dark' : 'light';
            StateManager.updateState({ theme: newTheme });
            this.updateTheme();
        },
        
        toggleFont: function() {
            var state = this.state;
            var fonts = ['serif', 'sans-serif', 'monospace'];
            var currentIndex = fonts.indexOf(state.fontFamily);
            var nextIndex = (currentIndex + 1) % fonts.length;
            StateManager.updateState({ fontFamily: fonts[nextIndex] });
            this.updateFont();
        },
        
        updateTheme: function() {
            var theme = this.state.theme;
            document.body.className = theme + '-theme';
        },
        
        updateFont: function() {
            document.body.style.fontFamily = this.state.fontFamily;
        },
        
        render: function() {
            this.state = window.StateManager.getState();
            
            // Рендер компонентов
            if (window.HeaderComponent) {
                HeaderComponent.render(this.state);
            }
            
            if (window.NovellaComponent) {
                NovellaComponent.render(this.state);
            }
            
            if (window.ControlsComponent) {
                ControlsComponent.render(this.state);
            }
            
            this.updateTheme();
            this.updateFont();
        }
    };
    
    // Инициализация при загрузке DOM
    document.addEventListener('DOMContentLoaded', function() {
        App.init();
    });
    
    window.App = App;
})();