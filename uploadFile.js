var gcloud = require("gcloud");

var storage = gcloud.storage({
  projectId: "em...",
  keyFilename: 'auth.json'
});


storage.createBucket('octocats', function(err, bucket) {
    var blob = bucket.file("/public/images/1.jpg");
    var blobStream = blob.createWriteStream();

    blobStream.on('error', function (err) {
        console.error(err);
    });
    blobStream.on('finish', function () {
        var publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
        console.log(publicUrl);
    });
    fs.createReadStream("octofez.png").pipe(blobStream);

});
