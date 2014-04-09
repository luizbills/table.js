#Table.js
HTML Table Controller (add/remove/sort/search rows)

### [Download](https://rawgithub.com/luizbills/table.js/master/src/table.js)
### [Demo](https://rawgithub.com/luizbills/table.js/master/samples/index.html)

##API Quick Start

Table constructor
```js
  var myTable = new Table({
    "id": "myTable", // id of table element
    "class": "table", // classes of element
    "columns": ['Column1', 'Column2', 'Column3'], // name of columns
    "data": [
      ['value1', 'value2', 'value3'], // values of first row
      ['value1', 'value2', 'value3'] // values of second row
    ]
  });
```

.addRow(rowData, prepend)
````js
  myTable.addRow(['value1', 'value2', 'value3'], false); // append: add a new row at final of table
  myTable.addRow(['value1', 'value2', 'value3', true); // prepend: add a new row at first position
```

.addRowAtIndex(rowData, index)
````js
  myTable.addRow(['value1', 'value2', 'value3'], index); // add a new row at determined index
```

.removeRow(element)
````js
  myTable.removeRow(trElement); // remove determined element (row/tr)
```

.removeRowByIndex(index)
````js
  myTable.removeRowByIndex(index); // remove element (row/tr) at index position
```

.sort(columnIndex, sortDescending)
````js
  myTable.sort(0, true); // sort in descending order by values at first column
```

.search(searchKey, columnIndex)
````js
  myTable.search('value', 0); // search for 'value' in elements at first column
```

.reset()
````js
  myTable.reset(); // return table cells to initial order
```

.clear()
````js
  myTable.clear(); // remove all rows of table
```

.clone()
````js
  var myTableCopy = myTable.clone();
```

##LICENSE

MIT Licensed: http://mit-license.org/luizbills/
