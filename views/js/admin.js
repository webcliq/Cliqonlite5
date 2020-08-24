/** Admin.Js **/
/*
        try {

        } catch(err) {
            alert(err.message);
        } 
*/

var Admin = (function($) {

    // Cfg shared values
         var cfg = {	
         	'displaytype': 'grid', 'table': '', 'tabletype': '', 'recid': 0, 'id': '', 'url': 'desktop',
            'idioms': site.idioms, 'rawdata': component, 'mdl': {},
            'jedit': '', 'jeditor': new Object, 'cedit': '', 'ceditor': new Object, 'tedit': '', 'teditor': new Object, 
            'data': {}, 'opts': {}, 'filename': '', orderby: 'c_reference|asc', 'search': '', 
         	'de': new Object,   // Desktop - breadcrumb and buttons
            'ds': new Object,   // Dashboard
            'da': new Object,   // Settings
            'df': new Object,   // Vue Generator Vue form
            'dn': new Object,   // Noty
            'dw': new Object,   // Modal Window,
            'dt': new Object,   // Datatable,
            'ft': new Object,   // Filetree,
            'fc': new Object,   // Fullcalendar,
            'tt': new Object,   // jsPanel Tooltip
            rows: new Object,
            records: {
                offset: 0,     
                limit: 15,                              
                total: 0,
                filtered: 0
            },
            bingkey: site['bingkey'], gmapsapi: site['gmapsapi'], 
            dta: new Array, // Everything returned in a AJAX request
            passwordregex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
            emailregex: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            emailregex2: /^(([^<>()[]\.,;:s@"]+(.[^<>()[]\.,;:s@"]+)*)|(".+"))@(([[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}])|(([a-zA-Z-0-9]+.)+[a-zA-Z]{2,}))$/,
            ends: ''
         }

    /** Getters, setters and delete standard and for deep nested Vue objects
     * https://jasonwatmore.com/post/2018/09/10/vuejs-set-get-delete-reactive-nested-object-properties
     * setProp(acfg.df, ['row', 'bar', 'baz'], true)
     * getProp(acfg.df, ['row', 'bar'])
     * deleteProp(acfg.df, ['row', 'bar'])
     **************************************************************************************************************************/
     
         var _set = function(key, value) {
            cfg[key] = value; return cfg[key];
         };

         var _get = function(key) {
            return cfg[key];
         };

         var _config = function() {
            return cfg;
         };     

         function _setProp (obj, props, value) {
            const prop = props.shift()
            if (!obj[prop]) {
                Vue.set(obj, prop, {})
            }
            if (!props.length) {
                
                if (value && typeof value === 'object' && !Array.isArray(value)) {
                    obj[prop] = { ...obj[prop], ...value }
                } else {
                    obj[prop] = value
                }
                return
            }
            _setProp(obj[prop], props, value)
         }

         function _getProp (obj, props) {
            const prop = props.shift()
            if (!obj[prop] || !props.length) {
                return obj[prop]
            }
            return _getProp(obj[prop], props)
         }

         function _deleteProp (obj, props) {
            const prop = props.shift()
            if (!obj[prop]) {
                return
            }
            if (!props.length) {
                Vue.delete(obj, prop)
                return
            }
            _deleteProp(obj[prop], props)
         }    

    /** Modules and Components
     *
     * _init()
     * _module()
     * _component()
     * _buttonEvent()
     *
     ****************************************************************************************************************/

        /** _init()
         * Initialize Admin system
         * @param - object - see defaults for options
         * @return - evaluated callback
         **/
         var _init = function(opts) {

            store.clearAll();

            axios.defaults.headers.common['Authorization'] = jwt;
            axios.defaults.headers.common['X-Frame-Options'] = 'SAMEORIGIN';
            axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

            $("#layoutSidenav_nav .sb-sidenav a.nav-link").each(function() {
                // Ok but improve this
                if (this.href === path) {
                    $(this).addClass("active");
                }
            });

            // Toggle the side navigation
            $("#sidebarToggle").on("click", function(e) {
                e.preventDefault();
                $("body").toggleClass("sb-sidenav-toggled");
            });

            // Animate the cliqbutton
            $(".cliqbutton").on("click", function(e) {
                e.preventDefault();
                var dta = $(this).data();
                cfg.id = $(this).attr('id');
                var opts = {
                    'id': cfg.id,
                    'data': dta,
                    'event': e
                };
                _module(dta.module, opts);
            });

            // Launch Desktop as a default

            if(store.get('url')) {
               cfg.url = store.get('url'); 
            }
            _component(cfg.url, {});
         }  

        /** _module() - describes a major PHP and Javascript module such as an Ajax action, display a popup form, 
         * display a new page or an iframe within a page
         *
         * @param - string - action
         * @param - object - options
         * @return - evaluated callback
         **/
         var _module = function(action, opts) {

            // Generic event responders
            switch(action) {

                // Menu actions end up here to load content and data into admincontent, a normal ajax will use a _load or a _post
                // This module always calls a _component with 'action' provided in the JSON data
                case "ajax":

                    cfg.displaytype = opts.data.displaytype;
                    cfg.table = opts.data.table;
                    cfg.tabletype = opts.data.tabletype;
                    
                    cfg.url = cfg.displaytype;
                    store.set('url', cfg.url);
                    console.log('Ajax: '+cfg.url);

                    var urlstr = _genurl(opts);
                    axios({
                        'method': 'GET',
                        'url': urlstr,
                        'responseType': 'json',
                        'cache': 'false',
                        'timeout': 5000,
                        'params': {
                            'token': jwt
                        }
                    }).then(function(response){
                        cfg.data = response.data;
                        // Data is transformed
                        _component(cfg.data.action, opts);
                    }).catch(function(reason) {
                        _error(JSON.stringify(reason));
                    }); 
                break;

                // A page is loaded or reloaded
                case "page":

                    cfg.displaytype = opts.data.displaytype;
                    cfg.table = opts.data.table;
                    cfg.tabletype = opts.data.tabletype;

                    var urlstr = _genurl(opts);
                    urlstr += '?token='+jwt;
                    uLoad(urlstr);
                break;

                case "iframe":
                    axios({
                        'method': 'POST',
                        'url': '/iframe/'+jlcd+'/',
                        'responseType': 'json',
                        'cache': 'false',
                        'timeout': 5000,
                        'data': {
                            'token': jwt,
                            'url': opts.data.url,
                            'label': opts.data.label
                        }

                    }).then(function(response){
                        _displayBreadcrumBar(response.data.component);
                        $('#admincontent').empty().html(response.data.html); // OK
                        _setIFrameSize('standard_iframe');
                    }).catch(function(reason) {
                        _error(JSON.stringify(reason));
                    }); 
                break;   

                case "reports":
                    alert('Reports module');
                break; 

                // Some events get here CRUD process of forms, view and delete
                case "crud":
                    _crud('add', opts);
                break;

                case "currentuser":
                    _modifyUser(opts);
                break;

                case "changepassword":
                    _changePassword(opts);
                break;

                case "logout":
                    _logout();
                break;

                default:
                    alert('Module needs to be defined: '+action)
                break;
            }
         }    

        /** _component() - dispatcher
         * 
         * @param - string - component action
         * @param - object - options for the action
         * @return - and activity or an evaluated callback
         **/
         var _component = function(action, opts) {
            
			try {

                var actions = {  

                // Services
                    // desktop and dashboard
                    'desktop': function(opts) {
                        console.log('Desktop data loaded');
                        _desktop(opts);
                    },

                    // Datagrid ontop of Desktop
                    'datagrid': function(opts) {
                        console.log('Datagrid loaded for: '+cfg.table+'.'+cfg.tabletype);
                        _datagrid(opts);
                    },  

                    // Datatable ontop of Desktop
                    'datatable': function(opts) {
                        console.log('Datatable loaded for: '+cfg.table+'.'+cfg.tabletype);     
                        _datatable(opts);
                    },   

                    // Treegrid

                    // Gallery
                    'gallery': function(opts) {
                        console.log('Gallery loaded');
                        _gallery(cfg.data.data);
                    },  

                    // Calendar   
                    'calendar': function(opts) {
                        console.log('Calendar loaded');
                        _calendar(cfg.data.data);
                    },  

                    // Model - Filetree and Codeeditor
                    // Datatable ontop of Desktop
                    'model': function(opts) {
                        console.log('Model loaded');
                        $('#admincontent').empty().html(cfg.data.html); // OK 
                        _displayBreadcrumBar(cfg.data.component);
                        cfg.displaytype = 'model';
                        _model(cfg.data.data);
                    },             

                // User stuff                    

                    // dologin
                    'dologin': function(opts) {
                        
                    },

                    // dologout
                    'logout': function(opts) {
                        uLoad('/');
                    },     

                // Utilities   

                    // Miscellaneous settings
                    'settings': function(opts) {    
                        _settings(opts);
                    },                                        

                    // error handling in a popup Noty dialogue
                    'error': function(opts) {
                        _error('AJAX function returned an error: '+opts.html);
                    },

                    'clearcache': function(opts) {
                        _info(cfg.data.msg);
                    },

                    'clearlogs': function(opts) {
                        _info(cfg.data.msg);
                    },

                    'maintainidiom': function(opts) {   
                        _maintainidiom(opts);
                    },  

                // Default just in case

                    'default': function() {
                        _error('Component action not defined: ' + action);
                    }
                }

                return (actions[action] || actions['default'])();

            } catch(err) {
                alert('Method _component() produced an error: '+err.message);
            } 
         }    

        /** _buttonEvent() - handles all Breadcrumb bar button events
         *
         * @param - string - action
         * @param - options and other data configured on the button
         * @return - dispatch to the button event
         **/
         var _buttonEvent = function(action, opts)
         {
            try {

                var actions = {  

                    // Buttons end up here to start CRUD process of forms, view and delete
                    'crud': function() {
                        _crud('add', opts);
                    },

                    // Admin help in a popup window OK
                    'help': function(opts) {
                        if(opts.data.tabletype != '') {
                            var helptext = opts.data.table+'.'+opts.data.tabletype;
                        } else {
                            var helptext = opts.data.table;
                        }
                        // Set up a Winform 
                        cfg.action = 'displayhelp';   
                        var urlstr = '/displayhelp/'+jlcd+'/dbcollection/help/';
                        var args = {
                            'url': urlstr,
                            'data': {
                                'helpref': helptext,
                                'token': jwt
                            },
                            'title': lstr[62],
                            'type': 'view'  
                        }
                        _winload(args);
                    },

                    'print': function(opts) {
                        if(opts.data.tabletype != '') {
                            var helptext = opts.data.table+'.'+opts.data.tabletype;
                        } else {
                            var helptext = opts.data.table;
                        }
                        _info('Will print a report for all records in: '+helptext);                   
                    },

                    'newcfgfile': function(opts) {
                        if(typeof cfg.ceditor.toTextArea === 'undefined') {
                            cfg.ceditor = CodeMirror.fromTextArea(document.getElementById('codeeditor'), cfg.opts.codeeditor);
                        } else {
                            cfg.ceditor.setValue("");
                            cfg.ceditor.clearHistory();
                        }   

                        // We need to a file reference to save it by
                        var opts = {
                            'layout': 'topCenter',
                            'timeout': 0,
                            'closeWith': ['button'],
                            'text': `
                                <div class="form-group">
                                    <label class="" for="filename">`+lstr[66]+`</label>
                                    <input type="text" class="form-control" id="filename" placeholder="subdir/table.tabletype.cfg" />
                                </div>
                            `,
                            'buttons': [
                                Noty.button(lstr[67], 'btn btn-success btn-sm', function() {
                                    cfg.filename = $('#filename').val();
                                    cfg.dn.close();
                                }, {'id': 'button1', 'data-status': 'ok'}),
                                Noty.button('Close', 'btn btn-danger btn-sm ml-2', function() {
                                    cfg.dn.close();
                                })
                            ]
                        }
                        _msg(opts);
                    },

                    'savecfgfile': function(opts) {
                        if(typeof cfg.ceditor.toTextArea !== 'undefined') {
                            cfg.data = cfg.ceditor.getValue();
                            axios({
                                'method': 'POST', 'responseType': 'json', 'cache': 'false', 'timeout': 5000, 'url': '/savemodelfile/'+jlcd+'/',
                                'data': {
                                    'token': jwt,
                                    'filedata': cfg.data,
                                    'filename': cfg.filename
                                }
                            }).then((response) => {
                                    var result = response.data;
                                    var match = /NotOk/.test(result.flag);
                                    if(!match == true) { 
                                        _success(result.msg);                              
                                    } else {
                                        _success(result.msg);
                                    }                 
                                }, (error) => {
                                    _error(error);
                                }
                            ).catch(function(reason) {
                                _handleError(reason);
                            }); 
                        } else {
                            _error('CodeMirror not loaded');
                        }                         
                    },

                    'verifycfgfile': function(opts) {
                        if(typeof cfg.ceditor.toTextArea !== 'undefined') {
                            cfg.data = cfg.ceditor.getValue();
                            axios({
                                'method': 'POST', 'responseType': 'json', 'cache': 'false', 'timeout': 5000,
                                'url': '/checkmodelfile/'+jlcd+'/',
                                'data': {
                                    'token': jwt,
                                    'filedata': cfg.data,
                                    'filename': cfg.filename
                                }
                            }).then((response) => {
                                    var result = response.data;
                                    var match = /NotOk/.test(result.flag);
                                    if(!match == true) { 
                                        _success(result.msg);                              
                                    } else {
                                        _error(result.msg);
                                    }                 
                                }, (error) => {
                                    _error(error);
                                }
                            ).catch(function(reason) {
                                _handleError(reason);
                            }); 
                        } else {
                            _error('CodeMirror not loaded');
                        }                  
                    },

                    'refreshfiles': function(opts) {
                        cfg.ft = $('#filetree').fancytree(cfg.opts.filetree);
                    },

                    'deletebefore': function(opts) {

                        // We need a date to delete before
                        var opts = {
                            'layout': 'topCenter',
                            'timeout': 0,
                            'closeWith': ['button'],
                            'text': `
                                <div class="form-group">
                                    <label class="" for="d_date">`+lstr[122]+`</label>
                                    <input type="date" class="form-control" id="d_date" placeholder="2020-01-01" />
                                </div>
                            `,
                            'buttons': [
                                Noty.button(lstr[67], 'btn btn-success btn-sm', function() {
                                    axios({
                                        'method': 'POST', 'responseType': 'json', 'cache': 'false', 'timeout': 5000, 'url': '/deletebefore/'+jlcd+'/',
                                        'data': {
                                            'token': jwt,
                                            'type': 'deletebefore',
                                            'd_date': $('#d_date').val()
                                        }
                                    }).then((response) => {
                                            var result = response.data;
                                            var match = /NotOk/.test(result.flag);
                                            if(!match == true) { 
                                                _success(result.msg);                              
                                            } else {
                                                _success(result.msg);
                                            }                 
                                        }, (error) => {
                                            _error(error);
                                        }
                                    ).catch(function(reason) {
                                        _handleError(reason);
                                    }); 
                                    cfg.dn.close();
                                }, {'id': 'button1', 'data-status': 'ok'}),
                                Noty.button('Close', 'btn btn-danger btn-sm ml-2', function() {
                                    cfg.dn.close();
                                })
                            ]
                        }
                        _msg(opts);
                    },

                    'checkmissing': function() {
                        if( $('#checkmissing').hasClass('invisible') ) {
                            $('#checkmissing').removeClass('invisible');
                        } else {
                            $('#checkmissing').addClass('invisible');
                        }                        
                    },

                    // Default just in case
                    'default': function() {
                        _error('Breadcrumb button action not defined: ' + action);
                    }
                }

                return (actions[action] || actions['default'])(opts);

            } catch(err) {
                alert('Method _buttonEvent() produced an error: '+err.message);
            } 
         }

    /** Admin display function
     *
     * _desktop()
     * _datagrid()
     * _datatree()
     * _datacard()
     * _datasheet() - to be converted
     * _datatable() - 
     * _calendar()
     * _gallery() - to be converted
     * _model()
     * _settings()
     * _maintainidiom()
     *
     ****************************************************************************************************************/

        /** _desktop()
         *
         * @param - object - options
         * @return - HTML is written to the screen and JS (especially Vue is executed)
         **/
         var _desktop = function(opts)
         {
            try {

                _gendata();
                // Should be transformed
                _displayBreadcrumBar(cfg.data);

                cfg.displaytype = 'dashboard';

                cfg.da = new Vue({
                    'el': '#admincontent',
                    'data': {},
                    'methods': {},
                    'mounted': function() {

                        // Initialise the Dashboard Grid
                        var grid = GridStack.init();

                        // Initialise the widgets on the Dashboard

                        // Newsfeed
                        $('#newsfeed').rss(
                            "https://feeds.feedburner.com/premiumpixels", {
                                limit: 10
                            }
                        );

                        // Clock
                        CoolClock.findAndCreateClocks();

                        // Dummy record
                        var args = {
                            'target': 'admincontent',
                            'url': '/fetchrow/'+jlcd+'/dbcollection/string/',
                            'data': {
                                'displaytype': 'datagrid',
                                'recid': 14,
                                'token': jwt,
                                'action': 'desktop'
                            },
                            'callback': function(response) {
                                var row = response.data.data.row;
                                $('#dummyrecord').empty().html(row.c_reference);
                            }
                        }
                        _post(args);
                    }
                });

            } catch(err) {
                alert(err.message);
            } 
         }               

        /** _datagrid()
         *
         * @param - object - options
         * @return - HTML is written to the screen and JS (especially Vue is executed)
         **/
         var _datagrid = function(opts)
         {
            try {

                $('#admincontent').empty().html(cfg.data.html); // OK
                var vuedata = cfg.data.data;
                vuedata['options']['pageList'] = [10, 15, 20, 25];  // Cannot be placed in the TOML config

                // We would need this if a changed header style was implemented via the TOML cfg
                var headerStyle = function() {}

                // Change the breadcrumb bar contents - e.g. new breadcrumbs and buttons, especially Add
                _displayBreadcrumBar(cfg.data.component);
                
                var $grid = '#datagrid';
                cfg.dg = new Vue({
                    'el': $grid,
                    'components': {
                        'BootstrapTable': BootstrapTable
                    },
                    'data': {
                        'columns': vuedata.columns,
                        'options': vuedata.options,
                        'data': vuedata.data
                    },
                    'mounted': function() {

                        // Context menu
                         $.contextMenu({
                            // define which elements trigger this menu
                            'selector': $grid + " tbody tr",
                            'trigger': 'right',
                            'autoHide': true,
                            // define the elements of the menu
                            'items': vuedata.cmenu, 
                            'callback': function(opt, action) {
                                cfg.recid = $( $(this).closest("tr") ).children('td:eq(0)').html();
                                var opts = {'data':{
                                    'table': cfg.table, 'displaytype': 'winform', 'tabletype': cfg.tabletype, 'recid': cfg.recid
                                }};
                                _crud(action, opts);                                
                            }
                         });  

                         // Only if we implement checkboxes
                         $($grid).on('check.bs.table', function(evt, row) {
                            // Add row.id to collection
                            cfg.rows[row.c_reference] = row.c_reference;
                            console.log(cfg.rows);
                         });

                         $($grid).on('uncheck.bs.table', function(evt, row) {
                            // Remove row.id to collection
                            unset(cfg.rows[row.c_reference]);
                         });

                         $($grid).on('check-all.bs.table', function(evt) {
                            // Add all rows to collection
                            $.each(cfg.dg.$data, function(i, row) {
                                cfg.rows[row.c_reference] = row.c_reference;
                            })
                         });

                         $($grid).on('uncheck-all.bs.table', function(evt) {
                            // Reset collection
                            cfg.rows = {};
                         });
                    }
                });

            } catch(err) {
                alert(err.message);
            } 
         }

        /** _datatree
         *
         * @param - object - options
         * @return - HTML is written to the screen and JS (especially Vue is executed)
         **/
         var _datatree = function(opts)
         {
            try {

            } catch(err) {
                alert(err.message);
            } 
         }

        /** _datacard
         *
         * @param - object - options
         * @return - HTML is written to the screen and JS (especially Vue is executed)
         **/
         var _datacard = function(opts)
         {
            try {

            } catch(err) {
                alert(err.message);
            } 
         }

        /** _dataSheet() - uses jExcel
         *
         * @param - object with options
         * @return a spreadsheet in a window
         *
         **/
          var _dataSheet = function(opts) {

            try {

                cfg.displaytype = 'datasheet';

                cfg.data = opts.data;
                if(opts.page == true) {
                    _desktopHtml();                 
                } else {
                    Cliq.win(opts.args);
                }

                var toolbar = '';
                $.each(opts.toolbar, function(action, itm) {
                    toolbar += `<i class='fas pointer sheetbutton ml-1 pb-2 fa-fw fa-`+itm.icon+`' data-action='`+action+`' title='`+itm.title+`'></i>`;
                });

                $('#toolbar').html(toolbar);
                var options = {
                    'tableHeight': '517px',
                    'tableWidth': '600px',
                    'minDimensions': [20, 15],
                    'data':opts.data,
                    'editable': true,
                    'allowInsertRow': true,
                    'allowInsertColumn': true,
                    'allowDeleteRow': true,
                    'allowDeleteColumn': true,
                    'allowRenameColumn': true,
                    'csvFileName': opts.filename,
                    'columns': opts.columns,
                    'allowComments': true,
                    'defaultColWidth': 100,
                    'tableOverflow': true,
                    'tableWidth': '630px',
                    'contextMenu': function(obj, x, y, e) {
                         var items = [];

                        // New row
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
                                             obj.setComments([ x, y ], prompt(obj.options.text.comments, title));
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

                        // Save
                         if(obj.options.allowExport) {
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
                }; 

                cfg.dv = new Vue({
                    el: '#datasheet',
                    mounted: function() {
                        cfg.ds = jexcel(this.$el, options);
                        Object.assign(this, cfg.ds);
                        
                        $('.sheetbutton').on('click', function(evt) {
                            
                            var action = $(this).data('action');

                            var actions = {   

                                'addrow': function() {
                                    cfg.ds.insertRow();
                                },     
                                'addcol': function() {
                                    cfg.ds.insertColumn();
                                },  
                                'load': function() {
                                    _info('Module action not completed: ' + action);
                                },  
                                'save': function() {

                                    if( (cfg.table == 'importdata') || (cfg.table == '') ) { // or to come .....
                                        _error(lstr[608]+': '+lstr[609]);
                                        return false;
                                    }
                                    var newdata = JSON.stringify(cfg.ds.getJson());
                                    var frmData = new FormData();
                                    frmData.append('action', cfg.action);
                                    frmData.append('data', newdata);
                                    frmData.append('displaytype', cfg.displaytype);
                                    frmData.append('token', jwt);   
                                    // console.log(frmData);
                                    axios({
                                        'method': 'POST',
                                        'url': '/api/'+jlcd+'/dodatabaseupdate/'+cfg.table+'/'+cfg.tabletype+'/',
                                        'responseType': 'json',
                                        'cache': 'false',
                                        'timeout': 5000,
                                        'data': frmData,
                                    }).then(function(response) {
                                        _handleResponse(response.data);
                                    }).catch(function(reason) {
                                        _handleError;
                                    });        
                                },  
                                'export': function() { // OK
                                    cfg.ds.download();
                                },  

                                // undo
                                'undo': function() { // OK
                                    cfg.ds.undo();
                                },  
                                // redo
                                'redo': function() { // OK
                                    cfg.ds.redo();
                                },  

                                'default': function() {
                                    _info('Module action not defined: ' + action);
                                }
                            }

                            return (actions[action] || actions['default'])();
                        })
                    }
                });

            } catch(err) {
                alert(err.message);
            } 
          }

        /** _dataTable()
         *
         * @param - object - configuration options
         **/
         var _datatable = function(opts)
         { 
            try {

                $('#admincontent').empty().html(cfg.data.html); // OK
                // Change the breadcrumb bar contents - e.g. new breadcrumbs and buttons, especially Add
                _displayBreadcrumBar(cfg.data.component);
                cfg.displaytype = 'datatable';
                cfg.mdl = cfg.data.options;
                cfg.records.limit = cfg.mdl.pagelength;

                var $table = '#datatable';
                cfg.dt = new Vue({
                    'el': $table,
                    // 'components': {},
                    'data': {
                        'rows': cfg.rows, // Database data
                        'records': cfg.records,
                        'search': cfg.search,
                        'orderby': cfg.orderby
                    },
                    'methods': {

                        // Respond to clicks on orderby icon
                        /*
                        'orderButton': function(evt) {
                            var id = $(evt.target).data('id');
                            _orderBy(id);
                        },  
                        */                 

                        // Bring up panel with form in it
                        'editheader': function(evt, row) {
                            cfg.recid = row.id;
                            var opts = {'data':{
                                'table': cfg.table, 'displaytype': 'winform', 'tabletype': cfg.tabletype, 'recid': cfg.recid
                            }};
                            _crud('edit', opts); 
                        },

                        // Bring up panel with tabbed rich text editor
                        'editcontent': function(evt, row) {
                            cfg.recid = row.id;
                            var opts = {}
                            _textEditor('load', opts);
                        },

                        // _msg
                        'edittags': function(evt, row) {
                            // We need a recid to save it by row.id
                            cfg.recid = row.id;
                            var data = {
                                'frm': `
                                <div class="form-group">
                                    <label class="" for="d_tags">`+lstr[76]+`</label>
                                    <input type="text" name="d_tags" class="form-control" data-role="tagsinput" id="d_tags" value="`+row.d_tags+`" />
                                </div>
                                `,
                                'fld': 'd_tags'
                            }
                            _modValue(data);
                        },

                        // _msg
                        'editstatus': function(evt, row) {
                            // We need a recid to save it by row.id
                            cfg.recid = row.id;
                            var statuses = {
                                'draft': lstr[83],
                                'inmoderation': lstr[84],
                                'onhold': lstr[85],
                                'published': lstr[86],
                                'archived': lstr[87]
                            }
                            var options = "";
                            $.each(statuses, function(val, lbl) {
                                if(val === row.d_status) {
                                    options += '<option value="'+val+'" selected>'+lbl+'</option>';
                                } else {
                                    options += '<option value="'+val+'">'+lbl+'</option>';
                                }
                            });

                            var data = {
                                'frm':`
                                <div class="form-group">
                                    <label class="" for="d_status">`+lstr[77]+`</label>
                                    <select name="d_status" class="form-control" id="d_status">`
                                        +options+                                        
                                    `</select>
                                </div>
                                `,
                                'fld': 'd_status'
                            }
                            _modValue(data);
                        },

                        // winform
                        'viewarticle': function(evt, row) {
                            cfg.recid = row.id;
                            var urlstr = '/viewarticle/'+jlcd+'/'+cfg.table+'/'+cfg.tabletype+'/';
                            var args = {
                                'url': urlstr,
                                'data': {
                                    'recid': cfg.recid,
                                    'token': jwt
                                },
                                'title': row.d_title,
                                'type': 'article'                           
                            }
                            _winload(args);
                        },

                        // _msg
                        'deletearticle': function(evt, row) {
                            cfg.recid = row.id;
                            var opts = {
                                'data': {
                                    'table': cfg.table,
                                    'tabletype': cfg.tabletype, 
                                }
                            }
                            _deleteRecord(opts);
                        }

                    },
                    'mounted': function() {

                        // Get initial data
                        _fetchData();

                        // If user changes records per page
                        $('#pageselect').on('change', function(evt) {
                            cfg.records.limit = $(this).val();
                            _fetchData();
                        });

                        $('#desktop_search_button').on('click', function(e) {
                            var val = $('#desktop_search').val();
                            cfg.search = 'd_summary|'+val;
                            _fetchData();
                        });

                        $('#desktop_clear_button').on('click', function(e) {
                            if(cfg.search != '') {
                                $('#desktop_search').val('');
                                cfg.search = '';
                                _fetchData();
                            }
                        });
                    }
                });

            } catch(err) {
                _lineError(err, 'Vue ')
            } 
         }

        /** _calendar() - uses Fullcalendar
         *
         * @param - object - configuration options
         **/
         var _calendar = function(opts)
         { 
            try {

                $('#admincontent').empty().html(cfg.data.html); // OK 
                _displayBreadcrumBar(cfg.data.component);
                cfg.displaytype = 'calendar';
                cfg.opts = cfg.data.options;

                const menu = document.querySelector(".popupmenu");
                let menuVisible = false;
                const toggleMenu = command => {
                    menu.style.display = command === "show" ? "block" : "none";
                    menuVisible = !menuVisible;
                };
                const setPosition = ({ top, left }) => {
                    menu.style.left = `${left}px`;
                    menu.style.top = `${top}px`;
                    toggleMenu("show");
                };

                cfg.opts.dateClick = function(info) {
                    info.jsEvent.preventDefault();
                    var opts = {
                        'data': {
                            'displaytype': 'winform',
                            'table': cfg.table,
                            'tabletype': cfg.tabletype
                        },
                        'params': {
                            'd_datefrom': info.dateStr,
                            'd_dateto': info.dateStr
                        }
                    }
                    _crud('add', opts);
                }

                cfg.opts.eventMouseEnter = function(info) {

                    var event = _calEvent(info.event);
                    var buttons = '';
                    cfg.recid = event.id;
                    $.each(cfg.opts.eventbuttons, function(id, btn) {
                        buttons += `<a class="btn btn-sm btn-`+btn.btn+` eventbutton ml-2" href="#" data-id="`+id+`">`+btn.name+`</a>`;
                    });                    
                    var msg = `
                        <div class="clqtable" id="clqtable">
                            <div class="clqtable-row">
                                <div class="clqtable-label">`+lstr[78]+`</div><div class="clqtable-cell">`+event.summary+`</div>
                            </div>
                            <div class="clqtable-row">
                                <div class="clqtable-label">`+lstr[121]+`</div><div class="clqtable-cell">`+moment(event.from).format('MMMM Do YYYY, h:mm a')+`</div>
                            </div>
                            <div class="clqtable-row">
                                <div class="clqtable-label">`+lstr[122]+`</div><div class="clqtable-cell">`+moment(event.to).format('MMMM Do YYYY, h:mm a')+`</div>
                            </div>
                            <div class="clqtable-row">
                                <div class="clqtable-label">URL</div><div class="clqtable-cell">`+event.url+`</div>
                            </div>
                            <div class="clqtable-row">
                                <div class="clqtable-label">`+lstr[135]+`</div><div class="clqtable-cell">`+event.location+`</div>
                            </div>
                            <div class="clqtable-row">
                                <div class="clqtable-label">`+lstr[20]+`</div><div class="clqtable-cell">`+event.ref+`</div>
                            </div>
                            <div class="clqtable-row">
                                <div class="clqtable-label"></div><div class="clqtable-cell">`+buttons+`</div>
                            </div>
                        </div>
                    `;

                    cfg.tt = bootbox.dialog({
                        onEscape: true,
                        title: event.title,
                        // size: 'small',
                        message: msg,
                        closeButton: true
                    });

                    $('.eventbutton').on('click', function(evt) {
                        evt.preventDefault();
                        cfg.tt.modal('hide')
                        var action = $(this).data('id');
                        var opts = {'data':{
                            'table': cfg.table, 'displaytype': 'winform', 'tabletype': cfg.tabletype, 'recid': cfg.recid
                        }};
                        _crud(action, opts); 
                    });
                }

                cfg.opts.eventMouseLeave = function(info) {cfg.tt.modal('hide')}

                var CalEl = document.getElementById('fullcalendar')
                cfg.fc = new FullCalendar.Calendar(CalEl, cfg.opts);
                cfg.fc.render();
                cfg.fc.setOption('locale', jlcd);
                var urlstr = '/fetchevents/'+jlcd+'/'+cfg.table+'/'+cfg.tabletype+'/';
                cfg.fc.setOption('events', {
                    'url': urlstr,
                    'method': 'POST',
                    'startParam': 'd_datefrom',
                    'endParam': 'd_dateto',
                    // start and end are the month
                    'extraParams': {
                        'token': jwt
                    },
                    'failure': function() {
                        _error(lstr[120]);
                    }
                });

            } catch(err) {
                alert(err.message);
            } 
         }

         var _calEvent = function(obj) {

            var event = {};
            event.title = obj.title;
            event.id = obj.id;
            event.url = obj.url;
            event.from = obj.start;
            event.to = obj.end;
            $.each(obj.extendedProps, function(key, val) {
                event[key] = val;
            });
            return event;

         }
            
        /** _gallery() Gallery
         *
         * @param - object - configuration options
         **/
         var _gallery = function(opts)
         {
            try {

                $('#admincontent').empty().html(cfg.data.html); // OK 
                _displayBreadcrumBar(cfg.data.component);
                cfg.displaytype = 'gallery';
                cfg.opts = opts;
                cfg.mdl = cfg.data.options;
                cfg.records.limit = cfg.mdl.pagelength; // Initial
                var $table = '#datagallery';
                cfg.dt = new Vue({
                    'el': $table,
                    'data': {
                        'rows': cfg.rows, // Database data
                        'records': cfg.records,
                        'search': cfg.search,
                        'orderby': cfg.orderby,
                        'pagination': {}
                    },
                    'methods': {

                        changePage: function(num, page) {
                            if(num == page) {
                                return false;
                            }
                            cfg.records.limit = num * cfg.mdl.pagelength;   // 2 x 6 = 12 as the limit
                            cfg.records.offset = cfg.records.limit - cfg.mdl.pagelength;
                            if(cfg.records.limit > cfg.records.filtered) {
                                cfg.records.limit = cfg.records.filtered
                            }
                            _fetchData();
                        }
                    },
                    'mounted': function() {

                        // Execute data loader when new Gallery loaded
                        // Get initial data
                        _fetchData();

                        // Context menu
                         $.contextMenu({
                            // define which elements trigger this menu
                            'selector': ".card",
                            'trigger': 'right',
                            'autoHide': true,
                            // define the elements of the menu
                            'items': cfg.mdl.contextmenu, 
                            'callback': function(opt, action) {
                                cfg.recid = $(this).attr('id');
                                var opts = {'data':{
                                    'table': cfg.table, 'displaytype': 'winform', 'tabletype': cfg.tabletype, 'recid': cfg.recid
                                }};
                                _crud(action, opts);                                
                            }
                         });                          

                        // If user changes records per page
                        $('#pageselect').on('change', function(evt) {
                            cfg.records.limit = $(this).val();
                            _fetchData();
                        });

                        $('#desktop_search_button').on('click', function(e) {
                            var val = $('#desktop_search').val();
                            cfg.search = 'd_summary|'+val;
                            _fetchData();
                        });

                        $('#desktop_clear_button').on('click', function(e) {
                            if(cfg.search != '') {
                                $('#desktop_search').val('');
                                cfg.search = '';
                                _fetchData();
                            }
                        }); 
                    }
                });

            } catch(err) {
                alert(err.message);
            } 
         }    

        /** _model() - Filetree and Model
         *
         *
         *
         **/
         var _model = function(opts) {
            
            try {

                // opts.filetree and opts.codeeditor
                opts.filetree.icon = function(event, data) {
                    if(data.node.isFolder() ){
                        return 'fas fa-folder text-primary';
                    } else {
                        return 'fas fa-file text-warning';
                    }
                    // Exit without returning a value: continue with default processing.
                }

                opts.codeeditor.path = jspath+'codemirror';
                cfg.opts = opts;
                
                cfg.ft = $('#filetree').fancytree(opts.filetree);
                cfg.ft.on("fancytreeactivate", function(event, data) {
                    var node = data.node;
                    if(node.isFolder()){
                        return false;
                    } else {
                        cfg.filename = str_replace('\\', '/', node.key);
                        axios({
                            'method': 'POST', 'url': '/getmodelfile/'+jlcd+'/', 'responseType': 'json', 
                            'cache': 'false', 'timeout': 5000, 'data': {'token': jwt, 'filename': cfg.filename}
                        }).then((response) => {
                                var result = response.data;
                                var match = /NotOk/.test(result.flag);
                                if(!match == true) { 
                                    if(typeof cfg.ceditor.toTextArea === 'undefined') {
                                        cfg.data = $('#codeeditor').empty().val(result.data);
                                        cfg.ceditor = CodeMirror.fromTextArea(document.getElementById('codeeditor'), opts.codeeditor);
                                    } else {
                                        cfg.ceditor.clearHistory();
                                        cfg.ceditor.setValue(result.data);
                                    }                               
                                } else {
                                    _error(result.msg);
                                }                 
                            }, (error) => {
                                _error(error);
                            }
                        ).catch(function(reason) {
                            _handleError(reason);
                        }); 
                        
                    }                
                });

            } catch(err) {
                alert(err.message);
            } 
         }

        /** _settings() - Settings
         *
         * @param - array - any local options, most come from the XHR Response
         * @return - string HTML to the screen and execution of various functions in Vue
         **/
         var _settings = function(opts) {
            
            try {

                $('#admincontent').empty().html(cfg.data.html); // OK 
                _displayBreadcrumBar(cfg.data.component);
                cfg.displaytype = 'settings';
                cfg.opts = opts;
                cfg.mdl = cfg.data.options;
                var $form = '#dataform';
                cfg.df = new Vue({
                    'el': $form,
                    'data': {
                        'values': cfg.mdl.model,
                        'acl': cfg.mdl.accessControl.acl,
                        'apikeys': cfg.mdl.apiKeys.apikeys,
                        'ximport': cfg.mdl.importData.ximport.model,
                        'xport': cfg.mdl.exportData.xport.model,
                        'dbdump': cfg.mdl.dumpData.dbdump.model
                    },
                    'methods': {

                        'clickButton':function($evt, action) {
                            cfg.data.element = 'dataform';
                            _formBtn($evt, action);
                        },

                        'setFileName': function(evt, fieldname) {
                            this[fieldname] = this.ximport.tablename+'.'+this.ximport.tabletypename;
                        },

                        // File handlers
                        'onFileChange': function(e) {
                            e.stopImmediatePropagation();
                            var fldid = $(e.target).data('fldid');
                            var files = e.target.files || e.dataTransfer.files;
                            if(!files.length) {
                               return; 
                            };
                            this[fldid] = files[0];
                        },                      
                        'removeFile': function(e) {        
                            e.stopImmediatePropagation();
                            this.inputfilename = '';
                        }

                    },
                    'mounted': function() {

                        // Access control

                            $('.headerbutton, .rowbutton').on('click', function(e) {
                                var id = $(e.target).attr('id');
                                $.each(cfg.df.$data.acl, function(key, state) {
                                    if(stristr(key, id) != false) {
                                        cfg.df.$data.acl[key] == true ? cfg.df.$data.acl[key] = false : cfg.df.$data.acl[key] = true;
                                    }
                                });
                                // write changed data away
                                var args = {
                                    'url': '/updateacl/'+jlcd+'/',
                                    'data': {
                                        'token': jwt,
                                        'acl': cfg.df.$data.acl
                                    },
                                    'callback': function() {
                                        console.log(response.data.msg)
                                    }
                                }
                                _post(args);
                            });                      

                            $('.cellbutton').on('click', function(e) {
                                var id = $(e.target).attr('id');
                                cfg.df.$data.acl[id] == true ? cfg.df.$data.acl[id] = false : cfg.df.$data.acl[id] = true;
                                // write changed data away
                                var args = {
                                    'url': '/updateacl/'+jlcd+'/',
                                    'data': {
                                        'token': jwt,
                                        'acl': cfg.df.$data.acl
                                    },
                                    'callback': function() {
                                        console.log(response.data.msg)
                                    }
                                }
                                _post(args);
                            }); 
                        
                        // API Keys for Users

                            $('input.apikeychanges').on('change', function(e) {
                                var id = $(e.target).attr('id');
                                // write changed data away
                                var ak = explode('_', id);
                                var usr = ak[0];
                                var args = {
                                    'url': '/updateapikey/'+jlcd+'/',
                                    'data': {
                                        'token': jwt,
                                        'c_username': usr,
                                        'd_apikey': cfg.df.$data.apikeys[id]
                                    },
                                    'callback': function() {
                                        console.log(response.data.msg)
                                    }
                                }
                                _post(args);
                            });
      
                    }
                });

            } catch(err) {
                alert(err.message);
            } 
         }

        /** Maintain Idioms
         *
         *
         *
         **/
         var _maintainidiom = function(opts) {
            
            try {

                $('#admincontent').empty().html(cfg.data.html); // OK 
                _displayBreadcrumBar(cfg.data.component);
                cfg.displaytype = 'maintainidiom';
                var vuedata = cfg.data.data;

                console.log(vuedata.datagrid);

                // Using one instance of View for the whole set of processes
                cfg.dt = new Vue({
                    'el': '#datagrid',
                    'components': {
                        'BootstrapTable': BootstrapTable
                    },
                    'data': function() {

                        return {
                            // Idiomgrid 
                            'languages': vuedata.idioms,

                            // Checkmissing
                            'columns': vuedata.datagrid.columns,
                            'options': vuedata.datagrid.options,    
                            'data': {},  

                            // Forms
                            'newidiom': {
                                'lcdcode': 'en',
                                'lcdname': 'English',
                                'lcdflag': 'en.png'                            
                            },
                            'importidiom': {
                                'lcdcode': 'en',
                                // leave filename empty ....
                                'inputfilename': ''
                            }
                        }
                    },
                    'methods': {

                        'deleteIcon': function($evt) {
                            $evt.preventDefault();
                            $evt.stopPropagation();
                            _formBtn($evt, 'deleteidiom');
                        },     
                        
                        'queryParams': function(params) {
                            params.jwt = jwt;
                            return params;
                        },    
                        
                        // File handlers
                        'onFileChange': function(e) {
                            e.stopImmediatePropagation();
                            var fldid = $(e.target).data('fldid');
                            var files = e.target.files || e.dataTransfer.files;
                            if(!files.length) {
                               return; 
                            };
                            this[fldid] = files[0];
                        },                      
                        'removeFile': function(e) {        
                            e.stopImmediatePropagation();
                            this.inputfilename = '';
                        },
                        'setFlag': function() {
                            return this.newidiom.lcdflag = this.newidiom.lcdcode+'.png';
                        },

                        'clickButton':function($evt, action) {
                            cfg.data.element = 'idiomform';
                            _formBtn($evt, action);
                        },

                    },
                    'mounted': function() {
                        console.log('Maintain idioms loaded');  
                        

                    }
                });
            } catch(err) {
                alert(err.message);
            } 
         }

    /** Common Data retrieval routines
     *
     * _fetchData()
     * _tablePagination()
     * _pagerText()
     * _orderBy()
     *
     *********************************************************************************************************************/         

        /** _fetchData() - load the data from the database
         *
         *
         **/
         var _fetchData = function()
         {
            try {

                // var orderby; if(cfg.opts.orderby != '') {orderby = cfg.opts.orderby;} else {orderby = cfg.orderby;}; 
                axios({
                    'method': 'POST',
                    'url': '/fetchdata/'+jlcd+'/'+cfg.table+'/'+cfg.tabletype+'/',
                    'responseType': 'json',
                    'cache': 'false',
                    'timeout': 5000,
                    'data': {
                        'displaytype': cfg.displaytype,
                        'offset': cfg.records.offset,
                        'search': cfg.search,
                        'orderby': cfg.orderby,
                        'limit': cfg.records.limit,    
                        'field_identifier': 'field',
                        'token': jwt,                        
                                            
                    }
                }).then(response => {

                    cfg.dt.$data.rows = response.data.rows;
                    cfg.dt.$data.records = response.data.records;
                    cfg.records = response.data.records;

                    _tablePagination();

                });   
            } catch(err) {
                alert('Method _fetchData() generated an error: '+err.message);
            } 
         } 

         var _tablePagination = function() 
         {
            
            const totalItems = cfg.records.filtered;
            let currentPage = Math.ceil(cfg.records.offset / cfg.mdl.pagelength);
            const pageSize = cfg.mdl.pagelength;
            const maxPages = 5;          

            // calculate total pages
            let totalPages = Math.ceil(totalItems / pageSize);

            // ensure current page isn't out of range
            if(currentPage < 1) {
                currentPage = 1;
            } else if (currentPage > totalPages) {
                currentPage = totalPages;
            }

            let startPage = 0, endPage = 0;
            if (totalPages <= maxPages) {
                // total pages less than max so show all pages
                startPage = 1;
                endPage = totalPages;
            } else {
                // total pages more than max so calculate start and end pages
                let maxPagesBeforeCurrentPage = Math.floor(maxPages / 2);
                let maxPagesAfterCurrentPage = Math.ceil(maxPages / 2) - 1;
                if (currentPage <= maxPagesBeforeCurrentPage) {
                    // current page near the start
                    startPage = 1;
                    endPage = maxPages;
                } else if (currentPage + maxPagesAfterCurrentPage >= totalPages) {
                    // current page near the end
                    startPage = totalPages - maxPages + 1;
                    endPage = totalPages;
                } else {
                    // current page somewhere in the middle
                    startPage = currentPage - maxPagesBeforeCurrentPage;
                    endPage = currentPage + maxPagesAfterCurrentPage;
                }
            }

            // calculate start and end item indexes
            let startIndex = (currentPage - 1) * pageSize;
            let endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

            // create an array of pages to ng-repeat in the pager control
            let pages = Array.from(Array((endPage + 1) - startPage).keys()).map(i => startPage + i);

            // return object with all pager properties required by the view
            cfg.dt.$data.pagination = {
                totalItems: totalItems,
                currentPage: currentPage,
                pageSize: pageSize,
                totalPages: totalPages,
                startPage: startPage,
                endPage: endPage,
                startIndex: startIndex,
                endIndex: endIndex,
                pages: pages
            };
         }   

        /** _orderBy()
         * Changes the sort icon on any column - -up, -down and default is plain sort
         * then sets orderby to new column and reloads data from database
         **/
         var _orderBy = function(id)
         {
            try {
                var ord = explode('|', cfg.orderby);
                $('i.sort-icon').removeClass('fa-sort-up').removeClass('fa-sort-down').addClass('fa-sort');
                if(ord[1] == 'asc') { // Change to desc
                    $('i[data-id="'+id+'"]').removeClass('fa-sort').removeClass('fa-sort-up').addClass('fa-sort-down');
                    cfg.orderby = id+'|desc';
                    _fetchData();
                } else { // Change to asc
                    $('i[data-id="'+id+'"]').removeClass('fa-sort').removeClass('fa-sort-down').addClass('fa-sort-up');
                    cfg.orderby = id+'|asc';
                    _fetchData();
                }
            } catch(err) {
                alert(err.message);
            } 
         }

    /** CRUD - All actions related to reading individual records, creating and editing records and finally deleting records
     *
     * _crud() - main dispatcher
     * _form() - 
     * _formMounted()
     * _formBtn()
     * _getFormData()
     * _handleResponse()
     * _handleError()
     * _deleteBtn()
     * _modInput()
     * _view() - 
     * _article()
     *
     ****************************************************************************************************************/

        /** _crud()
         * 
         * @param - string - action
         * @param - object - options for the action
         * @return - and activity or an evaluated callback
         **/
         var _crud = function(action, opts) {
            
            console.log('Crud loaded for: '+action);

            try {
                var actions = {   

                    'add': function() {  
                        cfg.action = 'addrecord';   
                        cfg.recid = 0;            
                        var urlstr = _genurl(opts);
                        var args = {
                            'url': urlstr,
                            'data': {
                                'recid': cfg.recid,
                                'token': jwt
                            },
                            'title': 'Add Record',
                            'type': 'form'                           
                        }
                        if( array_key_exists('params', opts) ) {
                            $.each(opts.params, function(key, val) {
                                args.data[key] = val;
                            });
                        }
                        _winload(args);
                    },

                    'edit': function() {
                        cfg.action = 'editrecord';   
                        var urlstr = _genurl(opts);
                        var args = {
                            'url': urlstr,
                            'data': {
                                'recid': cfg.recid,
                                'token': jwt
                            },
                            'title': 'Edit Record',
                            'type': 'form'  
                        }
                        _winload(args);
                    }, 

                    'editcontent': function() {
                        var opts = {}
                        _textEditor('load', opts);
                    }, 

                    'view': function() {
                        cfg.action = 'viewrecord';   
                        opts.data.displaytype = 'winview';
                        var urlstr = _genurl(opts);
                        var args = {
                            'url': urlstr,
                            'data': {
                                'recid': cfg.recid,
                                'token': jwt
                            },
                            'title': 'View Record',
                            'type': 'view'  
                        }
                        _winload(args);
                    },

                    'delete': function() {
                        _deleteRecord(opts);
                    },

                    'default': function() {
                        _error('Crud action not defined: ' + action);
                    }
                }

                return (actions[action] || actions['default'])(opts);

            } catch(err) {
                alert('Method _crud() produced an error: '+err.message);
            } 
         }    

        /** _form() - creates a Vue instance
         * Form is displayed, this animates it
         * @param - object - see defaults for options
         * @return - evaluated callback
         **/
         var _form = function()
         {
            try {

                // Create  form template in the window content panel
                $('.jsPanel-content').empty().html(cfg.data.html);

                cfg.dw.resize({
                    'height': cfg.data.options.height,
                    'width': cfg.data.options.width
                }).reposition();

                // Use Vue to generate a form
                cfg.df = new Vue({
                    'el': '#dataform',
                    'data': function() {
                        return cfg.data.model
                    },
                    'methods': {

                        // Click Icon Handlers for suffix, prefix
                        clickicon: function(event) {
                            var action = $(event.target).data('action');
                            _formBtn(event.target, action);
                        },


                        // Click Icon Handlers
                        clickButton: function(event) {
                            event.preventDefault();
                            var action = $(event.target).data('action');
                            _formBtn(event.target, action);
                        },

                        // Image handlers
                        onImageChange(e) {
                            e.stopImmediatePropagation();
                            var fldid = $(e.target).data('fldid');
                            var files = e.target.files || e.dataTransfer.files;
                            if(!files.length) {
                               return; 
                            };
                            this.createImage(files[0], fldid);
                        },
                        createImage(file, fldid) {
                            var d_image = new Image();
                            var reader = new FileReader();
                            var vm = this;

                            reader.onload = (e) => {
                                vm.d_image = e.target.result;
                            };
                            reader.readAsDataURL(file);
                        },
                        removeImage: function (e) {        
                            e.stopImmediatePropagation();
                            this.d_image = '';
                        },
                        
                        // File handlers    
                        onFileChange(e) {
                            e.stopImmediatePropagation();
                            var fldid = $(e.target).data('fldid');
                            var files = e.target.files || e.dataTransfer.files;
                            if(!files.length) {
                               return; 
                            };
                        },               
                        removeFile: function (e) {        
                            e.stopImmediatePropagation();
                            this.inputfilename = '';
                        },

                        // Get a link and grab an image
                        lookupurl: function(e) {
                            _info('Looking up URL');
                        }

                    },
                    'mounted': function() {
                        _formMounted();
                    },
                    'watch': {

                    }

                })
            
            // cfg.df.$data.model = data

            } catch(err) {
                alert('Method _form() produced an error: '+err.message);
            } 
         }

        /** _formMounted() - Vue Form mounted routines
         * Instantiates a variety of functions and responses to events that are associated with a Form
         * that has been published as a Vue template
         * @param - 
         * @return - 
         **/
         var _formMounted = function() 
         {
            try {

                console.log('Form mounted');

                var id = 'dataform'; 

                // HTML5 Text Types
                    $('input[type="text"], input[type="email"], input[type="url"]').each(function() {
                        
                        var fldid = $(this).attr('id');
                        var thisfld = $('#'+fldid);

                        if( thisfld.hasClass('nextref') ) { 
                            _modInput(fldid, 'getnextref','');
                        };
                        
                        if( thisfld.hasClass('nextid') ) {
                            _modInput(fldid, 'getnextid', '');
                        };
                        
                        if( thisfld.hasClass('nextentry') ) {
                            var prefix = thisfld.data('prefix');
                            _modInput(fldid, 'getnextentry', prefix);
                        };
                        

                        if( thisfld.hasClass('autocomplete') ) {
                            var urlstr = $(thisfld).data('url');
                            $(thisfld).bootcomplete({
                                url: urlstr,
                                method: 'GET',
                                minLength: 3
                            });
                        };

                    });    

                    $('.isunique').on('keyup', function(e) {
                        var entered = $(this).val();
                        var n = entered.length;
                        if(n > 4) {
                            var fldid = $(this).attr('id');                        
                            _modInput(fldid, 'isunique', '');
                        } else {
                            return;
                        }
                    });  

                    $('.slugified').on('keyup', function(e) {
                        var entered = $(this).val();
                        var n = entered.length;
                        if(n > 4) {
                            var fldid = $(this).attr('id'); 
                            $(this).val( $.slugify(entered) );                     
                            _modInput(fldid, 'isunique', '');
                        } else {
                            return;
                        }
                    });           
                              
                // For Textareas
                    $('textarea.toml, textarea.textile').each(function() {

                        var fldid = $(this).attr('id');
                        var thisfld = $('#'+fldid);

                        if( thisfld.hasClass('textile') ) {
                            // Needs about 500px width  
                            $(thisfld).textileToolbar();
                        };

                        if( thisfld.hasClass('toml') ) {    
                            TLN.append_line_numbers(fldid);
                            $(thisfld).keydown(function(e) {
                                if(e.keyCode === 9) { // tab was pressed
                                    // get caret position/selection
                                    var start = this.selectionStart;
                                        end = this.selectionEnd;

                                    var $this = $(this);

                                    // set textarea value to: text before caret + tab + text after caret
                                    $this.val($this.val().substring(0, start)
                                                + "\t"
                                                + $this.val().substring(end));

                                    // put caret at right position again
                                    this.selectionStart = this.selectionEnd = start + 1;

                                    // prevent the focus lose
                                    return false;
                                }
                            });
                        };

                    });

                // File and Image

                    $('div.dropzone').each(function() {
                        
                        var fldid = $(this).attr('id');
                        var thisfld = $('#'+fldid);

                        cfg.dz = thisfld.dropzone({
                            url: cfg.uploadurl,                 
                            init: function() {
                                cfg.subdir = $(this).data('subdir');
                                cfg.uploadurl = $(this).data('uploadurl');
                                cfg.filescollection = $(this).data('filescollection');
                            },
                            autoProcessQueue: true,
                            headers: {
                                subdir: cfg.subdir
                            },
                            createImageThumbnails: true,
                            resizeHeight: 120,
                            paramName: cfg.filescollection,
                            maxFilesize: 1, maxFiles: 1,
                            success: function(data) {
                                if(data.status == 'success') {
                                    Vue.set(cfg.df, fldid, data.name);
                                } else {
                                    msg({buttons:false, type:'danger', text:data.warnings.toString()});
                                }
                                $(cfg.dz).find('.dz-progress').addClass('hide');
                            }
                        });             
                    });

                // Tab Handling

                // Level Handling

                    $('.accesslevel').each(function(e) {
                        
                        var fldid = $(this).attr('id');

                        // Get
                        var xval = $("#"+fldid+'_val').val();
                        var defval = explode(':', xval);

                        $("#"+fldid+"_r").val(defval[0]);
                        $("#"+fldid+"_w").val(defval[1]);
                        $("#"+fldid+"_d").val(defval[2]);
                        
                        // Set
                        $(".spinboxes").on("change", function() {
                            var curval = $("#"+fldid+"_r").val() + ":" + $("#"+fldid+"_w").val() + ":" + $("#"+fldid+"_d").val();
                            $("#"+fldid+'_val').val(curval);
                            Vue.set(cfg.df, fldid, curval);
                        }); 
                    });

                // JSONeditors if exist 

                    $('#dataform div[data-type=jsoneditor]').each(function(e) {
                        cfg.jedit = $(this).attr('id'); // d_text
                        var options = {
                                search: false,
                                mode: "code",
                                modes: ["code", "form", "tree"]
                        };
                        var jeditordata = cfg.data.model[cfg.jedit];
                        cfg.jeditor = createJSONEditor('#'+cfg.jedit, options);
                        cfg.jeditor.set(jeditordata);      
                    }); 

                // Codeeditors if exist 
                    $('#dataform div[data-type=codeeditor]').each(function(e) {
                        cfg.cedit = $(this).attr('id');

                    }); 

                // Date handling including DateTimepicker
                    
                    $('select.dateselect').on('change select mouseover', function(e) {
                        var id = explode('_', $(this).attr('id'))[1];
                        var d = $('#day_'+id).val();
                        var m = $('#month_'+id).val();
                        var y = $('#year_'+id).val();
                        Vue.set(cfg.df, 'd_'+id, d+'-'+m+'-'+y);
                    });
                    
                    $('.datepicker').each(function(e) {
                        var fldid = $(this).attr('id');
                        var dp = $(this).datepicker({
                            format: 'dd-mm-yyyy',
                            uiLibrary: 'bootstrap4',
                            iconsLibrary: 'fontawesome',
                            locale: jlcd+'-'+jlcd       
                        });
                    })

                    $('#d_datefrom').datetimepicker({
                        startDate: cfg.data.model.d_datefrom,
                        format: 'd.m.Y H:i', inline: false, lang: jlcd,
                        minTime: '8:00', maxTime: '20:00', step: 15,
                        onChangeDateTime: function(dp, $input){
                            Vue.set(cfg.df, 'd_datefrom', $input.val()); 
                        }
                    });
                    $('#d_dateto').datetimepicker({
                        startDate: cfg.data.model.d_dateto,
                        format: 'd.m.Y H:i', inline: false, lang: jlcd,
                        minTime: '8:00', maxTime: '20:00', step: 15,
                        onChangeDateTime: function(dp, $input){
                            Vue.set(cfg.df, 'd_dateto', $input.val()); 
                        }       
                    });

                // Password
                    $.hook('confirmpassword').on('blur', function(e) {
                        var id = $(this).attr('id');
                        var p1 = $('#'+id).val();
                        var p2 = $('#'+id+'_confirm').val();
                        if(p1 != p2) {
                            $('#'+id).empty().focus();
                            _error('Passwords do not match');
                        }
                        // passwordregex.test
                    });

                // Slider
                    $('.slider').slider({
                        tooltip: 'show',
                        ticks: [0,1,2,3,4,5],
                        ticks_tooltip: true
                    });
                    $('.slider').on('slide', function(evt) {
                        Vue.set(cfg.df, evt.target.id, evt.value);
                    });

                // Checkbox handling
                    $('.checkbox0').each(function() {
                        var fid = $(this).attr('name');
                        var vals = explode(',', $('input[id="'+fid+'"]').getValue());           
                        $('input[name="'+fid+'"]').fieldArray(vals);


                    });

                    $('.cliqcheckbox').on('change', function(e) {
                        var fid = $(this).attr('name');
                        var newvals = $('input[name="'+fid+'"]').getValue();
                        Vue.set(cfg.df, fid, newvals);
                    });
        
                // Click Icon Handlers
                    $('.translatebutton').on('click', function(e) {
                        var fldid = $(this).data('id'); // $did = v-model
                        var textfrom; 
                        $.each(cfg.idioms, function(lcdcode, lcdname) {
                            if(lcdcode != jlcd) {
                                textfrom = cfg.df.$data[fldid+'_'+jlcd];
                                $.ajax({
                                    url: "https://api.microsofttranslator.com/V2/Ajax.svc/Translate",
                                    dataType: "jsonp", jsonp: "oncomplete", crossDomain: true,
                                    data: {appId: cfg.bingkey, from: jlcd, to: lcdcode, contentType: "text/plain", text: textfrom},
                                    success: function(data, status){
                                        // console.log(data);
                                        cfg.df.$data[fldid+'_'+lcdcode] = data;
                                    }
                                });            
                            }
                        })
                    })

                // Miscellaneous
                    // $('.currency').maskMoney();      

                    $('.form-inline').each(function(e) {
                        var fldid = $(this).attr('id');
                        var thisfld = $('#'+fldid);

                        if( $(thisfld).hasClass('watch') ) {
                            switch(fldid) {
                                case "model":
                                    $('select[data-id="c_parent"], select[data-id="c_category"]').on('change', function() {
                                        var c_category = $('select[data-id="c_category"]').getValue();
                                        var c_parent = $('select[data-id="c_parent"]').getValue();
                                        $('select[data-id="c_reference"]').setValue(c_parent+'_'+c_category);
                                        return cfg.df.$data.c_reference = c_parent+'_'+c_category;
                                    });
                                break;

                                // Other cases of watch here if required
                            } // End switch
                        }; // End 'watch'

                        // Other cases here if required
                    });     
            
            } catch(err) {
                alert('Method _formMounted() generated an error: '+err.message);
            } 
         }  

        /** _formBtn() - Vue Form Buttons - preview, submit etc.
         * Handles all Form Buttons - submit, reset, cancel, preview etc.
         * @param - object - the Event object
         * @param - string - button action
         * @return - action
         **/
         var _formBtn = function(evt, action)
         {              
            var btns = {

                // Standard or common buttons
               
                 'submit': function(evt) {

                    // Make sure button is type = button, not type = submit !!      
                    var frmData = _getFormData(false);
                    axios({
                        'method': 'POST',
                        'url': '/postform/'+jlcd+'/'+cfg.table+'/'+cfg.tabletype+'/',
                        'responseType': 'json',
                        'cache': 'false',
                        'timeout': 5000,
                        'data': frmData,
                    }).then(function(response) {
                        _handleResponse(response.data);
                    }).catch(function(reason) {
                        _handleError;
                    }); 
                 },

                 'preview': function(evt) {

                    var frmData = _getFormData(false);
                    var tbl = `<div class="container maxh30 scrollable">
                        <table class=\"table table-sm table-bordered table-striped\">
                    `;
                    // Display the key/value pairs
                    for(var pair of frmData.entries()) {
                        
                        switch(pair[0]) {

                            case "d_image":
                                tbl += `<tr style=\"font-weight:normal; font-size: 12px;\">
                                    <td class=\"text-right orangec e30\">`+pair[0]+`</td>
                                    <td class=\"text-left bluec e70\"><img src=\"`+rawurldecode(pair[1])+`\" class=\"h120\" /></td>
                                </tr>`;
                            break;

                            // Exclude fields
                            case "token": case "displaytype":
                                tbl += "";
                            break;

                            default:
                                tbl += `<tr style=\"font-weight:normal; font-size: 12px;\">
                                    <td class=\"text-right orangec e30\">`+pair[0]+`</td>
                                    <td class=\"text-left bluec e70\"><pre>`+rawurldecode(pair[1])+`</pre></td>
                                </tr>`;
                            break;
                        }

                    }
                    tbl += `</table></div>`;

                    var args = {
                        'id': 'jsPanel-'+uniqid(),
                        'contentSize':      {
                            'width': 400,
                            'height': 480
                        },
                        'headerTitle': '<h5 class="mt-1 text-light">Preview</h4>',
                        'content': tbl
                    }; _win(args, 'config'); 
                 },
                  
                 'reset': function(evt) {
                    $('#dataform').clearform();
                 },
              
                 'cancel': function(evt) {
                    _collectionAction(store.session('contenttype'), table, tabletype);
                 },

                // Transfer a value from a Select to an associated Input field
                 'transferval': function(){
                    var fldid = $(evt.target).data('id');
                    var newval = $('select[data-id="'+fldid+'"]').getValue();
                    Vue.set(cfg.df, fldid, newval);
                 },

                // Miscellaneous
                 'maintainval': function() {
                    _addOption(evt);
                 },

                // Specific to maintainidiom
                 'submitnewidiom': function(evt) {

                    var lcdcode = $(evt.target).data('lcdcode');
                    try {
                        var urlstr = '/addnewidiom/'+jlcd+'/';
                        var frmData = new FormData();
                        frmData.set('token', jwt);
                        frmData.set('lcdcode', cfg.dt.$data.newidiom.lcdcode);
                        frmData.set('lcdname', cfg.dt.$data.newidiom.lcdname);
                        frmData.set('lcdflag', cfg.dt.$data.newidiom.lcdflag);
                        axios({
                            'method': 'POST', 'url': urlstr,
                            'responseType': 'json', 'cache': 'false', 'timeout': 5000, 'data': frmData
                        }).then(function(response){
                                cfg.dn.close();
                                var opts = {
                                    'data': {
                                        'displaytype': 'maintainidiom',
                                        'table': '',
                                        'tabletype': ''
                                    },
                                    'event': {}
                                }; 
                                _module('ajax', opts); 
                            }, (error) => {
                                _error(error);
                            }
                        ).catch(function(reason) {
                            _handleError(reason);
                        });

                    } catch(err) {
                        alert('Method _addNewIdiom() produced an error: '+err.message);
                    } 
                 },

                 'importidiom': function(evt) {

                    var frmData = new FormData();
                    var file = ccfg.dt.$data['inputfilename'];                                          
                    frmData.append('inputfilename', file, file.filename); // the key in $_FILES, filecontent, filename
                    frmData.append('token', jwt);

                    // form variable to be created
                    frmData.append('lcdcode', $('lcdcode').val());
                    frmData.append('displaytype', 'datapage');
                    frmData.append('action', 'maintainidiom');
                    frmData.append('fielddelimiter', ',');
                    frmData.append('fieldencloser', '"');
                    frmData.append('escapecharacter', '\\');

                    axios({
                        'method': 'POST', headers: {'Content-Type': 'multipart/form-data'}, 'url': '/api/'+jlcd+'/doimportidiom/',
                        'responseType': 'json', 'cache': 'false', 'timeout': 10000, 'data': frmData
                    }).then((response) => {
                        if(typeof response == 'object') {                       
                            var res = response.data;
                            var match = /NotOk/.test(res.flag);
                            if(!match == true) {   
                                Cliq.link('maintainidiom');
                            } else { _error('Ajax function returned error NotOk: '+res.msg); }; 
                        } else { _error('Response was not JSON object :'+JSON.stringify(response)); }
                    }).catch(function (reason) {
                        _error(reason);
                    }); 
                 },

                 'deleteidiom': function(evt) {
                    
                    var lcdcode = $(evt.target).data('lcdcode');
                    try {

                        var urlstr = '/deleteidiom/'+jlcd+'/';
                        var args = {
                            'type': 'warning',
                            'text': '<h4>'+lstr[19]+': '+lcdcode+'</h4>',
                            'layout': 'topCenter',
                            'buttons': [
                                Noty.button(lstr[12], 'btn btn-danger btn-sm ml-2', function () {

                                    var frmData = new FormData();
                                    frmData.set('token', jwt);
                                    frmData.set('language', lcdcode);
                                    axios({
                                        'method': 'POST', 'url': urlstr,
                                        'responseType': 'json', 'cache': 'false', 'timeout': 5000, 'data': frmData
                                    }).then(function(response){
                                            cfg.dn.close();
                                            var opts = {
                                                'data': {
                                                    'displaytype': 'maintainidiom',
                                                    'table': '',
                                                    'tabletype': ''
                                                },
                                                'event': {}
                                            }; 
                                            _module('ajax', opts); 
                                        }, (error) => {
                                            _error(error);
                                        }
                                    ).catch(function(reason) {
                                        _handleError(reason);
                                    });

                                }, {id: 'button1', 'data-status': 'ok'}),

                                Noty.button(lstr[18], 'btn btn-warning btn-sm ml-2', function () {
                                    cfg.dn.close();
                                })
                            ],
                            'callbacks': false,
                            'timeout': 0
                        }
                        _msg(args);
                    } catch(err) {
                        alert('Method _deleteLanguage() produced an error: '+err.message);
                    } 
                 },

                // Specific to Settings

                 'importdatabutton': function(evt) {

                    try {

                        var dta = cfg.df.$data.ximport;

                        var urlstr = '/doimportdata/'+jlcd+'/'+dta.tablename+'/';
                        var frmData = new FormData();

                        var fldid = 'inputfilename';
                        var file = $('input[type="file"]', thisform)[0].files[0];     
                        frmData.append(fldid, file.name);  
                        frmData.append(file.name, file, file.filename); 
                        frmData.set('token', jwt);
                        frmData.set('rowterminator', dta.rowterminator);
                        frmData.set('fielddelimiter', dta.fielddelimiter);
                        frmData.set('fieldencloser', dta.fieldencloser);
                        frmData.set('escapecharacter', dta.escapecharacter);
                        frmData.set('testing', dta.testing);
                        frmData.set('removeid', dta.removeid);
                        frmData.set('mapfields', dta.mapfields);
                        axios({
                            'method': 'POST', 'url': urlstr,
                            'responseType': 'json', 'cache': 'false', 'timeout': 5000, 'data': frmData
                        }).then(function(response){
                                var args = {
                                    'element': 'importresults', 
                                    'header': data.columns,    // columns
                                    'records': data.rows        // rows
                                }
                                _json2table(args);
                            }, (error) => {
                                _error(error);
                            }
                        ).catch(function(reason) {
                            _handleError(reason);
                        });

                    } catch(err) {
                        alert('Method importData() produced an error: '+err.message);
                    } 
                 },

                 'exportdatabutton': function(evt) {
                    
                    try {

                        var dta = cfg.df.$data.xport;

                        var urlstr = '/doexportdata/'+jlcd+'/'+dta.tablename+'/'+dta.tabletypename+'/';
                        var frmData = new FormData();
                        frmData.set('token', jwt);
                        frmData.set('rowterminator', dta.rowterminator);
                        frmData.set('fielddelimiter', dta.fielddelimiter);
                        frmData.set('fieldencloser', dta.fieldencloser);
                        frmData.set('escapecharacter', dta.escapecharacter);
                        frmData.set('exportfilename', dta.exportfilename);
                        frmData.set('exportdata', dta.exportdata);
                        axios({
                            'method': 'POST', 'url': urlstr,
                            'responseType': 'json', 'cache': 'false', 'timeout': 5000, 'data': frmData
                        }).then(function(response){

                                var data = response.data.data;
                                if(data.action == 'test') {
                                    var args = {
                                        'element': 'exportresults', 
                                        'header': data.columns,    // columns
                                        'records': data.rows        // rows
                                    }
                                    _json2table(args);
                                } else {
                                    var anchor = document.createElement('a');
                                    anchor.href = data.url;
                                    anchor.download = data.name;
                                    document.body.appendChild(anchor);
                                    anchor.click();
                                }

                            }, (error) => {
                                _error(error);
                            }
                        ).catch(function(reason) {
                            _handleError(reason);
                        });

                    } catch(err) {
                        alert('Method exportData() produced an error: '+err.message);
                    } 
                 },

                 'dumpdatabutton': function() {
                    try {

                        var dta = cfg.df.$data.dbdump;
                        var urlstr = '/dodumpdata/'+jlcd+'/';
                        var frmData = new FormData();
                        frmData.set('token', jwt);
                        $.each(dta, function(tbl, val) {
                            frmData.set(tbl, val);
                        });
                        axios({
                            'method': 'POST', 'url': urlstr,
                            'responseType': 'json', 'cache': 'false', 'timeout': 5000, 'data': frmData
                        }).then(function(response) {
                                _success(response.data.msg);
                            }, (error) => {
                                _error(error);
                            }
                        ).catch(function(reason) {
                            _handleError(reason);
                        });

                    } catch(err) {
                        alert('Method exportData() produced an error: '+err.message);
                    } 
                 },

                'default': function() {
                    _error('Action not defined: ' + action);
                }

            }

            return (btns[action] || btns['default'])(evt); 
         }                  

        /** _getFormData() - Get all form data for a Vue form  
         * A function to collect any and all data, including files from a form
         * @param - boolean - add filename
         * @param - string - 
         * @return - object - the FormData
         **/
         var _getFormData = function(addfilename) {

            // Test config files
            // console.log(cfg, fcfg);
            // cfg contains:  displaytype, table and tabletype, langcd 

            try {

                // Define the Form ID
                    var formid = 'dataform'; var thisform = $('#'+formid);
               
                // JSONeditors if exist - only one JSON Editor if exist and update the Vue instance with Jsoneditor content
                    $('#'+formid+' div[data-type=jsoneditor]').each(function() {
                        cfg.jeditor = findJSONEditor('#'+cfg.jedit);
                        var jeditdata = cfg.jeditor.get();
                        jeditdata = JSON.stringify(jeditdata);
                        // rawurlencode() ??
                        Vue.set(cfg.df, cfg.jedit, jeditdata);
                    }); 

                // If Codeeditor is being used
                    $('.toml').each(function() {
                        var fldid = $(this).attr('id');
                        var tomlcontent = cfg.ceditor.getValue();                   
                        Vue.set(cfg.df, fldid, rawurlencode(tomlcontent));  
                    });  

                // If currency and maskMoney is being used
                    $('.currency').each(function() {
                        var fldid = $(this).attr('id');
                        var cur = $(this).getValue();
                        Vue.set(cfg.df, fldid, cur);
                    });            

                // If access level
                    $('.levelval').each(function() {
                        var fldid = $(this).data('id');
                        var cur = $(this).getValue();
                        Vue.set(cfg.df, fldid, cur);
                    }); 

                // validation here  if required

                // Now get Data from the Vue Instance
                    var postData = cfg.df.$data;                    
                
                // Test Form Content
                    // console.log(postData);                           

                // Now convert Postdata to FormData
                    var frmData = new FormData();
                    $.each(postData, function(fld, val) {
                        if(!stristr(fld, '_r') || !stristr(fld, '_w') || !stristr(fld, '_d') || !stristr(fld, 'file')) {
                            frmData.set(fld, val);
                        }
                        
                    });
                    frmData.append('action', cfg.action);
                    frmData.append('displaytype', cfg.displaytype);
                    frmData.append('token', jwt);
                
                // Add any AJAX Form upload for a single file
                    if( $('#'+formid+'  :input').hasClass('form-control-file') ) {
                        var fldid = $('input[type="file"]').data('fldid');
                        var file = $('input[type="file"]', thisform)[0].files[0];     
                        if(addfilename) {
                            frmData.append(addfilename, file.name); 
                        } else {
                            frmData.append(fldid, file.name);  
                        }                                           
                        frmData.append(file.name, file, file.filename); 
                        Vue.set(cfg.df, fldid, file.name);
                    }
                    
                // New image handling will get image contents anyway

                return frmData; 
            } catch(err) {
                alert(err.message);
            } 
         }

        /** _handleResponse() - Handle a successful response after form is submitted  
         * After form submits
         **/
         var _handleResponse = function(response)
         {

            var table = cfg.table;
            var tabletype = cfg.tabletype;

            // first argument to the success callback is the json data object returned by the server
            if(typeof response == 'object') {

                // response is complete Object so above test WILL pass
                // we need "data" from the response                
                
                var match = /NotOk/.test(response.flag);
                if(!match == true) {

                    // '#jsPanel-MainPanel'
                    _win({}, 'close'); 
                    cfg.data = response.data;

                    switch(cfg.displaytype) {

                        case "lostpassword": _resetPassword(cfg.data.msg); break;
                        case "changestatus": _changeStatus(cfg.data.msg); break;                        

                        case "datagrid":
                            if(cfg.data.action == 'insert') {
                                cfg.dg.$data.data.push(cfg.data.row);                               
                            } else if(cfg.data.action == 'update') {
                                const currentIndex = cfg.dg.$data.data.findIndex(p => p.id === cfg.data.row['id']);
                                cfg.dg.$data.data.splice(currentIndex, 1, cfg.data.row);
                                // _setProp(cfg.dg.$data, ['data', cfg.data.row['id']], cfg.data.row);
                            } else if(cfg.data.action == 'deleterecord') {
                                _deleteProp(cfg.dg.$data, ['data', cfg.data.id]);
                            } else {
                                _error('No action specified: '+cfg.data.action);
                            }
                        break;                    

                        // everything else - galley, datatable, datatree - needs to be like a menu entry
                        default:
                            _success(cfg.data.msg);
                            var opts = {
                                'id': cfg.id,
                                'data': {
                                    'displaytype': cfg.displaytype,
                                    'table': cfg.table,
                                    'tabletype': cfg.tabletype
                                },
                                'event': {}
                            }; 
                            _module('ajax', opts);            
                        break;
                    }

                } else {
                    _error('Ajax function returned error NotOk - '+result.msg);
                };                          
            } else {
                _error('Response was not JSON object - '+JSON.stringify(response))
            };
         }

        /** _handleError() - Handle an error after form submitted  
         * Handles any 500 Errors from the AJAX routine
         */
         var _handleError = function(error) 
         {

            var response = $.parseJSON(error);
            _error(JSON.stringify(response));
            if (error.response) {
              // The request was made and the server responded with a status code
              // that falls out of the range of 2xx
              console.log(error.response.data);
              console.log(error.response.status);
              console.log(error.response.headers);
            } else if (error.request) {
              // The request was made but no response was received
              // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
              // http.ClientRequest in node.js
              console.log(error.request);
            } else {
              // Something happened in setting up the request that triggered an Error
              console.log('Error', error.message);
            }
            console.log(error.config);
            return false;
         }

        /** _modifyValue() - modify any value such as status or password and also delete a record 
         * 
         * @param - object - with all options
         * @return - JSON with response
         **/
         var _modifyValue = function(opts) 
         {

            try {

                if(cfg.tabletype != '') {
                    var urlstr = opts.action+'/'+jlcd+'/'+cfg.table+'/'+cfg.tabletype+'/';
                } else {
                    var urlstr = opts.action+'/'+jlcd+'/'+cfg.table+'/';
                }

                var n = new Noty({
                    'layout':           'topCenter', 
                    'theme':            'bootstrap-v4',
                    'text':             opts.html,
                    'type':             opts.bgcolor,
                    'closeWith':        'button',
                    'buttons': [
                        Noty.button(opts.btntext, 'btn btn-primary mr-2', function() {
                            
                            var val = '';
                            if(array_key_exists('fnctn', opts)) {
                                var selector = opts.fnctn.type+'[name="'+opts.fnctn.name+'"]';
                                val = $(selector).val();
                            };

                            var frmData = new FormData();
                            frmData.set('token', jwt);
                            frmData.set('field', opts.field);
                            frmData.set('recid', opts.recid);
                            frmData.set('value', val);
                            frmData.set('displaytype', cfg.displaytype);
                            // frmData.set('', );

                            axios({
                                'method': 'POST',
                                'url': urlstr,
                                'responseType': 'json',
                                'cache': 'false',
                                'timeout': 5000,
                                'data': frmData
                            }).then(function(response){
                                _handleResponse;
                            }).catch(function (reason) {
                                _handleError;
                            });    
                        }, {'id': 'button1', 'data-status': 'ok'}),
                        Noty.button(lstr[502], 'btn btn-danger', function() {
                            n.close();
                        })
                    ]        
                }).show();
   
            } catch(err) {
                alert(err.message);
            }  
         }

        /** _deleteRecord()
         *
         * @param - options to set the URL
         *
         **/
         var _deleteRecord = function(opts)
         {
                         
            try {

                cfg.action = 'deleterecord';  
                opts.data.displaytype = 'deleterecord';
                var urlstr = _genurl(opts);
                var args = {
                    'type': 'warning',
                    'text': '<h4>'+lstr[19]+': '+cfg.recid+'</h4>',
                    'layout': 'topCenter',
                    'buttons': [
                        Noty.button(lstr[12], 'btn btn-danger btn-sm ml-2', function () {

                            var frmData = new FormData();
                            frmData.set('token', jwt);
                            frmData.set('recid', cfg.recid);
                            frmData.set('action', cfg.action);
                            frmData.set('displaytype', cfg.displaytype);
                            axios({
                                'method': 'POST', 'url': urlstr,
                                'responseType': 'json', 'cache': 'false', 'timeout': 5000, 'data': frmData
                            }).then(function(response){
                                    cfg.dn.close();
                                    _handleResponse(response);
                                }, (error) => {
                                    _error(error);
                                }
                            ).catch(function(reason) {
                                _handleError(reason);
                            });

                        }, {id: 'button1', 'data-status': 'ok'}),

                        Noty.button(lstr[18], 'btn btn-warning btn-sm ml-2', function () {
                            cfg.dn.close();
                        })
                    ],
                    'callbacks': false,
                    'timeout': 0
                }
                _msg(args);
            } catch(err) {
                alert('Method _deleteRecord() produced an error: '+err.message);
            } 
         }

        /** _modInput() - Next Reference, Next ID, Is Unique       
         * 
         * @param - string - Field Id
         * @param - string - the type of the activity
         * @param - string - a prefix is needed for some activities
         * @return - various - Vue data is set and Field value is set
         **/
         var _modInput = function(fldid, action, prefix) // eg 'reference'
         {               
            
            if(cfg.recid == 0) {
                var data = {
                    'token': jwt,
                    'fld': fldid,
                    'prefix': prefix,
                    'currval': $('#'+fldid).val()  
                };
                axios({
                    'method': 'POST',
                    'url': '/'+action+'/'+jlcd+'/'+cfg.table+'/'+cfg.tabletype+'/',
                    'responseType': 'json',
                    'cache': 'false',
                    'timeout': 5000,
                    'data': json_encode(data),
                }).then(function(response){                              
                    if(typeof response == 'object') {
                        // response is complete Object so above test WILL pass
                        // we need "data" from the response                         
                        var res = response.data;
                        // Test NotOK - value already exists
                        var match = /NotOk/.test(res.flag);
                        if(!match == true) {
                            switch(action) {
                                case "getnextref":
                                case "getnextentry":
                                case "getnextid":
                                    Vue.set(cfg.df, fldid, res.data);
                                    $('#'+fldid).val(res.data);
                                break;
                                
                                case "isunique":
                                    if(res.data) {
                                        $('#'+fldid).val('');
                                        $('#'+fldid).focus();
                                        _error('Value already exists');
                                    };
                                break;
                            };      
                            
                        } else { _error('Ajax function returned error NotOk - '+urlstr+':'+res.msg); }; 
                    } else { _error('Response was not JSON object - '+urlstr+':'+response); }
                }).catch(function (reason) {
                    _error(reason);
                });                 
            }
         }

        /** _article()
         *
         * @param - 
         * @return - 
         **/
         var _article = function()
         {
            try {

                // Create  form template in the window content panel
                $('.jsPanel-content').empty().html(html_entity_decode(cfg.data.html));
                cfg.dw.resize({
                    'height': cfg.data.options.height,
                    'width': cfg.data.options.width
                }).reposition();
            } catch(err) {
                alert('Method _view() produced an error: '+err.message);
            } 
         }

        /** _view()
         *
         * @param - 
         * @return - 
         **/
         var _view = function()
         {
            try {

                // Create  form template in the window content panel
                $('.jsPanel-content').empty().html(cfg.data.html);
                cfg.dw.resize({
                    'height': cfg.data.options.height,
                    'width': cfg.data.options.width
                }).reposition();

            } catch(err) {
                alert('Method _view() produced an error: '+err.message);
            } 
         }

    /** Popup editors
     *
     * _popup() - dispatcher
     * _codeEditor()
     * _JSONEditor()
     * _textEditor();
     *
     *************************************************************************************************************/

        /** _popup() - Things like a Texteditor, CodeEditor and JSONEditor a window.
         *
         * @param - Options
         *
         **/
         var _popup = function(opts) {
            /*
            var opts = {
                'method': 'GET',
                'url': urlstr,
                'data': {'token': jwt},
                'action': usropts.action,
                'using': usropts.using,
            };
            */
            try {

                var ftb = ` 
                    <span id="btn-print" class="jsPanel-ftr-btn pointer"><i class="fas fa-print ml-2" title="`+lstr[131]+`"></i></span>
                    <span id="btn-save" class="jsPanel-ftr-btn pointer"><i class="fas fa-save ml-2" title="`+lstr[137]+`"></i></span>
                `;

                var args = { 
                    'contentAjax': {
                        'method': 'POST',
                        'url': opts.url,
                        'data': JSON.stringify(opts.data),
                        'responseType': 'json',
                        'done': function(panel) {
                            var response = this.response;
                            // Test NotOK - value already exists
                            var match = /NotOk/.test(response.flag);
                            if(!match == true) { 
                                //in response we need flag, config and data
                                cfg.dta = response.config;
                                $('.jsPanel-content').html(response.html);
                                switch(opts.using) {
                                    case "codeeditor": _codeEditor('display'); break;
                                    case "texteditor": _textEditor('display'); break;
                                    case "jsoneditor": _JSONEditor('display'); break;
                                };
                            } else {
                                _error('Ajax function returned error NotOk - '+JSON.stringify(this.response.msg));
                            }; 
                        },
                        'fail': function(panel) {
                            _error('Ajax function returned error NotOk - '+JSON.stringify(this.response.msg));
                        },
                        beforeSend: function() {
                            this.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                            this.setRequestHeader('Authorization', jwt);
                            // this.setRequestHeader('Content-Type', 'multipart/form-data');
                        }
                    },
                    'footerToolbar': ftb
                };
                _win(args, 'config');  

            } catch(err) {
                alert('Method _popup() generated an error: '+err.message);
            } 
         }

        // Code editor
         var _codeEditor = function(action) 
         {
            try {

               var actions = {

                    'display': function() {
                        cfg.dw.resize({
                            'width': cfg.dta.width,
                            'height': cfg.dta.height
                        }).setHeaderTitle(cfg.dta.title);  

                        cfg.ceditor = CodeMirror.fromTextArea(document.getElementById('codeeditor'), {
                            mode: "toml",
                            lineNumbers: true,
                            lineSeparator: '<br />'
                        }); 

                        $('#btn-save').on('click', function(e) {
                            _codeEditor('save');
                        });
                    },

                    'save': function() {
                        var frmData = new FormData();
                        var schema = cfg.ceditor.getValue();
                        schema = str_replace('<br />', '\r\n', schema);
                        frmData.append('schema', schema);
                        frmData.append('filepath', cfg.dta.filepath);
                        frmData.append('token', jwt);
                        axios({
                            'method': 'POST',
                            'url': '/api/'+jlcd+'/savetomlfile/',
                            'responseType': 'json',
                            'cache': 'false',
                            'timeout': 5000,
                            'data': frmData,
                        }).then(function(response) {
                            // first argument to the success callback is the json data object returned by the server
                            if(typeof response == 'object') {
                                // response is complete Object so above test WILL pass
                                // we need "data" from the response
                                var result = response.data;
                                var match = /NotOk/.test(result.flag);
                                if(!match == true) {
                                    _info(result.msg);
                                } else {
                                    _error('Ajax function returned error NotOk - '+result.msg);
                                };                          
                            } else {
                                _error('Response was not JSON object - '+JSON.stringify(response));
                            };                 
                        }).catch(function(reason) {
                            var response = $.parseJSON(reason);
                            _error(JSON.stringify(response));   
                        }); 
                    }
                }

                return (actions[action] || actions['display'])(); 

            } catch(err) {
                alert('Method _codeEditor() generated an error: '+err.message);
            } 
         }

        // JSON editor
         var _JSONEditor = function(action, opts) 
         {
            try {

               var actions = {

                    // Creates a jsPanel and gets the data to be displayed by Tiny MCE
                    'load': function() {

                        var htb = `<h4 class="mt-1 text-light" id="paneltitle">`+opts.recid+`</h4>`;
                        var ftb = `<span id="btn-print" class="jsPanel-ftr-btn pointer"><i class="fas fa-print ml-2" title="`+lstr[131]+`"></i></span>`;
                        var args = {
                            'headerTitle': htb, 'footerToolbar': ftb,
                            'contentSize': {'width': 640,'height': 640},    
                            'contentAjax': {
                                'method': 'POST', 'url': '/api/'+jlcd+'/jsoneditor/', 'responseType': 'json', 
                                'data':JSON.stringify({
                                    'recid': opts.recid,
                                    'table': opts.table,
                                    'tabletype': opts.tabletype,
                                    'token': jwt
                                }),
                                'done': function(panel) {
                                    var response = this.response;
                                    var match = /NotOk/.test(response.flag);
                                    if(!match == true) { 
                                        // Textarea with an ID
                                        $('.jsPanel-content').html(response.html);
                                        $('#paneltitle').html(response.title);
                                        cfg.data = response.data;
                                        _JSONEditor('display', {});
                                    } else {
                                        _error('Ajax function returned error NotOk - '+this.response.msg);
                                    }; 
                                },
                                'fail': function(panel) {
                                    _error('Ajax function returned error NotOk - '+this.response.msg);
                                },
                                beforeSend: function() {
                                    this.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                                },

                            } // Ends
                        };
                        _win(args, 'config'); 
                    },

                    // Puts the JSON editor into the panel
                    'display': function() {
                        var fldid = 'jsoneditor';
                        var options = {
                            search: false,
                            mode: "code",
                            modes: ["code", "form", "tree"],
                            height: 640
                        };
                        cfg.jeditor = createJSONEditor('#' + fldid, options);
                        cfg.jeditor.set(JSON.parse(cfg.data));
                    },

                    // Saves the text back tio the disk
                    'save': function() {
                        var frmData = new FormData();
                        frmData.append('table', cfg.table);
                        frmData.append('recid', cfg.recid);
                        frmData.append('d_text', cfg.jeditor.get());
                        frmData.append('token', jwt);
                        frmData.append('field', 'd_text');
                        frmData.append('useidiom', 0);
                        axios({
                            'method': 'POST',
                            'url': '/api/'+jlcd+'/savecontent/',
                            'responseType': 'json',
                            'cache': 'false',
                            'timeout': 5000,
                            'data': frmData,
                        }).then(function(response) {
                            // first argument to the success callback is the json data object returned by the server
                            if(typeof response == 'object') {
                                // response is complete Object so above test WILL pass
                                // we need "data" from the response
                                var result = response.data;
                                var match = /NotOk/.test(result.flag);
                                if(!match == true) {
                                    _info(result.msg);
                                } else {
                                    _error('Ajax function returned error NotOk - '+result.msg);
                                };                          
                            } else {
                                _error('Response was not JSON object - '+JSON.stringify(response));
                            };                 
                        }).catch(function(reason) {
                            var response = $.parseJSON(reason);
                            _error(JSON.stringify(response));   
                        }); 
                    }
                }

                return (actions[action] || actions['display'])(opts); 

            } catch(err) {
                alert('Method _JSONEditor() generated an error: '+err.message);
            } 
         }

        // Text editor
         var _textEditor = function(action, opts) 
         {

            try {

                var saveButton = function(context) {
                    var ui = $.summernote.ui;
                    // create button
                    var button = ui.button({
                        contents: '<i class="fas fa-save"/>',
                        tooltip: 'Save',
                        click: function () {
                            var thistext = "";
                            var frmData = new FormData();
                            frmData.append('recid', cfg.recid);
                            $.each(cfg.idioms, function(lcd, lcdname) {
                                // var markupStr = $('.summernote').eq(1).;
                                thistext = $('#texteditor_'+lcd).summernote('code');
                                if(thistext != "") {
                                    frmData.append('d_text_'+lcd, thistext);
                                } else {
                                    _error('No text: '+thistext);
                                }
                            });
                            frmData.append('token', jwt);
                            frmData.append('field', 'd_text');
                            frmData.append('useidiom', 1);
                            axios({
                                'method': 'POST', 'url': '/savecontent/'+jlcd+'/'+cfg.table+'/'+cfg.tabletype+'/',
                                'responseType': 'json', 'cache': 'false','timeout': 5000, 'data': frmData,
                            }).then(function(response) {
                                // first argument to the success callback is the json data object returned by the server
                                if(typeof response == 'object') {
                                    // response is complete Object so above test WILL pass
                                    // we need "data" from the response
                                    var result = response.data;
                                    var match = /NotOk/.test(result.flag);
                                    if(!match == true) {
                                        _info(result.msg);                                    
                                        $.each(cfg.idioms, function(lcd, lcdname) {
                                            $('#texteditor_'+lcd).tinymce.remove();
                                        });  
                                        cfg.dw.close();
                                    } else {
                                        _error('Ajax function returned error NotOk - '+result.msg);
                                    };                          
                                } else {
                                    _error('Response was not JSON object - '+JSON.stringify(response));
                                };                 
                            }).catch(function(reason) {
                                var response = $.parseJSON(reason);
                                _error(JSON.stringify(response));   
                            }); 
                        }
                    });
                    return button.render();   // return button as jquery object                    
                }

                var translateButton = function(context) {
                    var ui = $.summernote.ui;
                    // create button
                    var button = ui.button({
                        contents: '<i class="fas fa-flag"/>',
                        tooltip: 'Translate',
                        click: function () {
                            var textfrom = $('#texteditor_'+opts.defaultlang).val();
                            axios({
                                'method': 'GET',
                                'url': "https://api.microsofttranslator.com/V2/Ajax.svc/Translate",
                                'responseType': 'jsonp',
                                // 'jsonp': "oncomplete",
                                // 'crossDomain': true,
                                'cache': 'false',
                                'timeout': 10000,
                                'params': {
                                    appId: cfg.bingkey,
                                    from: opts.defaultlang, 
                                    to: opts.thislang,
                                    contentType: "text/plain",
                                    text: textfrom
                                },
                            }).then(function(response) {
                                $('#texteditor_'+opts.thislang).val(response.data);
                            }).catch(function(reason) {
                                var response = $.parseJSON(reason);
                                _error(JSON.stringify(response));   
                            });
                        }
                    });
                    return button.render();   // return button as jquery object                
                }

                var actions = {

                    // Creates a jsPanel and gets the data to be displayed by Tiny MCE
                    'load': function() {

                        var htb = `<h4 class="mt-1 text-light" id="paneltitle">`+cfg.recid+`</h4>`;
                        var ftb = `<span id="btn-print" class="jsPanel-ftr-btn pointer"><i class="fas fa-print ml-2" title="`+lstr[30]+`"></i></span>`;
                        var args = {
                            'headerTitle': htb, 'footerToolbar': ftb,
                            'contentSize': {'width': 640,'height': 640},    
                            'contentOverflow': 'scroll',    // Only scroll
                            'contentAjax': {
                                'method': 'POST', 'url': '/texteditor/'+jlcd+'/'+cfg.table+'/'+cfg.tabletype+'/', 'responseType': 'json', 
                                'data':JSON.stringify({
                                    'recid': cfg.recid,
                                    'token': jwt,
                                    'action': cfg.displaytype
                                }),
                                'done': function(panel) {
                                    var response = this.response.data;
                                    var match = /NotOk/.test(response.flag);
                                    if(!match == true) { 
                                        // Textarea with an ID
                                        $('.jsPanel-content').html(response.html);
                                        $('#paneltitle').html(response.title);
                                        _textEditor('display', {});
                                    } else {
                                        _error('Ajax function returned error NotOk - '+this.response.msg);
                                    }; 
                                },
                                'fail': function(panel) {
                                    _error('Ajax function returned error NotOk - '+this.response.msg);
                                },
                                beforeSend: function() {
                                    this.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                                },

                            } // Ends
                        };
                        _win(args, 'config'); 
                    },

                    // Converting a textarea into a Rich Text Editor for each language
                    'display': function() {
                        var options = {
                            toolbar: [
                                ['style', ['style']],
                                ['font', ['fontname', 'fontsize', 'bold', 'underline', 'clear']],
                                ['color', ['color']],
                                ['para', ['ul', 'ol', 'paragraph']],
                                ['table', ['table']],
                                ['insert', ['link', 'picture']],
                                ['view', ['help', 'codeview', 'save', 'translate']]
                            ],
                            // fontNames: ['Arial', 'Arial Black', 'Comic Sans MS', 'Courier New']
                            styleTags: [
                                'p',
                                { title: 'Blockquote', tag: 'blockquote', className: 'blockquote', value: 'blockquote' },
                                'pre', 'h2', 'h3', 'h4', 'h5', 'h6'
                            ],
                            buttons: {
                                save: saveButton,
                                translate: translateButton
                            },
                            dialogsInBody: true,
                            tabsize: 2,
                            height: 500                            
                        }
                        $.each(cfg.idioms, function(lcd, lcdn) {
                            $('#texteditor_'+lcd).summernote(options);
                        });
                    },
                }
                return (actions[action] || actions['display'])(opts); 



            } catch(err) {
                alert('Method _textEditor() generated an error: '+err.message);
            } 
         }

        /** _json2table() - 
         * a small table for use in the sidebar
         * @param - array - data
         * @return table
         *
         **/
         var _json2table = function(data)
         {
            var tpl = `<table class='table table-sm table-condensed table-striped table-hover table-bordered text-sm smaller ml-1' id='`+data.element+`table'>
                <thead><tr>
                    <th v-for='(col, fld) in columns'>{{col}}</th>
                </tr></thead>
                <tbody><tr v-for='(row, idx) in records' v-bind:data-index='row.id' v-bind:data-rowid='idx'>
                    <td v-for='(col, fld) in columns' v-html='row[col]' ></td>
                </tr></tbody>
            </table>`;
            $('#'+data.element).html(tpl);
            vm = new Vue({
                'el': '#'+data.element+'table',
                'data': {
                    'columns': data.header,
                    'records': data.records
                },
                'methods': {}
            });  
            return vm;       
         }

    /** User Functions
     *
     * logout()
     * modifyUser()
     * changePassword()
     *
     **************************************************************************************************************************/

        /** _logout()
         * 
         * @param - 
         * @return - evaluated callback
         **/
         var _logout = function() {
            var urlstr = '/login/'+jlcd+'/';
            jwt = '';
            uLoad(urlstr);
         } 

        /** _modifyUser()
         *
         * @return - setup a window
         **/
         var _modifyUser = function(opts) {
            // Set up a Winform 
            cfg.action = 'currentuser';   
            var urlstr = '/currentuser/'+jlcd+'/dbuser/';
            var args = {
                'url': urlstr,
                'data': {
                    'token': jwt,
                    'user': opts.data.user
                },
                'title': lstr[200],
                'type': 'form'  
            }
            _winload(args);
         }

        /** _changePassword() 
         *
         * @return - a Noty
         **/
         var _changePassword = function(opts)
         {
            try {

                var frm = `
                <form>
                  <div class="form-group">
                    <label for="">`+lstr[1]+`</label>
                    <input type="password" class="form-control" min="8" max="12" autofocus required id="d_password" placeholder="***************">
                  </div>
                  <div class="form-group">
                    <label for="">`+lstr[31]+`</label>
                    <input type="password" class="form-control" required id="x_password" placeholder="***************">
                  </div>
                </form>
                `;

                cfg.dn = new Noty({
                    'layout':           'topCenter', 
                    'theme':            'bootstrap-v4',
                    'text':             frm,
                    'type':             'info',
                    'closeWith':        ['button'],
                    'buttons': [
                        Noty.button(lstr[202], 'btn btn-success', function() {
                            if( $('#d_password').val() != $('#x_password').val() ) {
                                alert(lstr[205]);
                                $('#d_password').val('');
                                $('#x_password').val('');
                                $('#d_password').focus();
                                return false;
                            } else {
                                var opts = {
                                    'url': '/changepassword/'+jlcd+'/dbuser/',
                                    'data': {
                                        'token': jwt,
                                        'password': $('#d_password').val(),
                                        'user': opts.data.user
                                    },
                                    'callback': function() {
                                        _info(lstr[81]);
                                    }
                                }     
                                _post(opts);
                                cfg.dn.close();                           
                            }
                        }, {'id': 'button1', 'data-status': 'ok'}),
                        Noty.button(lstr[204], 'ml-2 btn btn-danger', function() {
                            cfg.dn.close();
                        })
                    ]
                }).show();
   
            } catch(err) {
                alert(err.message);
            }  
         }

    /** Windows and Alerts
     *
     * _error()
     * _warning()
     * _info()
     * _success()
     * _msg()
     * 
     * _win()
     *
     ****************************************************************************************************************/

        /** _preview() - Preview with JSON view
         * Opens window and display JSON data in it as a Preview
         * Used primarily for testing and development
         * @param - object - data
         **/
         var _preview = function(data) 
         {
            var args = {
                'headerTitle': '<h5 class="mt-1 text-light">Preview</h5>',
                'contentSize': {
                    'width': 440,
                    'height': 540,                    
                },    
                'content': '<div class="p-2 text-sm" id="jsonview"><div>',
                'callback': function(panel, status) {
                    $('#jsonview').JSONView(data, {
                        'collapsed': false
                        // nl2br: true
                    });  
                }
            };
            _win(args, 'config');       
         }

        /** _error()
         *
         * @param - string - error message
         **/
         var _error = function(txt) {
            var opts = {
                type: 'error',
                text: txt,
                layout: 'center',
                callbacks: {
                    onTemplate: function() {
                        this.barDom.innerHTML = '<div class="h3 noty_body">' + this.options.text + '<div>';
                        // Important: .noty_body class is required for setText API method.
                    }
                }
            }
            _msg(opts);
         }

        /** _warning()
         *
         * @param - string - error message
         **/
         var _warning = function(txt) {
            _msg({type: 'warning', text: '<h3 class="p-2"><span class="fa fa-bomb"></span> Error</h3><h4 class="p-2">'+txt+'</h4>'});
         }

        /** _info()
         *
         * @param - string - information text
         **/
         var _info = function(txt) {
            _msg({type: 'information', text: '<h3 class="p-2"><span class="fa fa-help-circle-outline"></span> Information</h3><h5 class="p-2">'+txt+'</h5>'});
         }

        /** _success()
         *
         * @param - string - information text
         **/
         var _success = function(txt) {
            _msg({type: 'success', text: '<h3 class="p-2"><span class="fa fa-check-bold"></span> Success</h3><h5 class="p-2">'+txt+'</h5>'});
         }

        /** _msg()
         *
         * @param - options
         **/
         var _msg = function(usropts) {

            var defaults = {
               type: 'success',
               layout: 'topRight',
               theme: 'bootstrap-v4',
               text: 'text',
               id: 'cliqnoty',
               timeout: '4000', // 4 seconds
               progressBar: false,
               closeWith: ['button'],
               killer: true,
               buttons: false
               /*
               callbacks: {
                    beforeShow: function() {},
                    onShow: function() {},
                    afterShow: function() {},
                    onClose: function() {},
                    afterClose: function() {},
                    onHover: function() {},
                    onTemplate: function() {
                        this.barDom.innerHTML = '<div class="noty_body h4">' + this.options.text + '<div>';
                        // Important: .noty_body class is required for setText API method.
                    }
                }
                */
            };
            var opts = array_merge_recursive(defaults, usropts);
            cfg.dn = new Noty(opts);
            cfg.dn.show();  
         }     

        /** _dialog() Common Noty with programmable buttons
         * @param - array - user options
         * @return - message box
         **/  
         var _dialog = function(opts) 
         {
            try {

                cfg.dn = new Noty({
                    'layout':           'topCenter', 
                    'theme':            'bootstrap-v4',
                    'text':             opts.text,
                    'type':             'info',
                    'buttons': [
                        Noty.button(opts.btntext, 'btn btn-success', function() {
                            opts.callback;
                        }, {'id': 'button1', 'data-status': 'ok'}),
                        Noty.button('Close', 'btn btn-danger', function() {
                            n.close();
                        })
                    ]
                }).show();
   
            } catch(err) {
                alert(err.message);
            }  
         }

        /** _win() Information - jsPanel
         * @param - array - user options
         @param - string - action, defaults to config
         * @return - message box
         **/  
         var _win = function(usropts, action) 
         {
            try {

                if(action == null || action == 'undefined') {action = 'config'};

                var wins = {

                    'open': function(opts) {

                        jsPanel.zibase = 2000;

                        if(usropts.usepromise == true) {
                            return jsPanel.create(opts);
                        } else {
                           cfg.dw = jsPanel.create(opts);
                        }; return;
                    },

                    'close': function() {
                        cfg.dw.close();
                        cfg.dw = new Object;
                    },

                    'replace': function() {
                        cfg.dw.contentRemove();
                        cfg.dw.content = cfg.text;
                    },

                    'resize': function() {
                        cfg.dw.resize(cfg.winsize).reposition();
                    },

                    'header': function() {
                        cfg.dw.headerTitle('<h4 class="mt-1 text-light">'+cfg.wintitle+'</h4>');
                    },

                    // Default
                    'config': function() {

                        // Prevents a Panel opening more than once unless it has an ID and is probably a subpanel
                        if(!array_key_exists('id', usropts)) {
                            if($('#jsPanel-MainPanel').exists()) {
                                return false;
                            }                    
                        };
            
                        var ftb = ` 
                            <span style="flex:1 1 auto">Print</span>
                            <span id="btn-print" class="jsPanel-ftr-btn pointer"><i class="fa fa-print"></i></span>
                        `;
                        var btnPrint = function(panel) {
                            $('#btn-print').on('click', function(e) {
                                // overflow is hidden and scroll .....
                                $('#dataview').print();
                            })
                        };

                        var defaults = {
                            // General
                            'id':               'jsPanel-MainPanel',
                            'callback':         btnPrint,

                            // Appearance
                            'border':           'solid 1px #ccc',
                            'borderRadius':     5,
                            'boxShadow':        5,
                            'theme':            'bootstrap-secondary',
                            'iconFont':         'fas',
                            // 'iconfont':         ['custom-smallify', 'custom-minimize',  'custom-normalize', 'custom-maximize',  'custom-close'], 
                            'headerControls':   false,
                            'headerLogo':       '<img src="'+sitepath+'views/img/logo_sm.png" class="p-1 pl-2" id="panelHdr" />',
                            'footerToolbar':    ftb, 
                            'headerRemove':     false,
                            'template':         false,
                            'headerTitle':      false,

                            // Position                  
                            'container':        'body',
                            'contentSize':      {
                                'width': 400,
                                'height': 400
                            },
                            'position':           'center', // all other defaults are set in jsPanel.position()

                            // Content
                            'content':          false,
                            'contentAjax':      false,
                            'contentIframe':    false,
                            'contentOverflow':  'hidden scroll',

                            // Events
                            'custom':           false,
                            'dblclicks':        false,

                            // Toolbar properties
                            'maximizedMargin':  {
                                'top':    85,
                                'right':  25,
                                'bottom': 25,
                                'left':   25
                            },
                            'minimizeTo':         true,
                            'dragit': {
                                'handles':        "#panelHdr",
                                'opacity':        0.8
                            },
                            'resizeit':           {
                                'handles':   'n, e, s, w, ne, se, sw, nw',
                                'minWidth':  400,
                                'minHeight': 400
                            },
                            'onclosed': function() {
                                
                            }
                        };              

                        var opts = array_merge_recursive(defaults, usropts); 

                        _win(opts, 'open');
                    }
                };

                return (wins[action] || wins['config'])(usropts); 
     
            } catch(err) {
                _error(err.message);
            }  
         } 

        /* _menu() - Plain menu made with jsPanel
         *
         * @param - array - options
         * @return - popup menu
         **/
         var _menu = function(opts)
         {
            try {              

            } catch(err) {
                _error(err.message);
            }  
         }            

    /** Utilities
     *
     * _post() - data to the server for saving
     * _load() - something from the server into an element
     * _fetch()
     * _winload() - get form and data from the server to load into a window and execute a form on it or view it
     * _genurl()
     * _gendata()
     * _displayBreadcrumBar()
     * _help()
     * _report()
     *
     ****************************************************************************************************************/

        /** _post()
         *
         * @param - array - options
         **/
         var _post = function(opts) {
            axios({
                'method': 'POST',
                'url': opts.url,
                'responseType': 'json',
                'cache': 'false',
                'timeout': 5000,
                'data': opts.data
            }).then((response) => {
                    _indirectCaller(opts.callback, response);                    
                }, (error) => {
                    _error(error);
                }
            ).catch(function(reason) {
                _handleError(reason);
            }); 
         }

         var _indirectCaller = function(f, opts) {
            _caller(f, opts);
         }

         var _caller = function(f, opts) {
            f(opts);
         }

        /** _load()
         *
         * @param - array - options
         **/
         var _load = function(opts) {
            axios({
                'method': 'GET',
                'url': opts.url,
                'responseType': 'json',
                'cache': 'false',
                'timeout': 5000,
                'params': opts.params
            }).then((response) => {
                    eval(opts.callback);                    
                }, (error) => {
                    _error(error);
                }
            ).catch(function(reason) {
                _handleError(reason);
            }); 
         }   

        /** _fetch()
         * Gets data from the database
         * @param - object - see defaults for options
         * @return - evaluated callback
         **/
         var _fetch = function(dta, callback)
         {
            try {
                var defaults = {
                    'method': 'GET',
                    'url': '/api/'+jlcd+'/dashboard/',
                    'cache': 'false',
                    'params': {
                        'token': jwt
                    },
                    'responseType': 'json',
                    'timeout': 5000
                }
                var opts = array_merge_recursive(defaults, dta);   

                axios(opts).then(response => {
                    eval(callback);
                });
            } catch(err) {
                alert('_fetch error: '+err.message);
            } 
         }

        /** _modValue()
         *
         * @param - array - options data
         * @return - Noty with form and buttons
         **/
         var _modValue = function(data)
         {
            cfg.dt.$data[data.fld] = $('input[name="'+data.fld+'"]').val();
            var opts = {
                'layout': 'topCenter',
                'timeout': 0,
                'closeWith': ['button'],
                'text': data.frm,
                'buttons': [
                    Noty.button(lstr[67], 'btn btn-success btn-sm', function() {
                        // save it to disk
                        axios({
                            'method': 'POST', 'responseType': 'json', 'cache': 'false', 'timeout': 5000, 'url': '/savevalue/'+jlcd+'/'+cfg.table+'/'+cfg.tabletype+'/',
                            'data': {
                                'token': jwt,
                                'recid': cfg.recid,
                                'field': data.fld,
                                'value': $('#'+data.fld).val() // hopefully OK for inputs and selects ......
                            }
                        }).then((response) => {

                                var result = response.data;
                                var match = /NotOk/.test(result.flag);
                                if(!match == true) { 
                                    _success(result.msg);                              
                                } else {
                                    _success(result.msg);
                                }                 
                            }, (error) => {
                                _error(error);
                            }
                        ).catch(function(reason) {
                            _handleError(reason);
                        }); 
                        cfg.dn.close();
                    }, {'id': 'button1', 'data-status': 'ok'}),
                    Noty.button('Close', 'btn btn-danger btn-sm ml-2', function() {
                        cfg.dn.close();
                    })
                ]
            }
            _msg(opts);        
         }

        /** _winload()
         *
         * @param - array - options
         **/
         var _winload = function(opts) {

            try {
                var args = {
                    'headerTitle': '<h5 class="mt-1 text-light">'+opts.title+'</h5>',
                    'contentSize': {
                        'width': 460,
                        'height': 500
                    },    
                    'contentAjax': {
                        'url': opts.url,
                        'data': json_encode(opts.data),
                        // 'withCredentials': true
                        'timeout': 10000,
                        'async': true,
                        'dataType': 'json',
                        'method': 'post',
                        'beforeSend': function() {
                            // _info(urlstr);                                    
                            this.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); 
                            this.setRequestHeader('Authorization', jwt);
                        },                                  
                        'done': function (xhr, panel) {
                            // Convert the JSON response string to an object
                            var response = JSON.parse(xhr.response);
                            var match = /NotOk/.test(response.flag);
                            if(!match == true) { 
                                // If OK, write to CFG and thus make available script wide
                                cfg.data = response.data; 
                                // Go to Vue form or view
                                if(opts.type == 'form') {
                                    _form();
                                } else if(opts.type == 'view') {
                                    _view();
                                } else {
                                    _article();
                                }
                            } else {
                                $('#paneltitle').html('Error');
                                $('.jsPanel-content').html(response.msg);
                            }; 
                        },
                        'fail': function (xhr, panel) {                   // change to fail after development
                            console.log(xhr.response);
                        }
                    }
                }
                _win(args, 'config');

            } catch(err) {
                alert('_winload error: '+err.message);
            } 
         }   

        /** _genurl()
         * Generates a URL from some data
         * @param - object - data
         * @return - string - a valid URL
         **/
         var _genurl = function(opts)
         {
            try {
                var urlstr = '/';
                if(opts.data.displaytype != '') {urlstr += opts.data.displaytype+'/'+jlcd+'/'};
                if(opts.data.table != '') {urlstr += opts.data.table+'/'};
                if(opts.data.tabletype != '') {urlstr += opts.data.tabletype+'/'};
                return urlstr;
            } catch(err) {
                alert('_genurl error: '+err.message);
            } 
         }

        /** _gendata() OK
         * Massage data to prepare it for use in Vue and other processes
         * @param - object - data
         * @return - string - a valid URL
         **/
         var _gendata = function()
         {
            try {        
                var qrepl = ['&quot;', '&lt;', '&gt;', '&#039;'], qwith = ['"', '<', '>', "'"], newdata = str_replace(qrepl, qwith, cfg.rawdata);
                cfg.data = JSON.parse(newdata);
                return true;
            } catch(err) {
                alert('_gendata error: '+err.message);
            } 
         }   

        /** _displayBreadcrumBar() OK
         * Update the text in the Breadcrumb bar and the buttons
         * @param - object - data
         * @return - bool true
         **/
         var _displayBreadcrumBar = function(vuedata)
         {

            try {

                var breadcrumbs = '';
                $.each(vuedata.breadcrumbs, function(i, bc) {
                    breadcrumbs += `<li class="breadcrumb-item" id="`+i+`">`+bc['text']+`</li>`;
                });

                var buttons = '';
                $.each(vuedata.buttons, function(i, vbtn) {
                    buttons += `<a 
                        class="btn btn-sm text-white float-right bcbutton ml-1 btn-`+vbtn['class']+`" 
                        href="#" role="button" 
                        data-id="`+i+`" 
                        data-action="`+vbtn['action']+`" 
                        data-table="`+vbtn['table']+`" 
                        data-tabletype="`+vbtn['tabletype']+`" 
                        data-displaytype="`+vbtn['displayusing']+`" 
                    ><i class="fas fa-fw fa-`+vbtn['icon']+`"></i>`+vbtn['text']+`</a>`;
                }); 

                var html = `
                    <ol class="col-5 breadcrumb">`+breadcrumbs+`</ol>
                    <div class="col-7 pt-2">`+buttons+`</div>
                `;
                $('#breadcrumbbar').empty().html(html);

                $('a.bcbutton').on('click', function(event) {
                    event.preventDefault();
                    var dta = $(this).data();
                    var opts = {
                        'data': dta,
                        'event': event
                    }
                    _buttonEvent(dta.action, opts);
                });

            } catch(err) {
                alert('_DisplayBreadcrumbBar error: '+err.message);
            } 

         }   

        /** iFrameSize()
         *
         **/
         var _setIFrameSize = function(id) {
            f = $("#"+id);
            f[0].setAttribute("width", f.parent().width());
            f[0].setAttribute("height", f.parent().height());
         }  

        /** _report() - View report in a window.
         *
         * @param - object options from click event
         *
         **/
         var _report = function(opts) {
            try {
                
                var htb = `<h4 class="mt-1 text-light" id="paneltitle">`+opts.name+`</h4>`;
                var ftb = `<span id="btn-print" class="jsPanel-ftr-btn pointer"><i class="fas fa-print ml-2" title="`+lstr[30]+`"></i></span>`;
               
                var args = {
                    'headerTitle': htb, 'footerToolbar': ftb, 'contentSize': {'width': 540, 'height': 640},    
                    'contentAjax': {
                        'method': 'POST', 'url': '/publishreport/'+jlcd+'/'+opts.table+'/'+opts.tabletype+'/',
                        'responseType': 'json',
                        'data': JSON.stringify({'token': jwt, 'report':opts.name}),
                        'done': function(panel) {
                            var response = this.response;
                            // Test NotOK - value already exists
                            var match = /NotOk/.test(response.flag);
                            if(!match == true) { 
                                cfg.model = response.model;
                                $('.jsPanel-content').html(response.html);
                                $('#paneltitle').html(cfg.model.title);

                                _orderBy();

                                /*
                                // Respond to clicks on orderby icon
                                $('.sort-icon').on('click', function(evt) {
                                    var id = $(evt.target).data('id');
                                    _orderBy(id);
                                });
                                */

                            } else {
                                _error('Ajax function returned error NotOk - '+this.response.msg);
                            }; 
                        },
                        'fail': function(panel) {
                            _error('Ajax function returned error NotOk - '+this.response.msg);
                        },
                        beforeSend: function() {
                            this.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                        }
                    }
                };
                _win(args, 'config');

                cfg.dw.resize({
                    'width': cfg.model['width'],
                    'height': cfg.model['height']
                });

            } catch(err) {
                alert('Method _report() generated an error: '+err.message);
            } 
         }

        /** _lineError()
         * Mozilla supports line numbers in errors so if an error is reported we get line number as well
         * @param - Object - error
         * @return - feeds text to Webix error
         **/
         var _lineError = function(err, msg) 
         {
            if(stristr(navigator.userAgent, 'Mozilla')) {
                var s = msg + ': ' + err.message+' at ' + err.lineNumber;
                console.log(s);
                _error(s);
            } else {
                _error(msg + ': ' + err.message);
            }
         }

        /** _delay()
         * Delay function
         * @param - object - callback function
         * @param - number - milliseconds
         **/
         var _delay = function(callback, ms) 
         {
            var timer = 0;
            return function() {
                var context = this, args = arguments;
                clearTimeout(timer);
                timer = setTimeout(function () {
                    callback.apply(context, args);
                }, ms || 0);
            };
         }

        /** _camelize()   
         * To get camelCase dataTree from datatree
         * @param - string -
         **/
         var _camelize = function _camelize(str) {
            switch(str) {
                case "calendar":
                case "gallery":
                    return str;
                break;
                default:
                    var wd = substr(str, 4);
                    return 'data'+ucfirst(wd);
                break;
            }
            return 
         }

        /** _orderBy()
         * Changes the sort icon on any column - -up, -down and default is plain sort
         * then sets orderby to new column
         **/
         var _orderBy = function(id)
         {
            try {

                const getCellValue = (tr, idx) => tr.children[idx].innerText || tr.children[idx].textContent;
                
                const comparer = (idx, asc) => (a, b) => ((v1, v2) => v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : v1.toString().localeCompare(v2))(getCellValue(asc ? a : b, idx), getCellValue(asc ? b : a, idx));

                var ord = explode('|', cfg.orderby);

                // do the work...
                document.querySelectorAll('th').forEach(th => th.addEventListener('click', ((evt) => {
                    
                    // this refers to document
                    var id = $(evt.target).data('th-id');

                    const table = th.closest('table');
                    const tbody = table.querySelector('tbody');
                    
                    $('i.sort-icon').removeClass('fa-sort-up').removeClass('fa-sort-down').addClass('fa-sort');

                    if(ord[1] == 'asc') { // Change to desc
                        $('i[data-id="'+id+'"]').removeClass('fa-sort').removeClass('fa-sort-up').addClass('fa-sort-down'); 
                        cfg.orderby = id+'|desc';
                    } else { // Change to asc
                        $('i[data-id="'+id+'"]').removeClass('fa-sort').removeClass('fa-sort-down').addClass('fa-sort-up');  
                        cfg.orderby = id+'|asc'; 
                    }    

                    Array.from(tbody.querySelectorAll('tr'))
                        .sort(comparer(Array.from(th.parentNode.children).indexOf(th), this.asc = !this.asc))
                        .forEach(tr => tbody.appendChild(tr) );
                })));

            } catch(err) {
                alert('Orderby generated an error: '+err.message);
            } 
         }

    // explicitly return public methods when this object is instantiated
     return {
        // outside: inside
        component: _component,
        init: _init,

        set: _set,
        get: _get,    
        config: _config
     }; 

})(jQuery);  
