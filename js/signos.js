const exibirSigno = document.getElementById('exibirSigno');
const sign = document.querySelectorAll('.sign');
const zodiacWheel = document.querySelector('.zodiacWheel');

let signos = [...sign]

console.log(signos)

sign.forEach(signo =>{
    signo.addEventListener('mouseenter',()=>{
        const nomeSigno = signo.querySelector("img").alt;
        exibirSigno.textContent = nomeSigno;
    })

    signo.addEventListener('mouseleave',()=>{
        exibirSigno.textContent = '';
    })
});

// zodiacWheel.addEventListener('mouseover', ()=>{
//     signos.map((signo)=>{
//         signo.classList.remove("esconder")
//     })
// })