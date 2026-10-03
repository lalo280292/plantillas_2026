<?php
// proxy.php — Backend propio (PHP + JSON). Mantiene el mismo contrato que
// el antiguo Google Apps Script para que las páginas existentes no cambien.
//   GET  ?sheet=Lista | Confirmacion | Firmas
//   POST method=updateSent (id, status)    -> marca invitación como enviada
//   POST (formulario de confirmacion.html)  -> guarda/actualiza la confirmación
// Respaldo del proxy original a Google: proxy_google_backup.php
require_once __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    switch (strtolower($_GET['sheet'] ?? 'Lista')) {
        case 'confirmacion':
            json_out(confirmacion_publica());
        case 'firmas':
            $firmas = [];
            foreach (db_read('confirmacion') as $c) {
                if (trim($c['felicitaciones'] ?? '') !== '') {
                    $firmas[] = ['Nombre' => $c['familia'], 'Mensaje' => $c['felicitaciones']];
                }
            }
            json_out($firmas);
        default:
            json_out(lista_publica());
    }
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') json_out(['status' => 'error', 'message' => 'Método no permitido'], 405);

if (($_POST['method'] ?? '') === 'updateSent') {
    $id = trim($_POST['id'] ?? '');
    $status = strtoupper($_POST['status'] ?? '') === 'TRUE' ? 'TRUE' : 'FALSE';
    $found = false;
    db_update('lista', function ($rows) use ($id, $status, &$found) {
        foreach ($rows as &$r) if ($r['ID'] === $id) { $r['Enviado'] = $status; $found = true; }
        return $rows;
    });
    json_out($found ? ['status' => 'success'] : ['status' => 'error', 'message' => 'ID no encontrado'], $found ? 200 : 404);
}

// ---- Confirmación de asistencia ----
$id = trim($_POST['id'] ?? '');
$invitado = null;
foreach (db_read('lista') as $r) if ($r['ID'] === $id) $invitado = $r;
if (!$invitado) json_out(['status' => 'error', 'message' => 'ID de invitación no válido'], 404);

$asistira = ($_POST['asistira'] ?? '') === 'No' ? 'No' : 'Si';
// Nunca permitir más lugares de los asignados en la Lista
$lim = function ($campo, $max) use ($asistira) {
    return $asistira === 'No' ? 0 : max(0, min((int)($_POST[$campo] ?? 0), (int)$max));
};
$registro = [
    'fecha'          => date('Y-m-d H:i:s'),
    'id'             => $id,
    'familia'        => $invitado['Familia'],
    'asistira'       => $asistira,
    'cantidad'       => $lim('cantidad_personas', $invitado['Invitados'] ?? 0),
    'adultos'        => $lim('cantidad_adultos', $invitado['Adultos'] ?? 0),
    'adolescentes'   => $lim('cantidad_adolescentes', $invitado['Adolescentes'] ?? 0),
    'ninos'          => $lim('cantidad_ninos', $invitado['Ninos'] ?? 0),
    'nombres'        => $asistira === 'No' ? '' : trim($_POST['nombres_personas'] ?? ''),
    'felicitaciones' => trim($_POST['felicitaciones'] ?? ''),
    'mesa'           => $invitado['Mesa'] ?? '',
];

// Si el invitado vuelve a confirmar, se reemplaza su registro anterior
db_update('confirmacion', function ($rows) use ($registro) {
    $rows = array_filter($rows, fn($c) => $c['id'] !== $registro['id']);
    $rows[] = $registro;
    return $rows;
});
json_out(['status' => 'success', 'result' => 'success']);
