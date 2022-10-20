//Recupera a div que vai exibir o alerta
var divAlert = document.getElementById('divAlert');

//Cria o alerta dentro da div que exibe o alerta
function alert(message, type) {
    var wrapper = document.createElement('div')
    wrapper.innerHTML = '<div id="divAlertContent" class="alert alert-' + type + ' alert-dismissible" role="alert" id="alert">' + message + '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>';
    divAlert.append(wrapper);
}

//Monta as linhas da tanela dinamicamente
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
    //buttonDelete.setAttribute('type', 'button');
    buttonDelete.setAttribute('class', 'btn btn-danger bg-danger');
    buttonDelete.setAttribute('style', 'margin-left: 5px');
    buttonDelete.setAttribute('id', `${disciplina.idDisciplina}`);
    buttonDelete.setAttribute('onClick', 'deletDisciplina(this.id)'); //sdlfhgjasdjklghjfkshgfdh

    spanEdit.setAttribute('class', 'material-icons');
    spanDelete.setAttribute('class', 'material-icons');

    //Seta os valores nos componentes
    tdNome.innerText = `${disciplina.nome}`;
    tdCodigo.innerHTML = `${disciplina.codDisciplina}`;
    spanEdit.innerText = 'brush';
    spanDelete.innerText = 'delete';

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

const options = {
    method: 'DELETE',
};

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