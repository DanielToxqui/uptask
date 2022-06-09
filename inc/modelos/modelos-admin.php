<?php

$accion = $_POST['accion'];
$password = $_POST['password'];
$usuario = $_POST['usuario'];

if($accion === 'crear') {
    //Codigo para crear los administradores 

    //hashear passwords
    $opciones = array(
        'cost' => 12
    );
    $hash_password = password_hash($password, PASSWORD_BCRYPT, $opciones);
    //importar la conexion 
    include '../funciones/conexion.php';

    try {
        //Realizar consulta de la base de datos
        $stmt = $conn->prepare("INSERT INTO usuarios (usuario, password) VALUES (?, ?) ");
        $stmt->bind_param('ss', $usuario, $hash_password);
        $stmt->execute();
        if($stmt->affected_rows > 0) {
            $respuesta = array(
                'respuesta' => 'correcto',
                'id_insertado' => $stmt->insert_id,
                'tipo' => $accion
            );
        } else {
            $respuesta = array(
                'respuesta' => 'error'
            );
        }
        $stmt->close();
        $conn->close();
    } catch(Exception $e) {
        //en caso de un error, tomar la exepcion
        $respuesta = array(
        'error' => $e->getMessage()
        );
    }

    echo json_encode($respuesta);
}

if($accion === 'login') {
    //  escribir codigo que loguee a los administradores

    include '../funciones/conexion.php';

    try { 
        // Seleccionar el administrador de la base de datos 
        $stmt = $conn->prepare("SELECT usuario, id, password FROM usuarios WHERE usuario = ?");
        $stmt->bind_param('s', $usuario);
        $stmt->execute();
        //loguear el ususario 
        $stmt->bind_result($nombre_usuario, $id_usuario, $pass_usuario);
        $stmt->fetch();
        if($nombre_usuario){
        // El usuario existe, verificar el password 
        if(password_verify($password, $pass_usuario)){
            //iniciar sesion
            session_start();
            $_SESSION['nombre'] = $usuario;
            $_SESSION['id'] = $id_usuario;
            $_SESSION['login'] = true;
            //login correcto
            $respuesta = array(
                'respuesta' => 'correcto',
                'nombre' => $nombre_usuario,
                'tipo' => $accion
            );
        }else {
            // login incorrecto, enviar error
            $respuesta = array(
                'resultado' => 'Password Incorrecto'
            );
        }
        
        } else {
            $respuesta = array(
                'error' => 'Usuario no existe'
            );
        }
        $stmt->close();
        $conn->close();
    } catch(Exception $e) {
        //en caso de un error, tomar la exepcion
        $respuesta = array(
            'pass' => $e->getMessage()
        );
    }

    echo json_encode($respuesta);
}