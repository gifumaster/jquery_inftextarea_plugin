(function ($) {
    $.fn.infTextarea = function (options) {
        let defaults = {
            // テキストエリアの最大数
            maxTextAreaLength: 12,
            // IndexString
            indexPrefixString: '・',
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
            outputTextElementBaseID: '',
            outputCountElementID:''
        }
        let setting = $.extend(defaults, options);

        this.getResult = function () {
            return getResult();
        }

        let groupCount = 0;
        const length = this.length;

        return this.each(function (index) {
            const localCount = groupCount;
            let $this = $(this);

            const result = restore($this,localCount);

            if(!result)
            {
                $this.append(generateTextarea(localCount));
            }
            groupCount++;

            if(index === (length -1))
            {
                update();
            }
        });

        function countTextarea() {
            return $('.' + setting.textareaClass).length;
        }

        function countGroupTextarea(groupCount) {
            return $('.' + setting.textareaClass + '_group' + groupCount).length;
        }

        function getResult() {
            let textArray = [];

            $('.' + setting.textareaClass).each(function () {
                const $this = $(this);
                const target = $(this).parent().parent().data('id');

                if ($this.val() !== '') {
                    const concatText = setting.indexPrefixString + $this.val() + '\n';
                    textArray.push({'id': target, 'text': concatText});
                }
            });

            return textArray;
        }

        function generateTextarea(groupCount,initValue = '') {

            const textarea = $('<input>').addClass('_inf_textarea').val(initValue);
            if (setting.textareaClass !== '') {
                textarea.addClass(setting.textareaClass).addClass(setting.textareaClass + '_group' + groupCount);
            }
            if (setting.cssClassForTextarea !== '') {
                textarea.addClass(setting.cssClassForTextarea);
            }

            if (setting.outputElement !== '') {
                textarea.change(function () {
                    update();
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
                update();
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
                update();
            });
            if (setting.cssClassForButtonPlus !== '') {
                minusButton.addClass(setting.cssClassForButtonPlus);
            }

            div.append(plusButton);

            return div;
        }

        function update()
        {
            reset();

            let textArray = getResult();
            for(let i= 0; i < textArray.length; i++){
                const value = $('#' + setting.outputTextElementBaseID + '_' + textArray[i].id).val();
                $('#' + setting.outputTextElementBaseID + '_' + textArray[i].id).val(value + textArray[i].text);
            }
            $('#' + setting.outputCountElementID).val(textArray.length);
        }

        function restore(target, groupIndex)
        {
            let isRestore = false;

            const value = $('#' + setting.outputTextElementBaseID + '_' + (groupIndex+1)).val();
            console.log({value});

            //分解する
            const array = value.split('\n');
            console.log({array});
            for(let i = 0; i < array.length; i++)
            {
                const initValue = array[i].substring(setting.indexPrefixString.length);
                //要素を作成する
                target.append(generateTextarea(groupIndex,initValue));
                isRestore = true;
            }
            return isRestore;
        }

        function reset()
        {
            for(let i = 0; i < setting.maxTextAreaLength; i++)
            {
                $('#' + setting.outputTextElementBaseID + '_' + (i+1)).val('');
            }
        }
    };

})(jQuery);