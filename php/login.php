<?php
session_start();

// Conexão com o banco
$host = 'localhost';
$usuario = 'root';
$senha = '';
$banco = 'astrotest';

$conn = new mysqli($host, $usuario, $senha, $banco);

// Verifica conexão
if ($conn->connect_error) {
    die("Falha na conexão: " . $conn->connect_error);
}

// Recebe os dados do formulário
$email = $_POST['email'] ?? '';
$senha = $_POST['senha'] ?? '';

// Consulta o usuário pelo email
$sql = "SELECT id, nome, senha FROM usuarios WHERE email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();

$resultado = $stmt->get_result();
$usuario = $resultado->fetch_assoc();

if ($usuario && password_verify($senha, $usuario['senha'])) {
    // Login bem-sucedido
    $_SESSION['usuario_id'] = $usuario['id'];
    $_SESSION['usuario_nome'] = $usuario['nome'];

    header("Location: ../index.php");
    exit();
} else {
    echo "Email ou senha inválidos. <a href='../login.html'>Tentar novamente</a>";
}

$stmt->close();
$conn->close();
?>
