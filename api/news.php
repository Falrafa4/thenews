<?php
/**
 * News Reverse Proxy API
 * 
 * PHP native script untuk melakukan reverse proxy ke NewsAPI.org.
 * Fitur:
 * - Menyembunyikan API Key dari frontend.
 * - Validasi whitelist category dan endpoint.
 * - Caching response selama 10 menit untuk mencegah rate limit.
 * - Menggunakan cURL dengan error handling yang komprehensif.
 */

// Tentukan zona waktu default
date_default_timezone_set('Asia/Jakarta');

// Set header response agar client menerima data dalam format JSON
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *'); // Mengizinkan request CORS
header('Access-Control-Allow-Methods: GET'); // Hanya mengizinkan method GET

// Definisikan konstanta akses aman sebelum memuat config.php
define('SECURE_ACCESS', true);

// Include file konfigurasi
$config_file = __DIR__ . '/config.php';
if (!file_exists($config_file)) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Configuration file (config.php) is missing.'
    ]);
    exit;
}
$config = require $config_file;

// Pastikan API Key sudah dikonfigurasi
if (empty($config['api_key']) || $config['api_key'] === 'YOUR_NEWSAPI_KEY_HERE') {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'NewsAPI Key is not configured. Please add your API key in api/config.php.'
    ]);
    exit;
}

// 1. Validasi Parameter Endpoint
$endpoint = isset($_GET['endpoint']) ? $_GET['endpoint'] : 'top-headlines';
$allowed_endpoints = ['top-headlines', 'everything'];

if (!in_array($endpoint, $allowed_endpoints)) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => 'Invalid endpoint. Only top-headlines and everything are allowed.'
    ]);
    exit;
}

// 2. Validasi Parameter Category (Hanya berlaku untuk top-headlines)
$category = isset($_GET['category']) ? $_GET['category'] : null;
if ($category !== null) {
    $allowed_categories = ['general', 'technology', 'business', 'sports', 'entertainment', 'health', 'science'];
    if (!in_array($category, $allowed_categories)) {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'Invalid category. Whitelist: ' . implode(', ', $allowed_categories)
        ]);
        exit;
    }
}

// 3. Bangun parameter query untuk NewsAPI
$api_params = [];

if ($category !== null) {
    $api_params['category'] = $category;
}

// Tambahkan parameter sources jika ada (hanya karakter alfanumerik, dash, koma)
if (isset($_GET['sources']) && !empty($_GET['sources'])) {
    $api_params['sources'] = preg_replace('/[^a-zA-Z0-9\-,]/', '', $_GET['sources']);
}

// Tambahkan query pencarian jika ada
if (isset($_GET['q']) && !empty($_GET['q'])) {
    $api_params['q'] = $_GET['q'];
}

// Tambahkan limit pageSize jika ada (1-100)
if (isset($_GET['pageSize'])) {
    $pageSize = (int)$_GET['pageSize'];
    if ($pageSize > 0 && $pageSize <= 100) {
        $api_params['pageSize'] = $pageSize;
    }
}

// Selalu tambahkan API Key ke query
$api_params['apiKey'] = $config['api_key'];

// 4. Sistem Caching Sederhana (10 Menit)
// Buat key unik untuk cache berdasarkan parameter (tanpa menyertakan API Key)
$cache_params = $api_params;
unset($cache_params['apiKey']);
$cache_hash = md5($endpoint . '?' . http_build_query($cache_params));
$cache_file = $config['cache_dir'] . 'cache_' . $cache_hash . '.json';

$use_cache = false;

// Pastikan folder cache ada dan writable
if (!is_dir($config['cache_dir'])) {
    @mkdir($config['cache_dir'], 0755, true);
}

if (is_dir($config['cache_dir']) && is_writable($config['cache_dir'])) {
    $use_cache = true;
}

// Cek apakah cache yang valid sudah ada dan belum expired
if ($use_cache && file_exists($cache_file) && (time() - filemtime($cache_file) < $config['cache_time'])) {
    header('X-Cache: HIT');
    echo file_get_contents($cache_file);
    exit;
}

// 5. Request ke NewsAPI.org menggunakan cURL (lebih stabil dibanding file_get_contents)
$request_url = $config['base_url'] . $endpoint . '?' . http_build_query($api_params);

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $request_url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 15); // Timeout koneksi 15 detik
// NewsAPI mewajibkan User-Agent header agar tidak mengembalikan error 403 Forbidden
curl_setopt($ch, CURLOPT_USERAGENT, 'TheNewsProxy/1.0 (VPS; PHP Native)');

$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curl_error = curl_error($ch);
curl_close($ch);

// Tangani error cURL (misal VPS tidak terkoneksi ke internet)
if ($curl_error) {
    http_response_code(502); // Bad Gateway
    echo json_encode([
        'status' => 'error',
        'message' => 'Failed to connect to NewsAPI: ' . $curl_error
    ]);
    exit;
}

// Forward HTTP status code dari NewsAPI (misal 200 OK, 401 Unauthorized, 429 Too Many Requests)
http_response_code($http_code);

// Simpan response ke cache hanya jika status request OK (HTTP 200) dan datanya valid
if ($http_code === 200 && $use_cache) {
    $data_check = json_decode($response, true);
    if (json_last_error() === JSON_ERROR_NONE && isset($data_check['status']) && $data_check['status'] === 'ok') {
        @file_put_contents($cache_file, $response);
    }
}

header('X-Cache: MISS');
echo $response;
