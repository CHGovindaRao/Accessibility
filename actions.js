var actions = {
    "CME" : [
                "set field #username to testaccount8-bsmo@bsl.nl",
                "set field #password to testaccount8-bsmo",
                "click element input[name='submit']",
                "wait for url to be https://www.springermedizin.de/myprofile-dashboard",
                "navigate to https://www.springermedizin.de/cme/6625940"
            
            ]

};

module.exports = actions;
