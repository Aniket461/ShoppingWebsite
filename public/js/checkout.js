var userid = req.user._id;
var currentDate = new Date().toISOString().split('T')[0];
var days = 7;
var date = new Date();
var res = date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
var deliveryDate = new Date(res).toISOString().split('T')[0];

 
  
  for(var i=0;i<cart1.length;i++){

console.log("-----------------------");
    var productid = JSON.stringify(cart1[i].id);
    console.log(productid);
    console.log(userid);
    console.log(currentDate);
    console.log(deliveryDate);
    var qty = JSON.stringify(cart1[i].qty);
    console.log(qty);
    console.log(JSON.stringify(cart1[i].image));
    console.log(JSON.stringify(cart1[i].price));
    console.log("-----------------------");
  }

