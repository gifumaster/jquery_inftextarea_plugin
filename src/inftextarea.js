(function ($) {
    $.fn.infTextarea = function (options) {
        let defaults = {
            // 最初に生成するテキストエリアの数
            initialTextAreaLength: 1,
            // テキストエリアの最大数
            maxTextAreaLength: 10,
            // ボタンの表示名
            buttonPlusString: '+',
            buttonMinusString: '-',
            // テキストの合体対象のクラス。（基本いじらなくて良い）
            textareaClass: '_inf_target_textarea',
            // テキスト合体時に間に入る文字列
            concatDelimiter: "\n---\n",
            // 要素に結果を出力する場合に指定。
            outputElementID: '',
        }
        let setting = $.extend(defaults, options);

        this.getResult = function () {
            return getResult();
        }

        return this.each(function () {
            let $this = $(this);

            // ボタンを生成
            const plusButton = $('<button>').text(setting.buttonPlusString).addClass(['_inf_button_plus', '_inf_button']).click(() => {
                if (countTextarea() < setting.maxTextAreaLength) {
                    $this.append(generateTextarea());
                }
            });

            $this.append(plusButton);

            for (let i = 0; i < setting.initialTextAreaLength; i++) {
                $this.append(generateTextarea());
            }
        });

        function countTextarea() {
            return $('.' + setting.textareaClass).length;
        }

        function getResult() {
            let concatText = '';

            $('.' + setting.textareaClass).each(function () {
                let $this = $(this);
                concatText += $this.val();
                concatText += setting.concatDelimiter;
            });

            return concatText;
        }

        function generateTextarea() {

            const textarea = $('<textarea>').addClass('_inf_textarea');
            if (setting.textareaClass !== '') {
                textarea.addClass(setting.textareaClass);
            }
            if (setting.outputElement !== '') {
                textarea.change(function () {
                    $('#' + setting.outputElement).val(getResult());
                });
            }


            const div = $('<div>').append(textarea).addClass('_inf_div');

            const minusButton = $('<button>').text(setting.buttonMinusString).addClass(['_inf_button_minus', '_inf_button']).click(() => {
                //自分の中のdivが最後2つ以上あれば自身を削除する。
                if (countTextarea() > 1) {
                    div.remove();
                }
            });
            div.append(minusButton);
            return div;
        }
    };

})(jQuery);