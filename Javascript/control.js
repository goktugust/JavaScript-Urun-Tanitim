$(document).ready(function () {
    const itemsInBucString = localStorage.getItem('bucketProducts');
    function handle( str ) {
        if (str != null) {
            const parsedBucketItems = JSON.parse(str);
            $("#productCount").text(parsedBucketItems.length);
        }else {
            $("#productCount").text("");
        }
    }

    handle(itemsInBucString)
});