//Recupera a div que vai exibir o alerta
var divAlert = document.getElementById('divAlert');

//Cria o alerta dentro da div que exibe o alerta
function alert(message, type) {
    var wrapper = document.createElement('div')
    wrapper.innerHTML = '<div id="divAlertContent" class="alert alert-' + type + ' alert-dismissible" role="alert" id="alert">' + message + '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>';
    divAlert.append(wrapper);
}

//Função chamada pela tag <form>
function cadastrarDisciplina(event) {
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

            axios.post(urlSave, bodySave)
                .then(response => {
                    if (response.data.CONFLICT) {
                        alert(response.data.CONFLICT, 'danger');
                    }
                    if (response.data.CREATED) {
                        alert(response.data.CREATED, 'success');
                    }
                })
                .catch(error => {
                    alert(`Error: ${error.message}`, 'danger');
                });
        } else {
            //Cria o JSON que será enviado para a API
            const bodyUpdate = {
                "idDisciplina": idEdit,
                "codDisciplina": codDisciplinaEdit.value,
                "nome": nomeEdit.value
            }

            console.log(bodyUpdate);

            //Monta as configurações de PUT para chamar o método PUT na API
            axios.put(urlUpdate, bodyUpdate)
                .then(response => {
                    if (response.data.NOT_FOUND) {
                        alert(response.data.NOT_FOUND, 'warning');
                    }
                    if (response.data.CONFLICT) {
                        alert(response.data.CONFLICT, 'danger');
                    }
                    if (response.data.ACCEPTED) {
                        alert(response.data.ACCEPTED, 'success');
                    }

                })
                .catch(error => {
                    alert(`Error: ${error.message}`, 'danger');
                });
        }
    }
    $("#divAlert").hide();
    $("#divAlert").fadeTo(2000, 500).slideUp(500, function () {
        $('#divAlertContent').remove();
        window.location.reload(true);
    });
}

function createRow(disciplina) {
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
var nomeEdit;
var codDisciplinaEdit;

function editDisciplina(idDisciplina) {
    const url = 'http://localhost:8080/quadrodehorarios/disciplina/find/';
    axios.get(url + idDisciplina)
        .then(response => {
            if (response.data.NOT_FOUND) {
                alert(response.data.NOT_FOUND, 'danger');
            } else {
                document.getElementById('btnCadastrar').innerText = 'Alterar';

                idEdit = idDisciplina;
                nomeEdit = document.getElementById('nome');
                codDisciplinaEdit = document.getElementById('codDisciplina');
                nomeEdit.value = `${response.data.nome}`;
                codDisciplinaEdit.value = `${response.data.codDisciplina}`;
            }
        })
        .catch(error => {
            alert(`Error: ${error.message}`, 'danger');
        });

}

function clearFields() {
    idEdit = undefined;
    nomeEdit = undefined;
    codDisciplinaEdit = undefined;
    document.getElementById('nome').value = '';
    document.getElementById('codDisciplina').value = '';
}

function deletDisciplina(idDisciplina) {
    const url = 'http://localhost:8080/quadrodehorarios/disciplina/delete/';
    axios.delete(url + idDisciplina)
        .then(response => {
            if (response.data.CONFLICT) {
                alert(response.data.CONFLICT, 'danger');
            } else if (response.data.ACCEPTED) {
                alert(response.data.ACCEPTED, 'success');
            }
        })
        .catch(error => {
            alert(`Error: ${error.message}`, 'danger');
        });
    $("#divAlert").hide();
    $("#divAlert").fadeTo(2000, 500).slideUp(500, function () {
        $('#divAlertContent').remove();
        window.location.reload(true);
    });
}

function findAll() {
    const url = "http://localhost:8080/quadrodehorarios/disciplina/find/all";
    var tBody = document.getElementById('tBody');
    var tr;

    axios.get(url)
        .then(response => {
            response.data.forEach(disciplina => {
                tr = createRow(disciplina);
                tBody.appendChild(tr);
            });
        });
}

findAll();