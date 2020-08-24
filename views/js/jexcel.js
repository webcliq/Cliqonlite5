
/**
 * jExcel v3.9.1
 *
 * Author: Paul Hodel <paul.hodel@gmail.com>
 * Website: https://bossanova.uk/jexcel/
 * Description: Create amazing web based spreadsheets.
 *
 * This software is distribute under MIT License
 */

;(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    global.jexcel = factory();
}(this, (function () {

    'use strict';

// Jexcel core object

var jexcel = (function(el, options) {
    // Create jexcel object
    var obj = {};
    obj.options = {};

    if (! (el instanceof Element || el instanceof HTMLDocument)) {
        console.error('JEXCEL: el is not a valid DOM element');
        return false;
    }

    // Loading default configuration
    var defaults = {
        // External data
        url:null,
        // Data
        data:null,
        // Copy behavior
        copyCompatibility:false,
        // Rows and columns definitions
        rows:[],
        columns:[],
        // Deprected legacy options
        colHeaders:[],
        colWidths:[],
        colAlignments:[],
        nestedHeaders:null,
        // Column width that is used by default
        defaultColWidth:50,
        defaultColAlign:'center',
        // Spare rows and columns
        minSpareRows:0,
        minSpareCols:0,
        // Minimal table dimensions
        minDimensions:[0,0],
        // Allow Export
        allowExport:true,
        // @type {boolean} - Include the header titles on download
        includeHeadersOnDownload:false,
        // Allow column sorting
        columnSorting:true,
        // Allow column dragging
        columnDrag:false,
        // Allow column resizing
        columnResize:true,
        // Allow row resizing
        rowResize:false,
        // Allow row dragging
        rowDrag:true,
        // Allow table edition
        editable:true,
        // Allow new rows
        allowInsertRow:true,
        // Allow new rows
        allowManualInsertRow:true,
        // Allow new columns
        allowInsertColumn:true,
        // Allow new rows
        allowManualInsertColumn:true,
        // Allow row delete
        allowDeleteRow:true,
        // Allow deleting of all rows
        allowDeletingAllRows:false,
        // Allow column delete
        allowDeleteColumn:true,
        // Allow rename column
        allowRenameColumn:true,
        // Allow comments
        allowComments:false,
        // Global wrap
        wordWrap:false,
        // Image options
        imageOptions: null,
        // CSV source
        csv:null,
        // Filename
        csvFileName:'jexcel',
        // Consider first line as header
        csvHeaders:true,
        // Delimiters
        csvDelimiter:',',
        // Disable corner selection
        selectionCopy:true,
        // Merged cells
        mergeCells:{},
        // Create toolbar
        toolbar:null,
        // Allow search
        search:false,
        // Create pagination
        pagination:false,
        paginationOptions:null,
        // Full screen
        fullscreen:false,
        // Lazy loading
        lazyLoading:false,
        loadingSpin:false,
        // Table overflow
        tableOverflow:false,
        tableHeight:'300px',
        tableWidth:null,
        // Meta
        meta: null,
        // Style
        style:null,
        // Execute formulas
        parseFormulas:true,
        autoIncrement:true,
        autoCasting:true,
        // Event handles
        onundo:null,
        onredo:null,
        onload:null,
        onchange:null,
        onbeforechange:null,
        onafterchanges:null,
        onbeforeinsertrow: null,
        oninsertrow:null,
        onbeforeinsertcolumn: null,
        oninsertcolumn:null,
        onbeforedeleterow:null,
        ondeleterow:null,
        onbeforedeletecolumn:null,
        ondeletecolumn:null,
        onmoverow:null,
        onmovecolumn:null,
        onresizerow:null,
        onresizecolumn:null,
        onsort:null,
        onselection:null,
        onpaste:null,
        onbeforepaste:null,
        onmerge:null,
        onfocus:null,
        onblur:null,
        onchangeheader:null,
        oneditionstart:null,
        oneditionend:null,
        onchangestyle:null,
        onchangemeta:null,
        onchangepage:null,
        // Customize any cell behavior
        updateTable:null,
        // Detach the HTML table when calling updateTable
        detachForUpdates: false,
        // Texts
        text:{
            noRecordsFound: 'No records found',
            showingPage: 'Showing page {0} of {1} entries',
            show: 'Show ',
            search: 'Search',
            entries: ' entries',
            columnName: 'Column name',
            insertANewColumnBefore: 'Insert a new column before',
            insertANewColumnAfter: 'Insert a new column after',
            deleteSelectedColumns: 'Delete selected columns',
            renameThisColumn: 'Rename this column',
            orderAscending: 'Order ascending',
            orderDescending: 'Order descending',
            insertANewRowBefore: 'Insert a new row before',
            insertANewRowAfter: 'Insert a new row after',
            deleteSelectedRows: 'Delete selected rows',
            editComments: 'Edit comments',
            addComments: 'Add comments',
            comments: 'Comments',
            clearComments: 'Clear comments',
            copy: 'Copy...',
            paste: 'Paste...',
            saveAs: 'Save as...',
            about: 'About',
            areYouSureToDeleteTheSelectedRows: 'Are you sure to delete the selected rows?',
            areYouSureToDeleteTheSelectedColumns: 'Are you sure to delete the selected columns?',
            thisActionWillDestroyAnyExistingMergedCellsAreYouSure: 'This action will destroy any existing merged cells. Are you sure?',
            thisActionWillClearYourSearchResultsAreYouSure: 'This action will clear your search results. Are you sure?',
            thereIsAConflictWithAnotherMergedCell: 'There is a conflict with another merged cell',
            invalidMergeProperties: 'Invalid merged properties',
            cellAlreadyMerged: 'Cell already merged',
            noCellsSelected: 'No cells selected',
        },
        // About message
        about:"jExcel CE Spreadsheet\nVersion 3.9.1\nAuthor: Paul Hodel <paul.hodel@gmail.com>\nWebsite: https://bossanova.uk/jexcel/v3",
    };

    // Loading initial configuration from user
    for (var property in defaults) {
        if (options && options.hasOwnProperty(property)) {
            if (property === 'text') {
                obj.options[property] = defaults[property];
                for (var textKey in options[property]) {
                    if (options[property].hasOwnProperty(textKey)){
                        obj.options[property][textKey] = options[property][textKey];
                    }
                }
            } else {
                obj.options[property] = options[property];
            }
        } else {
            obj.options[property] = defaults[property];
        }
    }

    // Global elements
    obj.el = el;
    obj.corner = null;
    obj.contextMenu = null;
    obj.textarea = null;
    obj.ads = null;
    obj.content = null;
    obj.table = null;
    obj.thead = null;
    obj.tbody = null;
    obj.rows = [];
    obj.results = null;
    obj.searchInput = null;
    obj.toolbar = null;
    obj.pagination = null;
    obj.pageNumber = null;
    obj.headerContainer = null;
    obj.colgroupContainer = null;

    // Containers
    obj.headers = [];
    obj.records = [];
    obj.history = [];
    obj.formula = [];
    obj.colgroup = [];
    obj.selection = [];
    obj.highlighted  = [];
    obj.selectedCell = null;
    obj.selectedContainer = null;
    obj.style = [];
    obj.data = null;

    // Internal controllers
    obj.cursor = null;
    obj.historyIndex = -1;
    obj.ignoreEvents = false;
    obj.ignoreHistory = false;
    obj.edition = null;
    obj.hashString = null;
    obj.resizing = null;
    obj.dragging = null;

    // Lazy loading
    if (obj.options.lazyLoading == true && (obj.options.tableOverflow == false && obj.options.fullscreen == false)) {
        console.error('JEXCEL: The lazyloading only works when tableOverflow = yes or fullscreen = yes');
        obj.options.lazyLoading = false;
    }
    
    /**
     * Activate/Disable fullscreen 
     * use programmatically : table.fullscreen(); or table.fullscreen(true); or table.fullscreen(false);
     * @Param {boolean} activate
     */
    obj.fullscreen = function(activate) {
        // If activate not defined, get reverse options.fullscreen
        if (activate == null) {
            activate = ! obj.options.fullscreen;
        }

        // If change
        if (obj.options.fullscreen != activate) {
            obj.options.fullscreen = activate;

            // Test LazyLoading conflict
            if (activate == true) {
                el.classList.add('fullscreen');
            } else {
                el.classList.remove('fullscreen');
            }
        } 
    }

    /**
     * Prepare the jexcel table
     * 
     * @Param config
     */
    obj.prepareTable = function() {
        // Loading initial data from remote sources
        var results = [];

        // Number of columns
        var size = obj.options.columns.length;

        if (obj.options.data && typeof(obj.options.data[0]) !== 'undefined') {
            // Data keys
            var keys = Object.keys(obj.options.data[0]);

            if (keys.length > size) {
                size = keys.length;
            }
        }

        // Minimal dimensions
        if (obj.options.minDimensions[0] > size) {
            size = obj.options.minDimensions[0];
        }

        // Requests
        var multiple = [];

        // Preparations
        for (var i = 0; i < size; i++) {
            // Deprected options. You should use only columns
            if (! obj.options.colHeaders[i]) {
                obj.options.colHeaders[i] = '';
            }
            if (! obj.options.colWidths[i]) {
                obj.options.colWidths[i] = obj.options.defaultColWidth;
            }
            if (! obj.options.colAlignments[i]) {
                obj.options.colAlignments[i] = obj.options.defaultColAlign;
            }

            // Default column description
            if (! obj.options.columns[i]) {
                obj.options.columns[i] = { type:'text' };
            } else if (! obj.options.columns[i].type) {
                obj.options.columns[i].type = 'text';
            }
            if (! obj.options.columns[i].name) {
                obj.options.columns[i].name = keys && keys[i] ? keys[i] : i;
            }
            if (! obj.options.columns[i].source) {
                obj.options.columns[i].source = [];
            }
            if (! obj.options.columns[i].options) {
                obj.options.columns[i].options = [];
            }
            if (! obj.options.columns[i].editor) {
                obj.options.columns[i].editor = null;
            }
            if (! obj.options.columns[i].allowEmpty) {
                obj.options.columns[i].allowEmpty = false;
            }
            if (! obj.options.columns[i].title) {
                obj.options.columns[i].title = obj.options.colHeaders[i] ? obj.options.colHeaders[i] : '';
            }
            if (! obj.options.columns[i].width) {
                obj.options.columns[i].width = obj.options.colWidths[i] ? obj.options.colWidths[i] : obj.options.defaultColWidth;
            }
            if (! obj.options.columns[i].align) {
                obj.options.columns[i].align = obj.options.colAlignments[i] ? obj.options.colAlignments[i] : 'center';
            }

            // Pre-load initial source for json autocomplete
            if (obj.options.columns[i].type == 'autocomplete' || obj.options.columns[i].type == 'dropdown') {
                // if remote content
                if (obj.options.columns[i].url) {
                    multiple.push(jSuites.ajax({
                        url: obj.options.columns[i].url,
                        index: i,
                        method: 'GET',
                        dataType: 'json',
                        multiple: multiple,
                        success: function(data) {
                            var source = [];
                            for (var i = 0; i < data.length; i++) {
                                obj.options.columns[this.index].source.push(data[i]);
                            }
                        },
                        complete: function() {
                            obj.createTable();
                        }
                    }));
                }
            } else if (obj.options.columns[i].type == 'calendar') {
                // Default format for date columns
                if (! obj.options.columns[i].options.format) {
                    obj.options.columns[i].options.format = 'DD/MM/YYYY';
                }
            }
        }

        // On complete
        if (! multiple.length) {
            obj.createTable();
        }
    }

    obj.createTable = function() {
        // Elements
        obj.table = document.createElement('table');
        obj.thead = document.createElement('thead');
        obj.tbody = document.createElement('tbody');

        // Create headers controllers
        obj.headers = [];
        obj.colgroup = [];

        // Create table container
        obj.content = document.createElement('div');
        obj.content.classList.add('jexcel_content');

        // Create toolbar object
        obj.toolbar = document.createElement('div');
        obj.toolbar.classList.add('jexcel_toolbar');

        // Search
        var searchContainer = document.createElement('div');
        var searchText = document.createTextNode((obj.options.text.search) + ': ');
        obj.searchInput = document.createElement('input');
        obj.searchInput.classList.add('jexcel_search');
        searchContainer.appendChild(searchText);
        searchContainer.appendChild(obj.searchInput);
        obj.searchInput.onfocus = function() {
            obj.resetSelection();
        }

        // Pagination select option
        var paginationUpdateContainer = document.createElement('div');

        if (obj.options.pagination > 0 && obj.options.paginationOptions && obj.options.paginationOptions.length > 0) {
            obj.paginationDropdown = document.createElement('select');
            obj.paginationDropdown.classList.add('jexcel_pagination_dropdown');
            obj.paginationDropdown.onchange = function() {
                obj.options.pagination = parseInt(this.value);
                obj.page(0);
            }

            for (var i = 0; i < obj.options.paginationOptions.length; i++) {
                var temp = document.createElement('option');
                temp.value = obj.options.paginationOptions[i];
                temp.innerHTML = obj.options.paginationOptions[i];
                obj.paginationDropdown.appendChild(temp);
            }

            paginationUpdateContainer.appendChild(document.createTextNode(obj.options.text.show));
            paginationUpdateContainer.appendChild(obj.paginationDropdown);
            paginationUpdateContainer.appendChild(document.createTextNode(obj.options.text.entries));
        }

        // Filter and pagination container
        obj.filter = document.createElement('div');
        obj.filter.classList.add('jexcel_filter');
        obj.filter.appendChild(paginationUpdateContainer);
        obj.filter.appendChild(searchContainer);

        // Colsgroup
        obj.colgroupContainer = document.createElement('colgroup');
        var tempCol = document.createElement('col');
        tempCol.setAttribute('width', '50');
        obj.colgroupContainer.appendChild(tempCol);

        // Nested
        if (obj.options.nestedHeaders && obj.options.nestedHeaders.length > 0) {
            // Flexible way to handle nestedheaders
            if (obj.options.nestedHeaders[0] && obj.options.nestedHeaders[0][0]) {
                for (var j = 0; j < obj.options.nestedHeaders.length; j++) {
                    obj.thead.appendChild(obj.createNestedHeader(obj.options.nestedHeaders[j]));
                }
            } else {
                obj.thead.appendChild(obj.createNestedHeader(obj.options.nestedHeaders));
            }
        }

        // Row
        obj.headerContainer = document.createElement('tr');
        var tempCol = document.createElement('td');
        tempCol.classList.add('jexcel_selectall');
        obj.headerContainer.appendChild(tempCol);

        for (var i = 0; i < obj.options.columns.length; i++) {
            // Create header
            obj.createCellHeader(i);
            // Append cell to the container
            obj.headerContainer.appendChild(obj.headers[i]);
            obj.colgroupContainer.appendChild(obj.colgroup[i]);
        }

        obj.thead.appendChild(obj.headerContainer);

        // Content table
        obj.table = document.createElement('table');
        obj.table.classList.add('jexcel');
        obj.table.setAttribute('cellpadding', '0');
        obj.table.setAttribute('cellspacing', '0');
        obj.table.setAttribute('unselectable', 'yes');
        obj.table.setAttribute('onselectstart', 'return false');
        obj.table.appendChild(obj.colgroupContainer);
        obj.table.appendChild(obj.thead);
        obj.table.appendChild(obj.tbody);

        // Spreadsheet corner
        obj.corner = document.createElement('div');
        obj.corner.className = 'jexcel_corner';
        obj.corner.setAttribute('unselectable', 'on');
        obj.corner.setAttribute('onselectstart', 'return false');

        if (obj.options.selectionCopy == false) {
            obj.corner.style.display = 'none';
        }

        // Textarea helper
        obj.textarea = document.createElement('textarea');
        obj.textarea.className = 'jexcel_textarea';
        obj.textarea.id = 'jexcel_textarea';
        obj.textarea.tabIndex = '-1';

        // Contextmenu container
        obj.contextMenu = document.createElement('div');
        obj.contextMenu.className = 'jexcel_contextmenu';

        // Create element
        jSuites.contextmenu(obj.contextMenu, {
            onclick:function() {
                obj.contextMenu.contextmenu.close(false);
            }
        });

        // Powered by jExcel
        var ads = document.createElement('a');
        ads.setAttribute('href', 'https://bossanova.uk/jexcel/');
        obj.ads = document.createElement('div');
        obj.ads.className = 'jexcel_about';
        if (typeof(sessionStorage) !== "undefined" && ! sessionStorage.getItem('jexcel')) {
            sessionStorage.setItem('jexcel', true);
            var img = document.createElement('img');
            img.src = '//bossanova.uk/jexcel/logo.png';
            ads.appendChild(img);
        }
        var span = document.createElement('span');
        span.innerHTML = 'Jexcel spreadsheet';
        ads.appendChild(span);
        obj.ads.appendChild(ads);

        // Create table container TODO: frozen columns
        var container = document.createElement('div');
        container.classList.add('jexcel_table');

        // Pagination
        obj.pagination = document.createElement('div');
        obj.pagination.classList.add('jexcel_pagination');
        var paginationInfo = document.createElement('div');
        var paginationPages = document.createElement('div');
        obj.pagination.appendChild(paginationInfo);
        obj.pagination.appendChild(paginationPages);

        // Hide pagination if not in use
        if (! obj.options.pagination) {
            obj.pagination.style.display = 'none';
        }

        // Append containers to the table
        if (obj.options.search == true) {
            el.appendChild(obj.filter);
        }

        // Elements
        obj.content.appendChild(obj.table);
        obj.content.appendChild(obj.corner);
        obj.content.appendChild(obj.textarea);

        el.appendChild(obj.toolbar);
        el.appendChild(obj.content);
        el.appendChild(obj.pagination);
        el.appendChild(obj.contextMenu);
        el.appendChild(obj.ads);
        el.classList.add('jexcel_container');

        // Create toolbar
        if (obj.options.toolbar && obj.options.toolbar.length) {
            obj.createToolbar();
        }

        // Fullscreen
        if (obj.options.fullscreen == true) {
            el.classList.add('fullscreen');
        } else {
            // Overflow
            if (obj.options.tableOverflow == true) {
                if (obj.options.tableHeight) {
                    obj.content.style['overflow-y'] = 'auto';
                    obj.content.style.maxHeight = obj.options.tableHeight;
                }
                if (obj.options.tableWidth) {
                    obj.content.style['overflow-x'] = 'auto';
                    obj.content.style.width = obj.options.tableWidth;
                }
            }
        }

        // With toolbars
        if (obj.options.tableOverflow != true && obj.options.toolbar) {
            el.classList.add('with-toolbar');
        }

        // Actions
        if (obj.options.columnDrag == true) {
            obj.thead.classList.add('draggable');
        }
        if (obj.options.columnResize == true) {
            obj.thead.classList.add('resizable');
        }
        if (obj.options.rowDrag == true) {
            obj.tbody.classList.add('draggable');
        }
        if (obj.options.rowResize == true) {
            obj.tbody.classList.add('resizable');
        }

        // Load data
        obj.setData();

        // Style
        if (obj.options.style) {
            obj.setStyle(obj.options.style, null, null, 1, 1);
        }
    }

    /**
     * Refresh the data
     * 
     * @return void
     */
    obj.refresh = function() {
        if (obj.options.url) {
            // Loading
            if (obj.options.loadingSpin == true) {
                jSuites.loading.show();
            }

            jSuites.ajax({
                url: obj.options.url,
                method: 'GET',
                dataType: 'json',
                success: function(result) {
                    // Data
                    obj.options.data = (result.data) ? result.data : result;
                    // Prepare table
                    obj.setData();
                    // Hide spin
                    if (obj.options.loadingSpin == true) {
                        jSuites.loading.hide();
                    }
                }
            });
        } else {
            obj.setData();
        }
    }

    /**
     * Set data
     * 
     * @param array data In case no data is sent, default is reloaded
     * @return void
     */
    obj.setData = function(data) {
        // Update data
        if (data) {
            if (typeof(data) == 'string') {
                data = JSON.parse(data);
            }

            obj.options.data = data;
        }

        // Data
        if (! obj.options.data) {
            obj.options.data = [];
        }

        // Prepare data
        if (obj.options.data) {
            var data = [];
            for (var j = 0; j < obj.options.data.length; j++) {
                var row = [];
                for (var i = 0; i < obj.options.columns.length; i++) {
                    row[i] = obj.options.data[j][obj.options.columns[i].name];
                }
                data.push(row);
            }

            obj.options.data = data;
        }

        // Adjust minimal dimensions
        var j = 0;
        var i = 0;
        var size_i = obj.options.columns.length;
        var size_j = obj.options.data.length;
        var min_i = obj.options.minDimensions[0];
        var min_j = obj.options.minDimensions[1];
        var max_i = min_i > size_i ? min_i : size_i;
        var max_j = min_j > size_j ? min_j : size_j;

        for (j = 0; j < max_j; j++) {
            for (i = 0; i < max_i; i++) {
                if (obj.options.data[j] == undefined) {
                    obj.options.data[j] = [];
                }

                if (obj.options.data[j][i] == undefined) {
                    obj.options.data[j][i] = '';
                }
            }
        }

        // Reset containers
        obj.rows = [];
        obj.results = null;
        obj.records = [];
        obj.history = [];

        // Reset internal controllers
        obj.historyIndex = -1;

        // Reset data
        obj.tbody.innerHTML = '';

        // Lazy loading
        if (obj.options.lazyLoading == true) {
            // Load only 100 records
            var startNumber = 0
            var finalNumber = obj.options.data.length < 100 ? obj.options.data.length : 100;

            if (obj.options.pagination) {
                obj.options.pagination = false;
                console.error('JEXCEL: Pagination will be disable due the lazyLoading');
            }
        } else if (obj.options.pagination) {
            // Pagination
            if (! obj.pageNumber) {
                obj.pageNumber = 0;
            }
            var quantityPerPage = obj.options.pagination;
            startNumber = (obj.options.pagination * obj.pageNumber);
            finalNumber = (obj.options.pagination * obj.pageNumber) + obj.options.pagination;

            if (obj.options.data.length < finalNumber) {
                finalNumber = obj.options.data.length;
            }
        } else {
            var startNumber = 0;
            var finalNumber = obj.options.data.length;
        }

        // Append nodes to the HTML
        for (j = 0; j < obj.options.data.length; j++) {
            // Create row
            var tr = obj.createRow(j, obj.options.data[j]);
            // Append line to the table
            if (j >= startNumber && j < finalNumber) {
                obj.tbody.appendChild(tr);
            }
        }

        if (obj.options.lazyLoading == true) {
            // Do not create pagination with lazyloading activated
        } else if (obj.options.pagination) {
            obj.updatePagination();
        }

        // Merge cells
        if (obj.options.mergeCells) {
            var keys = Object.keys(obj.options.mergeCells);
            for (var i = 0; i < keys.length; i++) {
                var num = obj.options.mergeCells[keys[i]];
                obj.setMerge(keys[i], num[0], num[1], 1);
            }
        }

        // Updata table with custom configurations if applicable
        obj.updateTable();

        // Onload
        if (! obj.ignoreEvents) {
            if (typeof(obj.options.onload) == 'function') {
                obj.options.onload(el, obj);
            }
        }
    }

    /**
     * Get the whole table data
     * 
     * @param bool get highlighted cells only
     * @return array data
     */
        obj.getData = function(highlighted, dataOnly) {
        // Control vars
        var dataset = [];
        var px = 0;
        var py = 0;

        // Data type
        var dataType = dataOnly == true || obj.options.copyCompatibility == false ? true : false;

        // Column and row length
        var x = obj.options.columns.length
        var y = obj.options.data.length

        // Go through the columns to get the data
        for (var j = 0; j < y; j++) {
            px = 0;
            for (var i = 0; i < x; i++) {
                // Cell selected or fullset
                if (! highlighted || obj.records[j][i].classList.contains('highlight')) {
                    // Get value
                    if (! dataset[py]) {
                        dataset[py] = [];
                    }
                    if (! dataType) {
                        dataset[py][px] = obj.records[j][i].innerHTML;
                    } else {
                        dataset[py][px] = obj.options.data[j][i];
                    }
                    px++;
                }
            }
            if (px > 0) {
                py++;
            }
       }

       return dataset;
    }

    /**
     * Get the whole table data
     * 
     * @param integer row number
     * @return string value
     */
    obj.getJson = function(highlighted) {
        // Control vars
        var data = [];

        // Column and row length
        var x = obj.options.columns.length
        var y = obj.options.data.length

        // Go through the columns to get the data
        for (var j = 0; j < y; j++) {
            var row = null;
            for (var i = 0; i < x; i++) {
                if (! highlighted || obj.records[j][i].classList.contains('highlight')) {
                    if (row == null) {
                        row = {};
                    }
                    row[obj.options.columns[i].name] = obj.options.data[j][i];
                }
            }

            if (row != null) {
                data.push(row);
            }
       }

       return data;
    }

    /**
     * Get a row data by rowNumber
     */
    obj.getRowData = function(rowNumber) {
        return obj.options.data[rowNumber];
    }

    /**
     * Set a row data by rowNumber
     */
    obj.setRowData = function(rowNumber, data) {
        for (var i = 0; i < obj.headers.length; i++) {
            // Update cell
            var columnName = jexcel.getColumnNameFromId([ i, rowNumber ]);
            // Set value
            if (data[i] != null) {
                obj.setValue(columnName, data[i]);
            }
        }
    }

    /**
     * Get a column data by columnNumber
     */
    obj.getColumnData = function(columnNumber) {
        var dataset = [];
        // Go through the rows to get the data
        for (var j = 0; j < obj.options.data.length; j++) {
            dataset.push(obj.options.data[j][columnNumber]);
        }
        return dataset;
    }

    /**
     * Set a column data by colNumber
     */
    obj.setColumnData = function(colNumber, data) {
        for (var j = 0; j < obj.rows.length; j++) {
            // Update cell
            var columnName = jexcel.getColumnNameFromId([ colNumber, j ]);
            // Set value
            if (data[j] != null) {
                obj.setValue(columnName, data[j]);
            }
        }
    }

    /**
     * Create row
     */
    obj.createRow = function(j, data) {
        // Create container
        if (! obj.records[j]) {
            obj.records[j] = [];
        }
        // Default data
        if (! data) {
            var data = obj.options.data[j];
        }
        // New line of data to be append in the table
        obj.rows[j] = document.createElement('tr');
        obj.rows[j].setAttribute('data-y', j);
        // Definitions
        if (obj.options.rows[j]) {
            if (obj.options.rows[j].height) {
                obj.rows[j].style.height = obj.options.rows[j].height;
            }
        }
        // Row number label
        var td = document.createElement('td');
        td.innerHTML = parseInt(j + 1);
        td.setAttribute('data-y', j);
        td.className = 'jexcel_row';
        obj.rows[j].appendChild(td);

        // Data columns
        for (i = 0; i < obj.options.columns.length; i++) {
            // New column of data to be append in the line
            obj.records[j][i] = obj.createCell(i, j, data[i]);
            // Add column to the row
            obj.rows[j].appendChild(obj.records[j][i]);
        }

        // Add row to the table body
        return obj.rows[j];
    }

    /**
     * Create cell
     */
    obj.createCell = function(i, j, value) {
        // Create cell and properties
        var td = document.createElement('td');
        td.setAttribute('data-x', i);
        td.setAttribute('data-y', j);
        // Hidden column
        if (obj.options.columns[i].type == 'hidden') {
            td.style.display = 'none';
            td.innerHTML = value;
        } else if (obj.options.columns[i].type == 'checkbox' || obj.options.columns[i].type == 'radio') {
            // Create input
            var element = document.createElement('input');
            element.type = obj.options.columns[i].type;
            element.name = 'c' + i;
            element.checked = (value == 1 || value == true || value == 'true') ? true : false;
            element.onclick = function() {
                obj.setValue(td, this.checked);
            }

            if (obj.options.columns[i].readOnly == true || obj.options.editable == false) {
                element.setAttribute('disabled', 'disabled');
            }

            // Append to the table
            td.appendChild(element);
            // Make sure the values are correct
            obj.options.data[j][i] = element.checked;
        } else if (obj.options.columns[i].type == 'calendar') {
            // Try formatted date
            var formatted = jSuites.calendar.extractDateFromString(value, obj.options.columns[i].options.format);
            // Create calendar cell
            td.innerHTML = jSuites.calendar.getDateString(formatted ? formatted : value, obj.options.columns[i].options.format);
        } else if (obj.options.columns[i].type == 'dropdown' || obj.options.columns[i].type == 'autocomplete') {
            // Create dropdown cell
            td.classList.add('jexcel_dropdown');
            td.innerHTML = obj.getDropDownValue(i, value);
        } else if (obj.options.columns[i].type == 'color') {
            if (obj.options.columns[i].render == 'square') {
                var color = document.createElement('div');
                color.className = 'color';
                color.style.backgroundColor = value;
                td.appendChild(color);
            } else {
                td.style.color = value;
                td.innerHTML = value;
            }
        } else if (obj.options.columns[i].type == 'image') {
            if (value && value.substr(0, 10) == 'data:image') {
                var img = document.createElement('img');
                img.src = value;
                td.appendChild(img);
            }
        } else {
            if ((''+value).substr(0,1) == '=' && obj.options.parseFormulas == true) {
                value = obj.executeFormula(value, i, j)
            }
            if (obj.options.columns[i].mask) {
                var decimal = obj.options.columns[i].decimal || '.';
                value = '' + jSuites.mask.run(value, obj.options.columns[i].mask, decimal);
            }

            td.innerHTML = value;
        }

        // Readonly
        if (obj.options.columns[i].readOnly == true) {
            td.className = 'readonly';
        }

        // Text align
        var colAlign = obj.options.columns[i].align ? obj.options.columns[i].align : 'center';
        td.style.textAlign = colAlign;

        // Wrap option
        if (obj.options.columns[i].wordWrap != false && (obj.options.wordWrap == true || obj.options.columns[i].wordWrap == true || td.innerHTML.length > 200)) {
            td.style.whiteSpace = 'pre-wrap';
        }

        // Overflow
        if (i > 0) {
            if (value || td.innerHTML) {
                obj.records[j][i-1].style.overflow = 'hidden';
            } else {
                if (i == obj.options.columns.length - 1) {
                    td.style.overflow = 'hidden';
                }
            }
        }

        return td;
    }

    obj.createCellHeader = function(colNumber) {
        // Create col global control
        var colWidth = obj.options.columns[colNumber].width ? obj.options.columns[colNumber].width : obj.options.defaultColWidth;
        var colAlign = obj.options.columns[colNumber].align ? obj.options.columns[colNumber].align : obj.options.defaultColAlign;

        // Create header cell
        obj.headers[colNumber] = document.createElement('td');
        obj.headers[colNumber].innerHTML = obj.options.columns[colNumber].title ? obj.options.columns[colNumber].title : jexcel.getColumnName(colNumber);
        obj.headers[colNumber].setAttribute('data-x', colNumber);
        obj.headers[colNumber].style.textAlign = colAlign;
        if (obj.options.columns[colNumber].title) {
            obj.headers[colNumber].setAttribute('title', obj.options.columns[colNumber].title);
        }

        // Width control
        obj.colgroup[colNumber] = document.createElement('col');
        obj.colgroup[colNumber].setAttribute('width', colWidth);

        // Hidden column
        if (obj.options.columns[colNumber].type == 'hidden') {
            obj.headers[colNumber].style.display = 'none';
            obj.colgroup[colNumber].style.display = 'none';
        }
    }

    obj.createNestedHeader = function(nestedInformation) {
        var tr = document.createElement('tr');
        tr.classList.add('jexcel_nested');
        var td = document.createElement('td');
        tr.appendChild(td);

        var headerIndex = 0;
        for (var i = 0; i < nestedInformation.length; i++) {
            // Default values
            if (! nestedInformation[i].colspan) {
                nestedInformation[i].colspan = 1;
            }
            if (! nestedInformation[i].align) {
                nestedInformation[i].align = 'center';
            }
            if (! nestedInformation[i].title) {
                nestedInformation[i].title = '';
            }

            // Number of columns
            var numberOfColumns = nestedInformation[i].colspan;

            // Classes container
            var column = [];
            // Header classes for this cell
            for (var x = 0; x < numberOfColumns; x++) {
                if (obj.options.columns[headerIndex] && obj.options.columns[headerIndex].type == 'hidden') {
                    numberOfColumns++;
                }
                column.push(headerIndex);
                headerIndex++;
            }

            // Created the nested cell
            var td = document.createElement('td');
            td.setAttribute('data-column', column.join(','));
            td.setAttribute('colspan', nestedInformation[i].colspan);
            td.setAttribute('align', nestedInformation[i].align);
            td.innerHTML = nestedInformation[i].title;
            tr.appendChild(td);
        }

        return tr;
    }

    /**
     * Create toolbar
     */
    obj.createToolbar = function(toolbar) {
        if (toolbar) {
            obj.options.toolbar = toolbar;
        } else {
            var toolbar = obj.options.toolbar;
        }

        for (var i = 0; i < toolbar.length; i++) {
            if (toolbar[i].type == 'i') {
                var toolbarItem = document.createElement('i');
                toolbarItem.classList.add('jexcel_toolbar_item');
                toolbarItem.classList.add('material-icons');
                toolbarItem.setAttribute('data-k', toolbar[i].k);
                toolbarItem.setAttribute('data-v', toolbar[i].v);
                // Tooltip
                if (toolbar[i].tooltip) {
                    toolbarItem.setAttribute('title', toolbar[i].tooltip);
                }
                // Handle click
                if (toolbar[i].onclick && typeof(toolbar[i].onclick)) {
                    toolbarItem.onclick = toolbar[i].onclick;
                } else {
                    toolbarItem.onclick = function() {
                        var k = this.getAttribute('data-k');
                        var v = this.getAttribute('data-v');
                        obj.setStyle(obj.highlighted, k, v);
                    }
                }
                // Append element
                toolbarItem.innerHTML = toolbar[i].content;
                obj.toolbar.appendChild(toolbarItem);
            } else if (toolbar[i].type == 'select') {
               var toolbarItem = document.createElement('select');
               toolbarItem.classList.add('jexcel_toolbar_item');
               toolbarItem.setAttribute('data-k', toolbar[i].k);
               // Tooltip
               if (toolbar[i].tooltip) {
                   toolbarItem.setAttribute('title', toolbar[i].tooltip);
               }
               // Handle onchange
               if (toolbar[i].onchange && typeof(toolbar[i].onchange)) {
                   toolbarItem.onchange = toolbar[i].onchange;
               } else {
                   toolbarItem.onchange = function() {
                       var k = this.getAttribute('data-k');
                       obj.setStyle(obj.highlighted, k, this.value);
                   }
               }
               // Add options to the dropdown
               for(var j = 0; j < toolbar[i].v.length; j++) {
                    var toolbarDropdownOption = document.createElement('option');
                    toolbarDropdownOption.value = toolbar[i].v[j];
                    toolbarDropdownOption.innerHTML = toolbar[i].v[j];
                    toolbarItem.appendChild(toolbarDropdownOption);
               }
               obj.toolbar.appendChild(toolbarItem);
            } else if (toolbar[i].type == 'color') {
                 var toolbarItem = document.createElement('i');
                 toolbarItem.classList.add('jexcel_toolbar_item');
                 toolbarItem.classList.add('material-icons');
                 toolbarItem.setAttribute('data-k', toolbar[i].k);
                 toolbarItem.setAttribute('data-v', '');
                 // Tooltip
                 if (toolbar[i].tooltip) {
                     toolbarItem.setAttribute('title', toolbar[i].tooltip);
                 }
                 obj.toolbar.appendChild(toolbarItem);
                 toolbarItem.onclick = function() {
                     this.color.open();
                 }
                 toolbarItem.innerHTML = toolbar[i].content;
                 jSuites.color(toolbarItem, {
                     onchange:function(o, v) {
                         var k = o.getAttribute('data-k');
                         obj.setStyle(obj.highlighted, k, v);
                     }
                 });
            }
        }
    }

    /**
     * Merge cells
     * @param cellName
     * @param colspan
     * @param rowspan
     * @param ignoreHistoryAndEvents
     */
    obj.setMerge = function(cellName, colspan, rowspan, ignoreHistoryAndEvents) {
        var test = false;

        if (! cellName) {
            if (! obj.highlighted.length) {
                alert(obj.options.text.noCellsSelected);
                return null;
            } else {
                var x1 = parseInt(obj.highlighted[0].getAttribute('data-x'));
                var y1 = parseInt(obj.highlighted[0].getAttribute('data-y'));
                var x2 = parseInt(obj.highlighted[obj.highlighted.length-1].getAttribute('data-x'));
                var y2 = parseInt(obj.highlighted[obj.highlighted.length-1].getAttribute('data-y'));
                var cellName = jexcel.getColumnNameFromId([ x1, y1 ]);
                var colspan = (x2 - x1) + 1;
                var rowspan = (y2 - y1) + 1;
            }
        }

        var cell = jexcel.getIdFromColumnName(cellName, true);

        if (obj.options.mergeCells[cellName]) {
            if (obj.records[cell[1]][cell[0]].getAttribute('data-merged')) {
                test = obj.options.text.cellAlreadyMerged;
            }
        } else if ((! colspan || colspan < 2) && (! rowspan || rowspan < 2)) {
            test = obj.options.text.invalidMergeProperties;
        } else {
            var cells = [];
            for (var j = cell[1]; j < cell[1] + rowspan; j++) {
                for (var i = cell[0]; i < cell[0] + colspan; i++) {
                    var columnName = jexcel.getColumnNameFromId([i, j]);
                    if (obj.records[j][i].getAttribute('data-merged')) {
                        test = obj.options.text.thereIsAConflictWithAnotherMergedCell;
                    }
                }
            }
        }

        if (test) {
            alert(test);
        } else {
            // Add property
            if (colspan > 1) {
                obj.records[cell[1]][cell[0]].setAttribute('colspan', colspan);
            } else {
                colspan = 1;
            }
            if (rowspan > 1) {
                obj.records[cell[1]][cell[0]].setAttribute('rowspan', rowspan);
            } else {
                rowspan = 1;
            }
            // Keep links to the existing nodes
            obj.options.mergeCells[cellName] = [ colspan, rowspan, [] ];
            // Mark cell as merged
            obj.records[cell[1]][cell[0]].setAttribute('data-merged', 'true');
            // Overflow
            obj.records[cell[1]][cell[0]].style.overflow = 'hidden';
            // History data
            var data = [];
            // Adjust the nodes
            for (var y = cell[1]; y < cell[1] + rowspan; y++) {
                for (var x = cell[0]; x < cell[0] + colspan; x++) {
                    if (! (cell[0] == x && cell[1] == y)) {
                        data.push(obj.options.data[y][x]);
                        obj.updateCell(x, y, '', true);
                        obj.options.mergeCells[cellName][2].push(obj.records[y][x]);
                        obj.records[y][x].style.display = 'none';
                        obj.records[y][x] = obj.records[cell[1]][cell[0]];
                    }
                }
            }
            // In the initialization is not necessary keep the history
            obj.updateSelection(obj.records[cell[1]][cell[0]]);

            if (! ignoreHistoryAndEvents) {
                obj.setHistory({
                    action:'setMerge',
                    column:cellName,
                    colspan:colspan,
                    rowspan:rowspan,
                    data:data,
                });

                if (typeof(obj.options.onmerge) == 'function') {
                    obj.options.onmerge(el, cellName, colspan, rowspan);
                }
            }
        }
    }

    /**
     * Merge cells
     * @param cellName
     * @param colspan
     * @param rowspan
     * @param ignoreHistoryAndEvents
     */
    obj.getMerge = function(cellName) {
        var data = {};
        if (cellName) {
            if (obj.options.mergeCells[cellName]) {
                data = [ obj.options.mergeCells[cellName][0], obj.options.mergeCells[cellName][1] ];
            } else {
                data = null;
            }
        } else {
            if (obj.options.mergeCells) {
                var mergedCells = obj.options.mergeCells;
                var keys = Object.keys(obj.options.mergeCells);
                for (var i = 0; i < keys.length; i++) {
                    data[keys[i]] = [ obj.options.mergeCells[keys[i]][0], obj.options.mergeCells[keys[i]][1] ];
                }
            }
        }

        return data;
    }

    /**
     * Remove merge by cellname
     * @param cellName
     */
    obj.removeMerge = function(cellName, data, keepOptions) {
        if (obj.options.mergeCells[cellName]) {
            var cell = jexcel.getIdFromColumnName(cellName, true);
            obj.records[cell[1]][cell[0]].removeAttribute('colspan');
            obj.records[cell[1]][cell[0]].removeAttribute('rowspan');
            obj.records[cell[1]][cell[0]].removeAttribute('data-merged');
            var info = obj.options.mergeCells[cellName];

            var index = 0;
            for (var j = 0; j < info[1]; j++) {
                for (var i = 0; i < info[0]; i++) {
                    if (j > 0 || i > 0) {
                        obj.records[cell[1]+j][cell[0]+i] = info[2][index];
                        obj.records[cell[1]+j][cell[0]+i].style.display = '';
                        // Recover data
                        if (data && data[index]) {
                            obj.updateCell(cell[0]+i, cell[1]+j, data[index]);
                        }
                        index++;
                    }
                }
            }

            // Update selection
            obj.updateSelection(obj.records[cell[1]][cell[0]], obj.records[cell[1]+j-1][cell[0]+i-1]);

            if (! keepOptions) {
                delete(obj.options.mergeCells[cellName]);
            }
        }
    }

    /**
     * Remove all merged cells
     */
    obj.destroyMerged = function(keepOptions) {
        // Remove any merged cells
        if (obj.options.mergeCells) {
            var mergedCells = obj.options.mergeCells;
            var keys = Object.keys(obj.options.mergeCells);
            for (var i = 0; i < keys.length; i++) {
                obj.removeMerge(keys[i], null, keepOptions);
            }
        }
    }

    /**
     * Is column merged
     */
    obj.isColMerged = function(x, insertBefore) {
        var cols = [];
        // Remove any merged cells
        if (obj.options.mergeCells) {
            var keys = Object.keys(obj.options.mergeCells);
            for (var i = 0; i < keys.length; i++) {
                var info = jexcel.getIdFromColumnName(keys[i], true);
                var colspan = obj.options.mergeCells[keys[i]][0];
                var x1 = info[0];
                var x2 = info[0] + (colspan > 1 ? colspan - 1 : 0);

                if (insertBefore == null) {
                    if ((x1 <= x && x2 >= x)) {
                        cols.push(keys[i]);
                    }
                } else {
                    if (insertBefore) {
                        if ((x1 < x && x2 >= x)) {
                            cols.push(keys[i]);
                        }
                    } else {
                        if ((x1 <= x && x2 > x)) {
                            cols.push(keys[i]);
                        }
                    }
                }
            }
        }

        return cols;
    }

    /**
     * Is rows merged
     */
    obj.isRowMerged = function(y, insertBefore) {
        var rows = [];
        // Remove any merged cells
        if (obj.options.mergeCells) {
            var keys = Object.keys(obj.options.mergeCells);
            for (var i = 0; i < keys.length; i++) {
                var info = jexcel.getIdFromColumnName(keys[i], true);
                var rowspan = obj.options.mergeCells[keys[i]][1];
                var y1 = info[1];
                var y2 = info[1] + (rowspan > 1 ? rowspan - 1 : 0);

                if (insertBefore == null) {
                    if ((y1 <= y && y2 >= y)) {
                        rows.push(keys[i]);
                    }
                } else {
                    if (insertBefore) {
                        if ((y1 < y && y2 >= y)) {
                            rows.push(keys[i]);
                        }
                    } else {
                        if ((y1 <= y && y2 > y)) {
                            rows.push(keys[i]);
                        }
                    }
                }
            }
        }

        return rows;
    }

    /**
     * Open the editor
     * 
     * @param object cell
     * @return void
     */
    obj.openEditor = function(cell, empty, e) {
        // Get cell position
        var y = cell.getAttribute('data-y');
        var x = cell.getAttribute('data-x');

        // On edition start
        if (! obj.ignoreEvents) {
            if (typeof(obj.options.oneditionstart) == 'function') {
                obj.options.oneditionstart(el, cell, x, y);
            }
        }

        // Overflow
        if (x > 0) {
            obj.records[y][x-1].style.overflow = 'hidden';
        }

        // Create editor
        var createEditor = function(type) {
            // Cell information
            var info = cell.getBoundingClientRect();

            // Create dropdown
            var editor = document.createElement(type);
            editor.style.width = (info.width) + 'px';
            editor.style.height = (info.height - 2) + 'px';
            editor.style.minHeight = (info.height - 2) + 'px';

            // Edit cell
            cell.classList.add('editor');
            cell.innerHTML = '';
            cell.appendChild(editor);

            return editor;
        }

        // Readonly
        if (cell.classList.contains('readonly') == true) {
            // Do nothing
        } else {
            // Holder
            obj.edition = [ obj.records[y][x], obj.records[y][x].innerHTML, x, y ];

            // If there is a custom editor for it
            if (obj.options.columns[x].editor) {
                // Custom editors
                obj.options.columns[x].editor.openEditor(cell, el, empty, e);
            } else {
                // Native functions
                if (obj.options.columns[x].type == 'hidden') {
                    // Do nothing
                } else if (obj.options.columns[x].type == 'checkbox' || obj.options.columns[x].type == 'radio') {
                    // Get value
                    var value = cell.children[0].checked ? false : true;
                    // Toogle value
                    obj.setValue(cell, value);
                    // Do not keep edition open
                    obj.edition = null;
                } else if (obj.options.columns[x].type == 'dropdown' || obj.options.columns[x].type == 'autocomplete') {
                    // Get current value
                    var value = obj.options.data[y][x];

                    // Create dropdown
                    if (typeof(obj.options.columns[x].filter) == 'function') {
                        var source = obj.options.columns[x].filter(el, cell, x, y, obj.options.columns[x].source);
                    } else {
                        var source = obj.options.columns[x].source;
                    }

                    // Create editor
                    var editor = createEditor('div');
                    var options = {
                        data: source,
                        multiple: obj.options.columns[x].multiple ? true : false,
                        autocomplete: obj.options.columns[x].autocomplete || obj.options.columns[x].type == 'autocomplete' ? true : false,
                        opened:true,
                        value: obj.options.columns[x].multiple ? value.split(';') : value,
                        width:'100%',
                        height:editor.style.minHeight,
                        position: (obj.options.tableOverflow == true || obj.options.fullscreen == true) ? true : false,
                        onclose:function() {
                            obj.closeEditor(cell, true);
                        }
                    };
                    if (obj.options.columns[x].options && obj.options.columns[x].options.type) {
                        options.type = obj.options.columns[x].options.type;
                    }
                    jSuites.dropdown(editor, options);
                } else if (obj.options.columns[x].type == 'calendar' || obj.options.columns[x].type == 'color') {
                    // Value
                    var value = obj.options.data[y][x];
                    // Create editor
                    var editor = createEditor('input');
                    editor.value = value;

                    if (obj.options.tableOverflow == true || obj.options.fullscreen == true) {
                        obj.options.columns[x].options.position = true;
                    }
                    obj.options.columns[x].options.value = obj.options.data[y][x];
                    obj.options.columns[x].options.opened = true;
                    obj.options.columns[x].options.onclose = function(el, value) {
                        obj.closeEditor(cell, true);
                    }
                    // Current value
                    if (obj.options.columns[x].type == 'color') {
                        jSuites.color(editor, obj.options.columns[x].options);
                    } else {
                        var calendar = jSuites.calendar(editor, obj.options.columns[x].options);
                        calendar.setValue(value);
                    }
                    // Focus on editor
                    editor.focus();
                } else if (obj.options.columns[x].type == 'image') {
                    // Value
                    var img = cell.children[0];
                    // Create editor
                    var editor = createEditor('div');
                    editor.style.position = 'relative';
                    var div = document.createElement('div');
                    div.classList.add('jclose');
                    if (img && img.src) {
                        div.appendChild(img);
                    }
                    editor.appendChild(div);
                    jSuites.image(div, obj.options.imageOptions);
                    const rect = cell.getBoundingClientRect();
                    const rectContent = div.getBoundingClientRect();
                    if (window.innerHeight < rect.bottom + rectContent.height) {
                        div.style.top = (rect.top - (rectContent.height + 2)) + 'px';
                    } else {
                        div.style.top = (rect.top) + 'px';
                    }
                } else {
                    // Value
                    var value = empty == true ? '' : obj.options.data[y][x];

                    // Basic editor
                    if (obj.options.columns[x].wordWrap != false && (obj.options.wordWrap == true || obj.options.columns[x].wordWrap == true)) {
                        var editor = createEditor('textarea');
                    } else {
                        var editor = createEditor('input');
                        // Mask
                        if (obj.options.columns[x].mask) {
                            editor.setAttribute('data-mask', obj.options.columns[x].mask);
                        }
                    }

                    editor.value = value;
                    editor.onblur = function() {
                        obj.closeEditor(cell, true);
                    };
                    editor.focus();
                }
            }
        }
    }

    /**
     * Close the editor and save the information
     * 
     * @param object cell
     * @param boolean save
     * @return void
     */
    obj.closeEditor = function(cell, save) {
        var x = parseInt(cell.getAttribute('data-x'));
        var y = parseInt(cell.getAttribute('data-y'));

        // Get cell properties
        if (save == true) {
            // If custom editor
            if (obj.options.columns[x].editor) {
                // Custom editor
                var value = obj.options.columns[x].editor.closeEditor(cell, save);
            } else {
                // Native functions
                if (obj.options.columns[x].type == 'checkbox' || obj.options.columns[x].type == 'radio' || obj.options.columns[x].type == 'hidden') {
                    // Do nothing
                } else if (obj.options.columns[x].type == 'dropdown' || obj.options.columns[x].type == 'autocomplete') {
                    var value = cell.children[0].dropdown.close(true);
                } else if (obj.options.columns[x].type == 'calendar') {
                    var value = cell.children[0].calendar.close(true);
                } else if (obj.options.columns[x].type == 'color') {
                    var value = cell.children[1].color.close(true);
                } else if (obj.options.columns[x].type == 'image') {
                    var img = cell.children[0].children[0].children[0];
                    var value = img && img.tagName == 'IMG' ? img.src : '';
                } else if (obj.options.columns[x].type == 'numeric') {
                    var value = cell.children[0].value;
                    if (value.substr(0,1) != '=') {
                        if (value == '') {
                            value = obj.options.columns[x].allowEmpty ? '' : 0;
                        }
                    }
                    cell.children[0].onblur = null;
                } else {
                    var value = cell.children[0].value;
                    cell.children[0].onblur = null;
                }
            }

            // Ignore changes if the value is the same
            if (obj.options.data[y][x] == value) {
                cell.innerHTML = obj.edition[1];
            } else {
                obj.setValue(cell, value);
            }
        } else {
            if (obj.options.columns[x].editor) {
                // Custom editor
                obj.options.columns[x].editor.closeEditor(cell, save);
            } else {
                if (obj.options.columns[x].type == 'dropdown' || obj.options.columns[x].type == 'autocomplete') {
                    cell.children[0].dropdown.close(true);
                } else if (obj.options.columns[x].type == 'calendar') {
                    cell.children[0].calendar.close(true);
                } else if (obj.options.columns[x].type == 'color') {
                    cell.children[1].color.close(true);
                } else {
                    cell.children[0].onblur = null;
                }
            }

            // Restore value
            cell.innerHTML = obj.edition && obj.edition[1] ? obj.edition[1] : '';
        }

        // On edition end
        if (! obj.ignoreEvents) {
            if (typeof(obj.options.oneditionend) == 'function') {
                obj.options.oneditionend(el, cell, x, y, value, save);
            }
        }

        // Remove editor class
        cell.classList.remove('editor');

        // Finish edition
        obj.edition = null;
    }

    /**
     * Get the cell object
     * 
     * @param object cell
     * @return string value
     */
    obj.getCell = function(cell) {
        // Convert in case name is excel liked ex. A10, BB92
        cell = jexcel.getIdFromColumnName(cell, true);
        var x = cell[0];
        var y = cell[1];

        return obj.records[y][x];
    }

    /**
     * Get the cell object from coords
     * 
     * @param object cell
     * @return string value
     */
    obj.getCellFromCoords = function(x, y) {
        return obj.records[y][x];
    }

    /**
     * Get label
     * 
     * @param object cell
     * @return string value
     */
    obj.getLabel = function(cell) {
        // Convert in case name is excel liked ex. A10, BB92
        cell = jexcel.getIdFromColumnName(cell, true);
        var x = cell[0];
        var y = cell[1];

        return obj.records[y][x].innerHTML;
    }

    /**
     * Get labelfrom coords
     * 
     * @param object cell
     * @return string value
     */
    obj.getLabelFromCoords = function(x, y) {
        return obj.records[y][x].innerHTML;
    }

    /**
     * Get the value from a cell
     * 
     * @param object cell
     * @return string value
     */
    obj.getValue = function(cell, processedValue) {
        if (typeof(cell) == 'object') {
            var x = cell.getAttribute('data-x');
            var y = cell.getAttribute('data-y');
        } else {
            cell = jexcel.getIdFromColumnName(cell, true);
            var x = cell[0];
            var y = cell[1];
        }

        var value = null;

        if (x != null && y != null) {
            if (obj.records[y] && obj.records[y][x] && (processedValue || obj.options.copyCompatibility == true)) {
                value = obj.records[y][x].innerHTML;
            } else {
                if (obj.options.data[y] && obj.options.data[y][x] != 'undefined') {
                    value = obj.options.data[y][x];
                }
            }
        }

        return value;
    }

    /**
     * Get the value from a coords
     * 
     * @param int x
     * @param int y
     * @return string value
     */
    obj.getValueFromCoords = function(x, y, processedValue) {
        var value = null;

        if (x != null && y != null) {
            if ((obj.records[y] && obj.records[y][x]) && processedValue || obj.options.copyCompatibility == true) {
                value = obj.records[y][x].innerHTML;
            } else {
                if (obj.options.data[y] && obj.options.data[y][x] != 'undefined') {
                    value = obj.options.data[y][x];
                }
            }
        }

        return value;
    }

    /**
     * Set a cell value
     * 
     * @param mixed cell destination cell
     * @param string value value
     * @return void
     */
    obj.setValue = function(cell, value, force) {
        var records = [];

        if (typeof(cell) == 'string') {
            var columnId = jexcel.getIdFromColumnName(cell, true);
            var x = columnId[0];
            var y = columnId[1];

            // Update cell
            records.push(obj.updateCell(x, y, value, force));

            // Update all formulas in the chain
            obj.updateFormulaChain(x, y, records);
        } else {
            var x = null;
            var y = null;
            if (cell && cell.getAttribute) {
                var x = cell.getAttribute('data-x');
                var y = cell.getAttribute('data-y');
            }

            // Update cell
            if (x != null && y != null) {
                records.push(obj.updateCell(x, y, value, force));

                // Update all formulas in the chain
                obj.updateFormulaChain(x, y, records);
            } else {
                var keys = Object.keys(cell);
                if (keys.length > 0) {
                    for (var i = 0; i < keys.length; i++) {
                        if (typeof(cell[i]) == 'string') {
                            var columnId = jexcel.getIdFromColumnName(cell[i], true);
                            var x = columnId[0];
                            var y = columnId[1];
                        } else {
                            var x = cell[i].getAttribute('data-x');
                            var y = cell[i].getAttribute('data-y');
                        }

                         // Update cell
                        if (x != null && y != null) {
                            records.push(obj.updateCell(x, y, value, force));

                            // Update all formulas in the chain
                            obj.updateFormulaChain(x, y, records);
                        }
                    }
                }
            }
        }

        // Update history
        obj.setHistory({
            action:'setValue',
            records:records,
            selection:obj.selectedCell,
        });

        // Update table with custom configurations if applicable
        obj.updateTable();

        // On after changes
        obj.onafterchanges(el, records);
    }

    /**
     * Set a cell value based on coordinates
     * 
     * @param int x destination cell
     * @param int y destination cell
     * @param string value
     * @return void
     */
    obj.setValueFromCoords = function(x, y, value, force) {
        var records = [];
        records.push(obj.updateCell(x, y, value, force));

        // Update all formulas in the chain
        obj.updateFormulaChain(x, y, records);

        // Update history
        obj.setHistory({
            action:'setValue',
            records:records,
            selection:obj.selectedCell,
        });

        // Update table with custom configurations if applicable
        obj.updateTable();

        // On after changes
        obj.onafterchanges(el, records);
    }

    /**
     * Toogle
     */
    obj.setCheckRadioValue = function() {
        var records = [];
        var keys = Object.keys(obj.highlighted);
        for (var i = 0; i < keys.length; i++) {
            var x = obj.highlighted[i].getAttribute('data-x');
            var y = obj.highlighted[i].getAttribute('data-y');

            if (obj.options.columns[x].type == 'checkbox' || obj.options.columns[x].type == 'radio') {
                // Update cell
                records.push(obj.updateCell(x, y, ! obj.options.data[y][x]));
            }
        }

        if (records.length) {
            // Update history
            obj.setHistory({
                action:'setValue',
                records:records,
                selection:obj.selectedCell,
            });

            // On after changes
            obj.onafterchanges(el, records);
        }
    }

    /**
     * Update cell content
     * 
     * @param object cell
     * @return void
     */
    obj.updateCell = function(x, y, value, force) {
        // Changing value depending on the column type
        if (obj.records[y][x].classList.contains('readonly') == true && ! force) {
            // Do nothing
            var record = {
                x: x,
                y: y,
                col: x,
                row: y
            }
        } else {
            // On change
            if (! obj.ignoreEvents) {
                if (typeof(obj.options.onbeforechange) == 'function') {
                    // Overwrite a value
                    var val = obj.options.onbeforechange(el, obj.records[y][x], x, y, value);

                    // If you return something this will overwrite the value
                    if (val != undefined) {
                        value = val;
                    }
                }
            }

            // History format
            var record = {
                x: x,
                y: y,
                col: x,
                row: y,
                newValue: value,
                oldValue: obj.options.data[y][x],
            }

            if (obj.options.columns[x].editor) {
                // Update data and cell
                obj.options.data[y][x] = value;
                obj.options.columns[x].editor.setValue(obj.records[y][x], value, force);
            } else {
                // Native functions
                if (obj.options.columns[x].type == 'checkbox' || obj.options.columns[x].type == 'radio') {
                    // Unchecked all options
                    if (obj.options.columns[x].type == 'radio') {
                        for (var j = 0; j < obj.options.data.length; j++) {
                            obj.options.data[j][x] = false;
                        }
                    }

                    // Update data and cell
                    obj.records[y][x].children[0].checked = (value == 1 || value == true || value == 'true' || value == 'TRUE') ? true : false;
                    obj.options.data[y][x] = obj.records[y][x].children[0].checked;
                } else if (obj.options.columns[x].type == 'dropdown' || obj.options.columns[x].type == 'autocomplete') {
                    // Update data and cell
                    obj.options.data[y][x] = value;
                    obj.records[y][x].innerHTML = obj.getDropDownValue(x, value);
                } else if (obj.options.columns[x].type == 'calendar') {
                    // Update calendar
                    var formatted = jSuites.calendar.extractDateFromString(value, obj.options.columns[x].options.format);
                    // Update data and cell
                    obj.options.data[y][x] = value;
                    obj.records[y][x].innerHTML = jSuites.calendar.getDateString(formatted ? formatted : value, obj.options.columns[x].options.format);
                } else if (obj.options.columns[x].type == 'color') {
                    // Update color
                    obj.options.data[y][x] = value;
                    // Render
                    if (obj.options.columns[x].render == 'square') {
                        var color = document.createElement('div');
                        color.className = 'color';
                        color.style.backgroundColor = value;
                        obj.records[y][x].innerHTML = '';
                        obj.records[y][x].appendChild(color);
                    } else {
                    obj.records[y][x].style.color = value;
                        obj.records[y][x].innerHTML = value;
                    }
                } else if (obj.options.columns[x].type == 'image') {
                    value = ''+value;
                    obj.options.data[y][x] = value;
                    obj.records[y][x].innerHTML = '';
                    if (value && value.substr(0, 10) == 'data:image') {
                        var img = document.createElement('img');
                        img.src = value;
                        obj.records[y][x].appendChild(img);
                    }
                } else {
                    // Update data and cell
                    obj.options.data[y][x] = value;
                    // Label
                    if (('' + value).substr(0,1) == '='  && obj.options.parseFormulas == true) {
                        value = obj.executeFormula(value, x, y);
                    }
                    if (obj.options.columns[x].mask) {
                        var decimal = obj.options.columns[x].decimal || '.';
                        value = '' + jSuites.mask.run(value, obj.options.columns[x].mask, decimal);
                    }
                    obj.records[y][x].innerHTML = value;

                    // Handle big text inside a cell
                    if (obj.options.columns[x].wordWrap != false && (obj.options.wordWrap == true || obj.options.columns[x].wordWrap == true || obj.records[y][x].innerHTML.length > 200)) {
                        obj.records[y][x].style.whiteSpace = 'pre-wrap';
                    } else {
                        obj.records[y][x].style.whiteSpace = '';
                    }
                }
            }

            // Overflow
            if (x > 0) {
                if (value) {
                    obj.records[y][x-1].style.overflow = 'hidden';
                } else {
                    obj.records[y][x-1].style.overflow = '';
                }
            }

            // On change
            if (! obj.ignoreEvents) {
                if (typeof(obj.options.onchange) == 'function') {
                    obj.options.onchange(el, (obj.records[y] && obj.records[y][x] ? obj.records[y][x] : null), x, y, value, record.oldValue);
                }
            }
        }

        return record;
    }

    /**
     * Helper function to copy data using the corner icon
     */
    obj.copyData = function(o, d) {
        // Get data from all selected cells
        var data = obj.getData(true, true);

        // Selected cells
        var h = obj.selectedContainer;

        // Cells
        var x1 = parseInt(o.getAttribute('data-x'));
        var y1 = parseInt(o.getAttribute('data-y'));
        var x2 = parseInt(d.getAttribute('data-x'));
        var y2 = parseInt(d.getAttribute('data-y'));

        // Records
        var records = [];
        var breakControl = false;

        if (h[0] == x1) {
            // Vertical copy
            if (y1 < h[1]) {
                var rowNumber = y1 - h[1];
            } else {
                var rowNumber = 1;
            }
            var colNumber = 0;
        } else {
            if (x1 < h[0]) {
                var colNumber = x1 - h[0];
            } else {
                var colNumber = 1;
            }
            var rowNumber = 0;
        }

        // Copy data procedure
        var posx = 0;
        var posy = 0;

        for (var j = y1; j <= y2; j++) {
            // Skip hidden rows
            if (obj.rows[j] && obj.rows[j].style.display == 'none') {
                continue;
            }

            // Controls
            if (data[posy] == undefined) {
                posy = 0;
            }
            posx = 0;

            // Data columns
            if (h[0] != x1) {
                if (x1 < h[0]) {
                    var colNumber = x1 - h[0];
                } else {
                    var colNumber = 1;
                }
            }
            // Data columns
            for (var i = x1; i <= x2; i++) {
                // Update non-readonly
                if (obj.records[j][i] && ! obj.records[j][i].classList.contains('readonly') && obj.records[j][i].style.display != 'none' && breakControl == false) {
                    // Stop if contains value
                    if (! obj.selection.length) {
                        if (obj.options.data[j][i] != '') {
                            breakControl = true;
                            continue;
                        }
                    }

                    // Column
                    if (data[posy] == undefined) {
                        posx = 0;
                    } else if (data[posy][posx] == undefined) {
                        posx = 0;
                    }

                    // Value
                    var value = data[posy][posx];

                        if (value && ! data[1] && obj.options.autoIncrement == true) {
                        if (obj.options.columns[i].type == 'text' || obj.options.columns[i].type == 'number') {
                            if ((''+value).substr(0,1) == '=') {
                                var tokens = value.match(/([A-Z]+[0-9]+)/g);

                                if (tokens) {
                                    var affectedTokens = [];
                                    for (var index = 0; index < tokens.length; index++) {
                                        var position = jexcel.getIdFromColumnName(tokens[index], 1);
                                        position[0] += colNumber;
                                        position[1] += rowNumber;
                                        if (position[1] < 0) {
                                            position[1] = 0;
                                        }
                                        var token = jexcel.getColumnNameFromId([position[0], position[1]]);

                                        if (token != tokens[index]) {
                                            affectedTokens[tokens[index]] = token;
                                        }
                                    }
                                    // Update formula
                                    if (affectedTokens) {
                                        value = obj.updateFormula(value, affectedTokens)
                                    }
                                }
                            } else {
                                if (value == Number(value)) {
                                    value = Number(value) + rowNumber;
                                }
                            }
                        } else if (obj.options.columns[i].type == 'calendar') {
                            var date = new Date(value);
                            date.setDate(date.getDate() + rowNumber);
                            value = date.getFullYear() + '-' + jexcel.doubleDigitFormat(parseInt(date.getMonth() + 1)) + '-' + jexcel.doubleDigitFormat(date.getDate()) + ' ' + '00:00:00';
                        }
                    }

                    records.push(obj.updateCell(i, j, value));

                    // Update all formulas in the chain
                    obj.updateFormulaChain(i, j, records);
                }
                posx++;
                if (h[0] != x1) {
                    colNumber++;
                }
            }
            posy++;
            rowNumber++;
        }

        // Update history
        obj.setHistory({
            action:'setValue',
            records:records,
            selection:obj.selectedCell,
        });

        // Update table with custom configuration if applicable
        obj.updateTable();

        // On after changes
        obj.onafterchanges(el, records);
    }

    /**
     * Refresh current selection
     */
    obj.refreshSelection = function() {
        if (obj.selectedCell) {
            obj.updateSelectionFromCoords(obj.selectedCell[0], obj.selectedCell[1], obj.selectedCell[2], obj.selectedCell[3]);
        }
    }

    /**
     * Move coords to A1 in case ovelaps with an excluded cell
     */
    obj.conditionalSelectionUpdate = function(type, o, d) {
        if (type == 1) {
            if (obj.selectedCell && ((o >= obj.selectedCell[1] && o <= obj.selectedCell[3]) || (d >= obj.selectedCell[1] && d <= obj.selectedCell[3]))) {
                obj.resetSelection();
                return;
            }
        } else {
            if (obj.selectedCell && ((o >= obj.selectedCell[0] && o <= obj.selectedCell[2]) || (d >= obj.selectedCell[0] && d <= obj.selectedCell[2]))) {
                obj.resetSelection();
                return;
            }
        }
    }

    /**
     * Clear table selection
     */
    obj.resetSelection = function(blur) {
        // Remove style
        if (! obj.highlighted.length) {
            var previousStatus = 0;
        } else {
            var previousStatus = 1;

            for (var i = 0; i < obj.highlighted.length; i++) {
                obj.highlighted[i].classList.remove('highlight');
                obj.highlighted[i].classList.remove('highlight-left');
                obj.highlighted[i].classList.remove('highlight-right');
                obj.highlighted[i].classList.remove('highlight-top');
                obj.highlighted[i].classList.remove('highlight-bottom');
                obj.highlighted[i].classList.remove('highlight-selected');

                var px = parseInt(obj.highlighted[i].getAttribute('data-x'));
                var py = parseInt(obj.highlighted[i].getAttribute('data-y'));

                // Check for merged cells
                if (obj.highlighted[i].getAttribute('data-merged')) {
                    var colspan = parseInt(obj.highlighted[i].getAttribute('colspan'));
                    var rowspan = parseInt(obj.highlighted[i].getAttribute('rowspan'));
                    var ux = colspan > 0 ? px + (colspan - 1) : px;
                    var uy = rowspan > 0 ? py + (rowspan - 1): py;
                } else {
                    var ux = px;
                    var uy = py;
                }

                // Remove selected from headers
                for (var j = px; j <= ux; j++) {
                    if (obj.headers[j]) {
                        obj.headers[j].classList.remove('selected');
                    }
                }

                // Remove selected from rows
                for (var j = py; j <= uy; j++) {
                    if (obj.rows[j]) {
                        obj.rows[j].classList.remove('selected');
                    }
                }
            }
        }

        // Reset highlighed cells
        obj.highlighted = [];

        // Reset
        obj.selectedCell = null;

        // Hide corner
        obj.corner.style.top = '-2000px';
        obj.corner.style.left = '-2000px';

        if (obj.ignoreEvents != true && blur == true) {
            if (obj.options.onblur) {
                if (typeof(obj.options.onblur) == 'function') {
                    if (previousStatus == 1) {
                        obj.options.onblur(el);
                    }
                }
            }
        }

        return previousStatus;
    }

    /**
     * Update selection based on two cells
     */
    obj.updateSelection = function(el1, el2, origin) {
        var x1 = el1.getAttribute('data-x');
        var y1 = el1.getAttribute('data-y');
        if (el2) {
            var x2 = el2.getAttribute('data-x');
            var y2 = el2.getAttribute('data-y');
        } else {
            var x2 = x1;
            var y2 = y1;
        }

        obj.updateSelectionFromCoords(x1, y1, x2, y2, origin);
    }

    /**
     * Update selection from coords
     */
    obj.updateSelectionFromCoords = function(x1, y1, x2, y2, origin) {
        // Reset Selection
        var updated = null;
        var previousState = obj.resetSelection();

        // Same element
        if (x2 == null) {
            x2 = x1;
        }
        if (y2 == null) {
            y2 = y1;
        }

        // Selection must be within the existing data
        if (x1 >= obj.headers.length) {
            x1 = obj.headers.length - 1;
        }
        if (y1 >= obj.rows.length) {
            y1 = obj.rows.length - 1;
        }
        if (x2 >= obj.headers.length) {
            x2 = obj.headers.length - 1;
        }
        if (y2 >= obj.rows.length) {
            y2 = obj.rows.length - 1;
        }

        // Keep selected cell
        obj.selectedCell = [x1, y1, x2, y2];

        // Select cells
        if (x1 != null) {
            // Add selected cell
            if (obj.records[y1][x1]) {
                obj.records[y1][x1].classList.add('highlight-selected');
            }

            // Origin & Destination
            if (parseInt(x1) < parseInt(x2)) {
                var px = parseInt(x1);
                var ux = parseInt(x2);
            } else {
                var px = parseInt(x2);
                var ux = parseInt(x1);
            }

            if (parseInt(y1) < parseInt(y2)) {
                var py = parseInt(y1);
                var uy = parseInt(y2);
            } else {
                var py = parseInt(y2);
                var uy = parseInt(y1);
            }

            // Verify merged columns
            for (var i = px; i <= ux; i++) {
                for (var j = py; j <= uy; j++) {
                    if (obj.records[j][i] && obj.records[j][i].getAttribute('data-merged')) {
                        var x = parseInt(obj.records[j][i].getAttribute('data-x'));
                        var y = parseInt(obj.records[j][i].getAttribute('data-y'));
                        var colspan = parseInt(obj.records[j][i].getAttribute('colspan'));
                        var rowspan = parseInt(obj.records[j][i].getAttribute('rowspan'));

                        if (colspan > 1) {
                            if (x < px) {
                                px = x;
                            }
                            if (x + colspan > ux) {
                                ux = x + colspan - 1;
                            }
                        }

                        if (rowspan) {
                            if (y < py) {
                                py = y;

                            }
                            if (y + rowspan > uy) {
                                uy = y + rowspan - 1;
                            }
                        }
                    }
                }
            }

            // Limits
            var borderLeft = null;
            var borderRight = null;
            var borderTop = null;
            var borderBottom = null;

            // Vertical limits
            for (var j = py; j <= uy; j++) {
                if (obj.rows[j].style.display != 'none') {
                    if (borderTop == null) {
                        borderTop = j;
                    }
                    borderBottom = j;
                }
            }

            // Redefining styles
            for (var i = px; i <= ux; i++) {
                for (var j = py; j <= uy; j++) {
                    if (obj.rows[j].style.display != 'none' && obj.records[j][i].style.display != 'none') {
                        obj.records[j][i].classList.add('highlight');
                        obj.highlighted.push(obj.records[j][i]);
                    }
                }

                // Horizontal limits
                if (obj.options.columns[i].type != 'hidden') {
                    if (borderLeft == null) {
                        borderLeft = i;
                    }
                    borderRight = i;
                }
            }

            // Create borders
            if (! borderLeft) {
                borderLeft = 0;
            }
            if (! borderRight) {
                borderRight = 0;
            }
            for (var i = borderLeft; i <= borderRight; i++) {
                if (obj.options.columns[i].type != 'hidden') {
                    // Top border
                    if (obj.records[borderTop][i]) {
                        obj.records[borderTop][i].classList.add('highlight-top');
                    }
                    // Bottom border
                    if (obj.records[borderBottom][i]) {
                        obj.records[borderBottom][i].classList.add('highlight-bottom');
                    }
                    // Add selected from headers
                    obj.headers[i].classList.add('selected');
                }
            }

            for (var j = borderTop; j <= borderBottom; j++) {
                if (obj.rows[j].style.display != 'none') {
                    // Left border
                    obj.records[j][borderLeft].classList.add('highlight-left');
                    // Right border
                    obj.records[j][borderRight].classList.add('highlight-right');
                    // Add selected from rows
                    obj.rows[j].classList.add('selected');
                }
            }

            obj.selectedContainer = [ borderLeft, borderTop, borderRight, borderBottom ];
        }

        // Handle events
        if (obj.ignoreEvents != true) {
            if (obj.options.onfocus) {
                if (typeof(obj.options.onfocus) == 'function') {
                    if (previousState == 0) {
                        obj.options.onfocus(el);
                    }
                }
            }

            if (typeof(obj.options.onselection) == 'function') {
                obj.options.onselection(el, borderLeft, borderTop, borderRight, borderBottom, origin);
            }
        }

        // Find corner cell
        obj.updateCornerPosition();
    }

    /**
     * Remove copy selection
     * 
     * @return void
     */
    obj.removeCopySelection = function() {
        // Remove current selection
        for (var i = 0; i < obj.selection.length; i++) {
            obj.selection[i].classList.remove('selection');
            obj.selection[i].classList.remove('selection-left');
            obj.selection[i].classList.remove('selection-right');
            obj.selection[i].classList.remove('selection-top');
            obj.selection[i].classList.remove('selection-bottom');
        }

        obj.selection = [];
    }

    /**
     * Update copy selection
     * 
     * @param int x, y
     * @return void
     */
    obj.updateCopySelection = function(x3, y3) {
        // Remove selection
        obj.removeCopySelection();

        // Get elements first and last
        var x1 = obj.selectedContainer[0];
        var y1 = obj.selectedContainer[1];
        var x2 = obj.selectedContainer[2];
        var y2 = obj.selectedContainer[3];

        if (x3 != null && y3 != null) {
            if (x3 - x2 > 0) {
                var px = parseInt(x2) + 1;
                var ux = parseInt(x3);
            } else {
                var px = parseInt(x3);
                var ux = parseInt(x1) - 1;
            }

            if (y3 - y2 > 0) {
                var py = parseInt(y2) + 1;
                var uy = parseInt(y3);
            } else {
                var py = parseInt(y3);
                var uy = parseInt(y1) - 1;
            }

            if (ux - px < uy - py) {
                var px = parseInt(x1);
                var ux = parseInt(x2);
            } else {
                var py = parseInt(y1);
                var uy = parseInt(y2);
            }

            for (var j = py; j <= uy; j++) {
                for (var i = px; i <= ux; i++) {
                    if (obj.records[j][i] && obj.rows[j].style.display != 'none' && obj.records[j][i].style.display != 'none') {
                        obj.records[j][i].classList.add('selection');
                        obj.records[py][i].classList.add('selection-top');
                        obj.records[uy][i].classList.add('selection-bottom');
                        obj.records[j][px].classList.add('selection-left');
                        obj.records[j][ux].classList.add('selection-right');

                        // Persist selected elements
                        obj.selection.push(obj.records[j][i]);
                    }
                }
            }
        }
    }

    /**
     * Update corner position
     * 
     * @return void
     */
    obj.updateCornerPosition = function() {
        // If any selected cells
        if (! obj.highlighted.length) {
            obj.corner.style.top = '-2000px';
            obj.corner.style.left = '-2000px';
        } else {
            // Get last cell
            var last = obj.highlighted[obj.highlighted.length-1];

            const contentRect = obj.content.getBoundingClientRect();
            var x1 = contentRect.left;
            var y1 = contentRect.top;

            const lastRect = last.getBoundingClientRect();
            var x2 = lastRect.left;
            var y2 = lastRect.top;
            var w2 = lastRect.width;
            var h2 = lastRect.height;

            var x = (x2 - x1) + obj.content.scrollLeft + w2 - 4;
            var y = (y2 - y1) + obj.content.scrollTop + h2 - 4;

            // Place the corner in the correct place
            obj.corner.style.top = y + 'px';
            obj.corner.style.left = x + 'px';
        }
    }

    /**
     * Update scroll position based on the selection
     */
    obj.updateScroll = function(direction) {
        // jExcel Container information
        const contentRect = obj.content.getBoundingClientRect();
        var x1 = contentRect.left;
        var y1 = contentRect.top;
        var w1 = contentRect.width;
        var h1 = contentRect.height;

        // Direction Left or Up
        var reference = obj.records[obj.selectedCell[3]][obj.selectedCell[2]];

            // Reference
        const referenceRect = reference.getBoundingClientRect();
        var x2 = referenceRect.left;
        var y2 = referenceRect.top;
        var w2 = referenceRect.width;
        var h2 = referenceRect.height;

        // Direction
        if (direction == 0 || direction == 1) {
            var x = (x2 - x1) + obj.content.scrollLeft;
            var y = (y2 - y1) + obj.content.scrollTop - 2;
        } else {
            var x = (x2 - x1) + obj.content.scrollLeft + w2;
            var y = (y2 - y1) + obj.content.scrollTop + h2;
        }

        // Top position check
        if (y > (obj.content.scrollTop + 30) && y < (obj.content.scrollTop + h1)) {
            // In the viewport
        } else {
            // Out of viewport
            if (y < obj.content.scrollTop + 30) {
                obj.content.scrollTop = y - h2;
            } else {
                obj.content.scrollTop = y - (h1 - 2);
            }
        }

        // Left position check - TODO: change that to the bottom border of the element
        if (x > (obj.content.scrollLeft) && x < (obj.content.scrollLeft + w1)) {
            // In the viewport
        } else {
            // Out of viewport
            if (x < obj.content.scrollLeft + 30) {
                obj.content.scrollLeft = x;
                if (obj.content.scrollLeft < 50) {
                    obj.content.scrollLeft = 0;
                }
            } else {
                obj.content.scrollLeft = x - (w1 - 20);
            }
        }
    }

    /**
     * Get the column width
     * 
     * @param int column column number (first column is: 0)
     * @return int current width
     */
    obj.getWidth = function(column) {
        if (! column) {
            // Get all headers
            var data = [];
            for (var i = 0; i < obj.headers.length; i++) {
                data.push(obj.options.columns[i].width);
            }
        } else {
            // In case the column is an object
            if (typeof(column) == 'object') {
                column = $(column).getAttribute('data-x');
            }

            data = obj.colgroup[column].getAttribute('width')
        }

        return data;
    }

    /**
     * Set the column width
     * 
     * @param int column number (first column is: 0)
     * @param int new column width
     * @param int old column width
     */
    obj.setWidth = function (column, width, oldWidth) {
        if (width > 0) {
            // In case the column is an object
            if (typeof(column) == 'object') {
                column = column.getAttribute('data-x');
            }

            // Oldwidth
            if (! oldWidth) {
                oldWidth = obj.colgroup[column].getAttribute('width');
            }

            // Set width
            obj.colgroup[column].setAttribute('width', width);
            obj.options.columns[column].width = width;

            // Keeping history of changes
            obj.setHistory({
                action:'setWidth',
                column:column,
                oldValue:oldWidth,
                newValue:width,
            });

            // On resize column
            if (obj.ignoreEvents != true) {
                if (typeof(obj.options.onresizecolumn) == 'function') {
                    obj.options.onresizecolumn(el, column, width, oldWidth);
                }
            }

            // Update corner position
            obj.updateCornerPosition();
        }
    }

    /**
     * Set the row height
     * 
     * @param row - row number (first row is: 0)
     * @param height - new row height
     * @param oldHeight - old row height
     */
    obj.setHeight = function (row, height, oldHeight) {
        if (height > 0) {
            // In case the column is an object
            if (typeof(row) == 'object') {
                row = row.getAttribute('data-y');
            }

            // Oldwidth
            if (! oldHeight) {
                oldHeight = obj.rows[row].getAttribute('height');

                if (! oldHeight) {
                    var rect = obj.rows[row].getBoundingClientRect();
                    oldHeight = rect.height;
                }
            }

            // Integer
            height = parseInt(height);

            // Set width
            obj.rows[row].style.height = height + 'px';

            // Keep options updated
            if (! obj.options.rows[row]) {
                obj.options.rows[row] = {};
            }
            obj.options.rows[row].height = height;

            // Keeping history of changes
            obj.setHistory({
                action:'setHeight',
                row:row,
                oldValue:oldHeight,
                newValue:height,
            });

            // On resize column
            if (obj.ignoreEvents != true) {
                if (typeof(obj.options.onresizerow) == 'function') {
                    obj.options.onresizerow(el, row, height, oldHeight);
                }
            }

            // Update corner position
            obj.updateCornerPosition();
        }
    }

    /**
     * Get the row height
     * 
     * @param row - row number (first row is: 0)
     * @return height - current row height
     */
    obj.getHeight = function(row) {
        if (! row) {
            // Get height of all rows
            var data = [];
            for (var j = 0; j < obj.rows.length; j++) {
                var h = obj.rows[j].style.height;
                if (h) {
                    data[j] = h;
                }
            }
        } else {
            // In case the row is an object
            if (typeof(row) == 'object') {
                row = $(row).getAttribute('data-y');
            }

            var data = obj.rows[row].style.height;
        }

        return data;
    }

    /**
     * Get the column title
     * 
     * @param column - column number (first column is: 0)
     * @param title - new column title
     */
    obj.getHeader = function(column) {
        return obj.headers[column].innerText;
    }

    /**
     * Set the column title
     * 
     * @param column - column number (first column is: 0)
     * @param title - new column title
     */
    obj.setHeader = function(column, newValue) {
        if (obj.headers[column]) {
            var oldValue = obj.headers[column].innerText;

            if (! newValue) {
                newValue = prompt(obj.options.text.columnName, oldValue)
            }

            if (newValue) {
                obj.headers[column].innerHTML = newValue;
                // Keep the title property
                obj.headers[column].setAttribute('title', newValue);
                // Update title
                obj.options.columns[column].title = newValue;
            }

            obj.setHistory({
                action: 'setHeader',
                column: column,
                oldValue: oldValue,
                newValue: newValue
            });

            // On change
            if (! obj.ignoreEvents) {
                if (typeof(obj.options.onchangeheader) == 'function') {
                    obj.options.onchangeheader(el, column, oldValue, newValue);
                }
            }
        }
    }

    /**
     * Get the headers
     * 
     * @param asArray
     * @return mixed
     */
    obj.getHeaders = function (asArray) {
        var title = [];

        for (var i = 0; i < obj.headers.length; i++) {
            title.push(obj.getHeader(i));
        }

        return asArray ? title : title.join(obj.options.csvDelimiter);
    }

    /**
     * Get meta information from cell(s)
     * 
     * @return integer
     */
    obj.getMeta = function(cell, key) {
        if (! cell) {
            return obj.options.meta;
        } else {
            if (key) {
                return obj.options.meta[cell] && obj.options.meta[cell][key] ? obj.options.meta[cell][key] : null;
            } else {
                return obj.options.meta[cell] ? obj.options.meta[cell] : null;
            }
        }
    }

    /**
     * Set meta information to cell(s)
     * 
     * @return integer
     */
    obj.setMeta = function(o, k, v) {
        if (! obj.options.meta) {
            obj.options.meta = {}
        }

        if (k && v) {
            // Set data value
            if (! obj.options.meta[o]) {
                obj.options.meta[o] = {};
            }
            obj.options.meta[o][k] = v;
        } else {
            // Apply that for all cells
            var keys = Object.keys(o);
            for (var i = 0; i < keys.length; i++) {
                if (! obj.options.meta[keys[i]]) {
                    obj.options.meta[keys[i]] = {};
                }

                var prop = Object.keys(o[keys[i]]);
                for (var j = 0; j < prop.length; j++) {
                    obj.options.meta[keys[i]][prop[j]] = o[keys[i]][prop[j]];
                }
            }
        }

        if (obj.ignoreEvents != true) {
            if (typeof(obj.options.onchangemeta) == 'function') {
                obj.options.onchangemeta(el, o, k, v);
            }
        }
    }

    /**
     * Update meta information
     * 
     * @return integer
     */
    obj.updateMeta = function(affectedCells) {
        if (obj.options.meta) {
            var newMeta = {};
            var keys = Object.keys(obj.options.meta);
            for (var i = 0; i < keys.length; i++) {
                if (affectedCells[keys[i]]) {
                    newMeta[affectedCells[keys[i]]] = obj.options.meta[keys[i]];
                } else {
                    newMeta[keys[i]] = obj.options.meta[keys[i]];
                }
            }
            // Update meta information
            obj.options.meta = newMeta;
        }
    }

    /**
     * Get style information from cell(s)
     * 
     * @return integer
     */
    obj.getStyle = function(cell, key) {
        // Cell
        if (! cell) {
            // Control vars
            var data = {};

            // Column and row length
            var x = obj.options.data[0].length;
            var y = obj.options.data.length;

            // Go through the columns to get the data
            for (var j = 0; j < y; j++) {
                for (var i = 0; i < x; i++) {
                    // Value
                    var v = key ? obj.records[j][i].style[key] : obj.records[j][i].getAttribute('style');

                    // Any meta data for this column?
                    if (v) {
                        // Column name
                        var k = jexcel.getColumnNameFromId([i, j]);
                        // Value
                        data[k] = v;
                    }
                }
            }

           return data;
        } else {
            cell = jexcel.getIdFromColumnName(cell, true);

            return key ? obj.records[cell[1]][cell[0]].style[key] : obj.records[cell[1]][cell[0]].getAttribute('style');
        }
    },

    obj.resetStyle = function(o, ignoreHistoryAndEvents) {
        var keys = Object.keys(o);
        for (var i = 0; i < keys.length; i++) {
            // Position
            var cell = jexcel.getIdFromColumnName(keys[i], true);
            if (obj.records[cell[1]] && obj.records[cell[1]][cell[0]]) {
                obj.records[cell[1]][cell[0]].setAttribute('style', '');
            }
        }
        obj.setStyle(o, null, null, null, ignoreHistoryAndEvents);
    }

    /**
     * Set meta information to cell(s)
     * 
     * @return integer
     */
    obj.setStyle = function(o, k, v, force, ignoreHistoryAndEvents) {
        var newValue = {};
        var oldValue = {};

        // Apply style
        var applyStyle = function(cellId, key, value) {
            // Position
            var cell = jexcel.getIdFromColumnName(cellId, true);

            if (obj.records[cell[1]] && obj.records[cell[1]][cell[0]]) {
                // Current value
                var currentValue = obj.records[cell[1]][cell[0]].style[key];

                // Change layout
                if (currentValue == value && ! force) {
                    value = '';
                    obj.records[cell[1]][cell[0]].style[key] = '';
                } else {
                    obj.records[cell[1]][cell[0]].style[key] = value;
                }

                // History
                if (! oldValue[cellId]) {
                    oldValue[cellId] = [];
                }
                if (! newValue[cellId]) {
                    newValue[cellId] = [];
                }

                oldValue[cellId].push([key + ':' + currentValue]);
                newValue[cellId].push([key + ':' + value]);
            }
        }

        if (k && v) {
            // Get object from string
            if (typeof(o) == 'string') {
                applyStyle(o, k, v);
            } else {
                // Avoid duplications
                var oneApplication = [];
                // Apply that for all cells
                for (var i = 0; i < o.length; i++) {
                    var x = o[i].getAttribute('data-x');
                    var y = o[i].getAttribute('data-y');
                    var cellName = jexcel.getColumnNameFromId([x, y]);
                    // This happens when is a merged cell
                    if (! oneApplication[cellName]) {
                        applyStyle(cellName, k, v);
                        oneApplication[cellName] = true;
                    }
                }
            }
        } else {
            var keys = Object.keys(o);
            for (var i = 0; i < keys.length; i++) {
                var style = o[keys[i]];
                if (typeof(style) == 'string') {
                    style = style.split(';');
                }
                for (var j = 0; j < style.length; j++) {
                    if (typeof(style[j]) == 'string') {
                        style[j] = style[j].split(':');
                    }
                    // Apply value
                    if (style[j][0].trim()) {
                        applyStyle(keys[i], style[j][0].trim(), style[j][1]);
                    }
                }
            }
        }

        var keys = Object.keys(oldValue);
        for (var i = 0; i < keys.length; i++) {
            oldValue[keys[i]] = oldValue[keys[i]].join(';');
        }
        var keys = Object.keys(newValue);
        for (var i = 0; i < keys.length; i++) {
            newValue[keys[i]] = newValue[keys[i]].join(';');
        }

        if (! ignoreHistoryAndEvents) {
            // Keeping history of changes
            obj.setHistory({
                action: 'setStyle',
                oldValue: oldValue,
                newValue: newValue,
            });
        }

        if (obj.ignoreEvents != true) {
            if (typeof(obj.options.onchangestyle) == 'function') {
                obj.options.onchangestyle(el, o, k, v);
            }
        }
    }

    /**
     * Get cell comments, null cell for all
     */
    obj.getComments = function(cell, withAuthor) {
        if (cell) {
            if (typeof(cell) == 'string') {
              var cell = jexcel.getIdFromColumnName(cell, true);
            }

            if (withAuthor) {
                return [obj.records[cell[1]][cell[0]].getAttribute('title'), obj.records[cell[1]][cell[0]].getAttribute('author')];
            } else {
                return obj.records[cell[1]][cell[0]].getAttribute('title') || '';
            }
        } else {
            var data = {};
            for (var j = 0; j < obj.options.data.length; j++) {
                for (var i = 0; i < obj.options.columns.length; i++) {
                    var comments = obj.records[j][i].getAttribute('title');
                    if (comments) {
                        var cell = jexcel.getColumnNameFromId([i, j]);
                        data[cell] = comments;
                    }
                }
            }
            return data;
        }
    }

    /**
     * Set cell comments
     */
    obj.setComments = function(cellId, comments, author) {
        if (typeof(cellId) == 'string') {
            var cell = jexcel.getIdFromColumnName(cellId, true);
        } else {
            var cell = cellId;
        }

        // Keep old value
        var title = obj.records[cell[1]][cell[0]].getAttribute('title');
        var author = obj.records[cell[1]][cell[0]].getAttribute('data-author');
        var oldValue = [ title, author ];

        // Set new values
        obj.records[cell[1]][cell[0]].setAttribute('title', comments ? comments : '');
        obj.records[cell[1]][cell[0]].setAttribute('data-author', author ? author : '');

        // Remove class if there is no comment
        if (comments) {
            obj.records[cell[1]][cell[0]].classList.add('jexcel_comments');
        } else {
            obj.records[cell[1]][cell[0]].classList.remove('jexcel_comments');
        }

        // Save history
        obj.setHistory({
            action:'setComments',
            column: cellId,
            newValue: [ comments, author ],
            oldValue: oldValue,
        });
    }

    /**
     * Get table config information
     */
    obj.getConfig = function() {
        var options = obj.options;
        options.style = obj.getStyle();
        options.mergeCells = obj.getMerge();
        options.comments = obj.getComments();

        return options;
    }

    /**
     * Sort data and reload table
     */
    obj.orderBy = function(column, order) {
        if (column >= 0) {
            // Merged cells
            if (Object.keys(obj.options.mergeCells).length > 0) {
                if (! confirm(obj.options.text.thisActionWillDestroyAnyExistingMergedCellsAreYouSure)) {
                    return false;
                } else {
                    // Remove merged cells
                    obj.destroyMerged();
                }
            }

            // Direction
            if (order == null) {
                order = obj.headers[column].classList.contains('arrow-down') ? 1 : 0;
            } else {
                order = order ? 1 : 0;
            }

            // Filter
            Array.prototype.orderBy = function(p, o) {
                return this.slice(0).sort(function(a, b) {
                    var valueA = a[p] == '' ? '' : Number(a[p]) == a[p] ? Number(a[p]) : a[p].toLowerCase();
                    var valueB = b[p] == '' ? '' : Number(b[p]) == b[p] ? Number(b[p]) : b[p].toLowerCase();

                    if (! o) {
                        return (valueA == '' && valueB != '') ? 1 : (valueA != '' && valueB == '') ? -1 : (valueA > valueB) ? 1 : (valueA < valueB) ? -1 :  0;
                    } else {
                        return (valueA == '' && valueB != '') ? 1 : (valueA != '' && valueB == '') ? -1 : (valueA > valueB) ? -1 : (valueA < valueB) ? 1 :  0;
                    }
                });
            }

            // Test order
            var temp = [];
            if (obj.options.columns[column].type == 'calendar' ||
                obj.options.columns[column].type == 'checkbox' ||
                obj.options.columns[column].type == 'radio') {
                for (var j = 0; j < obj.options.data.length; j++) {
                    temp[j] = [ j, obj.options.data[j][column] ];
                }
            } else {
                for (var j = 0; j < obj.options.data.length; j++) {
                    temp[j] = [ j, obj.records[j][column].innerHTML ];
                }
            }
            temp = temp.orderBy(1, order);

            // Save history
            var newValue = [];
            for (var j = 0; j < temp.length; j++) {
                newValue[j] = temp[j][0];
            }

            // Save history
            obj.setHistory({
                action: 'orderBy',
                rows: newValue,
                column: column,
                order: order,
            });

            // Update order
            obj.updateOrderArrow(column, order);
            obj.updateOrder(newValue);

            // On sort event
            if (obj.ignoreEvents != true) {
                if (typeof(obj.options.onsort) == 'function') {
                    obj.options.onsort(el, column, order);
                }
            }

            return true;
        }
    }

    /**
     * Update order arrow
     */
    obj.updateOrderArrow = function(column, order) {
        // Remove order
        for (var i = 0; i < obj.headers.length; i++) {
            obj.headers[i].classList.remove('arrow-up');
            obj.headers[i].classList.remove('arrow-down');
        }

        // No order specified then toggle order
        if (order) {
            obj.headers[column].classList.add('arrow-up');
        } else {
            obj.headers[column].classList.add('arrow-down');
        }
    }

    /**
     * Update rows position
     */
    obj.updateOrder = function(rows) {
        // History
        var data = []
        for (var j = 0; j < rows.length; j++) {
            data[j] = obj.options.data[rows[j]];
        }
        obj.options.data = data;

        var data = []
        for (var j = 0; j < rows.length; j++) {
            data[j] = obj.records[rows[j]];
        }
        obj.records = data;

        var data = []
        for (var j = 0; j < rows.length; j++) {
            data[j] = obj.rows[rows[j]];
        }
        obj.rows = data;

        // Update references
        obj.updateTableReferences();

        // Redo search
        if (obj.searchInput.value) {
            obj.search(obj.searchInput.value);
        } else {
            // Create page
            obj.results = null;
            obj.pageNumber = 0;

            if (obj.options.pagination > 0) {
                obj.page(0);
            } else if (obj.options.lazyLoading == true) {
                obj.loadPage(0);
            } else {
                for (var j = 0; j < obj.rows.length; j++) {
                    obj.tbody.appendChild(obj.rows[j]);
                }
            }
        }
    }

    /**
     * Move row
     * 
     * @return void
     */
    obj.moveRow = function(o, d, ignoreDom) {
        if (Object.keys(obj.options.mergeCells).length > 0) {
           if (o > d) {
               var insertBefore = 1;
           } else {
               var insertBefore = 0;
           }

           if (obj.isRowMerged(o).length || obj.isRowMerged(d, insertBefore).length) {
                if (! confirm(obj.options.text.thisActionWillDestroyAnyExistingMergedCellsAreYouSure)) {
                    return false;
                } else {
                    obj.destroyMerged();
                }
            }
        }

        if (obj.options.search == true) {
            if (obj.results && obj.results.length != obj.rows.length) {
                if (confirm(obj.options.text.thisActionWillClearYourSearchResultsAreYouSure)) {
                    obj.resetSearch();
                } else {
                    return false;
                }
            }

            obj.results = null;
        }

        if (! ignoreDom) {
            if (Array.prototype.indexOf.call(obj.tbody.children, obj.rows[d]) >= 0) {
                if (o > d) {
                    obj.tbody.insertBefore(obj.rows[o], obj.rows[d]);
                } else {
                    obj.tbody.insertBefore(obj.rows[o], obj.rows[d].nextSibling);
                }
            } else {
                obj.tbody.removeChild(obj.rows[o]);
            }
        }

        // Place references in the correct position
        obj.rows.splice(d, 0, obj.rows.splice(o, 1)[0]);
        obj.records.splice(d, 0, obj.records.splice(o, 1)[0]);
        obj.options.data.splice(d, 0, obj.options.data.splice(o, 1)[0]);

        // Respect pagination
        if (obj.options.pagination > 0 && obj.tbody.children.length != obj.options.pagination) {
            obj.page(obj.pageNumber);
        }

        // Keeping history of changes
        obj.setHistory({
            action:'moveRow',
            oldValue: o,
            newValue: d,
        });

        // Update table references
        obj.updateTableReferences();

        // Events
        if (obj.ignoreEvents != true) {
            if (typeof(obj.options.onmoverow) == 'function') {
                obj.options.onmoverow(el, o, d);
            }
        }
    }

    /**
     * Insert a new row
     * 
     * @param mixed - number of blank lines to be insert or a single array with the data of the new row
     * @param rowNumber
     * @param insertBefore
     * @return void
     */
    obj.insertRow = function(mixed, rowNumber, insertBefore) {
        // Configuration
        if (obj.options.allowInsertRow == true) {
            // Records
            var records = [];

            // Data to be insert
            var data = [];

            // The insert could be lead by number of rows or the array of data
            if (mixed > 0) {
                var numOfRows = mixed;
            } else {
                var numOfRows = 1;

                if (mixed) {
                    data = mixed;
                }
            }

            // Direction
            var insertBefore = insertBefore ? true : false;

            // Current column number
            var lastRow = obj.options.data.length - 1;

            if (rowNumber == undefined || rowNumber >= parseInt(lastRow) || rowNumber < 0) {
                rowNumber = lastRow;
            }

            // Onbeforeinsertrow
            if (typeof(obj.options.onbeforeinsertrow) == 'function') {
                if (! obj.options.onbeforeinsertrow(el, rowNumber, numOfRows, insertBefore)) {
                    console.log('onbeforeinsertrow returned false');

                    return false;
                }
            }

            // Merged cells
            if (Object.keys(obj.options.mergeCells).length > 0) {
                if (obj.isRowMerged(rowNumber, insertBefore).length) {
                    if (! confirm(obj.options.text.thisActionWillDestroyAnyExistingMergedCellsAreYouSure)) {
                        return false;
                    } else {
                        obj.destroyMerged();
                    }
                }
            }

            // Clear any search
            if (obj.options.search == true) {
                if (obj.results && obj.results.length != obj.rows.length) {
                    if (confirm(obj.options.text.thisActionWillClearYourSearchResultsAreYouSure)) {
                        obj.resetSearch();
                    } else {
                        return false;
                    }
                }

                obj.results = null;
            }

            // Insertbefore
            var rowIndex = (! insertBefore) ? rowNumber + 1 : rowNumber;

            // Keep the current data
            var currentRecords = obj.records.splice(rowIndex);
            var currentData = obj.options.data.splice(rowIndex);
            var currentRows = obj.rows.splice(rowIndex);

            // Adding lines
            var rowRecords = [];
            var rowData = [];
            var rowNode = [];

            for (var row = rowIndex; row < (numOfRows + rowIndex); row++) {
                // Push data to the data container
                obj.options.data[row] = [];
                for (var col = 0; col < obj.options.columns.length; col++) {
                    obj.options.data[row][col]  = data[col] ? data[col] : '';
                }
                // Create row
                var tr = obj.createRow(row, obj.options.data[row]);
                // Append node
                if (currentRows[0]) {
                    if (Array.prototype.indexOf.call(obj.tbody.children, currentRows[0]) >= 0) {
                        obj.tbody.insertBefore(tr, currentRows[0]);
                    }
                } else {
                    if (Array.prototype.indexOf.call(obj.tbody.children, obj.rows[rowNumber]) >= 0) {
                        obj.tbody.appendChild(tr);
                    }
                }
                // Record History
                rowRecords.push(obj.records[row]);
                rowData.push(obj.options.data[row]);
                rowNode.push(tr);
            }

            // Copy the data back to the main data
            Array.prototype.push.apply(obj.records, currentRecords);
            Array.prototype.push.apply(obj.options.data, currentData);
            Array.prototype.push.apply(obj.rows, currentRows);

            // Respect pagination
            if (obj.options.pagination > 0) {
                obj.page(obj.pageNumber);
            }

            // Keep history
            obj.setHistory({
                action: 'insertRow',
                rowNumber: rowNumber,
                numOfRows: numOfRows,
                insertBefore: insertBefore,
                rowRecords: rowRecords,
                rowData: rowData,
                rowNode: rowNode,
            });

            // Remove table references
            obj.updateTableReferences();

            // Events
            if (obj.ignoreEvents != true) {
                if (typeof(obj.options.oninsertrow) == 'function') {
                    obj.options.oninsertrow(el, rowNumber, numOfRows, rowRecords, insertBefore);
                }
            }
        }
    }

    /**
     * Delete a row by number
     * 
     * @param integer rowNumber - row number to be excluded
     * @param integer numOfRows - number of lines
     * @return void
     */
    obj.deleteRow = function(rowNumber, numOfRows) {
        // Global Configuration
        if (obj.options.allowDeleteRow == true) {
            if (obj.options.allowDeletingAllRows == true || obj.options.data.length > 1) {
                // Delete row definitions
                if (rowNumber == undefined) {
                    var number = obj.getSelectedRows();

                    if (! number[0]) {
                        rowNumber = obj.options.data.length - 1;
                        numOfRows = 1;
                    } else {
                        rowNumber = parseInt(number[0].getAttribute('data-y'));
                        numOfRows = number.length;
                    }
                }

                // Last column
                var lastRow = obj.options.data.length - 1;

                if (rowNumber == undefined || rowNumber > lastRow || rowNumber < 0) {
                    rowNumber = lastRow;
                }

                if (! numOfRows) {
                    numOfRows = 1;
                }

                // Do not delete more than the number of recoreds
                if (rowNumber + numOfRows >= obj.options.data.length) {
                    numOfRows = obj.options.data.length - rowNumber;
                }

                // Onbeforedeleterow
                if (typeof(obj.options.onbeforedeleterow) == 'function') {
                    if (! obj.options.onbeforedeleterow(el, rowNumber, numOfRows)) {
                        console.log('onbeforedeleterow returned false');
                        return false;
                    }
                }

                if (parseInt(rowNumber) > -1) {
                    // Merged cells
                    var mergeExists = false;
                    if (Object.keys(obj.options.mergeCells).length > 0) {
                        for (var row = rowNumber; row < rowNumber + numOfRows; row++) {
                            if (obj.isRowMerged(row, false).length) {
                                mergeExists = true;
                            }
                        }
                    }
                    if (mergeExists) {
                        if (! confirm(obj.options.text.thisActionWillDestroyAnyExistingMergedCellsAreYouSure)) {
                            return false;
                        } else {
                            obj.destroyMerged();
                        }
                    }

                    // Clear any search
                    if (obj.options.search == true) {
                        if (obj.results && obj.results.length != obj.rows.length) {
                            if (confirm(obj.options.text.thisActionWillClearYourSearchResultsAreYouSure)) {
                                obj.resetSearch();
                            } else {
                                return false;
                            }
                        }

                        obj.results = null;
                    }

                    // Remove node
                    for (var row = rowNumber; row < rowNumber + numOfRows; row++) {
                        if (Array.prototype.indexOf.call(obj.tbody.children, obj.rows[row]) >= 0) {
                            obj.rows[row].className = '';
                            obj.rows[row].parentNode.removeChild(obj.rows[row]);
                        }
                    }

                    // Remove data
                    var rowRecords = obj.records.splice(rowNumber, numOfRows);
                    var rowData = obj.options.data.splice(rowNumber, numOfRows);
                    var rowNode = obj.rows.splice(rowNumber, numOfRows);

                    // Respect pagination
                    if (obj.options.pagination > 0 && obj.tbody.children.length != obj.options.pagination) {
                        obj.page(obj.pageNumber);
                    }

                    // Remove selection
                    obj.conditionalSelectionUpdate(1, rowNumber, (rowNumber + numOfRows) - 1);

                    // Keep history
                    obj.setHistory({
                        action: 'deleteRow',
                        rowNumber: rowNumber,
                        numOfRows: numOfRows,
                        insertBefore: 1,
                        rowRecords: rowRecords,
                        rowData: rowData,
                        rowNode: rowNode
                    });

                    // Remove table references
                    obj.updateTableReferences();

                    // Events
                    if (obj.ignoreEvents != true) {
                        if (typeof(obj.options.ondeleterow) == 'function') {
                            obj.options.ondeleterow(el, rowNumber, numOfRows, rowRecords);
                        }
                    }
                }
            } else {
                console.error('JEXCEL. It is not possible to delete the last row');
            }
        }
    }


    /**
     * Move column
     * 
     * @return void
     */
    obj.moveColumn = function(o, d) {
        if (Object.keys(obj.options.mergeCells).length > 0) {
            if (o > d) {
                var insertBefore = 1;
            } else {
                var insertBefore = 0;
            }

            if (obj.isColMerged(o).length || obj.isColMerged(d, insertBefore).length) {
                if (! confirm(obj.options.text.thisActionWillDestroyAnyExistingMergedCellsAreYouSure)) {
                    return false;
                } else {
                    obj.destroyMerged();
                }
            }
        }

        var o = parseInt(o);
        var d = parseInt(d);

        if (o > d) {
            obj.headerContainer.insertBefore(obj.headers[o], obj.headers[d]);
            obj.colgroupContainer.insertBefore(obj.colgroup[o], obj.colgroup[d]);

            for (var j = 0; j < obj.rows.length; j++) {
                obj.rows[j].insertBefore(obj.records[j][o], obj.records[j][d]);
            }
        } else {
            obj.headerContainer.insertBefore(obj.headers[o], obj.headers[d].nextSibling);
            obj.colgroupContainer.insertBefore(obj.colgroup[o], obj.colgroup[d].nextSibling);

            for (var j = 0; j < obj.rows.length; j++) {
                obj.rows[j].insertBefore(obj.records[j][o], obj.records[j][d].nextSibling);
            }
        }

        obj.options.columns.splice(d, 0, obj.options.columns.splice(o, 1)[0]);
        obj.headers.splice(d, 0, obj.headers.splice(o, 1)[0]);
        obj.colgroup.splice(d, 0, obj.colgroup.splice(o, 1)[0]);

        for (var j = 0; j < obj.rows.length; j++) {
            obj.options.data[j].splice(d, 0, obj.options.data[j].splice(o, 1)[0]);
            obj.records[j].splice(d, 0, obj.records[j].splice(o, 1)[0]);
        }

        // Keeping history of changes
        obj.setHistory({
            action:'moveColumn',
            oldValue: o,
            newValue: d,
        });

        // Update table references
        obj.updateTableReferences();

        // Events
        if (obj.ignoreEvents != true) {
            if (typeof(obj.options.onmovecolumn) == 'function') {
                obj.options.onmovecolumn(el, o, d);
            }
        }
    }


    /**
     * Insert a new column
     * 
     * @param mixed - num of columns to be added or data to be added in one single column
     * @param int columnNumber - number of columns to be created
     * @param bool insertBefore
     * @param object properties - column properties
     * @return void
     */
    obj.insertColumn = function(mixed, columnNumber, insertBefore, properties) {
        // Configuration
        if (obj.options.allowInsertColumn == true) {
            // Records
            var records = [];

            // Data to be insert
            var data = [];

            // The insert could be lead by number of rows or the array of data
            if (mixed > 0) {
                var numOfColumns = mixed;
            } else {
                var numOfColumns = 1;

                if (mixed) {
                    data = mixed;
                }
            }

            // Direction
            var insertBefore = insertBefore ? true : false;

            // Current column number
            var lastColumn = obj.options.columns.length - 1;

            // Confirm position
            if (columnNumber == undefined || columnNumber >= parseInt(lastColumn) || columnNumber < 0) {
                columnNumber = lastColumn;
            }

            // Onbeforeinsertcolumn
            if (typeof(obj.options.onbeforeinsertcolumn) == 'function') {
                if (! obj.options.onbeforeinsertcolumn(el, columnNumber, numOfColumns, insertBefore)) {
                    console.log('onbeforeinsertcolumn returned false');

                    return false;
                }
            }

            // Merged cells
            if (Object.keys(obj.options.mergeCells).length > 0) {
                if (obj.isColMerged(columnNumber, insertBefore).length) {
                    if (! confirm(obj.options.text.thisActionWillDestroyAnyExistingMergedCellsAreYouSure)) {
                        return false;
                    } else {
                        obj.destroyMerged();
                    }
                }
            }

            // Create default properties
            if (! properties) {
                properties = [];
            }

            for (var i = 0; i < numOfColumns; i++) {
                if (! properties[i]) {
                    properties[i] = { type:'text', source:[], options:[], width:obj.options.defaultColWidth, align:obj.options.defaultColAlign };
                }
            }

            // Insert before
            var columnIndex = (! insertBefore) ? columnNumber + 1 : columnNumber;
            obj.options.columns = jexcel.injectArray(obj.options.columns, columnIndex, properties);

            // Open space in the containers
            var currentHeaders = obj.headers.splice(columnIndex);
            var currentColgroup = obj.colgroup.splice(columnIndex);

            // History
            var historyHeaders = [];
            var historyColgroup = [];
            var historyRecords = [];
            var historyData = [];

            // Add new headers
            for (var col = columnIndex; col < (numOfColumns + columnIndex); col++) {
                obj.createCellHeader(col);
                obj.headerContainer.insertBefore(obj.headers[col], obj.headerContainer.children[col+1]);
                obj.colgroupContainer.insertBefore(obj.colgroup[col], obj.colgroupContainer.children[col+1]);

                historyHeaders.push(obj.headers[col]);
                historyColgroup.push(obj.colgroup[col]);
            }

            // Adding visual columns
            for (var row = 0; row < obj.options.data.length; row++) {
                // Keep the current data
                var currentData = obj.options.data[row].splice(columnIndex);
                var currentRecord = obj.records[row].splice(columnIndex);

                // History
                historyData[row] = [];
                historyRecords[row] = [];

                for (var col = columnIndex; col < (numOfColumns + columnIndex); col++) {
                    // New value
                    var value = data[row] ? data[row] : '';
                    obj.options.data[row][col] = value;
                    // New cell
                    var td = obj.createCell(col, row, obj.options.data[row][col]);
                    obj.records[row][col] = td;
                    // Add cell to the row
                    if (obj.rows[row]) {
                        obj.rows[row].insertBefore(td, obj.rows[row].children[col+1]);
                    }

                    // Record History
                    historyData[row].push(value);
                    historyRecords[row].push(td);
                }

                // Copy the data back to the main data
                Array.prototype.push.apply(obj.options.data[row], currentData);
                Array.prototype.push.apply(obj.records[row], currentRecord);
            }

            Array.prototype.push.apply(obj.headers, currentHeaders);
            Array.prototype.push.apply(obj.colgroup, currentColgroup);

            // Adjust nested headers
            if (obj.options.nestedHeaders && obj.options.nestedHeaders.length > 0) {
                // Flexible way to handle nestedheaders
                if (obj.options.nestedHeaders[0] && obj.options.nestedHeaders[0][0]) {
                    for (var j = 0; j < obj.options.nestedHeaders.length; j++) {
                        var colspan = parseInt(obj.options.nestedHeaders[j][obj.options.nestedHeaders[j].length-1].colspan) + numOfColumns;
                        obj.options.nestedHeaders[j][obj.options.nestedHeaders[j].length-1].colspan = colspan;
                        obj.thead.children[j].children[obj.thead.children[j].children.length-1].setAttribute('colspan', colspan);
                    }
                } else {
                    var colspan = parseInt(obj.options.nestedHeaders[0].colspan) + numOfColumns;
                    obj.options.nestedHeaders[0].colspan = colspan;
                    obj.thead.children[0].children[obj.thead.children[0].children.length-1].setAttribute('colspan', colspan);
                }
            }

            // Keep history
            obj.setHistory({
                action: 'insertColumn',
                columnNumber:columnNumber,
                numOfColumns:numOfColumns,
                insertBefore:insertBefore,
                columns:properties,
                headers:historyHeaders,
                colgroup:historyColgroup,
                records:historyRecords,
                data:historyData,
            });

            // Remove table references
            obj.updateTableReferences();

            // Events
            if (obj.ignoreEvents != true) {
                if (typeof(obj.options.oninsertcolumn) == 'function') {
                    obj.options.oninsertcolumn(el, columnNumber, numOfColumns, historyRecords, insertBefore);
                }
            }
        }
    }

    /**
     * Delete a column by number
     * 
     * @param integer columnNumber - reference column to be excluded
     * @param integer numOfColumns - number of columns to be excluded from the reference column
     * @return void
     */
    obj.deleteColumn = function(columnNumber, numOfColumns) {
        // Global Configuration
        if (obj.options.allowDeleteColumn == true) {
            if (obj.headers.length > 1) {
                // Delete column definitions
                if (columnNumber == undefined) {
                    var number = obj.getSelectedColumns(true);

                    if (! number.length) {
                        // Remove last column
                        columnNumber = obj.headers.length - 1;
                        numOfColumns = 1;
                    } else {
                        // Remove selected
                        columnNumber = parseInt(number[0]);
                        numOfColumns = parseInt(number.length);
                    }
                }

                // Lasat column
                var lastColumn = obj.options.data[0].length - 1;

                if (columnNumber == undefined || columnNumber > lastColumn || columnNumber < 0) {
                    columnNumber = lastColumn;
                }

                // Minimum of columns to be delete is 1
                if (! numOfColumns) {
                    numOfColumns = 1;
                }



                // Can't delete more than the limit of the table
                if (numOfColumns > obj.options.data[0].length - columnNumber) {
                    numOfColumns = obj.options.data[0].length - columnNumber;
                }

                // onbeforedeletecolumn
                if (typeof(obj.options.onbeforedeletecolumn) == 'function') {
                   if (! obj.options.onbeforedeletecolumn(el, columnNumber, numOfColumns)) {
                      console.log('onbeforedeletecolumn returned false');
                      return false;
                   }
                }

                // Can't remove the last column
                if (parseInt(columnNumber) > -1) {
                    // Merged cells
                    var mergeExists = false;
                    if (Object.keys(obj.options.mergeCells).length > 0) {
                        for (var col = columnNumber; col < columnNumber + numOfColumns; col++) {
                            if (obj.isColMerged(col, false).length) {
                                mergeExists = true;
                            }
                        }
                    }
                    if (mergeExists) {
                        if (! confirm(obj.options.text.thisActionWillDestroyAnyExistingMergedCellsAreYouSure)) {
                            return false;
                        } else {
                            obj.destroyMerged();
                        }
                    }

                    // Delete the column properties
                    var columns = obj.options.columns.splice(columnNumber, numOfColumns);

                    for (var col = columnNumber; col < columnNumber + numOfColumns; col++) {
                        obj.colgroup[col].className = '';
                        obj.headers[col].className = '';
                        obj.colgroup[col].parentNode.removeChild(obj.colgroup[col]);
                        obj.headers[col].parentNode.removeChild(obj.headers[col]);
                    }

                    var historyHeaders = obj.headers.splice(columnNumber, numOfColumns);
                    var historyColgroup = obj.colgroup.splice(columnNumber, numOfColumns);
                    var historyRecords = [];
                    var historyData = [];

                    for (var row = 0; row < obj.options.data.length; row++) {
                        for (var col = columnNumber; col < columnNumber + numOfColumns; col++) {
                            obj.records[row][col].className = '';
                            obj.records[row][col].parentNode.removeChild(obj.records[row][col]);
                        }
                    }

                    // Delete headers
                    for (var row = 0; row < obj.options.data.length; row++) {
                        // History
                        historyData[row] = obj.options.data[row].splice(columnNumber, numOfColumns);
                        historyRecords[row] = obj.records[row].splice(columnNumber, numOfColumns);
                    }

                    // Remove selection
                    obj.conditionalSelectionUpdate(0, columnNumber, (columnNumber + numOfColumns) - 1);

                    // Adjust nested headers
                    if (obj.options.nestedHeaders && obj.options.nestedHeaders.length > 0) {
                        // Flexible way to handle nestedheaders
                        if (obj.options.nestedHeaders[0] && obj.options.nestedHeaders[0][0]) {
                            for (var j = 0; j < obj.options.nestedHeaders.length; j++) {
                                var colspan = parseInt(obj.options.nestedHeaders[j][obj.options.nestedHeaders[j].length-1].colspan) - numOfColumns;
                                obj.options.nestedHeaders[j][obj.options.nestedHeaders[j].length-1].colspan = colspan;
                                obj.thead.children[j].children[obj.thead.children[j].children.length-1].setAttribute('colspan', colspan);
                            }
                        } else {
                            var colspan = parseInt(obj.options.nestedHeaders[0].colspan) - numOfColumns;
                            obj.options.nestedHeaders[0].colspan = colspan;
                            obj.thead.children[0].children[obj.thead.children[0].children.length-1].setAttribute('colspan', colspan);
                        }
                    }

                    // Keeping history of changes
                    obj.setHistory({
                        action:'deleteColumn',
                        columnNumber:columnNumber,
                        numOfColumns:numOfColumns,
                        insertBefore: 1,
                        columns:columns,
                        headers:historyHeaders,
                        colgroup:historyColgroup,
                        records:historyRecords,
                        data:historyData,
                    });

                    // Update table references
                    obj.updateTableReferences();

                    // Delete
                    if (obj.ignoreEvents != true) {
                        if (typeof(obj.options.ondeletecolumn) == 'function') {
                            obj.options.ondeletecolumn(el, columnNumber, numOfColumns, historyRecords);
                        }
                    }
                }
            } else {
                console.error('JEXCEL. It is not possible to delete the last column');
            }
        }
    }

    /**
     * Get seleted rows numbers
     * 
     * @return array
     */
    obj.getSelectedRows = function(asIds) {
        var rows = [];
        // Get all selected rows
        for (var j = 0; j < obj.rows.length; j++) {
            if (obj.rows[j].classList.contains('selected')) {
                if (asIds) {
                    rows.push(j);
                } else {
                    rows.push(obj.rows[j]);
                }
            }
        }

        return rows;
    },

    /**
     * Get seleted column numbers
     * 
     * @return array
     */
    obj.getSelectedColumns = function() {
        var cols = [];
        // Get all selected cols
        for (var i = 0; i < obj.headers.length; i++) {
            if (obj.headers[i].classList.contains('selected')) {
                cols.push(i);
            }
        }

        return cols;
    }

    /**
     * Get highlighted
     * 
     * @return array
     */
    obj.getHighlighted = function() {
        return obj.highlighted;
    }

    /**
     * Update cell references
     * 
     * @return void
     */
    obj.updateTableReferences = function() {
        // Update headers
        for (var i = 0; i < obj.headers.length; i++) {
            var x = obj.headers[i].getAttribute('data-x');

            if (x != i) {
                // Update coords
                obj.headers[i].setAttribute('data-x', i);
                // Title
                if (! obj.headers[i].getAttribute('title')) {
                    obj.headers[i].innerHTML = jexcel.getColumnName(i);
                }
            }
        }

        // Update all rows
        for (var j = 0; j < obj.rows.length; j++) {
            if (obj.rows[j]) {
                var y = obj.rows[j].getAttribute('data-y');

                if (y != j) {
                    // Update coords
                    obj.rows[j].setAttribute('data-y', j);
                    obj.rows[j].children[0].setAttribute('data-y', j);
                    // Row number
                    obj.rows[j].children[0].innerHTML = j + 1;
                }
            }
        }

        // Regular cells affected by this change
        var affectedTokens = [];
        var mergeCellUpdates = [];

        // Update cell
        var updatePosition = function(x,y,i,j) {
            if (x != i) {
                obj.records[j][i].setAttribute('data-x', i);
            }
            if (y != j) {
                obj.records[j][i].setAttribute('data-y', j);
            }

            // Other updates
            if (x != i || y != j) {
                var columnIdFrom = jexcel.getColumnNameFromId([x, y]);
                var columnIdTo = jexcel.getColumnNameFromId([i, j]);
                affectedTokens[columnIdFrom] = columnIdTo;
            }
        }

        for (var j = 0; j < obj.records.length; j++) {
            for (var i = 0; i < obj.records[0].length; i++) {
                if (obj.records[j][i]) {
                    // Current values
                    var x = obj.records[j][i].getAttribute('data-x');
                    var y = obj.records[j][i].getAttribute('data-y');

                    // Update column
                    if (obj.records[j][i].getAttribute('data-merged')) {
                        var columnIdFrom = jexcel.getColumnNameFromId([x, y]);
                        var columnIdTo = jexcel.getColumnNameFromId([i, j]);
                        if (mergeCellUpdates[columnIdFrom] == null) {
                            if (columnIdFrom == columnIdTo) {
                                mergeCellUpdates[columnIdFrom] = false;
                            } else {
                                var totalX = parseInt(i - x);
                                var totalY = parseInt(j - y);
                                mergeCellUpdates[columnIdFrom] = [ columnIdTo, totalX, totalY ];
                            }
                        }
                    } else {
                        updatePosition(x,y,i,j);
                    }
                }
            }
        }

        // Update merged if applicable
        var keys = Object.keys(mergeCellUpdates);
        if (keys.length) {
            for (var i = 0; i < keys.length; i++) {
                if (mergeCellUpdates[keys[i]]) {
                    var info = jexcel.getIdFromColumnName(keys[i], true)
                    var x = info[0];
                    var y = info[1];
                    updatePosition(x,y,x + mergeCellUpdates[keys[i]][1],y + mergeCellUpdates[keys[i]][2]);

                    var columnIdFrom = keys[i];
                    var columnIdTo = mergeCellUpdates[keys[i]][0];
                    for (var j = 0; j < obj.options.mergeCells[columnIdFrom][2].length; j++) {
                        var x = parseInt(obj.options.mergeCells[columnIdFrom][2][j].getAttribute('data-x'));
                        var y = parseInt(obj.options.mergeCells[columnIdFrom][2][j].getAttribute('data-y'));
                        obj.options.mergeCells[columnIdFrom][2][j].setAttribute('data-x', x + mergeCellUpdates[keys[i]][1]);
                        obj.options.mergeCells[columnIdFrom][2][j].setAttribute('data-y', y + mergeCellUpdates[keys[i]][2]);
                    }

                    obj.options.mergeCells[columnIdTo] = obj.options.mergeCells[columnIdFrom];
                    delete(obj.options.mergeCells[columnIdFrom]);
                }
            }
        }

        // Update formulas
        obj.updateFormulas(affectedTokens);

        // Update meta data
        obj.updateMeta(affectedTokens);

        // Refresh selection
        obj.refreshSelection();

        // Update table with custom configuration if applicable
        obj.updateTable();
    }

    /**
     * Custom settings for the cells
     */
    obj.updateTable = function() {
        // Check for spare
        if (obj.options.minSpareRows > 0) {
            var numBlankRows = 0;
            for (var j = obj.rows.length - 1; j >= 0; j--) {
                var test = false;
                for (var i = 0; i < obj.headers.length; i++) {
                    if (obj.options.data[j][i]) {
                        test = true;
                    }
                }
                if (test) {
                    break;
                } else {
                    numBlankRows++;
                }
            }

            if (obj.options.minSpareRows - numBlankRows > 0) {
                obj.insertRow(obj.options.minSpareRows - numBlankRows)
            }
        }

        if (obj.options.minSpareCols > 0) {
            var numBlankCols = 0;
            for (var i = obj.headers.length - 1; i >= 0 ; i--) {
                var test = false;
                for (var j = 0; j < obj.rows.length; j++) {
                    if (obj.options.data[j][i]) {
                        test = true;
                    }
                }
                if (test) {
                    break;
                } else {
                    numBlankCols++;
                }
            }

            if (obj.options.minSpareCols - numBlankCols > 0) {
                obj.insertColumn(obj.options.minSpareCols - numBlankCols)
            }
        }

        // Customizations by the developer
        if (typeof(obj.options.updateTable) == 'function') {
            if (obj.options.detachForUpdates) {
                el.removeChild(obj.content);
            }

            for (var j = 0; j < obj.rows.length; j++) {
                for (var i = 0; i < obj.headers.length; i++) {
                    obj.options.updateTable(el, obj.records[j][i], i, j, obj.options.data[j][i], obj.records[j][i].innerText, jexcel.getColumnNameFromId([i, j]));
                }
            }

            if (obj.options.detachForUpdates) {
                el.insertBefore(obj.content, obj.pagination);
            }
        }

        // Update corner position
        setTimeout(function() {
            obj.updateCornerPosition();
        },0);
    }

    /**
     * Show row
     */
    obj.showRow = function(rowNumber) {
        obj.rows[rowNumber].style.display = '';
    }

    /**
     * Hide row
     */
    obj.hideRow = function(rowNumber) {
        obj.rows[rowNumber].style.display = 'none';
    }

    /**
     * Show column
     */
    obj.showColumn = function(colNumber) {
        obj.headers[colNumber].style.display = '';
        obj.colgroup[colNumber].style.display = '';
        for (var j = 0; j < obj.options.data.length; j++) {
            obj.records[j][colNumber].style.display = '';
        }
    }

    /**
     * Hide column
     */
    obj.hideColumn = function(colNumber) {
        obj.headers[colNumber].style.display = 'none';
        obj.colgroup[colNumber].style.display = 'none';
        for (var j = 0; j < obj.options.data.length; j++) {
            obj.records[j][colNumber].style.display = 'none';
        }
    }

    /**
     * Show index column
     */
    obj.showIndex = function() {
        obj.table.classList.remove('jexcel_hidden_index');
    }

    /**
     * Hide index column
     */
    obj.hideIndex = function() {
        obj.table.classList.add('jexcel_hidden_index');
    }

    /**
     * Update all related cells in the chain
     */
    var chainLoopProtection = [];

    obj.updateFormulaChain = function(x, y, records) {
        var cellId = jexcel.getColumnNameFromId([x, y]);
        if (obj.formula[cellId] && obj.formula[cellId].length > 0) {
            if (chainLoopProtection[cellId]) {
                obj.records[y][x].innerHTML = '#ERROR';
                obj.formula[cellId] = '';
            } else {
                // Protection
                chainLoopProtection[cellId] = true;

                for (var i = 0; i < obj.formula[cellId].length; i++) {
                    var cell = jexcel.getIdFromColumnName(obj.formula[cellId][i], true);
                    // Update cell
                    var value = ''+obj.options.data[cell[1]][cell[0]];
                    if (value.substr(0,1) == '=') {
                        records.push(obj.updateCell(cell[0], cell[1], value, true));
                    } else {
                        // No longer a formula, remove from the chain
                        Object.keys(obj.formula)[i] = null;
                    }
                    obj.updateFormulaChain(cell[0], cell[1], records);
                }
            }
        }

        chainLoopProtection = [];
    }

    /**
     * Update formulas
     */
    obj.updateFormulas = function(referencesToUpdate) {
        // Update formulas
        for (var j = 0; j < obj.options.data.length; j++) {
            for (var i = 0; i < obj.options.data[0].length; i++) {
                var value = '' + obj.options.data[j][i];
                // Is formula
                if (value.substr(0,1) == '=') {
                    // Replace tokens
                    var newFormula = obj.updateFormula(value, referencesToUpdate);
                    if (newFormula != value) {
                        obj.options.data[j][i] = newFormula;
                    }
                }
            }
        }

        // Update formula chain
        var formula = [];
        var keys = Object.keys(obj.formula);
        for (var j = 0; j < keys.length; j++) {
            // Current key and values
            var key = keys[j];
            var value = obj.formula[key];
            // Update key
            if (referencesToUpdate[key]) {
                key = referencesToUpdate[key];
            }
            // Update values
            formula[key] = [];
            for (var i = 0; i < value.length; i++) {
                var letter = value[i];
                if (referencesToUpdate[letter]) {
                    letter = referencesToUpdate[letter];
                }
                formula[key].push(letter);
            }
        }
        obj.formula = formula;
    }

    /**
     * Update formula
     */
    obj.updateFormula = function(formula, referencesToUpdate) {
        var testLetter = /[A-Z]/;
        var testNumber = /[0-9]/;

        var newFormula = '';
        var letter = null;
        var number = null;
        var token = '';

        for (var index = 0; index < formula.length; index++) {
            if (testLetter.exec(formula[index])) {
                letter = 1;
                number = 0;
                token += formula[index];
            } else if (testNumber.exec(formula[index])) {
                number = letter ? 1 : 0;
                token += formula[index];
            } else {
                if (letter && number) {
                    token = referencesToUpdate[token] ? referencesToUpdate[token] : token;
                }
                newFormula += token;
                newFormula += formula[index];
                letter = 0;
                number = 0;
                token = '';
            }
        }

        if (token) {
            if (letter && number) {
                token = referencesToUpdate[token] ? referencesToUpdate[token] : token;
            }
            newFormula += token;
        }

        return newFormula;
    }

    /**
     * Parse formulas
     */
    obj.executeFormula = function(expression, x, y) {

        var formulaResults = [];
        var formulaLoopProtection = [];

        // Execute formula with loop protection
        var execute = function(expression, x, y) {
         // Parent column identification
            var parentId = jexcel.getColumnNameFromId([x, y]);

            // Code protection
            if (formulaLoopProtection[parentId]) {
                console.error('Reference loop detected');
                return '#ERROR';
            }

            formulaLoopProtection[parentId] = true;

            // Convert range tokens
            var tokensUpdate = function(tokens) {
                for (var index = 0; index < tokens.length; index++) {
                    var f = [];
                    var token = tokens[index].split(':');
                    var e1 = jexcel.getIdFromColumnName(token[0], true);
                    var e2 = jexcel.getIdFromColumnName(token[1], true);

                    if (e1[0] <= e2[0]) {
                        var x1 = e1[0];
                        var x2 = e2[0];
                    } else {
                        var x1 = e2[0];
                        var x2 = e1[0];
                    }

                    if (e1[1] <= e2[1]) {
                        var y1 = e1[1];
                        var y2 = e2[1];
                    } else {
                        var y1 = e2[1];
                        var y2 = e1[1];
                    }

                    for (var j = y1; j <= y2; j++) {
                        for (var i = x1; i <= x2; i++) {
                            f.push(jexcel.getColumnNameFromId([i, j]));
                        }
                    }

                    expression = expression.replace(tokens[index], f.join(','));
                }
            }

            var tokens = expression.match(/([A-Z]+[0-9]+)\:([A-Z]+[0-9]+)/g);
            if (tokens && tokens.length) {
                tokensUpdate(tokens);
            }

            // String
            var evalstring = '';

            // Get tokens
            var tokens = expression.match(/([A-Z]+[0-9]+)/g);

            // Direct self-reference protection
            if (tokens && tokens.indexOf(parentId) > -1) {
                console.error('Self Reference detected');
                return '#ERROR';
            } else {
                if (tokens) {
                    for (var i = 0; i < tokens.length; i++) {
                        // Keep chain
                        if (! obj.formula[tokens[i]]) {
                            obj.formula[tokens[i]] = [];
                        }
                        // Is already in the register
                        if (obj.formula[tokens[i]].indexOf(parentId) < 0) {
                            obj.formula[tokens[i]].push(parentId);
                        }

                        // Do not calculate again
                        if (eval('typeof(' + tokens[i] + ') == "undefined"')) {
                            // Coords
                            var position = jexcel.getIdFromColumnName(tokens[i], 1);
                            // Get value
                            if (typeof(obj.options.data[position[1]]) != 'undefined' && typeof(obj.options.data[position[1]][position[0]]) != 'undefined') {
                                var value = obj.options.data[position[1]][position[0]];
                            } else {
                                var value = '';
                            }
                            // Get column data
                            if ((''+value).substr(0,1) == '=') {
                                if (formulaResults[tokens[i]]) {
                                    value = formulaResults[tokens[i]];
                                } else {
                                    value = execute(value, position[0], position[1]);
                                    formulaResults[tokens[i]] = value;
                                }
                            }
                            // Type!
                            if ((''+value).trim() == '') {
                                // Null
                                evalstring += "var " + tokens[i] + " = null;";
                            } else {
                                if (value == Number(value) && obj.options.autoCasting == true) {
                                    // Number
                                    evalstring += "var " + tokens[i] + " = " + Number(value) + ";";
                                } else {
                                    // Trying any formatted number
                                    var number = obj.parseNumber(value, position[0])
                                    if (obj.options.autoCasting == true && number) {
                                        // Render as number
                                        evalstring += "var " + tokens[i] + " = " + number + ";";
                                    } else {
                                        // Render as string
                                        evalstring += "var " + tokens[i] + " = '" + value + "';";
                                    }
                                }
                            }
                        }
                    }
                }

                // Convert formula to javascript
                try {
                    evalstring += "function COLUMN() { return parseInt(x) + 1; }; function ROW() { return parseInt(y) + 1; }; function CELL() { return parentId; };";

                    var res = eval(evalstring + expression.substr(1));
                } catch (e) {
                    var res = '#ERROR';
                }

                return res;
            }
        }

        return execute(expression, x, y);
    }

    /**
     * Trying to extract a number from a string
     */
    obj.parseNumber = function(value, columnNumber) {
        // Decimal point
        var decimal = columnNumber && obj.options.columns[columnNumber].decimal ? obj.options.columns[columnNumber].decimal : '.';

        // Parse both parts of the number
        var number = ('' + value);
        number = number.split(decimal);
        number[0] = number[0].match(/[+-]?[0-9]/g);
        if (number[0]) {
            number[0] = number[0].join('');
        }
        if (number[1]) {
            number[1] = number[1].match(/[0-9]*/g).join('');
        }

        // Is a valid number
        if (number[0] && Number(number[0]) >= 0) {
            if (! number[1]) {
                var value = Number(number[0] + '.00');
            } else {
                var value = Number(number[0] + '.' + number[1]);
            }
        } else {
            var value = null;
        }

        return value;
    }

    /**
     * Get row number
     */
    obj.row = function(cell) {
    }

    /**
     * Get col number
     */
    obj.col = function(cell) {
    }

    obj.up = function(shiftKey, ctrlKey) {
        if (shiftKey) {
            if (obj.selectedCell[3] > 0) {
                obj.up.visible(1, ctrlKey ? 0 : 1)
            }
        } else {
            if (obj.selectedCell[1] > 0) {
                obj.up.visible(0, ctrlKey ? 0 : 1)
            }
            obj.selectedCell[2] = obj.selectedCell[0];
            obj.selectedCell[3] = obj.selectedCell[1];
        }

        // Update selection
        obj.updateSelectionFromCoords(obj.selectedCell[0], obj.selectedCell[1], obj.selectedCell[2], obj.selectedCell[3]);

        // Change page
        if (obj.options.lazyLoading == true) {
            if (obj.selectedCell[1] == 0 || obj.selectedCell[3] == 0) {
                obj.loadPage(0);
                obj.updateSelectionFromCoords(obj.selectedCell[0], obj.selectedCell[1], obj.selectedCell[2], obj.selectedCell[3]);
            } else {
                if (obj.loadValidation()) {
                    obj.updateSelectionFromCoords(obj.selectedCell[0], obj.selectedCell[1], obj.selectedCell[2], obj.selectedCell[3]);
                } else {
                    var item = parseInt(obj.tbody.firstChild.getAttribute('data-y'));
                    if (obj.selectedCell[1] - item < 30) {
                        obj.loadUp();
                        obj.updateSelectionFromCoords(obj.selectedCell[0], obj.selectedCell[1], obj.selectedCell[2], obj.selectedCell[3]);
                    }
                }
            }
        } else if (obj.options.pagination > 0) {
            var pageNumber = obj.whichPage(obj.selectedCell[3]);
            if (pageNumber != obj.pageNumber) {
                obj.page(pageNumber);
            }
        }

        obj.updateScroll(1);
    }

    obj.up.visible = function(group, direction) {
        if (group == 0) {
            var x = parseInt(obj.selectedCell[0]);
            var y = parseInt(obj.selectedCell[1]);
        } else {
            var x = parseInt(obj.selectedCell[2]);
            var y = parseInt(obj.selectedCell[3]);
        }

        if (direction == 0) {
            for (var j = 0; j < y; j++) {
                if (obj.records[j][x].style.display != 'none' && obj.rows[j].style.display != 'none') {
                    y = j;
                    break;
                }
            }
        } else {
            y = obj.up.get(x, y);
        }

        if (group == 0) {
            obj.selectedCell[0] = x;
            obj.selectedCell[1] = y;
        } else {
            obj.selectedCell[2] = x;
            obj.selectedCell[3] = y;
        }
    }

    obj.up.get = function(x, y) {
        var x = parseInt(x);
        var y = parseInt(y);
        for (var j = (y - 1); j >= 0; j--) {
            if (obj.records[j][x].style.display != 'none' && obj.rows[j].style.display != 'none') {
                if (obj.records[j][x].getAttribute('data-merged')) {
                    if (obj.records[j][x] == obj.records[y][x]) {
                        continue;
                    }
                }
                y = j;
                break;
            }
        }

        return y;
    }

    obj.down = function(shiftKey, ctrlKey) {
        if (shiftKey) {
            if (obj.selectedCell[3] < obj.records.length - 1) {
                obj.down.visible(1, ctrlKey ? 0 : 1)
            }
        } else {
            if (obj.selectedCell[1] < obj.records.length - 1) {
                obj.down.visible(0, ctrlKey ? 0 : 1)
            }
            obj.selectedCell[2] = obj.selectedCell[0];
            obj.selectedCell[3] = obj.selectedCell[1];
        }

        obj.updateSelectionFromCoords(obj.selectedCell[0], obj.selectedCell[1], obj.selectedCell[2], obj.selectedCell[3]);

        // Change page
        if (obj.options.lazyLoading == true) {
            if ((obj.selectedCell[1] == obj.records.length - 1 || obj.selectedCell[3] == obj.records.length - 1)) {
                obj.loadPage(-1);
                obj.updateSelectionFromCoords(obj.selectedCell[0], obj.selectedCell[1], obj.selectedCell[2], obj.selectedCell[3]);
            } else {
                if (obj.loadValidation()) {
                    obj.updateSelectionFromCoords(obj.selectedCell[0], obj.selectedCell[1], obj.selectedCell[2], obj.selectedCell[3]);
                } else {
                    var item = parseInt(obj.tbody.lastChild.getAttribute('data-y'));
                    if (item - obj.selectedCell[3] < 30) {
                        obj.loadDown();
                        obj.updateSelectionFromCoords(obj.selectedCell[0], obj.selectedCell[1], obj.selectedCell[2], obj.selectedCell[3]);
                    }
                }
            }
        } else if (obj.options.pagination > 0) {
            var pageNumber = obj.whichPage(obj.selectedCell[3]);
            if (pageNumber != obj.pageNumber) {
                obj.page(pageNumber);
            }
        }

        obj.updateScroll(3);
    }

    obj.down.visible = function(group, direction) {
        if (group == 0) {
            var x = parseInt(obj.selectedCell[0]);
            var y = parseInt(obj.selectedCell[1]);
        } else {
            var x = parseInt(obj.selectedCell[2]);
            var y = parseInt(obj.selectedCell[3]);
        }

        if (direction == 0) {
            for (var j = obj.rows.length - 1; j > y; j--) {
                if (obj.records[j][x].style.display != 'none' && obj.rows[j].style.display != 'none') {
                    y = j;
                    break;
                }
            }
        } else {
            y = obj.down.get(x, y);
        }

        if (group == 0) {
            obj.selectedCell[0] = x;
            obj.selectedCell[1] = y;
        } else {
            obj.selectedCell[2] = x;
            obj.selectedCell[3] = y;
        }
    }

    obj.down.get = function(x, y) {
        var x = parseInt(x);
        var y = parseInt(y);
        for (var j = (y + 1); j < obj.rows.length; j++) {
            if (obj.records[j][x].style.display != 'none' && obj.rows[j].style.display != 'none') {
                if (obj.records[j][x].getAttribute('data-merged')) {
                    if (obj.records[j][x] == obj.records[y][x]) {
                        continue;
                    }
                }
                y = j;
                break;
            }
        }

        return y;
    }

    obj.right = function(shiftKey, ctrlKey) {
        if (shiftKey) {
            if (obj.selectedCell[2] < obj.headers.length - 1) {
                obj.right.visible(1, ctrlKey ? 0 : 1)
            }
        } else {
            if (obj.selectedCell[0] < obj.headers.length - 1) {
                obj.right.visible(0, ctrlKey ? 0 : 1)
            }
            obj.selectedCell[2] = obj.selectedCell[0];
            obj.selectedCell[3] = obj.selectedCell[1];
        }

        obj.updateSelectionFromCoords(obj.selectedCell[0], obj.selectedCell[1], obj.selectedCell[2], obj.selectedCell[3]);
        obj.updateScroll(2);
    }

    obj.right.visible = function(group, direction) {
        if (group == 0) {
            var x = parseInt(obj.selectedCell[0]);
            var y = parseInt(obj.selectedCell[1]);
        } else {
            var x = parseInt(obj.selectedCell[2]);
            var y = parseInt(obj.selectedCell[3]);
        }

        if (direction == 0) {
            for (var i = obj.headers.length - 1; i > x; i--) {
                if (obj.records[y][i].style.display != 'none') {
                    x = i;
                    break;
                }
            }
        } else {
            x = obj.right.get(x, y);
        }

        if (group == 0) {
            obj.selectedCell[0] = x;
            obj.selectedCell[1] = y;
        } else {
            obj.selectedCell[2] = x;
            obj.selectedCell[3] = y;
        }
    }

    obj.right.get = function(x, y) {
        var x = parseInt(x);
        var y = parseInt(y);

        for (var i = (x + 1); i < obj.headers.length; i++) {
            if (obj.records[y][i].style.display != 'none') {
                if (obj.records[y][i].getAttribute('data-merged')) {
                    if (obj.records[y][i] == obj.records[y][x]) {
                        continue;
                    }
                }
                x = i;
                break;
            }
        }

        return x;
    }

    obj.left = function(shiftKey, ctrlKey) {
        if (shiftKey) {
            if (obj.selectedCell[2] > 0) {
                obj.left.visible(1, ctrlKey ? 0 : 1)
            }
        } else {
            if (obj.selectedCell[0] > 0) {
                obj.left.visible(0, ctrlKey ? 0 : 1)
            }
            obj.selectedCell[2] = obj.selectedCell[0];
            obj.selectedCell[3] = obj.selectedCell[1];
        }

        obj.updateSelectionFromCoords(obj.selectedCell[0], obj.selectedCell[1], obj.selectedCell[2], obj.selectedCell[3]);
        obj.updateScroll(0);
    }

    obj.left.visible = function(group, direction) {
        if (group == 0) {
            var x = parseInt(obj.selectedCell[0]);
            var y = parseInt(obj.selectedCell[1]);
        } else {
            var x = parseInt(obj.selectedCell[2]);
            var y = parseInt(obj.selectedCell[3]);
        }

        if (direction == 0) {
            for (var i = 0; i < x; i++) {
                if (obj.records[y][i].style.display != 'none') {
                    x = i;
                    break;
                }
            }
        } else {
            x = obj.left.get(x, y);
        }

        if (group == 0) {
            obj.selectedCell[0] = x;
            obj.selectedCell[1] = y;
        } else {
            obj.selectedCell[2] = x;
            obj.selectedCell[3] = y;
        }
    }

    obj.left.get = function(x, y) {
        var x = parseInt(x);
        var y = parseInt(y);
        for (var i = (x - 1); i >= 0; i--) {
            if (obj.records[y][i].style.display != 'none') {
                if (obj.records[y][i].getAttribute('data-merged')) {
                    if (obj.records[y][i] == obj.records[y][x]) {
                        continue;
                    }
                }
                x = i;
                break;
            }
        }

        return x;
    }

    obj.first = function(shiftKey, ctrlKey) {
        if (shiftKey) {
            if (ctrlKey) {
                obj.selectedCell[3] = 0;
            } else {
                obj.left.visible(1, 0);
            }
        } else {
            if (ctrlKey) {
                obj.selectedCell[1] = 0;
            } else {
                obj.left.visible(0, 0);
            }
            obj.selectedCell[2] = obj.selectedCell[0];
            obj.selectedCell[3] = obj.selectedCell[1];
        }

        // Change page
        if (obj.options.lazyLoading == true && (obj.selectedCell[1] == 0 || obj.selectedCell[3] == 0)) {
            obj.loadPage(0);
        } else if (obj.options.pagination > 0) {
            var pageNumber = obj.whichPage(obj.selectedCell[3]);
            if (pageNumber != obj.pageNumber) {
                obj.page(pageNumber);
            }
        }

        obj.updateSelectionFromCoords(obj.selectedCell[0], obj.selectedCell[1], obj.selectedCell[2], obj.selectedCell[3]);
        obj.updateScroll(1);
    }

    obj.last = function(shiftKey, ctrlKey) {
        if (shiftKey) {
            if (ctrlKey) {
                obj.selectedCell[3] = obj.records.length - 1;
            } else {
                obj.right.visible(1, 0);
            }
        } else {
            if (ctrlKey) {
                obj.selectedCell[1] = obj.records.length - 1;
            } else {
                obj.right.visible(0, 0);
            }
            obj.selectedCell[2] = obj.selectedCell[0];
            obj.selectedCell[3] = obj.selectedCell[1];
        }

        // Change page
        if (obj.options.lazyLoading == true && (obj.selectedCell[1] == obj.records.length - 1 || obj.selectedCell[3] == obj.records.length - 1)) {
            obj.loadPage(-1);
        } else if (obj.options.pagination > 0) {
            var pageNumber = obj.whichPage(obj.selectedCell[3]);
            if (pageNumber != obj.pageNumber) {
                obj.page(pageNumber);
            }
        }

        obj.updateSelectionFromCoords(obj.selectedCell[0], obj.selectedCell[1], obj.selectedCell[2], obj.selectedCell[3]);
        obj.updateScroll(3);
    }

    obj.selectAll = function() {
        if (! obj.selectedCell) {
            obj.selectedCell = [];
        }

        obj.selectedCell[0] = 0;
        obj.selectedCell[1] = 0;
        obj.selectedCell[2] = obj.headers.length - 1;
        obj.selectedCell[3] = obj.records.length - 1;

        obj.updateSelectionFromCoords(obj.selectedCell[0], obj.selectedCell[1], obj.selectedCell[2], obj.selectedCell[3]);
    }

    /**
     * Go to a page in a lazyLoading
     */
    obj.loadPage = function(pageNumber) {
        // Search
        if (obj.options.search == true && obj.results) {
            var results = obj.results;
        } else {
            var results = obj.rows;
        }

        // Per page
        var quantityPerPage = 100;

        // pageNumber
        if (pageNumber == null || pageNumber == -1) {
            // Last page
            pageNumber = Math.ceil(results.length / quantityPerPage); 
        }

        var startRow = (pageNumber * quantityPerPage);
        var finalRow = (pageNumber * quantityPerPage) + quantityPerPage;
        if (finalRow > results.length) {
            finalRow = results.length;
        }
        startRow = finalRow - 100;
        if (startRow < 0) {
            startRow = 0;
        }

        // Appeding items
        for (var j = startRow; j < finalRow; j++) {
            if (obj.options.search == true && obj.results) {
                obj.tbody.appendChild(obj.rows[results[j]]);
            } else {
                obj.tbody.appendChild(obj.rows[j]);
            }

            if (obj.tbody.children.length > quantityPerPage) {
                obj.tbody.removeChild(obj.tbody.firstChild);
            }
        }
    }

    obj.loadUp = function() {
        // Search
        if (obj.options.search == true && obj.results) {
            var results = obj.results;
        } else {
            var results = obj.rows;
        }
        var test = 0;
        if (results.length > 100) {
            // Get the first element in the page
            var item = parseInt(obj.tbody.firstChild.getAttribute('data-y'));
            if (obj.options.search == true && obj.results) {
                item = results.indexOf(item);
            }
            if (item > 0) {
                for (var j = 0; j < 30; j++) {
                    item = item - 1;
                    if (item > -1) {
                        if (obj.options.search == true && obj.results) {
                            obj.tbody.insertBefore(obj.rows[results[item]], obj.tbody.firstChild);
                        } else {
                            obj.tbody.insertBefore(obj.rows[item], obj.tbody.firstChild);
                        }
                        if (obj.tbody.children.length > 100) {
                            obj.tbody.removeChild(obj.tbody.lastChild);
                            test = 1;
                        }
                    }
                }
            }
        }
        return test;
    }

    obj.loadDown = function() {
        // Search
        if (obj.options.search == true && obj.results) {
            var results = obj.results;
        } else {
            var results = obj.rows;
        }
        var test = 0;
        if (results.length > 100) {
            // Get the last element in the page
            var item = parseInt(obj.tbody.lastChild.getAttribute('data-y'));
            if (obj.options.search == true && obj.results) {
                item = results.indexOf(item);
            }
            if (item < obj.rows.length - 1) {
                for (var j = 0; j <= 30; j++) {
                    if (item < results.length) {
                        if (obj.options.search == true && obj.results) {
                            obj.tbody.appendChild(obj.rows[results[item]]);
                        } else {
                            obj.tbody.appendChild(obj.rows[item]);
                        }
                        if (obj.tbody.children.length > 100) {
                            obj.tbody.removeChild(obj.tbody.firstChild);
                            test = 1;
                        }
                    }
                    item = item + 1;
                }
            }
        }

        return test;
    }

    obj.loadValidation = function() {
        if (obj.selectedCell) {
            var currentPage = parseInt(obj.tbody.firstChild.getAttribute('data-y')) / 100;
            var selectedPage = parseInt(obj.selectedCell[3] / 100);
            var totalPages = parseInt(obj.rows.length / 100);

            if (currentPage != selectedPage && selectedPage <= totalPages) {
                if (! Array.prototype.indexOf.call(obj.tbody.children, obj.rows[obj.selectedCell[3]])) {
                    obj.loadPage(selectedPage);
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * Reset search
     */
    obj.resetSearch = function() {
        obj.searchInput.value = '';
        obj.search('');
        obj.results = null;
    }

    /**
     * Search
     */
    obj.search = function(query) {
        // Query
        if (query) {
            var query = query.toLowerCase();
        }

        // Reset selection
        obj.resetSelection();

        // Total of results
        obj.pageNumber = 0;
        obj.results = [];

        if (query) {
            // Search filter
            var search = function(item, query, index) {
                for (var i = 0; i < item.length; i++) {
                    if ((''+item[i]).toLowerCase().search(query) >= 0 ||
                        (''+obj.records[index][i].innerHTML).toLowerCase().search(query) >= 0) {
                        return true;
                    }
                }
                return false;
            }

            // Result
            var addToResult = function(k) {
                if (obj.results.indexOf(k) == -1) {
                    obj.results.push(k);
                }
            }

            // Filter
            var data = obj.options.data.filter(function(v, k) {
                if (search(v, query, k)) {
                    // Merged rows found
                    var rows = obj.isRowMerged(k);
                    if (rows.length) {
                        for (var i = 0; i < rows.length; i++) {
                            var row = jexcel.getIdFromColumnName(rows[i], true);
                            for (var j = 0; j < obj.options.mergeCells[rows[i]][1]; j++) {
                                addToResult(row[1]+j);
                            }
                        }
                    } else {
                        // Normal row found
                        addToResult(k);
                    }
                    return true;
                } else {
                    return false;
                }
            });
        } else {
            obj.results = null;
        }

        var total = 0;
        var index = 0;

        // Page 1
        if (obj.options.lazyLoading == true) {
            total = 100;
        } else if (obj.options.pagination > 0) {
            total = obj.options.pagination;
        } else {
            if (obj.results) {
                total = obj.results.length;
            } else {
                total = obj.rows.length;
            }
        }

        // Reset current nodes
        while (obj.tbody.firstChild) {
            obj.tbody.removeChild(obj.tbody.firstChild);
        }

        // Hide all records from the table
        for (var j = 0; j < obj.rows.length; j++) {
            if (! obj.results || obj.results.indexOf(j) > -1) {
                if (index < total) {
                    obj.tbody.appendChild(obj.rows[j]);
                    index++;
                }
                obj.rows[j].style.display = '';
            } else {
                obj.rows[j].style.display = 'none';
            }
        }

        // Update pagination
        if (obj.options.pagination > 0) {
            obj.updatePagination();
        }

        return total;
    }

    /**
     * Which page the cell is
     */
    obj.whichPage = function(cell) {
        // Search
        if (obj.options.search == true && obj.results) {
            cell = obj.results.indexOf(cell);
        }

        return (Math.ceil((parseInt(cell) + 1) / parseInt(obj.options.pagination))) - 1;
    }

    /**
     * Go to page
     */
    obj.page = function(pageNumber) {
        var oldPage = obj.pageNumber;

        // Search
        if (obj.options.search == true && obj.results) {
            var results = obj.results;
        } else {
            var results = obj.rows;
        }

        // Per page
        var quantityPerPage = parseInt(obj.options.pagination);

        // pageNumber
        if (pageNumber == null || pageNumber == -1) {
            // Last page
            pageNumber = Math.ceil(results.length / quantityPerPage); 
        }

        // Page number
        obj.pageNumber = pageNumber;

        var startRow = (pageNumber * quantityPerPage);
        var finalRow = (pageNumber * quantityPerPage) + quantityPerPage;
        if (finalRow > results.length) {
            finalRow = results.length;
        }
        if (startRow < 0) {
            startRow = 0;
        }

        // Reset container
        while (obj.tbody.firstChild) {
            obj.tbody.removeChild(obj.tbody.firstChild);
        }

        // Appeding items
        for (var j = startRow; j < finalRow; j++) {
            if (obj.options.search == true && obj.results) {
                obj.tbody.appendChild(obj.rows[results[j]]);
            } else {
                obj.tbody.appendChild(obj.rows[j]);
            }
        }

        if (obj.options.pagination > 0) {
            obj.updatePagination();
        }

        // Update corner position
        obj.updateCornerPosition();

        if (typeof(obj.options.onchangepage) == 'function') {
            obj.options.onchangepage(el, pageNumber, oldPage);
        }
    }

    /**
     * Update the pagination
     */
    obj.updatePagination = function() {
        // Reset container
        obj.pagination.children[0].innerHTML = '';
        obj.pagination.children[1].innerHTML = '';

        // Start pagination
        if (obj.options.pagination) {
            // Searchable
            if (obj.options.search == true && obj.results) {
                var results = obj.results.length;
            } else {
                var results = obj.rows.length;
            }

            if (! results) {
                // No records found
                obj.pagination.children[0].innerHTML = obj.options.text.noRecordsFound;
            } else {
                // Pagination container
                var quantyOfPages = Math.ceil(results / obj.options.pagination);

                if (obj.pageNumber < 6) {
                    var startNumber = 1;
                    var finalNumber = quantyOfPages < 10 ? quantyOfPages : 10;
                } else if (quantyOfPages - obj.pageNumber < 5) {
                    var startNumber = quantyOfPages - 9;
                    var finalNumber = quantyOfPages;
                    if (startNumber < 1) {
                        startNumber = 1;
                    }
                } else {
                    var startNumber = obj.pageNumber - 4;
                    var finalNumber = obj.pageNumber + 5;
                }

                // First
                if (startNumber > 1) {
                    var paginationItem = document.createElement('div');
                    paginationItem.className = 'jexcel_page';
                    paginationItem.innerHTML = '<';
                    paginationItem.title = 1;
                    obj.pagination.children[1].appendChild(paginationItem);
                }

                // Get page links
                for (var i = startNumber; i <= finalNumber; i++) {
                    var paginationItem = document.createElement('div');
                    paginationItem.className = 'jexcel_page';
                    paginationItem.innerHTML = i;
                    obj.pagination.children[1].appendChild(paginationItem);

                    if (obj.pageNumber == (i-1)) {
                        paginationItem.classList.add('jexcel_page_selected');
                    }
                }

                // Last
                if (finalNumber < quantyOfPages) {
                    var paginationItem = document.createElement('div');
                    paginationItem.className = 'jexcel_page';
                    paginationItem.innerHTML = '>';
                    paginationItem.title = quantyOfPages;
                    obj.pagination.children[1].appendChild(paginationItem);
                }

                // Text
                var format = function(format) {
                    var args = Array.prototype.slice.call(arguments, 1);
                    return format.replace(/{(\d+)}/g, function(match, number) {
                      return typeof args[number] != 'undefined'
                        ? args[number]
                        : match
                      ;
                    });
                };

                obj.pagination.children[0].innerHTML = format(obj.options.text.showingPage, obj.pageNumber + 1, quantyOfPages)
            }
        }
    }

    /**
     * Download CSV table
     * 
     * @return null
     */
    obj.download = function(includeHeaders) {
        if (obj.options.allowExport == false) {
            console.error('Export not allowed');
        } else {
            // Data
            var data = '';
            if (includeHeaders == true || obj.options.includeHeadersOnDownload == true) {
                data += obj.getHeaders();
                data += "\r\n";
            }

            // Get data
            data += obj.copy(false, obj.options.csvDelimiter, true);

            // Download element
            var blob = new Blob(["\uFEFF"+data], {type: 'text/csv;charset=utf-8;'});

            // IE Compatibility
            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                window.navigator.msSaveOrOpenBlob(blob, options.csvFileName + '.csv');
            } else {
                // Download element
                var pom = document.createElement('a');
                var url = URL.createObjectURL(blob);
                pom.href = url;
                pom.setAttribute('download', obj.options.csvFileName + '.csv');
                document.body.appendChild(pom);
                pom.click();
                pom.parentNode.removeChild(pom);
            }
        }
    }

    /**
     * Initializes a new history record for undo/redo
     * 
     * @return null
     */
    obj.setHistory = function(changes) {
        if (obj.ignoreHistory != true) {
            // Increment and get the current history index
            var index = ++obj.historyIndex;

            // Slice the array to discard undone changes
            obj.history = (obj.history = obj.history.slice(0, index + 1));

            // Keep history
            obj.history[index] = changes;
        }
    }

    /**
     * Copy method
     * 
     * @param bool highlighted - Get only highlighted cells
     * @param delimiter - \t default to keep compatibility with excel
     * @return string value
     */
    obj.copy = function(highlighted, delimiter, returnData) {
        if (! delimiter) {
            delimiter = "\t";
        }

        // Controls
        var col = [];
        var colLabel = [];
        var row = [];
        var rowLabel = [];
        var x = obj.options.data[0].length
        var y = obj.options.data.length
        var tmp = '';

        // Reset container
        obj.style = [];

        // Go through the columns to get the data
        for (var j = 0; j < y; j++) {
            col = [];
            colLabel = [];

            for (var i = 0; i < x; i++) {
                // If cell is highlighted
                if (! highlighted || obj.records[j][i].classList.contains('highlight')) {
                    // Values
                    var value = obj.options.data[j][i];
                    if (value.match && (value.match(/,/g) || value.match(/\n/) || value.match(/\"/))) {
                        value = value.replace(new RegExp('"', 'g'), '""');
                        value = '"' + value + '"';
                    }
                    col.push(value);

                    // Labels
                    if (obj.options.columns[i].type == 'checkbox' || obj.options.columns[i].type == 'radio') {
                        var label = value;
                    } else {
                        var label = obj.records[j][i].innerHTML;
                        if (label.match && (label.match(/,/g) || label.match(/\n/) || label.match(/\"/))) {
                            // Scape double quotes
                            label = label.replace(new RegExp('"', 'g'), '""');
                            label = '"' + label + '"';
                        }
                    }
                    colLabel.push(label);

                    // Get style
                    tmp = obj.records[j][i].getAttribute('style');
                    obj.style.push(tmp ? tmp : '');
                }
            }

            if (col.length) {
                row.push(col.join(delimiter));
            }
            if (colLabel.length) {
                rowLabel.push(colLabel.join(delimiter));
            }
        }

        // Final string
        var str = row.join("\r\n");
        var strLabel = rowLabel.join("\r\n");

        // Create a hidden textarea to copy the values
        if (! returnData) {
            if (obj.options.copyCompatibility == true) {
                obj.textarea.value = strLabel;
            } else {
                obj.textarea.value = str;
            }
            obj.textarea.select();
            document.execCommand("copy");
        }

        // Keep data
        if (obj.options.copyCompatibility == true) {
            obj.data = strLabel;
        } else {
        obj.data = str;
        }
        // Keep non visible information
        obj.hashString = obj.hash(obj.data);

        return obj.data;
    }

    /**
     * jExcel paste method
     * 
     * @param integer row number
     * @return string value
     */
    obj.paste = function(x, y, data) {
        // Paste filter
        if (typeof(obj.options.onbeforepaste) == 'function') {
            var data = obj.options.onbeforepaste(el, data);
        }

        // Controls
        var hash = obj.hash(data);
        var style = (hash == obj.hashString) ? obj.style : null;

        // Depending on the behavior
        if (obj.options.copyCompatibility == true && hash == obj.hashString) {
            var data = obj.data;
        }

        // Split new line
        var data = obj.parseCSV(data, "\t");

        if (x != null && y != null && data) {
            // Records
            var i = 0;
            var j = 0;
            var records = [];
            var newStyle = {};
            var oldStyle = {};
            var styleIndex = 0;

            // Index
            var colIndex = parseInt(x);
            var rowIndex = parseInt(y);
            var row = null;

            // Go through the columns to get the data
            while (row = data[j]) {
                i = 0;
                colIndex = parseInt(x);

                while (row[i] != null) {
                    // Update and keep history
                    var record = obj.updateCell(colIndex, rowIndex, row[i]);
                    // Keep history
                    records.push(record);
                    // Update all formulas in the chain
                    obj.updateFormulaChain(colIndex, rowIndex, records);
                    // Style
                    if (style && style[styleIndex]) {
                        var columnName = jexcel.getColumnNameFromId([colIndex, rowIndex]);
                        newStyle[columnName] = style[styleIndex];
                        oldStyle[columnName] = obj.getStyle(columnName);
                        obj.records[rowIndex][colIndex].setAttribute('style', style[styleIndex]);
                        styleIndex++
                    }
                    i++;
                    if (row[i] != null) {
                        if (colIndex >= obj.headers.length - 1) {
                            obj.insertColumn();
                        }
                        colIndex = obj.right.get(colIndex, rowIndex);
                    }
                }

                j++;
                if (data[j]) {
                    if (rowIndex >= obj.rows.length-1) {
                        obj.insertRow();
                    }
                    rowIndex = obj.down.get(x, rowIndex);
                }
            }

            // Select the new cells
            obj.updateSelectionFromCoords(x, y, colIndex, rowIndex);

            // Update history
            obj.setHistory({
                action:'setValue',
                records:records,
                selection:obj.selectedCell,
                newStyle:newStyle,
                oldStyle:oldStyle,
            });

            // Update table
            obj.updateTable();

            // Paste event
            if (typeof(obj.options.onpaste) == 'function') {
                obj.options.onpaste(el, records);
            }

            // On after changes
            obj.onafterchanges(el, records);
        }
    }

    /**
     * Process row
     */
    obj.historyProcessRow = function(type, historyRecord) {
        var rowIndex = (! historyRecord.insertBefore) ? historyRecord.rowNumber + 1 : historyRecord.rowNumber;

        if (obj.options.search == true) {
            if (obj.results && obj.results.length != obj.rows.length) {
                obj.resetSearch();
            }
        }

        // Remove row
        if (type == 1) {
            var numOfRows = historyRecord.numOfRows;
            // Remove nodes
            for (var j = rowIndex; j < (numOfRows + rowIndex); j++) {
                obj.rows[j].parentNode.removeChild(obj.rows[j]);
            }
            // Remove references
            obj.records.splice(rowIndex, numOfRows);
            obj.options.data.splice(rowIndex, numOfRows);
            obj.rows.splice(rowIndex, numOfRows);

            obj.conditionalSelectionUpdate(1, rowIndex, (numOfRows + rowIndex) - 1);
        } else {
            // Insert data
            obj.records = jexcel.injectArray(obj.records, rowIndex, historyRecord.rowRecords);
            obj.options.data = jexcel.injectArray(obj.options.data, rowIndex, historyRecord.rowData);
            obj.rows = jexcel.injectArray(obj.rows, rowIndex, historyRecord.rowNode);
            // Insert nodes
            var index = 0
            for (var j = rowIndex; j < (historyRecord.numOfRows + rowIndex); j++) {
                obj.tbody.insertBefore(historyRecord.rowNode[index], obj.tbody.children[j]);
                index++;
            }
        }

        // Respect pagination
        if (obj.options.pagination > 0) {
            obj.page(obj.pageNumber);
        }

        obj.updateTableReferences();
    }

    /**
     * Process column
     */
    obj.historyProcessColumn = function(type, historyRecord) {
        var columnIndex = (! historyRecord.insertBefore) ? historyRecord.columnNumber + 1 : historyRecord.columnNumber;

        // Remove column
        if (type == 1) {
            var numOfColumns = historyRecord.numOfColumns;

            obj.options.columns.splice(columnIndex, numOfColumns);
            for (var i = columnIndex; i < (numOfColumns + columnIndex); i++) {
                obj.headers[i].parentNode.removeChild(obj.headers[i]);
                obj.colgroup[i].parentNode.removeChild(obj.colgroup[i]);
            }
            obj.headers.splice(columnIndex, numOfColumns);
            obj.colgroup.splice(columnIndex, numOfColumns);
            for (var j = 0; j < historyRecord.data.length; j++) {
                for (var i = columnIndex; i < (numOfColumns + columnIndex); i++) {
                    obj.records[j][i].parentNode.removeChild(obj.records[j][i]);
                }
                obj.records[j].splice(columnIndex, numOfColumns);
                obj.options.data[j].splice(columnIndex, numOfColumns);
            }

            obj.conditionalSelectionUpdate(0, columnIndex, (numOfColumns + columnIndex) - 1);
        } else {
            // Insert data
            obj.options.columns = jexcel.injectArray(obj.options.columns, columnIndex, historyRecord.columns);
            obj.headers = jexcel.injectArray(obj.headers, columnIndex, historyRecord.headers);
            obj.colgroup = jexcel.injectArray(obj.colgroup, columnIndex, historyRecord.colgroup);

            var index = 0
            for (var i = columnIndex; i < (historyRecord.numOfColumns + columnIndex); i++) {
                obj.headerContainer.insertBefore(historyRecord.headers[index], obj.headerContainer.children[i+1]);
                obj.colgroupContainer.insertBefore(historyRecord.colgroup[index], obj.colgroupContainer.children[i+1]);
                index++;
            }

            for (var j = 0; j < historyRecord.data.length; j++) {
                obj.options.data[j] = jexcel.injectArray(obj.options.data[j], columnIndex, historyRecord.data[j]);
                obj.records[j] = jexcel.injectArray(obj.records[j], columnIndex, historyRecord.records[j]);
                var index = 0
                for (var i = columnIndex; i < (historyRecord.numOfColumns + columnIndex); i++) {
                    obj.rows[j].insertBefore(historyRecord.records[j][index], obj.rows[j].children[i+1]);
                    index++;
                }
            }
        }

        // Adjust nested headers
        if (obj.options.nestedHeaders && obj.options.nestedHeaders.length > 0) {
            // Flexible way to handle nestedheaders
            if (obj.options.nestedHeaders[0] && obj.options.nestedHeaders[0][0]) {
                for (var j = 0; j < obj.options.nestedHeaders.length; j++) {
                    if (type == 1) {
                        var colspan = parseInt(obj.options.nestedHeaders[j][obj.options.nestedHeaders[j].length-1].colspan) - historyRecord.numOfColumns;
                    } else {
                        var colspan = parseInt(obj.options.nestedHeaders[j][obj.options.nestedHeaders[j].length-1].colspan) + historyRecord.numOfColumns;
                    }
                    obj.options.nestedHeaders[j][obj.options.nestedHeaders[j].length-1].colspan = colspan;
                    obj.thead.children[j].children[obj.thead.children[j].children.length-1].setAttribute('colspan', colspan);
                }
            } else {
                if (type == 1) {
                    var colspan = parseInt(obj.options.nestedHeaders[0].colspan) - historyRecord.numOfColumns;
                } else {
                    var colspan = parseInt(obj.options.nestedHeaders[0].colspan) + historyRecord.numOfColumns;
                }
                obj.options.nestedHeaders[0].colspan = colspan;
                obj.thead.children[0].children[obj.thead.children[0].children.length-1].setAttribute('colspan', colspan);
            }
        }

        obj.updateTableReferences();
    }

    /**
     * Undo last action
     */
    obj.undo = function() {
        // Ignore events and history
        var ignoreEvents = obj.ignoreEvents ? true : false;
        var ignoreHistory = obj.ignoreHistory ? true : false;

        obj.ignoreEvents = true;
        obj.ignoreHistory = true;

        // Records
        var records = [];

        // Update cells
        if (obj.historyIndex >= 0) {
            // History
            var historyRecord = obj.history[obj.historyIndex--];

            if (historyRecord.action == 'insertRow') {
                obj.historyProcessRow(1, historyRecord);
            } else if (historyRecord.action == 'deleteRow') {
                obj.historyProcessRow(0, historyRecord);
            } else if (historyRecord.action == 'insertColumn') {
                obj.historyProcessColumn(1, historyRecord);
            } else if (historyRecord.action == 'deleteColumn') {
                obj.historyProcessColumn(0, historyRecord);
            } else if (historyRecord.action == 'moveRow') {
                obj.moveRow(historyRecord.newValue, historyRecord.oldValue);
            } else if (historyRecord.action == 'moveColumn') {
                obj.moveColumn(historyRecord.newValue, historyRecord.oldValue);
            } else if (historyRecord.action == 'setMerge') {
                obj.removeMerge(historyRecord.column, historyRecord.data);
            } else if (historyRecord.action == 'setStyle') {
                obj.setStyle(historyRecord.oldValue, null, null, 1);
            } else if (historyRecord.action == 'setWidth') {
                obj.setWidth(historyRecord.column, historyRecord.oldValue);
            } else if (historyRecord.action == 'setHeight') {
                obj.setHeight(historyRecord.row, historyRecord.oldValue);
            } else if (historyRecord.action == 'setHeader') {
                obj.setHeader(historyRecord.column, historyRecord.oldValue);
            } else if (historyRecord.action == 'setComments') {
                obj.setComments(historyRecord.column, historyRecord.oldValue[0], historyRecord.oldValue[1]);
            } else if (historyRecord.action == 'orderBy') {
                var rows = [];
                for (var j = 0; j < historyRecord.rows.length; j++) {
                    rows[historyRecord.rows[j]] = j;
                }
                obj.updateOrderArrow(historyRecord.column, historyRecord.order ? 0 : 1);
                obj.updateOrder(rows);
            } else if (historyRecord.action == 'setValue') {
                // Redo for changes in cells
                for (var i = 0; i < historyRecord.records.length; i++) {
                    obj.updateCell(historyRecord.records[i].col, historyRecord.records[i].row, historyRecord.records[i].oldValue);
                    obj.updateFormulaChain(historyRecord.records[i].col, historyRecord.records[i].row, records);
                    if (historyRecord.oldStyle) {
                        obj.resetStyle(historyRecord.oldStyle, true);
                    }
                }
                // Update selection
                if (! historyRecord.selection) {
                    historyRecord.selection = [historyRecord.records[0].col, historyRecord.records[0].row];
                }
                obj.updateSelectionFromCoords(historyRecord.selection[0], historyRecord.selection[1], historyRecord.selection[2], historyRecord.selection[3]);
                // Update table
                obj.updateTable();
            }
        }
        obj.ignoreEvents = ignoreEvents;
        obj.ignoreHistory = ignoreHistory;

        if (typeof(obj.options.onundo) == 'function') {
            obj.options.onundo(el, historyRecord);
        }
    }

    /**
     * Redo previously undone action
     */
    obj.redo = function() {
        // Ignore events and history
        var ignoreEvents = obj.ignoreEvents ? true : false;
        var ignoreHistory = obj.ignoreHistory ? true : false;

        obj.ignoreEvents = true;
        obj.ignoreHistory = true;

        // Records
        var records = [];

        // Update cells
        if (obj.historyIndex < obj.history.length - 1) {
            // History
            var historyRecord = obj.history[++obj.historyIndex];

            if (historyRecord.action == 'insertRow') {
                obj.historyProcessRow(0, historyRecord);
            } else if (historyRecord.action == 'deleteRow') {
                obj.historyProcessRow(1, historyRecord);
            } else if (historyRecord.action == 'insertColumn') {
                obj.historyProcessColumn(0, historyRecord);
            } else if (historyRecord.action == 'deleteColumn') {
                obj.historyProcessColumn(1, historyRecord);
            } else if (historyRecord.action == 'moveRow') {
                obj.moveRow(historyRecord.oldValue, historyRecord.newValue);
            } else if (historyRecord.action == 'moveColumn') {
                obj.moveColumn(historyRecord.oldValue, historyRecord.newValue);
            } else if (historyRecord.action == 'setMerge') {
                obj.setMerge(historyRecord.column, historyRecord.colspan, historyRecord.rowspan, 1);
            } else if (historyRecord.action == 'setStyle') {
                obj.setStyle(historyRecord.newValue, null, null, 1);
            } else if (historyRecord.action == 'setWidth') {
                obj.setWidth(historyRecord.column, historyRecord.newValue);
            } else if (historyRecord.action == 'setHeight') {
                obj.setHeight(historyRecord.row, historyRecord.newValue);
            } else if (historyRecord.action == 'setHeader') {
                obj.setHeader(historyRecord.column, historyRecord.newValue);
            } else if (historyRecord.action == 'setComments') {
                obj.setComments(historyRecord.column, historyRecord.newValue[0], historyRecord.newValue[1]);
            } else if (historyRecord.action == 'orderBy') {
                obj.updateOrderArrow(historyRecord.column, historyRecord.order);
                obj.updateOrder(historyRecord.rows);
            } else if (historyRecord.action == 'setValue') {
                // Redo for changes in cells
                for (var i = 0; i < historyRecord.records.length; i++) {
                    obj.updateCell(historyRecord.records[i].col, historyRecord.records[i].row, historyRecord.records[i].newValue);
                    obj.updateFormulaChain(historyRecord.records[i].col, historyRecord.records[i].row, records);
                    if (historyRecord.newStyle) {
                        obj.resetStyle(historyRecord.newStyle, true);
                    }
                }

                // Update selection
                if (! historyRecord.selection) {
                    historyRecord.selection = [historyRecord.records[0].col, historyRecord.records[0].row];
                }
                obj.updateSelectionFromCoords(historyRecord.selection[0], historyRecord.selection[1], historyRecord.selection[2], historyRecord.selection[3]);
                // Update table
                obj.updateTable();
            }
        }
        obj.ignoreEvents = ignoreEvents;
        obj.ignoreHistory = ignoreHistory;

        if (typeof(obj.options.onredo) == 'function') {
            obj.options.onredo(el, historyRecord);
        }
    }

    /**
     * Get dropdown value from key
     */
    obj.getDropDownValue = function(column, key) {
        var value = [];

        if (obj.options.columns[column] && obj.options.columns[column].source) {
            // Create array from source
            var combo = [];
            var source = obj.options.columns[column].source;

            for (var i = 0; i < source.length; i++) {
                if (typeof(source[i]) == 'object') {
                    combo[source[i].id] = source[i].name;
                } else {
                    combo[source[i]] = source[i];
                }
            }

            // Garante single multiple compatibily
            var keys = ('' + key).split(';')

            for (var i = 0; i < keys.length; i++) {
                if (combo[keys[i]]) {
                    value.push(combo[keys[i]]);
                }
            }
        } else {
            console.error('Invalid column');
        }

        return (value.length > 0) ? value.join('; ') : '';
    }

    /**
     * From starckoverflow contributions
     */
    obj.parseCSV = function(str, delimiter) {
        // Remove last line break
        str = str.replace(/\r?\n$|\r$|\n$/g, "");
        // Last caracter is the delimiter
        if (str.charCodeAt(str.length-1) == 9) {
            str += "\0";
        }
        // user-supplied delimeter or default comma
        delimiter = (delimiter || ",");

        var arr = [];
        var quote = false;  // true means we're inside a quoted field
        // iterate over each character, keep track of current row and column (of the returned array)
        for (var row = 0, col = 0, c = 0; c < str.length; c++) {
            var cc = str[c], nc = str[c+1];
            arr[row] = arr[row] || [];
            arr[row][col] = arr[row][col] || '';

            // If the current character is a quotation mark, and we're inside a quoted field, and the next character is also a quotation mark, add a quotation mark to the current column and skip the next character
            if (cc == '"' && quote && nc == '"') { arr[row][col] += cc; ++c; continue; }  

            // If it's just one quotation mark, begin/end quoted field
            if (cc == '"') { quote = !quote; continue; }

            // If it's a comma and we're not in a quoted field, move on to the next column
            if (cc == delimiter && !quote) { ++col; continue; }

            // If it's a newline (CRLF) and we're not in a quoted field, skip the next character and move on to the next row and move to column 0 of that new row
            if (cc == '\r' && nc == '\n' && !quote) { ++row; col = 0; ++c; continue; }

            // If it's a newline (LF or CR) and we're not in a quoted field, move on to the next row and move to column 0 of that new row
            if (cc == '\n' && !quote) { ++row; col = 0; continue; }
            if (cc == '\r' && !quote) { ++row; col = 0; continue; }

            // Otherwise, append the current character to the current column
            arr[row][col] += cc;
        }
        return arr;
    }

    obj.hash = function(str) {
        var hash = 0, i, chr;

        if (str.length === 0) {
            return hash;
        } else {
            for (i = 0; i < str.length; i++) {
              chr = str.charCodeAt(i);
              hash = ((hash << 5) - hash) + chr;
              hash |= 0;
            }
        }
        return hash;
    }

    obj.onafterchanges = function(el, records) {
        if (! obj.ignoreEvents) {
            // On after changes
            if (typeof(obj.options.onafterchanges) == 'function') {
                obj.options.onafterchanges(el, records);
            }
        }
    }

    obj.destroy = function() {
        jexcel.destroy(el);
    }

    /**
     * Initialization method
     */
    obj.init = function() {
        jexcel.current = obj;

        // Build handlers
        if (typeof(jexcel.build) == 'function') {
            jexcel.build();
            jexcel.build = null;
        }

        // Load the table data based on an CSV file
        if (obj.options.csv) {
            // Loading
            if (obj.options.loadingSpin == true) {
                jSuites.loading.show();
            }

            // Load CSV file
            jSuites.ajax({
                url: obj.options.csv,
                method: 'GET',
                dataType: 'text',
                success: function(result) {
                    // Convert data
                    var newData = obj.parseCSV(result, obj.options.csvDelimiter)

                    // Headers
                    if (obj.options.csvHeaders == true && newData.length > 0) {
                        var headers = newData.shift();
                        for(var i = 0; i < headers.length; i++) {
                            if (! obj.options.columns[i]) {
                                obj.options.columns[i] = { type:'text', align:obj.options.defaultColAlign, width:obj.options.defaultColWidth };
                            }
                            // Precedence over pre-configurated titles
                            if (typeof obj.options.columns[i].title === 'undefined') {
                              obj.options.columns[i].title = headers[i];
                            }
                        }
                    }
                    // Data
                    obj.options.data = newData;
                    // Prepare table
                    obj.prepareTable();
                    // Hide spin
                    if (obj.options.loadingSpin == true) {
                        jSuites.loading.hide();
                    }
                }
            });
        } else if (obj.options.url) {
            // Loading
            if (obj.options.loadingSpin == true) {
                jSuites.loading.show();
            }

            jSuites.ajax({
                url: obj.options.url,
                method: 'GET',
                dataType: 'json',
                success: function(result) {
                    // Data
                    obj.options.data = (result.data) ? result.data : result;
                    // Prepare table
                    obj.prepareTable();
                    // Hide spin
                    if (obj.options.loadingSpin == true) {
                        jSuites.loading.hide();
                    }
                }
            });
        } else {
            // Prepare table
            obj.prepareTable();
        }
    }

    // Context menu
    if (options && options.contextMenu != null) {
        obj.options.contextMenu = options.contextMenu;
    } else {
        obj.options.contextMenu = function(el, x, y, e) {
            var items = [];

            if (y == null) {
                // Insert a new column
                if (obj.options.allowInsertColumn == true) {
                    items.push({
                        title:obj.options.text.insertANewColumnBefore,
                        onclick:function() {
                            obj.insertColumn(1, parseInt(x), 1);
                        }
                    });
                }

                if (obj.options.allowInsertColumn == true) {
                    items.push({
                        title:obj.options.text.insertANewColumnAfter,
                        onclick:function() {
                            obj.insertColumn(1, parseInt(x), 0);
                        }
                    });
                }

                // Delete a column
                if (obj.options.allowDeleteColumn == true) {
                    items.push({
                        title:obj.options.text.deleteSelectedColumns,
                        onclick:function() {
                            obj.deleteColumn(obj.getSelectedColumns().length ? undefined : parseInt(x));
                        }
                    });
                }

                // Rename column
                if (obj.options.allowRenameColumn == true) {
                    items.push({
                        title:obj.options.text.renameThisColumn,
                        onclick:function() {
                            obj.setHeader(x);
                        }
                    });
                }

                // Sorting
                if (obj.options.columnSorting == true) {
                    // Line
                    items.push({ type:'line' });

                    items.push({
                        title:obj.options.text.orderAscending,
                        onclick:function() {
                            obj.orderBy(x, 0);
                        }
                    });
                    items.push({
                        title:obj.options.text.orderDescending,
                        onclick:function() {
                            obj.orderBy(x, 1);
                        }
                    });
                }
            } else {
                // Insert new row
                if (obj.options.allowInsertRow == true) {
                    items.push({
                        title:obj.options.text.insertANewRowBefore,
                        onclick:function() {
                            obj.insertRow(1, parseInt(y), 1);
                        }
                    });

                    items.push({
                        title:obj.options.text.insertANewRowAfter,
                        onclick:function() {
                            obj.insertRow(1, parseInt(y));
                        }
                    });
                }

                if (obj.options.allowDeleteRow == true) {
                    items.push({
                        title:obj.options.text.deleteSelectedRows,
                        onclick:function() {
                            obj.deleteRow(obj.getSelectedRows().length ? undefined : parseInt(y));
                        }
                    });
                }

                if (x) {
                    if (obj.options.allowComments == true) {
                        items.push({ type:'line' });

                        var title = obj.records[y][x].getAttribute('title') || '';

                        items.push({
                            title: title ? obj.options.text.editComments : obj.options.text.addComments,
                            onclick:function() {
                                var comment = prompt(obj.options.text.comments, title);
                                if (comment) {
                                    obj.setComments([ x, y ], comment);
                                }
                            }
                        });

                        if (title) {
                            items.push({
                                title:obj.options.text.clearComments,
                                onclick:function() {
                                    obj.setComments([ x, y ], '');
                                }
                            });
                        }
                    }
                }
            }

            // Line
            items.push({ type:'line' });

            // Copy
            items.push({
                title:obj.options.text.copy,
                shortcut:'Ctrl + C',
                onclick:function() {
                    obj.copy(true);
                }
            });

            // Paste
            if (navigator && navigator.clipboard) {
                items.push({
                    title:obj.options.text.paste,
                    shortcut:'Ctrl + V',
                    onclick:function() {
                        if (obj.selectedCell) {
                            navigator.clipboard.readText().then(function(text) {
                                if (text) {
                                    jexcel.current.paste(obj.selectedCell[0], obj.selectedCell[1], text);
                                }
                            });
                        }
                    }
                });
            }

            // Save
            if (obj.options.allowExport) {
                items.push({
                    title: obj.options.text.saveAs,
                    shortcut: 'Ctrl + S',
                    onclick: function () {
                        obj.download();
                    }
                });
            }

            // About
            if (obj.options.about) {
                items.push({
                    title:obj.options.text.about,
                    onclick:function() {
                        alert(obj.options.about);
                    }
                });
            }

            return items;
        }
    }

    obj.scrollControls = function(e) {
        if (obj.options.lazyLoading == true) {
            if (jexcel.timeControlLoading == null) {
                jexcel.timeControlLoading = setTimeout(function() {
                    if (obj.content.scrollTop + obj.content.clientHeight >= obj.content.scrollHeight) {
                        if (obj.loadDown()) {
                            if (obj.content.scrollTop + obj.content.clientHeight > obj.content.scrollHeight - 10) {
                                obj.content.scrollTop = obj.content.scrollTop - obj.content.clientHeight;
                            }
                            obj.updateCornerPosition();
                        }
                    } else if (obj.content.scrollTop <= obj.content.clientHeight) {
                        if (obj.loadUp()) {
                            if (obj.content.scrollTop < 10) {
                                obj.content.scrollTop = obj.content.scrollTop + obj.content.clientHeight;
                            }
                            obj.updateCornerPosition();
                        }
                    }

                    jexcel.timeControlLoading = null;
                }, 100);
            }
        }

        // Close editor
        if (obj.options.lazyLoading == true || obj.options.tableOverflow == true) {
            if (obj.edition && e.target.className.substr(0,9) != 'jdropdown') {
                obj.closeEditor(obj.edition[0], true);
            }
        }
    }

    el.addEventListener("DOMMouseScroll", obj.scrollControls);
    el.addEventListener("mousewheel", obj.scrollControls);

    el.jexcel = obj;

    obj.init();

    return obj;
});

jexcel.current = null;
jexcel.timeControl = null;
jexcel.timeControlLoading = null;

jexcel.destroy = function(element, destroyEventHandlers) {
    if (element.jexcel) {
        element.removeEventListener("DOMMouseScroll", element.jexcel.scrollControls);
        element.removeEventListener("mousewheel", element.jexcel.scrollControls);
        element.jexcel = null;
        element.innerHTML = '';

        if (destroyEventHandlers) {
            document.removeEventListener("keydown", jexcel.keyDownControls);
            document.removeEventListener("mouseup", jexcel.mouseUpControls);
            document.removeEventListener("mousedown", jexcel.mouseDownControls);
            document.removeEventListener("mousemove", jexcel.mouseMoveControls);
            document.removeEventListener("mouseover", jexcel.mouseOverControls);
            document.removeEventListener("dblclick", jexcel.doubleClickControls);
            document.removeEventListener("paste", jexcel.pasteControls);
            document.removeEventListener("contextmenu", jexcel.contextMenuControls);
            document.removeEventListener("touchstart", jexcel.touchStartControls);
            document.removeEventListener("touchend", jexcel.touchEndControls);
            document.removeEventListener("touchcancel", jexcel.touchEndControls);
            jexcel = null;
        }
    }
}

jexcel.build = function() {
    document.addEventListener("keydown", jexcel.keyDownControls);
    document.addEventListener("mouseup", jexcel.mouseUpControls);
    document.addEventListener("mousedown", jexcel.mouseDownControls);
    document.addEventListener("mousemove", jexcel.mouseMoveControls);
    document.addEventListener("mouseover", jexcel.mouseOverControls);
    document.addEventListener("dblclick", jexcel.doubleClickControls);
    document.addEventListener("paste", jexcel.pasteControls);
    document.addEventListener("contextmenu", jexcel.contextMenuControls);
    document.addEventListener("touchstart", jexcel.touchStartControls);
    document.addEventListener("touchend", jexcel.touchEndControls);
    document.addEventListener("touchcancel", jexcel.touchEndControls);
    document.addEventListener("touchmove", jexcel.touchEndControls);
}

/**
 * Events
 */
jexcel.keyDownControls = function(e) {
    if (jexcel.current) {
        if (jexcel.current.edition) {
            if (e.which == 27) {
                // Escape
                if (jexcel.current.edition) {
                    // Exit without saving
                    jexcel.current.closeEditor(jexcel.current.edition[0], false);
                }
                e.preventDefault();
            } else if (e.which == 13) {
                // Enter
                if (jexcel.current.options.columns[jexcel.current.edition[2]].type == 'calendar') {
                    jexcel.current.editor[0].children[0].calendar.close(1);
                } else if (jexcel.current.options.columns[jexcel.current.edition[2]].type == 'dropdown' ||
                           jexcel.current.options.columns[jexcel.current.edition[2]].type == 'autocomplete') {
                    // Do nothing
                } else {
                    // Alt enter -> do not close editor
                    if ((jexcel.current.options.wordWrap == true ||
                         jexcel.current.options.columns[jexcel.current.edition[2]].wordWrap == true ||
                         jexcel.current.options.data[jexcel.current.edition[3]][jexcel.current.edition[2]].length > 200) && e.altKey) {
                        // Add new line to the editor
                        var editorTextarea = jexcel.current.edition[0].children[0];
                        var editorValue = jexcel.current.edition[0].children[0].value;
                        var editorIndexOf = editorTextarea.selectionStart;
                        editorValue = editorValue.slice(0, editorIndexOf) + "\n" + editorValue.slice(editorIndexOf);
                        editorTextarea.value = editorValue;
                        editorTextarea.focus();
                        editorTextarea.selectionStart = editorIndexOf + 1;
                        editorTextarea.selectionEnd = editorIndexOf + 1;
                    } else {
                        jexcel.current.edition[0].children[0].blur();
                    }
                }
            } else if (e.which == 9) {
                // Tab
                if (jexcel.current.options.columns[jexcel.current.edition[2]].type == 'calendar') {
                    jexcel.current.edition[0].children[0].calendar.close(1);
                } else {
                    jexcel.current.edition[0].children[0].blur();
                }
            }
        }

        if (! jexcel.current.edition && jexcel.current.selectedCell) {
            // Which key
            if (e.which == 37) {
                jexcel.current.left(e.shiftKey, e.ctrlKey);
                e.preventDefault();
            } else if (e.which == 39) {
                jexcel.current.right(e.shiftKey, e.ctrlKey);
                e.preventDefault();
            } else if (e.which == 38) {
                jexcel.current.up(e.shiftKey, e.ctrlKey);
                e.preventDefault();
            } else if (e.which == 40) {
                jexcel.current.down(e.shiftKey, e.ctrlKey);
                e.preventDefault();
            } else if (e.which == 36) {
                jexcel.current.first(e.shiftKey, e.ctrlKey);
                e.preventDefault();
            } else if (e.which == 35) {
                jexcel.current.last(e.shiftKey, e.ctrlKey);
                e.preventDefault();
            } else if (e.which == 32) {
                if (jexcel.current.options.editable == true) {
                    jexcel.current.setCheckRadioValue();
                }
                e.preventDefault();
            } else if (e.which == 46) {
                // Delete
                if (jexcel.current.options.editable == true) {
                    if (jexcel.current.selectedRow) {
                        if (jexcel.current.options.allowDeleteRow == true) {
                            if (confirm(jexcel.current.options.text.areYouSureToDeleteTheSelectedRows)) {
                                jexcel.current.deleteRow();
                            }
                        }
                    } else if (jexcel.current.selectedHeader) {
                        if (jexcel.current.options.allowDeleteColumn == true) {
                            if (confirm(jexcel.current.options.text.areYouSureToDeleteTheSelectedColumns)) {
                                jexcel.current.deleteColumn();
                            }
                        }
                    } else {
                        // Change value
                        jexcel.current.setValue(jexcel.current.highlighted, '');
                    }
                }
            } else if (e.which == 13) {
                // Move cursor
                if (e.shiftKey) {
                    jexcel.current.up();
                } else {
                    if (jexcel.current.options.allowInsertRow == true) {
                        if (jexcel.current.options.allowManualInsertRow == true) {
                            if (jexcel.current.selectedCell[1] == jexcel.current.options.data.length - 1) {
                                // New record in case selectedCell in the last row
                                jexcel.current.insertRow();
                            }
                        }
                    }

                    jexcel.current.down();
                }
                e.preventDefault();
            } else if (e.which == 9) {
                // Tab
                if (e.shiftKey) {
                    jexcel.current.left();
                } else {
                    if (jexcel.current.options.allowInsertColumn == true) {
                        if (jexcel.current.options.allowManualInsertColumn == true) {
                            if (jexcel.current.selectedCell[0] == jexcel.current.options.data[0].length - 1) {
                                // New record in case selectedCell in the last column
                                jexcel.current.insertColumn();
                            }
                        }
                    }

                    jexcel.current.right();
                }
                e.preventDefault();
            } else {
                if ((e.ctrlKey || e.metaKey) && ! e.shiftKey) {
                    if (e.which == 65) {
                        // Ctrl + A
                        jexcel.current.selectAll();
                        e.preventDefault();
                    } else if (e.which == 83) {
                        // Ctrl + S
                        jexcel.current.download();
                        e.preventDefault();
                    } else if (e.which == 89) {
                        // Ctrl + Y
                        jexcel.current.redo();
                        e.preventDefault();
                    } else if (e.which == 90) {
                        // Ctrl + Z
                        jexcel.current.undo();
                        e.preventDefault();
                    } else if (e.which == 67) {
                        // Ctrl + C
                        jexcel.current.copy(true);
                        e.preventDefault();
                    } else if (e.which == 67) {
                        // Ctrl + C
                        jexcel.current.copy(true);
                        e.preventDefault();
                    } else if (e.which == 88) {
                        // Ctrl + X
                        if (jexcel.current.options.editable == true) {
                            jexcel.cutControls();
                        } else {
                            jexcel.copyControls();
                        }
                        e.preventDefault();
                    } else if (e.which == 86) {
                        // Ctrl + V
                        jexcel.pasteControls();
                    }
                } else {
                    if (jexcel.current.selectedCell) {
                        if (jexcel.current.options.editable == true) {
                            var rowId = jexcel.current.selectedCell[1];
                            var columnId = jexcel.current.selectedCell[0];

                            // If is not readonly
                            if (jexcel.current.options.columns[columnId].type != 'readonly') {
                                // Characters able to start a edition
                                if (e.keyCode == 32) {
                                    // Space
                                    if (jexcel.current.options.columns[columnId].type == 'checkbox' ||
                                        jexcel.current.options.columns[columnId].type == 'radio') {
                                        e.preventDefault();
                                    } else {
                                        // Start edition
                                        jexcel.current.openEditor(jexcel.current.records[rowId][columnId], true);
                                    }
                                } else if (e.keyCode == 113) {
                                    // Start edition with current content F2
                                    jexcel.current.openEditor(jexcel.current.records[rowId][columnId], false);
                                } else if ((e.keyCode == 8) ||
                                           (e.keyCode >= 48 && e.keyCode <= 57) ||
                                           (e.keyCode >= 96 && e.keyCode <= 111) ||
                                           (e.keyCode == 187) ||
                                           (e.keyCode == 189) ||
                                           ((String.fromCharCode(e.keyCode) == e.key || String.fromCharCode(e.keyCode).toLowerCase() == e.key.toLowerCase()) && jexcel.validLetter(String.fromCharCode(e.keyCode)))) {
                                    // Start edition
                                    jexcel.current.openEditor(jexcel.current.records[rowId][columnId], true);
                                    // Prevent entries in the calendar
                                    if (jexcel.current.options.columns[columnId].type == 'calendar') {
                                        e.preventDefault();
                                    }
                                }
                            }
                        }
                    }
                }
            }
        } else {
            if (e.target.classList.contains('jexcel_search')) {
                if (jexcel.timeControl) {
                    clearTimeout(jexcel.timeControl);
                }

                jexcel.timeControl = setTimeout(function() {
                    jexcel.current.search(e.target.value);
                }, 200);
            }
        }
    }
}

jexcel.isMouseAction = false;

jexcel.mouseDownControls = function(e) {
    e = e || window.event;
    if (e.buttons) {
        var mouseButton = e.buttons;
    } else if (e.button) {
        var mouseButton = e.button;
    } else {
        var mouseButton = e.which;
    }

    // Get elements
    var jexcelTable = jexcel.getElement(e.target);

    if (jexcelTable[0]) {
        if (jexcel.current != jexcelTable[0].jexcel) {
            if (jexcel.current) {
                jexcel.current.resetSelection();
            }
            jexcel.current = jexcelTable[0].jexcel;
        }
    } else {
        if (jexcel.current) {
            jexcel.current.resetSelection(true);
            jexcel.current = null;
        }
    }

    if (jexcel.current && mouseButton == 1) {
        if (e.target.classList.contains('jexcel_selectall')) {
            if (jexcel.current) {
                jexcel.current.selectAll();
            }
        } else if (e.target.classList.contains('jexcel_corner')) {
            if (jexcel.current.options.editable == true) {
                jexcel.current.selectedCorner = true;
            }
        } else {
            // Header found
            if (jexcelTable[1] == 1) {
                var columnId = e.target.getAttribute('data-x');
                if (columnId) {
                    // Update cursor
                    var info = e.target.getBoundingClientRect();
                    if (jexcel.current.options.columnResize == true && info.width - e.offsetX < 6) {
                        // Resize helper
                        jexcel.current.resizing = {
                            mousePosition: e.pageX,
                            column: columnId,
                            width: info.width,
                        };

                        // Border indication
                        jexcel.current.headers[columnId].classList.add('resizing');
                        for (var j = 0; j < jexcel.current.records.length; j++) {
                            if (jexcel.current.records[j][columnId]) {
                                jexcel.current.records[j][columnId].classList.add('resizing');
                            }
                        }
                    } else if (jexcel.current.options.columnDrag == true && info.height - e.offsetY < 6) {
                        if (jexcel.current.isColMerged(columnId).length) {
                            console.error('JEXCEL: This column is part of a merged cell.');
                        } else {
                            // Reset selection
                            jexcel.current.resetSelection();
                            // Drag helper
                            jexcel.current.dragging = {
                                element: e.target,
                                column:columnId,
                                destination:columnId,
                            };
                            // Border indication
                            jexcel.current.headers[columnId].classList.add('dragging');
                            for (var j = 0; j < jexcel.current.records.length; j++) {
                                if (jexcel.current.records[j][columnId]) {
                                    jexcel.current.records[j][columnId].classList.add('dragging');
                                }
                            }
                        }
                    } else {
                        if (jexcel.current.selectedHeader && (e.shiftKey || e.ctrlKey)) {
                            var o = jexcel.current.selectedHeader;
                            var d = columnId;
                        } else {
                            // Press to rename
                            if (jexcel.current.selectedHeader == columnId && jexcel.current.options.allowRenameColumn == true) {
                                jexcel.timeControl = setTimeout(function() {
                                    jexcel.current.setHeader(columnId);
                                }, 800);
                            }

                            // Keep track of which header was selected first
                            jexcel.current.selectedHeader = columnId;

                            // Update selection single column
                            var o = columnId;
                            var d = columnId;
                        }

                        // Update selection
                        jexcel.current.updateSelectionFromCoords(o, 0, d, jexcel.current.options.data.length - 1);
                    }
                } else {
                    if (e.target.parentNode.classList.contains('jexcel_nested')) {
                        if (e.target.getAttribute('data-column')) {
                            var column = e.target.getAttribute('data-column').split(',');
                            var c1 = parseInt(column[0]);
                            var c2 = parseInt(column[column.length-1]);
                        } else {
                            var c1 = 0;
                            var c2 = jexcel.current.options.columns.length - 1;
                        }
                        jexcel.current.updateSelectionFromCoords(c1, 0, c2, jexcel.current.options.data.length - 1);
                    }
                }
            } else {
                jexcel.current.selectedHeader = false;
            }

            // Body found
            if (jexcelTable[1] == 2) {
                var rowId = e.target.getAttribute('data-y');

                if (e.target.classList.contains('jexcel_row')) {
                    var info = e.target.getBoundingClientRect();
                    if (jexcel.current.options.rowResize == true && info.height - e.offsetY < 6) {
                        // Resize helper
                        jexcel.current.resizing = {
                            element: e.target.parentNode,
                            mousePosition: e.pageY,
                            row: rowId,
                            height: info.height,
                        };
                        // Border indication
                        e.target.parentNode.classList.add('resizing');
                    } else if (jexcel.current.options.rowDrag == true && info.width - e.offsetX < 6) {
                        if (jexcel.current.isRowMerged(rowId).length) {
                            console.error('JEXCEL: This row is part of a merged cell');
                        } else if (jexcel.current.options.search == true && jexcel.current.results) {
                            console.error('JEXCEL: Please clear your search before perform this action');
                        } else {
                            // Reset selection
                            jexcel.current.resetSelection();
                            // Drag helper
                            jexcel.current.dragging = {
                                element: e.target.parentNode,
                                row:rowId,
                                destination:rowId,
                            };
                            // Border indication
                            e.target.parentNode.classList.add('dragging');
                        }
                    } else {
                        if (jexcel.current.selectedRow && (e.shiftKey || e.ctrlKey)) {
                            var o = jexcel.current.selectedRow;
                            var d = rowId;
                        } else {
                            // Keep track of which header was selected first
                            jexcel.current.selectedRow = rowId;

                            // Update selection single column
                            var o = rowId;
                            var d = rowId;
                        }

                        // Update selection
                        jexcel.current.updateSelectionFromCoords(0, o, jexcel.current.options.data[0].length - 1, d);
                    }
                } else {
                    // Jclose
                    if (e.target.classList.contains('jclose') && e.target.clientWidth - e.offsetX < 50 && e.offsetY < 50) {
                        jexcel.current.closeEditor(jexcel.current.edition[0], true);
                    } else {
                        var getCellCoords = function(element) {
                            var x = element.getAttribute('data-x');
                            var y = element.getAttribute('data-y');
                            if (x && y) {
                                return [x, y];
                            } else {
                                if (element.parentNode) {
                                    return getCellCoords(element.parentNode);
                                }
                            }
                        };

                        var position = getCellCoords(e.target);
                        if (position) {
                            var columnId = position[0];
                            var rowId = position[1];
                            // Close edition
                            if (jexcel.current.edition) {
                                if (jexcel.current.edition[2] != columnId || jexcel.current.edition[3] != rowId) {
                                    jexcel.current.closeEditor(jexcel.current.edition[0], true);
                                }
                            }

                            if (! jexcel.current.edition) {
                                // Update cell selection
                                if (e.shiftKey) {
                                    jexcel.current.updateSelectionFromCoords(jexcel.current.selectedCell[0], jexcel.current.selectedCell[1], columnId, rowId);
                                } else {
                                    jexcel.current.updateSelectionFromCoords(columnId, rowId);
                                }
                            }

                            // No full row selected
                            jexcel.current.selectedHeader = null;
                            jexcel.current.selectedRow = null;
                        }
                    }
                }
            } else {
                jexcel.current.selectedRow = false;
            }

            // Pagination
            if (e.target.classList.contains('jexcel_page')) {
                if (e.target.innerText == '<') {
                    jexcel.current.page(0);
                } else if (e.target.innerText == '>') {
                    jexcel.current.page(e.target.getAttribute('title') - 1);
                } else {
                    jexcel.current.page(e.target.innerText - 1);
                }
            }
        }

        if (jexcel.current.edition) {
            jexcel.isMouseAction = false;
        } else {
            jexcel.isMouseAction = true;
        }
    } else {
        jexcel.isMouseAction = false;
    }
}

jexcel.mouseUpControls = function(e) {
    if (jexcel.current) {
        // Update cell size
        if (jexcel.current.resizing) {
            // Columns to be updated
            if (jexcel.current.resizing.column) {
                // Remove Class
                jexcel.current.headers[jexcel.current.resizing.column].classList.remove('resizing');
                var newWidth = jexcel.current.colgroup[jexcel.current.resizing.column].getAttribute('width');
                jexcel.current.setWidth(jexcel.current.resizing.column, newWidth, jexcel.current.resizing.width);
                // Remove border
                jexcel.current.headers[jexcel.current.resizing.column].classList.remove('resizing');
                for (var j = 0; j < jexcel.current.records.length; j++) {
                    if (jexcel.current.records[j][jexcel.current.resizing.column]){
                        jexcel.current.records[j][jexcel.current.resizing.column].classList.remove('resizing');
                    }
                }
            } else {
                // Remove Class
                jexcel.current.rows[jexcel.current.resizing.row].children[0].classList.remove('resizing');
                var newHeight = jexcel.current.rows[jexcel.current.resizing.row].getAttribute('height');
                jexcel.current.setHeight(jexcel.current.resizing.row, newHeight, jexcel.current.resizing.height);
                // Remove border
                jexcel.current.resizing.element.classList.remove('resizing');
            }
            // Reset resizing helper
            jexcel.current.resizing = null;
        } else if (jexcel.current.dragging) {
            // Reset dragging helper
            if (jexcel.current.dragging) {
                if (jexcel.current.dragging.column) {
                    // Target
                    var columnId = e.target.getAttribute('data-x');
                    // Remove move style
                    jexcel.current.headers[jexcel.current.dragging.column].classList.remove('dragging');
                    for (var j = 0; j < jexcel.current.rows.length; j++) {
                        if (jexcel.current.records[j][jexcel.current.dragging.column]) {
                            jexcel.current.records[j][jexcel.current.dragging.column].classList.remove('dragging');
                        }
                    }
                    for (var i = 0; i < jexcel.current.headers.length; i++) {
                        jexcel.current.headers[i].classList.remove('dragging-left');
                        jexcel.current.headers[i].classList.remove('dragging-right');
                    }
                    // Update position
                    if (columnId) {
                        if (jexcel.current.dragging.column != jexcel.current.dragging.destination) {
                            jexcel.current.moveColumn(jexcel.current.dragging.column, jexcel.current.dragging.destination);
                        }
                    }
                } else {
                    var position = Array.prototype.indexOf.call(jexcel.current.dragging.element.parentNode.children, jexcel.current.dragging.element);
                    if (jexcel.current.dragging.row != position) {
                        jexcel.current.moveRow(jexcel.current.dragging.row, position, true);
                    }
                    jexcel.current.dragging.element.classList.remove('dragging');
                }
                jexcel.current.dragging = null;
            }
        } else {
            // Close any corner selection
            if (jexcel.current.selectedCorner) {
                jexcel.current.selectedCorner = false;

                // Data to be copied
                if (jexcel.current.selection.length > 0) {
                    // Copy data
                    jexcel.current.copyData(jexcel.current.selection[0], jexcel.current.selection[jexcel.current.selection.length - 1]);

                    // Remove selection
                    jexcel.current.removeCopySelection();
                }
            }
        }
    }

    // Clear any time control
    if (jexcel.timeControl) {
        clearTimeout(jexcel.timeControl);
        jexcel.timeControl = null;
    }

    // Mouse up
    jexcel.isMouseAction = false;
}

// Mouse move controls
jexcel.mouseMoveControls = function(e) {
    e = e || window.event;
    if (e.buttons) {
        var mouseButton = e.buttons;
    } else if (e.button) {
        var mouseButton = e.button;
    } else {
        var mouseButton = e.which;
    }

    if (! mouseButton) {
        jexcel.isMouseAction = false;
    }

    if (jexcel.current) {
        if (jexcel.isMouseAction == true) {
            // Resizing is ongoing
            if (jexcel.current.resizing) {
                if (jexcel.current.resizing.column) {
                    var width = e.pageX - jexcel.current.resizing.mousePosition;

                    if (jexcel.current.resizing.width + width > 0) {
                        var tempWidth = jexcel.current.resizing.width + width;
                        jexcel.current.colgroup[jexcel.current.resizing.column].setAttribute('width', tempWidth);

                        jexcel.current.updateCornerPosition();
                    }
                } else {
                    var height = e.pageY - jexcel.current.resizing.mousePosition;

                    if (jexcel.current.resizing.height + height > 0) {
                        var tempHeight = jexcel.current.resizing.height + height;
                        jexcel.current.rows[jexcel.current.resizing.row].setAttribute('height', tempHeight);

                        jexcel.current.updateCornerPosition();
                    }
                }
            }
        } else {
            var x = e.target.getAttribute('data-x');
            var y = e.target.getAttribute('data-y');
            var rect = e.target.getBoundingClientRect();

            if (jexcel.current.cursor) {
                jexcel.current.cursor.style.cursor = '';
                jexcel.current.cursor = null;
            }

            if (e.target.parentNode.parentNode && e.target.parentNode.parentNode.className) {
                if (e.target.parentNode.parentNode.classList.contains('resizable')) {
                    if (e.target && x && ! y && (rect.width - (e.clientX - rect.left) < 6)) {
                        jexcel.current.cursor = e.target;
                        jexcel.current.cursor.style.cursor = 'col-resize';
                    } else if (e.target && ! x && y && (rect.height - (e.clientY - rect.top) < 6)) {
                        jexcel.current.cursor = e.target;
                        jexcel.current.cursor.style.cursor = 'row-resize';
                    }
                }

                if (e.target.parentNode.parentNode.classList.contains('draggable')) {
                    if (e.target && ! x && y && (rect.width - (e.clientX - rect.left) < 6)) {
                        jexcel.current.cursor = e.target;
                        jexcel.current.cursor.style.cursor = 'move';
                    } else if (e.target && x && ! y && (rect.height - (e.clientY - rect.top) < 6)) {
                        jexcel.current.cursor = e.target;
                        jexcel.current.cursor.style.cursor = 'move';
                    }
                }
            }
        }
    }
}

jexcel.mouseOverControls = function(e) {
    e = e || window.event;
    if (e.buttons) {
        var mouseButton = e.buttons;
    } else if (e.button) {
        var mouseButton = e.button;
    } else {
        var mouseButton = e.which;
    }

    if (! mouseButton) {
        jexcel.isMouseAction = false;
    }

    if (jexcel.current && jexcel.isMouseAction == true) {
        // Get elements
        var jexcelTable = jexcel.getElement(e.target);

        if (jexcelTable[0]) {
            // Avoid cross reference
            if (jexcel.current != jexcelTable[0].jexcel) {
                if (jexcel.current) {
                    return false;
                }
            }

            var columnId = e.target.getAttribute('data-x');
            var rowId = e.target.getAttribute('data-y');

            if (jexcel.current.dragging) {
                if (jexcel.current.dragging.column) {
                    if (columnId) {
                        if (jexcel.current.isColMerged(columnId).length) {
                            console.error('JEXCEL: This column is part of a merged cell.');
                        } else {
                            for (var i = 0; i < jexcel.current.headers.length; i++) {
                                jexcel.current.headers[i].classList.remove('dragging-left');
                                jexcel.current.headers[i].classList.remove('dragging-right');
                            }

                            if (jexcel.current.dragging.column == columnId) {
                                jexcel.current.dragging.destination = parseInt(columnId);
                            } else {
                                if (e.target.clientWidth / 2 > e.offsetX) {
                                    if (jexcel.current.dragging.column < columnId) {
                                        jexcel.current.dragging.destination = parseInt(columnId) - 1;
                                    } else {
                                        jexcel.current.dragging.destination = parseInt(columnId);
                                    }
                                    jexcel.current.headers[columnId].classList.add('dragging-left');
                                } else {
                                    if (jexcel.current.dragging.column < columnId) {
                                        jexcel.current.dragging.destination = parseInt(columnId);
                                    } else {
                                        jexcel.current.dragging.destination = parseInt(columnId) + 1;
                                    }
                                    jexcel.current.headers[columnId].classList.add('dragging-right');
                                }
                            }
                        }
                    }
                } else {
                    if (rowId) {
                        if (jexcel.current.isRowMerged(rowId).length) {
                            console.error('JEXCEL: This row is part of a merged cell.');
                        } else {
                            var target = (e.target.clientHeight / 2 > e.offsetY) ? e.target.parentNode.nextSibling : e.target.parentNode;
                            e.target.parentNode.parentNode.insertBefore(jexcel.current.dragging.element, target);
                        }
                    }
                }
            } else if (jexcel.current.resizing) {
            } else {
                // Header found
                if (jexcelTable[1] == 1) {
                    if (jexcel.current.selectedHeader) {
                        var columnId = e.target.getAttribute('data-x');
                        var o = jexcel.current.selectedHeader;
                        var d = columnId;
                        // Update selection
                        jexcel.current.updateSelectionFromCoords(o, 0, d, jexcel.current.options.data.length - 1);
                    }
                }

                // Body found
                if (jexcelTable[1] == 2) {
                    if (e.target.classList.contains('jexcel_row')) {
                        if (jexcel.current.selectedRow) {
                            var o = jexcel.current.selectedRow;
                            var d = rowId;
                            // Update selection
                            jexcel.current.updateSelectionFromCoords(0, o, jexcel.current.options.data[0].length - 1, d);
                        }
                    } else {
                        // Do not select edtion is in progress
                        if (! jexcel.current.edition) {
                            if (columnId && rowId) {
                                if (jexcel.current.selectedCorner) {
                                    jexcel.current.updateCopySelection(columnId, rowId);
                                } else {
                                    if (jexcel.current.selectedCell) {
                                        jexcel.current.updateSelectionFromCoords(jexcel.current.selectedCell[0], jexcel.current.selectedCell[1], columnId, rowId);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    // Clear any time control
    if (jexcel.timeControl) {
        clearTimeout(jexcel.timeControl);
        jexcel.timeControl = null;
    }
}

/**
 * Double click event handler: controls the double click in the corner, cell edition or column re-ordering.
 */
jexcel.doubleClickControls = function(e) {
    // Jexcel is selected
    if (jexcel.current) {
        // Corner action
        if (e.target.classList.contains('jexcel_corner')) {
            // Any selected cells
            if (jexcel.current.highlighted.length > 0) {
                // Copy from this
                var x1 = jexcel.current.highlighted[0].getAttribute('data-x');
                var y1 = parseInt(jexcel.current.highlighted[jexcel.current.highlighted.length - 1].getAttribute('data-y')) + 1;
                // Until this
                var x2 = jexcel.current.highlighted[jexcel.current.highlighted.length - 1].getAttribute('data-x');
                var y2 = jexcel.current.records.length - 1
                // Execute copy
                jexcel.current.copyData(jexcel.current.records[y1][x1], jexcel.current.records[y2][x2]);
            }
        } else {
            // Get table
            var jexcelTable = jexcel.getElement(e.target);

            // Double click over header
            if (jexcelTable[1] == 1 && jexcel.current.options.columnSorting == true) {
                // Check valid column header coords
                var columnId = e.target.getAttribute('data-x');
                if (columnId) {
                    jexcel.current.orderBy(columnId);
                }
            }

            // Double click over body
            if (jexcelTable[1] == 2 && jexcel.current.options.editable == true) {
                if (! jexcel.current.edition) {
                    var getCellCoords = function(element) {
                        if (element.parentNode) {
                            var x = element.getAttribute('data-x');
                            var y = element.getAttribute('data-y');
                            if (x && y) {
                                return element;
                            } else {
                                return getCellCoords(element.parentNode);
                            }
                        }
                    }
                    var cell = getCellCoords(e.target);
                    if (cell && cell.classList.contains('highlight')) {
                        jexcel.current.openEditor(cell);
                    }
                }
            }
        }
    }
}

jexcel.copyControls = function(e) {
    if (jexcel.current && jexcel.copyControls.enabled) {
        if (! jexcel.current.edition) {
            jexcel.current.copy(true);
        }
    }
}

jexcel.cutControls = function(e) {
    if (jexcel.current) {
        if (! jexcel.current.edition) {
            jexcel.current.copy(true);
            if (jexcel.current.options.editable == true) {
                jexcel.current.setValue(jexcel.current.highlighted, '');
            }
        }
    }
}

jexcel.pasteControls = function(e) {
    if (jexcel.current && jexcel.current.selectedCell) {
        if (! jexcel.current.edition) {
            if (jexcel.current.options.editable == true) {
                if (e && e.clipboardData) {
                    jexcel.current.paste(jexcel.current.selectedCell[0], jexcel.current.selectedCell[1], e.clipboardData.getData('text'));
                    e.preventDefault();
                } else if (window.clipboardData) {
                    jexcel.current.paste(jexcel.current.selectedCell[0], jexcel.current.selectedCell[1], window.clipboardData.getData('text'));
                }
            }
        }
    }
}

jexcel.contextMenuControls = function(e) {
    e = e || window.event;
    if ("buttons" in e) {
        var mouseButton = e.buttons;
    } else {
        var mouseButton = e.which || e.button;
    }

    if (jexcel.current) {
        if (jexcel.current.edition) {
            e.preventDefault();
        } else if (jexcel.current.options.contextMenu) {
            jexcel.current.contextMenu.contextmenu.close();

            if (jexcel.current) {
                var x = e.target.getAttribute('data-x');
                var y = e.target.getAttribute('data-y');

                if (x || y) {
                    // Table found
                    var items = jexcel.current.options.contextMenu(jexcel.current, x, y, e);
                    // The id is depending on header and body
                    jexcel.current.contextMenu.contextmenu.open(e, items);
                    // Avoid the real one
                    e.preventDefault();
                }
            }
        }
    }
}

jexcel.touchStartControls = function(e) {
    var jexcelTable = jexcel.getElement(e.target);

    if (jexcelTable[0]) {
        if (jexcel.current != jexcelTable[0].jexcel) {
            if (jexcel.current) {
                jexcel.current.resetSelection();
            }
            jexcel.current = jexcelTable[0].jexcel;
        }
    } else {
        if (jexcel.current) {
            jexcel.current.resetSelection();
            jexcel.current = null;
        }
    }

    if (jexcel.current) {
        if (! jexcel.current.edition) {
            var columnId = e.target.getAttribute('data-x');
            var rowId = e.target.getAttribute('data-y');

            if (columnId && rowId) {
                jexcel.current.updateSelectionFromCoords(columnId, rowId);

                jexcel.timeControl = setTimeout(function() {
                    // Keep temporary reference to the element
                    if (jexcel.current.options.columns[columnId].type == 'color') {
                        jexcel.tmpElement = null;
                    } else {
                        jexcel.tmpElement = e.target;
                    }
                    jexcel.current.openEditor(e.target, false, e);
                }, 500);
            }
        }
    }
}

jexcel.touchEndControls = function(e) {
    // Clear any time control
    if (jexcel.timeControl) {
        clearTimeout(jexcel.timeControl);
        jexcel.timeControl = null;
        // Element
        if (jexcel.tmpElement && jexcel.tmpElement.children[0].tagName == 'INPUT') {
            jexcel.tmpElement.children[0].focus();
        }
        jexcel.tmpElement = null;
    }
}

/**
 * Jexcel extensions
 */

jexcel.createTabs = function(tabs, result) {
    // Create tab container
    tabs.innerHTML = '';
    tabs.classList.add('jexcel_tabs');
    var spreadsheet = []
    var link = [];
    for (var i = 0; i < result.length; i++) {
        // Spreadsheet container
        spreadsheet[i] = document.createElement('div');
        spreadsheet[i].classList.add('jexcel_tab');
        // Tab link
        link[i] = document.createElement('div');
        link[i].classList.add('jexcel_tab_link');
        link[i].setAttribute('data-spreadsheet', i);
        link[i].innerHTML = result[i].sheetName;
        link[i].onclick = function() {
            for (var j = 0; j < spreadsheet.length; j++) {
                spreadsheet[j].style.display = 'none';
                link[j].classList.remove('selected');
            }
            var i = this.getAttribute('data-spreadsheet');
            spreadsheet[i].style.display = 'block';
            link[i].classList.add('selected')
        }
        tabs.appendChild(link[i]);
    }

    // Append spreadsheet
    for (var i = 0; i < spreadsheet.length - 1; i++) {
        tabs.appendChild(spreadsheet[i]);
        jexcel(spreadsheet[i], result[i]);
    }

    // First tab
    spreadsheet[0].style.display = 'block';
    link[0].classList.add('selected')
}

jexcel.fromSpreadsheet = function(file, __callback) {
    var convert = function(workbook) {
        var spreadsheets = [];
        workbook.SheetNames.forEach(function(sheetName) {
            var spreadsheet = {};
            spreadsheet.rows = [];
            spreadsheet.columns = [];
            spreadsheet.data = [];
            spreadsheet.style = {};
            spreadsheet.sheetName = sheetName;

            // Column widths
            var temp = workbook.Sheets[sheetName]['!cols'];
            if (temp && temp.length) {
                for (var i = 0; i < temp.length; i++) {
                    spreadsheet.columns[i] = {};
                    if (temp[i] && temp[i].wpx) {
                        spreadsheet.columns[i].width = temp[i].wpx + 'px';
                    }
                }
            }
            // Rows heights
            var temp = workbook.Sheets[sheetName]['!rows'];
            if (temp && temp.length) {
                for (var i = 0; i < temp.length; i++) {
                    if (temp[i] && temp[i].hpx) {
                        spreadsheet.rows[i] = {};
                        spreadsheet.rows[i].height = temp[i].hpx + 'px';
                    }
                }
            }
            // Merge cells
            var temp = workbook.Sheets[sheetName]['!merges'];
            if (temp && temp.length > 0) {
                spreadsheet.mergeCells = [];
                for (var i = 0; i < temp.length; i++) {
                    var x1 = temp[i].s.c;
                    var y1 = temp[i].s.r;
                    var x2 = temp[i].e.c;
                    var y2 = temp[i].e.r;
                    var key = jexcel.getColumnNameFromId([x1,y1]);
                    spreadsheet.mergeCells[key] = [ x2-x1+1, y2-y1+1 ];
                }
            }
            // Data container
            var max_x = 0;
            var max_y = 0;
            var temp = Object.keys(workbook.Sheets[sheetName]);
            for (var i = 0; i < temp.length; i++) {
                if (temp[i].substr(0,1) != '!') {
                    var cell = workbook.Sheets[sheetName][temp[i]];
                    var info = jexcel.getIdFromColumnName(temp[i], true);
                    if (! spreadsheet.data[info[1]]) {
                        spreadsheet.data[info[1]] = [];
                    }
                    spreadsheet.data[info[1]][info[0]] = cell.f ? '=' + cell.f : cell.w;
                    if (max_x < info[0]) {
                        max_x = info[0];
                    }
                    if (max_y < info[1]) {
                        max_y = info[1];
                    }
                    // Style
                    if (cell.style && Object.keys(cell.style).length > 0) {
                        spreadsheet.style[temp[i]] = cell.style;
                    }
                    if (cell.s && cell.s.fgColor) {
                        if (spreadsheet.style[temp[i]]) {
                            spreadsheet.style[temp[i]] += ';';
                        }
                        spreadsheet.style[temp[i]] += 'background-color:#' + cell.s.fgColor.rgb;
                    }
                }
            }
            var numColumns = spreadsheet.columns;
            for (var j = 0; j <= max_y; j++) {
                for (var i = 0; i <= max_x; i++) {
                    if (! spreadsheet.data[j]) {
                        spreadsheet.data[j] = [];
                    }
                    if (! spreadsheet.data[j][i]) {
                        if (numColumns < i) {
                            spreadsheet.data[j][i] = '';
                        }
                    }
                }
            }
            spreadsheets.push(spreadsheet);
        });

        return spreadsheets;
    }

    var oReq;
    oReq = new XMLHttpRequest();
    oReq.open("GET", file, true);

    if(typeof Uint8Array !== 'undefined') {
        oReq.responseType = "arraybuffer";
        oReq.onload = function(e) {
            var arraybuffer = oReq.response;
            var data = new Uint8Array(arraybuffer);
            var wb = XLSX.read(data, {type:"array", cellFormula:true, cellStyles:true });
            __callback(convert(wb))
        };
    } else {
        oReq.setRequestHeader("Accept-Charset", "x-user-defined");  
        oReq.onreadystatechange = function() { if(oReq.readyState == 4 && oReq.status == 200) {
            var ff = convertResponseBodyToText(oReq.responseBody);
            var wb = XLSX.read(ff, {type:"binary", cellFormula:true, cellStyles:true });
            __callback(convert(wb))
        }};
    }

    oReq.send();
}

/**
 * Valid international letter
 */

jexcel.validLetter = function (text) {
    var regex = /([\u0041-\u005A\u0061-\u007A\u00AA\u00B5\u00BA\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0\u08A2-\u08AC\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097F\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191C\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA697\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA80-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC-\u0400-\u04FF']+)/g;
    return text.match(regex) ? 1 : 0;
}

/**
 * Helper injectArray
 */
jexcel.injectArray = function(o, idx, arr) {
    return o.slice(0, idx).concat(arr).concat(o.slice(idx));
}

/**
 * Get letter based on a number
 * 
 * @param integer i
 * @return string letter
 */
jexcel.getColumnName = function(i) {
    var letter = '';
    if (i > 701) {
        letter += String.fromCharCode(64 + parseInt(i / 676));
        letter += String.fromCharCode(64 + parseInt((i % 676) / 26));
    } else if (i > 25) {
        letter += String.fromCharCode(64 + parseInt(i / 26));
    }
    letter += String.fromCharCode(65 + (i % 26));

    return letter;
}

/**
 * Convert excel like column to jexcel id
 * 
 * @param string id
 * @return string id
 */
jexcel.getIdFromColumnName = function (id, arr) {
    // Get the letters
    var t = /^[a-zA-Z]+/.exec(id);

    if (t) {
        // Base 26 calculation
        var code = 0;
        for (var i = 0; i < t[0].length; i++) {
            code += parseInt(t[0].charCodeAt(i) - 64) * Math.pow(26, (t[0].length - 1 - i));
        }
        code--;
        // Make sure jexcel starts on zero
        if (code < 0) {
            code = 0;
        }

        // Number
        var number = parseInt(/[0-9]+$/.exec(id));
        if (number > 0) {
            number--;
        }

        if (arr == true) {
            id = [ code, number ];
        } else {
            id = code + '-' + number;
        }
    }

    return id;
}

/**
 * Convert jexcel id to excel like column name
 * 
 * @param string id
 * @return string id
 */
jexcel.getColumnNameFromId = function (cellId) {
    if (! Array.isArray(cellId)) {
        cellId = cellId.split('-');
    }

    return jexcel.getColumnName(parseInt(cellId[0])) + (parseInt(cellId[1]) + 1);
}

/**
 * Verify element inside jexcel table
 * 
 * @param string id
 * @return string id
 */
jexcel.getElement = function(element) {
    var jexcelSection = 0;
    var jexcelElement = 0;

    function path (element) {
        if (element.className) {
            if (element.classList.contains('jexcel_container')) {
                jexcelElement = element;
            }
        }

        if (element.tagName == 'THEAD') {
            jexcelSection = 1;
        } else if (element.tagName == 'TBODY') {
            jexcelSection = 2;
        }

        if (element.parentNode) {
            path(element.parentNode);
        }
    }

    path(element);

    return [ jexcelElement, jexcelSection ];
}

jexcel.doubleDigitFormat = function(v) {
    v = ''+v;
    if (v.length == 1) {
        v = '0'+v;
    }
    return v;
}

/**
 * Jquery Support
 */
if (typeof(jQuery) != 'undefined') {
    (function($){
        $.fn.jexcel = function(method) {
            var spreadsheetContainer = $(this).get(0);
            if (! spreadsheetContainer.jexcel) {
                return jexcel($(this).get(0), arguments[0]);
            } else {
                return spreadsheetContainer.jexcel[method].apply(this, Array.prototype.slice.call( arguments, 1 ));
            }
        };

    })(jQuery);
}


// Based on sutoiku work (https://github.com/sutoiku)

var error = (function() {
    var exports = {};

    exports.nil = new Error('#NULL!');
    exports.div0 = new Error('#DIV/0!');
    exports.value = new Error('#VALUE!');
    exports.ref = new Error('#REF!');
    exports.name = new Error('#NAME?');
    exports.num = new Error('#NUM!');
    exports.na = new Error('#N/A');
    exports.error = new Error('#ERROR!');
    exports.data = new Error('#GETTING_DATA');

    return exports;
})();

var utils = (function() {
    var exports = {};

    exports.flattenShallow = function(array) {
        if (!array || !array.reduce) {
            return array;
        }

        return array.reduce(function(a, b) {
            var aIsArray = Array.isArray(a);
            var bIsArray = Array.isArray(b);

            if (aIsArray && bIsArray) {
                return a.concat(b);
            }
            if (aIsArray) {
                a.push(b);

                return a;
            }
            if (bIsArray) {
                return [ a ].concat(b);
            }

            return [ a, b ];
        });
    };

    exports.isFlat = function(array) {
        if (!array) {
            return false;
        }

        for (var i = 0; i < array.length; ++i) {
            if (Array.isArray(array[i])) {
                return false;
            }
        }

        return true;
    };

    exports.flatten = function() {
        var result = exports.argsToArray.apply(null, arguments);

        while (!exports.isFlat(result)) {
            result = exports.flattenShallow(result);
        }

        return result;
    };

    exports.argsToArray = function(args) {
        var result = [];

        exports.arrayEach(args, function(value) {
            result.push(value);
        });

        return result;
    };

    exports.numbers = function() {
        var possibleNumbers = this.flatten.apply(null, arguments);
        return possibleNumbers.filter(function(el) {
            return typeof el === 'number';
        });
    };

    exports.cleanFloat = function(number) {
        var power = 1e14;
        return Math.round(number * power) / power;
    };

    exports.parseBool = function(bool) {
        if (typeof bool === 'boolean') {
            return bool;
        }

        if (bool instanceof Error) {
            return bool;
        }

        if (typeof bool === 'number') {
            return bool !== 0;
        }

        if (typeof bool === 'string') {
            var up = bool.toUpperCase();
            if (up === 'TRUE') {
                return true;
            }

            if (up === 'FALSE') {
                return false;
            }
        }

        if (bool instanceof Date && !isNaN(bool)) {
            return true;
        }

        return error.value;
    };

    exports.parseNumber = function(string) {
        if (string === undefined || string === '') {
            return error.value;
        }
        if (!isNaN(string)) {
            return parseFloat(string);
        }

        return error.value;
    };

    exports.parseNumberArray = function(arr) {
        var len;

        if (!arr || (len = arr.length) === 0) {
            return error.value;
        }

        var parsed;

        while (len--) {
            parsed = exports.parseNumber(arr[len]);
            if (parsed === error.value) {
                return parsed;
            }
            arr[len] = parsed;
        }

        return arr;
    };

    exports.parseMatrix = function(matrix) {
        var n;

        if (!matrix || (n = matrix.length) === 0) {
            return error.value;
        }
        var pnarr;

        for (var i = 0; i < matrix.length; i++) {
            pnarr = exports.parseNumberArray(matrix[i]);
            matrix[i] = pnarr;

            if (pnarr instanceof Error) {
                return pnarr;
            }
        }

        return matrix;
    };

    var d1900 = new Date(Date.UTC(1900, 0, 1));
    exports.parseDate = function(date) {
        if (!isNaN(date)) {
            if (date instanceof Date) {
                return new Date(date);
            }
            var d = parseInt(date, 10);
            if (d < 0) {
                return error.num;
            }
            if (d <= 60) {
                return new Date(d1900.getTime() + (d - 1) * 86400000);
            }
            return new Date(d1900.getTime() + (d - 2) * 86400000);
        }
        if (typeof date === 'string') {
            date = new Date(date);
            if (!isNaN(date)) {
                return date;
            }
        }
        return error.value;
    };

    exports.parseDateArray = function(arr) {
        var len = arr.length;
        var parsed;
        while (len--) {
            parsed = this.parseDate(arr[len]);
            if (parsed === error.value) {
                return parsed;
            }
            arr[len] = parsed;
        }
        return arr;
    };

    exports.anyIsError = function() {
        var n = arguments.length;
        while (n--) {
            if (arguments[n] instanceof Error) {
                return true;
            }
        }
        return false;
    };

    exports.arrayValuesToNumbers = function(arr) {
        var n = arr.length;
        var el;
        while (n--) {
            el = arr[n];
            if (typeof el === 'number') {
                continue;
            }
            if (el === true) {
                arr[n] = 1;
                continue;
            }
            if (el === false) {
                arr[n] = 0;
                continue;
            }
            if (typeof el === 'string') {
                var number = this.parseNumber(el);
                if (number instanceof Error) {
                    arr[n] = 0;
                } else {
                    arr[n] = number;
                }
            }
        }
        return arr;
    };

    exports.rest = function(array, idx) {
        idx = idx || 1;
        if (!array || typeof array.slice !== 'function') {
            return array;
        }
        return array.slice(idx);
    };

    exports.initial = function(array, idx) {
        idx = idx || 1;
        if (!array || typeof array.slice !== 'function') {
            return array;
        }
        return array.slice(0, array.length - idx);
    };

    exports.arrayEach = function(array, iteratee) {
        var index = -1, length = array.length;

        while (++index < length) {
            if (iteratee(array[index], index, array) === false) {
                break;
            }
        }

        return array;
    };

    exports.transpose = function(matrix) {
        if (!matrix) {
            return error.value;
        }

        return matrix[0].map(function(col, i) {
            return matrix.map(function(row) {
                return row[i];
            });
        });
    };

    return exports;
})();

jexcel.methods = {};

jexcel.methods.datetime = (function() {
    var exports = {};

    var d1900 = new Date(1900, 0, 1);
    var WEEK_STARTS = [
        undefined,
        0,
        1,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        1,
        2,
        3,
        4,
        5,
        6,
        0
    ];
    var WEEK_TYPES = [
        [],
        [1, 2, 3, 4, 5, 6, 7],
        [7, 1, 2, 3, 4, 5, 6],
        [6, 0, 1, 2, 3, 4, 5],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [7, 1, 2, 3, 4, 5, 6],
        [6, 7, 1, 2, 3, 4, 5],
        [5, 6, 7, 1, 2, 3, 4],
        [4, 5, 6, 7, 1, 2, 3],
        [3, 4, 5, 6, 7, 1, 2],
        [2, 3, 4, 5, 6, 7, 1],
        [1, 2, 3, 4, 5, 6, 7]
    ];
    var WEEKEND_TYPES = [
        [],
        [6, 0],
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4],
        [4, 5],
        [5, 6],
        undefined,
        undefined,
        undefined, [0, 0],
        [1, 1],
        [2, 2],
        [3, 3],
        [4, 4],
        [5, 5],
        [6, 6]
    ];

    exports.DATE = function(year, month, day) {
        year = utils.parseNumber(year);
        month = utils.parseNumber(month);
        day = utils.parseNumber(day);
        if (utils.anyIsError(year, month, day)) {
            return error.value;
        }
        if (year < 0 || month < 0 || day < 0) {
            return error.num;
        }
        var date = new Date(year, month - 1, day);
        return date;
    };

    exports.DATEVALUE = function(date_text) {
        if (typeof date_text !== 'string') {
            return error.value;
        }
        var date = Date.parse(date_text);
        if (isNaN(date)) {
            return error.value;
        }
        if (date <= -2203891200000) {
            return (date - d1900) / 86400000 + 1;
        }
        return (date - d1900) / 86400000 + 2;
    };

    exports.DAY = function(serial_number) {
        var date = utils.parseDate(serial_number);
        if (date instanceof Error) {
            return date;
        }
        return date.getDate();
    };

    exports.DAYS = function(end_date, start_date) {
        end_date = utils.parseDate(end_date);
        start_date = utils.parseDate(start_date);
        if (end_date instanceof Error) {
            return end_date;
        }
        if (start_date instanceof Error) {
            return start_date;
        }
        return serial(end_date) - serial(start_date);
    };

    exports.DAYS360 = function(start_date, end_date, method) {
    };

    exports.EDATE = function(start_date, months) {
        start_date = utils.parseDate(start_date);
        if (start_date instanceof Error) {
            return start_date;
        }
        if (isNaN(months)) {
            return error.value;
        }
        months = parseInt(months, 10);
        start_date.setMonth(start_date.getMonth() + months);
        return serial(start_date);
    };

    exports.EOMONTH = function(start_date, months) {
        start_date = utils.parseDate(start_date);
        if (start_date instanceof Error) {
            return start_date;
        }
        if (isNaN(months)) {
            return error.value;
        }
        months = parseInt(months, 10);
        return serial(new Date(start_date.getFullYear(), start_date.getMonth() + months + 1, 0));
    };

    exports.HOUR = function(serial_number) {
        serial_number = utils.parseDate(serial_number);
        if (serial_number instanceof Error) {
            return serial_number;
        }
        return serial_number.getHours();
    };

    exports.INTERVAL = function(second) {
        if (typeof second !== 'number' && typeof second !== 'string') {
            return error.value;
        } else {
            second = parseInt(second, 10);
        }

        var year  = Math.floor(second/946080000);
        second    = second%946080000;
        var month = Math.floor(second/2592000);
        second    = second%2592000;
        var day   = Math.floor(second/86400);
        second    = second%86400;

        var hour  = Math.floor(second/3600);
        second    = second%3600;
        var min   = Math.floor(second/60);
        second    = second%60;
        var sec   = second;

        year  = (year  > 0) ? year  + 'Y' : '';
        month = (month > 0) ? month + 'M' : '';
        day   = (day   > 0) ? day   + 'D' : '';
        hour  = (hour  > 0) ? hour  + 'H' : '';
        min   = (min   > 0) ? min   + 'M' : '';
        sec   = (sec   > 0) ? sec   + 'S' : '';

        return 'P' + year + month + day + 'T' + hour + min + sec;
    };

    exports.ISOWEEKNUM = function(date) {
        date = utils.parseDate(date);
        if (date instanceof Error) {
            return date;
        }

        date.setHours(0, 0, 0);
        date.setDate(date.getDate() + 4 - (date.getDay() || 7));
        var yearStart = new Date(date.getFullYear(), 0, 1);
        return Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
    };

    exports.MINUTE = function(serial_number) {
        serial_number = utils.parseDate(serial_number);
        if (serial_number instanceof Error) {
            return serial_number;
        }
        return serial_number.getMinutes();
    };

    exports.MONTH = function(serial_number) {
        serial_number = utils.parseDate(serial_number);
        if (serial_number instanceof Error) {
            return serial_number;
        }
        return serial_number.getMonth() + 1;
    };

    exports.NETWORKDAYS = function(start_date, end_date, holidays) {
    };

    exports.NETWORKDAYS.INTL = function(start_date, end_date, weekend, holidays) {
    };

    exports.NOW = function() {
        return new Date();
    };

    exports.SECOND = function(serial_number) {
        serial_number = utils.parseDate(serial_number);
        if (serial_number instanceof Error) {
            return serial_number;
        }
        return serial_number.getSeconds();
    };

    exports.TIME = function(hour, minute, second) {
        hour = utils.parseNumber(hour);
        minute = utils.parseNumber(minute);
        second = utils.parseNumber(second);
        if (utils.anyIsError(hour, minute, second)) {
            return error.value;
        }
        if (hour < 0 || minute < 0 || second < 0) {
            return error.num;
        }
        return (3600 * hour + 60 * minute + second) / 86400;
    };

    exports.TIMEVALUE = function(time_text) {
        time_text = utils.parseDate(time_text);
        if (time_text instanceof Error) {
            return time_text;
        }
        return (3600 * time_text.getHours() + 60 * time_text.getMinutes() + time_text.getSeconds()) / 86400;
    };

    exports.TODAY = function() {
        return new Date();
    };

    exports.WEEKDAY = function(serial_number, return_type) {
        serial_number = utils.parseDate(serial_number);
        if (serial_number instanceof Error) {
            return serial_number;
        }
        if (return_type === undefined) {
            return_type = 1;
        }
        var day = serial_number.getDay();
        return WEEK_TYPES[return_type][day];
    };

    exports.WEEKNUM = function(serial_number, return_type) {
    };

    exports.WORKDAY = function(start_date, days, holidays) {
    };

    exports.WORKDAY.INTL = function(start_date, days, weekend, holidays) {
    };

    exports.YEAR = function(serial_number) {
        serial_number = utils.parseDate(serial_number);
        if (serial_number instanceof Error) {
            return serial_number;
        }
        return serial_number.getFullYear();
    };

    function isLeapYear(year) {
        return new Date(year, 1, 29).getMonth() === 1;
    }

    exports.YEARFRAC = function(start_date, end_date, basis) {
    };

    function serial(date) {
        var addOn = (date > -2203891200000)?2:1;
        return (date - d1900) / 86400000 + addOn;
    }

    return exports;
})();

jexcel.methods.database = (function() {
    var exports = {};

    function compact(array) {
        if (!array) {
            return array;
        }
        var result = [];
        for (var i = 0; i < array.length; ++i) {
            if (!array[i]) {
                continue;
            }
            result.push(array[i]);
        }
        return result;
    }

    exports.FINDFIELD = function(database, title) {
        var index = null;
        for (var i = 0; i < database.length; i++) {
            if (database[i][0] === title) {
                index = i;
                break;
            }
        }

        // Return error if the input field title is incorrect
        if (index == null) {
            return error.value;
        }
        return index;
    };

    function findResultIndex(database, criterias) {
        var matches = {};
        for (var i = 1; i < database[0].length; ++i) {
            matches[i] = true;
        }
        var maxCriteriaLength = criterias[0].length;
        for (i = 1; i < criterias.length; ++i) {
            if (criterias[i].length > maxCriteriaLength) {
                maxCriteriaLength = criterias[i].length;
            }
        }

        for (var k = 1; k < database.length; ++k) {
            for (var l = 1; l < database[k].length; ++l) {
                var currentCriteriaResult = false;
                var hasMatchingCriteria = false;
                for (var j = 0; j < criterias.length; ++j) {
                    var criteria = criterias[j];
                    if (criteria.length < maxCriteriaLength) {
                        continue;
                    }

                    var criteriaField = criteria[0];
                    if (database[k][0] !== criteriaField) {
                        continue;
                    }
                    hasMatchingCriteria = true;
                    for (var p = 1; p < criteria.length; ++p) {
                        currentCriteriaResult = currentCriteriaResult
                                || eval(database[k][l] + criteria[p]); // jshint
                                                                        // ignore:line
                    }
                }
                if (hasMatchingCriteria) {
                    matches[l] = matches[l] && currentCriteriaResult;
                }
            }
        }

        var result = [];
        for (var n = 0; n < database[0].length; ++n) {
            if (matches[n]) {
                result.push(n - 1);
            }
        }
        return result;
    }

    // Database functions
    exports.DAVERAGE = function(database, field, criteria) {
        // Return error if field is not a number and not a string
        if (isNaN(field) && (typeof field !== "string")) {
            return error.value;
        }
        var resultIndexes = findResultIndex(database, criteria);
        var targetFields = [];
        if (typeof field === "string") {
            var index = exports.FINDFIELD(database, field);
            targetFields = utils.rest(database[index]);
        } else {
            targetFields = utils.rest(database[field]);
        }
        var sum = 0;
        for (var i = 0; i < resultIndexes.length; i++) {
            sum += targetFields[resultIndexes[i]];
        }
        return resultIndexes.length === 0 ? error.div0 : sum / resultIndexes.length;
    };

    exports.DCOUNT = function(database, field, criteria) {
    };

    exports.DCOUNTA = function(database, field, criteria) {
    };

    exports.DGET = function(database, field, criteria) {
        // Return error if field is not a number and not a string
        if (isNaN(field) && (typeof field !== "string")) {
            return error.value;
        }
        var resultIndexes = findResultIndex(database, criteria);
        var targetFields = [];
        if (typeof field === "string") {
            var index = exports.FINDFIELD(database, field);
            targetFields = utils.rest(database[index]);
        } else {
            targetFields = utils.rest(database[field]);
        }
        // Return error if no record meets the criteria
        if (resultIndexes.length === 0) {
            return error.value;
        }
        // Returns the #NUM! error value because more than one record meets the
        // criteria
        if (resultIndexes.length > 1) {
            return error.num;
        }

        return targetFields[resultIndexes[0]];
    };

    exports.DMAX = function(database, field, criteria) {
        // Return error if field is not a number and not a string
        if (isNaN(field) && (typeof field !== "string")) {
            return error.value;
        }
        var resultIndexes = findResultIndex(database, criteria);
        var targetFields = [];
        if (typeof field === "string") {
            var index = exports.FINDFIELD(database, field);
            targetFields = utils.rest(database[index]);
        } else {
            targetFields = utils.rest(database[field]);
        }
        var maxValue = targetFields[resultIndexes[0]];
        for (var i = 1; i < resultIndexes.length; i++) {
            if (maxValue < targetFields[resultIndexes[i]]) {
                maxValue = targetFields[resultIndexes[i]];
            }
        }
        return maxValue;
    };

    exports.DMIN = function(database, field, criteria) {
        // Return error if field is not a number and not a string
        if (isNaN(field) && (typeof field !== "string")) {
            return error.value;
        }
        var resultIndexes = findResultIndex(database, criteria);
        var targetFields = [];
        if (typeof field === "string") {
            var index = exports.FINDFIELD(database, field);
            targetFields = utils.rest(database[index]);
        } else {
            targetFields = utils.rest(database[field]);
        }
        var minValue = targetFields[resultIndexes[0]];
        for (var i = 1; i < resultIndexes.length; i++) {
            if (minValue > targetFields[resultIndexes[i]]) {
                minValue = targetFields[resultIndexes[i]];
            }
        }
        return minValue;
    };

    exports.DPRODUCT = function(database, field, criteria) {
        // Return error if field is not a number and not a string
        if (isNaN(field) && (typeof field !== "string")) {
            return error.value;
        }
        var resultIndexes = findResultIndex(database, criteria);
        var targetFields = [];
        if (typeof field === "string") {
            var index = exports.FINDFIELD(database, field);
            targetFields = utils.rest(database[index]);
        } else {
            targetFields = utils.rest(database[field]);
        }
        var targetValues = [];
        for (var i = 0; i < resultIndexes.length; i++) {
            targetValues[i] = targetFields[resultIndexes[i]];
        }
        targetValues = compact(targetValues);
        var result = 1;
        for (i = 0; i < targetValues.length; i++) {
            result *= targetValues[i];
        }
        return result;
    };

    exports.DSTDEV = function(database, field, criteria) {
    };

    exports.DSTDEVP = function(database, field, criteria) {
    };

    exports.DSUM = function(database, field, criteria) {
    };

    exports.DVAR = function(database, field, criteria) {
    };

    exports.DVARP = function(database, field, criteria) {
    };

    exports.MATCH = function(lookupValue, lookupArray, matchType) {
        if (!lookupValue && !lookupArray) {
            return error.na;
        }
        if (arguments.length === 2) {
            matchType = 1;
        }
        if (!(lookupArray instanceof Array)) {
            return error.na;
        }
        if (matchType !== -1 && matchType !== 0 && matchType !== 1) {
            return error.na;
        }

        var index;
        var indexValue;

        for (var idx = 0; idx < lookupArray.length; idx++) {
            if (matchType === 1) {
                if (lookupArray[idx] === lookupValue) {
                    return idx + 1;
                } else if (lookupArray[idx] < lookupValue) {
                    if (!indexValue) {
                        index = idx + 1;
                        indexValue = lookupArray[idx];
                    } else if (lookupArray[idx] > indexValue) {
                        index = idx + 1;
                        indexValue = lookupArray[idx];
                    }
                }
            } else if (matchType === 0) {
                if (typeof lookupValue === 'string') {
                    lookupValue = lookupValue.replace(/\?/g, '.');
                    if (lookupArray[idx].toLowerCase().match(lookupValue.toLowerCase())) {
                        return idx + 1;
                    }
                } else {
                    if (lookupArray[idx] === lookupValue) {
                        return idx + 1;
                    }
                }
            } else if (matchType === -1) {
                if (lookupArray[idx] === lookupValue) {
                    return idx + 1;
                } else if (lookupArray[idx] > lookupValue) {
                    if (!indexValue) {
                        index = idx + 1;
                        indexValue = lookupArray[idx];
                    } else if (lookupArray[idx] < indexValue) {
                        index = idx + 1;
                        indexValue = lookupArray[idx];
                    }
                }
            }
        }

        return index ? index : error.na;
    };

    return exports;
})();

jexcel.methods.engineering = (function() {
    var exports = {};

    function isValidBinaryNumber(number) {
        return (/^[01]{1,10}$/).test(number);
    }

    exports.BESSELI = function(x, n) {
    };

    exports.BESSELJ = function(x, n) {
    };

    exports.BESSELK = function(x, n) {
    };

    exports.BESSELY = function(x, n) {
    };

    exports.BIN2DEC = function(number) {
        // Return error if number is not binary or contains more than 10
        // characters (10 digits)
        if (!isValidBinaryNumber(number)) {
            return error.num;
        }

        // Convert binary number to decimal
        var result = parseInt(number, 2);

        // Handle negative numbers
        var stringified = number.toString();
        if (stringified.length === 10 && stringified.substring(0, 1) === '1') {
            return parseInt(stringified.substring(1), 2) - 512;
        } else {
            return result;
        }
    };

    exports.BIN2HEX = function(number, places) {
        // Return error if number is not binary or contains more than 10
        // characters (10 digits)
        if (!isValidBinaryNumber(number)) {
            return error.num;
        }

        // Ignore places and return a 10-character hexadecimal number if number
        // is negative
        var stringified = number.toString();
        if (stringified.length === 10 && stringified.substring(0, 1) === '1') {
            return (1099511627264 + parseInt(stringified.substring(1), 2)).toString(16);
        }

        // Convert binary number to hexadecimal
        var result = parseInt(number, 2).toString(16);

        // Return hexadecimal number using the minimum number of characters
        // necessary if places is undefined
        if (places === undefined) {
            return result;
        } else {
            // Return error if places is nonnumeric
            if (isNaN(places)) {
              return error.value;
            }

            // Return error if places is negative
            if (places < 0) {
              return error.num;
            }

            // Truncate places in case it is not an integer
            places = Math.floor(places);

            // Pad return value with leading 0s (zeros) if necessary (using
            // Underscore.string)
            return (places >= result.length) ? REPT('0', places - result.length) + result : error.num;
        }
    };

    exports.BIN2OCT = function(number, places) {
        // Return error if number is not binary or contains more than 10
        // characters (10 digits)
        if (!isValidBinaryNumber(number)) {
            return error.num;
        }

        // Ignore places and return a 10-character octal number if number is
        // negative
        var stringified = number.toString();
        if (stringified.length === 10 && stringified.substring(0, 1) === '1') {
            return (1073741312 + parseInt(stringified.substring(1), 2)).toString(8);
        }

        // Convert binary number to octal
        var result = parseInt(number, 2).toString(8);

        // Return octal number using the minimum number of characters necessary
        // if places is undefined
        if (places === undefined) {
            return result;
        } else {
            // Return error if places is nonnumeric
            if (isNaN(places)) {
              return error.value;
            }

            // Return error if places is negative
            if (places < 0) {
              return error.num;
            }

            // Truncate places in case it is not an integer
            places = Math.floor(places);

            // Pad return value with leading 0s (zeros) if necessary (using
            // Underscore.string)
            return (places >= result.length) ? REPT('0', places - result.length) + result : error.num;
        }
    };

    exports.BITAND = function(number1, number2) {
        // Return error if either number is a non-numeric value
        number1 = utils.parseNumber(number1);
        number2 = utils.parseNumber(number2);
        if (utils.anyIsError(number1, number2)) {
            return error.value;
        }

        // Return error if either number is less than 0
        if (number1 < 0 || number2 < 0) {
            return error.num;
        }

        // Return error if either number is a non-integer
        if (Math.floor(number1) !== number1 || Math.floor(number2) !== number2) {
            return error.num;
        }

        // Return error if either number is greater than (2^48)-1
        if (number1 > 281474976710655 || number2 > 281474976710655) {
            return error.num;
        }

        // Return bitwise AND of two numbers
        return number1 & number2;
    };

    exports.BITLSHIFT = function(number, shift) {
        number = utils.parseNumber(number);
        shift = utils.parseNumber(shift);
        if (utils.anyIsError(number, shift)) {
            return error.value;
        }

        // Return error if number is less than 0
        if (number < 0) {
            return error.num;
        }

        // Return error if number is a non-integer
        if (Math.floor(number) !== number) {
            return error.num;
        }

        // Return error if number is greater than (2^48)-1
        if (number > 281474976710655) {
            return error.num;
        }

        // Return error if the absolute value of shift is greater than 53
        if (Math.abs(shift) > 53) {
            return error.num;
        }

        // Return number shifted by shift bits to the left or to the right if
        // shift is negative
        return (shift >= 0) ? number << shift : number >> -shift;
    };

    exports.BITOR = function(number1, number2) {
        number1 = utils.parseNumber(number1);
        number2 = utils.parseNumber(number2);
        if (utils.anyIsError(number1, number2)) {
            return error.value;
        }

        // Return error if either number is less than 0
        if (number1 < 0 || number2 < 0) {
            return error.num;
        }

        // Return error if either number is a non-integer
        if (Math.floor(number1) !== number1 || Math.floor(number2) !== number2) {
            return error.num;
        }

        // Return error if either number is greater than (2^48)-1
        if (number1 > 281474976710655 || number2 > 281474976710655) {
            return error.num;
        }

        // Return bitwise OR of two numbers
        return number1 | number2;
    };

    exports.BITRSHIFT = function(number, shift) {
        number = utils.parseNumber(number);
        shift = utils.parseNumber(shift);
        if (utils.anyIsError(number, shift)) {
            return error.value;
        }

        // Return error if number is less than 0
        if (number < 0) {
            return error.num;
        }

        // Return error if number is a non-integer
        if (Math.floor(number) !== number) {
            return error.num;
        }

        // Return error if number is greater than (2^48)-1
        if (number > 281474976710655) {
            return error.num;
        }

        // Return error if the absolute value of shift is greater than 53
        if (Math.abs(shift) > 53) {
            return error.num;
        }

        // Return number shifted by shift bits to the right or to the left if
        // shift is negative
        return (shift >= 0) ? number >> shift : number << -shift;
    };

    exports.BITXOR = function(number1, number2) {
        number1 = utils.parseNumber(number1);
        number2 = utils.parseNumber(number2);
        if (utils.anyIsError(number1, number2)) {
            return error.value;
        }

        // Return error if either number is less than 0
        if (number1 < 0 || number2 < 0) {
            return error.num;
        }

        // Return error if either number is a non-integer
        if (Math.floor(number1) !== number1 || Math.floor(number2) !== number2) {
            return error.num;
        }

        // Return error if either number is greater than (2^48)-1
        if (number1 > 281474976710655 || number2 > 281474976710655) {
            return error.num;
        }

        // Return bitwise XOR of two numbers
        return number1 ^ number2;
    };

    exports.COMPLEX = function(real, imaginary, suffix) {
        real = utils.parseNumber(real);
        imaginary = utils.parseNumber(imaginary);
        if (utils.anyIsError(real, imaginary)) {
            return real;
        }

        // Set suffix
        suffix = (suffix === undefined) ? 'i' : suffix;

        // Return error if suffix is neither "i" nor "j"
        if (suffix !== 'i' && suffix !== 'j') {
            return error.value;
        }

        // Return complex number
        if (real === 0 && imaginary === 0) {
            return 0;
        } else if (real === 0) {
            return (imaginary === 1) ? suffix : imaginary.toString() + suffix;
        } else if (imaginary === 0) {
            return real.toString();
        } else {
            var sign = (imaginary > 0) ? '+' : '';
            return real.toString() + sign + ((imaginary === 1) ? suffix : imaginary.toString() + suffix);
        }
    };

    exports.CONVERT = function(number, from_unit, to_unit) {
        number = utils.parseNumber(number);
        if (number instanceof Error) {
            return number;
        }

        // List of units supported by CONVERT and units defined by the
        // International System of Units
        // [Name, Symbol, Alternate symbols, Quantity, ISU, CONVERT, Conversion
        // ratio]
        var units = [
            ["a.u. of action", "?", null, "action", false, false, 1.05457168181818e-34],
            ["a.u. of charge", "e", null, "electric_charge", false, false, 1.60217653141414e-19],
            ["a.u. of energy", "Eh", null, "energy", false, false, 4.35974417757576e-18],
            ["a.u. of length", "a?", null, "length", false, false, 5.29177210818182e-11],
            ["a.u. of mass", "m?", null, "mass", false, false, 9.10938261616162e-31],
            ["a.u. of time", "?/Eh", null, "time", false, false, 2.41888432650516e-17],
            ["admiralty knot", "admkn", null, "speed", false, true, 0.514773333],
            ["ampere", "A", null, "electric_current", true, false, 1],
            ["ampere per meter", "A/m", null, "magnetic_field_intensity", true, false, 1],
            ["ångström", "Å", ["ang"], "length", false, true, 1e-10],
            ["are", "ar", null, "area", false, true, 100],
            ["astronomical unit", "ua", null, "length", false, false, 1.49597870691667e-11],
            ["bar", "bar", null, "pressure", false, false, 100000],
            ["barn", "b", null, "area", false, false, 1e-28],
            ["becquerel", "Bq", null, "radioactivity", true, false, 1],
            ["bit", "bit", ["b"], "information", false, true, 1],
            ["btu", "BTU", ["btu"], "energy", false, true, 1055.05585262],
            ["byte", "byte", null, "information", false, true, 8],
            ["candela", "cd", null, "luminous_intensity", true, false, 1],
            ["candela per square metre", "cd/m?", null, "luminance", true, false, 1],
            ["coulomb", "C", null, "electric_charge", true, false, 1],
            ["cubic ångström", "ang3", ["ang^3"], "volume", false, true, 1e-30],
            ["cubic foot", "ft3", ["ft^3"], "volume", false, true, 0.028316846592],
            ["cubic inch", "in3", ["in^3"], "volume", false, true, 0.000016387064],
            ["cubic light-year", "ly3", ["ly^3"], "volume", false, true, 8.46786664623715e-47],
            ["cubic metre", "m?", null, "volume", true, true, 1],
            ["cubic mile", "mi3", ["mi^3"], "volume", false, true, 4168181825.44058],
            ["cubic nautical mile", "Nmi3", ["Nmi^3"], "volume", false, true, 6352182208],
            ["cubic Pica", "Pica3", ["Picapt3", "Pica^3", "Picapt^3"], "volume", false, true, 7.58660370370369e-8],
            ["cubic yard", "yd3", ["yd^3"], "volume", false, true, 0.764554857984],
            ["cup", "cup", null, "volume", false, true, 0.0002365882365],
            ["dalton", "Da", ["u"], "mass", false, false, 1.66053886282828e-27],
            ["day", "d", ["day"], "time", false, true, 86400],
            ["degree", "°", null, "angle", false, false, 0.0174532925199433],
            ["degrees Rankine", "Rank", null, "temperature", false, true, 0.555555555555556],
            ["dyne", "dyn", ["dy"], "force", false, true, 0.00001],
            ["electronvolt", "eV", ["ev"], "energy", false, true, 1.60217656514141],
            ["ell", "ell", null, "length", false, true, 1.143],
            ["erg", "erg", ["e"], "energy", false, true, 1e-7],
            ["farad", "F", null, "electric_capacitance", true, false, 1],
            ["fluid ounce", "oz", null, "volume", false, true, 0.0000295735295625],
            ["foot", "ft", null, "length", false, true, 0.3048],
            ["foot-pound", "flb", null, "energy", false, true, 1.3558179483314],
            ["gal", "Gal", null, "acceleration", false, false, 0.01],
            ["gallon", "gal", null, "volume", false, true, 0.003785411784],
            ["gauss", "G", ["ga"], "magnetic_flux_density", false, true, 1],
            ["grain", "grain", null, "mass", false, true, 0.0000647989],
            ["gram", "g", null, "mass", false, true, 0.001],
            ["gray", "Gy", null, "absorbed_dose", true, false, 1],
            ["gross registered ton", "GRT", ["regton"], "volume", false, true, 2.8316846592],
            ["hectare", "ha", null, "area", false, true, 10000],
            ["henry", "H", null, "inductance", true, false, 1],
            ["hertz", "Hz", null, "frequency", true, false, 1],
            ["horsepower", "HP", ["h"], "power", false, true, 745.69987158227],
            ["horsepower-hour", "HPh", ["hh", "hph"], "energy", false, true, 2684519.538],
            ["hour", "h", ["hr"], "time", false, true, 3600],
            ["imperial gallon (U.K.)", "uk_gal", null, "volume", false, true, 0.00454609],
            ["imperial hundredweight", "lcwt", ["uk_cwt", "hweight"], "mass", false, true, 50.802345],
            ["imperial quart (U.K)", "uk_qt", null, "volume", false, true, 0.0011365225],
            ["imperial ton", "brton", ["uk_ton", "LTON"], "mass", false, true, 1016.046909],
            ["inch", "in", null, "length", false, true, 0.0254],
            ["international acre", "uk_acre", null, "area", false, true, 4046.8564224],
            ["IT calorie", "cal", null, "energy", false, true, 4.1868],
            ["joule", "J", null, "energy", true, true, 1],
            ["katal", "kat", null, "catalytic_activity", true, false, 1],
            ["kelvin", "K", ["kel"], "temperature", true, true, 1],
            ["kilogram", "kg", null, "mass", true, true, 1],
            ["knot", "kn", null, "speed", false, true, 0.514444444444444],
            ["light-year", "ly", null, "length", false, true, 9460730472580800],
            ["litre", "L", ["l", "lt"], "volume", false, true, 0.001],
            ["lumen", "lm", null, "luminous_flux", true, false, 1],
            ["lux", "lx", null, "illuminance", true, false, 1],
            ["maxwell", "Mx", null, "magnetic_flux", false, false, 1e-18],
            ["measurement ton", "MTON", null, "volume", false, true, 1.13267386368],
            ["meter per hour", "m/h", ["m/hr"], "speed", false, true, 0.00027777777777778],
            ["meter per second", "m/s", ["m/sec"], "speed", true, true, 1],
            ["meter per second squared", "m?s??", null, "acceleration", true, false, 1],
            ["parsec", "pc", ["parsec"], "length", false, true, 30856775814671900],
            ["meter squared per second", "m?/s", null, "kinematic_viscosity", true, false, 1],
            ["metre", "m", null, "length", true, true, 1],
            ["miles per hour", "mph", null, "speed", false, true, 0.44704],
            ["millimetre of mercury", "mmHg", null, "pressure", false, false, 133.322],
            ["minute", "?", null, "angle", false, false, 0.000290888208665722],
            ["minute", "min", ["mn"], "time", false, true, 60],
            ["modern teaspoon", "tspm", null, "volume", false, true, 0.000005],
            ["mole", "mol", null, "amount_of_substance", true, false, 1],
            ["morgen", "Morgen", null, "area", false, true, 2500],
            ["n.u. of action", "?", null, "action", false, false, 1.05457168181818e-34],
            ["n.u. of mass", "m?", null, "mass", false, false, 9.10938261616162e-31],
            ["n.u. of speed", "c?", null, "speed", false, false, 299792458],
            ["n.u. of time", "?/(me?c??)", null, "time", false, false, 1.28808866778687e-21],
            ["nautical mile", "M", ["Nmi"], "length", false, true, 1852],
            ["newton", "N", null, "force", true, true, 1],
            ["œrsted", "Oe ", null, "magnetic_field_intensity", false, false, 79.5774715459477],
            ["ohm", "Ω", null, "electric_resistance", true, false, 1],
            ["ounce mass", "ozm", null, "mass", false, true, 0.028349523125],
            ["pascal", "Pa", null, "pressure", true, false, 1],
            ["pascal second", "Pa?s", null, "dynamic_viscosity", true, false, 1],
            ["pferdestärke", "PS", null, "power", false, true, 735.49875],
            ["phot", "ph", null, "illuminance", false, false, 0.0001],
            ["pica (1/6 inch)", "pica", null, "length", false, true, 0.00035277777777778],
            ["pica (1/72 inch)", "Pica", ["Picapt"], "length", false, true, 0.00423333333333333],
            ["poise", "P", null, "dynamic_viscosity", false, false, 0.1],
            ["pond", "pond", null, "force", false, true, 0.00980665],
            ["pound force", "lbf", null, "force", false, true, 4.4482216152605],
            ["pound mass", "lbm", null, "mass", false, true, 0.45359237],
            ["quart", "qt", null, "volume", false, true, 0.000946352946],
            ["radian", "rad", null, "angle", true, false, 1],
            ["second", "?", null, "angle", false, false, 0.00000484813681109536],
            ["second", "s", ["sec"], "time", true, true, 1],
            ["short hundredweight", "cwt", ["shweight"], "mass", false, true, 45.359237],
            ["siemens", "S", null, "electrical_conductance", true, false, 1],
            ["sievert", "Sv", null, "equivalent_dose", true, false, 1],
            ["slug", "sg", null, "mass", false, true, 14.59390294],
            ["square ångström", "ang2", ["ang^2"], "area", false, true, 1e-20],
            ["square foot", "ft2", ["ft^2"], "area", false, true, 0.09290304],
            ["square inch", "in2", ["in^2"], "area", false, true, 0.00064516],
            ["square light-year", "ly2", ["ly^2"], "area", false, true, 8.95054210748189e+31],
            ["square meter", "m?", null, "area", true, true, 1],
            ["square mile", "mi2", ["mi^2"], "area", false, true, 2589988.110336],
            ["square nautical mile", "Nmi2", ["Nmi^2"], "area", false, true, 3429904],
            ["square Pica", "Pica2", ["Picapt2", "Pica^2", "Picapt^2"], "area", false, true, 0.00001792111111111],
            ["square yard", "yd2", ["yd^2"], "area", false, true, 0.83612736],
            ["statute mile", "mi", null, "length", false, true, 1609.344],
            ["steradian", "sr", null, "solid_angle", true, false, 1],
            ["stilb", "sb", null, "luminance", false, false, 0.0001],
            ["stokes", "St", null, "kinematic_viscosity", false, false, 0.0001],
            ["stone", "stone", null, "mass", false, true, 6.35029318],
            ["tablespoon", "tbs", null, "volume", false, true, 0.0000147868],
            ["teaspoon", "tsp", null, "volume", false, true, 0.00000492892],
            ["tesla", "T", null, "magnetic_flux_density", true, true, 1],
            ["thermodynamic calorie", "c", null, "energy", false, true, 4.184],
            ["ton", "ton", null, "mass", false, true, 907.18474],
            ["tonne", "t", null, "mass", false, false, 1000],
            ["U.K. pint", "uk_pt", null, "volume", false, true, 0.00056826125],
            ["U.S. bushel", "bushel", null, "volume", false, true, 0.03523907],
            ["U.S. oil barrel", "barrel", null, "volume", false, true, 0.158987295],
            ["U.S. pint", "pt", ["us_pt"], "volume", false, true, 0.000473176473],
            ["U.S. survey mile", "survey_mi", null, "length", false, true, 1609.347219],
            ["U.S. survey/statute acre", "us_acre", null, "area", false, true, 4046.87261],
            ["volt", "V", null, "voltage", true, false, 1],
            ["watt", "W", null, "power", true, true, 1],
            ["watt-hour", "Wh", ["wh"], "energy", false, true, 3600],
            ["weber", "Wb", null, "magnetic_flux", true, false, 1],
            ["yard", "yd", null, "length", false, true, 0.9144],
            ["year", "yr", null, "time", false, true, 31557600]
        ];

        // Binary prefixes
        // [Name, Prefix power of 2 value, Previx value, Abbreviation, Derived
        // from]
        var binary_prefixes = {
            Yi: ["yobi", 80, 1208925819614629174706176, "Yi", "yotta"],
            Zi: ["zebi", 70, 1180591620717411303424, "Zi", "zetta"],
            Ei: ["exbi", 60, 1152921504606846976, "Ei", "exa"],
            Pi: ["pebi", 50, 1125899906842624, "Pi", "peta"],
            Ti: ["tebi", 40, 1099511627776, "Ti", "tera"],
            Gi: ["gibi", 30, 1073741824, "Gi", "giga"],
            Mi: ["mebi", 20, 1048576, "Mi", "mega"],
            ki: ["kibi", 10, 1024, "ki", "kilo"]
        };

        // Unit prefixes
        // [Name, Multiplier, Abbreviation]
        var unit_prefixes = {
            Y: ["yotta", 1e+24, "Y"],
            Z: ["zetta", 1e+21, "Z"],
            E: ["exa", 1e+18, "E"],
            P: ["peta", 1e+15, "P"],
            T: ["tera", 1e+12, "T"],
            G: ["giga", 1e+09, "G"],
            M: ["mega", 1e+06, "M"],
            k: ["kilo", 1e+03, "k"],
            h: ["hecto", 1e+02, "h"],
            e: ["dekao", 1e+01, "e"],
            d: ["deci", 1e-01, "d"],
            c: ["centi", 1e-02, "c"],
            m: ["milli", 1e-03, "m"],
            u: ["micro", 1e-06, "u"],
            n: ["nano", 1e-09, "n"],
            p: ["pico", 1e-12, "p"],
            f: ["femto", 1e-15, "f"],
            a: ["atto", 1e-18, "a"],
            z: ["zepto", 1e-21, "z"],
            y: ["yocto", 1e-24, "y"]
        };

        // Initialize units and multipliers
        var from = null;
        var to = null;
        var base_from_unit = from_unit;
        var base_to_unit = to_unit;
        var from_multiplier = 1;
        var to_multiplier = 1;
        var alt;

        // Lookup from and to units
        for (var i = 0; i < units.length; i++) {
            alt = (units[i][2] === null) ? [] : units[i][2];
            if (units[i][1] === base_from_unit || alt.indexOf(base_from_unit) >= 0) {
              from = units[i];
            }
            if (units[i][1] === base_to_unit || alt.indexOf(base_to_unit) >= 0) {
              to = units[i];
            }
        }

        // Lookup from prefix
        if (from === null) {
            var from_binary_prefix = binary_prefixes[from_unit.substring(0, 2)];
            var from_unit_prefix = unit_prefixes[from_unit.substring(0, 1)];

            // Handle dekao unit prefix (only unit prefix with two characters)
            if (from_unit.substring(0, 2) === 'da') {
              from_unit_prefix = ["dekao", 1e+01, "da"];
            }

            // Handle binary prefixes first (so that 'Yi' is processed before
            // 'Y')
            if (from_binary_prefix) {
              from_multiplier = from_binary_prefix[2];
              base_from_unit = from_unit.substring(2);
            } else if (from_unit_prefix) {
              from_multiplier = from_unit_prefix[1];
              base_from_unit = from_unit.substring(from_unit_prefix[2].length);
            }

            // Lookup from unit
            for (var j = 0; j < units.length; j++) {
              alt = (units[j][2] === null) ? [] : units[j][2];
              if (units[j][1] === base_from_unit || alt.indexOf(base_from_unit) >= 0) {
                  from = units[j];
              }
            }
        }

        // Lookup to prefix
        if (to === null) {
            var to_binary_prefix = binary_prefixes[to_unit.substring(0, 2)];
            var to_unit_prefix = unit_prefixes[to_unit.substring(0, 1)];

            // Handle dekao unit prefix (only unit prefix with two characters)
            if (to_unit.substring(0, 2) === 'da') {
              to_unit_prefix = ["dekao", 1e+01, "da"];
            }

            // Handle binary prefixes first (so that 'Yi' is processed before
            // 'Y')
            if (to_binary_prefix) {
              to_multiplier = to_binary_prefix[2];
              base_to_unit = to_unit.substring(2);
            } else if (to_unit_prefix) {
              to_multiplier = to_unit_prefix[1];
              base_to_unit = to_unit.substring(to_unit_prefix[2].length);
            }

            // Lookup to unit
            for (var k = 0; k < units.length; k++) {
              alt = (units[k][2] === null) ? [] : units[k][2];
              if (units[k][1] === base_to_unit || alt.indexOf(base_to_unit) >= 0) {
                  to = units[k];
              }
            }
        }

        // Return error if a unit does not exist
        if (from === null || to === null) {
            return error.na;
        }

        // Return error if units represent different quantities
        if (from[3] !== to[3]) {
            return error.na;
        }

        // Return converted number
        return number * from[6] * from_multiplier / (to[6] * to_multiplier);
    };

    exports.DEC2BIN = function(number, places) {
        number = utils.parseNumber(number);
        if (number instanceof Error) {
            return number;
        }

        // Return error if number is not decimal, is lower than -512, or is
        // greater than 511
        if (!/^-?[0-9]{1,3}$/.test(number) || number < -512 || number > 511) {
            return error.num;
        }

        // Ignore places and return a 10-character binary number if number is
        // negative
        if (number < 0) {
            return '1' + REPT('0', 9 - (512 + number).toString(2).length) + (512 + number).toString(2);
        }

        // Convert decimal number to binary
        var result = parseInt(number, 10).toString(2);

        // Return binary number using the minimum number of characters necessary
        // if places is undefined
        if (typeof places === 'undefined') {
            return result;
        } else {
            // Return error if places is nonnumeric
            if (isNaN(places)) {
              return error.value;
            }

            // Return error if places is negative
            if (places < 0) {
              return error.num;
            }

            // Truncate places in case it is not an integer
            places = Math.floor(places);

            // Pad return value with leading 0s (zeros) if necessary (using
            // Underscore.string)
            return (places >= result.length) ? REPT('0', places - result.length) + result : error.num;
        }
    };

    exports.DEC2HEX = function(number, places) {
        number = utils.parseNumber(number);
        if (number instanceof Error) {
            return number;
        }

        // Return error if number is not decimal, is lower than -549755813888,
        // or is greater than 549755813887
        if (!/^-?[0-9]{1,12}$/.test(number) || number < -549755813888 || number > 549755813887) {
            return error.num;
        }

        // Ignore places and return a 10-character hexadecimal number if number
        // is negative
        if (number < 0) {
            return (1099511627776 + number).toString(16);
        }

        // Convert decimal number to hexadecimal
        var result = parseInt(number, 10).toString(16);

        // Return hexadecimal number using the minimum number of characters
        // necessary if places is undefined
        if (typeof places === 'undefined') {
            return result;
        } else {
            // Return error if places is nonnumeric
            if (isNaN(places)) {
              return error.value;
            }

            // Return error if places is negative
            if (places < 0) {
              return error.num;
            }

            // Truncate places in case it is not an integer
            places = Math.floor(places);

            // Pad return value with leading 0s (zeros) if necessary (using
            // Underscore.string)
            return (places >= result.length) ? REPT('0', places - result.length) + result : error.num;
        }
    };

    exports.DEC2OCT = function(number, places) {
        number = utils.parseNumber(number);
        if (number instanceof Error) {
            return number;
        }

        // Return error if number is not decimal, is lower than -549755813888,
        // or is greater than 549755813887
        if (!/^-?[0-9]{1,9}$/.test(number) || number < -536870912 || number > 536870911) {
            return error.num;
        }

        // Ignore places and return a 10-character octal number if number is
        // negative
        if (number < 0) {
            return (1073741824 + number).toString(8);
        }

        // Convert decimal number to octal
        var result = parseInt(number, 10).toString(8);

        // Return octal number using the minimum number of characters necessary
        // if places is undefined
        if (typeof places === 'undefined') {
            return result;
        } else {
            // Return error if places is nonnumeric
            if (isNaN(places)) {
              return error.value;
            }

            // Return error if places is negative
            if (places < 0) {
              return error.num;
            }

            // Truncate places in case it is not an integer
            places = Math.floor(places);

            // Pad return value with leading 0s (zeros) if necessary (using
            // Underscore.string)
            return (places >= result.length) ? REPT('0', places - result.length) + result : error.num;
        }
    };

    exports.DELTA = function(number1, number2) {
        // Set number2 to zero if undefined
        number2 = (number2 === undefined) ? 0 : number2;
        number1 = utils.parseNumber(number1);
        number2 = utils.parseNumber(number2);
        if (utils.anyIsError(number1, number2)) {
            return error.value;
        }

        // Return delta
        return (number1 === number2) ? 1 : 0;
    };

    exports.ERF = function(lower_bound, upper_bound) {
    };

    exports.ERF.PRECISE = function() {
    };

    exports.ERFC = function(x) {
    };

    exports.ERFC.PRECISE = function() {
    };

    exports.GESTEP = function(number, step) {
        step = step || 0;
        number = utils.parseNumber(number);
        if (utils.anyIsError(step, number)) {
            return number;
        }

        // Return delta
        return (number >= step) ? 1 : 0;
    };

    exports.HEX2BIN = function(number, places) {
        // Return error if number is not hexadecimal or contains more than ten
        // characters (10 digits)
        if (!/^[0-9A-Fa-f]{1,10}$/.test(number)) {
            return error.num;
        }

        // Check if number is negative
        var negative = (number.length === 10 && number.substring(0, 1).toLowerCase() === 'f') ? true : false;

        // Convert hexadecimal number to decimal
        var decimal = (negative) ? parseInt(number, 16) - 1099511627776 : parseInt(number, 16);

        // Return error if number is lower than -512 or greater than 511
        if (decimal < -512 || decimal > 511) {
            return error.num;
        }

        // Ignore places and return a 10-character binary number if number is
        // negative
        if (negative) {
            return '1' + REPT('0', 9 - (512 + decimal).toString(2).length) + (512 + decimal).toString(2);
        }

        // Convert decimal number to binary
        var result = decimal.toString(2);

        // Return binary number using the minimum number of characters necessary
        // if places is undefined
        if (places === undefined) {
            return result;
        } else {
            // Return error if places is nonnumeric
            if (isNaN(places)) {
              return error.value;
            }

            // Return error if places is negative
            if (places < 0) {
              return error.num;
            }

            // Truncate places in case it is not an integer
            places = Math.floor(places);

            // Pad return value with leading 0s (zeros) if necessary (using
            // Underscore.string)
            return (places >= result.length) ? REPT('0', places - result.length) + result : error.num;
        }
    };

    exports.HEX2DEC = function(number) {
        // Return error if number is not hexadecimal or contains more than ten
        // characters (10 digits)
        if (!/^[0-9A-Fa-f]{1,10}$/.test(number)) {
            return error.num;
        }

        // Convert hexadecimal number to decimal
        var decimal = parseInt(number, 16);

        // Return decimal number
        return (decimal >= 549755813888) ? decimal - 1099511627776 : decimal;
    };

    exports.HEX2OCT = function(number, places) {
        // Return error if number is not hexadecimal or contains more than ten
        // characters (10 digits)
        if (!/^[0-9A-Fa-f]{1,10}$/.test(number)) {
            return error.num;
        }

        // Convert hexadecimal number to decimal
        var decimal = parseInt(number, 16);

        // Return error if number is positive and greater than 0x1fffffff
        // (536870911)
        if (decimal > 536870911 && decimal < 1098974756864) {
            return error.num;
        }

        // Ignore places and return a 10-character octal number if number is
        // negative
        if (decimal >= 1098974756864) {
            return (decimal - 1098437885952).toString(8);
        }

        // Convert decimal number to octal
        var result = decimal.toString(8);

        // Return octal number using the minimum number of characters necessary
        // if places is undefined
        if (places === undefined) {
            return result;
        } else {
            // Return error if places is nonnumeric
            if (isNaN(places)) {
              return error.value;
            }

            // Return error if places is negative
            if (places < 0) {
              return error.num;
            }

            // Truncate places in case it is not an integer
            places = Math.floor(places);

            // Pad return value with leading 0s (zeros) if necessary (using
            // Underscore.string)
            return (places >= result.length) ? REPT('0', places - result.length) + result : error.num;
        }
    };

    exports.IMABS = function(inumber) {
        // Lookup real and imaginary coefficients using exports.js
        // [http://formulajs.org]
        var x = exports.IMREAL(inumber);
        var y = exports.IMAGINARY(inumber);

        // Return error if either coefficient is not a number
        if (utils.anyIsError(x, y)) {
            return error.value;
        }

        // Return absolute value of complex number
        return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    };

    exports.IMAGINARY = function(inumber) {
        if (inumber === undefined || inumber === true || inumber === false) {
            return error.value;
        }

        // Return 0 if inumber is equal to 0
        if (inumber === 0 || inumber === '0') {
            return 0;
        }

        // Handle special cases
        if (['i', 'j'].indexOf(inumber) >= 0) {
            return 1;
        }

        // Normalize imaginary coefficient
        inumber = inumber.replace('+i', '+1i').replace('-i', '-1i').replace('+j', '+1j').replace('-j', '-1j');

        // Lookup sign
        var plus = inumber.indexOf('+');
        var minus = inumber.indexOf('-');
        if (plus === 0) {
            plus = inumber.indexOf('+', 1);
        }

        if (minus === 0) {
            minus = inumber.indexOf('-', 1);
        }

        // Lookup imaginary unit
        var last = inumber.substring(inumber.length - 1, inumber.length);
        var unit = (last === 'i' || last === 'j');

        if (plus >= 0 || minus >= 0) {
            // Return error if imaginary unit is neither i nor j
            if (!unit) {
              return error.num;
            }

            // Return imaginary coefficient of complex number
            if (plus >= 0) {
              return (isNaN(inumber.substring(0, plus)) || isNaN(inumber.substring(plus + 1, inumber.length - 1))) ?
                  error.num :
                  Number(inumber.substring(plus + 1, inumber.length - 1));
            } else {
              return (isNaN(inumber.substring(0, minus)) || isNaN(inumber.substring(minus + 1, inumber.length - 1))) ?
                  error.num :
                  -Number(inumber.substring(minus + 1, inumber.length - 1));
            }
        } else {
            if (unit) {
              return (isNaN(inumber.substring(0, inumber.length - 1))) ? error.num : inumber.substring(0, inumber.length - 1);
            } else {
              return (isNaN(inumber)) ? error.num : 0;
            }
        }
    };

    exports.IMARGUMENT = function(inumber) {
        // Lookup real and imaginary coefficients using exports.js
        // [http://formulajs.org]
        var x = exports.IMREAL(inumber);
        var y = exports.IMAGINARY(inumber);

        // Return error if either coefficient is not a number
        if (utils.anyIsError(x, y)) {
            return error.value;
        }

        // Return error if inumber is equal to zero
        if (x === 0 && y === 0) {
            return error.div0;
        }

        // Return PI/2 if x is equal to zero and y is positive
        if (x === 0 && y > 0) {
            return Math.PI / 2;
        }

        // Return -PI/2 if x is equal to zero and y is negative
        if (x === 0 && y < 0) {
            return -Math.PI / 2;
        }

        // Return zero if x is negative and y is equal to zero
        if (y === 0 && x > 0) {
            return 0;
        }

        // Return zero if x is negative and y is equal to zero
        if (y === 0 && x < 0) {
            return -Math.PI;
        }

        // Return argument of complex number
        if (x > 0) {
            return Math.atan(y / x);
        } else if (x < 0 && y >= 0) {
            return Math.atan(y / x) + Math.PI;
        } else {
            return Math.atan(y / x) - Math.PI;
        }
    };

    exports.IMCONJUGATE = function(inumber) {
        // Lookup real and imaginary coefficients using exports.js
        // [http://formulajs.org]
        var x = exports.IMREAL(inumber);
        var y = exports.IMAGINARY(inumber);

        if (utils.anyIsError(x, y)) {
            return error.value;
        }

        // Lookup imaginary unit
        var unit = inumber.substring(inumber.length - 1);
        unit = (unit === 'i' || unit === 'j') ? unit : 'i';

        // Return conjugate of complex number
        return (y !== 0) ? exports.COMPLEX(x, -y, unit) : inumber;
    };

    exports.IMCOS = function(inumber) {
        // Lookup real and imaginary coefficients using exports.js
        // [http://formulajs.org]
        var x = exports.IMREAL(inumber);
        var y = exports.IMAGINARY(inumber);

        if (utils.anyIsError(x, y)) {
            return error.value;
        }

        // Lookup imaginary unit
        var unit = inumber.substring(inumber.length - 1);
        unit = (unit === 'i' || unit === 'j') ? unit : 'i';

        // Return cosine of complex number
        return exports.COMPLEX(Math.cos(x) * (Math.exp(y) + Math.exp(-y)) / 2, -Math.sin(x) * (Math.exp(y) - Math.exp(-y)) / 2, unit);
    };

    exports.IMCOSH = function(inumber) {
        // Lookup real and imaginary coefficients using exports.js
        // [http://formulajs.org]
        var x = exports.IMREAL(inumber);
        var y = exports.IMAGINARY(inumber);

        if (utils.anyIsError(x, y)) {
            return error.value;
        }

        // Lookup imaginary unit
        var unit = inumber.substring(inumber.length - 1);
        unit = (unit === 'i' || unit === 'j') ? unit : 'i';

        // Return hyperbolic cosine of complex number
        return exports.COMPLEX(Math.cos(y) * (Math.exp(x) + Math.exp(-x)) / 2, Math.sin(y) * (Math.exp(x) - Math.exp(-x)) / 2, unit);
    };

    exports.IMCOT = function(inumber) {
        // Lookup real and imaginary coefficients using Formula.js
        // [http://formulajs.org]
        var x = exports.IMREAL(inumber);
        var y = exports.IMAGINARY(inumber);

        if (utils.anyIsError(x, y)) {
            return error.value;
        }

        // Return cotangent of complex number
        return exports.IMDIV(exports.IMCOS(inumber), exports.IMSIN(inumber));
    };

    exports.IMDIV = function(inumber1, inumber2) {
        // Lookup real and imaginary coefficients using Formula.js
        // [http://formulajs.org]
        var a = exports.IMREAL(inumber1);
        var b = exports.IMAGINARY(inumber1);
        var c = exports.IMREAL(inumber2);
        var d = exports.IMAGINARY(inumber2);

        if (utils.anyIsError(a, b, c, d)) {
            return error.value;
        }

        // Lookup imaginary unit
        var unit1 = inumber1.substring(inumber1.length - 1);
        var unit2 = inumber2.substring(inumber2.length - 1);
        var unit = 'i';
        if (unit1 === 'j') {
            unit = 'j';
        } else if (unit2 === 'j') {
            unit = 'j';
        }

        // Return error if inumber2 is null
        if (c === 0 && d === 0) {
            return error.num;
        }

        // Return exponential of complex number
        var den = c * c + d * d;
        return exports.COMPLEX((a * c + b * d) / den, (b * c - a * d) / den, unit);
    };

    exports.IMEXP = function(inumber) {
        // Lookup real and imaginary coefficients using Formula.js
        // [http://formulajs.org]
        var x = exports.IMREAL(inumber);
        var y = exports.IMAGINARY(inumber);

        if (utils.anyIsError(x, y)) {
            return error.value;
        }

        // Lookup imaginary unit
        var unit = inumber.substring(inumber.length - 1);
        unit = (unit === 'i' || unit === 'j') ? unit : 'i';

        // Return exponential of complex number
        var e = Math.exp(x);
        return exports.COMPLEX(e * Math.cos(y), e * Math.sin(y), unit);
    };

    exports.IMLN = function(inumber) {
        // Lookup real and imaginary coefficients using Formula.js
        // [http://formulajs.org]
        var x = exports.IMREAL(inumber);
        var y = exports.IMAGINARY(inumber);

        if (utils.anyIsError(x, y)) {
            return error.value;
        }

        // Lookup imaginary unit
        var unit = inumber.substring(inumber.length - 1);
        unit = (unit === 'i' || unit === 'j') ? unit : 'i';

        // Return exponential of complex number
        return exports.COMPLEX(Math.log(Math.sqrt(x * x + y * y)), Math.atan(y / x), unit);
    };

    exports.IMLOG10 = function(inumber) {
        // Lookup real and imaginary coefficients using Formula.js
        // [http://formulajs.org]
        var x = exports.IMREAL(inumber);
        var y = exports.IMAGINARY(inumber);

        if (utils.anyIsError(x, y)) {
            return error.value;
        }

        // Lookup imaginary unit
        var unit = inumber.substring(inumber.length - 1);
        unit = (unit === 'i' || unit === 'j') ? unit : 'i';

        // Return exponential of complex number
        return exports.COMPLEX(Math.log(Math.sqrt(x * x + y * y)) / Math.log(10), Math.atan(y / x) / Math.log(10), unit);
    };

    exports.IMLOG2 = function(inumber) {
        // Lookup real and imaginary coefficients using Formula.js
        // [http://formulajs.org]
        var x = exports.IMREAL(inumber);
        var y = exports.IMAGINARY(inumber);

        if (utils.anyIsError(x, y)) {
            return error.value;
        }

        // Lookup imaginary unit
        var unit = inumber.substring(inumber.length - 1);
        unit = (unit === 'i' || unit === 'j') ? unit : 'i';

        // Return exponential of complex number
        return exports.COMPLEX(Math.log(Math.sqrt(x * x + y * y)) / Math.log(2), Math.atan(y / x) / Math.log(2), unit);
    };

    exports.IMPOWER = function(inumber, number) {
        number = utils.parseNumber(number);
        var x = exports.IMREAL(inumber);
        var y = exports.IMAGINARY(inumber);
        if (utils.anyIsError(number, x, y)) {
            return error.value;
        }

        // Lookup imaginary unit
        var unit = inumber.substring(inumber.length - 1);
        unit = (unit === 'i' || unit === 'j') ? unit : 'i';

        // Calculate power of modulus
        var p = Math.pow(exports.IMABS(inumber), number);

        // Calculate argument
        var t = exports.IMARGUMENT(inumber);

        // Return exponential of complex number
        return exports.COMPLEX(p * Math.cos(number * t), p * Math.sin(number * t), unit);
    };

    exports.IMPRODUCT = function() {
        // Initialize result
        var result = arguments[0];

        // Loop on all numbers
        for (var i = 1; i < arguments.length; i++) {
            // Lookup coefficients of two complex numbers
            var a = exports.IMREAL(result);
            var b = exports.IMAGINARY(result);
            var c = exports.IMREAL(arguments[i]);
            var d = exports.IMAGINARY(arguments[i]);

            if (utils.anyIsError(a, b, c, d)) {
              return error.value;
            }

            // Complute product of two complex numbers
            result = exports.COMPLEX(a * c - b * d, a * d + b * c);
        }

        // Return product of complex numbers
        return result;
    };

    exports.IMREAL = function(inumber) {
        if (inumber === undefined || inumber === true || inumber === false) {
            return error.value;
        }

        // Return 0 if inumber is equal to 0
        if (inumber === 0 || inumber === '0') {
            return 0;
        }

        // Handle special cases
        if (['i', '+i', '1i', '+1i', '-i', '-1i', 'j', '+j', '1j', '+1j', '-j', '-1j'].indexOf(inumber) >= 0) {
            return 0;
        }

        // Lookup sign
        var plus = inumber.indexOf('+');
        var minus = inumber.indexOf('-');
        if (plus === 0) {
            plus = inumber.indexOf('+', 1);
        }
        if (minus === 0) {
            minus = inumber.indexOf('-', 1);
        }

        // Lookup imaginary unit
        var last = inumber.substring(inumber.length - 1, inumber.length);
        var unit = (last === 'i' || last === 'j');

        if (plus >= 0 || minus >= 0) {
            // Return error if imaginary unit is neither i nor j
            if (!unit) {
              return error.num;
            }

            // Return real coefficient of complex number
            if (plus >= 0) {
              return (isNaN(inumber.substring(0, plus)) || isNaN(inumber.substring(plus + 1, inumber.length - 1))) ?
                  error.num :
                  Number(inumber.substring(0, plus));
            } else {
              return (isNaN(inumber.substring(0, minus)) || isNaN(inumber.substring(minus + 1, inumber.length - 1))) ?
                  error.num :
                  Number(inumber.substring(0, minus));
            }
        } else {
            if (unit) {
              return (isNaN(inumber.substring(0, inumber.length - 1))) ? error.num : 0;
            } else {
              return (isNaN(inumber)) ? error.num : inumber;
            }
        }
    };

    exports.IMSEC = function(inumber) {
        // Return error if inumber is a logical value
        if (inumber === true || inumber === false) {
            return error.value;
        }

        // Lookup real and imaginary coefficients using Formula.js
        // [http://formulajs.org]
        var x = exports.IMREAL(inumber);
        var y = exports.IMAGINARY(inumber);

        if (utils.anyIsError(x, y)) {
            return error.value;
        }

        // Return secant of complex number
        return exports.IMDIV('1', exports.IMCOS(inumber));
    };

    exports.IMSECH = function(inumber) {
        // Lookup real and imaginary coefficients using Formula.js
        // [http://formulajs.org]
        var x = exports.IMREAL(inumber);
        var y = exports.IMAGINARY(inumber);

        if (utils.anyIsError(x, y)) {
            return error.value;
        }

        // Return hyperbolic secant of complex number
        return exports.IMDIV('1', exports.IMCOSH(inumber));
    };

    exports.IMSIN = function(inumber) {
        // Lookup real and imaginary coefficients using Formula.js
        // [http://formulajs.org]
        var x = exports.IMREAL(inumber);
        var y = exports.IMAGINARY(inumber);

        if (utils.anyIsError(x, y)) {
            return error.value;
        }

        // Lookup imaginary unit
        var unit = inumber.substring(inumber.length - 1);
        unit = (unit === 'i' || unit === 'j') ? unit : 'i';

        // Return sine of complex number
        return exports.COMPLEX(Math.sin(x) * (Math.exp(y) + Math.exp(-y)) / 2, Math.cos(x) * (Math.exp(y) - Math.exp(-y)) / 2, unit);
    };

    exports.IMSINH = function(inumber) {
        // Lookup real and imaginary coefficients using Formula.js
        // [http://formulajs.org]
        var x = exports.IMREAL(inumber);
        var y = exports.IMAGINARY(inumber);

        if (utils.anyIsError(x, y)) {
            return error.value;
        }

        // Lookup imaginary unit
        var unit = inumber.substring(inumber.length - 1);
        unit = (unit === 'i' || unit === 'j') ? unit : 'i';

        // Return hyperbolic sine of complex number
        return exports.COMPLEX(Math.cos(y) * (Math.exp(x) - Math.exp(-x)) / 2, Math.sin(y) * (Math.exp(x) + Math.exp(-x)) / 2, unit);
    };

    exports.IMSQRT = function(inumber) {
        // Lookup real and imaginary coefficients using Formula.js
        // [http://formulajs.org]
        var x = exports.IMREAL(inumber);
        var y = exports.IMAGINARY(inumber);

        if (utils.anyIsError(x, y)) {
            return error.value;
        }

        // Lookup imaginary unit
        var unit = inumber.substring(inumber.length - 1);
        unit = (unit === 'i' || unit === 'j') ? unit : 'i';

        // Calculate power of modulus
        var s = Math.sqrt(exports.IMABS(inumber));

        // Calculate argument
        var t = exports.IMARGUMENT(inumber);

        // Return exponential of complex number
        return exports.COMPLEX(s * Math.cos(t / 2), s * Math.sin(t / 2), unit);
    };

    exports.IMCSC = function (inumber) {
        // Return error if inumber is a logical value
        if (inumber === true || inumber === false) {
            return error.value;
        }

        // Lookup real and imaginary coefficients using Formula.js
        // [http://formulajs.org]
        var x = exports.IMREAL(inumber);
        var y = exports.IMAGINARY(inumber);

        // Return error if either coefficient is not a number
        if (utils.anyIsError(x, y)) {
            return error.num;
        }

        // Return cosecant of complex number
        return exports.IMDIV('1', exports.IMSIN(inumber));
    };

    exports.IMCSCH = function (inumber) {
        // Return error if inumber is a logical value
        if (inumber === true || inumber === false) {
            return error.value;
        }

        // Lookup real and imaginary coefficients using Formula.js
        // [http://formulajs.org]
        var x = exports.IMREAL(inumber);
        var y = exports.IMAGINARY(inumber);

        // Return error if either coefficient is not a number
        if (utils.anyIsError(x, y)) {
            return error.num;
        }

        // Return hyperbolic cosecant of complex number
        return exports.IMDIV('1', exports.IMSINH(inumber));
    };

    exports.IMSUB = function(inumber1, inumber2) {
        // Lookup real and imaginary coefficients using Formula.js
        // [http://formulajs.org]
        var a = this.IMREAL(inumber1);
        var b = this.IMAGINARY(inumber1);
        var c = this.IMREAL(inumber2);
        var d = this.IMAGINARY(inumber2);

        if (utils.anyIsError(a, b, c, d)) {
            return error.value;
        }

        // Lookup imaginary unit
        var unit1 = inumber1.substring(inumber1.length - 1);
        var unit2 = inumber2.substring(inumber2.length - 1);
        var unit = 'i';
        if (unit1 === 'j') {
            unit = 'j';
        } else if (unit2 === 'j') {
            unit = 'j';
        }

        // Return _ of two complex numbers
        return this.COMPLEX(a - c, b - d, unit);
    };

    exports.IMSUM = function() {
        var args = utils.flatten(arguments);

        // Initialize result
        var result = args[0];

        // Loop on all numbers
        for (var i = 1; i < args.length; i++) {
            // Lookup coefficients of two complex numbers
            var a = this.IMREAL(result);
            var b = this.IMAGINARY(result);
            var c = this.IMREAL(args[i]);
            var d = this.IMAGINARY(args[i]);

            if (utils.anyIsError(a, b, c, d)) {
              return error.value;
            }

            // Complute product of two complex numbers
            result = this.COMPLEX(a + c, b + d);
        }

        // Return sum of complex numbers
        return result;
    };

    exports.IMTAN = function(inumber) {
        // Return error if inumber is a logical value
        if (inumber === true || inumber === false) {
            return error.value;
        }

        // Lookup real and imaginary coefficients using Formula.js
        // [http://formulajs.org]
        var x = exports.IMREAL(inumber);
        var y = exports.IMAGINARY(inumber);

        if (utils.anyIsError(x, y)) {
            return error.value;
        }

        // Return tangent of complex number
        return this.IMDIV(this.IMSIN(inumber), this.IMCOS(inumber));
    };

    exports.OCT2BIN = function(number, places) {
        // Return error if number is not hexadecimal or contains more than ten
        // characters (10 digits)
        if (!/^[0-7]{1,10}$/.test(number)) {
            return error.num;
        }

        // Check if number is negative
        var negative = (number.length === 10 && number.substring(0, 1) === '7') ? true : false;

        // Convert octal number to decimal
        var decimal = (negative) ? parseInt(number, 8) - 1073741824 : parseInt(number, 8);

        // Return error if number is lower than -512 or greater than 511
        if (decimal < -512 || decimal > 511) {
            return error.num;
        }

        // Ignore places and return a 10-character binary number if number is
        // negative
        if (negative) {
            return '1' + REPT('0', 9 - (512 + decimal).toString(2).length) + (512 + decimal).toString(2);
        }

        // Convert decimal number to binary
        var result = decimal.toString(2);

        // Return binary number using the minimum number of characters necessary
        // if places is undefined
        if (typeof places === 'undefined') {
            return result;
        } else {
            // Return error if places is nonnumeric
            if (isNaN(places)) {
              return error.value;
            }

            // Return error if places is negative
            if (places < 0) {
              return error.num;
            }

            // Truncate places in case it is not an integer
            places = Math.floor(places);

            // Pad return value with leading 0s (zeros) if necessary (using
            // Underscore.string)
            return (places >= result.length) ? REPT('0', places - result.length) + result : error.num;
        }
    };

    exports.OCT2DEC = function(number) {
        // Return error if number is not octal or contains more than ten
        // characters (10 digits)
        if (!/^[0-7]{1,10}$/.test(number)) {
            return error.num;
        }

        // Convert octal number to decimal
        var decimal = parseInt(number, 8);

        // Return decimal number
        return (decimal >= 536870912) ? decimal - 1073741824 : decimal;
    };

    exports.OCT2HEX = function(number, places) {
        // Return error if number is not octal or contains more than ten
        // characters (10 digits)
        if (!/^[0-7]{1,10}$/.test(number)) {
            return error.num;
        }

        // Convert octal number to decimal
        var decimal = parseInt(number, 8);

        // Ignore places and return a 10-character octal number if number is
        // negative
        if (decimal >= 536870912) {
            return 'ff' + (decimal + 3221225472).toString(16);
        }

        // Convert decimal number to hexadecimal
        var result = decimal.toString(16);

        // Return hexadecimal number using the minimum number of characters
        // necessary if places is undefined
        if (places === undefined) {
            return result;
        } else {
            // Return error if places is nonnumeric
            if (isNaN(places)) {
              return error.value;
            }

            // Return error if places is negative
            if (places < 0) {
              return error.num;
            }

            // Truncate places in case it is not an integer
            places = Math.floor(places);

            // Pad return value with leading 0s (zeros) if necessary (using
            // Underscore.string)
            return (places >= result.length) ? REPT('0', places - result.length) + result : error.num;
        }
    };

    return exports;
})();

jexcel.methods.financial = (function() {
    var exports = {};

    function validDate(d) {
        return d && d.getTime && !isNaN(d.getTime());
    }

    function ensureDate(d) {
        return (d instanceof Date)?d:new Date(d);
    }

    exports.ACCRINT = function(issue, first, settlement, rate, par, frequency, basis) {
        // Return error if either date is invalid
        issue        = ensureDate(issue);
        first        = ensureDate(first);
        settlement = ensureDate(settlement);
        if (!validDate(issue) || !validDate(first) || !validDate(settlement)) {
            return '#VALUE!';
        }

        // Return error if either rate or par are lower than or equal to zero
        if (rate <= 0 || par <= 0) {
            return '#NUM!';
        }

        // Return error if frequency is neither 1, 2, or 4
        if ([1, 2, 4].indexOf(frequency) === -1) {
            return '#NUM!';
        }

        // Return error if basis is neither 0, 1, 2, 3, or 4
        if ([0, 1, 2, 3, 4].indexOf(basis) === -1) {
            return '#NUM!';
        }

        // Return error if settlement is before or equal to issue
        if (settlement <= issue) {
            return '#NUM!';
        }

        // Set default values
        par   = par   || 0;
        basis = basis || 0;

        // Compute accrued interest
        return par * rate * YEARFRAC(issue, settlement, basis);
    };

    exports.ACCRINTM = null;

    exports.AMORDEGRC = null;

    exports.AMORLINC = null;

    exports.COUPDAYBS = null;

    exports.COUPDAYS = null;

    exports.COUPDAYSNC = null;

    exports.COUPNCD = null;

    exports.COUPNUM = null;

    exports.COUPPCD = null;

    exports.CUMIPMT = function(rate, periods, value, start, end, type) {
        // Credits: algorithm inspired by Apache OpenOffice
        // Credits: Hannes Stiebitzhofer for the translations of function and
            // variable names
        // Requires exports.FV() and exports.PMT() from exports.js
            // [http://stoic.com/exports/]

        rate = utils.parseNumber(rate);
        periods = utils.parseNumber(periods);
        value = utils.parseNumber(value);
        if (utils.anyIsError(rate, periods, value)) {
            return error.value;
        }

        // Return error if either rate, periods, or value are lower than or
            // equal to zero
        if (rate <= 0 || periods <= 0 || value <= 0) {
            return error.num;
        }

        // Return error if start < 1, end < 1, or start > end
        if (start < 1 || end < 1 || start > end) {
            return error.num;
        }

        // Return error if type is neither 0 nor 1
        if (type !== 0 && type !== 1) {
            return error.num;
        }

        // Compute cumulative interest
        var payment = exports.PMT(rate, periods, value, 0, type);
        var interest = 0;

        if (start === 1) {
            if (type === 0) {
                interest = -value;
                start++;
            }
        }

        for (var i = start; i <= end; i++) {
            if (type === 1) {
                interest += exports.FV(rate, i - 2, payment, value, 1) - payment;
            } else {
                interest += exports.FV(rate, i - 1, payment, value, 0);
            }
        }
        interest *= rate;

        // Return cumulative interest
        return interest;
    };

    exports.CUMPRINC = function(rate, periods, value, start, end, type) {
        // Credits: algorithm inspired by Apache OpenOffice
        // Credits: Hannes Stiebitzhofer for the translations of function and
            // variable names

        rate = utils.parseNumber(rate);
        periods = utils.parseNumber(periods);
        value = utils.parseNumber(value);
        if (utils.anyIsError(rate, periods, value)) {
            return error.value;
        }

        // Return error if either rate, periods, or value are lower than or
            // equal to zero
        if (rate <= 0 || periods <= 0 || value <= 0) {
            return error.num;
        }

        // Return error if start < 1, end < 1, or start > end
        if (start < 1 || end < 1 || start > end) {
            return error.num;
        }

        // Return error if type is neither 0 nor 1
        if (type !== 0 && type !== 1) {
            return error.num;
        }

        // Compute cumulative principal
        var payment = exports.PMT(rate, periods, value, 0, type);
        var principal = 0;
        if (start === 1) {
            if (type === 0) {
                principal = payment + value * rate;
            } else {
                principal = payment;
            }
            start++;
        }
        for (var i = start; i <= end; i++) {
            if (type > 0) {
                principal += payment - (exports.FV(rate, i - 2, payment, value, 1) - payment) * rate;
            } else {
                principal += payment - exports.FV(rate, i - 1, payment, value, 0) * rate;
            }
        }

        // Return cumulative principal
        return principal;
    };

    exports.DB = function(cost, salvage, life, period, month) {
        // Initialize month
        month = (month === undefined) ? 12 : month;

        cost = utils.parseNumber(cost);
        salvage = utils.parseNumber(salvage);
        life = utils.parseNumber(life);
        period = utils.parseNumber(period);
        month = utils.parseNumber(month);
        if (utils.anyIsError(cost, salvage, life, period, month)) {
            return error.value;
        }

        // Return error if any of the parameters is negative
        if (cost < 0 || salvage < 0 || life < 0 || period < 0) {
            return error.num;
        }

        // Return error if month is not an integer between 1 and 12
        if ([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].indexOf(month) === -1) {
            return error.num;
        }

        // Return error if period is greater than life
        if (period > life) {
            return error.num;
        }

        // Return 0 (zero) if salvage is greater than or equal to cost
        if (salvage >= cost) {
            return 0;
        }

        // Rate is rounded to three decimals places
        var rate = (1 - Math.pow(salvage / cost, 1 / life)).toFixed(3);

        // Compute initial depreciation
        var initial = cost * rate * month / 12;

        // Compute total depreciation
        var total = initial;
        var current = 0;
        var ceiling = (period === life) ? life - 1 : period;
        for (var i = 2; i <= ceiling; i++) {
            current = (cost - total) * rate;
            total += current;
        }

        // Depreciation for the first and last periods are special cases
        if (period === 1) {
            // First period
            return initial;
        } else if (period === life) {
            // Last period
            return (cost - total) * rate;
        } else {
            return current;
        }
    };

    exports.DDB = function(cost, salvage, life, period, factor) {
        // Initialize factor
        factor = (factor === undefined) ? 2 : factor;

        cost = utils.parseNumber(cost);
        salvage = utils.parseNumber(salvage);
        life = utils.parseNumber(life);
        period = utils.parseNumber(period);
        factor = utils.parseNumber(factor);
        if (utils.anyIsError(cost, salvage, life, period, factor)) {
            return error.value;
        }

        // Return error if any of the parameters is negative or if factor is
            // null
        if (cost < 0 || salvage < 0 || life < 0 || period < 0 || factor <= 0) {
            return error.num;
        }

        // Return error if period is greater than life
        if (period > life) {
            return error.num;
        }

        // Return 0 (zero) if salvage is greater than or equal to cost
        if (salvage >= cost) {
            return 0;
        }

        // Compute depreciation
        var total = 0;
        var current = 0;
        for (var i = 1; i <= period; i++) {
            current = Math.min((cost - total) * (factor / life), (cost - salvage - total));
            total += current;
        }

        // Return depreciation
        return current;
    };

    exports.DISC = null;

    exports.DOLLARDE = function(dollar, fraction) {
        // Credits: algorithm inspired by Apache OpenOffice

        dollar = utils.parseNumber(dollar);
        fraction = utils.parseNumber(fraction);
        if (utils.anyIsError(dollar, fraction)) {
            return error.value;
        }

        // Return error if fraction is negative
        if (fraction < 0) {
            return error.num;
        }

        // Return error if fraction is greater than or equal to 0 and less than
            // 1
        if (fraction >= 0 && fraction < 1) {
            return error.div0;
        }

        // Truncate fraction if it is not an integer
        fraction = parseInt(fraction, 10);

        // Compute integer part
        var result = parseInt(dollar, 10);

        // Add decimal part
        result += (dollar % 1) * Math.pow(10, Math.ceil(Math.log(fraction) / Math.LN10)) / fraction;

        // Round result
        var power = Math.pow(10, Math.ceil(Math.log(fraction) / Math.LN2) + 1);
        result = Math.round(result * power) / power;

        // Return converted dollar price
        return result;
    };

    exports.DOLLARFR = function(dollar, fraction) {
        // Credits: algorithm inspired by Apache OpenOffice

        dollar = utils.parseNumber(dollar);
        fraction = utils.parseNumber(fraction);
        if (utils.anyIsError(dollar, fraction)) {
            return error.value;
        }

        // Return error if fraction is negative
        if (fraction < 0) {
            return error.num;
        }

        // Return error if fraction is greater than or equal to 0 and less than
            // 1
        if (fraction >= 0 && fraction < 1) {
            return error.div0;
        }

        // Truncate fraction if it is not an integer
        fraction = parseInt(fraction, 10);

        // Compute integer part
        var result = parseInt(dollar, 10);

        // Add decimal part
        result += (dollar % 1) * Math.pow(10, -Math.ceil(Math.log(fraction) / Math.LN10)) * fraction;

        // Return converted dollar price
        return result;
    };

    exports.DURATION = null;

    exports.EFFECT = function(rate, periods) {
        rate = utils.parseNumber(rate);
        periods = utils.parseNumber(periods);
        if (utils.anyIsError(rate, periods)) {
            return error.value;
        }

        // Return error if rate <=0 or periods < 1
        if (rate <= 0 || periods < 1) {
            return error.num;
        }

        // Truncate periods if it is not an integer
        periods = parseInt(periods, 10);

        // Return effective annual interest rate
        return Math.pow(1 + rate / periods, periods) - 1;
    };

    exports.FV = function(rate, periods, payment, value, type) {
        // Credits: algorithm inspired by Apache OpenOffice

        value = value || 0;
        type = type || 0;

        rate = utils.parseNumber(rate);
        periods = utils.parseNumber(periods);
        payment = utils.parseNumber(payment);
        value = utils.parseNumber(value);
        type = utils.parseNumber(type);
        if (utils.anyIsError(rate, periods, payment, value, type)) {
            return error.value;
        }

        // Return future value
        var result;
        if (rate === 0) {
            result = value + payment * periods;
        } else {
            var term = Math.pow(1 + rate, periods);
            if (type === 1) {
                result = value * term + payment * (1 + rate) * (term - 1) / rate;
            } else {
                result = value * term + payment * (term - 1) / rate;
            }
        }
        return -result;
    };

    exports.FVSCHEDULE = function(principal, schedule) {
        principal = utils.parseNumber(principal);
        schedule = utils.parseNumberArray(utils.flatten(schedule));
        if (utils.anyIsError(principal, schedule)) {
            return error.value;
        }

        var n = schedule.length;
        var future = principal;

        // Apply all interests in schedule
        for (var i = 0; i < n; i++) {
            // Apply scheduled interest
            future *= 1 + schedule[i];
        }

        // Return future value
        return future;
    };

    exports.INTRATE = null;

    exports.IPMT = function(rate, period, periods, present, future, type) {
        // Credits: algorithm inspired by Apache OpenOffice

        future = future || 0;
        type = type || 0;

        rate = utils.parseNumber(rate);
        period = utils.parseNumber(period);
        periods = utils.parseNumber(periods);
        present = utils.parseNumber(present);
        future = utils.parseNumber(future);
        type = utils.parseNumber(type);
        if (utils.anyIsError(rate, period, periods, present, future, type)) {
            return error.value;
        }

        // Compute payment
        var payment = exports.PMT(rate, periods, present, future, type);

        // Compute interest
        var interest;
        if (period === 1) {
            if (type === 1) {
                interest = 0;
            } else {
                interest = -present;
            }
        } else {
            if (type === 1) {
                interest = exports.FV(rate, period - 2, payment, present, 1) - payment;
            } else {
                interest = exports.FV(rate, period - 1, payment, present, 0);
            }
        }

        // Return interest
        return interest * rate;
    };

    exports.IRR = function(values, guess) {
        // Credits: algorithm inspired by Apache OpenOffice

        guess = guess || 0;

        values = utils.parseNumberArray(utils.flatten(values));
        guess = utils.parseNumber(guess);
        if (utils.anyIsError(values, guess)) {
            return error.value;
        }

        // Calculates the resulting amount
        var irrResult = function(values, dates, rate) {
            var r = rate + 1;
            var result = values[0];
            for (var i = 1; i < values.length; i++) {
                result += values[i] / Math.pow(r, (dates[i] - dates[0]) / 365);
            }
            return result;
        };

        // Calculates the first derivation
        var irrResultDeriv = function(values, dates, rate) {
            var r = rate + 1;
            var result = 0;
            for (var i = 1; i < values.length; i++) {
                var frac = (dates[i] - dates[0]) / 365;
                result -= frac * values[i] / Math.pow(r, frac + 1);
            }
            return result;
        };

        // Initialize dates and check that values contains at least one positive
            // value and one negative value
        var dates = [];
        var positive = false;
        var negative = false;
        for (var i = 0; i < values.length; i++) {
            dates[i] = (i === 0) ? 0 : dates[i - 1] + 365;
            if (values[i] > 0) {
                positive = true;
            }
            if (values[i] < 0) {
                negative = true;
            }
        }

        // Return error if values does not contain at least one positive value
            // and one negative value
        if (!positive || !negative) {
            return error.num;
        }

        // Initialize guess and resultRate
        guess = (guess === undefined) ? 0.1 : guess;
        var resultRate = guess;

        // Set maximum epsilon for end of iteration
        var epsMax = 1e-10;

        // Implement Newton's method
        var newRate, epsRate, resultValue;
        var contLoop = true;
        do {
            resultValue = irrResult(values, dates, resultRate);
            newRate = resultRate - resultValue / irrResultDeriv(values, dates, resultRate);
            epsRate = Math.abs(newRate - resultRate);
            resultRate = newRate;
            contLoop = (epsRate > epsMax) && (Math.abs(resultValue) > epsMax);
        } while (contLoop);

        // Return internal rate of return
        return resultRate;
    };

    exports.ISPMT = function(rate, period, periods, value) {
        rate = utils.parseNumber(rate);
        period = utils.parseNumber(period);
        periods = utils.parseNumber(periods);
        value = utils.parseNumber(value);
        if (utils.anyIsError(rate, period, periods, value)) {
            return error.value;
        }

        // Return interest
        return value * rate * (period / periods - 1);
    };

    exports.MDURATION = null;

    exports.MIRR = function(values, finance_rate, reinvest_rate) {
        values = utils.parseNumberArray(utils.flatten(values));
        finance_rate = utils.parseNumber(finance_rate);
        reinvest_rate = utils.parseNumber(reinvest_rate);
        if (utils.anyIsError(values, finance_rate, reinvest_rate)) {
            return error.value;
        }

        // Initialize number of values
        var n = values.length;

        // Lookup payments (negative values) and incomes (positive values)
        var payments = [];
        var incomes = [];
        for (var i = 0; i < n; i++) {
            if (values[i] < 0) {
                payments.push(values[i]);
            } else {
                incomes.push(values[i]);
            }
        }

        // Return modified internal rate of return
        var num = -exports.NPV(reinvest_rate, incomes) * Math.pow(1 + reinvest_rate, n - 1);
        var den = exports.NPV(finance_rate, payments) * (1 + finance_rate);
        return Math.pow(num / den, 1 / (n - 1)) - 1;
    };

    exports.NOMINAL = function(rate, periods) {
        rate = utils.parseNumber(rate);
        periods = utils.parseNumber(periods);
        if (utils.anyIsError(rate, periods)) {
            return error.value;
        }

        // Return error if rate <=0 or periods < 1
        if (rate <= 0 || periods < 1) {
            return error.num;
        }

        // Truncate periods if it is not an integer
        periods = parseInt(periods, 10);

        // Return nominal annual interest rate
        return (Math.pow(rate + 1, 1 / periods) - 1) * periods;
    };

    exports.NPER = function(rate, payment, present, future, type) {
        type = (type === undefined) ? 0 : type;
        future = (future === undefined) ? 0 : future;

        rate = utils.parseNumber(rate);
        payment = utils.parseNumber(payment);
        present = utils.parseNumber(present);
        future = utils.parseNumber(future);
        type = utils.parseNumber(type);
        if (utils.anyIsError(rate, payment, present, future, type)) {
            return error.value;
        }

        // Return number of periods
        var num = payment * (1 + rate * type) - future * rate;
        var den = (present * rate + payment * (1 + rate * type));
        return Math.log(num / den) / Math.log(1 + rate);
    };

    exports.NPV = function() {
        var args = utils.parseNumberArray(utils.flatten(arguments));
        if (args instanceof Error) {
            return args;
        }

        // Lookup rate
        var rate = args[0];

        // Initialize net present value
        var value = 0;

        // Loop on all values
        for (var j = 1; j < args.length; j++) {
            value += args[j] / Math.pow(1 + rate, j);
        }

        // Return net present value
        return value;
    };

    exports.ODDFPRICE = null;

    exports.ODDFYIELD = null;

    exports.ODDLPRICE = null;

    exports.ODDLYIELD = null;

    exports.PDURATION = function(rate, present, future) {
        rate = utils.parseNumber(rate);
        present = utils.parseNumber(present);
        future = utils.parseNumber(future);
        if (utils.anyIsError(rate, present, future)) {
            return error.value;
        }

        // Return error if rate <=0
        if (rate <= 0) {
            return error.num;
        }

        // Return number of periods
        return (Math.log(future) - Math.log(present)) / Math.log(1 + rate);
    };

    exports.PMT = function(rate, periods, present, future, type) {
        // Credits: algorithm inspired by Apache OpenOffice

        future = future || 0;
        type = type || 0;

        rate = utils.parseNumber(rate);
        periods = utils.parseNumber(periods);
        present = utils.parseNumber(present);
        future = utils.parseNumber(future);
        type = utils.parseNumber(type);
        if (utils.anyIsError(rate, periods, present, future, type)) {
            return error.value;
        }

        // Return payment
        var result;
        if (rate === 0) {
            result = (present + future) / periods;
        } else {
            var term = Math.pow(1 + rate, periods);
            if (type === 1) {
                result = (future * rate / (term - 1) + present * rate / (1 - 1 / term)) / (1 + rate);
            } else {
                result = future * rate / (term - 1) + present * rate / (1 - 1 / term);
            }
        }
        return -result;
    };

    exports.PPMT = function(rate, period, periods, present, future, type) {
        future = future || 0;
        type = type || 0;

        rate = utils.parseNumber(rate);
        periods = utils.parseNumber(periods);
        present = utils.parseNumber(present);
        future = utils.parseNumber(future);
        type = utils.parseNumber(type);
        if (utils.anyIsError(rate, periods, present, future, type)) {
            return error.value;
        }

        return exports.PMT(rate, periods, present, future, type) - exports.IPMT(rate, period, periods, present, future, type);
    };

    exports.PRICE = null;

    exports.PRICEDISC = null;

    exports.PRICEMAT = null;

    exports.PV = function(rate, periods, payment, future, type) {
        future = future || 0;
        type = type || 0;

        rate = utils.parseNumber(rate);
        periods = utils.parseNumber(periods);
        payment = utils.parseNumber(payment);
        future = utils.parseNumber(future);
        type = utils.parseNumber(type);
        if (utils.anyIsError(rate, periods, payment, future, type)) {
            return error.value;
        }

        // Return present value
        if (rate === 0) {
            return -payment * periods - future;
        } else {
            return (((1 - Math.pow(1 + rate, periods)) / rate) * payment * (1 + rate * type) - future) / Math.pow(1 + rate, periods);
        }
    };

    exports.RATE = function(periods, payment, present, future, type, guess) {
        // Credits: rabugento

        guess = (guess === undefined) ? 0.01 : guess;
        future = (future === undefined) ? 0 : future;
        type = (type === undefined) ? 0 : type;

        periods = utils.parseNumber(periods);
        payment = utils.parseNumber(payment);
        present = utils.parseNumber(present);
        future = utils.parseNumber(future);
        type = utils.parseNumber(type);
        guess = utils.parseNumber(guess);
        if (utils.anyIsError(periods, payment, present, future, type, guess)) {
            return error.value;
        }

        // Set maximum epsilon for end of iteration
        var epsMax = 1e-6;

        // Set maximum number of iterations
        var iterMax = 100;
        var iter = 0;
        var close = false;
        var rate = guess;

        while (iter < iterMax && !close) {
            var t1 = Math.pow(rate + 1, periods);
            var t2 = Math.pow(rate + 1, periods - 1);

            var f1 = future + t1 * present + payment * (t1 - 1) * (rate * type + 1) / rate;
            var f2 = periods * t2 * present - payment * (t1 - 1) *(rate * type + 1) / Math.pow(rate,2);
            var f3 = periods * payment * t2 * (rate * type + 1) / rate + payment * (t1 - 1) * type / rate;

            var newRate = rate - f1 / (f2 + f3);

            if (Math.abs(newRate - rate) < epsMax) close = true;
            iter++
            rate = newRate;
        }

        if (!close) return Number.NaN + rate;
        return rate;
    };

    // TODO
    exports.RECEIVED = null;

    exports.RRI = function(periods, present, future) {
        periods = utils.parseNumber(periods);
        present = utils.parseNumber(present);
        future = utils.parseNumber(future);
        if (utils.anyIsError(periods, present, future)) {
            return error.value;
        }

        // Return error if periods or present is equal to 0 (zero)
        if (periods === 0 || present === 0) {
            return error.num;
        }

        // Return equivalent interest rate
        return Math.pow(future / present, 1 / periods) - 1;
    };

    exports.SLN = function(cost, salvage, life) {
        cost = utils.parseNumber(cost);
        salvage = utils.parseNumber(salvage);
        life = utils.parseNumber(life);
        if (utils.anyIsError(cost, salvage, life)) {
            return error.value;
        }

        // Return error if life equal to 0 (zero)
        if (life === 0) {
            return error.num;
        }

        // Return straight-line depreciation
        return (cost - salvage) / life;
    };

    exports.SYD = function(cost, salvage, life, period) {
        // Return error if any of the parameters is not a number
        cost = utils.parseNumber(cost);
        salvage = utils.parseNumber(salvage);
        life = utils.parseNumber(life);
        period = utils.parseNumber(period);
        if (utils.anyIsError(cost, salvage, life, period)) {
            return error.value;
        }

        // Return error if life equal to 0 (zero)
        if (life === 0) {
            return error.num;
        }

        // Return error if period is lower than 1 or greater than life
        if (period < 1 || period > life) {
            return error.num;
        }

        // Truncate period if it is not an integer
        period = parseInt(period, 10);

        // Return straight-line depreciation
        return ((cost - salvage) * (life - period + 1) * 2) / (life * (life + 1));
    };

    exports.TBILLEQ = function(settlement, maturity, discount) {
        settlement = utils.parseDate(settlement);
        maturity = utils.parseDate(maturity);
        discount = utils.parseNumber(discount);
        if (utils.anyIsError(settlement, maturity, discount)) {
            return error.value;
        }

        // Return error if discount is lower than or equal to zero
        if (discount <= 0) {
            return error.num;
        }

        // Return error if settlement is greater than maturity
        if (settlement > maturity) {
            return error.num;
        }

        // Return error if maturity is more than one year after settlement
        if (maturity - settlement > 365 * 24 * 60 * 60 * 1000) {
            return error.num;
        }

        // Return bond-equivalent yield
        return (365 * discount) / (360 - discount * DAYS360(settlement, maturity, false));
    };

    exports.TBILLPRICE = function(settlement, maturity, discount) {
        settlement = utils.parseDate(settlement);
        maturity = utils.parseDate(maturity);
        discount = utils.parseNumber(discount);
        if (utils.anyIsError(settlement, maturity, discount)) {
            return error.value;
        }

        // Return error if discount is lower than or equal to zero
        if (discount <= 0) {
            return error.num;
        }

        // Return error if settlement is greater than maturity
        if (settlement > maturity) {
            return error.num;
        }

        // Return error if maturity is more than one year after settlement
        if (maturity - settlement > 365 * 24 * 60 * 60 * 1000) {
            return error.num;
        }

        // Return bond-equivalent yield
        return 100 * (1 - discount * DAYS360(settlement, maturity, false) / 360);
    };

    exports.TBILLYIELD = function(settlement, maturity, price) {
        settlement = utils.parseDate(settlement);
        maturity = utils.parseDate(maturity);
        price = utils.parseNumber(price);
        if (utils.anyIsError(settlement, maturity, price)) {
            return error.value;
        }

        // Return error if price is lower than or equal to zero
        if (price <= 0) {
            return error.num;
        }

        // Return error if settlement is greater than maturity
        if (settlement > maturity) {
            return error.num;
        }

        // Return error if maturity is more than one year after settlement
        if (maturity - settlement > 365 * 24 * 60 * 60 * 1000) {
            return error.num;
        }

        // Return bond-equivalent yield
        return (100 - price) * 360 / (price * DAYS360(settlement, maturity, false));
    };

    exports.VDB = null;

    exports.XIRR = function(values, dates, guess) {
        // Credits: algorithm inspired by Apache OpenOffice

        values = utils.parseNumberArray(utils.flatten(values));
        dates = utils.parseDateArray(utils.flatten(dates));
        guess = utils.parseNumber(guess);
        if (utils.anyIsError(values, dates, guess)) {
            return error.value;
        }

        // Calculates the resulting amount
        var irrResult = function(values, dates, rate) {
            var r = rate + 1;
            var result = values[0];
            for (var i = 1; i < values.length; i++) {
                result += values[i] / Math.pow(r, DAYS(dates[i], dates[0]) / 365);
            }
            return result;
        };

        // Calculates the first derivation
        var irrResultDeriv = function(values, dates, rate) {
            var r = rate + 1;
            var result = 0;
            for (var i = 1; i < values.length; i++) {
                var frac = DAYS(dates[i], dates[0]) / 365;
                result -= frac * values[i] / Math.pow(r, frac + 1);
            }
            return result;
        };

        // Check that values contains at least one positive value and one
            // negative value
        var positive = false;
        var negative = false;
        for (var i = 0; i < values.length; i++) {
            if (values[i] > 0) {
                positive = true;
            }
            if (values[i] < 0) {
                negative = true;
            }
        }

        // Return error if values does not contain at least one positive value
            // and one negative value
        if (!positive || !negative) {
            return error.num;
        }

        // Initialize guess and resultRate
        guess = guess || 0.1;
        var resultRate = guess;

        // Set maximum epsilon for end of iteration
        var epsMax = 1e-10;

        // Implement Newton's method
        var newRate, epsRate, resultValue;
        var contLoop = true;
        do {
            resultValue = irrResult(values, dates, resultRate);
            newRate = resultRate - resultValue / irrResultDeriv(values, dates, resultRate);
            epsRate = Math.abs(newRate - resultRate);
            resultRate = newRate;
            contLoop = (epsRate > epsMax) && (Math.abs(resultValue) > epsMax);
        } while (contLoop);

        // Return internal rate of return
        return resultRate;
    };

    exports.XNPV = function(rate, values, dates) {
        rate = utils.parseNumber(rate);
        values = utils.parseNumberArray(utils.flatten(values));
        dates = utils.parseDateArray(utils.flatten(dates));
        if (utils.anyIsError(rate, values, dates)) {
            return error.value;
        }

        var result = 0;
        for (var i = 0; i < values.length; i++) {
            result += values[i] / Math.pow(1 + rate, DAYS(dates[i], dates[0]) / 365);
        }
        return result;
    };

    exports.YIELD = null;

    exports.YIELDDISC = null;

    exports.YIELDMAT = null;

    return exports;
})();

jexcel.methods.information = (function() {
    var exports = {};
    exports.CELL = null;

    exports.ERROR = {};
    exports.ERROR.TYPE = function(error_val) {
        switch (error_val) {
            case error.nil: return 1;
            case error.div0: return 2;
            case error.value: return 3;
            case error.ref: return 4;
            case error.name: return 5;
            case error.num: return 6;
            case error.na: return 7;
            case error.data: return 8;
        }
        return error.na;
    };

    exports.INFO = null;

    exports.ISBLANK = function(value) {
        return value === null;
    };

    exports.ISBINARY = function (number) {
        return (/^[01]{1,10}$/).test(number);
    };

    exports.ISERR = function(value) {
        return ([error.value, error.ref, error.div0, error.num, error.name, error.nil]).indexOf(value) >= 0 ||
            (typeof value === 'number' && (isNaN(value) || !isFinite(value)));
    };

    exports.ISERROR = function(value) {
        return exports.ISERR(value) || value === error.na;
    };

    exports.ISEVEN = function(number) {
        return (Math.floor(Math.abs(number)) & 1) ? false : true;
    };

    // TODO
    exports.ISFORMULA = null;

    exports.ISLOGICAL = function(value) {
        return value === true || value === false;
    };

    exports.ISNA = function(value) {
        return value === error.na;
    };

    exports.ISNONTEXT = function(value) {
        return typeof(value) !== 'string';
    };

    exports.ISNUMBER = function(value) {
        return typeof(value) === 'number' && !isNaN(value) && isFinite(value);
    };

    exports.ISODD = function(number) {
        return (Math.floor(Math.abs(number)) & 1) ? true : false;
    };

    exports.ISREF = null;

    exports.ISTEXT = function(value) {
        return typeof(value) === 'string';
    };

    exports.N = function(value) {
        if (this.ISNUMBER(value)) {
            return value;
        }
        if (value instanceof Date) {
            return value.getTime();
        }
        if (value === true) {
            return 1;
        }
        if (value === false) {
            return 0;
        }
        if (this.ISERROR(value)) {
            return value;
        }
        return 0;
    };

    exports.NA = function() {
        return error.na;
    };

    exports.SHEET = null;

    exports.SHEETS = null;

    exports.TYPE = function(value) {
        if (this.ISNUMBER(value)) {
            return 1;
        }
        if (this.ISTEXT(value)) {
            return 2;
        }
        if (this.ISLOGICAL(value)) {
            return 4;
        }
        if (this.ISERROR(value)) {
            return 16;
        }
        if (Array.isArray(value)) {
            return 64;
        }
    };

    return exports;
})();

jexcel.methods.logical = (function() {
    var exports = {};

    exports.AND = function() {
        var args = utils.flatten(arguments);
        var result = true;
        for (var i = 0; i < args.length; i++) {
            if (!args[i]) {
                result = false;
            }
        }
        return result;
    };

    exports.CHOOSE = function() {
        if (arguments.length < 2) {
            return error.na;
        }

        var index = arguments[0];
        if (index < 1 || index > 254) {
            return error.value;
        }

        if (arguments.length < index + 1) {
            return error.value;
        }

        return arguments[index];
    };

    exports.FALSE = function() {
        return false;
    };

    exports.IF = function(test, then_value, otherwise_value) {
        return test ? then_value : otherwise_value;
    };

    exports.IFERROR = function(value, valueIfError) {
        if (ISERROR(value)) {
            return valueIfError;
        }
        return value;
    };

    exports.IFNA = function(value, value_if_na) {
        return value === error.na ? value_if_na : value;
    };

    exports.NOT = function(logical) {
        return !logical;
    };

    exports.OR = function() {
        var args = utils.flatten(arguments);
        var result = false;
        for (var i = 0; i < args.length; i++) {
            if (args[i]) {
                result = true;
            }
        }
        return result;
    };

    exports.TRUE = function() {
        return true;
    };

    exports.XOR = function() {
        var args = utils.flatten(arguments);
        var result = 0;
        for (var i = 0; i < args.length; i++) {
            if (args[i]) {
                result++;
            }
        }
        return (Math.floor(Math.abs(result)) & 1) ? true : false;
    };

    exports.SWITCH = function() {
        var result;
        if (arguments.length > 0)  {
            var targetValue = arguments[0];
            var argc = arguments.length - 1;
            var switchCount = Math.floor(argc / 2);
            var switchSatisfied = false;
            var defaultClause = argc % 2 === 0 ? null : arguments[arguments.length - 1];

            if (switchCount) {
                for (var index = 0; index < switchCount; index++) {
                    if (targetValue === arguments[index * 2 + 1]) {
                      result = arguments[index * 2 + 2];
                      switchSatisfied = true;
                      break;
                    }
                }
            }

            if (!switchSatisfied && defaultClause) {
                result = defaultClause;
            }
        }

        return result;
    };

    return exports;
})();

jexcel.methods.math = (function() {
    var exports = {};

    exports.ABS = function(number) {
        number = utils.parseNumber(number);
        if (number instanceof Error) {
            return number;
        }
        return Math.abs(utils.parseNumber(number));
    };

    exports.ACOS = function(number) {
        number = utils.parseNumber(number);
        if (number instanceof Error) {
            return number;
        }
        return Math.acos(number);
    };

    exports.ACOSH = function(number) {
        number = utils.parseNumber(number);
        if (number instanceof Error) {
            return number;
        }
        return Math.log(number + Math.sqrt(number * number - 1));
    };

    exports.ACOT = function(number) {
        number = utils.parseNumber(number);
        if (number instanceof Error) {
            return number;
        }
        return Math.atan(1 / number);
    };

    exports.ACOTH = function(number) {
        number = utils.parseNumber(number);
        if (number instanceof Error) {
            return number;
        }
        return 0.5 * Math.log((number + 1) / (number - 1));
    };

    exports.AGGREGATE = null

    exports.ARABIC = function(text) {
        // Credits: Rafa? Kukawski
        if (!/^M*(?:D?C{0,3}|C[MD])(?:L?X{0,3}|X[CL])(?:V?I{0,3}|I[XV])$/.test(text)) {
            return error.value;
        }
        var r = 0;
        text.replace(/[MDLV]|C[MD]?|X[CL]?|I[XV]?/g, function(i) {
            r += {
                M: 1000,
                CM: 900,
                D: 500,
                CD: 400,
                C: 100,
                XC: 90,
                L: 50,
                XL: 40,
                X: 10,
                IX: 9,
                V: 5,
                IV: 4,
                I: 1
            }[i];
        });
        return r;
    };

    exports.ASIN = function(number) {
        number = utils.parseNumber(number);
        if (number instanceof Error) {
            return number;
        }
        return Math.asin(number);
    };

    exports.ASINH = function(number) {
        number = utils.parseNumber(number);
        if (number instanceof Error) {
            return number;
        }
        return Math.log(number + Math.sqrt(number * number + 1));
    };

    exports.ATAN = function(number) {
        number = utils.parseNumber(number);
        if (number instanceof Error) {
            return number;
        }
        return Math.atan(number);
    };

    exports.ATAN2 = function(number_x, number_y) {
        number_x = utils.parseNumber(number_x);
        number_y = utils.parseNumber(number_y);
        if (utils.anyIsError(number_x, number_y)) {
            return error.value;
        }
        return Math.atan2(number_x, number_y);
    };

    exports.ATANH = function(number) {
        number = utils.parseNumber(number);
        if (number instanceof Error) {
            return number;
        }
        return Math.log((1 + number) / (1 - number)) / 2;
    };

    exports.BASE = function(number, radix, min_length) {
        min_length = min_length || 0;

        number = utils.parseNumber(number);
        radix = utils.parseNumber(radix);
        min_length = utils.parseNumber(min_length);
        if (utils.anyIsError(number, radix, min_length)) {
            return error.value;
        }
        min_length = (min_length === undefined) ? 0 : min_length;
        var result = number.toString(radix);
        return new Array(Math.max(min_length + 1 - result.length, 0)).join('0') + result;
    };

    exports.CEILING = function(number, significance, mode) {
        significance = (significance === undefined) ? 1 : significance;
        mode = (mode === undefined) ? 0 : mode;

        number = utils.parseNumber(number);
        significance = utils.parseNumber(significance);
        mode = utils.parseNumber(mode);
        if (utils.anyIsError(number, significance, mode)) {
            return error.value;
        }
        if (significance === 0) {
            return 0;
        }

        significance = Math.abs(significance);
        if (number >= 0) {
            return Math.ceil(number / significance) * significance;
        } else {
            if (mode === 0) {
                return -1 * Math.floor(Math.abs(number) / significance) * significance;
            } else {
                return -1 * Math.ceil(Math.abs(number) / significance) * significance;
            }
        }
    };

    exports.CEILING.MATH = exports.CEILING;

    exports.CEILING.PRECISE = exports.CEILING;

    exports.COMBIN = function(number, number_chosen) {
        number = utils.parseNumber(number);
        number_chosen = utils.parseNumber(number_chosen);
        if (utils.anyIsError(number, number_chosen)) {
            return error.value;
        }
        return exports.FACT(number) / (exports.FACT(number_chosen) * exports.FACT(number - number_chosen));
    };

    exports.COMBINA = function(number, number_chosen) {
        number = utils.parseNumber(number);
        number_chosen = utils.parseNumber(number_chosen);
        if (utils.anyIsError(number, number_chosen)) {
            return error.value;
        }
        return (number === 0 && number_chosen === 0) ? 1 : exports.COMBIN(number + number_chosen - 1, number - 1);
    };

    exports.COS = function(number) {
        number = utils.parseNumber(number);
        if (number instanceof Error) {
            return number;
        }
        return Math.cos(number);
    };

    exports.COSH = function(number) {
        number = utils.parseNumber(number);
        if (number instanceof Error) {
            return number;
        }
        return (Math.exp(number) + Math.exp(-number)) / 2;
    };

    exports.COT = function(number) {
        number = utils.parseNumber(number);
        if (number instanceof Error) {
            return number;
        }
        return 1 / Math.tan(number);
    };

    exports.COTH = function(number) {
        number = utils.parseNumber(number);
        if (number instanceof Error) {
            return number;
        }
        var e2 = Math.exp(2 * number);
        return (e2 + 1) / (e2 - 1);
    };

    exports.CSC = function(number) {
        number = utils.parseNumber(number);
        if (number instanceof Error) {
            return number;
        }
        return 1 / Math.sin(number);
    };

    exports.CSCH = function(number) {
        number = utils.parseNumber(number);
        if (number instanceof Error) {
            return number;
        }
        return 2 / (Math.exp(number) - Math.exp(-number));
    };

    exports.DECIMAL = function(number, radix) {
        if (arguments.length < 1) {
            return error.value;
        }


        return parseInt(number, radix);
    };

    exports.DEGREES = function(number) {
        number = utils.parseNumber(number);
        if (number instanceof Error) {
            return number;
        }
        return number * 180 / Math.PI;
    };

    exports.EVEN = function(number) {
        number = utils.parseNumber(number);
        if (number instanceof Error) {
            return number;
        }
        return exports.CEILING(number, -2, -1);
    };

    exports.EXP = Math.exp;

    var MEMOIZED_FACT = [];
    exports.FACT = function(number) {
        number = utils.parseNumber(number);
        if (number instanceof Error) {
            return number;
        }
        var n = Math.floor(number);
        if (n === 0 || n === 1) {
            return 1;
        } else if (MEMOIZED_FACT[n] > 0) {
            return MEMOIZED_FACT[n];
        } else {
            MEMOIZED_FACT[n] = exports.FACT(n - 1) * n;
            return MEMOIZED_FACT[n];
        }
    };

    exports.FACTDOUBLE = function(number) {
        number = utils.parseNumber(number);
        if (number instanceof Error) {
            return number;
        }
        var n = Math.floor(number);
        if (n <= 0) {
            return 1;
        } else {
            return n * exports.FACTDOUBLE(n - 2);
        }
    };

    exports.FLOOR = function(number, significance, mode) {
        significance = (significance === undefined) ? 1 : significance;
        mode = (mode === undefined) ? 0 : mode;

        number = utils.parseNumber(number);
        significance = utils.parseNumber(significance);
        mode = utils.parseNumber(mode);
        if (utils.anyIsError(number, significance, mode)) {
            return error.value;
        }
        if (significance === 0) {
            return 0;
        }

        significance = Math.abs(significance);
        if (number >= 0) {
            return Math.floor(number / significance) * significance;
        } else {
            if (mode === 0) {
                return -1 * Math.ceil(Math.abs(number) / significance) * significance;
            } else {
                return -1 * Math.floor(Math.abs(number) / significance) * significance;
            }
        }
    };

    exports.FLOOR.MATH = exports.FLOOR;

    exports.GCD = null;

    exports.INT = function(number) {
        number = utils.parseNumber(number);
        if (number instanceof Error) {
            return number;
        }
        return Math.floor(number);
    };

    exports.LCM = function() {
        // Credits: Jonas Raoni Soares Silva
        var o = utils.parseNumberArray(utils.flatten(arguments));
        if (o instanceof Error) {
            return o;
        }
        for (var i, j, n, d, r = 1;
            (n = o.pop()) !== undefined;) {
            while (n > 1) {
                if (n % 2) {
                    for (i = 3, j = Math.floor(Math.sqrt(n)); i <= j && n % i; i += 2) {
                      //empty
                    }
                    d = (i <= j) ? i : n;
                } else {
                    d = 2;
                }
                for (n /= d, r *= d, i = o.length; i;
                    (o[--i] % d) === 0 && (o[i] /= d) === 1 && o.splice(i, 1)) {
                    //empty
                }
            }
        }
        return r;
    };

    exports.LN = function(number) {
        number = utils.parseNumber(number);
        if (number instanceof Error) {
            return number;
        }
        return Math.log(number);
    };

    exports.LOG = function(number, base) {
        number = utils.parseNumber(number);
        base = (base === undefined) ? 10 : utils.parseNumber(base);

        if (utils.anyIsError(number, base)) {
            return error.value;
        }

        return Math.log(number) / Math.log(base);
    };

    exports.LOG10 = function(number) {
        number = utils.parseNumber(number);
        if (number instanceof Error) {
            return number;
        }
        return Math.log(number) / Math.log(10);
    };

    exports.MDETERM = null;

    exports.MINVERSE = null;

    exports.MMULT = null;

    exports.MOD = function(dividend, divisor) {
        dividend = utils.parseNumber(dividend);
        divisor = utils.parseNumber(divisor);
        if (utils.anyIsError(dividend, divisor)) {
            return error.value;
        }
        if (divisor === 0) {
            return error.div0;
        }
        var modulus = Math.abs(dividend % divisor);
        return (divisor > 0) ? modulus : -modulus;
    };

    exports.MROUND = function(number, multiple) {
        number = utils.parseNumber(number);
        multiple = utils.parseNumber(multiple);
        if (utils.anyIsError(number, multiple)) {
            return error.value;
        }
        if (number * multiple < 0) {
            return error.num;
        }

        return Math.round(number / multiple) * multiple;
    };

    exports.MULTINOMIAL = function() {
        var args = utils.parseNumberArray(utils.flatten(arguments));
        if (args instanceof Error) {
            return args;
        }
        var sum = 0;
        var divisor = 1;
        for (var i = 0; i < args.length; i++) {
            sum += args[i];
            divisor *= exports.FACT(args[i]);
        }
        return exports.FACT(sum) / divisor;
    };

    exports.MUNIT = null;

    exports.ODD = function(number) {
        number = utils.parseNumber(number);
        if (number instanceof Error) {
            return number;
        }
        var temp = Math.ceil(Math.abs(number));
        temp = (temp & 1) ? temp : temp + 1;
        return (number > 0) ? temp : -temp;
    };

    exports.PI = function() {
        return Math.PI;
    };

    exports.POWER = function(number, power) {
        number = utils.parseNumber(number);
        power = utils.parseNumber(power);
        if (utils.anyIsError(number, power)) {
            return error.value;
        }
        var result = Math.pow(number, power);
        if (isNaN(result)) {
            return error.num;
        }

        return result;
    };

    exports.PRODUCT = function() {
        var args = utils.parseNumberArray(utils.flatten(arguments));
        if (args instanceof Error) {
            return args;
        }
        var result = 1;
        for (var i = 0; i < args.length; i++) {
            result *= args[i];
        }
        return result;
    };

    exports.QUOTIENT = function(numerator, denominator) {
        numerator = utils.parseNumber(numerator);
        denominator = utils.parseNumber(denominator);
        if (utils.anyIsError(numerator, denominator)) {
            return error.value;
        }
        return parseInt(numerator / denominator, 10);
    };

    exports.RADIANS = function(number) {
        number = utils.parseNumber(number);
        if (number instanceof Error) {
            return number;
        }
        return number * Math.PI / 180;
    };

    exports.RAND = function() {
        return Math.random();
    };

    exports.RANDBETWEEN = function(bottom, top) {
        bottom = utils.parseNumber(bottom);
        top = utils.parseNumber(top);
        if (utils.anyIsError(bottom, top)) {
            return error.value;
        }
        // Creative Commons Attribution 3.0 License
        // Copyright (c) 2012 eqcode
        return bottom + Math.ceil((top - bottom + 1) * Math.random()) - 1;
    };

    exports.ROMAN = null;

    exports.ROUND = function(number, digits) {
        number = utils.parseNumber(number);
        digits = utils.parseNumber(digits);
        if (utils.anyIsError(number, digits)) {
            return error.value;
        }
        return Math.round(number * Math.pow(10, digits)) / Math.pow(10, digits);
    };

    exports.ROUNDDOWN = function(number, digits) {
        number = utils.parseNumber(number);
        digits = utils.parseNumber(digits);
        if (utils.anyIsError(number, digits)) {
            return error.value;
        }
        var sign = (number > 0) ? 1 : -1;
        return sign * (Math.floor(Math.abs(number) * Math.pow(10, digits))) / Math.pow(10, digits);
    };

    exports.ROUNDUP = function(number, digits) {
        number = utils.parseNumber(number);
        digits = utils.parseNumber(digits);
        if (utils.anyIsError(number, digits)) {
            return error.value;
        }
        var sign = (number > 0) ? 1 : -1;
        return sign * (Math.ceil(Math.abs(number) * Math.pow(10, digits))) / Math.pow(10, digits);
    };

    exports.SEC = function(number) {
        number = utils.parseNumber(number);
        if (number instanceof Error) {
            return number;
        }
        return 1 / Math.cos(number);
    };

    exports.SECH = function(number) {
        number = utils.parseNumber(number);
        if (number instanceof Error) {
            return number;
        }
        return 2 / (Math.exp(number) + Math.exp(-number));
    };

    exports.SERIESSUM = function(x, n, m, coefficients) {
        x = utils.parseNumber(x);
        n = utils.parseNumber(n);
        m = utils.parseNumber(m);
        coefficients = utils.parseNumberArray(coefficients);
        if (utils.anyIsError(x, n, m, coefficients)) {
            return error.value;
        }
        var result = coefficients[0] * Math.pow(x, n);
        for (var i = 1; i < coefficients.length; i++) {
            result += coefficients[i] * Math.pow(x, n + i * m);
        }
        return result;
    };

    exports.SIGN = function(number) {
        number = utils.parseNumber(number);
        if (number instanceof Error) {
            return number;
        }
        if (number < 0) {
            return -1;
        } else if (number === 0) {
            return 0;
        } else {
            return 1;
        }
    };

    exports.SIN = function(number) {
        number = utils.parseNumber(number);
        if (number instanceof Error) {
            return number;
        }
        return Math.sin(number);
    };

    exports.SINH = function(number) {
        number = utils.parseNumber(number);
        if (number instanceof Error) {
            return number;
        }
        return (Math.exp(number) - Math.exp(-number)) / 2;
    };

    exports.SQRT = function(number) {
        number = utils.parseNumber(number);
        if (number instanceof Error) {
            return number;
        }
        if (number < 0) {
            return error.num;
        }
        return Math.sqrt(number);
    };

    exports.SQRTPI = function(number) {
        number = utils.parseNumber(number);
        if (number instanceof Error) {
            return number;
        }
        return Math.sqrt(number * Math.PI);
    };

    exports.SUBTOTAL = null;

    exports.ADD = function (num1, num2) {
        if (arguments.length !== 2) {
            return error.na;
        }

        num1 = utils.parseNumber(num1);
        num2 = utils.parseNumber(num2);
        if (utils.anyIsError(num1, num2)) {
            return error.value;
        }

        return num1 + num2;
    };

    exports.MINUS = function (num1, num2) {
        if (arguments.length !== 2) {
            return error.na;
        }

        num1 = utils.parseNumber(num1);
        num2 = utils.parseNumber(num2);
        if (utils.anyIsError(num1, num2)) {
            return error.value;
        }

        return num1 - num2;
    };

    exports.DIVIDE = function (dividend, divisor) {
        if (arguments.length !== 2) {
            return error.na;
        }

        dividend = utils.parseNumber(dividend);
        divisor = utils.parseNumber(divisor);
        if (utils.anyIsError(dividend, divisor)) {
            return error.value;
        }

        if (divisor === 0) {
            return error.div0;
        }

        return dividend / divisor;
    };

    exports.MULTIPLY = function (factor1, factor2) {
        if (arguments.length !== 2) {
            return error.na;
        }

        factor1 = utils.parseNumber(factor1);
        factor2 = utils.parseNumber(factor2);
        if (utils.anyIsError(factor1, factor2)) {
            return error.value;
        }

        return factor1 * factor2;
    };

    exports.GTE = function (num1, num2) {
        if (arguments.length !== 2) {
            return error.na;
        }

        num1 = utils.parseNumber(num1);
        num2 = utils.parseNumber(num2);
        if (utils.anyIsError(num1, num2)) {
            return error.error;
        }

        return num1 >= num2;
    };

    exports.LT = function (num1, num2) {
        if (arguments.length !== 2) {
            return error.na;
        }

        num1 = utils.parseNumber(num1);
        num2 = utils.parseNumber(num2);
        if (utils.anyIsError(num1, num2)) {
            return error.error;
        }

        return num1 < num2;
    };

    exports.LTE = function (num1, num2) {
        if (arguments.length !== 2) {
            return error.na;
        }

        num1 = utils.parseNumber(num1);
        num2 = utils.parseNumber(num2);
        if (utils.anyIsError(num1, num2)) {
            return error.error;
        }

        return num1 <= num2;
    };

    exports.EQ = function (value1, value2) {
        if (arguments.length !== 2) {
            return error.na;
        }

        return value1 === value2;
    };

    exports.NE = function (value1, value2) {
        if (arguments.length !== 2) {
            return error.na;
        }

        return value1 !== value2;
    };

    exports.POW = function (base, exponent) {
        if (arguments.length !== 2) {
            return error.na;
        }

        base = utils.parseNumber(base);
        exponent = utils.parseNumber(exponent);
        if (utils.anyIsError(base, exponent)) {
            return error.error;
        }

        return exports.POWER(base, exponent);
    };

    exports.SUM = function() {
        var result = 0;
        var argsKeys = Object.keys(arguments);
        for (var i = 0; i < argsKeys.length; ++i) {
            var elt = arguments[argsKeys[i]];
            if (typeof elt === 'number') {
                result += elt;
            } else if (typeof elt === 'string') {
                var parsed = parseFloat(elt);
                !isNaN(parsed) && (result += parsed);
            } else if (Array.isArray(elt)) {
                result += exports.SUM.apply(null, elt);
            }
        }
        return result;
    };

    exports.SUMIF = function(range, criteria) {
        range = utils.parseNumberArray(utils.flatten(range));
        if (range instanceof Error) {
            return range;
        }
        var result = 0;
        for (var i = 0; i < range.length; i++) {
            result += (eval(range[i] + criteria)) ? range[i] : 0; // jshint ignore:line
        }
        return result;
    };

    exports.SUMIFS = function() {
        var args = utils.argsToArray(arguments);
        var range = utils.parseNumberArray(utils.flatten(args.shift()));
        if (range instanceof Error) {
            return range;
        }
        var criteria = args;

        var n_range_elements = range.length;
        var n_criterias = criteria.length;

        var result = 0;
        for (var i = 0; i < n_range_elements; i++) {
            var el = range[i];
            var condition = '';
            for (var c = 0; c < n_criterias; c++) {
                condition += el + criteria[c];
                if (c !== n_criterias - 1) {
                    condition += '&&';
                }
            }
            if (eval(condition)) { // jshint ignore:line
                result += el;
            }
        }
        return result;
    };

    exports.SUMPRODUCT = null;

    exports.SUMSQ = function() {
        var numbers = utils.parseNumberArray(utils.flatten(arguments));
        if (numbers instanceof Error) {
            return numbers;
        }
        var result = 0;
        var length = numbers.length;
        for (var i = 0; i < length; i++) {
            result += (ISNUMBER(numbers[i])) ? numbers[i] * numbers[i] : 0;
        }
        return result;
    };

    exports.SUMX2MY2 = function(array_x, array_y) {
        array_x = utils.parseNumberArray(utils.flatten(array_x));
        array_y = utils.parseNumberArray(utils.flatten(array_y));
        if (utils.anyIsError(array_x, array_y)) {
            return error.value;
        }
        var result = 0;
        for (var i = 0; i < array_x.length; i++) {
            result += array_x[i] * array_x[i] - array_y[i] * array_y[i];
        }
        return result;
    };

    exports.SUMX2PY2 = function(array_x, array_y) {
        array_x = utils.parseNumberArray(utils.flatten(array_x));
        array_y = utils.parseNumberArray(utils.flatten(array_y));
        if (utils.anyIsError(array_x, array_y)) {
            return error.value;
        }
        var result = 0;
        array_x = utils.parseNumberArray(utils.flatten(array_x));
        array_y = utils.parseNumberArray(utils.flatten(array_y));
        for (var i = 0; i < array_x.length; i++) {
            result += array_x[i] * array_x[i] + array_y[i] * array_y[i];
        }
        return result;
    };

    exports.SUMXMY2 = function(array_x, array_y) {
        array_x = utils.parseNumberArray(utils.flatten(array_x));
        array_y = utils.parseNumberArray(utils.flatten(array_y));
        if (utils.anyIsError(array_x, array_y)) {
            return error.value;
        }
        var result = 0;
        array_x = utils.flatten(array_x);
        array_y = utils.flatten(array_y);
        for (var i = 0; i < array_x.length; i++) {
            result += Math.pow(array_x[i] - array_y[i], 2);
        }
        return result;
    };

    exports.TAN = function(number) {
        number = utils.parseNumber(number);
        if (number instanceof Error) {
            return number;
        }
        return Math.tan(number);
    };

    exports.TANH = function(number) {
        number = utils.parseNumber(number);
        if (number instanceof Error) {
            return number;
        }
        var e2 = Math.exp(2 * number);
        return (e2 - 1) / (e2 + 1);
    };

    exports.TRUNC = function(number, digits) {
        digits = (digits === undefined) ? 0 : digits;
        number = utils.parseNumber(number);
        digits = utils.parseNumber(digits);
        if (utils.anyIsError(number, digits)) {
            return error.value;
        }
        var sign = (number > 0) ? 1 : -1;
        return sign * (Math.floor(Math.abs(number) * Math.pow(10, digits))) / Math.pow(10, digits);
    };

    return exports;
})();

jexcel.methods.misc = (function() {
    var exports = {};

    exports.UNIQUE = function () {
        var result = [];
        for (var i = 0; i < arguments.length; ++i) {
            var hasElement = false;
            var element = arguments[i];

            // Check if we've already seen this element.
            for (var j = 0; j < result.length; ++j) {
                hasElement = result[j] === element;
                if (hasElement) { break; }
            }

            // If we did not find it, add it to the result.
            if (!hasElement) {
                result.push(element);
            }
        }
        return result;
    };

    exports.FLATTEN = utils.flatten;

    exports.ARGS2ARRAY = function () {
        return Array.prototype.slice.call(arguments, 0);
    };

    exports.REFERENCE = function (context, reference) {
        try {
            var path = reference.split('.');
            var result = context;
            for (var i = 0; i < path.length; ++i) {
                var step = path[i];
                if (step[step.length - 1] === ']') {
                    var opening = step.indexOf('[');
                    var index = step.substring(opening + 1, step.length - 1);
                    result = result[step.substring(0, opening)][index];
                } else {
                    result = result[step];
                }
            }
            return result;
        } catch (error) {}
    };

    exports.JOIN = function (array, separator) {
        return array.join(separator);
    };

    exports.NUMBERS = function () {
        var possibleNumbers = utils.flatten(arguments);
        return possibleNumbers.filter(function (el) {
            return typeof el === 'number';
        });
    };

    exports.NUMERAL = null;

    return exports;
})();

jexcel.methods.text = (function() {
    var exports = {};

    exports.ASC = null;

    exports.BAHTTEXT = null;

    exports.CHAR = function(number) {
        number = utils.parseNumber(number);
        if (number instanceof Error) {
            return number;
        }
        return String.fromCharCode(number);
    };

    exports.CLEAN = function(text) {
        text = text || '';
        var re = /[\0-\x1F]/g;
        return text.replace(re, "");
    };

    exports.CODE = function(text) {
        text = text || '';
        return text.charCodeAt(0);
    };

    exports.CONCATENATE = function() {
        var args = utils.flatten(arguments);

        var trueFound = 0;
        while ((trueFound = args.indexOf(true)) > -1) {
            args[trueFound] = 'TRUE';
        }

        var falseFound = 0;
        while ((falseFound = args.indexOf(false)) > -1) {
            args[falseFound] = 'FALSE';
        }

        return args.join('');
    };

    exports.DBCS = null;

    exports.DOLLAR = null;

    exports.EXACT = function(text1, text2) {
        return text1 === text2;
    };

    exports.FIND = function(find_text, within_text, position) {
        position = (position === undefined) ? 0 : position;
        return within_text ? within_text.indexOf(find_text, position - 1) + 1 : null;
    };

    exports.FIXED = null;

    exports.HTML2TEXT = function (value) {
        var result = '';

        if (value) {
            if (value instanceof Array) {
                value.forEach(function (line) {
                    if (result !== '') {
                      result += '\n';
                    }
                    result += (line.replace(/<(?:.|\n)*?>/gm, ''));
                });
            } else {
                result = value.replace(/<(?:.|\n)*?>/gm, '');
            }
        }

        return result;
    };

    exports.LEFT = function(text, number) {
        number = (number === undefined) ? 1 : number;
        number = utils.parseNumber(number);
        if (number instanceof Error || typeof text !== 'string') {
            return error.value;
        }
        return text ? text.substring(0, number) : null;
    };

    exports.LEN = function(text) {
        if (arguments.length === 0) {
            return error.error;
        }

        if (typeof text === 'string') {
            return text ? text.length : 0;
        }

        if (text.length) {
            return text.length;
        }

        return error.value;
    };

    exports.LOWER = function(text) {
        if (typeof text !== 'string') {
            return error.value;
        }
        return text ? text.toLowerCase() : text;
    };

    exports.MID = function(text, start, number) {
        start = utils.parseNumber(start);
        number = utils.parseNumber(number);
        if (utils.anyIsError(start, number) || typeof text !== 'string') {
            return number;
        }

        var begin = start - 1;
        var end = begin + number;

        return text.substring(begin, end);
    };

    exports.NUMBERVALUE = null;

    exports.PRONETIC = null;

    exports.PROPER = function(text) {
        if (text === undefined || text.length === 0) {
            return error.value;
        }
        if (text === true) {
            text = 'TRUE';
        }
        if (text === false) {
            text = 'FALSE';
        }
        if (isNaN(text) && typeof text === 'number') {
            return error.value;
        }
        if (typeof text === 'number') {
            text = '' + text;
        }

        return text.replace(/\w\S*/g, function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    };

    exports.REGEXEXTRACT = function (text, regular_expression) {
        var match = text.match(new RegExp(regular_expression));
        return match ? (match[match.length > 1 ? match.length - 1 : 0]) : null;
    };

    exports.REGEXMATCH = function (text, regular_expression, full) {
        var match = text.match(new RegExp(regular_expression));
        return full ? match : !!match;
    };

    exports.REGEXREPLACE = function (text, regular_expression, replacement) {
        return text.replace(new RegExp(regular_expression), replacement);
    };

    exports.REPLACE = function(text, position, length, new_text) {
        position = utils.parseNumber(position);
        length = utils.parseNumber(length);
        if (utils.anyIsError(position, length) ||
            typeof text !== 'string' ||
            typeof new_text !== 'string') {
            return error.value;
        }
        return text.substr(0, position - 1) + new_text + text.substr(position - 1 + length);
    };

    exports.REPT = function(text, number) {
        number = utils.parseNumber(number);
        if (number instanceof Error) {
            return number;
        }
        return new Array(number + 1).join(text);
    };

    exports.RIGHT = function(text, number) {
        number = (number === undefined) ? 1 : number;
        number = utils.parseNumber(number);
        if (number instanceof Error) {
            return number;
        }
        return text ? text.substring(text.length - number) : null;
    };

    exports.SEARCH = function(find_text, within_text, position) {
        var foundAt;
        if (typeof find_text !== 'string' || typeof within_text !== 'string') {
            return error.value;
        }
        position = (position === undefined) ? 0 : position;
        foundAt = within_text.toLowerCase().indexOf(find_text.toLowerCase(), position - 1)+1;
        return (foundAt === 0)?error.value:foundAt;
    };

    exports.SPLIT = function (text, separator) {
        return text.split(separator);
    };

    exports.SUBSTITUTE = function(text, old_text, new_text, occurrence) {
        if (!text || !old_text || !new_text) {
            return text;
        } else if (occurrence === undefined) {
            return text.replace(new RegExp(old_text, 'g'), new_text);
        } else {
            var index = 0;
            var i = 0;
            while (text.indexOf(old_text, index) > 0) {
                index = text.indexOf(old_text, index + 1);
                i++;
                if (i === occurrence) {
                    return text.substring(0, index) + new_text + text.substring(index + old_text.length);
                }
            }
        }
    };

    exports.T = function(value) {
        return (typeof value === "string") ? value : '';
    };

    exports.TEXT = null;

    exports.TRIM = function(text) {
        if (typeof text !== 'string') {
            return error.value;
        }
        return text.replace(/ +/g, ' ').trim();
    };

    exports.UNICHAR = exports.CHAR;

    exports.UNICODE = exports.CODE;

    exports.UPPER = function(text) {
        if (typeof text !== 'string') {
            return error.value;
        }
        return text.toUpperCase();
    };

    exports.VALUE = null;

    return exports;
})();

jexcel.methods.stats = (function() {
    var exports = {};

    var SQRT2PI = 2.5066282746310002;

    exports.AVEDEV = null;

    exports.AVERAGE = function() {
        var range = utils.numbers(utils.flatten(arguments));
        var n = range.length;
        var sum = 0;
        var count = 0;
        for (var i = 0; i < n; i++) {
            sum += range[i];
            count += 1;
        }
        return sum / count;
    };

    exports.AVERAGEA = function() {
        var range = utils.flatten(arguments);
        var n = range.length;
        var sum = 0;
        var count = 0;
        for (var i = 0; i < n; i++) {
            var el = range[i];
            if (typeof el === 'number') {
                sum += el;
            }
            if (el === true) {
                sum++;
            }
            if (el !== null) {
                count++;
            }
        }
        return sum / count;
    };

    exports.AVERAGEIF = function(range, criteria, average_range) {
        average_range = average_range || range;
        range = utils.flatten(range);
        average_range = utils.parseNumberArray(utils.flatten(average_range));
        if (average_range instanceof Error) {
            return average_range;
        }
        var average_count = 0;
        var result = 0;
        for (var i = 0; i < range.length; i++) {
            if (eval(range[i] + criteria)) { // jshint ignore:line
                result += average_range[i];
                average_count++;
            }
        }
        return result / average_count;
    };

    exports.AVERAGEIFS = null;

    exports.COUNT = function() {
        return utils.numbers(utils.flatten(arguments)).length;
    };

    exports.COUNTA = function() {
        var range = utils.flatten(arguments);
        return range.length - exports.COUNTBLANK(range);
    };

    exports.COUNTIN = function (range, value) {
        var result = 0;
        for (var i = 0; i < range.length; i++) {
            if (range[i] === value) {
                result++;
            }
        }
        return result;
    };

    exports.COUNTBLANK = function() {
        var range = utils.flatten(arguments);
        var blanks = 0;
        var element;
        for (var i = 0; i < range.length; i++) {
            element = range[i];
            if (element === null || element === '') {
                blanks++;
            }
        }
        return blanks;
    };

    exports.COUNTIF = function(range, criteria) {
        range = utils.flatten(range);
        if (!/[<>=!]/.test(criteria)) {
            criteria = '=="' + criteria + '"';
        }
        var matches = 0;
        for (var i = 0; i < range.length; i++) {
            if (typeof range[i] !== 'string') {
                if (eval(range[i] + criteria)) { // jshint ignore:line
                    matches++;
                }
            } else {
                if (eval('"' + range[i] + '"' + criteria)) { // jshint ignore:line
                    matches++;
                }
            }
        }
        return matches;
    };

    exports.COUNTIFS = function() {
        var args = utils.argsToArray(arguments);
        var results = new Array(utils.flatten(args[0]).length);
        for (var i = 0; i < results.length; i++) {
            results[i] = true;
        }
        for (i = 0; i < args.length; i += 2) {
            var range = utils.flatten(args[i]);
            var criteria = args[i + 1];
            if (!/[<>=!]/.test(criteria)) {
                criteria = '=="' + criteria + '"';
            }
            for (var j = 0; j < range.length; j++) {
                if (typeof range[j] !== 'string') {
                    results[j] = results[j] && eval(range[j] + criteria); // jshint ignore:line
                } else {
                    results[j] = results[j] && eval('"' + range[j] + '"' + criteria); // jshint ignore:line
                }
            }
        }
        var result = 0;
        for (i = 0; i < results.length; i++) {
            if (results[i]) {
                result++;
            }
        }
        return result;
    };

    exports.COUNTUNIQUE = function () {
        return UNIQUE.apply(null, utils.flatten(arguments)).length;
    };

    exports.FISHER = function(x) {
        x = utils.parseNumber(x);
        if (x instanceof Error) {
            return x;
        }
        return Math.log((1 + x) / (1 - x)) / 2;
    };

    exports.FISHERINV = function(y) {
        y = utils.parseNumber(y);
        if (y instanceof Error) {
            return y;
        }
        var e2y = Math.exp(2 * y);
        return (e2y - 1) / (e2y + 1);
    };

    exports.FREQUENCY = function(data, bins) {
        data = utils.parseNumberArray(utils.flatten(data));
        bins = utils.parseNumberArray(utils.flatten(bins));
        if (utils.anyIsError(data, bins)) {
            return error.value;
        }
        var n = data.length;
        var b = bins.length;
        var r = [];
        for (var i = 0; i <= b; i++) {
            r[i] = 0;
            for (var j = 0; j < n; j++) {
                if (i === 0) {
                    if (data[j] <= bins[0]) {
                        r[0] += 1;
                    }
                } else if (i < b) {
                    if (data[j] > bins[i - 1] && data[j] <= bins[i]) {
                        r[i] += 1;
                    }
                } else if (i === b) {
                    if (data[j] > bins[b - 1]) {
                        r[b] += 1;
                    }
                }
            }
        }
        return r;
    };

    exports.LARGE = function(range, k) {
        range = utils.parseNumberArray(utils.flatten(range));
        k = utils.parseNumber(k);
        if (utils.anyIsError(range, k)) {
            return range;
        }
        return range.sort(function(a, b) {
            return b - a;
        })[k - 1];
    };

    exports.MAX = function() {
        var range = utils.numbers(utils.flatten(arguments));
        return (range.length === 0) ? 0 : Math.max.apply(Math, range);
    };

    exports.MAXA = function() {
        var range = utils.arrayValuesToNumbers(utils.flatten(arguments));
        return (range.length === 0) ? 0 : Math.max.apply(Math, range);
    };

    exports.MIN = function() {
        var range = utils.numbers(utils.flatten(arguments));
        return (range.length === 0) ? 0 : Math.min.apply(Math, range);
    };

    exports.MINA = function() {
        var range = utils.arrayValuesToNumbers(utils.flatten(arguments));
        return (range.length === 0) ? 0 : Math.min.apply(Math, range);
    };

    exports.MODE = {};

    exports.MODE.MULT = function() {
        // Credits: Roönaän
        var range = utils.parseNumberArray(utils.flatten(arguments));
        if (range instanceof Error) {
            return range;
        }
        var n = range.length;
        var count = {};
        var maxItems = [];
        var max = 0;
        var currentItem;

        for (var i = 0; i < n; i++) {
            currentItem = range[i];
            count[currentItem] = count[currentItem] ? count[currentItem] + 1 : 1;
            if (count[currentItem] > max) {
                max = count[currentItem];
                maxItems = [];
            }
            if (count[currentItem] === max) {
                maxItems[maxItems.length] = currentItem;
            }
        }
        return maxItems;
    };

    exports.MODE.SNGL = function() {
        var range = utils.parseNumberArray(utils.flatten(arguments));
        if (range instanceof Error) {
            return range;
        }
        return exports.MODE.MULT(range).sort(function(a, b) {
            return a - b;
        })[0];
    };

    exports.PERCENTILE = {};

    exports.PERCENTILE.EXC = function(array, k) {
        array = utils.parseNumberArray(utils.flatten(array));
        k = utils.parseNumber(k);
        if (utils.anyIsError(array, k)) {
            return error.value;
        }
        array = array.sort(function(a, b) {
            {
                return a - b;
            }
        });
        var n = array.length;
        if (k < 1 / (n + 1) || k > 1 - 1 / (n + 1)) {
            return error.num;
        }
        var l = k * (n + 1) - 1;
        var fl = Math.floor(l);
        return utils.cleanFloat((l === fl) ? array[l] : array[fl] + (l - fl) * (array[fl + 1] - array[fl]));
    };

    exports.PERCENTILE.INC = function(array, k) {
        array = utils.parseNumberArray(utils.flatten(array));
        k = utils.parseNumber(k);
        if (utils.anyIsError(array, k)) {
            return error.value;
        }
        array = array.sort(function(a, b) {
            return a - b;
        });
        var n = array.length;
        var l = k * (n - 1);
        var fl = Math.floor(l);
        return utils.cleanFloat((l === fl) ? array[l] : array[fl] + (l - fl) * (array[fl + 1] - array[fl]));
    };

    exports.PERCENTRANK = {};

    exports.PERCENTRANK.EXC = function(array, x, significance) {
        significance = (significance === undefined) ? 3 : significance;
        array = utils.parseNumberArray(utils.flatten(array));
        x = utils.parseNumber(x);
        significance = utils.parseNumber(significance);
        if (utils.anyIsError(array, x, significance)) {
            return error.value;
        }
        array = array.sort(function(a, b) {
            return a - b;
        });
        var uniques = UNIQUE.apply(null, array);
        var n = array.length;
        var m = uniques.length;
        var power = Math.pow(10, significance);
        var result = 0;
        var match = false;
        var i = 0;
        while (!match && i < m) {
            if (x === uniques[i]) {
                result = (array.indexOf(uniques[i]) + 1) / (n + 1);
                match = true;
            } else if (x >= uniques[i] && (x < uniques[i + 1] || i === m - 1)) {
                result = (array.indexOf(uniques[i]) + 1 + (x - uniques[i]) / (uniques[i + 1] - uniques[i])) / (n + 1);
                match = true;
            }
            i++;
        }
        return Math.floor(result * power) / power;
    };

    exports.PERCENTRANK.INC = function(array, x, significance) {
        significance = (significance === undefined) ? 3 : significance;
        array = utils.parseNumberArray(utils.flatten(array));
        x = utils.parseNumber(x);
        significance = utils.parseNumber(significance);
        if (utils.anyIsError(array, x, significance)) {
            return error.value;
        }
        array = array.sort(function(a, b) {
            return a - b;
        });
        var uniques = UNIQUE.apply(null, array);
        var n = array.length;
        var m = uniques.length;
        var power = Math.pow(10, significance);
        var result = 0;
        var match = false;
        var i = 0;
        while (!match && i < m) {
            if (x === uniques[i]) {
                result = array.indexOf(uniques[i]) / (n - 1);
                match = true;
            } else if (x >= uniques[i] && (x < uniques[i + 1] || i === m - 1)) {
                result = (array.indexOf(uniques[i]) + (x - uniques[i]) / (uniques[i + 1] - uniques[i])) / (n - 1);
                match = true;
            }
            i++;
        }
        return Math.floor(result * power) / power;
    };

    exports.PERMUT = function(number, number_chosen) {
        number = utils.parseNumber(number);
        number_chosen = utils.parseNumber(number_chosen);
        if (utils.anyIsError(number, number_chosen)) {
            return error.value;
        }
        return FACT(number) / FACT(number - number_chosen);
    };

    exports.PERMUTATIONA = function(number, number_chosen) {
        number = utils.parseNumber(number);
        number_chosen = utils.parseNumber(number_chosen);
        if (utils.anyIsError(number, number_chosen)) {
            return error.value;
        }
        return Math.pow(number, number_chosen);
    };

    exports.PHI = function(x) {
        x = utils.parseNumber(x);
        if (x instanceof Error) {
            return error.value;
        }
        return Math.exp(-0.5 * x * x) / SQRT2PI;
    };

    exports.PROB = function(range, probability, lower, upper) {
        if (lower === undefined) {
            return 0;
        }
        upper = (upper === undefined) ? lower : upper;

        range = utils.parseNumberArray(utils.flatten(range));
        probability = utils.parseNumberArray(utils.flatten(probability));
        lower = utils.parseNumber(lower);
        upper = utils.parseNumber(upper);
        if (utils.anyIsError(range, probability, lower, upper)) {
            return error.value;
        }

        if (lower === upper) {
            return (range.indexOf(lower) >= 0) ? probability[range.indexOf(lower)] : 0;
        }

        var sorted = range.sort(function(a, b) {
            return a - b;
        });
        var n = sorted.length;
        var result = 0;
        for (var i = 0; i < n; i++) {
            if (sorted[i] >= lower && sorted[i] <= upper) {
                result += probability[range.indexOf(sorted[i])];
            }
        }
        return result;
    };

    exports.QUARTILE = {};

    exports.QUARTILE.EXC = function(range, quart) {
        range = utils.parseNumberArray(utils.flatten(range));
        quart = utils.parseNumber(quart);
        if (utils.anyIsError(range, quart)) {
            return error.value;
        }
        switch (quart) {
            case 1:
                return exports.PERCENTILE.EXC(range, 0.25);
            case 2:
                return exports.PERCENTILE.EXC(range, 0.5);
            case 3:
                return exports.PERCENTILE.EXC(range, 0.75);
            default:
                return error.num;
        }
    };

    exports.QUARTILE.INC = function(range, quart) {
        range = utils.parseNumberArray(utils.flatten(range));
        quart = utils.parseNumber(quart);
        if (utils.anyIsError(range, quart)) {
            return error.value;
        }
        switch (quart) {
            case 1:
                return exports.PERCENTILE.INC(range, 0.25);
            case 2:
                return exports.PERCENTILE.INC(range, 0.5);
            case 3:
                return exports.PERCENTILE.INC(range, 0.75);
            default:
                return error.num;
        }
    };

    exports.RANK = {};

    exports.RANK.AVG = function(number, range, order) {
        number = utils.parseNumber(number);
        range = utils.parseNumberArray(utils.flatten(range));
        if (utils.anyIsError(number, range)) {
            return error.value;
        }
        range = utils.flatten(range);
        order = order || false;
        var sort = (order) ? function(a, b) {
            return a - b;
        } : function(a, b) {
            return b - a;
        };
        range = range.sort(sort);

        var length = range.length;
        var count = 0;
        for (var i = 0; i < length; i++) {
            if (range[i] === number) {
                count++;
            }
        }

        return (count > 1) ? (2 * range.indexOf(number) + count + 1) / 2 : range.indexOf(number) + 1;
    };

    exports.RANK.EQ = function(number, range, order) {
        number = utils.parseNumber(number);
        range = utils.parseNumberArray(utils.flatten(range));
        if (utils.anyIsError(number, range)) {
            return error.value;
        }
        order = order || false;
        var sort = (order) ? function(a, b) {
            return a - b;
        } : function(a, b) {
            return b - a;
        };
        range = range.sort(sort);
        return range.indexOf(number) + 1;
    };

    exports.RSQ = function(data_x, data_y) { // no need to flatten here, PEARSON will take care of that
        data_x = utils.parseNumberArray(utils.flatten(data_x));
        data_y = utils.parseNumberArray(utils.flatten(data_y));
        if (utils.anyIsError(data_x, data_y)) {
            return error.value;
        }
        return Math.pow(exports.PEARSON(data_x, data_y), 2);
    };

    exports.SMALL = function(range, k) {
        range = utils.parseNumberArray(utils.flatten(range));
        k = utils.parseNumber(k);
        if (utils.anyIsError(range, k)) {
            return range;
        }
        return range.sort(function(a, b) {
            return a - b;
        })[k - 1];
    };

    exports.STANDARDIZE = function(x, mean, sd) {
        x = utils.parseNumber(x);
        mean = utils.parseNumber(mean);
        sd = utils.parseNumber(sd);
        if (utils.anyIsError(x, mean, sd)) {
            return error.value;
        }
        return (x - mean) / sd;
    };

    exports.STDEV = {};

    exports.STDEV.P = function() {
        var v = exports.VAR.P.apply(this, arguments);
        return Math.sqrt(v);
    };

    exports.STDEV.S = function() {
        var v = exports.VAR.S.apply(this, arguments);
        return Math.sqrt(v);
    };

    exports.STDEVA = function() {
        var v = exports.VARA.apply(this, arguments);
        return Math.sqrt(v);
    };

    exports.STDEVPA = function() {
        var v = exports.VARPA.apply(this, arguments);
        return Math.sqrt(v);
    };

    exports.VAR = {};

    exports.VAR.P = function() {
        var range = utils.numbers(utils.flatten(arguments));
        var n = range.length;
        var sigma = 0;
        var mean = exports.AVERAGE(range);
        for (var i = 0; i < n; i++) {
            sigma += Math.pow(range[i] - mean, 2);
        }
        return sigma / n;
    };

    exports.VAR.S = function() {
        var range = utils.numbers(utils.flatten(arguments));
        var n = range.length;
        var sigma = 0;
        var mean = exports.AVERAGE(range);
        for (var i = 0; i < n; i++) {
            sigma += Math.pow(range[i] - mean, 2);
        }
        return sigma / (n - 1);
    };

    exports.VARA = function() {
        var range = utils.flatten(arguments);
        var n = range.length;
        var sigma = 0;
        var count = 0;
        var mean = exports.AVERAGEA(range);
        for (var i = 0; i < n; i++) {
            var el = range[i];
            if (typeof el === 'number') {
                sigma += Math.pow(el - mean, 2);
            } else if (el === true) {
                sigma += Math.pow(1 - mean, 2);
            } else {
                sigma += Math.pow(0 - mean, 2);
            }

            if (el !== null) {
                count++;
            }
        }
        return sigma / (count - 1);
    };

    exports.VARPA = function() {
        var range = utils.flatten(arguments);
        var n = range.length;
        var sigma = 0;
        var count = 0;
        var mean = exports.AVERAGEA(range);
        for (var i = 0; i < n; i++) {
            var el = range[i];
            if (typeof el === 'number') {
                sigma += Math.pow(el - mean, 2);
            } else if (el === true) {
                sigma += Math.pow(1 - mean, 2);
            } else {
                sigma += Math.pow(0 - mean, 2);
            }

            if (el !== null) {
                count++;
            }
        }
        return sigma / count;
    };

    exports.WEIBULL = {};

    exports.WEIBULL.DIST = function(x, alpha, beta, cumulative) {
        x = utils.parseNumber(x);
        alpha = utils.parseNumber(alpha);
        beta = utils.parseNumber(beta);
        if (utils.anyIsError(x, alpha, beta)) {
            return error.value;
        }
        return (cumulative) ? 1 - Math.exp(-Math.pow(x / beta, alpha)) : Math.pow(x, alpha - 1) * Math.exp(-Math.pow(x / beta, alpha)) * alpha / Math.pow(beta, alpha);
    };

    exports.Z = {};

    exports.Z.TEST = function(range, x, sd) {
        range = utils.parseNumberArray(utils.flatten(range));
        x = utils.parseNumber(x);
        if (utils.anyIsError(range, x)) {
            return error.value;
        }

        sd = sd || exports.STDEV.S(range);
        var n = range.length;
        return 1 - exports.NORM.S.DIST((exports.AVERAGE(range) - x) / (sd / Math.sqrt(n)), true);
    };

    return exports;
})();

for (var i = 0; i < Object.keys(jexcel.methods).length; i++) {
    var methods = jexcel.methods[Object.keys(jexcel.methods)[i]];
    for (var j = 0; j < Object.keys(methods).length; j++) {
        if (typeof(methods[Object.keys(methods)[j]]) == 'function') {
            window[Object.keys(methods)[j]] = methods[Object.keys(methods)[j]];
        } else {
            window[Object.keys(methods)[j]] = function() {
                return Object.keys(methods)[j] + 'Not implemented';
            }
        }
    }
}




    return jexcel;

})));


/**
 * (c) jSuites Javascript Web Components (v2.7)
 *
 * Author: Paul Hodel <paul.hodel@gmail.com>
 * Website: https://bossanova.uk/jsuites/
 * Description: Create amazing web based applications.
 *
 * MIT License
 *
 */
;(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    global.jSuites = factory();
}(this, (function () {

    'use strict';

var jSuites = function(options) {
    var obj = {}

    obj.init = function() {
        // Find root element
        var app = document.querySelector('.japp');

        // Root element
        if (app) {
            obj.el = app;
        } else {
            obj.el = document.body;
        }
    }

    obj.guid = function() {
        var guid = '';
        for (var i = 0; i < 32; i++) {
            guid += Math.floor(Math.random()*0xF).toString(0xF);
        }
        return guid;
    }

    obj.getWindowWidth = function() {
        var w = window,
        d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0],
        x = w.innerWidth || e.clientWidth || g.clientWidth;
        return x;
    }

    obj.getWindowHeight = function() {
        var w = window,
        d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0],
        y = w.innerHeight|| e.clientHeight|| g.clientHeight;
        return  y;
    }

    obj.getPosition = function(e) {
        if (e.changedTouches && e.changedTouches[0]) {
            var x = e.changedTouches[0].pageX;
            var y = e.changedTouches[0].pageY;
        } else {
            var x = (window.Event) ? e.pageX : e.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);
            var y = (window.Event) ? e.pageY : e.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);
        }

        return [ x, y ];
    }

    obj.click = function(el) {
        if (el.click) {
            el.click();
        } else {
            var evt = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            el.dispatchEvent(evt);
        }
    }

    obj.getElement = function(element, className) {
        var foundElement = false;

        function path (element) {
            if (element.className) {
                if (element.classList.contains(className)) {
                    foundElement = element;
                }
            }

            if (element.parentNode) {
                path(element.parentNode);
            }
        }

        path(element);

        return foundElement;
    }

    obj.getLinkElement = function(element) {
        var targetElement = false;

        function path (element) {
            if ((element.tagName == 'A' || element.tagName == 'DIV') && element.getAttribute('data-href')) {
                targetElement = element;
            }

            if (element.parentNode) {
                path(element.parentNode);
            }
        }

        path(element);

        return targetElement;
    }

    obj.getFormElements = function(formObject) {
        var ret = {};

        if (formObject) {
            var elements = formObject.querySelectorAll("input, select, textarea");
        } else {
            var elements = document.querySelectorAll("input, select, textarea");
        }

        for (var i = 0; i < elements.length; i++) {
            var element = elements[i];
            var name = element.name;
            var value = element.value;

            if (name) {
                ret[name] = value;
            }
        }

        return ret;
    }

    obj.exists = function(url, __callback) {
        var http = new XMLHttpRequest();
        http.open('HEAD', url, false);
        http.send();
        if (http.status) {
            __callback(http.status);
        }
    }

    obj.getFiles = function(element) {
        if (! element) {
            console.error('No element defined in the arguments of your method');
        }

        // Get attachments
        var files = element.querySelectorAll('.jfile');

        if (files.length > 0) {
            var data = [];
            for (var i = 0; i < files.length; i++) {
                var file = {};

                var src = files[i].getAttribute('src');

                if (files[i].classList.contains('jremove')) {
                    file.remove = 1;
                } else {
                    if (src.substr(0,4) == 'data') {
                        file.content = src.substr(src.indexOf(',') + 1);
                        file.extension = files[i].getAttribute('data-extension');
                    } else {
                        file.file = src;
                        file.extension = files[i].getAttribute('data-extension');
                        if (! file.extension) {
                            file.extension =  src.substr(src.lastIndexOf('.') + 1);
                        }
                        if (jSuites.files[file.file]) {
                            file.content = jSuites.files[file.file];
                        }
                    }

                    // Optional file information
                    if (files[i].getAttribute('data-name')) {
                        file.name = files[i].getAttribute('data-name');
                    }

                    if (files[i].getAttribute('data-file')) {
                        file.file = files[i].getAttribute('data-file');
                    }

                    if (files[i].getAttribute('data-size')) {
                        file.size = files[i].getAttribute('data-size');
                    }

                    if (files[i].getAttribute('data-date')) {
                        file.date = files[i].getAttribute('data-date');
                    }

                    if (files[i].getAttribute('data-cover')) {
                        file.cover = files[i].getAttribute('data-cover');
                    }
                }

                // TODO SMALL thumbs?

                data[i] = file;
            }

            return data;
        }
    }

    obj.ajax = function(options) {
        if (! options.data) {
            options.data = {};
        }

        if (options.type) {
            options.method = options.type;
        }

        if (options.data) {
            var data = [];
            var keys = Object.keys(options.data);

            if (keys.length) {
                for (var i = 0; i < keys.length; i++) {
                    if (typeof(options.data[keys[i]]) == 'object') {
                        var o = options.data[keys[i]];
                        for (var j = 0; j < o.length; j++) {
                            if (typeof(o[j]) == 'string') {
                                data.push(keys[i] + '[' + j + ']=' + encodeURIComponent(o[j]));
                            } else {
                                var prop = Object.keys(o[j]);
                                for (var z = 0; z < prop.length; z++) {
                                    data.push(keys[i] + '[' + j + '][' + prop[z] + ']=' + encodeURIComponent(o[j][prop[z]]));
                                }
                            }
                        }
                    } else {
                        data.push(keys[i] + '=' + encodeURIComponent(options.data[keys[i]]));
                    }
                }
            }

            if (options.method == 'GET' && data.length > 0) {
                if (options.url.indexOf('?') < 0) {
                    options.url += '?';
                }
                options.url += data.join('&');
            }
        }

        var httpRequest = new XMLHttpRequest();
        httpRequest.open(options.method, options.url, true);

        if (options.method == 'POST') {
            httpRequest.setRequestHeader('Accept', 'application/json');
            httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        } else {
            if (options.dataType == 'json') {
                httpRequest.setRequestHeader('Content-Type', 'text/json');
            }
        }

        // No cache
        httpRequest.setRequestHeader('pragma', 'no-cache');
        httpRequest.setRequestHeader('cache-control', 'no-cache');

        httpRequest.onload = function() {
            if (httpRequest.status === 200) {
                if (options.dataType == 'json') {
                    try {
                        var result = JSON.parse(httpRequest.responseText);

                        if (options.success && typeof(options.success) == 'function') {
                            options.success(result);
                        }
                    } catch(err) {
                        if (options.error && typeof(options.error) == 'function') {
                            options.error(result);
                        }
                    }
                } else {
                    var result = httpRequest.responseText;

                    if (options.success && typeof(options.success) == 'function') {
                        options.success(result);
                    }
                }
            } else {
                if (options.error && typeof(options.error) == 'function') {
                    options.error(httpRequest.responseText);
                }
            }

            // Global complete method
            if (obj.ajax.requests && obj.ajax.requests.length) {
                // Get index of this request in the container
                var index = obj.ajax.requests.indexOf(httpRequest)
                // Remove from the ajax requests container
                obj.ajax.requests.splice(index, 1);
                // Last one?
                if (! obj.ajax.requests.length) {
                    if (options.complete && typeof(options.complete) == 'function') {
                        options.complete(result);
                    }
                }
            }
        }

        if (data) {
            httpRequest.send(data.join('&'));
        } else {
            httpRequest.send();
        }

        obj.ajax.requests.push(httpRequest);

        return httpRequest;
    }

    obj.ajax.requests = [];

    obj.slideLeft = function(element, direction, done) {
        if (direction == true) {
            element.classList.add('slide-left-in');
            setTimeout(function() {
                element.classList.remove('slide-left-in');
                if (typeof(done) == 'function') {
                    done();
                }
            }, 400);
        } else {
            element.classList.add('slide-left-out');
            setTimeout(function() {
                element.classList.remove('slide-left-out');
                if (typeof(done) == 'function') {
                    done();
                }
            }, 400);
        }
    }

    obj.slideRight = function(element, direction, done) {
        if (direction == true) {
            element.classList.add('slide-right-in');
            setTimeout(function() {
                element.classList.remove('slide-right-in');
                if (typeof(done) == 'function') {
                    done();
                }
            }, 400);
        } else {
            element.classList.add('slide-right-out');
            setTimeout(function() {
                element.classList.remove('slide-right-out');
                if (typeof(done) == 'function') {
                    done();
                }
            }, 400);
        }
    }

    obj.slideTop = function(element, direction, done) {
        if (direction == true) {
            element.classList.add('slide-top-in');
            setTimeout(function() {
                element.classList.remove('slide-top-in');
                if (typeof(done) == 'function') {
                    done();
                }
            }, 400);
        } else {
            element.classList.add('slide-top-out');
            setTimeout(function() {
                element.classList.remove('slide-top-out');
                if (typeof(done) == 'function') {
                    done();
                }
            }, 400);
        }
    }

    obj.slideBottom = function(element, direction, done) {
        if (direction == true) {
            element.classList.add('slide-bottom-in');
            setTimeout(function() {
                element.classList.remove('slide-bottom-in');
                if (typeof(done) == 'function') {
                    done();
                }
            }, 400);
        } else {
            element.classList.add('slide-bottom-out');
            setTimeout(function() {
                element.classList.remove('slide-bottom-out');
                if (typeof(done) == 'function') {
                    done();
                }
            }, 100);
        }
    }

    obj.fadeIn = function(element, done) {
        element.classList.add('fade-in');
        setTimeout(function() {
            element.classList.remove('fade-in');
            if (typeof(done) == 'function') {
                done();
            }
        }, 2000);
    }

    obj.fadeOut = function(element, done) {
        element.classList.add('fade-out');
        setTimeout(function() {
            element.classList.remove('fade-out');
            if (typeof(done) == 'function') {
                done();
            }
        }, 1000);
    }

    obj.keyDownControls = function(e) {
        if (e.which == 27) {
            var nodes = document.querySelectorAll('.jslider');
            if (nodes.length > 0) {
                for (var i = 0; i < nodes.length; i++) {
                    nodes[i].slider.close();
                }
            }

            if (document.querySelector('.jdialog')) {
                jSuites.dialog.close();
            }
        } else if (e.which == 13) {
            if (document.querySelector('.jdialog')) {
                if (typeof(jSuites.dialog.options.onconfirm) == 'function') {
                    jSuites.dialog.options.onconfirm();
                }
                jSuites.dialog.close();
            }
        }

        // Verify mask
        if (jSuites.mask) {
            jSuites.mask.apply(e);
        }
    }

    var actionUpControl = function(e) {
        var element = null;
        if (element = jSuites.getLinkElement(e.target)) {
            var link = element.getAttribute('data-href');
            if (link == '#back') {
                window.history.back();
            } else if (link == '#panel') {
                jSuites.panel();
            } else {
                jSuites.pages(link);
            }
        }
    }

    var controlSwipeLeft = function(e) {
        var element = jSuites.getElement(e.target, 'option');

        if (element && element.querySelector('.option-actions')) {
            element.scrollTo({
                left: 100,
                behavior: 'smooth'
            });
        } else {
            var element = jSuites.getElement(e.target, 'jcalendar');
            if (element && jSuites.calendar.current) {
                jSuites.calendar.current.prev();
            } else {
                if (jSuites.panel) {
                    var element = jSuites.panel.get();
                    if (element) {
                        if (element.style.display != 'none') {
                            jSuites.panel.close();
                        }
                    }
                }
            }
        }
    }

    var controlSwipeRight = function(e) {
        var element = jSuites.getElement(e.target, 'option');
        if (element && element.querySelector('.option-actions')) {
            element.scrollTo({
                left: 0,
                behavior: 'smooth'
            });
        } else {
            var element = jSuites.getElement(e.target, 'jcalendar');
            if (element && jSuites.calendar.current) {
                jSuites.calendar.current.next();
            } else {
                if (jSuites.panel) {
                    var element = jSuites.panel.get();
                    if (element) {
                        if (element.style.display == 'none') {
                            jSuites.panel();
                        }
                    }
                }
            }
        }
    }

    var actionOverControl = function(e) {
        // Tooltip
        if (jSuites.tooltip) {
            jSuites.tooltip(e);
        }
    }

    var actionOutControl = function(e) {
        // Tooltip
        if (jSuites.tooltip) {
            jSuites.tooltip.hide();
        }
    }

    // Create page container
    document.addEventListener('swipeleft', controlSwipeLeft);
    document.addEventListener('swiperight', controlSwipeRight);
    document.addEventListener('keydown', obj.keyDownControls);

    if ('ontouchend' in document.documentElement === true) {
        document.addEventListener('touchend', actionUpControl);
    } else {
        document.addEventListener('mouseup', actionUpControl);
    }

    // Onmouseover
    document.addEventListener('mouseover', actionOverControl);
    document.addEventListener('mouseout', actionOutControl);
    document.addEventListener('DOMContentLoaded', function() {
        obj.init();
    });

    // Pop state control
    window.onpopstate = function(e) {
        if (e.state && e.state.route) {
            if (jSuites.pages.get(e.state.route)) {
                jSuites.pages(e.state.route, { ignoreHistory:true });
            }
        }
    }

    return obj;
}();

jSuites.files = [];

jSuites.calendar = (function(el, options) {
    var obj = {};
    obj.options = {};

    // Global container
    if (! jSuites.calendar.current) {
        jSuites.calendar.current = null;
    }

    // Default configuration
    var defaults = {
        // Date format
        format: 'DD/MM/YYYY',
        // Allow keyboard date entry
        readonly: true,
        // Today is default
        today: false,
        // Show timepicker
        time: false,
        // Show the reset button
        resetButton: true,
        // Placeholder
        placeholder: '',
        // Translations can be done here
        months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        weekdays: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
        weekdays_short: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
        // Value
        value: null,
        // Events
        onclose: null,
        onchange: null,
        // Fullscreen (this is automatic set for screensize < 800)
        fullscreen: false,
        // Internal mode controller
        mode: null,
        position: null,
        // Create the calendar closed as default
        opened: false,
    };

    // Loop through our object
    for (var property in defaults) {
        if (options && options.hasOwnProperty(property)) {
            obj.options[property] = options[property];
        } else {
            obj.options[property] = defaults[property];
        }
    }

    // Value
    if (! obj.options.value && el.value) {
        obj.options.value = el.value;
    }

    // Make sure use upper case in the format
    obj.options.format = obj.options.format.toUpperCase();

    if (obj.options.value) {
        var date = obj.options.value.split(' ');
        var time = date[1];
        var date = date[0].split('-');
        var y = parseInt(date[0]);
        var m = parseInt(date[1]);
        var d = parseInt(date[2]);

        if (time) {
            var time = time.split(':');
            var h = parseInt(time[0]);
            var i = parseInt(time[1]);
        } else {
            var h = 0;
            var i = 0;
        }
    } else {
        var date = new Date();
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        var d = date.getDate();
        var h = date.getHours();
        var i = date.getMinutes();
    }

    // Current value
    obj.date = [ y, m, d, h, i, 0 ];

    // Two digits
    var two = function(value) {
        value = '' + value;
        if (value.length == 1) {
            value = '0' + value;
        }
        return value;
    }

    // Element
    el.classList.add('jcalendar-input');

    // Calendar elements
    var calendarReset = document.createElement('div');
    calendarReset.className = 'jcalendar-reset';
    calendarReset.innerHTML = 'Reset';

    var calendarConfirm = document.createElement('div');
    calendarConfirm.className = 'jcalendar-confirm';
    calendarConfirm.innerHTML = 'Done';

    var calendarControls = document.createElement('div');
    calendarControls.className = 'jcalendar-controls'
    if (obj.options.resetButton) {
        calendarControls.appendChild(calendarReset);
    }
    calendarControls.appendChild(calendarConfirm);

    var calendarContainer = document.createElement('div');
    calendarContainer.className = 'jcalendar-container';

    var calendarContent = document.createElement('div');
    calendarContent.className = 'jcalendar-content';
    calendarContent.appendChild(calendarControls);
    calendarContainer.appendChild(calendarContent);

    // Main element
    var calendar = document.createElement('div');
    calendar.className = 'jcalendar';
    calendar.appendChild(calendarContainer);

    // Previous button
    var calendarHeaderPrev = document.createElement('td');
    calendarHeaderPrev.setAttribute('colspan', '2');
    calendarHeaderPrev.className = 'jcalendar-prev';

    // Header with year and month
    var calendarLabelYear = document.createElement('span');
    calendarLabelYear.className = 'jcalendar-year';

    var calendarLabelMonth = document.createElement('span');
    calendarLabelMonth.className = 'jcalendar-month';

    var calendarHeaderTitle = document.createElement('td');
    calendarHeaderTitle.className = 'jcalendar-header';
    calendarHeaderTitle.setAttribute('colspan', '3');
    calendarHeaderTitle.appendChild(calendarLabelMonth);
    calendarHeaderTitle.appendChild(calendarLabelYear);

    var calendarHeaderNext = document.createElement('td');
    calendarHeaderNext.setAttribute('colspan', '2');
    calendarHeaderNext.className = 'jcalendar-next';

    var calendarHeaderRow = document.createElement('tr');
    calendarHeaderRow.appendChild(calendarHeaderPrev);
    calendarHeaderRow.appendChild(calendarHeaderTitle);
    calendarHeaderRow.appendChild(calendarHeaderNext);

    var calendarHeader = document.createElement('thead');
    calendarHeader.appendChild(calendarHeaderRow);

    var calendarBody = document.createElement('tbody');
    var calendarFooter = document.createElement('tfoot');

    // Calendar table
    var calendarTable = document.createElement('table');
    calendarTable.setAttribute('cellpadding', '0');
    calendarTable.setAttribute('cellspacing', '0');
    calendarTable.appendChild(calendarHeader);
    calendarTable.appendChild(calendarBody);
    calendarTable.appendChild(calendarFooter);
    calendarContent.appendChild(calendarTable);

    var calendarSelectHour = document.createElement('select');
    calendarSelectHour.className = 'jcalendar-select';
    calendarSelectHour.onchange = function() {
        obj.date[3] = this.value; 
    }

    for (var i = 0; i < 24; i++) {
        var element = document.createElement('option');
        element.value = i;
        element.innerHTML = two(i);
        calendarSelectHour.appendChild(element);
    }

    var calendarSelectMin = document.createElement('select');
    calendarSelectMin.className = 'jcalendar-select';
    calendarSelectMin.onchange = function() {
        obj.date[4] = this.value; 
    }

    for (var i = 0; i < 60; i++) {
        var element = document.createElement('option');
        element.value = i;
        element.innerHTML = two(i);
        calendarSelectMin.appendChild(element);
    }

    // Footer controls
    var calendarControls = document.createElement('div');
    calendarControls.className = 'jcalendar-controls';

    var calendarControlsTime = document.createElement('div');
    calendarControlsTime.className = 'jcalendar-time';
    calendarControlsTime.style.maxWidth = '140px';
    calendarControlsTime.appendChild(calendarSelectHour);
    calendarControlsTime.appendChild(calendarSelectMin);

    var calendarControlsUpdate = document.createElement('div');
    calendarControlsUpdate.style.flexGrow = '10';
    calendarControlsUpdate.innerHTML = '<input type="button" class="jcalendar-update" value="Update">'
    calendarControls.appendChild(calendarControlsTime);
    calendarControls.appendChild(calendarControlsUpdate);
    calendarContent.appendChild(calendarControls);

    var calendarBackdrop = document.createElement('div');
    calendarBackdrop.className = 'jcalendar-backdrop';
    calendar.appendChild(calendarBackdrop);

    // Methods
    obj.open = function (value) {
        if (! calendar.classList.contains('jcalendar-focus')) {
            if (jSuites.calendar.current) {
                jSuites.calendar.current.close();
            }
            // Current
            jSuites.calendar.current = obj;
            // Show calendar
            calendar.classList.add('jcalendar-focus');
            // Get days
            obj.getDays();
            // Hour
            if (obj.options.time) {
                calendarSelectHour.value = obj.date[3];
                calendarSelectMin.value = obj.date[4];
            }

            // Get the position of the corner helper
            if (jSuites.getWindowWidth() < 800 || obj.options.fullscreen) {
                // Full
                calendar.classList.add('jcalendar-fullsize');
                // Animation
                jSuites.slideBottom(calendarContent, 1);
            } else {
                const rect = el.getBoundingClientRect();
                const rectContent = calendarContent.getBoundingClientRect();

                if (obj.options.position) {
                    calendarContainer.style.position = 'fixed';
                    if (window.innerHeight < rect.bottom + rectContent.height) {
                        calendarContainer.style.top = (rect.top - (rectContent.height + 2)) + 'px';
                    } else {
                        calendarContainer.style.top = (rect.top + rect.height + 2) + 'px';
                    }
                    calendarContainer.style.left = rect.left + 'px';
                } else {
                    if (window.innerHeight < rect.bottom + rectContent.height) {
                        calendarContainer.style.bottom = (1 * rect.height + rectContent.height + 2) + 'px';
                    } else {
                        calendarContainer.style.top = 2 + 'px'; 
                    }
                }
            }
        }
    }

    obj.close = function (ignoreEvents, update) {
        // Current
        jSuites.calendar.current = null;

        if (update != false && el.tagName == 'INPUT') {
            obj.setValue(obj.getValue());
        }

        // Animation
        if (! ignoreEvents && typeof(obj.options.onclose) == 'function') {
            obj.options.onclose(el);
        }

        // Hide
        calendar.classList.remove('jcalendar-focus');

        return obj.getValue(); 
    }

    obj.prev = function() {
        // Check if the visualization is the days picker or years picker
        if (obj.options.mode == 'years') {
            obj.date[0] = obj.date[0] - 12;

            // Update picker table of days
            obj.getYears();
        } else {
            // Go to the previous month
            if (obj.date[1] < 2) {
                obj.date[0] = obj.date[0] - 1;
                obj.date[1] = 12;
            } else {
                obj.date[1] = obj.date[1] - 1;
            }

            // Update picker table of days
            obj.getDays();
        }
    }

    obj.next = function() {
        // Check if the visualization is the days picker or years picker
        if (obj.options.mode == 'years') {
            obj.date[0] = parseInt(obj.date[0]) + 12;

            // Update picker table of days
            obj.getYears();
        } else {
            // Go to the previous month
            if (obj.date[1] > 11) {
                obj.date[0] = obj.date[0] + 1;
                obj.date[1] = 1;
            } else {
                obj.date[1] = obj.date[1] + 1;
            }

            // Update picker table of days
            obj.getDays();
        }
    }

    obj.setValue = function(val) {
        if (val) {
            // Keep value
            obj.options.value = val;
            // Set label
            var value = obj.setLabel(val, obj.options.format);
            var date = obj.options.value.split(' ');
            if (! date[1]) {
                date[1] = '00:00:00';
            }
            var time = date[1].split(':')
            var date = date[0].split('-');
            var y = parseInt(date[0]);
            var m = parseInt(date[1]);
            var d = parseInt(date[2]);
            var h = parseInt(time[0]);
            var i = parseInt(time[1]);
            obj.date = [ y, m, d, h, i, 0 ];
            var val = obj.setLabel(val, obj.options.format);

            if (el.value != val) {
                el.value = val;
                // On change
                if (typeof(obj.options.onchange) ==  'function') {
                    obj.options.onchange(el, val, obj.date);
                }
            }

            obj.getDays();
        }
    }

    obj.getValue = function() {
        if (obj.date) {
            if (obj.options.time) {
                return two(obj.date[0]) + '-' + two(obj.date[1]) + '-' + two(obj.date[2]) + ' ' + two(obj.date[3]) + ':' + two(obj.date[4]) + ':' + two(0);
            } else {
                return two(obj.date[0]) + '-' + two(obj.date[1]) + '-' + two(obj.date[2]) + ' ' + two(0) + ':' + two(0) + ':' + two(0);
            }
        } else {
            return "";
        }
    }

    /**
     * Update calendar
     */
    obj.update = function(element) {
        obj.date[2] = element.innerText;

        if (! obj.options.time) {
            obj.close();
        } else {
            obj.date[3] = calendarSelectHour.value;
            obj.date[4] = calendarSelectMin.value;
        }

        var elements = calendar.querySelector('.jcalendar-selected');
        if (elements) {
            elements.classList.remove('jcalendar-selected');
        }
        element.classList.add('jcalendar-selected')
    }

    /**
     * Set to blank
     */
    obj.reset = function() {
        // Clear element
        obj.date = null;
        // Reset element
        el.value = '';
        // Close calendar
        obj.close();
    }

    /**
     * Get calendar days
     */
    obj.getDays = function() {
        // Mode
        obj.options.mode = 'days';

        // Variables
        var d = 0;
        var today = 0;
        var today_d = 0;
        var calendar_day;

        // Setting current values in case of NULLs
        var date = new Date();

        var year = obj.date && obj.date[0] ? obj.date[0] : parseInt(date.getFullYear());
        var month = obj.date && obj.date[1] ? obj.date[1] : parseInt(date.getMonth()) + 1;
        var day = obj.date && obj.date[2] ? obj.date[2] : parseInt(date.getDay());
        var hour = obj.date && obj.date[3] ? obj.date[3] : parseInt(date.getHours());
        var min = obj.date && obj.date[4] ? obj.date[4] : parseInt(date.getMinutes());

        obj.date = [year, month, day, hour, min, 0 ];

        // Update title
        calendarLabelYear.innerHTML = year;
        calendarLabelMonth.innerHTML = obj.options.months[month - 1];

        // Flag if this is the current month and year
        if ((date.getMonth() == month-1) && (date.getFullYear() == year)) {
            today = 1;
            today_d = date.getDate();
        }

        var date = new Date(year, month, 0, 0, 0);
        var nd = date.getDate();

        var date = new Date(year, month-1, 0, hour, min);
        var fd = date.getDay() + 1;

        // Reset table
        calendarBody.innerHTML = '';

        // Weekdays Row
        var row = document.createElement('tr');
        row.setAttribute('align', 'center');
        calendarBody.appendChild(row);

        for (var i = 0; i < 7; i++) {
            var cell = document.createElement('td');
            cell.setAttribute('width', '30');
            cell.classList.add('jcalendar-weekday')
            cell.innerHTML = obj.options.weekdays_short[i];
            row.appendChild(cell);
        }

        // Avoid a blank line
        if (fd == 7) {
            var j = 7;
        } else {
            var j = 0;
        }

        // Days inside the table
        var row = document.createElement('tr');
        row.setAttribute('align', 'center');
        calendarBody.appendChild(row);

        // Days in the month
        for (var i = j; i < (Math.ceil((nd + fd) / 7) * 7); i++) {
            // Create row
            if ((i > 0) && (!(i % 7))) {
                var row = document.createElement('tr');
                row.setAttribute('align', 'center');
                calendarBody.appendChild(row);
            }

            if ((i >= fd) && (i < nd + fd)) {
                d += 1;
            } else {
                d = 0;
            }

            // Create cell
            var cell = document.createElement('td');
            cell.setAttribute('width', '30');
            cell.classList.add('jcalendar-set-day');
            row.appendChild(cell);

            if (d == 0) {
                cell.innerHTML = '';
            } else {
                if (d < 10) {
                    cell.innerHTML = 0 + d;
                } else {
                    cell.innerHTML = d;
                }
            }

            // Selected
            if (d && d == day) {
                cell.classList.add('jcalendar-selected');
            }

            // Sundays
            if (! (i % 7)) {
                cell.style.color = 'red';
            }

            // Today
            if ((today == 1) && (today_d == d)) {
                cell.style.fontWeight = 'bold';
            }
        }

        // Show time controls
        if (obj.options.time) {
            calendarControlsTime.style.display = '';
        } else {
            calendarControlsTime.style.display = 'none';
        }
    }

    obj.getMonths = function() {
        // Mode
        obj.options.mode = 'months';

        // Loading month labels
        var months = obj.options.months;

        // Update title
        calendarLabelYear.innerHTML = obj.date[0];
        calendarLabelMonth.innerHTML = '';

        // Create months table
        var html = '<td colspan="7"><table width="100%"><tr align="center">';

        for (i = 0; i < 12; i++) {
            if ((i > 0) && (!(i % 4))) {
                html += '</tr><tr align="center">';
            }

            var month = parseInt(i) + 1;
            html += '<td class="jcalendar-set-month" data-value="' + month + '">' + months[i] +'</td>';
        }

        html += '</tr></table></td>';

        calendarBody.innerHTML = html;
    }

    obj.getYears = function() { 
        // Mode
        obj.options.mode = 'years';

        // Array of years
        var y = [];
        for (i = 0; i < 25; i++) {
            y[i] = parseInt(obj.date[0]) + (i - 12);
        }

        // Assembling the year tables
        var html = '<td colspan="7"><table width="100%"><tr align="center">';

        for (i = 0; i < 25; i++) {
            if ((i > 0) && (!(i % 5))) {
                html += '</tr><tr align="center">';
            }
            html += '<td class="jcalendar-set-year">'+ y[i] +'</td>';
        }

        html += '</tr></table></td>';

        calendarBody.innerHTML = html;
    }

    obj.setLabel = function(value, format) {
        return jSuites.calendar.getDateString(value, format);
    }

    obj.fromFormatted = function (value, format) {
        return jSuites.calendar.extractDateFromString(value, format);
    }

    // Add properties
    el.setAttribute('autocomplete', 'off');
    el.setAttribute('data-mask', obj.options.format.toLowerCase());

    if (obj.options.readonly) {
        el.setAttribute('readonly', 'readonly');
    }

    if (obj.options.placeholder) {
        el.setAttribute('placeholder', obj.options.placeholder);
    }

    var mouseUpControls = function(e) {
        var action = e.target.className;

        // Object id
        if (action == 'jcalendar-prev') {
            obj.prev();
            e.stopPropagation();
            e.preventDefault();
        } else if (action == 'jcalendar-next') {
            obj.next();
            e.stopPropagation();
            e.preventDefault();
        } else if (action == 'jcalendar-month') {
            obj.getMonths();
            e.stopPropagation();
            e.preventDefault();
        } else if (action == 'jcalendar-year') {
            obj.getYears();
            e.stopPropagation();
            e.preventDefault();
        } else if (action == 'jcalendar-set-year') {
            obj.date[0] = e.target.innerText;
            obj.getDays();
            e.stopPropagation();
            e.preventDefault();
        } else if (action == 'jcalendar-set-month') {
            obj.date[1] = parseInt(e.target.getAttribute('data-value'));
            obj.getDays();
            e.stopPropagation();
            e.preventDefault();
        } else if (action == 'jcalendar-confirm' || action == 'jcalendar-update') {
            obj.close();
            e.stopPropagation();
            e.preventDefault();
        } else if (action == 'jcalendar-close') {
            obj.close();
            e.stopPropagation();
            e.preventDefault();
        } else if (action == 'jcalendar-backdrop') {
            obj.close(false, false);
            e.stopPropagation();
            e.preventDefault();
        } else if (action == 'jcalendar-reset') {
            obj.reset();
            e.stopPropagation();
            e.preventDefault();
        } else if (e.target.classList.contains('jcalendar-set-day')) {
            if (e.target.innerText) {
                obj.update(e.target);
                e.stopPropagation();
                e.preventDefault();
            }
        }
    }

    var keyUpControls = function(e) {
        if (e.target.value && e.target.value.length > 3) {
            var test = jSuites.calendar.extractDateFromString(e.target.value, obj.options.format);
            if (test) {
                if (e.target.getAttribute('data-completed') == 'true') {
                    obj.setValue(test);
                }
            }
        }
    }

    var verifyControls = function(e) {
        console.log(e.target.className)
    }

    // Handle events
    el.addEventListener("keyup", keyUpControls);

    // Add global events
    calendar.addEventListener("swipeleft", function(e) {
        jSuites.slideLeft(calendarTable, 0, function() {
            obj.next();
            jSuites.slideRight(calendarTable, 1);
        });
        e.preventDefault();
        e.stopPropagation();
    });

    calendar.addEventListener("swiperight", function(e) {
        jSuites.slideRight(calendarTable, 0, function() {
            obj.prev();
            jSuites.slideLeft(calendarTable, 1);
        });
        e.preventDefault();
        e.stopPropagation();
    });

    if ('ontouchend' in document.documentElement === true) {
        calendar.addEventListener("touchend", mouseUpControls);

        el.addEventListener("touchend", function(e) {
            obj.open();
        });
    } else {
        calendar.addEventListener("mouseup", mouseUpControls);

        el.addEventListener("mouseup", function(e) {
            obj.open();
        });
    }

    // Append element to the DOM
    el.parentNode.insertBefore(calendar, el.nextSibling);

    // Keep object available from the node
    el.calendar = obj;

    if (obj.options.opened == true) {
        obj.open();
    }

    return obj;
});

jSuites.calendar.prettify = function(d, texts) {
    if (! texts) {
        var texts = {
            justNow: 'Just now',
            xMinutesAgo: '{0}m ago',
            xHoursAgo: '{0}h ago',
            xDaysAgo: '{0}d ago',
            xWeeksAgo: '{0}w ago',
            xMonthsAgo: '{0} mon ago',
            xYearsAgo: '{0}y ago',
        }
    }

    var d1 = new Date();
    var d2 = new Date(d);
    var total = parseInt((d1 - d2) / 1000 / 60);

    String.prototype.format = function(o) {
        return this.replace('{0}', o);
    }

    if (total == 0) {
        var text = texts.justNow;
    } else if (total < 90) {
        var text = texts.xMinutesAgo.format(total);
    } else if (total < 1440) { // One day
        var text = texts.xHoursAgo.format(Math.round(total/60));
    } else if (total < 20160) { // 14 days
        var text = texts.xDaysAgo.format(Math.round(total / 1440));
    } else if (total < 43200) { // 30 days
        var text = texts.xWeeksAgo.format(Math.round(total / 10080));
    } else if (total < 1036800) { // 24 months
        var text = texts.xMonthsAgo.format(Math.round(total / 43200));
    } else { // 24 months+
        var text = texts.xYearsAgo.format(Math.round(total / 525600));
    }

    return text;
}

jSuites.calendar.prettifyAll = function() {
    var elements = document.querySelectorAll('.prettydate');
    for (var i = 0; i < elements.length; i++) {
        if (elements[i].getAttribute('data-date')) {
            elements[i].innerHTML = jSuites.calendar.prettify(elements[i].getAttribute('data-date'));
        } else {
            elements[i].setAttribute('data-date', elements[i].innerHTML);
            elements[i].innerHTML = jSuites.calendar.prettify(elements[i].innerHTML);
        }
    }
}

jSuites.calendar.now = function() {
    var date = new Date();
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    var d = date.getDate();
    var h = date.getHours();
    var i = date.getMinutes();
    var s = date.getSeconds();

    // Two digits
    var two = function(value) {
        value = '' + value;
        if (value.length == 1) {
            value = '0' + value;
        }
        return value;
    }

    return two(y) + '-' + two(m) + '-' + two(d) + ' ' + two(h) + ':' + two(i) + ':' + two(s);
}

// Helper to extract date from a string
jSuites.calendar.extractDateFromString = function(date, format) {
    var v1 = '' + date;
    var v2 = format.replace(/[0-9]/g,'');

    var test = 1;

    // Get year
    var y = v2.search("YYYY");
    y = v1.substr(y,4);
    if (parseInt(y) != y) {
        test = 0;
    }

    // Get month
    var m = v2.search("MM");
    m = v1.substr(m,2);
    if (parseInt(m) != m || d > 12) {
        test = 0;
    }

    // Get day
    var d = v2.search("DD");
    d = v1.substr(d,2);
    if (parseInt(d) != d  || d > 31) {
        test = 0;
    }

    // Get hour
    var h = v2.search("HH");
    if (h >= 0) {
        h = v1.substr(h,2);
        if (! parseInt(h) || h > 23) {
            h = '00';
        }
    } else {
        h = '00';
    }
    
    // Get minutes
    var i = v2.search("MI");
    if (i >= 0) {
        i = v1.substr(i,2);
        if (! parseInt(i) || i > 59) {
            i = '00';
        }
    } else {
        i = '00';
    }

    // Get seconds
    var s = v2.search("SS");
    if (s >= 0) {
        s = v1.substr(s,2);
        if (! parseInt(s) || s > 59) {
            s = '00';
        }
    } else {
        s = '00';
    }

    if (test == 1 && date.length == v2.length) {
        // Update source
        var data = y + '-' + m + '-' + d + ' ' + h + ':' +  i + ':' + s;

        return data;
    }

    return '';
}

// Helper to convert date into string
jSuites.calendar.getDateString = function(value, format) {
    // Default calendar
    if (! format) {
        var format = 'DD/MM/YYYY';
    }

    if (value) {
        var d = ''+value;
        d = d.split(' ');

        var h = '';
        var m = '';
        var s = '';

        if (d[1]) {
            h = d[1].split(':');
            m = h[1] ? h[1] : '00';
            s = h[2] ? h[2] : '00';
            h = h[0] ? h[0] : '00';
        } else {
            h = '00';
            m = '00';
            s = '00';
        }

        d = d[0].split('-');

        if (d[0] && d[1] && d[2] && d[0] > 0 && d[1] > 0 && d[1] < 13 && d[2] > 0 && d[2] < 32) {
            var calendar = new Date(d[0], d[1]-1, d[2]);
            var weekday = new Array('Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday');
            var months = new Array('Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec');

            d[1] = (d[1].length < 2 ? '0' : '') + d[1];
            d[2] = (d[2].length < 2 ? '0' : '') + d[2];
            h = (h.length < 2 ? '0' : '') + h;
            m = (m.length < 2 ? '0' : '') + m;
            s = (s.length < 2 ? '0' : '') + s;

            value = format;
            value = value.replace('WD', weekday[calendar.getDay()]);
            value = value.replace('DD', d[2]);
            value = value.replace('MM', d[1]);
            value = value.replace('YYYY', d[0]);
            value = value.replace('YY', d[0].substring(2,4));
            value = value.replace('MON', months[parseInt(d[1])-1].toUpperCase());

            if (h) {
                value = value.replace('HH24', h);
            }

            if (h > 12) {
                value = value.replace('HH12', h - 12);
                value = value.replace('HH', h);
            } else {
                value = value.replace('HH12', h);
                value = value.replace('HH', h);
            }

            value = value.replace('MI', m);
            value = value.replace('MM', m);
            value = value.replace('SS', s);
        } else {
            value = '';
        }
    }

    return value;
}

jSuites.calendar.isOpen = function(e) {
    if (jSuites.calendar.current) {
        if (! e.target.className || e.target.className.indexOf('jcalendar') == -1) {
            jSuites.calendar.current.close();
        }
    }
}

if ('ontouchstart' in document.documentElement === true) {
    document.addEventListener("touchstart", jSuites.calendar.isOpen);
} else {
    document.addEventListener("mousedown", jSuites.calendar.isOpen);
}

jSuites.color = (function(el, options) {
    var obj = {};
    obj.options = {};
    obj.values = [];

    // Global container
    if (! jSuites.color.current) {
        jSuites.color.current = null;
    }

    /**
     * @typedef {Object} defaults
     * @property {(string|Array)} value - Initial value of the compontent
     * @property {string} placeholder - The default instruction text on the element
     * @property {requestCallback} onchange - Method to be execute after any changes on the element
     * @property {requestCallback} onclose - Method to be execute when the element is closed
     */
    var defaults = {
        placeholder: '',
        value: null,
        onclose: null,
        onchange: null,
    };

    // Loop through our object
    for (var property in defaults) {
        if (options && options.hasOwnProperty(property)) {
            obj.options[property] = options[property];
        } else {
            obj.options[property] = defaults[property];
        }
    }

    var palette = {
          "red": {
            "50": "#ffebee",
            "100": "#ffcdd2",
            "200": "#ef9a9a",
            "300": "#e57373",
            "400": "#ef5350",
            "500": "#f44336",
            "600": "#e53935",
            "700": "#d32f2f",
            "800": "#c62828",
            "900": "#b71c1c",
          },
          "pink": {
            "50": "#fce4ec",
            "100": "#f8bbd0",
            "200": "#f48fb1",
            "300": "#f06292",
            "400": "#ec407a",
            "500": "#e91e63",
            "600": "#d81b60",
            "700": "#c2185b",
            "800": "#ad1457",
            "900": "#880e4f",
          },
          "purple": {
            "50": "#f3e5f5",
            "100": "#e1bee7",
            "200": "#ce93d8",
            "300": "#ba68c8",
            "400": "#ab47bc",
            "500": "#9c27b0",
            "600": "#8e24aa",
            "700": "#7b1fa2",
            "800": "#6a1b9a",
            "900": "#4a148c",
          },
          "indigo": {
            "50": "#e8eaf6",
            "100": "#c5cae9",
            "200": "#9fa8da",
            "300": "#7986cb",
            "400": "#5c6bc0",
            "500": "#3f51b5",
            "600": "#3949ab",
            "700": "#303f9f",
            "800": "#283593",
            "900": "#1a237e",
          },
          "blue": {
            "50": "#e3f2fd",
            "100": "#bbdefb",
            "200": "#90caf9",
            "300": "#64b5f6",
            "400": "#42a5f5",
            "500": "#2196f3",
            "600": "#1e88e5",
            "700": "#1976d2",
            "800": "#1565c0",
            "900": "#0d47a1",
          },
          "cyan": {
            "50": "#e0f7fa",
            "100": "#b2ebf2",
            "200": "#80deea",
            "300": "#4dd0e1",
            "400": "#26c6da",
            "500": "#00bcd4",
            "600": "#00acc1",
            "700": "#0097a7",
            "800": "#00838f",
            "900": "#006064",
          },
          "teal": {
            "50": "#e0f2f1",
            "100": "#b2dfdb",
            "200": "#80cbc4",
            "300": "#4db6ac",
            "400": "#26a69a",
            "500": "#009688",
            "600": "#00897b",
            "700": "#00796b",
            "800": "#00695c",
            "900": "#004d40",
          },
          "green": {
            "50": "#e8f5e9",
            "100": "#c8e6c9",
            "200": "#a5d6a7",
            "300": "#81c784",
            "400": "#66bb6a",
            "500": "#4caf50",
            "600": "#43a047",
            "700": "#388e3c",
            "800": "#2e7d32",
            "900": "#1b5e20",
          },
          "lightgreen": {
            "50": "#f1f8e9",
            "100": "#dcedc8",
            "200": "#c5e1a5",
            "300": "#aed581",
            "400": "#9ccc65",
            "500": "#8bc34a",
            "600": "#7cb342",
            "700": "#689f38",
            "800": "#558b2f",
            "900": "#33691e",
          },
          "lime": {
            "50": "#f9fbe7",
            "100": "#f0f4c3",
            "200": "#e6ee9c",
            "300": "#dce775",
            "400": "#d4e157",
            "500": "#cddc39",
            "600": "#c0ca33",
            "700": "#afb42b",
            "800": "#9e9d24",
            "900": "#827717",
          },
          "yellow": {
            "50": "#fffde7",
            "100": "#fff9c4",
            "200": "#fff59d",
            "300": "#fff176",
            "400": "#ffee58",
            "500": "#ffeb3b",
            "600": "#fdd835",
            "700": "#fbc02d",
            "800": "#f9a825",
            "900": "#f57f17",
          },
          "amber": {
            "50": "#fff8e1",
            "100": "#ffecb3",
            "200": "#ffe082",
            "300": "#ffd54f",
            "400": "#ffca28",
            "500": "#ffc107",
            "600": "#ffb300",
            "700": "#ffa000",
            "800": "#ff8f00",
            "900": "#ff6f00",
          },
          "orange": {
            "50": "#fff3e0",
            "100": "#ffe0b2",
            "200": "#ffcc80",
            "300": "#ffb74d",
            "400": "#ffa726",
            "500": "#ff9800",
            "600": "#fb8c00",
            "700": "#f57c00",
            "800": "#ef6c00",
            "900": "#e65100",
          },
          "deeporange": {
            "50": "#fbe9e7",
            "100": "#ffccbc",
            "200": "#ffab91",
            "300": "#ff8a65",
            "400": "#ff7043",
            "500": "#ff5722",
            "600": "#f4511e",
            "700": "#e64a19",
            "800": "#d84315",
            "900": "#bf360c",
          },
          "brown": {
            "50": "#efebe9",
            "100": "#d7ccc8",
            "200": "#bcaaa4",
            "300": "#a1887f",
            "400": "#8d6e63",
            "500": "#795548",
            "600": "#6d4c41",
            "700": "#5d4037",
            "800": "#4e342e",
            "900": "#3e2723"
          },
          "grey": {
            "50": "#fafafa",
            "100": "#f5f5f5",
            "200": "#eeeeee",
            "300": "#e0e0e0",
            "400": "#bdbdbd",
            "500": "#9e9e9e",
            "600": "#757575",
            "700": "#616161",
            "800": "#424242",
            "900": "#212121"
          },
          "bluegrey": {
            "50": "#eceff1",
            "100": "#cfd8dc",
            "200": "#b0bec5",
            "300": "#90a4ae",
            "400": "#78909c",
            "500": "#607d8b",
            "600": "#546e7a",
            "700": "#455a64",
            "800": "#37474f",
            "900": "#263238"
          }
    };

    var x = 0;
    var y = 0;
    var colors = [];

    var col = Object.keys(palette);
    var shade = Object.keys(palette[col[0]]);

    for (var i = 0; i < col.length; i++) {
        for (var j = 0; j < shade.length; j++) {
            if (! colors[j]) {
                colors[j] = [];
            }
            colors[j][i] = palette[col[i]][shade[j]];
        }
    };

    // Value
    if (obj.options.value) {
        el.value = obj.options.value;
    }

    // Table container
    var container = document.createElement('div');
    container.className = 'jcolor';

    // Table container
    var backdrop = document.createElement('div');
    backdrop.className = 'jcolor-backdrop';
    container.appendChild(backdrop);

    // Content
    var content = document.createElement('div');
    content.className = 'jcolor-content';

    // Close button
    var closeButton  = document.createElement('div');
    closeButton.className = 'jcolor-close';
    closeButton.innerHTML = 'Done';
    closeButton.onclick = function() {
        obj.close();
    }
    content.appendChild(closeButton);

    // Table pallete
    var table = document.createElement('table');
    table.setAttribute('cellpadding', '7');
    table.setAttribute('cellspacing', '0');

    for (var i = 0; i < colors.length; i++) {
        var tr = document.createElement('tr');
        for (var j = 0; j < colors[i].length; j++) {
            var td = document.createElement('td');
            td.style.backgroundColor = colors[i][j];
            td.setAttribute('data-value', colors[i][j]);
            td.innerHTML = '';
            tr.appendChild(td);

            // Selected color
            if (obj.options.value == colors[i][j]) {
                td.classList.add('jcolor-selected');
            }

            // Possible values
            obj.values[colors[i][j]] = td;
        }
        table.appendChild(tr);
    }

    /**
     * Open color pallete
     */
    obj.open = function() {
        if (jSuites.color.current) {
            if (jSuites.color.current != obj) {
                jSuites.color.current.close();
            }
        }

        if (! jSuites.color.current) {
            // Persist element
            jSuites.color.current = obj;
            // Show colorpicker
            container.classList.add('jcolor-focus');

            const rectContent = content.getBoundingClientRect();

            if (jSuites.getWindowWidth() < 800) {
                content.style.top = '';
                content.classList.add('jcolor-fullscreen');
                jSuites.slideBottom(content, 1);
                backdrop.style.display = 'block';
            } else {
                if (content.classList.contains('jcolor-fullscreen')) {
                    content.classList.remove('jcolor-fullscreen');
                    backdrop.style.display = '';
                }

                const rect = el.getBoundingClientRect();

                if (window.innerHeight < rect.bottom + rectContent.height) {
                    content.style.top = -1 * (rectContent.height + 2) + 'px';
                } else {
                    content.style.top = rect.height + 'px';
                }
            }

            container.focus();
        }
    }

    /**
     * Close color pallete
     */
    obj.close = function(ignoreEvents) {
        if (jSuites.color.current) {
            jSuites.color.current = null;
            if (! ignoreEvents && typeof(obj.options.onclose) == 'function') {
                obj.options.onclose(el);
            }
            container.classList.remove('jcolor-focus');
        }

        // Make sure backdrop is hidden
        backdrop.style.display = '';

        return obj.options.value;
    }

    /**
     * Set value
     */
    obj.setValue = function(color) {
        if (color) {
            el.value = color;
            obj.options.value = color;
        }

        // Remove current selecded mark
        var selected = container.querySelector('.jcolor-selected');
        if (selected) {
            selected.classList.remove('jcolor-selected');
        }

        // Mark cell as selected
        obj.values[color].classList.add('jcolor-selected');

        // Onchange
        if (typeof(obj.options.onchange) == 'function') {
            obj.options.onchange(el, color);
        }
    }

    /**
     * Get value
     */
    obj.getValue = function() {
        return obj.options.value;
    }

    /**
     * If element is focus open the picker
     */
    el.addEventListener("focus", function(e) {
        obj.open();
    });

    el.addEventListener("mousedown", function(e) {
        obj.open();
    });

    // Select color
    container.addEventListener("mouseup", function(e) {
        if (e.target.tagName == 'TD') {
            jSuites.color.current.setValue(e.target.getAttribute('data-value'));
            jSuites.color.current.close();
        }
    });

    // Close controller
    document.addEventListener("mousedown", function(e) {
        if (jSuites.color.current) {
            var element = jSuites.getElement(e.target, 'jcolor');
            if (! element) {
                jSuites.color.current.close();
            }
        }
    });

    // Possible to focus the container
    container.setAttribute('tabindex', '900');

    // Placeholder
    if (obj.options.placeholder) {
        el.setAttribute('placeholder', obj.options.placeholder);
    }

    // Append to the table
    content.appendChild(table);
    container.appendChild(content);

    // Insert picker after the element
    el.parentNode.insertBefore(container, el);

    // Keep object available from the node
    el.color = obj;

    return obj;
});


jSuites.contextmenu = (function(el, options) {
    var obj = {};
    obj.options = {};

    // Default configuration
    var defaults = {
        items: null,
        onclick: null,
    };

    // Loop through our object
    for (var property in defaults) {
        if (options && options.hasOwnProperty(property)) {
            obj.options[property] = options[property];
        } else {
            obj.options[property] = defaults[property];
        }
    }

    // Class definition
    el.classList.add('jcontextmenu');
    // Focusable
    el.setAttribute('tabindex', '900');

    /**
     * Open contextmenu
     */
    obj.open = function(e, items) {
        if (items) {
            // Update content
            obj.options.items = items;
            // Create items
            obj.create(items);
        }
        // Coordinates
        if (e.target) {
            var x = e.clientX;
            var y = e.clientY;
        } else {
            var x = e.x;
            var y = e.y;
        }

        el.classList.add('jcontextmenu-focus');
        el.focus();

        const rect = el.getBoundingClientRect();

        if (window.innerHeight < y + rect.height) {
            el.style.top = (y - rect.height) + 'px';
        } else {
            el.style.top = y + 'px';
        }

        if (window.innerWidth < x + rect.width) {
            if (x - rect.width > 0) {
                el.style.left = (x - rect.width) + 'px';
            } else {
                el.style.left = '10px';
            }
        } else {
            el.style.left = x + 'px';
        }
    }

    /**
     * Close menu
     */
    obj.close = function() {
        if (el.classList.contains('jcontextmenu-focus')) {
            el.classList.remove('jcontextmenu-focus');
        }
    }

    /**
     * Create items based on the declared objectd
     * @param {object} items - List of object
     */
    obj.create = function(items) {
        // Update content
        el.innerHTML = '';

        // Append items
        for (var i = 0; i < items.length; i++) {
            if (items[i].type && items[i].type == 'line') {
                var itemContainer = document.createElement('hr');
            } else {
                var itemContainer = document.createElement('div');
                var itemText = document.createElement('a');
                itemText.innerHTML = items[i].title;

                if (items[i].disabled) {
                    itemContainer.className = 'jcontextmenu-disabled';
                } else if (items[i].onclick) {
                    itemContainer.method = items[i].onclick;
                    itemContainer.addEventListener("mouseup", function() {
                        // Execute method
                        this.method(this);
                    });
                }
                itemContainer.appendChild(itemText);

                if (items[i].shortcut) {
                    var itemShortCut = document.createElement('span');
                    itemShortCut.innerHTML = items[i].shortcut;
                    itemContainer.appendChild(itemShortCut);
                }
            }

            el.appendChild(itemContainer);
        }
    }

    if (typeof(obj.options.onclick) == 'function') {
        el.addEventListener('click', function(e) {
            obj.options.onclick(obj);
        });
    }

    el.addEventListener('blur', function(e) {
        setTimeout(function() {
            obj.close();
        }, 120);
    });

    window.addEventListener("mousewheel", function() {
        obj.close();
    });

    // Create items
    if (obj.options.items) {
        obj.create(obj.options.items);
    }

    el.contextmenu = obj;

    return obj;
});

jSuites.contextmenu.getElement = function(element) {
    var foundId = 0;

    function path (element) {
        if (element.parentNode && element.getAttribute('aria-contextmenu-id')) {
            foundId = element.getAttribute('aria-contextmenu-id')
        } else {
            if (element.parentNode) {
                path(element.parentNode);
            }
        }
    }

    path(element);

    return foundId;
}

document.addEventListener("contextmenu", function(e) {
    var id = jSuites.contextmenu.getElement(e.target);
    if (id) {
        var element = document.querySelector('#' + id);
        if (! element) {
            console.error('JSUITES: Contextmenu id not found');
        } else {
            element.contextmenu.open(e);
            e.preventDefault();
        }
    }
});

/**
 * Dialog v1.0.1
 * Author: paul.hodel@gmail.com
 * https://github.com/paulhodel/jtools
 */
 
jSuites.dialog = (function() {
    var obj = {};
    obj.options = {};

    var dialog = document.createElement('div');
    dialog.setAttribute('tabindex', '901');
    dialog.className = 'jdialog';
    dialog.id = 'dialog';

    var dialogHeader = document.createElement('div');
    dialogHeader.className = 'jdialog-header';

    var dialogTitle = document.createElement('div');
    dialogTitle.className = 'jdialog-title';
    dialogHeader.appendChild(dialogTitle);

    var dialogMessage = document.createElement('div');
    dialogMessage.className = 'jdialog-message';
    dialogHeader.appendChild(dialogMessage);

    var dialogFooter = document.createElement('div');
    dialogFooter.className = 'jdialog-footer';

    var dialogContainer = document.createElement('div');
    dialogContainer.className = 'jdialog-container';
    dialogContainer.appendChild(dialogHeader);
    dialogContainer.appendChild(dialogFooter);

    // Confirm
    var dialogConfirm = document.createElement('div');
    var dialogConfirmButton = document.createElement('input');
    dialogConfirmButton.value = obj.options.confirmLabel;
    dialogConfirmButton.type = 'button';
    dialogConfirmButton.onclick = function() {
        if (typeof(obj.options.onconfirm) == 'function') {
            obj.options.onconfirm();
        }
        obj.close();
    };
    dialogConfirm.appendChild(dialogConfirmButton);
    dialogFooter.appendChild(dialogConfirm);

    // Cancel
    var dialogCancel = document.createElement('div');
    var dialogCancelButton = document.createElement('input');
    dialogCancelButton.value = obj.options.cancelLabel;
    dialogCancelButton.type = 'button';
    dialogCancelButton.onclick = function() {
        if (typeof(obj.options.oncancel) == 'function') {
            obj.options.oncancel();
        }
        obj.close();
    }
    dialogCancel.appendChild(dialogCancelButton);
    dialogFooter.appendChild(dialogCancel);

    // Dialog
    dialog.appendChild(dialogContainer);

    obj.open = function(options) {
        obj.options = options;

        if (obj.options.title) {
            dialogTitle.innerHTML = obj.options.title;
        }

        if (obj.options.message) {
            dialogMessage.innerHTML = obj.options.message;
        }

        if (! obj.options.confirmLabel) {
            obj.options.confirmLabel = 'OK';
        }
        dialogConfirmButton.value = obj.options.confirmLabel;

        if (! obj.options.cancelLabel) {
            obj.options.cancelLabel = 'Cancel';
        }
        dialogCancelButton.value = obj.options.cancelLabel;

        if (obj.options.type == 'confirm') {
            dialogCancelButton.parentNode.style.display = '';
        } else {
            dialogCancelButton.parentNode.style.display = 'none';
        }

        // Append element to the app
        dialog.style.opacity = 100;

        // Append to the page
        if (jSuites.el) {
            jSuites.el.appendChild(dialog);
        } else {
            document.body.appendChild(dialog);
        }

        // Focus
        dialog.focus();

        // Show
        setTimeout(function() {
            dialogContainer.style.opacity = 100;
        }, 0);
    };

    obj.close = function() {
        dialog.style.opacity = 0;
        dialogContainer.style.opacity = 0;
        setTimeout(function() {
            dialog.remove();
        }, 100);
    };

    return obj;
})();

jSuites.confirm = (function(message, onconfirm) {
    if (jSuites.getWindowWidth() < 800) {
        jSuites.dialog.open({
            type: 'confirm',
            message: message,
            title: 'Confirmation',
            onconfirm: onconfirm,
        });
    } else {
        if (confirm(message)) {
            onconfirm();
        }
    }
});

jSuites.alert = function(message) {
    if (jSuites.getWindowWidth() < 800) {
        jSuites.dialog.open({
            title:'Alert',
            message:message,
        });
    } else {
        alert(message);
    }
}


jSuites.dropdown = (function(el, options) {
    var obj = {};
    obj.options = {};

    // If the element is a SELECT tag, create a configuration object
    if (el.tagName == 'SELECT') {
        var ret = jSuites.dropdown.extractFromDom(el, options);
        el = ret.el;
        options = ret.options;
    }

    // Default configuration
    var defaults = {
        url: null,
        data: [],
        multiple: false,
        autocomplete: false,
        type: null,
        width: null,
        opened: false,
        value: null,
        placeholder: '',
        position: false,
        onchange: null,
        onload: null,
        onopen: null,
        onclose: null,
        onblur: null,
    };

    // Loop through our object
    for (var property in defaults) {
        if (options && options.hasOwnProperty(property)) {
            obj.options[property] = options[property];
        } else {
            obj.options[property] = defaults[property];
        }
    }

    // Global container
    if (! jSuites.dropdown.current) {
        jSuites.dropdown.current = null;
    }

    // Containers
    obj.items = [];
    obj.groups = [];
    obj.selected = [];

    // Create dropdown
    el.classList.add('jdropdown');
 
    if (obj.options.type == 'searchbar') {
        el.classList.add('jdropdown-searchbar');
    } else if (obj.options.type == 'list') {
        el.classList.add('jdropdown-list');
    } else if (obj.options.type == 'picker') {
        el.classList.add('jdropdown-picker');
    } else {
        if (jSuites.getWindowWidth() < 800) {
            el.classList.add('jdropdown-picker');
            obj.options.type = 'picker';
        } else {
            if (obj.options.width) {
                el.style.width = obj.options.width;
                el.style.minWidth = obj.options.width;
            }
            el.classList.add('jdropdown-default');
            obj.options.type = 'default';
        }
    }

    // Header container
    var containerHeader = document.createElement('div');
    containerHeader.className = 'jdropdown-container-header';

    // Header
    var header = document.createElement('input');
    header.className = 'jdropdown-header';
    if (typeof(obj.options.onblur) == 'function') {
        header.onblur = function() {
            obj.options.onblur(el);
        }
    }

    // Container
    var container = document.createElement('div');
    container.className = 'jdropdown-container';

    // Dropdown content
    var content = document.createElement('div');
    content.className = 'jdropdown-content';

    // Close button
    var closeButton  = document.createElement('div');
    closeButton.className = 'jdropdown-close';
    closeButton.innerHTML = 'Done';

    // Create backdrop
    var backdrop  = document.createElement('div');
    backdrop.className = 'jdropdown-backdrop';

    // Autocomplete
    if (obj.options.autocomplete == true) {
        el.setAttribute('data-autocomplete', true);

        // Handler
        var keyTimer = null;
        header.addEventListener('keyup', function(e) {
            if (keyTimer) {
                clearTimeout(keyTimer);
            }
            keyTimer = setTimeout(function() {
                obj.find(header.value);
                keyTimer = null;
            }, 500);

            if (! el.classList.contains('jdropdown-focus')) {
                if (e.which > 65) {
                    obj.open();
                }
            }
        });
    } else {
        header.setAttribute('readonly', 'readonly');
    }

    // Place holder
    if (! obj.options.placeholder && el.getAttribute('placeholder')) {
        obj.options.placeholder = el.getAttribute('placeholder');
    }

    if (obj.options.placeholder) {
        header.setAttribute('placeholder', obj.options.placeholder);
    }

    // Append elements
    containerHeader.appendChild(header);
    if (obj.options.type == 'searchbar') {
        containerHeader.appendChild(closeButton);
    } else {
        container.appendChild(closeButton);
    }
    container.appendChild(content);
    el.appendChild(containerHeader);
    el.appendChild(container);
    el.appendChild(backdrop);

    /**
     * Init dropdown
     */
    obj.init = function() {
        if (obj.options.url) {
            jSuites.ajax({
                url: obj.options.url,
                method: 'GET',
                dataType: 'json',
                success: function(data) {
                    if (data) {
                        // Set data
                        obj.setData(data);
                        // Set value
                        if (obj.options.value != null) {
                            obj.setValue(obj.options.value);
                        }
                        // Onload method
                        if (typeof(obj.options.onload) == 'function') {
                            obj.options.onload(el, obj, data);
                        }
                    }
                }
            });
        } else {
            // Set data
            obj.setData();
            // Set value
            if (obj.options.value != null) {
                obj.setValue(obj.options.value);
            }
            // Onload
            if (typeof(obj.options.onload) == 'function') {
                obj.options.onload(el, obj, data);
            }
        }

        // Open dropdown
        if (obj.options.opened == true) {
            obj.open();
        }
    }

    obj.getUrl = function() {
        return obj.options.url;
    }

    obj.setUrl = function(url) {
        obj.options.url = url;

        jSuites.ajax({
            url: obj.options.url,
            method: 'GET',
            dataType: 'json',
            success: function(data) {
                obj.setData(data);
            }
        });
    }

    /**
     * Create a new item
     */
    obj.createItem = function(data) {
        // Create item
        var item = {};
        item.element = document.createElement('div');
        item.element.className = 'jdropdown-item';
        item.value = data.id;
        item.text = data.name;
        item.textLowerCase = data.name.toLowerCase();

        // Image
        if (data.image) {
            var image = document.createElement('img');
            image.className = 'jdropdown-image';
            image.src = data.image;
            if (! data.title) {
               image.classList.add('jdropdown-image-small');
            }
            item.element.appendChild(image);
        }

        // Set content
        var node = document.createElement('div');
        node.className = 'jdropdown-description';
        node.innerHTML = data.name;

        // Title
        if (data.title) {
            var title = document.createElement('div');
            title.className = 'jdropdown-title';
            title.innerHTML = data.title;
            node.appendChild(title);
        }

        // Add node to item
        item.element.appendChild(node);

        return item;
    }

    obj.setData = function(data) {
        // Update data
        if (data) {
            obj.options.data = data;
        }

        // Data
        var data = obj.options.data;

        // Make sure the content container is blank
        content.innerHTML = '';

        // Reset
        obj.reset();

        // Reset items
        obj.items = [];

        // Helpers
        var items = [];
        var groups = [];

        // Create elements
        if (data.length) {
            // Prepare data
            for (var i = 0; i < data.length; i++) {
                // Compatibility
                if (typeof(data[i]) != 'object') {
                    // Correct format
                    obj.options.data[i] = data[i] = { id: data[i], name: data[i] };
                }

                // Process groups
                if (data[i].group) {
                    if (! groups[data[i].group]) {
                        groups[data[i].group] = [];
                    }
                    groups[data[i].group].push(i);
                } else {
                    items.push(i);
                }
            }

            // Groups
            var groupNames = Object.keys(groups);

            // Append groups in case exists
            if (groupNames.length > 0) {
                for (var i = 0; i < groupNames.length; i++) {
                    // Group container
                    var group = document.createElement('div');
                    group.className = 'jdropdown-group';
                    // Group name
                    var groupName = document.createElement('div');
                    groupName.className = 'jdropdown-group-name';
                    groupName.innerHTML = groupNames[i];
                    // Group arrow
                    var groupArrow = document.createElement('i');
                    groupArrow.className = 'jdropdown-group-arrow jdropdown-group-arrow-down';
                    groupName.appendChild(groupArrow);
                    // Group items
                    var groupContent = document.createElement('div');
                    groupContent.className = 'jdropdown-group-items';
                    for (var j = 0; j < groups[groupNames[i]].length; j++) {
                        var item = obj.createItem(data[groups[groupNames[i]][j]]);
                        groupContent.appendChild(item.element);
                        // Items
                        obj.items.push(item);
                    }
                    // Group itens
                    group.appendChild(groupName);
                    group.appendChild(groupArrow);
                    group.appendChild(groupContent);
                    content.appendChild(group);
                }
            }

            if (items.length) {
                for (var i = 0; i < items.length; i++) {
                    var item = obj.createItem(data[items[i]]);
                    obj.items.push(item);
                    content.appendChild(item.element);
                }
            }

            // Create the Indexes
            for (var i = 0; i < obj.items.length; i++) {
                obj.items[i].element.setAttribute('data-index', i);
            }
        }
    }

    obj.getText = function(asArray) {
        // Result
        var result = [];
        // Append options
        for (var i = 0; i < obj.selected.length; i++) {
            if (obj.items[obj.selected[i]]) {
                result.push(obj.items[obj.selected[i]].text);
            }
        }

        if (asArray) {
            return result;
        } else {
            return result.join('; ');
        }
    }

    obj.getValue = function(asArray) {
        // Result
        var result = [];
        // Append options
        for (var i = 0; i < obj.selected.length; i++) {
            if (obj.items[obj.selected[i]]) {
                result.push(obj.items[obj.selected[i]].value);
            }
        }

        if (asArray) {
            return result;
        } else {
            return result.join(';');
        }
    }

    obj.setValue = function(value) {
        // Remove values
        for (var i = 0; i < obj.selected.length; i++) {
            obj.items[obj.selected[i]].element.classList.remove('jdropdown-selected')
        } 

        // Reset selected
        obj.selected = [];

        // Set values
        if (value != null) {
            if (Array.isArray(value)) {
                for (var i = 0; i < obj.items.length; i++) {
                    for (var j = 0; j < value.length; j++) {
                        if (obj.items[i].value == value[j]) {
                            // Keep index of the selected item
                            obj.selected.push(i);
                            // Visual selection
                            obj.items[i].element.classList.add('jdropdown-selected');
                        }
                    }
                }
            } else {
                for (var i = 0; i < obj.items.length; i++) {
                    if (obj.items[i].value == value) {
                        // Keep index of the selected item
                        obj.selected.push(i);
                        // Visual selection
                        obj.items[i].element.classList.add('jdropdown-selected');
                    }
                }
            }
        }

        // Update labels
        obj.updateLabel();
    }

    obj.selectIndex = function(index) {
        // Only select those existing elements
        if (obj.items && obj.items[index]) {
            var index = index = parseInt(index);
            // Current selection
            var oldValue = obj.getValue();
            var oldLabel = obj.getText();

            // Remove cursor style
            if (obj.currentIndex != null) {
                obj.items[obj.currentIndex].element.classList.remove('jdropdown-cursor');
            }
            // Set cursor style
            obj.items[index].element.classList.add('jdropdown-cursor');

            // Update cursor position
            obj.currentIndex = index;

            // Focus behaviour
            if (! obj.options.multiple) {
                // Unselect option
                if (obj.items[index].element.classList.contains('jdropdown-selected')) {
                    // Reset selected
                    obj.resetSelected();
                } else {
                    // Reset selected
                    obj.resetSelected();
                    // Update selected item
                    obj.items[index].element.classList.add('jdropdown-selected');
                    // Add to the selected list
                    obj.selected.push(index);
                    // Close
                    obj.close();
                }
            } else {
                // Toggle option
                if (obj.items[index].element.classList.contains('jdropdown-selected')) {
                    obj.items[index].element.classList.remove('jdropdown-selected');
                    // Remove from selected list
                    var indexToRemove = obj.selected.indexOf(index);
                    // Remove select
                    obj.selected.splice(indexToRemove, 1);
                } else {
                    // Select element
                    obj.items[index].element.classList.add('jdropdown-selected');
                    // Add to the selected list
                    obj.selected.push(index);
                }

                // Update labels for multiple dropdown
                if (! obj.options.autocomplete) {
                    obj.updateLabel();
                }
            }

            // Current selection
            var newValue = obj.getValue();
            var newLabel = obj.getText();

            // Events
            if (typeof(obj.options.onchange) == 'function') {
                obj.options.onchange(el, index, oldValue, newValue, oldLabel, newLabel);
            }
        }
    }

    obj.selectItem = function(item) {
        if (jSuites.dropdown.current) {
            var index = item.getAttribute('data-index');
            if (index != null) {
                obj.selectIndex(index);
            }
        }
    }

    obj.find = function(str) {
        // Force lowercase
        var str = str ? str.toLowerCase() : null;

        // Append options
        for (var i = 0; i < obj.items.length; i++) {
            if (str == null || obj.items[i].textLowerCase.indexOf(str) != -1) {
                obj.items[i].element.style.display = '';
            } else {
                if (obj.selected.indexOf(i) == -1) {
                    obj.items[i].element.style.display = 'none';
                } else {
                    obj.items[i].element.style.display = '';
                }
            }
        }

        var numVisibleItems = function(items) {
            var visible = 0;
            for (var j = 0; j < items.length; j++) {
                if (items[j].style.display != 'none') {
                    visible++;
                }
            }
            return visible;
        }

        // Hide groups
        /*for (var i = 0; i < obj.groups.length; i++) {
            if (numVisibleItems(obj.groups[i].querySelectorAll('.jdropdown-item'))) {
                obj.groups[i].children[0].style.display = '';
            } else {
                obj.groups[i].children[0].style.display = 'none';
            }
        }*/
    }

    obj.updateLabel = function() {
        // Update label
        header.value = obj.getText();
    }

    obj.open = function() {
        if (jSuites.dropdown.current != el) {
            if (jSuites.dropdown.current) {
                jSuites.dropdown.current.dropdown.close();
            }
            jSuites.dropdown.current = el;
        }

        // Focus
        if (! el.classList.contains('jdropdown-focus')) {
            // Add focus
            el.classList.add('jdropdown-focus');

            // Animation
            if (jSuites.getWindowWidth() < 800) {
                if (obj.options.type == null || obj.options.type == 'picker') {
                    jSuites.slideBottom(container, 1);
                }
            }

            // Filter
            if (obj.options.autocomplete == true) {
                // Redo search
                obj.find();
                // Clear search field
                header.value = '';
                header.focus();
            }

            // Set cursor for the first or first selected element
            var cursor = (obj.selected && obj.selected[0]) ? obj.selected[0] : 0;
            obj.updateCursor(cursor);

            // Container Size
            if (! obj.options.type || obj.options.type == 'default') {
                const rect = el.getBoundingClientRect();
                const rectContainer = container.getBoundingClientRect();

                if (obj.options.position) {
                    container.style.position = 'fixed';
                    if (window.innerHeight < rect.bottom + rectContainer.height) {
                        container.style.top = (rect.top - rectContainer.height - 2) + 'px';
                    } else {
                        container.style.top = (rect.top + rect.height + 1) + 'px';
                    }
                    container.style.left = rect.left + 'px';
                } else {
                    if (window.innerHeight < rect.bottom + rectContainer.height) {
                        container.style.bottom = (rect.height) + 'px';
                    } else {
                        container.style.top = '';
                        container.style.bottom = '';
                    }
                }

                container.style.minWidth = rect.width + 'px';
            }
        }

        // Events
        if (typeof(obj.options.onopen) == 'function') {
            obj.options.onopen(el);
        }
    }

    obj.close = function(ignoreEvents) {
        if (jSuites.dropdown.current) {
            // Remove controller
            jSuites.dropdown.current = null
            // Remove cursor
            obj.resetCursor();
            // Update labels
            obj.updateLabel();
            // Events
            if (! ignoreEvents && typeof(obj.options.onclose) == 'function') {
                obj.options.onclose(el);
            }
            // Blur
            if (header.blur) {
                header.blur();
            }
            // Remove focus
            el.classList.remove('jdropdown-focus');
        }

        return obj.getValue();
    }

    /**
     * Update position cursor
     */
    obj.updateCursor = function(index) {
        // Set new cursor
        if (obj.items && obj.items[index] && obj.items[index].element) {
            // Reset cursor
            obj.resetCursor();

            // Set new cursor
            obj.items[index].element.classList.add('jdropdown-cursor');

            // Update position
            obj.currentIndex = parseInt(index);
    
            // Update scroll to the cursor element
            var container = content.scrollTop;
            var element = obj.items[obj.currentIndex].element;
            content.scrollTop = element.offsetTop - element.scrollTop + element.clientTop - 95;
        }
    }

    /**
     * Reset cursor
     */
    obj.resetCursor = function() {
        // Remove current cursor
        if (obj.currentIndex != null) {
            // Remove visual cursor
            if (obj.items && obj.items[obj.currentIndex]) {
                obj.items[obj.currentIndex].element.classList.remove('jdropdown-cursor');
            }
            // Reset cursor
            obj.currentIndex = null;
        }
    }

    /**
     * Reset cursor
     */
    obj.resetSelected = function() {
        // Unselected all
        if (obj.selected) {
            // Remove visual selection
            for (var i = 0; i < obj.selected.length; i++) {
                if (obj.items[obj.selected[i]]) {
                    obj.items[obj.selected[i]].element.classList.remove('jdropdown-selected');
                }
            }
            // Reset current selected items
            obj.selected = [];
        }
    }

    /**
     * Reset cursor and selected items
     */
    obj.reset = function() {
        // Reset cursor
        obj.resetCursor();

        // Reset selected
        obj.resetSelected();

        // Update labels
        obj.updateLabel();
    }

    /**
     * First visible item
     */
    obj.firstVisible = function() {
        var newIndex = null;
        for (var i = 0; i < obj.items.length; i++) {
            if (obj.items[i].element.style.display != 'none') {
                newIndex = i;
                break;
            }
        }

        if (newIndex == null) {
            return false;
        }

        obj.updateCursor(newIndex);
    }

    /**
     * Navigation
     */
    obj.first = function() {
        var newIndex = null;
        for (var i = obj.currentIndex - 1; i >= 0; i--) {
            if (obj.items[i].element.style.display != 'none') {
                newIndex = i;
            }
        }

        if (newIndex == null) {
            return false;
        }

        obj.updateCursor(newIndex);
    }

    obj.last = function() {
        var newIndex = null;
        for (var i = obj.currentIndex + 1; i < obj.items.length; i++) {
            if (obj.items[i].element.style.display != 'none') {
                newIndex = i;
            }
        }

        if (newIndex == null) {
            return false;
        }

        obj.updateCursor(newIndex);
    }

    obj.next = function() {
        var newIndex = null;
        for (var i = obj.currentIndex + 1; i < obj.items.length; i++) {
            if (obj.items[i].element.style.display != 'none') {
                newIndex = i;
                break;
            }
        }

        if (newIndex == null) {
            return false;
        }

        obj.updateCursor(newIndex);
    }

    obj.prev = function() {
        var newIndex = null;
        for (var i = obj.currentIndex - 1; i >= 0; i--) {
            if (obj.items[i].element.style.display != 'none') {
                newIndex = i;
                break;
            }
        }

        if (newIndex == null) {
            return false;
        }

        obj.updateCursor(newIndex);
    }

    if (! jSuites.dropdown.hasEvents) {
        if ('ontouchsend' in document.documentElement === true) {
            document.addEventListener('touchsend', jSuites.dropdown.mouseup);
        } else {
            document.addEventListener('mouseup', jSuites.dropdown.mouseup);
        }
        document.addEventListener('keydown', jSuites.dropdown.onkeydown);

        jSuites.dropdown.hasEvents = true;
    }

    // Start dropdown
    obj.init();

    // Keep object available from the node
    el.dropdown = obj;

    return obj;
});

jSuites.dropdown.hasEvents = false;

jSuites.dropdown.mouseup = function(e) {
    var element = jSuites.getElement(e.target, 'jdropdown');
    if (element) {
        var dropdown = element.dropdown;
        if (e.target.classList.contains('jdropdown-header')) {
            if (element.classList.contains('jdropdown-focus') && element.classList.contains('jdropdown-default')) {
                dropdown.close();
            } else {
                dropdown.open();
            }
        } else if (e.target.classList.contains('jdropdown-group-name')) {
            var items = e.target.nextSibling.children;
            if (e.target.nextSibling.style.display != 'none') {
                for (var i = 0; i < items.length; i++) {
                    if (items[i].style.display != 'none') {
                        dropdown.selectItem(items[i]);
                    }
                }
            }
        } else if (e.target.classList.contains('jdropdown-group-arrow')) {
            if (e.target.classList.contains('jdropdown-group-arrow-down')) {
                e.target.classList.remove('jdropdown-group-arrow-down');
                e.target.classList.add('jdropdown-group-arrow-up');
                e.target.parentNode.nextSibling.style.display = 'none';
            } else {
                e.target.classList.remove('jdropdown-group-arrow-up');
                e.target.classList.add('jdropdown-group-arrow-down');
                e.target.parentNode.nextSibling.style.display = '';
            }
        } else if (e.target.classList.contains('jdropdown-item')) {
            dropdown.selectItem(e.target);
        } else if (e.target.classList.contains('jdropdown-image')) {
            dropdown.selectIndex(e.target.parentNode.getAttribute('data-index'));
        } else if (e.target.classList.contains('jdropdown-description')) {
            dropdown.selectIndex(e.target.parentNode.getAttribute('data-index'));
        } else if (e.target.classList.contains('jdropdown-title')) {
            dropdown.selectIndex(e.target.parentNode.parentNode.getAttribute('data-index'));
        } else if (e.target.classList.contains('jdropdown-close') || e.target.classList.contains('jdropdown-backdrop')) {
            // Close
            dropdown.close();
        }

        e.stopPropagation();
        e.preventDefault();
    } else {
        if (jSuites.dropdown.current) {
            jSuites.dropdown.current.dropdown.close();
        }
    }
}


// Keydown controls
jSuites.dropdown.onkeydown = function(e) {
    if (jSuites.dropdown.current) {
        // Element
        var element = jSuites.dropdown.current.dropdown;
        // Index
        var index = element.currentIndex;

        if (e.shiftKey) {

        } else {
            if (e.which == 13 || e.which == 27 || e.which == 35 || e.which == 36 || e.which == 38 || e.which == 40) {
                // Move cursor
                if (e.which == 13) {
                    element.selectIndex(index)
                } else if (e.which == 38) {
                    if (index == null) {
                        element.firstVisible();
                    } else if (index > 0) {
                        element.prev();
                    }
                } else if (e.which == 40) {
                    if (index == null) {
                        element.firstVisible();
                    } else if (index + 1 < element.options.data.length) {
                        element.next();
                    }
                } else if (e.which == 36) {
                    element.first();
                } else if (e.which == 35) {
                    element.last();
                } else if (e.which == 27) {
                    element.close();
                }

                e.stopPropagation();
                e.preventDefault();
            }
        }
    }
}

jSuites.dropdown.extractFromDom = function(el, options) {
    // Keep reference
    var select = el;
    if (! options) {
        options = {};
    }
    // Prepare configuration
    if (el.getAttribute('multiple') && (! options || options.multiple == undefined)) {
        options.multiple = true;
    }
    if (el.getAttribute('placeholder') && (! options || options.placeholder == undefined)) {
        options.placeholder = el.getAttribute('placeholder');
    }
    if (el.getAttribute('data-autocomplete') && (! options || options.autocomplete == undefined)) {
        options.autocomplete = true;
    }
    if (! options || options.width == undefined) {
        options.width = el.offsetWidth;
    }
    if (el.value && (! options || options.value == undefined)) {
        options.value = el.value;
    }
    if (! options || options.data == undefined) {
        options.data = [];
        for (var j = 0; j < el.children.length; j++) {
            if (el.children[j].tagName == 'OPTGROUP') {
                for (var i = 0; i < el.children[j].children.length; i++) {
                    options.data.push({
                        id: el.children[j].children[i].value,
                        name: el.children[j].children[i].innerHTML,
                        group: el.children[j].getAttribute('label'),
                    });
                }
            } else {
                options.data.push({
                    id: el.children[j].value,
                    name: el.children[j].innerHTML,
                });
            }
        }
    }
    if (! options || options.onchange == undefined) {
        options.onchange = function(a,b,c,d) {
            if (options.multiple == true) {
                if (obj.items[b].classList.contains('jdropdown-selected')) {
                    select.options[b].setAttribute('selected', 'selected');
                } else {
                    select.options[b].removeAttribute('selected');
                }
            } else {
                select.value = d;
            }
        }
    }
    // Create DIV
    var div = document.createElement('div');
    el.parentNode.insertBefore(div, el);
    el.style.display = 'none';
    el = div;

    return { el:el, options:options };
}

/**
 * (c) jTools Text Editor
 * https://github.com/paulhodel/jtools
 *
 * @author: Paul Hodel <paul.hodel@gmail.com>
 * @description: Inline richtext editor
 */

jSuites.editor = (function(el, options) {
    var obj = {};
    obj.options = {};

    // Default configuration
    var defaults = {
        // Initial HTML content
        value: null,
        // Initial snippet
        snippet: null,
        // Add toolbar
        toolbar: null,
        // Max height
        maxHeight: null,
        // Website parser is to read websites and images from cross domain
        remoteParser: null,
        // Key from youtube to read properties from URL
        youtubeKey: null,
        // User list
        userSearch: null,
        // Parse URL
        parseURL: false,
        // Accept drop files
        dropZone: true,
        dropAsAttachment: false,
        acceptImages: true,
        acceptFiles: false,
        maxFileSize: 5000000, 
        // Border
        border: true,
        padding: true,
        focus: false,
        // Events
        onclick: null,
        onfocus: null,
        onblur: null,
        onload: null,
        onenter: null,
        onkeyup: null,
        onkeydown: null,
    };

    // Loop through our object
    for (var property in defaults) {
        if (options && options.hasOwnProperty(property)) {
            obj.options[property] = options[property];
        } else {
            obj.options[property] = defaults[property];
        }
    }

    // Private controllers
    var imageResize = 0;
    var editorTimer = null;
    var editorAction = null;

    // Make sure element is empty
    el.innerHTML = '';

    // Prepare container
    el.classList.add('jeditor-container');

    // Padding
    if (obj.options.padding == true) {
        el.classList.add('jeditor-padding');
    }

    // Border
    if (obj.options.border == false) {
        el.style.border = '0px';
    }

    // Snippet
    var snippet = document.createElement('div');
    snippet.className = 'snippet';
    snippet.setAttribute('contenteditable', false);

    // Toolbar
    var toolbar = document.createElement('div');
    toolbar.className = 'jeditor-toolbar';

    // Create editor
    var editor = document.createElement('div');
    editor.setAttribute('contenteditable', true);
    editor.setAttribute('spellcheck', false);
    editor.className = 'jeditor';

    // Max height
    if (obj.options.maxHeight) {
        editor.style.overflowY = 'auto';
        editor.style.maxHeight = obj.options.maxHeight;
    }

    // Set editor initial value
    if (obj.options.value) {
        var value = obj.options.value;
    } else {
        var value = el.innerHTML ? el.innerHTML : ''; 
    }

    if (! value) {
        var value = '<br>';
    }

    /**
     * Extract images from a HTML string
     */
    var extractImageFromHtml = function(html) {
        // Create temp element
        var div = document.createElement('div');
        div.innerHTML = html;

        // Extract images
        var img = div.querySelectorAll('img');

        if (img.length) {
            for (var i = 0; i < img.length; i++) {
                obj.addImage(img[i].src);
            }
        }
    }

    /**
     * Insert node at caret
     */
    var insertNodeAtCaret = function(newNode) {
        var sel, range;

        if (window.getSelection) {
            sel = window.getSelection();
            if (sel.rangeCount) {
                range = sel.getRangeAt(0);
                var selectedText = range.toString();
                range.deleteContents();
                range.insertNode(newNode); 
                // move the cursor after element
                range.setStartAfter(newNode);
                range.setEndAfter(newNode); 
                sel.removeAllRanges();
                sel.addRange(range);
            }
        }
    }

    /**
     * Append snippet or thumbs in the editor
     * @Param object data
     */
    var appendElement = function(data) {
        // Reset snippet
        snippet.innerHTML = '';

        if (data.image) {
            var div = document.createElement('div');
            div.className = 'snippet-image';
            div.setAttribute('data-k', 'image');
            snippet.appendChild(div);

            var image = document.createElement('img');
            image.src = data.image;
            div.appendChild(image);
        }

        var div = document.createElement('div');
        div.className = 'snippet-title';
        div.setAttribute('data-k', 'title');
        div.innerHTML = data.title;
        snippet.appendChild(div);

        var div = document.createElement('div');
        div.className = 'snippet-description';
        div.setAttribute('data-k', 'description');
        div.innerHTML = data.description;
        snippet.appendChild(div);

        var div = document.createElement('div');
        div.className = 'snippet-host';
        div.setAttribute('data-k', 'host');
        div.innerHTML = data.host;
        snippet.appendChild(div);

        var div = document.createElement('div');
        div.className = 'snippet-url';
        div.setAttribute('data-k', 'url');
        div.innerHTML = data.url;
        snippet.appendChild(div);

        editor.appendChild(snippet);
    }

    var verifyEditor = function() {
        clearTimeout(editorTimer);
        editorTimer = setTimeout(function() {
            var snippet = editor.querySelector('.snippet');
            var thumbsContainer = el.querySelector('.jeditor-thumbs-container');

            if (! snippet && ! thumbsContainer) {
                var html = editor.innerHTML.replace(/\n/g, ' ');
                var container = document.createElement('div');
                container.innerHTML = html;
                var thumbsContainer = container.querySelector('.jeditor-thumbs-container');
                if (thumbsContainer) {
                    thumbsContainer.remove();
                }
                var text = container.innerText; 
                var url = jSuites.editor.detectUrl(text);

                if (url) {
                    if (url[0].substr(-3) == 'jpg' || url[0].substr(-3) == 'png' || url[0].substr(-3) == 'gif') {
                        if (jSuites.editor.getDomain(url[0]) == window.location.hostname) {
                            obj.importImage(url[0], '');
                        } else {
                            obj.importImage(obj.options.remoteParser + url[0], '');
                        }
                    } else {
                        var id = jSuites.editor.youtubeParser(url[0]);

                        if (id) {
                            obj.getYoutube(id);
                        } else {
                            obj.getWebsite(url[0]);
                        }
                    }
                }
            }
        }, 1000);
    }

    obj.parseContent = function() {
        verifyEditor();
    }

    /**
     * Get metadata from a youtube video
     */
    obj.getYoutube = function(id) {
        if (! obj.options.youtubeKey) {
            console.error('The youtubeKey is not defined');
        } else {
            jSuites.ajax({
                url: 'https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&key=' + obj.options.youtubeKey + '&id=' + id,
                method: 'GET',
                dataType: 'json',
                success: function(result) {
                    // Only valid elements to be appended
                    if (result.items && result.items[0]) {
                        var p = {
                            title: '',
                            description: '',
                            image: '',
                            host: 'www.youtube.com',
                            url: 'https://www.youtube.com?watch=' + id,
                        }
                        if (result.items[0].snippet.title) {
                            p.title = result.items[0].snippet.title;
                        }
                        if (result.items[0].snippet.description) {
                            p.description = result.items[0].snippet.description;

                            if (p.description.length > 150) {
                                p.description = p.description.substr(0, 150) + '...';
                            }
                        }
                        if (result.items[0].snippet.thumbnails.medium.url) {
                            p.image = result.items[0].snippet.thumbnails.medium.url;
                        }

                        appendElement(p);
                    }
                }
            });
        }
    }

    /**
     * Get meta information from a website
     */
    obj.getWebsite = function(url) {
        if (! obj.options.remoteParser) {
            console.log('The remoteParser is not defined');
        } else {
            jSuites.ajax({
                url: obj.options.remoteParser + encodeURI(url.trim()),
                method: 'GET',
                dataType: 'json',
                success: function(result) {
                    var p = {
                        title: '',
                        description: '',
                        image: '',
                        host: url,
                        url: url,
                    }

                    if (result.title) {
                        p.title = result.title;
                    }
                    if (result.description) {
                        p.description = result.description;
                    }
                    if (result.image) {
                        p.image = result.image;
                    } else if (result['og:image']) {
                        p.image = result['og:image'];
                    }
                    if (result.host) {
                        p.host = result.host;
                    }
                    if (result.url) {
                        p.url = result.url;
                    }

                    appendElement(p);
                }
            });
        }
    }

    /**
     * Set editor value
     */
    obj.setData = function(html) {
        editor.innerHTML = html;
        cursor();
    }

    /**
     * Get editor data
     */
    obj.getData = function(json) {
        if (! json) {
            var data = editor.innerHTML;
        } else {
            var data = {
                content : '',
            }

            // Get tag users
            var tagged = editor.querySelectorAll('.post-tag');
            if (tagged.length) {
                data.users = [];
                for (var i = 0; i < tagged.length; i++) {
                    var userId = tagged[i].getAttribute('data-user');
                    if (userId) {
                        data.users.push(userId);
                    }
                }
                data.users = data.users.join(',');
            }

            if (snippet.innerHTML) {
                var index = 0;
                data.snippet = {};
                for (var i = 0; i < snippet.children.length; i++) {
                    // Get key from element
                    var key = snippet.children[i].getAttribute('data-k');
                    if (key) {
                        if (key == 'image') {
                            data.snippet.image = snippet.children[i].children[0].getAttribute('src');
                        } else {
                            data.snippet[key] = snippet.children[i].innerHTML;
                        }
                    }
                }

                snippet.innerHTML = '';
                snippet.remove();
            }

            var text = editor.innerHTML;
            text = text.replace(/<br>/g, "\n");
            text = text.replace(/<\/div>/g, "<\/div>\n");
            text = text.replace(/<(?:.|\n)*?>/gm, "");
            data.content = text.trim();
            data = JSON.stringify(data);
        }

        return data;
    }

    // Reset
    obj.reset = function() {
        editor.innerHTML = '';
    }

    obj.addPdf = function(data) {
        if (data.result.substr(0,4) != 'data') {
            console.error('Invalid source');
        } else {
            var canvas = document.createElement('canvas');
            canvas.width = 60;
            canvas.height = 60;

            var img = new Image();
            var ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            canvas.toBlob(function(blob) {
                var newImage = document.createElement('img');
                newImage.src = window.URL.createObjectURL(blob);
                newImage.setAttribute('data-extension', 'pdf');
                if (data.name) {
                    newImage.setAttribute('data-name', data.name);
                }
                if (data.size) {
                    newImage.setAttribute('data-size', data.size);
                }
                if (data.date) {
                    newImage.setAttribute('data-date', data.date);
                }
                newImage.className = 'jfile pdf';

                insertNodeAtCaret(newImage);
                jSuites.files[newImage.src] = data.result.substr(data.result.indexOf(',') + 1);
            });
        }
    }

    obj.addImage = function(src, name, size, date) {
        if (src.substr(0,4) != 'data' && ! obj.options.remoteParser) {
            console.error('remoteParser not defined in your initialization');
        } else {
            // This is to process cross domain images
            if (src.substr(0,4) == 'data') {
                var extension = src.split(';')
                extension = extension[0].split('/');
                extension = extension[1];
            } else {
                var extension = src.substr(src.lastIndexOf('.') + 1);
                // Work for cross browsers
                src = obj.options.remoteParser + src;
            }

            var img = new Image();

            img.onload = function onload() {
                var canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;

                var ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                canvas.toBlob(function(blob) {
                    var newImage = document.createElement('img');
                    newImage.src = window.URL.createObjectURL(blob);
                    newImage.setAttribute('tabindex', '900');
                    newImage.setAttribute('data-extension', extension);
                    if (name) {
                        newImage.setAttribute('data-name', name);
                    }
                    if (size) {
                        newImage.setAttribute('data-size', size);
                    }
                    if (date) {
                        newImage.setAttribute('data-date', date);
                    }
                    newImage.className = 'jfile';
                    var content = canvas.toDataURL();
                    insertNodeAtCaret(newImage);

                    jSuites.files[newImage.src] = content.substr(content.indexOf(',') + 1);
                });
            };

            img.src = src;
        }
    }

    obj.addFile = function(files) {
        var reader = [];

        for (var i = 0; i < files.length; i++) {
            if (files[i].size > obj.options.maxFileSize) {
                alert('The file is too big');
            } else {
                // Only PDF or Images
                var type = files[i].type.split('/');

                if (type[0] == 'image') {
                    type = 1;
                } else if (type[1] == 'pdf') {
                    type = 2;
                } else {
                    type = 0;
                }

                if (type) {
                    // Create file
                    reader[i] = new FileReader();
                    reader[i].index = i;
                    reader[i].type = type;
                    reader[i].name = files[i].name;
                    reader[i].date = files[i].lastModified;
                    reader[i].size = files[i].size;
                    reader[i].addEventListener("load", function (data) {
                        // Get result
                        if (data.target.type == 2) {
                            if (obj.options.acceptFiles == true) {
                                obj.addPdf(data.target);
                            }
                        } else {
                            obj.addImage(data.target.result, data.target.name, data.total, data.target.lastModified);
                        }
                    }, false);

                    reader[i].readAsDataURL(files[i])
                } else {
                    alert('The extension is not allowed');
                }
            }
        }
    }

    // Destroy
    obj.destroy = function() {
        editor.removeEventListener('mouseup', editorMouseUp);
        editor.removeEventListener('mousedown', editorMouseDown);
        editor.removeEventListener('mousemove', editorMouseMove);
        editor.removeEventListener('keyup', editorKeyUp);
        editor.removeEventListener('keydown', editorKeyDown);
        editor.removeEventListener('dragstart', editorDragStart);
        editor.removeEventListener('dragenter', editorDragEnter);
        editor.removeEventListener('dragover', editorDragOver);
        editor.removeEventListener('drop', editorDrop);
        editor.removeEventListener('paste', editorPaste);

        if (typeof(obj.options.onblur) == 'function') {
            editor.removeEventListener('blur', editorBlur);
        }
        if (typeof(obj.options.onfocus) == 'function') {
            editor.removeEventListener('focus', editorFocus);
        }

        el.editor = null;
        el.classList.remove('jeditor-container');

        toolbar.remove();
        snippet.remove();
        editor.remove();
    }

    var isLetter = function (str) {
        var regex = /([\u0041-\u005A\u0061-\u007A\u00AA\u00B5\u00BA\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0\u08A2-\u08AC\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097F\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191C\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA697\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA80-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]+)/g;
        return str.match(regex) ? 1 : 0;
    }

    // Event handlers
    var editorMouseUp = function(e) {
        editorAction = false;
    }

    var editorMouseDown = function(e) {
        var close = function(snippet) {
            var rect = snippet.getBoundingClientRect();
            if (rect.width - (e.clientX - rect.left) < 40 && e.clientY - rect.top < 40) {
                snippet.innerHTML = '';
                snippet.remove();
            }
        }

        if (e.target.tagName == 'IMG') {
            if (e.target.style.cursor) {
                var rect = e.target.getBoundingClientRect();
                editorAction = {
                    e: e.target,
                    x: e.clientX,
                    y: e.clientY,
                    w: rect.width,
                    h: rect.height,
                    d: e.target.style.cursor,
                }

                if (! e.target.style.width) {
                    e.target.style.width = rect.width + 'px';
                }

                if (! e.target.style.height) {
                    e.target.style.height = rect.height + 'px';
                }

                var s = window.getSelection();
                if (s.rangeCount) {
                    for (var i = 0; i < s.rangeCount; i++) {
                        s.removeRange(s.getRangeAt(i));
                    }
                }
            } else {
                editorAction = true;
            }
        } else { 
            if (e.target.classList.contains('snippet')) {
                close(e.target);
            } else if (e.target.parentNode.classList.contains('snippet')) {
                close(e.target.parentNode);
            }

            editorAction = true;
        }
    }

    var editorMouseMove = function(e) {
        if (e.target.tagName == 'IMG') {
            if (e.target.getAttribute('tabindex')) {
                var rect = e.target.getBoundingClientRect();
                if (e.clientY - rect.top < 5) {
                    if (rect.width - (e.clientX - rect.left) < 5) {
                        e.target.style.cursor = 'ne-resize';
                    } else if (e.clientX - rect.left < 5) {
                        e.target.style.cursor = 'nw-resize';
                    } else {
                        e.target.style.cursor = 'n-resize';
                    }
                } else if (rect.height - (e.clientY - rect.top) < 5) {
                    if (rect.width - (e.clientX - rect.left) < 5) {
                        e.target.style.cursor = 'se-resize';
                    } else if (e.clientX - rect.left < 5) {
                        e.target.style.cursor = 'sw-resize';
                    } else {
                        e.target.style.cursor = 's-resize';
                    }
                } else if (rect.width - (e.clientX - rect.left) < 5) {
                    e.target.style.cursor = 'e-resize';
                } else if (e.clientX - rect.left < 5) {
                    e.target.style.cursor = 'w-resize';
                } else {
                    e.target.style.cursor = '';
                }
            }
        }

        // Move
        if (e.which == 1 && editorAction && editorAction.d) {
            if (editorAction.d == 'e-resize' || editorAction.d == 'ne-resize' ||  editorAction.d == 'se-resize') {
                editorAction.e.style.width = (editorAction.w + (e.clientX - editorAction.x)) + 'px';

                if (e.shiftKey) {
                    var newHeight = (e.clientX - editorAction.x) * (editorAction.h / editorAction.w);
                    editorAction.e.style.height = editorAction.h + newHeight + 'px';
                } else {
                    var newHeight =  null;
                }
            }

            if (! newHeight) {
                if (editorAction.d == 's-resize' || editorAction.d == 'se-resize' || editorAction.d == 'sw-resize') {
                    if (! e.shiftKey) {
                        editorAction.e.style.height = editorAction.h + (e.clientY - editorAction.y);
                    }
                }
            }
        }
    }

    var editorKeyUp = function(e) {
        if (! editor.innerHTML) {
            editor.innerHTML = '<div><br></div>';
        }

        if (typeof(obj.options.onkeyup) == 'function') { 
            obj.options.onkeyup(e, el);
        }
    }


    var editorKeyDown = function(e) {
        // Check for URL
        if (obj.options.parseURL == true) {
            verifyEditor();
        }

        // Closable
        if (typeof(obj.options.onenter) == 'function' && e.which == 13) {
            var data = obj.getData();
            obj.options.onenter(obj, el, data, e);
        }

        if (typeof(obj.options.onkeydown) == 'function') { 
            obj.options.onkeydown(e, el);
        }
    }

    var editorPaste = function(e) {
        if (e.clipboardData || e.originalEvent.clipboardData) {
            var html = (e.originalEvent || e).clipboardData.getData('text/html');
            var text = (e.originalEvent || e).clipboardData.getData('text/plain');
            var file = (e.originalEvent || e).clipboardData.files
        } else if (window.clipboardData) {
            var html = window.clipboardData.getData('Html');
            var text = window.clipboardData.getData('Text');
            var file = window.clipboardData.files
        }

        if (file.length) {
            // Paste a image from the clipboard
            obj.addFile(file);
        } else {
            // Paste text
            text = text.split('\r\n');
            var str = '';
            if (e.target.nodeName == 'DIV' && ! e.target.classList.contains('jeditor')) {
                for (var i = 0; i < text.length; i++) {
                    if (text[i]) {
                        str += text[i] + "<br>\r\n";
                    }
                }
            } else {
                for (var i = 0; i < text.length; i++) {
                    if (text[i]) {
                        str += '<div>' + text[i] + '</div>';
                    } else {
                        str += '<div><br></div>';
                    }
                }
            }
            // Insert text
            document.execCommand('insertHtml', false, str);

            // Extra images from the paste
            if (obj.options.acceptImages == true) {
                extractImageFromHtml(html);
            }
        }

        e.preventDefault();
    }

    var editorDragStart = function(e) {
        if (editorAction && editorAction.e) {
            e.preventDefault();
        }
    }

    var editorDragEnter = function(e) {
        if (editorAction || obj.options.dropZone == false) {
            // Do nothing
        } else {
            el.classList.add('jeditor-dragging');
        }
    }

    var editorDragOver = function(e) {
        if (editorAction || obj.options.dropZone == false) {
            // Do nothing
        } else {
            if (editorTimer) {
                clearTimeout(editorTimer);
            }

            editorTimer = setTimeout(function() {
                el.classList.remove('jeditor-dragging');
            }, 100);
        }
    }

    var editorDrop = function(e) {
        if (editorAction || obj.options.dropZone == false) {
            // Do nothing
        } else {
            // Position caret on the drop
            var range = null;
            if (document.caretRangeFromPoint) {
                range=document.caretRangeFromPoint(e.clientX, e.clientY);
            } else if (e.rangeParent) {
                range=document.createRange();
                range.setStart(e.rangeParent,e.rangeOffset);
            }
            var sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
            sel.anchorNode.parentNode.focus();

            var html = (e.originalEvent || e).dataTransfer.getData('text/html');
            var text = (e.originalEvent || e).dataTransfer.getData('text/plain');
            var file = (e.originalEvent || e).dataTransfer.files;
    
            if (file.length) {
                obj.addFile(file);
            } else if (text) {
                extractImageFromHtml(html);
            }

            el.classList.remove('jeditor-dragging');
            e.preventDefault();
        }
    }

    var editorBlur = function() {
        obj.options.onblur(obj, el, obj.getData());
    }

    var editorFocus = function() {
        obj.options.onfocus(obj, el, obj.getData());
    }

    editor.addEventListener('mouseup', editorMouseUp);
    editor.addEventListener('mousedown', editorMouseDown);
    editor.addEventListener('mousemove', editorMouseMove);
    editor.addEventListener('keyup', editorKeyUp);
    editor.addEventListener('keydown', editorKeyDown);
    editor.addEventListener('dragstart', editorDragStart);
    editor.addEventListener('dragenter', editorDragEnter);
    editor.addEventListener('dragover', editorDragOver);
    editor.addEventListener('drop', editorDrop);
    editor.addEventListener('paste', editorPaste);

    // Blur
    if (typeof(obj.options.onblur) == 'function') {
        editor.addEventListener('blur', editorBlur);
    }

    // Focus
    if (typeof(obj.options.onfocus) == 'function') {
        editor.addEventListener('focus', editorFocus);
    }

    // Onload
    if (typeof(obj.options.onload) == 'function') {
        obj.options.onload(el, editor);
    }

    // Set value to the editor
    editor.innerHTML = value;

    // Append editor to the containre
    el.appendChild(editor);

    // Snippet
    if (obj.options.snippet) {
        appendElement(obj.options.snippet);
    }

    // Default toolbar
    if (obj.options.toolbar == null) {
        obj.options.toolbar = jSuites.editor.getDefaultToolbar();
    }

    // Add toolbar
    if (obj.options.toolbar) {
        for (var i = 0; i < obj.options.toolbar.length; i++) {
            if (obj.options.toolbar[i].icon) {
                var item = document.createElement('div');
                item.style.userSelect = 'none';
                var itemIcon = document.createElement('i');
                itemIcon.className = 'material-icons';
                itemIcon.innerHTML = obj.options.toolbar[i].icon;
                itemIcon.onclick = (function (a) {
                    var b = a;
                    return function () {
                        obj.options.toolbar[b].onclick(el, obj, this)
                    };
                })(i);
                item.appendChild(itemIcon);
                toolbar.appendChild(item);
            } else {
                if (obj.options.toolbar[i].type == 'divisor') {
                    var item = document.createElement('div');
                    item.className = 'jeditor-toolbar-divisor';
                    toolbar.appendChild(item);
                } else if (obj.options.toolbar[i].type == 'button') {
                    var item = document.createElement('div');
                    item.classList.add('jeditor-toolbar-button');
                    item.innerHTML = obj.options.toolbar[i].value;
                    toolbar.appendChild(item);
                }
            }
        }

        el.appendChild(toolbar);
    }

    // Focus to the editor
    if (obj.options.focus) {
        jSuites.editor.setCursor(editor, obj.options.focus == 'initial' ? true : false);
    }

    el.editor = obj;

    return obj;
});

jSuites.editor.setCursor = function(element, first) {
    element.focus();
    document.execCommand('selectAll');
    var sel = window.getSelection();
    var range = sel.getRangeAt(0);
    if (first == true) {
        var node = range.startContainer;
        var size = 0;
    } else {
        var node = range.endContainer;
        var size = node.length;
    }
    range.setStart(node, size);
    range.setEnd(node, size);
    sel.removeAllRanges();
    sel.addRange(range);
}

jSuites.editor.getDomain = function(url) {
    return url.replace('http://','').replace('https://','').replace('www.','').split(/[/?#]/)[0].split(/:/g)[0];
}

jSuites.editor.detectUrl = function(text) {
    var expression = /(((https?:\/\/)|(www\.))[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|]+)/ig;
    var links = text.match(expression);

    if (links) {
        if (links[0].substr(0,3) == 'www') {
            links[0] = 'http://' + links[0];
        }
    }

    return links;
}

jSuites.editor.youtubeParser = function(url) {
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    var match = url.match(regExp);

    return (match && match[7].length == 11) ? match[7] : false;
}

jSuites.editor.getDefaultToolbar = function() { 
    return [
        {
            icon:'undo',
            onclick: function() {
                document.execCommand('undo');
            }
        },
        {
            icon:'redo',
            onclick: function() {
                document.execCommand('redo');
            }
        },
        {
            type:'divisor'
        },
        {
            icon:'format_bold',
            onclick: function(a,b,c) {
                document.execCommand('bold');

                if (document.queryCommandState("bold")) {
                    c.classList.add('selected');
                } else {
                    c.classList.remove('selected');
                }
            }
        },
        {
            icon:'format_italic',
            onclick: function(a,b,c) {
                document.execCommand('italic');

                if (document.queryCommandState("italic")) {
                    c.classList.add('selected');
                } else {
                    c.classList.remove('selected');
                }
            }
        },
        {
            icon:'format_underline',
            onclick: function(a,b,c) {
                document.execCommand('underline');

                if (document.queryCommandState("underline")) {
                    c.classList.add('selected');
                } else {
                    c.classList.remove('selected');
                }
            }
        },
        {
            type:'divisor'
        },
        {
            icon:'format_list_bulleted',
            onclick: function(a,b,c) {
                document.execCommand('insertUnorderedList');

                if (document.queryCommandState("insertUnorderedList")) {
                    c.classList.add('selected');
                } else {
                    c.classList.remove('selected');
                }
            }
        },
        {
            icon:'format_list_numbered',
            onclick: function(a,b,c) {
                document.execCommand('insertOrderedList');

                if (document.queryCommandState("insertOrderedList")) {
                    c.classList.add('selected');
                } else {
                    c.classList.remove('selected');
                }
            }
        },
        {
            icon:'format_indent_increase',
            onclick: function(a,b,c) {
                document.execCommand('indent', true, null);

                if (document.queryCommandState("indent")) {
                    c.classList.add('selected');
                } else {
                    c.classList.remove('selected');
                }
            }
        },
        {
            icon:'format_indent_decrease',
            onclick: function(a,b,c) {
                document.execCommand('outdent');

                if (document.queryCommandState("outdent")) {
                    c.classList.add('selected');
                } else {
                    c.classList.remove('selected');
                }
            }
        }
        /*{
            type:'select',
            items: ['Verdana','Arial','Courier New'],
            onchange: function() {
            }
        },
        {
            type:'select',
            items: ['10px','12px','14px','16px','18px','20px','22px'],
            onchange: function() {
            }
        },
        {
            icon:'format_align_left',
            onclick: function() {
                document.execCommand('JustifyLeft');

                if (document.queryCommandState("JustifyLeft")) {
                    this.classList.add('selected');
                } else {
                    this.classList.remove('selected');
                }
            }
        },
        {
            icon:'format_align_center',
            onclick: function() {
                document.execCommand('justifyCenter');

                if (document.queryCommandState("justifyCenter")) {
                    this.classList.add('selected');
                } else {
                    this.classList.remove('selected');
                }
            }
        },
        {
            icon:'format_align_right',
            onclick: function() {
                document.execCommand('justifyRight');

                if (document.queryCommandState("justifyRight")) {
                    this.classList.add('selected');
                } else {
                    this.classList.remove('selected');
                }
            }
        },
        {
            icon:'format_align_justify',
            onclick: function() {
                document.execCommand('justifyFull');

                if (document.queryCommandState("justifyFull")) {
                    this.classList.add('selected');
                } else {
                    this.classList.remove('selected');
                }
            }
        },
        {
            icon:'format_list_bulleted',
            onclick: function() {
                document.execCommand('insertUnorderedList');

                if (document.queryCommandState("insertUnorderedList")) {
                    this.classList.add('selected');
                } else {
                    this.classList.remove('selected');
                }
            }
        }*/
    ];
}


jSuites.image = (function(el, options) {
    var obj = {};
    obj.options = {};

    // Default configuration
    var defaults = {
        minWidth: false,
        onchange: null,
        singleFile: true,
        remoteParser: null,
        text:{
            extensionNotAllowed:'The extension is not allowed',
            imageTooSmall:'The resolution is too low, try a image with a better resolution. width > 800px',
        }
    };

    // Loop through our object
    for (var property in defaults) {
        if (options && options.hasOwnProperty(property)) {
            obj.options[property] = options[property];
        } else {
            obj.options[property] = defaults[property];
        }
    }

    // Upload icon
    el.classList.add('jupload');

    // Add image
    obj.addImage = function(file) {
        if (! file.date) {
            file.date = '';
        }
        var img = document.createElement('img');
        img.setAttribute('data-date', file.lastmodified ? file.lastmodified : file.date);
        img.setAttribute('data-name', file.name);
        img.setAttribute('data-size', file.size);
        img.setAttribute('data-small', file.small ? file.small : '');
        img.setAttribute('data-cover', file.cover ? 1 : 0);
        img.setAttribute('data-extension', file.extension);
        img.setAttribute('src', file.file);
        img.className = 'jfile';
        img.style.width = '100%';

        return img;
    }

    // Add image
    obj.addImages = function(files) {
        if (obj.options.singleFile == true) {
            el.innerHTML = '';
        }

        for (var i = 0; i < files.length; i++) {
            el.appendChild(obj.addImage(files[i]));
        }
    }

    obj.addFromFile = function(file) {
        var type = file.type.split('/');
        if (type[0] == 'image') {
            if (obj.options.singleFile == true) {
                el.innerHTML = '';
            }

            var imageFile = new FileReader();
            imageFile.addEventListener("load", function (v) {

                var img = new Image();

                img.onload = function onload() {
                    var canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;

                    var ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                    var data = {
                        file: canvas.toDataURL(),
                        extension: file.name.substr(file.name.lastIndexOf('.') + 1),
                        name: file.name,
                        size: file.size,
                        lastmodified: file.lastModified,
                    }
                    var newImage = obj.addImage(data);
                    el.appendChild(newImage);

                    // Onchange
                    if (typeof(obj.options.onchange) == 'function') {
                        obj.options.onchange(newImage);
                    }
                };

                img.src = v.srcElement.result;
            });

            imageFile.readAsDataURL(file);
        } else {
            alert(text.extentionNotAllowed);
        }
    }

    obj.addFromUrl = function(src) {
        if (src.substr(0,4) != 'data' && ! obj.options.remoteParser) {
            console.error('remoteParser not defined in your initialization');
        } else {
            // This is to process cross domain images
            if (src.substr(0,4) == 'data') {
                var extension = src.split(';')
                extension = extension[0].split('/');
                extension = extension[1];
            } else {
                var extension = src.substr(src.lastIndexOf('.') + 1);
                // Work for cross browsers
                src = obj.options.remoteParser + src;
            }

            var img = new Image();

            img.onload = function onload() {
                var canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;

                var ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                canvas.toBlob(function(blob) {
                    var data = {
                        file: window.URL.createObjectURL(blob),
                        extension: extension
                    }
                    var newImage = obj.addImage(data);
                    el.appendChild(newImage);

                    // Keep base64 ready to go
                    var content = canvas.toDataURL();
                    jSuites.files[data.file] = content.substr(content.indexOf(',') + 1);

                    // Onchange
                    if (typeof(obj.options.onchange) == 'function') {
                        obj.options.onchange(newImage);
                    }
                });
            };

            img.src = src;
        }
    }

    var attachmentInput = document.createElement('input');
    attachmentInput.type = 'file';
    attachmentInput.setAttribute('accept', 'image/*');
    attachmentInput.onchange = function() {
        for (var i = 0; i < this.files.length; i++) {
            obj.addFromFile(this.files[i]);
        }
    }

    el.addEventListener("dblclick", function(e) {
        jSuites.click(attachmentInput);
    });

    el.addEventListener('dragenter', function(e) {
        el.style.border = '1px dashed #000';
    });

    el.addEventListener('dragleave', function(e) {
        el.style.border = '1px solid #eee';
    });

    el.addEventListener('dragstop', function(e) {
        el.style.border = '1px solid #eee';
    });

    el.addEventListener('dragover', function(e) {
        e.preventDefault();
    });

    el.addEventListener('drop', function(e) {
        e.preventDefault();  
        e.stopPropagation();


        var html = (e.originalEvent || e).dataTransfer.getData('text/html');
        var file = (e.originalEvent || e).dataTransfer.files;

        if (file.length) {
            for (var i = 0; i < e.dataTransfer.files.length; i++) {
                obj.addFromFile(e.dataTransfer.files[i]);
            }
        } else if (html) {
            if (obj.options.singleFile == true) {
                el.innerHTML = '';
            }

            // Create temp element
            var div = document.createElement('div');
            div.innerHTML = html;

            // Extract images
            var img = div.querySelectorAll('img');

            if (img.length) {
                for (var i = 0; i < img.length; i++) {
                    obj.addFromUrl(img[i].src);
                }
            }
        }

        el.style.border = '1px solid #eee';

        return false;
    });

    el.image = obj;

    return obj;
});

/**
 * (c) jLoading
 * https://github.com/paulhodel/jtools
 *
 * @author: Paul Hodel <paul.hodel@gmail.com>
 * @description: Page loading spin
 */

jSuites.loading = (function() {
    var obj = {};

    var loading = document.createElement('div');
    loading.className = 'jloading';

    obj.show = function() {
        document.body.appendChild(loading);
    };

    obj.hide = function() {
        document.body.removeChild(loading);
    };

    return obj;
})();

/**
 * (c) jLogin
 * https://github.com/paulhodel/jtools
 *
 * @author: Paul Hodel <paul.hodel@gmail.com>
 * @description: Login helper
 */

jSuites.login = (function(el, options) {
    var obj = {};
    obj.options = {};

    // Default configuration
    var defaults = {
        url: window.location.href,
        prepareRequest: null,
        accessToken: null,
        deviceToken: null,
        facebookUrl: null,
        maxHeight: null,
        onload: null,
        onerror: null,
        message: null,
        logo: null,
        newProfile: false,
        newProfileUrl: false,
        newProfileLogin: false,
        fullscreen: false,
    };

    // Loop through our object
    for (var property in defaults) {
        if (options && options.hasOwnProperty(property)) {
            obj.options[property] = options[property];
        } else {
            obj.options[property] = defaults[property];
        }
    }

    // Message console container
    if (! obj.options.message) {
        var messageElement = document.querySelector('.message');
        if (messageElement) {
            obj.options.message = messageElement;
        }
    }

    // Action
    var action = null;

    // Container
    var container = document.createElement('form');
    el.appendChild(container);

    // Logo
    var divLogo = document.createElement('div');
    divLogo.className = 'jlogin-logo'
    container.appendChild(divLogo);

    if (obj.options.logo) {
        var logo = document.createElement('img');
        logo.src = obj.options.logo;
        divLogo.appendChild(logo);
    }

    // Code
    var labelCode = document.createElement('label');
    labelCode.innerHTML = 'Please enter here the code received';
    var inputCode = document.createElement('input');
    inputCode.type = 'number';
    inputCode.id = 'code';
    inputCode.setAttribute('maxlength', 6);
    var divCode = document.createElement('div');
    divCode.appendChild(labelCode);
    divCode.appendChild(inputCode);

    // Hash
    var inputHash = document.createElement('input');
    inputHash.type = 'hidden';
    inputHash.name = 'h';
    var divHash = document.createElement('div');
    divHash.appendChild(inputHash);

    // Recovery
    var inputRecovery = document.createElement('input');
    inputRecovery.type = 'hidden';
    inputRecovery.name = 'recovery';
    inputRecovery.value = '1';
    var divRecovery = document.createElement('div');
    divRecovery.appendChild(inputRecovery);

    // Login
    var labelLogin = document.createElement('label');
    labelLogin.innerHTML = 'Login';
    var inputLogin = document.createElement('input');
    inputLogin.type = 'text';
    inputLogin.name = 'login';
    inputLogin.setAttribute('autocomplete', 'off');
    inputLogin.onkeyup = function() {
        this.value = this.value.toLowerCase().replace(/[^a-zA-Z0-9_+]+/gi, '');
    } 
    var divLogin = document.createElement('div');
    divLogin.appendChild(labelLogin);
    divLogin.appendChild(inputLogin);

    // Name
    var labelName = document.createElement('label');
    labelName.innerHTML = 'Name';
    var inputName = document.createElement('input');
    inputName.type = 'text';
    inputName.name = 'name';
    var divName = document.createElement('div');
    divName.appendChild(labelName);
    divName.appendChild(inputName);

    // Email
    var labelUsername = document.createElement('label');
    labelUsername.innerHTML = 'E-mail';
    var inputUsername = document.createElement('input');
    inputUsername.type = 'text';
    inputUsername.name = 'username';
    inputUsername.setAttribute('autocomplete', 'new-username');
    var divUsername = document.createElement('div');
    divUsername.appendChild(labelUsername);
    divUsername.appendChild(inputUsername);

    // Password
    var labelPassword = document.createElement('label');
    labelPassword.innerHTML = 'Password';
    var inputPassword = document.createElement('input');
    inputPassword.type = 'password';
    inputPassword.name = 'password';
    inputPassword.setAttribute('autocomplete', 'new-password');
    var divPassword = document.createElement('div');
    divPassword.appendChild(labelPassword);
    divPassword.appendChild(inputPassword);
    divPassword.onkeydown = function(e) {
        if (e.keyCode == 13) {
            obj.execute();
        }
    }

    // Repeat password
    var labelRepeatPassword = document.createElement('label');
    labelRepeatPassword.innerHTML = 'Password';
    var inputRepeatPassword = document.createElement('input');
    inputRepeatPassword.type = 'password';
    inputRepeatPassword.name = 'password';
    var divRepeatPassword = document.createElement('div');
    divRepeatPassword.appendChild(labelRepeatPassword);
    divRepeatPassword.appendChild(inputRepeatPassword);

    // Remember checkbox
    var labelRemember = document.createElement('label');
    labelRemember.innerHTML = 'Remember me on this device';
    var inputRemember = document.createElement('input');
    inputRemember.type = 'checkbox';
    inputRemember.name = 'remember';
    inputRemember.value = '1';
    labelRemember.appendChild(inputRemember);
    var divRememberButton = document.createElement('div');
    divRememberButton.className = 'rememberButton';
    divRememberButton.appendChild(labelRemember);

    // Login button
    var actionButton = document.createElement('input');
    actionButton.type = 'button';
    actionButton.value = 'Log In';
    actionButton.onclick = function() {
        obj.execute();
    }
    var divActionButton = document.createElement('div');
    divActionButton.appendChild(actionButton);

    // Cancel button
    var cancelButton = document.createElement('div');
    cancelButton.innerHTML = 'Cancel';
    cancelButton.className = 'cancelButton';
    cancelButton.onclick = function() {
        obj.requestAccess();
    }
    var divCancelButton = document.createElement('div');
    divCancelButton.appendChild(cancelButton);

    // Captcha
    var labelCaptcha = document.createElement('label');
    labelCaptcha.innerHTML = 'Please type here the code below';
    var inputCaptcha = document.createElement('input');
    inputCaptcha.type = 'text';
    inputCaptcha.name = 'captcha';
    var imageCaptcha = document.createElement('img');
    var divCaptcha = document.createElement('div');
    divCaptcha.className = 'jlogin-captcha';
    divCaptcha.appendChild(labelCaptcha);
    divCaptcha.appendChild(inputCaptcha);
    divCaptcha.appendChild(imageCaptcha);

    // Facebook
    var facebookButton = document.createElement('div');
    facebookButton.innerHTML = 'Login with Facebook';
    facebookButton.className = 'facebookButton';
    var divFacebookButton = document.createElement('div');
    divFacebookButton.appendChild(facebookButton);
    divFacebookButton.onclick = function() {
        obj.requestLoginViaFacebook();
    }
    // Forgot password
    var inputRequest = document.createElement('span');
    inputRequest.innerHTML = 'Request a new password';
    var divRequestButton = document.createElement('div');
    divRequestButton.className = 'requestButton';
    divRequestButton.appendChild(inputRequest);
    divRequestButton.onclick = function() {
        obj.requestNewPassword();
    }
    // Create a new Profile
    var inputNewProfile = document.createElement('span');
    inputNewProfile.innerHTML = 'Create a new profile';
    var divNewProfileButton = document.createElement('div');
    divNewProfileButton.className = 'newProfileButton';
    divNewProfileButton.appendChild(inputNewProfile);
    divNewProfileButton.onclick = function() {
        obj.newProfile();
    }

    el.className = 'jlogin';

    if (obj.options.fullscreen == true) {
        el.classList.add('jlogin-fullscreen');
    }

    /** 
     * Show message
     */
    obj.showMessage = function(data) {
        var message = (typeof(data) == 'object') ? data.message : data;

        if (typeof(obj.options.showMessage) == 'function') {
            obj.options.showMessage(data);
        } else {
            jSuites.alert(data);
        }
    }

    /**
     * New profile
     */
    obj.newProfile = function() {
        container.innerHTML = '';
        container.appendChild(divLogo);
        if (obj.options.newProfileLogin) {
            container.appendChild(divLogin);
        }
        container.appendChild(divName);
        container.appendChild(divUsername);
        container.appendChild(divActionButton);
        container.appendChild(divFacebookButton);
        container.appendChild(divCancelButton);

        // Reset inputs
        inputLogin.value = '';
        inputUsername.value = '';
        inputPassword.value = '';

        // Button
        actionButton.value = 'Create new profile';

        // Action
        action = 'newProfile';
    }

    /**
     * Request the email with the recovery instructions
     */
    obj.requestNewPassword = function() {
        if (Array.prototype.indexOf.call(container.children, divCaptcha) >= 0) {
            var captcha = true;
        }

        container.innerHTML = '';
        container.appendChild(divLogo);
        container.appendChild(divRecovery);
        container.appendChild(divUsername);
        if (captcha) {
            container.appendChild(divCaptcha);
        }
        container.appendChild(divActionButton);
        container.appendChild(divCancelButton);
        actionButton.value = 'Request a new password';
        inputRecovery.value = 1;

        // Action
        action = 'requestNewPassword';
    }

    /**
     * Confirm recovery code
     */
    obj.codeConfirmation = function() {
        container.innerHTML = '';
        container.appendChild(divLogo);
        container.appendChild(divHash);
        container.appendChild(divCode);
        container.appendChild(divActionButton);
        container.appendChild(divCancelButton);
        actionButton.value = 'Confirm code';
        inputRecovery.value = 2;

        // Action
        action = 'codeConfirmation';
    }

    /**
     * Update my password
     */
    obj.changeMyPassword = function(hash) {
        container.innerHTML = '';
        container.appendChild(divLogo);
        container.appendChild(divHash);
        container.appendChild(divPassword);
        container.appendChild(divRepeatPassword);
        container.appendChild(divActionButton);
        container.appendChild(divCancelButton);
        actionButton.value = 'Change my password';
        inputHash.value = hash;

        // Action
        action = 'changeMyPassword';
    }

    /**
     * Request access default method
     */
    obj.requestAccess = function() {
        container.innerHTML = '';
        container.appendChild(divLogo);
        container.appendChild(divUsername);
        container.appendChild(divPassword);
        container.appendChild(divActionButton);
        container.appendChild(divFacebookButton);
        container.appendChild(divRequestButton);
        container.appendChild(divRememberButton);
        container.appendChild(divRequestButton);
        if (obj.options.newProfile == true) {
            container.appendChild(divNewProfileButton);
        }

        // Button
        actionButton.value = 'Login';

        // Password
        inputPassword.value = '';

        // Email persistence
        if (window.localStorage.getItem('username')) {
            inputUsername.value = window.localStorage.getItem('username');
            inputPassword.focus();
        } else {
            inputUsername.focus();
        }

        // Action
        action = 'requestAccess';
    }

    /**
     * Request login via facebook
     */
    obj.requestLoginViaFacebook = function() {
        if (typeof(deviceNotificationToken) == 'undefined') {
            FB.getLoginStatus(function(response) {
                if (! response.status || response.status != 'connected') {
                    FB.login(function(response) {
                        if (response.authResponse) {
                            obj.execute({ f:response.authResponse.accessToken });
                        } else {
                            obj.showMessage('Not authorized by facebook');
                        }
                    }, {scope: 'public_profile,email'});
                } else {
                    obj.execute({ f:response.authResponse.accessToken });
                }
            }, true);
        } else {
            jDestroy = function() {
                fbLogin.removeEventListener('loadstart', jStart);
                fbLogin.removeEventListener('loaderror', jError);
                fbLogin.removeEventListener('exit', jExit);
                fbLogin.close();
                fbLogin = null;
            }

            jStart = function(event) {
                var url = event.url;
                if (url.indexOf("access_token") >= 0) {
                    setTimeout(function(){
                        var u = url.match(/=(.*?)&/);
                        if (u[1].length > 32) {
                            obj.execute({ f:u[1] });
                        }
                        jDestroy();
                   },500);
                }

                if (url.indexOf("error=access_denied") >= 0) {
                   setTimeout(jDestroy ,500);
                   // Not authorized by facebook
                   obj.showMessage('Not authorized by facebook');
                }
            }

            jError = function(event) {
                jDestroy();
            }
        
            jExit = function(event) {
                jDestroy();
            }

            fbLogin = window.open(this.facebookUrl, "_blank", "location=no,closebuttoncaption=Exit,disallowoverscroll=yes,toolbar=no");
            fbLogin.addEventListener('loadstart', jStart);
            fbLogin.addEventListener('loaderror', jError);
            fbLogin.addEventListener('exit', jExit);
        }

        // Action
        action = 'requestLoginViaFacebook';
    }

    // Perform request
    obj.execute = function(data) {
        // New profile
        if (action == 'newProfile') {
            var pattern = new RegExp(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/);
            if (! inputUsername.value || ! pattern.test(inputUsername.value)) {
                var message = 'Invalid e-mail address'; 
            }

            var pattern = new RegExp(/^[a-zA-Z0-9\_\-\.\s+]+$/);
            if (! inputLogin.value || ! pattern.test(inputLogin.value)) {
                var message = 'Invalid username, please use only characters and numbers';
            }

            if (message) {
                obj.showMessage(message);
                return false;
            }
        }

        // Keep email
        if (inputUsername.value != '') {
            window.localStorage.setItem('username', inputUsername.value);
        }

        // Captcha
        if (Array.prototype.indexOf.call(container.children, divCaptcha) >= 0) {
            if (inputCaptcha.value == '') {
                obj.showMessage('Please enter the captch code below');
                return false;
            }
        }

        // Url
        var url = obj.options.url;

        // Device token
        if (obj.options.deviceToken) {
            url += '?token=' + obj.options.deviceToken;
        }

        // Callback
        var onsuccess = function(result) {
            if (result) {
                // Successfully response
                if (result.success == 1) {
                    // Recovery process
                    if (action == 'requestNewPassword') {
                        obj.codeConfirmation();
                    } else if (action == 'codeConfirmation') {
                        obj.requestAccess();
                    } else if (action == 'newProfile') {
                        obj.requestAccess();
                        // New profile
                        result.newProfile = true;
                    }

                    // Token
                    if (result.token) {
                        // Set token
                        obj.options.accessToken = result.token;
                        // Save token
                        window.localStorage.setItem('Access-Token', result.token);
                    }
                }

                // Show message
                if (result.message) {
                    // Show message
                    obj.showMessage(result.message)
                }

                // Request captcha code
                if (! result.data) {
                    if (Array.prototype.indexOf.call(container.children, divCaptcha) >= 0) {
                        divCaptcha.remove();
                    }
                } else {
                    container.insertBefore(divCaptcha, divActionButton);
                    imageCaptcha.setAttribute('src', 'data:image/png;base64,' + result.data);
                }

                // Give time to user see the message
                if (result.hash) {
                    // Change password
                    obj.changeMyPassword(result.hash);
                } else if (result.url) {
                    // App initialization
                    if (result.success == 1) {
                        if (typeof(obj.options.onload) == 'function') {
                            obj.options.onload(result);
                        } else {
                            if (result.message) {
                                setTimeout(function() { window.location.href = result.url; }, 2000);
                            } else {
                                window.location.href = result.url;
                            }
                        }
                    } else {
                        if (typeof(obj.options.onerror) == 'function') {
                            obj.options.onerror(result);
                        }
                    }
                }
            }
        }

        // Password
        if (! data) {
            var data = jSuites.getFormElements(el);
            // Encode passworfd
            if (data.password) {
                data.password = jSuites.login.sha512(data.password);
            }
            // Recovery code
            if (Array.prototype.indexOf.call(container.children, divCode) >= 0 && inputCode.value) {
                data.h = jSuites.login.sha512(inputCode.value);
            }
        }

        // Loading
        el.classList.add('jlogin-loading');

        // Url
        var url = (action == 'newProfile' && obj.options.newProfileUrl) ? obj.options.newProfileUrl : obj.options.url;

        // Remote call
        jSuites.ajax({
            url: url,
            method: 'POST',
            dataType: 'json',
            data: data,
            success: function(result) {
                // Remove loading
                el.classList.remove('jlogin-loading');
                // Callback
                onsuccess(result);
            },
            error: function(result) {
                // Error
                el.classList.remove('jlogin-loading');

                if (typeof(obj.options.onerror) == 'function') {
                    obj.options.onerror(result);
                }
            }
        });
    }

    obj.requestAccess();

    return obj;
});

jSuites.login.sha512 = (function(str) {
    function int64(msint_32, lsint_32) {
        this.highOrder = msint_32;
        this.lowOrder = lsint_32;
    }

    var H = [new int64(0x6a09e667, 0xf3bcc908), new int64(0xbb67ae85, 0x84caa73b),
        new int64(0x3c6ef372, 0xfe94f82b), new int64(0xa54ff53a, 0x5f1d36f1),
        new int64(0x510e527f, 0xade682d1), new int64(0x9b05688c, 0x2b3e6c1f),
        new int64(0x1f83d9ab, 0xfb41bd6b), new int64(0x5be0cd19, 0x137e2179)];

    var K = [new int64(0x428a2f98, 0xd728ae22), new int64(0x71374491, 0x23ef65cd),
        new int64(0xb5c0fbcf, 0xec4d3b2f), new int64(0xe9b5dba5, 0x8189dbbc),
        new int64(0x3956c25b, 0xf348b538), new int64(0x59f111f1, 0xb605d019),
        new int64(0x923f82a4, 0xaf194f9b), new int64(0xab1c5ed5, 0xda6d8118),
        new int64(0xd807aa98, 0xa3030242), new int64(0x12835b01, 0x45706fbe),
        new int64(0x243185be, 0x4ee4b28c), new int64(0x550c7dc3, 0xd5ffb4e2),
        new int64(0x72be5d74, 0xf27b896f), new int64(0x80deb1fe, 0x3b1696b1),
        new int64(0x9bdc06a7, 0x25c71235), new int64(0xc19bf174, 0xcf692694),
        new int64(0xe49b69c1, 0x9ef14ad2), new int64(0xefbe4786, 0x384f25e3),
        new int64(0x0fc19dc6, 0x8b8cd5b5), new int64(0x240ca1cc, 0x77ac9c65),
        new int64(0x2de92c6f, 0x592b0275), new int64(0x4a7484aa, 0x6ea6e483),
        new int64(0x5cb0a9dc, 0xbd41fbd4), new int64(0x76f988da, 0x831153b5),
        new int64(0x983e5152, 0xee66dfab), new int64(0xa831c66d, 0x2db43210),
        new int64(0xb00327c8, 0x98fb213f), new int64(0xbf597fc7, 0xbeef0ee4),
        new int64(0xc6e00bf3, 0x3da88fc2), new int64(0xd5a79147, 0x930aa725),
        new int64(0x06ca6351, 0xe003826f), new int64(0x14292967, 0x0a0e6e70),
        new int64(0x27b70a85, 0x46d22ffc), new int64(0x2e1b2138, 0x5c26c926),
        new int64(0x4d2c6dfc, 0x5ac42aed), new int64(0x53380d13, 0x9d95b3df),
        new int64(0x650a7354, 0x8baf63de), new int64(0x766a0abb, 0x3c77b2a8),
        new int64(0x81c2c92e, 0x47edaee6), new int64(0x92722c85, 0x1482353b),
        new int64(0xa2bfe8a1, 0x4cf10364), new int64(0xa81a664b, 0xbc423001),
        new int64(0xc24b8b70, 0xd0f89791), new int64(0xc76c51a3, 0x0654be30),
        new int64(0xd192e819, 0xd6ef5218), new int64(0xd6990624, 0x5565a910),
        new int64(0xf40e3585, 0x5771202a), new int64(0x106aa070, 0x32bbd1b8),
        new int64(0x19a4c116, 0xb8d2d0c8), new int64(0x1e376c08, 0x5141ab53),
        new int64(0x2748774c, 0xdf8eeb99), new int64(0x34b0bcb5, 0xe19b48a8),
        new int64(0x391c0cb3, 0xc5c95a63), new int64(0x4ed8aa4a, 0xe3418acb),
        new int64(0x5b9cca4f, 0x7763e373), new int64(0x682e6ff3, 0xd6b2b8a3),
        new int64(0x748f82ee, 0x5defb2fc), new int64(0x78a5636f, 0x43172f60),
        new int64(0x84c87814, 0xa1f0ab72), new int64(0x8cc70208, 0x1a6439ec),
        new int64(0x90befffa, 0x23631e28), new int64(0xa4506ceb, 0xde82bde9),
        new int64(0xbef9a3f7, 0xb2c67915), new int64(0xc67178f2, 0xe372532b),
        new int64(0xca273ece, 0xea26619c), new int64(0xd186b8c7, 0x21c0c207),
        new int64(0xeada7dd6, 0xcde0eb1e), new int64(0xf57d4f7f, 0xee6ed178),
        new int64(0x06f067aa, 0x72176fba), new int64(0x0a637dc5, 0xa2c898a6),
        new int64(0x113f9804, 0xbef90dae), new int64(0x1b710b35, 0x131c471b),
        new int64(0x28db77f5, 0x23047d84), new int64(0x32caab7b, 0x40c72493),
        new int64(0x3c9ebe0a, 0x15c9bebc), new int64(0x431d67c4, 0x9c100d4c),
        new int64(0x4cc5d4be, 0xcb3e42b6), new int64(0x597f299c, 0xfc657e2a),
        new int64(0x5fcb6fab, 0x3ad6faec), new int64(0x6c44198c, 0x4a475817)];

    var W = new Array(64);
    var a, b, c, d, e, f, g, h, i, j;
    var T1, T2;
    var charsize = 8;

    function utf8_encode(str) {
        return unescape(encodeURIComponent(str));
    }

    function str2binb(str) {
        var bin = [];
        var mask = (1 << charsize) - 1;
        var len = str.length * charsize;
    
        for (var i = 0; i < len; i += charsize) {
            bin[i >> 5] |= (str.charCodeAt(i / charsize) & mask) << (32 - charsize - (i % 32));
        }
    
        return bin;
    }

    function binb2hex(binarray) {
        var hex_tab = "0123456789abcdef";
        var str = "";
        var length = binarray.length * 4;
        var srcByte;

        for (var i = 0; i < length; i += 1) {
            srcByte = binarray[i >> 2] >> ((3 - (i % 4)) * 8);
            str += hex_tab.charAt((srcByte >> 4) & 0xF) + hex_tab.charAt(srcByte & 0xF);
        }

        return str;
    }

    function safe_add_2(x, y) {
        var lsw, msw, lowOrder, highOrder;

        lsw = (x.lowOrder & 0xFFFF) + (y.lowOrder & 0xFFFF);
        msw = (x.lowOrder >>> 16) + (y.lowOrder >>> 16) + (lsw >>> 16);
        lowOrder = ((msw & 0xFFFF) << 16) | (lsw & 0xFFFF);

        lsw = (x.highOrder & 0xFFFF) + (y.highOrder & 0xFFFF) + (msw >>> 16);
        msw = (x.highOrder >>> 16) + (y.highOrder >>> 16) + (lsw >>> 16);
        highOrder = ((msw & 0xFFFF) << 16) | (lsw & 0xFFFF);

        return new int64(highOrder, lowOrder);
    }

    function safe_add_4(a, b, c, d) {
        var lsw, msw, lowOrder, highOrder;

        lsw = (a.lowOrder & 0xFFFF) + (b.lowOrder & 0xFFFF) + (c.lowOrder & 0xFFFF) + (d.lowOrder & 0xFFFF);
        msw = (a.lowOrder >>> 16) + (b.lowOrder >>> 16) + (c.lowOrder >>> 16) + (d.lowOrder >>> 16) + (lsw >>> 16);
        lowOrder = ((msw & 0xFFFF) << 16) | (lsw & 0xFFFF);

        lsw = (a.highOrder & 0xFFFF) + (b.highOrder & 0xFFFF) + (c.highOrder & 0xFFFF) + (d.highOrder & 0xFFFF) + (msw >>> 16);
        msw = (a.highOrder >>> 16) + (b.highOrder >>> 16) + (c.highOrder >>> 16) + (d.highOrder >>> 16) + (lsw >>> 16);
        highOrder = ((msw & 0xFFFF) << 16) | (lsw & 0xFFFF);

        return new int64(highOrder, lowOrder);
    }

    function safe_add_5(a, b, c, d, e) {
        var lsw, msw, lowOrder, highOrder;

        lsw = (a.lowOrder & 0xFFFF) + (b.lowOrder & 0xFFFF) + (c.lowOrder & 0xFFFF) + (d.lowOrder & 0xFFFF) + (e.lowOrder & 0xFFFF);
        msw = (a.lowOrder >>> 16) + (b.lowOrder >>> 16) + (c.lowOrder >>> 16) + (d.lowOrder >>> 16) + (e.lowOrder >>> 16) + (lsw >>> 16);
        lowOrder = ((msw & 0xFFFF) << 16) | (lsw & 0xFFFF);

        lsw = (a.highOrder & 0xFFFF) + (b.highOrder & 0xFFFF) + (c.highOrder & 0xFFFF) + (d.highOrder & 0xFFFF) + (e.highOrder & 0xFFFF) + (msw >>> 16);
        msw = (a.highOrder >>> 16) + (b.highOrder >>> 16) + (c.highOrder >>> 16) + (d.highOrder >>> 16) + (e.highOrder >>> 16) + (lsw >>> 16);
        highOrder = ((msw & 0xFFFF) << 16) | (lsw & 0xFFFF);

        return new int64(highOrder, lowOrder);
    }

    function maj(x, y, z) {
        return new int64(
            (x.highOrder & y.highOrder) ^ (x.highOrder & z.highOrder) ^ (y.highOrder & z.highOrder),
            (x.lowOrder & y.lowOrder) ^ (x.lowOrder & z.lowOrder) ^ (y.lowOrder & z.lowOrder)
        );
    }

    function ch(x, y, z) {
        return new int64(
            (x.highOrder & y.highOrder) ^ (~x.highOrder & z.highOrder),
            (x.lowOrder & y.lowOrder) ^ (~x.lowOrder & z.lowOrder)
        );
    }

    function rotr(x, n) {
        if (n <= 32) {
            return new int64(
             (x.highOrder >>> n) | (x.lowOrder << (32 - n)),
             (x.lowOrder >>> n) | (x.highOrder << (32 - n))
            );
        } else {
            return new int64(
             (x.lowOrder >>> n) | (x.highOrder << (32 - n)),
             (x.highOrder >>> n) | (x.lowOrder << (32 - n))
            );
        }
    }

    function sigma0(x) {
        var rotr28 = rotr(x, 28);
        var rotr34 = rotr(x, 34);
        var rotr39 = rotr(x, 39);

        return new int64(
            rotr28.highOrder ^ rotr34.highOrder ^ rotr39.highOrder,
            rotr28.lowOrder ^ rotr34.lowOrder ^ rotr39.lowOrder
        );
    }

    function sigma1(x) {
        var rotr14 = rotr(x, 14);
        var rotr18 = rotr(x, 18);
        var rotr41 = rotr(x, 41);

        return new int64(
            rotr14.highOrder ^ rotr18.highOrder ^ rotr41.highOrder,
            rotr14.lowOrder ^ rotr18.lowOrder ^ rotr41.lowOrder
        );
    }

    function gamma0(x) {
        var rotr1 = rotr(x, 1), rotr8 = rotr(x, 8), shr7 = shr(x, 7);

        return new int64(
            rotr1.highOrder ^ rotr8.highOrder ^ shr7.highOrder,
            rotr1.lowOrder ^ rotr8.lowOrder ^ shr7.lowOrder
        );
    }

    function gamma1(x) {
        var rotr19 = rotr(x, 19);
        var rotr61 = rotr(x, 61);
        var shr6 = shr(x, 6);

        return new int64(
            rotr19.highOrder ^ rotr61.highOrder ^ shr6.highOrder,
            rotr19.lowOrder ^ rotr61.lowOrder ^ shr6.lowOrder
        );
    }

    function shr(x, n) {
        if (n <= 32) {
            return new int64(
                x.highOrder >>> n,
                x.lowOrder >>> n | (x.highOrder << (32 - n))
            );
        } else {
            return new int64(
                0,
                x.highOrder << (32 - n)
            );
        }
    }

    var str = utf8_encode(str);
    var strlen = str.length*charsize;
    str = str2binb(str);

    str[strlen >> 5] |= 0x80 << (24 - strlen % 32);
    str[(((strlen + 128) >> 10) << 5) + 31] = strlen;

    for (var i = 0; i < str.length; i += 32) {
        a = H[0];
        b = H[1];
        c = H[2];
        d = H[3];
        e = H[4];
        f = H[5];
        g = H[6];
        h = H[7];

        for (var j = 0; j < 80; j++) {
            if (j < 16) {
                W[j] = new int64(str[j*2 + i], str[j*2 + i + 1]);
            } else {
                W[j] = safe_add_4(gamma1(W[j - 2]), W[j - 7], gamma0(W[j - 15]), W[j - 16]);
            }

            T1 = safe_add_5(h, sigma1(e), ch(e, f, g), K[j], W[j]);
            T2 = safe_add_2(sigma0(a), maj(a, b, c));
            h = g;
            g = f;
            f = e;
            e = safe_add_2(d, T1);
            d = c;
            c = b;
            b = a;
            a = safe_add_2(T1, T2);
        }

        H[0] = safe_add_2(a, H[0]);
        H[1] = safe_add_2(b, H[1]);
        H[2] = safe_add_2(c, H[2]);
        H[3] = safe_add_2(d, H[3]);
        H[4] = safe_add_2(e, H[4]);
        H[5] = safe_add_2(f, H[5]);
        H[6] = safe_add_2(g, H[6]);
        H[7] = safe_add_2(h, H[7]);
    }

    var binarray = [];
    for (var i = 0; i < H.length; i++) {
        binarray.push(H[i].highOrder);
        binarray.push(H[i].lowOrder);
    }

    return binb2hex(binarray);
});

/**
 * (c) jTools Input Mask
 * https://github.com/paulhodel/jtools
 *
 * @author: Paul Hodel <paul.hodel@gmail.com>
 * @description: Input mask
 */

jSuites.mask = (function() {
    var obj = {};
    var index = 0;
    var values = []
    var pieces = [];

    obj.run = function(value, mask, decimal) {
        if (value && mask) {
            if (! decimal) {
                decimal = '.';
            }
            if (value == Number(value)) {
                var number = (''+value).split('.');
                var value = number[0];
                var valueDecimal = number[1];
            } else {
                value = '' + value;
            }
            index = 0;
            values = [];
            // Create mask token
            obj.prepare(mask);
            // Current value
            var currentValue = value;
            if (currentValue) {
                // Checking current value
                for (var i = 0; i < currentValue.length; i++) {
                    if (currentValue[i] != null) {
                        obj.process(currentValue[i]);
                    }
                }
            }
            if (valueDecimal) {
                obj.process(decimal);
                var currentValue = valueDecimal;
                if (currentValue) {
                    // Checking current value
                    for (var i = 0; i < currentValue.length; i++) {
                        if (currentValue[i] != null) {
                            obj.process(currentValue[i]);
                        }
                    }
                }
            }
            // Formatted value
            return values.join('');
        } else {
            return '';
        }
    }

    obj.apply = function(e) {
        var mask = e.target.getAttribute('data-mask');
        if (mask && e.keyCode > 46) {
            index = 0;
            values = [];
            // Create mask token
            obj.prepare(mask);
            // Current value
            if (e.target.selectionStart < e.target.selectionEnd) {
                var currentValue = e.target.value.substring(0, e.target.selectionStart); 
            } else {
                var currentValue = e.target.value;
            }
            if (currentValue) {
                // Checking current value
                for (var i = 0; i < currentValue.length; i++) {
                    if (currentValue[i] != null) {
                        obj.process(currentValue[i]);
                    }
                }
            }
            // New input
            obj.process(obj.fromKeyCode(e));
            // Update value to the element
            e.target.value = values.join('');
            if (pieces.length == values.length && pieces[pieces.length-1].length == values[values.length-1].length) {
                e.target.setAttribute('data-completed', 'true');
            } else {
                e.target.setAttribute('data-completed', 'false');
            }
            // Prevent default
            e.preventDefault();
        }
    }

    /**
     * Process inputs and save to values
     */
    obj.process = function(input) {
        do {
            if (pieces[index] == 'mm') {
                if (values[index] == null || values[index] == '') {
                    if (parseInt(input) > 1 && parseInt(input) < 10) {
                        values[index] = '0' + input;
                        index++;
                        return true;
                    } else if (parseInt(input) < 10) {
                        values[index] = input;
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    if (values[index] == 1 && values[index] < 2 && parseInt(input) < 3) {
                        values[index] += input;
                        index++;
                        return true;
                    } else if (values[index] == 0 && values[index] < 10) {
                        values[index] += input;
                        index++;
                        return true;
                    } else {
                        return false
                    }
                }
            } else if (pieces[index] == 'dd') {
                if (values[index] == null || values[index] == '') {
                    if (parseInt(input) > 3 && parseInt(input) < 10) {
                        values[index] = '0' + input;
                        index++;
                        return true;
                    } else if (parseInt(input) < 10) {
                        values[index] = input;
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    if (values[index] == 3 && parseInt(input) < 2) {
                        values[index] += input;
                        index++;
                        return true;
                    } else if (values[index] < 3 && parseInt(input) < 10) {
                        values[index] += input;
                        index++;
                        return true;
                    } else {
                        return false
                    }
                }
            } else if (pieces[index] == 'hh24') {
                if (values[index] == null || values[index] == '') {
                    if (parseInt(input) > 2 && parseInt(input) < 10) {
                        values[index] = '0' + input;
                        index++;
                        return true;
                    } else if (parseInt(input) < 10) {
                        values[index] = input;
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    if (values[index] == 2 && parseInt(input) < 4) {
                        values[index] += input;
                        index++;
                        return true;
                    } else if (values[index] < 2 && parseInt(input) < 10) {
                        values[index] += input;
                        index++;
                        return true;
                    } else {
                        return false
                    }
                }
            } else if (pieces[index] == 'hh') {
                if (values[index] == null || values[index] == '') {
                    if (parseInt(input) > 1 && parseInt(input) < 10) {
                        values[index] = '0' + input;
                        index++;
                        return true;
                    } else if (parseInt(input) < 10) {
                        values[index] = input;
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    if (values[index] == 1 && parseInt(input) < 3) {
                        values[index] += input;
                        index++;
                        return true;
                    } else if (values[index] < 1 && parseInt(input) < 10) {
                        values[index] += input;
                        index++;
                        return true;
                    } else {
                        return false
                    }
                }
            } else if (pieces[index] == 'mi' || pieces[index] == 'ss') {
                if (values[index] == null || values[index] == '') {
                    if (parseInt(input) > 5 && parseInt(input) < 10) {
                        values[index] = '0' + input;
                        index++;
                        return true;
                    } else if (parseInt(input) < 10) {
                        values[index] = input;
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    if (parseInt(input) < 10) {
                        values[index] += input;
                        index++;
                        return true;
                     } else {
                        return false
                    }
                }
            } else if (pieces[index] == 'yy' || pieces[index] == 'yyyy') {
                if (parseInt(input) < 10) {
                    if (values[index] == null || values[index] == '') {
                        values[index] = input;
                    } else {
                        values[index] += input;
                    }
                    
                    if (values[index].length == pieces[index].length) {
                        index++;
                    }
                    return true;
                } else {
                    return false;
                }
            } else if (pieces[index] == '#' || pieces[index] == '#.##' || pieces[index] == '#,##' || pieces[index] == '# ##') {
                if (input.match(/[0-9]/g)) {
                    if (pieces[index] == '#.##') {
                        var separator = '.';
                    } else if (pieces[index] == '#,##') {
                        var separator = ',';
                    } else if (pieces[index] == '# ##') {
                        var separator = ' ';
                    } else {
                        var separator = '';
                    }
                    if (values[index] == null || values[index] == '') {
                        values[index] = input;
                    } else {
                        values[index] += input;
                        if (separator) {
                            values[index] = values[index].match(/[0-9]/g).join('');
                            var t = [];
                            var s = 0;
                            for (var j = values[index].length - 1; j >= 0 ; j--) {
                                t.push(values[index][j]);
                                s++;
                                if (! (s % 3)) {
                                    t.push(separator);
                                }
                            }
                            t = t.reverse();
                            values[index] = t.join('');
                            if (values[index].substr(0,1) == separator) {
                                values[index] = values[index].substr(1);
                            } 
                        }
                    }
                    return true;
                } else {
                    if (pieces[index] == '#.##' && input == '.') {
                        // Do nothing
                    } else if (pieces[index] == '#,##' && input == ',') {
                        // Do nothing
                    } else if (pieces[index] == '# ##' && input == ' ') {
                        // Do nothing
                    } else {
                        if (values[index]) {
                            index++;
                            if (pieces[index]) {
                                if (pieces[index] == input) {
                                    values[index] = input;
                                    return true;
                                } else {
                                    if (pieces[index] == '0' && pieces[index+1] == input) {
                                        index++;
                                        values[index] = input;
                                        return true;
                                    }
                                }
                            }
                        }
                    }

                    return false;
                }
            } else if (pieces[index] == '0') {
                if (input.match(/[0-9]/g)) {
                    values[index] = input;
                    index++;
                    return true;
                } else {
                    return false;
                }
            } else if (pieces[index] == 'a') {
                if (input.match(/[a-zA-Z]/g)) {
                    values[index] = input;
                    index++;
                    return true;
                } else {
                    return false;
                }
            } else {
                if (pieces[index] != null) {
                    if (pieces[index] == '\\a') {
                        var v = 'a';
                    } else if (pieces[index] == '\\0') {
                        var v = '0';
                    } else if (pieces[index] == '[-]') {
                        if (input == '-' || input == '+') {
                            var v = input;
                        } else {
                            var v = ' ';
                        }
                    } else {
                        var v = pieces[index];
                    }
                    values[index] = v;
                    if (input == v) {
                        index++;
                        return true;
                    }
                }
            }

            index++;
        } while (pieces[index]);
    }

    /**
     * Create tokens for the mask
     */
    obj.prepare = function(mask) {
        pieces = [];
        for (var i = 0; i < mask.length; i++) {
            if (mask[i].match(/[0-9]|[a-z]|\\/g)) {
                if (mask[i] == 'y' && mask[i+1] == 'y' && mask[i+2] == 'y' && mask[i+3] == 'y') {
                    pieces.push('yyyy');
                    i += 3;
                } else if (mask[i] == 'y' && mask[i+1] == 'y') {
                    pieces.push('yy');
                    i++;
                } else if (mask[i] == 'm' && mask[i+1] == 'm' && mask[i+2] == 'm' && mask[i+3] == 'm') {
                    pieces.push('mmmm');
                    i += 3;
                } else if (mask[i] == 'm' && mask[i+1] == 'm' && mask[i+2] == 'm') {
                    pieces.push('mmm');
                    i += 2;
                } else if (mask[i] == 'm' && mask[i+1] == 'm') {
                    pieces.push('mm');
                    i++;
                } else if (mask[i] == 'd' && mask[i+1] == 'd') {
                    pieces.push('dd');
                    i++;
                } else if (mask[i] == 'h' && mask[i+1] == 'h' && mask[i+2] == '2' && mask[i+3] == '4') {
                    pieces.push('hh24');
                    i += 3;
                } else if (mask[i] == 'h' && mask[i+1] == 'h') {
                    pieces.push('hh');
                    i++;
                } else if (mask[i] == 'm' && mask[i+1] == 'i') {
                    pieces.push('mi');
                    i++;
                } else if (mask[i] == 's' && mask[i+1] == 's') {
                    pieces.push('ss');
                    i++;
                } else if (mask[i] == 'a' && mask[i+1] == 'm') {
                    pieces.push('am');
                    i++;
                } else if (mask[i] == 'p' && mask[i+1] == 'm') {
                    pieces.push('pm');
                    i++;
                } else if (mask[i] == '\\' && mask[i+1] == '0') {
                    pieces.push('\\0');
                    i++;
                } else if (mask[i] == '\\' && mask[i+1] == 'a') {
                    pieces.push('\\a');
                    i++;
                } else {
                    pieces.push(mask[i]);
                }
            } else {
                if (mask[i] == '#' && mask[i+1] == '.' && mask[i+2] == '#' && mask[i+3] == '#') {
                    pieces.push('#.##');
                    i += 3;
                } else if (mask[i] == '#' && mask[i+1] == ',' && mask[i+2] == '#' && mask[i+3] == '#') {
                    pieces.push('#,##');
                    i += 3;
                } else if (mask[i] == '#' && mask[i+1] == ' ' && mask[i+2] == '#' && mask[i+3] == '#') {
                    pieces.push('# ##');
                    i += 3;
                } else if (mask[i] == '[' && mask[i+1] == '-' && mask[i+2] == ']') {
                    pieces.push('[-]');
                    i += 2;
                } else {
                    pieces.push(mask[i]);
                }
            }
        }
    }

    /** 
     * Thanks for the collaboration
     */
    obj.fromKeyCode = function(e) {
        var _to_ascii = {
            '188': '44',
            '109': '45',
            '190': '46',
            '191': '47',
            '192': '96',
            '220': '92',
            '222': '39',
            '221': '93',
            '219': '91',
            '173': '45',
            '187': '61', //IE Key codes
            '186': '59', //IE Key codes
            '189': '45'  //IE Key codes
        }

        var shiftUps = {
            "96": "~",
            "49": "!",
            "50": "@",
            "51": "#",
            "52": "$",
            "53": "%",
            "54": "^",
            "55": "&",
            "56": "*",
            "57": "(",
            "48": ")",
            "45": "_",
            "61": "+",
            "91": "{",
            "93": "}",
            "92": "|",
            "59": ":",
            "39": "\"",
            "44": "<",
            "46": ">",
            "47": "?"
        };

        var c = e.which;

        if (_to_ascii.hasOwnProperty(c)) {
            c = _to_ascii[c];
        }

        if (!e.shiftKey && (c >= 65 && c <= 90)) {
            c = String.fromCharCode(c + 32);
        } else if (e.shiftKey && shiftUps.hasOwnProperty(c)) {
            c = shiftUps[c];
        } else if (96 <= c && c <= 105) {
            c = String.fromCharCode(c - 48);
        } else {
            c = String.fromCharCode(c);
        }

        return c;
    }

    return obj;
})();

jSuites.mobile = (function(el, options) {
    var obj = {};
    obj.options = {};

    if (jSuites.el) {
        jSuites.el.addEventListener('mousedown', function(e) {
            if (e.target.classList.contains('option-title')) {
                if (e.target.classList.contains('selected')) {
                    e.target.classList.remove('selected');
                } else {
                    e.target.classList.add('selected');
                }
            }
        });
    }

    return obj;
})();

jSuites.pages = (function() {
    var container = null;
    var current = null;

    // Create a page
    var createPage = function(options, callback) {
        // Create page
        var page = document.createElement('div');
        page.classList.add('page');

        // Always hidden
        page.style.display = 'none';

        // Keep options
        page.options = options ? options : {};

        if (! current) {
            container.appendChild(page);
        } else {
            container.insertBefore(page, current.nextSibling);
        }

        jSuites.ajax({
            url: page.options.url,
            method: 'GET',
            success: function(result) {
                // Push to refresh controls
                jSuites.refresh(page, page.options.onpush);

                // Open page
                page.innerHTML = result;
                // Get javascript
                var script = page.getElementsByTagName('script');
                // Run possible inline scripts
                for (var i = 0; i < script.length; i++) {
                    // Get type
                    var type = script[i].getAttribute('type');
                    if (! type || type == 'text/javascript') {
                        eval(script[i].innerHTML);
                    }
                }
                // Set title
                page.setTitle = function(text) {
                    this.children[0].children[0].children[1].innerHTML = text;
                }
                // Show page
                if (! page.options.closed) {
                    showPage(page);
                }
                // Onload callback
                if (typeof(page.options.onload) == 'function') {
                    page.options.onload(page);
                }
                // Force callback
                if (typeof(callback) == 'function') {
                    callback(page);
                }
            }
        });

        return page;
    }

    var showPage = function(page, ignoreHistory, callback) {
        if (current) {
            if (current == page) {
                current = page;
            } else {
                // Keep scroll in the top
                window.scrollTo({ top: 0 });

                // Show page
                page.style.display = '';

                var a = Array.prototype.indexOf.call(container.children, current);
                var b = Array.prototype.indexOf.call(container.children, page);

                // Leave
                if (typeof(current.options.onleave) == 'function') {
                    current.options.onleave(current, page, ignoreHistory);
                }

                jSuites.slideLeft(container, (a < b ? 0 : 1), function() {
                    current.style.display = 'none';
                    current = page;
                });

                // Enter
                if (typeof(page.options.onenter) == 'function') {
                    page.options.onenter(page, current, ignoreHistory);
                }
            }
        } else {
            // Show
            page.style.display = '';

            // Keep current
            current = page;

            // Enter
            if (typeof(page.options.onenter) == 'function') {
                page.options.onenter(page);
            }
        }

        // Add history
        if (! ignoreHistory) {
            // Add history
            window.history.pushState({ route: page.options.route }, page.options.title, page.options.route);
        }

        // Callback
        if (typeof(callback) == 'function') {
            callback(page);
        }
    }

    // Init method
    var obj = function(route, mixed) {

        // Create page container
        if (! container) {
            container = document.querySelector('.pages');
            if (! container) {
                container = document.createElement('div');
                container.className = 'pages';
            }

            // Append container to the application
            if (jSuites.el) {
                jSuites.el.appendChild(container);
            } else {
                document.body.appendChild(container);
            }
        }

        if (! obj.pages[route]) {
            if (! route) {
                alert('Error, no route provided');
            } else {
                if (typeof(mixed) == 'function') {
                    var options = {};
                    var callback = mixed;
                } else {
                    // Page options
                    var options = mixed ? mixed : {};
                }

                // Closed
                options.closed = mixed && mixed.closed ? 1 : 0;
                // Keep Route
                options.route = route;

                // New page url
                if (! options.url) {
                    var routePath = route.split('#');
                    options.url = jSuites.pages.path + routePath[0] + '.html';
                }
                // Title
                if (! options.title) {
                    options.title = 'Untitled';
                }

                // Create new page
                obj.pages[route] = createPage(options, callback ? callback : null);
            }
        } else {
            // Update config
            if (mixed) {
                // History
                var ignoreHistory = 0;

                if (typeof(mixed) == 'function') {
                    var callback = mixed;
                } else {
                    if (typeof(mixed.onenter) == 'function') {
                        obj.pages[route].options.onenter = mixed.onenter;
                    }
                    if (typeof(mixed.onleave) == 'function') {
                        obj.pages[route].options.onleave = mixed.onleave;
                    }

                    // Ignore history
                    ignoreHistory = mixed.ignoreHistory ? 1 : 0; 
                }
            }

            showPage(obj.pages[route], ignoreHistory, callback ? callback : null);
        }
    }

    obj.pages = {};

    // Get page
    obj.get = function(route) {
        if (obj.pages[route]) {
            return obj.pages[route]; 
        }
    }

    obj.getContainer = function() {
        return container;
    }

    obj.destroy = function() {
        // Current is null
        current = null;
        // Destroy containers
        obj.pages = {};
        // Reset container
        if (container) {
            container.innerHTML = '';
        }
    }

    return obj;
})();

// Path
jSuites.pages.path = 'pages';

// Panel
jSuites.panel = (function() {
    // No initial panel declared
    var panel = null;

    var obj = function(route) {
        if (! panel) {
            obj.create(jSuites.pages.path + route + '.html');
        }

        // Show panel
        panel.style.display = '';

        // Add animation
        if (panel.classList.contains('panel-left')) {
            jSuites.slideLeft(panel, 1);
        } else {
            jSuites.slideRight(panel, 1);
        }
    }

    obj.create = function(route) {
        if (! panel) {
            // Create element
            panel = document.createElement('div');
            panel.classList.add('panel');
            panel.classList.add('panel-left');
            panel.style.display = 'none';

            // Bind to the app
            if (jSuites.el) {
                jSuites.el.appendChild(panel);
            } else {
                document.body.appendChild(panel);
            }
        }

        // Remote content
        if (route) {
            var url = jSuites.pages.path + route + '.html';

            jSuites.ajax({
                url: url,
                method: 'GET',
                success: function(result) {
                    // Set content
                    panel.innerHTML = result;
                    // Get javascript
                    var script = panel.getElementsByTagName('script');
                    // Run possible inline scripts
                    for (var i = 0; i < script.length; i++) {
                        // Get type
                        var type = script[i].getAttribute('type');
                        if (! type || type == 'text/javascript') {
                            eval(script[i].innerHTML);
                        }
                    }
                }
            });
        }
    }

    obj.close = function() {
        if (panel) {
            // Animation
            if (panel.classList.contains('panel-left')) {
                jSuites.slideLeft(panel, 0, function() {
                    panel.style.display = 'none';
                });
            } else {
                jSuites.slideRight(panel, 0, function() {
                    panel.style.display = 'none';
                });
            }
        }
    }

    obj.get = function() {
        return panel;
    }

    obj.destroy = function() {
        panel.remove();
        panel = null;
    }

    return obj;
})();

jSuites.toolbar = (function(el, options) {
    var obj = {};
    obj.options = options;

    obj.selectItem = function(element) {
        var elements = toolbarContent.children;
        for (var i = 0; i < elements.length; i++) {
            elements[i].classList.remove('selected');
        }
        element.classList.add('selected');
    }

    obj.hide = function() {
        jSuites.slideBottom(toolbar, 0, function() {
            toolbar.style.display = 'none';
        });
    }

    obj.show = function() {
        toolbar.style.display = '';
        jSuites.slideBottom(toolbar, 1);
    }

    obj.get = function() {
        return toolbar;
    }

    obj.setBadge = function(index, value) {
        toolbarContent.children[index].children[1].firstChild.innerHTML = value;
    }

    obj.destroy = function() {
        toolbar.remove();
        toolbar = null;
    }

    var toolbar = document.createElement('div');
    toolbar.classList.add('jtoolbar');
    toolbar.onclick = function(e) {
        var element = jSuites.getElement(e.target, 'jtoolbar-item');
        if (element) {
            obj.selectItem(element);
        }
    }

    var toolbarContent = document.createElement('div');
    toolbar.appendChild(toolbarContent);

    for (var i = 0; i < options.items.length; i++) {
        var toolbarItem = document.createElement('div');
        toolbarItem.classList.add('jtoolbar-item');
        if (options.items[i].route) {
            toolbarItem.setAttribute('data-href', options.items[i].route);
            jSuites.pages(options.items[i].route, {
                closed: true,
                onenter: function() {
                    obj.selectItem(toolbarItem);
                }
            });
        }

        if (options.items[i].icon) {
            var toolbarIcon = document.createElement('i');
            toolbarIcon.classList.add('material-icons');
            toolbarIcon.innerHTML = options.items[i].icon;
            toolbarItem.appendChild(toolbarIcon);
        }

        var toolbarBadge = document.createElement('div');
        toolbarBadge.classList.add('jbadge');
        var toolbarBadgeContent = document.createElement('div');
        toolbarBadgeContent.innerHTML = options.items[i].badge ? options.items[i].badge : '';
        toolbarBadge.appendChild(toolbarBadgeContent);
        toolbarItem.appendChild(toolbarBadge);

        if (options.items[i].title) {
            var toolbarTitle = document.createElement('span');
            toolbarTitle.innerHTML = options.items[i].title;
            toolbarItem.appendChild(toolbarTitle);
        }

        toolbarContent.appendChild(toolbarItem);
    }

    el.toolbar = obj;

    el.appendChild(toolbar);

    return obj;
});

jSuites.actionsheet = (function() {
    var actionsheet = document.createElement('div');
    actionsheet.className = 'jactionsheet';
    actionsheet.style.display = 'none';

    var actionContent = document.createElement('div');
    actionContent.className = 'jactionsheet-content';
    actionsheet.appendChild(actionContent);

    var obj = function(options) {
        if (options) {
            obj.options = options;
        }

        // Reset container
        actionContent.innerHTML = '';

        // Create new elements
        for (var i = 0; i < obj.options.length; i++) {
            var actionGroup = document.createElement('div');
            actionGroup.className = 'jactionsheet-group';

            for (var j = 0; j < obj.options[i].length; j++) {
                var v = obj.options[i][j];
                var actionItem = document.createElement('div');
                var actionInput = document.createElement('input');
                actionInput.type = 'button';
                actionInput.value = v.title;
                if (v.className) {
                    actionInput.className = v.className; 
                }
                if (v.onclick) {
                    actionInput.onclick = v.onclick; 
                }
                if (v.action == 'cancel') {
                    actionInput.style.color = 'red';
                }
                actionItem.appendChild(actionInput);
                actionGroup.appendChild(actionItem);
            }

            actionContent.appendChild(actionGroup);
        }

        // Show
        actionsheet.style.display = '';

        // Append
        jSuites.el.appendChild(actionsheet);

        // Animation
        jSuites.slideBottom(actionContent, true);
    }

    obj.close = function() {
        if (actionsheet.style.display != 'none') {
            // Remove any existing actionsheet
            jSuites.slideBottom(actionContent, false, function() {
                actionsheet.remove();
                actionsheet.style.display = 'none';
            });
        }
    }

    var mouseUp = function(e) {
        obj.close();
    }

    actionsheet.addEventListener('mouseup', mouseUp);

    obj.options = {};

    return obj;
})();

/**
 * (c) jSuites modal
 * https://github.com/paulhodel/jsuites
 *
 * @author: Paul Hodel <paul.hodel@gmail.com>
 * @description: Modal
 */

jSuites.modal = (function(el, options) {
    var obj = {};
    obj.options = {};

    // Default configuration
    var defaults = {
        url: null,
        onopen: null,
        onclose: null,
        closed: false,
        width: null,
        height: null,
        title: null,
    };

    // Loop through our object
    for (var property in defaults) {
        if (options && options.hasOwnProperty(property)) {
            obj.options[property] = options[property];
        } else {
            obj.options[property] = defaults[property];
        }
    }

    // Title
    if (! obj.options.title && el.getAttribute('title')) {
        obj.options.title = el.getAttribute('title');
    }

    var temp = document.createElement('div');
    for (var i = 0; i < el.children.length; i++) {
        temp.appendChild(el.children[i]);
    }

    obj.content = document.createElement('div');
    obj.content.className = 'jmodal_content';
    obj.content.innerHTML = el.innerHTML;

    for (var i = 0; i < temp.children.length; i++) {
        obj.content.appendChild(temp.children[i]);
    }

    obj.container = document.createElement('div');
    obj.container.className = 'jmodal';
    obj.container.appendChild(obj.content);

    if (obj.options.width) {
        obj.container.style.width = obj.options.width;
    }
    if (obj.options.height) {
        obj.container.style.height = obj.options.height;
    }
    if (obj.options.title) {
        obj.container.setAttribute('title', obj.options.title);
    } else {
        obj.container.classList.add('no-title');
    }
    el.innerHTML = '';
    el.style.display = 'none';
    el.appendChild(obj.container);

    // Backdrop
    var backdrop = document.createElement('div');
    backdrop.className = 'jmodal_backdrop';
    el.appendChild(backdrop);

    obj.open = function() {
        el.style.display = 'block';
        // Fullscreen
        const rect = obj.container.getBoundingClientRect();
        if (jSuites.getWindowWidth() < rect.width) {
            obj.container.style.top = '';
            obj.container.style.left = '';
            obj.container.classList.add('jmodal_fullscreen');
            jSuites.slideBottom(obj.container, 1);
        } else {
            backdrop.style.display = 'block';
        }
        // Current
        jSuites.modal.current = obj;
        // Event
        if (typeof(obj.options.onopen) == 'function') {
            obj.options.onopen(el, obj);
        }
    }

    obj.resetPosition = function() {
        obj.container.style.top = '';
        obj.container.style.left = '';
    }

    obj.isOpen = function() {
        return el.style.display != 'none' ? true : false;
    }

    obj.close = function() {
        el.style.display = 'none';
        // Backdrop
        backdrop.style.display = '';
        // Current
        jSuites.modal.current = null;
        // Remove fullscreen class
        obj.container.classList.remove('jmodal_fullscreen');
        // Event
        if (typeof(obj.options.onclose) == 'function') {
            obj.options.onclose(el, obj);
        }
    }

    if (! jSuites.modal.hasEvents) {
        jSuites.modal.current = obj;

        if ('ontouchstart' in document.documentElement === true) {
            document.addEventListener("touchstart", jSuites.modal.mouseDownControls);
        } else {
            document.addEventListener('mousedown', jSuites.modal.mouseDownControls);
            document.addEventListener('mousemove', jSuites.modal.mouseMoveControls);
            document.addEventListener('mouseup', jSuites.modal.mouseUpControls);
        }

        document.addEventListener('keydown', jSuites.modal.keyDownControls);

        jSuites.modal.hasEvents = true;
    }

    if (obj.options.url) {
        jSuites.ajax({
            url: obj.options.url,
            method: 'GET',
            success: function(data) {
                obj.content.innerHTML = data;

                if (! obj.options.closed) {
                    obj.open();
                }
            }
        });
    } else {
        if (! obj.options.closed) {
            obj.open();
        }
    }

    // Keep object available from the node
    el.modal = obj;

    return obj;
});

jSuites.modal.current = null;
jSuites.modal.position = null;

jSuites.modal.keyDownControls = function(e) {
    if (e.which == 27) {
        if (jSuites.modal.current) {
            jSuites.modal.current.close();
        }
    }
}

jSuites.modal.mouseUpControls = function(e) {
    if (jSuites.modal.current) {
        jSuites.modal.current.container.style.cursor = 'auto';
    }
    jSuites.modal.position = null;
}

jSuites.modal.mouseMoveControls = function(e) {
    if (jSuites.modal.current && jSuites.modal.position) {
        if (e.which == 1 || e.which == 3) {
            var position = jSuites.modal.position;
            jSuites.modal.current.container.style.top = (position[1] + (e.clientY - position[3]) + (position[5] / 2)) + 'px';
            jSuites.modal.current.container.style.left = (position[0] + (e.clientX - position[2]) + (position[4] / 2)) + 'px';
            jSuites.modal.current.container.style.cursor = 'move';
        } else {
            jSuites.modal.current.container.style.cursor = 'auto';
        }
    }
}

jSuites.modal.mouseDownControls = function(e) {
    jSuites.modal.position = [];

    if (e.target.classList.contains('jmodal')) {
        setTimeout(function() {
            // Get target info
            var rect = e.target.getBoundingClientRect();

            if (e.changedTouches && e.changedTouches[0]) {
                var x = e.changedTouches[0].clientX;
                var y = e.changedTouches[0].clientY;
            } else {
                var x = e.clientX;
                var y = e.clientY;
            }

            if (rect.width - (x - rect.left) < 50 && (y - rect.top) < 50) {
                setTimeout(function() {
                    jSuites.modal.current.close();
                }, 100);
            } else {
                if (e.target.getAttribute('title') && (y - rect.top) < 50) {
                    if (document.selection) {
                        document.selection.empty();
                    } else if ( window.getSelection ) {
                        window.getSelection().removeAllRanges();
                    }

                    jSuites.modal.position = [
                        rect.left,
                        rect.top,
                        e.clientX,
                        e.clientY,
                        rect.width,
                        rect.height,
                    ];
                }
            }
        }, 100);
    }
}


jSuites.notification = (function(options) {
    var obj = {};
    obj.options = {};

    // Default configuration
    var defaults = {
        icon: null,
        name: 'Notification',
        date: null,
        title: null,
        message: null,
        timeout: 4000,
        autoHide: true,
        closeable: true,
    };

    // Loop through our object
    for (var property in defaults) {
        if (options && options.hasOwnProperty(property)) {
            obj.options[property] = options[property];
        } else {
            obj.options[property] = defaults[property];
        }
    }

    var notification = document.createElement('div');
    notification.className = 'jnotification';

    var notificationContainer = document.createElement('div');
    notificationContainer.className = 'jnotification-container';
    notification.appendChild(notificationContainer);

    var notificationHeader = document.createElement('div');
    notificationHeader.className = 'jnotification-header';
    notificationContainer.appendChild(notificationHeader);

    var notificationImage = document.createElement('div');
    notificationImage.className = 'jnotification-image';
    notificationHeader.appendChild(notificationImage);

    if (obj.options.icon) {
        var notificationIcon = document.createElement('img');
        notificationIcon.src = obj.options.icon;
        notificationImage.appendChild(notificationIcon);
    }

    var notificationName = document.createElement('div');
    notificationName.className = 'jnotification-name';
    notificationName.innerHTML = obj.options.name;
    notificationHeader.appendChild(notificationName);

    if (obj.options.closeable == true) {
        var notificationClose = document.createElement('div');
        notificationClose.className = 'jnotification-close';
        notificationClose.onclick = function() {
            obj.hide();
        }
        notificationHeader.appendChild(notificationClose);
    }

    var notificationDate = document.createElement('div');
    notificationDate.className = 'jnotification-date';
    notificationHeader.appendChild(notificationDate);

    var notificationContent = document.createElement('div');
    notificationContent.className = 'jnotification-content';
    notificationContainer.appendChild(notificationContent);

    if (obj.options.title) {
        var notificationTitle = document.createElement('div');
        notificationTitle.className = 'jnotification-title';
        notificationTitle.innerHTML = obj.options.title;
        notificationContent.appendChild(notificationTitle);
    }

    var notificationMessage = document.createElement('div');
    notificationMessage.className = 'jnotification-message';
    notificationMessage.innerHTML = obj.options.message;
    notificationContent.appendChild(notificationMessage);

    obj.show = function() {
        document.body.appendChild(notification);
        if (jSuites.getWindowWidth() > 800) { 
            jSuites.fadeIn(notification);
        } else {
            jSuites.slideTop(notification, 1);
        }
    }

    obj.hide = function() {
        if (jSuites.getWindowWidth() > 800) { 
            jSuites.fadeOut(notification, function() {
                notification.parentNode.removeChild(notification);
            });
        } else {
            jSuites.slideTop(notification, 0, function() {
                notification.parentNode.removeChild(notification);
            });
        }
    };

    obj.show();

    if (obj.options.autoHide == true) {
        setTimeout(function() {
            obj.hide();
        }, obj.options.timeout);
    }

    if (jSuites.getWindowWidth() < 800) {
        notification.addEventListener("swipeup", function(e) {
            obj.hide();
            e.preventDefault();
            e.stopPropagation();
        });
    }

    return obj;
});

jSuites.rating = (function(el, options) {
    var obj = {};
    obj.options = {};

    // Default configuration
    var defaults = {
        number: 5,
        value: 0,
        tooltip: [ 'Very bad', 'Bad', 'Average', 'Good', 'Very good' ],
        onchange: null,
    };

    // Loop through the initial configuration
    for (var property in defaults) {
        if (options && options.hasOwnProperty(property)) {
            obj.options[property] = options[property];
        } else {
            obj.options[property] = defaults[property];
        }
    }

    // Class
    el.classList.add('jrating');

    // Add elements
    for (var i = 0; i < obj.options.number; i++) {
        var div = document.createElement('div');
        div.setAttribute('data-index', (i + 1))
        div.setAttribute('title', obj.options.tooltip[i])
        el.appendChild(div);
    }

    // Set value
    obj.setValue = function(index) {
        for (var i = 0; i < obj.options.number; i++) {
            if (i < index) {
                el.children[i].classList.add('jrating-selected');
            } else {
                el.children[i].classList.remove('jrating-over');
                el.children[i].classList.remove('jrating-selected');
            }
        }

        obj.options.value = index;

        if (typeof(obj.options.onchange) == 'function') {
            obj.options.onchange(el, index);
        }
    }

    obj.getValue = function() {
        return obj.options.value;
    }

    if (obj.options.value) {
        for (var i = 0; i < obj.options.number; i++) {
            if (i < obj.options.value) {
                el.children[i].classList.add('jrating-selected');
            }
        }
    }

    // Events
    el.addEventListener("click", function(e) {
        var index = e.target.getAttribute('data-index');
        if (index != undefined) {
            if (index == obj.options.value) {
                obj.setValue(0);
            } else {
                obj.setValue(index);
            }
        }
    });

    el.addEventListener("mouseover", function(e) {
        var index = e.target.getAttribute('data-index');
        for (var i = 0; i < obj.options.number; i++) {
            if (i < index) {
                el.children[i].classList.add('jrating-over');
            } else {
                el.children[i].classList.remove('jrating-over');
            }
        }
    });

    el.addEventListener("mouseout", function(e) {
        for (var i = 0; i < obj.options.number; i++) {
            el.children[i].classList.remove('jrating-over');
        }
    });

    el.rating = obj;

    return obj;
});


/**
 * (c) Image slider
 * https://github.com/paulhodel/jtools
 *
 * @author: Paul Hodel <paul.hodel@gmail.com>
 * @description: Image Slider
 */

jSuites.slider = (function(el, options) {
    var obj = {};
    obj.options = {};
    obj.currentImage = null;

    if (options) {
        obj.options = options;
    }

    // Items
    obj.options.items = [];

    if (! el.classList.contains('jslider')) {
        el.classList.add('jslider');

        // Create container
        var container = document.createElement('div');
        container.className = 'jslider-container';

        // Move children inside
        if (el.children.length > 0) {
            // Keep children items
            for (var i = 0; i < el.children.length; i++) {
                obj.options.items.push(el.children[i]);
            }
        }
        if (obj.options.items.length > 0) {
            for (var i = 0; i < obj.options.items.length; i++) {
                obj.options.items[i].classList.add('jfile');
                var index = obj.options.items[i].src.lastIndexOf('/');
                if (index < 0) {
                    obj.options.items[i].setAttribute('data-name', obj.options.items[i].src);
                } else {
                    obj.options.items[i].setAttribute('data-name', obj.options.items[i].src.substr(index + 1));
                }
                var index = obj.options.items[i].src.lastIndexOf('/');

                container.appendChild(obj.options.items[i]);
            }
        }
        el.appendChild(container);
        // Add close buttom
        var close = document.createElement('div');
        close.className = 'jslider-close';
        close.innerHTML = '';
        close.onclick =  function() {
            obj.close();
        }
        el.appendChild(close);
    } else {
        var container = el.querySelector('slider-container');
    }

    obj.show = function(target) {
        if (! target) {
            var target = container.children[0];
        }

        if (! container.classList.contains('jslider-preview')) {
            container.classList.add('jslider-preview');
            close.style.display = 'block';
        }

        // Hide all images
        for (var i = 0; i < container.children.length; i++) {
            container.children[i].style.display = 'none';
        }

        // Show clicked only
        target.style.display = 'block';

        // Is there any previous
        if (target.previousSibling) {
            container.classList.add('jslider-left');
        } else {
            container.classList.remove('jslider-left');
        }

        // Is there any next
        if (target.nextSibling) {
            container.classList.add('jslider-right');
        } else {
            container.classList.remove('jslider-right');
        }

        obj.currentImage = target;
    }

    obj.open = function() {
        obj.show();

        // Event
        if (typeof(obj.options.onopen) == 'function') {
            obj.options.onopen(el);
        }
    }

    obj.close = function() {
        container.classList.remove('jslider-preview');
        container.classList.remove('jslider-left');
        container.classList.remove('jslider-right');

        for (var i = 0; i < container.children.length; i++) {
            container.children[i].style.display = '';
        }

        close.style.display = '';

        obj.currentImage = null;

        // Event
        if (typeof(obj.options.onclose) == 'function') {
            obj.options.onclose(el);
        }
    }

    obj.reset = function() {
        container.innerHTML = '';
    }

    obj.addFile = function(v, ignoreEvents) {
        var img = document.createElement('img');
        img.setAttribute('data-lastmodified', v.lastmodified);
        img.setAttribute('data-name', v.name);
        img.setAttribute('data-size', v.size);
        img.setAttribute('data-extension', v.extension);
        img.setAttribute('data-cover', v.cover);
        img.setAttribute('src', v.file);
        img.className = 'jfile';
        container.appendChild(img);
        obj.options.items.push(img);

        // Onchange
        if (! ignoreEvents) {
            if (typeof(obj.options.onchange) == 'function') {
                obj.options.onchange(el, v);
            }
        }
    }

    obj.addFiles = function(files) {
        for (var i = 0; i < files.length; i++) {
            obj.addFile(files[i]);
        }
    }

    obj.next = function() {
        if (obj.currentImage.nextSibling) {
            obj.show(obj.currentImage.nextSibling);
        }
    }
    
    obj.prev = function() {
        if (obj.currentImage.previousSibling) {
            obj.show(obj.currentImage.previousSibling);
        }
    }

    obj.getData = function() {
        return jSuites.getFiles(container);
    }

    // Append data
    if (obj.options.data && obj.options.data.length) {
        for (var i = 0; i < obj.options.data.length; i++) {
            if (obj.options.data[i]) {
                obj.addFile(obj.options.data[i]);
            }
        }
    }

    // Allow insert
    if (obj.options.allowAttachment) {
        var attachmentInput = document.createElement('input');
        attachmentInput.type = 'file';
        attachmentInput.className = 'slider-attachment';
        attachmentInput.setAttribute('accept', 'image/*');
        attachmentInput.style.display = 'none';
        attachmentInput.onchange = function() {
            var reader = [];

            for (var i = 0; i < this.files.length; i++) {
                var type = this.files[i].type.split('/');

                if (type[0] == 'image') {
                    var extension = this.files[i].name;
                    extension = extension.split('.');
                    extension = extension[extension.length-1];

                    var file = {
                        size: this.files[i].size,
                        name: this.files[i].name,
                        extension: extension,
                        cover: 0,
                        lastmodified: this.files[i].lastModified,
                    }

                    reader[i] = new FileReader();
                    reader[i].addEventListener("load", function (e) {
                        file.file = e.target.result;
                        obj.addFile(file);
                    }, false);

                    reader[i].readAsDataURL(this.files[i]);
                } else {
                    alert('The extension is not allowed');
                }
            };
        }

        var attachmentIcon = document.createElement('i');
        attachmentIcon.innerHTML = 'attachment';
        attachmentIcon.className = 'jslider-attach material-icons';
        attachmentIcon.onclick = function() {
            jSuites.click(attachmentInput);
        }

        el.appendChild(attachmentInput);
        el.appendChild(attachmentIcon);
    }

    // Push to refresh
    var longTouchTimer = null;

    var mouseDown = function(e) {
        if (e.target.tagName == 'IMG') {
            // Remove
            var targetImage = e.target;
            longTouchTimer = setTimeout(function() {
                if (e.target.src.substr(0,4) == 'data') {
                    e.target.remove();
                } else {
                    if (e.target.classList.contains('jremove')) {
                        e.target.classList.remove('jremove');
                    } else {
                        e.target.classList.add('jremove');
                    }
                }

                // Onchange
                if (typeof(obj.options.onchange) == 'function') {
                    obj.options.onchange(el, e.target);
                }
            }, 1000);
        }
    }

    var mouseUp = function(e) {
        if (longTouchTimer) {
            clearTimeout(longTouchTimer);
        }

        // Open slider
        if (e.target.tagName == 'IMG') {
            if (! e.target.classList.contains('jremove')) {
                obj.show(e.target);
            }
        } else {
            // Arrow controls
            if (e.target.clientWidth - e.offsetX < 40) {
                // Show next image
                obj.next();
            } else if (e.offsetX < 40) {
                // Show previous image
                obj.prev();
            }
        }
    }

    container.addEventListener('mousedown', mouseDown);
    container.addEventListener('touchstart', mouseDown);
    container.addEventListener('mouseup', mouseUp);
    container.addEventListener('touchend', mouseUp);

    // Add global events
    el.addEventListener("swipeleft", function(e) {
        obj.next();
        e.preventDefault();
        e.stopPropagation();
    });

    el.addEventListener("swiperight", function(e) {
        obj.prev();
        e.preventDefault();
        e.stopPropagation();
    });


    el.slider = obj;

    return obj;
});

/**
 * (c) jTools v1.0.1 - Element sorting
 * https://github.com/paulhodel/jtools
 *
 * @author: Paul Hodel <paul.hodel@gmail.com>
 * @description: Element drag and drop sorting
 */

jSuites.sorting = (function(el, options) {
    el.classList.add('jsorting');

    el.addEventListener('dragstart', function(e) {
        e.target.classList.add('dragging');
    });

    el.addEventListener('dragover', function(e) {
        e.preventDefault();

        if (e.target.clientHeight / 2 > e.offsetY) {
            e.path[0].style.borderTop = '1px dotted #ccc';
            e.path[0].style.borderBottom = '';
        } else {
            e.path[0].style.borderTop = '';
            e.path[0].style.borderBottom = '1px dotted #ccc';
        }
    });

    el.addEventListener('dragleave', function(e) {
        e.path[0].style.borderTop = '';
        e.path[0].style.borderBottom = '';
    });

    el.addEventListener('dragend', function(e) {
        e.path[1].querySelector('.dragging').classList.remove('dragging');
    });

    el.addEventListener('drop', function(e) {
        var element = e.path[1].querySelector('.dragging');

        if (e.target.clientHeight / 2 > e.offsetY) {
            e.path[1].insertBefore(element, e.path[0]);
        } else {
            e.path[1].insertBefore(element, e.path[0].nextSibling);
        }

        e.path[0].style.borderTop = '';
        e.path[0].style.borderBottom = '';
    });

    for (var i = 0; i < el.children.length; i++) {
        el.children[i].setAttribute('draggable', 'true');
    };

    return el;
});

jSuites.tabs = (function(el, options) {
    var obj = {};
    obj.options = {};

    // Default configuration
    var defaults = {
        data: null,
        onchange: null,
        onload: null,
    };

    // Loop through the initial configuration
    for (var property in defaults) {
        if (options && options.hasOwnProperty(property)) {
            obj.options[property] = options[property];
        } else {
            obj.options[property] = defaults[property];
        }
    }

    // Class
    el.classList.add('jtabs');

    // Create from data
    if (obj.options.data) {
        // Make sure the component is blank
        el.innerHTML = '';
        var headers = document.createElement('div');
        var content = document.createElement('div');
        headers.classList.add('jtabs-headers');
        content.classList.add('jtabs-content');
        el.appendChild(headers);
        el.appendChild(content);

        for (var i = 0; i < obj.options.data.length; i++) {
            var headersItem = document.createElement('div');
            headers.appendChild(headersItem);
            var contentItem = document.createElement('div');
            content.appendChild(contentItem);

            headersItem.innerHTML = obj.options.data[i].title;
            if (obj.options.data[i].content) {
                contentItem.innerHTML = obj.options.data[i].content;
            } else if (obj.options.data[i].url) {
                jSuites.ajax({
                    url: obj.options.data[i].url,
                    type: 'GET',
                    success: function(result) {
                        contentItem.innerHTML = result;
                    },
                    complete: function() {
                        if (typeof(obj.options.onload) == 'function') {
                            obj.options.onload(el);
                        }
                    }
                });
            }
        }
    } else if (el.children[0] && el.children[1]) {
        // Create from existing elements
        var headers = el.children[0];
        var content = el.children[1];
        headers.classList.add('jtabs-headers');
        content.classList.add('jtabs-content');
    }

    // Border
    var border = document.createElement('div');
    border.className = 'jtabs-border';
    el.appendChild(border);

    var setBorder = function(index) {
        var rect = headers.children[index].getBoundingClientRect();
        border.style.width = rect.width + 'px';
        border.style.top = rect.top + rect.height - 2 + 'px';
        border.style.left = rect.left + 'px';
    }

    // Set value
    obj.open = function(index) {
        for (var i = 0; i < headers.children.length; i++) {
            headers.children[i].classList.remove('jtabs-selected');
            if (content.children[i]) {
                content.children[i].classList.remove('jtabs-selected');
            }
        }

        headers.children[index].classList.add('jtabs-selected');
        if (content.children[index]) {
            content.children[index].classList.add('jtabs-selected');
        }

        // Set border
        setTimeout(function() {
            setBorder(index);
        }, 10);
    }

    // Events
    headers.addEventListener("click", function(e) {
        var index = Array.prototype.indexOf.call(headers.children, e.target);
        if (index >= 0) {
            obj.open(index);
        }
    });

    obj.open(0);

    el.tabs = obj;

    return obj;
});

jSuites.tags = (function(el, options) {
    var obj = {};
    obj.options = {};

    /**
     * @typedef {Object} defaults
     * @property {(string|Array)} value - Initial value of the compontent
     * @property {number} limit - Max number of tags inside the element
     * @property {string} search - The URL for suggestions
     * @property {string} placeholder - The default instruction text on the element
     * @property {validation} validation - Method to validate the tags
     * @property {requestCallback} onbeforechange - Method to be execute before any changes on the element
     * @property {requestCallback} onchange - Method to be execute after any changes on the element
     * @property {requestCallback} onfocus - Method to be execute when on focus
     * @property {requestCallback} onblur - Method to be execute when on blur
     * @property {requestCallback} onload - Method to be execute when the element is loaded
     */
    var defaults = {
        value: null,
        limit: null,
        search: null,
        placeholder: null,
        validation: null,
        onbeforechange: null,
        onchange: null,
        onfocus: null,
        onblur: null,
        onload: null,
        colors: null,
    };

    // Loop through though the default configuration
    for (var property in defaults) {
        if (options && options.hasOwnProperty(property)) {
            obj.options[property] = options[property];
        } else {
            obj.options[property] = defaults[property];
        }
    }

    // Search helpers
    var searchContainer = null;
    var searchTerms = null;
    var searchIndex = 0;
    var searchTimer = 0;

    /**
     * Add a new tag to the element
     * @param {(?string|Array)} value - The value of the new element
     */
    obj.add = function(value) {
        if (typeof(obj.options.onbeforechange) == 'function') {
            var v = obj.options.onbeforechange(el, obj, value);
            if (v != null) {
                value = v;
            }
        }

        // Close search
        if (searchContainer) {
            searchContainer.style.display = '';
        }
        // Get node
        var node = getSelectionStart();

        // Mix argument string or array
        if (! value || typeof(value) == 'string') {
            var div = document.createElement('div');
            div.innerHTML = value ? value : '<br>';
            if (node && node.parentNode.classList.contains('jtags')) {
                el.insertBefore(div, node.nextSibling);
            } else {
                el.appendChild(div);
            }
        } else {
            if (node && node.parentNode.classList.contains('jtags')) {
                if (! node.innerText.replace("\n", "")) {
                    el.removeChild(node);
                }
            }

            for (var i = 0; i < value.length; i++) {
                var div = document.createElement('div');
                div.innerHTML = value[i] ? value[i] : '<br>';
                el.appendChild(div);
            };

            var div = document.createElement('div');
            div.innerHTML = '<br>';
            el.appendChild(div);
        }

        // Place caret
        setTimeout(function() {
            caret(div);
        }, 0);

        // Filter
        filter();

        if (typeof(obj.options.onchange) == 'function') {
            obj.options.onchange(el, obj, value ? value : '');
        }
    }

    /**
     * Get all tags in the element
     * @return {Array} data - All tags as an array
     */
    obj.getData = function() {
        var data = [];
        for (var i = 0; i < el.children.length; i++) {
            var value = obj.getValue(i);
            if (value) {
                var id = el.children[i].getAttribute('data-id');
                if (! id) {
                    id = value;
                }
                data.push({ id: id, value: value });
            }
        }
        return data;
    }

    /**
     * Get the value of one tag. Null for all tags
     * @param {?number} index - Tag index number. Null for all tags.
     * @return {string} value - All tags separated by comma
     */
    obj.getValue = function(index) {
        var value = null;

        if (index != null) {
            // Get one individual value
            value = el.children[index].innerText.replace("\n", "");
        } else {
            // Get all
            var data = [];
            for (var i = 0; i < el.children.length; i++) {
                value = el.children[i].innerText.replace("\n", "");
                if (value) {
                    data.push(obj.getValue(i));
                }
            }
            value = data.join(',');
        }

        return value;
    }

    /**
     * Set the value of the element based on a string separeted by (,|;|\r\n)
     * @param {string} value - A string with the tags
     */
    obj.setValue = function(text) {
        // Remove whitespaces
        text = text.trim();

        if (text) {
            // Tags
            var data = extractTags(text);
            console.log(data);
            // Add tags to the element
            obj.add(data);
        }
    }

    obj.reset = function() {
        el.innerHTML = '<div><br></div>';
    }

    /**
     * Verify if all tags in the element are valid
     * @return {boolean}
     */
    obj.isValid = function() {
        var test = 0;
        for (var i = 0; i < el.children.length; i++) {
            if (el.children[i].classList.contains('jtags_error')) {
                test++;
            }
        }
        return test == 0 ? true : false;
    }

    /**
     * Add one element from the suggestions to the element
     * @param {object} item - Node element in the suggestions container
     */ 
    obj.selectIndex = function(item) {
        // Reset terms
        searchTerms = '';
        var node = getSelectionStart();
        // Append text to the caret
        node.innerText = item.children[1].innerText;
        // Set node id
        if (item.children[1].getAttribute('data-id')) {
            node.setAttribute('data-id', item.children[1].getAttribute('data-id'));
        }
        // Close container
        if (searchContainer) {
            searchContainer.style.display = '';
            searchContainer.innerHTML = '';
        }
        // Remove any error
        node.classList.remove('jtags_error');
        // Add new item
        obj.add();
    }

    /**
     * Search for suggestions
     * @param {object} node - Target node for any suggestions
     */
    obj.search = function(node) {
        // Create and append search container to the DOM
        if (! searchContainer) {
            var div = document.createElement('div');
            div.style.position = 'relative';
            el.parentNode.insertBefore(div, el.nextSibling);

            // Create container
            searchContainer = document.createElement('div');
            searchContainer.classList.add('jtags_search');
            div.appendChild(searchContainer);
        }

        // Search for
        var terms = node.anchorNode.nodeValue;

        // Search
        if (node.anchorNode.nodeValue && terms != searchTerms) {
            // Terms
            searchTerms = node.anchorNode.nodeValue;
            // Reset index
            searchIndex = 0;
            // Get remove results
            jSuites.ajax({
                url: obj.options.search + searchTerms,
                method: 'GET',
                dataType: 'json',
                success: function(data) {
                    // Reset container
                    searchContainer.innerHTML = '';

                    // Print results
                    if (! data.length) {
                        // Show container
                        searchContainer.style.display = '';
                    } else {
                        // Show container
                        searchContainer.style.display = 'block';

                        // Show items
                        var len = data.length < 11 ? data.length : 10;
                        for (var i = 0; i < len; i++) {
                            var div = document.createElement('div');
                            if (i == 0) {
                                div.classList.add('selected');
                            }
                            var img = document.createElement('img');
                            if (data[i].image) {
                                img.src = data[i].image;
                            } else {
                                img.style.display = 'none';
                            }
                            div.appendChild(img);

                            var item = document.createElement('div');
                            item.setAttribute('data-id', data[i].id);
                            item.innerHTML = data[i].name;
                            div.onclick = function() {
                                // Add item
                                obj.selectIndex(this);
                            }
                            div.appendChild(item);
                            // Append item to the container
                            searchContainer.appendChild(div);
                        }
                    }
                }
            });
        }
    }

    // Destroy tags element
    obj.destroy = function() {
        // Bind events
        el.removeEventListener('mouseup', tagsMouseUp);
        el.removeEventListener('keydown', tagsKeyDown);
        el.removeEventListener('keyup', tagsKeyUp);
        el.removeEventListener('paste', tagsPaste);
        el.removeEventListener('focus', tagsFocus);
        el.removeEventListener('blur', tagsBlur);
        // Remove element
        el.parentNode.removeChild(el);
    }

    var getRandomColor = function(index) {
        var rand = function(min, max) {
            return min + Math.random() * (max - min);
        }
        return 'hsl(' + rand(1, 360) + ',' + rand(40, 70) + '%,' + rand(65, 72) + '%)';
    }

    /**
     * Filter tags
     */
    var filter = function() {
        for (var i = 0; i < el.children.length; i++) {
            // Create label design
            if (! obj.getValue(i)) {
                el.children[i].classList.remove('jtags_label');
            } else {
                el.children[i].classList.add('jtags_label');

                // Validation in place
                if (typeof(obj.options.validation) == 'function') {
                    if (obj.getValue(i)) {
                        if (! obj.options.validation(el.children[i], el.children[i].innerText, el.children[i].getAttribute('data-id'))) {
                            el.children[i].classList.add('jtags_error');
                        } else {
                            el.children[i].classList.remove('jtags_error');
                        }
                    } else {
                        el.children[i].classList.remove('jtags_error');
                    }
                }
            }
        }
    }

    /**
     * Place caret in the element node
     */
    var caret = function(e) {
        var range = document.createRange();
        var sel = window.getSelection();
        range.setStart(e, e.innerText.length);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
    }

    /**
     * Selection
     */
    var getSelectionStart = function() {
        var node = document.getSelection().anchorNode;
        if (node) {
            return (node.nodeType == 3 ? node.parentNode : node);
        } else {
            return null;
        }
    }

    /**
     * Extract tags from a string
     * @param {string} text - Raw string
     * @return {Array} data - Array with extracted tags
     */
    var extractTags = function(text) {
        /** @type {Array} */
        var data = [];

        /** @type {string} */
        var word = '';

        // Remove whitespaces
        text = text.trim();

        if (text) {
            for (var i = 0; i < text.length; i++) {
                if (text[i] == ',' || text[i] == ';' || text[i] == '\r\n') {
                    if (word) {
                        data.push(word);
                    }
                } else {
                    word += text[i];
                }
            }

            if (word) {
                data.push(word);
            }
        }

        return data;
    }

    /** @type {number} */
    var anchorOffset = 0;

    /**
     * Processing event keydown on the element
     * @param e {object}
     */
    var tagsKeyDown = function(e) {
        // Anchoroffset
        anchorOffset = window.getSelection().anchorOffset;

        // Verify content
        if (! el.children.length) {
            var div = document.createElement('div');
            div.innerHTML = '<br>';
            el.appendChild(div);
        }
        // Comma
        if (e.which == 9 || e.which == 186 || e.which == 188) {
            var n = window.getSelection().anchorOffset;
            if (n > 1) {
                obj.add();
            }
            e.preventDefault();
        } else if (e.which == 13) {
            // Enter
            if (searchContainer && searchContainer.style.display != '') {
                obj.selectIndex(searchContainer.children[searchIndex]);
            } else {
                var n = window.getSelection().anchorOffset;
                if (n > 1) {
                    obj.add();
                }
            }
            e.preventDefault();
        } else if (e.which == 38) {
            // Up
            if (searchContainer && searchContainer.style.display != '') {
                searchContainer.children[searchIndex].classList.remove('selected');
                if (searchIndex > 0) {
                    searchIndex--;
                }
                searchContainer.children[searchIndex].classList.add('selected');
                e.preventDefault();
            }
        } else if (e.which == 40) {
            // Down
            if (searchContainer && searchContainer.style.display != '') {
                searchContainer.children[searchIndex].classList.remove('selected');
                if (searchIndex < 9) {
                    searchIndex++;
                }
                searchContainer.children[searchIndex].classList.add('selected');
                e.preventDefault();
            }
        }
    }

    /**
     * Processing event keyup on the element
     * @param e {object}
     */
    var tagsKeyUp = function(e) {
        if (e.which == 39) {
            var n = window.getSelection().anchorOffset;
            if (n > 1 && n == anchorOffset) {
                obj.add();
            }
        } else if (e.which == 13 || e.which == 38 || e.which == 40) {
            e.preventDefault();
        } else {
            if (searchTimer) {
                clearTimeout(searchTimer);
            }

            searchTimer = setTimeout(function() {
                // Current node
                var node = window.getSelection();
                // Search
                if (obj.options.search) {
                    obj.search(node);
                }
                searchTimer = null;
            }, 300);
        }

        filter();
    }

    /**
     * Processing event paste on the element
     * @param e {object}
     */
    var tagsPaste =  function(e) {
        if (e.clipboardData || e.originalEvent.clipboardData) {
            var html = (e.originalEvent || e).clipboardData.getData('text/html');
            var text = (e.originalEvent || e).clipboardData.getData('text/plain');
        } else if (window.clipboardData) {
            var html = window.clipboardData.getData('Html');
            var text = window.clipboardData.getData('Text');
        }

        obj.setValue(text);
        e.preventDefault();
    }

    /**
     * Processing event mouseup on the element
     * @param e {object}
     */
    var tagsMouseUp = function(e) {
        if (e.target.parentNode && e.target.parentNode.classList.contains('jtags')) {
            if (e.target.classList.contains('jtags_label') || e.target.classList.contains('jtags_error')) {
                const rect = e.target.getBoundingClientRect();
                if (rect.width - (e.clientX - rect.left) < 16) {
                    el.removeChild(e.target);
                    el.focus();
                }
            }
        }

        if (searchContainer) {
            searchContainer.style.display = '';
        }
    }

    /**
     * Processing event focus on the element
     * @param e {object}
     */
    var tagsFocus = function(e) {
        if (! el.children.length || obj.getValue(el.children.length - 1)) {
            var div = document.createElement('div');
            div.innerHTML = '<br>';
            el.appendChild(div);
        }

        if (typeof(obj.options.onfocus) == 'function') {
            obj.options.onfocus(el, obj, obj.getValue());
        }
    }

    /**
     * Processing event blur on the element
     * @param e {object}
     */
    var tagsBlur = function(e) {
        if (searchContainer) {
            setTimeout(function() {
                searchContainer.style.display = '';
            }, 200);
        }

        for (var i = 0; i < el.children.length - 1; i++) {
            // Create label design
            if (! obj.getValue(i)) {
                el.removeChild(el.children[i]);
            }
        }

        if (typeof(obj.options.onblur) == 'function') {
            obj.options.onblur(el, obj, obj.getValue());
        }
    }

    // Bind events
    el.addEventListener('mouseup', tagsMouseUp);
    el.addEventListener('keydown', tagsKeyDown);
    el.addEventListener('keyup', tagsKeyUp);
    el.addEventListener('paste', tagsPaste);
    el.addEventListener('focus', tagsFocus);
    el.addEventListener('blur', tagsBlur);

    // Prepare container
    el.classList.add('jtags');
    el.setAttribute('contenteditable', true);
    el.setAttribute('spellcheck', false);

    if (obj.options.placeholder) {
        el.placeholder = obj.options.placeholder;
    }

    // Make sure element is empty
    if (obj.options.value) {
        obj.setValue(obj.options.value);
    } else {
        el.innerHTML = '<div><br></div>';
    }

    if (typeof(obj.options.onload) == 'function') {
        obj.options.onload(el, obj);
    }

    el.tags = obj;

    return obj;
});

jSuites.tracker = (function(el, options) {
    var obj = {};
    obj.options = {};

    // Default configuration
    var defaults = {
        url: null,
        message: 'Are you sure? There are unsaved information in your form',
        ignore: false,
        currentHash: null,
        submitButton:null,
        onload: null,
        onbeforesave: null,
        onsave: null,
    };

    // Loop through our object
    for (var property in defaults) {
        if (options && options.hasOwnProperty(property)) {
            obj.options[property] = options[property];
        } else {
            obj.options[property] = defaults[property];
        }
    }

    obj.setUrl = function(url) {
        obj.options.url = url;
    }

    obj.load = function() {
        jSuites.ajax({
            url: obj.options.url,
            method: 'GET',
            dataType: 'json',
            success: function(data) {
                var elements = el.querySelectorAll("input, select, textarea");
 
                for (var i = 0; i < elements.length; i++) {
                    var name = elements[i].getAttribute('name');
                    if (data[name]) {
                        elements[i].value = data[name];
                    }
                }

                if (typeof(obj.options.onload) == 'function') {
                    obj.options.onload(el, data);
                }
            }
        });
    }

    obj.save = function() {
        var test = obj.validate();

        if (test) {
            jSuites.alert(test);
        } else {
            var data = obj.getElements(true);

            if (typeof(obj.options.onbeforesave) == 'function') {
                var data = obj.options.onbeforesave(el, data);

                if (data === false) {
                    console.log('Onbeforesave returned false');
                    return; 
                }
            }

            jSuites.ajax({
                url: obj.options.url,
                method: 'POST',
                dataType: 'json',
                data: data,
                success: function(result) {
                    jSuites.alert(result.message);

                    if (typeof(obj.options.onsave) == 'function') {
                        var data = obj.options.onsave(el, result);
                    }

                    obj.reset();
                }
            });
        }
    }

    obj.validateElement = function(element) {
        var emailChecker = function(data) {
            var pattern = new RegExp(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/);
            return pattern.test(data) ? true : false; 
        }

        var passwordChecker = function(data) {
            return (data.length > 5) ? true : false;
        }

        var addError = function(element) {
            // Add error in the element
            element.classList.add('error');
            // Submit button
            if (obj.options.submitButton) {
                obj.options.submitButton.setAttribute('disabled', true);
            }
            // Return error message
            return element.getAttribute('data-error') || 'There is an error in the form';
        }

        var delError = function(element) {
            var error = false;
            // Remove class from this element
            element.classList.remove('error');
            // Get elements in the form
            var elements = el.querySelectorAll("input, select, textarea");
            // Run all elements 
            for (var i = 0; i < elements.length; i++) {
                if (elements[i].getAttribute('data-validation')) {
                    if (elements[i].classList.contains('error')) {
                        error = true;
                    }
                }
            }

            if (obj.options.submitButton) {
                if (error) {
                    obj.options.submitButton.setAttribute('disabled', true);
                } else {
                    obj.options.submitButton.removeAttribute('disabled');
                }
            }
        }

        // Blank
        var test = '';
        if (! element.value) {
            test = addError(element);
        } else if (element.getAttribute('data-email') && ! emailChecker(element.value)) {
            test = addError(element);
        } else if (element.getAttribute('data-password') && ! emailChecker(element.value)) {
            test = addError(element);
        } else {
            if (element.classList.contains('error')) {
                delError(element);
            }
        }

        return test;
    }

    // Run form validation
    obj.validate = function() {
        var test = '';
        // Get elements in the form
        var elements = el.querySelectorAll("input, select, textarea");
        // Run all elements 
        for (var i = 0; i < elements.length; i++) {
            if (elements[i].getAttribute('data-validation')) {
                if (test) {
                    test += "<br>\r\n";
                }
                test += obj.validateElement(elements[i]);
            }
        }
        return test;
    }

    // Check the form
    obj.getError = function() {
        // Validation
        return obj.validation() ? true : false;
    }

    // Return the form hash
    obj.setHash = function() {
        return obj.getHash(obj.getElements());
    }

    // Get the form hash
    obj.getHash = function(str) {
        var hash = 0, i, chr;

        if (str.length === 0) {
            return hash;
        } else {
            for (i = 0; i < str.length; i++) {
              chr = str.charCodeAt(i);
              hash = ((hash << 5) - hash) + chr;
              hash |= 0;
            }
        }

        return hash;
    }

    // Is there any change in the form since start tracking?
    obj.isChanged = function() {
        var hash = obj.setHash();
        return (obj.options.currentHash != hash);
    }

    // Restart tracking
    obj.resetTracker = function() {
        obj.options.currentHash = obj.setHash();
        obj.options.ignore = false;
    }

    obj.reset = function() {
        obj.options.currentHash = obj.setHash();
        obj.options.ignore = false;
    }

    // Ignore flag
    obj.setIgnore = function(ignoreFlag) {
        obj.options.ignore = ignoreFlag ? true : false;
    }

    // Get form elements
    obj.getElements = function(asArray) {
        var data = {};
        var elements = el.querySelectorAll("input, select, textarea");

        for (var i = 0; i < elements.length; i++) {
            var element = elements[i];
            var name = element.name;
            var value = element.value;

            if (name) {
                data[name] = value;
            }
        }

        return asArray == true ? data : JSON.stringify(data);
    }

    // Start tracking in one second
    setTimeout(function() {
        obj.options.currentHash = obj.setHash();
    }, 1000);

    // Alert
    window.addEventListener("beforeunload", function (e) {
        if (obj.isChanged() && obj.options.ignore == false) {
            var confirmationMessage =  obj.options.message? obj.options.message : "\o/";

            if (confirmationMessage) {
                if (typeof e == 'undefined') {
                    e = window.event;
                }

                if (e) {
                    e.returnValue = confirmationMessage;
                }

                return confirmationMessage;
            } else {
                return void(0);
            }
        }
    });

    // Validations
    el.addEventListener("keyup", function(e) {
        if (e.target.getAttribute('data-validation')) {
            obj.validateElement(e.target);
        }
    });

    el.tracker = obj;

    return obj;
});



    return jSuites;

})));

