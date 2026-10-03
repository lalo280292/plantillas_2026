<?php
// proxy.php

// Habilitar la visualización de errores durante la depuración (deshabilitar en producción)
ini_set('display_errors', 1);
error_reporting(E_ALL);

// URL base del script de Google Apps

$googleScriptBaseUrl = 'https://script.google.com/macros/s/AKfycbxfwSmj3nsB8hWchIgbhlZiM3XSq_Jxi-rLd2sfSi5qmYMJFN_NcaIxUFxCO6NuFRFS/exec';

// Inicializar cURL
$ch = curl_init();

// Obtener el método de solicitud
$method = $_SERVER['REQUEST_METHOD'];

// Configurar cURL según el método
if ($method === 'POST') {
    // Solicitud POST
    $postData = $_POST;
    curl_setopt($ch, CURLOPT_URL, $googleScriptBaseUrl);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($postData));
} else {
    // Solicitud GET
    $queryString = $_SERVER['QUERY_STRING'];
    $url = $googleScriptBaseUrl . '?' . $queryString;
    curl_setopt($ch, CURLOPT_URL, $url);
}

// Opciones comunes de cURL
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HEADER, false);

// **Agregar esta línea para seguir redirecciones**
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);

// Ejecutar la solicitud
$response = curl_exec($ch);

// Obtener el código de estado HTTP
$httpStatus = curl_getinfo($ch, CURLINFO_HTTP_CODE);

// Manejar errores de cURL o HTTP
if (curl_errno($ch) || $httpStatus !== 200) {
    http_response_code($httpStatus ?: 500);
    header('Content-Type: application/json');
    $error_message = curl_error($ch) ?: 'Error en la conexión con el script de Google Apps.';
    echo json_encode(['error' => $error_message]);
} else {
    // Establecer el tipo de contenido y devolver la respuesta
    header('Content-Type: application/json');
    echo $response;
}

// Cerrar cURL
curl_close($ch);
?>