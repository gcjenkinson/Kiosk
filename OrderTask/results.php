<?php
if(isset($_POST['occupation-value'],
   $_POST['physical-products-value'],
   $_POST['software-products-value'],
   $_POST['occupation-focus-value'],
   $_POST['experience-years-value'],
   $_POST['education-value'],
   $_POST['airline-task-value'])) {

   $data = $_POST['occupation-value'] . ','
      . $_POST['physical-products-value'] . ','
      . $_POST['software-products-value'] . ','
      . $_POST['occupation-focus-value'] . ','
      . $_POST['experience-years-value'] . ','
      . $_POST['education-value'] . ','
      . $_POST['airline-task-value'] . "\n";
   $ret = file_put_contents('results/mydata.txt', $data, FILE_APPEND | LOCK_EX);
   unset($POST);
   if($ret === false) {
      die('There was an error writing this file');
   }
   else {
      echo "$ret bytes written to file";
   }
}
else {
      die('no post data to process');
}
header('Content-Type: text/html; charset=utf-8');
header('Location: thankyou.html');
?>
