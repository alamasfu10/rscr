/**
 * This example script will attempt to connect to a random station
 * in the "radioStations.json" file, parse the metadata, and write
 * the clean, raw audio data to 'stdout'. Metadata and other debug
 * info gets printed to 'stderr'.
 *
 *   Usage:
 *     node examples/basic.js > out.mp3
 */
var radio = require("../lib/radio-stream");
var stations = require("./radioStations");

//Creates a random stream to a radio url existing in radioStations.json file
//var stream = radio.createReadStream(stations.random().url);
var stream = radio.createReadStream("http://icecast3.977music.com/comedy");

// TEMPORARY
function testFile(filename, metaint) {
  stream.connection.destroy();
  stream.connection = require("fs").createReadStream(filename);
  stream.connection.on("data", stream.bindedOnData);
  stream.metaint = metaint;
}
//testFile(__dirname + "/tests/dumps/TheComedyChannel-1-16000.mp3", 16000);

stream.on("connect", function() {
  console.error("Radio Stream connected!");
  console.error(stream.headers);
});

stream.on("data", function(chunk) {
  process.stdout.write(chunk);
});

stream.on("metadata", function(title) {
  console.error(title);
});
