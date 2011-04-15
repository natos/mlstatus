var checkAPIs = function() {
    
    // for automatic refresh, show the interval
    $("span").text(refresh.every);
    
    // Grab all links from the ul#live
    $("#live a").each(function(i,e) {
        // For each one of them
        var e = $(e),
            // Grab his parent
            li = e.parent(),
            // Read the href
            url = e.attr("href");
            url += ((url.indexOf("?")>=0) ? "&" : "?") + "callback=?&requestfrom=mlstatuspage";

        // Wipe classnames
        li.removeClass("on").removeClass("off").addClass("checking");

        // Ask for API      
        $.ajax({
          url: url, 
          dataType:"jsonp",
             timeout:10000,
             success: function(data, status) {
             // API Online
              li.removeAttr("title")
                .removeClass("checking")
                .removeClass("off")
                .addClass("on")
                .fadeOut("fast",function(){
                    $(this).detach()
                           .appendTo("#live")
                           .show("fast");                
                });
             },
             error: function(XHR, textStatus, errorThrown) {
             // API Offline
              li.attr("title",errorThrown)
                .removeClass("checking")
                .removeClass("on")
                .addClass("off")
                .fadeOut("fast",function(){
                    $(this).detach()
                           .hide()
                           .prependTo("#live")
                           .fadeIn("fast");

                });
            }
        });
    });
};

var waiting = function() {
    var span = $("span");
    var count = span.text();
        count = count - 1;
        span.text(count);    
}
 

var timers = {
    auto: "",
    waiting: "",
    set: function(){
        timers.auto = setInterval("checkAPIs()", 1*refresh.every*1000);
        timers.waiting = setInterval("waiting()", 1000);
    },
    unset: function(){
        clearInterval(timers.auto); 
        clearInterval(timers.waiting);
    }
}

var $refresh = $("#refresh");

var refresh = {
    every: 60,
    cache: "",
    auto: function(){
        timers.set();
        refresh.cache = $refresh.next().html();
        $("#btnrefresh").unbind("click");
        $("label").eq(1).fadeOut("fast",function(){ $(this).remove(); });
        $refresh.attr("checked","checked")
                .next().html("Auto refresh in <span>"+refresh.every+"</span>");
    },
    
    manual: function(){
        timers.unset();
        refresh.cache = $refresh.next().html();
        $("label").eq(1).remove();
        $("<label> or <button id=\"btnrefresh\">Refresh Button</button></label>").hide()
            .appendTo($refresh.parents("p")).fadeIn("fast");
        $refresh.removeAttr("checked")
                .next().html("Automatic refresh");
        $("#btnrefresh").click(function(){
            checkAPIs();
        });
    },
    start: function(x){

        refresh[x]();

        $refresh.change(function(){        
            if (this.checked) {
                refresh.auto();
            } else {
                refresh.manual();
            }
        });
    }
}

$(function(){
    
    refresh.start("manual");
    
    checkAPIs();
    
    // small UI tweek
    $refresh
        .parent()
        .hover(function(){ $refresh.focus(); },
               function(){ $refresh.blur(); });
    
});