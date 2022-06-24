let apiData = [];
let filtersArray = [];
let categoryContainer = document.querySelector(".data-categories");

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
        fliters.forEach((item) => {
            let div = document.createElement('div');
            div.classList.add('data-categories__item');
            var attr = document.createAttribute('category');
            attr.value=item;
            div.innerHTML = item;
            div.setAttributeNode(attr);
            categoryContainer.appendChild(div);
        });
        filtersArray = [...fliters];
    },
    populateStores:function(){
        console.log("function to populate stores");
    },

    loadMap: function (lat, long) {

        var map = L.map('map').setView([lat, long], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap'
        }).addTo(map);

    },

    loadData:function(){
        locationFinder.loadMap(51.505, -0.09);
        locationFinder.populateFilter();
    },

    filterStores:function(){
        console.log("function to populate filtered stores");
    },
    loadStoreMap:function(){
        console.log("function to load map of clicked store");
    },

    init: async function(){
        await this.fetchData();
        this.loadData(apiData);
    }
}

locationFinder.init();






