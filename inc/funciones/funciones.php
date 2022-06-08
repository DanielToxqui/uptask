<?php
function obtenerPaginaActual() {
    $archivo = basename($_SERVER['PHP_SELF']);
    return $archivo;
}
obtenerPaginaActual();