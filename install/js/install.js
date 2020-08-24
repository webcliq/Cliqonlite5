// Install.Js

/*
        try {

        } catch(err) {
            alert(err.message);
        } 
*/

var Install = (function($) {

    // Cfg shared values
         var cfg = {    
            dta: new Array, // Everything returned in a AJAX request
            da: new Object, // Database form
            db: new Object, // Languages form
            dc: new Object, // Admin User
            dbisset: false, idiomisset: false, userisset: false, ceditor: new Object,
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

    /** Modules and Components
     *
     * _init()
     * _component()
     *
     ****************************************************************************************************************/

        /** _init()
         * Initialize Admin system
         * @param - object - see defaults for options
         * @return - evaluated callback
         **/
         var _init = function() {

            console.log('Init loaded');

            // Animate the cliqbutton
            $(".cliqbutton").on("click", function(e) {
                e.preventDefault();
                var dta = $(this).data();
                var action = $(this).attr('id');
                var opts = {
                    'data': dta,
                    'event': e
                };
                _component(action, opts);
            });

            var actions = ['checkdirectories', 'dbcreateform', 'idiomrowrepeat', 'admcreateform'];
            $.each(actions, function(n, action) {
                _component(action);
            });
         }  

        /** _component() - dispatcher
         * 
         * @param - string - component action
         * @return - and activity or an evaluated callback
         **/
         var _component = function(action) {
            
            try {

                var actions = {  

                // Check directories

                    'checkdirectories': function() {
                        var urlstr = '/install/'+jlcd+'/'; var frmData = new FormData(); frmData.append('action', 'checkdirectories');
                        axios({
                            'method': 'POST', 'responseType': 'json', 'cache': 'false', 'timeout': 5000, 'url': urlstr, 'data': frmData,
                        }).then((response) => {
                                var result = response.data;
                                var match = /NotOk/.test(result.flag);
                                if(!match == true) { 
                                    $('#checkdirectories').html(result.msg);   
                                } else {
                                    bootbox.alert(result.msg);
                                }                  
                            }, (error) => {
                                bootbox.alert(error);
                            }
                        ).catch(function(reason) {
                            bootbox.alert(reason);
                        });  
                    },

                // Connect to Database and Tables, if successful write connection details to Config.txt

                    'dbcreateform': function() {
                        try {
                            cfg.da = new Vue({
                                'el': '#dataform',
                                'data': {
                                    'db': {
                                        'connectiontype': 'sqlite',
                                        'dbname': 'cliqonlite',
                                        'dbuser': '',
                                        'dbpassword': '',
                                        'dbserver': '',
                                        'dbport': ''
                                    }
                                },
                                'methods': {
                                    'dbcreate': function() {
                                        var urlstr = '/install/'+jlcd+'/';
                                        axios({
                                            'method': 'POST', 'responseType': 'json', 'cache': 'false', 'timeout': 5000, 'url': urlstr,
                                            'data': _getFormData(this.$data.db, 'dbcreate'),
                                        }).then((response) => {
                                                var result = response.data;
                                                var match = /NotOk/.test(result.flag);
                                                if(!match == true) { 
                                                    bootbox.alert(result.msg);  
                                                    cfg.dbisset = true;                            
                                                } else {
                                                    bootbox.alert(result.msg);
                                                }                 
                                            }, (error) => {
                                                bootbox.alert(error);
                                            }
                                        ).catch(function(reason) {
                                            bootbox.alert(reason);
                                        }); 
                                    }
                                }
                            });

                        } catch(err) {
                            alert(lstr[0]+': '+err.message);
                        } 
                    },

                // Write languages to Config.Txt

                    'idiomrowrepeat': function() {
                        try {
                            cfg.db = new Vue({
                                'el': '#idiomform',
                                'data': {
                                    'idiom': {
                                        'idmcode': '',
                                        'idmname': '',
                                        'idmflag': '',
                                    },
                                    'idioms': []
                                },
                                'methods': {
                                    'addNewIdiom': function() {
                                        this.idioms.push(Vue.util.extend({}, this.idiom))
                                    },
                                    'removeIdiom': function(index) {
                                        Vue.delete(this.idioms, index);
                                    },

                                    'saveIdioms': function() {
                                        var urlstr = '/install/'+jlcd+'/';
                                        var frmData = new FormData();
                                        $.each(this.idioms, function(n, val) {
                                            var idm = val.idmcode;
                                            frmData.set(idm, JSON.stringify(val));
                                        });
                                        frmData.append('action', 'setidioms');
                                        axios({
                                            'method': 'POST', 'responseType': 'json', 'cache': 'false', 'timeout': 5000, 'url': urlstr,
                                            'data': frmData, 
                                        }).then((response) => {
                                                var result = response.data;
                                                var match = /NotOk/.test(result.flag);
                                                if(!match == true) { 
                                                    bootbox.alert(result.msg);  
                                                    cfg.idiomisset = true;                            
                                                } else {
                                                    bootbox.alert(result.msg);
                                                }                 
                                            }, (error) => {
                                                bootbox.alert(error);
                                            }
                                        ).catch(function(reason) {
                                            bootbox.alert(reason);
                                        }); 
                                    }
                                },
                                mounted: function () {
                                   this.idioms = JSON.parse(this.$el.dataset.idioms);
                                }                              
                            });

                        } catch(err) {
                            alert(lstr[1]+': '+err.message);
                        } 
                    },

                // Create an adminuser in the database

                    'admcreateform': function() {
                        try {
                            cfg.dc = new Vue({
                                'el': '#adminform',
                                'data': {
                                    'user': {
                                        'admuser': 'admin',
                                        'admpassword': '**********',
                                        'admemail': '',
                                        'sitesecret': 'wehfwje93854wefefklh'
                                    }
                                },
                                'methods': {
                                    'usercreate': function() {
                                        if(cfg.dbisset == true) {
                                            var urlstr = '/install/'+jlcd+'/';
                                            axios({
                                                'method': 'POST', 'responseType': 'json', 'cache': 'false', 'timeout': 5000, 'url': urlstr,
                                                'data': _getFormData(this.$data.user, 'adminuser'),
                                            }).then((response) => {
                                                    var result = response.data;
                                                    var match = /NotOk/.test(result.flag);
                                                    if(!match == true) { 
                                                        bootbox.alert(result.msg); 
                                                        cfg.userisset = true;                             
                                                    } else {
                                                        bootbox.alert(result.msg);
                                                    }                 
                                                }, (error) => {
                                                    bootbox.alert(error);
                                                }
                                            ).catch(function(reason) {
                                                bootbox.alert(reason);
                                            }); 
                                        } else {
                                            bootbox.alert(lstr[2]);
                                        }
                                    }
                                }
                            });

                        } catch(err) {
                            alert(lstr[3]+': '+err.message);
                        } 
                    },

                // Load the Config.txt into the edititor, modify and save to config.cfg

                    'cfgloadbutton': function() {
                        if( (cfg.idiomisset == true) && (cfg.userisset == true) ) {
                            var urlstr = '/install/'+jlcd+'/'; var frmData = new FormData(); frmData.append('action', 'getconfig');
                            axios({
                                'method': 'POST', 'responseType': 'json', 'cache': 'false', 'timeout': 5000, 'url': urlstr, 'data': frmData,
                            }).then((response) => {
                                    var result = response.data;
                                    var match = /NotOk/.test(result.flag);
                                    if(!match == true) { 
                                        $('#codeeditor').val(result.msg);   
                                        TLN.append_line_numbers('codeeditor');
                                        cfg.ceditor = new Behave({
                                            textarea: document.getElementById('codeeditor'),
                                            tabSize: 2
                                        });
                                    } else {
                                        bootbox.alert(result.msg);
                                    }                  
                                }, (error) => {
                                    bootbox.alert(error);
                                }
                            ).catch(function(reason) {
                                bootbox.alert(reason);
                            });     
                        } else { bootbox.alert(lstr[4]); }    
                    },

                    'cfgsavebutton': function() {

                        var urlstr = '/install/'+jlcd+'/'; 
                        var frmData = new FormData(); 
                        frmData.append('action', 'setconfig');
                        frmData.append('configuration', $('#codeeditor').val());
                        axios({
                            'method': 'POST', 'responseType': 'json', 'cache': 'false', 'timeout': 5000, 'url': urlstr, 'data': frmData,
                        }).then((response) => {
                                var result = response.data;
                                var match = /NotOk/.test(result.flag);
                                if(!match == true) { 
                                    bootbox.alert(result.msg);
                                } else {
                                    bootbox.alert(result.msg);
                                }                  
                            }, (error) => {
                                bootbox.alert(error);
                            }
                        ).catch(function(reason) {
                            bootbox.alert(reason);
                        });  
                    },

                    'cfgcompletebutton': function() {

                        var urlstr = '/install/'+jlcd+'/'; 
                        var frmData = new FormData(); 
                        frmData.append('action', 'complete');
                        frmData.append('configuration', $('#codeeditor').val());
                        axios({
                            'method': 'POST', 'responseType': 'json', 'cache': 'false', 'timeout': 5000, 'url': urlstr, 'data': frmData,
                        }).then((response) => {
                                var result = response.data;
                                var match = /NotOk/.test(result.flag);
                                if(!match == true) { 
                                    window.location.reload();
                                } else {
                                    bootbox.alert(result.msg);
                                }                  
                            }, (error) => {
                                bootbox.alert(error);
                            }
                        ).catch(function(reason) {
                            bootbox.alert(reason);
                        }); 

                    },

                // Default just in case

                    'default': function() {
                        bootbox.alert('Component action not defined: ' + action);
                    }
                 }

                return (actions[action] || actions['default'])();

            } catch(err) {
                alert('Method _component() produced an error: '+err.message);
            } 
         }    

        /** _getFormData() - Get all form data for a Vue form  
         * A function to collect any and all data, including files from a form
         * @param - string - form element
         * @return - object - the FormData
         **/
         var _getFormData = function(data, action) {

            try {              
                var frmData = new FormData();
                $.each(data, function(fld, val) {
                    frmData.set(fld, val);
                });
                frmData.append('action', action);
                return frmData; 
            } catch(err) {
                alert(err.message);
            } 
         }

    // explicitly return public methods when this object is instantiated
     return {
        // outside: inside
        init: _init,

        set: _set,
        get: _get,    
        config: _config
     }; 

})(jQuery);  

