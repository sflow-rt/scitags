// author: InMon Corp.
// version: 1.1
// date: 11/17/2024
// description: Create map of registered tags from scitags.org
// copyright: Copyright (c) 2023-2024 InMon Corp. ALL RIGHTS RESERVED

var url = getSystemProperty('scitags.url') || 'https://www.scitags.org/api.json';

function reverseBits(val,n) {
  var bits = val.toString(2).padStart(n, '0');
  var reversed = bits.split('').reverse().join('');
  return parseInt(reversed,2);
}

function flowlabel(expId,activityId) {
  return (reverseBits(expId,9) << 9) + (activityId << 2);
}

function updateMap() {
  var tags, parsed;
  try {
    tags = http(url);
    parsed = JSON.parse(tags);
  } catch(e) {
    logWarning('SCITAGS http get failed ' + e);
    return;
  }
  var experiments = parsed && parsed.experiments;
  if(!experiments) return;
  var map = {};
  experiments.forEach(function(experiment) {
    var expName = experiment.expName;
    var expId = experiment.expId;
    var activities = experiment.activities;
    activities.forEach(function(activity) {
      var activityName = activity.activityName;
      var activityId = activity.activityId;
      var key = (expName + '.' + activityName).replace(/ /g,"_");
      map[key] = [ flowlabel(expId,activityId), expId+'.'+activityId ];
    });
  });

  setMap('scitag',map);
}

updateMap();
setIntervalHandler(updateMap,600);
