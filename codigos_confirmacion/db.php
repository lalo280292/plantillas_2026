<?php
require_once __DIR__ . '/config.php';

/** Lee una "hoja" JSON (lista | confirmacion) */
function db_read($name) {
    $file = DATA_DIR . "/$name.json";
    if (!file_exists($file)) return [];
    $fp = fopen($file, 'r');
    flock($fp, LOCK_SH);
    $content = stream_get_contents($fp);
    flock($fp, LOCK_UN);
    fclose($fp);
    $data = json_decode($content, true);
    return is_array($data) ? $data : [];
}

/** Modifica una hoja con bloqueo exclusivo: $fn recibe el arreglo y devuelve el nuevo */
function db_update($name, callable $fn) {
    if (!is_dir(DATA_DIR)) mkdir(DATA_DIR, 0755, true);
    $file = DATA_DIR . "/$name.json";
    $fp = fopen($file, 'c+');
    flock($fp, LOCK_EX);
    $data = json_decode(stream_get_contents($fp), true);
    if (!is_array($data)) $data = [];
    $result = array_values($fn($data));
    ftruncate($fp, 0);
    rewind($fp);
    fwrite($fp, json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    fflush($fp);
    flock($fp, LOCK_UN);
    fclose($fp);
    return $result;
}

function base_dir_url() {
    $proto = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
    $dir = rtrim(str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'])), '/');
    return "$proto://{$_SERVER['HTTP_HOST']}$dir";
}

function base_invitacion() {
    return BASE_URL_INVITACION !== '' ? BASE_URL_INVITACION : base_dir_url() . '/index.html';
}

function nuevo_id($existentes) {
    $chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    do {
        $id = '';
        for ($i = 0; $i < 6; $i++) $id .= $chars[random_int(0, strlen($chars) - 1)];
    } while (in_array($id, $existentes, true));
    return $id;
}

/** Lista con el campo calculado Link (igual que la hoja de Google) */
function lista_publica() {
    $base = base_invitacion();
    $sep = strpos($base, '?') === false ? '?' : '&';
    return array_map(function ($r) use ($base, $sep) {
        $r['Link'] = $base . $sep . 'id=' . urlencode($r['ID']);
        return $r;
    }, db_read('lista'));
}

/** Confirmaciones con la mesa sincronizada desde la Lista y el link del QR */
function confirmacion_publica() {
    $mesas = [];
    foreach (db_read('lista') as $r) $mesas[$r['ID']] = $r['Mesa'] ?? '';
    $base = base_dir_url();
    return array_map(function ($c) use ($mesas, $base) {
        if (isset($mesas[$c['id']])) $c['mesa'] = $mesas[$c['id']];
        $c['qr'] = $base . '/paseqr.html?id=' . urlencode($c['id']);
        return $c;
    }, db_read('confirmacion'));
}

function json_out($data, $code = 200) {
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}
