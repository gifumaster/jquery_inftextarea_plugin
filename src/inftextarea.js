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
            // 各要素のCSS用クラス
            cssClassForTextarea: '',
            cssClassForButtonMinus: '',
            cssClassForButtonPlus: '',
            // テキストのカウント対象のクラス。（基本いじらなくて良い）複数種類設置する場合に指定する。
            textareaClass: '_inf_target_textarea',
            // 要素に結果を出力する場合に指定。
            outputTextElementID: ''
        }
        let setting = $.extend(defaults, options);

        this.getResult = function () {
            return getResult();
        }

        let groupCount = 0;
        return this.each(function () {
            const localCount = groupCount;
            let $this = $(this);

            for (let i = 0; i < setting.initialTextAreaLength; i++) {
                $this.append(generateTextarea(localCount));
            }

            groupCount++;
        });

        function countTextarea() {
            return $('.' + setting.textareaClass).length;
        }

        function countGroupTextarea(groupCount) {
            return $('.' + setting.textareaClass + '_group' + groupCount).length;
        }

        function getResult() {
            let currentTitle = null;
            let concatText = '';
            let count = 0;

            $('.' + setting.textareaClass).each(function () {
                const $this = $(this);
                const title = $this.parent().parent().data('name');

                if (title !== currentTitle) {
                    concatText += '【' + title + '】\n';
                }

                if ($this.val() !== '') {
                    concatText += '・' + $this.val() + '\n';
                    count++;
                }

                currentTitle = title;
            });

            return [concatText, count];
        }

        function generateTextarea(groupCount) {

            const textarea = $('<input>').addClass('_inf_textarea');
            if (setting.textareaClass !== '') {
                textarea.addClass(setting.textareaClass).addClass(setting.textareaClass + '_group' + groupCount);
            }
            if (setting.cssClassForTextarea !== '') {
                textarea.addClass(setting.cssClassForTextarea);
            }

            if (setting.outputElement !== '') {
                textarea.change(function () {
                    [text, count] = getResult();
                    $('#' + setting.outputTextElementID).val(text);
                    $('#' + setting.outputCountElementID).val(count);
                });
            }

            const div = $('<div>').append(textarea).addClass('_inf_div');

            const minusButton = $('<button>').text(setting.buttonMinusString).addClass(['_inf_button_minus', '_inf_button']).click(() => {
                div.find('._inf_textarea').val('');
                if (countGroupTextarea(groupCount) > 1) {
                    div.remove();
                }
                if (countTextarea() < setting.maxTextAreaLength) {
                    $('._inf_button_plus').prop('disabled', false).attr('title', '');
                }
            });
            if (setting.cssClassForButtonMinus !== '') {
                minusButton.addClass(setting.cssClassForButtonMinus);
            }


            div.append(minusButton);

            const plusButton = $('<button>').text(setting.buttonPlusString).addClass(['_inf_button_plus', '_inf_button']).click(() => {
                if (countTextarea() < setting.maxTextAreaLength) {
                    div.after(generateTextarea(groupCount));
                }

                if (countTextarea() === setting.maxTextAreaLength) {
                    $('._inf_button_plus').prop('disabled', true).attr('title', 'これ以上増やせません');
                }
            });
            if (setting.cssClassForButtonPlus !== '') {
                minusButton.addClass(setting.cssClassForButtonPlus);
            }

            div.append(plusButton);

            return div;
        }
    };

})(jQuery);