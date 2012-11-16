var LATLNG = new Seadragon.Point(41, -81.5);//,47.6, -122.33);
var ZOOM = 10;  // in VE levels! their level 1 == our level 9
var TYPE = 'r'; // a=aerial, h=hybrid, r=road
var map;

// choose one of the below for mousewheel zoom
var SQRT_2 = Math.sqrt(2);          // really fast
var CBRT_2 = Math.pow(2, 1/3);      // medium speed
var QDRT_2 = Math.sqrt(SQRT_2);     // slower speed
var WHEEL_ZOOM_FACTOR = CBRT_2;

Seadragon.Config.alwaysBlend = true;
Seadragon.Config.immediateRender = true;
Seadragon.Config.minZoomDimension = 512;
Seadragon.Config.imageLoaderLimit = 24;     // 4 hostnames x 6
Seadragon.Config.zoomPerScroll = CBRT_2;

function init() 
{   map = new Seadragon.Viewer("container");
    map.addEventListener("open", onOpen);
    map.openTileSource(new Seadragon.VETileSource(TYPE));
}

function sendEdited()
{   var js = entityText.value;
    RML.SaveElement(js);
}

function onOpen(map)
{   // translate Mercator projection lat-lng to normalized coordinates.
    // done at VE level 0 (256x256 world), so the 2^level part has been
    // removed, and since we'd be dividing by 256, the 256 factor also
    // removed. equations from:
    // http://msdn.microsoft.com/en-us/library/bb259689.aspx

    var sinLat = Math.sin(LATLNG.x * Math.PI / 180),
        coord = new Seadragon.Point(
            ((LATLNG.y + 180) / 360),
            (0.5 - Math.log((1 + sinLat) / (1 - sinLat)) / (4 * Math.PI))),

    // translate the VE zoom level to exponential inverse width zoom,
    // which is what the Viewport class uses. this is just a reverse
    // log transform. also note that VE level 1 == our DZI level 9.

    zoom = Math.pow(2, ZOOM + 8) / map.elmt.clientWidth;
    
    map.viewport.panTo(coord, true);
    map.viewport.zoomTo(zoom, null, true);

    graphCanvas = new Canvas(globalCanvas);
    graphCanvas.AddEvents();

    poiBG = new Image();
    poiBG.src = "img/POIbg.png";

    poiFG = new Image();
    poiFG.src = "img/POIforeground.png";

    poiActive = new Image();
    poiActive.src = "img/POIactive.png";

    spinner = new Image();
    spinner.src = "img/spinner.png";

    ripple = new Image();
    ripple.src = "img/ripple.png";

    var makeImage = function(url)
    {   var img = new Image();
        img.src = url;
        return img;
    }

    icons =
    {   restaurant: makeImage("img/restaurant.png"),
        chinese   : makeImage("img/chinese.jpg"),
        chicken   : makeImage("img/chicken.jpg"),
        burger    : makeImage("img/burger.jpg"),
        deli      : makeImage("img/deli.jpg"),
        pizza     : makeImage("img/pizza.jpg"),
    };

    debugText = document.getElementById("debugText");
    entityText = document.getElementById("entityText");
    sendText = document.getElementById("sendText");

    writeKeyBox = document.getElementById("writeKey");
    autoMatch = document.getElementById("autoMatch");

    moveRadius = document.getElementById("moveRadius");
    moveEnergy = document.getElementById("moveEnergy");

    $('#sendEdited').click(sendEdited);
    
    RML.StartServices();
}

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

            RMLentitiesOnDisplay.push(rml);
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
