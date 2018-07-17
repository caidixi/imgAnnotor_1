/**点击提交按钮：
 * 当前mark结束
 * 确认提交
 * 提交按钮click等待提交 
 * ajax提交 参数：JSON化mark数据 回调：
 *  alert提交成功 提示进入下一张
 *  清除当前mark
 *  ajax获取下一张图片 返回：JSONObject 回调：
 *   创建一个mark对象 参数：data.marks
 * */






/**画图 参数：tempcanvas，workcanvas
 * 方法：
 * click
 * //dbclick
 * break
 * checkFinish
 */


$(function () {
    var submitbtn = $('#submit');
    var currentMark;

    var getNewPicture = function () {
        var data = {
            'imgURL': 'img/altair.jpg',
            'marks': {
                'markMethods': ['rectMark'],
                'rectMark': [
                    {
                        'top': 50,
                        'left': 50,
                        'width': 0,
                        'height': 0,
                    },
                    {
                        'top': 25,
                        'left': 25,
                        'width': 100,
                        'height': 100,
                    }
                ]
            }
        }

        currentMark = new Mark(data);
        // $.ajax({
        //     type: 'GET',
        //     url: "",
        //     data: null,
        //     success: function (data) {
        //         currentMark = new Mark(data);
        //     },
        //     contentType: 'application/json',
        //     dataType: 'json'
        // });
    };

    var submitMark = function () {
        alert('提交成功');
        getNewPicture();
        // $.ajax({
        //     type: 'POST',
        //     url: "",
        //     data: JSON.stringify(currentMark.getMark()),
        //     success: function (data) {
        //         alert('提交成功');
        //         getNewPicture();
        //     },
        //     contentType: 'application/json',
        //     dataType: 'json'
        // });
    }

    submitbtn.on('click', function () {
        currentMark.end();
        if (confirm('确认提交？')) {
            submitbtn.unbind();
            submitbtn.on('click', function () {
                alert('正在提交...');
            });
            submitMark();
        }
    });

    getNewPicture();
});