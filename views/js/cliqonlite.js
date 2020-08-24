/* Cliqonlite.Js */

/*
        try {

        } catch(err) {
            alert(err.message);
        } 
*/

var Cliq = (function($) {

    // Cfg shared values
         var cfg = {	
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
            
            console.log('Init: '+cfg.url);
            _component(cfg.url, {});
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