
$("#downloadBtn").on("click", (event)=>{
    event.preventDefault();
    $.ajax({
        type: "POST",
        url: "/download",
        data: {
            url: $("#urlInput").val(),
            dlPlaylist: $("#dlPlaylist").is(":checked")? true: false,
            audioOnly: $("#audioOnly").is(":checked")? true: false,
        },
        success: function(data){
            let extension = data[2].split('.').pop();
            window.location.href = `/download?id=${data[1]}&filename=${data[0]}&extension=${extension}`;
        },
        error: function(){
            alert("Please input valid url");
        }
    })
});

