<html>
<body>
    
<?php
$cddtNum = $_POST["CandidateNumber"];
$condition = $_POST["Conditions"];
$filename = $cddtNum .'_' .$condition .'.txt';
$myfile = fopen($filename, "w") or die("Unable to create file!");
//$txt = "Bill Gates\n";
//fwrite($myfile, $txt);
//$txt = "Steve Jobs\n";
//fwrite($myfile, $txt);
fclose($myfile);
echo "File ".$filename ." created.";
?>
  
  
    </body>
</html>
    