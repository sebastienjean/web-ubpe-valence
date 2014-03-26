'use strict';

function updateTable(data) {
  var values = [];
  for (var propName in settings.fieldLabels) {
    values.push(data[propName]);
  };
  $('<tr></tr>').append('<td>' + values.join('</td><td>') + '</td>').insertAfter('#headers');
}
