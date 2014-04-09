/*
 * Table.js v0.1.0
 * MIT Licensed http://luizbills.mit-license.org
*/
var Table = (function(document) {
  function Table(options) {
    var table, thead, tbody, tr, rows,
      i, len;

    // create the table element
    table = document.createElement('table');
    // set class
    if (options.class) {
      table.className = options.class;
    }
    // set id
    if (options.id) {
      table.id = options.id;
    }

    // create thead
    thead = document.createElement('thead');
    tr = document.createElement('tr');
    // create thead columns
    for (i = 0, len = options.columns.length; i < len; i++) {
      var td = document.createElement('td');
      td.innerText = options.columns[i];
      td.columnIndex = i;
      tr.appendChild(td);
    }
    thead.appendChild(tr);

    // create tbody
    tbody = document.createElement('tbody');

    table.appendChild(thead);
    table.appendChild(tbody);

    // Table DOM Objects Reference
    this.dom = {
      table: table,
      thead: thead,
      tbody: tbody,
      rows: []
    };

    // data object for quick access
    this.data = [];

    if (options.data) {
      // create initial rows
      for (i = 0, len = options.data.length; i < len; i++) {
        this.addRow(options.data[i], false);
      };
    }


    // append table to parent element
    if (options.parentId) {
      document.getElementById(options.parentId).appendChild(table);
    }
  }

  Table.prototype = {
    _sorted: false,
    _showingSearchResults: false,
    _reseted: true,

    addRow: function(rowData, prepend) {
      var tr = document.createElement('tr'),
        i, len;

      for (i = 0, len = rowData.length; i < len; i++) {
        var td = document.createElement('td');
        td.innerText = rowData[i];
        tr.appendChild(td);
      }
      // add row element reference at last index
      // facilitate table reset
      rowData.push(tr);
      if (prepend) {
        this.dom.tbody.insertBefore(tr, this.dom.rows[0]);
        this.dom.rows.unshift(tr)
        this.data.unshift(rowData);
      } else {
        this.dom.tbody.appendChild(tr);
        this.dom.rows.push(tr);
        this.data.push(rowData);
      }

      return tr;
    },

    addRowAtIndex: function(rowData, index) {
      var tr;
      if (index >= this.data.length) {
        // insert cell at last position
        tr = this.addRow(rowData, false);
      } else if (index <= 0) {
        // insert cell at first position
        tr = this.addRow(rowData, true);
      } else {
        // create an tr element with tds
        tr = document.createElement('tr');
        for (i = 0, len = rowData.length; i < len; i++) {
          var td = document.createElement('td');
          td.innerText = rowData[i];
          tr.appendChild(td);
        }
        rowData.push(tr);
        // insert cell at determined position
        this.dom.tbody.insertBefore(tr, this.dom.rows[index]);
        this.dom.rows.splice(index, 0, tr);
        this.data.splice(index, 0, rowData);
      }
      return tr;
    },

    removeRow: function(rowElement) {
      var i, len = this.dom.rows.length;
      for (i = 0; i < len; i++) {
        if (rowElement === this.dom.rows[i]) {
          this.removeRowByIndex(i);
          break;
        }
      }
    },

    removeRowByIndex: function(index) {
      var i, len = this.data.length,
        rows = this.dom.rows;

      if (!rows[index]) {
        throw new Error('Table.js[ .removeRowByIndex ] - invalid row index');
        return false;
      }

      this.dom.tbody.removeChild(rows[index]);
      rows.splice(index, 1);
      this.data.splice(index, 1);

      return true;
    },

    sort: function(columnIndex, descending) {
      var store = [],
        i, len,
        rows = this.dom.rows;

      if (this._showingSearchResults) {
        this.reset();
      }

      if (typeof columnIndex !== 'number' || columnIndex < 0 || columnIndex >= this.data[0].length) {
        throw new Error('Table.js[ .sort ] - invalid column index');
        return;
      }

      for (i = 0, len = rows.length; i < len; i++) {
        var valueToSort = rows[i].cells[columnIndex].innerText;
        store.push([valueToSort, rows[i]]);
      }
      // sort rows
      store.sort(naturalComparison);
      if (descending) {
        store.reverse();
      }
      for (i = 0, len = store.length; i < len; i++) {
        this.dom.tbody.appendChild(store[i][1]);
      }

      this._reseted = false;
      this._sorted = true;
    },

    search: function(searchKey, columnIndex) {
      var i, len,
        result = false,
        rows = this.dom.rows;

      this.reset();
      searchKey += ""; // cast
      for (i = 0, len = rows.length; i < len; i++) {
        if (rows[i].cells[columnIndex].innerText.indexOf(searchKey) !== -1) {
          result = true;
        } else {
          rows[i].style.display = 'none';
        }
      }
      this._showingSearchResults = result;
      this._reseted = !result;
      return result;
    },

    // return table to normal state (without sort and search)
    reset: function() {
      if (this._reseted) {
        return;
      }

      var i, len,
        rows = this.dom.rows;

      if (this._showingSearchResults) {
        for (i = 0, len = rows.length; i < len; i++) {
          if (rows[i].style.display === 'none') {
            rows[i].style.display = 'table-row';
          }
        }
        this._showingSearchResults = false;
      } else if (this._sorted) {
        var tbody = this.dom.tbody,
          rowReference = this.data[0].length - 1;

        for (i = 0, len = rows.length; i < len; i++) {
          tbody.appendChild(this.data[i][rowReference]);
        }
        this._sorted = false;
      }

      this._reseted = true;
    },

    clone: function() {
      var i, len,
        clone = object.create(this);

      return clone;
    },

    clear: function() {
      var tbody = this.dom.tbody;
      while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
      }
    }
  };

  // sort functions
  function stringComparison(a, b) {
    return a.localeCompare(b);
  }

  function naturalComparison(a, b) {
    var x = [],
      y = [];

    a[0].replace(/(\d+)|(\D+)/g, function($0, $1, $2) {
      x.push([$1 || 0, $2])
    });
    b[0].replace(/(\d+)|(\D+)/g, function($0, $1, $2) {
      y.push([$1 || 0, $2])
    });

    while (x.length && y.length) {
      var xx = x.shift();
      var yy = y.shift();
      var nn = (xx[0] - yy[0]) || stringComparison(xx[1], yy[1]);
      if (nn) return nn;
    }

    if (x.length > 0) {
      return -1;
    }
    if (y.length > 0) {
      return +1;
    }

    return 0;
  }

  return Table;
})(document);
