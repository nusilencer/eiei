<?php
$host = 'localhost';
$user = 'root';
$password = 'nu213141';
$database = 'ro_bot';

$conn = new mysqli($host, $user, $password, $database);

if ($conn->connect_error) {
    die('Connection failed: ' . $conn->connect_error);
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $username = $conn->real_escape_string($_POST['username']);
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT);
    $email = $conn->real_escape_string($_POST['email']);

    $sql = "INSERT INTO login (userid, user_pass, email) VALUES ('$username', '$password', '$email')";

    if ($conn->query($sql) === TRUE) {
        echo "<script>alert('สมัครสมาชิกเรียบร้อยแล้ว!'); window.close();</script>";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>สมัครสมาชิก Ragnarok</title>
    <style>
        body { font-family: Arial, sans-serif; background-color: #f2f2f2; }
        .form-container {
            width: 300px; margin: 100px auto; padding: 20px;
            background-color: #fff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .form-container h2 { text-align: center; }
        input[type="text"], input[type="password"], input[type="email"] {
            width: 100%; padding: 10px; margin: 5px 0 15px; border: 1px solid #ccc; border-radius: 4px;
        }
        button {
            width: 100%; padding: 10px; background-color: #4CAF50; color: white;
            border: none; border-radius: 4px; cursor: pointer;
        }
        button:hover { background-color: #45a049; }
    </style>
</head>
<body>
    <div class="form-container">
        <h2>สมัครสมาชิก</h2>
        <form method="POST">
            <input type="text" name="username" placeholder="Username" required>
            <input type="password" name="password" placeholder="Password" required>
            <input type="email" name="email" placeholder="Email" required>
            <button type="submit">สมัครสมาชิก</button>
        </form>
    </div>
</body>
</html>
