// Управление состоянием приложения
(function() {
    'use strict';
    
    var initialState = {
        currentPage: 1,
        totalPages: 100,
        theme: 'light',
        fontSize: 16,
        fontFamily: 'serif',
        bookmarks: [],
        currentNovella: null,
        novellas: []
    };
    
    var StateManager = {
        getState: function() {
            var saved = localStorage.getItem('novella-state');
            return saved ? JSON.parse(saved) : initialState;
        },
        
        updateState: function(updates) {
            var currentState = this.getState();
            var newState = Object.assign({}, currentState, updates);
            localStorage.setItem('novella-state', JSON.stringify(newState));
            return newState;
        },
        
        resetState: function() {
            localStorage.setItem('novella-state', JSON.stringify(initialState));
            return initialState;
        },
        
        addBookmark: function(page) {
            var state = this.getState();
            if (state.bookmarks.indexOf(page) === -1) {
                state.bookmarks.push(page);
                this.updateState({ bookmarks: state.bookmarks });
            }
        },
        
        removeBookmark: function(page) {
            var state = this.getState();
            var index = state.bookmarks.indexOf(page);
            if (index > -1) {
                state.bookmarks.splice(index, 1);
                this.updateState({ bookmarks: state.bookmarks });
            }
        }
    };
    
    window.StateManager = StateManager;
})();