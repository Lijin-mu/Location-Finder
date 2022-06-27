let apiData = [];
let filtersArray = [];
let categoryContainer = document.querySelector(".data-categories");
let storeContainer = document.querySelector(".data-list");
let storeItem = document.querySelectorAll(".store");

//https://leafletjs.com/ https://leafletjs.com/examples/quick-start/

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
        if(marker){
            var map = L.map('map').setView([lat, long], 13);
        } else{
            var map = L.map('map').setView([lat, long], 4); 
        }
        L.marker([lat, long]).addTo(map);
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
            .setContent('<div class="data-list__item"><div class="store" id="' + marker[0].id + '"><div class="store-image"><img src="' + marker[0].company.image + '"></div><div class="store-details"><div class="store-details__name"><h3>' + marker[0].name + '</h3></div><div class="store-details__address"><p>' + marker[0].company.address + '</p></div></div></div><div class="clear"></div></div>')
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
    filterStoresWithSearch:function(){
        const inputValue = document.querySelector('search-input');
        $('.search-input').on('input',function(e){
            let inputValue = $(this).val();
            if(inputValue.length > 2){
                filteredStoresList = apiData.filter((a)=> a.category.toLowerCase().includes(inputValue) || a.name.toLowerCase().includes(inputValue) || a.company.address.toLowerCase().includes(inputValue));
                console.log(inputValue.length);
                console.log(filteredStoresList);
                $(".data-search-result").empty();
                for (let store of filteredStoresList) {
                    $(".data-search-result").append('<div class="data-search-result__item">' + store.name + '</div>');
                }
            } else{
                $(".data-search-result").empty();
            }
            
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
        this.filterStoresWithSearch();
    }
}

locationFinder.init();






