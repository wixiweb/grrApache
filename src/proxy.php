<?php
session_start();
$url = isset($_GET['url']) ? $_GET['url'] : null;
//if(isset($_SESSION['cache'][$url])){
    //$content = $_SESSION['cache'][$url];
//}else{
    $content = file_get_contents($url);
//}

if(!empty($content)){
    $_SESSION['cache'][$url] = $content;
}
echo $content;
