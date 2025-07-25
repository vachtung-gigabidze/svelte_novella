<script lang="ts">
    import GameLevel from './GameLevel.svelte';

    const exampleLevel = {

        width: 6,
        height: 6,
        board: [
            [1, 1, 33, 1, 1, 1],
            [1, 3, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 44],
            [1, 0, 0, 0, 0, 1],
            [1, 1, 0, 4, 0, 1],
            [0, 1, 1, 1, 1, 0]
        ]

    };
</script>

<GameLevel level={exampleLevel} />