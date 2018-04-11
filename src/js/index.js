//changing format date dd.mm.yyyy to mm/dd/yyyy and from JSON string to Date
function strToDate(data){
    for(var i = 0; i< data.length; i++){
        var dateArr = data[i].dateOfBirth.split("."),
            standardDate = dateArr[1] + "/" +dateArr[0] + "/" + dateArr[2];
            data[i].dateOfBirth = new Date(standardDate);
    }
        var jData = data;
    return jData;
}
//changing number of month to full name of month
function noToMonth(monthNo){
    var month = 0;
    switch(monthNo){
        case 0:
            month = "styczeń";
            break;
        case 1:
            month = "luty";
            break;
        case 2:
            month = "marzec";
            break;
        case 3:
            month = "kwiecień";
            break;
        case 4:
            month = "maj";
            break;
        case 5:
            month = "czerwiec";
            break;
        case 6:
            month = "lipiec";
            break;
        case 7:
            month = "sierpień";
            break;
        case 8:
            month = "wrzesień";
            break;
        case 9:
            month = "pażdziernik";
            break;
        case 10:
            month = "listopad";
            break;
        case 11:
            month = "grudzień";
            break;    
    }
    return month;
}
//counts and adds proper number of pages number to pagination section 
function paginationNo(data){
    var paginationSites = Math.ceil(data.length/5);
    if(paginationSites > 1){
        for(var i = 2; i <= paginationSites; i++){
            //starting from 2 because no.1 is in default html
            $(".pagination__number").last().after("<p class=\"pagination__number\" id=\"pagination__"+i+"\">"+i+"</p>");
        }
    }
}
//adds data to table
function displayData(data, page){
    var startCondition = 0,
        endCondition = 0,
        paginationNoId = "#pagination__" + page;
        
    var tbody = $("tbody");
//start and end condition for displaying data loop    
    if(page == 1){
        startCondition = 0;
    }
    else{
        startCondition = 5*(page - 1);
    }
    if(page > 1){
        endCondition = 5*(page - 1) + (data.length % 5);
    }
    else{
        if((data.length % 5) != 0 && data.lenght < 5){
        endCondition = (data.length % 5);
        }
        else endCondition = 5;
    }
    
    tbody.empty();
    $(".pagination__number--active").removeClass("pagination__number--active");
    $(paginationNoId).addClass("pagination__number--active");
    for(var i = startCondition; i < endCondition  ; i++){
        tbody.append("<tr></tr>");
        var lastTr = $("tr").last();
        lastTr.append("<td>"+data[i].id +"</td>");
        lastTr.append("<td>"+data[i].firstName+"</td>");
        lastTr.append("<td>"+data[i].lastName +"</td>");
        lastTr.append("<td>" + data[i].dateOfBirth.getDate() + " "+noToMonth(data[i].dateOfBirth.getMonth())+" "+data[i].dateOfBirth.getFullYear() +"</td>");
        lastTr.append("<td>"+data[i].company +"</td>");
        lastTr.append("<td>"+data[i].note +"</td>");
    }
}
//adds clisck listeners to pagination elements 
function pager(data){
    var page = 1,
        noOfPages = Math.ceil(data.length/5),
        pagesIdStringArr = [];     
// click listeners fo pages    
    for(let i = 1; i <= noOfPages; i++){
        pagesIdStringArr[i] = "#pagination__" + (i);
    $(pagesIdStringArr[i]).click(function(){
            page = $(pagesIdStringArr[i]).text();
            page = Number(page);
            displayData(data, page);
        
        });
   }
// click listeners fo next and back buttons
    $(".pagination__back").click(function(){
            var activePageNo = $(".pagination__number--active").text();
        if(activePageNo != 1 ){
            displayData(data, (activePageNo - 1));
        }
        
        });
     $(".pagination__next").click(function(){
            var activePageNo = $(".pagination__number--active").text();
        if(activePageNo != (Math.ceil(data.length / 5)) ){
            displayData(data, (Number(activePageNo) + 1));
        }
        
        });
    return page;
}
//sorts JSON data array
function sorter(jData, thName, thId){
    var page = Number($(".pagination__number--active").text());
    var filterDir = $("th").eq(thId).data("direction");
    
    function compareValues(key, order) {
//reading and seting the direction of sortation in th data attribute
        if(order == 'ásc') $("th").eq(thId).data("direction", 'desc');
        else{
            if(order == 'desc'){$("th").eq(thId).data("direction", 'asc');}
            else{$("th").eq(thId).data("direction", 'desc');}
        }
        return function(a, b) {
//comparator function 
            if(!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
              // property doesn't exist on either object
                return 0; 
            }
            const varA = (typeof a[key] === 'string') ? 
              a[key].toUpperCase() : a[key];
            const varB = (typeof b[key] === 'string') ? 
              b[key].toUpperCase() : b[key];

            let comparison = 0;
            if (varA > varB) {
              comparison = 1;
            } else if (varA < varB) {
              comparison = -1;
            }
            return (
              (order == 'desc') ? (comparison * -1) : comparison
            );
          };
        }
    jData.sort(compareValues(thName, filterDir));
    displayData(jData, page);
}
//adds event listener for every th tag
function sort(data){
    var th = $("th");
    for(let i = 0; i < th.length; i++){
        th[i].addEventListener("click", function(){
// passing name of clicked element and its id
            switch(i){
                   case 0:
                       sorter(data, "id", 0);
                       break;
                   case 1:
                      sorter(data, "firstName", 1);
                       break;
                   case 2:
                       sorter(data, "lastName",2);
                       break;
                   case 3:
                       sorter(data, "dateOfBirth", 3);
                       break;
                   case 4:
                       sorter(data, "company", 4);
                       break;
                   case 5:
                       sorter(data, "note", 5);
                       break;
                } 
            });
    }
}
//the main function downloading JSON and firing up components
$(document).ready(function(){
    var mainPage = 1;
    $.getJSON("https://api.myjson.com/bins/pd92r",
    function (data){ 
        var jData = strToDate(data);
        paginationNo(jData);
        pager(jData);
        displayData(jData, 1);
        sort(jData);
        }
    );
});
