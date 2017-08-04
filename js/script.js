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
    $('#send_portes').on('change',function(){
        var oldVal = parseFloat($('.transfer-amount').text());
        console.log(oldVal)
        var diff = $(this).is(':checked') ? 5 : oldVal >=5 ? -5 : 0;
        $('.transfer-amount').text((oldVal+diff).toFixed(2));
    });
    
  
    
})