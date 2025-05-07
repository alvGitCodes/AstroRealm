<?php
session_start();
?>

<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link rel="stylesheet" href="css/layout.css">
    <link rel="stylesheet" href="css/mapa.css">
    <link rel="stylesheet" href="css/footer.css">

    <!-- <script src="js/mapa.js" defer></script> -->
    <script src="js/mapa2.js" defer></script>

    <title>Meu Mapa</title>
</head>

<body>

    <div id="content">
        <header>
            <!-- <div id="contato"></div> -->
            <nav class="menu">
                <div id="logo" class="logoMapa"><a href="index.php">Astro<span id="logoSpan">Realm</span></a></div>
                <ul id="listaMenu">
                    <li class="menuItem"><a href="index.php">Home</a></li>
                    <li class="menuItem"><a href="horoscopo.php">Horóscopo</a></li>

                    <!-- Menu Dropdown para Signos do Zodíaco -->
                    <li class="menuItem dropdown">
                        <a href="signos.php">Zodíaco</a>
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
                        <a href="login.html" style="color: #fff;">Login</a>
                    <?php endif; ?>
                </div>

            </nav>

        </header>
        <div id="divSalvar">
            <button id="salvarMapa">Salvar Mapa</button>
        </div>

        <div id="mapaWrapper">
            <div id="divMapa">
                <div class="divisoria">Mapa Astral</div>
                <div id="chart"></div>

                <div id="infoUsuario">
                    <div id="nomeUsuario"></div>
                    <div id="localNasc" class="infosExtras"></div>
                    <div id="dataNasc" class="infosExtras"></div>
                </div>

                <div class="titles">PLANETAS</div>
                <div id="planetas">
                    <div id="sol"></div>
                    <div id="lua"></div>
                    <div id="mercurio"></div>
                    <div id="venus"></div>
                    <div id="marte"></div>
                    <div id="jupiter"></div>
                    <div id="saturno"></div>
                    <div id="urano"></div>
                    <div id="netuno"></div>
                    <div id="plutao"></div>
                    <div id="northNode"></div>
                    <div id="chiron"></div>
                    <div id="ascendente"></div>
                    <div id="mc"></div>
                </div>

                <div class="titles">ASPECTOS</div>
                <div id="aspectos">
                    <div></div>
                </div>
            </div>

        </div>

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