$(function () {
    window.Mark = function (methodName, workCanvas, descRow) {
        var markMethod;
        var description;
        var broke = false;

        function initialize() {
            loadMarkMethod();
            loadDescArea();
        }
        initialize();
        this.getMark = function () {
            return {
                info: markMethod.getInfo(),
                description: description.getDesc(),
            };
        }
        function loadMarkMethod() {
            switch (methodName) {
                case 'rectMark': markMethod = new RectMark(workCanvas);
                    break;
                case 'polyMark': markMethod = new PolyMark(workCanvas);
                    break;
            }
        }

        function loadDescArea() {
            description = new Description(descRow);
        }

        this.getMethodName = function () {
            if (broke) {
                return null;
            } else {
                return methodName;
            }
        }

        this.set = function (markObject) {
            markMethod.set(markObject.info);
            description.set(markObject.description);
        }

        this.getMarkMethod = function () {
            return markMethod;
        }

        this.broke = function () {
            if (!markMethod.isFinish()) {
                this.delete();
            }
        }
        this.delete = function () {
            markMethod.delete();
            description.delete();
            markMethod = null;
            description = null;
            workCanvas.remove();
            descRow.remove();
            broke = true;
        }
        this.onSelect = function () {
            markMethod.onSelect();
            description.onSelect();
        }
        this.deselect = function () {
            markMethod.deselect();
            description.deselect();
        }
    }
})