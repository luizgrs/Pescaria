window.addEventListener('load', init);
let peixeAtual;
let pescados = 0;

function init(){
    agua();
    vara();
    tempo();
}

function tempo(){
    const tempoMaximo = 30000;
    const tempoRestanteDom = $id('tempo_restante');
    let contagemTimer;
    let tempoFim;

    init();

    function init(){
        setTimeout(comeca, 3000);
    }

    function comeca(){
        contagemTimer = setInterval(atualizaContagem, 1000);
        tempoFim = new Date().getTime() + tempoMaximo;
        setTimeout(acabou, tempoMaximo);
        atualizaContagem();
        peixes();
    }

    function atualizaContagem(){
        tempoRestanteDom.innerText = Math.ceil((tempoFim - new Date().getTime()) / 1000);
    }

    function acabou(){
        clearInterval(contagemTimer);
        $id('fim').style.display = 'flex';
        $id('pontos_fim').innerText = pescados;
    }
}

function $id(id) {
    return document.getElementById(id);
}

function setCssRandomProp(element, cssProp, min, max, unit){
    const atual = element.style.getPropertyValue(cssProp)
    let novo, x=0;

    do {
        novo = Math.ceil(Math.random() * (max-min) + min);
    }while(novo==atual && ++x  < 10);

    element.style.setProperty(cssProp, novo + unit);
}


function agua(){
    const aguaDiv = $id('agua');

    agua_init();

    function agua_init(){
        aguaDiv.addEventListener('animationiteration', calculaMovimentoAgua);
    }

    function calculaMovimentoAgua(){
        setCssRandomProp(aguaDiv, '--agua-tempo-sobe-desce', 5, 10, 's');
        setCssRandomProp(document.documentElement, '--agua-quanto-sobe-desce', 10, 25, 'px');
    }
}

function peixes(){
    const peixes = $id('peixes');
    init();

    function init(){
        aparecePeixe();
    }


    function aparecePeixe(){
        peixeAtual = new peixe();
        peixeAtual.appendTo(peixes);

        peixeAtual.acabou = peixeSumiu;
    }

    function peixeSumiu(){
        peixeAtual = null;
        setTimeout(aparecePeixe, Math.random() * 800 + 200);
    }


}

function vara(){

    const varaDom = $id('vara');
    const contadorDom = $id('pontos');
    init();

    function init(){
        document.addEventListener('mousemove', moveVara);
        document.addEventListener('click', puxaVara);
        varaDom.addEventListener('animationend', acabouPuxada);
    }

    function acabouPuxada(){
        varaDom.classList.remove('puxada');
    }

    function puxaVara(e){
        varaDom.classList.add('puxada');

        if(peixeAtual){
            if(peixeAtual.tentaPescar(e.pageX)){
                pescados++;
                contadorDom.innerText = pescados;
            }
        }
    }

    function moveVara(e){   
        varaDom.style.left = e.pageX + 'px';
    }
}

function peixe(){

    const _peixe = this;
    const agua = $id('agua');
    const _dom = createDom();
    const classPescado = 'pescado';
    init();

    function init(){
        _peixe.capturavel = true;
        
        _dom.querySelector('.boca').addEventListener('animationend', fechouBoca);
        _dom.addEventListener('animationend', peixeDesceu);
    }

    _peixe.appendTo = (parent) => parent.append(_dom);

    _peixe.destroy = () => _dom.remove();

    _peixe.tentaPescar = function(x){
        const peixeRect = _dom.getBoundingClientRect()
        const pescado = _peixe.capturavel && x >= peixeRect.left && x <= peixeRect.left + peixeRect.width;

        if(pescado){
            _peixe.capturavel = false;
            const aguarRect = agua.getBoundingClientRect();
            _dom.style.top = (peixeRect.top - aguarRect.top) + 'px';
            _dom.classList.add(classPescado);
            _peixe.acabou();
        }

        return pescado;
    };


    
    function peixeDesceu(e){
        if(e.target === _dom){
            _dom.remove();

            if(!_dom.classList.contains(classPescado))
                _peixe.acabou();
        }
    }

    function fechouBoca(){
        _peixe.capturavel = false;
    }

    function createDom(){
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("viewBox", "0 -2 79.794 114.611");
        svg.classList.add('peixe');
        svg.innerHTML = `
            <path class="corpo" d="M14.027 11.074a28.047 28.047 0 00-2.478 22.394c-4.317 4.17-7.29 9.023-9.99 14.21-6.623 12.71 9.612 8.228 15.947 6.597 3.454 6.417 7.256 12.653 11.246 18.802 4.731 5.665 4.356 11.614-.244 17.802l-5.686 6.488c-3.01 3.435-14.925 14.914-5.522 17.167 6.57.619 14.497-2.61 22.55-6.218 3.852 1.508 7.988 2.743 12.245 3.85 12.163 3.153 14.562-1.444 6.614-10.097L47.771 90.154c-4.022-4.054-4.61-7.996-2.887-11.678 5.267-11.243 14.19-17.916 18.008-34.891 4.125 1.516 8.407 2.58 12.8 3.292 3.511.018 5.011-1.98 3.54-6.952-3.199-5.693-7.546-10.736-12.873-15.243a28.047 28.047 0 00-2.947-12.107l-25.1 12.518L25.8 0a28.047 28.047 0 00-11.772 11.074zm48.312-.449a28.047 28.047 0 01.223.377 28.047 28.047 0 00-.223-.377z"/>
            <path class="boca" d="M38.315 25.1L50.83 50.257a28.1 27.994 74.946 0012.536-37.662z"/>
        `;

        svg.style.left = Math.random() * 90 + 'vw';
        svg.style.fill = `rgb(${Math.random()*255},${Math.random()*255},${Math.random()*255})`;
        return svg;
    }


    
    

}