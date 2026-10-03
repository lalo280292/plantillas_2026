<?php
// ===== CONFIGURACIÓN DEL EVENTO =====
// Contraseña para entrar a admin_lista.html y admin_confirmacion.html (¡cámbiala!)
define('ADMIN_PASSWORD', 'cambiar123');

// URL de la invitación. El link de cada invitado será BASE_URL_INVITACION . '?id=XXXX'
// Si se deja vacío, se usa el dominio actual + /index.html
define('BASE_URL_INVITACION', '');

// Carpeta donde se guardan los JSON (protegida con .htaccess)
define('DATA_DIR', __DIR__ . '/data');
