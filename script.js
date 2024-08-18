const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');

        let bird = { x: 50, y: 150, width: 20, height: 20, gravity: 0.3, lift: -4, velocity: 0 }; // Lift reduced
        let isGameActive = false;
        let pipes = [];
        let frame = 0;
        let score = 0;

        document.getElementById('startGame').addEventListener('click', () => {
            startGame();
            canvas.focus(); 
            document.getElementById('startGame').blur(); 
        });
        document.getElementById('resetGame').addEventListener('click', resetGame);

        function startGame() {
            isGameActive = true;
            bird.y = 150;
            bird.velocity = 0;
            pipes = [];
            score = 0;
            frame = 0;
            gameLoop();
        }

        function resetGame() {
            isGameActive = false;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            bird.y = 150;
            bird.velocity = 0;
            pipes = [];
            score = 0;
            frame = 0;
        }

        function gameLoop() {
            if (!isGameActive) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            bird.velocity += bird.gravity;
            bird.y += bird.velocity;

            ctx.fillStyle = 'yellow';
            ctx.fillRect(bird.x, bird.y, bird.width, bird.height);

            if (frame % 90 === 0) {
                let pipeHeight = Math.random() * (canvas.height - 150) + 50;
                pipes.push({ x: canvas.width, y: pipeHeight });
            }

            pipes.forEach(pipe => {
                ctx.fillStyle = 'green';
                ctx.fillRect(pipe.x, 0, 50, pipe.y);
                ctx.fillRect(pipe.x, pipe.y + 120, 50, canvas.height - pipe.y - 120);
                pipe.x -= 2;

                if (bird.x < pipe.x + 50 && bird.x + bird.width > pipe.x &&
                    (bird.y < pipe.y || bird.y + bird.height > pipe.y + 120)) {
                    resetGame();
                }

                if (pipe.x + 50 < 0) {
                    pipes.shift();
                    score++;
                }
            });

            ctx.fillStyle = 'white';
            ctx.font = '20px Arial';
            ctx.fillText(`Score: ${score}`, 10, 20);

            if (bird.y + bird.height >= canvas.height || bird.y < 0) {
                resetGame();
            }

            frame++;
            requestAnimationFrame(gameLoop);
        }

        document.addEventListener('keydown', function (event) {
            if (event.code === 'Space' && isGameActive) {
                bird.velocity = bird.lift;
            }
        });