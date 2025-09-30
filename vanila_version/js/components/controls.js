// Компонент управления
(function() {
    'use strict';
    
    var ControlsComponent = {
        render: function(state) {
            var footer = document.getElementById('footer');
            if (!footer) return;
            
            footer.innerHTML = this.generateControls(state);
        },
        
        generateControls: function(state) {
            return [
                '<div class="controls">',
                '   <button class="btn btn-primary" data-action="prev" ' + (state.currentPage === 1 ? 'disabled' : '') + '>',
                '       ← Назад',
                '   </button>',
                '   <button class="btn btn-secondary" data-action="bookmark">',
                '       ' + (this.isBookmarked(state) ? '★' : '☆'),
                '   </button>',
                '   <button class="btn btn-primary" data-action="next" ' + (state.currentPage === state.totalPages ? 'disabled' : '') + '>',
                '       Вперед →',
                '   </button>',
                '</div>'
            ].join('');
        },
        
        isBookmarked: function(state) {
            return state.bookmarks.indexOf(state.currentPage) > -1;
        }
    };
    
    window.ControlsComponent = ControlsComponent;
})();