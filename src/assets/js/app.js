let apiData = [];
let filtersArray = [];
let categoryContainer = document.querySelector(".data-categories");
let storeContainer = document.querySelector(".data-list");
let storeItem = document.querySelectorAll(".store");

//https://leafletjs.com/ https://leafletjs.com/examples/quick-start/ search refernce: https://www.storelocatorwidgets.com/demo
//search refernce: https://www.only.in/store-locator
// https://preview.codecanyon.net/item/agile-store-locator-google-maps-for-wordpress/full_screen_preview/16973546?_ga=2.213687831.2012922664.1656339398-211260921.1655994798

var locationFinder = {

    fetchData :async function(){
        const requestURL = 'database/api-data.json';
        const request = new Request(requestURL);
        const response = await fetch(request);
        apiData = await response.json();
    },

    populateFilter:function(){
        let fliters = new Set()
        for(let data of apiData){  
            fliters.add(data.category);
        }
        filtersArray = [...fliters];
        let select = document.createElement('select');
            select.classList.add('form-select');
            select[0] = new Option('categories');
            $('.data-categories').append(select);
            filtersArray.forEach((item, index) => {
            select[index + 1] = new Option(item);
        });
        
    },
    populateStores:function(list){
        storeContainer.innerHTML = '';
        for(let data of list){  
            $(".data-list").append('<div class="data-list__item"><div class="store" id="' + data.id + '"><div class="store-image"><img src="' + data.company.image + '"></div><div class="store-details"><div class="store-details__name"><h3>' + data.name + '</h3></div><div class="store-details__address"><p>' + data.company.address + '</p></div></div></div><div class="clear"></div></div>');
        }
    },

    loadMap: function (lat, long, list, marker) {
        $(".data-map").empty();
        $(".data-map").append('<div id="map"></div>');
        if(!lat && !long){

            var map = L.map('map').locate({setView: true, maxZoom: 8});
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '© OpenStreetMap'
            }).addTo(map);
            if (!navigator.geolocation){
                alert("<p>Sorry, your browser does not support Geolocation</p>");
                return;
            }
            var zoomLevel = 4,
            mapCenter = [38, -101];
        
        var options = {
            center: mapCenter,
            zoom: zoomLevel
        };
        var latlng1 = L.latLng(50.5, 30.5);
        var latlng2 = L.latLng(30.5, 24.5);

        var distance1 = L.latLng(50.5, 30.5).distanceTo(L.latLng(30.5, 24.5))/1000;
        console.log(distance1, "distance1");

            navigator.geolocation.getCurrentPosition(success, error);
            function success(position) {
                
                var currentPos = [position.coords.latitude,position.coords.longitude];

                map.setView(currentPos, zoomLevel);
        
                var myLocation = L.marker(currentPos)
                                    .addTo(map)
                                    .bindTooltip("you are here")
                                    .openTooltip();
                        
              
        
            };
        
            function error() {
                alert("Unable to retrieve your location");
            };


            let currentLocation = [];
            kmArray = [];
            let LocationArray = [];

            function onLocationFound(e) {
                currentlat = e.latlng.lat;
                currentLocationlng = e.latlng.lng;

                currentLocation = {currentlat,currentLocationlng}

                var distances = [];
                var nearestStore =[];
                var NearestFinal = [];

                for (let store of apiData) {
                    let lat = store.location.lat;
                    let long = store.location.long;
                    let storeId =store.id;


                    var distance = L.latLng(currentlat, currentLocationlng).distanceTo(L.latLng(lat, long))/1000;
                
                            distances.push(distance);
                            kmArray.push ({distance, storeId});
                            console.log(distance + "distance");
                  
                    LocationArray.push({lat, long});
                   
                }

                     distances.sort(function(a, b) {
                            return a - b;
                        });



                 nearestStore = kmArray.filter((a)=> a.distance == distances[0]);

                 NearestFinal = apiData.filter((a)=> a.id == nearestStore[0].storeId);
                 var nearestDistance = distances[0];
                 nearestDistance = nearestDistance.toFixed(2);

                 nearestStoreLat = NearestFinal[0].location.lat;
                 nearestStorelong = NearestFinal[0].location.long;

                 var latlng = L.latLng(nearestStoreLat, nearestStorelong);
                 L.marker([nearestStoreLat, nearestStorelong]).addTo(map);
                 var popup = L.popup()
                .setLatLng(latlng)
                .setContent('<div class="store-popup" id="' + NearestFinal[0].id + '"><div class="store-popup-image"><img src="' + NearestFinal[0].company.image + '"></div><div class="store-popup-details"><div class="store-popup-details__name"><h3>' + NearestFinal[0].name + '<span>' + nearestDistance + ' km </span></h3></div><div class="store-popup-details__address"><p>' + NearestFinal[0].company.address + '</p></div><div class="store-popup-details__phone"><a href="tel:' + NearestFinal[0].company.phone + '"><i class="fas fa-phone"></i><span>' + NearestFinal[0].company.phone + '</span></a></div><div class="store-popup-details__mail"><a href="mailto:' + NearestFinal[0].company.email + '"><i class="fas fa-envelope"></i><span>' + NearestFinal[0].company.email + '</span></a></div></div></div><div class="clear"></div>')
                .openOn(map);

                 var latlngs = [
                    [currentlat, currentLocationlng],
                    [nearestStoreLat, nearestStorelong]
                ];
                var polyline = L.polyline(latlngs, {color: 'red'}).addTo(map);
                // zoom the map to the polyline
                map.fitBounds(polyline.getBounds());
            }
            map.on('locationfound', onLocationFound);
           

        } else{
            if(marker){
                var map = L.map('map').setView([lat, long], 13);
            } else{
                var map = L.map('map').setView([lat, long], 4); 
            }
            L.marker([lat, long]).addTo(map);
        }
        if(list){
            for (let store of list) {
                L.marker([store.location.lat, store.location.long]).addTo(map);
            }
        }
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap'
        }).addTo(map);

        if(marker){
            var latlng = L.latLng(lat, long);
            var popup = L.popup()
            .setLatLng(latlng)
            .setContent('<div class="store-popup" id="' + marker[0].id + '"><div class="store-popup-image"><img src="' + marker[0].company.image + '"></div><div class="store-popup-details"><div class="store-popup-details__name"><h3>' + marker[0].name + '</h3></div><div class="store-popup-details__address"><p>' + marker[0].company.address + '</p></div><div class="store-popup-details__phone"><a href="tel:' + marker[0].company.phone + '"><i class="fas fa-phone"></i><span>' + marker[0].company.phone + '</span></a></div><div class="store-popup-details__mail"><a href="mailto:' + marker[0].company.email + '"><i class="fas fa-envelope"></i><span>' + marker[0].company.email + '</span></a></div></div></div><div class="clear"></div>')
            .openOn(map);
        } 
    },

    loadData:function(apiData){
        locationFinder.loadMap(apiData[0].location.lat, apiData[0].location.long, apiData);
        locationFinder.populateFilter();
        locationFinder.populateStores(apiData);
    },

    filterStoresWithCategory:function(){
        $('select').on('change', function (e) {
            let selectdValue = $(this).val();
            let filteredStoresList=[];
            if (selectdValue == 'categories') {
                filteredStoresList = apiData;
            } else {
                filteredStoresList = apiData.filter((a)=> a.category == selectdValue);
            }
            locationFinder.populateStores(filteredStoresList);
            locationFinder.loadMap(filteredStoresList[0].location.lat, filteredStoresList[0].location.long, filteredStoresList);
        });
    },
    filterStoresWithCurrentLocation:function(){
        $('.nearest-store-btn').on('click', function (e) {
            locationFinder.loadMap();
        });
    },
    filterStoreWithSearch:function(){
        $('.search-input').on('input',function(e){
            let inputValue = $(this).val().toLowerCase();
            if(inputValue.length > 0){
                $('.clear-btn').show();
            } else{
                $('.clear-btn').hide();
            }
            if(inputValue.length > 2){
                filteredStoresList = apiData.filter((a)=> a.category.toLowerCase().includes(inputValue) || a.name.toLowerCase().includes(inputValue) || a.company.address.toLowerCase().includes(inputValue));
                $(".data-search-result").empty();
                for (let store of filteredStoresList) {
                    $(".data-search-result").append('<div class="data-search-result__item" id="' + store.id + '"><div class="store-name">' + store.name + '<span class="store-category">' + store.category + '</span></div><div class="store-address">' + store.company.address + '</div></div>');
                }
            } else{
                $(".data-search-result").empty();
            }
        });
        $(document).on('click', ".data-search-result__item", function(){
            let storeId = this.id;
            let selectedStore = apiData.filter((a)=> a.id == storeId);
            locationFinder.loadMap(selectedStore[0].location.lat, selectedStore[0].location.long, null, selectedStore);
            $(".data-search-result").empty();
            $('.search-input').val('');
            $('.clear-btn').hide();
       });
       $(document).on('click', ".clear-btn", function(){
        $(".data-search-result").empty();
        $('.search-input').val('');
        $(this).hide();
       });

    },
    loadStoreMap:function(){
        $(document).on('click', ".store", function(){
            let storeId = this.id;
            let selectedStore = apiData.filter((a)=> a.id == storeId);
            locationFinder.loadMap(selectedStore[0].location.lat, selectedStore[0].location.long, null, selectedStore);
            
       });
    },

    init: async function(){
        await this.fetchData();
        this.loadData(apiData);
        this.loadStoreMap();
        this.filterStoresWithCategory();
        this.filterStoreWithSearch();
        this.filterStoresWithCurrentLocation();
    }
}

locationFinder.init();






