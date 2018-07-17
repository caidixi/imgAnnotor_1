/**mark
 * 
 * 创建：
 *  加载图片：调整图片大小
 *  加载标记：读入并解析标记，描述写入标记描述列表，创建图片大小的canvas并绘图，移动到和图片相同的位置
 *  生成drawcanvas：创建图片大小的drawcanvas，移动到和图片相同的位置
 *  加载标记方法：读入方法，创建画图方法、标记按钮，设置监听事件：当前标记强制结束，markHandler切换至对应的画图处理
 * 结束：当前标记强制结束，移除所有监听器
 * 清除：删除所有数据
 */

$(function () {
    window.Mark = function (data) {
        var canvasArea = $('#canvas-area');
        var image;
        var drawcanvas;
        var mcwrap = $('#marks-canvas-wrap');
        var mmwrap = $('#marks-method-wrap');
        var marks = data.marks;
        var markMethods = marks.markMethods;
        var currentMarkMethod = { move: function () { }, broke: function () { } };
        var markid = 0;
        var scale = 1.0;
        var originalWidth, originalHeight, originalScale;
        var fitLeft, fitTop, fitWidth, fitHeight;
        var me = this;
        var isdrag = false;

        function initialize() {
            loadImg();
            loadDrawcanvas();
            loadMarks();
            loadMarkMethods();
            setAllToFit();
            iniScroll();
            iniDrag();
            $('#test').click(function () {
                console.log(me.getMark());
            })
        }

        initialize();

        function loadImg() {
            image = $('#image');
            loadSize();
            setSize(image);
        }

        function loadSize() {
            originalWidth = image.width();
            originalHeight = image.height();
            var containerWidth = canvasArea[0].clientWidth;
            var containerHeight = canvasArea[0].clientHeight;
            if ((originalWidth * containerHeight) / (originalHeight * containerWidth) > 1) {
                fitHeight = originalHeight * containerWidth / originalWidth;
                fitWidth = containerWidth;
            } else {
                fitWidth = originalWidth * containerHeight / originalHeight;
                fitHeight = containerHeight;
            }
            originalScale = fitWidth / originalWidth;
            if (originalScale > 2) {
                fitWidth = originalWidth * 2;
                fitHeight = originalHeight * 2;
            }
            fitLeft = (containerWidth - fitWidth) / 2;
            fitTop = (containerHeight - fitHeight) / 2;
            originalScale = fitWidth / originalWidth;
        }

        function loadMarks() {
            for (markMethod of markMethods) {
                for (mark of marks[markMethod]) {
                    createMarkMethod(markMethod).draw(mark);
                }
            }
        }

        function createNewMarkCanvas() {
            markid++;
            mcwrap.append('<canvas id="mark' + markid + '"></canvas>');
            var workcanvas = $('#mark' + markid);
            workcanvas.addClass('draggable resizable');
            setSize(workcanvas);
            resizeAll(scale);
            moveAll(drawcanvas[0].offsetLeft, drawcanvas[0].offsetTop);
            return workcanvas;
        }

        function createMarkMethod(methodName) {
            var workcanvas = createNewMarkCanvas();
            switch (methodName) {
                case 'rectMark': return new RectMark(workcanvas);
            }
        }

        function loadMarkMethods() {
            for (markMethod of markMethods) {
                createNewMarkMethodBtn(markMethod);
            }
        }

        function createNewMarkMethodBtn(methodName) {
            mmwrap.append('<button id="' + methodName + '">' + methodName + '</button>');
            var btn = $('#' + methodName);
            btn.on('click', function () {
                currentMarkMethod.broke();
                currentMarkMethod = createMarkMethod(methodName);
            });
        }

        function loadDrawcanvas() {
            canvasArea.append('<canvas id="draw-canvas"></canvas>');
            drawcanvas = $('#draw-canvas');
            setSize(drawcanvas);
            drawcanvas.addClass('draggable resizable');
            drawcanvas.on('click', function (e) {
                currentMarkMethod.click(e);
                if (currentMarkMethod.isFinish()) {
                    marks[currentMarkMethod.getMethodName()] = marks[currentMarkMethod.getMethodName()].concat(currentMarkMethod.getMark());
                    currentMarkMethod = createMarkMethod(currentMarkMethod.getMethodName());
                }
            });
            drawcanvas.on('mousemove', function (e) {
                currentMarkMethod.move(e);
            });
        }

        function setSize($ele) {
            $ele.each(function () {
                this.width = originalWidth;
                this.height = originalHeight;
            })
        }

        function setAllToFit() {
            scale = originalScale;
            drawcanvas.attr('scale', scale);
            resizeAll(scale);
            moveAll(fitLeft, fitTop);
        }

        function resizeAll(newScale) {
            scale = newScale;
            drawcanvas.attr('scale', scale);
            var $resizable = $('.resizable');
            $resizable.each(function () {
                this.style.width = originalWidth * scale + 'px';
                this.style.height = originalHeight * scale + 'px';
            })
        }

        function moveAll(left, top) {
            var $resizable = $('.resizable');
            $resizable.each(function () {
                this.style.left = left + 'px';
                this.style.top = top + 'px';
            })
        }
        function iniScroll() {
            drawcanvas.bind('mousewheel', function (e) {
                var down = e.originalEvent.wheelDelta < 0
                var delta = 0.1;
                if (down && scale * (1 - delta) < 0.5 * originalScale || !down && scale * (1 + delta) > 4) {
                    return;
                }
                if (!isdrag) {
                    var oldLeft = drawcanvas[0].offsetLeft;
                    var oldTop = drawcanvas[0].offsetTop;

                    var newLeft, newTop;

                    if (down) {
                        resizeAll(scale * (1 - delta));
                        newLeft = oldLeft + e.offsetX * delta;
                        newTop = oldTop + e.offsetY * delta;
                    } else {
                        resizeAll(scale * (1 + delta));
                        newLeft = oldLeft - e.offsetX * delta;
                        newTop = oldTop - e.offsetY * delta;
                    }

                    moveAll(newLeft, newTop);
                }
            })

        }

        function iniDrag() {
            var oldLeft, oldTop, x, y;

            drawcanvas.on('contextmenu', function () {
                return false;
            })

            drawcanvas.on('mousedown', function (e) {
                if (e.button == 1) {
                    oldLeft = drawcanvas[0].offsetLeft;
                    oldTop = drawcanvas[0].offsetTop;
                    x = e.clientX;
                    y = e.clientY;
                    isdrag = true;
                }
                e.preventDefault();
            })

            canvasArea.on('mousemove', function (e) {
                if (isdrag) {
                    moveAll(oldLeft + e.clientX - x, oldTop + e.clientY - y);
                }
            })

            drawcanvas.on('mouseup', function () {
                isdrag = false;
            })
            canvasArea.on('mouseleave', function () {
                isdrag = false;
            })
        }

        this.getMark = function () {
            return data;
        }

        clearAll = function () {
            // image.remove();
            $('canvas').remove();
            mmwrap.children().remove();
        }
        this.end = function () {
            currentMarkMethod.broke();
            clearAll();
        }

    }


});