//Recupera a div que vai exibir o alerta
var divAlert = document.getElementById('divAlert');

//Cria o alerta dentro da div que exibe o alerta
function alert(message, type) {
    var wrapper = document.createElement('div')
    wrapper.innerHTML = '<div id="divAlertContent" class="alert alert-' + type + ' alert-dismissible" role="alert" id="alert">' + message + '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>';
    divAlert.append(wrapper);
}

$(document).ready(function () {
    $("#divAlert").hide();
    $("#btnEnviar").click(function showAlert() {
        $("#divAlert").fadeTo(2000, 500).slideUp(500, function () {
            $('#divAlertContent').remove();
        });
    });
});

function cadastrarProfessor(event) {
    //Garante que a tela não seja atualizada ao enviar uma requisição.
    event.preventDefault();

    let url = 'http://localhost:8080/quadrodehorarios/professor/save';

    //Recupera os valores que são inseridos nos inputs.
    let idProfessor = document.getElementById('idProfessor').value;
    let nome = document.getElementById('nome').value;

    //Cria o JSON que será enviado para a API
    const body = {
        "idProfessor": idProfessor,
        "nome": nome
    }

    //Monta as configurações de POST para chamar o método POST na API
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    };

    //Faz a chamada a API para salvar os registros
    fetch(url, options)
        .then(response => {
            response.json().then(dados => {
                //Valida se o response gerou um erro na requisição e chama a função alert() passando o valor e o tipo de alerta de acordo com a resposta.
                if (dados.CONFLICT) {
                    alert(dados.CONFLICT, 'danger');
                } else if (dados.CREATED) {
                    alert(dados.CREATED, 'success');
                }
            })
        })
        .catch(e => console.log(e));
}
