<script lang="ts">
    import { onMount} from 'svelte';
    import { cubicOut } from 'svelte/easing';

    type CellType = 0 | 1 | number;
    type BallGoal = Record<number, number>;
    type Direction = 'up' | 'down' | 'left' | 'right';
    type GameAction = {
        ballValue: number;
        from: [number, number];
        to: [number, number];
        direction: Direction;
    };

    interface LevelData {
        id: string;
        width: number;
        height: number;
        board: CellType[][];
        goals: BallGoal;
    }

    export let level: LevelData;

    let scale = 1;
    let container: HTMLDivElement;
    let grid: HTMLDivElement;
    let actionHistory: GameAction[] = [];
    let movingBalls = new Map<number, {x: number, y: number}>();
    let currentBoard = JSON.parse(JSON.stringify(level.board));

    // Обновленный тип для цветовой схемы
    type ColorPairs = {
        [key: number]: {
            ball: string;
            hole: string;
        };
    };



    const COLORS: {
        block: string;
        empty: string;
        pairs: ColorPairs;
    } = {
        block: '#AAAAAA',
        empty: '#EEEEEE',
        pairs: {
            3: { ball: '#FF5555', hole: '#FF5555' },
            4: { ball: '#55AAFF', hole: '#55AAFF' },
            5: { ball: '#FFCC33', hole: '#FFCC33' },
            33: { ball: '#FF5555', hole: '#FF5555' },
            44: { ball: '#55AAFF', hole: '#55AAFF' },
            55: { ball: '#FFCC33', hole: '#FFCC33' }
        }
    };

    // Масштабирование
    function resize() {
        if (!container || !grid) return;
        const cellSize = 50;
        const widthScale = container.clientWidth / (level.width * cellSize);
        const heightScale = container.clientHeight / (level.height * cellSize);
        scale = Math.min(widthScale, heightScale, 1);
        grid.style.transform = `scale(${scale})`;
    }

    // Инициализация
    onMount(() => {
        resize();
        window.addEventListener('resize', resize);
        return () => window.removeEventListener('resize', resize);
    });

    // Находим шар по координатам
    function findBall(x: number, y: number): number | null {
        if (x < 0 || y < 0 || x >= level.width || y >= level.height) return null;
        const value = currentBoard[y][x];
        return getCellType(value) === 'ball' ? value : null;
    }

    // Анимация движения
    async function moveBall(ballValue: number, direction: Direction) {
        let x = -1, y = -1;

        // Находим текущую позицию шара
        outer: for (y = 0; y < level.height; y++) {
            for (x = 0; x < level.width; x++) {
                if (currentBoard[y][x] === ballValue) break outer;
            }
        }

        const fromPos: [number, number] = [x, y];
        let newX = x, newY = y;

        // Вычисляем новую позицию
        switch (direction) {
            case 'up': while (newY > 0 && currentBoard[newY-1][x] === 0) newY--; break;
            case 'down': while (newY < level.height-1 && currentBoard[newY+1][x] === 0) newY++; break;
            case 'left': while (newX > 0 && currentBoard[y][newX-1] === 0) newX--; break;
            case 'right': while (newX < level.width-1 && currentBoard[y][newX+1] === 0) newX++; break;
        }

        if (x === newX && y === newY) return false; // Движения нет

        const toPos: [number, number] = [newX, newY];
        actionHistory.push({ ballValue, from: fromPos, to: toPos, direction });

        // Анимация
        movingBalls.set(ballValue, {x: fromPos[0], y: fromPos[1]});
        currentBoard[y][x] = 0;

        const duration = 300;
        const start = Date.now();

        return new Promise<void>((resolve) => {
            function animate() {
                const elapsed = Date.now() - start;
                const progress = Math.min(elapsed / duration, 1);
                const eased = cubicOut(progress);

                const [fromX, fromY] = fromPos;
                const [toX, toY] = toPos;

                movingBalls.set(ballValue, {
                    x: fromX + (toX - fromX) * eased,
                    y: fromY + (toY - fromY) * eased
                });

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    movingBalls.delete(ballValue);
                    currentBoard[toY][toX] = ballValue;
                    resolve();
                }
            }
            animate();
        });
    }

    // Отмена последнего действия
    function undoLastAction() {
        if (actionHistory.length === 0) return;

        const lastAction = actionHistory.pop()!;
        const { ballValue, from, to } = lastAction;

        currentBoard[to[1]][to[0]] = 0;
        currentBoard[from[1]][from[0]] = ballValue;
    }

    // Обработка свайпов
    function handleSwipe(direction: Direction) {
        // Здесь должна быть логика выбора шара для движения
        // Например, можно выбрать первый доступный шар
        for (let y = 0; y < level.height; y++) {
            for (let x = 0; x < level.width; x++) {
                const ballValue = findBall(x, y);
                if (ballValue) {
                    moveBall(ballValue, direction);
                    return;
                }
            }
        }
    }

    function getCellType(cellValue: CellType) {
        if (cellValue === 0) return 'empty';
        if (cellValue === 1) return 'block';
        return Object.values(level.goals).includes(cellValue) ? 'hole' : 'ball';
    }

    function getCellColor(cellValue: CellType) {
        switch (getCellType(cellValue)) {
            case 'block': return COLORS.block;
            case 'empty': return COLORS.empty;
            case 'hole': return COLORS.pairs[cellValue].hole;
            case 'ball': return COLORS.pairs[cellValue].ball;
        }
    }
</script>

<style>
    .container {
        width: 100vw;
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        background: #f0f0f0;
        touch-action: none;
    }

    .grid-wrapper {
        transform-origin: center center;
        transition: transform 0.2s ease;
    }

    .grid {
        display: inline-grid;
        gap: 2px;
        background-color: #DDDDDD;
        padding: 10px;
        border-radius: 5px;
        position: relative;
    }

    .cell {
        width: 50px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
    }



    .ball {
        border-radius: 50%;
        width: 40px;
        height: 40px;
        box-shadow: 2px 2px 5px rgba(0,0,0,0.3);
        position: absolute;
        transition: transform 0.1s ease;
    }



    .ball-number {
        position: absolute;
        font-weight: bold;
        color: white;
        text-shadow: 1px 1px 2px black;
        pointer-events: none;
        font-size: 0.8em;
        z-index: 2;
    }

    .controls {
        position: fixed;
        bottom: 20px;
        left: 0;
        right: 0;
        display: flex;
        justify-content: center;
        gap: 20px;
        z-index: 10;
    }

    button {
        padding: 10px 20px;
        font-size: 16px;
        background: #4CAF50;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }
</style>

<div class="container" bind:this={container}>
    <div class="grid-wrapper" bind:this={grid}>
        <div class="grid" style="grid-template-columns: repeat({level.width}, 1fr); grid-template-rows: repeat({level.height}, 1fr);">
            {#each currentBoard as row}
                {#each row as cell}
                    <div class="cell {getCellType(cell)}" style="background-color: {getCellColor(cell)}">
                        {#if getCellType(cell) === 'hole'}
                            <span class="ball-number">{cell}</span>
                        {/if}
                    </div>
                {/each}
            {/each}

            <!-- Отдельно рендерим шары для анимации -->
            {#each Array.from(movingBalls.entries()) as [ballValue, pos]}
                <div class="ball"
                     style="background-color: {COLORS.pairs[ballValue]?.ball || '#000000'};
                    left: {pos.x * 52 + 6}px;
                    top: {pos.y * 52 + 6}px;
                    transform: scale({scale})">
                    <span class="ball-number">{ballValue}</span>
                </div>
            {/each}

            {#each currentBoard as row, y}
                {#each row as cell, x}
                    {#if getCellType(cell) === 'ball' && !movingBalls.has(cell)}
                        <div class="ball"
                             style="background-color: {COLORS.pairs[cell]?.ball || '#000000'};
                        left: {x * 52 + 6}px;
                        top: {y * 52 + 6}px;
                        transform: scale({scale})">
                            <span class="ball-number">{cell}</span>
                        </div>
                    {/if}
                {/each}
            {/each}
        </div>
    </div>

    <div class="controls">
        <button on:click={() => handleSwipe('up')}>↑</button>
        <button on:click={() => handleSwipe('left')}>←</button>
        <button on:click={() => handleSwipe('right')}>→</button>
        <button on:click={() => handleSwipe('down')}>↓</button>
        <button on:click={undoLastAction}>Отменить</button>
    </div>
</div>