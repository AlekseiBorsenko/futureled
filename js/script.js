$(function(){
    var timeout;
    $('#search_input').on('keyup',function(){
        clearTimeout(timeout);
        timeout = setTimeout(function(){
            $('#main_menu li').removeClass('opened');
            simpleStore.filterProducts($('#search_input').val().trim());
        },1500);
    })

    $('#finish_transf').on('click',function(){
        simpleStore.sendOrder();
    });
    $('#send_portes').on('change',function(){
        
    });
    $('input[name=shipping]').click('change',function(){
        var val = parseFloat($('input[name=shipping]:checked').val());
        var total = simpleCart.total();
        $('.transfer-amount').empty().text((val+total).toFixed(2));

    })
    
    
  
    
})