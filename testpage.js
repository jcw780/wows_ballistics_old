var opts = Object.defineProperty({}, 'passive', {
    get: function() {
    supportsPassive = true;
    }
});
let touchEvent = 'ontouchstart' in window ? 'touchstart' : 'click';
var computationMethod = 'FE';
var inputData = Object.seal({
    'mv'         : [  805,  805],
    'caliber'    : [ .102, .102],
    'krupp'      : [ 2300, 2300],
    'mass'       : [ 15.2, 15.2],
    'normal'     : [   10,   10],
    'cD'         : [.3536,.3536],
    'threshold'  : [   17,   17],
    'fusetime'   : [  .01,  .01],
    'ra0_'       : [45, 45],
    'ra1_'       : [60, 60],
    'HESAP'      : [0, 0],
    'shellType'  : ['AP', 'AP'],
    'angle'      : [0, 5, 10, 15, 20, 25, 30, 35],
    'armor'      : 70,
    'inclination': 0,
    'width'      : 18,
    'shipName'   : ['Vampire 0', 'Vampire 0']
});

var graphSettings = Object.seal({
    'minDist': '0',
    'maxDist': '',
    'tickDist': '1000',
    'rounding': '3',
    'enableFills': false,
    'shortNames': true,
});

var autoApply = [true, true];

function setComputation(value){computationMethod = value;}
function addFormChange(){
    function targetChange(){inputData[this.id] = parseFloat(this.value);}
    function angleChange(){
        var id = this.id.slice(-1);
        inputData['angle'][id] = parseFloat(this.value);
    }
    function shipChange(){
        var id = this.id.slice(-1);
        var dataType = this.id.slice(0, -1);
        inputData[dataType][id] = parseFloat(this.value);	
    }
    function shipNameChange(){
        var id = this.id.slice(-1);
        inputData['shipName'][id] = this.value;
    }
    function changeTimeStep(){shellInstance.setDtMin(parseFloat(this.value));}
    function changeMinLaunch(){shellInstance.setMin(parseFloat(this.value));}
    function changeMaxLaunch(){shellInstance.setMax(parseFloat(this.value));}
    function changeGraphSettings(){graphSettings[this.id] = this.value;}
    function changeGraphButtons(){graphSettings[this.id] = this.checked;}
    const forms = [
        [targetChange, 
            ['armor', 'inclination', 'width']
        ],
        [angleChange,
            [
                'angle0', 'angle1', 'angle2', 'angle3', 
                'angle4', 'angle5', 'angle6', 'angle7', 
            ]
        ],
        [shipChange,
            [
                'caliber0', 'caliber1',
                'mv0', 'mv1',
                'cD0', 'cD1',
                'mass0', 'mass1',
                'krupp0', 'krupp1',
                'fusetime0', 'fusetime1',
                'threshold0', 'threshold1',
                'normal0', 'normal1',
                'ra0_0', 'ra0_1',
                'ra1_0', 'ra1_1',
                'HESAP0', 'HESAP1',
            ]
        ],
        [shipNameChange, 
            ['shipName0', 'shipName1',]
        ],
        [changeGraphSettings,
            ['minDist','maxDist','tickDist','rounding']
        ],
        [changeTimeStep, 
            ['timeStep']
        ],
        [changeMinLaunch,
            ['minLaunch']
        ],
        [changeMaxLaunch,
            ['maxLaunch']
        ],
    ]
    forms.map(function(value){
        value[1].map(function(id){
            document.getElementById(id).addEventListener('change', value[0]);
        });
    });
    
    function autoApplyF(){autoApply[parseInt(this.id.slice(-1))] = this.checked;}
    function graphShips(){
        console.log(this);
        graphShip[this.id.slice(-1)] = this.checked;
    }

    const buttons = [
        [changeGraphButtons, 
            ['enableFills', 'shortNames']
        ], 
        [autoApplyF,
            ['autoApply0', 'autoApply1']
        ],
        [graphShips,
            ["graphShip0", "graphShip1"]
        ]
    ]
    buttons.map(function(value){
        value[1].map(function(id){
            document.getElementById(id).addEventListener(touchEvent, value[0], opts);
        });
    });
}

//Buttons 
//Add Hide buttons
addTitles();
document.getElementById("generate").addEventListener(touchEvent, collectMake, opts);

function changeChevron(e){
    e.stopPropagation();
    $(e.target).prev('button').find('span.fa').toggleClass('fa-chevron-up fa-chevron-down');
}

function addChevrons(){
    var collapseButtons = [
        'descriptions',
        'parameters',
        'settingsTab',
        'impactCharts',
        'angleCharts',
        'postPenCharts',
    ]
    var graphs = {
        'pC': 3,
        'CA': 2,
        'LA': 8,
    }
    for(const id of collapseButtons){
        $('#' + id).on('shown.bs.collapse hidden.bs.collapse', changeChevron);
    }
    
    for(const [id, num] of Object.entries(graphs)){
        for(var i=0; i<num; i++){
            $('#' + id + i).on('shown.bs.collapse hidden.bs.collapse', changeChevron);
        }
    }
}

addChevrons();
addFormChange();

function applyButton(){
    onSubmitPredefined((this.id).slice(-1)); 
}

for(let i=0; i<2; i++){
    document.getElementById('apply' + i).addEventListener(touchEvent, applyButton, opts);
}

async function firstRun(){
    shellInstance.setDtMin(.01);
    shellInstance.setMin(0.0);
    shellInstance.setMax(25.0);
    const data = {
        'mv'         : [  805,  805],
        'caliber'    : [ .102, .102],
        'krupp'      : [ 2300, 2300],
        'mass'       : [ 15.2, 15.2],
        'normal'     : [   10,   10],
        'cD'         : [.3536,.3536],
        'threshold'  : [   17,   17],
        'fusetime'   : [  .01,  .01],
        'ra0_'       : [45, 45],
        'ra1_'       : [60, 60],
        'HESAP'      : [0, 0],
        'shellType'  : ['AP', 'AP'],
        'angle'      : [0, 5, 10, 25, 20, 25, 30, 35],
        'armor'      : 70,
        'inclination': 0,
        'width'      : 18,
        'shipName'   : ['PUSD503_Vampire 0', 'PUSD503_Vampire 0']
    }
    makeGraphs(data);
}


$(document).ready(async function(){
    showCollapsibles();
    const versions = [0, 1];
    const tasks = versions.map(function(input){return generateVersion(input);})
    const results = await Promise.all(tasks);
})

var Module;
wasmFeatureDetect.simd().then(simdSupported => {
    if (simdSupported) {
        console.log('vectorized');
        ShellWasmV().then(function (M) {
            //console.log('Ready', M);
            Module = M;
            shellInstance = new Module.shell(2);
            firstRun();
        })
    } else {
        console.log('unvectorized');
        //var result = bowser.getParser(window.navigator.userAgent);
        /*if(result.parsedResult.browser.name == 'Chrome'){
            alert('Enable WebAssembly SIMD support in chrome://flags for increased performance.');
        }*/
        ShellWasm().then(function (M) {
            //console.log('Ready', M);
            Module = M;
            shellInstance = new Module.shell(2);
            firstRun();
        })
    }
});
//Buttons

async function showCollapsibles(){
    const targets = [
        'parametersToggle',
        'impactChartToggle',
        'angleChartToggle',
        'postPenChartToggle'
    ]
    for(const target of targets){
        $('#' + target).click();
    }
    const graphToggles = {
        'PCT': 3,
        'ACT': 2,
        'AT' : 8
    }
    for(const [k, v] of Object.entries(graphToggles)){
        for(let i = 0; i < v; i++){
            $('#' + k + i).click();
        }
    }
}

function addTitles(){
    const targets = {
        'caliberL' : 
            'Diameter of the shell in meters. All else equal, higher caliber increase shell flight time and reduces penetration.',
        'mvL': 
            'Shell velocity at launch in meters per second. All else equal, higher muzzle velocity reduces shell flight time and increase penetration.',
        'cDL': 
            "Aerodynamic drag characteristic of the shell's shape. All else equal, higher drag coefficient increase shell flight time and reduces penetration.",
        'massL': 
            "Mass of the shell in kilograms. All else equal, higher mass decreases shell flight time and increases penetration.",
        'kruppL': 
            "Penetration coefficient of the shell. All else equal, higher krupp increases penetration.",
        'fusetimeL': 
            "How many seconds it takes for the shell to detonate after fusing. Longer fusetime increases risk of overpenetration.",
        'thresholdL': 
            "How many milimeters of effective armor it takes for the shells arm. Higher fusing threshold increases the risk of overpenetration.",
        'ra0L':
            "Minimum impact angle in degrees at which shells can ricochet - not affected by normalization.",
        'ra1L':
            "Minimum impact angle in degrees at which shells always ricochet - not affected by normalization.",
        'HESAPL':
            "HE/SAP penetration of shell - if applicable.",
        'normalL':
            "How many degrees of impact angle the shell can reduce. Higher normalization increases decreases effective armor thickness."
    };
    for(const [key, value] of Object.entries(targets)){
        document.getElementById(key).title = value;
    }
}

var versionValue = [];
var nationValue = [];
var typeValue = [];
var shipValue = [];
var shellValue = [];
var typeData = [];
var shellType = [];
var initialized = false;
var compiled = false;
var dataURL = "static/data/"

function fetchJson(target, onSucess){
    fetch(target)
        .then((response) => {
            if (!response.ok) {
            throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(onSucess)
        .catch((error) => {
            console.error('There has been a problem with your fetch operation:', error);
        }
    );
}

function generateVersion(id){
    fetchJson(dataURL + "versions.json", function(data){
        var target = document.getElementById("version" + id);
        target.innerHTML = '';
        for(let i=data.length - 1; i>=0; i--){
            target.innerHTML += "<option value=" + data[i] + ">" + data[i] + "</option>"
        }
        onChangeVersion("version" + id);
    });
}
function onChangeVersion(versionID){
    var id = parseInt(versionID.slice(-1));
    versionValue[id] = document.getElementById(versionID).value;
    generateNation("nation" + id);
}

function generateNation(nationID){
    var id = parseInt(nationID.slice(-1));
    fetchJson(dataURL + versionValue[id] + "/nations.json", function (data) {
        var target = document.getElementById(nationID);
        target.innerHTML = '';
        for(let i=0; i<data.length; i++){
            target.innerHTML += "<option value=" + data[i] + ">" + data[i] + "</option>"
        }
        onChangeNation(nationID);
    });
}
function onChangeNation(nationID){
    var id = parseInt(nationID.slice(-1));
    nationValue[id] = document.getElementById(nationID).value;
    generateType('type' + id);
}

function generateType(typeID){
    var id = parseInt(typeID.slice(-1));
    fetchJson(dataURL + versionValue[id] + "/" + nationValue[id] + "/shiptypes.json",
    function (data) {
        var target = document.getElementById(typeID);
        target.innerHTML = '';
        for(let i=0; i<data.length; i++){
            target.innerHTML += "<option value=" + data[i] + ">" + data[i] + "</option>"
        }
        onChangeType(typeID);
    });
}
function onChangeType(typeID){
    var id = parseInt(typeID.slice(-1));
    typeValue[id] = document.getElementById(typeID).value;
    generateShip('ship' + id)
}

function generateShip(shipID){
    var id = parseInt(shipID.slice(-1));
    fetchJson(dataURL + versionValue[id] + "/" + nationValue[id] + "/" + nationValue[id] + "_" + typeValue[id] + ".json", 
    function (data) {
        typeData[id] = data;
        var target = document.getElementById(shipID);
        target.innerHTML = '';
        var sorted = []
        for(let ship in data){
            sorted.push(ship);
        }
        sorted.sort(function(a, b){return data[a]['Tier'] - data[b]['Tier']});
        for(let ship of sorted){
            target.innerHTML += "<option value=" + ship + ">" + "Tier " + data[ship]['Tier'] + " " + ship + "</option>"
        }
        onChangeShip(shipID);
    });
}
function onChangeShip(shipID){
    var id = parseInt(shipID.slice(-1));
    shipValue[id] = document.getElementById(shipID).value;
    generateShell('shell' + id);
}

function generateShell(shellID){
    var id = parseInt(shellID.slice(-1));
    var selector = document.getElementById(shellID);
    selector.innerHTML = '';
    for(let shell in typeData[id][shipValue[id]]){
        if(shell.includes('Artillery')){
            selector.innerHTML += "<option value=" + shell + ">" + shell + "</option>";
        }
    }
    onChangeShell(shellID);
}
function onChangeShell(shellID){
    var id = parseInt(shellID.slice(-1));
    shellValue[id] = document.getElementById(shellID).value;
    generateShellType("shellType" + id);
}

function generateShellType(shellTypeID){
    var id = parseInt(shellTypeID.slice(-1));
    var selector = document.getElementById(shellTypeID);
    selector.innerHTML = '';
    for(let shellType in typeData[id][shipValue[id]][shellValue[id]]){
        selector.innerHTML += "<option value=" + shellType + ">" + shellType + "</option>";
    }
    onChangeShellType(shellTypeID);
}

function onChangeShellType(shellTypeID){
    var id = parseInt(shellTypeID.slice(-1));
    shellType[id] = document.getElementById(shellTypeID).value;
    if(autoApply[id]){
        onSubmitPredefined(id);
    }
}

const changeEvent = new Event('change');

function changeFormValue(elementID, newValue){
    let element = document.getElementById(elementID);
    if(newValue != element.value){
        element.value = newValue;
        element.dispatchEvent(changeEvent);
    }
}

function onSubmitPredefined(id){
    var targetShell = typeData[id][shipValue[id]][shellValue[id]][shellType[id]];
    var shipName = shipValue[id];
    if(graphSettings.shortNames){
        shipName = shipName.split("_").slice(1).join("");
    }
    shipName += " " + shellValue[id].slice(-1);
    changeFormValue("shipName"  + id, shipName);
    changeFormValue("mv"        + id, targetShell["bulletSpeed"]);
    changeFormValue("caliber"   + id, targetShell["bulletDiametr"]);
    changeFormValue("krupp"     + id, targetShell["bulletKrupp"]);
    changeFormValue("mass"      + id, targetShell["bulletMass"]);
    changeFormValue("cD"        + id, targetShell["bulletAirDrag"]);
    changeFormValue("threshold" + id, targetShell["bulletDetonatorThreshold"]);
    changeFormValue("fusetime"  + id, targetShell["bulletDetonator"]);
    changeFormValue("ra0_"      + id, targetShell["bulletRicochetAt"]);
    changeFormValue("ra1_"      + id, targetShell["bulletAlwaysRicochetAt"]);
    changeFormValue("normal"    + id, targetShell['bulletCapNormalizeMaxAngle']);
    var HESAPv = 0;
    if(shellType[id] == 'AP'){
        HESAPv = 0;
    }else if(shellType[id] == 'HE'){
        HESAPv = targetShell["alphaPiercingHE"];
    }else if(shellType[id] == 'CS'){
        HESAPv = targetShell["alphaPiercingCS"];
    }
    changeFormValue("HESAP"     + id, HESAPv);
}
//Graphs
var v_angles = [];
var numAngles = 8;

function getFloatValues(elementId){return parseFloat(document.getElementById(elementId).value);}
function getIntValues(elementId){return parseInt(document.getElementById(elementId).value);}

var impactCharts = []
var angleCharts = []
var postCharts = []

function collectMake(){makeGraphs(inputData);}

var shellInstance;
var impactSize;
var postPenSize;
var v_angles;
var shipName;
var shipWidth = [];

var xAxesDistance;

function completed(){
    var graphId = this.chart.ctx.canvas.id;
    var url = document.getElementById(graphId).toDataURL("image/png");
    var target = document.getElementById(
        graphId.slice(0, -1) + 'Link' + graphId.slice(-1));
    target.href = url;
    target.download = this.chart.config.options.title.text + '.png';
}

const animationCommon = {onComplete: completed}

function addCommas(value, index, values) {return value.toLocaleString();}

var targetedArmor;
var targetInclination;

async function makeGraphs(data){
    var v_mv = data.mv;
    var v_caliber = data.caliber;
    var v_krupp = data.krupp;
    var v_mass = data.mass;
    var v_normal = data.normal;
    var v_cD = data.cD;
    var v_threshold = data.threshold;
    var v_fusetime = data.fusetime;
    var v_ra0 = data.ra0_;
    var v_ra1 = data.ra1_;
    var v_HESAP = data.HESAP;

    var v_armor       = data.armor;
    var v_inclination = data.inclination;
    var width         = data.width;
    v_angles      = data.angle;

    shipName = data.shipName;

    for(let k=0; k<2; k++){
        shellInstance.setValues(
            v_caliber[k], 
            v_mv[k], 
            v_cD[k], 
            v_mass[k], 
            v_krupp[k], 
            v_normal[k], 
            v_fusetime[k], 
            v_threshold[k], 
            v_ra0[k], 
            v_ra1[k],
            k
        )
    }
    
    switch(computationMethod){
        case 'AB5':
            shellInstance.calcImpactAdamsBashforth5();
        break;
        case 'RK2':
            shellInstance.calcImpactRungeKutta2();
        break;
        case 'RK4':
            shellInstance.calcImpactRungeKutta4();
        break;
        case 'FE':
            shellInstance.calcImpactForwardEuler();
        break;
    }
    
    shellInstance.calcAngles(v_armor, v_inclination);
    shellInstance.calcPostPen(v_armor, v_inclination, v_angles, true, true);

    //instance.printPostPen();
    //Values same for both shells
    impactSize = shellInstance.getImpactSize()
    postPenSize = shellInstance.getPostPenSize();
    
    var max = 0;
    if(shellInstance.getImpactPoint(impactSize - 1, Module.impactDataIndex.distance.value, 1) >
    shellInstance.getImpactPoint(impactSize - 1, Module.impactDataIndex.distance.value, 0)){
        max = 1;
    }
    
    shipWidth = [];
    for(let i=0; i<impactSize; i++){
        shipWidth.push({
            x: shellInstance.getImpactPoint(i, Module.impactDataIndex.distance.value, max),
            y: width
        })
    }

    //For downloading graphs			
    //https://github.com/chartjs/Chart.js/issues/2830
    //Chart.js defaults to transparent background - makes downloaded images look bad
    Chart.plugins.register({
        beforeDraw: function(chartInstance) {
            var ctx = chartInstance.chart.ctx;
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, chartInstance.chart.width, chartInstance.chart.height);
        }
    });

    xAxesDistance = [{
        scaleLabel: {
            display: true,
            labelString: "Distance from Launch (m)",
        },
        ticks:{callback: addCommas,}
    }];
    
    if(!(graphSettings['minDist'] === '')){
        xAxesDistance[0].ticks['min'] = parseFloat(graphSettings['minDist']);
    }
    if(!(graphSettings['maxDist'] === '')){
        xAxesDistance[0].ticks['max'] = parseFloat(graphSettings['maxDist']);
    }
    if(!(graphSettings['tickDist'] === '')){
        xAxesDistance[0].ticks['stepSize'] = parseFloat(graphSettings['tickDist']);
    }

    targetedArmor = 'Armor Thickness: ' + v_armor + 'mm';
    targetInclination = 'Vertical Inclination: ' + v_inclination + '°'; 
    
    makeImpactCharts();
    makeAngleCharts();
    makePostPenCharts();
}

async function generatePoint(ship, dType, index, angle){
    let output = []
    if(dType == 0){
        if(index != Module.impactDataIndex.impactAHD.value){
            for(let i=0; i<impactSize; i++){
                output.push(
                    {
                        x: shellInstance.getImpactPoint(i, Module.impactDataIndex.distance.value, ship),
                        y: shellInstance.getImpactPoint(i, index, ship),
                    }
                );
            }
        }else{
            for(let i=0; i<impactSize; i++){
                output.push(
                    {
                        x: shellInstance.getImpactPoint(i, Module.impactDataIndex.distance.value, ship),
                        y: shellInstance.getImpactPoint(i, index, ship) * -1,
                    }
                );
            }
        }
    }
    else if(dType == 1){
        for(let i=0; i<impactSize; i++){
            output.push(
                {
                    x: shellInstance.getImpactPoint(i, Module.impactDataIndex.distance.value, ship),
                    y: shellInstance.getAnglePoint(i, index, ship),
                }
            );
        }
    }else if(dType == 2){
        if(index != Module.postPenDataIndex.xwf.value){
            for(let i=0; i<impactSize; i++){
                if(shellInstance.getPostPenPoint(i, Module.postPenDataIndex.xwf.value, angle, ship) < 0){
                    output.push(
                        {
                            x: shellInstance.getImpactPoint(i, Module.impactDataIndex.distance.value, ship),
                            y: shellInstance.getPostPenPoint(i, index, angle, ship),
                        }
                    );
                }
            }
        }else{
            for(let i=0; i<impactSize; i++){
                var yValue = shellInstance.getPostPenPoint(i, index, angle, ship);
                if(yValue >= 0){
                    output.push(
                        {
                            x: shellInstance.getImpactPoint(i, Module.impactDataIndex.distance.value, ship),
                            y: yValue,
                        }
                    );
                }
            }
        }
    }else{
        console.log('Invalid Type');
    }
    return output;
}

function createUpdateChart(chartArray, index, target, config){
    if(chartArray[index]){
        chartArray[index].type = config.type;
        chartArray[index].data = config.data;
        chartArray[index].options = config.options;
        chartArray[index].update();
    }else{
        chartArray[index] = new Chart(
            document.getElementById(target), config);
    }
}	

function roundStringNumberWithoutTrailingZeroes (num, dp) {
    if (arguments.length != 2) throw new Error("2 arguments required");

    num = String(num);
    if (num.indexOf('e+') != -1) {
        // Can't round numbers this large because their string representation
        // contains an exponent, like 9.99e+37
        throw new Error("num too large");
    }
    if (num.indexOf('.') == -1) {
        // Nothing to do
        return num;
    }

    var parts = num.split('.'),
        beforePoint = parts[0],
        afterPoint = parts[1],
        shouldRoundUp = afterPoint[dp] >= 5,
        finalNumber;

    afterPoint = afterPoint.slice(0, dp);
    if (!shouldRoundUp) {
        finalNumber = beforePoint + '.' + afterPoint;
    } else if (/^9+$/.test(afterPoint)) {
        // If we need to round up a number like 1.9999, increment the integer
        // before the decimal point and discard the fractional part.
        finalNumber = Number(beforePoint)+1;
    } else {
        // Starting from the last digit, increment digits until we find one
        // that is not 9, then stop
        var i = dp-1;
        while (true) {
            if (afterPoint[i] == '9') {
                afterPoint = afterPoint.substr(0, i) +
                            '0' +
                            afterPoint.substr(i+1);
                i--;
            } else {
                afterPoint = afterPoint.substr(0, i) +
                            (Number(afterPoint[i]) + 1) +
                            afterPoint.substr(i+1);
                break;
            }
        }
        finalNumber = beforePoint + '.' + afterPoint;
    }
    // Remove trailing zeroes from fractional part before returning
    return finalNumber.replace(/0+$/, '')
}

function addTooltipCallbackImpact(config, ...labels){
    config.options['tooltips'] = {
        enabled: true,
        callbacks: {},
    };
    if(!(graphSettings['rounding'] === '' || graphSettings['rounding'] === '0')){
        var decimalPlaces = parseInt(graphSettings['rounding']);
        config.options.tooltips.callbacks = {
            label: function(tooltipItems, data) { 
                var x = roundStringNumberWithoutTrailingZeroes(
                    tooltipItems.label, decimalPlaces);
                var y = roundStringNumberWithoutTrailingZeroes(
                    tooltipItems.value, decimalPlaces);
                if(tooltipItems.datasetIndex % 2 == 0){
                    return labels[0](x, y);
                }else{
                    return labels[1](x, y);
                }
            }
        };
    }else{
        config.options.tooltips.callbacks = {
            label: function(tooltipItems, data) { 
                var x = tooltipItems.label;
                var y = tooltipItems.value;
                if(tooltipItems.datasetIndex % 2 == 0){
                    return labels[0](x, y);
                }else{
                    return labels[1](x, y);
                }
            }
        };
    }
}
function penetrationToolTipLabel(x, y){return '(' + x + 'm, ' + y + 'mm)';}
function angleTooltipLabel(x, y){return '(' + x + 'm, ' + y + '°)';}
function velocityTooltipLabel(x, y){return '(' + x + 'm, ' + y + 'm/s)';}
function timeTooltipLabel(x, y){return '(' + x + 'm, ' + y + 's)';}
function filterLegend(item, chart){return !(item.text == '_remove_');}

const commonPointRadius = 0;
var graphShip = [true, true];
var colors = [
    ["#3e95cd", "#FFA500", "#FFD700"],
    ["#008000", "#FF0000", "#FF0090"],
]

async function makeImpactCharts(){ //Set Impact
    const points = [
        [0, 0, Module.impactDataIndex.ePenHN.value   , 0],
        [0, 0, Module.impactDataIndex.impactAHD.value, 0],
        [1, 0, Module.impactDataIndex.ePenHN.value   , 0],
        [1, 0, Module.impactDataIndex.impactAHD.value, 0],

        [0, 0, Module.impactDataIndex.ePenDN.value   , 0],
        [0, 0, Module.impactDataIndex.impactADD.value, 0],
        [1, 0, Module.impactDataIndex.ePenDN.value   , 0],
        [1, 0, Module.impactDataIndex.impactADD.value, 0],

        [0, 0, Module.impactDataIndex.impactV.value  , 0],
        [0, 0, Module.impactDataIndex.tToTargetA.value, 0],
        [1, 0, Module.impactDataIndex.impactV.value  , 0],
        [1, 0, Module.impactDataIndex.tToTargetA.value, 0],
    ]

    const tasks = points.map(function(input){return generatePoint(input[0], input[1], input[2], input[3]);})
    const results = await Promise.all(tasks);
    //console.log(results)
    const yAxesPenetration = {
        id: "Penetration", postition: "left",
        scaleLabel: {display: true,},
        ticks: {
            stepSize: 100,
            callback: addCommas,
        }
    }

    const yAxesRightAngle = {
        id: "Angle", position: "right",
        scaleLabel: {display: true,},
    }

    var hRAL = yAxesRightAngle;
    hRAL.scaleLabel['labelString'] = "Belt Impact Angle (°)";
    var hRPL = yAxesPenetration;
    hRPL.scaleLabel['labelString'] = "Belt Penetration (mm)";

    const  EPL = "Effective Penetration ";
    const IAL = "Impact Angle ";
    var configPC0 = {
        type: 'scatter', data: {datasets: []},
        options: {
            title: {
                display: true,
                text: 'Horizontal Penetration and Impact Angle'
            },
            scales: {
                xAxes: xAxesDistance,
                yAxes: [hRPL , hRAL,],
            },
            animation: animationCommon,
        }
    }
    addTooltipCallbackImpact(configPC0, penetrationToolTipLabel, angleTooltipLabel);
    graphShip.map(function callback(currentValue, index){
        if(currentValue){
            configPC0.data.datasets.push(
                {
                    data: results[index* 2], showLine: true, 
                    label: EPL + shipName[index], 
                    yAxisID: "Penetration",
                    borderColor: colors[index][0], fill: false, pointRadius: commonPointRadius, pointHitRadius: 5
                },{
                    data: results[index * 2 + 1], showLine: true,
                    label: IAL + shipName[index], 
                    yAxisID: "Angle",
                    borderColor: colors[index][1], fill: false, pointRadius: commonPointRadius, pointHitRadius: 5
                },
            )
        }
    });
    createUpdateChart(impactCharts, 0, "penChart0", configPC0);

    var vRAL = yAxesRightAngle;
    vRAL.scaleLabel['labelString'] = "Deck Impact Angle (°)";
    var vRPL = yAxesPenetration;
    vRPL.scaleLabel['labelString'] = "Deck Penetration (mm)";
    
    const EDP = "Effective Deck Penetration ";
    const DIA = "Deck Impact Angle ";
    var configPC1 = {
        type: 'scatter', data: {datasets: []},
        options: {
            title: {
                display: true,
                text: 'Deck Penetration and Impact Angle'
            },
            scales: {
                xAxes: xAxesDistance,
                yAxes: [vRPL, vRAL,],
            },
            animation: animationCommon,
        }
    };
    addTooltipCallbackImpact(configPC1, penetrationToolTipLabel, angleTooltipLabel);
    graphShip.map(function callback(currentValue, index){
        if(currentValue){
            configPC1.data.datasets.push(
                {
                    data: results[index*2+4], showLine: true,
                    label: EDP + shipName[index],
                    yAxisID: "Penetration",
                    borderColor: colors[index][0], fill: false, pointRadius: commonPointRadius, pointHitRadius: 5
                },{
                    data: results[index*2+5], showLine: true,
                    label: DIA + shipName[index], 
                    yAxisID: "Angle",
                    borderColor: colors[index][1], fill: false, pointRadius: commonPointRadius, pointHitRadius: 5
                },
            )
        }
    });
    createUpdateChart(impactCharts, 1, "penChart1", configPC1);

    const IVL = "Impact Velocity ";
    const FTL = "Flight Time ";
    //impactCharts[2] = new Chart($("#penChart2"), 
    var configPC2 = {
        type: 'scatter', data: {datasets: []},
        options: {
            title: {
                display: true,
                text: 'Shell Flight Time and Impact Velocity'
            },
            scales: {
                xAxes: xAxesDistance,
                yAxes: [{
                    id: "Impact Velocity", postition: "left",
                    scaleLabel: {
                        display: true,
                        labelString: "Impact Velocity (m/s)",
                    },
                    ticks: {stepSize: 100}
                },{
                    id: "Time", position: "right",
                    scaleLabel: {
                        display: true,
                        labelString: "Flight Time (s)",
                    },
                }],
            },
            animation: animationCommon,
        }
    };
    addTooltipCallbackImpact(configPC2, velocityTooltipLabel, timeTooltipLabel);
    graphShip.map(function callback(currentValue, index){
        if(currentValue){
            configPC2.data.datasets.push(
                {
                    data: results[index*2+8], showLine: true,
                    label: IVL + shipName[index], 
                    yAxisID: "Impact Velocity",
                    borderColor: colors[index][0], fill: false, pointRadius: commonPointRadius, pointHitRadius: 5
                },{
                    data: results[index*2+9], showLine: true,
                    label: FTL + shipName[index], 
                    yAxisID: "Time",
                    borderColor: colors[index][1], fill: false, pointRadius: commonPointRadius, pointHitRadius: 5
                },
            );
        }
    });
    createUpdateChart(impactCharts, 2, "penChart2", configPC2);
}

function addTooltipCallbackAngles(config){
    config.options['tooltips'] = {
        enabled: true, callbacks: {}
    }
    if(!(graphSettings['rounding'] === '' || graphSettings['rounding'] === '0')){
        var decimalPlaces = parseInt(graphSettings['rounding']);
        config.options.tooltips.callbacks = {
            label: function(tooltipItems, data) { 
                return angleTooltipLabel(
                    roundStringNumberWithoutTrailingZeroes(tooltipItems.label, decimalPlaces), 
                    roundStringNumberWithoutTrailingZeroes(tooltipItems.value, decimalPlaces));
            }
        };
    }else{
        config.options.tooltips.callbacks = {
            label: function(tooltipItems, data) { 
                return angleTooltipLabel(tooltipItems.label, tooltipItems.value);
            }
        };
    }
}

function generateAngleFillArmor(ship){
    var fills = [[], [], []];
    for(let i=0; i<impactSize; i++){
        var armor = shellInstance.getAnglePoint(i, Module.angleDataIndex.armorD.value, ship);
        var ra0 = shellInstance.getAnglePoint(i, Module.angleDataIndex.ra0D.value, ship);
        var ra1 = shellInstance.getAnglePoint(i, Module.angleDataIndex.ra1D.value, ship);
        if(armor > ra1){
            fills[2].push({ //Armor - ra1
                x: shellInstance.getImpactPoint(i, Module.impactDataIndex.distance.value, ship),
                y: armor,
            });
        }
        var armorRa1 = armor < ra1 ? armor : ra1; 
        if(armorRa1 > ra0){
            fills[1].push({ //ArmorRa1 - Ra0
                x: shellInstance.getImpactPoint(i, Module.impactDataIndex.distance.value, ship),
                y: armorRa1,
            });
        }
        var armorRa0 = armor < ra0 ? armor : ra0;
        if(true){
            fills[0].push({ //ArmorRa0 - Bottom
                x: shellInstance.getImpactPoint(i, Module.impactDataIndex.distance.value, ship),
                y: armorRa0,
            });
        }
    }
    return fills;
}

function generateAngleFillFuse(ship){
    var fills = [[], [], []];
    for(let i=0; i<impactSize; i++){
        var fuse = shellInstance.getAnglePoint(i, Module.angleDataIndex.fuseD.value, ship);
        var ra0 = shellInstance.getAnglePoint(i, Module.angleDataIndex.ra0D.value, ship);
        var ra1 = shellInstance.getAnglePoint(i, Module.angleDataIndex.ra1D.value, ship);
        var fuseRa0 = fuse < ra0 ? ra0 : fuse;
        var fuseRa1 = fuse < ra1 ? ra1 : fuse;
        if(fuse < ra0){
            fills[0].push({
                x: shellInstance.getImpactPoint(i, Module.impactDataIndex.distance.value, ship),
                y: fuse
            });
        }
        if(fuseRa0 < ra1){
            fills[1].push({
                x: shellInstance.getImpactPoint(i, Module.impactDataIndex.distance.value, ship),
                y: fuseRa0
            });
        }
        fills[2].push({
            x: shellInstance.getImpactPoint(i, Module.impactDataIndex.distance.value, ship),
            y: fuseRa1
        });
    }
    return fills;
}

async function makeAngleCharts(){//Set Angle Charts
    const points = [
        [0, 1, Module.angleDataIndex.armorD.value, 0],
        [0, 1, Module.angleDataIndex.ra0D.value  , 0],
        [0, 1, Module.angleDataIndex.ra1D.value  , 0],

        [1, 1, Module.angleDataIndex.armorD.value, 0],
        [1, 1, Module.angleDataIndex.ra0D.value  , 0],
        [1, 1, Module.angleDataIndex.ra1D.value  , 0],

        [0, 1, Module.angleDataIndex.fuseD.value , 0],
        [1, 1, Module.angleDataIndex.fuseD.value , 0],
    ]

    const tasks = points.map(
        function(input){
            return generatePoint(input[0], input[1], input[2], input[3]);
        }
    )
    const results = await Promise.all(tasks);

    const armorL = "Maximum Perforation Angle ";
    const ra0L = "Start Ricochet "
    const ra1L = "Always Ricochet "
    //var FTL = " ";
    //angleCharts[0] = new Chart($("#angleChart0"), 
    var configAC0 = {
        type: 'scatter', data: {datasets: []},
        options: {
            title: {
                display: true,
                text: 'Maximum Angle for Perforation | ' + targetedArmor + ' | ' + targetInclination
            },
            scales: {
                xAxes: xAxesDistance,
                yAxes: [{
                    id: "angle", postition: "left",
                    scaleLabel: {
                        display: true,
                        labelString: "Lateral Angle (°)",
                    },
                    ticks:{min: 0}
                }]
            },
            legend: {labels: {filter: filterLegend},},
            animation: animationCommon,
        }
    };
    addTooltipCallbackAngles(configAC0);
    graphShip.map(function callback(currentValue, index){
        if(currentValue){
            configAC0.data.datasets.push({
                    data: results[index*3+0], showLine: true,
                    label: armorL + shipName[index], 
                    yAxisID: "angle", backgroundColor: Samples.utils.transparentize(colors[index][0]),
                    borderColor: colors[index][0], fill: false, pointRadius: commonPointRadius, pointHitRadius: 5
                },{
                    data: results[index*3+1], showLine: true, borderDash: [5, 5],
                    label: ra0L + shipName[index], 
                    yAxisID: "angle", backgroundColor: Samples.utils.transparentize(colors[index][1]),
                    borderColor: colors[index][1], fill: false, pointRadius: commonPointRadius, pointHitRadius: 5
                },{
                    data: results[index*3+2], showLine: true, borderDash: [5, 5],
                    label: ra1L + shipName[index], 
                    yAxisID: "angle", backgroundColor: Samples.utils.transparentize(colors[index][2]),
                    borderColor: colors[index][2], fill: false, pointRadius: commonPointRadius, pointHitRadius: 5
                },
            );
            if(graphSettings['enableFills']){
                var fills = generateAngleFillArmor(index);
                configAC0.data.datasets.push(
                    {
                        data: fills[2], showLine: true, borderWidth: 0,
                        label: '_remove_', 
                        yAxisID: "angle", backgroundColor: Samples.utils.transparentize(colors[index][0]),
                        borderColor: colors[index][0], fill: '-1', pointRadius: 0, pointHitRadius: 0
                    },{
                        data: fills[1], showLine: true, borderWidth: 0,
                        label: '_remove_', 
                        yAxisID: "angle", backgroundColor: Samples.utils.transparentize(colors[index][2]),
                        borderColor: colors[index][2], fill: '-3', pointRadius: 0, pointHitRadius: 0
                    },{
                        data: fills[0], showLine: true, borderWidth: 0,
                        label: '_remove_', 
                        yAxisID: "angle", backgroundColor: Samples.utils.transparentize(colors[index][1]),
                        borderColor: colors[index][1], fill: true, pointRadius: 0, pointHitRadius: 0
                    },
                );
            }
        }
    });
    createUpdateChart(angleCharts, 0, "angleChart0", configAC0);
    const fuseL = "Minimum Fusing Angle ";
    var configAC1 = {
        type: 'scatter', data: {datasets: []},
        options: {
            title: {
                display: true,
                text: 'Minimum Fusing Angle | ' + targetedArmor + ' | ' + targetInclination
            },
            scales: {
                xAxes: xAxesDistance,
                yAxes: [{
                    id: "angle", postition: "left",
                    scaleLabel: {
                        display: true,
                        labelString: "Lateral Angle (°)",
                    },
                    ticks:{min: 0}
                }],
            },
            legend: {labels: {filter: filterLegend},},
            animation: animationCommon,
        }
    };
    addTooltipCallbackAngles(configAC1);
    graphShip.map(function callback(currentValue, index){
        if(currentValue){
            configAC1.data.datasets.push(
                {
                    data: results[index+6], showLine: true,
                    label: fuseL + shipName[index], 
                    yAxisID: "angle", backgroundColor: Samples.utils.transparentize(colors[index][0]),
                    borderColor: colors[index][0], fill: false, pointRadius: commonPointRadius, pointHitRadius: 5
                },{
                    data: results[index*3+1], showLine: true, borderDash: [5, 5],
                    label: ra0L + shipName[index], 
                    yAxisID: "angle", backgroundColor: Samples.utils.transparentize(colors[index][1]),
                    borderColor: colors[index][1], fill: false, pointRadius: commonPointRadius, pointHitRadius: 5
                },{
                    data: results[index*3+2], showLine: true, borderDash: [5, 5],
                    label: ra1L + shipName[index], 
                    yAxisID: "angle", backgroundColor: Samples.utils.transparentize(colors[index][2]),
                    borderColor: colors[index][2], fill: false, pointRadius: commonPointRadius, pointHitRadius: 5
                },
            );
            if(graphSettings.enableFills){
                var fills = generateAngleFillFuse(index);
                configAC1.data.datasets.push(
                    {
                        data: fills[0], showLine: true, borderWidth: 0,
                        label: '_remove_', 
                        yAxisID: "angle", backgroundColor: Samples.utils.transparentize(colors[index][2]),
                        borderColor: colors[index][2], fill: '-2', pointRadius: 0, pointHitRadius: 0
                    },{
                        data: fills[1], showLine: true, borderWidth: 0,
                        label: '_remove_', 
                        yAxisID: "angle", backgroundColor: Samples.utils.transparentize(colors[index][1]),
                        borderColor: colors[index][1], fill: '-2', pointRadius: 0, pointHitRadius: 0
                    },{
                        data: fills[2], showLine: true, borderWidth: 0,
                        label: '_remove_', 
                        yAxisID: "angle", backgroundColor: Samples.utils.transparentize(colors[index][0]),
                        borderColor: colors[index][0], fill: 'end', pointRadius: 0, pointHitRadius: 0
                    },
                );
            }
        }
    });
    createUpdateChart(angleCharts, 1, "angleChart1", configAC1);
}

function addTooltipCallbackPostPen(config){
    config.options['tooltips'] = {enabled: true, callbacks: {}}
    if(!(graphSettings['rounding'] === '' || graphSettings['rounding'] === '0')){
        var decimalPlaces = parseInt(graphSettings['rounding']);
        config.options.tooltips.callbacks = {
            label: function(tooltipItems, data) { 
                return postPenToolTipLabels(
                    roundStringNumberWithoutTrailingZeroes(tooltipItems.label, decimalPlaces), 
                    roundStringNumberWithoutTrailingZeroes(tooltipItems.value, decimalPlaces));
            }
        };
    }else{
        config.options.tooltips.callbacks = {
            label: function(tooltipItems, data) { 
                return postPenToolTipLabels(tooltipItems.label, tooltipItems.value);
            }
        };
    }
}
function postPenToolTipLabels(x, y){
    return '(' + x + ' m, ' + y + ' m)';
}
async function makePostPenCharts(){ //Set PostPen
    const width = document.getElementById('width').value;
    const WFL = "Fused ", NFL = "No Fusing ";
    var configs = [];
    for(let i=0; i<numAngles; i++){
        var str = "Lateral Angle " + i + ": " + v_angles[i] + '°';
        document.getElementById("AT" + i).textContent = str;

        const points = [
            [0, 2, Module.postPenDataIndex.xwf.value, i],
            [0, 2, Module.postPenDataIndex.x.value  , i],
            [1, 2, Module.postPenDataIndex.xwf.value, i],
            [1, 2, Module.postPenDataIndex.x.value  , i],
        ]

        const tasks = points.map(
            function(input){return generatePoint(input[0], input[1], input[2], input[3]);}
        )
        const results = await Promise.all(tasks);

        configs[i] = {
            type: 'scatter',
            data: {
                datasets: [{
                        data: shipWidth, showLine: true, borderDash: [5, 5],
                        label: "Ship Width (m)", //backgroundColor: Samples.utils.transparentize("#505050"),
                        borderColor: "#505050", fill: false, pointRadius: commonPointRadius, pointHitRadius: 5
                }]
            },
            options: {
                title: {
                    display: true,
                    text: 'Internal Width Traveled before Detonation | ' + targetedArmor + ' | ' + targetInclination + ' | Horizontal Impact Angle: ' + v_angles[i] + "°"
                },
                scales: {
                    xAxes: xAxesDistance,
                    yAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: "Shell Detonation Distance (m)",
                        },
                    }],
                },
                animation: animationCommon,
            }
        };
        addTooltipCallbackPostPen(configs[i]);
        graphShip.map(function callback(currentValue, index){
            if(currentValue){
                var fill = graphSettings.enableFills;
                configs[i].data.datasets.push(
                    {
                        data: results[2*index+0], showLine: true,
                        label: WFL + shipName[index], backgroundColor: Samples.utils.transparentize(colors[index][0]),
                        borderColor: colors[index][0], fill: fill, pointRadius: commonPointRadius, pointHitRadius: 5
                    },{
                        data: results[2*index+1], showLine: true,
                        label: NFL + shipName[index], backgroundColor: Samples.utils.transparentize(colors[index][1]),
                        borderColor: colors[index][1], fill: fill, pointRadius: commonPointRadius, pointHitRadius: 5
                    },
                );
            }
        });
        createUpdateChart(postCharts, i, "postPen" + i, configs[i]);
    }
}