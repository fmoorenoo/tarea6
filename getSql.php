<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Content-Type: application/json; charset=utf-8');

// Obtener el DNI enviado por GET
$dni = $_GET['dni'] ?? '';

// Si no se envió DNI, salir
if ($dni === '') {
    echo json_encode(null);
    exit;
}

// Conexión con MySQL
$mysqli = new mysqli('localhost', 'usuariodew', '1234', 'dew');

if ($mysqli->connect_errno) {
    echo json_encode(['ok' => false, 'error' => 'Error de conexión a la base de datos']);
    exit;
}

// Consulta
$stmt = $mysqli->prepare(
    'SELECT dni, nombre, apellido, fecha, cp, correo,
            telefono, movil, tarjeta, iban, contrasena
    FROM usuarios WHERE dni = ?'
);

$stmt->bind_param('s', $dni);
$stmt->execute();
$result = $stmt->get_result();

// Si existe el usuario, devolver sus datos como JSON
if ($row = $result->fetch_assoc()) {
    echo json_encode([
        'dni'         => $row['dni'],
        'nombre'      => $row['nombre'],
        'apellido'    => $row['apellido'],
        'fecha'       => $row['fecha'],
        'cp'          => $row['cp'],
        'correo'      => $row['correo'],
        'telefono'    => $row['telefono'],
        'movil'       => $row['movil'],
        'tarjeta'     => $row['tarjeta'],
        'iban'        => $row['iban'],
        'contrasena'  => $row['contrasena']
    ]);
} else {
    echo json_encode(null);
}

$stmt->close();
$mysqli->close();
