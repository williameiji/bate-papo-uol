let paraQuemChat = "Todos";
let tipoChat = "message";
let tipoChat2 = "Público";
let nomeLogIn;
let msgParaEnviar;
let idInterval;
let idInterval2;
let idInterval3;
let arrMensagens;
let inserirMensagem;
let partic;

//LOGIN
let input = document.querySelector(".telaInicial input");
input.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        let testInput = input.value;
        nomeLogIn = {name: testInput}
        if (testInput != ""){
            entrarSala();  
        }
    }
});

function logIn () {
    let testInput = input.value;
    nomeLogIn = {name: testInput};
    if (testInput != ""){
        entrarSala();
    }
}

function entrarSala (){
    let promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", nomeLogIn);
    promise.then(nomeOk);
    promise.catch(nomeErro);
}

function nomeOk (nome){
    console.log(nome)
    if(nome.status === 200){
        document.querySelector(".telaInicial").classList.add("escondido");
        buscarParticipantes();
        buscarMensagens();
        manterAtivo();
    }
}

function pingAtivo (){
    axios.post("https://mock-api.driven.com.br/api/v6/uol/status", nomeLogIn);
}

function manterAtivo (){
    idInterval = setInterval(pingAtivo, 4000);
    idInterval2 = setInterval(buscarMensagens, 5000);
}

function nomeErro (nome) {
    if(nome.response.status === 400){
        alert("Nome já está sendo usado!");
    }
}
//LOGIN

//BUSCAR MENSAGENS
function buscarMensagens (){
    let promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    promise.then(tratarMensagens);
}

function tratarMensagens(mensagens){
    
    arrMensagens = mensagens.data;
    console.log(arrMensagens)
    
    inserirMensagem = document.querySelector(".chatPrincipal");
    inserirMensagem.innerHTML = "";
    for(let i = 0; i < arrMensagens.length; i++){
        
        let horario = arrMensagens[i].time;
        let nomePartic = arrMensagens[i].from;
        let texto = arrMensagens[i].text;
        let paraQuem = arrMensagens[i].to;
        
        if (arrMensagens[i].type === "status"){
            inserirMensagem.innerHTML += `
            <li class="entraSai">
                <p style="color:#AAAAAA">(${horario}) </p> 
                 <p class="b">${nomePartic} </p> 
                 <p> ${texto}</p>
            </li>
            `
        }

        if (arrMensagens[i].type === "message"){
            inserirMensagem.innerHTML += `
            <li>
                <p style="color:#AAAAAA">(${horario})</p> 
                <p class="b">${nomePartic}</p> 
                <p>para</p>
                <p class="b">${paraQuem}</p>
                <p>${texto}</p>
            </li>
            `
        }

        if (arrMensagens[i].type === "private_message"){
            if (nomeLogIn.name === nomePartic || nomeLogIn.name === paraQuem){
                inserirMensagem.innerHTML += `
                <li class="privado">
                    <p style="color:#AAAAAA">(${horario})</p> 
                    <p class="b">${nomePartic}</p> 
                    <p>para</p>
                    <p class="b">${paraQuem}</p>
                    <p>${texto}</p>
                </li>
                `
            }
        }
    }
}
//BUSCAR MENSAGENS

buscarParticipantes()
//BUSCAR PARTICIPANTES
function buscarParticipantes () {
    let promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/participants");
    console.log(promise.then(addParticipantes))
}


function abaParticipantes (){
    let popUp = document.querySelector(".participantesAtivos");
    popUp.classList.remove("escondido");
    let alteraP = document.querySelector(".enviandoPara");
    alteraP.classList.add("escondido");
    buscarParticipantes();
}

function sumirAbaParticipantes(){
    let popUp = document.querySelector(".participantesAtivos");
    popUp.classList.add("escondido");
}


function addParticipantes (participantes) {
    let arr = participantes.data;
    partic = document.querySelector(".listaContatos");
    partic.innerHTML = `
        <div class="contato checkContato" onclick="todosParticular(this)">
            <div class="contatoIon">
                <ion-icon name="people"></ion-icon>
                <p class="paraQuem">Todos</p>
            </div>
            <ion-icon name="checkmark-sharp"></ion-icon>
        </div>
    `;
    for(let i = 0; i < arr.length; i++){
        partic.innerHTML += `
            <div class="contato" onclick="todosParticular(this)">
                <div class="contatoIon">
                    <ion-icon name="person-circle-sharp"></ion-icon>
                    <p class="paraQuem">${arr[i].name}</p>
                </div>
                <ion-icon name="checkmark-sharp"></ion-icon>
            </div>
        `;
    }
}
// BUSCAR PARTICIPANTES


// SELECIONAR PARTICIPANTES


function todosParticular (clicado) {
    let opcaoClicada = document.querySelector(".listaContatos .contato.checkContato");
    if(opcaoClicada !== null){
        opcaoClicada.classList.remove("checkContato")
    }
    clicado.classList.add("checkContato");
    paraQuemChat = clicado.querySelector(".paraQuem").innerHTML;

    let alteraP = document.querySelector(".enviandoPara");
    if(paraQuemChat !== "Todos"){
        alteraP.classList.remove("escondido");
        alterarInput();
    }else {
        alteraP.classList.add("escondido");
    }
    console.log(paraQuemChat)
}


function todosPrivado (clicado) {
    let opcaoClicada = document.querySelector(".visibilidade .fixo.check");
    
    if(opcaoClicada !== null){
        opcaoClicada.classList.remove("check")
    }
    clicado.classList.add("check");
    tipoChat = clicado.querySelector(".tipoChat").innerHTML;

    if (tipoChat === "Público"){
        tipoChat = "message";
        tipoChat2 = "Público";
        alterarInput();
    }
    if (tipoChat === "Reservadamente"){
        tipoChat = "private_message"
        tipoChat2 = "Reservadamente";
        alterarInput();
    }
    console.log(tipoChat2)
}


function alterarInput(){
    let alteraP = document.querySelector(".enviandoPara");
    alteraP.innerHTML = `Enviando para ${paraQuemChat} (${tipoChat2})`
    
}

// SELECIONAR PARTICIPANTES

//ENVIAR MENSAGEM

let inputMsg = document.querySelector(".inputMensagem input");
inputMsg.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        msgParaEnviar= inputMsg.value;
        if (msgParaEnviar != ""){
            enviarMensagem ();
            inputMsg.value = ""; 
        }
    }
});

function botaoEnviar () {
    msgParaEnviar= inputMsg.value;
    if (msgParaEnviar != ""){
        enviarMensagem();
        inputMsg.value = ""; 
    }
}

function enviarMensagem (){
    console.log(nomeLogIn.name)
    console.log(msgParaEnviar)
    let mensagem = {
        from: nomeLogIn.name,
        to: paraQuemChat,
        text: msgParaEnviar,
        type: tipoChat
    }

    console.log(mensagem)

    let promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", mensagem);

    console.log(promise)

}



//ENVIAR MENSAGEM