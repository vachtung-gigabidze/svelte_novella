// Компонент для отображения новеллы
(function() {
    'use strict';
    
    var NovellaComponent = {
        render: function(state) {
            var main = document.getElementById('main');
            if (!main) return;
            
            var content = this.generateContent(state);
            main.innerHTML = content;
        },
        
        generateContent: function(state) {
            return [
                '<div class="novella-container">',
                '   <div class="novella-content">',
                '       <h1 class="novella-title">' + this.getNovellaTitle(state) + '</h1>',
                '       <div class="novella-text">' + this.getPageContent(state.currentPage) + '</div>',
                '   </div>',
                '   <div class="page-indicator">',
                '       Страница ' + state.currentPage + ' из ' + state.totalPages,
                '   </div>',
                '</div>'
            ].join('');
        },
        
        getNovellaTitle: function(state) {
            return state.currentNovella || 'Новелла';
        },
        
        getPageContent: function(page) {
            // Заглушка - здесь должна быть логика загрузки контента
            var lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' +
                       'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ' +
                       'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.';
            
            return '<p>' + lorem + '</p>'.repeat(3);
        }
    };
    
    window.NovellaComponent = NovellaComponent;
})();