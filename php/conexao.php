<?php
$servidor = "localhost";
$usuario = "root";
$senha = "";
$banco = "astrotest";

$conn = new mysqli($servidor, $usuario, $senha, $banco);

if ($conn->connect_error) {
    die("Falha na conexão: " . $conn->connect_error);
}
?>
