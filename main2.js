var canvas = document.querySelector("canvas"),
            ctx = canvas.getContext("2d"),
            ww, wh;

        function onResize() {
            ww = canvas.width = window.innerWidth;
            wh = canvas.height = window.innerHeight;
        }

        var precision = 100;
        var hearts = [];
        var mouseMoved = false;

        function onMove(e) {
            mouseMoved = true;
            var clientX, clientY;

            if (e.type === "touchmove") {
                clientX = e.touches[0].clientX;
                clientY = e.touches[0].clientY;
            } else {
                clientX = e.clientX;
                clientY = e.clientY;
            }

            hearts.push(new Heart(clientX, clientY));
            hearts.push(new Heart(clientX, clientY));
        }

        var Heart = function (x, y) {
            this.x = x || Math.random() * ww;
            this.y = y || Math.random() * wh;
            this.size = Math.random() * 2 + 1;
            this.shadowBlur = Math.random() * 10;
            this.speedX = (Math.random() + 0.2 - 0.6) * 8;
            this.speedY = (Math.random() + 0.2 - 0.6) * 8;
            this.speedSize = Math.random() * 0.05 + 0.01;
            this.opacity = 1;
            this.vertices = [];

            for (var i = 0; i < precision; i++) {
                var step = (i / precision - 0.5) * (Math.PI * 2);
                var vector = {
                    x: (15 * Math.pow(Math.sin(step), 3)),
                    y: -(13 * Math.cos(step) - 5 * Math.cos(2 * step) - 2 * Math.cos(3 * step) - Math.cos(4 * step))
                }
                this.vertices.push(vector);
            }
        }

        Heart.prototype.draw = function () {
            this.size -= this.speedSize;
            this.x += this.speedX;
            this.y += this.speedY;
            ctx.save();
            ctx.translate(-1000, this.y);
            ctx.scale(this.size, this.size);
            ctx.beginPath();

            for (var i = 0; i < precision; i++) {
                var vector = this.vertices[i];
                ctx.lineTo(vector.x, vector.y);
            }

            ctx.globalAlpha = this.size;
            ctx.shadowBlur = Math.round((3 - this.size) * 10);
            ctx.shadowColor = "hsla(0, 100%, 60%, 0.5)";
            ctx.shadowOffsetX = this.x + 1000;
            ctx.globalCompositeOperation = "screen"
            ctx.closePath();
            ctx.fill()
            ctx.restore();
        };

        function render() {
            requestAnimationFrame(render);
            hearts.push(new Heart())
            ctx.clearRect(0, 0, ww, wh);

            for (var i = 0; i < hearts.length; i++) {
                hearts[i].draw();
                if (hearts[i].size <= 0) {
                    hearts.splice(i, 1);
                    i--;
                }
            }
        }

        onResize();
        window.addEventListener("mousemove", onMove);
        window.addEventListener("touchmove", onMove);
        window.addEventListener("resize", onResize);
        requestAnimationFrame(render);