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

function createRowDisciplinas(disciplina) {
    //Cria os componentes da tabela
    let tr = document.createElement("tr");
    let tdNome = document.createElement("td");
    let tdCodigo = document.createElement("td");
    let tdAcoes = document.createElement("td");
    let buttonEdit = document.createElement("button");
    let buttonDelete = document.createElement("button");
    let spanEdit = document.createElement("span");
    let spanDelete = document.createElement("span");

    //Adiciona os atributos de cada componente
    buttonEdit.setAttribute('type', 'button');
    buttonEdit.setAttribute('class', 'btn btn-warning bg-warning');
    buttonEdit.setAttribute('id', `${disciplina.idDisciplina}`);
    buttonEdit.setAttribute('onClick', 'editDisciplina(this.id)');
    buttonDelete.setAttribute('class', 'btn btn-danger bg-danger');
    buttonDelete.setAttribute('style', 'margin-left: 5px');
    buttonDelete.setAttribute('id', `${disciplina.idDisciplina}`);
    buttonDelete.setAttribute('onClick', 'deletDisciplina(this.id)');
    spanEdit.setAttribute('class', 'material-icons');
    spanDelete.setAttribute('class', 'material-icons');
    tdCodigo.setAttribute('class', 'col-3');
    tdNome.setAttribute('class', 'col-6');
    tdAcoes.setAttribute('class', 'col-3');

    //Seta os valores nos componentes
    tdNome.innerHTML = `${disciplina.nome}`;
    tdCodigo.innerHTML = `${disciplina.codDisciplina}`;
    spanEdit.innerHTML = 'brush';
    spanDelete.innerHTML = 'delete';

    //Associa os componentes filhos dentro dos componentes pai
    buttonEdit.appendChild(spanEdit);
    buttonDelete.appendChild(spanDelete);
    tdAcoes.appendChild(buttonEdit);
    tdAcoes.appendChild(buttonDelete);
    tr.appendChild(tdCodigo);
    tr.appendChild(tdNome);
    tr.appendChild(tdAcoes);

    //Retorna a linha da tabela com todos os componentes criados
    return tr;
}

var idEdit;

function clearFields() {
    idEdit = undefined;
    document.getElementById('nome').value = '';
    document.getElementById('codDisciplina').value = '';
    document.getElementById('btnCadastrar').innerText = 'Cadastrar';
}

//Função chamada pela tag <form>
async function cadastrarDisciplina(event) {
    //Garante que a tela não seja atualizada ao enviar uma requisição.
    event.preventDefault();

    let urlSave = 'http://localhost:8080/quadrodehorarios/disciplina/save';
    let urlUpdate = 'http://localhost:8080/quadrodehorarios/disciplina/update';

    //Recupera os valores que são inseridos nos inputs.
    let codDisciplina = document.getElementById('codDisciplina').value;
    let nome = document.getElementById('nome').value;

    if (codDisciplina === '' || nome === '') {
        alert('Por favor, preencha os campos!', 'danger');
    } else {
        if (idEdit === undefined) {
            //Cria o JSON que será enviado para a API
            const bodySave = {
                "codDisciplina": codDisciplina,
                "nome": nome
            }

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
            xhr.send(JSON.stringify(bodySave));
        } else {
            //Cria o JSON que será enviado para a API
            const bodyUpdate = {
                "idDisciplina": idEdit,
                "codDisciplina": codDisciplinaEdit.value,
                "nome": nomeEdit.value
            }

            var xhr = new XMLHttpRequest();
            xhr.open("PUT", urlUpdate, true);
            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            xhr.onload = () => {
                var data = JSON.parse(xhr.responseText);
                if (data.NOT_FOUND) {
                    alert(data.NOT_FOUND, 'warning');
                }
                if (data.CONFLICT) {
                    alert(data.CONFLICT, 'danger');
                }
                if (data.ACCEPTED) {
                    alert(data.ACCEPTED, 'success');
                }
            }
            xhr.send(JSON.stringify(bodyUpdate));
        }
    }

    removeAlert();
}

function editDisciplina(idDisciplina) {
    const url = 'http://localhost:8080/quadrodehorarios/disciplina/find/';

    var xhr = new XMLHttpRequest()
    xhr.open('GET', url + idDisciplina, true)
    xhr.onload = () => {
        var data = JSON.parse(xhr.responseText);
        if (data.NOT_FOUND) {
            alert(data.NOT_FOUND, 'warning');
        } else {
            document.getElementById('btnCadastrar').innerText = 'Alterar';
            idEdit = idDisciplina;
            document.getElementById('nome').value = data.nome;
            document.getElementById('codDisciplina').value = data.codDisciplina;
        }
    }
    xhr.send(null);
}

function deletDisciplina(idDisciplina) {
    const url = 'http://localhost:8080/quadrodehorarios/disciplina/delete/';

    var xhr = new XMLHttpRequest();
    xhr.open("DELETE", url + idDisciplina, true);
    xhr.onload = () => {
        var data = JSON.parse(xhr.responseText);
        if (data.NOT_FOUND) {
            alert(data.NOT_FOUND, 'warning');
        }
        if (data.CONFLICT) {
            alert(data.CONFLICT, 'danger');
        }
        if (data.ACCEPTED) {
            alert(data.ACCEPTED, 'success');
        }
    }
    xhr.send(null);

    removeAlert();
}

function findAll() {
    const url = "http://localhost:8080/quadrodehorarios/disciplina/find/all";
    var tBody = document.getElementById('tBodyDisciplinas');
    var tr;

    var xhr = new XMLHttpRequest()
    xhr.open('GET', url, true)
    xhr.onload = () => {
        var data = JSON.parse(xhr.responseText);
        data.forEach(disciplina => {
            tr = createRowDisciplinas(disciplina);
            tBody.appendChild(tr);
        });
    }
    xhr.send(null);
}

findAll();