<?php
session_start();

// แสดงข้อผิดพลาดหากเกิดขึ้น (สำหรับการดีบัค)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// สร้าง Captcha Image
function generateCaptcha() {
    $captcha_code = rand(1000, 9999);
    $_SESSION['captcha'] = $captcha_code;

    $image = imagecreatetruecolor(70, 30);
    $bg_color = imagecolorallocate($image, 255, 255, 255);
    $text_color = imagecolorallocate($image, 0, 0, 0);

    imagefilledrectangle($image, 0, 0, 70, 30, $bg_color);
    imagestring($image, 5, 15, 8, $captcha_code, $text_color);

    header('Content-Type: image/png');
    imagepng($image);
    imagedestroy($image);
}

if (isset($_GET['captcha'])) {
    generateCaptcha();
    exit;
}

$servername = "localhost";
$username = "root";
$password = "nu213141";

// เชื่อมต่อฐานข้อมูล ro_bot
$conn_ro = new mysqli($servername, $username, $password, "ro_bot");
$conn_ro->set_charset("utf8mb4");

// เชื่อมต่อฐานข้อมูล pvp
$conn_pvp = new mysqli($servername, $username, $password, "pvp");
$conn_pvp->set_charset("utf8mb4");

$message = "";

// ตรวจสอบการเชื่อมต่อ
if ($conn_ro->connect_error || $conn_pvp->connect_error) {
    die("เชื่อมต่อฐานข้อมูลล้มเหลว: " . $conn_ro->connect_error . " / " . $conn_pvp->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $userid = trim($_POST["userid"]);
    $password = trim($_POST["password"]);
    $confirm_password = trim($_POST["confirm_password"]);
    $sex = $_POST["sex"];
    $email = trim($_POST["email"]);
    $captcha = trim($_POST["captcha"]);

    if ($captcha != $_SESSION['captcha']) {
        $_SESSION['message'] = "<div class='alert error'>Captcha ไม่ถูกต้อง!</div>";
    } elseif ($password !== $confirm_password) {
        $_SESSION['message'] = "<div class='alert error'>รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน!</div>";
    } else {
        $check_user = $conn_ro->prepare("SELECT account_id FROM login WHERE userid = ?");
        $check_user->bind_param("s", $userid);
        $check_user->execute();
        $check_user->store_result();

        if ($check_user->num_rows > 0) {
            $_SESSION['message'] = "<div class='alert error'>ชื่อผู้ใช้นี้มีอยู่ในระบบแล้ว!</div>";
        } else {
            $insert_ro = $conn_ro->prepare("INSERT INTO login (userid, user_pass, sex, email) VALUES (?, ?, ?, ?)");
            $insert_pvp = $conn_pvp->prepare("INSERT INTO login (userid, user_pass, sex, email) VALUES (?, ?, ?, ?)");

            $insert_ro->bind_param("ssss", $userid, $password, $sex, $email);
            $insert_pvp->bind_param("ssss", $userid, $password, $sex, $email);

            if ($insert_ro->execute() && $insert_pvp->execute()) {
                $_SESSION['message'] = "<div class='alert success'>สมัครสมาชิกเรียบร้อยแล้ว!</div>";
            } else {
                $_SESSION['message'] = "<div class='alert error'>เกิดข้อผิดพลาดในการสมัครสมาชิก!</div>";
            }

            $insert_ro->close();
            $insert_pvp->close();
        }
        $check_user->close();
    }

    unset($_SESSION['captcha']);
    header("Location: " . $_SERVER['PHP_SELF']);
    exit;
}

$conn_ro->close();
$conn_pvp->close();
?>

<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>สมัครสมาชิก Ragnarok</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background: url('image/ragnarok-online-2pwddeknpt5q43tm.webp') no-repeat center center fixed;
            background-size: cover;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            position: relative;
        }
        .container {
            background-color: rgba(255, 255, 255, 0.9);
            padding: 20px 40px;
            border-radius: 10px;
            box-shadow: 0 0 15px rgba(0,0,0,0.1);
            width: 400px;
            position: relative;
        }
        h2 {
            text-align: center;
            margin-bottom: 20px;
        }
        label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
        }
        input, select {
            width: 100%;
            padding: 10px;
            margin-bottom: 15px;
            border: 1px solid #ccc;
            border-radius: 5px;
            box-sizing: border-box;
        }
        select {
            height: 42px;
        }
        button {
            width: 100%;
            padding: 10px;
            background-color: #007BFF;
            color: #fff;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
        }
        button:hover {
            background-color: #0056b3;
        }
        .alert {
            position: absolute;
            top: -20px;
            left: 50%;
            transform: translate(-50%, -100%);
            padding: 15px;
            width: 100%;
            text-align: center;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .success {
            background-color: #28a745;
            color: white;
        }
        .error {
            background-color: #dc3545;
            color: white;
        }
        .footer {
            position: absolute;
            bottom: 10px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 14px;
            color: #000;
            font-style: italic;
            font-weight: bold;
            background-color: rgba(255, 255, 255, 0.8);
            padding: 5px 15px;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        }
    </style>
</head>
<body>
    <div class="container">
        <?= isset($_SESSION['message']) ? $_SESSION['message'] : ''; unset($_SESSION['message']); ?>
        <h2>สมัคร ID Ragnarok Browsers</h2>
        <form method="POST" action="">
            <label>ID :</label>
            <input type="text" name="userid" required>

            <label>รหัสผ่าน :</label>
            <input type="password" name="password" required>

            <label>ยืนยันรหัสผ่าน :</label>
            <input type="password" name="confirm_password" required>

            <label>เพศ :</label>
            <select name="sex" required>
                <option value="M">ชาย</option>
                <option value="F">หญิง</option>
            </select>

            <label>อีเมล :</label>
            <input type="email" name="email" required>

            <label></label>
            <img src="?captcha=1" alt="Captcha Image"><br>
            <input type="text" name="captcha" placeholder="กรอกตัวเลขที่เห็น" required>

            <button type="submit">สมัครสมาชิก</button>
        </form>
    </div>
    <div class="footer">
        &copy; 2024 The4rtist. All Rights Reserved.
    </div>
</body>
</html>
