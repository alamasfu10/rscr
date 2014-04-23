/**
 * This example script will attempt to connect to a random station
 * in the "radioStations.json" file. Once connected, the raw audio
 * data is saved to a file with the name of the current "metadata".
 *
 * Each time the track changes, a new file will be created with the
 * appropriate name based off of the "metadata" event.
 *
 *   Usage:
 *     node examples/splitFileOnMetadata.js
 */
var fs = require("fs");
var radio = require("../lib/radio-stream");
var stations = require("./radioStations");

var stream = radio.createReadStream(stations.random().url);

var currentFile;
stream.on("data", function(chunk) {
  if (currentFile) {
    currentFile.write(chunk);
  }
});

stream.on("metadata", function(metadata) {
  var parsed = radio.parseMetadata(metadata);
  console.error("Switching to: \"" + parsed.StreamTitle + ".mp3\"");
  if (currentFile) {
    currentFile.end();
  }
  currentFile = fs.createWriteStream(parsed.StreamTitle + ".mp3");
});
