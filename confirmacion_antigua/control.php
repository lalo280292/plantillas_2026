<?php
// Ruta al archivo que almacenará el estado de visibilidad
$filename = 'form_visibility.txt';

// Si se recibe una acción para establecer el estado
if (isset($_GET['action']) && $_GET['action'] === 'set') {
    // Obtener el valor de 'visible' y guardarlo en el archivo
    $visible = $_GET['visible'] === 'true' ? 'true' : 'false';
    file_put_contents($filename, $visible);
    // Mostrar el mensaje correspondiente
    if ($visible === 'true') {
        echo 'Confirmación de asistencia Activada';
    } else {
        echo 'Confirmación de asistencia Desactivada';
    }
} else {
    // Leer el estado actual desde el archivo
    $visible = file_exists($filename) ? trim(file_get_contents($filename)) : 'false';
    $visible = $visible === 'true' ? true : false;
    // Devolver el estado en formato JSON
    header('Content-Type: application/json');
    echo json_encode(['formVisible' => $visible]);
}
?>

