var db;

function onDeviceReady() {
	db = window.openDatabase("Database", "1.0", "tng", 200000);
	db.transaction(createTable, errorCB, querySuccess);
	localStorage.uuid = device.uuid;
}

function createTable(tx) {
	tx.executeSql('DROP TABLE IF EXISTS RESULTS');
	tx.executeSql('CREATE TABLE IF NOT EXISTS RESULTS (id unique, ResultId, CourseId, HoleId, StrokeId, ClubId, FeelId)');
}

function insertResults(tx) {
	tx.executeSql('INSERT INTO RESULTS (CourseId, HoleId, StrokeId, ClubId, FeelId) VALUES ('+localStorage.courseId+', '+localStorage.holeId+', '+localStorage.strokeId+', '+localStorage.clubId+', '+localStorage.feelId+')');
}

function errorCB(err) {
	alert("Error processing SQL: "+err.message);
}
	
function querySuccess(tx, results) {
	/*var len = results.rows.length;
	alert('RESULTS table: ' + len + ' rows found.');
	for (var i=0; i<len; i++){
		alert('Row = ' + i + ' ID = ' + results.rows.item(i).id + ' Hole =  ' + results.rows.item(i).HoleId + ' Stroke =  ' + results.rows.item(i).StrokeId);
	}*/
}

function selectHoles(tx2) {
	tx2.executeSql('SELECT * FROM RESULTS', [], holeSuccess, errorCB);
}

function holeSuccess(tx, results) {
	var len = results.rows.length;
	for (var i=0; i<len; i++){
		item=results.rows.item(i);
		if ($('#'+item.HoleId).length == 0){
			var btn = '<div data-role="collapsible" id="'+item.HoleId+'"><h3>Hole '+item.HoleId+'</h3>'+
						'<p>Club: '+item.ClubId+'</p><p>Stroke: '+item.StrokeId+'</p></div>';
			$('#stats').append(btn);
			$('div[data-role="collapsible"]').collapsible();
		}
	}
}

function successINS() {
	db = window.openDatabase("Database", "1.0", "tng", 200000);
	db.transaction(selectHoles, errorCB);
}

// LOGIN
$(document).on('pagebeforeshow', '#loginpage', function(){
	$('#loginForm').validate();
});

// INDEX
$(document).on('pagebeforeshow', '#indexpage', function(){
	document.addEventListener("deviceready", onDeviceReady, false);
});

// COURSES
$(document).on('pagebeforeshow', '#coursespage', function(){
	
	if ($('#ongoing').children().length == 0){
		var bl = 'a';
		var c = 0;
		$.ajax({
			type: 'GET',
			url: GetServiceAddress() + 'courses.json',
			dataType: 'JSON',
			success: function(data) {
				$.each(data, function(i,item){
						item=item.Course;
						if (c%2==0){bl='a'}else{bl='b'};
						var btn = '<div class="ui-block-'+bl+'"> <a data-role="button" data-transition="none" data-theme="b" href="startinghole.html" id="'+item.id+'">'+item.Name+'</a> </div>';
						c++;
						$('#ongoing').append(btn);
						$('a[data-role="button"]').button();
						$('#'+item.id).on("click", function(){
							localStorage.courseId = item.id;
						});
					});
			},
			error: function(jqXHR, textStatus, errorThrown) {
				alert(errorThrown);
			}
		});
	}
});

// STARTINGHOLE
$(document).on('pagebeforeshow', '#startingholepage', function(){	

	localStorage.strokeId = 1;
	$('#btnHoleOne').click(function () {
        var hole = $(this).attr("name");
		localStorage.holeId = hole;
    });
	
	$('#btnHoleTen').click(function () {
        var hole = $(this).attr("name");
		localStorage.holeId = hole;
    });
});

// CLUB
$(document).on('pagebeforeshow', '#clubpage', function(){

	$('h4').text("Hole " + localStorage.holeId + " | " + "Stroke " + localStorage.strokeId);
	
	if ($('#ongoing').children().length == 0){
		var bl = 'a';
		var c = 0;
		$.ajax({
			type: 'GET',
			url: GetServiceAddress() + 'clubs.json',
			dataType: 'JSON',
			success: function(data) {
				$.each(data, function(i,item){
						item=item.Club;
						if (c%2==0){bl='a'}else{bl='b'};
						var btn = '<div class="ui-block-'+bl+'"> <a data-role="button" data-transition="none" data-theme="b" href="feel.html" id="'+item.id+'">'+item.Name+'</a> </div>';
						c++;
						$('#ongoing').append(btn);
						$('a[data-role="button"]').button();
						$('#'+item.id).on("click", function(){
							localStorage.clubId = item.id;
						});
					});
			},
			error: function(jqXHR, textStatus, errorThrown) {
				alert(errorThrown);
			}
		});	
	}	
});

// FEEL
$(document).on('pagebeforeshow', '#feelpage', function(){
	$('a[class="ui-link"]').click(function () {
		localStorage.feelId = this.id;
    });
});

// RESULT
$(document).on('pageshow', '#resultpage', function(){
	db.transaction(insertResults, errorCB, successINS);
	
	$('#btnNextStroke').click(function () {
        localStorage.strokeId = Number(localStorage.strokeId) + 1;
    });
	
	$('#btnEndHole').click(function () {
        localStorage.holeId = Number(localStorage.holeId) + 1;
		localStorage.strokeId = 1;
    });
});

// ABMCLUBS
$(document).on('pagebeforeshow', '#abmclubspage', function(){
	/*$.ajax({
		type: 'GET',
		url: GetServiceAddress() + 'get_clubs.php?&jsoncallback=?',		
		dataType: 'JSONp',
		success: function(data) {
			//do something with the data
			$.each(data, function(i,item){
					alert(item.Name);
				});
		},
		error: function(jqXHR, textStatus, errorThrown) {
			//do something if there is an error
			alert(errorThrown);
		}
	});*/
});