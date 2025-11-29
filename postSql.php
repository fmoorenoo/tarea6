<?php
header('Content-Type: application/json; charset=utf-8');

// Leer cuerpo enviado por POST
$rawBody = file_get_contents('php://input');
if (!$rawBody) {
    echo json_encode(['ok' => false, 'error' => 'No se han recibido datos']);
    exit;
}

$data = json_decode($rawBody, true);
if (!$data) {
    echo json_encode(['ok' => false, 'error' => 'JSON no válido']);
    exit;
}

// Conexión con MySQL
$mysqli = new mysqli('localhost', 'root', '', 'formulario');
if ($mysqli->connect_errno) {
    echo json_encode(['ok' => false, 'error' => 'Error de conexión a la base de datos']);
    exit;
}

// Comprobar si el DNI ya existe
$check = $mysqli->prepare('SELECT dni FROM usuarios WHERE dni = ?');
$check->bind_param('s', $data['dni']);
$check->execute();
$check->store_result();

if ($check->num_rows > 0) {
    // Si DNI ya existe, no insertar
    echo json_encode(['ok' => false, 'error' => 'Ya existe un usuario con ese DNI']);
    $check->close();
    $mysqli->close();
    exit;
}
$check->close();

// Insertar nuevo usuario
$stmt = $mysqli->prepare(
    'INSERT INTO usuarios 
    (dni, nombre, apellido, fecha, cp, correo, telefono, movil, tarjeta, iban, contrasena)
     VALUES (?,?,?,?,?,?,?,?,?,?,?)'
);

$stmt->bind_param(
    'sssssssssss',
    $data['dni'],
    $data['nombre'],
    $data['apellido'],
    $data['fecha'],
    $data['cp'],
    $data['correo'],
    $data['telefono'],
    $data['movil'],
    $data['tarjeta'],
    $data['iban'],
    $data['contrasena']
);

if ($stmt->execute()) {
    echo json_encode(['ok' => true]);
} else {
    echo json_encode(['ok' => false, 'error' => 'No se pudo guardar en la base de datos']);
}

$stmt->close();
$mysqli->close();
