<?php
// api.php — Backend único del sistema de confirmación.
// Reemplaza a proxy.php (Google Sheets) y a control.php.
//
// Bases de datos (carpeta data/):
//   invitados.json   -> lo llena registro.html (400 códigos)
//   confirmados.json -> lo llena el formulario de confirmacion.html
//   firmas.json      -> felicitaciones que se escriben en confirmacion.html
//
// Acciones públicas (las usan los invitados):
//   GET  api.php?accion=invitado&id=XXXXX      datos de la invitación + estado del formulario
//   GET  api.php?accion=confirmacion&id=XXXXX  confirmación registrada (escaner / pase QR)
//   GET  api.php?accion=firmas                 libro de firmas
//   GET  api.php?accion=formulario             ¿el formulario está abierto?
//   POST api.php?accion=confirmar              envía el formulario de confirmación
//
// Acciones de administración (requieren la clave de config.php en el encabezado X-Clave):
//   GET  api.php?accion=invitados
//   POST api.php?accion=guardar_invitados      {"cambios":[{id, familia, ...}]}
//   GET  api.php?accion=confirmados
//   POST api.php?accion=actualizar_mesa        {"id":"XXXXX","mesa":"5"}
//   POST api.php?accion=formulario             {"visible":true}
//   GET  api.php?accion=respaldo               descarga de los 3 JSON juntos

require __DIR__ . '/config.php';

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate');
header('X-Content-Type-Options: nosniff');

const ALFABETO_ID = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // sin 0/O ni 1/I para evitar confusiones

// ---------- Respuestas ----------

function responder($datos, $codigo = 200)
{
    http_response_code($codigo);
    echo json_encode($datos, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function fallar($mensaje, $codigo = 400)
{
    responder(['ok' => false, 'error' => $mensaje], $codigo);
}

// ---------- Limpieza de datos ----------

function texto($valor, $max)
{
    if (!is_scalar($valor)) return '';
    // Quita caracteres de control (conserva saltos de línea). Si el texto no es UTF-8 válido, preg devuelve null.
    $valor = preg_replace('/[\x00-\x09\x0B-\x1F\x7F]/u', '', trim((string) $valor));
    if ($valor === null) return '';
    if (preg_match('/^.{0,' . (int) $max . '}/su', $valor, $m)) $valor = $m[0];
    return trim($valor);
}

function entero($valor, $min, $max)
{
    $n = is_numeric($valor) ? (int) $valor : 0;
    return max($min, min($max, $n));
}

function normalizar_id($valor)
{
    $id = strtoupper(texto($valor, 20));
    return preg_match('/^[A-Z0-9]{1,20}$/', $id) ? $id : '';
}

// ---------- Almacenamiento JSON ----------

function invitado_vacio($id)
{
    return [
        'id' => $id, 'familia' => '', 'total' => 0, 'adultos' => 0, 'adolescentes' => 0,
        'ninos' => 0, 'nombres' => '', 'mesa' => '', 'enviado' => false,
    ];
}

function generar_id(array $usados)
{
    do {
        $id = '';
        for ($i = 0; $i < 5; $i++) $id .= ALFABETO_ID[random_int(0, strlen(ALFABETO_ID) - 1)];
    } while (isset($usados[$id]) || !preg_match('/[A-Z]/', $id) || !preg_match('/[0-9]/', $id));
    return $id;
}

function datos_iniciales($nombre)
{
    if ($nombre !== 'invitados') return [];
    $usados = [];
    $lista = [];
    while (count($lista) < CODIGOS_INICIALES) {
        $id = generar_id($usados);
        $usados[$id] = true;
        $lista[] = invitado_vacio($id);
    }
    return $lista;
}

/**
 * Abre una base JSON con candado exclusivo. Si $modificar se indica, recibe el arreglo
 * por referencia, puede cambiarlo y lo que devuelva se regresa al llamador.
 * La escritura es atómica (archivo temporal + rename) para que nunca quede un JSON a medias.
 */
function con_base($nombre, $modificar = null)
{
    if (!is_dir(DATA_DIR) && !@mkdir(DATA_DIR, 0755, true)) fallar('No se pudo crear la carpeta data/', 500);

    $candado = @fopen(DATA_DIR . "/$nombre.lock", 'c');
    if (!$candado) fallar('Sin permisos de escritura en la carpeta data/', 500);
    flock($candado, LOCK_EX);

    $archivo = DATA_DIR . "/$nombre.json";
    $crear = !is_file($archivo) || filesize($archivo) === 0;
    // (se quita el BOM por si el archivo se editó y guardó con el Bloc de notas)
    $datos = $crear ? datos_iniciales($nombre) : json_decode(preg_replace('/^\xEF\xBB\xBF/', '', file_get_contents($archivo)), true);
    // Si el archivo está dañado no lo sobrescribimos: se perderían los datos.
    if (!is_array($datos)) fallar("El archivo $nombre.json está dañado. Revísalo o restaura un respaldo.", 500);

    $resultado = $datos;
    if ($modificar) $resultado = $modificar($datos);

    if ($modificar || $crear) {
        $json = json_encode(array_values($datos), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        $temporal = $archivo . '.tmp';
        if ($json === false || file_put_contents($temporal, $json) === false || !rename($temporal, $archivo)) {
            fallar("No se pudo guardar $nombre.json (revisa permisos de escritura).", 500);
        }
    }

    flock($candado, LOCK_UN);
    fclose($candado);
    return $resultado;
}

function leer($nombre)
{
    return con_base($nombre);
}

function indice(array $lista, $id)
{
    foreach ($lista as $i => $fila) {
        if (isset($fila['id']) && strtoupper($fila['id']) === $id) return $i;
    }
    return -1;
}

// Si la confirmación no tiene mesa propia, se muestra la mesa asignada en invitados.json
function con_mesa(array $confirmacion, array $invitados)
{
    if (trim((string) ($confirmacion['mesa'] ?? '')) === '') {
        $i = indice($invitados, $confirmacion['id']);
        $confirmacion['mesa'] = $i >= 0 ? $invitados[$i]['mesa'] : '';
    }
    return $confirmacion;
}

// ---------- Estado del formulario (antes control.php) ----------

function formulario_visible()
{
    $archivo = DATA_DIR . '/formulario.txt';
    return is_file($archivo) && trim(file_get_contents($archivo)) === 'true';
}

// ---------- Utilidades ----------

function requiere_admin()
{
    if (ADMIN_CLAVE === '') return;
    $clave = rawurldecode($_SERVER['HTTP_X_CLAVE'] ?? '');
    if (!hash_equals(ADMIN_CLAVE, $clave)) {
        sleep(1); // frena intentos repetidos
        fallar('Clave de administración incorrecta.', 401);
    }
}

function requiere_post()
{
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') fallar('Método no permitido.', 405);
}

function url_invitacion()
{
    if (URL_INVITACION !== '') return URL_INVITACION;
    $https = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
        || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https');
    $carpeta = rtrim(str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'])), '/');
    return ($https ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST'] . $carpeta . '/';
}

// ---------- Entrada ----------

$accion = $_GET['accion'] ?? ($_POST['accion'] ?? '');
$entrada = $_POST;
if (stripos($_SERVER['CONTENT_TYPE'] ?? '', 'application/json') !== false) {
    $entrada = json_decode(file_get_contents('php://input'), true);
    if (!is_array($entrada)) $entrada = [];
}

switch ($accion) {

    // ===== PÚBLICAS =====

    case 'invitado':
        $id = normalizar_id($_GET['id'] ?? '');
        $invitados = leer('invitados');
        $i = indice($invitados, $id);
        if ($i < 0 || $invitados[$i]['familia'] === '') fallar('Invitación no encontrada.', 404);

        $invitado = $invitados[$i];
        unset($invitado['enviado']);
        $confirmados = leer('confirmados');
        $j = indice($confirmados, $id);

        responder([
            'ok' => true,
            'formVisible' => formulario_visible(),
            'invitado' => $invitado,
            'confirmacion' => $j >= 0 ? con_mesa($confirmados[$j], $invitados) : null,
        ]);

    case 'confirmacion':
        $id = normalizar_id($_GET['id'] ?? '');
        $confirmados = leer('confirmados');
        $j = indice($confirmados, $id);
        if ($j < 0) fallar('Aún no hay una confirmación registrada con este código.', 404);
        responder(['ok' => true, 'confirmacion' => con_mesa($confirmados[$j], leer('invitados'))]);

    case 'firmas':
        $firmas = leer('firmas');
        usort($firmas, function ($a, $b) { return strcmp($b['fecha'] ?? '', $a['fecha'] ?? ''); });
        responder(['ok' => true, 'firmas' => $firmas]);

    case 'formulario':
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            requiere_admin();
            $visible = filter_var($entrada['visible'] ?? false, FILTER_VALIDATE_BOOLEAN);
            if (!is_dir(DATA_DIR)) @mkdir(DATA_DIR, 0755, true);
            if (file_put_contents(DATA_DIR . '/formulario.txt', $visible ? 'true' : 'false') === false) {
                fallar('No se pudo guardar el estado (revisa permisos de escritura).', 500);
            }
            responder([
                'ok' => true,
                'formVisible' => $visible,
                'mensaje' => $visible ? 'Confirmación de asistencia Activada' : 'Confirmación de asistencia Desactivada',
            ]);
        }
        responder(['ok' => true, 'formVisible' => formulario_visible()]);

    case 'confirmar':
        requiere_post();
        if (!formulario_visible()) fallar('La confirmación de asistencia está cerrada.', 403);

        $id = normalizar_id($entrada['id'] ?? '');
        $invitados = leer('invitados');
        $i = indice($invitados, $id);
        if ($i < 0 || $invitados[$i]['familia'] === '') fallar('El código de invitación no es válido.', 404);
        $inv = $invitados[$i];

        $asistira = $entrada['asistira'] ?? '';
        if (!in_array($asistira, ['Si', 'No'], true)) fallar('Por favor, indica si asistirás.');

        $adultos = $adolescentes = $ninos = $cantidad = 0;
        $nombres = '';
        if ($asistira === 'Si') {
            // Nunca se aceptan más lugares de los asignados en la invitación
            $adultos = entero($entrada['cantidad_adultos'] ?? 0, 0, (int) $inv['adultos']);
            $adolescentes = entero($entrada['cantidad_adolescentes'] ?? 0, 0, (int) $inv['adolescentes']);
            $ninos = entero($entrada['cantidad_ninos'] ?? 0, 0, (int) $inv['ninos']);
            $suma = $adultos + $adolescentes + $ninos;
            $maximo = max((int) $inv['total'], (int) $inv['adultos'] + (int) $inv['adolescentes'] + (int) $inv['ninos']);
            $cantidad = $suma > 0 ? $suma : entero($entrada['cantidad_personas'] ?? 0, 0, $maximo);
            if ($cantidad < 1) fallar('Indica cuántas personas asistirán.');
            $nombres = texto($entrada['nombres_personas'] ?? '', 1000);
        }
        $mensaje = texto($entrada['felicitaciones'] ?? '', 2000);
        $ahora = date('Y-m-d H:i:s');

        // Si el invitado vuelve a confirmar se actualiza su registro (no se duplica)
        $registro = con_base('confirmados', function (array &$lista) use ($id, $inv, $asistira, $cantidad, $adultos, $adolescentes, $ninos, $nombres, $ahora) {
            $j = indice($lista, $id);
            $previo = $j >= 0 ? $lista[$j] : null;
            $registro = [
                'id' => $id,
                'familia' => $inv['familia'],
                'asistira' => $asistira,
                'cantidad' => $cantidad,
                'adultos' => $adultos,
                'adolescentes' => $adolescentes,
                'ninos' => $ninos,
                'nombres' => $nombres,
                'mesa' => $previo ? ($previo['mesa'] ?? '') : '', // conserva la mesa si ya la editaron en confirmados.html
                'fecha' => $previo ? $previo['fecha'] : $ahora,
                'actualizado' => $ahora,
            ];
            if ($j >= 0) $lista[$j] = $registro;
            else $lista[] = $registro;
            return $registro;
        });

        if ($mensaje !== '') {
            con_base('firmas', function (array &$lista) use ($id, $inv, $mensaje, $ahora) {
                $firma = ['id' => $id, 'nombre' => $inv['familia'], 'mensaje' => $mensaje, 'fecha' => $ahora];
                $j = indice($lista, $id);
                if ($j >= 0) $lista[$j] = $firma;
                else $lista[] = $firma;
            });
        }

        responder(['ok' => true, 'confirmacion' => con_mesa($registro, $invitados)]);

    // ===== ADMINISTRACIÓN =====

    case 'invitados':
        requiere_admin();
        responder(['ok' => true, 'invitados' => leer('invitados'), 'url_invitacion' => url_invitacion()]);

    case 'guardar_invitados':
        requiere_admin();
        requiere_post();
        $cambios = $entrada['cambios'] ?? null;
        if (!is_array($cambios) || count($cambios) > 5000) fallar('No se recibieron cambios válidos.');

        $guardados = con_base('invitados', function (array &$lista) use ($cambios) {
            $posicion = [];
            foreach ($lista as $k => $fila) $posicion[$fila['id']] = $k;
            $n = 0;
            foreach ($cambios as $c) {
                if (!is_array($c)) continue;
                $id = normalizar_id($c['id'] ?? '');
                if ($id === '') continue;
                $fila = isset($posicion[$id]) ? $lista[$posicion[$id]] : invitado_vacio($id);
                if (array_key_exists('familia', $c)) $fila['familia'] = texto($c['familia'], 150);
                if (array_key_exists('nombres', $c)) $fila['nombres'] = texto($c['nombres'], 1000);
                if (array_key_exists('mesa', $c)) $fila['mesa'] = texto($c['mesa'], 30);
                foreach (['total', 'adultos', 'adolescentes', 'ninos'] as $campo) {
                    if (array_key_exists($campo, $c)) $fila[$campo] = entero($c[$campo], 0, 999);
                }
                if (array_key_exists('enviado', $c)) $fila['enviado'] = filter_var($c['enviado'], FILTER_VALIDATE_BOOLEAN);
                if (isset($posicion[$id])) {
                    $lista[$posicion[$id]] = $fila;
                } else {
                    $posicion[$id] = count($lista);
                    $lista[] = $fila;
                }
                $n++;
            }
            return $n;
        });
        responder(['ok' => true, 'guardados' => $guardados, 'fecha' => date('Y-m-d H:i:s')]);

    case 'confirmados':
        requiere_admin();
        $invitados = leer('invitados');
        $confirmados = array_map(function ($c) use ($invitados) { return con_mesa($c, $invitados); }, leer('confirmados'));
        responder(['ok' => true, 'confirmados' => $confirmados]);

    case 'actualizar_mesa':
        requiere_admin();
        requiere_post();
        $id = normalizar_id($entrada['id'] ?? '');
        $mesa = texto($entrada['mesa'] ?? '', 30);
        $encontrado = con_base('confirmados', function (array &$lista) use ($id, $mesa) {
            $j = indice($lista, $id);
            if ($j < 0) return false;
            $lista[$j]['mesa'] = $mesa;
            return true;
        });
        if (!$encontrado) fallar('No existe una confirmación con ese código.', 404);
        responder(['ok' => true, 'id' => $id, 'mesa' => $mesa]);

    case 'respaldo':
        requiere_admin();
        header('Content-Disposition: attachment; filename="respaldo-invitaciones-' . date('Ymd-His') . '.json"');
        responder([
            'ok' => true,
            'generado' => date('Y-m-d H:i:s'),
            'invitados' => leer('invitados'),
            'confirmados' => leer('confirmados'),
            'firmas' => leer('firmas'),
        ]);

    default:
        fallar('Acción no válida.', 404);
}
