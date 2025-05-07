<?php
session_start();
if (!isset($_SESSION['usuario'])) {
    header("Location: index.html"); // se não estiver logado, redireciona
    exit();
}
?>

<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Painel do Usuário</title>
</head>
<body>
    <h1>Bem-vindo, <?php echo $_SESSION['usuario']; ?>!</h1>
    <p>Você está logado.</p>
    <a href="logout.php">Sair</a>
</body>
</html>
