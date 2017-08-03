$(function(){
    var timeout;
    $('#search_input').on('keyup',function(){
        clearTimeout(timeout);
        timeout = setTimeout(function(){
            simpleStore.filterProducts($('#search_input').val().trim());
        },1500);
    })

    $('#finish_transf').on('click',function(){
        simpleStore.sendOrder();
    });
    
    
  
    
})