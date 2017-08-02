$(function(){
    var cats = simpleStore.plugins.google.getCategories();

    $('#main_menu').empty();
    var catNames = Object.keys(cats);
    catNames.forEach(function(catName){
        $('#main_menu').append('<li>'+catName+'</li>');
    })
  
    $('#menu_but span').on('click',function(){
        $(this).parent().toggleClass('opened')
        console.log("clicked")
        $('#main_menu').toggleClass('opened')
    });
})