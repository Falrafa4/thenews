<?php
/**
 * Diagnostic Script for The News PHP Backend
 * 
 * Buka file ini di browser Anda (misal: http://localhost:5500/api/check.php atau melalui VPS)
 * untuk melihat status konfigurasi backend dan mendiagnosis error 500.
 */

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');

define('SECURE_ACCESS', true);

$diagnostics = [
    'php_version' => PHP_VERSION,
    'server_software' => $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown',
    'errors' => []
];

// 1. Cek Ekstensi cURL
if (extension_loaded('curl')) {
    $diagnostics['curl_enabled'] = true;
} else {
    $diagnostics['curl_enabled'] = false;
    $diagnostics['errors'][] = "Ekstensi PHP 'curl' belum terinstall atau belum diaktifkan. Harap install menggunakan 'sudo apt install php-curl' (untuk Ubuntu/Debian) atau aktifkan di php.ini.";
}

// 2. Cek File config.php
$config_file = __DIR__ . '/config.php';
if (file_exists($config_file)) {
    $diagnostics['config_exists'] = true;
    $config = require $config_file;
    
    if (empty($config['api_key']) || $config['api_key'] === 'YOUR_NEWSAPI_KEY_HERE') {
        $diagnostics['api_key_configured'] = false;
        $diagnostics['errors'][] = "API Key NewsAPI belum dikonfigurasi di api/config.php. Masukkan API Key asli Anda.";
    } else {
        $diagnostics['api_key_configured'] = true;
        // Sensor API Key untuk keamanan
        $diagnostics['api_key_preview'] = substr($config['api_key'], 0, 4) . '...' . substr($config['api_key'], -4);
    }
    
    // 3. Cek Folder Cache
    $cache_dir = $config['cache_dir'] ?? __DIR__ . '/../cache/';
    $diagnostics['cache_directory'] = $cache_dir;
    
    if (is_dir($cache_dir)) {
        $diagnostics['cache_dir_exists'] = true;
        if (is_writable($cache_dir)) {
            $diagnostics['cache_dir_writable'] = true;
        } else {
            $diagnostics['cache_dir_writable'] = false;
            $diagnostics['errors'][] = "Folder cache '" . realpath($cache_dir) . "' ada tetapi TIDAK dapat ditulis (not writable). Jalankan 'sudo chown -R www-data:www-data cache' di VPS.";
        }
    } else {
        $diagnostics['cache_dir_exists'] = false;
        $diagnostics['errors'][] = "Folder cache tidak ditemukan di path: " . $cache_dir;
    }
} else {
    $diagnostics['config_exists'] = false;
    $diagnostics['errors'][] = "File api/config.php tidak ditemukan. Harap buat file tersebut.";
}

// Tentukan HTTP Status Code berdasarkan hasil pemeriksaan
if (empty($diagnostics['errors'])) {
    $diagnostics['status'] = 'success';
    $diagnostics['message'] = 'Semua konfigurasi PHP backend berjalan dengan baik!';
    http_response_code(200);
} else {
    $diagnostics['status'] = 'error';
    $diagnostics['message'] = 'Ditemukan beberapa kesalahan konfigurasi.';
    http_response_code(500); // Sengaja mengembalikan 500 untuk mencocokkan kondisi error Anda
}

echo json_encode($diagnostics, JSON_PRETTY_PRINT);
