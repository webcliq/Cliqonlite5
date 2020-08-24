<!-- Script.Tpl -->
<script>
    // Paths
    var sitepath = "@($protocol)"+document.location.hostname+"/",  
        jspath = sitepath+"views/js/",
        path = window.location.href; ;
    // Objects
    var ctrlDown = false, ctrlKey = 17, cmdKey = 91, vKey = 86, cKey = 67;
    var jlcd = '@raw($idiom)', jwt = '@raw($jwt)', component = '@raw($component)';
    var lstr = @raw(json_encode($lstr)), site = @raw(json_encode($cfg['site']));

    // basket.clear(true);
    basket
    .remove("adm", "lib")  //, "code"
    .require(  
        {url: jspath+"adminlibrary.js", key: "lib", skipCache: true},
        {url: jspath+"phpjs.js"},
        {url: jspath+"bootstrap.js"},
        {url: jspath+"vue.js"},
        {url: jspath+"vue-xtras.js"},
        {url: jspath+"bootstrap-table.min.js"},
        {url: jspath+"dropzone.js"},
        {url: jspath+"moment-with-locales.js"},  
        {url: jspath+"uri.js"}, 
        {url: jspath+"fancytree.min.js"}, 
        {url: jspath+"jexcel.js"}, 
        {url: jspath+"summernote.min.js"}, 
        {url: jspath+"fullcalendar.js"},  
        {url: jspath+"datetimepicker.js"},  
        {url: jspath+"codemirror/lib/codemirror.js"},
        {url: jspath+"codemirror/addon/search/searchcursor.js"},
        {url: jspath+"codemirror/addon/merge/merge.js"},
        {url: jspath+"codemirror/mode/toml/toml.js"},
        {url: jspath+"codemirror/mode/php/php.js"},
        {url: jspath+"codemirror/mode/htmlmixed/htmlmixed.js"},
        {url: jspath+"codemirror/mode/javascript/javascript.js"},
        {url: jspath+"codemirror/mode/css/css.js"},
        {url: jspath+"codemirror/mode/vue/vue.js"},
        {url: jspath+"jsoneditor.min.js"},
        {url: jspath+"gridstack.min.js"},
        {url: jspath+"coolclock.js"},
        {url: jspath+"admin.js", key: "adm", skipCache: true}             
    ).then(function(msg) {

        $(document).keydown(function(e) {
            return (e.which || e.keyCode) != 116;
        })
        
        Admin.init();
    }, function (error) {
        // There was an error fetching the script
        console.log(error);
    }); 

    function _hbf()  
    {  
        if(window.event) {  
            if(window.event.clientX < 40 && window.event.clientY < 0) {  
                 alert("Browser back button is clicked...");  
             } else {  
                 alert("Browser refresh button is clicked...");  
             }  
         } else {  
             if(event.currentTarget.performance.navigation.type == 1) {  
                  alert("Browser refresh button is clicked...");  
             }  

             if(event.currentTarget.performance.navigation.type == 2) {  
                  alert("Browser back button is clicked...");  
             }  
         }  
    } 
</script>
</body>