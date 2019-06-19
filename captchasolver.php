
<?php header('Access-Control-Allow-Origin: *'); 

$connect = mysqli_connect("localhost", "id6425410_bunny", "654ram321", "id6425410_testing");  

if(isset($_POST["captcha"])){

   $captcha = $_POST['captcha'];
           // $sql = "UPDATE mycashback SET my_cashback='$cashback'";
           $sql = "INSERT INTO mycaptcha(captcha) values ('$captcha')"; 

           mysqli_query($connect, $sql);
}



?>