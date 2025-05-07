<?php
session_start();
?>

<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- css e js -->
    <link rel="stylesheet" href="css/horoscopo.css">
    <link rel="stylesheet" href="css/layout.css">
    <link rel="stylesheet" href="css/footer.css">

    <link rel="stylesheet" href="css/login.css">
    <script src="js/login.js" defer></script>

    <script src="js/cssGeral.js" defer></script>
    <title>AstroRealm: Horóscopo</title>
</head>

<body>

    <div id="content">
        <header>
            <!-- <div id="contato"></div> -->
            <nav class="menu">
                <div id="logo"><a href="index.php">Astro<span id="logoSpan">Realm</span></a></div>
                <ul id="listaMenu">
                    <li class="menuItem"><a href="index.php">Home</a></li>
                    <li class="menuItem"><a href="horoscopo.php" class="underline">Horóscopo</a></li>

                    <!-- Menu Dropdown para Signos do Zodíaco -->
                    <li class="menuItem dropdown">
                        <a href="signos.php">Zodíaco</a>
                        <ul class="dropdown-content">
                            <li><a href="aries.html">Áries</a></li>
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
                <p>HORÓSCOPO</p>
            </div>
        </header>

        <div id="divInfo">

            <div id="divSignos">

                <div id="titleSigns">
                    ESCOLHA SEU <strong>SIGNO</strong>
                </div>

                <div class="linhaSignos">
                    <div class="signos">
                        <a href="horoscoposGerais.php?signo=aries"><img
                                src="imagens/icones zodiaco b/aries_3158362.png" alt="Áries" title="Áries"></a>
                    </div>
                    <div class="signos">
                        <a href="horoscoposGerais.php?signo=taurus"><img
                                src="imagens/icones zodiaco b/taurus_3158373.png" alt="Touro" title="Touro"></a>
                    </div>
                    <div class="signos">
                        <a href="horoscoposGerais.php?signo=gemini"><img
                                src="imagens/icones zodiaco b/gemini_3158383.png" alt="Gêmeos" title="Gêmeos"></a>
                    </div>
                    <div class="signos">
                        <a href="horoscoposGerais.php?signo=cancer"><img
                                src="imagens/icones zodiaco b/cancer_3158384.png" alt="Câncer" title="Câncer"></a>
                    </div>
                    <div class="signos">
                        <a href="horoscoposGerais.php?signo=leo"><img src="imagens/icones zodiaco b/leo_3158385.png"
                                alt="Leão" title="Leão"></a>
                    </div>
                    <div class="signos">
                        <a href="horoscoposGerais.php?signo=virgo"><img
                                src="imagens/icones zodiaco b/virgo_3158386.png" alt="Virgem" title="Virgem"></a>
                    </div>

                    <div class="signos">
                        <a href="horoscoposGerais.php?signo=libra"><img
                                src="imagens/icones zodiaco b/libra_3158387.png" alt="Libra" title="Libra"></a>
                    </div>
                    <div class="signos">
                        <a href="horoscoposGerais.php?signo=scorpio"><img
                                src="imagens/icones zodiaco b/scorpio_3158388.png" alt="Escorpião"
                                title="Escorpião"></a>
                    </div>
                    <div class="signos">
                        <a href="horoscoposGerais.php?signo=sagittarius"><img
                                src="imagens/icones zodiaco b/sagittarius_3158389.png" alt="Sagitário"
                                title="Sagitário"></a>
                    </div>
                    <div class="signos">
                        <a href="horoscoposGerais.php?signo=capricorn"><img
                                src="imagens/icones zodiaco b/capricorn_3158363.png" alt="Capricórnio"
                                title="Capricórnio"></a>
                    </div>
                    <div class="signos">
                        <a href="horoscoposGerais.php?signo=aquarius"><img
                                src="imagens/icones zodiaco b/aquarius_3158364.png" alt="Aquário" title="Aquário"></a>
                    </div>
                    <div class="signos">
                        <a href="horoscoposGerais.php?signo=pisces"><img
                                src="imagens/icones zodiaco b/pisces_3158365.png" alt="Peixes" title="Peixes"></a>
                    </div>

                </div>

            </div><!-- fim divSignos -->


            <div id="sobreHoroscopo">
                <h1>O que é Horóscopo...</h1>
                <p>
                    Horóscopo é uma prática de previsão ou análise de eventos futuros e comportamentos pessoais baseada
                    na posição dos astros (planetas, estrelas e outros corpos celestes) no momento do nascimento de uma
                    pessoa. Essa prática tem suas raízes na astrologia, que é uma tradição que remonta a milhares de
                    anos e busca entender a influência dos astros na vida humana.
                </p>
                <p>
                    De maneira mais simples, o horóscopo se refere a um conjunto de previsões ou conselhos que são
                    feitos a partir da análise dos signos astrológicos, que estão ligados ao movimento dos planetas e
                    das constelações no céu.
                </p>
            </div>

            <ul id="tabelaSignos">

                <li class="tabelaItemCard">
                    <div class="imgLista">
                        <a href="horoscoposGerais.php?signo=aries"><img src="imagens/icones zodiaco c/aries.png"
                                alt="Aries" title="Áries"></a>
                    </div>
                    <div class="corpoLista">
                        <h2><a href="horoscoposGerais.php?signo=aries">Horóscopo de Áries</a></h2>
                        <p>Pessoas de Áries, nascidas entre 21 de março e 19 de abril, são geralmente conhecidas por sua
                            energia intensa, coragem e determinação. Áries é um signo de fogo regido por Marte, o
                            planeta da ação e da guerra, o que contribui para a personalidade dinâmica, direta e muitas
                            vezes impulsiva dessas pessoas. <br><a href="horoscoposGerais.php?signo=aries">Leia
                                mais...</a> </p>
                    </div>
                </li>

                <li class="tabelaItemCard">
                    <div class="imgLista">
                        <a href="horoscoposGerais.php?signo=taurus"><img src="imagens/icones zodiaco c/taurus.png"
                                alt="Touro" title="Touro"></a>
                    </div>
                    <div class="corpoLista">
                        <h2><a href="horoscoposGerais.php?signo=taurus">Horóscopo de Touro</a></h2>
                        <p>Pessoas de Touro, nascidas entre 20 de abril e 20 de maio, são conhecidas por sua
                            estabilidade, determinação e apreciação pelas coisas boas da vida. Touro é um signo de terra
                            regido por Vênus, o planeta do amor, da beleza e dos prazeres materiais, o que contribui
                            para uma personalidade prática, leal e também sensível aos prazeres sensoriais. <br><a
                                href="horoscoposGerais.php?signo=taurus">Leia Mais...</a> </p>
                    </div>
                </li>

                <li class="tabelaItemCard">
                    <div class="imgLista">
                        <a href="horoscoposGerais.php?signo=gemini"><img src="imagens/icones zodiaco c/gemini.png"
                                alt="Gemeos" title="Gêmeos"></a>
                    </div>
                    <div class="corpoLista">
                        <h2><a href="horoscoposGerais.php?signo=gemini">Horóscopo de Gêmeos</a></h2>
                        <p>
                            Pessoas de Gêmeos, nascidas entre 21 de maio e 20 de junho, são conhecidas por sua
                            inteligência, curiosidade e versatilidade. Gêmeos é um signo de ar regido por Mercúrio, o
                            planeta da comunicação, do pensamento e das viagens, o que contribui para uma personalidade
                            inquieta, expressiva e que ama novidades. <br><a href="horoscoposGerais.php?signo=gemini">
                                Leia Mais...</a>
                        </p>
                    </div>
                </li>

                <li class="tabelaItemCard">
                    <div class="imgLista">
                        <a href="horoscoposGerais.php?signo=cancer"><img src="imagens/icones zodiaco c/cancer.png"
                                alt="Câncer" title="Câncer"></a>
                    </div>
                    <div class="corpoLista">
                        <h2><a href="horoscoposGerais.php?signo=cancer">Horóscopo de Câncer</a></h2>
                        <p>
                            Pessoas de Câncer, nascidas entre 21 de junho e 22 de julho, são conhecidas por sua
                            sensibilidade, empatia e forte conexão com a família e o lar. Câncer é um signo de água
                            regido pela Lua, o que os torna profundamente ligados às suas emoções e aos sentimentos das
                            pessoas ao seu redor. São intuitivos, cuidadosos e possuem uma personalidade que valoriza o
                            amor e a segurança emocional. <br><a href="horoscoposGerais.php?signo=cancer"> Leia
                                Mais...</a>
                        </p>
                    </div>
                </li>

                <li class="tabelaItemCard">
                    <div class="imgLista">
                        <a href="horoscoposGerais.php?signo=leo"><img src="imagens/icones zodiaco c/leo.png" alt="Leao"
                                title="Leão"></a>
                    </div>
                    <div class="corpoLista">
                        <h2><a href="horoscoposGerais.php?signo=leo">Horóscopo de Leão</a></h2>
                        <p>
                            Pessoas de Leão, nascidas entre 23 de julho e 22 de agosto, são conhecidas por sua presença
                            marcante, autoconfiança e carisma natural. Leão é um signo de fogo regido pelo Sol, o astro
                            que representa a vitalidade, a expressão pessoal e a força interior. Isso contribui para que
                            leoninos sejam pessoas determinadas, generosas e apaixonadas pela vida.<br> <a
                                href="horoscoposGerais.php?signo=leo"> Leia Mais...</a>
                        </p>
                    </div>
                </li>

                <li class="tabelaItemCard">
                    <div class="imgLista">
                        <a href="horoscoposGerais.php?signo=virgo"><img src="imagens/icones zodiaco c/virgo.png"
                                alt="Virgem" title="Virgem"></a>
                    </div>
                    <div class="corpoLista">
                        <h2><a href="horoscoposGerais.php?signo=virgo">Horóscopo de Virgem</a></h2>
                        <p>
                            Pessoas de Virgem, nascidas entre 23 de agosto e 22 de setembro, são conhecidas por sua
                            inteligência, senso de organização e capacidade analítica. Virgem é um signo de terra regido
                            por Mercúrio, o que contribui para uma personalidade prática, detalhista e com uma forte
                            inclinação para o perfeccionismo. Virginianos têm uma abordagem lógica e meticulosa para a
                            vida e são muito valorizados por sua responsabilidade e confiabilidade.<br> <a
                                href="horoscoposGerais.php?signo=virgo">Leia Mais...</a>
                        </p>
                    </div>
                </li>

                <li class="tabelaItemCard">
                    <div class="imgLista">
                        <a href="horoscoposGerais.php?signo=libra"><img src="imagens/icones zodiaco c/libra.png"
                                alt="Libra" title="Libra"></a>
                    </div>
                    <div class="corpoLista">
                        <h2><a href="horoscoposGerais.php?signo=libra">Horóscopo de Libra</a></h2>
                        <p>
                            Pessoas de Libra, nascidas entre 23 de setembro e 22 de outubro, são conhecidas por sua
                            diplomacia, senso de justiça e habilidade em criar harmonia ao seu redor. Libra é um signo
                            de ar regido por Vênus, o planeta do amor, da beleza e das relações, o que os torna gentis,
                            elegantes e sociáveis. São pessoas que valorizam relacionamentos equilibrados, beleza e a
                            busca pela paz. <br><a href="horoscoposGerais.php?signo=libra">Leia Mais...</a>
                        </p>
                    </div>
                </li>

                <li class="tabelaItemCard">
                    <div class="imgLista">
                        <a href="horoscoposGerais.php?signo=scorpio"><img src="imagens/icones zodiaco c/scorpio.png"
                                alt="Escorpiao" title="Escorpião"></a>
                    </div>
                    <div class="corpoLista">
                        <h2><a href="horoscoposGerais.php?signo=scorpio">Horóscopo de Escorpião</a></h2>
                        <p>
                            Pessoas de Escorpião, nascidas entre 23 de outubro e 21 de novembro, são conhecidas por sua
                            intensidade, paixão e mistério. Escorpião é um signo de água regido por Plutão (e
                            tradicionalmente também por Marte), o que lhes confere uma natureza profunda, investigativa
                            e transformadora. Escorpianos são intuitivos, emocionalmente profundos e determinados, e
                            gostam de ir até o fundo das questões, buscando sempre a verdade e a autenticidade. <br><a
                                href="horoscoposGerais.php?signo=scorpio"> Leia Mais...</a>
                        </p>
                    </div>
                </li>

                <li class="tabelaItemCard">
                    <div class="imgLista">
                        <a href="horoscoposGerais.php?signo=sagittarius"><img
                                src="imagens/icones zodiaco c/sagittarius.png" alt="Sagitário" title="Sagitário"></a>
                    </div>
                    <div class="corpoLista">
                        <h2><a href="horoscoposGerais.php?signo=sagittarius">Horóscopo de Sagitário</a></h2>
                        <p>
                            Pessoas de Sagitário, nascidas entre 22 de novembro e 21 de dezembro, são conhecidas por seu
                            espírito aventureiro, otimismo e busca incessante por conhecimento e liberdade. Sagitário é
                            um signo de fogo regido por Júpiter, o planeta da expansão e da sabedoria, o que confere aos
                            sagitarianos uma personalidade expansiva, curiosa e bem-humorada. São pessoas que gostam de
                            explorar, aprender e buscar novos horizontes, tanto físicos quanto intelectuais. <br><a
                                href="horoscoposGerais.php?signo=sagittarius">Leia Mais...</a>
                        </p>
                    </div>
                </li>

                <li class="tabelaItemCard">
                    <div class="imgLista">
                        <a href="horoscoposGerais.php?signo=capricorn"><img
                                src="imagens/icones zodiaco c/capricorn.png" alt="Capricórnio" title="Capricórnio"></a>
                    </div>
                    <div class="corpoLista">
                        <h2><a href="horoscoposGerais.php?signo=capricorn">Horóscopo de Capricórnio</a></h2>
                        <p>
                            Pessoas de Capricórnio, nascidas entre 22 de dezembro e 20 de janeiro, são conhecidas por
                            sua ambição, responsabilidade e determinação. Capricórnio é um signo de terra regido por
                            Saturno, o planeta da disciplina, da estrutura e das limitações. Isso confere aos
                            capricornianos uma personalidade prática, focada e muito voltada para objetivos de longo
                            prazo. Eles são pessoas que valorizam a estabilidade, a segurança e o trabalho árduo,
                            buscando sempre alcançar o sucesso por meio de esforço e perseverança. <br><a
                                href="horoscoposGerais.php?signo=capricorn">Leia Mais...</a>
                        </p>
                    </div>
                </li>

                <li class="tabelaItemCard">
                    <div class="imgLista">
                        <a href="horoscoposGerais.php?signo=aquarius"><img src="imagens/icones zodiaco c/aquarius.png"
                                alt="Aquário" title="Aquário"></a>
                    </div>
                    <div class="corpoLista">
                        <h2><a href="horoscoposGerais.php?signo=aquarius">Horóscopo de Aquário</a></h2>
                        <p>
                            Pessoas de Aquário, nascidas entre 21 de janeiro e 18 de fevereiro, são conhecidas por sua
                            originalidade, independência e visão futurista. Aquário é um signo de ar regido por Urano (o
                            planeta da inovação e da mudança), o que confere aos aquarianos uma natureza inovadora,
                            excêntrica e altamente intelectual. Eles são frequentemente considerados à frente de seu
                            tempo e possuem uma visão única do mundo. As pessoas deste signo costumam valorizar a
                            liberdade, a igualdade e a fraternidade. <br><a
                                href="horoscoposGerais.php?signo=aquarius">Leia Mais...</a>
                        </p>
                    </div>
                </li>

                <li class="tabelaItemCard">
                    <div class="imgLista">
                        <a href="horoscoposGerais.php?signo=pisces"><img src="imagens/icones zodiaco c/pisces.png"
                                alt="Peixes" title="Peixes"></a>
                    </div>
                    <div class="corpoLista">
                        <h2><a href="horoscoposGerais.php?signo=pisces">Horóscopo de Peixes</a></h2>
                        <p>
                            Pessoas de Peixes, nascidas entre 19 de fevereiro e 20 de março, são conhecidas por sua
                            sensibilidade, empatia e natureza sonhadora. Peixes é um signo de água regido por Netuno, o
                            planeta da inspiração, da imaginação e da espiritualidade. Isso confere aos piscianos uma
                            profundidade emocional, uma forte conexão com o mundo dos sentimentos e uma grande
                            capacidade de se conectar com os outros de forma intuitiva. Eles também tendem a ser muito
                            criativos, idealistas e muitas vezes procuram um significado mais profundo na vida. <br><a
                                href="horoscoposGerais.php?signo=pisces">Leia Mais...</a>
                        </p>
                    </div>
                </li>

            </ul>

        </div><!-- fim divInfo -->



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




    <button id="scrollToTopBtn" title="Voltar ao topo">&#11205;</button>
</body>

</html>