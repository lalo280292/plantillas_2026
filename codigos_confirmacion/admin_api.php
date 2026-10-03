<?php
// admin_api.php — API protegida para admin_lista.html y admin_confirmacion.html
require_once __DIR__ . '/db.php';
session_start();

$action = $_GET['action'] ?? '';
$input = json_decode(file_get_contents('php://input'), true) ?: [];

if ($action === 'login') {
    if (hash_equals(ADMIN_PASSWORD, (string)($input['password'] ?? ''))) {
        $_SESSION['admin'] = true;
        json_out(['status' => 'success']);
    }
    json_out(['status' => 'error', 'message' => 'Contraseña incorrecta'], 401);
}
if ($action === 'logout') {
    session_destroy();
    json_out(['status' => 'success']);
}
if (empty($_SESSION['admin'])) json_out(['status' => 'error', 'message' => 'No autorizado'], 401);

$NUM = ['Invitados', 'Adultos', 'Adolescentes', 'Ninos'];

/** Normaliza un invitado de la Lista */
function limpiar_invitado($d) {
    global $NUM;
    $r = [
        'ID'      => trim((string)($d['ID'] ?? '')),
        'Familia' => trim((string)($d['Familia'] ?? '')),
        'Nombres' => trim((string)($d['Nombres'] ?? '')),
        'Mesa'    => trim((string)($d['Mesa'] ?? '')),
        'Enviado' => strtoupper((string)($d['Enviado'] ?? '')) === 'TRUE' ? 'TRUE' : 'FALSE',
    ];
    foreach ($NUM as $k) $r[$k] = max(0, (int)($d[$k] ?? 0));
    // Si no se indica el total, se calcula
    if ($r['Invitados'] === 0) $r['Invitados'] = $r['Adultos'] + $r['Adolescentes'] + $r['Ninos'];
    return $r;
}

switch ($action) {
    case 'check':
        json_out(['status' => 'success']);

    case 'lista':
        json_out(lista_publica());

    case 'confirmacion':
        json_out(confirmacion_publica());

    case 'guardarInvitado':
        $inv = limpiar_invitado($input);
        if ($inv['Familia'] === '') json_out(['status' => 'error', 'message' => 'La familia es obligatoria'], 400);
        db_update('lista', function ($rows) use (&$inv) {
            foreach ($rows as &$r) {
                if ($inv['ID'] !== '' && $r['ID'] === $inv['ID']) { $r = $inv; return $rows; }
            }
            if ($inv['ID'] === '') $inv['ID'] = nuevo_id(array_column($rows, 'ID'));
            $rows[] = $inv;
            return $rows;
        });
        // Mantener el nombre de familia sincronizado en la confirmación
        db_update('confirmacion', function ($rows) use ($inv) {
            foreach ($rows as &$c) if ($c['id'] === $inv['ID']) $c['familia'] = $inv['Familia'];
            return $rows;
        });
        json_out(['status' => 'success', 'invitado' => $inv]);

    case 'eliminarInvitado':
        $id = (string)($input['id'] ?? '');
        db_update('lista', fn($rows) => array_filter($rows, fn($r) => $r['ID'] !== $id));
        db_update('confirmacion', fn($rows) => array_filter($rows, fn($c) => $c['id'] !== $id));
        json_out(['status' => 'success']);

    case 'guardarConfirmacion':
        $id = (string)($input['id'] ?? '');
        $campos = ['asistira', 'cantidad', 'adultos', 'adolescentes', 'ninos', 'nombres', 'felicitaciones'];
        $familia = '';
        foreach (db_read('lista') as $r) if ($r['ID'] === $id) $familia = $r['Familia'];
        if ($familia === '') json_out(['status' => 'error', 'message' => 'ID no existe en la Lista'], 400);
        db_update('confirmacion', function ($rows) use ($id, $input, $campos, $familia) {
            $nuevo = ['fecha' => date('Y-m-d H:i:s'), 'id' => $id, 'familia' => $familia];
            foreach ($rows as $i => $c) if ($c['id'] === $id) { $nuevo = $c; unset($rows[$i]); }
            foreach ($campos as $k) if (array_key_exists($k, $input)) $nuevo[$k] = is_string($input[$k]) ? trim($input[$k]) : $input[$k];
            $rows[] = $nuevo;
            return $rows;
        });
        json_out(['status' => 'success']);

    case 'eliminarConfirmacion':
        $id = (string)($input['id'] ?? '');
        db_update('confirmacion', fn($rows) => array_filter($rows, fn($c) => $c['id'] !== $id));
        json_out(['status' => 'success']);

    case 'importarGoogle':
        // Importa una sola vez los datos actuales desde el Apps Script de Google
        $url = trim((string)($input['url'] ?? ''));
        if (!preg_match('#^https://script\.google(usercontent)?\.com/#', $url)) {
            json_out(['status' => 'error', 'message' => 'URL de Apps Script inválida'], 400);
        }
        $get = function ($sheet) use ($url) {
            $ch = curl_init($url . '?sheet=' . $sheet);
            curl_setopt_array($ch, [CURLOPT_RETURNTRANSFER => true, CURLOPT_FOLLOWLOCATION => true, CURLOPT_TIMEOUT => 30]);
            $res = curl_exec($ch);
            curl_close($ch);
            $data = json_decode((string)$res, true);
            return is_array($data) ? $data : null;
        };
        $lista = $get('Lista');
        $conf = $get('Confirmacion');
        if ($lista === null) json_out(['status' => 'error', 'message' => 'No se pudo leer la hoja Lista'], 502);

        $lista = array_values(array_filter(array_map('limpiar_invitado', $lista), fn($r) => $r['ID'] !== '' && $r['Familia'] !== ''));
        $conf = array_values(array_filter(array_map(function ($c) {
            unset($c['qr'], $c['columna_L']);
            return array_map(fn($v) => is_string($v) ? trim($v) : $v, $c);
        }, $conf ?? []), fn($c) => trim((string)($c['id'] ?? '')) !== ''));
        // Dejar solo la última confirmación de cada ID
        $porId = [];
        foreach ($conf as $c) $porId[(string)$c['id']] = $c + ['fecha' => ''];

        db_update('lista', fn() => $lista);
        db_update('confirmacion', fn() => array_values($porId));
        json_out(['status' => 'success', 'lista' => count($lista), 'confirmacion' => count($porId)]);
}

json_out(['status' => 'error', 'message' => 'Acción desconocida'], 400);
