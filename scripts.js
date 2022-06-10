

eventListeners();
// lista de proyectos
var listaProyectos = document.querySelector('ul#proyectos');

function eventListeners() {
    //boton para crear el proyecto
    document.querySelector('.crear-proyecto a').addEventListener('click', nuevoProyecto);
}

function nuevoProyecto(e) {
    e.preventDefault();
    console.log('Presionaste en nuevo Proyecto');                                                                                                                                                                                                                                                                                                                      
    // Crea un <input> para el nombre del nuevo proyecto
    var nuevoProyecto = document.createElement('li');
    nuevoProyecto.innerHTML = '<input type="text" id="nuevo-proyecto">';
    listaProyectos.appendChild(nuevoProyecto);

    // seleccionar el ID con el nuevoProyecto
    var inputNuevoProyecto = document.querySelector('#nuevo-proyecto');

    // al presionar enter crear el proyecto

    inputNuevoProyecto.addEventListener('keypress', function(e) {
        var tecla = e.which || e.keycode;

        if(tecla === 13) {
            guardarProyectoDB(inputNuevoProyecto.value);
            listaProyectos.removeChild(nuevoProyecto);
        }
    });
}



function guardarProyectoDB(nombreProyecto) {
    //crear llamado ajax
    var xhr = new XMLHttpRequest();

    // enviar datos por formdata
    var datos = new FormData();
    datos.append('proyecto', nombreProyecto);
    datos.append('accion', 'crear');

    //abrir la conexion 
    xhr.open('POST', 'inc/modelos/modelo-proyecto.php', true);

    //En la carga
    xhr.onload = function() {
        if(this.status === 200) {
            //obtener datos de la respuesta
            var respuesta = JSON.parse(xhr.responseText);
            var proyecto = respuesta.nombre_proyecto,
                id_proyecto = respuesta.id_proyecto,
                tipo = respuesta.tipo,
                resultado = respuesta.respuesta;

            // Comprobar la insercion
            if(resultado === 'correcto') {
                //fue exitoso
                if(tipo === 'crear') {
                    // Se creo un nuevo proyecto
                    // inyectar el html
                    var nuevoProyecto = document.createElement('li');
                    nuevoProyecto.innerHTML = `
                    <a href="index.php?id_respuesta=${id_proyecto}" id="${id_proyecto}">
                        ${proyecto}
                    </a>
                `;
                // agregar al html
                listaProyectos.appendChild(nuevoProyecto);

                //enviar alerta
                swal({
                    title: 'Proyecto Creado',
                    text: 'El proyecto: ' + proyecto + ' se creó correctamente',
                    type: 'success'
                })
                .then(resultado => {
                    // redireccionar a la nueva URL
                    if(resultado.value) {
                        window.location.href = 'index.php?id_proyecto=' + id_proyecto;
                    }
                })
                   
                
                } else {
                    // Se actualizo o se elimino
                }
            } else {
                //hubo un error
                swal({
                    type: 'error',
                    title: 'Error!',
                    text: 'Hubo un error!'
                  })
            }
        }
    }

    //enviar request
    xhr.send(datos);

}