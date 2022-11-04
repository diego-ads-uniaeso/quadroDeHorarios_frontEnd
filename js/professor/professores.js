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
    console.log(professor)

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
    buttonDelete.setAttribute('class', 'btn btn-danger bg-danger');
    buttonDelete.setAttribute('style', 'margin-left: 5px');
    buttonDelete.setAttribute('id', `${professor.idProfessor}`);
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

var idEdit;
var nomeEdit;
var idDisponibilidadeEdit;

function clearFields() {
    idEdit = undefined;
    nomeEdit = undefined;
    idDisponibilidadeEdit = undefined;
    
    document.querySelector("input#nome").value = '';
    document.getElementById('idDisponibilidade').value = '';
}

function clearFields() {

    document.getElementById('nome').value = '';

    var idsDisponibilidade = document.getElementById('tBodyDisponibilidade').children;

    for (var x = 0; x < 7; x++) {
        for (var y = 1; y < 7; y++) {
            for (var z = 0; z < 7; z++) {
                if (typeof idsDisponibilidade[x].children[y].children[z] == 'object') {
                    if (idsDisponibilidade[x].children[y].children[z].checked) {
                        document.getElementById('tBodyDisponibilidade').children[x].children[y].children[z].checked = false;
                    }
                }
            }
        }
    }

    var idsDisciplinas = document.getElementById('tBodyDisciplinas').children;

    for (var x = 0; x < idsDisciplinas.length; x++) {
        if (typeof idsDisciplinas[x].children == 'object') {
            if (idsDisciplinas[x].children[0].children[0].checked) {
                document.getElementById('tBodyDisciplinas').children[x].children[0].children[0].checked = false;
            }
        }
    }

}

findAllDisciplinas();

function getDisciplinasSelecionadas() {
    var ids = document.getElementsByClassName('idDisciplina');
    var idsSelecionados = [];

    for (var x = 0; x <= ids.length; x++) {
        if (typeof ids[x] == 'object') {
            if (ids[x].checked) {
                idsSelecionados.push(ids[x].id)
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

function getDisponibilidadesSelecionadas() {
    var ids = document.getElementById('tBodyDisponibilidade').children;
    var idsSelecionados = [];
    
    for (var x = 0; x < 7; x++) {
        idsSelecionados[x] = [];
    }

    for (var x = 0; x < 7; x++) {
        for (var y = 1; y < 7; y++) {
            for (var z = 0; z < 7; z++) {
                if (typeof ids[x].children[y].children[z] == 'object') {
                    if (ids[x].children[y].children[z].checked) {
                        idsSelecionados[x][y - 1] = 1;
                    } else {
                        idsSelecionados[x][y - 1] = 0;
                    }
                }
            }
        }
    }

    var vazio = true;

    for (var x = 0; x < 7; x++) {
        for (var y = 0; y < 7; y++) {
            if (idsSelecionados[x][y] === 1) {
                vazio = false;
                break;
            }
        }
    }
    if (vazio === true) {
        alert('Selecione pelo menos 1 disponibilidade!', 'danger');
    }
    return idsSelecionados;
}

// function editProfessor(idProfessor) {

//     const url = 'http://localhost:8080/quadrodehorarios/professor/find/all';

//     var xhr = new XMLHttpRequest()

//     xhr.open('GET', url + idProfessor, true)
//     xhr.onload = () => {
//         var data = JSON.parse(xhr.responseText);
//         if (data.NOT_FOUND) {
//             alert(data.NOT_FOUND, 'warning');
//         } else {
//             document.getElementById('btnCadastrar').innerText = 'Editar';
//             idEdit = idProfessor;
//             idProfessorEdit = document.querySelector("div#idProfessor");
//             nomeEdit = document.getElementById("nome");
//             nomeEdit.value = `${data.nome}`;
//             idProfessorEdit.value = `${data.idProfessor}`;
//         }
//     }
//     xhr.send(null);
// }

function cadastrarProfessor(event) {

    //Não deletar a tela quando enviar os dados
    event.preventDefault();

    const urlSave = 'http://localhost:8080/quadrodehorarios/professor/save'
    const urlUpdate = 'http://localhost:8080/quadrodehorarios/professor/update';

    var nome = document.querySelector("input#nome").value;

    if (nome === '' || getDisponibilidadesSelecionadas() === null || getDisciplinasSelecionadas() === null) {
        alert('Por favor, preencha os campos!', 'danger');
    } else {
        if (idEdit === undefined) {

            //Cria o JSON que será enviado para a API
            const bodySaveProfessor = {
                "nome": nome,
                "disciplinas": getDisciplinasSelecionadas(),
                "disponibilidade": getDisponibilidadesSelecionadas()
            }
            
            //Enviar um Request pro banco pra salvar o professor            var xhr = new XMLHttpRequest();
            var xhr = new XMLHttpRequest();
            xhr.open("POST", urlSave, true);
            xhr.setRequestHeader('content-type', 'application/json; charset=utf-8');
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
            xhr.send(JSON.stringify(bodySaveProfessor));
        } else {

            //Cria o JSON que será enviado para a API
            const bodyUpdateProfessor = {
                "id_professor": idEdit,
                "nome": nomeEdit.value,
                "disponibilidades": idDisponibilidadeEdit.value
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
            xhr.send(JSON.stringify(bodyUpdateProfessor));
        }
    }
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