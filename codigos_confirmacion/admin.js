// admin.js — utilidades compartidas por admin_lista.html y admin_confirmacion.html

async function api(action, body) {
    const opts = body !== undefined
        ? { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
        : {};
    const res = await fetch(`admin_api.php?action=${action}&t=${Date.now()}`, opts);
    const data = await res.json().catch(() => ({ status: 'error', message: 'Respuesta inválida del servidor' }));
    if (res.status === 401 && action !== 'login') { mostrarLogin(); throw new Error('Sesión expirada'); }
    if (!res.ok || data.status === 'error') throw new Error(data.message || 'Error del servidor');
    return data;
}

function esc(v) {
    return String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function mostrarLogin() {
    if (document.getElementById('loginOverlay')) return;
    const div = document.createElement('div');
    div.id = 'loginOverlay';
    div.className = 'fixed inset-0 bg-gray-900/70 flex items-center justify-center z-50 p-4';
    div.innerHTML = `
        <form class="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm space-y-4">
            <h2 class="text-lg font-bold text-gray-800 flex items-center gap-2"><i class="ph ph-lock-key"></i> Acceso administrador</h2>
            <input type="password" required placeholder="Contraseña" class="w-full border rounded-lg px-3 py-2" autofocus>
            <p class="text-red-500 text-sm hidden"></p>
            <button class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-lg">Entrar</button>
        </form>`;
    document.body.appendChild(div);
    const form = div.querySelector('form');
    form.addEventListener('submit', async e => {
        e.preventDefault();
        try {
            await api('login', { password: form.querySelector('input').value });
            div.remove();
            if (typeof onLogin === 'function') onLogin();
        } catch (err) {
            const p = form.querySelector('p');
            p.textContent = err.message;
            p.classList.remove('hidden');
        }
    });
}

async function logout() {
    await api('logout', {});
    location.reload();
}

function descargarCSV(nombre, columnas, filas) {
    const linea = arr => arr.map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(',');
    const csv = '﻿' + [linea(columnas), ...filas.map(f => linea(columnas.map(c => f[c])))].join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    a.download = nombre;
    a.click();
}

// Al cargar: comprobar sesión
document.addEventListener('DOMContentLoaded', async () => {
    try { await api('check'); if (typeof onLogin === 'function') onLogin(); } catch (e) { /* se muestra login */ }
});
