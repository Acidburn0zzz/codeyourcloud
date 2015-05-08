var drive = {};
//most of these are from Google's website
drive.getFile = function(fileId, callback){
	var request = gapi.client.drive.files.get({
	    'fileId': fileId
	  });
	  request.execute(function(resp) {
	    callback(resp);
	  });
};

drive.trash = function(fileId){
	if(fileId !== "welcome"){
	  var request = gapi.client.drive.files.trash({
	    'fileId': fileId
	  });
	  request.execute(function(resp) {
		  if(!resp.error){
			  removetab(fileId);
			  get_tree(myRootFolderId);
		  }
	  });	
	}
};

drive.getContentOfFile = function(theID, callback){ //gets the content of the file
    gapi.client.request({'path': '/drive/v2/files/'+theID,'method': 'GET',callback: function ( theResponseJS, theResponseTXT ) {
        var myToken = gapi.auth.getToken();
		var myXHR   = new XMLHttpRequest();
        myXHR.open('GET', theResponseJS.downloadUrl, true );
        myXHR.setRequestHeader('Authorization', 'Bearer ' + myToken.access_token );
        myXHR.onreadystatechange = function( theProgressEvent ) {
            if (myXHR.readyState == 4) {
                if ( myXHR.status == 200 ) {
                	code = myXHR.response;
                    callback(code);
			   	}
            }
        }
        myXHR.send();
        }
    });
};

drive.retrieveAllFilesInFolder = function(folderId, callback) {
  var retrievePageOfChildren = function(request, result) {
    request.execute(function(resp) {
      result = result.concat(resp.items);
      var nextPageToken = resp.nextPageToken;
      if (nextPageToken) {
        request = gapi.client.drive.children.list({
          'folderId' : folderId,
          'pageToken': nextPageToken
        });
        retrievePageOfChildren(request, result);
      } else {
        callback(result, folderId);
      }
    });
  }
  var initialRequest = gapi.client.drive.children.list({
      'folderId' : folderId
    });
  retrievePageOfChildren(initialRequest, []);
};

//gets the permissions
function getP(fileId) {
	var request = gapi.client.drive.permissions.list({
		'fileId': fileId
	});
	request.execute(function(resp) {
		var ret = false;
		for(var i = 0; i < resp.items.length; i++){
			if(resp.items[i].id === userId || resp.items[i].id === "anyone" || resp.items[i].id === "anyoneWithLink" || resp.items[i].emailAddress === myEmail){
				ret = true;
			}
		}
		if(ret === false){
			//if you don't have them....
			window.location = "https://codeyourcloud.com/error/permission";
		}
	});
}


//NEW FILE
var insert_folder_dest = ""; //the destination to insert a new file into

function insertNewFile(folderId) {
	var content = ""; //default text
	insert_folder_dest = folderId; //store it globally :( not best practice
	
	var contentArray = new Array(content.length); //convert it!
    for (var i = 0; i < contentArray.length; i++) {
    	contentArray[i] = content.charCodeAt(i);
    }
    var byteArray = new Uint8Array(contentArray);
    var blob = new Blob([byteArray], {type: 'text/plain'}); //this is the only way I could get this to work
	insertFile(blob, folderId, fileInserted);
}
function fileInserted(d) {
	//this function is triggered once the file is inserted
	//if it's not the defalt, move it to the correct place
	if(insert_folder_dest !== myRootFolderId){	
		insertFileIntoFolder(insert_folder_dest, d.id);
		removeFileFromFolder(d.parents[0].id,d.id);
	}
	
	//great, now add the tab
	addTab("loading...",d.id,false);
	
	if(insert_folder_dest === myRootFolderId){
		get_tree(myRootFolderId);
	}
}
function insertFileIntoFolder(folderId, fileId) {
  var body = {'id': folderId};
  var request = gapi.client.drive.parents.insert({
    'fileId': fileId,
    'resource': body
  });
  request.execute(function(resp) { });
}
function removeFileFromFolder(folderId, fileId) {
  var request = gapi.client.drive.parents.delete({
    'parentId': folderId,
    'fileId': fileId
  });
  request.execute(function(resp) { });
}



function insertFile(fileData, folderId, callback) {
  const boundary = '-------314159265358979323846';
  const delimiter = "\r\n--" + boundary + "\r\n";
  const close_delim = "\r\n--" + boundary + "--";

  var reader = new FileReader();
  reader.readAsBinaryString(fileData);
  reader.onload = function(e) {
    var contentType = fileData.type || 'application/octet-stream';
    var metadata = {
      'title': folderId + ".txt",
      'mimeType': contentType
    };

    var base64Data = btoa(reader.result);
    var multipartRequestBody =
        delimiter +
        'Content-Type: application/json\r\n\r\n' +
        JSON.stringify(metadata) +
        delimiter +
        'Content-Type: ' + contentType + '\r\n' +
        'Content-Transfer-Encoding: base64\r\n' +
        '\r\n' +
        base64Data +
        close_delim;

    var request = gapi.client.request({
        'path': '/upload/drive/v2/files',
        'method': 'POST',
        'params': {'uploadType': 'multipart'},
        'headers': {
          'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
        },
        'body': multipartRequestBody});
    if (!callback) {
      callback = function(file) {
      };
    }
    request.execute(callback);
  }
}

function renameFile(fileId, newTitle) {
  //renames the file. DUH
  var body = {'title': newTitle};
  var request = gapi.client.drive.files.patch({
    'fileId': fileId,
    'resource': body
  });
  request.execute(function(resp) {
  });
}



function insert_saveas(content, title, folderId){
	//the "save as" function. It just inserts a new file in a new place
	var contentArray = new Array(content.length);
    for (var i = 0; i < contentArray.length; i++) {
    	contentArray[i] = content.charCodeAt(i);
    }
    var byteArray = new Uint8Array(contentArray);
    var blob = new Blob([byteArray], {type: 'text/plain'});
	insertFile(blob, folderId, saveas_inserted);
}

function saveas_inserted(inserted_file) {
	//called once file inserted
	var folder_id = save_as_destination;
    renameFile(inserted_file.id, $("#saveas-input").val());
	if(folder_id !== myRootFolderId){	
		insertFileIntoFolder(folder_id, inserted_file.id);
		removeFileFromFolder(inserted_file.parents[0].id,inserted_file.id);
	}
	
	addTab("loading...",inserted_file.id,false);
}

function new_file(){
	insertNewFile(myRootFolderId);
}

drive.updateFile = function(fileId, fileMetadata, fileData, callback) { //is the callback necessary?
  const boundary = '-------314159265358979323846';
  const delimiter = "\r\n--" + boundary + "\r\n";
  const close_delim = "\r\n--" + boundary + "--";

  var reader = new FileReader();
  reader.readAsBinaryString(fileData);
  reader.onload = function(e) {
    var contentType = fileData.type || 'application/octet-stream';
    var base64Data = btoa(reader.result);

    var multipartRequestBody =
        delimiter +
        'Content-Type: application/json\r\n\r\n' +
        JSON.stringify(fileMetadata) +
        delimiter +
        'Content-Type: ' + contentType + '\r\n' +
        'Content-Transfer-Encoding: base64\r\n' +
        '\r\n' +
        base64Data +
        close_delim;

    var request = gapi.client.request({
        'path': '/upload/drive/v2/files/' + fileId,
        'method': 'PUT',
        'params': {'uploadType': 'multipart', 'alt': 'json'},
        'headers': {
          'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
        },
        'body': multipartRequestBody});
    if (!callback) {
      callback = function(file) {
      };
    }
    request.execute(callback);
  }
}