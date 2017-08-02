$(function(){
    $('#menu_but span').on('click',function(){
        $(this).parent().toggleClass('opened')
        console.log("clicked")
        $('#main_menu').toggleClass('opened')
    });
})