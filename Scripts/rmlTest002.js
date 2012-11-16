

     
var testData = [
    {
        "_id": {
            "$oid": "4e0520f853fc7203d03de207"
        },
        "Name": "Gionino's Pizzeria",
        "Tags": [
            " 4 22 ", " 10 16 ", " 8 20 ", " 9 23 ",
            " 11 23 "," 7 18 ", " 9 23 "
        ],
        "Location": [-81.1456936, 41.31070872],
        "Address": "11679 Hayden St",
        "City": "Hiram",
        "State": "OH",
        "PostalCode": "44234",
        "Category": "PIZZA",
        "Type": "Restaurant",
        "Phone": "(330) 569-3222",
        "Website": "http://www.gioninos.com/",
        "YPID": "681x220662242"
    }
];

function toRML(strange)
{
    if (!strange instanceof Array)
        return { result: "bad input" };

    var ret = [];

    var i = 0, j = 0;
    while (i < strange.length)
    {
        var obj = strange[i];
        
        var rml       = { 
            id        : obj._id["$oid"], 
            type      : obj.Type, 
            priority  : Math.random() 
        };

        ret[i] = rml; 

        try
        {
            rml.transform = { worldPos: obj.Location };

            rml.info      = { 
                title: obj.Name, 
                ypid: obj.YPID, 
                origin: obj.Website 
            };

            rml.info.address = {
                street      : obj.Address,
                city        : obj.City,
                state       : obj.State,
                postal_code : obj.PostalCode,
                phone       : obj.Phone
            }

            rml.business =  {
                hours       : obj.Tags // fix
            };

            RML.Add(rml);

            rml._local.image = icons["restaurant"];

            if (obj.Category)
            {
                var cat = obj.Category.toLowerCase();

                var minDist = 15;
                for (icon in icons)
                {
                    var t = cat.levenshtein(icon);
                    if (t < minDist)
                    {
                        minDist = t;
                        rml._local.image = icons[icon];
                    }
                }
            }
        }
        catch (err)
        {
            rml.error = err;
        }

        i++;
    }

    return ret;
}

function Test() 
{    
    // bbeckman: 6 Nov 12 -- attempting to add in test data
    RML.Add(toRML(testData));

    // append to div '#log' whatever server pushes.
    socket.onmessage = function(ev) {
    //break
        var received = JSON.parse(ev.data);

        RML.Receive(received);
        
        if (received.updated)
        {
            for (var i=0;i<received.updated.length;i++)
            {
                var obj = received.updated[i];
                RML.Add(obj);
                
                if (obj.info.category !== undefined)
                {
                    var category = obj.info.category.toLowerCase();
                    var image = "";
                    if (category.indexOf("pizza") !== -1)
                    {
                        image = icons["pizza"];
                    }
                    else if (category.indexOf("chinese") !== -1)
                    {
                        image = icons["chinese"];
                    }
                    else if (category.indexOf("burger") !== -1)
                    {
                        image = icons["burger"];
                    }
                    else
                    {
                        image = icons["restaurant"];
                    }
                }
                else
                {
                    image = icons["restaurant"];
                }
                
                obj._local.image = image;
            }
        }

        if (received.removed) for (i = 0; i < received.removed.length; i++) 
        {
            var obj = RML.byId[received.removed[i]];
            if (obj)
            {
                if (obj._local) 
                {
                    obj._local.animFadeOut = RML.GetTime(); // gets the object fading out nicely
                    obj._local.priority = -1;
                }
            }
        }
        //$('#pretty').append(prettyPrint(entity, {maxDepth: 8}));
    }

}
