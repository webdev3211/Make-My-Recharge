var credentials = require("./data.json");
var casper = require('casper').create({
    pageSettings: {
        loadImages: false,//The script is much faster when this field is set to false
        loadPlugins: false,
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36',
        // userAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.106 Safari/537.36"),
        // userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X) Chrome/50.0.2661.102',
        // userAgent: 'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1',
        // userAgent: 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.120 Safari/537.36',
        // userAgent: 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36',
        clientScripts: ['jquery.js', 'tesseract.js'],
        remoteScripts: ['https://cdn.rawgit.com/naptha/tesseract.js/1.0.10/dist/tesseract.js'],
    },
    waitTimeout: 10000, verbose: true,
});
var utils = require('utils');
var f = utils.format;
// phantom.libraryPath = [
//     './tesseract'
// ];

var no_of_500_gc = 0;
var no_of_200_gc = 0;
var no_of_100_gc = 0;
var no_of_50_gc = 0;
var no_of_20_gc = 0;
var no_of_10_gc = 0;


// Print out all the messages in the headless browser context
casper.on('remote.message', function (msg) {
    this.echo('remote message cought: ' + msg);
});

casper.on("url.changed", function () {
    this.then(function () {
        this.echo(this.getTitle());
    });

});

// Print out all the sessages in the headless browser context
casper.on('page.error', function (msg, trace) {
    this.echo("Page Error: " + msg, "ERROR");
});

casper.label = function label(labelname) {
    var step = new Function('"empty function for label: ' + labelname + ' "');   // make empty step
    step.label = labelname;                                 // Adds new property 'label' to the step for label naming
    this.then(step);                                        // Adds new step by then()
};

casper.goto = function goto(labelname) {
    for (var i = 0; i < this.steps.length; i++) {         // Search for label in steps array
        if (this.steps[i].label == labelname) {      // found?
            this.step = i;                              // new step pointer is set
        }
    }
};

// casper.viewport = { width: 1366, height: 768 };
var x = require('casper').selectXPath;

var AMAZON_USER_EMAIL = credentials.email;
var AMAZON_USER_PASS = credentials.password;


casper.start().thenOpen("https://www.amazon.in/dp/B07DJL15QT/", function () {
    casper.page.injectJs('jquery.js');
    console.log("Amazon website opened");
    // console.log(this.evaluate(function () {
    //     return $("title")[0].innerText;
    // }));
    casper.waitForSelector('input#add-to-cart-button',
        function () {
            this.evaluate(function () {
                $.ajax({
                    url: "<my-domain>/removemycashback.php",
                    type: "POST",
                    async: false,
                    success: function (data) {
                        console.log(data);
                    }
                });
            });
            this.click("input[id='add-to-cart-button']");
        }, 15000);
});

// var tesseract = require('node-tesseract');

casper.wait(5000, function () {
    // this.echo(this.getTitle());
    casper.then(function () {
        casper.capture('a1.png');
        this.click("a[id='hlb-ptc-btn-native']");
    });
});

// var rechargeAmount = 0;

casper.thenOpen("https://www.amazon.in/ap/signin?openid.return_to=https%3A%2F%2Fwww.amazon.in%2Fhz%2Fcontact-us%3Ffrom%3Dgp%26*entries*%3D0%26_encoding%3DUTF8%26*Version*%3D1&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.assoc_handle=amzn_contactus_desktop_in&openid.mode=checkid_setup&marketPlaceId=A21TJRUUN4KGV&openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&pageId=Amazon&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&openid.pape.max_auth_age=3600&siteState=clientContext%3D257-8410709-4106756%2CsourceUrl%3Dhttps%253A%252F%252Fwww.amazon.in%252Fhz%252Fcontact-us%253Ffrom%253Dgp%2526*entries*%253D0%2526_encoding%253DUTF8%2526*Version*%253D1%2Csignature%3D4sF9HajSPPj2FgZLrhj2Bk1pmEFQdj2BMj3D", function () {
    casper.then(function () {
        casper.capture('a2.png');
    })

    this.echo(credentials.email);

    this.fillSelectors('form[name="signIn"]', {
        "input[name='email']": credentials.email,
        "input[name='password']": credentials.password
    }, true);

    // window.rechargeAmount = this.evaluate(getRechargeAmount);
});



casper.then(function () {
    if (this.getTitle() == "Amazon Sign In") {

        casper.waitForSelector('input#ap_password',
            function () {
                this.evaluate(function () {
                    document.getElementById("ap_password").value = "";
                    document.getElementById("signInSubmit").click();
                });
            }, 15000);
    }
})


casper.wait(5000, function () {
    casper.capture('a3.png');
});


casper.then(function () {
    if (this.getTitle() == "Amazon Sign In") {

        // var js = this.evaluate(function () {
        //     return document;
        // });
        // this.echo(js.all[0].outerHTML);
        // fs.writeFile(js.all[0].outerHTML, 'Output.txt');
        var captchaans = "";
        // phantom.injectJs('./tesseract.js');
        var imgsrc = "";
        // var Tesseract = require('./tesseract');
        casper.page.injectJs('jquery.js');
        casper.page.injectJs('tesseract.js');

        // casper.wait(5000, function () {
        casper.waitForSelector('img#auth-captcha-image',
            function () {
                this.captureSelector('captcha.png', '#auth-captcha-image');
                this.evaluate(function () {
                    document.getElementById("ap_password").value = "123456";
                    imgsrc = document.getElementById("auth-captcha-image").src;
                    var captcha = "";
                    console.log(imgsrc);
                    Tesseract.recognize("captcha.png").then(function (result) {
                        captcha = result.text;
                        captchaans = captcha;
                        document.getElementById("auth-captcha-guess").value = captcha;
                        document.getElementById("signInSubmit").click();
                        console.log(captcha);
                    });
                });

            }, 60000);
    }
    else if (this.getTitle() == "Amazon.in - Contact Us") {
        casper.waitForSelector('a#nav-cart',
            function () {
                this.evaluate(function () {
                    document.getElementById("nav-cart").click();
                });
            }, 15000);

    }
});



casper.wait(5000, function () {
    casper.capture('a4.png');
});




//MOVING TO AMAZON PAY PAGE
casper.then(function () {
    casper.thenOpen("https://www.amazon.in/gp/sva/dashboard?ref_=nav_apay", function () {
        casper.wait(5000, function () {
            casper.capture('a5.png');
        });
    });
});



/*================================================
//FETCHIG GIFT CARD
==================================================*/

var addGC500 = function () {
    var ajax = new XMLHttpRequest();
    var method = "GET";
    var url = "<my-domain>/api500.php";
    var asynchronous = true;
    ajax.open(method, url, asynchronous);
    ajax.send();
    ajax.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var data = JSON.parse(this.responseText);
            var email = data[0].excel_email;
            document.getElementById("txt_claimCode").value = email;
            console.log(email);
            $.ajax({
                url: "<my-domain>/remove500.php",
                type: "POST",
                async: false,
                success: function (data) {
                    console.log(data);
                    document.getElementsByName("txtLeftButton")[0].click();
                }
            });
            setTimeout(function () {
                var current_balance = document.getElementsByClassName("gc-balance a-text-bold")[0].innerText.trim();
                current_balance = parseInt(current_balance);
                console.log(current_balance);
            }, 1500);
        }
    }
};

var addGC200 = function () {
    var ajax = new XMLHttpRequest();
    var method = "GET";
    var url = "<my-domain>/api200.php";
    var asynchronous = true;
    ajax.open(method, url, asynchronous);
    ajax.send();
    ajax.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var data = JSON.parse(this.responseText);
            var email = data[0].excel_email;
            document.getElementById("txt_claimCode").value = email;
            console.log(email);
            $.ajax({
                url: "<my-domain>/remove200.php",
                type: "POST",
                async: false,
                success: function (data) {
                    console.log(data);
                    document.getElementsByName("txtLeftButton")[0].click();
                }
            });
            setTimeout(function () {
                var current_balance = document.getElementsByClassName("gc-balance a-text-bold")[0].innerText.trim();
                current_balance = parseInt(current_balance);
                console.log(current_balance);
            }, 1500);
        }
    }
};


var addGC100 = function () {
    var ajax = new XMLHttpRequest();
    var method = "GET";
    var url = "<my-domain>/api100.php";
    var asynchronous = true;
    ajax.open(method, url, asynchronous);
    ajax.send();
    ajax.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var data = JSON.parse(this.responseText);
            var email = data[0].excel_email;
            document.getElementById("txt_claimCode").value = email;
            console.log(email);
            $.ajax({
                url: "<my-domain>/remove100.php",
                type: "POST",
                async: false,
                success: function (data) {
                    console.log(data);
                    document.getElementsByName("txtLeftButton")[0].click();
                }
            });
            setTimeout(function () {
                var current_balance = document.getElementsByClassName("gc-balance a-text-bold")[0].innerText.trim();
                current_balance = parseInt(current_balance);
                console.log(current_balance);
            }, 1500);
        }
    }
};



var addGC50 = function () {
    var ajax = new XMLHttpRequest();
    var method = "GET";
    var url = "<my-domain>/api50.php";
    var asynchronous = true;
    ajax.open(method, url, asynchronous);
    ajax.send();
    ajax.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var data = JSON.parse(this.responseText);
            var email = data[0].excel_email;
            document.getElementById("txt_claimCode").value = email;
            console.log(email);
            $.ajax({
                url: "<my-domain>/remove50.php",
                type: "POST",
                async: false,
                success: function (data) {
                    console.log(data);
                    document.getElementsByName("txtLeftButton")[0].click();
                }
            });
            setTimeout(function () {
                var current_balance = document.getElementsByClassName("gc-balance a-text-bold")[0].innerText.trim();
                current_balance = parseInt(current_balance);
                console.log(current_balance);
            }, 1500);
        }
    }
};


var addGC20 = function () {
    var ajax = new XMLHttpRequest();
    var method = "GET";
    var url = "<my-domain>/api20.php";
    var asynchronous = true;
    ajax.open(method, url, asynchronous);
    ajax.send();
    ajax.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var data = JSON.parse(this.responseText);
            var email = data[0].excel_email;
            document.getElementById("txt_claimCode").value = email;
            console.log('Gift card of 20', email);
            $.ajax({
                url: "<my-domain>/remove20.php",
                type: "POST",
                async: false,
                success: function (data) {
                    console.log(data);
                    document.getElementsByName("txtLeftButton")[0].click();
                }
            });
            setTimeout(function () {
                var current_balance = document.getElementsByClassName("gc-balance a-text-bold")[0].innerText.trim();
                current_balance = parseInt(current_balance);
                console.log(current_balance);
            }, 1500);
        }
    }
};

var addGC10 = function () {
    var ajax = new XMLHttpRequest();
    var method = "GET";
    var url = "<my-domain>/api10.php";
    var asynchronous = true;
    ajax.open(method, url, asynchronous);
    ajax.send();
    ajax.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var data = JSON.parse(this.responseText);
            var email = data[0].excel_email;
            document.getElementById("txt_claimCode").value = email;
            console.log(email);
            $.ajax({
                url: "<my-domain>/remove10.php",
                type: "POST",
                async: false,
                success: function (data) {
                    console.log(data);
                    document.getElementsByName("txtLeftButton")[0].click();
                }
            });
            setTimeout(function () {
                var current_balance = document.getElementsByClassName("gc-balance a-text-bold")[0].innerText.trim();
                current_balance = parseInt(current_balance);
                console.log(current_balance);
            }, 1500);
        }
    }
};


// /*================================================
// //ADDING GIFT CARD OF 100
// ==================================================*/
// var counter = 0;
// casper.label("LOOP_START");

// casper.then(function () {

//     casper.thenOpen("https://www.amazon.in/gp/css/gc/payment", function () {

//         casper.page.injectJs('jquery.js');

//         casper.waitForSelector('input#txt_claimCode',
//             function () {
//                 counter++;
//                 if (counter <= 1) {
//                     this.evaluate(addGC20);
//                     // this.evaluate(addGC10);
//                     this.echo("Now it is adding the 10 Amazon Gift Card");
//                     this.echo(counter);
//                 }
//             }, 15000);

//         casper.wait(5000, function () {
//             casper.capture('a7.png');
//         });

//     });

// });



// casper.then(function () {         // *** NEED to put then() around goto() ***
//     if (counter < 1) { this.goto("LOOP_START"); }     // conditional jump for making loop like  do{...}while(...)
// });


// /*================================================
// //GIFT CARD OF 100 ADDED SUCCESSFULLY
// ==================================================*/


/*================================================
//ADDING GIFT CARD OF 500
==================================================*/
if (no_of_500_gc != 0) {
    var counter_500 = 0;
    casper.label("LOOP_START_500");


    casper.then(function () {

        casper.thenOpen("https://www.amazon.in/gp/css/gc/payment", function () {


            casper.page.injectJs('jquery.js');

            casper.waitForSelector('input#txt_claimCode',
                function () {
                    counter_500++;
                    if (counter_500 <= no_of_500_gc) {
                        this.evaluate(addGC500);

                        this.echo("Now it is adding the 500 Amazon Gift Card");
                        this.echo(counter_500);
                    }
                }, 15000);

            casper.wait(5000, function () {
                casper.capture('a7.png');
            });

        });

    });



    casper.then(function () {         // *** NEED to put then() around goto() ***
        if (counter_500 < no_of_500_gc) { this.goto("LOOP_START_500"); }     // conditional jump for making loop like  do{...}while(...)
    });

}


/*================================================
//ADDING GIFT CARD OF 200
==================================================*/

if (no_of_200_gc != 0) {
    var counter_200 = 0;
    casper.label("LOOP_START_200");


    casper.then(function () {

        casper.thenOpen("https://www.amazon.in/gp/css/gc/payment", function () {


            casper.page.injectJs('jquery.js');

            casper.waitForSelector('input#txt_claimCode',
                function () {
                    counter_200++;
                    if (counter_200 <= no_of_200_gc) {
                        this.evaluate(addGC200);

                        this.echo("Now it is adding the 200 Amazon Gift Card");
                        this.echo(counter_200);
                    }
                }, 15000);

            casper.wait(5000, function () {
                casper.capture('a7.png');
            });

        });

    });



    casper.then(function () {         // *** NEED to put then() around goto() ***
        if (counter_200 < no_of_200_gc) { this.goto("LOOP_START_200"); }     // conditional jump for making loop like  do{...}while(...)
    });

}


/*================================================
//ADDING GIFT CARD OF 100
==================================================*/
if (no_of_100_gc != 0) {

    var counter_100 = 0;
    casper.label("LOOP_START_100");


    casper.then(function () {

        casper.thenOpen("https://www.amazon.in/gp/css/gc/payment", function () {


            casper.page.injectJs('jquery.js');

            casper.waitForSelector('input#txt_claimCode',
                function () {
                    counter_100++;
                    if (counter_100 <= no_of_100_gc) {
                        this.evaluate(addGC100);

                        this.echo("Now it is adding the 100 Amazon Gift Card");
                        this.echo(counter_100);
                    }
                }, 15000);

            casper.wait(5000, function () {
                casper.capture('a7.png');
            });

        });

    });



    casper.then(function () {         // *** NEED to put then() around goto() ***
        if (counter_100 < no_of_100_gc) { this.goto("LOOP_START_100"); }     // conditional jump for making loop like  do{...}while(...)
    });


}


/*================================================
//ADDING GIFT CARD OF 50
==================================================*/
if (no_of_50_gc != 0) {

    var counter_50 = 0;
    casper.label("LOOP_START_50");


    casper.then(function () {

        casper.thenOpen("https://www.amazon.in/gp/css/gc/payment", function () {


            casper.page.injectJs('jquery.js');

            casper.waitForSelector('input#txt_claimCode',
                function () {
                    counter_50++;
                    if (counter_50 <= no_of_50_gc) {
                        this.evaluate(addGC50);

                        this.echo("Now it is adding the 50 Amazon Gift Card");
                        this.echo(counter_50);
                    }
                }, 15000);

            casper.wait(5000, function () {
                casper.capture('a7.png');
            });

        });

    });



    casper.then(function () {         // *** NEED to put then() around goto() ***
        if (counter_50 < no_of_50_gc) { this.goto("LOOP_START_50"); }     // conditional jump for making loop like  do{...}while(...)
    });


}

/*================================================
//ADDING GIFT CARD OF 20
==================================================*/

if (no_of_20_gc != 0) {

    var counter_20 = 0;
    casper.label("LOOP_START_20");


    casper.then(function () {

        casper.thenOpen("https://www.amazon.in/gp/css/gc/payment", function () {


            casper.page.injectJs('jquery.js');

            casper.waitForSelector('input#txt_claimCode',
                function () {
                    counter_20++;
                    if (counter_20 <= no_of_20_gc) {
                        this.evaluate(addGC20);

                        this.echo("Now it is adding the 20 Amazon Gift Card");
                        this.echo(counter_20);
                    }
                }, 15000);

            casper.wait(5000, function () {
                casper.capture('a7.png');
            });

        });

    });



    casper.then(function () {         // *** NEED to put then() around goto() ***
        if (counter_20 < no_of_20_gc) { this.goto("LOOP_START_20"); }     // conditional jump for making loop like  do{...}while(...)
    });


}

/*================================================
//ADDING GIFT CARD OF 10
==================================================*/
if (no_of_10_gc != 0) {

    var counter_10 = 0;
    casper.label("LOOP_START_10");


    casper.then(function () {

        casper.thenOpen("https://www.amazon.in/gp/css/gc/payment", function () {


            casper.page.injectJs('jquery.js');

            casper.waitForSelector('input#txt_claimCode',
                function () {
                    counter_10++;
                    if (counter_10 <= no_of_10_gc) {
                        this.evaluate(addGC10);

                        this.echo("Now it is adding the 10 Amazon Gift Card");
                        this.echo(counter_10);
                    }
                }, 15000);

            casper.wait(5000, function () {
                casper.capture('a7.png');
            });

        });

    });



    casper.then(function () {         // *** NEED to put then() around goto() ***
        if (counter_10 < no_of_10_gc) { this.goto("LOOP_START_10"); }     // conditional jump for making loop like  do{...}while(...)
    });

}





casper.wait(5000, function () {
    casper.capture('a8.png');
});



//MOVING TO AMAZON RECHARGE PAGE
casper.thenOpen("https://www.amazon.in/hfc/mobileRecharge?ref=apay_dashboard", function () {
    // casper.then(function () {

    casper.wait(5000, function () {
        casper.capture('a10.png');
    });

    // });

});



/*================================================
//ENTERING MOBILE NUMBER
==================================================*/
casper.then(function () {
    casper.page.injectJs('jquery.js');

    casper.waitForSelector('input#mobileNumberTextInputId', function () {
        this.evaluate(function () {
            var ajax = new XMLHttpRequest();
            var method = "GET";
            var url = "<my-domain>/mydataapi.php";
            var asynchronous = true;
            ajax.open(method, url, asynchronous);
            ajax.send();
            ajax.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    var data = JSON.parse(this.responseText);
                    setTimeout(function () {

                        var mobile_number = data[0].mobile_number;

                        document.getElementById("mobileNumberTextInputId").value = mobile_number;
                    }, 2000);

                }
            }

        });
        casper.wait(5000, function () {
            casper.capture('a11.png');
        });

    }, 15000);
});


casper.wait(2000, function () {
    casper.then(function () {
        casper.waitForSelector("span#viewOperatorCircleAction", function () {
            this.evaluate(function () {
                document.getElementById("viewOperatorCircleAction").setAttribute("class", "a-declarative");
                document.getElementById("operatorCircleLink").style.display = "block";
                setTimeout(function () {
                    document.getElementById("operatorCircleLink").click();
                }, 500);
            });
            casper.wait(5000, function () {
                casper.capture('a12.png');
            });

        }, 15000);
    });

})



/*================================================
//SELECTING OPERATOR
==================================================*/
casper.then(function () {
    casper.page.injectJs('jquery.js');

    casper.waitForSelector("fieldset#operatorGroup", function () {

        this.evaluate(function () {
            var ajax2 = new XMLHttpRequest();
            var method = "GET";
            var url = "<my-domain>/mydataapi.php";
            var asynchronous = true;
            ajax2.open(method, url, asynchronous);
            ajax2.send();

            ajax2.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    var data = JSON.parse(this.responseText);
                    setTimeout(function () {

                        var mobile_number = data[0].mobile_number;
                        document.getElementById("mobileNumberTextInputId").value = mobile_number;

                        var operator = data[0].operator;
                        // var amount = data[0].amount;
                        // var recharge_type = data[0].recharge_type;
                        console.log('Operator', operator);
                        var option = 1;
                        switch (operator) {
                            case "AIRTEL": option = option + 1; break;
                            case "BSNL": option = option + 2; break;
                            case "IDEA": option = option + 3; break;
                            case "JIO": option = option + 4; break;
                            case "TATA DOCOMO": option = option + 7; break;
                            case "VODAFONE": option = option + 9; break;
                        }
                        document.getElementsByClassName("a-radio a-radio-fancy a-spacing-medium")[option].firstElementChild.firstElementChild.click();
                    }, 3000);


                }
            }

        });
        casper.wait(6000, function () {
            casper.capture('a13.png');
        });

    }, 15000);
});


casper.then(function () {
    casper.waitForSelector("div#circlesRadioButtonDiv", function () {
        this.evaluate(function () {
            setTimeout(function () {
                if (document.getElementsByClassName("circle-group-hidden")[7].firstElementChild.firstElementChild.firstElementChild.value === "Haryana~HARYANA") {
                    document.getElementsByClassName("circle-group-hidden")[7].firstElementChild.firstElementChild.firstElementChild.click();
                } else if (document.getElementsByClassName("circle-group-hidden")[6].firstElementChild.firstElementChild.firstElementChild.value === "Haryana~HARYANA") {
                    document.getElementsByClassName("circle-group-hidden")[6].firstElementChild.firstElementChild.firstElementChild.click();
                }
            }, 500);
        })
        casper.wait(5000, function () {
            casper.capture('a14.png');
        });

    }, 15000);
});



/*================================================
//ENTERING AMOUNT AND CHECKING FOR RECHARGETYPE
==================================================*/
casper.then(function () {
    casper.page.injectJs('jquery.js');

    casper.waitForSelector("input#amountTextInputId", function () {
        this.evaluate(function () {

            var ajax3 = new XMLHttpRequest();
            var method = "GET";
            var url = "<my-domain>/mydataapi.php";
            var asynchronous = true;
            ajax3.open(method, url, asynchronous);
            ajax3.send();
            ajax3.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    var data = JSON.parse(this.responseText);
                    setTimeout(function () {

                        // var mobile_number = data[0].mobile_number;
                        var operator = data[0].operator;
                        var amount = data[0].amount;
                        var recharge_type = "";
                        if (data[0].recharge_type !== "") {
                            recharge_type = data[0].recharge_type;
                        }

                        console.log('Operator', operator);
                        console.log('Amount', amount);
                        console.log('Recharge Type', recharge_type);


                        $.ajax({
                            url: "<my-domain>/mydataremove.php",
                            type: "POST",
                            async: false,
                            success: function (data) {
                                console.log(data);

                                if (operator == "BSNL" || operator == "TATA DOCOMO") {
                                    if (recharge_type == "TOPUP") {
                                        document.getElementById("topupType").firstChild.firstChild.click();
                                    } else if (recharge_type == "SPECIAL") {
                                        document.getElementById("specialType").firstChild.firstChild.click();
                                    } else {
                                        document.getElementById("topupType").firstChild.firstChild.click();
                                    }
                                }
                                if (operator == "JIO") {
                                    document.getElementById("viewPlanTriggerId").click();
                                    setTimeout(function () {
                                        if (parseInt(amount) == 149 || amount == 149) {
                                            document.getElementsByClassName("a-button-input")[2].click();
                                        } else if (parseInt(amount) == 399 || amount == 399) {
                                            document.getElementsByClassName("a-button-input")[8].click();
                                        } else {
                                            document.getElementById("amountTextInputId").value = amount;
                                        }
                                    }, 1000);
                                }
                                else {
                                    document.getElementById("amountTextInputId").value = amount;
                                }
                            }
                        });
                    }, 2000);

                }
            }


        });


    }, 15000);
})


casper.wait(8000, function () {
    casper.capture('a15.png');
});


casper.then(function () {
    casper.wait(3000, function () {
        casper.waitForSelector("input#buyButtonNative", function () {
            this.evaluate(function () {
                document.getElementById("buyButtonNative").click();
            });
        }, 15000)
    })
});

// casper.then(function () {
casper.wait(5000, function () {
    casper.capture('a16.png');
});
// });


var flag = 0;

casper.then(function () {
    if (this.getTitle() == "Select a Payment Method - Amazon.in Checkout") {

        casper.waitForSelector('div.a-radio',
            function () {
                this.evaluate(function () {
                    document.getElementsByClassName("a-checkbox")[0].firstElementChild.firstElementChild.checked = true;
                    document.getElementsByName("ppw-widgetEvent:SetPaymentPlanSelectContinueEvent")[0].click();
                });
            }, 15000);
        casper.wait(3000, function () {
            casper.capture('final.png');
        });
    }

    else if (this.getTitle() == "Place Your Order - Amazon.in Checkout") {
        casper.waitForSelector('input.a-button-text.place-your-order-button',
            function () {
                this.evaluate(function () {
                    document.getElementsByName("placeYourOrder1")[0].click();
                });
            }, 15000);
        casper.wait(3000, function () {
            casper.capture('final.png');
        });
    } else if (this.getTitle() == "Thank You") {
        window.flag = 1;
        this.echo("Recharge done successfully");
        casper.wait(3000, function () {
            casper.capture('final.png');
        });

    } else {
        window.flag = 1;
        this.echo("Recharge failed");

    }
});

if (flag == 0) {
    casper.wait(7000, function () {
        casper.then(function () {
            if (this.getTitle() == "Place Your Order - Amazon.in Checkout") {

                casper.waitForSelector('input.a-button-text.place-your-order-button',
                    function () {
                        this.evaluate(function () {
                            document.getElementsByName("placeYourOrder1")[0].click();
                        });
                    }, 15000);
                this.echo('you have reached this block');
            } else {
                //do nothing 
                casper.thenEvaluate(function () {
                    document.getElementsByName("placeYourOrder1")[0].click();
                })
            }
        })

    })
}



casper.wait(60000, function () {
    casper.thenOpen("https://www.amazon.in/gp/payment/statement", function () {
        casper.page.injectJs('jquery.js');

        casper.waitForSelector('span.a-text-bold',
            function () {
                this.evaluate(function () {
                    var cashback = document.getElementsByClassName("a-text-bold")[1].innerText.trim().toString();
                    cashback = cashback.substr(2, cashback.length);
                    console.log(cashback);
                    $.ajax({
                        url: "<my-domain>/mycashback.php",
                        type: "POST",
                        async: false,
                        data: "cashback=" + cashback,
                        success: function (data) {
                            console.log('Cashback added to db', data);
                        }
                    });

                });
            }, 15000);
    });
});



casper.then(function () {
    casper.waitForSelector('a#nav-item-signout',
        function () {
            this.evaluate(function () {
                document.getElementById("nav-item-signout").click();
                console.log("Signed out successfully");
            })
        }, 15000);
    casper.wait(5000, function () {
        this.clearCache();
        this.clearMemoryCache();
        phantom.clearCookies();
    });

});


// casper.wait(10000, function () {
//     casper.capture('a17.png');
// });


casper.run(function () {
    this.echo('So the whole suite ended.');
    this.exit(); // <--- don't forget me!
});

