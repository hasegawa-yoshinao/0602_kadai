$(function(){
    let now_date  = new Date();
    let now_month = now_date.getFullYear()+ '/' +(now_date.getMonth()+1);
    $("#target_month").append(now_month);
    bulidTable();
    sum();
    createDeleteEvent(); 
  
    function removeLocalStorage(name){
      if(isBlank(name)) {
        alert("error!!");
        return false;
      }
      localStorage.removeItem(name);
    }
    
    function removeLocalStorageAll(){
      localStorage.clear();
    }
  
    function getLocalstorageItem(name){
      if(isBlank(name)) retun;
      return localStorage.getItem(name);
    }
  
    function saveLocalstorage(name, data){
      if(isBlank(name) || isBlank(data)) {
        alert("error!!");
        return false;
    }
  
      localStorage.setItem(name, data);
      return true;
    }
  
    function getLocalStorageName(ym = '') {
      let base_name = '_kakeibo';
      if(isBlank(ym)) {
        let target_month = $("#target_month").text();
        ym = target_month.replace( /\//g , "" );
      }
      return ym + base_name;
    }
  
    function bulidTable(){
      let tableBody = "";
      $("table tbody tr").remove();
      
      let localstorage_name = getLocalStorageName();
      let localSt = getLocalstorageItem(localstorage_name);
      let localStJSON = JSON.parse(localSt);
  
      $(localStJSON).map(function(index, line){
        tableBody += "<tr>";
        tableBody += "<td>" + line["date"] + "</td>";
        tableBody += "<td class='name'>" + line["name"] + "</td>";
        tableBody += "<td class='price'>" + line["price"] + "</td>";
        tableBody += '<td><input type="button" class="delete" value="削除"></td>';
        tableBody += "</tr>";
      });

      $('table tbody').append(tableBody);
    }
  

    function isBlank(data){ 
      if (data.length ==0 || data == ''){
        return true;
      } else {
        return false;
      }
    }
  

    function sum(){
      let pricelist = $("table td[class=price]").map(function(index, val){
        let price = parseInt($(val).text());
        if(price >= 0) {
          return price;
        } else {
          return null;
        }
      });

      let total = 0;
      pricelist.each(function(index, val){
        total = total + val;
      });
      $(".sum_price").text("合計："+total+"円");
    }
  
    function getJsonFromTable() {
      let counter = 0;
      let line    = [];
      $("table tbody tr").map(function(index, val){
        line[counter] = {"date":$(val).children().eq(0).text()
                    , "name":$(val).children().eq(1).text()
                    , "price":$(val).children().eq(2).text()};
        counter += 1;
      });
      return line;
    }
    
    function createDeleteEvent() {
      $(document).on("click", ".delete", function(event) {
        let target = $(event.target);
        target.parents("tr").remove();
        sum();
        let line = getJsonFromTable();
        let mainJSON = JSON.stringify(line);
        saveLocalstorage(getLocalStorageName(), mainJSON);
      });
    }
  
    $("#get_before_month").click(function(){
      let target_month_str = $("#target_month").text();
      let target_month_array = target_month_str.split("/");
      let last_date = new Date(target_month_array[0], target_month_array[1]-2, 1);
      let last_month = last_date.getFullYear()+ '/' +(last_date.getMonth()+1);
      let last_ym    = last_date.getFullYear().toString() + (last_date.getMonth()+1).toString();
      $("#target_month").text(last_month);
    　bulidTable();
    　sum();
      createDeleteEvent(); 
    });
  
    $("#get_next_month").click(function(){
      let target_month_str = $("#target_month").text();
      let target_month_array = target_month_str.split("/");
      let next_date = new Date(target_month_array[0], target_month_array[1], 1);
      let next_month = next_date.getFullYear()+ '/' +(next_date.getMonth()+1);
      let next_ym    = next_date.getFullYear().toString() + (next_date.getMonth()+1).toString();
      $("#target_month").text(next_month);
      bulidTable();
  　　sum();
      createDeleteEvent(); 
    });
  
    $("#add").click(function(){
      let name = $("#product_name").val();
      let price = $("#product_price").val();
      let date  = new Date();
      let str_date = date.getFullYear()+ '/' +(date.getMonth()+1)+ '/' +date.getDate();
  
      if(isBlank(name) || isBlank(price)) {
        alert('空欄の項目があります。');
        return;
      }
      if (!$.isNumeric(price)) {
        alert('価格は数値で入力してください。');
        return;
      }
  
      $('table').append('<tr><td>'+ str_date +'</td>'
                  +'<td class="name">'+ name +'</td>'
                  +'<td class="price">'+ price +'</td>'
                  +'<td><input type="button" class="delete" value="削除"></td>'
                  +'</tr>');
  
                  let product = {"date":str_date, "name":name, "price":price};
      let mainArray    = [];
      let localStJSON = getLocalstorageItem(getLocalStorageName());
      if(localStJSON != null && localStJSON != "") {
        let mainArray = JSON.parse(localStJSON);
      }
  
      mainArray.push(product);
  
      let mainJSON = JSON.stringify(mainArray);
      saveLocalstorage(getLocalStorageName(), mainJSON);
      sum();
      createDeleteEvent();
    });
  
    $("#clear").click(function(){
     if(!confirm('当月分のデータを削除します。よろしいですか？')){
        return false;
      }else{
        removeLocalStorage(getLocalStorageName());
        $("table tbody tr").remove();
        sum();
      }
    });
  });