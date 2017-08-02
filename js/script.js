$(function(){
    var cats = simpleStore.plugins.google.getCategories();

    $('#main_menu').empty();

    for(var cat in cats){
        console.log(cat)
    }
  
    $('#menu_but span').on('click',function(){
        $(this).parent().toggleClass('opened')
        console.log("clicked")
        $('#main_menu').toggleClass('opened')
    });
})