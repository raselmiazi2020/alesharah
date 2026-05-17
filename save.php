<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET");
header("Content-Type: application/json");

$targetDir = "data/";

// Handle LISTING files (GET request)
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (is_dir($targetDir)) {
        $files = array_diff(scandir($targetDir), array('.', '..'));
        $folders = [];
        foreach ($files as $file) {
            // Extract the date from Payroll_YYYY-MM.xlsx
            if (strpos($file, 'Payroll_') === 0) {
                $date = str_replace(['Payroll_', '.xlsx'], '', $file);
                $folders[] = $date;
            }
        }
        echo json_encode(["status" => "success", "folders" => array_values($folders)]);
    } else {
        echo json_encode(["status" => "success", "folders" => []]);
    }
    exit;
}

// Handle SAVING files (POST request)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!file_exists($targetDir)) mkdir($targetDir, 0777, true);

    if (isset($_FILES['excelFile'])) {
        $date = $_POST['date'] ?? 'unknown';
        $fileName = "Payroll_" . preg_replace('/[^A-Za-z0-9\-]/', '', $date) . ".xlsx";
        $destination = $targetDir . $fileName;

        if (move_uploaded_file($_FILES['excelFile']['tmp_name'], $destination)) {
            echo json_encode(["status" => "success", "path" => $destination]);
        } else {
            echo json_encode(["status" => "error", "message" => "Failed to save to $targetDir"]);
        }
    }
    exit;
}
?>