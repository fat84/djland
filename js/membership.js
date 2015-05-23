//Created by Evan Friday, 2014
window.myNameSpace = window.myNameSpace || { };

//PAGE CREATION
$(document).ready ( function() {
	var member = new Member(1);
	$.when(member.info_callback,member.interest_callback).then(function(info,interests){
		member._initInfo(info[0]);
		member._initInterests(interests[0]);
		member.displayInfo();
	},function(err1,err2){
		console.log("Failed to load member");
	});


	displayMemberList();
	/*if(document.getElementById('init')){
		manage_members('init');
	}else if(document.getElementById('view')){
		manage_members('view','init');
	}else if(document.getElementById('report')){
		manage_members('report','init');
	}else{
		manage_members('mail','init');
	}*/
	add_handlers();	
});

function getVal($varname){
	$temp = $varname;
	if( $('#'+$temp).val()!=null){
		return $('#'+$temp).val();
	}
	else{
		return null;
	}
}
function getText($varname){
	$temp = $varname;
	if( $('#'+$temp).text()!=null){
		return $('#'+$temp).text();
	}
	else{
		return null;
	}
}
function getSelect($id){
	var selects;
	if(document.getElementById($id)!=null){
		selects = document.getElementById($id);
		var selectedValue = selects.options[selects.selectedIndex].value;
		return selectedValue;
	}else{
		return null;
	}	
}
function getCheckbox($id){
	var checkbox = $id;
	if($('#'+checkbox).prop('checked')){
		return 1;
	}
	else{
		return 0;
	}
}

function add_handlers(){
	
	//CHANGING TABS
	$('.member_action').unbind().click( function () {
		
		var action = $(this).attr('value');
		$('.member_action').attr('class','nodrop inactive-tab member_action');
		$(this).attr('class','nodrop active-tab member_action');
		//console.log("member_action="+action);
		if(action == 'view' || action == 'mail' || action == 'report'){
			manage_members(action,'init');
		}else{
			manage_members(action);
		}		
	});
	
	//CLICKING A PAGE SUBMISSION BUTTON
	$('.member_submit').unbind().click( function(){
		var action = $(this).attr('name');
		switch(action){
			case 'search':
				var search_type = getSelect('search_type');
				var search_value = getVal('search_value');
				manage_members(action,search_type,search_value);
				break;
			case 'edit':
				if(confirm("Save changes?")){
					var faculty = getVal('faculty');
					if(faculty == 'Other'){
						faculty = getVal('faculty2');
					}
					var is_new = getVal('is_new');
					if(is_new == 'new'){
						is_new = 1;
					}
					else{
						is_new = 0;
					}
					var member_id = $('#view').attr('name');
					$.ajax({
					type:"POST",
					url: "form-handlers/membership_update_handler.php",
					data: {
					"member_id"			:member_id,
					"firstname"			:getVal('firstname'),
					"lastname"			:getVal('lastname'),
					"address"			:getVal('address'),
					"city"				:getVal('city'), 
					"province"			:getVal('province'), 
					"postalcode"		:getVal('postalcode'),
					"canadian_citizen"	:getCheckbox('can1'), 
					"member_type"		:getVal("member_type"),
					"is_new"			:is_new,
					"alumni"			:getCheckbox('alumni1'),
					"since"				:getVal('since'),
					"faculty"			:faculty,
					"student_no"		:getVal('student_no'),
					"schoolyear"		:getVal('schoolyear'),
					"integrate"			:getCheckbox('integrate'),
					"has_show"			:getCheckbox('show1'),
					"show_name"			:getVal("show_name"),
					"email"				:getVal('email'),
					"primary_phone"		:getVal('phone1'),
					"secondary_phone"	:getVal('phone2'),
					"paid"				:getCheckbox('paid'),
					"music"				:getCheckbox('music'),
					"sports"			:getCheckbox("sports"),
					"live_broadcast"	:getCheckbox("live_broadcast"),
					"ads_psa" 			:getCheckbox("ads_psa" ),
					"discorder" 		:getCheckbox( "discorder" ),
					"news" 				:getCheckbox( "news" ),
					"tech" 				:getCheckbox( "tech" ),
					"outreach"			:getCheckbox("promos"),
					"show_hosting" 		:getCheckbox("show_hosting" ),
					"arts"				:getCheckbox( "arts"),
					"prog_comm"			:getCheckbox("prog_comm"),
					"digital_library"	:getCheckbox("digital_library"),
					"photography"		:getCheckbox("photography"),
					"dj"				:getCheckbox('dj'),
					"discorder_2"		:getCheckbox('discorder_2'),
					"tabling"			:getCheckbox('tabling'),
					"other"				:getVal("other"),
					"about"				:getVal('about'),
					"skills"			:getVal('skills'),
					"exposure"			:getVal('exposure'),
					"comments"			:getVal('comments'),
					"membership_year"	:getVal('member_year_select'),
					"userid"			:getText('userid'),
					"is_administrator"	:getCheckbox('is_administrator'),
					"is_staff"			:getCheckbox('is_staff'),
					"is_workstudy"		:getCheckbox('is_workstudy'),
					"is_volunteer"		:getCheckbox('is_volunteer'),
					"is_dj"				:getCheckbox('is_dj'),
					"is_member"			:getCheckbox('is_member'),
					"password"			:getVal('password')	 },
					dataType: "json"
					}).success(function(data) {
						if(data[0]=="ERROR"){
							//console.log(data);
							
							$.ajax({
							type:"POST",
							url: "form-handlers/log_handler.php",
							data: {"data":data[2] },
							dataType: "json"
							}).success(function(reply) {
								alert(data[1] + "Please contact Technical Services! This error has been logged.");
							}).fail(function(reply){
								alert(data[1] + "Please contact Technical Services! This error could not be logged. :(");
							});
						}
						else{
							alert("Successful Submission!");
						}
					}).fail(function(data){
						alert("An error occurred, please try saving again!");
						//console.log("error occurred" + JSON.stringify(data));
					});
				}
				break;
			case 'report':
				manage_members(action,'generate');
				break;
			case 'mail':
				var value = getVal('search_value');
				manage_members(action,'generate',value);
				break;
			default:
				//console.log("something went wrong");
				manage_members('init');
				break;
		}
	});

	//SEARCH TYPE LISTEN
	$('#search_type').unbind().change( function(){
		document.getElementById("search_container").innerHTML="";
		if(getVal('search_type')=='name'){
			$('#search_container').append("<input id=search_value placeholder='Enter a name'/>");
		}else{
			$('#search_container').append("<select id=search_value></select>");
			var searchval = $('#search_value');
			searchval.append("<option value=all>All</option>")
			for(var interest in interests_list){
				searchval.append("<option value="+interests_list[interest]+">"+interest+"</option>");
			}
		}
	});

    //NOTE: the off/on listener style was the ONLY way this worked. Standard JQuery ".click( function ..." did not work

    //Listener for viewing individual members from clicking on their row
    $('#membership').off('click','.member_row_element').on('click','.member_row_element',function(e){
        change_view('view','init',this.parentNode.getAttribute('name'));
    });
    //Listener for getting ID's when deleting
    $('#membership').off('click','#delete_button').on('click','#delete_button',function(e){
        var members_to_delete = [];
        var members_names = [];
        $('.delete_member').each( function (){
            if($(this).is(':checked')){
                members_to_delete.push($(this.closest('tr')).attr('name').toString());
                members_names.push( $(this).closest('td').siblings('.name').html() );
            }
        });
        var confirm_string = "Are you sure you want to delete these members forever?\n"+members_names.toString();
        if(confirm(confirm_string)){
            $.ajax({
                type:"POST",
                url: "form-handlers/membership/delete.php",
                data: {"ids" : JSON.stringify(members_to_delete)},
                dataType: "json",
                async: false
            }).success(function(data){
                alert("Successfully deleted: "+members_names.toString());
            }).fail(function(data){
                alert("Could not delete: "+members_names.toString()+"\n"+data[0]);
            });
        }
    });

    //Toggling red bar for showing members you are going to delete
    $('#membership').off('change','.delete_member').on('change','.delete_member',function(e) {
        $(this.closest('tr')).toggleClass('delete');

    });

	//MEMBER YEAR RELOAD
	$('#member_year_select').unbind().change( function(){
		var year = getVal('member_year_select');
		var id = document.getElementById("view").getAttribute('name');
		load_member_year(id,year);
	});

	//RADIO BUTTONS
	$('.can_status').unbind().click( function(){
		if( this.id =='can1'){
			$('#can2').removeAttr("checked");
		}
		else{
			$('#can1').removeAttr("checked");
		}
	});
	$('.show_select').unbind().click( function(){
		if( this.id =='show1'){
			$('#show2').removeAttr("checked");
		}
		else{
			$('#show1').removeAttr("checked");
		}
	});
	$('.alumni_select').unbind().click( function(){
		if( this.id =='alumni1'){ 
			$('#alumni2').removeAttr("checked");
		}
		else{
			$('#alumni1').removeAttr("checked");
		}
	});
	$('#faculty').change(function (){
		
		if($('#faculty').val() == "Other"){
			$('#faculty2').show();
		}else{
			$('#faculty2').hide();
		}	
	});

	//MEMBER TYPE: HIDE/SHOW STUDENT
	$('#member_type').unbind().change( function(){		
		if($('#member_type').val() == 'Student'){
			$('.student').show();
			$('.student').children().show();
		}else{
			$('.student').hide();
			//console.log("Hide student fields");
		}
	});

	$( "#from" ).datepicker({
      defaultDate: "+0d",
      changeMonth: true,
      numberOfMonths: 1,
      onClose: function( selectedDate ) {
        $( "#to" ).datepicker( "option", "minDate", selectedDate );
      }
    });
		
	$( "#to" ).datepicker({
      defaultDate: "+0d",
      changeMonth: true,
      numberOfMonths: 1,
      onClose: function( selectedDate ) {
        $( "#from" ).datepicker( "option", "maxDate", selectedDate );
      }
    });
}

function change_view(action,type,value){
	$('.member_action').attr('class','nodrop inactive-tab member_action');
	$("#"+action).attr('class','nodrop active-tab member_action');
	//console.log('manage_members'+action+type+value);
	manage_members(action,type,value);
}

function load_member_year(id,year){
	//$('#member_interests').innerHTML= "";
    console.log("Loading "+year);
    var interests = $('#member_interests');
    var interests_data = queryMembershipYear(id,year);
    $('#membership_interests_header').append("<div class='col2'>Paid<input type=checkbox id='paid' "+(interests_data['paid'] == 1 ? "checked=checked":"")+"/></div>");
    if( $('#arts').length <= 0 ){
        for(var interest in interests_list){
            if(interest != 'Other'){
                interests.append("<div class='col4'>"+interest+" <input type=checkbox id='"+interests_list[interest]+"' "+(interests_data[interests_list[interest]] == 1 ? "checked=checked":"") + "/></div>");
            }else {
                interests.append("<div class='col4'>Other:</div><div class='col4'><input type=text id=other "+(interests_data[interests_list[interest]] != null ? "value='"+interests_data[interests_list[interest]] +"'" : "")+"/></div>");
            }
        }
    }else {
        if(interests_data['paid']== 0){
            $('#paid').removeAttr('checked');
        }else{
            $('#paid').prop('checked','checked');
        }

        for (var interest in interests_list) {
            if (interests_data[interests_list[interest]] == 0 && interest != "Other") {
                $('#' + interests_list[interest]).removeAttr('checked');
            } else if (interests_data[interests_list[interest]] == 1 && interest != "Other") {
                $('#' + interests_list[interest]).prop('checked', 'checked');
            } else {
                $('#other').attr('value', interests_data.other);
            }
        }
    }
}

function manage_members(action_,type_,value_){
		var action = null;
		var type = null;
		var value = null;
		var paid = null;
		var year = null;
		var sort = null;
		var to = null;
		var from = null;
		if(action_){
			action = action_;
		}
		if(type_){
			type = type_;
		}
		if(value_){
			value = value_;
		} 
		//console.log("Manage members called, action="+action);
		switch(action){
			case 'init':
					


					document.getElementById("membership").innerHTML = " ";
					$('#membership').append("<ul id='membership_header'></ul>");
					var membership_header = $('#membership_header');
                    membership_header.append("<li>Search by <select id='search_type'><option value='name'> Name </option><option value='interest'> Interest </option></select> </li>");
					membership_header.append("<li id ='search_container'><input id='search_value' placeholder='Enter a name' /></li>");
                    membership_header.append("<li>Order By:<select id='sort_select'><option value='id'> Date Added </option><option value='lastname'> Last Name </option></select>");
					membership_header.append("<li>Filter by Year: <select id='year_select'><option value='all'>All</option></select></li>");
                membership_header.append("<li>Paid Status: <select id='paid_select'><option value='both'>Both</option><option value='1'>Paid</option><option value='0'>Not Paid</option></select></li>");
						actiontemp = 'get';
						typetemp = 'year';


                 $.ajax({
						type:"POST",
						url: "form-handlers/membership_handler.php",
						data: {"action" : actiontemp, "type" : typetemp},
						dataType: "json",
						async: false
					}).success(function(data){
							for( $j = 0; $j < Object.keys(data).length; $j++ ){
								$('#year_select').append("<option value="+data[$j].membership_year+">"+data[$j].membership_year+"</option>")
							}
					}).fail(function(){
						
					});

					$('#membership_header').append("<li><button class='member_submit' name='search'>Search</button></li>");
					$('#membership').append("<div id='member_result'></div>");
					add_handlers();
					manage_members('search','name');
				break;
			case 'search':
                paid = getVal('paid_select');
				year = getVal('year_select');				
				sort = getVal('sort_select');
				$.ajax({
					type:"POST",
					url: "form-handlers/membership_handler.php",
					data: {"action":action, "type":type, "sort":sort, "value":value, "paid":paid, "year":year},
					dataType: "json"
				}).done(function(data){
					document.getElementById("member_result").innerHTML = " ";
					if(data != null){ 
						if(Object.keys(data).length > 0){
							$('#member_result').append("<table id='membership_table'><tr id='headerrow'><th >Name</th><th >Email</th><th >Phone</th></tr></table>");
							if(year != 'all'){
								$('#headerrow').append('<th>Paid</th><th class=>Year</th>');
							}
                            $('#headerrow').append('<th><button id="delete_button">Delete</button></th>');
						}else{
							$('#member_result').append("Search returned no results");
						}

						for( $j = 0; $j < Object.keys(data).length; $j++ ){
							$('#membership_table').append("<tr id='row"+$j+"' name='"+data[$j].id+"' class='member_row'><tr>");
							$("#row"+$j).append("<td id='name_"+data[$j].id+"' class='member_row_element name'>"+data[$j].firstname+" "+data[$j].lastname+"</td>");
							$("#row"+$j).append("<td id='email_"+data[$j].id+"'class='member_row_element email'>"+data[$j].email+"</td>");
							$("#row"+$j).append("<td id='phone_"+data[$j].id+"'class='member_row_element phone'>"+data[$j].primary_phone+"</td>");
							if(year != 'all'){
								if(data[$j].paid == 1){
									$("#row"+$j).append("<td class='member_row_element'>Yes</td>");
								}
								else{
									$("#row"+$j).append("<td class='member_row_element'>No</td>");
								}
								$("#row"+$j).append("<td class='member_row_element'>"+data[$j].membership_year+"</td>");
							}
                            $("#row"+$j).append("<td><center><input type='checkbox' class='delete_member' id='delete_"+data[$j].id+"'></center>");
						}
					}
					else{ 
						document.getElementById("member_result").innerHTML = " ";
						$('#member_result').append("Search returned no results");
					}
				}).fail(function(){
					$('#member_result').html('connection error');
				});

				add_handlers();
				break;
				
			case 'view': // View/Edit Member
				switch(type){
					case 'init':
						document.getElementById("membership").innerHTML = " ";
						$('#membership').append("<div id='member_result'></div>");
						if(value == null){
							value = $('#view').attr('name');
						}
						else{
							$('#view').attr('name',value);
						}
						
						$.ajax({
						type:"POST",
						url: "form-handlers/membership_handler.php",
						data: {"action" : action, "type" : type, "value" : value},
						dataType: "json",
						async: false
						}).success(function(data){
							var fields = Object.keys(data[0]);
							

							for($j = 0; $j<15 ; $j++){
								if($j>8) $('#member_result').append("<div class ='member_result_row padded' id=row"+$j+"></div>");
								else 	$('#member_result').append("<div class ='member_result_row' id=row"+$j+"></div>");				
							}
							$('#member_result').append("<div class ='member_result_row padded'><hr></div>");
							$('#member_result').append("<div id='membership_year' class='member_result_row padded'></div>");
							$('#member_result').append("<div class ='member_result_row padded'><hr></div>");
							$('#member_result').append("<div id='member_permissions' class='member_result_row padded'></div>");
							
							//BASIC INFO
							$('#row0').append("<br><div class=col5>First Name:</div><div class=col5><input id='firstname' name='firstname' value='"+data[0].firstname+"''></div>");
							$('#row0').append("<div class=col5>Last Name:</div><div class=col5><input id='lastname' name='lastname' value='"+data[0].lastname+"''></div>");
							//ADDRESS
							$('#row1').append("<div class=col5>Address:</div><div class=col5><input id='address' name='address' value='"+data[0].address+"''></div>");
							$('#row1').append("<div class=col5> City:</div><div class=col5><input id='city' name='city' value='"+data[0].city+"''></div>");
							$('#row2').append("<div class=col5> Province:</div><div class=col5><select id='province'></select></div>");
							var province = $('#province');
							for(var region in provinces){
								if(data[0].province == provinces[region]){
									province.append("<option value="+provinces[region]+" selected>"+provinces[region]+"</option>")
								}else{
									province.append("<option value="+provinces[region]+">"+provinces[region]+"</option>");
								}
								
							}
							
							$('#row2').append("<div class=col5> Postal Code:</div><div class=col5><input id='postalcode' name='postalcode' value="+data[0].postalcode+" maxlength='6'></div>");
							//CANADIAN CITIZEN
							$('#row3').append("<div class=col5> Canadian Citizen:</div>");
							if(data[0].canadian_citizen == 1){
								$('#row3').append("<div class='col5'> Yes<input id='can1' class='can_status' type='radio' checked='checked' /> \
								No<input id='can2' class='can_status' type='radio' /></div>");
							}
							else{
								$('#row3').append("<div class='col5'> Yes<input id='can1' class='can_status' type='radio'  /> \
								No<input id='can2' class='can_status' type='radio' checked='checked' /></div>");
							}
							//MEMBER TYPE
							$('#row3').append("<div class='col5'>Member Type:</div><div id=membertype class='col4'> \
							<select id='is_new'></select></div>");
							if(data[0].is_new == "0"){
								$('#is_new').append("<option value='returning'>Returning</option><option value='new'>New</option>");
								
							}else{
								$('#is_new').append("<option value='new'>New</option><option value='returning'>Returning</option>");
								
							}

                            //Member Type Select : UBC Student, Community, Staff
                            $('#membertype').append("<select id='member_type'></select>");
                            var member_type_select = $('#member_type');
                            for(var member_type in member_types){
                                if(data[0].member_type == member_types[member_type]){
                                    member_type_select.append("<option value="+member_types[member_type]+" selected>"+member_types[member_type]+"</option>")
                                }else{
                                    member_type_select.append("<option value="+member_types[member_type]+">"+member_types[member_type]+"</option>");
                                }
                            }
							//ALUMNI STATUS
							if(data[0].alumni == 1){
								$('#row4').append("<div class='col5'>Alumni:</div><div class='col5' > Yes<input id='alumni1' class='alumni_select' type='radio' checked='checked' /> \
								No<input id='alumni2' class='alumni_select' type='radio' /></div>");
							}else{
								$('#row4').append("<div class='col5'>Alumni: </div><div class='col5' >Yes<input id='alumni1' class='alumni_select' type='radio' /> \
								No<input id='alumni2' class='alumni_select' type='radio' checked='checked' /></div>");
							}
							$('#row4').append("<div class='col5'>Member Since</div>");
							$('#row4').append("<div class='col5'><select id=since><option value='"+data[0].since+"'>"+data[0].since+"</input></select></div>");
							var d =new Date();
							var y = parseInt(d.getFullYear(),10);
							var y2 = 1924;
							for($i=y; $i > y2; $i--){
								$('#since').append("<option value='"+$i+"\/"+($i+1)+"'>"+$i+"/"+($i+1)+"</option>");
							}

							
							//BEGIN IF STUDENT
							if(data[0].member_type == 'Student' || data[0].member_type == 'student'){ 
								$('#row5').addClass('loaded');
								$('#row5').append("<div class='col5'>Faculty*: </div><div class='col5'><select id='faculty'><option value='"+data[0].faculty+"'>"+data[0].faculty+"</option></select><input id='faculty2' style='display:none' placeholder='Enter your Faculty'/></div>");
								
								var faculty_select = $("#faculty");
								for(faculty in faculty_list){
									faculty_select.append("<option value="+faculty_list[faculty]+">"+faculty_list[faculty]+"</option>");
								}
	
								$('#row5').append("<div id='student_no_container'> \
								<div class='col5'>Student Number*:</div> \
								<div class='col5'><input id='student_no' name='student_no' maxlength='8' value="+data[0].student_no+" onKeyPress='return numbersonly(this, event)''></input></div> \
								</div>");
								$('#row6').append("<div class='col1'>I would like to incorporate CiTR into my courses(projects, practicums, etc.): \
									<input id='integrate'  name='integrate' type='checkbox'"+ (data[0].integrate==1 ? 'checked=checked' : '' ) +" /> \
									<div class='col5'>Year*:</div> \
									<div class='col8'> \
										<select id='schoolyear' style='z-position=10;'> \
											<option value='"+data[0].schoolyear+"'>"+data[0].schoolyear+"</option> \
											<option value='1'>1</option> \
											<option value='2'>2</option> \
											<option value='3'>3</option> \
											<option value='4'>4</option> \
											<option value='5'>5+</option> \
										</select> \
									</div></div>");
							} //END IF STUDENT
							$('#row7').append("<div class='col5'>Has a show:</div>");
							if(data[0].has_show == 1){
								$('#row7').append("<div class='col5' >Yes<input id='show1' class='show_select' type='radio' checked='checked' /> \
								No<input id='show2' class='show_select' type='radio' /></div>");
							}
							else{
								$('#row7').append("<div class='col5' >Yes<input id='show1' class='show_select' type='radio' /> \
								No<input id='show2' class='show_select' type='radio' checked='checked'/></div>");
							}
							$('#row7').append("<div class='col5'>Show Name:</div><div class='col5'><input id=show_name "+(data[0].show_name ? ("value='"+data[0].show_name+"'"):"placeholder='Show name(s)'")+"</div>");
							$('#row8').append("<hr/>");
							//CONTACT INFORMATION
							//console.log("Email = "+data[0].email);
							$('#row9').append("<div class='col7'>Email Address*: </div> \
								<div class='col6'><input id='email' class='required' name='email' value='"+data[0].email+"' maxlength='40'  ></input></div> \
								<div class='col6'>Primary Number*:</div> \
								<div class='col6'><input id='phone1' class='required' name='phone1' value='"+data[0].primary_phone+"' maxlength='10' onKeyPress='return numbersonly(this, event)''></input></div> \
								<div class='col6'>Secondary Number:</div> \
								<div class='col6'><input id='phone2' name='phone2' "+ (data[0].secondary_phone ? ("value='"+data[0].secondary_phone+"'"):"placeholder='Secondary Phone'") +"maxlength='10' onKeyPress='return numbersonly(this, event)''></input></div>");
							$('#row10').append("<hr/>");
							//TEXT FIELDS

							
							$('#row11').append("<div class='col5'>About me:</div> \
							<textarea id='about' class='largeinput' rows='3'>"+(data[0].about ?(data[0].about):"")+"</textarea>")
							$('#row12').append("<div class='col5'>My Skills:</div> \
								<textarea id='skills' class='largeinput' rows='3'>"+(data[0].skills ?(data[0].skills):"")+"</textarea>");
							$('#row13').append("<div class='col5'>How did you hear about us?:</div> \
								<textarea id='exposure' class='largeinput' rows='3'>"+(data[0].exposure ?(data[0].exposure):"")+"</textarea>");
							$('#row14').append("<div class='col5'>Staff Comments:</div> \
								<textarea id='comments' class='largeinput' rows='3'>"+(data[0].comments ?(data[0].comments):"")+"</textarea>");
							add_handlers();
						}).fail(function(){
							
						});
						var years = queryMembershipYears(value);
                        $('#membership_year').append("<div id='member_interests_header' class='col2'> Select Year:<select id='member_year_select'></select></div>");
                        for(var i=0; i<years.length;i++){
                            $('#member_year_select').append("<option value="+years[i]+">"+years[i]+"</option>");
                        }

						$('#membership_year').append("<div id='member_interests' class='member_result_row padded'></div>");
                        console.log(years);
                        console.log(years.years);
						load_member_year(value,years[0]);
						$('#member_result').append("<div class ='member_result_row padded'><hr/></div>");
						$('#member_permissions').append("<div class='col5'>User Priveleges:</div>");
						var username;
						$.ajax({
						type:"POST",
						url: "form-handlers/membership_handler.php",
						data: {"action" : 'get', "type" : 'permission',"value":value},
						dataType: "json",
						async: false
						}).success(function(data){
							var permissions = $("#member_permissions");
							permissions.append("<div id='userid' style='display:none' value='"+data[0].userid+"'>"+data[0].userid+"</div>");
							
							var levels = data[0];
							for(var level in levels){
								if(level != 'userid' && level != 'username') {
                                    permissions.append("<div class='col5'>" + permission_levels[level] + ":<input type=checkbox id=is_" + level + " " + (levels[level] == 1 ? "checked=checked" : "") + "/></div>");
                                }
                            }
							username = data[0].username;
						}).fail(function(){
							
						});
						$('#member_result').append("<div id='member_password_change' class ='member_result_row padded'><center>Username: "+username+"  -- New Password:<input id='password' placeholder='Enter a new password' type='password'><br/> \
							<button class='member_submit' name='edit'>Save Changes</button></center></div>");
					default:
						break;
				}
				
				add_handlers();
				break;
			case 'report':
				switch(type){
					case 'init':
						document.getElementById("membership").innerHTML = " ";
						$('#membership').append('<select id="year_select"></select><button class="member_submit" name="report">Get Yearly Report</button><div id="membership_result"></div>');
						//Populate Dropdown with possible years to report on.
						actiontemp = 'get';
						typetemp = 'year';
						$.ajax({
							type:"POST",
							url: "form-handlers/membership_handler.php",
							data: {"action" : actiontemp, "type" : typetemp},
							dataType: "json",
							async: false
						}).success(function(data){
							for( $j = 0; $j < Object.keys(data).length; $j++ ){
								$('#year_select').append("<option value="+data[$j].membership_year+">"+data[$j].membership_year+"</option>")
							}
						}).fail(function(){
						
						});
					break;
					case 'generate':
						document.getElementById("membership_result").innerHTML = " ";
						year = getVal('year_select');	
						$.ajax({
							type:"POST",
							url: "form-handlers/membership_handler.php",
							data: {"action" : action,"year" : year},
							dataType: "json",
							async: false
						}).success(function(data){
						//console.log(data);
						var titles = ['member_reg_all','member_reg_year','member_paid','student','community','alumni','staff','arts','digital_library','discorder','discorder_2','dj','live_broadcast','music','news','photography','programming_committee','promotions_outreach','show_hosting','sports','tabling'];
						for( $j = 0; $j < titles.length; $j++ ){
								//console.log( data["num_"+titles[$j]][0] + " = " + data["num_"+titles[$j]][1]);
								$('#membership_result').append(data["num_"+titles[$j]][0] + " = " + data["num_"+titles[$j]][1]);
								if($j > 2){
									$('#membership_result').append(" ( "+(data["num_"+titles[$j]][1]/data["num_member_paid"][1]*100).toFixed(2)+"% )");
								}else if($j == 2){
									$('#membership_result').append(" ( "+(data["num_"+titles[$j]][1]/data["num_member_reg_year"][1]*100).toFixed(2)+"% )");
								}
								$('#membership_result').append("<br/>");
						}
						}).fail(function(){
						
						});
					break;
					default:
					break;
				}
				add_handlers();
				break;
			case 'mail':
				switch(type){
					case 'init':
						//console.log('Mail Init');
						var d = new Date();
						var today = ('0' + (d.getMonth()+1)).slice(-2) + "/"+('0' + d.getDate()).slice(-2) + "/" + d.getFullYear();
						var d2 = new Date();
						d2.setDate(d2.getDate() - 7);
						var week_ago = ('0' + (d2.getMonth()+1)).slice(-2) + "/"+('0' + d2.getDate()).slice(-2) + "/" + d2.getFullYear();
						document.getElementById("membership").innerHTML = " ";
						$("#membership").append("<ul id='membership_header'></ul>");
                        var membership_header = $('#membership_header');
                        membership_header.append("<li id='interest'>List:</li>");
                        $('#interest').append("<select id=search_value></select>");
							var title = ['All','Arts','Ads and PSAs','Digital Library','DJ101.9','Illustrate for Discorder','Writing for Discorder','Live Broadcasting','Music','News','Photography','Programming Committee','Promos and Outreach','Show Hosting','Sports','Tabling','Web and Tech'];
							var values =  ['all','arts','ads_psa','digital_library','dj','discorder','discorder_2','live_broadcast','music','news','photography','programming_committee','promotions_outreach','show_hosting','sports','tabling','tech'];
							$searchval = $('#search_value');
							for($i = 0; $i< title.length; $i++){
								$searchval.append("<option value='"+values[$i]+"'>"+title[$i]+"</option>");
							}
                        membership_header.append("<li>Paid Status: <select id='paid_select'><option value='both'>Both</option><option value='1'>Paid</option><option value='0'>Not Paid</option></select></li>");

                        membership_header.append("<li>Year: <select id='year_select'><option value='all'>All</option></select></li>");
                        membership_header.append("<li><ul id='join_filter'></ul></li>");
                        $('#join_filter').append("<li>Joined<input id='date_filter' type='checkbox'/></li>");
                        $('#join_filter').append("<li>from<input type='text' id='from' name='from' value='"+week_ago+"' /></li>");
                        $('#join_filter').append("<li>to<input type=text id='to' name='to' value='"+today+"' /></li>");


						var actiontemp = 'get';
						var typetemp = 'year';
					$.ajax({
						type:"POST",
						url: "form-handlers/membership_handler.php",
						data: {"action" : actiontemp, "type" : typetemp},
						dataType: "json",
						async: false
					}).success(function(data){
							for( $j = 0; $j < Object.keys(data).length; $j++ ){
								$('#year_select').append("<option value="+data[$j].membership_year+">"+data[$j].membership_year+"</option>")
							}
					}).fail(function(){
						
					});
						$('#membership_header').append("<li><button class='member_submit' name='mail'>Generate Email List</button></li>");
						$('#membership').append("<div id='member_result'></div>");
						add_handlers();
						break;
					case 'generate':
						//console.log('mail generate');
						paid = getVal('paid_select');
						//get year
						year = getVal('year_select');	
						sort = 'email';
						//console.log("Date Filter "+getCheckbox('date_filter'));
						if(getCheckbox('date_filter')){
							to = getVal('to');
							from = getVal('from');
						}
						$.ajax({
							type:"POST",
							url: "form-handlers/membership_handler.php",
							data: {"action":'mail', "type":'interest', "value":value, "paid":paid, "year":year, "from":from , "to":to },
							dataType: "json"
						}).done(function(data){
							document.getElementById("member_result").innerHTML = " ";
							$('#member_result').append("<textarea id=email_list></textarea>");
							if(data){
								var email_list = "";
								for( $j = 0; $j < Object.keys(data).length; $j++ ){
									email_list += data[$j].email + "; ";								
								}
								$('#email_list').val(email_list);	
							}
						}).fail(function(){
						});

					break;
				}
                add_handlers();
				break;
			default:
				manage_members('init');
				add_handlers();
				break;		
		}	
	}
	

