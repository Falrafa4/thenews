<?php
/**
 * API Configuration
 * 
 * File ini menyimpan informasi kredensial API Key NewsAPI.
 * Jangan commit file yang berisi API Key asli ke repositori publik (seperti GitHub).
 * Gunakan `.gitignore` untuk mengabaikan config.php jika diperlukan di production.
 */

// Mencegah akses langsung ke file ini secara langsung dari browser
if (!defined('SECURE_ACCESS')) {
    header('Content-Type: application/json');
    http_response_code(403);
    echo json_encode([
        'status' => 'error',
        'message' => 'Direct access to configuration file is not allowed.'
    ]);
    exit;
}

return [
    // Silakan ganti dengan API Key dari NewsAPI.org milik Anda
    'api_key' => '58f5f6729c53404dacfad472b35ad500', // Default placeholder API key (or active key if provided)
    'base_url' => 'https://newsapi.org/v2/',
    
    // Caching configuration
    'cache_time' => 600, // Durasi cache 10 menit (dalam detik)
    'cache_dir' => __DIR__ . '/../cache/'
];
