//Recupera a div que vai exibir o alerta
var divAlert = document.getElementById('divAlert');

//Cria o alerta dentro da div que exibe o alerta
function alert(message, type) {
    var wrapper = document.createElement('div')
    wrapper.innerHTML = '<div id="divAlertContent" class="alert alert-' +
        type + ' alert-dismissible" role="alert" id="alert">' +
        message + '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>';
    divAlert.append(wrapper);
}

function removeAlert() {
    $("#divAlert").hide();
    $("#divAlert").fadeTo(2000, 500).slideUp(500, function () {
        $('#divAlertContent').remove();
        window.location.reload(true);
    });
}

function createRowDisciplina(disciplina) {

    //Cria os componentes da tabela
    let tr = document.createElement("tr");
    let tdCheck = document.createElement("td");
    let tdNome = document.createElement("td");
    let tdCodigo = document.createElement("td");
    let inputCheck = document.createElement("input");

    //Adiciona os atributos de cada componente
    tdCheck.setAttribute('class', 'col-2');
    inputCheck.setAttribute('type', 'checkbox');
    inputCheck.setAttribute('class', 'idDisciplina form-check-input');
    inputCheck.setAttribute('id', `${disciplina.idDisciplina}`);
    tdCodigo.setAttribute('class', 'col-4');
    tdNome.setAttribute('class', 'col-6');

    //Seta os valores nos componentes
    tdNome.innerHTML = `${disciplina.nome}`;
    tdCodigo.innerHTML = `${disciplina.codDisciplina}`;

    //Associa os componentes filhos dentro dos componentes pai
    tdCheck.appendChild(inputCheck);
    tr.appendChild(tdCheck);
    tr.appendChild(tdCodigo);
    tr.appendChild(tdNome);

    //Retorna a linha da tabela com todos os componentes criados
    return tr;
}

function createRowProfessor(professor) {

    //Cria os componentes da tabela
    let tr = document.createElement("tr");
    let tdNome = document.createElement("td");
    let tdAcoes = document.createElement("td");
    let buttonEdit = document.createElement("button");
    let buttonDelete = document.createElement("button");
    let spanEdit = document.createElement("span");
    let spanDelete = document.createElement("span");

    //Adiciona os atributos de cada componente
    buttonEdit.setAttribute('type', 'button');
    buttonEdit.setAttribute('class', 'btn btn-warning bg-warning');
    buttonEdit.setAttribute('id', `${professor.idProfessor}`);
    buttonEdit.setAttribute('onClick', 'editProfessor(this.id)');
    buttonDelete.setAttribute('class', 'btn btn-danger bg-danger');
    buttonDelete.setAttribute('style', 'margin-left: 5px');
    buttonDelete.setAttribute('id', `${professor.idProfessor}`);
    buttonDelete.setAttribute('onClick', 'deleteProfessor(this.id)');
    spanEdit.setAttribute('class', 'material-icons');
    spanDelete.setAttribute('class', 'material-icons');
    tdNome.setAttribute('class', 'col-6');
    tdAcoes.setAttribute('class', 'col-3');

    //Seta os valores nos componentes
    tdNome.innerHTML = `${professor.nome}`;
    spanEdit.innerHTML = 'brush';
    spanDelete.innerHTML = 'delete';

    //Associa os componentes filhos dentro dos componentes pai
    buttonEdit.appendChild(spanEdit);
    buttonDelete.appendChild(spanDelete);
    tdAcoes.appendChild(buttonEdit);
    tdAcoes.appendChild(buttonDelete);
    tr.appendChild(tdNome);
    tr.appendChild(tdAcoes);

    //Retorna a linha da tabela com todos os componentes criados
    return tr;
}

function getDisciplinasSelecionadas() {
    var ids = document.getElementsByClassName('idDisciplina');
    var idsSelecionados = [];

    for (var x = 0; x <= ids.length; x++) {
        if (typeof ids[x] == 'object') {
            if (ids[x].checked) {
                var selecionado = new Object();
                selecionado.idDisciplina = ids[x].id;
                idsSelecionados.push(JSON.parse(JSON.stringify(selecionado)));
            }
        }
    }

    if (idsSelecionados.length <= 0) {
        alert('Selecione pelo menos 1 disciplina!', 'danger');
    }

    return idsSelecionados;
}

function findAllDisciplinas() {
    const url = "http://localhost:8080/quadrodehorarios/disciplina/find/all";
    var tBody = document.getElementById('tBodyDisciplinas');
    var tr;

    var xhr = new XMLHttpRequest()
    xhr.open('GET', url, true)
    xhr.onload = () => {
        var data = JSON.parse(xhr.responseText);
        data.forEach(disciplina => {
            tr = createRowDisciplina(disciplina);
            tBody.appendChild(tr);
        });
    }
    xhr.send(null);
}

findAllDisciplinas();

function getDisponibilidadesSelecionadas() {
    var disponibilidade = document.getElementById('tBodyDisponibilidade').children;

    var selecionadas = [];

    for (var x = 0; x < 7; x++) {
        selecionadas[x] = [];
    }

    for (var x = 0; x < 7; x++) {
        for (var y = 1; y < 7; y++) {
            for (var z = 0; z < 7; z++) {
                if (typeof disponibilidade[x].children[y].children[z] == 'object') {
                    if (disponibilidade[x].children[y].children[z].checked) {
                        selecionadas[x][y - 1] = 1;
                    } else {
                        selecionadas[x][y - 1] = 0;
                    }
                }
            }
        }
    }

    var vazio = true;

    for (var x = 0; x < 7; x++) {
        for (var y = 0; y < 7; y++) {
            if (selecionadas[x][y] === 1) {
                vazio = false;
                break;
            }
        }
    }

    if (vazio === true) {
        alert('Selecione pelo menos 1 disponibilidade!', 'danger');
    }

    return selecionadas;
}

function montarProfessor() {
    var nome = document.getElementById('nome').value;

    if (nome === '') {
        alert('Por favor, informe o nome do professor!', 'danger');
        removeAlert();
        return;
    }

    var professor = new Object();
    professor.nome = nome;
    professor.disciplinas = getDisciplinasSelecionadas();
    professor.disponibilidade = getDisponibilidadesSelecionadas();

    return professor;
}

//Função chamada pela tag <form>
async function cadastrarProfessor(event) {
    //Garante que a tela não seja atualizada ao enviar uma requisição.
    event.preventDefault();

    let urlSave = 'http://localhost:8080/quadrodehorarios/professor/save';

    //Recupera os valores da tela.
    var professor = montarProfessor();

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
    xhr.send(JSON.stringify(professor));

    removeAlert();
}

var idEdit;
var nomeEdit;
var disponibilidadeEdit;
var disciplinaEdit;

function clearFields() {
    idEdit = undefined;
    nomeEdit = undefined;
    disponibilidadeEdit = undefined;

    document.getElementById('nome').value = '';
    disponibilidadeEdit = document.getElementById('tBodyDisponibilidade').children;

    var selecionadas = [];

    for (var x = 0; x < 7; x++) {
        selecionadas[x] = [];
    }

    for (var x = 0; x < 7; x++) {
        for (var y = 1; y < 7; y++) {
            for (var z = 0; z < 7; z++) {
                if (typeof disponibilidadeEdit[x].children[y].children[z] == 'object') {
                    if (disponibilidadeEdit[x].children[y].children[z].checked = false) {
                        selecionadas[x][y - 1] = 1;
                    } else {
                        selecionadas[x][y - 1] = 0;
                    }
                }
            }
        }
    }
}

function editProfessor(idProfessor) {
    const url = "http://localhost:8080/quadrodehorarios/professor/find/byId/{idProfessor}"

    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, idProfessor, true);
    xhr.onload = () => {
        var data = JSON.parse(xhr.responseText);
        if (data.NOT_FOUND) {
            alert(data.NOT_FOUND, 'warning');
        } else {
            document.getElementById("btnCadastrar").innerText = "Alterar";
            idEdit = idProfessor;
            nomeEdit = document.getElementById("nome");
            nomeEdit.value = `${data.nome}`;
            disponibilidadeEdit = `${data.disponibilidade}`
        }
    }
    xhr.send(null);
}

function deleteProfessor(idProfessor) {
    const url = 'http://localhost:8080/quadrodehorarios/professor/delete/';

    var xhr = new XMLHttpRequest();
    xhr.open("DELETE", url + idProfessor, true);
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

function findAllProfessores() {
    const url = "http://localhost:8080/quadrodehorarios/professor/find/all";
    var tBody = document.getElementById('tBodyProfessores');
    var tr;

    var xhr = new XMLHttpRequest()
    xhr.open('GET', url, true)
    xhr.onload = () => {
        var data = JSON.parse(xhr.responseText);
        data.forEach(professor => {
            tr = createRowProfessor(professor);
            tBody.appendChild(tr);
        });
    }
    xhr.send(null);
}

findAllProfessores();