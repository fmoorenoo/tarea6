<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Si llegan datos por POST, se decodifican y se devuelven (rebote)
if (isset($_POST["x"])) {
    $obj = json_decode($_POST["x"], true);
    echo json_encode($obj);
    exit;
}

// Si no hay POST, se envían datos por defecto en el GET
$myObj = [
    "nombre"     => "Pepe",
    "apellido"   => "López Pérez",
    "dni"        => "12345678X",
    "fecha"      => "22/09/2000",
    "cp"         => "35500",
    "correo"     => "pepe@gmail.com",
    "telefono"   => "928666666",
    "movil"      => "666999666",
    "tarjeta"    => "4539955085883327",
    "iban"       => "ES7921000813610123456789",
    "contrasena" => "Pepe123456789_"
];

// Enviar el objeto por defecto
echo json_encode($myObj);
