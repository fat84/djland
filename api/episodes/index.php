<?php


require_once('../api_common.php');


if(isset($_GET['OFFSET'])) $offset = $_GET['OFFSET']; else $offset = 0;
if(isset($_GET['LIMIT'])) $limit = $_GET['LIMIT']; else $limit = 100;

$query = 'SELECT id, edit_date FROM podcast_episodes WHERE active = 1 ORDER BY edit_date DESC limit '.$limit.' OFFSET '.$offset;

$rawdata = array();

if ($result = mysqli_query($db, $query) ) {

  while ($row = mysqli_fetch_assoc($result)) {

    $rawdata [] = $row;

  }
}

$data = $rawdata;

finish();