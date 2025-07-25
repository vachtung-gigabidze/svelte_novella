<script lang="ts">
    import {onMount} from 'svelte';

    type CellType = 0 | 1 | number;
    type Position = { x: number, y: number };

    export let level: {
        width: number;
        height: number;
        board: CellType[][];
    };

    let cellSize = 40;
    let offset = {x: 0, y: 0};

    // Рассчитываем позицию для центрирования
    onMount(() => {
        const container = document.querySelector('.level-container');
        if (container) {
            offset = {
                x: (container.clientWidth - level.width * cellSize) / 2,
                y: (container.clientHeight - level.height * cellSize) / 2
            };
        }
    });

    // Функция определения типа ячейки
    function getCellType(value: CellType): string {
        if (value === 0) return 'empty';
        if (value === 1) return 'block';
        if (value >= 10) return 'hole';
        return 'ball';
    }

    // Получаем цвет для элемента
    function getColor(value: CellType): string {
        const colors = {
            block: '#AAAAAA',
            empty: '#F5F5F5',
            ball3: '#FF5555',
            ball4: '#55AAFF',
            hole33: '#FF5555',
            hole44: '#55AAFF'
        };

        if (value === 1) return colors.block;
        if (value === 0) return colors.empty;
        if (value === 3) return colors.ball3;
        if (value === 4) return colors.ball4;
        if (value === 33) return colors.hole33;
        if (value === 44) return colors.hole44;
        return '#CCCCCC';
    }
</script>

<style>
    .level-container {
        width: 100%;
        height: 100vh;
        position: relative;
        overflow: hidden;
        background: #F0F0F0;
    }

    .cell {
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
    }

    .block {
        background: #AAAAAA;
        border: 2px solid #888888;
    }

    .empty {
        background: #F5F5F5;
        border: 1px dashed #DDDDDD;
    }

    .ball {
        border-radius: 50%;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    .hole {
        border: 3px solid #333333;
        opacity: 0.8;
    }

    .cell-number {
        font-weight: bold;
        color: white;
        text-shadow: 1px 1px 2px black;
        font-size: 14px;
    }
    p {
        color: red;
    }
</style>
<main>
    <div class="level-container">
        <p>{JSON.stringify(level)}</p>

        {#each level.board as row, y}
            {#each row as cell, x}
                {#if getCellType(cell) === 'ball'}
                    <div class="cell ball"
                         style="width: {cellSize}px; height: {cellSize}px;
                    left: {offset.x + x * cellSize}px;
                    top: {offset.y + y * cellSize}px;
                    background: {getColor(cell)}">
                        <span class="cell-number">{cell}</span>
                    </div>
                {:else if getCellType(cell) === 'hole'}
                    <div class="cell hole"
                         style="width: {cellSize}px; height: {cellSize}px;
                    left: {offset.x + x * cellSize}px;
                    top: {offset.y + y * cellSize}px;
                    background: {getColor(cell)}">
                        <span class="cell-number">{cell}</span>
                    </div>
                {:else}
                    <div class="cell {getCellType(cell)}"
                         style="width: {cellSize}px; height: {cellSize}px;
                    left: {offset.x + x * cellSize}px;
                    top: {offset.y + y * cellSize}px">
                    </div>
                {/if}
            {/each}
        {/each}
    </div>
</main>
