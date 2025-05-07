<?php
session_start();
?>


<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link rel="stylesheet" href="css/layout.css">
    <link rel="stylesheet" href="css/signos.css">
    <link rel="stylesheet" href="css/footer.css">


    <script src="js/signos.js" defer></script>

    <title>Signos</title>
</head>

<body>

    <div id="content">
        <header>
            <!-- <div id="contato"></div> -->
            <nav class="menu">
                <div id="logo"><a href="index.php">Astro<span id="logoSpan">Realm</span></a></div>
                <ul id="listaMenu">
                    <li class="menuItem"><a href="index.php">Home</a></li>
                    <li class="menuItem"><a href="horoscopo.php">Horóscopo</a></li>

                    <!-- Menu Dropdown para Signos do Zodíaco -->
                    <li class="menuItem dropdown">
                        <a href="signos.php" class="underline">Zodíaco</a>
                        <ul class="dropdown-content">
                            <li><a href="signos/aries.html">Áries</a></li>
                            <li><a href="signos/touro.html">Touro</a></li>
                            <li><a href="signos/gemeos.html">Gêmeos</a></li>
                            <li><a href="signos/cancer.html">Câncer</a></li>
                            <li><a href="signos/leao.html">Leão</a></li>
                            <li><a href="signos/virgem.html">Virgem</a></li>
                            <li><a href="signos/libra.html">Libra</a></li>
                            <li><a href="signos/escorpiao.html">Escorpião</a></li>
                            <li><a href="signos/sagitario.html">Sagitário</a></li>
                            <li><a href="signos/capricornio.html">Capricórnio</a></li>
                            <li><a href="signos/aquario.html">Aquário</a></li>
                            <li><a href="signos/peixes.html">Peixes</a></li>
                        </ul>
                    </li>

                    <li class="menuItem"><a href="astrologia.php">Astrologia</a></li>
                    <li class="menuItem"><a href="venda.html">Meu Mapa</a></li>
                    <li class="menuItem"><a href="">Coleção</a></li>
                </ul>

                <div id="divPerfil">

                    <?php if (isset($_SESSION['usuario_nome'])): ?>

                        <a href="perfil.php" class="usuario-logado">
                            <img src="imagens/icones/mars.png" alt="Foto do Usuário">
                            <div id="divInfoLogado">
                                <span>Perfil</span>
                                <span id="nomePerfil"><?php echo htmlspecialchars($_SESSION['usuario_nome']); ?></span>
                                <a href="php/logout.php">Sair</a>
                            </div>
                        </a>

                    <?php else: ?>
                        <a href="login.html">Login</a>
                    <?php endif; ?>
                </div>

            </nav>

            <div id="banner">
                <p>ZODÍACO</p>
            </div>
        </header>

        <div id="divConteudo">
            <div id="titleSigns">
                ESCOLHA SEU <strong>SIGNO</strong>
            </div>
            <div class="zodiacWheel">
                <div id="exibirSigno">

                </div>
                <div class="sign" style="--angle: 0deg;">
                    <a href="signos/cancer.php">
                        <img src="imagens/icones zodiaco c/cancer_pb.png" alt="Câncer" title="Câncer">
                    </a>
                </div>
                <!-- Câncer -->
                <div class="sign" style="--angle: 30deg;">
                    <a href="signos/leao.php">
                        <img src="imagens/icones zodiaco c/leo_pb.png" alt="Leão" title="Leão">
                    </a>
                </div> <!-- Leão -->
                <div class="sign" style="--angle: 60deg;">
                    <a href="signos/virgem.php">
                        <img src="imagens/icones zodiaco c//virgo_pb.png" alt="Virgem" title="Virgem">
                    </a>
                </div>
                <!-- Virgem -->
                <div class="sign" style="--angle: 90deg;">
                    <a href="signos/libra.php">
                        <img src="imagens/icones zodiaco c/libra_pb.png" alt="Libra" title="Libra">
                    </a>
                </div>
                <!-- Libra -->
                <div class="sign" style="--angle: 120deg;">
                    <a href="signos/escorpiao.php">
                        <img src="imagens/icones zodiaco c/scorpio_pb.png" alt="Escorpião" title="Escorpião">
                    </a>
                </div>
                <!-- Escorpião -->
                <div class="sign" style="--angle: 150deg;">
                    <a href="signos/sagitario.php">
                        <img src="imagens/icones zodiaco c/sagittarius_pb.png" alt="Sagitário" title="Sagitário">
                    </a>
                </div> <!-- Sagitário -->
                <div class="sign" style="--angle: 180deg;">
                    <a href="signos/capricornio.php">
                        <img src="imagens/icones zodiaco c/capricorn_pb.png" alt="Capricórnio" title="Capricórnio">
                    </a>
                </div> <!-- Capricórnio -->
                <div class="sign" style="--angle: 210deg;">
                    <a href="signos/aquario.php">
                        <img src="imagens/icones zodiaco c/aquarius_pb.png" alt="Aquário" title="Aquário">
                    </a>
                </div>
                <!-- Aquário -->
                <div class="sign" style="--angle: 240deg;">
                    <a href="signos/peixes.php">
                        <img src="imagens/icones zodiaco c/pisces_pb.png" alt="Peixes" title="Peixes">
                    </a>
                </div>
                <!-- Peixes -->
                <div class="sign" style="--angle: 270deg;">
                    <a href="signos/aries.php">
                        <img src="imagens/icones zodiaco c/aries_pb.png" alt="Áries" title="Áries">
                    </a>
                </div>
                <!-- Áries -->
                <div class="sign" style="--angle: 300deg;">
                    <a href="signos/touro.php">
                        <img src="imagens/icones zodiaco c/taurus_pb.png" alt="Touro" title="Touro">
                    </a>
                </div>
                <!-- Touro -->
                <div class="sign" style="--angle: 330deg;">
                    <a href="signos/gemeos.php">
                        <img src="imagens/icones zodiaco c/gemini_pb.png" alt="Gêmeos" title="Gêmeos">
                    </a>
                </div>
                <!-- Gêmeos -->
            </div>

        </div><!-- fim divConteud -->

    </div>

    <footer>
        <div id="footerContent">

            <div id="footerDivs">

                <div id="logoWrapper">
                    <div id="logoFooter">Astro<span id="spanFooter">Realm</span></div>
                    <p>
                        Descubra seu destino e conecte-se com o universo através da astrologia. <br>Explore os
                        mistérios
                        dos
                        signos e muito mais!
                    </p>
                </div>

                <div class="colunaFooter">
                    <h3>Contato</h3>
                    <ul>
                        <li>Email: contato@astrorealm.com</li>
                        <li>Telefone: (11) 1234-5678</li>
                        <li>
                            <ul id="redesSociaisLinks">
                                <li><a href="https://github.com/alvGitCodes"><img
                                            src="imagens/icones footer/github_1051275.png" title="GitHub" alt="github">
                                        <div>Github</div>
                                    </a></li>
                                <li><a href=""><img src="imagens/icones footer/linkedin_1051282.png" title="Linkedin"
                                            alt="linkedin">LinkedIn</a></li>
                                <li><a href=""><img src="imagens/icones footer/whatsapp_1051272.png" alt="">WhatsApp</a>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>

                <div class="colunaFooter">
                    <h3>Recursos</h3>
                    <ul class="reucursosLinks">
                        <li><a href="https://freepik.com/">Freepik</a></li>
                        <li><a href="https://rapidapi.com/">Rapid Api</a></li>
                        <li><a href="https://rapidapi.com/gbattaglia/api/astrologer">Astrologer</a></li>
                        <li><a href="https://rapidapi.com/ashutosh.devil7/api/horoscope19">Horoscope</a></li>
                        <li><a href="https://rapidapi.com/gatzuma/api/deep-translate1">Deep Translate</a></li>
                    </ul>
                </div>

            </div>

            <p class="footerCredits">© 2024 AstroRealm. Todos os direitos reservados. Imagens por Freepik.</p>
    </footer>


</body>

</html>