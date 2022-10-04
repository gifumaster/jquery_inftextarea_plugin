<?php

add_filter('wpcf7_validate', 'pointLength_wpcf7_validate', 11, 2);
function pointLength_wpcf7_validate($result, $tags)
{
    foreach ($tags as $tag) {
        $name = $tag['name'];
        if ($name == 'item-point-length') {
            $length = (int)$_POST[$name];
            if ($length !== 10) {
                $result->invalidate($name, '撮影のポイントが全商品で合計10箇所になるように記入して下さい。');
            }
        }
    }

    return $result;
}