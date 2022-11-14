
$("#downloadBtn").on("click", (event)=>{
    event.preventDefault();
    var options = {
        url: $("#urlInput").val(),
        audioOnly: $("#audioOnly").is(":checked")? true: false,
    }

    var extension = "webm";
    if (options.audioOnly){
        extension = "mp3";
    }

    $.ajax({
        type: "POST",
        url: "/download",
        data: options,
        success: function(data){
            window.location.href = `/download?id=${data[1]}&filename=${data[0]}&extension=${extension}`;
        },
        error: function(){
            alert("Unexpected error occured");
        }
    })
});

