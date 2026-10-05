<?php
// ===== CONFIGURACIÓN DEL EVENTO =====

// Clave para las páginas de administración (registro, confirmados, mesas, panel...).
// Se pide una sola vez por navegador. ¡Cámbiala antes de publicar!
// Si la dejas vacía ('') las páginas de administración quedan abiertas para cualquiera.
define('ADMIN_CLAVE', 'cambiar123');

// URL de la invitación. El link de cada invitado será URL_INVITACION . '?id=XXXXX'
// Ejemplo: 'https://lalo.inv15.com/'  ->  https://lalo.inv15.com/?id=KZ83C
// Si se deja vacía se usa la carpeta donde está este archivo.
define('URL_INVITACION', '');

// Carpeta donde viven invitados.json, confirmados.json y firmas.json
// (protegida con .htaccess para que nadie pueda descargarlos directamente).
define('DATA_DIR', __DIR__ . '/data');

// Cantidad de códigos que se generan si invitados.json no existe.
define('CODIGOS_INICIALES', 400);

// Zona horaria para la fecha de las confirmaciones.
date_default_timezone_set('America/Mexico_City');
