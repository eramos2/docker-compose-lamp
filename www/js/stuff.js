/* This is for putting comments or things that you are gonna delete but may need later!! */


/* Arelis */



////Testing for the implementation of the field removal
//$(document).ready(function() {
//    var max_fields      = 10; //maximum input boxes allowed
//    var wrapper         = $(".input_fields_wrap"); //Fields wrapper
//    var add_button      = $(".add_field_button"); //Add button ID
//
//    var x = 1; //initlal text box count
//    $(add_button).click(function(e){ //on add input button click
//        e.preventDefault();
//        if(x < max_fields){ //max input box allowed
//            x++; //text box increment
//            $(wrapper).append('<div><input type="text" name="mytext2[]"/><a href="#" class="remove_field">Remove</a></div>'); //add input box
//        }
//    });
//
//    $(wrapper).on("click",".remove_field", function(e){ //user click on remove text
//        e.preventDefault(); $(this).parent('div').remove(); x--;
//    })
//});


//        var favorite = [];
//        $.each($("input[name='subService']:checked"), function(){
////            favorite.push($(this).val());
//            favorite.push( $(this).val().split(","));
//            alert(favorite);
//
//        });
//        alert("MaterialId: " + favorite[0] + " SubmaterialId: " + favorite[1]);


// Add new input field for a sub-category (Function not call never) -->
//function addSubCat(){
//
//    var fieldCounter = '<li class="input-group" id=field' + counter + '>';
//    var minusSign = '<span class="input-group-btn"><button class="btn btn-default subFields" type="button" style="height:34px" onclick="removeSubCat(counter)" id="removeBtn"><span class="glyphicon glyphicon-minus"></span></button></span></li>';
//    document.getElementById('newSubCat').innerHTML+= fieldCounter + '<input type="text" class="form-control" placeholder="Enter Sub-Material">'+minusSign+'<br id="break' +counter+'">';
//    counter++;
//}
//
//
//$(document).ready(function() {
//    var max_fields      = 5; //maximum input boxes allowed
//    var wrapper         = $("#newSubCat"); //Fields wrapper
//    var add_button      = $("#addSubCat"); //Add button ID
//    var minusSign = '<span class="input-group-btn remove_field"><button class="btn btn-default " type="button" style="height:34px" ' +
//    'style="padding: 100px"><span class="glyphicon glyphicon-minus"></span></button></span><br></div>';
//
//
//    var x = 1; //initial text box count
//
//    $(add_button).click(function(e){ //on add input button click
//    e.preventDefault();
//    if(x < max_fields){ //max input box allowed
//    x++; //text box increment
//    $(wrapper).append('<div class="input-group"><input type="text" class="form-control" placeholder="Enter Sub-Material" />' + minusSign); //add input box
//    }
//    });
//
//    $(wrapper).on("click",".remove_field", function(e){ //user click on remove text
////            alert($(this).parent('div'));
//    e.preventDefault(); $(this).parent('div').remove(); x--;
//    })
//    });



//<h4>Sub-Materials</h4>
//<div class="input-group input_fields_wrap">
//    <input type="text" class="form-control" name="0" placeholder="Enter Sub-Material" onclick="showConnections()">
//        <span class="input-group-btn">
//            <button class="btn btn-default btn-sm" id="addSubCat" type="button" style="height:34px">
//                <span class="glyphicon glyphicon-plus"></span></button>
//        </span>
//    </div>
