// Компонент заголовка
(function() {
    'use strict';
    
    var HeaderComponent = {
        render: function(state) {
            var header = document.getElementById('header');
            if (!header) return;
            
            header.innerHTML = this.generateHeader(state);
        },
        
        generateHeader: function(state) {
            return [
                '<div class="header-content">',
                '   <h1 class="app-title">Читалка новелл</h1>',
                '   <div class="header-controls">',
                '       <button class="btn btn-icon" data-action="toggle-theme" title="Сменить тему">',
                '           🌙',
                '       </button>',
                '       <button class="btn btn-icon" data-action="toggle-font" title="Сменить шрифт">',
                '           Aa',
                '       </button>',
                '   </div>',
                '</div>'
            ].join('');
        }
    };
    
    window.HeaderComponent = HeaderComponent;
})();