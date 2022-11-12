//Recupera a div que vai exibir o alerta
var divAlert = document.getElementById('divAlert');

//Cria o alerta dentro da div que exibe o alerta
function alert(message, type) {
    var wrapper = document.createElement('div')
    wrapper.innerHTML = '<div id="divAlertContent" class="alert alert-' + type + ' alert-dismissible" role="alert" id="alert">' + message + '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>';
    divAlert.append(wrapper);
}

function removeAlert() {
    $("#divAlert").hide();
    $("#divAlert").fadeTo(2000, 500).slideUp(500, function () {
        $('#divAlertContent').remove();
        window.location.reload(true);
    });
}

function montarContato() {
    var nome = document.getElementById('nome').value;
    var conteudo = document.getElementById('conteudo').value;
    var elogio = document.getElementById('elogio').checked;
    var reclamacao = document.getElementById('reclamacao').checked;

    var contato = new Object();
    contato.nome = nome;
    contato.conteudo = conteudo;
    contato.elogio = elogio;
    contato.reclamacao = reclamacao;

    return contato;
}

//Função chamada pela tag <form>
async function cadastrarContato(event) {
    //Garante que a tela não seja atualizada ao enviar uma requisição.
    event.preventDefault();

    let urlSave = 'http://localhost:8080/quadrodehorarios/contato/save';
    //let urlUpdate = 'http://localhost:8080/quadrodehorarios/professor/update';

    //Recupera os valores da tela.
    var contato = montarContato();

    var xhr = new XMLHttpRequest();
    xhr.open("POST", urlSave, true);
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhr.onload = () => {
        var data = JSON.parse(xhr.responseText);
        if (data.CONFLICT) {
            alert(data.CONFLICT, 'danger');
        }
        if (data.CREATED) {
            alert(data.CREATED, 'success');
        }
    }
    xhr.send(JSON.stringify(contato));

    removeAlert();
}