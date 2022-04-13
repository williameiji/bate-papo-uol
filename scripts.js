let chatPrivado;
let chatPublico;
let nomeLogIn;
let idInterval;


let input = document.querySelector(".telaInicial input");
input.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        let testInput = input.value;
        nomeLogIn = {name: testInput}
        if (testInput != ""){
            entrarSala();
            //event.preventDefault();    
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
        //manterAtivo();
    }
}

function pingAtivo (){
    axios.post("https://mock-api.driven.com.br/api/v6/uol/status", nomeLogIn);
}

function manterAtivo (){
    idInterval = setInterval(pingAtivo, 4000);
}

function nomeErro (nome) {
    if(nome.response.status === 400){
        alert("Nome já está sendo usado!");
    }
}

function buscarParticipantes () {
    let promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/participants");
    console.log(promise.then(abaParticipantes))
}


function teste (){
    let popUp = document.querySelector(".participantesAtivos");
    popUp.classList.remove("escondido");
}


function abaParticipantes (participantes) {
    
    let arr = participantes.data;
    console.log(arr)
    console.log(arr[0].name)
    let partic = document.querySelector(".listaContatos");
    console.log(partic)
    for(let i = 0; i < arr.length; i++){
        console.log("entrou")
        partic.innerHTML += `
            <div class="contato">
                <div class="contatoIon">
                    <ion-icon name="person-circle-sharp"></ion-icon>
                    <p>${arr[i].name}</p>
                </div>
                <ion-icon class="check" name="checkmark-sharp"></ion-icon>
            </div>
        `
    }
}