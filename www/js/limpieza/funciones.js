window.onload = function(){
    lanzar_script();
}

// for all pages
let lanzar_script = () => {
    
    // laoder
    let loader = document.querySelector("#loading");
    loader.style.display = "none";

    /*
    var elms = document.getElementsByClassName( 'splide' );

    for ( var i = 0; i < elms.length; i++ ) {
        new Splide( elms[ i ] ).mount();
    }
    

    new Splide( '.carousel-single > .splide', {
        type   : 'loop',
        perPage: 3,
    });
    */

}


document.addEventListener( 'DOMContentLoaded', function () {
    /*
    alert("cargando");
    new Splide( '.splide', {
        type   : 'loop',
        padding: '5rem',
        
        perPage: 3,
        focus  : 0,
        omitEnd: true,
        autoWidth: true,
   });

    
    var splide = new Splide( '.carousel-single' );
    splide.mount();
    
    new Splide( '.carousel-single.splide', {
        type   : 'loop',
        perPage: 1,
   });
   
    var elms = document.getElementsByClassName( 'splide' );
    for ( var i = 0; i < elms.length; i++ ) {
        new Splide( elms[ i ],{
            type   : 'loop',
            heightRatio: 0.5,
            perPage: 1,
            padding: '5rem',
            autoWidth: true,
        }).mount();
    }
    */

    // first carousel
    let carousel_one = document.querySelector(".carousel-single");
    new Splide( carousel_one,{
        type   : 'loop',
        perPage: 1,
        padding:{left:40,right:40},
        fixedWidth: 334,
        arrows:false,
        pagination:false
    }).mount();
    
    // second carousel
    let carousel_two = document.querySelector(".postCarousel");
    new Splide( carousel_two,{
        type   : 'loop',
        perPage: 1,
        padding:{left:20,right:20},
        fixedWidth: 177,
        arrows:false,
        pagination:false
    }).mount();

    // third carousel
    let carousel_three = document.querySelector(".buttonCarousel");
    new Splide( carousel_three,{
        type   : 'loop',
        perPage: 1,
        padding:{left:20,right:20},
        fixedWidth: 78.5,
        arrows:false,
        pagination:false
    }).mount();

});