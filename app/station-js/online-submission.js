var form, trackButton, albumArtButton, submitButton;
var artistField, contactField, recordField, cityField, memberField;
var albumField, genrePicker, dateField, canadaBox, vancouverBox;
var femArtistBox, commentField, cover, trackNumber, nameField;
var composerField, performerField, albumViewer;
var totalTracks = 0;
var totalTrackSize = 0;
var files;

window.addEventListener('load', function() {
  form           = document.getElementById("submit-field");
  albumArtButton = document.getElementById("album-art-input-button");
  trackButton    = document.getElementById("new-track-button-input");
  submitButton   = document.getElementById("submit-button");
  artistField    = document.getElementById("artist-name");
  contactField   = document.getElementById("contact-email");
  recordField    = document.getElementById("record-label");
  cityField      = document.getElementById("home-city");
  memberField    = document.getElementById("member-names");
  albumField     = document.getElementById("album-name");
  genrePicker    = document.getElementById("genre-picker");
  dateField      = document.getElementById("date-released");
  canadaBox      = document.getElementById("canada-artist");
  vancouverBox   = document.getElementById("vancouver-artist");
  femArtistBox   = document.getElementById("female-artist");
  commentField   = document.getElementById("comments-box");
  albumViewer    = document.getElementById("album-viewer");

  submitButton.addEventListener('click', submitForm);

  albumArtButton.addEventListener('change', handleAlbum, false);

  trackButton.addEventListener('change', handleTracks, false);

});

function submitForm() {

  if (totalTrackSize > 525000000) {
    alert("Your submission is too big. For large submissions, please email us.");
  } else {

    var missing = [];
    var success = true;

    var artist      = artistField.value;
    var email       = contactField.value;
    var label       = recordField.value;
    var location    = cityField.value;
    var credit      = memberField.value;
    var title       = albumField.value;
    var e           = document.getElementById('genre-picker');
    var genre       = e.options[e.selectedIndex].value;
    var releasedate = dateField.value;
    var cancon      = ($('#female-artist').prop('checked', true)) ? 1 : 0;
    var local       = ($('#canada-artist').prop('checked', true)) ? 1 : 0;
    var femcon      = ($('#vancouver-artist').prop('checked', true)) ? 1 : 0;
    var description = $('#comments-box').val();

    var alertString = "You are missing the following:";

    if (artist == "") {
      success = false;
      // missing.push("\n• Artist / Band name");
      alertString += "\n• Artist / Band name";
    }
    if (email == "") {
      success = false;
      // missing.push("\n• Contact email");
      alertString += "\n• Contact email";
    }
    if (location == "") {
      success = false;
      // missing.push("\n• Home city");
      alertString += "\n• Home city";
    }
    if (title == "") {
      success = false;
      // missing.push("\n• Album name");
      alertString += "\n• Album name";
    }
    if (genre == "") {
      success = false;
      // missing.push("\n• Genre");
      alertString += "\n• Genre";
    }

    // Check that files have been added
    var tracks = $("#submit-field").children();
    if (tracks.length < 1) {
      // missing.push("\n• Music files to upload");
      alertString += "\n• Music files to upload";
      success = false;
    }

    // Checks that required track info has been added
    var trackNumberCheck = [];
    var missingTrackNumbers = 0;
    var missingTrackNames = 0;
    var trackNumError = false;
    var songListObj = {};

    for (var i = 0; i < tracks.length; i++) {

      var thisTrack = $(tracks.get(i));

      var trackNumberValue = thisTrack.find(".track-number-field").val();
      var trackName      = thisTrack.find(".input-track-field-name").val();
      var trackComposer  = thisTrack.find(".input-track-field-composer").val();
      var trackPerformer = thisTrack.find(".input-track-field-performer").val();

      var trackObj = {
        number    : Number(trackNumberValue),
        name      : trackName,
        composer  : trackComposer,
        performer : trackPerformer,
      }

      songListObj['track' + i] = trackObj;

      if (trackName == "") {
        success = false;
        missingTrackNames++;
      }

      if (trackNumberValue == "" ) {
        success = false;
        // missing.push("\n• Track numbers");
        missingTrackNumbers++;
      } else if ( isNaN(parseInt(trackNumberValue)) ) {
        success = false;
        trackNumError = true;
      } else {
        trackNumberCheck.push(trackNumberValue);
      }
    }

    if (missingTrackNames == 1) {
      alertString += "\n• 1 Track name";
    } else if (missingTrackNames > 1) {
      alertString += "\n• " + missingTrackNames + " track names";
    }

    if (missingTrackNumbers == 1) {
      alertString += "\n• 1 Track number";
    } else if (missingTrackNumbers > 1) {
      alertString += "\n• " + missingTrackNumbers + " track numbers";
    }

    if (trackNumError) {
      alertString += "\n\n Only numbers may be used in the track number field";
    }

    if (success) { // possibly add sorting algorithm here in case of large array
      var duplicate = false;
      for (var i = 0; i < trackNumberCheck.length; i++) {
        if (duplicate == true) break;
        for (var j = i + 1; j < trackNumberCheck.length; j++) {
          if (parseInt(trackNumberCheck[i]) == parseInt(trackNumberCheck[j])) {
            success = false;
            // missing.push("\n Check for duplicate track numbers");
            alertString = "There are duplicate track numbers — please correct"
            duplicate = true;
            break;
          }
        }
      }
    }

    if (success) {

      console.log(songListObj);

      var input = $('#album-art-input-button').prop('files')[0];

      var data = new FormData();

      data.append('format_id', '6');
      data.append('artist', artist);
      data.append('email', email);
      data.append('label', label);
      data.append('location', location);
      data.append('credit', credit);
      data.append('title', title);
      data.append('genre', genre);
      data.append('releasedate', releasedate);
      data.append('femcon', femcon);
      data.append('cancon', cancon);
      data.append('local', local);
      data.append('description', description);
      data.append('songlist', 10);
      data.append('art_url', input);
/*
      for (var i = 0; i < tracks.length; i++) {
        var x = $(tracks.get(i));
        var t = 'track' + i;
        data.append(t + '[number]', x.find(".track-number-field").val());
        data.append(t + '[name]', x.find(".input-track-field-name").val());
        data.append(t + '[composer]', x.find(".input-track-field-composer").val());
        data.append(t + '[performer]', x.find(".input-track-field-performer").val());
        data.append(t + '[file]', $('#new-track-button-input').prop('files')[i]);
      }
*/
      createSubmission(data);

    } else {
      alert(alertString);
    }
  }

}

function handleAlbum(evt) {
  files = evt.target.files;
  cover = files[0];

  if(cover.type.match('image.*') && cover.size < 5000000) {
    var reader = new FileReader();

    reader.onload = (function(theFile) {
      return function(e) {
        var span = document.createElement('span');
        span.setAttribute('id', 'thumb-span');
        span.innerHTML = ['<img id="thumb-src" class="thumb" src="', e.target.result, '" title="', escape(theFile.name), '"/>'].join('');
        albumViewer.innerHTML = "";
        // document.getElementById("album-viewer").insertBefore(span, null);
        albumViewer.insertBefore(span, null);
      };
    })(cover);

    reader.readAsDataURL(cover);
  } else if (cover.type.match('image.*')) {
    alert("Please choose a smaller image.");
  } else {
    alert("Please choose an image.");
  }
}

function handleTracks(evt) {
  var files = evt.target.files;
  var filesAdded = 0;
  var fileWarning = false;
  var sizeWarning = false;

  // TODO: Needs to remove non-music files from files[]
  for (var i = 0, f; f = files[i]; i++) {

    if (!f.type.match('audio.*')) {
      fileWarning = true;
      continue;
    }

    if (f.size > 175000000) {
      sizeWarning = true;
      continue;
    }

    var fileName = f.name;
    addTrackForm(fileName, (totalTracks + i + 1) );
    filesAdded++;

    totalTrackSize += f.size;
  }
  if (fileWarning) alert("Please only upload audio files");
  if (sizeWarning) alert("Please keep file size below 175 megabytes.\nIf you want to submit large files, please email us.");
  totalTracks = totalTracks + filesAdded;
}

function addTrackForm(fileName, trackNo) {
  // Create the surrounding div.
  var divNode = document.createElement("div");
  divNode.setAttribute("id", "track-" + trackNo);
  divNode.setAttribute("class", "track-form");

  // Add the file name
  var childNode = document.createElement("p");
  childNode.setAttribute("class", "track-file-name");
  childNode.appendChild(document.createTextNode("File name: " + fileName));
  divNode.appendChild(childNode);

  // Add the track number field
  childNode = document.createElement("p");
  childNode.setAttribute("class", "track-number-label");
  childNode.appendChild(document.createTextNode("★ Track number:"));
  divNode.appendChild(childNode);

  childNode = document.createElement("input");
  childNode.setAttribute("class", "track-number-field");
  childNode.setAttribute("value", trackNo);
  divNode.appendChild(childNode);

  // Add the track name field
  childNode = document.createElement("p");
  childNode.setAttribute("class", "input-track-label");
  childNode.appendChild(document.createTextNode("★ Track name:"));
  divNode.appendChild(childNode);

  childNode = document.createElement("input");
  childNode.setAttribute("class", "input-track-field input-track-field-name");
  divNode.appendChild(childNode);

  // Add the composer field
  childNode = document.createElement("p");
  childNode.setAttribute("class", "input-track-label");
  childNode.appendChild(document.createTextNode("Composer(s):"));
  divNode.appendChild(childNode);

  childNode = document.createElement("input");
  childNode.setAttribute("class", "input-track-field input-track-field-composer");
  divNode.appendChild(childNode);

  // Add the performer field
  childNode = document.createElement("p");
  childNode.setAttribute("class", "input-track-label");
  childNode.appendChild(document.createTextNode("Performer(s):"));
  divNode.appendChild(childNode);

  childNode = document.createElement("input");
  childNode.setAttribute("class", "input-track-field input-track-field-performer");
  childNode.setAttribute("value", artistField.value);
  divNode.appendChild(childNode);

  form.appendChild(divNode);
}
