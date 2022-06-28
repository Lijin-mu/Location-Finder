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
            let currentLocation = [];
            kmArray = [];
            let clat, clog;
            function onLocationFound(e) {
                currentLocation.lat = e.latlng.lat;
                currentLocation.long = e.latlng.lng;
                clat= e.latlng.lat;
                clog= e.latlng.lng;
                console.log(clat, 2);
                let min = 10000;
                let finalplace = '';
                for (let store of apiData) {
                    let lat = store.location.lat;
                    let long = store.location.long;
                  
                    let diff = difference(clog, store.location.long);
                    if(diff < min){
                        min = diff;
                        finalLat = store.id;
                    }
                    LocationArray.push({lat, long});
                    console.log(finalLat);
                    // R = 6371 
                    // x = (long - clog) * Math.cos( 0.5*(lat+clat) )
                    // y = lat - clat
                    // d = R * Math.sqrt( x*x + y*y );
                    // if(d<min){
                    //     min = d;
                    //     finalplace = store.company.address;
                    //     finalId = store.id;
                    // }
                    
                    // let addr = store.company.address;
                    // let distData = {addr, d};
                    // kmArray.push(distData);

                   
                }
                // console.log(kmArray);
                // console.log(finalplace, finalId);
                nearestStore = apiData.filter((a)=> a.id == finalLat);
                console.log(nearestStore);
                L.marker([nearestStore[0].location.lat, nearestStore[0].location.long]).addTo(map);
                var latlng = L.latLng(nearestStore[0].location.lat, nearestStore[0].location.long);
                var popup = L.popup()
                .setLatLng(latlng)
                .setContent('<div class="store-popup" id="' + nearestStore[0].id + '"><div class="store-popup-image"><img src="' + nearestStore[0].company.image + '"></div><div class="store-popup-details"><div class="store-popup-details__name"><h3>' + nearestStore[0].name + '</h3></div><div class="store-popup-details__address"><p>' + nearestStore[0].company.address + '</p></div></div></div><div class="clear"></div>')
                .openOn(map);
            }
            map.on('locationfound', onLocationFound);
            let LocationArray = [];
            function difference(a, b) {
                return Math.abs(a - b);
              }

           
            console.log(currentLocation);
            console.log(LocationArray);
            LocationArray.sort();
            console.log(LocationArray);
           

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
            .setContent('<div class="store-popup" id="' + marker[0].id + '"><div class="store-popup-image"><img src="' + marker[0].company.image + '"></div><div class="store-popup-details"><div class="store-popup-details__name"><h3>' + marker[0].name + '</h3></div><div class="store-popup-details__address"><p>' + marker[0].company.address + '</p></div></div></div><div class="clear"></div>')
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
            // $(".data-map").empty();
            // $(".data-map").append('<div id="map"></div>');
            // var map = L.map('map').locate({setView: true, maxZoom: 16});
            // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            //     maxZoom: 19,
            //     attribution: '© OpenStreetMap'
            // }).addTo(map);
            // function onLocationFound(e) {
            //     console.log(e.latlng);
            //     console.log(e.latlng.lat, e.latlng.lng);
            //     locationFinder.loadMap(e.latlng.lat, e.latlng.lng);
            // }
            
            // map.on('locationfound', onLocationFound);
            // console.log(map);
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






