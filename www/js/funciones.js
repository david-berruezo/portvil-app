// variables globales
let dynamic_limpiadora = "";

// general functions
let paginasObject =  (function() {

    // dominio queries
    let dominio = "https://www.portvil-extranet.com";
    
    // paginas aplicación
    let vector_paginas = [
        "index" , "registro" , "home" , "propiedades" , "detalle" , "galeria" , "servicio" , "location", 
        "telefonos", "secciones_avantio","monumentos", "noticias" , "bares_discotecas" , "restaurantes", 
        "soporte" , "notificaciones" , "mensaje", "preferencias" , "localizaciones" , "ver_propiedad_limpieza",
        "ver_producto_limpieza" , "ver_blog_limpieza" , "ver_riesgo_limpieza","ver_tarea_limpieza","ver_hoy_tarea_limpieza"
    ];
    
    // domain name
    let domain  	    = location.protocol+'//'+document.domain;
    let domain_cookie   = document.domain;
    let protocol        = window.location.protocol;
    let host            = window.location.host;
    let pathname        = window.location.pathname;
    let location_search = window.location.search;
    let url = domain + "/";

    function addVectorPaginas(vector){
        vector_paginas = vector;    
    }

    function addPagina(object) {
        vector_paginas.push(object);
        // printMessage(object);
    }
    
    function getInfo(){
        let objectInfo = {
            "domain"  	      : domain,
            "domain_cookie"   : domain_cookie,
            "protocol"        : protocol,
            "host"            : host,
            "pathname"        : pathname,
            "location_search" : location_search,
            "url"             : url
        };
        //console.log("Info: "+objectInfo);
        return objectInfo;    
    }
    
    function getParameters(){
        let str = window.location.search;
        let objURL = {};
    
        str.replace(
            new RegExp( "([^?=&]+)(=([^&]*))?", "g" ),
            function( $0, $1, $2, $3 ){
                objURL[ $1 ] = $3;
            }
        );
        return objURL;
    }

    function checkPage(){
        for (let index = 0; index < vector_paginas.length; index++) {
            const element = vector_paginas[index];
            if (pathname.search(element) != -1){
                return element;        
            }
        } 
        return "index";
    }
        
    function printMessage(object) {
        //console.log("Object successfully added:", object);
    }

    function getVectorPaginas(){
        return vector_paginas;
    }

    function getDomain(){
        return dominio;
    }

    return {
        getInfoUrl:getInfo,
        checkPagina:checkPage,
        getDominio:getDomain,
        getParametros:getParameters
    };

})();


const loadUrlFetch = (url) => {
    const myHeaders = new Headers({
        'Accept': 'application/json',
    });
    const fetchPromise = fetch(url,{
        method: 'GET',
        //mode: 'no-cors'
    });
    return fetchPromise;
};


const LeerUrlFetch = () => {
    let dominio = paginasObject.getDominio();
    dominio+= '/User/loginHttp';
    loadUrlFetch(dominio)
        .then((response) => response.text())
        .then((data) => console.log(data));
}


const LeerUrl = (email , password) => {
    let dominio = paginasObject.getDominio();
    dominio+= "/User/loginHttp?email="+email+"&password="+password;
    $.ajax({
        type: "GET",
        url: dominio,
        dataType:"json",
        success: function (data) {
            console.log("data"+data);
        }
    });
}


const LeerFicheroFetch = () => {
    let dominio = paginasObject.getDominio();
    dominio+= "/User/download";
    loadUrlFetch(dominio)
        .then((response) => response.json())
        .then((json) => console.log(json));
}


const LeerFichero = () => {
    let dominio = paginasObject.getDominio();
    dominio+= "/User/download";
    $.ajax({
        type: "GET",
        url: dominio,
        dataType:"json",
        success: function (data) {
            console.log("data"+data);
        }
    });
}


$(function(){
    let is_session_active = checkSession(); 
    let pagina_actual = paginasObject.checkPagina();
    //console.log("is_session_active"+is_session_active);
    //console.log("pagina_actual"+pagina_actual);
    evaluar_paginas();
    /*
    if (pagina_actual != "index" && pagina_actual != "registro"){
        // lanzarHome();
        if (is_session_active)
            evaluar_paginas();
        else
            window.location = "index.html";
    }
    */
});



let checkSession = () => {
    // save user
    let status = localStorage.getItem("status");
    let user_email = localStorage.getItem("user_email");
    let user_password = localStorage.getItem("user_password");
    let error = localStorage.getItem("error");
    /*
    console.log("status: "+status);
    console.log("error: "+error);
    console.log("user_email: "+user_email);
    console.log("user_password: "+user_password);
    */

    return status;

}


let show_hide_panels = () => {
    let images = document.querySelectorAll("img");
    for (let index = 0; index < images.length; index++) {
        const element = images[index];
        element.style.display = "none";
    }
    let load_image = document.querySelector(".loading-icon")
    load_image.style.display = "block";

    document.querySelector(".appHeader").style.display = "none";
    document.querySelector("#appCapsule").style.display = "none";
    document.querySelector(".appBottomMenu").style.display = "none";
    document.querySelector("#sidebarPanel").style.display = "none";
    document.querySelector("#loader").style.height = "100vh";
}

let pruebasWindowStorage = () => {
    
    if (window.localStorage.getItem("activar_geolocation") == false)
        window.localStorage.setItem("activar_geolocation",true)

    if (!window.localStorage.getItem("dynamic_limpiadora"))
        window.localStorage.setItem("dynamic_limpiadora",true)

    if (window.localStorage.getItem("activar_geolocation") == true)
        lanzarEventoLisenerGeolocation(window.localStorage.getItem("dynamic_limpiadora"));    

}


let evaluar_paginas = () => {
    // console.log("evaluamos pagina");
    let pagina_actual = paginasObject.checkPagina();
    let parametros = paginasObject.getParametros();
    
    if (parametros["roles"] == 16 || parametros["roles"] == 17 || parametros["roles"] == 18)
        lanzarEventoLisenerGeolocation(parametros["id"]);
       
    /*
    console.log("parametros "+pagina_actual["pagina"]);
    console.log("evaluamos pagina "+pagina_actual);
    console.log("entra"+parametros);
    */

    if (pagina_actual == "home"){
        // home limpieza
        if (parametros["roles"] == 16 || parametros["roles"] == 17 || parametros["roles"] == 18){
            lanzarHomeLimpieza(parametros);
            crearMenusLimpieza(parametros,pagina_actual);
        // home 
        }else{
            lanzarHome(parametros);
            crearHome(parametros);
            crearSeccionesHome(parametros);
            crearMenus(parametros,pagina_actual);
            lanzarPreferencias(parametros);
        }
    }else if (pagina_actual == "ver_propiedad_limpieza"){
        lanzarPropiedadLimpieza(parametros,pagina_actual);   
        crearMenusLimpieza(parametros,pagina_actual);    
    }else if (pagina_actual == "ver_producto_limpieza"){
        lanzarProductosLimpieza(parametros,pagina_actual);   
        crearMenusLimpieza(parametros,pagina_actual);
    }else if (pagina_actual == "ver_blog_limpieza"){
        lanzarBlogLimpieza(parametros,pagina_actual);   
        crearMenusLimpieza(parametros,pagina_actual);
    }else if (pagina_actual == "ver_riesgo_limpieza"){
        lanzarRiesgosLimpieza(parametros,pagina_actual);   
        crearMenusLimpieza(parametros,pagina_actual);
    }else if (pagina_actual == "ver_tarea_limpieza"){
        lanzarTareasLimpieza(parametros,pagina_actual);   
        crearMenusLimpieza(parametros,pagina_actual);
    }else if (pagina_actual == "ver_hoy_tarea_limpieza"){
        lanzarTareasHoyLimpieza(parametros,pagina_actual);   
        crearMenusLimpieza(parametros,pagina_actual);
    }else if (pagina_actual == "localizaciones"){
        lanzar_localizaciones(parametros);
        // lanzarDetallePropiedad(parametros);
    }else if (pagina_actual == "detalle"){
        lanzarDetallePropiedad(parametros);
        crearMenus(parametros,pagina_actual);
        lanzarPreferencias(parametros);    
    }else if (pagina_actual == "galeria"){
        lanzarGaleria(parametros);
        crearMenus(parametros,pagina_actual);
        lanzarPreferencias(parametros);
    }else if (pagina_actual == "servicio"){
        lanzarServicio(parametros);
        crearMenus(parametros,pagina_actual);
        lanzarPreferencias(parametros);
    }else if (pagina_actual == "location"){
        lanzarLocation(parametros); 
        crearMenus(parametros,pagina_actual);  
        lanzarPreferencias();     
    }else if (pagina_actual == "propiedades"){
        switch(parametros["pagina"]){
            case "propiedades":
                lanzarPropiedades("propiedades",parametros);
                crearMenus(parametros,pagina_actual);
                lanzarPreferencias(parametros);
            break;
            case "galeria":
                lanzarPropiedades("galeria",parametros);
                crearMenus(parametros,pagina_actual);
                lanzarPreferencias(parametros);
            break;
            case "servicios":
                lanzarPropiedades("servicios",parametros);
                crearMenus(parametros,pagina_actual);
                lanzarPreferencias(parametros);
            break;
            case "location":
                lanzarPropiedades("location",parametros);
                crearMenus(parametros,pagina_actual);
                lanzarPreferencias(parametros);
            break;
        } // end switch
    }else if (pagina_actual == "telefonos"){
        lanzarTelefonos(parametros,pagina_actual);
        crearMenus(parametros,pagina_actual);
        lanzarPreferencias(parametros);
    }else if (pagina_actual == "secciones_avantio"){
        lanzarSeccionesAvantio(parametros);
        crearMenus(parametros,pagina_actual);
        lanzarPreferencias(parametros);
    }else if (pagina_actual == "monumentos"){
        lanzarMonumentos(parametros);
        crearMenus(parametros,pagina_actual);
        lanzarPreferencias(parametros);
    }else if(pagina_actual == "noticias"){
        lanzarNoticias(parametros);
        crearMenus(parametros,pagina_actual);
        lanzarPreferencias(parametros);
    }else if(pagina_actual == "bares_discotecas"){
        lanzarBaresDiscotecas(parametros);
        crearMenus(parametros,pagina_actual);
        lanzarPreferencias(parametros);
    }else if(pagina_actual == "restaurantes"){
        lanzarRestaurantes(parametros);
        crearMenus(parametros,pagina_actual);
        lanzarPreferencias(parametros);
    }else if (pagina_actual == "soporte"){
        lanzarSoporte(parametros);
        crearMenus(parametros,pagina_actual);
        lanzarPreferencias(parametros);
    }else if (pagina_actual == "index"){
        lanzarLogin();
    }else if (pagina_actual == "registro"){
        lanzarRegistro();
    }else if (pagina_actual == "notificaciones"){
        lanzarPreferencias(parametros);
    }else if (pagina_actual == "mensaje"){
        lanzarDetalleNotificacion();
        crearMenus(parametros,pagina_actual);
        lanzarPreferencias(parametros);        
    }else if (pagina_actual == "preferencias"){
        lanzarPreferencias(parametros);
        crearMenus(parametros,pagina_actual);
        setActivacionDesactivacionNotificaciones(parametros);
    } // end if
}

let lanzar_localizaciones = (username) => {
    
    var onSuccess = function(position) {
        
        alert('Latitude: '          + position.coords.latitude          + '\n' +
              'Longitude: '         + position.coords.longitude         + '\n' +
              'Altitude: '          + position.coords.altitude          + '\n' +
              'Accuracy: '          + position.coords.accuracy          + '\n' +
              'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
              'Heading: '           + position.coords.heading           + '\n' +
              'Speed: '             + position.coords.speed             + '\n' +
              'Timestamp: '         + position.timestamp                + '\n');
        
        
        let latitude          = document.querySelector(".latitude");      
        let longitude         = document.querySelector(".longitude");      
        let altitude          = document.querySelector(".altitude");      
        let accuracy          = document.querySelector(".accuracy");    
        let altitudeAccuracy  = document.querySelector(".altitudeAccuracy");
        let heading           = document.querySelector(".heading");
        let speed             = document.querySelector(".speed");          
        let timestamp         = document.querySelector(".timestamp");      
              
        latitude.innerHTML  = position.coords.latitude;
        longitude.innerHTML = position.coords.longitude;     
        altitude.innerHTML  = position.coords.altitude;
        accuracy.innerHTML  = position.coords.accuracy; 
        altitudeAccuracy.innerHTML  = position.coords.altitudeAccuracy;
        heading.innerHTML  = position.coords.heading;
        speed.innerHTML  = position.speed;
        timestamp.innerHTML  = position.timestamp;

    };
    
    // console.log("navigator.geolocation works well");
    // document.addEventListener("deviceready", onDeviceReady, false);

    // onError Callback receives a PositionError object
    function onError(error) {
        alert('code: '    + error.code    + '\n' +
              'message: ' + error.message + '\n');
    }
 
    //alert("llega aqui");
    navigator.geolocation.getCurrentPosition(onSuccess, onError);

}


// Detectar evento activar / desactivar notificaciones
let setActivacionDesactivacionNotificaciones = (parametros) => {
    let username = parametros["username"];
    $(".form-check-input").change(function(){
        let dominio = paginasObject.getDominio();
        if ($(this).is(":checked")){
            dominio+= '/AppController/setNotificaciones?notificaciones=1&username='+username;
            loadUrlFetch(dominio)
                .then((response) => response.json())
                .then((data) => {
                    //escribirNoticiasDestacadas(data);
                });                     
        }else{
            dominio+= '/AppController/setNotificaciones?notificaciones=0&username='+username;
            loadUrlFetch(dominio)
                .then((response) => response.json())
                .then((data) => {
                    //escribirNoticiasDestacadas(data);
                });     
        }
    });
}


// enviar formulario contactar
let enviarFormularioContactar = (formulario) => {
    
    let errores = false;
    let elementos_error = document.querySelectorAll(".error_texto");
    
    for (let index = 0; index < elementos_error.length; index++) {
        const element = elementos_error[index];
        element.style.display = "none";
    }

    if (formulario.name2.value == ""){
        errores = true;
        formulario.name2.nextElementSibling.nextElementSibling.style.display = "block";
    }

    if (formulario.email2.value == ""){
        errores = true;
        formulario.email2.nextElementSibling.nextElementSibling.style.display = "block";
    }

    
    if  (formulario.textarea2.value == ""){
        errores = true;
        formulario.textarea2.nextElementSibling.nextElementSibling.style.display = "block";
    }
   
    if (errores){
        return false;
    }else{
        // enviamos formulario
        let dominio = paginasObject.getDominio();
        let text_title = "Nueva Consulta "+formulario.name2.value;
        let text_name = formulario.name2.value;
        let text_email = formulario.email2.value;
        let text_form_message = formulario.textarea2.value;
        let username = formulario.username.value 
        let parametros = "?text_title="+text_title+"&text_name="+text_name+"&text_email="+text_email+"&text_form_message="+text_form_message+"&username="+username;
        dominio+= '/AppController/setConsultas'+parametros;

        loadUrlFetch(dominio)
            .then((response) => response.json())
            .then((data) => {
               // empty  
            });

        // return false;
        return true;
    }

}


// lanzamos menu
let crearMenus = (parametros,pagina_actual) => {
    crearMenuSuperior(parametros);
    crearMenuLateral(parametros);
    crearMenuInferior(parametros,pagina_actual);
}

// home 
let lanzarHome = (parametros) => {
    telefono_destacados(parametros,"home");
    noticias(parametros);
    lanzar_monumentos(parametros);
    lanzar_restaurantes(parametros);
    lanzar_discotecas(parametros);
}

let crearMenusLimpieza = (parametros,pagina_actual) => {
    crearMenuSuperiorLimpieza(parametros);
    crearMenuLateralLimpieza(parametros);
    crearMenuInferiorLimpieza(parametros,pagina_actual);
}

// secciones Limpieza
// lanzamos home | finalizamos home == devolucion propiedades ajax
let lanzarHomeLimpieza = (parametros) => {
    bloquePropiedadesLimpiadoras(parametros);
    bloqueReservasLimpiadoraHoy(parametros); // luego se llama a lanzarHomeLimpiezaTareasHoy para crear las tareas
    bloqueTelefonosLimpiadorasMenuLateral(parametros);
    bloqueTelefonosLimpiadorasFooter(parametros);    
    bloqueTareasLavanderia(parametros);
    bloqueProductosLimpieza(parametros)
    bloqueBlogLimpieza(parametros);
    bloqueRiesgosLaboralesLimpieza(parametros);
} // lanzar home


let lanzarHomeLimpiezaTareasHoy = (parametros,reservas) => {
    bloqueTareasLavanderiaHoy(parametros, reservas);
}


let finalizarHomeLimpieza = () => {
    splideHome();
    lanzar_script_limpieza();
}

let lanzarProductosLimpieza = (parametros,pagina_actual) => {
    bloqueBlogLimpieza(parametros);
    bloqueRiesgosLaboralesLimpieza(parametros);
    bloqueTelefonosLimpiadorasMenuLateral(parametros);
    bloqueTelefonosLimpiadorasFooter(parametros)
    bloqueProductosLimpieza(parametros);
} // end function

let lanzarFinalizarProductosLimpieza = () => {
    splideHome();
    lanzar_script_limpieza();
}


let lanzarBlogLimpieza = (parametros,pagina_actual) => {
    bloqueRiesgosLaboralesLimpieza(parametros);
    bloqueTelefonosLimpiadorasMenuLateral(parametros);
    bloqueTelefonosLimpiadorasFooter(parametros)
    bloqueProductosLimpieza(parametros);
    bloqueBlogLimpieza(parametros);
}

let lanzarFinalizarBlogLimpieza = () => {
    splideHome();
    lanzar_script_limpieza();
}

let lanzarRiesgosLimpieza = (parametros,pagina_actual) => {
    bloqueTelefonosLimpiadorasMenuLateral(parametros);
    bloqueTelefonosLimpiadorasFooter(parametros)
    bloqueProductosLimpieza(parametros);
    bloqueBlogLimpieza(parametros);
    bloqueRiesgosLaboralesLimpieza(parametros);
}

let lanzarFinalizarRiesgoLimpieza = (parametros,pagina_actual) => {
    splideHome();
    lanzar_script_limpieza();
}

let lanzarTareasLimpieza = (parametros,pagina_actual) => {
    bloqueBlogLimpieza(parametros);
    bloqueRiesgosLaboralesLimpieza(parametros);
    bloqueTelefonosLimpiadorasMenuLateral(parametros);
    bloqueTelefonosLimpiadorasFooter(parametros)
    bloqueProductosLimpieza(parametros);
    bloqueTareasLavanderia(parametros);
}

let lanzarFinalizarTareasLimpieza = () => {
    window.setTimeout(function(){
        splideHome();
        lanzar_script_limpieza();
    },2000);
    
}

let lanzarTareasHoyLimpieza = (parametros,pagina_actual) => {
    bloqueBlogLimpieza(parametros);
    bloqueRiesgosLaboralesLimpieza(parametros);
    bloqueTelefonosLimpiadorasMenuLateral(parametros);
    bloqueTelefonosLimpiadorasFooter(parametros)
    bloqueProductosLimpieza(parametros);
    bloqueTareasLavanderia(parametros);
    bloqueTareasLavanderiaHoy(parametros);
}


let lanzarFinalizarTareasHoyLimpieza = () => {
    window.setTimeout(function(){
        splideHome();
        lanzar_script_limpieza();
    },2000);
}


let lanzarPropiedadLimpieza = (parametros,pagina_actual) => {
    let dominio = paginasObject.getDominio();
    let url = dominio;
    url+= '/AppController/getPropertiesByLimpidadora?id='+parametros["id"];

    let username = parametros["username"];
    let fecha_actual = moment().format("YYYY-MM-DD");
    let property_carousel = document.querySelector(".properties_carousel");
    
    let propiedad_id        = "";
    let propiedad_foto      = "";
    let propiedad_localidad = ""; 
    let propiedad_nombre    = "";

    
    loadUrlFetch(url)
        .then((response) => response.json())
        .then((data) => {
            //console.log("datos:"+data)
            if (data.status == "true"){
                // properties
                let property = '';
                for (let index = 0; index < data.avantio.length; index++) {
                    const element = data.avantio[index];
                    property+= '<li class="splide__slide">';
                    property+= '    <a href="#" onclick="ir_otra_pagina(\'propiedad_limpieza.html?username='+username+'&id_propiedad='+element.id+'\')" class="card card-overlay text-white">';
                    property+= '        <img src="'+dominio+'/'+element.uri_650x450+'" class="card-img img-fluid img-propiedad" alt="image">';
                    property+= '        <div class="card-img-overlay">';
                    property+= '            <div class="header row">';
                    property+= '                <div class="col-8">'+element.localidad+'</div>';
                    property+= '                <div class="col-4 text-end">';
                    property+= '                    <i class="icon ion-ios-heart"></i> 523';
                    property+= '                </div>';
                    property+= '            </div>';
                    property+= '            <div class="content">';
                    property+= '                <h1>'+element.nombre_propiedad+'</h1>';
                    property+= '                <footer>';
                    property+= '                    <div class="author">';
                    property+= '                        <img src="img/sample/limpieza/avatar3.jpg" alt="avatar">';
                    property+= '                        '+username+' ';
                    property+= '                    </div>';
                    property+= '                    <div class="date">';
                    property+= '                        '+fecha_actual+' ';
                    property+= '                    </div>';
                    property+= '                </footer>';
                    property+= '            </div>';
                    property+= '        </div>';
                    property+= '    </a>';
                    property+= '</li>';
                    // save property selected
                    if (element.id == parametros["id_propiedad"]){
                        propiedad_id        = element.id;
                        propiedad_foto      = element.uri_650x450;
                        pripiedad_localidad = element.localidad; 
                        propiedad_nombre    = element.nombre_propiedad;    
                    }
                } // end for
                
           
                // event location
                // lanzarEventoLisenerGeolocation();    

            } // end if status

            // variables
    // select
    let dynamic_taxonomy = document.querySelector("#dynamic_taxonomy");
    let dynamic_geocountry = document.querySelector("#dynamic_geocountry");
    let dynamic_georegion = document.querySelector("#dynamic_georegion");
    let dynamic_geocity = document.querySelector("#dynamic_geocity");
    let dynamic_geolocality = document.querySelector("#dynamic_geolocality");
    let dynamic_geodistrict = document.querySelector("#dynamic_geodistrict");
      
    // read all inputs inputs
    let inputs = document.getElementsByTagName('input');
        
    url = dominio;
    url+= '/AppController/getAvantioProperty?id='+parametros["id_propiedad"]+'&id_avantio=1';

    // query detail property
    loadUrlFetch(url)
        .then((response) => response.json())
        .then((data) => {
            //if (data.datos.status == "true"){
                // selects
                dynamic_taxonomy.appendChild(createOption(data.datos[0].taxonomy));
                dynamic_geocountry.appendChild(createOption(data.datos[0].country));
                dynamic_georegion.appendChild(createOption(data.datos[0].region));
                dynamic_geocity.appendChild(createOption(data.datos[0].city));
                dynamic_geolocality.appendChild(createOption(data.datos[0].locality));
                dynamic_geodistrict.appendChild(createOption(data.datos[0].district));
                //console.log(data);
                for (index = 0; index < inputs.length; ++index) {
                    /*
                    console.log( "---------- elemento ------------\n");
                    console.log("elemento: "+inputs[index]);
                    console.log("id: "+inputs[index].getAttribute("id"));
                    console.log("name: "+inputs[index].getAttribute("name"));
                    */
                    // tipos text and number
                    let name = inputs[index].getAttribute("name");
                    let id = inputs[index].getAttribute("name");
                    // elemento json
                    let elemento_json = data.datos[0][name];
                    if (name.search("text_") != -1 || name.search("number_") != -1){
                        if (elemento_json){
                            inputs[index].value = elemento_json;
                        }
                        // deal with inputs[index] element.
                        console.log( "---------- fin elemento ------------\n");
                    }else if (name.search("checkbox_") != -1){
                        inputs[index].checked = false;
                        if (elemento_json){
                            if (elemento_json == 1 )
                                inputs[index].checked = true;
                            else
                            inputs[index].checked = false;
                        }    
                    } // end if
                } // end for

                let descripcion_propiedad = document.querySelector(".descripcion_propiedad");

                /*
                propiedad_id        = element.id;
                propiedad_foto      = element.uri_650x450;
                pripiedad_localidad = element.localidad; 
                propiedad_nombre    = element.nombre_propiedad;     
                */    

                cadena_detalle_propiedad = '';
                cadena_detalle_propiedad+= '<h1 class="title-lg mt-2 mb-2">';
                cadena_detalle_propiedad+= propiedad_nombre;
                cadena_detalle_propiedad+= '</h1>';
                
                cadena_detalle_propiedad+= '<div class="card mb-3 mt-2">';
                cadena_detalle_propiedad+= '    <img src="'+dominio+'/'+propiedad_foto+'" class="card-img-top" alt="image">';
                cadena_detalle_propiedad+= '    <div class="card-body">';
                cadena_detalle_propiedad+= '        <h5 class="card-title">'+propiedad_nombre+'</h5>';
                cadena_detalle_propiedad+= '        <p class="card-text">'+propiedad_localidad+'</p>';
                //cadena_detalle_propiedad+= '        <a onclick="lanzarEventoLisenerGeolocation('+parametros["id"]+')" href="#" class="btn btn-primary iniciar_casa">Iniciar Casa</a>';
                cadena_detalle_propiedad+= '    </div>';
                cadena_detalle_propiedad+= '</div>';
                
                let contenedor_propiedad = document.querySelector(".contenedor_propiedad");    
                contenedor_propiedad.innerHTML = cadena_detalle_propiedad;
                
                descripcion_propiedad.innerHTML = data.datos[0].textarea_description;     

            //} // stauts true
            
            
        // lanzar llamadas personal
        url = dominio;
        url+= "/AppController/getLimpiadoras";
        
        let cadena_telefonos_interes_menu_lateral = '<li class="title">Online</li>';
        let cadena_telefonos_interes = '';
        let cadena_modal = "";
        let contenedor_modal = document.querySelector("#contenedor_modal");    
        // hours
        let from = 0;
        let to = 0;

        loadUrlFetch(url)
        .then((response) => response.json())
        .then((data) => {
            // console.log("datos:"+data)
            if (data.status == "true"){
                for (let index = 0; index < data.datos.length; index++) {
                    const element = data.datos[index];
                    
                    // footer
                    cadena_telefonos_interes+='<a href="#" data-toggle="modal" data-target="#'+element.text_title+'" data-bs-toggle="modal" data-bs-target="#'+element.text_title+'" class="listItem">';
                    cadena_telefonos_interes+='    <div class="image">';
                    if (element.dynamic_gallery_limpiadora_principal == null)
                        cadena_telefonos_interes+='        <img src="'+dominio+'/assets/themes/findhouse/images/limpiadora.jpg" alt="avatar">';
                    else
                        cadena_telefonos_interes+='        <img src="'+dominio+'/'+element.image_1+'" alt="avatar">';
                        
                    cadena_telefonos_interes+='    </div>';
                    cadena_telefonos_interes+='    <div class="text">';
                    cadena_telefonos_interes+='        <div>';
                    cadena_telefonos_interes+='            <strong>'+element.text_title+'</strong>';
                    cadena_telefonos_interes+='            <div class="text-muted">';
                    cadena_telefonos_interes+='                <i class="icon ion-ios-pin me-1"></i>';
                    cadena_telefonos_interes+='                '+element.numnber_mobile;
                    cadena_telefonos_interes+='            </div>';
                    cadena_telefonos_interes+='        </div>';
                    cadena_telefonos_interes+='    </div>';
                    cadena_telefonos_interes+='</a>';
                    

                    // menu_lateral
                    cadena_telefonos_interes_menu_lateral+='<li>';
                    cadena_telefonos_interes_menu_lateral+='<a href="#" data-toggle="modal" data-target="#'+element.text_title+'" data-bs-toggle="modal" data-bs-target="#'+element.text_title+'">';                
                    if (element.dynamic_gallery_limpiadora_principal == null)
                        cadena_telefonos_interes_menu_lateral+='<img class="avatar" src="'+dominio+'/assets/themes/findhouse/images/limpiadora.jpg" alt="avatar">';
                    else
                        cadena_telefonos_interes_menu_lateral+='<img class="avatar" src="'+dominio+'/'+element.image_1+'" alt="avatar">';
                    
                    cadena_telefonos_interes_menu_lateral+=element.text_title;
                    cadena_telefonos_interes_menu_lateral+='</a>';
                    cadena_telefonos_interes_menu_lateral+='</li>';    

                    // modal
                    cadena_modal = '<div class="modal fade action-sheet" id="'+element.text_title+'" tabindex="-1" role="dialog">';
                    cadena_modal+= '<div class="modal-dialog" role="document">';
                    cadena_modal+= '<div class="modal-content">';
                    cadena_modal+= '    <div class="modal-header">';
                    cadena_modal+= '        <h5 class="modal-title">Quieres Llamar a '+element.text_title+' ¿?</h5>';
                    cadena_modal+= '    </div>';
                    cadena_modal+= '    <div class="modal-body">';
                    cadena_modal+= '        <div class="action-sheet-content">';
                    cadena_modal+= '            <form>';
                    cadena_modal+= '                <div class="form-group basic">';
                    cadena_modal+= '                    <div class="input-wrapper">';
                    cadena_modal+= '                        <label class="label" for="account1">From</label>';
                    cadena_modal+= '                        <select class="form-control custom-select" id="account1">';
                    cadena_modal+= '                            <option value="0">'+from+'</option>';
                    cadena_modal+= '                        </select>';
                    cadena_modal+= '                    </div>';
                    cadena_modal+= '                </div>';
                    cadena_modal+= '                <div class="form-group basic">';
                    cadena_modal+= '                    <label class="label">To</label>';
                    cadena_modal+= '                    <div class="input-group mb-2">';
                    cadena_modal+= '                        <span class="input-group-text" id="basic-addona1"></span>';
                    cadena_modal+= '                        <input type="text" class="form-control" placeholder="To" value="'+to+'">';
                    cadena_modal+= '                    </div>';
                    cadena_modal+= '                </div>';
                    cadena_modal+= '                <div class="form-group basic">';
                    cadena_modal+='                 <a class="btn btn-primary btn-block btn-lg" href="tel:'+element.numnber_mobile+'">llama</a>'
                    cadena_modal+= '                </div>';
                    cadena_modal+= '            </form>';
                    cadena_modal+= '        </div>';
                    cadena_modal+= '    </div>';
                    cadena_modal+= '</div>';
                    cadena_modal+= '</div>';
                    cadena_modal+= '</div>';
                    contenedor_modal.innerHTML = (contenedor_modal.innerHTML+cadena_modal);
                
            
                } // end for     
                
                //menu-lateral
                let menu_telefonos_lateral = document.querySelector(".menu-telefonos-lateral");    
                menu_telefonos_lateral.innerHTML = cadena_telefonos_interes_menu_lateral;

                // home footer
                let telefonos_interes = document.querySelector(".telefonos_interes");
                telefonos_interes.innerHTML = cadena_telefonos_interes;    
            }// end if

        });    


            splideHome();
            lanzar_script_limpieza();

        });


        }); // end fetch        
   
}
  
// Descatalogado !!!! OJO !!!!!
let lanzarEventosListenerGeolocationDescatalogado = (parametro_dynamic_limpiadora) => {
    
    let fecha_actual = moment().format("YYYY-MM-DD");
    let parametros = [];
    parametros["latitude"]          = "latitude 2";
    parametros["longitude"]         = "longitude 2";
    parametros["altitude"]          = "altitude 2";
    parametros["accuracy"]          = "accuracy 2";
    parametros["altitudeAccuracy"]  = "altitudeAccuracy 2";
    parametros["heading"]           = "heading 2";
    parametros["speed"]             = "speed 2";
    parametros["timestamp"]         = fecha_actual;
    parametros["dynamic_limpiadora"] = dynamic_limpiadora;

    let cadena_parametros = "?";
    cadena_parametros+= "dynamic_limpiadora="+parametros["dynamic_limpiadora"];
    cadena_parametros+= "&latitude="+parametros["latitude"];
    cadena_parametros+= "&longitude="+parametros["longitude"];
    cadena_parametros+= "&altitude="+parametros["altitude"];
    cadena_parametros+= "&accuracy="+parametros["accuracy"];
    cadena_parametros+= "&altitudeAccuracy="+parametros["altitudeAccuracy"];
    cadena_parametros+= "&heading="+parametros["heading"];
    cadena_parametros+= "&speed="+parametros["speed"];
    cadena_parametros+= "&timestamp="+parametros["timestamp"];
    
    let dominio = paginasObject.getDominio();
    dominio+= '/AppController/insertGeolocationLimpiadora'+cadena_parametros;
    loadUrlFetch(dominio)
        .then((response) => response.json())
        .then((data) => {
            //console.log("insertados datos");
        });

    window.setInterval(function(){
        let options = {
            maximumAge: 3600000,
            timeout:300,
            enableHighAccuracy:true
        };
        navigator.geolocation.watchPosition(onSuccessGeolocation, onErrorGeolocation,options);
        //navigator.geolocation.getCurrentPosition(onSuccessGeolocation, onErrorGeolocation);
    }, 60 * 1000);   
}



// parametros
let lanzarEventoLisenerGeolocation = (parametro_dynamic_limpiadora) => {
    
    dynamic_limpiadora = parametro_dynamic_limpiadora;
    // document.addEventListener("deviceready", onDeviceReady, false); 
   
    window.setInterval(function(){
        onDeviceReady();
    }, 60 * 1000);
    
    /*
    if (window.localStorage.getItem("activar_geolocation") == false)
        window.localStorage.setItem("activar_geolocation",true)

    if (!window.localStorage.getItem("dynamic_limpiadora"))
        window.localStorage.setItem("dynamic_limpiadora",true)
    */

    //console.log("Lanzamos geolocation");

}


function onDeviceReady() {
    //console.log("navigator.geolocation works well");
    // onSuccess Callback
    // This method accepts a Position object, which contains the
    // current GPS coordinates
    var onSuccess = function(position) {
        let latitude          = document.querySelector(".latitude");      
        let longitude         = document.querySelector(".longitude");      
        let altitude          = document.querySelector(".altitude");      
        let accuracy          = document.querySelector(".accuracy");    
        let altitudeAccuracy  = document.querySelector(".altitudeAccuracy");
        let heading           = document.querySelector(".heading");
        let speed             = document.querySelector(".speed");          
        let timestamp         = document.querySelector(".timestamp");      
        
        /*
        alert('Latitude: '          + position.coords.latitude          + '\n' +
              'Longitude: '         + position.coords.longitude         + '\n' +
              'Altitude: '          + position.coords.altitude          + '\n' +
              'Accuracy: '          + position.coords.accuracy          + '\n' +
              'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
              'Heading: '           + position.coords.heading           + '\n' +
              'Speed: '             + position.coords.speed             + '\n' +
              'Timestamp: '         + position.timestamp                + '\n');

        latitude.innerHTML  = position.coords.latitude;
        longitude.innerHTML = position.coords.longitude;     
        altitude.innerHTML  = position.coords.altitude;
        accuracy.innerHTML  = position.coords.accuracy; 
        altitudeAccuracy.innerHTML  = position.coords.altitudeAccuracy;
        heading.innerHTML  = position.coords.heading;
        speed.innerHTML  = position.speed;
        timestamp.innerHTML  = position.timestamp;
        */

        let fecha_actual = moment().format("YYYY-MM-DD");

        let parametros = [];
        parametros["latitude"]          = position.coords.latitude;
        parametros["longitude"]         = position.coords.longitude;
        parametros["altitude"]          = position.coords.altitude;
        parametros["accuracy"]          = position.coords.accuracy;
        parametros["altitudeAccuracy"]  = position.coords.altitudeAccuracy;
        parametros["heading"]           = position.coords.heading;
        parametros["speed"]             = position.speed;
        parametros["timestamp"]         = position.timestamp;
        parametros["dynamic_limpiadora"] = dynamic_limpiadora;

        let cadena_parametros = "?";
        cadena_parametros+= "dynamic_limpiadora="+parametros["dynamic_limpiadora"];
        cadena_parametros+= "&latitude="+parametros["latitude"];
        cadena_parametros+= "&longitude="+parametros["longitude"];
        cadena_parametros+= "&altitude="+parametros["altitude"];
        cadena_parametros+= "&accuracy="+parametros["accuracy"];
        cadena_parametros+= "&altitudeAccuracy="+parametros["altitudeAccuracy"];
        cadena_parametros+= "&heading="+parametros["heading"];
        cadena_parametros+= "&speed="+parametros["speed"];
        cadena_parametros+= "&timestamp="+parametros["timestamp"];
        
        let dominio = paginasObject.getDominio();
        dominio+= '/AppController/insertGeolocationLimpiadora'+cadena_parametros;
        loadUrlFetch(dominio)
            .then((response) => response.json())
            .then((data) => {
                //console.log("insertados datos");
            });


    };
 
    // onError Callback receives a PositionError object
    function onError(error) {
        alert('code: '    + error.code    + '\n' +
              'message: ' + error.message + '\n');
    }
 
    navigator.geolocation.getCurrentPosition(onSuccess, onError);

    /*
    window.setInterval(function(){
        let options = {
            maximumAge: 3600000,
            timeout:300,
            enableHighAccuracy:true
        };
        navigator.geolocation.watchPosition(onSuccessGeolocation, onErrorGeolocation,options);
        //navigator.geolocation.getCurrentPosition(onSuccessGeolocation, onErrorGeolocation);
    }, 60 * 1000);
    */
}



let onSuccessGeolocation = (position) => {
    /*
    alert('Latitude: '    + position.coords.latitude          + '\n' +
    'Longitude: '         + position.coords.longitude         + '\n' +
    'Altitude: '          + position.coords.altitude          + '\n' +
    'Accuracy: '          + position.coords.accuracy          + '\n' +
    'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
    'Heading: '           + position.coords.heading           + '\n' +
    'Speed: '             + position.coords.speed             + '\n' +
    'Timestamp: '         + position.timestamp                + '\n');
    */

    let fecha_actual = moment().format("YYYY-MM-DD");
    let parametros = [];
    parametros["latitude"]          = position.coords.latitude;
    parametros["longitude"]         = position.coords.longitude;
    parametros["altitude"]          = position.coords.altitude;
    parametros["accuracy"]          = position.coords.accuracy;
    parametros["altitudeAccuracy"]  = position.coords.altitudeAccuracy;
    parametros["heading"]           = position.coords.heading;
    parametros["speed"]             = position.coords.speed;
    parametros["timestamp"]         = position.coords.timestamp;
    parametros["dynamic_limpiadora"] = dynamic_limpiadora;

    let cadena_parametros = "?";
    cadena_parametros+= "dynamic_limpiadora="+parametros["dynamic_limpiadora"];
    cadena_parametros+= "&latitude="+parametros["latitude"];
    cadena_parametros+= "&longitude="+parametros["longitude"];
    cadena_parametros+= "&altitude="+parametros["altitude"];
    cadena_parametros+= "&accuracy="+parametros["accuracy"];
    cadena_parametros+= "&altitudeAccuracy="+parametros["altitudeAccuracy"];
    cadena_parametros+= "&heading="+parametros["heading"];
    cadena_parametros+= "&speed="+parametros["speed"];
    cadena_parametros+= "&timestamp="+parametros["timestamp"];

    let dominio = paginasObject.getDominio();
    dominio+= '/AppController/insertGeolocationLimpiadora'+cadena_parametros;
    loadUrlFetch(dominio)
        .then((response) => response.json())
        .then((data) => {
            //console.log("insertados datos");
        });    
    
};   
 

let onErrorGeolocation = (error) => {
    alert('code: '    + error.code    + '\n' + 'message: ' + error.message + '\n');
} 


let splideHome = () => {
    // carousels
    // first carousel
    let carousel_one = document.querySelector(".carousel-single");
    if (carousel_one){
        new Splide( carousel_one,{
            type   : 'loop',
            perPage: 1,
            padding:{left:40,right:40},
            fixedWidth: 334,
            arrows:false,
            pagination:false
        }).mount();
    } // end if
    
    
    // second carousel
    let carousel_two = document.querySelector(".postCarousel");
    if (carousel_two){
        new Splide( carousel_two,{
            type   : 'loop',
            perPage: 1,
            padding:{left:20,right:20},
            fixedWidth: 177,
            arrows:false,
            pagination:false
        }).mount();
    } // end if    
    
    // third carousel
    let carousel_three = document.querySelector(".buttonCarousel");
    if (carousel_three){
        new Splide( carousel_three,{
            type   : 'loop',
            perPage: 1,
            padding:{left:20,right:20},
            fixedWidth: 78.5,
            arrows:false,
            pagination:false
        }).mount();
    } // end if
        
}




let bloquePropiedadesLimpiadoras = (parametros) => {
    
    let dominio = paginasObject.getDominio();
    let url = dominio;
    url+= '/AppController/getPropertiesByLimpidadora?id='+parametros["id"];
    let username = parametros["username"];
    let fecha_actual = moment().format("YYYY-MM-DD");
    let property_carousel = document.querySelector(".properties_carousel");
    
    loadUrlFetch(url)
        .then((response) => response.json())
        .then((data) => {
            //console.log("datos:"+data)
            if (data.status == "true"){
                // properties
                let property = '';
                for (let index = 0; index < data.avantio.length; index++) {
                    const element = data.avantio[index];
                    property+= '<li class="splide__slide">';
                    property+= '    <a href="#" onclick="ir_otra_pagina(\'ver_propiedad_limpieza.html?roles='+parametros["roles"]+'&id='+parametros["id"]+'&username='+username+'&id_propiedad='+element.id+'\')" class="card card-overlay text-white">';
                    property+= '        <img src="'+dominio+'/'+element.uri_650x450+'" class="card-img img-fluid img-propiedad" alt="image">';
                    property+= '        <div class="card-img-overlay">';
                    property+= '            <div class="header row">';
                    property+= '                <div class="col-8">'+element.localidad+'</div>';
                    property+= '                <div class="col-4 text-end">';
                    property+= '                    <i class="icon ion-ios-heart"></i> 523';
                    property+= '                </div>';
                    property+= '            </div>';
                    property+= '            <div class="content">';
                    property+= '                <h1>'+element.nombre_propiedad+'</h1>';
                    property+= '                <footer>';
                    property+= '                    <div class="author">';
                    property+= '                        <img src="img/sample/limpieza/avatar3.jpg" alt="avatar">';
                    property+= '                        '+username+' ';
                    property+= '                    </div>';
                    property+= '                    <div class="date">';
                    property+= '                        '+fecha_actual+' ';
                    property+= '                    </div>';
                    property+= '                </footer>';
                    property+= '            </div>';
                    property+= '        </div>';
                    property+= '    </a>';
                    property+= '</li>';
                } // end for
                property_carousel.innerHTML = property;
               
            } // if data status true

            finalizarHomeLimpieza();

        });
        
}


let bloqueReservasLimpiadoraHoy = (parametros) => {
    // var
    let dominio = paginasObject.getDominio();
    let url = dominio+'/AppController/getReservasHoy?limpiadora='+parametros["id"];
    let reservas_limpieza = document.querySelector(".reservas_limpieza");
    let reservas_limpieza_cadena = '';
    // get reservations query
    loadUrlFetch(url)
    .then((response) => response.json())
    .then((data) => {
        //console.log("datos:"+data)
        if (data.status == "true"){
            //console.log("Llega al objetivo");
            reservas_limpieza_cadena+= '<table class="table table-striped">';
            reservas_limpieza_cadena+= '<thead>';
            reservas_limpieza_cadena+= '<tr>';
            //reservas_limpieza_cadena+= '<th scope="col">#</th>';
            reservas_limpieza_cadena+= '<th scope="col">Cliente</th>';
            reservas_limpieza_cadena+= '<th scope="col">Entrada</th>';
            reservas_limpieza_cadena+= '<th scope="col">Salida</th>';
            reservas_limpieza_cadena+= '</tr>';
            reservas_limpieza_cadena+= '</thead>';
            reservas_limpieza_cadena+= '<tbody>';
            for (let index = 0; index < data.reservas_limpiadora.length; index++) {
                const element = data.reservas_limpiadora[index];
                const name_surname = element.name + element.surname;
                reservas_limpieza_cadena+= '<tr>';
                //reservas_limpieza_cadena+= '    <th scope="row">'+element.booking_code+'</th>';
                reservas_limpieza_cadena+= '    <td>'+name_surname+'</td>';
                reservas_limpieza_cadena+= '    <td>'+element.start_date+'</td>';
                reservas_limpieza_cadena+= '    <td>'+element.end_date+'</td>';
                reservas_limpieza_cadena+= '</tr>';
            }
            reservas_limpieza_cadena+= '</tbody>';
            reservas_limpieza_cadena+= '</table>';    
        }
        reservas_limpieza.innerHTML = reservas_limpieza_cadena;
        // crear las tareas actuales
        bloqueTareasLavanderiaHoy(parametros, data.reservas_limpiadora);
    });   
}



let bloqueTareasLavanderiaHoy = (parametros, reservas) => {
    
    let dominio = paginasObject.getDominio();
    let url = dominio;
    url= dominio+'/AppController/getTareas';
    let username = parametros["username"];
    // tareeas
    let lavanderia_tareas_carousel = document.querySelector(".lavanderia_tareas_carousel");
    let lavanderia_hoy_carousel = document.querySelector(".lavanderia_hoy_carousel");
    let contenedor_tarea  = "";
    let descripcion_tarea = "";
    let lavanderia_todas = '';
    let vector_tareas = [] ;
    let fecha_hoy = moment().format("YYYY-MM-DD");
    let vector_tareas_hoy = [];
    //let tarea = {};
    let id_tarea = 0;
    let lavanderia_hoy = '';
    
    // cogemos todas las tareas
    loadUrlFetch(url)
    .then((response) => response.json())
    .then((data) => {
        //console.log("datos:"+data)
        if (data.status == "true"){
            vector_tareas = data.tareas_imagenes;
            //console.log(vector_tareas);
        }

        // demás codigo
        // leemos todas las reservas
        for (let index = 0; index < reservas.length; index++) {
            let element = reservas[index];
            //console.log("reservas: "+element.start_date);
            /*
            console.log("--------- datos ----------\n");
            console.log("reservas id: "+element.booking_code);
            console.log("fecha hoy: "+fecha_hoy);
            console.log("start date: "+element.start_date);
            console.log("end date: "+element.end_date);
            console.log("--------- fin datos ----------\n");
            */
            let encontrada_checkout = false;
            id_tarea = -1;
            // checkin entrada || checkin entraday y salida
            if (fecha_hoy == element.start_date){
                // comprobamos si hay o no un checkout
                for (let index_dos = 0; index_dos < reservas.length; index_dos++) {
                    const element_dos = reservas[index_dos];
                    if (fecha_hoy == element_dos.end_date){
                        encontrada_checkout = true;
                    }
                }  
                // id tarea    
                if (encontrada_checkout){
                    id_tarea = 1;
                }else{
                    id_tarea = 4;
                }
                let tarea = {
                    "booking_code" : element.booking_code,
                    "start_date" :  element.start_date,
                    "end_date" :  element.end_date,    
                    "nombre_tarea": nombre_tarea,
                    //"desc_tarea": desc_tarea,
                    "imagen_tarea":imagen_tarea,
                    "id_tarea" : element.id,
                    "cliente": element.name+" "+element.surname
                };
                vector_tareas_hoy.push(tarea);
            }else if (fecha_hoy >= element.start_date && fecha_hoy <= element.end_date) {
                let fecha_hoy_object = new Date(fecha_hoy);
                let fecha_checkin = new Date(element.start_date);
                let diferencia_dias = dateDiffInDays(fecha_checkin,fecha_hoy_object)    
                //console.log("diferencia dias: "+diferencia_dias);
                if (diferencia_dias % 3 == 0){
                    id_tarea = 2;    
                }else if (diferencia_dias % 7 == 0){
                    id_tarea = 3;
                }else{
                    // no seleccionada    
                }
                let tarea = {
                    "booking_code" : element.booking_code,
                    "start_date" :  element.start_date,
                    "end_date" :  element.end_date,    
                    "nombre_tarea": "",
                    // "desc_tarea": desc_tarea,
                    "imagen_tarea":"",
                    "id_tarea" : element.id,
                    "cliente": element.name+" "+element.surname
                };
                // obtenemos nombre de tarea
                for (let index_tres = 0; index_tres < vector_tareas.length; index_tres++) {
                    let nombre_tarea = vector_tareas[index_tres].text_title;
                    let desc_tarea = vector_tareas[index_tres].textarea_description;
                    let imagen_tarea = vector_tareas[index_tres].image_principal;
                    if (id_tarea == vector_tareas[index_tres].id){
                        encontrada_checkout = true;
                        /*
                        console.log("--------- datos 2 ----------\n");
                        console.log("reservas id: "+element.booking_code);
                        console.log("fecha hoy: "+fecha_hoy);
                        console.log("start date: "+element.start_date);
                        console.log("end date: "+element.end_date);
                        console.log("--------- fin datos ----------\n");
                        */
                        tarea.imagen_tarea = imagen_tarea;
                        tarea.nombre_tarea = nombre_tarea;
                    }else if(id_tarea == -1){
                        let index_aleatory =  Math.floor(Math.random() * 4) + 0;
                        tarea.imagen_tarea = vector_tareas[index_aleatory].image_principal;
                        tarea.nombre_tarea = "No seleccionada";
                    }
                } // end for
                vector_tareas_hoy.push(tarea);
            } // end if
        
        } // end for reservas

        lavanderia_hoy = '';

        //console.log("vector: "+vector_tareas_hoy);

        for (let index_cuatro = 0; index_cuatro < vector_tareas_hoy.length; index_cuatro++) {
            const element_cuatro = vector_tareas_hoy[index_cuatro];
            // salida y entrada
            lavanderia_hoy+= '<li class="splide__slide">';
            lavanderia_hoy+= '    <a href="#" onclick="ir_otra_pagina(\'ver_hoy_tarea_limpieza.html?roles='+parametros["roles"]+'&id='+parametros["id"]+'&username='+username+'&id_tarea=1\')">';
            lavanderia_hoy+= '        <img src="'+dominio+'/'+element_cuatro.imagen_tarea+'" alt="image" class="image">';
            lavanderia_hoy+= '        <h2 class="title">'+element_cuatro.nombre_tarea+'</h2>';
            lavanderia_hoy+= '        <h3 class="title">'+element_cuatro.start_date+'</h3>';
            lavanderia_hoy+= '        <h3 class="title">'+element_cuatro.end_date+'</h3>';
            lavanderia_hoy+= '        <h3 class="title">'+element_cuatro.cliente+'</h3>';
            lavanderia_hoy+= '    </a>';
            lavanderia_hoy+= '</li>';

            if (parametros["id_tarea"] == element_cuatro.id_tarea){
                //console.log("entrando");
                contenedor_tarea  = document.querySelector(".contenedor_tarea");
                descripcion_tarea = document.querySelector(".descripcion_tarea");
                if (contenedor_tarea)
                    contenedor_tarea.innerHTML = '<img src="'+dominio+'/'+element_cuatro.imagen_tarea+'" alt="image" class="image">';
                if (descripcion_tarea)
                    descripcion_tarea.innerHTML = element_cuatro.nombre_tarea;
                
                lanzarFinalizarTareasHoyLimpieza();
            }    
        } // end for

        if (lavanderia_hoy_carousel)
            lavanderia_hoy_carousel.innerHTML = lavanderia_hoy;

    });  // end ajax query         

} 


// a and b are javascript Date objects
let dateDiffInDays = (a, b) => {
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    // Discard the time and time-zone information.
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  
    return Math.floor((utc2 - utc1) / _MS_PER_DAY);

}
  


let bloqueTareasLavanderia = (parametros) => {
    
    let dominio = paginasObject.getDominio();
    let url = dominio;
    url= dominio+'/AppController/getTareas';
    let username = parametros["username"];
    let lavanderia_tareas_carousel = document.querySelector(".lavanderia_tareas_carousel");
    let contenedor_tarea  = "";
    let descripcion_tarea = "";
    let lavanderia_todas = '';
    
    loadUrlFetch(url)
    .then((response) => response.json())
    .then((data) => {
        //console.log("datos:"+data)
        if (data.status == "true"){
            for (let index = 0; index < data.tareas_imagenes.length; index++) {
                const element = data.tareas_imagenes[index];
                lavanderia_todas+='<li class="splide__slide">';    
                lavanderia_todas+='    <a href="#" onclick="ir_otra_pagina(\'ver_tarea_limpieza.html?roles='+parametros["roles"]+'&id='+parametros["id"]+'&username='+username+'&id_tarea='+element.id+'\')">';
                lavanderia_todas+='        <div class="imgWrapper">';
                lavanderia_todas+='            <img src="'+dominio+'/'+element.image_principal+'" alt="image" style="max-width:78-5px;">';
                lavanderia_todas+='        </div>';
                lavanderia_todas+='        <strong>'+element.text_title+'</strong>';
                lavanderia_todas+='    </a>';
                lavanderia_todas+='</li>'; 
                // detalle tarea
                if (parametros["id_tarea"] == element.id){
                    console.log("entrando");
                    contenedor_tarea  = document.querySelector(".contenedor_tarea");
                    descripcion_tarea = document.querySelector(".descripcion_tarea");
                    contenedor_tarea.innerHTML = '<img src="'+dominio+'/'+element.image_principal+'" alt="image">';
                    descripcion_tarea.innerHTML = +element.text_title;
                    lanzarFinalizarTareasHoyLimpieza();
                }           
            }
            lavanderia_tareas_carousel.innerHTML = lavanderia_todas;
        }
    });            

}


let bloqueProductosLimpieza = (parametros) => {
    
    let dominio = paginasObject.getDominio();
    let url = dominio;
    let lavanderia_productos = document.querySelector(".productos_limpieza");
    url= dominio+'/AppController/getProductosLimpiezaDestacados';
    lavanderia_productos_cadena = ''; 
    let username = parametros["username"];
    let cadena_detalle_producto = '';

    loadUrlFetch(url)
    .then((response) => response.json())
    .then((data) => {
        //console.log("datos:"+data)
        if (data.status == "true"){
            for (let index = 0; index < data.datos.length; index++) {
                const element = data.datos[index];
                // desinfectante para suelos
                lavanderia_productos_cadena+='<a href="#" onclick="ir_otra_pagina(\'ver_producto_limpieza.html?username='+username+'&roles='+parametros["roles"]+'&id='+parametros["id"]+'&id_producto='+element.id+'\')">';
                lavanderia_productos_cadena+='<div class="item">';
                lavanderia_productos_cadena+='    <div class="image">';
                lavanderia_productos_cadena+='        <img src="'+dominio+'/'+element.image_1+'" alt="image">';
                lavanderia_productos_cadena+='    </div>';
                lavanderia_productos_cadena+='    <div class="text">';
                lavanderia_productos_cadena+='        <h4 class="title">'+element.text_title+'</h4>';
                lavanderia_productos_cadena+='        <div class="text-muted">'+element.textarea_description+'</div>';
                lavanderia_productos_cadena+='    </div>';
                lavanderia_productos_cadena+='</div>';
                lavanderia_productos_cadena+='</a>';    
                // producto detalle
                if (element.id == parametros["id_producto"]){
                    producto_imagen      = dominio+'/'+element.image_1;
                    producto_nombre      = element.text_title;
                    producto_descripcion = element.textarea_description;
                    
                    cadena_detalle_producto = '';
                    cadena_detalle_producto+= '<h1 class="title-lg mt-2 mb-2">';
                    cadena_detalle_producto+= producto_nombre;
                    cadena_detalle_producto+= '</h1>';
                    
                    cadena_detalle_producto+= '<div class="card mb-3 mt-2">';
                    cadena_detalle_producto+= '    <img src="'+producto_imagen+'" class="card-img-top" alt="image">';
                    cadena_detalle_producto+= '    <div class="card-body">';
                    cadena_detalle_producto+= '        <h5 class="card-title">'+producto_nombre+'</h5>';
                    cadena_detalle_producto+= '        <p class="card-text">'+producto_descripcion+'</p>';
                    cadena_detalle_producto+= '        <a href="#" class="btn btn-primary iniciar_casa">Comprar</a>';
                    cadena_detalle_producto+= '    </div>';
                    cadena_detalle_producto+= '</div>';
                    
                    let contenedor_propiedad = document.querySelector(".contenedor_propiedad");    
                    contenedor_propiedad.innerHTML = cadena_detalle_producto;

                    lanzarFinalizarProductosLimpieza();

                } // end if
            
            }
            lavanderia_productos.innerHTML = lavanderia_productos_cadena;     
        } // end if
    });

}


let bloqueBlogLimpieza = (parametros) => {

    let dominio = paginasObject.getDominio();
    let url = dominio;
    url = dominio+'/AppController/getBlogLimpiezaDestacados';
    let noticias_blog_limpieza_cadena = ''; 
    let noticias_blog_limpieza = document.querySelector(".noticias-blog-limpieza");
    let username = parametros["username"];

    loadUrlFetch(url)
    .then((response) => response.json())
    .then((data) => {
        //console.log("datos:"+data)
        if (data.status == "true"){
            for (let index = 0; index < data.datos.length; index++) {
                const element = data.datos[index];
                noticias_blog_limpieza_cadena+='<div class="col-6">';
                noticias_blog_limpieza_cadena+='    <a href="#" onclick="ir_otra_pagina(\'ver_blog_limpieza.html?roles='+parametros["roles"]+'&id='+parametros["id"]+'&username='+username+'&id_blog='+element.id+'\')" class="postItem">';
                noticias_blog_limpieza_cadena+='        <div class="imageWrapper">';
                noticias_blog_limpieza_cadena+='            <img src="'+dominio+'/'+element.image_1+'" alt="image" class="image">';
                noticias_blog_limpieza_cadena+='            <div class="badge badge-warning">ORGANIZACIÓN</div>';
                noticias_blog_limpieza_cadena+='        </div>';
                noticias_blog_limpieza_cadena+='        <h2 class="title">'+element.text_title+'</h2>';
                noticias_blog_limpieza_cadena+='        <footer>';
                noticias_blog_limpieza_cadena+='            <img src="img/sample/limpieza/avatar.jpg" alt="avatar" class="avatar">';
                noticias_blog_limpieza_cadena+='            25 Sep 2019';
                noticias_blog_limpieza_cadena+='        </footer>';
                noticias_blog_limpieza_cadena+='    </a>';
                noticias_blog_limpieza_cadena+='</div>';    
                // blog detalle
                if (element.id == parametros["id_blog"]){
                    producto_imagen      = dominio+'/'+element.image_1;
                    producto_nombre      = element.text_title;
                    producto_descripcion = element.textarea_description;
                    cadena_detalle_producto = '';
                    cadena_detalle_producto+= '<h1 class="title-lg mt-2 mb-2">';
                    cadena_detalle_producto+= producto_nombre;
                    cadena_detalle_producto+= '</h1>';
                    cadena_detalle_producto+= '<div class="card mb-3 mt-2">';
                    cadena_detalle_producto+= '    <img src="'+producto_imagen+'" class="card-img-top" alt="image">';
                    cadena_detalle_producto+= '    <div class="card-body">';
                    cadena_detalle_producto+= '        <h5 class="card-title">'+producto_nombre+'</h5>';
                    cadena_detalle_producto+= '        <p class="card-text">'+producto_descripcion+'</p>';
                    //cadena_detalle_producto+= '        <a href="#" class="btn btn-primary iniciar_casa">Comprar</a>';
                    cadena_detalle_producto+= '    </div>';
                    cadena_detalle_producto+= '</div>';
                    
                    let contenedor_blog_destacado = document.querySelector(".contenedor_blog_destacado");    
                    contenedor_blog_destacado.innerHTML = cadena_detalle_producto;

                    lanzarFinalizarBlogLimpieza();
                } // end if detalle producto
                
            }
            noticias_blog_limpieza.innerHTML = noticias_blog_limpieza_cadena;     
        } // end if
    
    });

};    


let bloqueRiesgosLaboralesLimpieza = (parametros) => {

        let riesgos_laborales = document.querySelector(".riesgos-laborales");
        let dominio = paginasObject.getDominio();
        let url = dominio;
        let noticias_blog_limpieza_cadena = ''; 
        let username = parametros["username"];
        url= dominio+'/AppController/getRiesgosLaborlesLimpiezaDestacados';
        cadena_riesgos_laborales = ''; 

        loadUrlFetch(url)
        .then((response) => response.json())
        .then((data) => {
            if (data.status == "true"){
               for (let index = 0; index < data.datos.length; index++) {
                   const element = data.datos[index];
                   cadena_riesgos_laborales+= '<div class="col-6">';
                   cadena_riesgos_laborales+='<a href="#" onclick="ir_otra_pagina(\'ver_riesgo_limpieza.html?roles='+parametros["roles"]+'&id='+parametros["id"]+'&username='+username+'&id_riesgo='+element.id+'\')" class="postItem">';
                   cadena_riesgos_laborales+= '<div class="iconedBox">';
                   cadena_riesgos_laborales+= '    <div class="iconWrap '+element.text_color+'">';
                   cadena_riesgos_laborales+= '        <i class="icon '+element.text_icon+'"></i>';
                   cadena_riesgos_laborales+= '    </div>';
                   cadena_riesgos_laborales+= '    <h4 class="title">'+element.text_title+'</h4>';
                   cadena_riesgos_laborales+= '    '+element.textarea_description+'';
                   cadena_riesgos_laborales+= '</div>';
                   cadena_riesgos_laborales+= '</a>';
                   cadena_riesgos_laborales+= '</div>';
                   // riesgo laboral detalle
                   if (element.id == parametros["id_riesgo"]){
                        cadena_detalle_producto = '';
                        cadena_detalle_producto+= '<div class="iconedBox">';
                        cadena_detalle_producto+= '    <div class="iconWrap '+element.text_color+'">';
                        cadena_detalle_producto+= '        <i class="icon '+element.text_icon+'"></i>';
                        cadena_detalle_producto+= '    </div>';
                        cadena_detalle_producto+= '    <h4 class="title">'+element.text_title+'</h4>';
                        cadena_detalle_producto+= '    '+element.textarea_description+'';
                        cadena_detalle_producto+= '</div>';
                        let contenedor_blog_destacado = document.querySelector(".contenedor_riesgo_destacado");    
                        contenedor_blog_destacado.innerHTML = cadena_detalle_producto;

                        lanzarFinalizarBlogLimpieza();

                    } // end if detalle producto 
               }
               riesgos_laborales.innerHTML = cadena_riesgos_laborales;     
           } // end if
        });
}


let bloqueTelefonosLimpiadorasFooter = (parametros) => {

    // lanzar llamadas personal
    let dominio = paginasObject.getDominio();
    let url = dominio;
    url = dominio;
    url+= "/AppController/getLimpiadoras";
    
    let cadena_telefonos_interes_menu_lateral = '<li class="title">Online</li>';
    let cadena_telefonos_interes = '';
    let cadena_modal = "";
    let contenedor_modal = document.querySelector("#contenedor_modal");    
    // hours
    let from = 0;
    let to = 0;

    loadUrlFetch(url)
    .then((response) => response.json())
    .then((data) => {
        // console.log("datos:"+data)
        if (data.status == "true"){
            for (let index = 0; index < data.datos.length; index++) {
                const element = data.datos[index];
                // footer
                cadena_telefonos_interes+='<a href="#" data-toggle="modal" data-target="#'+element.text_title+'" data-bs-toggle="modal" data-bs-target="#'+element.text_title+'" class="listItem">';
                cadena_telefonos_interes+='    <div class="image">';
                if (element.dynamic_gallery_limpiadora_principal == null)
                    cadena_telefonos_interes+='        <img src="'+dominio+'/assets/themes/findhouse/images/limpiadora.jpg" alt="avatar">';
                else
                    cadena_telefonos_interes+='        <img src="'+dominio+'/'+element.image_1+'" alt="avatar">';
                    
                cadena_telefonos_interes+='    </div>';
                cadena_telefonos_interes+='    <div class="text">';
                cadena_telefonos_interes+='        <div>';
                cadena_telefonos_interes+='            <strong>'+element.text_title+'</strong>';
                cadena_telefonos_interes+='            <div class="text-muted">';
                cadena_telefonos_interes+='                <i class="icon ion-ios-pin me-1"></i>';
                cadena_telefonos_interes+='                '+element.numnber_mobile;
                cadena_telefonos_interes+='            </div>';
                cadena_telefonos_interes+='        </div>';
                cadena_telefonos_interes+='    </div>';
                cadena_telefonos_interes+='</a>';
                
                
                // modal
                cadena_modal = '<div class="modal fade action-sheet" id="'+element.text_title+'" tabindex="-1" role="dialog">';
                cadena_modal+= '<div class="modal-dialog" role="document">';
                cadena_modal+= '<div class="modal-content">';
                cadena_modal+= '    <div class="modal-header">';
                cadena_modal+= '        <h5 class="modal-title">Quieres Llamar a '+element.text_title+' ¿?</h5>';
                cadena_modal+= '    </div>';
                cadena_modal+= '    <div class="modal-body">';
                cadena_modal+= '        <div class="action-sheet-content">';
                cadena_modal+= '            <form>';
                cadena_modal+= '                <div class="form-group basic">';
                cadena_modal+= '                    <div class="input-wrapper">';
                cadena_modal+= '                        <label class="label" for="account1">From</label>';
                cadena_modal+= '                        <select class="form-control custom-select" id="account1">';
                cadena_modal+= '                            <option value="0">'+from+'</option>';
                cadena_modal+= '                        </select>';
                cadena_modal+= '                    </div>';
                cadena_modal+= '                </div>';
                cadena_modal+= '                <div class="form-group basic">';
                cadena_modal+= '                    <label class="label">To</label>';
                cadena_modal+= '                    <div class="input-group mb-2">';
                cadena_modal+= '                        <span class="input-group-text" id="basic-addona1"></span>';
                cadena_modal+= '                        <input type="text" class="form-control" placeholder="To" value="'+to+'">';
                cadena_modal+= '                    </div>';
                cadena_modal+= '                </div>';
                cadena_modal+= '                <div class="form-group basic">';
                cadena_modal+='                 <a class="btn btn-primary btn-block btn-lg" href="tel:'+element.numnber_mobile+'">llama</a>'
                cadena_modal+= '                </div>';
                cadena_modal+= '            </form>';
                cadena_modal+= '        </div>';
                cadena_modal+= '    </div>';
                cadena_modal+= '</div>';
                cadena_modal+= '</div>';
                cadena_modal+= '</div>';
                contenedor_modal.innerHTML = (contenedor_modal.innerHTML+cadena_modal);
            
        
            } // end for     
            // home footer
            let telefonos_interes = document.querySelector(".telefonos_interes");
            telefonos_interes.innerHTML = cadena_telefonos_interes;    
        }// end if

    });

}


let bloqueTelefonosLimpiadorasMenuLateral = (parametros) => {

    // lanzar llamadas personal
    let dominio = paginasObject.getDominio();
    let url = dominio;
    url = dominio;
    url+= "/AppController/getLimpiadoras";
    
    let cadena_telefonos_interes_menu_lateral = '<li class="title">Online</li>';
    let cadena_telefonos_interes = '';
    let cadena_modal = "";
    let contenedor_modal = document.querySelector("#contenedor_modal");    
    // hours
    let from = 0;
    let to = 0;

    loadUrlFetch(url)
    .then((response) => response.json())
    .then((data) => {
        // console.log("datos:"+data)
        if (data.status == "true"){
            for (let index = 0; index < data.datos.length; index++) {
                const element = data.datos[index];
                // menu_lateral
                cadena_telefonos_interes_menu_lateral+='<li>';
                cadena_telefonos_interes_menu_lateral+='<a href="#" data-toggle="modal" data-target="#'+element.text_title+'" data-bs-toggle="modal" data-bs-target="#'+element.text_title+'">';                
                if (element.dynamic_gallery_limpiadora_principal == null)
                    cadena_telefonos_interes_menu_lateral+='<img class="avatar" src="'+dominio+'/assets/themes/findhouse/images/limpiadora.jpg" alt="avatar">';
                else
                    cadena_telefonos_interes_menu_lateral+='<img class="avatar" src="'+dominio+'/'+element.image_1+'" alt="avatar">';
                
                cadena_telefonos_interes_menu_lateral+=element.text_title;
                cadena_telefonos_interes_menu_lateral+='</a>';
                cadena_telefonos_interes_menu_lateral+='</li>';    

                // modal
                cadena_modal = '<div class="modal fade action-sheet" id="'+element.text_title+'" tabindex="-1" role="dialog">';
                cadena_modal+= '<div class="modal-dialog" role="document">';
                cadena_modal+= '<div class="modal-content">';
                cadena_modal+= '    <div class="modal-header">';
                cadena_modal+= '        <h5 class="modal-title">Quieres Llamar a '+element.text_title+' ¿?</h5>';
                cadena_modal+= '    </div>';
                cadena_modal+= '    <div class="modal-body">';
                cadena_modal+= '        <div class="action-sheet-content">';
                cadena_modal+= '            <form>';
                cadena_modal+= '                <div class="form-group basic">';
                cadena_modal+= '                    <div class="input-wrapper">';
                cadena_modal+= '                        <label class="label" for="account1">From</label>';
                cadena_modal+= '                        <select class="form-control custom-select" id="account1">';
                cadena_modal+= '                            <option value="0">'+from+'</option>';
                cadena_modal+= '                        </select>';
                cadena_modal+= '                    </div>';
                cadena_modal+= '                </div>';
                cadena_modal+= '                <div class="form-group basic">';
                cadena_modal+= '                    <label class="label">To</label>';
                cadena_modal+= '                    <div class="input-group mb-2">';
                cadena_modal+= '                        <span class="input-group-text" id="basic-addona1"></span>';
                cadena_modal+= '                        <input type="text" class="form-control" placeholder="To" value="'+to+'">';
                cadena_modal+= '                    </div>';
                cadena_modal+= '                </div>';
                cadena_modal+= '                <div class="form-group basic">';
                cadena_modal+='                 <a class="btn btn-primary btn-block btn-lg" href="tel:'+element.numnber_mobile+'">llama</a>'
                cadena_modal+= '                </div>';
                cadena_modal+= '            </form>';
                cadena_modal+= '        </div>';
                cadena_modal+= '    </div>';
                cadena_modal+= '</div>';
                cadena_modal+= '</div>';
                cadena_modal+= '</div>';
                contenedor_modal.innerHTML = (contenedor_modal.innerHTML+cadena_modal);
            
        
            } // end for     
            
            //menu-lateral
            let menu_telefonos_lateral = document.querySelector(".menu-telefonos-lateral");    
            menu_telefonos_lateral.innerHTML = cadena_telefonos_interes_menu_lateral;
   
        }// end if

    });

}

// propiedades list
let lanzarPropiedades = (pagina, parametros) => {
    lanzar_propiedades(pagina,parametros);
}

// detalle propiedad
let lanzarDetallePropiedad = (parametros) => {
    lanzar_detalle_propiedad(parametros);
}

let lanzarGaleria = (parametros) => {
    lanzar_galeria(parametros);
}

let lanzarServicio = (parametros) => {
    lanzar_servicios(parametros);
}

let lanzarLocation = (parametros) => {
    lanzar_locations(parametros);
}


let ir_otra_pagina = (pagina) => {
    window.location = pagina; 
}


// insert user
const ValidateInsertUser = (name,email,password) => {
    let parametros = "?name="+name+"&email="+email+"&password="+password;
    let dominio = paginasObject.getDominio();
    dominio+= '/User/insertHttpUser'+parametros;
    loadUrlFetch(dominio)
        .then((response) => response.json())
        .then((data) => {
            //console.log(data)
            if (data.error == false){
                 /*
                 localStorage.setItem("user_email",email);
                 localStorage.setItem("user_username",name);
                 localStorage.setItem("user_password",data.password);
                 localStorage.setItem("error",data.error);
                 */
                // redirect page
                window.location.href = "home.html?username="+data.username+"&roles=4"+"&id="+data.id;
                // console.log(data);   
            }else{
                if (data.descripcion_error == "Email ya existe"){
                    let mensaje = document.querySelector(".email_no_existe");
                    mensaje.style.display = "block";
                }else{
                    let mensaje = document.querySelector(".password_incorrecto");
                    mensaje.style.display = "block";
                }   
            }
        });
    return false;    
}


// login
const ValidateFormLogin = (email,password) => {
    let respuesta = false;
    let parametros = "?email="+email+"&password="+password;
    // LeerUrl(email,password);
    let dominio = paginasObject.getDominio();
    dominio+= '/User/loginHttp'+parametros;

    loadUrlFetch(dominio)
        .then((response) => response.json())
        .then((data) => {
            //console.log(data)
            if (data.status == true){
                 // save user
                 localStorage.setItem("status",data.status);
                 localStorage.setItem("user_username",data.user_username);
                 localStorage.setItem("user_email",data.user_email);
                 localStorage.setItem("user_password",data.user_password);
                 localStorage.setItem("error",data.error);
                 /*
                 console.log("status: "+data.status);
                 console.log("error: "+data.error);
                 console.log("user_email: "+data.user_email);
                 console.log("user_password: "+data.user_password);
                 console.log("user_username: "+data.user_username);
                 console.log("user_grupo: "+data.user_grupo);
                 console.log("user_grupo: "+data.user_roles);
                 
                 
                 if (data.user_grupo == "limpiadora" || data.user_grupo == "gobernanta"){
                    // redirect page
                    window.location.href = "localizaciones.html?username="+data.user_username;
                 }else{
                     // redirect page
                    window.location.href = "home.html?username="+data.user_username;   
                 } // end if
                 */       

                 if (data.user_roles == 5 || data.user_roles == 6 ||data.user_roles == 7){
                    // redirect page
                    // alert("Bienvenido Limpiadora");
                    // alert("limpieza");
                    window.location.href = "home_limpieza.html?username="+data.user_username+"&roles="+data.user_roles+"&id="+data.id; 
                }else{
                    // redirect page
                    // alert("Bienvenido Usuario");
                    window.location.href = "home.html?username="+data.user_username+"&roles="+data.user_roles+"&id="+data.id;   
                }
            }else{
                 /*
                 console.log("status: "+data.status);
                 console.log("error: "+data.error);
                 console.log("user_email: "+data.user_email);
                 console.log("user_password: "+data.user_password);
                 */
                 if (data.error == "password no encontrado"){
                      let mensaje = document.querySelector(".password_incorrecto");
                      mensaje.style.display = "block";  
                 }else if (data.error == "email no encontrado"){
                    let mensaje = document.querySelector(".email_no_existe");
                    mensaje.style.display = "block";
                 }
            } // end if

        });
    
    return false;    
}



// home
let telefono_destacados = (parametros,pagina) => {
    let username = parametros["username"];
    let pagina_actual = pagina+".html";
    // LeerUrl(email,password);
    // cadena iconos teléfonos
    let cadena_telf = "";
    // cadena grande teléfonos
    let cadena_grande_telf = "";
    // contenedor final abierto o cerrado
    let contenedor_abierto = false;
    // cadena modal
    let cadena_modal = "";
    // contenedor
    let contenedor_div = document.querySelector("#contenedor_telefonos");
    // otro contenedor
    let contenedor_otro_div = document.querySelector("#contenedor_grande_telefonos");
    // contenedor modal
    let contenedor_modal = document.querySelector("#contenedor_modal");
    // hours
    let from = 0;
    let to = 0;
    let dominio = paginasObject.getDominio();
    dominio+= '/AppController/getTelefonosIntereresDestacados';
    loadUrlFetch(dominio)
        .then((response) => response.json())
        .then((data) => {
            //console.log(data);
            for (let index = 0; index < data.datos.length; index++) {
                const element = data.datos[index];
                if (index < 4){
                    cadena_telf = '<div class="item">';
                    cadena_telf+= '<a href="#" data-toggle="modal" data-target="#'+element.text_title+'" data-bs-toggle="modal" data-bs-target="#'+element.text_title+'">';
                    cadena_telf+= '<div class="icon-wrapper '+element.text_color+'">';
                    cadena_telf+= '<ion-icon name="'+element.text_icono+'"></ion-icon>';
                    cadena_telf+= '</div>';
                    cadena_telf+= '<strong>'+element.text_title+'</strong>';
                    cadena_telf+= '</a>';
                    cadena_telf+= '</div>';        
                    contenedor_div.innerHTML = (contenedor_div.innerHTML+cadena_telf);                
                    from = "0:00h";
                    to = "23:00h";
                }else{
                    // las otras
                    if (index % 2 == 0){
                        //console.log("par: "+index);
                        cadena_grande_telf = '<div class="row mt-2">';
                        cadena_grande_telf+= '<div class="col-6">';
                        cadena_grande_telf+= '<div class="stat-box">';
                        cadena_grande_telf+= '<div class="title">08:00h to 12:00h</div>';
                        cadena_grande_telf+= '<a href="#" data-toggle="modal" data-target="#'+element.text_title+'" data-bs-toggle="modal" data-bs-target="#'+element.text_title+'">';
                        cadena_grande_telf+= '<div class="value '+element.text_color+'">'+element.text_title+'</div>';
                        cadena_grande_telf+= '</a>';
                        cadena_grande_telf+= '</div>';
                        cadena_grande_telf+= '</div>';
                        contenedor_abierto = true;
                        from = "08:00h";
                        to = "20:00h";                     
                    }else{
                        //console.log("impar: "+index);
                        cadena_grande_telf+= '<div class="col-6">';
                        cadena_grande_telf+= '<div class="stat-box">';
                        cadena_grande_telf+= '<div class="title">08:00h to 12:00h</div>';
                        cadena_grande_telf+= '<a href="#" data-toggle="modal" data-target="#'+element.text_title+'" data-bs-toggle="modal" data-bs-target="#'+element.text_title+'">';
                        cadena_grande_telf+= '<div class="value '+element.text_color+'">'+element.text_title+'</div>';
                        cadena_grande_telf+= '</a>';
                        cadena_grande_telf+= '</div>';
                        cadena_grande_telf+= '</div>';
                        // cerramos el que estaba abierto
                        cadena_grande_telf+= '</div>';
                        contenedor_abierto = false;
                        contenedor_otro_div.innerHTML = (contenedor_otro_div.innerHTML+cadena_grande_telf);    
                        from = "08:00h";
                        to = "20:00h";
                    }
                } // end if
                // modal
                cadena_modal = '<div class="modal fade action-sheet" id="'+element.text_title+'" tabindex="-1" role="dialog">';
                cadena_modal+= '<div class="modal-dialog" role="document">';
                cadena_modal+= '<div class="modal-content">';
                cadena_modal+= '    <div class="modal-header">';
                cadena_modal+= '        <h5 class="modal-title">Quieres Llamar a '+element.text_title+' ¿?</h5>';
                cadena_modal+= '    </div>';
                cadena_modal+= '    <div class="modal-body">';
                cadena_modal+= '        <div class="action-sheet-content">';
                cadena_modal+= '            <form>';
                cadena_modal+= '                <div class="form-group basic">';
                cadena_modal+= '                    <div class="input-wrapper">';
                cadena_modal+= '                        <label class="label" for="account1">From</label>';
                cadena_modal+= '                        <select class="form-control custom-select" id="account1">';
                cadena_modal+= '                            <option value="0">'+from+'</option>';
                cadena_modal+= '                        </select>';
                cadena_modal+= '                    </div>';
                cadena_modal+= '                </div>';
                cadena_modal+= '                <div class="form-group basic">';
                cadena_modal+= '                    <label class="label">To</label>';
                cadena_modal+= '                    <div class="input-group mb-2">';
                cadena_modal+= '                        <span class="input-group-text" id="basic-addona1"></span>';
                cadena_modal+= '                        <input type="text" class="form-control" placeholder="To" value="'+to+'">';
                cadena_modal+= '                    </div>';
                cadena_modal+= '                </div>';
                cadena_modal+= '                <div class="form-group basic">';
                cadena_modal+='                 <a class="btn btn-primary btn-block btn-lg" href="tel:'+element.number_telf+'">llama</a>'
                cadena_modal+= '                </div>';
                cadena_modal+= '            </form>';
                cadena_modal+= '        </div>';
                cadena_modal+= '    </div>';
                cadena_modal+= '</div>';
                cadena_modal+= '</div>';
                cadena_modal+= '</div>';
                contenedor_modal.innerHTML = (contenedor_modal.innerHTML+cadena_modal);
            } // end for
            if (contenedor_abierto){
                cadena_grande_telf+= '</div>';
                contenedor_otro_div.innerHTML = (contenedor_otro_div.innerHTML+cadena_grande_telf);
                
            }
            
        });

        // enlace telefonos
        let enlace_telefonos = document.querySelector("#enlace_telefonos");
        if (enlace_telefonos)
            enlace_telefonos.setAttribute("onclick","ir_otra_pagina('telefonos.html?username="+username+"')");

        // enlace volver home
        let enlace_volver_home = document.querySelector("#volver_home");
        if (enlace_volver_home)
            enlace_volver_home.setAttribute("onclick","ir_otra_pagina('home.html?username="+username+"')");
        
        // formulario telefonos    
        let contenedor_formulario = '';
        
        // set username
        let contenedorFormularioUsername = document.querySelector("#username");
        if (contenedorFormularioUsername)
            contenedorFormularioUsername.value = username;


        // telefonos del usuario
        dominio = paginasObject.getDominio();
        dominio+= '/AppController/getTelefonosUsuario?username='+username;
        /*
        loadUrlFetch(dominio)
            .then((response) => response.json())
            .then((data) => {
                //console.log(data);
                if (data.datos.length > 0){
                    contenedor_modal = document.querySelector("#contenedor_modal");
                    let titulo_seccion = '';
                    titulo_seccion+= '<div class="section mt-4">'
                    titulo_seccion+= ' <div class="section-heading">';        
                    titulo_seccion+= '  <h2 class="title">Tus teléfonos</h2>';        
                    titulo_seccion+= ' </div>';
                    titulo_seccion+= '</div>';
                    
                    for (let index = 0; index < data.datos.length; index++) {
                        const element = data.datos[index];
                        if (index % 2 == 0 ){
                            titulo_seccion+= '<div class="row mt-2">';    
                        }
                        titulo_seccion+=  '<div class="col-6">';
                        titulo_seccion+=  '<div class="stat-box">';
                        titulo_seccion+=  '<div class="title">08:00h to 12:00h</div>';
                        titulo_seccion+=  '<a href="#" data-toggle="modal" data-target="#'+element.text_title+'" data-bs-toggle="modal" data-bs-target="#'+element.text_title+'">';
                        titulo_seccion+=  '  <div class="value '+element.text_color+'">'+element.text_title+'</div>';
                        titulo_seccion+=  '</a>';
                        titulo_seccion+=  '</div>';
                        titulo_seccion+=  '</div>';
                        if (index % 2 != 0 ){
                            titulo_seccion+= '</div>';    
                        }
                    
                    from = "08:00h";
                    to = "20:00h";    
                    cadena_modal = '<div class="modal fade action-sheet" id="'+element.text_title+'" tabindex="-1" role="dialog">';
                    cadena_modal+= '<div class="modal-dialog" role="document">';
                    cadena_modal+= '<div class="modal-content">';
                    cadena_modal+= '    <div class="modal-header">';
                    cadena_modal+= '        <h5 class="modal-title">Quieres Llamar a '+element.text_title+' ¿?</h5>';
                    cadena_modal+= '    </div>';
                    cadena_modal+= '    <div class="modal-body">';
                    cadena_modal+= '        <div class="action-sheet-content">';
                    cadena_modal+= '            <form>';
                    cadena_modal+= '                <div class="form-group basic">';
                    cadena_modal+= '                    <div class="input-wrapper">';
                    cadena_modal+= '                        <label class="label" for="account1">From</label>';
                    cadena_modal+= '                        <select class="form-control custom-select" id="account1">';
                    cadena_modal+= '                            <option value="0">'+from+'</option>';
                    cadena_modal+= '                        </select>';
                    cadena_modal+= '                    </div>';
                    cadena_modal+= '                </div>';
                    cadena_modal+= '                <div class="form-group basic">';
                    cadena_modal+= '                    <label class="label">To</label>';
                    cadena_modal+= '                    <div class="input-group mb-2">';
                    cadena_modal+= '                        <span class="input-group-text" id="basic-addona1"></span>';
                    cadena_modal+= '                        <input type="text" class="form-control" placeholder="To" value="'+to+'">';
                    cadena_modal+= '                    </div>';
                    cadena_modal+= '                </div>';
                    cadena_modal+= '                <div class="form-group basic">';
                    cadena_modal+='                 <a class="btn btn-primary btn-block btn-lg" href="tel:'+element.number_telf+'">llama</a>'
                    cadena_modal+= '                </div>';
                    cadena_modal+= '            </form>';
                    cadena_modal+= '        </div>';
                    cadena_modal+= '    </div>';
                    cadena_modal+= '</div>';
                    cadena_modal+= '</div>';
                    cadena_modal+= '</div>';
                    contenedor_modal.innerHTML = (contenedor_modal.innerHTML+cadena_modal);    
                    } // end for
    
                    let contenedorTelefonosUsername = document.querySelector("#contenedor_telefonos_usuario");
                    if (contenedorTelefonosUsername)
                        contenedorTelefonosUsername.innerHTML = titulo_seccion;

                } // end if
                
            })
            */    
    return false;
}



let validateInsertTelefono = (formulario) => {
   
    let respuesta = false;
    let parametros = "?telefono="+formulario.num_telefono.value+"&opcion_horario="+formulario.account1.value+"&username="+formulario.username.value;
    let dominio = paginasObject.getDominio();
    dominio+= '/AppController/setTelefono'+parametros;
    //console.log(dominio);
    loadUrlFetch(dominio)
        .then((response) => response.json())
        .then((data) => {
            //console.log(data)
            if (data.datos.response == "OK"){
                // redirect page
                window.location.href = formulario.action+"?username="+formulario.username.value;
            }// end if

        });
    
    return false;
}


let noticias = () => {
    let dominio = paginasObject.getDominio();
    dominio+= '/AppController/getNoticiasDesctacados';
    loadUrlFetch(dominio)
        .then((response) => response.json())
        .then((data) => {
            escribirNoticiasDestacadas(data);
        });
}


let escribirNoticiasDestacadas = (datos) => {
    let cadena_noticias = '';
    for (let index = 0; index < datos.datos.length; index++) {
        let element = datos.datos[index];
        cadena_noticias+='<div class="swiper-slide slide-noticias">';
        cadena_noticias+='    <div class="card rounded-0">';
        cadena_noticias+='        <div class="card-body">';
        cadena_noticias+='            <h5 class="card-title">'+element.text_title+'</h5>';
        cadena_noticias+='            <p class="card-text">'+element.textarea_description+'</p>';
        cadena_noticias+='        </div>';
        cadena_noticias+='    </div>';
        cadena_noticias+='</div>';
    }    
    let contenedor_noticias = document.querySelector(".wrapper-noticias");
    contenedor_noticias.innerHTML = contenedor_noticias.innerHTML + cadena_noticias;
}


let lanzar_discotecas = () => {
    let dominio = paginasObject.getDominio();
    dominio+= '/AppController/getBaresDiscotecasDesctacados';
    loadUrlFetch(dominio)
        .then((response) => response.json())
        .then((data) => {
            escribir_discotecas(data);
        });        
}


let escribir_discotecas = (datos) => {
    let dominio = paginasObject.getDominio();
    cadena_discotecas='';
    for (let index = 0; index < datos.datos.length; index++) {
        let element = datos.datos[index];
        cadena_discotecas+='<div class="swiper-slide slide-discotecas">';
        cadena_discotecas+='    <div class="card rounded-0 card-redondo">';
        cadena_discotecas+='        <div class="card-body">';
        cadena_discotecas+='            <h5 class="card-title">'+element.text_title+'</h5>';
        cadena_discotecas+='            <img src="'+dominio+'/'+element.image_1+'" class="card-img-top" alt="image1">';
        cadena_discotecas+='            <p class="card-text">'+element.textarea_description;
        cadena_discotecas+='            </p>';
        cadena_discotecas+='        </div>';
        cadena_discotecas+='    </div>';
        cadena_discotecas+='</div>';
    } // end for
    let contenedor_noticias = document.querySelector(".wrapper-discotecas");
    contenedor_noticias.innerHTML = contenedor_noticias.innerHTML + cadena_discotecas;

    lanzar_script();
}


let lanzar_monumentos = () => {
    let dominio = paginasObject.getDominio();
    dominio+= '/AppController/getMonumentosDestacados';
    loadUrlFetch(dominio)
        .then((response) => response.json())
        .then((data) => {
            escribir_monumentos(data);
        });
}


let escribir_monumentos = (datos) => {
    let dominio = paginasObject.getDominio();
    let cadena_monumentos = '';
    for (let index = 0; index < datos.datos.length; index++) {
        let element = datos.datos[index];
        cadena_monumentos+='<div class="swiper-slide slide-monumentos">';
        cadena_monumentos+='    <div class="card rounded-0 card-redondo">';
        cadena_monumentos+='        <div class="card-body">';
        cadena_monumentos+='            <h5 class="card-title">'+element.text_title+'</h5>';
        cadena_monumentos+='            <img src="'+dominio+'/'+element.image_1+'" class="card-img-top" alt="image1">';
        cadena_monumentos+='            <p class="card-text">'+element.textarea_description;
        cadena_monumentos+='            </p>';
        cadena_monumentos+='        </div>';
        cadena_monumentos+='    </div>';
        cadena_monumentos+='</div>';
    } // end for
    let contenedor_monumentos = document.querySelector(".wrapper-monumentos");
    contenedor_monumentos.innerHTML = contenedor_monumentos.innerHTML + cadena_monumentos;
}


let lanzar_restaurantes = () => {
    let dominio = paginasObject.getDominio();
    dominio+= '/AppController/getRestaurantesDestacados';
    loadUrlFetch(dominio)
        .then((response) => response.json())
        .then((data) => {
            escribir_restaurantes(data);
        });
}


let escribir_restaurantes = (datos) => {
    let dominio = paginasObject.getDominio();
    let cadena_restaurantes = '';
    for (let index = 0; index < datos.datos.length; index++) {
        let element = datos.datos[index];
        cadena_restaurantes+='<div class="swiper-slide slide-restaurantes">';
        cadena_restaurantes+='    <div class="card rounded-0 card-redondo">';
        cadena_restaurantes+='        <div class="card-body">';
        cadena_restaurantes+='            <h5 class="card-title">'+element.text_title+'</h5>';
        cadena_restaurantes+='            <img src="'+dominio+'/'+element.image_1+'" class="card-img-top" alt="image1">';
        cadena_restaurantes+='            <p class="card-text">'+element.textarea_description;
        cadena_restaurantes+='            </p>';
        cadena_restaurantes+='        </div>';
        cadena_restaurantes+='    </div>';
        cadena_restaurantes+='</div>';
    } // end for
    let contenedor_monumentos = document.querySelector(".wrapper-restaurantes");
    contenedor_monumentos.innerHTML = contenedor_monumentos.innerHTML + cadena_restaurantes;
}


// propiedades
let lanzar_propiedades = (pagina,parametros) => {
    
    let username = parametros["username"];
    let dominio = paginasObject.getDominio();
    dominio+= '/AppController/getAllProperties';
    
    /*
    window.setTimeout(function(){
        loader_on();
    },5000);
    */

    loadUrlFetch(dominio)
        .then((response) => response.json())
        .then((data) => {
            escribir_propiedades(data,pagina,username);
        });
}

let loader_on = () => {
    // laoder
    let loader = document.querySelector("#loader");
    loader.style.display = "flex";
}

let escribir_propiedades = (data,pagina,parametros) => {
    let username = parametros["username"];
    let dominio = paginasObject.getDominio();
    let nombre_pagina = "";
    
    //console.log(data);
    //console.log("datos: "+data.datos.length);
    //console.log("datos: "+data.datos[0]);

    switch(pagina){
        case "propiedades": nombre_pagina = "detalle.html";
        break;
        case "galeria":nombre_pagina = "galeria.html";
        break;
        case "servicios": nombre_pagina = "servicio.html";
        break;
        case "location": nombre_pagina = "location.html";
        break;
    } // end switch
    let cadena_propiedades = '';
    for (let index = 0; index < data.datos.length; index++) {
        let element = data.datos[index];
        //console.log(element);
        cadena_propiedades+= '<li>';
        cadena_propiedades+= '<a href="'+nombre_pagina+'?id='+element.id+'&id_avantio='+element.id_avantio+'&username='+username+'" class="item">';
        cadena_propiedades+= '<img src="'+dominio+'/'+element.uri_99x66+'" alt="image" class="image">';
        cadena_propiedades+= '<div class="in">';
        cadena_propiedades+= '<div>';
        cadena_propiedades+= '<header>'+element.text_title+'</header>';
        cadena_propiedades+= element.text_title;
        cadena_propiedades+= '<footer>'+element.text_title+'</footer>';
        cadena_propiedades+= '</div>';
        cadena_propiedades+= '</div>';
        cadena_propiedades+= '</a>';
        cadena_propiedades+= '</li>';
    } // end for
    let contenedor_propiedades = document.querySelector("#lista-propiedades");
    contenedor_propiedades.innerHTML = contenedor_propiedades.innerHTML + cadena_propiedades;

    lanzar_script();
}

let createOption = (value) => {
    let opt = document.createElement('option');
    opt.value = 1;
    opt.innerHTML = value;

    return opt;
}


let lanzar_detalle_propiedad = () => {
    // save parameters 
    let url = paginasObject.getInfoUrl() 
    let id_and_id_avantio = url.location_search.replace("?id=", "", url.location_search);
    let vector = id_and_id_avantio.split('&');   
    let id = vector[0];
    let id_avantio = vector[1].replace("id_avantio=","",vector[1]);    
    
    // 296754
    // console.log(url);
    // console.log(id);
    // console.log(id_avantio);

    // variables
    // select
    let dynamic_taxonomy = document.querySelector("#dynamic_taxonomy");
    let dynamic_geocountry = document.querySelector("#dynamic_geocountry");
    let dynamic_georegion = document.querySelector("#dynamic_georegion");
    let dynamic_geocity = document.querySelector("#dynamic_geocity");
    let dynamic_geolocality = document.querySelector("#dynamic_geolocality");
    let dynamic_geodistrict = document.querySelector("#dynamic_geodistrict");
      
    // read all inputs inputs
    let inputs = document.getElementsByTagName('input');
        
    let dominio = paginasObject.getDominio();
    dominio+= '/AppController/getAvantioProperty?id='+id+'&id_avantio='+id_avantio;

    // query detail property
    loadUrlFetch(dominio)
        .then((response) => response.json())
        .then((data) => {
            // selects
            dynamic_taxonomy.appendChild(createOption(data.datos[0].taxonomy));
            dynamic_geocountry.appendChild(createOption(data.datos[0].country));
            dynamic_georegion.appendChild(createOption(data.datos[0].region));
            dynamic_geocity.appendChild(createOption(data.datos[0].city));
            dynamic_geolocality.appendChild(createOption(data.datos[0].locality));
            dynamic_geodistrict.appendChild(createOption(data.datos[0].district));
            //console.log(data);
            for (index = 0; index < inputs.length; ++index) {
                /*
                console.log( "---------- elemento ------------\n");
                console.log("elemento: "+inputs[index]);
                console.log("id: "+inputs[index].getAttribute("id"));
                console.log("name: "+inputs[index].getAttribute("name"));
                */
                // tipos text and number
                let name = inputs[index].getAttribute("name");
                let id = inputs[index].getAttribute("name");
                // elemento json
                let elemento_json = data.datos[0][name];
                if (name.search("text_") != -1 || name.search("number_") != -1){
                    if (elemento_json){
                        inputs[index].value = elemento_json;
                    }
                    // deal with inputs[index] element.
                    console.log( "---------- fin elemento ------------\n");
                }else if (name.search("checkbox_") != -1){
                    inputs[index].checked = false;
                    if (elemento_json){
                        if (elemento_json == 1 )
                            inputs[index].checked = true;
                        else
                        inputs[index].checked = false;
                    }    
                } // end if
            }

        });
    

    // scripts
    lanzar_script();
}



let lanzar_galeria = () => {
    
    // save parameters 
    let url = paginasObject.getInfoUrl() 
    let id_and_id_avantio = url.location_search.replace("?id=", "", url.location_search);
    let vector = id_and_id_avantio.split('&');   
    let id = vector[0];
    let id_avantio = vector[1].replace("id_avantio=","",vector[1]);    

    let cadena_imagenes = '';
    let contenedor_imagenes = document.querySelector(".contenedor_imagenes");

    let dominio = paginasObject.getDominio();
    dominio+= '/AppController/getAvantioGalleryProperty?id='+id+'&id_avantio='+id_avantio;
    let domininio_url = paginasObject.getDominio();

    // query detail property
    loadUrlFetch(dominio)
        .then((response) => response.json())
        .then((data) => {
            for (let index = 0; index < data.datos.length; index++) {
                let element = data.datos[index];
                cadena_imagenes+= '<div class="col-lg-12">';
                cadena_imagenes+= '<div class="form-group"></div>';
                cadena_imagenes+= '<img class="thumbnail" loading="lazy" style="display:inline;max-width:100%;height:auto;" src="'+domininio_url+'/'+element.uri_900x600+'">';
                cadena_imagenes+= '</div>';
                cadena_imagenes+= '</div>';
            }// end for
            contenedor_imagenes.innerHTML = contenedor_imagenes.innerHTML + cadena_imagenes;
        });    

    // scripts
    lanzar_script();
}



let lanzar_servicios = () => {
    
    // save parameters 
    let url = paginasObject.getInfoUrl() 
    let id_and_id_avantio = url.location_search.replace("?id=", "", url.location_search);
    let vector = id_and_id_avantio.split('&');   
    let id = vector[0];
    let id_avantio = vector[1].replace("id_avantio=","",vector[1]); 

    let cadena_servicios = '';
    let contenedor_servicios = document.querySelector(".contenedor_servicios");

    let dominio = paginasObject.getDominio();
    dominio+= '/AppController/getServicesByAccommodation?id='+id+'&id_avantio='+id_avantio;

    // query detail property
    loadUrlFetch(dominio)
        .then((response) => response.json())
        .then((data) => {
            for (let index = 0; index < data.datos.length; index++) {
                let element = data.datos[index];
                //cadena_servicios+= '<div class="row">';
                cadena_servicios+= '<div class="col-md-12">';
                cadena_servicios+= '<div class="form-group">';
                cadena_servicios+= '<label for="">'+element.text_title+'</label>';
                //cadena_servicios+= '</div>';
                //cadena_servicios+= '<div class="form-group">';
                (element.checkbox_included == 1) ? cadena_servicios+= '<input style="margin-left:10px;:" disabled="disabled" type="checkbox" checked="true">' : cadena_servicios+= '<input style="margin-left:10px;:" disabled="disabled" type="checkbox" checked="false">' ; 
                //cadena_servicios+= '</div>';
                cadena_servicios+= '</div>';
                cadena_servicios+= '</div>';
            } // end for    
            contenedor_servicios.innerHTML = contenedor_servicios.innerHTML + cadena_servicios;            
        });     

    lanzar_script();    
}   


let lanzar_locations = () => {
    
    // save parameters 
    let url = paginasObject.getInfoUrl() 
    let id_and_id_avantio = url.location_search.replace("?id=", "", url.location_search);
    let vector = id_and_id_avantio.split('&');   
    let id = vector[0];
    let id_avantio = vector[1].replace("id_avantio=","",vector[1]); 

    let cadena_servicios = '';
    let contenedor_servicios = document.querySelector(".contenedor_locations");

    // read all inputs inputs
    let inputs = document.getElementsByTagName('input');

    let dominio = paginasObject.getDominio();
    dominio+= '/AppController/getLocations?id='+id+'&id_avantio='+id_avantio;

    // query detail property
    loadUrlFetch(dominio)
        .then((response) => response.json())
        .then((data) => {
                for (index = 0; index < inputs.length; ++index) {
                    
                    //console.log( "---------- elemento ------------\n");
                    //console.log("elemento: "+inputs[index]);
                    //console.log("id: "+inputs[index].getAttribute("id"));
                    //console.log("name: "+inputs[index].getAttribute("name"));
                    
                    // tipos text and number
                    let name = inputs[index].getAttribute("name");
                    let id = inputs[index].getAttribute("name");
                    // elemento json
                    let elemento_json = data.datos[0][name];
                    if (name.search("text_") != -1 || name.search("number_") != -1){
                        if (elemento_json){
                            inputs[index].value = "";
                            inputs[index].value = elemento_json;
                        }
                        // deal with inputs[index] element.
                        //console.log( "---------- fin elemento ------------\n");
                    }else if (name.search("checkbox_") != -1){
                        inputs[index].checked = false;
                        if (elemento_json){
                            if (elemento_json == 1 )
                                inputs[index].checked = true;
                            else
                            inputs[index].checked = false;
                        }    
                    } // end if
                } // end for    
                //contenedor_servicios.innerHTML = contenedor_servicios.innerHTML + cadena_servicios;            
        });
        
        lanzar_script();
}   


let lanzarTelefonos = (parametros,pagina) => {
    let username = parametros["username"]; 
    // agregamos los destacados
    telefono_destacados(username,pagina);

    // LeerUrl(email,password);
    // cadena iconos teléfonos
    let cadena_telf = "";
    // cadena grande teléfonos
    let cadena_grande_telf = "";
    // contenedor final abierto o cerrado
    let contenedor_abierto = false;
    // cadena modal
    let cadena_modal = "";
    // contenedor
    let contenedor_div = document.querySelector("#contenedor_telefonos_urgentes");
    // otro contenedor
    let contenedor_otro_div = document.querySelector("#contenedor_telefonos_no_urgentes");
    // contenedor modal
    let contenedor_modal = document.querySelector("#contenedor_modal");
    // hours
    let from = 0;
    let to = 0;
    let dominio = paginasObject.getDominio();
    dominio+= '/AppController/getTelefonosIntereres';
    loadUrlFetch(dominio)
        .then((response) => response.json())
        .then((data) => {
            for (let index = 0; index < data.datos.length; index++) {
                    let element = data.datos[index];
                    //console.log("servicio urgente: "+element.checkbox_servicio_urgente);
                    cadena_telf = '<div class="accordion-item">';
                    cadena_telf+= '<h2 class="accordion-header">';
                    cadena_telf+= '    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"'; 
                    cadena_telf+= '    data-bs-target="#accordion00'+(index+1)+'">';
                    cadena_telf+= '        <ion-icon class="mi-icono" name="'+element.text_icono+'"></ion-icon>';
                    cadena_telf+= '        <p>'+element.text_title+'</p>';
                    cadena_telf+= '    </button>';
                    cadena_telf+= '</h2>';
                    if (element.checkbox_servicio_urgente == 1){
                        cadena_telf+= '<div id="accordion00'+(index+1)+'" class="accordion-collapse collapse" data-bs-parent="#accordionExample2">';
                    }else{
                        cadena_telf+= '<div id="accordion00'+(index+1)+'" class="accordion-collapse collapse" data-bs-parent="#accordionExample3">';
                    }        
                    cadena_telf+= '    <div class="accordion-body">';
                    cadena_telf+= '        <hr>';
                    cadena_telf+= '        '+element.textarea_description; 
                    cadena_telf+= '        <div class="text-center">';
                    cadena_telf+='              <a class="btn btn-primary me-1 mb-1" href="tel:'+element.number_telf+'">LLAMA</a>';
                    //cadena_telf+= '            <button type="button" class="btn btn-primary me-1 mb-1">LLAMAR</button>';
                    cadena_telf+= '         </div>';
                    cadena_telf+= '     </div>';
                    cadena_telf+= '</div>';  
                    cadena_telf+= '</div>';
                if (element.checkbox_servicio_urgente == 1){
                    contenedor_div.innerHTML = (contenedor_div.innerHTML+cadena_telf);
                }else{
                    contenedor_otro_div.innerHTML = (contenedor_otro_div.innerHTML+cadena_telf);    
                } // end if
                // modal
                cadena_modal = '<div class="modal fade action-sheet" id="'+element.text_title+'" tabindex="-1" role="dialog">';
                cadena_modal+= '<div class="modal-dialog" role="document">';
                cadena_modal+= '<div class="modal-content">';
                cadena_modal+= '    <div class="modal-header">';
                cadena_modal+= '        <h5 class="modal-title">Quieres Llamar a '+element.text_title+' ¿?</h5>';
                cadena_modal+= '    </div>';
                cadena_modal+= '    <div class="modal-body">';
                cadena_modal+= '        <div class="action-sheet-content">';
                cadena_modal+= '            <form>';
                cadena_modal+= '                <div class="form-group basic">';
                cadena_modal+= '                    <div class="input-wrapper">';
                cadena_modal+= '                        <label class="label" for="account1">From</label>';
                cadena_modal+= '                        <select class="form-control custom-select" id="account1">';
                cadena_modal+= '                            <option value="0">'+from+'</option>';
                cadena_modal+= '                        </select>';
                cadena_modal+= '                    </div>';
                cadena_modal+= '                </div>';
                cadena_modal+= '                <div class="form-group basic">';
                cadena_modal+= '                    <label class="label">To</label>';
                cadena_modal+= '                    <div class="input-group mb-2">';
                cadena_modal+= '                        <span class="input-group-text" id="basic-addona1"></span>';
                cadena_modal+= '                        <input type="text" class="form-control" placeholder="To" value="'+to+'">';
                cadena_modal+= '                    </div>';
                cadena_modal+= '                </div>';
                cadena_modal+= '                <div class="form-group basic">';
                cadena_modal+='              <a class="btn btn-primary btn-block btn-lg" href="tel:'+element.number_telf+'">LLAMA</a>'
                cadena_modal+= '                </div>';
                cadena_modal+= '            </form>';
                cadena_modal+= '        </div>';
                cadena_modal+= '    </div>';
                cadena_modal+= '</div>';
                cadena_modal+= '</div>';
                cadena_modal+= '</div>';
                contenedor_modal.innerHTML = (contenedor_modal.innerHTML+cadena_modal);    
            } // end for    
            lanzar_script();
        });

        // formulario telefonos    
        /*
        let contenedor_formulario = '';
        contenedor_formulario+='<form action="telefonos.html" name="formulario-insertar-telefono" id="formulario-insertar-telefono" onsubmit="return validateInsertTelefono(this.num_telefono.value,this.account1.value,username)" method="POST">';
        contenedor_formulario+='    <div class="form-group basic">';
        contenedor_formulario+='        <div class="input-wrapper">';
        contenedor_formulario+='            <label class="label" for="account1">From</label>';
        contenedor_formulario+='            <select class="form-control custom-select" name="account1" id="account1">';
        contenedor_formulario+='                <option value="0">From 08:00h to 20:00h</option>';
        contenedor_formulario+='                <option value="1">From 00:00h to 23:00h</option>';
        contenedor_formulario+='            </select>';
        contenedor_formulario+='        </div>';
        contenedor_formulario+='    </div>';
        contenedor_formulario+='    <div class="form-group basic">';
        contenedor_formulario+='        <label class="label">Enter Amount</label>';
        contenedor_formulario+='        <div class="input-group mb-2">';
        contenedor_formulario+='            <span class="input-group-text" id="basic-addona1">Telf:</span>';
        contenedor_formulario+='            <input type="text" name="num_telefono" id="num_telefono" class="form-control" placeholder="Introduce tu número" value="">';
        contenedor_formulario+='        </div>';
        contenedor_formulario+='    </div>';
        contenedor_formulario+='    <div class="form-group basic">';
        contenedor_formulario+='        <button type="button" class="btn btn-primary btn-block btn-lg" data-bs-dismiss="modal">Guardar</button>';
        contenedor_formulario+='    </div>';
        contenedor_formulario+='</form>';
         
        let contenedorFormularioTelefonos = document.querySelector(".contenedorFormularioTelefonos");
        contenedorFormularioTelefonos.innerHTML= contenedor_formulario;
        */

    return true;
    
}

let lanzarSeccionesAvantio = (parametros) => {
    let username = parametros["username"] 
    let cadena_home = '';
        
        cadena_home+= '<div class="section mt-4">';
        cadena_home+= '    <div class="section-heading">';
        cadena_home+= '        <h2 class="title">Propiedad</h2>';
        cadena_home+= '        <a href="#" onclick="ir_otra_pagina(\'home.html?username='+username+'\')" class="link">Volver</a>';
        cadena_home+= '    </div>';
        cadena_home+= '    <div class="transactions">';
        cadena_home+= '        <a href="#" onclick="ir_otra_pagina(\'propiedades.html?pagina=propiedades&username='+username+'\')" class="item">';
        cadena_home+= '            <div class="detail">';
        cadena_home+= '                <img src="img/propiedades/1.jpg" alt="img" class="image-block imaged w48">';
        cadena_home+= '                <div>';
        cadena_home+= '                    <strong>Descripción general</strong>';
        cadena_home+= '                    <p>Características | Ubicación | Amenities</p>';
        cadena_home+= '                </div>';
        cadena_home+= '            </div>';
        cadena_home+= '            <div class="right">';
        cadena_home+= '                <div class="price"> Ver</div>';
        cadena_home+= '            </div>';
        cadena_home+= '        </a>';
        cadena_home+= '        <a href="#" onclick="ir_otra_pagina(\'propiedades.html?pagina=galeria&username='+username+'\')" class="item">';
        cadena_home+= '            <div class="detail">';
        cadena_home+= '                <img src="img/propiedades/2.jpg" alt="img" class="image-block imaged w48">';
        cadena_home+= '                <div>';
        cadena_home+= '                    <strong>Fotos</strong>';
        cadena_home+= '                    <p>Galería de fotos de la villa</p>';
        cadena_home+= '                </div>';
        cadena_home+= '            </div>';
        cadena_home+= '            <div class="right">';
        cadena_home+= '                <div class="price"> Ver</div>';
        cadena_home+= '            </div>';
        cadena_home+= '        </a>';
        cadena_home+= '        <a href="#" onclick="ir_otra_pagina(\'propiedades.html?pagina=servicios&username='+username+'\')" class="item">';
        cadena_home+= '            <div class="detail">';
        cadena_home+= '                <img src="img/propiedades/3.jpg" alt="img" class="image-block imaged w48">';
        cadena_home+= '                <div>';
        cadena_home+= '                    <strong>Servicios</strong>';
        cadena_home+= '                    <p>Servicios de la villa</p>';
        cadena_home+= '                </div>';
        cadena_home+= '            </div>';
        cadena_home+= '            <div class="right">';
        cadena_home+= '                <div class="price"> Ver</div>';
        cadena_home+= '            </div>';
        cadena_home+= '        </a>';
        cadena_home+= '        <a href="#" onclick="ir_otra_pagina(\'propiedades.html?pagina=location&username='+username+'\')" class="item">';
        cadena_home+= '            <div class="detail">';
        cadena_home+= '                <img src="img/propiedades/4.jpg" alt="img" class="image-block imaged w48">';
        cadena_home+= '                <div>';
        cadena_home+= '                    <strong>Lugares cercanos</strong>';
        cadena_home+= '                    <p>Lugares cercanos de la villa</p>';
        cadena_home+= '                </div>';
        cadena_home+= '            </div>';
        cadena_home+= '            <div class="right">';
        cadena_home+= '                <div class="price"> Ver</div>';
        cadena_home+= '            </div>';
        cadena_home+= '        </a>';
        cadena_home+= '    </div>';
        cadena_home+= '</div>';
        
        let contenedorHome = document.querySelector(".contenedorHome");
        contenedorHome.innerHTML = cadena_home; 

    lanzar_script();
} 



let lanzarMonumentos = (parametros) => {
    let username = parametros["username"];
    let dominio = paginasObject.getDominio();
    dominio+= '/AppController/getMonumentos';
    loadUrlFetch(dominio)
        .then((response) => response.json())
        .then((data) => {
            escribirMonumentos(data,username);
        });
}


let escribirMonumentos = (datos,parametros) => {
    let username = parametros["username"];
    let dominio = paginasObject.getDominio();
    let cadena_monumentos = '';
    let contenedor_monumentos = document.querySelector(".contenedor_monumentos"); 
    for (let index = 0; index < datos.datos.length; index++) {
        let element = datos.datos[index];
        cadena_monumentos='<div class="section mt-2">';
        cadena_monumentos+='    <div class="card card-redondo">';
        cadena_monumentos+='        <img src="'+dominio+'/'+element.image_1+'" class="card-img-top" alt="image">';
        cadena_monumentos+='        <div class="card-body">';
        cadena_monumentos+='            <h5 class="card-title">'+element.text_title+'</h5>';
        cadena_monumentos+='            <h6 class="card-subtitle mb-1">'+element.text_title+'</h6>';
        cadena_monumentos+='            <p class="card-text">'+element.textarea_description+'</p>';
        cadena_monumentos+='        </div>';
        cadena_monumentos+='    </div>';
        cadena_monumentos+='</div>';
        cadena_monumentos+='<br>';
        contenedor_monumentos.innerHTML = contenedor_monumentos.innerHTML + cadena_monumentos;
    } // end for
    
    let list_monumentos = document.querySelector("#list_monumentos");
    list_monumentos.setAttribute("onclick","ir_otra_pagina('home.html?username="+username+"')");
    
    lanzar_script();
}


let lanzarNoticias = (parametros) => {
    let username = parametros["username"];
    let dominio = paginasObject.getDominio();
    dominio+= '/AppController/getNoticias';
    loadUrlFetch(dominio)
        .then((response) => response.json())
        .then((data) => {
            escribirNoticias(data,username);
        });
}


let escribirNoticias = (datos,parametros) => {
    let username = parametros["username"];
    let cadena_noticias = '';
    for (let index = 0; index < datos.datos.length; index++) {
        let element = datos.datos[index];
        cadena_noticias+='<div class="card">';
        cadena_noticias+='    <div class="card-header">'+element.text_title+'</div>';
        cadena_noticias+='    <div class="card-body">';        
        cadena_noticias+='        <blockquote class="blockquote mb-0">';
        cadena_noticias+='            <p>'+element.textarea_description+'</p>';
        cadena_noticias+='            <footer class="blockquote-footer">'+element.text_title+'</cite></footer>';
        cadena_noticias+='        </blockquote>';
        cadena_noticias+='    </div>';
        cadena_noticias+='</div>';
        cadena_noticias+='<br>';
    }    
    
    let contenedor_noticias = document.querySelector(".contenedor_noticias");
    contenedor_noticias.innerHTML = contenedor_noticias.innerHTML + cadena_noticias;
    
    let link_noticias = document.querySelector("#link_volver_noticias");
    
    if (link_noticias)
        link_noticias.setAttribute("onclick","ir_otra_pagina('home.html?username="+username+"')");

    // scripts
    lanzar_script();
}


let lanzarBaresDiscotecas = (parametros) => {
    let username = parametros["username"];
    let dominio = paginasObject.getDominio();
    dominio+= '/AppController/getBaresDiscotecas';
    loadUrlFetch(dominio)
        .then((response) => response.json())
        .then((data) => {
            escribirBaresDiscotecas(data,username);
        });
}


let escribirBaresDiscotecas = (datos,parametros) => {
    let username = parametros["username"];
    let dominio = paginasObject.getDominio();
    let cadena_bares_discotecas = '';
    let contenedor_bares_discotecas = document.querySelector(".contenedor_bares_discotecas"); 
    for (let index = 0; index < datos.datos.length; index++) {
        let element = datos.datos[index];
        cadena_bares_discotecas='<div class="section mt-2">';
        cadena_bares_discotecas+='    <div class="card">';
        cadena_bares_discotecas+='        <img src="'+dominio+'/'+element.image_1+'" class="card-img-top" alt="image">';
        cadena_bares_discotecas+='        <div class="card-body">';
        cadena_bares_discotecas+='            <h5 class="card-title">'+element.text_title+'</h5>';
        cadena_bares_discotecas+='            <h6 class="card-subtitle mb-1">'+element.text_title+'</h6>';
        cadena_bares_discotecas+='            <p class="card-text">'+element.textarea_description+'</p>';
        cadena_bares_discotecas+='        </div>';
        cadena_bares_discotecas+='    </div>';
        cadena_bares_discotecas+='</div>';
        cadena_bares_discotecas+='<br>';
        contenedor_bares_discotecas.innerHTML = contenedor_bares_discotecas.innerHTML + cadena_bares_discotecas;
    } // end for
    
    let link_volver_home = document.querySelector("#link_volver_home");
    
    if (link_volver_home)
        link_volver_home.setAttribute("onclick","ir_otra_pagina('home.html?username="+username+"')");
    
    lanzar_script();
}


let lanzarRestaurantes = (parametros) => {
    let username = parametros["username"];
    let dominio = paginasObject.getDominio();
    dominio+= '/AppController/getRestaurantes';
    loadUrlFetch(dominio)
        .then((response) => response.json())
        .then((data) => {
            escribirRestaurantes(data,username);
        });
}

let escribirRestaurantes = (datos,parametros) => {
    let username = parametros["username"];
    let dominio = paginasObject.getDominio();
    let cadena_bares_discotecas = '';
    let contenedor_bares_discotecas = document.querySelector(".contenedor_restaurantes"); 
    for (let index = 0; index < datos.datos.length; index++) {
        let element = datos.datos[index];
        cadena_bares_discotecas='<div class="section mt-2">';
        cadena_bares_discotecas+='    <div class="card">';
        cadena_bares_discotecas+='        <img src="'+dominio+'/'+element.image_1+'" class="card-img-top" alt="image">';
        cadena_bares_discotecas+='        <div class="card-body">';
        cadena_bares_discotecas+='            <h5 class="card-title">'+element.text_title+'</h5>';
        cadena_bares_discotecas+='            <h6 class="card-subtitle mb-1">'+element.text_title+'</h6>';
        cadena_bares_discotecas+='            <p class="card-text">'+element.textarea_description+'</p>';
        cadena_bares_discotecas+='        </div>';
        cadena_bares_discotecas+='    </div>';
        cadena_bares_discotecas+='</div>';
        cadena_bares_discotecas+='<br>';
        contenedor_bares_discotecas.innerHTML = contenedor_bares_discotecas.innerHTML + cadena_bares_discotecas;
    } // end for
    
    let link_volver_home = document.querySelector("#link_volver_home");
    
    if (link_volver_home)
        link_volver_home.setAttribute("onclick","ir_otra_pagina('home.html?username="+username+"')");

    lanzar_script();
}

let lanzarSoporte = (parametros) => {
    let username = parametros["username"];
    let dominio = paginasObject.getDominio();
    dominio+= '/AppController/getSoporte';
    loadUrlFetch(dominio)
        .then((response) => response.json())
        .then((data) => {
            escribirSoporte(data,username);
        });        
    lanzar_script();
}



let escribirSoporte = (data,parametros) => {
    
    let username = parametros["username"];

    // divs
    let bloque_uno = document.querySelector("#bloque_uno");
    let bloque_dos = document.querySelector("#bloque_dos");
    
    // content
    let bloque_uno_div = '<h2 class="card-title">'+data.datos[0].text_title+'<hr></h2>';
    bloque_uno_div+= data.datos[0].textarea_description;
    bloque_uno.innerHTML = bloque_uno_div;
    
    let bloque_dos_div = '<h2 class="card-title">'+data.datos[0].text_subtitle+'</h2>';
    bloque_dos_div+= '<p>'+data.datos[0].textarea_description_inferior+'</p>';
    bloque_dos.innerHTML = bloque_dos_div;

    // escribir formulario
    let formulario = '';
    formulario+='<form name="formularioContactar" id="formularioContactar" onsubmit="return enviarFormularioContactar(this);" action="soporte.html?username='+username+'" method="POST">';
    formulario+='    <div class="form-group basic animated">';
    formulario+='        <div class="input-wrapper">';
    formulario+='            <label class="label" for="name2">nombre</label>';
    formulario+='            <input type="text" class="form-control" id="name2" name="name2" placeholder="Nombre">';
    formulario+='            <input type="hidden" id="username" name="username" value="'+username+'">';
    formulario+='            <i class="clear-input">';
    formulario+='                <ion-icon name="close-circle"></ion-icon>';
    formulario+='            </i>';
    formulario+='            <p class="error_texto">Debes rellenar el campo</p>';
    formulario+='        </div>';
    formulario+='    </div>';
    formulario+='    <div class="form-group basic animated">';
    formulario+='        <div class="input-wrapper">';
    formulario+='            <label class="label" for="email2">E-mail</label>';
    formulario+='            <input type="text" class="form-control" id="email2" placeholder="E-mail">';
    formulario+='            <i class="clear-input">';
    formulario+='                <ion-icon name="close-circle"></ion-icon>';
    formulario+='            </i>';
    formulario+='            <p class="error_texto">Debes rellenar el campo</p>';
    formulario+='        </div>';
    formulario+='    </div>';
    formulario+='    <div class="form-group basic animated">';
    formulario+='        <div class="input-wrapper">';
    formulario+='            <label class="label" for="textarea2">Mensaje</label>';
    formulario+='            <textarea id="textarea2" rows="4" class="form-control"';
    formulario+='                placeholder="Mensaje"></textarea>';
    formulario+='            <i class="clear-input">';
    formulario+='                <ion-icon name="close-circle"></ion-icon>';
    formulario+='            </i>';
    formulario+='            <p class="error_texto">Debes rellenar el campo</p>';
    formulario+='        </div>';
    formulario+='    </div>';
    formulario+='    <div class="mt-2">';
    formulario+='        <input type="submit" class="btn btn-primary btn-lg btn-block" value="Enviar">';
    formulario+='    </div>';
    formulario+='</form>';
    
    let contenedorFormulario = document.querySelector(".contenedorFormulario");
    contenedorFormulario.innerHTML = formulario;

    // escribir respuestas de usuario
    // telefonos del usuario
    
    dominio = paginasObject.getDominio();
    dominio+= '/AppController/getConsultas?username='+username;
    loadUrlFetch(dominio)
        .then((response) => response.json())
        .then((data) => {
            if (data.datos.length > 0 ){
                let cadena_respuestas ='';
                for (let index = 0; index < data.datos.length; index++) {
                    const element = data.datos[index];
                    cadena_respuestas+= '<div class="card">';
                    cadena_respuestas+= '   <div class="card-body">';
                    cadena_respuestas+= '       <h2 class="card-title">'+element.textarea_form_message+'</h2>';
                    cadena_respuestas+= '       <p>'+element.textarea_form_respuesta+'</p>';
                    cadena_respuestas+= '   </div>';
                    cadena_respuestas+= '</div>';
                    cadena_respuestas+= '<br>';
                }
                let contenedorConsultasAnteriores = document.querySelector(".contenedorConsultasAnteriores");
                contenedorConsultasAnteriores.innerHTML = cadena_respuestas;    
            }
        });
            
}   



let lanzarLogin = () => {
    // empty
}


let lanzarRegistro = () => {
    //parametros
    //let username = parametros["username"];
    let contenedorFormulario = '';
    contenedorFormulario+='<form action="home.html" name="formulario-insertar-usuario" id="formulario-insertar-usuario" onsubmit="return ValidateInsertUser(this.name.value,this.email.value,this.password.value)" method="POST">';
    contenedorFormulario+='    <input class="form-control" type="text" id="name" name="name" placeholder="Nombre" required>';
    contenedorFormulario+='    <input class="form-control" type="email" id="email" name="email" placeholder="E-mail Address" required>';
    contenedorFormulario+='    <input class="form-control" type="password" id="password" name="password" placeholder="Password" required>';
    contenedorFormulario+='    <div class="form-button">';
    contenedorFormulario+='        <button id="submit" type="submit" class="ibtn">Login</button>';
    contenedorFormulario+='        <a href="portvil-forget.html">Olvidaste el password?</a>';
    contenedorFormulario+='    </div>';
    contenedorFormulario+='    <div class="form-button">';
    contenedorFormulario+='        <p class="password_incorrecto">Ha habido un error</p>';
    contenedorFormulario+='        <p class="email_no_existe">Email ya existe</p>';
    contenedorFormulario+='    </div>';
    contenedorFormulario+='</form>';

    let divContenedorFormulario = document.querySelector(".contenedorFormulario");
    divContenedorFormulario.innerHTML = contenedorFormulario;
}



let lanzarNotificaciones = () => {
    let dominio = paginasObject.getDominio();
    dominio+= '/AppController/getNotificaciones';
    loadUrlFetch(dominio)
        .then((response) => response.json())
        .then((data) => {
            escribirNotificaciones(data);
        });
}   


let escribirNotificaciones = (datos) => {
    
    let dominio = paginasObject.getDominio();
   
    // total notificaciones
    document.querySelector(".appHeader .right .badge-danger").innerHTML = datos.datos.length;

    let cadenanotificaciones = '';
    let contenedor_notificaciones = document.querySelector(".notificaciones"); 
    cadena_notificaciones = '<ul class="listview image-listview flush">';
    let fecha = new Date();

    // detalle-notificacion.html?mensaje=1
    for (let index = 0; index < datos.datos.length; index++) {
        let element = datos.datos[index];
        cadena_notificaciones+=' <li>';
        cadena_notificaciones+='     <a href="#" class="item">';
        cadena_notificaciones+='         <div class="icon-box bg-warning">';
        cadena_notificaciones+='             <ion-icon name="chatbubble-outline"></ion-icon>';
        cadena_notificaciones+='         </div>';
        cadena_notificaciones+='         <div class="in">';
        cadena_notificaciones+='             <div>';
        cadena_notificaciones+='                 <div class="mb-05"><strong>'+element.text_title+'</strong></div>';
        cadena_notificaciones+='                 <div class="text-small mb-05">'+element.textarea_description+'</div>';
        cadena_notificaciones+='                 <div class="text-xsmall">'+fecha+'</div>';
        cadena_notificaciones+='             </div>';
        cadena_notificaciones+='         </div>';
        cadena_notificaciones+='     </a>';
        cadena_notificaciones+=' </li>';    
    } // end for    

    cadena_notificaciones+= '</ul>';
    if (contenedor_notificaciones)
        contenedor_notificaciones.innerHTML = contenedor_notificaciones.innerHTML + cadena_notificaciones;

    lanzar_script();
}



let lanzarDetalleNotificacion = () => {

        let cadena_notificacion = '';
        let contenedor_detalle_notificacion = document.querySelector(".contenedor_detalle_notificacion");

        cadena_notificacion+='<div class="section mt-3 mb-3">';
        cadena_notificacion+='    <div class="card">';
        cadena_notificacion+='        <div class="card-body">';
        cadena_notificacion+='            <h2 class="card-title">About us</h2>';
        cadena_notificacion+='            Finapp is Bootstrap 5 based template for your wallet, banking, financial mobile projects.';
        cadena_notificacion+='        </div>';
        cadena_notificacion+='    </div>';
        cadena_notificacion+='</div>';

        contenedor_detalle_notificacion.innerHTML = contenedor_detalle_notificacion.innerHTML + cadena_notificacion;
    
        lanzar_script();
}    


let lanzarPreferencias = () => {
    let dominio = paginasObject.getDominio();
    dominio+= '/AppController/getPreferencias';
    loadUrlFetch(dominio)
        .then((response) => response.json())
        .then((data) => {
            escribirPreferencias(data);
        });    
    
}


let escribirPreferencias = (datos) => {
    for (let index = 0; index < datos.datos.length; index++) {
        let activar_notificaciones = datos.datos[index].checkbox_activar_notificaciones;
        ocultarMostrarIconoNotificaciones(activar_notificaciones);        
        
    }
    lanzar_script();
}


let ocultarMostrarIconoNotificaciones = (activar_notificaciones) => {
    if (activar_notificaciones == 1){
        document.querySelector(".appHeader .right").style.display = "block";    
        lanzarNotificaciones();
    }else{
        document.querySelector(".appHeader .right").style.display = "none";
    }
}




//  templates
// home | propiedad
let crearHome = (parametros) => {
        let username = parametros["username"];
        let cadena_home = '';
        cadena_home+= '<div class="section mt-4">';
        cadena_home+= '    <div class="section-heading">';
        cadena_home+= '        <h2 class="title">Propiedad</h2>';
        cadena_home+= '        <a href="#" onclick="ir_otra_pagina(\'secciones_avantio.html?username='+username+'\')" class="link">Ver Todos</a>';
        cadena_home+= '    </div>';
        cadena_home+= '    <div class="transactions">';
        cadena_home+= '        <a href="#" onclick="ir_otra_pagina(\'propiedades.html?pagina=propiedades&username='+username+'\')" class="item">';
        cadena_home+= '            <div class="detail">';
        cadena_home+= '                <img src="img/propiedades/1.jpg" alt="img" class="image-block imaged w48">';
        cadena_home+= '                <div>';
        cadena_home+= '                    <strong>Descripción general</strong>';
        cadena_home+= '                    <p>Características | Ubicación | Amenities</p>';
        cadena_home+= '                </div>';
        cadena_home+= '            </div>';
        cadena_home+= '            <div class="right">';
        cadena_home+= '                <div class="price"> Ver</div>';
        cadena_home+= '            </div>';
        cadena_home+= '        </a>';
        cadena_home+= '        <a href="#" onclick="ir_otra_pagina(\'propiedades.html?pagina=galeria&username='+username+'\')" class="item">';
        cadena_home+= '            <div class="detail">';
        cadena_home+= '                <img src="img/propiedades/2.jpg" alt="img" class="image-block imaged w48">';
        cadena_home+= '                <div>';
        cadena_home+= '                    <strong>Fotos</strong>';
        cadena_home+= '                    <p>Galería de fotos de la villa</p>';
        cadena_home+= '                </div>';
        cadena_home+= '            </div>';
        cadena_home+= '            <div class="right">';
        cadena_home+= '                <div class="price"> Ver</div>';
        cadena_home+= '            </div>';
        cadena_home+= '        </a>';
        cadena_home+= '        <a href="#" onclick="ir_otra_pagina(\'propiedades.html?pagina=servicios&username='+username+'\')" class="item">';
        cadena_home+= '            <div class="detail">';
        cadena_home+= '                <img src="img/propiedades/3.jpg" alt="img" class="image-block imaged w48">';
        cadena_home+= '                <div>';
        cadena_home+= '                    <strong>Servicios</strong>';
        cadena_home+= '                    <p>Servicios de la villa</p>';
        cadena_home+= '                </div>';
        cadena_home+= '            </div>';
        cadena_home+= '            <div class="right">';
        cadena_home+= '                <div class="price"> Ver</div>';
        cadena_home+= '            </div>';
        cadena_home+= '        </a>';
        cadena_home+= '        <a href="#" onclick="ir_otra_pagina(\'propiedades.html?pagina=location&username='+username+'\')" class="item">';
        cadena_home+= '            <div class="detail">';
        cadena_home+= '                <img src="img/propiedades/4.jpg" alt="img" class="image-block imaged w48">';
        cadena_home+= '                <div>';
        cadena_home+= '                    <strong>Lugares cercanos</strong>';
        cadena_home+= '                    <p>Lugares cercanos de la villa</p>';
        cadena_home+= '                </div>';
        cadena_home+= '            </div>';
        cadena_home+= '            <div class="right">';
        cadena_home+= '                <div class="price"> Ver</div>';
        cadena_home+= '            </div>';
        cadena_home+= '        </a>';
        cadena_home+= '    </div>';
        cadena_home+= '</div>';
        
        let contenedorHome = document.querySelector(".contenedorHome");
        contenedorHome.innerHTML = cadena_home; 

}


// secciones home
let crearSeccionesHome = (parametros) => {
    let username = parametros["username"];

    let linkMonumentos = document.querySelector("#link_monumentos");
    linkMonumentos.setAttribute("onclick","ir_otra_pagina('monumentos.html?username="+username+"')"); 
    
    let linkNoticias = document.querySelector("#link_noticias");
    linkNoticias.setAttribute("onclick","ir_otra_pagina('noticias.html?username="+username+"')"); 

    let linkDiscotecas = document.querySelector("#link_discotecas");
    linkDiscotecas.setAttribute("onclick","ir_otra_pagina('bares_discotecas.html?username="+username+"')"); 

    let linkRestaurantes = document.querySelector("#link_restaurantes");
    linkRestaurantes.setAttribute("onclick","ir_otra_pagina('restaurantes.html?username="+username+"')"); 
}


// menus
let crearMenuLateral = (parametros) => {
        let username = parametros["username"];    
        let menu_lateral = '';
        menu_lateral+='<div class="modal-dialog" role="document">';
        menu_lateral+=' <div class="modal-content">';
        menu_lateral+='   <div class="modal-body p-0">';
        menu_lateral+='      <div class="profileBox pt-2 pb-2">';
        menu_lateral+='         <div class="in">';
        menu_lateral+='           <strong>Bienvenido</strong>';
        menu_lateral+='           <div class="text-muted">';
        menu_lateral+='             <a onclick="ir_otra_pagina(\'soporte.html?username='+username+'\')">soporte</a> |';
        menu_lateral+='             <a onclick="ir_otra_pagina(\'index.html?username='+username+'\')">logout</a>';
        menu_lateral+='           </div>';
        menu_lateral+='         </div>';
        menu_lateral+='         <a href="#" data-toggle="modal" data-target="#sidebarPanel" class="btn btn-link btn-icon sidebar-close" data-bs-dismiss="modal">';
        menu_lateral+='            <ion-icon name="close-outline"></ion-icon>';
        menu_lateral+='         </a>';
        menu_lateral+='      </div>';
        menu_lateral+='      <div class="sidebar-balance">';
        menu_lateral+='         <div class="in">';
        menu_lateral+='             <h1 class="amount">Portvil</h1>';
        menu_lateral+='         </div>';
        menu_lateral+='      </div>';
        menu_lateral+='      <div class="listview-title mt-1">Propiedades</div>';
        menu_lateral+='      <ul class="listview flush transparent no-line image-listview">';
        menu_lateral+='         <li>';
        menu_lateral+='            <a href="#" onclick="ir_otra_pagina(\'propiedades.html?pagina=propiedades&username='+username+'\')" class="item">';
        menu_lateral+='               <div class="icon-box bg-primary">';
        menu_lateral+='                 <ion-icon name="home-outline"></ion-icon>';
        menu_lateral+='               </div>';
        menu_lateral+='               <div class="in">Propiedades</div>';
        menu_lateral+='            </a>';
        menu_lateral+='         </li>';
        menu_lateral+='         <li>';
        menu_lateral+='            <a href="#" onclick="ir_otra_pagina(\'propiedades.html?pagina=galeria&username='+username+'\')" class="item">';
        menu_lateral+='               <div class="icon-box bg-primary">';
        menu_lateral+='                  <ion-icon name="camera-outline"></ion-icon>';
        menu_lateral+='               </div>';
        menu_lateral+='               <div class="in">Galería</div>';
        menu_lateral+='            </a>';
        menu_lateral+='         </li>';
        menu_lateral+='         <li>';
        menu_lateral+='            <a href="#" onclick="ir_otra_pagina(\'propiedades.html?pagina=servicio&username='+username+' \')" class="item">';
        menu_lateral+='                <div class="icon-box bg-primary">';
        menu_lateral+='                    <ion-icon name="apps-outline"></ion-icon>';
        menu_lateral+='                </div>';
        menu_lateral+='                <div class="in">Servicios</div>';
        menu_lateral+='            </a>';
        menu_lateral+='          </li>';
        menu_lateral+='          <li>';
        menu_lateral+='            <a href="#" onclick="ir_otra_pagina(\'propiedades.html?pagina=location&username='+username+'\')" class="item">';
        menu_lateral+='                <div class="icon-box bg-primary">';
        menu_lateral+='                    <ion-icon name="walk-outline"></ion-icon>';
        menu_lateral+='                </div>';
        menu_lateral+='                <div class="in">Lugares cercanos</div>';
        menu_lateral+='            </a>';
        menu_lateral+='          </li>';
        menu_lateral+='      </ul>';
        menu_lateral+='      <div class="listview-title mt-1">Cultural</div>';
        menu_lateral+='      <ul class="listview flush transparent no-line image-listview">';
        menu_lateral+='          <li>';
        menu_lateral+='             <a onclick="ir_otra_pagina(\'monumentos.html?username='+username+' \')" class="item">';
        menu_lateral+='                <div class="icon-box bg-primary">';
        menu_lateral+='                  <ion-icon name="book-outline"></ion-icon>';
        menu_lateral+='                </div>';
        menu_lateral+='                <div class="in">Monumentos</div>';
        menu_lateral+='             </a>';
        menu_lateral+='           </li>';
        menu_lateral+='           <li>';
        menu_lateral+='               <a onclick="ir_otra_pagina(\'noticias.html?username='+username+'\')" class="item">';
        menu_lateral+='                   <div class="icon-box bg-primary">';
        menu_lateral+='                       <ion-icon name="alarm-outline"></ion-icon>';
        menu_lateral+='                   </div>';
        menu_lateral+='                   <div class="in">Noticias';
        menu_lateral+='                   </div>';
        menu_lateral+='               </a>';
        menu_lateral+='           </li>';
        menu_lateral+='           </ul>';
        menu_lateral+='           <div class="listview-title mt-1">Negocios</div>';
        menu_lateral+='           <ul class="listview flush transparent no-line image-listview">';
        menu_lateral+='               <li>';
        menu_lateral+='                   <a  onclick="ir_otra_pagina(\'restaurantes.html?username='+username+'\')" class="item">';
        menu_lateral+='                       <div class="icon-box bg-primary">';
        menu_lateral+='                           <ion-icon name="pizza-outline"></ion-icon>';
        menu_lateral+='                       </div>';
        menu_lateral+='                       <div class="in">Restaurantes</div>';
        menu_lateral+='                   </a>';
        menu_lateral+='               </li>';
        menu_lateral+='               <li>';
        menu_lateral+='                   <a onclick="ir_otra_pagina(\'bares_discotecas.html?username='+username+'\')" class="item">';
        menu_lateral+='                       <div class="icon-box bg-primary">';
        menu_lateral+='                           <ion-icon name="beer-outline"></ion-icon>';
        menu_lateral+='                       </div>';
        menu_lateral+='                       <div class="in">Bares</div>';
        menu_lateral+='                   </a>';
        menu_lateral+='               </li>';
        menu_lateral+='               <li>';
        menu_lateral+='                   <a onclick="ir_otra_pagina(\'bares_discotecas.html?username='+username+'\')" class="item">';
        menu_lateral+='                       <div class="icon-box bg-primary">';
        menu_lateral+='                           <ion-icon name="wine-outline"></ion-icon>';
        menu_lateral+='                       </div>';
        menu_lateral+='                       <div class="in">Discotecas</div>';
        menu_lateral+='                   </a>';
        menu_lateral+='               </li>';
        menu_lateral+='               </ul>';
        menu_lateral+='               <div class="listview-title mt-1">Configuración</div>';
        menu_lateral+='                   <ul class="listview flush transparent no-line image-listview">';
        menu_lateral+='                       <li>';
        menu_lateral+='                           <a onclick="ir_otra_pagina(\'preferencias.html?username='+username+'\')" class="item">';
        menu_lateral+='                               <div class="icon-box bg-primary">';
        menu_lateral+='                                   <ion-icon name="settings-outline"></ion-icon>';
        menu_lateral+='                               </div>';
        menu_lateral+='                               <div class="in">Preferencias</div>';
        menu_lateral+='                           </a>';
        menu_lateral+='                       </li>';
        menu_lateral+='                       <li>';
        menu_lateral+='                           <a onclick="ir_otra_pagina(\'soporte.html?username='+username+'\')" class="item">';
        menu_lateral+='                               <div class="icon-box bg-primary">';
        menu_lateral+='                                   <ion-icon name="chatbubble-outline"></ion-icon>';
        menu_lateral+='                               </div>';
        menu_lateral+='                               <div class="in">Soporte</div>';
        menu_lateral+='                           </a>';
        menu_lateral+='                       </li>';
        menu_lateral+='                       <li>';
        menu_lateral+='                           <a onclick="ir_otra_pagina(\'index.html?username='+username+'\')" class="item">';
        menu_lateral+='                               <div class="icon-box bg-primary">';
        menu_lateral+='                                   <ion-icon name="log-out-outline"></ion-icon>';
        menu_lateral+='                               </div>';
        menu_lateral+='                               <div class="in">Log out</div>';
        menu_lateral+='                           </a>';
        menu_lateral+='                       </li>';
        menu_lateral+='                   </ul>';
        menu_lateral+='                </div>';
        menu_lateral+='            </div>';

        let sidebarPanel = document.querySelector("#sidebarPanel");
        sidebarPanel.innerHTML = menu_lateral;
}


let crearMenuSuperior = (parametros) => {
    let username = parametros["username"];
    let menu_superior = '';
    //menu_superior+= '<div class="appHeader bg-primary text-light">';
    menu_superior+= '   <div class="left">';
    menu_superior+= '       <a href="#" class="headerButton" data-toggle="modal" data-target="#sidebarPanel" data-bs-toggle="modal" data-bs-target="#sidebarPanel">';
    menu_superior+= '           <ion-icon name="menu-outline"></ion-icon>';
    menu_superior+= '       </a>';
    menu_superior+= '   </div>';
    menu_superior+= '   <a href="#" onclick="ir_otra_pagina(\'home.html?username='+username+'\')">';
    menu_superior+= '       <div class="pageTitle">';
    menu_superior+= '           <img src="img/logo-dos.png" alt="logo" class="logo">';
    menu_superior+= '       </div>';
    menu_superior+= '   </a>';
    menu_superior+= '   <div class="right">';
    menu_superior+= '     <a onclick="ir_otra_pagina(\'notificaciones.html?username='+username+'\')" class="headerButton">';
    menu_superior+= '       <ion-icon class="icon" name="notifications-outline"></ion-icon>';
    menu_superior+= '           <span class="badge badge-danger">4</span>';
    menu_superior+= '     </a>';
    menu_superior+= '   </div>';
    //menu_superior+= '</div>';
    
    let app_header_div = document.querySelector(".appHeader");
    app_header_div.innerHTML = menu_superior;
}


let crearMenuSuperiorLimpieza = (parametros) => {
    
    let username = parametros["username"];
    
    let menu_superior = '';
    menu_superior+='<div class="left">';
    menu_superior+='    <a href="#appSidebar" class="icon" data-bs-toggle="offcanvas">';
    menu_superior+='        <i class="icon ion-ios-menu"></i>';
    menu_superior+='    </a>';
    menu_superior+='</div>';
    menu_superior+= '<a href="#" onclick="ir_otra_pagina(\'home_limpieza.html?roles='+parametros["roles"]+'&id='+parametros["id"]+'&username='+username+'\')">';
    menu_superior+='<div class="pageTitle">';
    menu_superior+='    <img src="img/limpieza/logo-dos.jpg" alt="Bitter" class="image">';
    menu_superior+='</div>';
    menu_superior+='</a>';
    menu_superior+='<div class="right">';
    //menu_superior+='    <label for="searchInput" class="mb-0 icon toggleSearchbox">';
    //menu_superior+='        <i class="icon ion-ios-search"></i>';
    //menu_superior+='    </label>';
    menu_superior+='</div>';

    /*
    //menu_superior+= '<div class="appHeader bg-primary text-light">';
    menu_superior+= '   <div class="left">';
    menu_superior+= '       <a href="#" class="headerButton" data-toggle="modal" data-target="#sidebarPanel" data-bs-toggle="modal" data-bs-target="#sidebarPanel">';
    menu_superior+= '           <ion-icon name="menu-outline"></ion-icon>';
    menu_superior+= '       </a>';
    menu_superior+= '   </div>';
    menu_superior+= '   <a href="#" onclick="ir_otra_pagina(\'home.html?username='+username+'\')">';
    menu_superior+= '       <div class="pageTitle">';
    menu_superior+= '           <img src="img/logo-dos.png" alt="logo" class="logo">';
    menu_superior+= '       </div>';
    menu_superior+= '   </a>';
    menu_superior+= '   <div class="right">';
    menu_superior+= '     <a onclick="ir_otra_pagina(\'notificaciones.html?username='+username+'\')" class="headerButton">';
    menu_superior+= '       <ion-icon class="icon" name="notifications-outline"></ion-icon>';
    menu_superior+= '           <span class="badge badge-danger">4</span>';
    menu_superior+= '     </a>';
    menu_superior+= '   </div>';
    //menu_superior+= '</div>';
    */

    let app_header_div = document.querySelector(".appHeader");
    app_header_div.innerHTML = menu_superior;
}


let crearMenuInferior = (parametros, nombre_pagina) => {
        
        let username = parametros["username"];

        let menu_inferior = '';
        if (nombre_pagina == "propiedades")
            menu_inferior+= '   <a href="#" onclick="ir_otra_pagina(\'propiedades.html?pagina=propiedades&username='+username+'\')" class="item active" >';
        else
            menu_inferior+= '   <a href="#" onclick="ir_otra_pagina(\'propiedades.html?pagina=propiedades&username='+username+'\')" class="item" >';

        menu_inferior+= '    <div class="col">';
        menu_inferior+= '        <ion-icon name="home-outline"></ion-icon>';
        menu_inferior+= '        <strong>Propiedad</strong>';
        menu_inferior+= '    </div>';
        menu_inferior+= '    </a>';

        if (nombre_pagina == "monumentos")
            menu_inferior+= '    <a href="#" onclick="ir_otra_pagina(\'monumentos.html?username='+username+'\')" class="item active">';
        else
            menu_inferior+= '    <a href="#" onclick="ir_otra_pagina(\'monumentos.html?username='+username+'\')" class="item">';

        menu_inferior+= '        <div class="col">';
        menu_inferior+= '            <ion-icon name="book-outline"></ion-icon>';
        menu_inferior+= '            <strong>Cultura</strong>';
        menu_inferior+= '        </div>';
        menu_inferior+= '    </a>';
        
        if (nombre_pagina == "bares_discotecas")
            menu_inferior+= '    <a href="#" onclick="ir_otra_pagina(\'bares_discotecas.html?username='+username+'\')" class="item active">';
        else
            menu_inferior+= '    <a href="#" onclick="ir_otra_pagina(\'bares_discotecas.html?username='+username+'\')" class="item">';

        menu_inferior+= '        <div class="col">';
        menu_inferior+= '            <ion-icon name="beer-outline"></ion-icon>';
        menu_inferior+= '            <strong>Ocio</strong>';
        menu_inferior+= '        </div>';
        menu_inferior+= '    </a>';
        
        if (nombre_pagina == "noticias")
            menu_inferior+= '    <a href="#" onclick="ir_otra_pagina(\'noticias.html?username='+username+'\')" class="item active">';
        else
            menu_inferior+= '    <a href="#" onclick="ir_otra_pagina(\'noticias.html?username='+username+'\')" class="item">';

        menu_inferior+= '        <div class="col">';
        menu_inferior+= '            <ion-icon name="newspaper-outline"></ion-icon>';
        menu_inferior+= '            <strong>Noticias</strong>';
        menu_inferior+= '        </div>';
        menu_inferior+= '    </a>';
        
        if (nombre_pagina == "preferencias")
            menu_inferior+= '    <a href="#" onclick="ir_otra_pagina(\'preferencias.html?username='+username+'\')" class="item active">';
        else
            menu_inferior+= '    <a href="#" onclick="ir_otra_pagina(\'preferencias.html?username='+username+'\')" class="item">';

        menu_inferior+= '        <div class="col">';
        menu_inferior+= '            <ion-icon name="settings-outline"></ion-icon>';
        menu_inferior+= '            <strong>Preferencias</strong>';
        menu_inferior+= '        </div>';
        menu_inferior+= '    </a>';

        let appBottomMenu = document.querySelector(".appBottomMenu");
        appBottomMenu.innerHTML = menu_inferior;
}



let crearMenuInferiorLimpieza = (parametros, nombre_pagina) => {
        
        let username = parametros["username"];
        let cadena_menu = '';
        
        cadena_menu+= '<div class="item active">';
        cadena_menu+= '    <a href="#" onclick="ir_otra_pagina(\'ver_propiedad_limpieza.html?roles='+parametros["roles"]+'&id='+parametros["id"]+'&username='+username+'&id_propiedad=297523\')">';
        cadena_menu+= '        <p>';
        cadena_menu+= '            <i class="icon ion-ios-water"></i>';
        cadena_menu+= '            <span>Villas</span>';
        cadena_menu+= '        </p>';
        cadena_menu+= '    </a>';
        cadena_menu+= '</div>';
        cadena_menu+= '<div class="item">';
        cadena_menu+= '    <a href="#" onclick="ir_otra_pagina(\'ver_tarea_limpieza.html?roles='+parametros["roles"]+'&id='+parametros["id"]+'&username='+username+'&id_tarea=1\')">';
        cadena_menu+= '        <p>';
        cadena_menu+= '            <i class="icon ion-ios-apps"></i>';
        cadena_menu+= '            <span>Tareas</span>';
        cadena_menu+= '        </p>';
        cadena_menu+= '    </a>';
        cadena_menu+= '</div>';
        cadena_menu+= '<div class="item">';
        cadena_menu+= '    <a href="#" onclick="ir_otra_pagina(\'ver_producto_limpieza.html?username='+username+'&roles='+parametros["roles"]+'&id='+parametros["id"]+'&id_producto=9\')">';
        cadena_menu+= '        <p>';
        cadena_menu+= '            <i class="icon ion-ios-analytics"></i>';
        cadena_menu+= '            <span>Productos</span>';
        cadena_menu+= '        </p>';
        cadena_menu+= '    </a>';
        cadena_menu+= '</div>';
        cadena_menu+= '<div class="item">';
        cadena_menu+= '    <a href="#" onclick="ir_otra_pagina(\'ver_blog_limpieza.html?roles='+parametros["roles"]+'&id='+parametros["id"]+'&username='+username+'&id_blog=5\')">';
        cadena_menu+= '        <p>';
        cadena_menu+= '            <i class="icon ion-ios-search"></i>';
        cadena_menu+= '            <span>Notícias</span>';
        cadena_menu+= '        </p>';
        cadena_menu+= '    </a>';
        cadena_menu+= '</div>';
        cadena_menu+= '<div class="item">';
        cadena_menu+= '    <a href="#appSidebar" class="icon" data-bs-toggle="offcanvas">';
        cadena_menu+= '        <p>';
        cadena_menu+= '            <i class="icon ion-ios-menu"></i>';
        cadena_menu+= '            <span>Menu</span>';
        cadena_menu+= '        </p>';
        cadena_menu+= '    </a>';
        cadena_menu+= '</div>';

        let contenedorMenuInferior = document.querySelector(".appBottomMenu");
        contenedorMenuInferior.innerHTML = cadena_menu; 

}


let crearMenuLateralLimpieza = (parametros, nombre_pagina) => {
    let dominio = paginasObject.getDominio();
    let username = parametros["username"];
    let cadena_menu = '';
    cadena_menu+='<div class="offcanvas-body">';
    cadena_menu+='    <nav class="sidebar">';
    cadena_menu+='        <div class="profilebox">';
    cadena_menu+='            <img src="img/sample/limpieza/avatar.jpg" alt="avatar" class="avatar">';
    cadena_menu+='            <h2 class="title">'+username+'</h2>';
    cadena_menu+='            <h5 class="lead">';
    cadena_menu+='                <i class="icon ion-ios-pin me-1"></i>';
    cadena_menu+='                Chicago';
    cadena_menu+='            </h5>';
    cadena_menu+='            <div class="sidebutton">';
    cadena_menu+='                <a href="#">';
    cadena_menu+='                    <i class="icon ion-ios-settings"></i>';
    cadena_menu+='                </a>';
    cadena_menu+='            </div>';
    cadena_menu+='        </div>';
    cadena_menu+='        <div class="sidebarGroup">';
    cadena_menu+='            <ul class="sidebarMenu">';
    cadena_menu+='                <li>';
    cadena_menu+='                    <a href="#" onclick="ir_otra_pagina(\'ver_propiedad_limpieza.html?roles='+parametros["roles"]+'&id='+parametros["id"]+'&username='+username+'&id_propiedad=297523\')">';
    cadena_menu+='                        <i class="icon ion-ios-people"></i>';
    cadena_menu+='                        Propiedades';
    cadena_menu+='                    </a>';
    cadena_menu+='                </li>';
    cadena_menu+='                <li>';
    cadena_menu+='                    <a href="#" onclick="ir_otra_pagina(\'ver_tarea_limpieza.html?roles='+parametros["roles"]+'&id='+parametros["id"]+'&username='+username+'&id_tarea=1\')">';
    cadena_menu+='                        <i class="icon ion-ios-chatboxes"></i>';
    cadena_menu+='                        Tareas';
    cadena_menu+='                    </a>';
    cadena_menu+='                </li>';
    cadena_menu+='                <li>';
    cadena_menu+='                    <a href="#" onclick="ir_otra_pagina(\'ver_producto_limpieza.html?username='+username+'&roles='+parametros["roles"]+'&id='+parametros["id"]+'&id_producto=9\')">';
    cadena_menu+='                        <i class="icon ion-ios-apps"></i>';
    cadena_menu+='                        Productos';
    cadena_menu+='                    </a>';
    cadena_menu+='                </li>';
    cadena_menu+='                <li>';
    cadena_menu+='                    <a href="#" onclick="ir_otra_pagina(\'ver_blog_limpieza.html?roles='+parametros["roles"]+'&id='+parametros["id"]+'&username='+username+'&id_blog=5\')">';
    cadena_menu+='                        <i class="icon ion-ios-analytics"></i>';
    cadena_menu+='                        Notícias';
    cadena_menu+='                    </a>';
    cadena_menu+='                </li>';
    cadena_menu+='                <li>';
    cadena_menu+='                    <a href="index.html">';
    cadena_menu+='                        <i class="icon ion-ios-lock"></i>';
    cadena_menu+='                        Login';
    cadena_menu+='                    </a>';
    cadena_menu+='                </li>';
    cadena_menu+='            </ul>';
    cadena_menu+='        </div>';
    cadena_menu+='<div class="sidebarGroup">';
    cadena_menu+='    <ul class="sidebarMenu menu-telefonos-lateral">';
    cadena_menu+='    </ul>';
    cadena_menu+='</div>';
    cadena_menu+='    </nav>';
    cadena_menu+=' </div>';

    let menu_lateral = document.querySelector("#appSidebar");
    menu_lateral.innerHTML = cadena_menu;
}    




// for all pages
let lanzar_script = () => {
    
    // laoder
    let loader = document.querySelector("#loader");
    loader.style.display = "none";
    
    // swiper
    var swiper_noticias = new Swiper('.carousel-noticias',{
        direction: 'horizontal',
        slidesPerView: 1,
    });

    var swiper_monumentos= new Swiper('.carousel-monumentos',{
        direction: 'horizontal',
        slidesPerView: 1,
    });
    
    var swiper_restaurantess= new Swiper('.carousel-restaurantes',{
        direction: 'horizontal',
        slidesPerView: 1,
    });
    
    var swiper_discotecas = new Swiper('.carousel-discotecas',{
        slidesPerView: 2,
        spaceBetween: 30,
        direction: 'horizontal',
    });

}


let lanzar_script_limpieza = () => {
    
    // loader
    let loader = document.querySelector("#loading");
    loader.style.display = "none";

}